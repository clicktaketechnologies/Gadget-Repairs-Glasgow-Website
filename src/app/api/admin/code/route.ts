import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const settings = await db.siteSettings.findUnique({ where: { id: "singleton" } });
  return setCorsHeaders(NextResponse.json({ settings }), getOrigin(req));
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const data = await req.json();
  const settings = await db.siteSettings.upsert({
    where: { id: "singleton" },
    update: { customHeaderCode: data.customHeaderCode ?? null, customFooterCode: data.customFooterCode ?? null },
    create: { id: "singleton", customHeaderCode: data.customHeaderCode ?? null, customFooterCode: data.customFooterCode ?? null },
  });
  return setCorsHeaders(NextResponse.json({ settings }), getOrigin(req));
}
