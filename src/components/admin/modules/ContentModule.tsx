"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { adminJson } from "@/lib/admin-fetch";
import { Save, Loader2, Megaphone, Bus, Ticket, BellRing } from "lucide-react";
import { toast } from "sonner";

interface ContentSettings {
  collectionEnabled?: boolean;
  collectionBannerEnabled?: boolean;
  announcementEnabled?: boolean;
  announcementText?: string | null;
  ticketIdVisible?: boolean;
}

export function ContentModule() {
  const [settings, setSettings] = useState<ContentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminJson<{ settings: ContentSettings }>("/api/admin/content")
      .then((d) => setSettings(d.settings || {}))
      .catch(() => {
        // Fallback: use static content settings when API is unreachable
        setSettings({
          id: "singleton",
          collectionEnabled: true,
          collectionBannerEnabled: true,
          announcementEnabled: true,
          announcementText:
            "🎉 Free doorstep collection across Glasgow — book online today!",
          ticketIdVisible: true,
          customHeaderCode: "",
          customFooterCode: "",
        } as ContentSettings);
      })
      .finally(() => setLoading(false));
  }, []);

  function update<K extends keyof ContentSettings>(
    k: K,
    v: ContentSettings[K]
  ) {
    setSettings((s) => (s ? { ...s, [k]: v } : s));
  }

  async function save() {
    if (!settings) return;
    setSaving(true);
    try {
      const d = await adminJson<{ settings: ContentSettings }>(
        "/api/admin/content",
        {
          method: "PUT",
          body: JSON.stringify(settings),
        }
      );
      setSettings(d.settings);
      toast.success("Content settings saved");
    } catch {
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ToggleCard
          icon={<Bus className="h-5 w-5" />}
          title="Doorstep collection"
          desc="Enable the free collection & delivery service for customers."
          checked={!!settings?.collectionEnabled}
          onChange={(v) => update("collectionEnabled", v)}
        />
        <ToggleCard
          icon={<BellRing className="h-5 w-5" />}
          title="Collection banner"
          desc="Show the collection promo banner at the top of the homepage."
          checked={!!settings?.collectionBannerEnabled}
          onChange={(v) => update("collectionBannerEnabled", v)}
        />
        <ToggleCard
          icon={<Ticket className="h-5 w-5" />}
          title="Ticket ID visible to customers"
          desc="Show booking ticket IDs on the public tracking page."
          checked={!!settings?.ticketIdVisible}
          onChange={(v) => update("ticketIdVisible", v)}
        />
        <ToggleCard
          icon={<Megaphone className="h-5 w-5" />}
          title="Site-wide announcement"
          desc="Show an announcement bar at the top of every public page."
          checked={!!settings?.announcementEnabled}
          onChange={(v) => update("announcementEnabled", v)}
        />
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base text-slate-900">
            Announcement message
          </CardTitle>
          <CardDescription>
            Text shown in the announcement bar (only visible if the toggle above
            is on).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          <div className="space-y-1.5">
            <Label>Short message</Label>
            <Textarea
              rows={2}
              value={settings?.announcementText || ""}
              onChange={(e) => update("announcementText", e.target.value)}
              placeholder="e.g. Holiday hours: Closed Sundays in December."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
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
          Save content settings
        </Button>
      </div>
    </div>
  );
}

function ToggleCard({
  icon,
  title,
  desc,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Card className="py-4">
      <CardContent className="flex items-start gap-3 px-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-900">
          {icon}
        </div>
        <div className="flex-1">
          <div className="font-medium text-slate-900">{title}</div>
          <p className="text-xs text-slate-500">{desc}</p>
        </div>
        <Switch checked={checked} onCheckedChange={onChange} />
      </CardContent>
    </Card>
  );
}
