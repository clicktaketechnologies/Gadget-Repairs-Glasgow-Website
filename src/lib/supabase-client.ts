// Supabase client for browser-side database access.
// Uses the public anon key (safe to embed in client-side JS).
// All devices read/write the same Supabase PostgreSQL database → same data everywhere.

const SUPABASE_URL = "https://xovzzstcuonrrvklwlpy.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export interface SupabaseBooking {
  id?: string;
  ticketId: string;
  customerName: string;
  email: string;
  phone: string;
  deviceType: string;
  deviceModel: string;
  issue: string;
  needsCollection: boolean;
  collectionAddr: string | null;
  status: string;
  technicianNotes: string | null;
  quotedPrice: string | null;
  finalPrice: string | null;
  source: string;
  bookingDate: string | null;
  bookingTime: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Check if Supabase is configured (anon key is set).
 */
export function isSupabaseConfigured(): boolean {
  return !!SUPABASE_ANON_KEY;
}

/**
 * Get the Supabase REST API base URL.
 */
export function supabaseUrl(): string {
  return SUPABASE_URL;
}

/**
 * Get the anon key (for debugging only).
 */
export function supabaseKey(): string {
  return SUPABASE_ANON_KEY;
}

/**
 * Insert a booking into Supabase via the REST API.
 * Returns the inserted booking or throws on error.
 */
export async function supabaseInsertBooking(
  booking: Omit<SupabaseBooking, "id" | "createdAt" | "updatedAt">
): Promise<SupabaseBooking | null> {
  if (!SUPABASE_ANON_KEY) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(booking),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data[0] : data;
  } catch {
    return null;
  }
}

/**
 * Fetch all bookings from Supabase via the REST API.
 * Ordered by createdAt descending.
 */
export async function supabaseFetchBookings(): Promise<SupabaseBooking[]> {
  if (!SUPABASE_ANON_KEY) return [];
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/bookings?order=createdAt.desc&limit=200`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/**
 * Update a booking in Supabase by ID.
 */
export async function supabaseUpdateBooking(
  id: string,
  updates: Partial<SupabaseBooking>
): Promise<boolean> {
  if (!SUPABASE_ANON_KEY) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ ...updates, updatedAt: new Date().toISOString() }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Delete a booking from Supabase by ID.
 */
export async function supabaseDeleteBooking(id: string): Promise<boolean> {
  if (!SUPABASE_ANON_KEY) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Fetch a single booking by ticket ID (for the Track Repair page).
 */
export async function supabaseFetchByTicket(
  ticketId: string
): Promise<SupabaseBooking | null> {
  if (!SUPABASE_ANON_KEY) return null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/bookings?ticketId=eq.${encodeURIComponent(
        ticketId.toUpperCase()
      )}&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch {
    return null;
  }
}
