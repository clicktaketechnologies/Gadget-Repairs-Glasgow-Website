"use client";

import { useEffect } from "react";
import { useNav, type PublicPage } from "@/store/nav";

interface PageMeta {
  title: string;
  description: string;
  path: string;
}

const SITE_URL = "https://www.gadgetrepairsglasgow.co.uk";
const DEFAULT_TITLE = "Gadget Repairs Glasgow";
const DEFAULT_DESCRIPTION =
  "Professional mobile phone, MacBook, laptop, GHD, tablet, game console, computer & smart watch repair in Glasgow. 12-month warranty, free collection, same-day service. Visit us at 172 Trongate.";

export const PAGE_META: Record<PublicPage, PageMeta> = {
  home: {
    title: "Gadget Repairs Glasgow | Phone, MacBook, Laptop & Console Repair",
    description:
      "Glasgow's trusted repair shop at 172 Trongate. Same-day phone, MacBook, laptop, GHD, tablet, console, computer & smart watch repair. 12-month warranty, free doorstep collection. Call +44 7777 200149.",
    path: "/",
  },
  services: {
    title: "Repair Services & Pricing | Gadget Repairs Glasgow",
    description:
      "Full range of phone, tablet, MacBook, laptop, GHD, game console, computer & smart watch repair services in Glasgow. Transparent pricing, 12-month warranty.",
    path: "/services",
  },
  "service-detail": {
    title: "Repair Service | Gadget Repairs Glasgow",
    description:
      "Professional repair service at Gadget Repairs Glasgow. Transparent pricing, same-day turnaround, 12-month warranty.",
    path: "/services",
  },
  collection: {
    title: "Free Doorstep Collection | Gadget Repairs Glasgow",
    description:
      "Can't come to us? We'll come to you. Free doorstep collection and delivery across Glasgow for repair services. Book online today.",
    path: "/collection",
  },
  reviews: {
    title: "Customer Reviews | Gadget Repairs Glasgow",
    description:
      "Read what 150+ happy Glasgow customers say about our repair service. 4.9★ average rating. Leave your own review.",
    path: "/reviews",
  },
  contact: {
    title: "Contact Us | Gadget Repairs Glasgow",
    description:
      "Visit us at 172 Trongate, Glasgow, UK. Call +44 7777 200149 or email info@gadgetrepairsglasgow.co.uk. Open Mon–Sat 9am–7pm, Sun 10:30am–5:30pm.",
    path: "/contact",
  },
  track: {
    title: "Track Your Repair | Gadget Repairs Glasgow",
    description:
      "Enter your ticket ID (GD-XXXX) to track the status of your repair in real time.",
    path: "/track",
  },
  blog: {
    title: "Repair Tips & Guides | Gadget Repairs Glasgow Blog",
    description:
      "Expert repair guides, tips and news from Glasgow's trusted repair shop.",
    path: "/blog",
  },
  "blog-detail": {
    title: "Blog | Gadget Repairs Glasgow",
    description:
      "Repair guides and tips from Glasgow's trusted repair shop at 172 Trongate.",
    path: "/blog",
  },
  privacy: {
    title: "Privacy Policy | Gadget Repairs Glasgow",
    description:
      "How Gadget Repairs Glasgow collects, uses, and protects your personal data. UK GDPR compliant.",
    path: "/privacy",
  },
  terms: {
    title: "Terms & Conditions | Gadget Repairs Glasgow",
    description:
      "Terms and conditions for repair services provided by Gadget Repairs Glasgow.",
    path: "/terms",
  },
  sitemap: {
    title: "Sitemap | Gadget Repairs Glasgow",
    description:
      "Complete sitemap of all pages on the Gadget Repairs Glasgow website — services, blog, reviews, contact and more.",
    path: "/sitemap",
  },
};

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]'
  );
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function SeoHead() {
  const route = useNav((s) => s.route);
  const branding = useNav((s) => s.branding);

  useEffect(() => {
    if (route.kind !== "public") return;
    const meta = PAGE_META[route.page];
    if (!meta) return;

    let title = meta.title;
    let description = meta.description;
    let path = meta.path;

    if (route.page === "service-detail" && route.param) {
      path = `/services/${route.param}`;
      title = `${DEFAULT_TITLE} — Service`;
    }
    if (route.page === "blog-detail" && route.param) {
      path = `/blog/${route.param}`;
      title = `${DEFAULT_TITLE} — Blog`;
    }

    const businessName = branding?.businessName ?? DEFAULT_TITLE;
    if (route.page === "home") {
      title = `${businessName} | Phone, MacBook, Laptop & Console Repair`;
    }

    document.title = title;
    setMeta("name", "description", description);
    setCanonical(`${SITE_URL}${path}`);

    // Open Graph
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", `${SITE_URL}${path}`);
    setMeta("property", "og:type", "article");
    setMeta("property", "og:site_name", businessName);

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
  }, [route, branding]);

  return null;
}

export { SeoHead as default, SeoHead };
