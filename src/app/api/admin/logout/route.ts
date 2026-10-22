import { NextRequest, NextResponse } from "next/server";
import { setCorsHeaders, getOrigin } from "@/lib/cors";
export async function POST(req: NextRequest) { return setCorsHeaders(NextResponse.json({ message: "Logged out" }), getOrigin(req)); }
