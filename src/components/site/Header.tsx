"use client";

import { useState } from "react";
import { useNav } from "@/store/nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Menu,
  Phone,
  CalendarClock,
  Search,
  ChevronDown,
  X,
  Wrench,
} from "lucide-react";
import { NavLink } from "./NavLink";
import { ServiceIcon, serviceIconBg } from "./ServiceIcon";
import { STATIC_SERVICES } from "./staticData";
import { telDigits } from "./lib";
import { cn } from "@/lib/utils";

export function Header() {
  const route = useNav((s) => s.route);
  const branding = useNav((s) => s.branding);
  const settings = useNav((s) => s.settings);
  const setMobileNavOpen = useNav((s) => s.setMobileNavOpen);
  const mobileNavOpen = useNav((s) => s.mobileNavOpen);
  const goServices = useNav((s) => s.goServices);
  const goServiceDetail = useNav((s) => s.goServiceDetail);
  const goContact = useNav((s) => s.goContact);
  const goTrack = useNav((s) => s.goTrack);

  const [servicesOpen, setServicesOpen] = useState(false);
  const [announceOpen, setAnnounceOpen] = useState(true);

  const businessName = branding?.businessName ?? "Gadget Repairs Glasgow";
  const logoUrl = branding?.logoUrl || "/logo.jpg";
  const phone = branding?.phone ?? "+44 7777 200149";
  const phoneDigits = telDigits(phone);
  const showAnnouncement =
    settings?.announcementEnabled &&
    settings?.announcementText &&
    announceOpen;

  const isActive = (page: string) =>
    route.kind === "public" && route.page === page;

  // Announcement stays dismissed until the user reloads the page.

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Announcement bar */}
      {showAnnouncement && (
        <div className="bg-orange-500 text-white text-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
            <p className="truncate font-medium text-xs sm:text-sm">{settings!.announcementText}</p>
            <button
              type="button"
              aria-label="Dismiss announcement"
              onClick={() => setAnnounceOpen(false)}
              className="shrink-0 inline-flex min-h-9 min-w-9 items-center justify-center rounded hover:bg-white/20 p-1.5 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="bg-blue-900 text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="hidden sm:inline-flex items-center gap-1">
              <CalendarClock className="size-3.5" />
              <span>Open Mon–Sat 9am–7pm, Sun 10:30am–5:30pm</span>
            </span>
            <span className="sm:hidden truncate">Glasgow's #1 Repair Shop</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden md:inline">{branding?.address ?? "172 Trongate, Glasgow, UK"}</span>
            <a
              href={`tel:${phoneDigits}`}
              className="inline-flex items-center gap-1 font-medium hover:text-orange-300 min-h-9 py-1 -my-1"
            >
              <Phone className="size-3.5" />
              {phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo + name */}
            <NavLink
              href="/"
              className="flex items-center gap-3 shrink-0"
              ariaLabel={`${businessName} home`}
            >
              <img
                src={logoUrl}
                alt={`${businessName} logo`}
                className="size-10 rounded-lg object-contain ring-1 ring-blue-100 bg-white"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://placehold.co/80x80/1b4f8e/ffffff?text=GRG";
                }}
              />
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="font-bold text-blue-900 text-base">
                  {businessName}
                </span>
                <span className="text-[11px] text-zinc-500">
                  {branding?.tagline?.slice(0, 60) ?? "Professional Repairs"}
                </span>
              </div>
            </NavLink>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <NavLink
                href="/"
                active={isActive("home")}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive("home")
                    ? "text-blue-700 bg-blue-50"
                    : "text-zinc-700 hover:text-blue-700 hover:bg-blue-50"
                )}
              >
                Home
              </NavLink>

              {/* Services dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive("services") || isActive("service-detail")
                      ? "text-blue-700 bg-blue-50"
                      : "text-zinc-700 hover:text-blue-700 hover:bg-blue-50"
                  )}
                  aria-expanded={servicesOpen}
                  aria-haspopup="true"
                >
                  Services
                  <ChevronDown className="size-3.5" />
                </button>
                {servicesOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50">
                    <div className="w-[640px] bg-white rounded-xl shadow-xl ring-1 ring-zinc-200 p-3 grid grid-cols-2 gap-1">
                      <NavLink
                        href="/services"
                        className="col-span-2 mb-1 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 rounded-md"
                      >
                        View All Services →
                      </NavLink>
                      {STATIC_SERVICES.map((s) => (
                        <NavLink
                          key={s.id}
                          href={`/services/${s.slug}`}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-zinc-50"
                        >
                          <span
                            className={cn(
                              "inline-flex size-9 items-center justify-center rounded-lg ring-1",
                              serviceIconBg(s.icon)
                            )}
                          >
                            <ServiceIcon name={s.icon} className="size-4.5" />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-sm font-medium text-zinc-900 truncate">
                              {s.name}
                            </span>
                            <span className="block text-xs text-zinc-500 truncate">
                              {s.priceFrom && s.priceTo
                                ? `${s.priceFrom} – ${s.priceTo}`
                                : s.priceFrom ?? "Quote"}
                            </span>
                          </span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <NavLink
                href="/collection"
                active={isActive("collection")}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive("collection")
                    ? "text-blue-700 bg-blue-50"
                    : "text-zinc-700 hover:text-blue-700 hover:bg-blue-50"
                )}
              >
                Collection
              </NavLink>
              <NavLink
                href="/blog"
                active={isActive("blog") || isActive("blog-detail")}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive("blog") || isActive("blog-detail")
                    ? "text-blue-700 bg-blue-50"
                    : "text-zinc-700 hover:text-blue-700 hover:bg-blue-50"
                )}
              >
                Blog
              </NavLink>
              <NavLink
                href="/reviews"
                active={isActive("reviews")}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive("reviews")
                    ? "text-blue-700 bg-blue-50"
                    : "text-zinc-700 hover:text-blue-700 hover:bg-blue-50"
                )}
              >
                Reviews
              </NavLink>
              <NavLink
                href="/track"
                active={isActive("track")}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive("track")
                    ? "text-blue-700 bg-blue-50"
                    : "text-zinc-700 hover:text-blue-700 hover:bg-blue-50"
                )}
              >
                Track
              </NavLink>
              <NavLink
                href="/contact"
                active={isActive("contact")}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive("contact")
                    ? "text-blue-700 bg-blue-50"
                    : "text-zinc-700 hover:text-blue-700 hover:bg-blue-50"
                )}
              >
                Contact
              </NavLink>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Ticket tracker widget (desktop) */}
              <button
                type="button"
                onClick={() => goTrack()}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-md transition-colors min-h-9"
              >
                <Search className="size-4" />
                <span className="hidden xl:inline">Track Ticket</span>
              </button>

              <a href={`tel:${phoneDigits}`} className="contents">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 h-10 sm:h-9"
                >
                  <Phone className="size-4" />
                  <span className="hidden md:inline">Call</span>
                </Button>
              </a>

              <Button
                size="sm"
                onClick={() => goContact()}
                className="bg-orange-500 hover:bg-orange-600 text-white h-10 sm:h-9"
              >
                <Wrench className="size-4" />
                <span className="hidden sm:inline">Book Repair</span>
                <span className="sm:hidden">Book</span>
              </Button>

              {/* Mobile menu trigger */}
              <Sheet
                open={mobileNavOpen}
                onOpenChange={(o) => setMobileNavOpen(o)}
              >
                <SheetTrigger asChild>
                  <button
                    type="button"
                    aria-label="Open menu"
                    className="lg:hidden inline-flex items-center justify-center size-10 rounded-md hover:bg-zinc-100"
                  >
                    <Menu className="size-5" />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[300px] sm:w-[360px] p-0 overflow-y-auto"
                >
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <img
                        src={logoUrl}
                        alt={`${businessName} logo`}
                        className="size-10 rounded-lg object-contain ring-1 ring-blue-100"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://placehold.co/80x80/1b4f8e/ffffff?text=GRG";
                        }}
                      />
                      <div className="leading-tight">
                        <p className="font-bold text-blue-900 text-sm">
                          {businessName}
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          {branding?.address ?? "172 Trongate, Glasgow, UK"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <nav className="p-4 flex flex-col gap-1">
                    <SheetClose asChild>
                      <NavLink
                        href="/"
                        className={cn(
                          "px-3 py-2.5 rounded-md text-sm font-medium",
                          isActive("home")
                            ? "bg-blue-50 text-blue-700"
                            : "text-zinc-700 hover:bg-zinc-50"
                        )}
                      >
                        Home
                      </NavLink>
                    </SheetClose>
                    <SheetClose asChild>
                      <NavLink
                        href="/services"
                        className={cn(
                          "px-3 py-2.5 rounded-md text-sm font-medium",
                          isActive("services")
                            ? "bg-blue-50 text-blue-700"
                            : "text-zinc-700 hover:bg-zinc-50"
                        )}
                      >
                        All Services
                      </NavLink>
                    </SheetClose>
                    <div className="pl-3 flex flex-col gap-0.5 border-l-2 border-blue-100 ml-2 my-1">
                      {STATIC_SERVICES.map((s) => (
                        <SheetClose key={s.id} asChild>
                          <NavLink
                            href={`/services/${s.slug}`}
                            className="px-3 py-2 rounded-md text-sm text-zinc-600 hover:bg-zinc-50 hover:text-blue-700 flex items-center gap-2"
                          >
                            <ServiceIcon
                              name={s.icon}
                              className="size-4 text-blue-700"
                            />
                            <span className="truncate">{s.name}</span>
                          </NavLink>
                        </SheetClose>
                      ))}
                    </div>
                    {[
                      { href: "/collection", label: "Free Collection", page: "collection" },
                      { href: "/reviews", label: "Reviews", page: "reviews" },
                      { href: "/track", label: "Track Your Repair", page: "track" },
                      { href: "/blog", label: "Blog", page: "blog" },
                      { href: "/contact", label: "Contact Us", page: "contact" },
                    ].map((item) => (
                      <SheetClose key={item.href} asChild>
                        <NavLink
                          href={item.href}
                          className={cn(
                            "px-3 py-2.5 rounded-md text-sm font-medium",
                            isActive(item.page)
                              ? "bg-blue-50 text-blue-700"
                              : "text-zinc-700 hover:bg-zinc-50"
                          )}
                        >
                          {item.label}
                        </NavLink>
                      </SheetClose>
                    ))}
                  </nav>

                  <div className="p-4 border-t mt-auto flex flex-col gap-2">
                    <a href={`tel:${phoneDigits}`}>
                      <Button
                        variant="outline"
                        className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Phone className="size-4" />
                        {phone}
                      </Button>
                    </a>
                    <SheetClose asChild>
                      <Button
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => goContact()}
                      >
                        <Wrench className="size-4" />
                        Book a Repair
                      </Button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export { Header as default, Header };
