import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "home";
  const rows = await db.pageContent.findMany({ where: { page } });
  return setCorsHeaders(NextResponse.json({ rows }), getOrigin(req));
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const data = await req.json();
  const { page, items } = data;
  for (const it of items) {
    await db.pageContent.upsert({
      where: { page_section_key: { page, section: it.section, key: it.key } },
      update: { value: it.value },
      create: { page, section: it.section, key: it.key, value: it.value },
    });
  }
  return setCorsHeaders(NextResponse.json({ message: "Saved", count: items.length }), getOrigin(req));
}
