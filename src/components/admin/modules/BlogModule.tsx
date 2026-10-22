"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { adminJson } from "@/lib/admin-fetch";
import { slugify, fmtDate } from "@/lib/utils2";
import { Plus, Pencil, Trash2, Loader2, Save, Newspaper, Star } from "lucide-react";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  category: string;
  tags: string | null;
  author: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
}

const EMPTY = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "General",
  tags: "",
  author: "Gadget Repairs Glasgow",
  published: false,
  featured: false,
};

export function BlogModule() {
  const [posts, setPosts] = useState<BlogPost[]>([
    { id: "p1", slug: "cracked-iphone-screen-glasgow-guide", title: "Cracked iPhone Screen in Glasgow? Complete Repair Guide", excerpt: "Everything you need to know about iPhone screen repair in Glasgow.", content: "# Cracked iPhone Screen\n\nCosts, turnaround times, and warranty info.", coverImage: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80", category: "Mobile Repair", tags: "iPhone,screen repair", author: "Gadget Repairs Glasgow", published: true, featured: true, createdAt: "2025-10-20T10:00:00Z", updatedAt: "2025-10-20T10:00:00Z" },
    { id: "p2", slug: "macbook-repair-glasgow-guide", title: "MacBook Repair in Glasgow: Costs & What to Expect", excerpt: "MacBook not turning on? Here's everything Glasgow MacBook owners need to know.", content: "# MacBook Repair\n\nCommon issues and costs.", coverImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80", category: "MacBook Repair", tags: "MacBook,repair", author: "Gadget Repairs Glasgow", published: true, featured: false, createdAt: "2025-10-19T10:00:00Z", updatedAt: "2025-10-19T10:00:00Z" },
    { id: "p3", slug: "ghd-straightener-repair-guide", title: "GHD Won't Heat? Common Faults & Repair Costs", excerpt: "GHD stopped working? Here's what's wrong and how much it costs to fix.", content: "# GHD Repair Guide\n\nCommon faults and costs.", coverImage: "https://images.unsplash.com/photo-1522335789203-aaa9cbb96e9d?w=800&q=80", category: "GHD Repair", tags: "GHD,straightener", author: "Gadget Repairs Glasgow", published: true, featured: false, createdAt: "2025-10-18T10:00:00Z", updatedAt: "2025-10-18T10:00:00Z" },
    { id: "p4", slug: "ps5-xbox-hdmi-port-repair", title: "PS5/Xbox HDMI Port Broken? Console Repair Guide", excerpt: "No signal on your PS5 or Xbox? Here's how much console repair costs.", content: "# Console HDMI Repair\n\nCommon issues and costs.", coverImage: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80", category: "Game Console Repair", tags: "PS5,Xbox,HDMI", author: "Gadget Repairs Glasgow", published: true, featured: false, createdAt: "2025-10-17T10:00:00Z", updatedAt: "2025-10-17T10:00:00Z" },
  ]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await adminJson<{ posts: BlogPost[] }>("/api/admin/blog");
      setPosts(d.posts || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setForm(EMPTY);
    setEditing(null);
    setCreating(true);
  }

  function openEdit(p: BlogPost) {
    setForm({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      coverImage: p.coverImage || "",
      category: p.category,
      tags: p.tags || "",
      author: p.author,
      published: p.published,
      featured: p.featured,
    });
    setEditing(p);
    setCreating(true);
  }

  async function save() {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, slug: form.slug || slugify(form.title) };
      if (editing) {
        const d = await adminJson<{ post: BlogPost }>(
          `/api/admin/blog/${editing.id}`,
          { method: "PATCH", body: JSON.stringify(payload) }
        );
        setPosts((prev) =>
          prev.map((p) => (p.id === d.post.id ? d.post : p))
        );
        toast.success("Post updated");
      } else {
        const d = await adminJson<{ post: BlogPost }>(
          "/api/admin/blog",
          { method: "POST", body: JSON.stringify(payload) }
        );
        setPosts((prev) => [d.post, ...prev]);
        toast.success("Post created");
      }
      setCreating(false);
    } catch {
    } finally {
      setSaving(false);
    }
  }

  async function patchField(p: BlogPost, field: "published" | "featured", value: boolean) {
    setPosts((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, [field]: value } : x))
    );
    try {
      await adminJson(`/api/admin/blog/${p.id}`, {
        method: "PATCH",
        body: JSON.stringify({ [field]: value }),
      });
      toast.success(`${p.title}: ${field} ${value ? "on" : "off"}`);
    } catch {
      setPosts((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, [field]: !value } : x))
      );
    }
  }

  function openDelete(p: BlogPost) {
    setDeletingId(p.id);
    setDeleteOpen(true);
  }

  async function confirmDelete() {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await adminJson(`/api/admin/blog/${deletingId}`, {
        method: "DELETE",
      });
      setPosts((prev) => prev.filter((p) => p.id !== deletingId));
      toast.success("Post deleted");
      setDeleteOpen(false);
      setDeletingId(null);
    } catch {
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {posts.length} blog posts ·{" "}
          {posts.filter((p) => p.published).length} published
        </p>
        <Button onClick={openCreate} className="gap-2 bg-blue-900 hover:bg-blue-800">
          <Plus className="h-4 w-4" />
          New post
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b py-3">
          <CardTitle className="text-base">All posts</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-slate-500">
              <Newspaper className="h-10 w-10 text-slate-300" />
              <p className="text-sm">No blog posts yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium text-slate-900">{p.title}</div>
                      <div className="font-mono text-xs text-slate-500">
                        /blog/{p.slug}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{p.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-slate-600">
                      {p.createdAt ? fmtDate(p.createdAt) : "—"}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={p.published}
                        onCheckedChange={(v) => patchField(p, "published", v)}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={p.featured}
                        onCheckedChange={(v) => patchField(p, "featured", v)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(p)} className="gap-1">
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openDelete(p)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit post" : "New blog post"}</DialogTitle>
            <DialogDescription>
              Markdown content supported. A unique slug is auto-generated.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    title: e.target.value,
                    slug: editing ? f.slug : slugify(e.target.value),
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="auto-generated"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Author</Label>
              <Input
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tags (comma-separated)</Label>
              <Input
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                placeholder="iphone, screen, repair"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Cover image URL</Label>
              <Input
                value={form.coverImage}
                onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                placeholder="https://…"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Excerpt</Label>
              <Textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="One-line summary shown in the post list."
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Content (Markdown)</Label>
              <Textarea
                rows={10}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="# Heading&#10;&#10;Write your post in **markdown**…"
                className="font-mono text-xs"
              />
            </div>
            <div className="flex items-center gap-6 sm:col-span-2">
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={form.published}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, published: v }))}
                />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={form.featured}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))}
                />
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                Featured
              </label>
            </div>
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
              {editing ? "Save changes" : "Create post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the blog post.
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
