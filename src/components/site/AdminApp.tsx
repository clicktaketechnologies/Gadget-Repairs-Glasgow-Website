"use client";

import { useEffect, useState } from "react";
import { useNav, verifyToken } from "@/store/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  Lock,
  LayoutDashboard,
  CalendarClock,
  Wrench,
  Settings as SettingsIcon,
  Star,
  FileText,
  PenSquare,
  Mail,
  Code,
  Image,
  FileCode,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { NavLink } from "./NavLink";

const ADMIN_NAV = [
  { page: "admin-overview", label: "Overview", icon: LayoutDashboard },
  { page: "admin-bookings", label: "Bookings", icon: CalendarClock },
  { page: "admin-walkin", label: "Walk-In", icon: Wrench },
  { page: "admin-services", label: "Services", icon: Wrench },
  { page: "admin-reviews", label: "Reviews", icon: Star },
  { page: "admin-content", label: "Content", icon: FileText },
  { page: "admin-branding", label: "Branding", icon: Image },
  { page: "admin-blog", label: "Blog", icon: PenSquare },
  { page: "admin-pages", label: "Pages", icon: FileCode },
  { page: "admin-email", label: "Email", icon: Mail },
  { page: "admin-code", label: "Custom Code", icon: Code },
  { page: "admin-settings", label: "Settings", icon: SettingsIcon },
] as const;

export function AdminApp() {
  const route = useNav((s) => s.route);
  const adminToken = useNav((s) => s.adminToken);
  const adminEmail = useNav((s) => s.adminEmail);
  const setAdminAuth = useNav((s) => s.setAdminAuth);
  const clearAdminAuth = useNav((s) => s.clearAdminAuth);
  const navigate = useNav((s) => s.navigate);

  // Validate the persisted token; clear if expired. Done in render-time guard,
  // not in an effect, to avoid set-state-in-effect lint warnings.
  const tokenValid = !!(adminToken && verifyToken(adminToken));
  useEffect(() => {
    if (adminToken && !tokenValid) {
      clearAdminAuth();
    }
  }, [adminToken, tokenValid, clearAdminAuth]);

  const authed = !!(tokenValid && adminEmail);
  const isAdminLogin =
    route.kind === "admin" && route.page === "admin-login";

  // Not logged in → show login
  if (!authed) {
    return <AdminLogin
      onLogin={(token, email) => {
        setAdminAuth(token, email);
        navigate({ kind: "admin", page: "admin-overview" });
      }}
    />;
  }

  // Logged in but on the login page → redirect to overview
  if (isAdminLogin) {
    navigate({ kind: "admin", page: "admin-overview" });
    return null;
  }

  const currentPage = route.kind === "admin" ? route.page : "admin-overview";

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-blue-900 text-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <NavLink
              href="/"
              className="text-blue-200 hover:text-white inline-flex items-center gap-1 text-sm"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Back to site</span>
            </NavLink>
            <span className="text-blue-300">/</span>
            <span className="font-bold">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-blue-200 hidden sm:inline">
              {adminEmail}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              onClick={() => {
                fetch("/api/admin/logout", { method: "POST" }).finally(() => {
                  clearAdminAuth();
                  navigate({ kind: "admin", page: "admin-login" });
                  toast.success("Logged out.");
                });
              }}
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 grid lg:grid-cols-[220px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 h-max">
          <nav className="bg-white rounded-xl ring-1 ring-zinc-200 p-2 flex lg:flex-col gap-1 overflow-x-auto">
            {ADMIN_NAV.map((item) => {
              const active = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  type="button"
                  onClick={() =>
                    navigate({ kind: "admin", page: item.page })
                  }
                  className={
                    "flex items-center gap-2 px-3 py-2 text-sm rounded-md whitespace-nowrap transition-colors " +
                    (active
                      ? "bg-blue-700 text-white"
                      : "text-zinc-700 hover:bg-zinc-100")
                  }
                >
                  <item.icon className="size-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main panel */}
        <section>
          <AdminPanel page={currentPage} />
        </section>
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }: { onLogin: (token: string, email: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Login failed.");
        return;
      }
      toast.success("Login successful.");
      onLogin(data.token, data.email);
    } catch {
      toast.error("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm border-0 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="size-12 rounded-xl bg-blue-900 text-white inline-flex items-center justify-center mx-auto">
            <Lock className="size-6" />
          </div>
          <CardTitle className="text-blue-900 text-xl">Admin Login</CardTitle>
          <p className="text-sm text-zinc-500">
            Sign in to manage Gadget Repairs Glasgow.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="a-email">Email</Label>
              <Input
                id="a-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gadgetrepairsglasgow.co.uk"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="a-pass">Password</Label>
              <Input
                id="a-pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <NavLink
              href="/"
              className="text-xs text-zinc-500 hover:text-blue-700 inline-flex items-center gap-1"
            >
              <ArrowLeft className="size-3" />
              Back to website
            </NavLink>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminPanel({ page }: { page: string }) {
  // Minimal placeholder for admin sections — focuses on the public site rebuild.
  const titleMap: Record<string, { title: string; desc: string }> = {
    "admin-overview": {
      title: "Dashboard Overview",
      desc: "Quick stats and recent activity.",
    },
    "admin-bookings": {
      title: "Bookings",
      desc: "View and manage customer repair bookings.",
    },
    "admin-walkin": {
      title: "Walk-In Repairs",
      desc: "Add walk-in repairs at the counter.",
    },
    "admin-services": {
      title: "Services",
      desc: "Manage repair services and pricing.",
    },
    "admin-reviews": {
      title: "Reviews",
      desc: "Approve or reject customer reviews.",
    },
    "admin-content": {
      title: "Page Content",
      desc: "Edit page content blocks.",
    },
    "admin-branding": {
      title: "Branding",
      desc: "Business name, logo, colours, contact info.",
    },
    "admin-blog": {
      title: "Blog",
      desc: "Write and publish blog posts.",
    },
    "admin-pages": {
      title: "Pages",
      desc: "Manage static pages (Privacy, Terms, etc).",
    },
    "admin-email": {
      title: "Email Settings",
      desc: "Configure SMTP and outgoing email.",
    },
    "admin-code": {
      title: "Custom Code",
      desc: "Inject header/footer custom HTML or scripts.",
    },
    "admin-settings": {
      title: "Settings",
      desc: "Site-wide settings and toggles.",
    },
  };

  const meta = titleMap[page] ?? titleMap["admin-overview"];

  return (
    <Card className="border-zinc-200">
      <CardHeader className="border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-50 text-blue-700 border border-blue-100">
            Admin
          </Badge>
        </div>
        <CardTitle className="text-blue-900 text-lg">{meta.title}</CardTitle>
        <p className="text-sm text-zinc-500">{meta.desc}</p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="rounded-xl bg-blue-50 ring-1 ring-blue-100 p-6 text-center">
          <ChevronRight className="size-8 text-blue-700 mx-auto mb-2" />
          <p className="font-semibold text-blue-900">
            {meta.title} module
          </p>
          <p className="text-sm text-zinc-600 mt-1 max-w-md mx-auto">
            This section is part of the admin dashboard. Use the sidebar to
            switch between modules, or click below to return to the public
            website.
          </p>
          <NavLink href="/" className="inline-block mt-4">
            <Button
              variant="outline"
              className="border-blue-200 text-blue-700"
            >
              <ArrowLeft className="size-4" />
              View public website
            </Button>
          </NavLink>
        </div>
      </CardContent>
    </Card>
  );
}

export { AdminApp as default, AdminApp };
