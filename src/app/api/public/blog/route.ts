import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const featured = searchParams.get("featured");
  const where: any = { published: true };
  if (featured === "true") where.featured = true;
  const posts = await db.blogPost.findMany({ where, orderBy: { createdAt: "desc" } });
  return setCorsHeaders(NextResponse.json({ posts }), getOrigin(req));
}
