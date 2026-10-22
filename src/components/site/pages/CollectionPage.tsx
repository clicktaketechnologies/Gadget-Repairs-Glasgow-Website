"use client";

import { motion } from "framer-motion";
import {
  CalendarClock,
  Truck,
  Wrench,
  BadgeCheck,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/site/Section";
import { useNav } from "@/store/nav";
import { STATIC_BRANDING } from "../staticData";
import { parseJson, telDigits } from "../lib";

export function CollectionPage() {
  const branding = useNav((s) => s.branding);
  const goContact = useNav((s) => s.goContact);

  const phone = branding?.phone ?? "+44 7777 200149";
  const phoneDigits = telDigits(phone);
  const areas: string[] = parseJson(
    branding?.targetAreasJson ?? STATIC_BRANDING.targetAreasJson,
    []
  );

  const steps = [
    {
      icon: CalendarClock,
      title: "1. Book Online",
      desc: "Choose your device, issue and a collection time slot that suits you. Takes 2 minutes.",
    },
    {
      icon: Truck,
      title: "2. We Collect Free",
      desc: "Our driver comes to your home or office anywhere in Glasgow — completely free of charge.",
    },
    {
      icon: Wrench,
      title: "3. Fast Repair",
      desc: "We diagnose, repair and test your device — most repairs done most cases fast turnaround.",
    },
    {
      icon: BadgeCheck,
      title: "4. Free Return Delivery",
      desc: "We deliver your fixed device back to your door, with a 30-day warranty.",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <Section className="py-10 sm:py-14 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl space-y-4 sm:space-y-5"
          >
            <Badge className="bg-orange-500/20 text-orange-300 border border-orange-400/30">
              Free Doorstep Collection
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Can't come to us?{" "}
              <span className="text-orange-400">We'll come to you.</span>
            </h1>
            <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
              Free doorstep collection and delivery anywhere in Glasgow. Just
              book online, and we'll pick up your broken device, fix it, and
              bring it back — all at no extra cost.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto h-12"
                onClick={() => goContact()}
              >
                <Wrench className="size-5" />
                Book Free Collection
              </Button>
              <a href={`tel:${phoneDigits}`} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent w-full sm:w-auto h-12"
                >
                  <Phone className="size-5" />
                  {phone}
                </Button>
              </a>
            </div>
          </motion.div>
        </Section>
      </section>

      {/* How it works */}
      <Section className="py-10 sm:py-12 lg:py-16">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <Badge className="bg-blue-50 text-blue-700 border border-blue-100">
            How It Works
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mt-2">
            Collection in 4 simple steps
          </h2>
          <p className="text-zinc-600 mt-2 text-sm sm:text-base">
            From booking to delivery — we make getting your device fixed
            effortless.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Card className="border-zinc-200 h-full">
                <CardContent className="p-5 space-y-3">
                  <span className="inline-flex size-12 items-center justify-center rounded-xl bg-orange-500 text-white">
                    <s.icon className="size-6" />
                  </span>
                  <h3 className="font-semibold text-blue-900">{s.title}</h3>
                  <p className="text-sm text-zinc-600">{s.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Areas served */}
      <section className="bg-blue-950 text-white">
        <Section className="py-10 sm:py-14">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="bg-orange-500/20 text-orange-300 border border-orange-400/30">
                Areas We Cover
              </Badge>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mt-3">
                Free collection across Glasgow
              </h2>
              <p className="text-blue-100 mt-2 text-sm sm:text-base">
                Our driver covers all of Glasgow city centre and surrounding
                areas. If your area isn't listed, give us a call — we'll do our
                best to help.
              </p>
              <div className="mt-5">
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white h-11"
                  onClick={() => goContact()}
                >
                  <Wrench className="size-4" />
                  Book Collection
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {areas.map((a) => (
                <span
                  key={a}
                  className="px-3 py-1.5 min-h-9 inline-flex items-center text-sm rounded-full bg-white/10 ring-1 ring-white/15 text-blue-100"
                >
                  <MapPin className="inline size-3 mr-1 -mt-0.5" />
                  {a}
                </span>
              ))}
            </div>
          </div>
        </Section>
      </section>

      {/* Why collection */}
      <Section className="py-10 sm:py-12 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {[
            {
              icon: Truck,
              title: "100% Free",
              desc: "No collection fee, no delivery fee. Just pay for the repair — that's it.",
            },
            {
              icon: Wrench,
              title: "Same-Day Turnaround",
              desc: "Most repairs done most cases fast turnaround. We'll text you when your device is ready.",
            },
            {
              icon: BadgeCheck,
              title: "Fully Insured",
              desc: "Your device is fully insured from pickup to delivery. Total peace of mind.",
            },
          ].map((b) => (
            <Card key={b.title} className="border-zinc-200 h-full">
              <CardContent className="p-6 space-y-3">
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <b.icon className="size-6" />
                </span>
                <h3 className="font-semibold text-blue-900 text-lg">{b.title}</h3>
                <p className="text-sm text-zinc-600">{b.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="bg-orange-500 text-white">
        <Section className="py-8 sm:py-10 lg:py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Ready to book your free collection?
          </h2>
          <p className="text-orange-100 mt-2 text-sm sm:text-base">
            Book online in 2 minutes — we'll be at your door.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-5">
            <Button
              size="lg"
              className="bg-blue-900 hover:bg-blue-950 text-white w-full sm:w-auto h-12"
              onClick={() => goContact()}
            >
              <Wrench className="size-5" />
              Book Online Now
            </Button>
            <a href={`tel:${phoneDigits}`} className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-transparent w-full sm:w-auto h-12"
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

export { CollectionPage as default, CollectionPage };
