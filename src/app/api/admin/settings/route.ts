import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";
import { requireAdmin } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const { currentPassword, newPassword } = await req.json();
  if (!auth.email) return setCorsHeaders(NextResponse.json({ error: "No session" }, { status: 401 }), getOrigin(req));
  const admin = await db.adminUser.findFirst({ where: { email: auth.email } });
  if (!admin || admin.password !== currentPassword) {
    return setCorsHeaders(NextResponse.json({ error: "Current password is incorrect" }, { status: 400 }), getOrigin(req));
  }
  if (!newPassword || newPassword.length < 8) {
    return setCorsHeaders(NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 }), getOrigin(req));
  }
  await db.adminUser.update({ where: { id: admin.id }, data: { password: newPassword } });
  return setCorsHeaders(NextResponse.json({ message: "Password changed successfully" }), getOrigin(req));
}
