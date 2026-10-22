import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ status: "ok", service: "gadget-repairs-glasgow", time: new Date().toISOString() });
}
