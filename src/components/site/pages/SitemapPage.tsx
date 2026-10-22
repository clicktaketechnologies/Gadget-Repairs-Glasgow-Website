"use client";

import { motion } from "framer-motion";
import {
  Home, Wrench, Truck, Star, MessageSquare, ScanSearch,
  BookOpen, FileText, ShieldCheck, MapPin, Smartphone,
  Laptop, Tablet, Gamepad2, Monitor, Watch, Zap,
  ChevronRight, ExternalLink,
} from "lucide-react";
import { useNav } from "@/store/nav";
import { NavLink } from "../NavLink";
import { Section } from "../lib";
import { STATIC_SERVICES, type StaticService } from "../staticData";

const SERVICE_ICONS: Record<string, any> = {
  Smartphone, Laptop, Tablet, Gamepad2, Monitor, Watch, Zap,
};

export function SitemapPage({ services }: { services: StaticService[] }) {
  const goHome = useNav((s) => s.goHome);
  const svcList = services.length > 0 ? services : STATIC_SERVICES;

  const mainPages = [
    { icon: Home, label: "Home", desc: "Homepage with hero, featured services, reviews & blog previews", href: "/", nav: goHome },
    { icon: Wrench, label: "Services", desc: "All repair services with pricing & category filters", href: "/services", nav: useNav.getState().goServices },
    { icon: Truck, label: "Free Collection", desc: "Free doorstep collection & delivery across Glasgow", href: "/collection", nav: useNav.getState().goCollection },
    { icon: Star, label: "Reviews", desc: "Customer reviews & ratings — leave your own review", href: "/reviews", nav: useNav.getState().goReviews },
    { icon: MessageSquare, label: "Contact", desc: "Book a repair, get directions, view hours & contact details", href: "/contact", nav: useNav.getState().goContact },
    { icon: ScanSearch, label: "Track Repair", desc: "Track your repair status with your ticket ID (GD-XXXX)", href: "/track", nav: useNav.getState().goTrack },
    { icon: BookOpen, label: "Blog", desc: "Repair tips, guides & news from Glasgow's trusted repair shop", href: "/blog", nav: useNav.getState().goBlog },
  ];

  const legalPages = [
    { icon: ShieldCheck, label: "Privacy Policy", desc: "How we collect, use & protect your personal data (UK GDPR)", href: "/privacy", nav: useNav.getState().goPrivacy },
    { icon: FileText, label: "Terms & Conditions", desc: "Official T&C for repair services — 17 clauses", href: "/terms", nav: useNav.getState().goTerms },
    { icon: MapPin, label: "Sitemap", desc: "This page — all links on the site", href: "/sitemap", nav: useNav.getState().goSitemap },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-zinc-900 text-white">
        <div className="pointer-events-none absolute -right-20 top-0 size-96 rounded-full bg-orange-500/10 blur-3xl" />
        <Section className="relative py-10 sm:py-14 lg:py-20">
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1.5 text-xs text-blue-100 flex-wrap"
          >
            <NavLink href="/" onNavigate={goHome} className="hover:text-white">Home</NavLink>
            <ChevronRight className="size-3" />
            <span className="text-white">Sitemap</span>
          </motion.nav>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-5 flex items-center gap-4"
          >
            <span className="flex size-12 sm:size-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur shrink-0">
              <MapPin className="size-6 sm:size-7 text-orange-300" />
            </span>
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Sitemap</h1>
              <p className="mt-1 text-sm text-blue-100">All pages on Gadget Repairs Glasgow</p>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mt-4 max-w-2xl text-sm sm:text-base text-blue-50/90"
          >
            A complete index of every page on our website. Click any link to visit that page.
          </motion.p>
        </Section>
      </section>

      {/* Sitemap content */}
      <Section className="py-10 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-5xl space-y-10 sm:space-y-12">
          {/* Main Pages */}
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-zinc-900">Main Pages</h2>
            <p className="mt-1 text-sm text-zinc-500">Primary navigation pages of the website</p>
            <div className="mt-5 sm:mt-6 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mainPages.map((p, i) => (
                <motion.div
                  key={p.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <NavLink
                    href={p.href}
                    onNavigate={p.nav}
                    className="group flex h-full items-start gap-3 rounded-xl border border-zinc-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                      <p.icon className="size-5" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-zinc-900 group-hover:text-blue-700">{p.label}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">{p.desc}</p>
                      <p className="mt-2 text-[11px] font-medium text-blue-600">{p.href}</p>
                    </div>
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Service Pages */}
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-zinc-900">Repair Services</h2>
            <p className="mt-1 text-sm text-zinc-500">Individual service pages with pricing, FAQs & process details</p>
            <div className="mt-5 sm:mt-6 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {svcList.map((s, i) => {
                const Icon = SERVICE_ICONS[s.icon] || Wrench;
                return (
                  <motion.div
                    key={s.slug}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                  >
                    <NavLink
                      href={`/services/${s.slug}`}
                      onNavigate={() => useNav.getState().goServiceDetail(s.slug)}
                      className="group flex h-full flex-col rounded-xl border border-zinc-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                    >
                      <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                        <Icon className="size-5" />
                      </span>
                      <p className="mt-3 text-sm font-semibold text-zinc-900 group-hover:text-blue-700">{s.name}</p>
                      <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{s.description}</p>
                      <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3">
                        <span className="text-sm font-bold text-blue-700">{s.priceFrom}</span>
                        <span className="text-[10px] text-zinc-400">{s.turnaround}</span>
                      </div>
                    </NavLink>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Legal & Info Pages */}
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-zinc-900">Legal & Info</h2>
            <p className="mt-1 text-sm text-zinc-500">Policies, terms and site information</p>
            <div className="mt-5 sm:mt-6 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3">
              {legalPages.map((p, i) => (
                <motion.div
                  key={p.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <NavLink
                    href={p.href}
                    onNavigate={p.nav}
                    className="group flex h-full items-start gap-3 rounded-xl border border-zinc-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                      <p.icon className="size-5" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-zinc-900 group-hover:text-blue-700">{p.label}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">{p.desc}</p>
                      <p className="mt-2 text-[11px] font-medium text-blue-600">{p.href}</p>
                    </div>
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </div>

          {/* XML Sitemap + External Links */}
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-zinc-900">XML Sitemap & External</h2>
            <p className="mt-1 text-sm text-zinc-500">For search engines and external resources</p>
            <div className="mt-5 sm:mt-6 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
              <a
                href="/sitemap.xml"
                className="group flex items-start gap-3 rounded-xl border border-zinc-100 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <FileText className="size-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-zinc-900 group-hover:text-blue-700 flex items-center gap-1">
                    sitemap.xml <ExternalLink className="size-3" />
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">XML sitemap for search engines (Google, Bing, etc.)</p>
                </div>
              </a>
              <a
                href="https://g.co/kgs/DKcPKfJ"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 rounded-xl border border-zinc-100 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <MapPin className="size-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-zinc-900 group-hover:text-blue-700 flex items-center gap-1">
                    Google Business Profile <ExternalLink className="size-3" />
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">Our Google Maps listing & reviews</p>
                </div>
              </a>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-900 p-6 sm:p-8 text-center text-white">
            <h3 className="text-xl sm:text-2xl font-bold">Need a repair?</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm sm:text-base text-blue-50/90">
              Book online, call us, or visit our shop at 172 Trongate, Glasgow.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <NavLink
                href="/contact"
                onNavigate={() => useNav.getState().goContact()}
                className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 min-h-11"
              >
                <MessageSquare className="size-4" /> Book a Repair
              </NavLink>
              <a
                href="tel:+447777200149"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 min-h-11"
              >
                Call +44 7777 200149
              </a>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
