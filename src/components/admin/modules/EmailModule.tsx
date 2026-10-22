"use client";

import { useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { adminJson } from "@/lib/admin-fetch";
import { fmtDateTime } from "@/lib/utils2";
import { Save, Loader2, Send, Mail, MailCheck, MailX } from "lucide-react";
import { toast } from "sonner";

interface EmailSettings {
  enabled?: boolean;
  host?: string | null;
  port?: number;
  secure?: boolean;
  user?: string | null;
  password?: string | null;
  fromEmail?: string | null;
  fromName?: string | null;
}

interface SentEmail {
  id: string;
  toEmail: string;
  subject: string;
  body: string;
  status: string;
  createdAt: string;
}

export function EmailModule() {
  const [settings, setSettings] = useState<EmailSettings | null>(null);
  const [emails, setEmails] = useState<SentEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [testTo, setTestTo] = useState("");
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    Promise.all([
      adminJson<{ settings: EmailSettings }>("/api/admin/email").catch(() => null),
      adminJson<{ emails: SentEmail[] }>("/api/admin/sent-emails/list").catch(
        () => null
      ),
    ])
      .then(([s, e]) => {
        if (s) setSettings(s.settings || {});
        if (e) setEmails(e.emails || []);
      })
      .finally(() => setLoading(false));
  }, []);

  function set<K extends keyof EmailSettings>(k: K, v: EmailSettings[K]) {
    setSettings((s) => (s ? { ...s, [k]: v } : s));
  }

  async function save() {
    if (!settings) return;
    setSaving(true);
    try {
      const d = await adminJson<{ settings: EmailSettings }>(
        "/api/admin/email",
        { method: "PUT", body: JSON.stringify(settings) }
      );
      setSettings(d.settings);
      toast.success("Email settings saved");
    } catch {
    } finally {
      setSaving(false);
    }
  }

  async function sendTest() {
    setTesting(true);
    try {
      const d = await adminJson<{ message: string }>("/api/admin/email/test", {
        method: "POST",
        body: JSON.stringify({ to: testTo }),
      });
      toast.success(d.message || "Test email sent");
      setTestOpen(false);
      const e = await adminJson<{ emails: SentEmail[] }>(
        "/api/admin/sent-emails/list"
      );
      setEmails(e.emails || []);
    } catch {
    } finally {
      setTesting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-900" />
              SMTP configuration
            </span>
            <div className="flex items-center gap-2">
              <Label className="text-sm font-normal text-slate-600">
                Enable SMTP
              </Label>
              <Switch
                checked={!!settings?.enabled}
                onCheckedChange={(v) => set("enabled", v)}
              />
            </div>
          </CardTitle>
          <CardDescription>
            Used to send booking confirmations, status updates, and replies to
            customers.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>SMTP host</Label>
              <Input
                value={settings?.host || ""}
                onChange={(e) => set("host", e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Port</Label>
              <Input
                type="number"
                value={String(settings?.port ?? 587)}
                onChange={(e) => set("port", Number(e.target.value) || 587)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Username</Label>
              <Input
                value={settings?.user || ""}
                onChange={(e) => set("user", e.target.value)}
                placeholder="you@gmail.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Password / app password</Label>
              <Input
                type="password"
                value={settings?.password || ""}
                onChange={(e) => set("password", e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-1.5">
              <Label>From email</Label>
              <Input
                value={settings?.fromEmail || ""}
                onChange={(e) => set("fromEmail", e.target.value)}
                placeholder="info@gadgetrepairsglasgow.co.uk"
              />
            </div>
            <div className="space-y-1.5">
              <Label>From name</Label>
              <Input
                value={settings?.fromName || ""}
                onChange={(e) => set("fromName", e.target.value)}
                placeholder="Gadget Repairs Glasgow"
              />
            </div>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <Switch
                checked={!!settings?.secure}
                onCheckedChange={(v) => set("secure", v)}
              />
              Use SSL/TLS (secure) — usually port 465 with secure on, 587 with secure off
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          variant="outline"
          onClick={() => setTestOpen(true)}
          className="gap-2"
        >
          <Send className="h-4 w-4" />
          Send test email
        </Button>
        <Button
          onClick={save}
          disabled={saving}
          className="gap-2 bg-blue-900 hover:bg-blue-800"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save settings
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b py-3">
          <CardTitle className="text-base">Sent email log</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          {emails.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-slate-500">
              <Mail className="h-8 w-8 text-slate-300" />
              <p className="text-sm">No emails sent yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>To</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-xs">{e.toEmail}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm">
                      {e.subject}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <StatusPill status={e.status} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-slate-600">
                      {e.createdAt ? fmtDateTime(e.createdAt) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={testOpen} onOpenChange={setTestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send test email</DialogTitle>
            <DialogDescription>
              Sends a short test message to verify your SMTP settings work.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label>Recipient email</Label>
            <Input
              type="email"
              value={testTo}
              onChange={(e) => setTestTo(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={sendTest}
              disabled={testing}
              className="gap-2 bg-blue-900 hover:bg-blue-800"
            >
              {testing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  if (status === "sent")
    return (
      <Badge className="bg-emerald-100 text-emerald-800">
        <MailCheck className="h-3 w-3" />
        Sent
      </Badge>
    );
  if (status === "failed")
    return (
      <Badge className="bg-red-100 text-red-800">
        <MailX className="h-3 w-3" />
        Failed
      </Badge>
    );
  return (
    <Badge variant="secondary">
      <Mail className="h-3 w-3" />
      {status}
    </Badge>
  );
}
