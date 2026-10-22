import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const emails = await db.sentEmail.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return setCorsHeaders(NextResponse.json({ emails }), getOrigin(req));
}
