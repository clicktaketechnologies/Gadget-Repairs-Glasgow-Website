import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter");
  const where: any = {};
  if (filter === "pending") where.approved = false;
  if (filter === "approved") where.approved = true;
  const reviews = await db.review.findMany({ where, orderBy: { createdAt: "desc" } });
  return setCorsHeaders(NextResponse.json({ reviews }), getOrigin(req));
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const data = await req.json();
  const review = await db.review.create({
    data: { author: data.author, rating: Number(data.rating), comment: data.comment, device: data.device || null, source: data.source || "admin", approved: !!data.approved },
  });
  return setCorsHeaders(NextResponse.json({ review }), getOrigin(req));
}
