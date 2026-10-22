import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ticketId = (searchParams.get("ticketId") || "").trim().toUpperCase();
  if (!ticketId) return setCorsHeaders(NextResponse.json({ error: "Ticket ID required" }, { status: 400 }), getOrigin(req));
  const booking = await db.booking.findUnique({ where: { ticketId } });
  if (!booking) return setCorsHeaders(NextResponse.json({ error: "No booking found with that ticket ID" }, { status: 404 }), getOrigin(req));
  return setCorsHeaders(NextResponse.json({ booking }), getOrigin(req));
}
