import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const services = await db.service.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
  return setCorsHeaders(NextResponse.json({ services }), getOrigin(req));
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const data = await req.json();
  const service = await db.service.create({
    data: {
      slug: data.slug, name: data.name, category: data.category, description: data.description || "",
      icon: data.icon || "Wrench", priceFrom: data.priceFrom || null, priceTo: data.priceTo || null,
      turnaround: data.turnaround || null, popular: !!data.popular, active: data.active !== false,
      sortOrder: data.sortOrder || 0,
    },
  });
  return setCorsHeaders(NextResponse.json({ service }), getOrigin(req));
}
