import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const { id } = await params;
  const data = await req.json();
  const service = await db.service.update({ where: { id }, data: { ...data } });
  return setCorsHeaders(NextResponse.json({ service }), getOrigin(req));
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const { id } = await params;
  await db.service.delete({ where: { id } });
  return setCorsHeaders(NextResponse.json({ message: "Deleted" }), getOrigin(req));
}
