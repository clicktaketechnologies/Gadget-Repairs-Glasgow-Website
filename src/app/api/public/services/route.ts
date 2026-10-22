import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const where: any = { active: true };
  if (category && category !== "all") where.category = category;
  const services = await db.service.findMany({ where, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
  return setCorsHeaders(NextResponse.json({ services }), getOrigin(req));
}
