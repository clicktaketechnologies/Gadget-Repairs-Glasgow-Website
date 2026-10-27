"use client";

import { useState } from "react";
import { useNav, type AdminPage } from "@/store/nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarClock,
  UserPlus,
  Wrench,
  Star,
  Newspaper,
  FileText,
  Images,
  Settings2,
  Palette,
  Mail,
  Code2,
  KeyRound,
  ExternalLink,
  LogOut,
  Menu,
  Hammer,
} from "lucide-react";
import { toast } from "sonner";

type NavItem = { page: AdminPage; label: string; icon: any };
type NavGroup = { title: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    title: "MAIN",
    items: [
      { page: "admin-overview", label: "Overview", icon: LayoutDashboard },
      { page: "admin-bookings", label: "Bookings", icon: CalendarClock },
      { page: "admin-walkin", label: "Walk-in", icon: UserPlus },
    ],
  },
  {
    title: "CMS",
    items: [
      { page: "admin-services", label: "Services & Pricing", icon: Wrench },
      { page: "admin-reviews", label: "Reviews", icon: Star },
      { page: "admin-blog", label: "Blog", icon: Newspaper },
      { page: "admin-pages", label: "Pages Editor", icon: FileText },
      { page: "admin-media", label: "Media Library", icon: Images },
    ],
  },
  {
    title: "CONFIG",
    items: [
      { page: "admin-content", label: "Content", icon: Settings2 },
      { page: "admin-branding", label: "Branding", icon: Palette },
      { page: "admin-email", label: "Email", icon: Mail },
      { page: "admin-code", label: "Custom Code", icon: Code2 },
      { page: "admin-settings", label: "Settings", icon: KeyRound },
    ],
  },
];

const PAGE_TITLES: Record<AdminPage, string> = {
  "admin-overview": "Overview",
  "admin-bookings": "Bookings",
  "admin-walkin": "Walk-in Customer",
  "admin-services": "Services & Pricing",
  "admin-reviews": "Reviews",
  "admin-blog": "Blog Posts",
  "admin-pages": "Pages Editor",
  "admin-media": "Media Library",
  "admin-content": "Content Settings",
  "admin-branding": "Branding",
  "admin-email": "Email Settings",
  "admin-code": "Custom Code",
  "admin-settings": "Settings",
};

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const route = useNav((s) => s.route);
  const adminEmail = useNav((s) => s.adminEmail);
  const goAdmin = useNav((s) => s.goAdmin);
  const goPublic = useNav((s) => s.goPublic);
  const clearAdminAuth = useNav((s) => s.clearAdminAuth);
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentPage: AdminPage =
    route.kind === "admin" ? route.page : "admin-overview";
  const pageTitle = PAGE_TITLES[currentPage];

  function handleNav(page: AdminPage) {
    goAdmin(page);
    setMobileOpen(false);
  }

  function handleLogout() {
    clearAdminAuth();
    goPublic();
    toast.success("Signed out");
  }

  function handleViewSite() {
    goPublic();
  }

  const SidebarBody = (
    <div className="flex h-full flex-col bg-gradient-to-b from-blue-900 to-slate-900 text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <img
          src="/logo.jpg"
          alt="Gadget Repairs Glasgow"
          className="h-10 w-10 rounded-lg object-contain ring-1 ring-white/20"
        />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold leading-tight">
            Gadget Repairs
          </div>
          <div className="truncate text-xs text-blue-200/70">Glasgow · Admin</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="mb-5">
            <div className="mb-2 px-2 text-[10px] font-bold tracking-wider text-blue-300/60">
              {group.title}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = currentPage === item.page;
                return (
                  <button
                    key={item.page}
                    onClick={() => handleNav(item.page)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                      active
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-blue-100/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="space-y-1.5 border-t border-white/10 p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-blue-100/80 hover:bg-white/10 hover:text-white"
          onClick={handleViewSite}
        >
          <ExternalLink className="h-4 w-4" />
          View site
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-200/80 hover:bg-red-500/20 hover:text-red-100"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar (fixed 240px) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 lg:block">
        {SidebarBody}
      </aside>

      {/* Mobile sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          {SidebarBody}
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-60">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-white px-4 shadow-sm lg:px-6">
          <button
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Hammer className="h-5 w-5 text-blue-900 lg:hidden" />
            <h1 className="text-base font-semibold text-slate-900 lg:text-lg">
              {pageTitle}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <div className="text-xs text-slate-500">Signed in as</div>
              <div className="text-xs font-medium text-slate-800">
                {adminEmail || "admin"}
              </div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-900 text-sm font-semibold text-white">
              {(adminEmail || "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
