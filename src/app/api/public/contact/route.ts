import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.name || !data.email || !data.message) {
    return setCorsHeaders(NextResponse.json({ error: "Missing fields" }, { status: 400 }), getOrigin(req));
  }
  await db.sentEmail.create({
    data: {
      toEmail: "info@gadgetrepairsglasgow.co.uk",
      subject: `Contact form: ${data.name}`,
      body: `From: ${data.name} <${data.email}>\nPhone: ${data.phone || "n/a"}\n\n${data.message}`,
      status: "received",
    },
  });
  return setCorsHeaders(NextResponse.json({ message: "Message sent! We'll get back to you shortly." }), getOrigin(req));
}
