import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils2";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const posts = await db.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return setCorsHeaders(NextResponse.json({ posts }), getOrigin(req));
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const data = await req.json();
  let slug = data.slug ? slugify(data.slug) : slugify(data.title);
  let suffix = 1;
  while (await db.blogPost.findUnique({ where: { slug } })) { slug = `${slugify(data.title || "post")}-${suffix++}`; }
  const post = await db.blogPost.create({
    data: {
      slug, title: data.title, excerpt: data.excerpt || "", content: data.content || "",
      coverImage: data.coverImage || null, category: data.category || "General", tags: data.tags || null,
      author: data.author || "Gadget Repairs Glasgow", published: !!data.published, featured: !!data.featured,
    },
  });
  return setCorsHeaders(NextResponse.json({ post }), getOrigin(req));
}
