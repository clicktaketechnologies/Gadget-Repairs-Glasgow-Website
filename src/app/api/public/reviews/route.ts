import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";

export async function GET(req: NextRequest) {
  const reviews = await db.review.findMany({ where: { approved: true }, orderBy: { createdAt: "desc" } });
  return setCorsHeaders(NextResponse.json({ reviews }), getOrigin(req));
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.author || !data.rating || !data.comment) {
    return setCorsHeaders(NextResponse.json({ error: "Missing fields" }, { status: 400 }), getOrigin(req));
  }
  const review = await db.review.create({
    data: {
      author: String(data.author).slice(0, 100),
      rating: Math.max(1, Math.min(5, Number(data.rating))),
      comment: String(data.comment).slice(0, 1000),
      device: data.device ? String(data.device).slice(0, 100) : null,
      source: "online", approved: false,
    },
  });
  return setCorsHeaders(NextResponse.json({ review, message: "Thank you! Your review will appear once approved." }), getOrigin(req));
}
