"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Phone,
  Wrench,
  Clock,
  ShieldCheck,
  Wallet,
  Truck,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Section } from "@/components/site/Section";
import { ServiceIcon, serviceIconBg } from "@/components/site/ServiceIcon";
import { NavLink } from "@/components/site/NavLink";
import { STATIC_SERVICES } from "../staticData";
import { getServiceContent, iconFor } from "../serviceContent";
import { useNav } from "@/store/nav";
import { telDigits } from "../lib";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  priceFrom: string | null;
  priceTo: string | null;
  turnaround: string | null;
  popular: boolean;
  active: boolean;
  sortOrder: number;
}

interface ServiceDetailPageProps {
  slug: string;
  services: Service[];
}

export function ServiceDetailPage({ slug, services }: ServiceDetailPageProps) {
  const branding = useNav((s) => s.branding);
  const goContact = useNav((s) => s.goContact);
  const goServices = useNav((s) => s.goServices);

  const phone = branding?.phone ?? "+44 7777 200149";
  const phoneDigits = telDigits(phone);

  // Instant from static list, refresh from API later
  const [service, setService] = useState<Service | undefined>(() => {
    const fromList = services.find((s) => s.slug === slug);
    if (fromList) return fromList;
    return (STATIC_SERVICES as Service[]).find((s) => s.slug === slug);
  });

  useEffect(() => {
    fetch(`/api/public/services/${slug}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.service) setService(data.service as Service);
      })
      .catch(() => {});
  }, [slug]);

  if (!service) {
    return (
      <Section className="py-20 text-center">
        <h1 className="text-2xl font-bold text-blue-900">Service not found</h1>
        <p className="text-zinc-600 mt-2">
          We couldn't find that repair service.
        </p>
        <div className="mt-4">
          <Button onClick={() => goServices()} variant="outline">
            Back to all services
          </Button>
        </div>
      </Section>
    );
  }

  const content = getServiceContent(service.slug);

  const related = (STATIC_SERVICES as Service[])
    .filter((s) => s.slug !== service.slug && s.active)
    .slice(0, 3);

  return (
    <>
      {/* Breadcrumb + hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <Section className="py-8 sm:py-12 lg:py-14">
          <nav className="flex items-center gap-1.5 text-xs text-blue-200 mb-4 flex-wrap">
            <NavLink href="/" className="hover:text-orange-300">
              Home
            </NavLink>
            <ChevronRight className="size-3" />
            <NavLink href="/services" className="hover:text-orange-300">
              Services
            </NavLink>
            <ChevronRight className="size-3" />
            <span className="text-white truncate">{service.name}</span>
          </nav>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start"
          >
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-start gap-4">
                <span
                  className={cn(
                    "inline-flex size-14 sm:size-16 items-center justify-center rounded-2xl ring-1 bg-white/10 ring-white/20 shrink-0"
                  )}
                >
                  <ServiceIcon name={service.icon} className="size-7 sm:size-8 text-white" />
                </span>
                <div className="min-w-0">
                  {service.popular && (
                    <Badge className="bg-orange-500 text-white border-0">
                      Popular
                    </Badge>
                  )}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-1 leading-tight">
                    {service.name}
                  </h1>
                </div>
              </div>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg max-w-2xl">
                {content.tagline}
              </p>
              <p className="text-blue-200 text-xs sm:text-sm max-w-2xl">{content.intro}</p>
            </div>

            {/* Price card */}
            <Card className="bg-white text-zinc-900 shadow-2xl border-0">
              <CardContent className="p-5 space-y-4">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">
                    Price from
                  </p>
                  <p className="text-3xl font-extrabold text-blue-900">
                    {service.priceFrom ?? "Quote"}
                    {service.priceTo ? (
                      <span className="text-zinc-400 text-lg font-normal">
                        {" "}
                        – {service.priceTo}
                      </span>
                    ) : null}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Clock className="size-4 text-orange-500" />
                  Turnaround: <strong className="text-zinc-900">{service.turnaround ?? "Fast turnaround"}</strong>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <ShieldCheck className="size-4 text-orange-500" />
                  30-day warranty
                </div>
                <div className="pt-2 space-y-2">
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11"
                    onClick={() => goContact()}
                  >
                    <Wrench className="size-4" />
                    Book this repair
                  </Button>
                  <a href={`tel:${phoneDigits}`} className="block">
                    <Button
                      variant="outline"
                      className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 h-11"
                    >
                      <Phone className="size-4" />
                      Call {phone}
                    </Button>
                  </a>
                </div>
                <p className="text-[11px] text-zinc-500 text-center">
                  Free Glasgow collection &amp; delivery available.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </Section>
      </section>

      {/* Features strip */}
      <Section className="py-6 sm:py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {content.features.map((f) => {
            const Icon = iconFor(f.icon);
            return (
              <div
                key={f.title}
                className="rounded-xl bg-blue-50 ring-1 ring-blue-100 p-3 sm:p-4 text-center"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-blue-600 text-white mb-2">
                  <Icon className="size-5" />
                </span>
                <p className="font-semibold text-blue-900 text-sm">{f.title}</p>
                <p className="text-xs text-zinc-600 mt-1">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Common issues */}
      <Section className="py-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <Badge className="bg-orange-50 text-orange-600 border border-orange-100">
            Common Issues
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mt-2">
            What we fix
          </h2>
          <p className="text-zinc-600 mt-2">
            The most common faults we repair for {service.name.toLowerCase()}.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {content.commonIssues.map((issue) => {
            const Icon = iconFor(issue.icon);
            return (
              <Card key={issue.title} className="border-zinc-200 h-full">
                <CardContent className="p-4 space-y-2">
                  <span
                    className={cn(
                      "inline-flex size-10 items-center justify-center rounded-lg ring-1",
                      serviceIconBg(issue.icon)
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <h3 className="font-semibold text-zinc-900 text-sm">
                    {issue.title}
                  </h3>
                  <p className="text-xs text-zinc-600">{issue.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Devices pills */}
      <Section className="py-8">
        <Card className="border-zinc-200 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-blue-600 text-white border-0">Devices</Badge>
              <h2 className="text-lg font-bold text-blue-900">
                Brands &amp; models we service
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {content.devices.map((d) => (
                <span
                  key={d}
                  className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-white ring-1 ring-blue-100 text-zinc-700"
                >
                  {d}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* Pricing table */}
      <Section className="py-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <Badge className="bg-blue-50 text-blue-700 border border-blue-100">
            Transparent Pricing
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mt-2">
            {service.name} pricing
          </h2>
          <p className="text-zinc-600 mt-2">
            Fixed prices — no hidden fees. Prices include parts &amp; labour.
          </p>
        </div>
        <Card className="border-zinc-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="text-left font-semibold px-4 py-3">Device</th>
                  <th className="text-left font-semibold px-4 py-3">Repair</th>
                  <th className="text-right font-semibold px-4 py-3">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {content.pricingTable.map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {row.device}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">{row.repair}</td>
                    <td className="px-4 py-3 text-right font-bold text-blue-700">
                      {row.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="text-xs text-zinc-500 mt-3 text-center">
          Prices are indicative — we'll confirm a fixed quote before any work
          starts. All repairs carry a 30-day warranty.
        </p>
      </Section>

      {/* Process timeline */}
      <section className="bg-blue-950 text-white">
        <Section className="py-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge className="bg-orange-500/20 text-orange-300 border border-orange-400/30">
              How It Works
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              Our 4-step repair process
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {content.processSteps.map((s) => {
              const Icon = iconFor(s.icon);
              return (
                <div
                  key={s.step}
                  className="bg-white/5 ring-1 ring-white/10 rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-lg bg-orange-500 text-white">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-3xl font-extrabold text-white/20">
                      {s.step}
                    </span>
                  </div>
                  <p className="font-semibold text-white">{s.title}</p>
                  <p className="text-xs text-blue-200 mt-1">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </Section>
      </section>

      {/* FAQ */}
      <Section className="py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Badge className="bg-blue-50 text-blue-700 border border-blue-100">
              FAQ
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mt-2">
              Frequently asked questions
            </h2>
            <p className="text-zinc-600 mt-2 text-sm">
              Still have questions? Call us at{" "}
              <a
                href={`tel:${phoneDigits}`}
                className="text-blue-700 font-medium underline"
              >
                {phone}
              </a>
              .
            </p>
          </div>
          <div className="lg:col-span-2">
            <Accordion type="single" collapsible className="w-full">
              {content.faq.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base font-medium text-zinc-900">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-600 text-sm leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Section>

      {/* Trust row */}
      <Section className="py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: ShieldCheck, label: "12-Month Warranty" },
            { icon: Wallet, label: "Best Glasgow Prices" },
            { icon: Truck, label: "Free Collection" },
            { icon: BadgeCheck, label: "10+ Years Trusted" },
          ].map((b) => (
            <div
              key={b.label}
              className="flex items-center gap-2 rounded-lg bg-zinc-50 p-3 ring-1 ring-zinc-200"
            >
              <b.icon className="size-5 text-orange-500" />
              <span className="text-sm font-medium text-zinc-800">
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Related */}
      <Section className="py-12">
        <h2 className="text-xl font-bold text-blue-900 mb-4">
          Other services you might need
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {related.map((r) => (
            <NavLink key={r.id} href={`/services/${r.slug}`}>
              <Card className="border-zinc-200 hover:shadow-md transition-shadow h-full">
                <CardContent className="p-4 flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex size-10 items-center justify-center rounded-lg ring-1",
                      serviceIconBg(r.icon)
                    )}
                  >
                    <ServiceIcon name={r.icon} className="size-5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-zinc-900 text-sm truncate">
                      {r.name}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      From {r.priceFrom ?? "quote"}
                    </p>
                  </div>
                  <ArrowRight className="size-4 text-blue-600" />
                </CardContent>
              </Card>
            </NavLink>
          ))}
        </div>
      </Section>

      {/* CTA band */}
      <section className="bg-orange-500 text-white">
        <Section className="py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Ready to book your {service.name.toLowerCase()}?
              </h2>
              <p className="text-orange-100 text-sm mt-1">
                Walk in to 172 Trongate, Glasgow, or book online for free
                collection.
              </p>
            </div>
            <div className="flex gap-3">
              <a href={`tel:${phoneDigits}`}>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                >
                  <Phone className="size-4" />
                  Call us
                </Button>
              </a>
              <Button
                className="bg-blue-900 hover:bg-blue-950 text-white"
                onClick={() => goContact()}
              >
                <Wrench className="size-4" />
                Book this repair
              </Button>
            </div>
          </div>
        </Section>
      </section>
    </>
  );
}

export { ServiceDetailPage as default, ServiceDetailPage };
