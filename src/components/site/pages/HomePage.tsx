"use client";

import { useEffect, useState } from "react";
import { useNav } from "@/store/nav";
import { motion } from "framer-motion";
import {
  Phone,
  ShieldCheck,
  Clock,
  Truck,
  Star,
  ArrowRight,
  CalendarClock,
  MapPin,
  ChevronRight,
  Wrench,
  Zap,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "@/components/site/NavLink";
import { Section } from "@/components/site/Section";
import { ServiceIcon, serviceIconBg } from "@/components/site/ServiceIcon";
import { StarRating } from "@/components/site/StarRating";
import { STATIC_SERVICES, STATIC_REVIEWS, STATIC_POSTS } from "../staticData";
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

export function ServiceCard({ service }: { service: Service }) {
  const goServiceDetail = useNav((s) => s.goServiceDetail);
  const goContact = useNav((s) => s.goContact);
  const branding = useNav((s) => s.branding);
  const phone = branding?.phone ?? "+44 7777 200149";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
    >
      <Card className="group h-full overflow-hidden hover:shadow-xl transition-shadow border-zinc-200 hover:border-blue-300">
        <CardContent className="p-5 flex flex-col h-full gap-4">
          <div className="flex items-start justify-between gap-3">
            <div
              className={cn(
                "inline-flex size-12 items-center justify-center rounded-xl ring-1",
                serviceIconBg(service.icon)
              )}
            >
              <ServiceIcon name={service.icon} className="size-6" />
            </div>
            {service.popular && (
              <Badge className="bg-orange-500 hover:bg-orange-500 text-white border-0">
                Popular
              </Badge>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-blue-900 text-lg leading-snug">
              {service.name}
            </h3>
            <p className="text-sm text-zinc-600 mt-1.5 line-clamp-3">
              {service.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-zinc-50 p-2">
              <p className="text-zinc-500">Price from</p>
              <p className="font-bold text-blue-800 text-sm">
                {service.priceFrom ?? "Quote"}
                {service.priceTo ? (
                  <span className="text-zinc-400 font-normal">
                    {" "}
                    – {service.priceTo}
                  </span>
                ) : null}
              </p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-2">
              <p className="text-zinc-500">Turnaround</p>
              <p className="font-semibold text-zinc-700 text-sm">
                {service.turnaround ?? "Same day"}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <NavLink
              href={`/services/${service.slug}`}
              className="flex-1"
            >
              <Button
                variant="outline"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 h-10 sm:h-9"
                size="sm"
              >
                View Details
                <ChevronRight className="size-4" />
              </Button>
            </NavLink>
            <Button
              size="sm"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white h-10 sm:h-9"
              onClick={() => goContact()}
            >
              <Wrench className="size-4" />
              Book this repair
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface HomePageProps {
  services: Service[];
}

export function HomePage({ services }: HomePageProps) {
  const branding = useNav((s) => s.branding);
  const goContact = useNav((s) => s.goContact);
  const goServices = useNav((s) => s.goServices);
  const goReviews = useNav((s) => s.goReviews);
  const goCollection = useNav((s) => s.goCollection);
  const goBlog = useNav((s) => s.goBlog);
  const goServiceDetail = useNav((s) => s.goServiceDetail);

  const businessName = branding?.businessName ?? "Gadget Repairs Glasgow";
  const phone = branding?.phone ?? "+44 7777 200149";
  const phoneDigits = telDigits(phone);
  const rating = branding?.rating ?? 4.9;
  const reviewCount = branding?.reviewCount ?? 150;
  const years = branding?.yearsExperience ?? 10;

  const featured = services.filter((s) => s.popular).slice(0, 4);
  const list = featured.length ? featured : services.slice(0, 4);

  const [quickQuote, setQuickQuote] = useState({
    device: "",
    model: "",
    issue: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleQuickQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => goContact(), 700);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" aria-hidden>
          <div className="absolute -top-20 -right-20 size-80 rounded-full bg-orange-500 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 size-96 rounded-full bg-blue-400 blur-3xl" />
        </div>
        <Section className="relative py-10 sm:py-14 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-5 sm:space-y-6"
            >
              <Badge className="bg-orange-500/20 text-orange-300 border border-orange-400/30 backdrop-blur">
                ⭐ #1 Repair Shop in Glasgow
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                Phone, MacBook &amp; Gadget Repair{" "}
                <span className="text-orange-400">in Glasgow</span>
              </h1>
              <p className="text-blue-100 text-base sm:text-lg max-w-xl">
                {branding?.tagline ??
                  "Professional Mobile Phone & Tablet Repair, Unlocking, and Accessories"}
                . Same-day service, 12-month warranty, free doorstep collection
                across Glasgow.
              </p>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <StarRating value={rating} size={20} />
                  <span className="font-bold text-orange-400">{rating}</span>
                  <span className="text-blue-200 text-sm">
                    / 5 ({reviewCount}+ reviews)
                  </span>
                </div>
                <span className="text-blue-300">•</span>
                <span className="inline-flex items-center gap-1.5 text-blue-100 text-sm">
                  <BadgeCheck className="size-4 text-orange-400" />
                  {years}+ years experience
                </span>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto"
                  onClick={() => goContact()}
                >
                  <Wrench className="size-5" />
                  Book a Repair
                </Button>
                <a href={`tel:${phoneDigits}`} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 bg-transparent w-full sm:w-auto"
                  >
                    <Phone className="size-5" />
                    {phone}
                  </Button>
                </a>
                <NavLink href="/collection" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 bg-transparent w-full sm:w-auto"
                  >
                    <Truck className="size-5" />
                    Free Collection
                  </Button>
                </NavLink>
              </div>

              <div className="flex flex-wrap gap-4 pt-4 text-xs text-blue-200">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="size-4 text-orange-400" />
                  12-Month Warranty
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-4 text-orange-400" />
                  Same-Day Service
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-4 text-orange-400" />
                  172 Trongate, Glasgow
                </span>
              </div>
            </motion.div>

            {/* 60-second quote widget */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white text-zinc-800 rounded-2xl shadow-2xl p-5 sm:p-6 lg:p-8 ring-1 ring-black/5"
            >
              <div className="flex items-center gap-2 mb-1">
                <Zap className="size-5 text-orange-500" />
                <h2 className="text-lg font-bold text-blue-900">
                  Get a Quote in 60 Seconds
                </h2>
              </div>
              <p className="text-sm text-zinc-500 mb-4">
                Tell us what's broken — we'll give you a fixed price.
              </p>

              {!submitted ? (
                <form
                  onSubmit={handleQuickQuote}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-xs font-medium text-zinc-700 mb-1 block">
                      Device type
                    </label>
                    <select
                      required
                      value={quickQuote.device}
                      onChange={(e) =>
                        setQuickQuote((s) => ({ ...s, device: e.target.value }))
                      }
                      className="w-full h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    >
                      <option value="">Select device…</option>
                      <option value="Mobile Phone">Mobile Phone</option>
                      <option value="MacBook">MacBook</option>
                      <option value="Laptop">Laptop</option>
                      <option value="Tablet / iPad">Tablet / iPad</option>
                      <option value="Game Console">Game Console</option>
                      <option value="Desktop PC">Desktop PC</option>
                      <option value="Smart Watch">Smart Watch</option>
                      <option value="GHD Straightener">GHD Straightener</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-700 mb-1 block">
                      Model
                    </label>
                    <input
                      required
                      value={quickQuote.model}
                      onChange={(e) =>
                        setQuickQuote((s) => ({ ...s, model: e.target.value }))
                      }
                      placeholder="e.g. iPhone 14 Pro"
                      className="w-full h-10 rounded-md border border-zinc-300 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-700 mb-1 block">
                      What's wrong with it?
                    </label>
                    <textarea
                      required
                      value={quickQuote.issue}
                      onChange={(e) =>
                        setQuickQuote((s) => ({ ...s, issue: e.target.value }))
                      }
                      placeholder="e.g. Cracked screen, won't charge…"
                      rows={3}
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Get My Free Quote
                    <ArrowRight className="size-4" />
                  </Button>
                </form>
              ) : (
                <div className="py-6 text-center">
                  <div className="size-12 rounded-full bg-emerald-100 text-emerald-700 inline-flex items-center justify-center mx-auto mb-3">
                    <BadgeCheck className="size-6" />
                  </div>
                  <p className="font-semibold text-zinc-900">
                    Thanks! Redirecting you to booking…
                  </p>
                  <p className="text-sm text-zinc-500 mt-1">
                    We'll get you a fixed price quote in seconds.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </Section>
      </section>

      {/* Trust badges */}
      <Section className="py-6 sm:py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              icon: Clock,
              title: "Same-Day Service",
              desc: "Most repairs in 30–90 mins",
            },
            {
              icon: ShieldCheck,
              title: "12-Month Warranty",
              desc: "Parts & labour covered",
            },
            {
              icon: Truck,
              title: "Free Collection",
              desc: "Across Glasgow",
            },
            {
              icon: BadgeCheck,
              title: `${years}+ Years Experience`,
              desc: "Trusted by 10,000+ customers",
            },
          ].map((b) => (
            <div
              key={b.title}
              className="flex items-center gap-3 rounded-xl bg-blue-50 p-3 ring-1 ring-blue-100"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-blue-600 text-white shrink-0">
                <b.icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-blue-900 text-sm">{b.title}</p>
                <p className="text-xs text-zinc-600 truncate">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Featured services */}
      <Section className="py-10 sm:py-12 lg:py-16">
        <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <Badge className="bg-blue-50 text-blue-700 border border-blue-100">
              Our Services
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mt-2">
              Featured Repairs
            </h2>
            <p className="text-zinc-600 mt-1 max-w-2xl">
              Eight professional repair services for every gadget — phones,
              MacBooks, laptops, tablets, consoles, computers, smart watches and
              GHD straighteners.
            </p>
          </div>
          <NavLink href="/services" className="hidden sm:block">
            <Button variant="outline" className="border-blue-200 text-blue-700">
              View all services
              <ArrowRight className="size-4" />
            </Button>
          </NavLink>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {list.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
        <div className="mt-6 sm:hidden">
          <NavLink href="/services">
            <Button
              variant="outline"
              className="w-full border-blue-200 text-blue-700"
            >
              View all services
              <ArrowRight className="size-4" />
            </Button>
          </NavLink>
        </div>
      </Section>

      {/* Collection preview */}
      <section className="bg-blue-950 text-white py-10 sm:py-14 lg:py-20">
        <Section>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <Badge className="bg-orange-500/20 text-orange-300 border border-orange-400/30">
                Free Doorstep Collection
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold">
                Can't come to us? We'll come to you.
              </h2>
              <p className="text-blue-100 text-base">
                Book a free doorstep collection anywhere in Glasgow. We'll pick
                up your device, fix it, and deliver it back — all at no extra
                cost.
              </p>
              <ul className="space-y-2 text-blue-100 text-sm">
                {[
                  "Free collection & delivery across Glasgow city centre",
                  "Same-day or next-day turnaround",
                  "Live tracking from booking to delivery",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <BadgeCheck className="size-4 text-orange-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <NavLink href="/collection">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Learn about collection
                    <ArrowRight className="size-4" />
                  </Button>
                </NavLink>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="grid grid-cols-2 gap-3"
            >
              {[
                { icon: CalendarClock, title: "1. Book Online", desc: "Choose collection date & time" },
                { icon: Truck, title: "2. We Collect", desc: "Free pickup at your door" },
                { icon: Wrench, title: "3. We Repair", desc: "Same-day turnaround" },
                { icon: BadgeCheck, title: "4. We Deliver", desc: "Free return delivery" },
              ].map((s) => (
                <div
                  key={s.title}
                  className="bg-white/5 ring-1 ring-white/10 rounded-xl p-4"
                >
                  <s.icon className="size-6 text-orange-400" />
                  <p className="font-semibold text-white text-sm mt-2">
                    {s.title}
                  </p>
                  <p className="text-xs text-blue-200">{s.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </Section>
      </section>

      {/* Reviews preview */}
      <Section className="py-10 sm:py-12 lg:py-16">
        <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <Badge className="bg-orange-50 text-orange-600 border border-orange-100">
              Customer Reviews
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mt-2">
              Loved by Glasgow
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <StarRating value={rating} size={18} />
              <span className="font-bold text-blue-900">{rating}</span>
              <span className="text-sm text-zinc-600">
                from {reviewCount}+ happy customers
              </span>
            </div>
          </div>
          <NavLink href="/reviews" className="hidden sm:block">
            <Button variant="outline" className="border-blue-200 text-blue-700">
              Read all reviews
              <ArrowRight className="size-4" />
            </Button>
          </NavLink>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STATIC_REVIEWS.slice(0, 3).map((r) => (
            <Card key={r.id} className="border-zinc-200">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-blue-600 text-white inline-flex items-center justify-center font-bold text-sm">
                      {r.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900 text-sm">
                        {r.author}
                      </p>
                      <p className="text-xs text-zinc-500">{r.device}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {r.source}
                  </Badge>
                </div>
                <StarRating value={r.rating} size={14} />
                <p className="text-sm text-zinc-700 line-clamp-4">
                  {r.comment}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Contact CTA */}
      <section className="bg-orange-500 text-white">
        <Section className="py-8 sm:py-10 lg:py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">
                Ready to get your device fixed?
              </h2>
              <p className="text-orange-100 mt-1">
                Walk in to 172 Trongate, Glasgow — or book online and we'll
                collect for free.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <a href={`tel:${phoneDigits}`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                >
                  <Phone className="size-5" />
                  {phone}
                </Button>
              </a>
              <Button
                size="lg"
                className="bg-blue-900 hover:bg-blue-950 text-white"
                onClick={() => goContact()}
              >
                <Wrench className="size-5" />
                Book Online
              </Button>
            </div>
          </div>
        </Section>
      </section>

      {/* Blog preview */}
      <Section className="py-10 sm:py-12 lg:py-16">
        <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <Badge className="bg-blue-50 text-blue-700 border border-blue-100">
              Repair Blog
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mt-2">
              Guides &amp; Tips
            </h2>
          </div>
          <NavLink href="/blog" className="hidden sm:block">
            <Button variant="outline" className="border-blue-200 text-blue-700">
              Read the blog
              <ArrowRight className="size-4" />
            </Button>
          </NavLink>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STATIC_POSTS.map((p) => (
            <NavLink key={p.id} href={`/blog/${p.slug}`}>
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow border-zinc-200 group">
                <div className="aspect-[16/10] overflow-hidden bg-zinc-100">
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-4">
                  <Badge
                    variant="outline"
                    className="text-[10px] mb-2 border-blue-200 text-blue-700"
                  >
                    {p.category}
                  </Badge>
                  <h3 className="font-semibold text-blue-900 text-sm leading-snug line-clamp-3">
                    {p.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-2 line-clamp-2">
                    {p.excerpt}
                  </p>
                </CardContent>
              </Card>
            </NavLink>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <Section className="py-10 sm:py-14 lg:py-20 text-center">
          <Star className="size-8 text-orange-400 mx-auto" />
          <h2 className="text-2xl sm:text-4xl font-bold mt-3">
            Glasgow's most trusted repair shop
          </h2>
          <p className="text-blue-100 mt-3 max-w-2xl mx-auto">
            Walk in today at 172 Trongate, Glasgow — or book online and get free
            doorstep collection. Same-day service, 12-month warranty on every
            repair.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => goContact()}
            >
              <Wrench className="size-5" />
              Book a Repair
            </Button>
            <a href={`tel:${phoneDigits}`}>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                <Phone className="size-5" />
                Call {phone}
              </Button>
            </a>
          </div>
        </Section>
      </section>
    </>
  );
}

export { HomePage as default, HomePage };
