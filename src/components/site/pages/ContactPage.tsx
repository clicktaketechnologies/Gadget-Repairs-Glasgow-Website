"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Section } from "@/components/site/Section";
import { STATIC_BRANDING, STATIC_SERVICES } from "../staticData";
import { useNav } from "@/store/nav";
import { parseJson, telDigits, type HoursEntry } from "../lib";

export function ContactPage() {
  const branding = useNav((s) => s.branding);
  const settings = useNav((s) => s.settings);

  const businessName = branding?.businessName ?? "Gadget Repairs Glasgow";
  const phone = branding?.phone ?? "+44 7777 200149";
  const phoneDigits = telDigits(phone);
  const whatsapp = telDigits(branding?.whatsapp ?? phone);
  const email = branding?.email ?? "info@gadgetrepairsglasgow.co.uk";
  const address = branding?.address ?? "172 Trongate, Glasgow, UK";
  const mapEmbed =
    branding?.mapEmbed ?? STATIC_BRANDING.mapEmbed ?? "";

  const hours: HoursEntry[] = parseJson(
    branding?.hoursJson ?? STATIC_BRANDING.hoursJson,
    []
  );
  const socials: { name: string; url: string }[] = parseJson(
    branding?.socialsJson ?? STATIC_BRANDING.socialsJson,
    []
  );

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    deviceType: "",
    deviceModel: "",
    issue: "",
    needsCollection: false,
    collectionAddr: "",
    bookingDate: "",
    bookingTime: "10:30",
  });
  const [submitting, setSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const deviceTypes = Array.from(
    new Set(STATIC_SERVICES.map((s) => s.category))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.needsCollection && !form.collectionAddr.trim()) {
      toast.error("Please enter your collection address.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/public/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Could not submit booking.");
        return;
      }
      setTicketId(data.booking?.ticketId ?? "GD-0000");
      toast.success("Booking received! Your ticket ID is on screen.");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <Section className="py-10 sm:py-14 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Badge className="bg-orange-500/20 text-orange-300 border border-orange-400/30">
              Get in Touch
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold mt-3">
              Book a Repair or Visit Us
            </h1>
            <p className="text-blue-100 mt-2 max-w-2xl text-sm sm:text-base">
              Walk in to our Trongate store, call us, or book online for free
              doorstep collection. We're open 7 days a week.
            </p>
          </motion.div>
        </Section>
      </section>

      <Section className="py-10 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Contact info column */}
          <div className="lg:col-span-2 space-y-5">
            <Card className="border-zinc-200">
              <CardContent className="p-5 space-y-4">
                <h2 className="font-bold text-blue-900 text-lg">
                  Contact information
                </h2>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="inline-flex size-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600 ring-1 ring-orange-100 shrink-0">
                      <MapPin className="size-4" />
                    </span>
                    <div>
                      <p className="font-medium text-zinc-900">Address</p>
                      <p className="text-zinc-600">{address}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex size-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600 ring-1 ring-orange-100 shrink-0">
                      <Phone className="size-4" />
                    </span>
                    <div>
                      <p className="font-medium text-zinc-900">Phone</p>
                      <a
                        href={`tel:${phoneDigits}`}
                        className="text-blue-700 hover:underline inline-block min-h-9 py-1 -my-1"
                      >
                        {phone}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex size-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600 ring-1 ring-orange-100 shrink-0">
                      <Mail className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-zinc-900">Email</p>
                      <a
                        href={`mailto:${email}`}
                        className="text-blue-700 hover:underline break-all inline-block min-h-9 py-1 -my-1"
                      >
                        {email}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex size-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600 ring-1 ring-orange-100 shrink-0">
                      <MessageCircle className="size-4" />
                    </span>
                    <div>
                      <p className="font-medium text-zinc-900">WhatsApp</p>
                      <a
                        href={`https://wa.me/${whatsapp.replace("+", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:underline inline-block min-h-9 py-1 -my-1"
                      >
                        {branding?.whatsapp ?? phone}
                      </a>
                    </div>
                  </li>
                </ul>

                <div className="pt-2 border-t border-zinc-100">
                  <p className="font-medium text-zinc-900 flex items-center gap-2 mb-2">
                    <Clock className="size-4 text-orange-500" />
                    Opening hours
                  </p>
                  <ul className="text-xs space-y-0.5">
                    {hours.map((h) => (
                      <li
                        key={h.day}
                        className="flex justify-between text-zinc-600 gap-2"
                      >
                        <span className="truncate">{h.day}</span>
                        <span className="font-medium text-zinc-800 text-right whitespace-nowrap">
                          {h.hours}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {socials.length > 0 && (
                  <div className="pt-2 border-t border-zinc-100">
                    <p className="font-medium text-zinc-900 mb-2">Follow us</p>
                    <div className="flex flex-wrap gap-2">
                      {socials.map((s) => (
                        <a
                          key={s.name}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-2.5 py-1.5 min-h-9 inline-flex items-center rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          {s.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Map */}
            {mapEmbed && (
              <Card className="border-zinc-200 overflow-hidden">
                <div className="aspect-[4/3] w-full max-w-full">
                  <iframe
                    title="Map of Gadget Repairs Glasgow"
                    src={mapEmbed}
                    className="w-full h-full border-0 max-w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </Card>
            )}
          </div>

          {/* Booking form column */}
          <div className="lg:col-span-3">
            <Card className="border-zinc-200">
              <CardContent className="p-6">
                {ticketId ? (
                  <div className="text-center py-8">
                    <div className="size-16 rounded-full bg-emerald-100 text-emerald-700 inline-flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="size-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-blue-900">
                      Booking received!
                    </h2>
                    <p className="text-zinc-600 mt-2">
                      Your ticket ID is below. Keep it safe — you'll use it to
                      track your repair.
                    </p>
                    <div className="my-6 inline-block bg-blue-50 ring-2 ring-blue-200 rounded-xl px-8 py-4">
                      <p className="text-xs text-zinc-500 uppercase tracking-wide">
                        Your Ticket ID
                      </p>
                      <p className="text-3xl font-extrabold text-blue-700 tracking-wider">
                        {ticketId}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Button
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => {
                          setTicketId(null);
                          setForm({
                            customerName: "",
                            email: "",
                            phone: "",
                            deviceType: "",
                            deviceModel: "",
                            issue: "",
                            needsCollection: false,
                            collectionAddr: "",
                            bookingDate: "",
                            bookingTime: "10:30",
                          });
                        }}
                      >
                        Book Another Repair
                      </Button>
                      <Button
                        variant="outline"
                        className="border-blue-200 text-blue-700"
                        onClick={() => {
                          const { goTrack } = useNav.getState();
                          goTrack();
                        }}
                      >
                        Track My Repair
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="font-bold text-blue-900 text-xl mb-1">
                      Book a repair
                    </h2>
                    <p className="text-sm text-zinc-600 mb-5">
                      Fill in the form below — we'll confirm your booking by
                      phone or email within 1 hour during opening times.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="c-name">Your name *</Label>
                          <Input
                            id="c-name"
                            required
                            value={form.customerName}
                            onChange={(e) =>
                              setForm((s) => ({
                                ...s,
                                customerName: e.target.value,
                              }))
                            }
                            placeholder="Jane Doe"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="c-phone">Phone *</Label>
                          <Input
                            id="c-phone"
                            required
                            type="tel"
                            value={form.phone}
                            onChange={(e) =>
                              setForm((s) => ({ ...s, phone: e.target.value }))
                            }
                            placeholder="07123 456789"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="c-email">Email *</Label>
                        <Input
                          id="c-email"
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            setForm((s) => ({ ...s, email: e.target.value }))
                          }
                          placeholder="jane@example.com"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="c-type">Device type *</Label>
                          <select
                            id="c-type"
                            required
                            value={form.deviceType}
                            onChange={(e) =>
                              setForm((s) => ({
                                ...s,
                                deviceType: e.target.value,
                              }))
                            }
                            className="w-full h-10 rounded-md border border-zinc-300 bg-transparent px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                          >
                            <option value="">Select…</option>
                            {deviceTypes.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="c-model">Model</Label>
                          <Input
                            id="c-model"
                            required
                            value={form.deviceModel}
                            onChange={(e) =>
                              setForm((s) => ({
                                ...s,
                                deviceModel: e.target.value,
                              }))
                            }
                            placeholder="e.g. iPhone 14 Pro"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="c-issue">Describe the issue *</Label>
                        <Textarea
                          id="c-issue"
                          required
                          rows={4}
                          value={form.issue}
                          onChange={(e) =>
                            setForm((s) => ({ ...s, issue: e.target.value }))
                          }
                          placeholder="e.g. Cracked screen, won't charge, etc."
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="c-date">Preferred date</Label>
                          <Input
                            id="c-date"
                            type="date"
                            value={form.bookingDate}
                            onChange={(e) =>
                              setForm((s) => ({
                                ...s,
                                bookingDate: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="c-time">Preferred time</Label>
                          <select
                            id="c-time"
                            value={form.bookingTime}
                            onChange={(e) =>
                              setForm((s) => ({
                                ...s,
                                bookingTime: e.target.value,
                              }))
                            }
                            className="w-full h-10 rounded-md border border-zinc-300 bg-transparent px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                          >
                            {[
                              "09:30",
                              "10:30",
                              "11:30",
                              "12:30",
                              "13:30",
                              "14:30",
                              "15:30",
                              "16:30",
                              "17:30",
                            ].map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {(settings?.collectionEnabled ?? true) && (
                        <div className="space-y-3 rounded-lg bg-blue-50 p-4 ring-1 ring-blue-100">
                          <div className="flex items-start gap-2">
                            <Checkbox
                              id="c-collection"
                              checked={form.needsCollection}
                              onCheckedChange={(v) =>
                                setForm((s) => ({
                                  ...s,
                                  needsCollection: v === true,
                                }))
                              }
                            />
                            <Label
                              htmlFor="c-collection"
                              className="text-sm font-medium text-blue-900 cursor-pointer leading-snug"
                            >
                              <Truck className="inline size-4 mr-1 -mt-0.5 text-orange-500" />
                              Yes, I'd like free doorstep collection across
                              Glasgow.
                            </Label>
                          </div>
                          {form.needsCollection && (
                            <div className="space-y-1.5">
                              <Label htmlFor="c-addr">
                                Collection address *
                              </Label>
                              <Textarea
                                id="c-addr"
                                rows={2}
                                value={form.collectionAddr}
                                onChange={(e) =>
                                  setForm((s) => ({
                                    ...s,
                                    collectionAddr: e.target.value,
                                  }))
                                }
                                placeholder="Full address with postcode"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        size="lg"
                      >
                        {submitting ? (
                          "Submitting…"
                        ) : (
                          <>
                            <Send className="size-4" />
                            Book My Repair
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-zinc-500 text-center">
                        By booking you agree to our{" "}
                        <a
                          href="/terms"
                          className="text-blue-700 hover:underline"
                        >
                          Terms &amp; Conditions
                        </a>
                        .
                      </p>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}

export { ContactPage as default, ContactPage };
