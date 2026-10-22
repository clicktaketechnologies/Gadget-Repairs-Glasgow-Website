import { headers } from "next/headers";
import { verifyToken } from "@/lib/token";
import { db } from "./db";

export async function requireAdmin(): Promise<{ ok: true; email: string } | { ok: false; error: string }> {
  const h = await headers();
  const auth = h.get("authorization") ?? h.get("Authorization");
  const xt = h.get("x-admin-token") ?? h.get("X-Admin-Token");
  let token = "";
  if (auth && auth.startsWith("Bearer ")) token = auth.slice(7);
  else if (xt) token = xt;
  if (!token) return { ok: false, error: "Missing admin token" };
  const payload = verifyToken(token);
  if (!payload) return { ok: false, error: "Invalid or expired token" };
  const admin = await db.adminUser.findFirst({ where: { email: payload.email } });
  if (!admin) return { ok: false, error: "Admin not found" };
  return { ok: true, email: admin.email };
}
