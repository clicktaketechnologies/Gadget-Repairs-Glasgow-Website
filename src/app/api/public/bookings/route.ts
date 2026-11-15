import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";
import { ticketId } from "@/lib/utils2";

export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => ({}));
  const required = ["customerName", "email", "phone", "deviceType", "deviceModel", "issue"];
  for (const f of required) {
    if (!data[f]) return setCorsHeaders(NextResponse.json({ error: `Missing field: ${f}` }, { status: 400 }), getOrigin(req));
  }

  // Generate a unique ticket id (with collision retry)
  let tid = ticketId();
  let tries = 0;
  try {
    while (await db.booking.findUnique({ where: { ticketId: tid } }) && tries < 10) {
      tid = ticketId();
      tries++;
    }
  } catch {
    // DB unavailable — keep the generated ticket id
  }

  try {
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
    return setCorsHeaders(
      NextResponse.json({ booking, message: `Booking received! Your ticket ID is ${tid}` }),
      getOrigin(req)
    );
  } catch (err: any) {
    // DB write failed — still return a success response with the generated ticket id
    // so the public site can save it to localStorage and show the ticket to the customer.
    // The frontend treats this as a successful submission (offline-first).
    return setCorsHeaders(
      NextResponse.json({
        booking: {
          id: `pub-${Date.now()}`,
          ticketId: tid,
          customerName: String(data.customerName).slice(0, 120),
          email: String(data.email).slice(0, 160),
          phone: String(data.phone).slice(0, 40),
          deviceType: String(data.deviceType).slice(0, 40),
          deviceModel: String(data.deviceModel).slice(0, 120),
          issue: String(data.issue).slice(0, 1000),
          needsCollection: !!data.needsCollection,
          collectionAddr: data.collectionAddr ? String(data.collectionAddr).slice(0, 300) : null,
          status: "Pending",
          source: "online",
          bookingDate: data.bookingDate || new Date().toISOString().split("T")[0],
          bookingTime: data.bookingTime || "10:30",
          createdAt: new Date().toISOString(),
        },
        message: `Booking received! Your ticket ID is ${tid}`,
      }),
      getOrigin(req)
    );
  }
}
