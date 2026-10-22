import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";
import { requireAdmin } from "@/lib/auth";
import { ticketId } from "@/lib/utils2";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q");
  const where: any = {};
  if (status && status !== "all") where.status = status;
  if (q) { where.OR = [{ ticketId: { contains: q } }, { customerName: { contains: q } }, { email: { contains: q } }, { phone: { contains: q } }, { deviceModel: { contains: q } }, { issue: { contains: q } }]; }
  const bookings = await db.booking.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 });
  return setCorsHeaders(NextResponse.json({ bookings }), getOrigin(req));
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const data = await req.json();
  let tid = ticketId();
  while (await db.booking.findUnique({ where: { ticketId: tid } })) tid = ticketId();
  const booking = await db.booking.create({
    data: {
      ticketId: tid,
      customerName: String(data.customerName || "").slice(0, 120),
      email: String(data.email || "").slice(0, 160),
      phone: String(data.phone || "").slice(0, 40),
      deviceType: String(data.deviceType || "Phone").slice(0, 40),
      deviceModel: String(data.deviceModel || "").slice(0, 120),
      issue: String(data.issue || "").slice(0, 1000),
      needsCollection: !!data.needsCollection,
      collectionAddr: data.collectionAddr ? String(data.collectionAddr).slice(0, 300) : null,
      status: data.status || "Pending",
      technicianNotes: data.technicianNotes || null,
      quotedPrice: data.quotedPrice || null,
      finalPrice: data.finalPrice || null,
      source: data.source || "walk-in",
      bookingDate: data.bookingDate || new Date().toISOString().split("T")[0],
      bookingTime: data.bookingTime || "10:30",
    },
  });
  return setCorsHeaders(NextResponse.json({ booking }), getOrigin(req));
}
