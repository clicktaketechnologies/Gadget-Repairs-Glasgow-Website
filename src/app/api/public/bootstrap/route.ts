import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";

export async function GET(req: NextRequest) {
  const [branding, settings] = await Promise.all([
    db.branding.findUnique({ where: { id: "singleton" } }),
    db.siteSettings.findUnique({ where: { id: "singleton" } }),
  ]);
  return setCorsHeaders(NextResponse.json({ branding, settings }), getOrigin(req));
}
