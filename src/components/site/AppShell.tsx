"use client";

import { useEffect } from "react";
import { useNav, installUrlSync, type Branding, type SiteSettings } from "@/store/nav";
import "@/lib/firebase"; // side-effect: analytics
import { STATIC_BRANDING, STATIC_SETTINGS } from "./staticData";
import { SeoHead } from "@/components/seo/SeoHead";
import { PublicSite } from "./PublicSite";
import { AdminApp } from "@/components/admin/AdminApp";

export function AppShell() {
  const route = useNav((s) => s.route);
  const setBootstrap = useNav((s) => s.setBootstrap);
  const branding = useNav((s) => s.branding);
  const settings = useNav((s) => s.settings);

  // 1. Static bootstrap immediately so the UI is never blank.
  useEffect(() => {
    if (!branding || !settings) {
      setBootstrap(
        STATIC_BRANDING as Branding,
        STATIC_SETTINGS as SiteSettings
      );
    }
    // 2. Then try the live bootstrap API to override with DB data if available.
    fetch("/api/public/bootstrap", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && (data.branding || data.settings)) {
          setBootstrap(data.branding ?? null, data.settings ?? null);
        }
      })
      .catch(() => {
        // ignore – static fallback is already set
      });
  }, []);

  // Install popstate URL sync once.
  useEffect(() => {
    const off = installUrlSync();
    return off;
  }, []);

  return (
    <>
      <SeoHead />
      {route.kind === "admin" ? <AdminApp /> : <PublicSite />}
    </>
  );
}

export { AppShell as default, AppShell };
