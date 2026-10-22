import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";
import { requireAdmin } from "@/lib/auth";
import { ticketId } from "@/lib/utils2";

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const data = await req.json();
  let tid = ticketId();
  while (await db.booking.findUnique({ where: { ticketId: tid } })) tid = ticketId();
  const booking = await db.booking.create({
    data: {
      ticketId: tid,
      customerName: String(data.customerName || "Walk-in customer").slice(0, 120),
      email: String(data.email || "walkin@shop.local").slice(0, 160),
      phone: String(data.phone || "").slice(0, 40),
      deviceType: String(data.deviceType || "Phone").slice(0, 40),
      deviceModel: String(data.deviceModel || "").slice(0, 120),
      issue: String(data.issue || "").slice(0, 1000),
      needsCollection: false,
      status: data.status || "In Progress",
      technicianNotes: data.technicianNotes || null,
      quotedPrice: data.quotedPrice || null,
      source: "walk-in",
      bookingDate: new Date().toISOString().split("T")[0],
      bookingTime: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    },
  });
  return setCorsHeaders(NextResponse.json({ booking, message: `Walk-in booking created — ticket ${tid}` }), getOrigin(req));
}
