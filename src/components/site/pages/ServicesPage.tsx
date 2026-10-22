"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Wrench, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/site/Section";
import { ServiceCard } from "./HomePage";
import { STATIC_SERVICES } from "../staticData";
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

interface ServicesPageProps {
  services: Service[];
}

export function ServicesPage({ services }: ServicesPageProps) {
  const branding = useNav((s) => s.branding);
  const goContact = useNav((s) => s.goContact);

  const phone = branding?.phone ?? "+44 7777 200149";
  const phoneDigits = telDigits(phone);

  const list = services.length ? services : (STATIC_SERVICES as Service[]);

  const categories = Array.from(
    new Set(list.map((s) => s.category))
  ).sort();
  const [activeCat, setActiveCat] = useState<string>("All");
  const [query, setQuery] = useState("");

  const filtered = list.filter((s) => {
    const catOk = activeCat === "All" || s.category === activeCat;
    const q = query.trim().toLowerCase();
    const qOk =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q);
    return catOk && qOk;
  });

  const grouped =
    activeCat === "All"
      ? categories.map((cat) => ({
          cat,
          items: filtered.filter((s) => s.category === cat),
        }))
      : [{ cat: activeCat, items: filtered }];

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
              Our Services
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold mt-3">
              Repair Services &amp; Pricing
            </h1>
            <p className="text-blue-100 mt-2 max-w-2xl text-sm sm:text-base">
              From cracked iPhone screens to liquid-damaged MacBooks, we fix
              every gadget. Transparent pricing, 30-day warranty, fast
              service.
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <a href={`tel:${phoneDigits}`} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent w-full sm:w-auto h-11"
                >
                  <Phone className="size-4" />
                  {phone}
                </Button>
              </a>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto h-11"
                onClick={() => goContact()}
              >
                <Wrench className="size-4" />
                Book a Repair
              </Button>
            </div>
          </motion.div>
        </Section>
      </section>

      {/* Filter + search */}
      <Section className="py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
          <div className="flex flex-wrap gap-2">
            {["All", ...categories].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActiveCat(c)}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-full transition-colors min-h-9",
                  activeCat === c
                    ? "bg-blue-700 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services…"
              className="pl-9 h-10"
            />
          </div>
        </div>
      </Section>

      {/* Services by category */}
      <Section className="pb-12 sm:pb-16 space-y-10 sm:space-y-12">
        {grouped.map(({ cat, items }) => (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-5">
              <ChevronRight className="size-5 text-orange-500" />
              <h2 className="text-xl font-bold text-blue-900">{cat}</h2>
              <span className="text-sm text-zinc-500">
                ({items.length} service{items.length !== 1 ? "s" : ""})
              </span>
            </div>
            {items.length === 0 ? (
              <p className="text-zinc-500 text-sm">
                No services match your search.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((s) => (
                  <ServiceCard key={s.id} service={s} />
                ))}
              </div>
            )}
          </div>
        ))}
      </Section>
    </>
  );
}

export { ServicesPage as default, ServicesPage };
