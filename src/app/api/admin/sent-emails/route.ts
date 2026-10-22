import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setCorsHeaders, getOrigin } from "@/lib/cors";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return setCorsHeaders(NextResponse.json({ error: auth.error }, { status: 401 }), getOrigin(req));
  const { bookingId, subject, body } = await req.json();
  const booking = await db.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return setCorsHeaders(NextResponse.json({ error: "Booking not found" }, { status: 404 }), getOrigin(req));
  const settings = await db.emailSettings.findUnique({ where: { id: "singleton" } });
  let status = "queued";
  if (settings && settings.enabled && settings.host && settings.user) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: settings.host, port: settings.port, secure: settings.secure,
        auth: { user: settings.user, pass: settings.password || "" },
      });
      await transporter.sendMail({
        from: `"${settings.fromName}" <${settings.fromEmail}>`,
        to: booking.email,
        subject: subject || `Update on your repair ${booking.ticketId}`,
        text: body,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">${body.replace(/\n/g, "<br>")}</div>`,
      });
      status = "sent";
    } catch { status = "failed"; }
  }
  await db.sentEmail.create({
    data: { toEmail: booking.email, subject: subject || `Update on your repair ${booking.ticketId}`, body, status, relatedBookingId: booking.id },
  });
  return setCorsHeaders(NextResponse.json({ message: status === "sent" ? "Email sent" : status === "failed" ? "Email failed to send" : "Email queued (SMTP not enabled)", status }), getOrigin(req));
}
