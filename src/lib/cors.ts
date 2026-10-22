import type { NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "https://www.gadgetrepairsglasgow.co.uk",
  "https://gadgetrepairsglasgow.co.uk",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

export function setCorsHeaders(res: NextResponse, origin?: string): NextResponse {
  const o = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.headers.set("Access-Control-Allow-Origin", o);
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Admin-Token");
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Vary", "Origin");
  return res;
}

export function getOrigin(req: Request): string | undefined {
  return req.headers.get("origin") ?? undefined;
}
