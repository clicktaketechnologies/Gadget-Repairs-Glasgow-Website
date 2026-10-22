import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils2";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const { id } = await params;
  const data = await req.json();
  const update: any = { ...data };
  if (data.slug === "") delete update.slug;
  else if (data.slug) update.slug = slugify(data.slug);
  const post = await db.blogPost.update({ where: { id }, data: update });
  return setCorsHeaders(NextResponse.json({ post }), getOrigin(req));
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const { id } = await params;
  await db.blogPost.delete({ where: { id } });
  return setCorsHeaders(NextResponse.json({ message: "Deleted" }), getOrigin(req));
}
