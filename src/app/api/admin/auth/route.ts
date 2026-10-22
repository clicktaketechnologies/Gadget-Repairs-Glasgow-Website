import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";
import { makeToken } from "@/lib/token";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) return setCorsHeaders(NextResponse.json({ error: "Email and password required" }, { status: 400 }), getOrigin(req));
  const admin = await db.adminUser.findFirst({ where: { email: email.toLowerCase().trim() } });
  if (!admin || admin.password !== password) return setCorsHeaders(NextResponse.json({ error: "Invalid credentials" }, { status: 401 }), getOrigin(req));
  const token = makeToken(admin.email);
  return setCorsHeaders(NextResponse.json({ token, email: admin.email, name: admin.name, message: "Login successful" }), getOrigin(req));
}
