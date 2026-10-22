import type { Metadata } from "next";
import { AppShell } from "@/components/site/AppShell";
import { db } from "@/lib/db";

const SITE_URL = "https://www.gadgetrepairsglasgow.co.uk";

const PATH_META: Record<string, { title: string; description: string }> = {
  services: {
    title: "Repair Services & Pricing | Gadget Repairs Glasgow",
    description: "Full range of phone, tablet, MacBook, laptop, GHD, game console, computer & smart watch repair services in Glasgow. Transparent pricing, 12-month warranty.",
  },
  collection: {
    title: "Free Doorstep Collection | Gadget Repairs Glasgow",
    description: "Can't come to us? We'll come to you. Free doorstep collection and delivery across Glasgow for repair services. Book online today.",
  },
  reviews: {
    title: "Customer Reviews | Gadget Repairs Glasgow",
    description: "Read what 150+ happy Glasgow customers say about our repair service. 4.9★ average rating. Leave your own review.",
  },
  contact: {
    title: "Contact Us | Gadget Repairs Glasgow",
    description: "Visit us at 172 Trongate, Glasgow, UK. Call +44 7777 200149 or email info@gadgetrepairsglasgow.co.uk. Open Mon–Sat 9am–7pm, Sun 10:30am–5:30pm.",
  },
  track: {
    title: "Track Your Repair | Gadget Repairs Glasgow",
    description: "Enter your ticket ID (GD-XXXX) to track the status of your repair in real time.",
  },
  blog: {
    title: "Repair Tips & Guides | Gadget Repairs Glasgow Blog",
    description: "Expert repair guides, tips and news from Glasgow's trusted repair shop.",
  },
  privacy: {
    title: "Privacy Policy | Gadget Repairs Glasgow",
    description: "How Gadget Repairs Glasgow collects, uses, and protects your personal data. UK GDPR compliant.",
  },
  terms: {
    title: "Terms & Conditions | Gadget Repairs Glasgow",
    description: "Terms and conditions for repair services provided by Gadget Repairs Glasgow.",
  },
  sitemap: {
    title: "Sitemap | Gadget Repairs Glasgow",
    description: "Complete sitemap of all pages — services, blog, reviews, contact, legal and more.",
  },
};

async function getServiceName(slug: string): Promise<string | null> {
  try {
    const s = await db.service.findUnique({ where: { slug } });
    return s?.name ?? null;
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const path = slug.join("/");
  const seg0 = slug[0];
  let title = "Gadget Repairs Glasgow";
  let description = "Professional repair services in Glasgow.";

  if (slug.length === 1 && PATH_META[seg0]) {
    title = PATH_META[seg0].title;
    description = PATH_META[seg0].description;
  } else if (slug.length === 2 && seg0 === "services") {
    const name = await getServiceName(slug[1]);
    if (name) {
      title = `${name} in Glasgow | Gadget Repairs Glasgow`;
      description = `${name} at Gadget Repairs Glasgow on Trongate. Professional repair, fair pricing and 12-month warranty.`;
    }
  }

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${path}` },
    openGraph: { title, description, url: `${SITE_URL}/${path}`, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function generateStaticParams() {
  return [
    { slug: ["services"] },
    { slug: ["collection"] },
    { slug: ["reviews"] },
    { slug: ["contact"] },
    { slug: ["track"] },
    { slug: ["blog"] },
    { slug: ["privacy"] },
    { slug: ["terms"] },
    { slug: ["sitemap"] },
  ];
}

export default function CatchAllPage() {
  return <AppShell />;
}
