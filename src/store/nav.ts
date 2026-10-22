"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
export { makeToken, verifyToken } from "@/lib/token";

// ---------- Route types ----------

export type PublicPage =
  | "home"
  | "services"
  | "service-detail"
  | "collection"
  | "reviews"
  | "contact"
  | "track"
  | "blog"
  | "blog-detail"
  | "privacy"
  | "terms"
  | "sitemap";

export type AdminPage =
  | "admin-login"
  | "admin-overview"
  | "admin-bookings"
  | "admin-walkin"
  | "admin-services"
  | "admin-reviews"
  | "admin-content"
  | "admin-branding"
  | "admin-blog"
  | "admin-pages"
  | "admin-email"
  | "admin-code"
  | "admin-settings";

export type Route =
  | { kind: "public"; page: PublicPage; param?: string }
  | { kind: "admin"; page: AdminPage };

// ---------- Path <-> route mapping ----------

export const PUBLIC_PATHS: Record<PublicPage, string> = {
  home: "/",
  services: "/services",
  "service-detail": "/services/:slug",
  collection: "/collection",
  reviews: "/reviews",
  contact: "/contact",
  track: "/track",
  blog: "/blog",
  "blog-detail": "/blog/:slug",
  privacy: "/privacy",
  terms: "/terms",
  sitemap: "/sitemap",
};

export function routeToPath(route: Route): string {
  if (route.kind === "admin") {
    if (route.page === "admin-login") return "/admin";
    const sub = route.page.replace(/^admin-/, "");
    return `/admin/${sub}`;
  }
  switch (route.page) {
    case "home":
      return "/";
    case "service-detail":
      return `/services/${route.param ?? ""}`;
    case "blog-detail":
      return `/blog/${route.param ?? ""}`;
    default:
      return PUBLIC_PATHS[route.page];
  }
}

export function pathToRoute(pathname: string): Route {
  const path = pathname.split("?")[0].replace(/\/+$/, "");
  const parts = path.split("/").filter(Boolean);

  // /admin or /admin/...
  if (parts[0] === "admin") {
    if (parts.length === 1) return { kind: "admin", page: "admin-login" };
    const sub = parts.slice(1).join("-");
    const adminPage = `admin-${sub}` as AdminPage;
    const validAdmin: AdminPage[] = [
      "admin-login",
      "admin-overview",
      "admin-bookings",
      "admin-walkin",
      "admin-services",
      "admin-reviews",
      "admin-content",
      "admin-branding",
      "admin-blog",
      "admin-pages",
      "admin-email",
      "admin-code",
      "admin-settings",
    ];
    if (validAdmin.includes(adminPage)) {
      return { kind: "admin", page: adminPage };
    }
    return { kind: "admin", page: "admin-login" };
  }

  if (parts.length === 0) return { kind: "public", page: "home" };

  if (parts[0] === "services") {
    if (parts.length === 1) return { kind: "public", page: "services" };
    return { kind: "public", page: "service-detail", param: parts[1] };
  }
  if (parts[0] === "blog") {
    if (parts.length === 1) return { kind: "public", page: "blog" };
    return { kind: "public", page: "blog-detail", param: parts[1] };
  }
  if (parts[0] === "collection") return { kind: "public", page: "collection" };
  if (parts[0] === "reviews") return { kind: "public", page: "reviews" };
  if (parts[0] === "contact") return { kind: "public", page: "contact" };
  if (parts[0] === "track") return { kind: "public", page: "track" };
  if (parts[0] === "privacy") return { kind: "public", page: "privacy" };
  if (parts[0] === "terms") return { kind: "public", page: "terms" };
  if (parts[0] === "sitemap") return { kind: "public", page: "sitemap" };

  return { kind: "public", page: "home" };
}

export function getInitialRoute(): Route {
  if (typeof window === "undefined") {
    return { kind: "public", page: "home" };
  }
  return pathToRoute(window.location.pathname);
}

/** Install popstate listener that re-syncs store route from URL. Returns unsubscribe. */
export function installUrlSync(): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => {
    const next = pathToRoute(window.location.pathname);
    const cur = useNav.getState().route;
    if (JSON.stringify(cur) !== JSON.stringify(next)) {
      useNav.setState({ route: next });
    }
  };
  window.addEventListener("popstate", handler);
  return () => window.removeEventListener("popstate", handler);
}

// ---------- Branding / Settings types ----------

export interface Branding {
  id?: string;
  businessName: string;
  tagline: string;
  about: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  phone: string;
  whatsapp?: string | null;
  email: string;
  website?: string | null;
  gmbProfile?: string | null;
  mapLink?: string | null;
  mapEmbed?: string | null;
  address: string;
  hoursJson?: string | null;
  socialsJson?: string | null;
  targetAreasJson?: string | null;
  rating?: number;
  reviewCount?: number;
  yearsExperience?: number;
}

export interface SiteSettings {
  id?: string;
  collectionEnabled?: boolean;
  collectionBannerEnabled?: boolean;
  announcementEnabled?: boolean;
  announcementText?: string | null;
  ticketIdVisible?: boolean;
  customHeaderCode?: string | null;
  customFooterCode?: string | null;
}

// ---------- Store ----------

interface NavState {
  route: Route;
  branding: Branding | null;
  settings: SiteSettings | null;
  adminToken: string | null;
  adminEmail: string | null;
  mobileNavOpen: boolean;
  bootstrapDone: boolean;

  setBootstrap: (b: Branding | null, s: SiteSettings | null) => void;
  setAdminAuth: (token: string, email: string) => void;
  clearAdminAuth: () => void;
  setMobileNavOpen: (open: boolean) => void;
  navigate: (route: Route) => void;

  goHome: () => void;
  goServices: () => void;
  goServiceDetail: (slug: string) => void;
  goCollection: () => void;
  goReviews: () => void;
  goContact: () => void;
  goTrack: () => void;
  goBlog: () => void;
  goBlogDetail: (slug: string) => void;
  goPrivacy: () => void;
  goTerms: () => void;
  goSitemap: () => void;
  goAdmin: (page?: AdminPage) => void;
  goPublic: () => void;
}

export const useNav = create<NavState>()(
  persist(
    (set, get) => ({
      route:
        typeof window !== "undefined"
          ? getInitialRoute()
          : { kind: "public", page: "home" },
      branding: null,
      settings: null,
      adminToken: null,
      adminEmail: null,
      mobileNavOpen: false,
      bootstrapDone: false,

      setBootstrap: (branding, settings) =>
        set({ branding, settings, bootstrapDone: true }),

      setAdminAuth: (token, email) =>
        set({ adminToken: token, adminEmail: email }),

      clearAdminAuth: () => set({ adminToken: null, adminEmail: null }),

      setMobileNavOpen: (open) => set({ mobileNavOpen: open }),

      navigate: (route) => {
        set({ route, mobileNavOpen: false });
        if (typeof window !== "undefined") {
          const path = routeToPath(route);
          if (window.location.pathname !== path) {
            window.history.pushState({}, "", path);
          }
          window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        }
      },

      goHome: () => get().navigate({ kind: "public", page: "home" }),
      goServices: () => get().navigate({ kind: "public", page: "services" }),
      goServiceDetail: (slug) =>
        get().navigate({ kind: "public", page: "service-detail", param: slug }),
      goCollection: () => get().navigate({ kind: "public", page: "collection" }),
      goReviews: () => get().navigate({ kind: "public", page: "reviews" }),
      goContact: () => get().navigate({ kind: "public", page: "contact" }),
      goTrack: () => get().navigate({ kind: "public", page: "track" }),
      goBlog: () => get().navigate({ kind: "public", page: "blog" }),
      goBlogDetail: (slug) =>
        get().navigate({ kind: "public", page: "blog-detail", param: slug }),
      goPrivacy: () => get().navigate({ kind: "public", page: "privacy" }),
      goTerms: () => get().navigate({ kind: "public", page: "terms" }),
      goSitemap: () => get().navigate({ kind: "public", page: "sitemap" }),
      goAdmin: (page) => {
        const token = get().adminToken;
        const target: AdminPage = token ? (page ?? "admin-overview") : "admin-login";
        get().navigate({ kind: "admin", page: target });
      },
      goPublic: () => get().navigate({ kind: "public", page: "home" }),
    }),
    {
      name: "grg-admin-auth",
      // Only persist admin auth fields.
      partialize: (state) => ({
        adminToken: state.adminToken,
        adminEmail: state.adminEmail,
      }),
    }
  )
);
