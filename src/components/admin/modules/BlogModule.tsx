"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Pencil, Trash2, Loader2, Save, Newspaper, Star, ImagePlus, Link2, X } from "lucide-react";
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
  updatedAt: string;
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

const STORAGE_KEY = "grg-admin-blog";

const FALLBACK_POSTS: BlogPost[] = [
  { id: "p1", slug: "cracked-iphone-screen-glasgow-guide", title: "Cracked iPhone Screen in Glasgow? Complete Repair Guide", excerpt: "Everything you need to know about iPhone screen repair in Glasgow.", content: "# Cracked iPhone Screen\n\nCosts, turnaround times, and warranty info.", coverImage: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80", category: "Mobile Repair", tags: "iPhone,screen repair", author: "Gadget Repairs Glasgow", published: true, featured: true, createdAt: "2025-10-20T10:00:00Z", updatedAt: "2025-10-20T10:00:00Z" },
  { id: "p2", slug: "macbook-repair-glasgow-guide", title: "MacBook Repair in Glasgow: Costs & What to Expect", excerpt: "MacBook not turning on? Here's everything Glasgow MacBook owners need to know.", content: "# MacBook Repair\n\nCommon issues and costs.", coverImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80", category: "MacBook Repair", tags: "MacBook,repair", author: "Gadget Repairs Glasgow", published: true, featured: false, createdAt: "2025-10-19T10:00:00Z", updatedAt: "2025-10-19T10:00:00Z" },
  { id: "p3", slug: "ghd-straightener-repair-guide", title: "GHD Won't Heat? Common Faults & Repair Costs", excerpt: "GHD stopped working? Here's what's wrong and how much it costs to fix.", content: "# GHD Repair Guide\n\nCommon faults and costs.", coverImage: "https://images.unsplash.com/photo-1522335789203-aaa9cbb96e9d?w=800&q=80", category: "GHD Repair", tags: "GHD,straightener", author: "Gadget Repairs Glasgow", published: true, featured: false, createdAt: "2025-10-18T10:00:00Z", updatedAt: "2025-10-18T10:00:00Z" },
  { id: "p4", slug: "ps5-xbox-hdmi-port-repair", title: "PS5/Xbox HDMI Port Broken? Console Repair Guide", excerpt: "No signal on your PS5 or Xbox? Here's how much console repair costs.", content: "# Console HDMI Repair\n\nCommon issues and costs.", coverImage: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80", category: "Game Console Repair", tags: "PS5,Xbox,HDMI", author: "Gadget Repairs Glasgow", published: true, featured: false, createdAt: "2025-10-17T10:00:00Z", updatedAt: "2025-10-17T10:00:00Z" },
];

function loadFromStorage(): BlogPost[] | null {
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

function saveToStorage(posts: BlogPost[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {}
}

export function BlogModule() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useState<HTMLInputElement | null>(null);

  function insertImageAtCursor(url: string) {
    const textarea = document.getElementById("bp-content") as HTMLTextAreaElement;
    if (!textarea) {
      // Fallback: append to end
      const mdImage = `\n\n![Image](${url})\n\n`;
      setForm((f) => ({ ...f, content: f.content + mdImage }));
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = form.content.substring(0, start);
    const after = form.content.substring(end);
    const mdImage = `\n\n![Image](${url})\n\n`;
    const newContent = before + mdImage + after;
    setForm({ ...form, content: newContent });
    // Restore cursor position after the inserted image
    setTimeout(() => {
      textarea.focus();
      const newPos = start + mdImage.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  }

  function handleImageUrlSubmit() {
    if (!imageUrl.trim()) {
      toast.error("Please enter an image URL");
      return;
    }
    insertImageAtCursor(imageUrl.trim());
    toast.success("Image inserted");
    setImageUrl("");
    setImagePickerOpen(false);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large (max 2MB for inline). Use a URL for larger images.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      insertImageAtCursor(base64);
      toast.success("Image inserted");
      setImagePickerOpen(false);
    };
    reader.onerror = () => toast.error("Failed to read image");
    reader.readAsDataURL(file);
  }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await adminJson<{ posts: BlogPost[] }>("/api/admin/blog");
      if (d.posts && d.posts.length > 0) {
        setPosts(d.posts);
        saveToStorage(d.posts);
      } else {
        // API returned empty — use localStorage or fallback
        const stored = loadFromStorage();
        setPosts(stored || FALLBACK_POSTS);
      }
    } catch {
      // API unreachable — use localStorage or fallback
      const stored = loadFromStorage();
      setPosts(stored || FALLBACK_POSTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Sync to localStorage whenever posts change
  useEffect(() => {
    if (posts.length > 0) {
      saveToStorage(posts);
    }
  }, [posts]);

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
    const slug = form.slug || slugify(form.title);
    const now = new Date().toISOString();

    try {
      const payload = { ...form, slug };
      if (editing) {
        const d = await adminJson<{ post: BlogPost }>(
          `/api/admin/blog/${editing.id}`,
          { method: "PATCH", body: JSON.stringify(payload) }
        );
        setPosts((prev) => prev.map((p) => (p.id === d.post.id ? d.post : p)));
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
      // API failed — save locally so data persists across refreshes
      if (editing) {
        const updated: BlogPost = {
          ...editing,
          ...form,
          slug,
          updatedAt: now,
        };
        setPosts((prev) => {
          const next = prev.map((p) => (p.id === editing.id ? updated : p));
          saveToStorage(next);
          return next;
        });
        toast.success("Post updated (saved locally)");
      } else {
        const newPost: BlogPost = {
          id: `local-${Date.now()}`,
          slug,
          title: form.title,
          excerpt: form.excerpt,
          content: form.content,
          coverImage: form.coverImage || null,
          category: form.category,
          tags: form.tags || null,
          author: form.author,
          published: form.published,
          featured: form.featured,
          createdAt: now,
          updatedAt: now,
        };
        setPosts((prev) => {
          const next = [newPost, ...prev];
          saveToStorage(next);
          return next;
        });
        toast.success("Post created (saved locally)");
      }
      setCreating(false);
    } finally {
      setSaving(false);
    }
  }

  async function patchField(p: BlogPost, field: "published" | "featured", value: boolean) {
    // Optimistic update — save to state + localStorage immediately
    setPosts((prev) => {
      const next = prev.map((x) => (x.id === p.id ? { ...x, [field]: value, updatedAt: new Date().toISOString() } : x));
      saveToStorage(next);
      return next;
    });
    try {
      await adminJson(`/api/admin/blog/${p.id}`, {
        method: "PATCH",
        body: JSON.stringify({ [field]: value }),
      });
      toast.success(`${p.title}: ${field} ${value ? "on" : "off"}`);
    } catch {
      // API failed — keep the optimistic update (don't revert!)
      toast.success(`${p.title}: ${field} ${value ? "on" : "off"} (saved locally)`);
    }
  }

  function openDelete(p: BlogPost) {
    setDeletingId(p.id);
    setDeleteOpen(true);
  }

  async function confirmDelete() {
    if (!deletingId) return;
    setDeleting(true);
    // Optimistic delete — remove from state + localStorage immediately
    setPosts((prev) => {
      const next = prev.filter((p) => p.id !== deletingId);
      saveToStorage(next);
      return next;
    });
    try {
      await adminJson(`/api/admin/blog/${deletingId}`, {
        method: "DELETE",
      });
      toast.success("Post deleted");
    } catch {
      // API failed — post already removed locally, that's fine
      toast.success("Post deleted (saved locally)");
    }
    setDeleteOpen(false);
    setDeletingId(null);
    setDeleting(false);
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

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-slate-500">
            No blog posts yet. Click "New post" to create one.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="text-center">Published</TableHead>
                <TableHead className="text-center">Featured</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    {p.coverImage ? (
                      <img
                        src={p.coverImage}
                        alt=""
                        className="h-10 w-14 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-14 items-center justify-center rounded bg-slate-100">
                        <Newspaper className="h-4 w-4 text-slate-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium max-w-xs">
                    <div className="truncate">{p.title}</div>
                    <div className="text-xs text-slate-400 truncate">/{p.slug}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline">{p.category}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={p.published}
                      onCheckedChange={(v) => patchField(p, "published", v)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={p.featured}
                      onCheckedChange={(v) => patchField(p, "featured", v)}
                    />
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-slate-500">
                    {fmtDate(p.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(p)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDelete(p)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Post" : "New Blog Post"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update the blog post details." : "Create a new blog post."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="bp-title">Title *</Label>
              <Input
                id="bp-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter post title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bp-slug">Slug (optional)</Label>
                <Input
                  id="bp-slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="auto-generated from title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bp-category">Category</Label>
                <Input
                  id="bp-category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Mobile Repair"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bp-excerpt">Excerpt</Label>
              <Input
                id="bp-excerpt"
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Short summary shown in blog listing"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="bp-content">Content (Markdown)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => setImagePickerOpen(!imagePickerOpen)}
                >
                  <ImagePlus className="h-3.5 w-3.5" />
                  Insert Image
                </Button>
              </div>
              {imagePickerOpen && (
                <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-blue-900">Insert Image Anywhere in Content</p>
                    <button
                      type="button"
                      onClick={() => setImagePickerOpen(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Click in the content area where you want the image, then choose an option below:
                  </p>
                  {/* Option 1: Upload from device */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-slate-700">Upload from device (max 2MB)</Label>
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef as any}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => (fileInputRef[0] as any)?.click()}
                      >
                        <ImagePlus className="h-3.5 w-3.5" />
                        Choose Image
                      </Button>
                      <span className="text-[11px] text-slate-400">JPG, PNG, GIF, WebP</span>
                    </div>
                  </div>
                  {/* Divider */}
                  <div className="flex items-center gap-2 py-1">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-[10px] uppercase text-slate-400">or</span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                  {/* Option 2: Paste URL */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-slate-700">Paste image URL</Label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Link2 className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <Input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="h-8 pl-8 text-xs"
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleImageUrlSubmit(); } }}
                        />
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 gap-1.5 bg-blue-900 hover:bg-blue-800"
                        onClick={handleImageUrlSubmit}
                      >
                        Insert
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <Textarea
                id="bp-content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder={"# Heading\n\nWrite your post content in markdown...\n\n![Image](https://example.com/photo.jpg)\n\nMore text here..."}
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-[11px] text-slate-400">
                Tip: Use <code className="rounded bg-slate-100 px-1">![Alt text](URL)</code> to add images anywhere in the content. Click "Insert Image" above for a visual picker.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bp-cover">Cover Image URL</Label>
                <Input
                  id="bp-cover"
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bp-tags">Tags (comma-separated)</Label>
                <Input
                  id="bp-tags"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="iPhone, screen, repair"
                />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="bp-published"
                  checked={form.published}
                  onCheckedChange={(v) => setForm({ ...form, published: v })}
                />
                <Label htmlFor="bp-published">Published</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="bp-featured"
                  checked={form.featured}
                  onCheckedChange={(v) => setForm({ ...form, featured: v })}
                />
                <Label htmlFor="bp-featured">Featured</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreating(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving} className="gap-2 bg-blue-900 hover:bg-blue-800">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The post will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
