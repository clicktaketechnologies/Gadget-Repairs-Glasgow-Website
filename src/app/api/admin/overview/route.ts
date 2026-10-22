import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";
import { requireAdmin } from "@/lib/auth";
import { fmtDate } from "@/lib/utils2";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const [total, pending, inProgress, ready, completed, bookings, recentBookings] = await Promise.all([
    db.booking.count(),
    db.booking.count({ where: { status: "Pending" } }),
    db.booking.count({ where: { status: "In Progress" } }),
    db.booking.count({ where: { status: "Ready" } }),
    db.booking.count({ where: { status: "Completed" } }),
    db.booking.findMany({ where: { status: "Completed", finalPrice: { not: null } } }),
    db.booking.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);
  let revenue = 0;
  for (const b of bookings) { const m = (b.finalPrice || "").match(/£?([\d.]+)/); if (m) revenue += parseFloat(m[1]); }
  const trend = [];
  for (let i = 13; i >= 0; i--) {
    const day = new Date(Date.now() - i * 86400000);
    const dayStart = new Date(day.setHours(0, 0, 0, 0));
    const dayEnd = new Date(dayStart.getTime() + 86400000);
    const [p, ip, r, c] = await Promise.all([
      db.booking.count({ where: { status: "Pending", createdAt: { gte: dayStart, lt: dayEnd } } }),
      db.booking.count({ where: { status: "In Progress", createdAt: { gte: dayStart, lt: dayEnd } } }),
      db.booking.count({ where: { status: "Ready", createdAt: { gte: dayStart, lt: dayEnd } } }),
      db.booking.count({ where: { status: "Completed", createdAt: { gte: dayStart, lt: dayEnd } } }),
    ]);
    trend.push({ date: fmtDate(dayStart), Pending: p, "In Progress": ip, Ready: r, Completed: c });
  }
  const allBookings = await db.booking.findMany({ select: { deviceType: true } });
  const deviceMap = {};
  for (const b of allBookings) deviceMap[b.deviceType] = (deviceMap[b.deviceType] || 0) + 1;
  const deviceTypes = Object.entries(deviceMap).map(([name, value]) => ({ name, value }));
  return setCorsHeaders(NextResponse.json({ kpis: { total, pending, inProgress, ready, completed, revenue: Math.round(revenue) }, trend, deviceTypes, recentBookings }), getOrigin(req));
}
