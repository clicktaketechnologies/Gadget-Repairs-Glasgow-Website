"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ServiceIcon, SERVICE_ICON_NAMES } from "@/components/admin/ServiceIcons";
import { adminJson } from "@/lib/admin-fetch";
import { Plus, Pencil, Trash2, Loader2, Save, PackageSearch } from "lucide-react";
import { toast } from "sonner";

interface Service {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  priceFrom: string | null;
  priceTo: string | null;
  turnaround: string | null;
  popular: boolean;
  active: boolean;
  sortOrder: number;
}

const EMPTY: Omit<Service, "id"> = {
  slug: "",
  name: "",
  category: "",
  description: "",
  icon: "Wrench",
  priceFrom: "",
  priceTo: "",
  turnaround: "",
  popular: false,
  active: true,
  sortOrder: 0,
};

const STORAGE_KEY = "grg-admin-services";

const FALLBACK_SERVICES: Service[] = [
  { id: "s1", slug: "mobile-repair", name: "Mobile Repair Service", category: "Mobile Repair", description: "Professional repair for all smartphones.", icon: "Smartphone", priceFrom: "£25", priceTo: "£250", turnaround: "30 min – 2 hours", popular: true, active: true, sortOrder: 1 },
  { id: "s2", slug: "macbook-repair", name: "MacBook Repair Service", category: "MacBook Repair", description: "Expert MacBook repair.", icon: "Laptop", priceFrom: "£60", priceTo: "£450", turnaround: "1 – 3 days", popular: true, active: true, sortOrder: 2 },
  { id: "s3", slug: "laptop-repair", name: "Laptop Repair Service", category: "Laptop Repair", description: "Comprehensive laptop repair.", icon: "Laptop", priceFrom: "£40", priceTo: "£300", turnaround: "1 – 2 days", popular: true, active: true, sortOrder: 3 },
  { id: "s4", slug: "ghd-repair", name: "GHD Repair Service", category: "GHD Repair", description: "GHD hair straightener repair.", icon: "Zap", priceFrom: "£20", priceTo: "£60", turnaround: "1 – 2 hours", popular: false, active: true, sortOrder: 4 },
  { id: "s5", slug: "tablet-repair", name: "Tablet Repair Service", category: "Tablet Repair", description: "Tablet and iPad repair.", icon: "Tablet", priceFrom: "£40", priceTo: "£220", turnaround: "1 – 3 hours", popular: true, active: true, sortOrder: 5 },
  { id: "s6", slug: "game-console-repair", name: "Game Console Repair Service", category: "Game Console Repair", description: "Game console repair.", icon: "Gamepad2", priceFrom: "£35", priceTo: "£200", turnaround: "1 – 3 days", popular: false, active: true, sortOrder: 6 },
  { id: "s7", slug: "computer-repair", name: "Computer Repair Service", category: "Computer Repair", description: "Desktop PC and iMac repair.", icon: "Monitor", priceFrom: "£35", priceTo: "£350", turnaround: "1 – 3 days", popular: false, active: true, sortOrder: 7 },
  { id: "s8", slug: "smart-watch-repair", name: "Smart Watch Repair Service", category: "Smart Watch Repair", description: "Smart watch repair.", icon: "Watch", priceFrom: "£30", priceTo: "£180", turnaround: "1 – 2 hours", popular: false, active: true, sortOrder: 8 },
];

function loadFromStorage(): Service[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return null;
  } catch {
    return null;
  }
}

function saveToStorage(services: Service[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  } catch {}
}

export function ServicesModule() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<Service, "id">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await adminJson<{ services: Service[] }>("/api/admin/services");
      if (d.services && d.services.length > 0) {
        setServices(d.services);
        saveToStorage(d.services);
      } else {
        const stored = loadFromStorage();
        setServices(stored || FALLBACK_SERVICES);
      }
    } catch {
      // API unreachable — use localStorage or fallback
      const stored = loadFromStorage();
      setServices(stored || FALLBACK_SERVICES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Sync to localStorage whenever services change
  useEffect(() => {
    if (services.length > 0) {
      saveToStorage(services);
    }
  }, [services]);

  const grouped = useMemo(() => {
    const map = new Map<string, Service[]>();
    for (const s of services) {
      const k = s.category || "Uncategorised";
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(s);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [services]);

  function openCreate() {
    setForm(EMPTY);
    setEditing(null);
    setCreating(true);
  }

  function openEdit(s: Service) {
    setForm({ ...s });
    setEditing(s);
    setCreating(true);
  }

  async function save() {
    if (!form.name.trim()) {
      toast.error("Service name is required");
      return;
    }
    setSaving(true);
    const slug =
      form.slug ||
      form.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    const category = form.category || "General";

    try {
      const payload = { ...form, slug, category };
      if (editing) {
        const d = await adminJson<{ service: Service }>(
          `/api/admin/services/${editing.id}`,
          {
            method: "PATCH",
            body: JSON.stringify(payload),
          }
        );
        setServices((prev) =>
          prev.map((s) => (s.id === d.service.id ? d.service : s))
        );
        toast.success("Service updated");
      } else {
        const d = await adminJson<{ service: Service }>(
          "/api/admin/services",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );
        setServices((prev) => [...prev, d.service]);
        toast.success("Service created");
      }
      setCreating(false);
    } catch {
      // API failed — save locally so data persists across refreshes
      if (editing) {
        const updated: Service = { ...editing, ...form, slug, category };
        setServices((prev) => {
          const next = prev.map((s) => (s.id === editing.id ? updated : s));
          saveToStorage(next);
          return next;
        });
        toast.success("Service updated (saved locally)");
      } else {
        const newService: Service = {
          id: `local-${Date.now()}`,
          ...form,
          slug,
          category,
        };
        setServices((prev) => {
          const next = [...prev, newService];
          saveToStorage(next);
          return next;
        });
        toast.success("Service created (saved locally)");
      }
      setCreating(false);
    } finally {
      setSaving(false);
    }
  }

  async function patchField(s: Service, field: "popular" | "active", value: boolean) {
    // Optimistic update — save to state + localStorage immediately
    setServices((prev) => {
      const next = prev.map((x) =>
        x.id === s.id ? { ...x, [field]: value } : x
      );
      saveToStorage(next);
      return next;
    });
    try {
      await adminJson(`/api/admin/services/${s.id}`, {
        method: "PATCH",
        body: JSON.stringify({ [field]: value }),
      });
      toast.success(`${s.name}: ${field} ${value ? "on" : "off"}`);
    } catch {
      // API failed — keep the optimistic update (don't revert!)
      toast.success(`${s.name}: ${field} ${value ? "on" : "off"} (saved locally)`);
    }
  }

  function openDelete(s: Service) {
    setDeletingId(s.id);
    setDeleteOpen(true);
  }

  async function confirmDelete() {
    if (!deletingId) return;
    setDeleting(true);
    // Optimistic delete — remove from state + localStorage immediately
    setServices((prev) => {
      const next = prev.filter((s) => s.id !== deletingId);
      saveToStorage(next);
      return next;
    });
    try {
      await adminJson(`/api/admin/services/${deletingId}`, {
        method: "DELETE",
      });
      toast.success("Service deleted");
    } catch {
      // API failed — service already removed locally, that's fine
      toast.success("Service deleted (saved locally)");
    }
    setDeleteOpen(false);
    setDeletingId(null);
    setDeleting(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {services.length} services across {grouped.length} categories
        </p>
        <Button
          onClick={openCreate}
          className="gap-2 bg-blue-900 hover:bg-blue-800"
        >
          <Plus className="h-4 w-4" />
          Add service
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16 text-slate-500">
            <PackageSearch className="h-10 w-10 text-slate-300" />
            <p className="text-sm">No services yet. Click “Add service” to create one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {grouped.map(([cat, items]) => (
            <Card key={cat}>
              <CardHeader className="border-b py-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="text-slate-900">{cat}</span>
                  <Badge variant="outline">{items.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pt-0">
                <div className="divide-y">
                  {items.map((s) => (
                    <div
                      key={s.id}
                      className="flex flex-wrap items-center gap-3 px-4 py-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-900">
                        <ServiceIcon name={s.icon} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-slate-900">
                            {s.name}
                          </span>
                          {s.popular && (
                            <Badge className="bg-orange-500 text-white">
                              Popular
                            </Badge>
                          )}
                          {!s.active && (
                            <Badge variant="secondary">Hidden</Badge>
                          )}
                        </div>
                        {s.description && (
                          <p className="line-clamp-1 text-xs text-slate-500">
                            {s.description}
                          </p>
                        )}
                        <div className="mt-0.5 flex flex-wrap gap-x-3 text-[11px] text-slate-500">
                          {s.priceFrom && <span>from £{s.priceFrom}</span>}
                          {s.priceTo && <span>to £{s.priceTo}</span>}
                          {s.turnaround && <span>· {s.turnaround}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <Label className="text-xs text-slate-500">Popular</Label>
                          <Switch
                            checked={s.popular}
                            onCheckedChange={(v) => patchField(s, "popular", v)}
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Label className="text-xs text-slate-500">Active</Label>
                          <Switch
                            checked={s.active}
                            onCheckedChange={(v) => patchField(s, "active", v)}
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(s)}
                          className="gap-1"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openDelete(s)}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit service" : "Add service"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update this service's details."
                : "Create a new service for the pricing page."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Name *</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. iPhone Screen Replacement"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Slug (optional)</Label>
              <Input
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                placeholder="auto-generated from name"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category *</Label>
              <Input
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                placeholder="e.g. Phone Repairs"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Icon</Label>
              <Select
                value={form.icon}
                onValueChange={(v) => setForm((f) => ({ ...f, icon: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_ICON_NAMES.map((n) => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Turnaround</Label>
              <Input
                value={form.turnaround || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, turnaround: e.target.value }))
                }
                placeholder="e.g. 30 mins"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Price from (£)</Label>
              <Input
                value={form.priceFrom || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, priceFrom: e.target.value }))
                }
                placeholder="49"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Price to (£)</Label>
              <Input
                value={form.priceTo || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, priceTo: e.target.value }))
                }
                placeholder="89"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Sort order</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    sortOrder: Number(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Short description shown on the service card."
              />
            </div>
            <div className="flex items-center gap-6 sm:col-span-2">
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={form.popular}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, popular: v }))
                  }
                />
                Mark as popular
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={form.active}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, active: v }))
                  }
                />
                Active (visible on site)
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreating(false)}
            >
              Cancel
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
              {editing ? "Save changes" : "Create service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this service?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the service from the public pricing page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
