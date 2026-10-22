"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Loader2, CheckCircle2 } from "lucide-react";
import { adminJson } from "@/lib/admin-fetch";
import { toast } from "sonner";

const DEVICE_TYPES = ["Phone", "Tablet", "Laptop", "MacBook", "Console", "PC", "Smartwatch", "Camera", "Other"];

interface Form {
  customerName: string;
  phone: string;
  email: string;
  deviceType: string;
  deviceModel: string;
  issue: string;
  quotedPrice: string;
  status: string;
}

const INITIAL: Form = {
  customerName: "",
  phone: "",
  email: "",
  deviceType: "Phone",
  deviceModel: "",
  issue: "",
  quotedPrice: "",
  status: "In Progress",
};

export function WalkinModule() {
  const [form, setForm] = useState<Form>(INITIAL);
  const [saving, setSaving] = useState(false);
  const [lastTicket, setLastTicket] = useState<string | null>(null);

  function update<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customerName.trim()) {
      toast.error("Customer name is required");
      return;
    }
    setSaving(true);
    try {
      const data = await adminJson<{ booking: any; message: string }>(
        "/api/admin/walkin",
        {
          method: "POST",
          body: JSON.stringify(form),
        }
      );
      toast.success(data.message || "Walk-in created");
      setLastTicket(data.booking?.ticketId || null);
      setForm(INITIAL);
    } catch {
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-base text-slate-900">
            <UserPlus className="h-5 w-5 text-orange-500" />
            New walk-in booking
          </CardTitle>
          <CardDescription>
            Quickly add an in-store customer. A ticket ID is generated automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Customer name *</Label>
              <Input
                value={form.customerName}
                onChange={(e) => update("customerName", e.target.value)}
                placeholder="e.g. John Smith"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="07777 200149"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email (optional)</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="customer@email.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Device type</Label>
              <Select
                value={form.deviceType}
                onValueChange={(v) => update("deviceType", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEVICE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Device model</Label>
              <Input
                value={form.deviceModel}
                onChange={(e) => update("deviceModel", e.target.value)}
                placeholder="e.g. iPhone 13 Pro"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Quoted price</Label>
              <Input
                value={form.quotedPrice}
                onChange={(e) => update("quotedPrice", e.target.value)}
                placeholder="e.g. £49"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Initial status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => update("status", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Ready">Ready</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Issue / fault description</Label>
              <Textarea
                rows={4}
                value={form.issue}
                onChange={(e) => update("issue", e.target.value)}
                placeholder="e.g. Cracked screen, battery drains fast…"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="gap-2 bg-blue-900 text-white hover:bg-blue-800"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                Create walk-in booking
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base text-slate-900">Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600">
          <p>
            Walk-in bookings are created with source{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">walk-in</code>{" "}
            and today&apos;s date. A unique ticket ID (GD-XXXX) is generated so you can
            track the repair.
          </p>
          <p>
            Set the initial status to <strong>In Progress</strong> if you&apos;re
            starting the repair immediately, or <strong>Pending</strong> if it&apos;s
            waiting for parts.
          </p>
          {lastTicket && (
            <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
              <span>
                Last ticket created:{" "}
                <span className="font-mono font-bold">{lastTicket}</span>
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
