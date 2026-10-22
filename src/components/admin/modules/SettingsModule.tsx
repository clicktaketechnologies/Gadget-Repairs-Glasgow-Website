"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNav } from "@/store/nav";
import { adminJson } from "@/lib/admin-fetch";
import {
  KeyRound,
  Loader2,
  Save,
  LogOut,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

export function SettingsModule() {
  const adminEmail = useNav((s) => s.adminEmail);
  const clearAdminAuth = useNav((s) => s.clearAdminAuth);
  const goPublic = useNav((s) => s.goPublic);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!current || !next || !confirm) {
      toast.error("Please fill in all fields");
      return;
    }
    if (next !== confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (next.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    setSaving(true);
    try {
      const d = await adminJson<{ message: string }>("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword: current,
          newPassword: next,
        }),
      });
      toast.success(d.message || "Password changed");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch {
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    clearAdminAuth();
    goPublic();
    toast.success("Signed out");
  }

  return (
    <div className="space-y-4">
      {/* Session */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-5 w-5 text-blue-900" />
            Session
          </CardTitle>
          <CardDescription>
            Your current admin session details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-md border bg-slate-50 p-3">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-slate-500">
                <ShieldCheck className="h-3 w-3" /> Signed in as
              </div>
              <div className="mt-1 text-sm font-medium text-slate-900">
                {adminEmail || "—"}
              </div>
            </div>
            <div className="rounded-md border bg-slate-50 p-3">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-slate-500">
                <Clock className="h-3 w-3" /> Role
              </div>
              <div className="mt-1 text-sm font-medium text-slate-900">
                Administrator
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            Sign out of admin
          </Button>
        </CardContent>
      </Card>

      {/* Change password */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <KeyRound className="h-5 w-5 text-orange-500" />
            Change password
          </CardTitle>
          <CardDescription>
            Pick a strong password of at least 8 characters.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form
            onSubmit={changePassword}
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            <div className="space-y-1.5">
              <Label>Current password</Label>
              <Input
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-1.5">
              <Label>New password</Label>
              <Input
                type="password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Confirm new password</Label>
              <Input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="gap-2 bg-blue-900 hover:bg-blue-800"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Update password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
