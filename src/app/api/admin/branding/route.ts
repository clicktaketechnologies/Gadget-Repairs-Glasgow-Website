import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";
import { requireAdmin } from "@/lib/auth";

const ALLOWED = ["businessName","tagline","about","logoUrl","faviconUrl","primaryColor","secondaryColor","phone","whatsapp","email","website","gmbProfile","mapLink","mapEmbed","address","hoursJson","socialsJson","targetAreasJson","rating","reviewCount","yearsExperience"];

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const branding = await db.branding.findUnique({ where: { id: "singleton" } });
  return setCorsHeaders(NextResponse.json({ branding }), getOrigin(req));
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const data = await req.json();
  const update: any = {};
  for (const k of ALLOWED) if (k in data) update[k] = data[k];
  const branding = await db.branding.upsert({
    where: { id: "singleton" },
    update,
    create: { id: "singleton", businessName: data.businessName || "Business", tagline: data.tagline || "", about: data.about || "", phone: data.phone || "", email: data.email || "", address: data.address || "", ...update },
  });
  return setCorsHeaders(NextResponse.json({ branding }), getOrigin(req));
}
