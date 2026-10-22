import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await db.service.findUnique({ where: { slug } });
  if (!service || !service.active) {
    return setCorsHeaders(NextResponse.json({ error: "Not found" }, { status: 404 }), getOrigin(req));
  }
  return setCorsHeaders(NextResponse.json({ service }), getOrigin(req));
}
