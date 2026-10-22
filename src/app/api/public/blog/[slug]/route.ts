import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) {
    return setCorsHeaders(NextResponse.json({ error: "Not found" }, { status: 404 }), getOrigin(req));
  }
  const related = await db.blogPost.findMany({
    where: { published: true, category: post.category, slug: { not: slug } },
    take: 3, orderBy: { createdAt: "desc" },
  });
  return setCorsHeaders(NextResponse.json({ post, related }), getOrigin(req));
}
