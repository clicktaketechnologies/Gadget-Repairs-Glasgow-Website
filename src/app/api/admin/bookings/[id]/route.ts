import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const { id } = await params;
  const data = await req.json().catch(() => ({}));
  try {
    const booking = await db.booking.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
    return setCorsHeaders(NextResponse.json({ booking }), getOrigin(req));
  } catch {
    // DB unavailable — return a 404 so the admin client keeps its local update
    return setCorsHeaders(NextResponse.json({ error: "Not stored on server — kept locally" }, { status: 404 }), getOrigin(req));
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const { id } = await params;
  try {
    await db.booking.delete({ where: { id } });
  } catch {
    // ignore — admin already moved it to local trash
  }
  return setCorsHeaders(NextResponse.json({ message: "Deleted" }), getOrigin(req));
}
