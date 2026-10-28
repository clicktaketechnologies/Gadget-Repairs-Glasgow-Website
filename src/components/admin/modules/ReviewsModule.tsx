"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { StarRow } from "@/components/admin/StarRow";
import { adminJson } from "@/lib/admin-fetch";
import { fmtDateTime } from "@/lib/utils2";
import { Plus, Pencil, Trash2, Loader2, Save, Star } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  device: string | null;
  source: string;
  approved: boolean;
  createdAt: string;
}

type Filter = "pending" | "approved" | "all";

const EMPTY = {
  author: "",
  rating: 5,
  comment: "",
  device: "",
  source: "admin",
  approved: true,
};

const STORAGE_KEY = "grg-admin-reviews";
const PUBLIC_KEY = "grg-public-reviews";

const FALLBACK_REVIEWS: Review[] = [
  { id: "r1", author: "Mark Thompson", rating: 5, comment: "Cracked iPhone 14 Pro screen replaced in 40 minutes. Best price in Glasgow!", device: "iPhone 14 Pro", source: "Google", approved: true, createdAt: "2025-10-15T10:00:00Z" },
  { id: "r2", author: "Sarah McLean", rating: 5, comment: "Samsung battery swapped same day. Friendly staff and honest advice.", device: "Samsung Galaxy S22", source: "Google", approved: true, createdAt: "2025-10-12T14:30:00Z" },
  { id: "r3", author: "David Wilson", rating: 5, comment: "MacBook keyboard replaced for half what Apple quoted. Quality part, 30-day warranty.", device: "MacBook Pro 2019", source: "Google", approved: true, createdAt: "2025-10-10T09:15:00Z" },
  { id: "r4", author: "Aisha Rahman", rating: 5, comment: "Fixed my GHD straighteners in an hour for £25. Brilliant service!", device: "GHD Platinum+", source: "Walk-in", approved: true, createdAt: "2025-10-08T16:45:00Z" },
  { id: "r5", author: "New Customer", rating: 5, comment: "Great service, highly recommend!", device: "iPhone 15", source: "online", approved: false, createdAt: new Date().toISOString() },
];

function loadFromStorage(): Review[] | null {
  if (typeof window === "undefined") return null;
  try {
    // Read admin reviews
    const raw = localStorage.getItem(STORAGE_KEY);
    const adminReviews = raw ? JSON.parse(raw) : [];

    // Also read public reviews (submitted via the website review form)
    const publicRaw = localStorage.getItem(PUBLIC_KEY);
    const publicReviews = publicRaw ? JSON.parse(publicRaw) : [];

    // Merge: public reviews first (most recent), then admin reviews (dedup by id)
    const adminIds = new Set(adminReviews.map((r: any) => r.id));
    const merged = [
      ...publicReviews.filter((r: any) => !adminIds.has(r.id)),
      ...adminReviews,
    ];

    if (Array.isArray(merged) && merged.length > 0) return merged;
    return null;
  } catch {
    return null;
  }
}

function saveToStorage(reviews: Review[]) {
  if (typeof window === "undefined") return;
  try {
    // Save admin reviews (exclude public ones by id prefix)
    const adminOnly = reviews.filter((r) => !r.id.startsWith("local-"));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(adminOnly));

    // Also update public reviews if any were modified
    const publicReviews = reviews.filter((r) => r.id.startsWith("local-"));
    if (publicReviews.length > 0) {
      localStorage.setItem(PUBLIC_KEY, JSON.stringify(publicReviews));
    }
  } catch {}
}

export function ReviewsModule() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("pending");
  const [editing, setEditing] = useState<Review | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await adminJson<{ reviews: Review[] }>(
        `/api/admin/reviews?filter=${filter}`
      );
      if (d.reviews && d.reviews.length > 0) {
        setReviews(d.reviews);
        saveToStorage(d.reviews);
      } else {
        const stored = loadFromStorage();
        setReviews(stored || FALLBACK_REVIEWS);
      }
    } catch {
      // API unreachable — use localStorage or fallback
      const stored = loadFromStorage();
      setReviews(stored || FALLBACK_REVIEWS);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  // Sync to localStorage whenever reviews change
  useEffect(() => {
    if (reviews.length > 0) {
      saveToStorage(reviews);
    }
  }, [reviews]);

  const counts = useMemo(() => {
    let pending = 0,
      approved = 0;
    for (const r of reviews) {
      if (r.approved) approved++;
      else pending++;
    }
    return { pending, approved, all: reviews.length };
  }, [reviews]);

  function openCreate() {
    setForm(EMPTY);
    setEditing(null);
    setCreating(true);
  }

  function openEdit(r: Review) {
    setForm({
      author: r.author,
      rating: r.rating,
      comment: r.comment,
      device: r.device || "",
      source: r.source,
      approved: r.approved,
    });
    setEditing(r);
    setCreating(true);
  }

  async function save() {
    if (!form.author.trim() || !form.comment.trim()) {
      toast.error("Author and comment are required");
      return;
    }
    setSaving(true);
    const now = new Date().toISOString();

    try {
      if (editing) {
        const d = await adminJson<{ review: Review }>(
          `/api/admin/reviews/${editing.id}`,
          {
            method: "PATCH",
            body: JSON.stringify(form),
          }
        );
        setReviews((prev) =>
          prev.map((r) => (r.id === d.review.id ? d.review : r))
        );
        toast.success("Review updated");
      } else {
        const d = await adminJson<{ review: Review }>(
          "/api/admin/reviews",
          {
            method: "POST",
            body: JSON.stringify(form),
          }
        );
        setReviews((prev) => [d.review, ...prev]);
        toast.success("Review added");
      }
      setCreating(false);
    } catch {
      // API failed — save locally so data persists across refreshes
      if (editing) {
        const updated: Review = {
          ...editing,
          author: form.author,
          rating: form.rating,
          comment: form.comment,
          device: form.device || null,
          source: form.source,
          approved: form.approved,
        };
        setReviews((prev) => {
          const next = prev.map((r) => (r.id === editing.id ? updated : r));
          saveToStorage(next);
          return next;
        });
        toast.success("Review updated (saved locally)");
      } else {
        const newReview: Review = {
          id: `local-${Date.now()}`,
          author: form.author,
          rating: form.rating,
          comment: form.comment,
          device: form.device || null,
          source: form.source,
          approved: form.approved,
          createdAt: now,
        };
        setReviews((prev) => {
          const next = [newReview, ...prev];
          saveToStorage(next);
          return next;
        });
        toast.success("Review added (saved locally)");
      }
      setCreating(false);
    } finally {
      setSaving(false);
    }
  }

  async function toggleApprove(r: Review, value: boolean) {
    // Optimistic update — save to state + localStorage immediately
    setReviews((prev) => {
      const next = prev.map((x) =>
        x.id === r.id ? { ...x, approved: value } : x
      );
      saveToStorage(next);
      return next;
    });
    try {
      await adminJson(`/api/admin/reviews/${r.id}`, {
        method: "PATCH",
        body: JSON.stringify({ approved: value }),
      });
      toast.success(value ? "Review approved" : "Review hidden");
    } catch {
      // API failed — keep the optimistic update (don't revert!)
      toast.success(value ? "Review approved (saved locally)" : "Review hidden (saved locally)");
    }
  }

  function openDelete(r: Review) {
    setDeletingId(r.id);
    setDeleteOpen(true);
  }

  async function confirmDelete() {
    if (!deletingId) return;
    setDeleting(true);
    // Optimistic delete — remove from state + localStorage immediately
    setReviews((prev) => {
      const next = prev.filter((r) => r.id !== deletingId);
      saveToStorage(next);
      return next;
    });
    try {
      await adminJson(`/api/admin/reviews/${deletingId}`, {
        method: "DELETE",
      });
      toast.success("Review deleted");
    } catch {
      // API failed — review already removed locally, that's fine
      toast.success("Review deleted (saved locally)");
    }
    setDeleteOpen(false);
    setDeletingId(null);
    setDeleting(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({counts.pending})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({counts.approved})
            </TabsTrigger>
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button
          onClick={openCreate}
          className="gap-2 bg-blue-900 hover:bg-blue-800"
        >
          <Plus className="h-4 w-4" />
          Add review
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16 text-slate-500">
            <Star className="h-10 w-10 text-slate-300" />
            <p className="text-sm">No reviews in this view.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {reviews.map((r) => (
            <Card key={r.id} className="py-4">
              <CardContent className="space-y-2 px-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">
                        {r.author}
                      </span>
                      <StarRow rating={r.rating} />
                    </div>
                    <div className="text-xs text-slate-500">
                      {r.device ? `${r.device} · ` : ""}
                      {r.source} · {fmtDateTime(r.createdAt)}
                    </div>
                  </div>
                  <Switch
                    checked={r.approved}
                    onCheckedChange={(v) => toggleApprove(r, v)}
                  />
                </div>
                <p className="text-sm text-slate-700">{r.comment}</p>
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEdit(r)}
                    className="gap-1"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openDelete(r)}
                    className="gap-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit */}
      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit review" : "Add review"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update this review."
                : "Manually add a customer review."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Author *</Label>
              <Input
                value={form.author}
                onChange={(e) =>
                  setForm((f) => ({ ...f, author: e.target.value }))
                }
                placeholder="e.g. Sarah M."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Rating</Label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, rating: n }))}
                      className="p-0.5"
                      aria-label={`${n} stars`}
                    >
                      <Star
                        className={
                          n <= form.rating
                            ? "h-6 w-6 fill-amber-400 text-amber-400"
                            : "h-6 w-6 fill-zinc-200 text-zinc-200"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Source</Label>
                <Input
                  value={form.source}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, source: e.target.value }))
                  }
                  placeholder="admin / Google / Facebook"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Device (optional)</Label>
              <Input
                value={form.device}
                onChange={(e) =>
                  setForm((f) => ({ ...f, device: e.target.value }))
                }
                placeholder="e.g. iPhone 13"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Comment *</Label>
              <Textarea
                rows={4}
                value={form.comment}
                onChange={(e) =>
                  setForm((f) => ({ ...f, comment: e.target.value }))
                }
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={form.approved}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, approved: v }))
                }
              />
              Approved (visible on site)
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreating(false)}>
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
              {editing ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this review?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the review.
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
