"use client";

import { useState } from "react";
import { useNav } from "@/store/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Search,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Music2,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "./NavLink";
import { STATIC_SERVICES } from "./staticData";
import { telDigits, parseJson } from "./lib";

interface Social {
  name: string;
  url: string;
}

export function Footer() {
  const branding = useNav((s) => s.branding);
  const goTrack = useNav((s) => s.goTrack);
  const goServices = useNav((s) => s.goServices);

  const [ticketInput, setTicketInput] = useState("");

  const businessName = branding?.businessName ?? "Gadget Repairs Glasgow";
  const logoUrl = branding?.logoUrl || "/logo.jpg";
  const phone = branding?.phone ?? "+44 7777 200149";
  const phoneDigits = telDigits(phone);
  const email = branding?.email ?? "info@gadgetrepairsglasgow.co.uk";
  const address = branding?.address ?? "172 Trongate, Glasgow, UK";
  const hours: { day: string; hours: string }[] = parseJson(
    branding?.hoursJson,
    []
  );
  const socials: Social[] = parseJson(branding?.socialsJson, []);
  const areas: string[] = parseJson(branding?.targetAreasJson, []);

  const socialIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("facebook")) return Facebook;
    if (n.includes("instagram")) return Instagram;
    if (n.includes("youtube")) return Youtube;
    if (n.includes("linkedin")) return Linkedin;
    if (n.includes("tiktok")) return Music2;
    return Facebook;
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;
    goTrack();
  };

  return (
    <footer className="mt-auto bg-blue-950 text-zinc-300">
      {/* Top CTA strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <h3 className="text-white text-xl sm:text-2xl font-bold">
              Got a broken device? Let's fix it today.
            </h3>
            <p className="text-zinc-400 text-sm mt-1">
              Same-day repairs, 12-month warranty, free Glasgow collection.
              Walk in or book online.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:justify-end">
            <a href={`tel:${phoneDigits}`}>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent h-11"
              >
                <Phone className="size-4" />
                Call Now
              </Button>
            </a>
            <NavLink href="/contact">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white h-11">
                Book Repair
              </Button>
            </NavLink>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
        {/* Business info */}
        <div className="space-y-4">
          <NavLink href="/" className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt={`${businessName} logo`}
              className="size-12 rounded-lg object-cover ring-1 ring-white/10 bg-white"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://placehold.co/80x80/1b4f8e/ffffff?text=GRG";
              }}
            />
            <div className="leading-tight">
              <p className="font-bold text-white text-base">{businessName}</p>
              <p className="text-[11px] text-zinc-400">
                {branding?.tagline?.slice(0, 60) ?? "Professional Repairs"}
              </p>
            </div>
          </NavLink>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {branding?.about?.slice(0, 180) ?? ""}
            {branding && branding.about && branding.about.length > 180 ? "…" : ""}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-orange-400 font-bold text-lg">
              {branding?.rating ?? 4.9}
            </span>
            <div className="flex" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className="size-4 fill-orange-400 text-orange-400"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.4L12 17l-6.3 4.6L8 13.6 2 9.4h7.6z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-zinc-400 ml-1">
              ({branding?.reviewCount ?? 150} reviews)
            </span>
          </div>

          {/* Socials */}
          {socials.length > 0 && (
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              {socials.map((s) => {
                const Icon = socialIcon(s.name);
                return (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="size-10 rounded-full bg-white/10 hover:bg-orange-500 text-white inline-flex items-center justify-center transition-colors"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">
            Quick Links
          </h4>
          <ul className="space-y-1 text-sm">
            {[
              { href: "/", label: "Home" },
              { href: "/services", label: "All Services" },
              { href: "/collection", label: "Free Collection" },
              { href: "/reviews", label: "Reviews" },
              { href: "/blog", label: "Blog & Guides" },
              { href: "/track", label: "Track Your Repair" },
              { href: "/contact", label: "Contact Us" },
            ].map((l) => (
              <li key={l.href}>
                <NavLink
                  href={l.href}
                  className="inline-flex items-center gap-1 text-zinc-400 hover:text-orange-400 transition-colors min-h-9 py-1"
                >
                  <ChevronRight className="size-3" />
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Repairs list */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">
            Repairs We Do
          </h4>
          <ul className="space-y-1 text-sm">
            {STATIC_SERVICES.map((s) => (
              <li key={s.id}>
                <NavLink
                  href={`/services/${s.slug}`}
                  className="inline-flex items-center gap-1 text-zinc-400 hover:text-orange-400 transition-colors min-h-9 py-1"
                >
                  <ChevronRight className="size-3" />
                  {s.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + hours + tracker */}
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="size-4 mt-0.5 text-orange-400 shrink-0" />
                <span className="text-zinc-400">{address}</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="size-4 mt-0.5 text-orange-400 shrink-0" />
                <a
                  href={`tel:${phoneDigits}`}
                  className="text-zinc-400 hover:text-orange-400 min-h-9 inline-flex items-center py-1 -my-1"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="size-4 mt-0.5 text-orange-400 shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="text-zinc-400 hover:text-orange-400 break-all min-h-9 inline-flex items-center py-1 -my-1"
                >
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="size-4 mt-0.5 text-orange-400 shrink-0" />
                <div className="text-zinc-400">
                  {hours.length > 0 ? (
                    <span>
                      {hours[0].hours}
                      <br />
                      <span className="text-xs text-zinc-500">
                        {hours[0].day} – {hours[5]?.day ?? "Saturday"}
                      </span>
                    </span>
                  ) : (
                    "Mon–Sat 9am–7pm, Sun 10:30am–5:30pm"
                  )}
                </div>
              </li>
            </ul>
          </div>

          {/* Mini ticket tracker */}
          <form
            onSubmit={handleTrack}
            className="bg-white/5 rounded-lg p-3 ring-1 ring-white/10"
          >
            <label
              htmlFor="footer-track"
              className="text-xs font-medium text-zinc-300 flex items-center gap-1.5 mb-2"
            >
              <Search className="size-3.5" />
              Track your repair
            </label>
            <div className="flex gap-2">
              <Input
                id="footer-track"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value.toUpperCase())}
                placeholder="GD-1024"
                className="bg-white/10 border-white/10 text-white placeholder:text-zinc-500 h-10 min-w-0 flex-1"
              />
              <Button
                type="submit"
                size="sm"
                aria-label="Track repair"
                className="bg-orange-500 hover:bg-orange-600 text-white h-10 shrink-0 px-3"
              >
                <Search className="size-4" />
                <span className="hidden sm:inline ml-1">Track</span>
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Areas served */}
      {areas.length > 0 && (
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">
              Areas We Serve
            </p>
            <div className="flex flex-wrap gap-2">
              {areas.map((a) => (
                <span
                  key={a}
                  className="text-xs px-2.5 py-1 rounded-full bg-white/5 ring-1 ring-white/10 text-zinc-300"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} {businessName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <NavLink
              href="/privacy"
              className="hover:text-orange-400 transition-colors min-h-9 inline-flex items-center"
            >
              Privacy Policy
            </NavLink>
            <NavLink
              href="/terms"
              className="hover:text-orange-400 transition-colors min-h-9 inline-flex items-center"
            >
              Terms &amp; Conditions
            </NavLink>
            <NavLink
              href="/sitemap"
              onNavigate={() => useNav.getState().goSitemap()}
              className="hover:text-orange-400 transition-colors min-h-9 inline-flex items-center"
            >
              Sitemap
            </NavLink>
            <span className="hidden sm:inline text-zinc-500">|</span>
            <a
              href="https://clicktaketech.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-400 transition-colors min-h-9 inline-flex items-center"
            >
              Powered by ClickTake Technologies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer as default, Footer };
