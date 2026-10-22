"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Search,
  TicketCheck,
  Clock,
  Wrench,
  CheckCircle2,
  PackageCheck,
  XCircle,
  AlertCircle,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/site/Section";
import { useNav } from "@/store/nav";
import { telDigits, fmtDateTime } from "../lib";
import { cn } from "@/lib/utils";

const EXAMPLE_TICKETS = ["GD-1024", "GD-2317", "GD-4501", "GD-6892"];

const STATUS_STEPS = [
  { key: "Pending", label: "Booking Received", icon: TicketCheck },
  { key: "In Progress", label: "Repair In Progress", icon: Wrench },
  { key: "Ready", label: "Ready For Collection", icon: PackageCheck },
  { key: "Completed", label: "Completed", icon: CheckCircle2 },
];

const STATUS_COLOR: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
  Ready: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Completed: "bg-zinc-100 text-zinc-800 border-zinc-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
};

interface Booking {
  id: string;
  ticketId: string;
  customerName: string;
  email: string;
  phone: string;
  deviceType: string;
  deviceModel: string;
  issue: string;
  needsCollection: boolean;
  collectionAddr?: string | null;
  status: string;
  technicianNotes?: string | null;
  quotedPrice?: string | null;
  finalPrice?: string | null;
  source: string;
  bookingDate?: string | null;
  bookingTime?: string | null;
  createdAt: string;
  updatedAt: string;
}

export function TrackPage() {
  const branding = useNav((s) => s.branding);
  const phone = branding?.phone ?? "+44 7777 200149";
  const phoneDigits = telDigits(phone);

  const [ticketInput, setTicketInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleTrack = async (e?: React.FormEvent, override?: string) => {
    e?.preventDefault();
    const tid = (override ?? ticketInput).trim().toUpperCase();
    if (!tid) {
      toast.error("Please enter your ticket ID.");
      return;
    }
    setLoading(true);
    setBooking(null);
    setNotFound(false);
    try {
      const res = await fetch(
        `/api/public/track?ticketId=${encodeURIComponent(tid)}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (!res.ok) {
        setNotFound(true);
        toast.error(data.error || "Ticket not found.");
        return;
      }
      setBooking(data.booking as Booking);
      toast.success("Booking found!");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = booking
    ? STATUS_STEPS.findIndex((s) => s.key === booking.status)
    : -1;
  const isCancelled = booking?.status === "Cancelled";

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <Section className="py-10 sm:py-14 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl space-y-4"
          >
            <Badge className="bg-orange-500/20 text-orange-300 border border-orange-400/30">
              Track Your Repair
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold">
              Where's my repair?
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              Enter your ticket ID (format GD-XXXX) to see the live status of
              your repair. We'll text you at every stage.
            </p>
          </motion.div>
        </Section>
      </section>

      <Section className="py-10 sm:py-12 lg:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Input form */}
          <Card className="border-zinc-200">
            <CardContent className="p-5 sm:p-6">
              <form
                onSubmit={handleTrack}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="flex-1 relative min-w-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <Input
                    value={ticketInput}
                    onChange={(e) =>
                      setTicketInput(e.target.value.toUpperCase())
                    }
                    placeholder="GD-1024"
                    className="pl-9 text-base sm:text-lg font-mono tracking-wider h-11"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-600 text-white sm:px-8 h-11 shrink-0"
                >
                  {loading ? "Tracking…" : "Track Repair"}
                  {!loading && <Search className="size-4" />}
                </Button>
              </form>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                <span>Try:</span>
                {EXAMPLE_TICKETS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTicketInput(t);
                      handleTrack(undefined, t);
                    }}
                    className="px-2.5 py-1 min-h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 font-mono"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Not found */}
          {notFound && (
            <Card className="border-red-200 mt-5">
              <CardContent className="p-6 text-center">
                <div className="size-12 rounded-full bg-red-100 text-red-700 inline-flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="size-6" />
                </div>
                <h2 className="font-bold text-zinc-900">
                  Ticket not found
                </h2>
                <p className="text-sm text-zinc-600 mt-1">
                  We couldn't find a booking with that ticket ID. Please check
                  and try again, or call us on{" "}
                  <a
                    href={`tel:${phoneDigits}`}
                    className="text-blue-700 underline"
                  >
                    {phone}
                  </a>
                  .
                </p>
              </CardContent>
            </Card>
          )}

          {/* Result */}
          {booking && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-5 space-y-5"
            >
              <Card className="border-zinc-200 overflow-hidden">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="bg-blue-900 text-white p-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-blue-200 uppercase tracking-wide">
                        Ticket ID
                      </p>
                      <p className="text-2xl font-extrabold font-mono tracking-wider">
                        {booking.ticketId}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-semibold border",
                        STATUS_COLOR[booking.status] ??
                          "bg-zinc-100 text-zinc-800 border-zinc-200"
                      )}
                    >
                      {booking.status}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-zinc-500">Customer</p>
                      <p className="font-medium text-zinc-900">
                        {booking.customerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Device</p>
                      <p className="font-medium text-zinc-900">
                        {booking.deviceType}
                        {booking.deviceModel
                          ? ` — ${booking.deviceModel}`
                          : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Booked on</p>
                      <p className="font-medium text-zinc-900">
                        {fmtDateTime(booking.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Preferred slot</p>
                      <p className="font-medium text-zinc-900">
                        {booking.bookingDate ?? "—"}{" "}
                        {booking.bookingTime ? `at ${booking.bookingTime}` : ""}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-zinc-500">Issue</p>
                      <p className="text-zinc-800">{booking.issue}</p>
                    </div>
                    {booking.needsCollection && booking.collectionAddr && (
                      <div className="sm:col-span-2">
                        <p className="text-xs text-zinc-500">
                          Collection address
                        </p>
                        <p className="text-zinc-800">{booking.collectionAddr}</p>
                      </div>
                    )}
                    {booking.technicianNotes && (
                      <div className="sm:col-span-2">
                        <p className="text-xs text-zinc-500">
                          Technician notes
                        </p>
                        <p className="text-zinc-800 italic">
                          {booking.technicianNotes}
                        </p>
                      </div>
                    )}
                    {(booking.quotedPrice || booking.finalPrice) && (
                      <div>
                        <p className="text-xs text-zinc-500">Quoted price</p>
                        <p className="font-bold text-blue-700">
                          {booking.finalPrice || booking.quotedPrice}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Status timeline */}
              <Card className="border-zinc-200">
                <CardContent className="p-5">
                  <h3 className="font-bold text-blue-900 mb-4">
                    Repair progress
                  </h3>
                  {isCancelled ? (
                    <div className="flex items-center gap-3 bg-red-50 ring-1 ring-red-100 rounded-lg p-4">
                      <XCircle className="size-6 text-red-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-red-900">
                          This booking was cancelled
                        </p>
                        <p className="text-sm text-red-700">
                          Please call us if you'd like to re-book.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <ol className="relative">
                      {STATUS_STEPS.map((step, i) => {
                        const done = i <= currentStepIndex;
                        const current = i === currentStepIndex;
                        const Icon = step.icon;
                        return (
                          <li key={step.key} className="flex gap-3 pb-5 last:pb-0">
                            <div className="flex flex-col items-center shrink-0">
                              <span
                                className={cn(
                                  "inline-flex size-9 items-center justify-center rounded-full ring-2",
                                  done
                                    ? "bg-blue-600 text-white ring-blue-600"
                                    : "bg-zinc-100 text-zinc-400 ring-zinc-200",
                                  current && "ring-orange-500 bg-orange-500 text-white"
                                )}
                              >
                                <Icon className="size-4" />
                              </span>
                              {i < STATUS_STEPS.length - 1 && (
                                <span
                                  className={cn(
                                    "w-0.5 flex-1 mt-1 min-h-6",
                                    i < currentStepIndex
                                      ? "bg-blue-600"
                                      : "bg-zinc-200"
                                  )}
                                />
                              )}
                            </div>
                            <div className="pt-1.5 min-w-0">
                              <p
                                className={cn(
                                  "font-medium text-sm",
                                  done ? "text-zinc-900" : "text-zinc-400"
                                )}
                              >
                                {step.label}
                              </p>
                              {current && (
                                <p className="text-xs text-orange-600 mt-0.5 inline-flex items-center gap-1">
                                  <Clock className="size-3" />
                                  Current stage
                                </p>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </CardContent>
              </Card>

              <Card className="border-zinc-200 bg-blue-50">
                <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-sm text-center sm:text-left">
                    <p className="font-semibold text-blue-900">
                      Questions about your repair?
                    </p>
                    <p className="text-zinc-600">
                      Call us — we'll give you an instant update.
                    </p>
                  </div>
                  <a href={`tel:${phoneDigits}`} className="shrink-0">
                    <Button
                      className="bg-orange-500 hover:bg-orange-600 text-white h-11"
                    >
                      <Phone className="size-4" />
                      {phone}
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </Section>
    </>
  );
}

export { TrackPage as default, TrackPage };
