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
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { adminJson } from "@/lib/admin-fetch";
import { Save, Loader2, Plus, Trash2, Palette, Phone, MapPin, Share2, Clock, BarChart3, Store } from "lucide-react";
import { toast } from "sonner";

interface Branding {
  businessName?: string;
  tagline?: string;
  about?: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  phone?: string;
  whatsapp?: string | null;
  email?: string;
  website?: string | null;
  gmbProfile?: string | null;
  mapLink?: string | null;
  mapEmbed?: string | null;
  address?: string;
  hoursJson?: string | null;
  socialsJson?: string | null;
  targetAreasJson?: string | null;
  rating?: number;
  reviewCount?: number;
  yearsExperience?: number;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SOCIAL_KEYS = [
  "facebook",
  "instagram",
  "twitter",
  "youtube",
  "linkedin",
  "tiktok",
];

function safeParse<T>(s: string | null | undefined, fallback: T): T {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

export function BrandingModule() {
  const [b, setB] = useState<Branding | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [hours, setHours] = useState<Record<string, string>>({});
  const [socials, setSocials] = useState<Record<string, string>>({});
  const [areas, setAreas] = useState<string[]>([]);

  useEffect(() => {
    adminJson<{ branding: Branding }>("/api/admin/branding")
      .then((d) => {
        const branding = d.branding || {};
        setB(branding);
        setHours(safeParse<Record<string, string>>(branding.hoursJson, {}));
        setSocials(safeParse<Record<string, string>>(branding.socialsJson, {}));
        setAreas(
          safeParse<string[]>(branding.targetAreasJson, [])
        );
      })
      .catch(() => {
        // Fallback: use static branding data when API is unreachable
        const fallback: Branding = {
          id: "singleton",
          businessName: "Gadget Repairs Glasgow",
          tagline: "Professional Mobile Phone & Tablet Repair, Unlocking, and Accessories",
          about: "Gadget Repairs Glasgow is a trusted repair shop at 172 Trongate in Glasgow city centre. For over 10 years we have been fixing mobile phones, MacBooks, laptops, tablets, game consoles, computers, smart watches and GHD straighteners for thousands of happy customers.",
          logoUrl: "/logo.jpg",
          faviconUrl: "/logo.jpg",
          primaryColor: "#1b4f8e",
          secondaryColor: "#f05a28",
          phone: "+44 7777 200149",
          whatsapp: "+44 7777 200149",
          email: "info@gadgetrepairsglasgow.co.uk",
          website: "https://www.gadgetrepairsglasgow.co.uk",
          gmbProfile: "https://g.co/kgs/DKcPKfJ",
          mapLink: "https://maps.google.com/?q=172+Trongate+Glasgow+G1+5EL",
          mapEmbed: "https://www.google.com/maps?q=172+Trongate+Glasgow+G1+5EL&output=embed",
          address: "172 Trongate, Glasgow G1 5EL, United Kingdom",
          hoursJson: JSON.stringify({
            Monday: "9:00 AM – 7:00 PM", Tuesday: "9:00 AM – 7:00 PM",
            Wednesday: "9:00 AM – 7:00 PM", Thursday: "9:00 AM – 7:00 PM",
            Friday: "9:00 AM – 7:00 PM", Saturday: "9:00 AM – 7:00 PM",
            Sunday: "10:30 AM – 5:30 PM",
          }),
          socialsJson: JSON.stringify({
            Facebook: "https://www.facebook.com/gadgetrepairglasgow",
            Instagram: "https://www.instagram.com/gadgetrepairsglasgow/",
            TikTok: "https://www.tiktok.com/@gadgetrepairsglasgow",
            YouTube: "https://www.youtube.com/@Gadgetrepairsglassgow",
            LinkedIn: "https://www.linkedin.com/company/gadgetrepairsglasgow/",
          }),
          targetAreasJson: JSON.stringify(["Trongate","Glasgow City Centre","Merchant City","Buchanan Street","Dennistoun","Gorbals"]),
          rating: 4.9,
          reviewCount: 150,
          yearsExperience: 10,
        };
        setB(fallback);
        setHours({
          Monday: "9:00 AM – 7:00 PM", Tuesday: "9:00 AM – 7:00 PM",
          Wednesday: "9:00 AM – 7:00 PM", Thursday: "9:00 AM – 7:00 PM",
          Friday: "9:00 AM – 7:00 PM", Saturday: "9:00 AM – 7:00 PM",
          Sunday: "10:30 AM – 5:30 PM",
        });
        setSocials({
          Facebook: "https://www.facebook.com/gadgetrepairglasgow",
          Instagram: "https://www.instagram.com/gadgetrepairsglasgow/",
          TikTok: "https://www.tiktok.com/@gadgetrepairsglasgow",
          YouTube: "https://www.youtube.com/@Gadgetrepairsglassgow",
          LinkedIn: "https://www.linkedin.com/company/gadgetrepairsglasgow/",
        });
        setAreas(["Trongate","Glasgow City Centre","Merchant City","Buchanan Street","Dennistoun","Gorbals"]);
      })
      .finally(() => setLoading(false));
  }, []);

  function set<K extends keyof Branding>(k: K, v: Branding[K]) {
    setB((s) => (s ? { ...s, [k]: v } : s));
  }

  async function save() {
    if (!b) return;
    setSaving(true);
    try {
      const payload = {
        ...b,
        hoursJson: JSON.stringify(hours),
        socialsJson: JSON.stringify(socials),
        targetAreasJson: JSON.stringify(areas.filter(Boolean)),
      };
      const d = await adminJson<{ branding: Branding }>(
        "/api/admin/branding",
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );
      setB(d.branding);
      toast.success("Branding saved");
    } catch {
    } finally {
      setSaving(false);
    }
  }

  if (loading || !b) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Identity */}
      <Section icon={<Store className="h-4 w-4" />} title="Business Identity">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Business name *">
            <Input value={b.businessName || ""} onChange={(e) => set("businessName", e.target.value)} />
          </Field>
          <Field label="Tagline">
            <Input value={b.tagline || ""} onChange={(e) => set("tagline", e.target.value)} />
          </Field>
          <Field label="Logo URL" full>
            <Input value={b.logoUrl || ""} onChange={(e) => set("logoUrl", e.target.value)} placeholder="/logo.jpg" />
          </Field>
          <Field label="Favicon URL" full>
            <Input value={b.faviconUrl || ""} onChange={(e) => set("faviconUrl", e.target.value)} />
          </Field>
          <Field label="About" full>
            <Textarea rows={3} value={b.about || ""} onChange={(e) => set("about", e.target.value)} />
          </Field>
        </div>
      </Section>

      {/* Brand colours */}
      <Section icon={<Palette className="h-4 w-4" />} title="Brand Colours">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Primary colour">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={b.primaryColor || "#1b4f8e"}
                onChange={(e) => set("primaryColor", e.target.value)}
                className="h-9 w-12 cursor-pointer rounded border"
              />
              <Input value={b.primaryColor || ""} onChange={(e) => set("primaryColor", e.target.value)} />
            </div>
          </Field>
          <Field label="Accent colour">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={b.secondaryColor || "#f05a28"}
                onChange={(e) => set("secondaryColor", e.target.value)}
                className="h-9 w-12 cursor-pointer rounded border"
              />
              <Input value={b.secondaryColor || ""} onChange={(e) => set("secondaryColor", e.target.value)} />
            </div>
          </Field>
        </div>
      </Section>

      {/* Contact */}
      <Section icon={<Phone className="h-4 w-4" />} title="Contact">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Phone">
            <Input value={b.phone || ""} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label="WhatsApp">
            <Input value={b.whatsapp || ""} onChange={(e) => set("whatsapp", e.target.value)} />
          </Field>
          <Field label="Email">
            <Input value={b.email || ""} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Website">
            <Input value={b.website || ""} onChange={(e) => set("website", e.target.value)} />
          </Field>
        </div>
      </Section>

      {/* Location */}
      <Section icon={<MapPin className="h-4 w-4" />} title="Location">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Address" full>
            <Textarea rows={2} value={b.address || ""} onChange={(e) => set("address", e.target.value)} />
          </Field>
          <Field label="Google Business Profile URL">
            <Input value={b.gmbProfile || ""} onChange={(e) => set("gmbProfile", e.target.value)} />
          </Field>
          <Field label="Map link">
            <Input value={b.mapLink || ""} onChange={(e) => set("mapLink", e.target.value)} />
          </Field>
          <Field label="Map embed (iframe)" full>
            <Textarea rows={2} value={b.mapEmbed || ""} onChange={(e) => set("mapEmbed", e.target.value)} />
          </Field>
          <Field label="Service areas" full>
            <div className="space-y-2">
              {areas.map((a, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={a}
                    onChange={(e) =>
                      setAreas((prev) =>
                        prev.map((x, j) => (j === i ? e.target.value : x))
                      )
                    }
                    placeholder={`Area ${i + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setAreas((prev) => prev.filter((_, j) => j !== i))
                    }
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAreas((prev) => [...prev, ""])}
                className="gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add area
              </Button>
            </div>
          </Field>
        </div>
      </Section>

      {/* Hours */}
      <Section icon={<Clock className="h-4 w-4" />} title="Opening Hours">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {DAYS.map((d) => (
            <div key={d} className="flex items-center gap-2">
              <Label className="w-12 text-sm">{d}</Label>
              <Input
                value={hours[d] || ""}
                onChange={(e) =>
                  setHours((prev) => ({ ...prev, [d]: e.target.value }))
                }
                placeholder="9am–7pm / Closed"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Social */}
      <Section icon={<Share2 className="h-4 w-4" />} title="Social Profiles">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SOCIAL_KEYS.map((k) => (
            <Field key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}>
              <Input
                value={socials[k] || ""}
                onChange={(e) =>
                  setSocials((prev) => ({ ...prev, [k]: e.target.value }))
                }
                placeholder={`https://${k}.com/yourshop`}
              />
            </Field>
          ))}
        </div>
      </Section>

      {/* Stats */}
      <Section icon={<BarChart3 className="h-4 w-4" />} title="Public Stats">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="Rating (out of 5)">
            <Input
              type="number"
              step="0.1"
              value={String(b.rating ?? 0)}
              onChange={(e) => set("rating", Number(e.target.value) || 0)}
            />
          </Field>
          <Field label="Review count">
            <Input
              type="number"
              value={String(b.reviewCount ?? 0)}
              onChange={(e) => set("reviewCount", Number(e.target.value) || 0)}
            />
          </Field>
          <Field label="Years experience">
            <Input
              type="number"
              value={String(b.yearsExperience ?? 0)}
              onChange={(e) => set("yearsExperience", Number(e.target.value) || 0)}
            />
          </Field>
        </div>
      </Section>

      <Separator />
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
          Save branding
        </Button>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="border-b py-4">
        <CardTitle className="flex items-center gap-2 text-base text-slate-900">
          <span className="text-orange-500">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">{children}</CardContent>
    </Card>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={`space-y-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
