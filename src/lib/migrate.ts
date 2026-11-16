// localStorage migration utility.
// Ensures all devices show the same data by clearing old stale demo/fallback
// data that may have been persisted in earlier versions of the app.
//
// Each time DATA_VERSION changes, the migration runs once per device and
// cleans up old data. This guarantees that when the latest code is deployed,
// every device clears its stale cache on the next page load.

export const DATA_VERSION = "2026-11-15-v3";
const VERSION_KEY = "grg-data-version";

// IDs of old demo/fallback bookings that should never appear as real data.
// These were hardcoded in FALLBACK_BOOKINGS and may have been accidentally
// saved to localStorage by earlier versions of the app.
const DEMO_BOOKING_IDS = new Set(["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8"]);

// Old demo ticket IDs that match the fallback pattern (GD-1024..GD-1028).
const DEMO_TICKET_PREFIXES = ["GD-1024", "GD-1025", "GD-1026", "GD-1027", "GD-1028"];

function isDemoBooking(b: any): boolean {
  if (!b || typeof b !== "object") return true;
  if (DEMO_BOOKING_IDS.has(b.id)) return true;
  if (typeof b.ticketId === "string" && DEMO_TICKET_PREFIXES.includes(b.ticketId)) return true;
  // Also filter out any booking whose id is a single letter + number (b1, c1, etc.)
  if (typeof b.id === "string" && /^[a-z]\d$/.test(b.id)) return true;
  return false;
}

function migrateBookingsKey(key: string): boolean {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return false;
    const filtered = arr.filter((b: any) => !isDemoBooking(b));
    if (filtered.length !== arr.length) {
      localStorage.setItem(key, JSON.stringify(filtered));
      return true;
    }
  } catch {}
  return false;
}

function migrateReviewsKey(key: string): boolean {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return false;
    // Filter out old demo reviews (IDs r1-r5 pattern)
    const filtered = arr.filter((r: any) => {
      if (!r || typeof r !== "object") return false;
      if (typeof r.id === "string" && /^[a-z]\d$/.test(r.id)) return false;
      return true;
    });
    if (filtered.length !== arr.length) {
      localStorage.setItem(key, JSON.stringify(filtered));
      return true;
    }
  } catch {}
  return false;
}

/**
 * Run the data migration. Safe to call on every page load — it only does
 * work when the stored DATA_VERSION doesn't match the current one.
 *
 * Returns a summary of what was cleaned up (for debugging/logging).
 */
export function migrateData(): { migrated: boolean; details: string[] } {
  if (typeof window === "undefined") return { migrated: false, details: [] };

  const details: string[] = [];
  const storedVersion = localStorage.getItem(VERSION_KEY);

  // If the version matches, we've already migrated — skip.
  if (storedVersion === DATA_VERSION) {
    return { migrated: false, details: [] };
  }

  // --- Clean up old stale demo bookings ---
  if (migrateBookingsKey("grg-admin-bookings")) {
    details.push("Cleared demo bookings from grg-admin-bookings");
  }
  // Don't clear public bookings — those are real customer submissions.
  // But DO filter out any demo data that might have leaked in.
  if (migrateBookingsKey("grg-public-bookings")) {
    details.push("Cleared demo bookings from grg-public-bookings");
  }
  if (migrateBookingsKey("grg-admin-bookings-trash")) {
    details.push("Cleared demo bookings from trash");
  }

  // --- Clean up old demo reviews ---
  if (migrateReviewsKey("grg-public-reviews")) {
    details.push("Cleared demo reviews from grg-public-reviews");
  }
  if (migrateReviewsKey("grg-admin-reviews")) {
    details.push("Cleared demo reviews from grg-admin-reviews");
  }

  // --- Stamp the new version so this only runs once ---
  localStorage.setItem(VERSION_KEY, DATA_VERSION);

  return { migrated: true, details };
}
