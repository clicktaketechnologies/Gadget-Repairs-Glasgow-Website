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

export function PagesModule() {
  const [active, setActive] = useState<PageId>("home");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await adminJson<{ rows: Row[] }>(
        `/api/admin/pages?page=${active}`
      );
      setRows(d.rows || []);
    } catch {
      // Fallback: show empty rows when API is unreachable
      setRows([]);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [active]);

  useEffect(() => {
    load();
  }, [load]);

  function update(i: number, field: keyof Row, value: string) {
    setRows((prev) =>
      prev.map((r, j) => (j === i ? { ...r, [field]: value } : r))
    );
  }

  function add() {
    setRows((prev) => [
      ...prev,
      { page: active, section: "section", key: `key-${Date.now()}`, value: "" },
    ]);
  }

  function remove(i: number) {
    setRows((prev) => prev.filter((_, j) => j !== i));
  }

  async function save() {
    setSaving(true);
    try {
      const items = rows.map((r) => ({
        section: r.section,
        key: r.key,
        value: r.value,
      }));
      const d = await adminJson<{ count: number }>("/api/admin/pages", {
        method: "PUT",
        body: JSON.stringify({ page: active, items }),
      });
      toast.success(`Saved ${d.count} content rows`);
      load();
    } catch {
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
            Edit key/value content rows for each public page. Use section + key
            to look up values from the public site.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs value={active} onValueChange={(v) => setActive(v as PageId)}>
            <TabsList className="flex-wrap">
              {PAGES.map((p) => (
                <TabsTrigger key={p.id} value={p.id}>
                  {p.label}
                </TabsTrigger>
              ))}
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
                      No content rows yet. Click “Add row” to create one.
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
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] uppercase text-slate-500">
                          Key
                        </Label>
                        <Input
                          value={r.key}
                          onChange={(e) => update(i, "key", e.target.value)}
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
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(i)}
                          className="text-red-600 hover:bg-red-50"
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
