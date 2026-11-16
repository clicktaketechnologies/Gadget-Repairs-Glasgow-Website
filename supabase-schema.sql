-- Supabase SQL: Create the bookings table for Gadget Repairs Glasgow
-- Run this in the Supabase SQL Editor:
--   https://supabase.com/dashboard/project/xovzzstcuonrrvklwlpy/sql/new

CREATE TABLE IF NOT EXISTS public.bookings (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  ticketId        TEXT UNIQUE NOT NULL,
  customerName    TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT NOT NULL,
  deviceType      TEXT NOT NULL,
  deviceModel     TEXT NOT NULL,
  issue           TEXT NOT NULL,
  needsCollection BOOLEAN DEFAULT FALSE,
  collectionAddr  TEXT,
  status          TEXT DEFAULT 'Pending',
  technicianNotes TEXT,
  quotedPrice     TEXT,
  finalPrice      TEXT,
  source          TEXT DEFAULT 'online',
  bookingDate     TEXT,
  bookingTime     TEXT,
  createdAt       TIMESTAMPTZ DEFAULT NOW(),
  updatedAt       TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous INSERT (customers can submit bookings from the website)
CREATE POLICY "Anyone can insert bookings"
  ON public.bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anonymous SELECT (admin panel needs to read all bookings)
CREATE POLICY "Anyone can read bookings"
  ON public.bookings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anonymous UPDATE (admin updates status, notes, prices)
CREATE POLICY "Anyone can update bookings"
  ON public.bookings FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anonymous DELETE (admin can delete bookings)
CREATE POLICY "Anyone can delete bookings"
  ON public.bookings FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create an index on ticketId for fast lookups (Track Repair page)
CREATE INDEX IF NOT EXISTS idx_bookings_ticketId ON public.bookings(ticketId);

-- Create an index on createdAt for sorting (admin panel)
CREATE INDEX IF NOT EXISTS idx_bookings_createdAt ON public.bookings(createdAt DESC);
