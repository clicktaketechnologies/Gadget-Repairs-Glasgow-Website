import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const settings = await db.emailSettings.findUnique({ where: { id: "singleton" } });
  return setCorsHeaders(NextResponse.json({ settings }), getOrigin(req));
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const data = await req.json();
  const settings = await db.emailSettings.upsert({
    where: { id: "singleton" },
    update: {
      enabled: !!data.enabled, host: data.host || null, port: Number(data.port) || 587,
      secure: !!data.secure, user: data.user || null, password: data.password || null,
      fromEmail: data.fromEmail || null, fromName: data.fromName || null,
    },
    create: {
      id: "singleton", enabled: !!data.enabled, host: data.host || null, port: Number(data.port) || 587,
      secure: !!data.secure, user: data.user || null, password: data.password || null,
      fromEmail: data.fromEmail || null, fromName: data.fromName || null,
    },
  });
  return setCorsHeaders(NextResponse.json({ settings }), getOrigin(req));
}
