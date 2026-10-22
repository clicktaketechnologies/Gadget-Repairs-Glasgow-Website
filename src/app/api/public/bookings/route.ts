import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";
import { ticketId } from "@/lib/utils2";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const required = ["customerName", "email", "phone", "deviceType", "deviceModel", "issue"];
  for (const f of required) {
    if (!data[f]) return setCorsHeaders(NextResponse.json({ error: `Missing field: ${f}` }, { status: 400 }), getOrigin(req));
  }
  let tid = ticketId();
  let tries = 0;
  while (await db.booking.findUnique({ where: { ticketId: tid } }) && tries < 10) { tid = ticketId(); tries++; }
  const booking = await db.booking.create({
    data: {
      ticketId: tid,
      customerName: String(data.customerName).slice(0, 120),
      email: String(data.email).slice(0, 160),
      phone: String(data.phone).slice(0, 40),
      deviceType: String(data.deviceType).slice(0, 40),
      deviceModel: String(data.deviceModel).slice(0, 120),
      issue: String(data.issue).slice(0, 1000),
      needsCollection: !!data.needsCollection,
      collectionAddr: data.collectionAddr ? String(data.collectionAddr).slice(0, 300) : null,
      source: "online",
      bookingDate: data.bookingDate || new Date().toISOString().split("T")[0],
      bookingTime: data.bookingTime || "10:30",
    },
  });
  return setCorsHeaders(NextResponse.json({ booking, message: `Booking received! Your ticket ID is ${tid}` }), getOrigin(req));
}
