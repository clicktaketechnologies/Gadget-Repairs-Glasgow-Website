"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { adminJson } from "@/lib/admin-fetch";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const PAGES = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "collection", label: "Collection" },
  { id: "reviews", label: "Reviews" },
  { id: "contact", label: "Contact" },
  { id: "blog", label: "Blog" },
] as const;

type PageId = (typeof PAGES)[number]["id"];

interface Row {
  id?: string;
  page: string;
  section: string;
  key: string;
  value: string;
}

const STORAGE_KEY = "grg-admin-pages";

// Default content rows that match what's shown on the live public site
const DEFAULT_ROWS: Record<string, Row[]> = {
  home: [
    { page: "home", section: "hero", key: "badge", value: "Glasgow's #1 Gadget Repair Shop" },
    { page: "home", section: "hero", key: "title", value: "Fast, Reliable Phone & Tablet Repairs in Glasgow" },
    { page: "home", section: "hero", key: "subtitle", value: "Cracked screens, dead batteries, water damage & unlocks — fixed fast on Trongate. 4.9★ rated, 10+ years experience." },
    { page: "home", section: "cta", key: "primary", value: "Book a Repair" },
    { page: "home", section: "cta", key: "secondary", value: "Track Repair" },
    { page: "home", section: "trust", key: "warranty", value: "30-day warranty" },
    { page: "home", section: "trust", key: "fast", value: "Fast turnaround" },
    { page: "home", section: "trust", key: "collection", value: "Free doorstep collection" },
    { page: "home", section: "trust", key: "experience", value: "Certified techs" },
    { page: "home", section: "quote", key: "title", value: "What do you need fixed?" },
    { page: "home", section: "quote", key: "placeholder", value: "e.g. iPhone 14 screen" },
    { page: "home", section: "quote", key: "button", value: "Find my repair" },
    { page: "home", section: "reviews", key: "title", value: "What Glasgow says about us" },
    { page: "home", section: "blog", key: "title", value: "Repair tips & guides" },
    { page: "home", section: "cta-bottom", key: "title", value: "Ready to get your gadget fixed?" },
  ],
  services: [
    { page: "services", section: "hero", key: "title", value: "Our Repair Services" },
    { page: "services", section: "hero", key: "subtitle", value: "From cracked iPhone screens to tablet charging ports and full network unlocks — our certified technicians fix it all, with a 30-day warranty on every repair." },
    { page: "services", section: "cta", key: "title", value: "Can't see your device or issue?" },
    { page: "services", section: "cta", key: "subtitle", value: "We repair thousands of models. Give us a call or send us a message — we'll give you a free, no-obligation quote in minutes." },
  ],
  collection: [
    { page: "collection", section: "hero", key: "title", value: "Free Doorstep Collection Across Glasgow" },
    { page: "collection", section: "hero", key: "subtitle", value: "Can't come to us? We'll come to you. Free doorstep collection and delivery across Glasgow for repair services. Book online today." },
    { page: "collection", section: "steps", key: "step1", value: "Book online or call us — tell us your device and issue" },
    { page: "collection", section: "steps", key: "step2", value: "We collect your device from your home or office — free" },
    { page: "collection", section: "steps", key: "step3", value: "We diagnose, repair and test your device" },
    { page: "collection", section: "steps", key: "step4", value: "We deliver your fixed device back to your door — free" },
    { page: "collection", section: "areas", key: "title", value: "Areas we cover" },
  ],
  reviews: [
    { page: "reviews", section: "hero", key: "title", value: "What Glasgow Says About Us" },
    { page: "reviews", section: "hero", key: "subtitle", value: "We've helped thousands of Glaswegians get their gadgets back up and running. Here's what they think." },
    { page: "reviews", section: "form", key: "title", value: "Leave a review" },
    { page: "reviews", section: "form", key: "subtitle", value: "Tell Glasgow about your experience. Reviews are moderated before they appear on the site." },
  ],
  contact: [
    { page: "contact", section: "hero", key: "title", value: "Get In Touch" },
    { page: "contact", section: "form", key: "title", value: "Book a repair" },
    { page: "contact", section: "info", key: "phone_label", value: "Call Now" },
    { page: "contact", section: "info", key: "visit_label", value: "Visit Us" },
    { page: "contact", section: "info", key: "website_label", value: "Website" },
  ],
  blog: [
    { page: "blog", section: "hero", key: "title", value: "Gadget Repairs Glasgow Blog" },
    { page: "blog", section: "hero", key: "subtitle", value: "Repair tips, guides & news from Glasgow's trusted repair shop." },
  ],
};

function loadFromStorage(): Record<string, Row[]> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
    return null;
  } catch {
    return null;
  }
}

function saveToStorage(data: Record<string, Row[]>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function PagesModule() {
  const [active, setActive] = useState<PageId>("home");
  const [allData, setAllData] = useState<Record<string, Row[]>>({});
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load all page data on mount
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      setAllData(stored);
      setRows(stored[active] || DEFAULT_ROWS[active] || []);
    } else {
      // Use default rows
      setAllData(DEFAULT_ROWS);
      setRows(DEFAULT_ROWS[active] || []);
    }
    setLoading(false);
  }, []);

  // Try API for live data
  const loadFromApi = useCallback(async () => {
    try {
      const d = await adminJson<{ rows: Row[] }>(
        `/api/admin/pages?page=${active}`
      );
      if (d.rows && d.rows.length > 0) {
        setRows(d.rows);
        setAllData((prev) => {
          const next = { ...prev, [active]: d.rows };
          saveToStorage(next);
          return next;
        });
      }
    } catch {
      // API unavailable — use localStorage or defaults (already loaded)
    }
  }, [active]);

  useEffect(() => {
    loadFromApi();
  }, [loadFromApi]);

  // When switching tabs, load the rows for that page
  useEffect(() => {
    const pageRows = allData[active] || DEFAULT_ROWS[active] || [];
    setRows(pageRows);
  }, [active, allData]);

  function update(i: number, field: keyof Row, value: string) {
    setRows((prev) => {
      const next = prev.map((r, j) => (j === i ? { ...r, [field]: value } : r));
      // Save to allData + localStorage immediately
      setAllData((prevAll) => {
        const nextAll = { ...prevAll, [active]: next };
        saveToStorage(nextAll);
        return nextAll;
      });
      return next;
    });
  }

  function add() {
    setRows((prev) => {
      const next = [
        ...prev,
        { page: active, section: "section", key: `key-${Date.now()}`, value: "" },
      ];
      setAllData((prevAll) => {
        const nextAll = { ...prevAll, [active]: next };
        saveToStorage(nextAll);
        return nextAll;
      });
      return next;
    });
  }

  function remove(i: number) {
    setRows((prev) => {
      const next = prev.filter((_, j) => j !== i);
      setAllData((prevAll) => {
        const nextAll = { ...prevAll, [active]: next };
        saveToStorage(nextAll);
        return nextAll;
      });
      return next;
    });
  }

  async function save() {
    setSaving(true);
    const items = rows.map((r) => ({
      section: r.section,
      key: r.key,
      value: r.value,
    }));

    // Save to localStorage immediately
    setAllData((prev) => {
      const next = { ...prev, [active]: rows };
      saveToStorage(next);
      return next;
    });

    try {
      const d = await adminJson<{ count: number }>("/api/admin/pages", {
        method: "PUT",
        body: JSON.stringify({ page: active, items }),
      });
      toast.success(`Saved ${d.count} content rows`);
    } catch {
      toast.success(`${rows.length} content rows saved (saved locally)`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-b py-3">
          <CardTitle className="text-base">Page content editor</CardTitle>
          <CardDescription>
            Edit key/value content rows for each public page. Changes are saved
            locally and persist across refreshes.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs value={active} onValueChange={(v) => setActive(v as PageId)}>
            <TabsList className="flex-wrap h-auto">
              {PAGES.map((p) => {
                const count = (allData[p.id] || DEFAULT_ROWS[p.id] || []).length;
                return (
                  <TabsTrigger key={p.id} value={p.id} className="gap-1.5">
                    {p.label}
                    <span className="rounded-full bg-slate-200 px-1.5 text-[10px] font-medium text-slate-600">
                      {count}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <TabsContent value={active} className="mt-4">
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {rows.length === 0 && (
                    <div className="rounded-md border border-dashed p-6 text-center text-sm text-slate-500">
                      No content rows yet. Click &quot;Add row&quot; to create one.
                    </div>
                  )}
                  {rows.map((r, i) => (
                    <div
                      key={r.id || `new-${i}`}
                      className="grid grid-cols-1 gap-2 rounded-md border p-3 sm:grid-cols-[1fr_1fr_2fr_auto]"
                    >
                      <div>
                        <Label className="text-[10px] uppercase text-slate-500">
                          Section
                        </Label>
                        <Input
                          value={r.section}
                          onChange={(e) => update(i, "section", e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] uppercase text-slate-500">
                          Key
                        </Label>
                        <Input
                          value={r.key}
                          onChange={(e) => update(i, "key", e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <Label className="text-[10px] uppercase text-slate-500">
                          Value
                        </Label>
                        <Textarea
                          rows={1}
                          value={r.value}
                          onChange={(e) => update(i, "value", e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(i)}
                          className="text-red-600 hover:bg-red-50 h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={add}
                      className="gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add row
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
                      Save {active} page
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
