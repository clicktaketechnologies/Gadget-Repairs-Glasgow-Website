"use client";

import { useEffect, useState } from "react";
import { useNav } from "@/store/nav";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { STATIC_SERVICES, type StaticService } from "./staticData";
import { HomePage } from "./pages/HomePage";
import { ServicesPage } from "./pages/ServicesPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { CollectionPage } from "./pages/CollectionPage";
import { ReviewsPage } from "./pages/ReviewsPage";
import { ContactPage } from "./pages/ContactPage";
import { TrackPage } from "./pages/TrackPage";
import { BlogPage } from "./pages/BlogPage";
import { BlogDetailPage } from "./pages/BlogDetailPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { SitemapPage } from "./pages/SitemapPage";

export type Service = StaticService;

export function PublicSite() {
  const route = useNav((s) => s.route);

  // Initial services from static data so first paint isn't blank
  const [services, setServices] = useState<Service[]>(
    STATIC_SERVICES as Service[]
  );

  useEffect(() => {
    fetch("/api/public/services", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.services) && data.services.length) {
          setServices(data.services as Service[]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900">
      <Header />
      <main className="flex-1">
        {route.kind === "public" &&
          (route.page === "home" ? (
            <HomePage services={services} />
          ) : route.page === "services" ? (
            <ServicesPage services={services} />
          ) : route.page === "service-detail" ? (
            <ServiceDetailPage slug={route.param ?? ""} services={services} />
          ) : route.page === "collection" ? (
            <CollectionPage />
          ) : route.page === "reviews" ? (
            <ReviewsPage />
          ) : route.page === "contact" ? (
            <ContactPage />
          ) : route.page === "track" ? (
            <TrackPage />
          ) : route.page === "blog" ? (
            <BlogPage />
          ) : route.page === "blog-detail" ? (
            <BlogDetailPage slug={route.param ?? ""} />
          ) : route.page === "privacy" ? (
            <PrivacyPage />
          ) : route.page === "terms" ? (
            <TermsPage />
          ) : route.page === "sitemap" ? (
            <SitemapPage services={services} />
          ) : (
            <HomePage services={services} />
          ))}
      </main>
      <Footer />
    </div>
  );
}

export { PublicSite as default, PublicSite };
