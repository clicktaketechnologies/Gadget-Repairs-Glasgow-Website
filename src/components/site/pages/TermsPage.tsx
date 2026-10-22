"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  HardDrive,
  Droplets,
  Clock,
  Phone,
  Mail,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/site/Section";
import { useNav } from "@/store/nav";
import { telDigits } from "../lib";

interface Clause {
  number: string;
  title: string;
  body: React.ReactNode;
}

const CLAUSES: Clause[] = [
  {
    number: "1",
    title: "Introduction",
    body: (
      <p>
        These Terms &amp; Conditions govern all repair services provided by
        Gadget Repairs Glasgow (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
        at our premises at 172 Trongate, Glasgow, UK. By booking a repair,
        dropping off a device, or using any of our services, you accept these
        terms in full.
      </p>
    ),
  },
  {
    number: "2",
    title: "Definitions",
    body: (
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>&quot;Customer&quot;</strong> — the person or business
          commissioning a repair.
        </li>
        <li>
          <strong>&quot;Device&quot;</strong> — any gadget left with us for
          diagnosis or repair.
        </li>
        <li>
          <strong>&quot;Repair&quot;</strong> — any service we perform on a
          Device.
        </li>
        <li>
          <strong>&quot;Quote&quot;</strong> — our written or verbal estimate
          for the Repair.
        </li>
      </ul>
    ),
  },
  {
    number: "3",
    title: "Quotes and Pricing",
    body: (
      <p>
        All quotes are estimates based on the symptoms described by the Customer
        and any initial inspection. A final fixed price will be confirmed
        before any work begins. If additional faults are found during Repair,
        we will contact you for approval before proceeding. Prices include parts
        and labour unless stated otherwise.
      </p>
    ),
  },
  {
    number: "4",
    title: "Approval and Consent",
    body: (
      <p>
        By leaving a Device with us you confirm you are the legal owner or have
        the owner&apos;s permission to authorise Repair. We may refuse service
        where ownership is in doubt or where a Device appears to be stolen.
      </p>
    ),
  },
  {
    number: "5",
    title: "Turnaround Times",
    body: (
      <p>
        Turnaround times quoted are estimates only and not guaranteed. We are
        not liable for delays caused by parts availability, third-party
        suppliers, or the discovery of additional faults. We will keep you
        informed of any expected delays.
      </p>
    ),
  },
  {
    number: "6",
    title: "Warranty",
    body: (
      <p>
        All repairs are covered by a 12-month warranty on parts and labour from
        the date of Repair, unless stated otherwise on your receipt. The
        warranty does not cover: accidental damage, liquid damage after
        Repair, software issues, unauthorised modifications, or damage caused
        by third parties.
      </p>
    ),
  },
  {
    number: "7",
    title: "Liquid Damage",
    body: (
      <p>
        Liquid-damaged Devices are repaired on a best-effort basis only.
        Corrosion may continue to cause faults after Repair, and we cannot
        guarantee long-term reliability. The diagnosis fee for liquid damage
        is non-refundable.
      </p>
    ),
  },
  {
    number: "8",
    title: "Data and Backups",
    body: (
      <p>
        The Customer is responsible for backing up all data before Repair. We
        are not liable for any data loss during diagnosis, Repair, or software
        reinstallation. Where possible we will attempt to preserve data but no
        guarantees are given.
      </p>
    ),
  },
  {
    number: "9",
    title: "HDD / SSD and Storage",
    body: (
      <p>
        Hard drives and SSDs may fail at any time, particularly during
        diagnostic stress tests. We are not liable for storage failures that
        occur during Repair. We strongly recommend data is backed up before
        any storage-related work is undertaken.
      </p>
    ),
  },
  {
    number: "10",
    title: "Unclaimed Devices",
    body: (
      <p>
        Devices must be collected within 30 days of being notified that the
        Repair is complete. Devices left unclaimed for more than 90 days may be
        sold or recycled to recover Repair and storage costs. We will make
        reasonable efforts to contact you before disposing of any Device.
      </p>
    ),
  },
  {
    number: "11",
    title: "Non-Refundable Fees",
    body: (
      <p>
        Diagnostic fees, liquid-damage fees, and any labour already undertaken
        are non-refundable. Where a Repair cannot be completed due to parts
        unavailability or device condition, only the parts cost will be
        refunded — labour and diagnostic fees remain payable.
      </p>
    ),
  },
  {
    number: "12",
    title: "Payment Terms",
    body: (
      <p>
        Payment is due in full before the Device is returned. We accept cash,
        card payments, and major mobile payment methods. For business
        customers, credit terms may be available by prior arrangement.
      </p>
    ),
  },
  {
    number: "13",
    title: "Cancellation",
    body: (
      <p>
        You may cancel a Repair at any time before work has begun at no charge.
        If work has begun, you are liable for the cost of parts ordered and
        labour performed up to the point of cancellation.
      </p>
    ),
  },
  {
    number: "14",
    title: "Liability",
    body: (
      <p>
        Our maximum liability for any claim arising from a Repair is limited to
        the cost of the Repair or the value of the Device, whichever is lower.
        We are not liable for indirect or consequential losses, including loss
        of data, loss of business, or loss of profits.
      </p>
    ),
  },
  {
    number: "15",
    title: "Consumer Rights",
    body: (
      <p>
        Nothing in these Terms affects your statutory rights under the Consumer
        Rights Act 2015 or other applicable UK consumer-protection
        legislation.
      </p>
    ),
  },
  {
    number: "16",
    title: "Governing Law",
    body: (
      <p>
        These Terms are governed by the laws of Scotland. Any disputes will be
        subject to the exclusive jurisdiction of the Scottish courts.
      </p>
    ),
  },
  {
    number: "17",
    title: "Contact and Opening Hours",
    body: (
      <ul className="list-none space-y-1">
        <li>
          <strong>Address:</strong> 172 Trongate, Glasgow, UK
        </li>
        <li>
          <strong>Phone:</strong> +44 7777 200149
        </li>
        <li>
          <strong>Email:</strong> info@gadgetrepairsglasgow.co.uk
        </li>
        <li>
          <strong>Hours:</strong> Monday–Saturday 9:00 AM – 7:00 PM, Sunday
          10:30 AM – 5:30 PM
        </li>
      </ul>
    ),
  },
];

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: "12-Month Warranty",
    desc: "Every repair is covered for parts and labour for a full year.",
  },
  {
    icon: Clock,
    title: "Same-Day Service",
    desc: "Most repairs done while you wait — typically 30–90 minutes.",
  },
  {
    icon: HardDrive,
    title: "Your Data, Your Responsibility",
    desc: "Always back up before any repair. We can't be held liable for data loss.",
  },
  {
    icon: AlertTriangle,
    title: "Honest Pricing",
    desc: "Fixed quotes before work starts. No hidden fees, no surprises.",
  },
];

const CALLOUTS = [
  {
    icon: Droplets,
    title: "Liquid Damage",
    body: "Liquid-damaged devices are repaired on a best-effort basis. Corrosion may cause future faults. Diagnostic fees are non-refundable.",
  },
  {
    icon: HardDrive,
    title: "HDD / SSD Risk",
    body: "Storage drives may fail at any time, including during diagnostic tests. We strongly recommend backing up your data before any repair.",
  },
  {
    icon: Clock,
    title: "Unclaimed Devices",
    body: "Devices must be collected within 30 days of completion. Uncollected devices may be sold or recycled after 90 days to recover costs.",
  },
  {
    icon: AlertTriangle,
    title: "Non-Refundable Fees",
    body: "Diagnostic fees, liquid-damage fees, and any labour already undertaken are non-refundable.",
  },
];

export function TermsPage() {
  const branding = useNav((s) => s.branding);
  const goContact = useNav((s) => s.goContact);

  const phone = branding?.phone ?? "+44 7777 200149";
  const phoneDigits = telDigits(phone);
  const email = branding?.email ?? "info@gadgetrepairsglasgow.co.uk";

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <Section className="py-10 sm:py-14 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl space-y-4"
          >
            <Badge className="bg-orange-500/20 text-orange-300 border border-orange-400/30">
              Terms &amp; Conditions
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold">
              Terms &amp; Conditions
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              Please read these terms carefully before using our repair
              services. By booking a repair you accept these terms in full.
            </p>
            <p className="text-xs text-blue-200">
              Last updated: October 2025 · Effective from: October 2025
            </p>
          </motion.div>
        </Section>
      </section>

      {/* Highlight cards */}
      <Section className="py-8 sm:py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {HIGHLIGHTS.map((h) => (
            <Card key={h.title} className="border-zinc-200 h-full">
              <CardContent className="p-5 space-y-2">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <h.icon className="size-5" />
                </span>
                <p className="font-semibold text-blue-900 text-sm">{h.title}</p>
                <p className="text-xs text-zinc-600">{h.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Clauses */}
      <Section className="pb-10 sm:pb-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {CLAUSES.map((c) => (
            <motion.div
              key={c.number}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-zinc-200 h-full">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex size-8 items-center justify-center rounded-lg bg-blue-900 text-white font-bold text-sm">
                      {c.number}
                    </span>
                    <h2 className="font-bold text-blue-900 text-base">
                      {c.title}
                    </h2>
                  </div>
                  <div className="prose prose-sm max-w-none prose-p:text-zinc-700 prose-li:text-zinc-700 prose-strong:text-zinc-900">
                    {c.body}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Callout boxes */}
      <Section className="pb-10 sm:pb-12">
        <h2 className="text-lg sm:text-xl font-bold text-blue-900 mb-5">
          Important things to know
        </h2>
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          {CALLOUTS.map((c) => (
            <Card
              key={c.title}
              className="border-orange-200 bg-orange-50/40"
            >
              <CardContent className="p-5 flex items-start gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-orange-500 text-white shrink-0">
                  <c.icon className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-blue-900">{c.title}</p>
                  <p className="text-sm text-zinc-700 mt-1">{c.body}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="bg-blue-950 text-white">
        <Section className="py-10 sm:py-12 text-center">
          <FileText className="size-10 text-orange-400 mx-auto" />
          <h2 className="text-xl sm:text-2xl font-bold mt-3">
            Questions about our terms?
          </h2>
          <p className="text-blue-200 mt-2 max-w-xl mx-auto text-sm sm:text-base">
            We're happy to clarify anything before you book. Call us at{" "}
            <a
              href={`tel:${phoneDigits}`}
              className="text-orange-300 underline"
            >
              {phone}
            </a>{" "}
            or email{" "}
            <a
              href={`mailto:${email}`}
              className="text-orange-300 underline break-all"
            >
              {email}
            </a>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white h-11"
              onClick={() => goContact()}
            >
              <Mail className="size-4" />
              Contact Us
            </Button>
            <a href={`tel:${phoneDigits}`}>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent h-11"
              >
                <Phone className="size-4" />
                {phone}
              </Button>
            </a>
          </div>
        </Section>
      </section>
    </>
  );
}

export { TermsPage as default, TermsPage };
