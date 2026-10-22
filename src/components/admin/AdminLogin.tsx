"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, Mail, ShieldCheck, Wrench } from "lucide-react";
import { toast } from "sonner";
import { useNav } from "@/store/nav";

const DEMO_EMAIL = "admin@gadgetrepairsglasgow.co.uk";
const DEMO_PASSWORD = "securepassword123";

export function AdminLogin() {
  const setAdminAuth = useNav((s) => s.setAdminAuth);
  const goAdmin = useNav((s) => s.goAdmin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }
    setLoading(true);

    // Helper: check demo credentials and log in offline
    function offlineLogin() {
      if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
        const payload = { email: DEMO_EMAIL, exp: Date.now() + 12 * 60 * 60 * 1000 };
        const token = typeof btoa !== "undefined"
          ? btoa(JSON.stringify(payload))
          : Buffer.from(JSON.stringify(payload)).toString("base64");
        setAdminAuth(token, DEMO_EMAIL);
        toast.success("Welcome back, admin (offline mode)");
        goAdmin("admin-overview");
        return true;
      }
      return false;
    }

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      // If response is not JSON (e.g. Firebase 404 HTML page), use offline fallback
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        if (!offlineLogin()) {
          toast.error("Unable to reach server. Use demo credentials.");
        }
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Login failed");
        return;
      }
      setAdminAuth(data.token, data.email);
      toast.success(`Welcome back, ${data.name || "admin"}`);
      goAdmin("admin-overview");
    } catch (err) {
      // Network error — try offline fallback
      if (!offlineLogin()) {
        toast.error("Unable to reach server. Check credentials and try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  function fillDemo() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 px-4 py-10">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
            <img
              src="/logo.jpg"
              alt="Gadget Repairs Glasgow"
              className="h-12 w-12 rounded-lg object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-blue-200/80">
            Gadget Repairs Glasgow — secure control panel
          </p>
        </div>

        <Card className="border-white/10 bg-white/95 shadow-2xl backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <ShieldCheck className="h-5 w-5 text-orange-500" />
              Sign in
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@gadgetrepairsglasgow.co.uk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    disabled={loading}
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-900 text-white hover:bg-blue-800"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    <Wrench className="h-4 w-4" />
                    Sign in
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                onClick={fillDemo}
                disabled={loading}
              >
                Fill demo credentials
              </Button>
            </form>
            <p className="mt-4 rounded-md bg-blue-50 px-3 py-2 text-center text-xs text-blue-800">
              Demo: <strong>{DEMO_EMAIL}</strong> / <strong>{DEMO_PASSWORD}</strong>
            </p>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-blue-200/60">
          © {new Date().getFullYear()} Gadget Repairs Glasgow · Admin access only
        </p>
      </div>
    </div>
  );
}
