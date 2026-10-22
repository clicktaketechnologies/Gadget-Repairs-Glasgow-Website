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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { adminJson } from "@/lib/admin-fetch";
import { Save, Loader2, Code2, FileCode2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface CodeSettings {
  customHeaderCode?: string | null;
  customFooterCode?: string | null;
  googleSiteVerification?: string | null;
}

export function CodeModule() {
  const [settings, setSettings] = useState<CodeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminJson<{ settings: CodeSettings }>("/api/admin/code")
      .then((d) => setSettings(d.settings || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    if (!settings) return;
    setSaving(true);
    try {
      const d = await adminJson<{ settings: CodeSettings }>(
        "/api/admin/code",
        {
          method: "PUT",
          body: JSON.stringify({
            customHeaderCode: settings.customHeaderCode || "",
            customFooterCode: settings.customFooterCode || "",
          }),
        }
      );
      setSettings(d.settings);
      toast.success("Custom code saved");
    } catch {
    } finally {
      setSaving(false);
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
      <Card className="border-orange-200 bg-orange-50/50">
        <CardContent className="flex items-start gap-3 py-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
          <div className="text-sm text-orange-900">
            <p className="font-semibold">Use with caution</p>
            <p className="text-xs text-orange-800">
              Code entered here is injected into the public site&apos;s HTML. Only
              paste snippets you trust (e.g. Google Analytics, Search Console
              verification, live chat widgets).
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <Code2 className="h-5 w-5 text-blue-900" />
            Header code
          </CardTitle>
          <CardDescription>
            Injected inside <code>&lt;head&gt;</code> on every public page.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Textarea
            rows={8}
            value={settings?.customHeaderCode || ""}
            onChange={(e) =>
              setSettings((s) =>
                s ? { ...s, customHeaderCode: e.target.value } : s
              )
            }
            placeholder="<!-- e.g. Google Analytics, meta tags -->"
            className="font-mono text-xs"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileCode2 className="h-5 w-5 text-blue-900" />
            Footer code
          </CardTitle>
          <CardDescription>
            Injected just before <code>&lt;/body&gt;</code> on every public page.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Textarea
            rows={8}
            value={settings?.customFooterCode || ""}
            onChange={(e) =>
              setSettings((s) =>
                s ? { ...s, customFooterCode: e.target.value } : s
              )
            }
            placeholder="<!-- e.g. live chat widget, conversion pixels -->"
            className="font-mono text-xs"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base">Google site verification</CardTitle>
          <CardDescription>
            The verification token from Google Search Console (without the
            <code> google-site-verification:</code> prefix).
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Label>Verification token</Label>
          <Input
            value={settings?.googleSiteVerification || ""}
            onChange={(e) =>
              setSettings((s) =>
                s
                  ? { ...s, googleSiteVerification: e.target.value }
                  : s
              )
            }
            placeholder="e.g. abc123XYZ_verify_example"
            className="mt-1.5"
          />
          <p className="mt-2 text-xs text-slate-500">
            Adds <code>&lt;meta name=&quot;google-site-verification&quot; content=&quot;…&quot;&gt;</code> to the public site&apos;s head.
          </p>
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
          Save custom code
        </Button>
      </div>
    </div>
  );
}
