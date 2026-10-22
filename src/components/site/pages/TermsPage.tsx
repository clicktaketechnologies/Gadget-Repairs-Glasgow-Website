"use client";

import { motion } from "framer-motion";
import {
  ChevronRight,
  FileText,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Clock,
  Wallet,
  AlertTriangle,
  Droplets,
  HardDrive,
  Recycle,
  ExternalLink,
} from "lucide-react";
import { useNav } from "@/store/nav";
import { NavLink } from "../NavLink";
import { Section } from "../lib";

export function TermsPage() {
  const goHome = useNav((s) => s.goHome);
  const goContact = useNav((s) => s.goContact);
  const goPrivacy = useNav((s) => s.goPrivacy);
  const branding = useNav((s) => s.branding);

  const businessName = branding?.businessName ?? "Gadget Repairs Glasgow";
  const email = branding?.email ?? "info@gadgetrepairsglasgow.co.uk";
  const phone = branding?.phone ?? "+44 7777 200149";
  const address = "172 Trongate, Glasgow G1 5EL, United Kingdom";
  const website = "www.gadgetrepairsglasgow.co.uk";

  const lastUpdated = "October 2025";

  // The official Terms & Conditions clauses from the business document.
  const clauses = [
    {
      num: 1,
      title: "Agreement & Ownership",
      text: "The following are the terms of agreement for repair of any electronic device given to us for repair. By handing in your device for repair or estimate you certify that you are the rightful owner and that you agree and understand the following terms.",
    },
    {
      num: 2,
      title: "Free Estimates & Non-Refundable Repairs",
      text: "A free repair estimate is only applicable if you choose to have the phone or device repaired or serviced, or if you do not wish to have the device back or leave for recycling. If you do not want to have the phone or device repaired a £25 fee will be levied. Repairing or attempting a repair can cause the device not to power on under certain conditions, all repair works attempts and parts are non refundable.",
    },
    {
      num: 3,
      title: "Repair Ticket",
      text: "A repair ticket will be provided which must be retained for collection.",
    },
    {
      num: 4,
      title: "Level 2 Repair Lab",
      text: "Your device may be sent to our level 2 repair lab for further diagnostics and also repair, in this case the work will not be carried out until you the customer have been provided with an estimate and acceptance of new cost.",
    },
    {
      num: 5,
      title: "Un-repairable Devices",
      text: "Un-repairable devices will be returned in same condition as received.",
    },
    {
      num: 6,
      title: "Pre-Repair Inspection",
      text: "All devices will be inspected before accepting the repair work and any marks faults cosmetic damage discs left game cards memory cards or SIM will be noted and where possible given back to yourself, as responsibility for items left inside device cannot be taken if not noted or informed of beforehand.",
    },
    {
      num: 7,
      title: "Liquid / Water / Moisture Damage",
      text: "Liquid, water, moisture damaged devices are unpredictable and deterioration of performance and functions can happen over time. All devices that have been exposed to these elements can be irreversible; we will endeavour to repair to as best of our ability but cannot provide the standard warranty upon return due to these factors. These devices may require additional parts or repairs which will be quoted to customer at time of diagnoses.",
    },
    {
      num: 8,
      title: "Collection Notification & Retention",
      text: "Once device is repaired you will be informed by text message that it is ready for collection. We will retain the device for maximum 30 Days and if not collected will be placed into storage off site.",
    },
    {
      num: 9,
      title: "Unclaimed Items (90 Days)",
      text: "Unclaimed items and any devices left for longer than 90 days will be dismantled to recover costs or recycled responsibly.",
    },
    {
      num: 10,
      title: "HDD / SSD Data Retention",
      text: "HDD/SSD handed in for data retrieval will be retained for maximum 90 days and then formatted or disposed of as per GDPR Regulations.",
    },
    {
      num: 11,
      title: "Repair Timescales",
      text: "Timescales for repairs are estimates, and therefore subject to change due to outside factors. You will be given applicable updates via text message or phone call.",
    },
    {
      num: 12,
      title: "Liability for Pre-existing Faults",
      text: "No liability can be taken for items not functioning when handed in, we will endeavour to repair and return working but cannot accept responsibility for these items suffering from known issues or motherboard/logic board or component failures.",
    },
    {
      num: 13,
      title: "30-Day Warranty",
      text: "30 Days warranty will be given on day of collection and expires 30 days from then. The warranty will apply to the repair carried out and any parts replaced, it does not apply to any other issues arising after, unless the replaced parts have become faulty and or fail to function as expected.",
    },
    {
      num: 14,
      title: "High-Cost Parts — Upfront Payment",
      text: "High cost parts i.e. Apple Mac book LCD, newer devices etc, will require upfront payment before proceeding with agreed repair. Costs and terms will be discussed before commencing with repair.",
    },
    {
      num: 15,
      title: "Data Loss & Repair Damage",
      text: "Gadget Repairs Glasgow is not responsible for any data loss and for any further damage incurred through diagnoses or repair attempt.",
    },
    {
      num: 16,
      title: "Post-Collection Damage",
      text: "Gadget Repairs Glasgow is not responsible for any physical damage or liquid damage that occurs after item is collected.",
    },
    {
      num: 17,
      title: "No Change-of-Mind Policy",
      text: "For both brand new and used phones, there is no policy allowing for a change of mind.",
    },
  ];

  const highlights = [
    { icon: ShieldCheck, title: "30-day warranty", desc: "On repairs & replaced parts" },
    { icon: Wallet, title: "Free estimate", desc: "If you proceed with repair" },
    { icon: Clock, title: "30-day retention", desc: "Then off-site storage" },
    { icon: AlertTriangle, title: "Non-refundable", desc: "Repair attempts & parts" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-zinc-900 text-white">
        <div className="pointer-events-none absolute -left-20 top-0 size-96 rounded-full bg-orange-500/10 blur-3xl" />
        <Section className="relative py-14 lg:py-20">
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1.5 text-xs text-blue-100"
          >
            <NavLink href="/" onNavigate={goHome} className="hover:text-white">Home</NavLink>
            <ChevronRight className="size-3" />
            <span className="text-white">Terms &amp; Conditions</span>
          </motion.nav>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-5 flex items-center gap-4"
          >
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <FileText className="size-7 text-orange-300" />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Terms &amp; Conditions</h1>
              <p className="mt-1 text-sm text-blue-100">Last updated: {lastUpdated}</p>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mt-4 max-w-2xl text-base text-blue-50/90"
          >
            The official terms and conditions for repair services provided by {businessName}. By handing in your device for repair or estimate, you certify that you are the rightful owner and agree to these terms.
          </motion.p>

          {/* Contact info bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-6 flex flex-wrap gap-4 text-sm text-blue-100"
          >
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 hover:bg-white/20">
              <Phone className="size-4 text-orange-300" /> {phone}
            </a>
            <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5">
              <MapPin className="size-4 text-orange-300" /> {address}
            </span>
            <a href={`https://${website}`} className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 hover:bg-white/20">
              <ExternalLink className="size-4 text-orange-300" /> {website}
            </a>
          </motion.div>
        </Section>
      </section>

      {/* Quick highlights */}
      <Section className="py-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {highlights.map((b) => (
            <div key={b.title} className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 text-center">
              <b.icon className="mx-auto size-6 text-blue-600" />
              <p className="mt-2 text-sm font-semibold text-zinc-900">{b.title}</p>
              <p className="text-[11px] text-zinc-500">{b.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Official T&C content */}
      <Section className="py-12 lg:py-16">
        <div className="mx-auto max-w-3xl">
          {/* Business header block */}
          <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-lg font-bold text-zinc-900">{businessName}</p>
            <div className="mt-2 space-y-1 text-sm text-zinc-600">
              <p className="flex items-center gap-2"><Phone className="size-4 text-blue-600" /> Call Now: <strong className="text-zinc-900">{phone}</strong></p>
              <p className="flex items-center gap-2"><MapPin className="size-4 text-blue-600" /> Visit Us: <strong className="text-zinc-900">{address}</strong></p>
              <p className="flex items-center gap-2"><ExternalLink className="size-4 text-blue-600" /> Website: <strong className="text-zinc-900">{website}</strong></p>
            </div>
          </div>

          <p className="mb-8 text-sm font-medium text-zinc-700">
            Terms and conditions for repair service provided by {businessName}:
          </p>

          {/* Numbered clauses */}
          <div className="space-y-6">
            {clauses.map((c, i) => (
              <motion.div
                key={c.num}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.2) }}
                id={`clause-${c.num}`}
                className="scroll-mt-24 rounded-xl border border-zinc-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                    {c.num}
                  </span>
                  <div className="flex-1">
                    <h2 className="text-base font-bold text-zinc-900">{c.title}</h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{c.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Important callouts */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
              <div className="flex items-center gap-2">
                <Droplets className="size-5 text-orange-600" />
                <h3 className="text-sm font-bold text-zinc-900">Liquid-damaged devices</h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                Water-damaged devices are unpredictable and may deteriorate over time. We cannot provide the standard warranty on liquid-damaged devices, and additional parts may be required — quoted at diagnosis time.
              </p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <div className="flex items-center gap-2">
                <HardDrive className="size-5 text-blue-600" />
                <h3 className="text-sm font-bold text-zinc-900">HDD / SSD data retrieval</h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                Drives handed in for data retrieval are retained for a maximum of 90 days, then formatted or disposed of in accordance with GDPR regulations.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="flex items-center gap-2">
                <Recycle className="size-5 text-zinc-600" />
                <h3 className="text-sm font-bold text-zinc-900">Unclaimed devices</h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                Devices left uncollected for 90+ days will be dismantled to recover costs or recycled responsibly. Please collect your device promptly when notified.
              </p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-5 text-red-600" />
                <h3 className="text-sm font-bold text-zinc-900">Non-refundable repairs</h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                All repair work, attempts, and parts are non-refundable. A £25 fee applies if you decline a repair after diagnosis. High-cost parts require upfront payment.
              </p>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <h3 className="text-base font-bold text-zinc-900">Questions about these terms?</h3>
            <p className="mt-1 text-sm text-zinc-600">
              We&apos;re happy to clarify anything before you hand in your device. Contact us:
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-blue-600" />
                <span className="text-zinc-700"><strong className="text-zinc-900">Address:</strong> {address}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 size-4 shrink-0 text-blue-600" />
                <a href={`mailto:${email}`} className="text-blue-600 hover:underline">{email}</a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-blue-600" />
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-blue-600 hover:underline">{phone}</a>
              </li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-3">
              <NavLink
                href="/contact"
                onNavigate={goContact}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Mail className="size-4" /> Contact us
              </NavLink>
              <NavLink
                href="/privacy"
                onNavigate={goPrivacy}
                className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
              >
                <ShieldCheck className="size-4" /> Privacy Policy →
              </NavLink>
            </div>
          </div>

          {/* Page footer marker */}
          <p className="mt-8 text-center text-xs text-zinc-400">
            {businessName} — Terms &amp; Conditions
          </p>
        </div>
      </Section>
    </div>
  );
}
