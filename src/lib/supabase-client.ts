// Supabase client for browser-side database access.
// Uses the public publishable key (safe to embed in client-side JS).
// All devices read/write the same Supabase PostgreSQL database → same data everywhere.
//
// NOTE: The Supabase table uses lowercase column names (PostgreSQL default).
// This module converts between camelCase (TypeScript) and lowercase (Supabase).

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

// Convert camelCase to lowercase (for Supabase columns)
function toSupa(obj: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k.toLowerCase()] = v;
  }
  return out;
}

// Convert lowercase Supabase row to camelCase
function fromSupa(row: Record<string, any>): SupabaseBooking {
  return {
    id: row.id,
    ticketId: row.ticketid || row.ticketId || "",
    customerName: row.customername || row.customerName || "",
    email: row.email || "",
    phone: row.phone || "",
    deviceType: row.devicetype || row.deviceType || "",
    deviceModel: row.devicemodel || row.deviceModel || "",
    issue: row.issue || "",
    needsCollection: row.needscollection ?? row.needsCollection ?? false,
    collectionAddr: row.collectionaddr ?? row.collectionAddr ?? null,
    status: row.status || "Pending",
    technicianNotes: row.techniciannotes ?? row.technicianNotes ?? null,
    quotedPrice: row.quotedprice ?? row.quotedPrice ?? null,
    finalPrice: row.finalprice ?? row.finalPrice ?? null,
    source: row.source || "online",
    bookingDate: row.bookingdate ?? row.bookingDate ?? null,
    bookingTime: row.bookingtime ?? row.bookingTime ?? null,
    createdAt: row.createdat || row.createdAt,
    updatedAt: row.updatedat || row.updatedAt,
  };
}

export function isSupabaseConfigured(): boolean {
  return !!SUPABASE_ANON_KEY;
}

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
      body: JSON.stringify(toSupa(booking)),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const row = Array.isArray(data) ? data[0] : data;
    return fromSupa(row);
  } catch {
    return null;
  }
}

export async function supabaseFetchBookings(): Promise<SupabaseBooking[]> {
  if (!SUPABASE_ANON_KEY) return [];
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/bookings?order=createdat.desc&limit=200`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.map(fromSupa) : [];
  } catch {
    return [];
  }
}

export async function supabaseUpdateBooking(
  id: string,
  updates: Partial<SupabaseBooking>
): Promise<boolean> {
  if (!SUPABASE_ANON_KEY) return false;
  try {
    const body = { ...toSupa(updates), updatedat: new Date().toISOString() };
    const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function supabaseDeleteBooking(id: string): Promise<boolean> {
  if (!SUPABASE_ANON_KEY) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings?id=eq.${encodeURIComponent(id)}`, {
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

export async function supabaseFetchByTicket(
  ticketId: string
): Promise<SupabaseBooking | null> {
  if (!SUPABASE_ANON_KEY) return null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/bookings?ticketid=eq.${encodeURIComponent(
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
    return Array.isArray(data) && data.length > 0 ? fromSupa(data[0]) : null;
  } catch {
    return null;
  }
}
