"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import {
  ImagePlus, Trash2, Copy, Search, Film, Image as ImageIcon,
  Download, Loader2, X, FolderOpen
} from "lucide-react";
import { toast } from "sonner";

interface MediaItem {
  id: string;
  name: string;
  type: "image" | "video";
  dataUrl: string; // base64 data URL
  size: number; // bytes
  createdAt: string;
  category: string;
}

const STORAGE_KEY = "grg-admin-media";

function loadFromStorage(): MediaItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

function saveToStorage(items: MediaItem[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch (e) {
    return false;
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaModule() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "image" | "video">("all");
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = loadFromStorage();
    setItems(stored);
    setLoading(false);
    setHasLoaded(true);
  }, []);

  // Sync to localStorage on every change (skip initial load)
  const [hasLoaded, setHasLoaded] = useState(false);
  useEffect(() => {
    if (hasLoaded && items.length >= 0) {
      saveToStorage(items);
    }
  }, [items, hasLoaded]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }
    setUploading(true);

    const fileArray = Array.from(files);
    const newItems: MediaItem[] = [];
    let successCount = 0;
    let errorCount = 0;

    for (const file of fileArray) {
      const isVideo = file.type.startsWith("video/");
      const maxSize = isVideo ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large (max ${isVideo ? "10MB" : "5MB"})`);
        errorCount++;
        continue;
      }

      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("read error"));
          reader.readAsDataURL(file);
        });

        newItems.push({
          id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name,
          type: isVideo ? "video" : "image",
          dataUrl,
          size: file.size,
          createdAt: new Date().toISOString(),
          category: isVideo ? "Videos" : "Images",
        });
        successCount++;
      } catch {
        toast.error(`Failed to read ${file.name}`);
        errorCount++;
      }
    }

    if (newItems.length > 0) {
      // Add to state
      setItems((prev) => {
        const next = [...newItems, ...prev];
        // Try to save — if it fails, remove the new items and warn
        const saved = saveToStorage(next);
        if (!saved) {
          toast.error("Storage full! Browser localStorage limit (~5MB). Try smaller files.");
          return prev; // don't add if we can't save
        }
        return next;
      });

      if (successCount > 0) {
        toast.success(`${successCount} file(s) uploaded to media library`);
      }
    }

    if (errorCount > 0 && successCount === 0) {
      toast.error("Upload failed. Check file size and try again.");
    }

    setUploading(false);
    // Reset input AFTER all processing is done
    e.target.value = "";
  }

  function copyUrl(item: MediaItem) {
    navigator.clipboard.writeText(item.dataUrl).then(() => {
      toast.success("Media URL copied to clipboard");
    }).catch(() => {
      toast.error("Failed to copy");
    });
  }

  function downloadItem(item: MediaItem) {
    const a = document.createElement("a");
    a.href = item.dataUrl;
    a.download = item.name;
    a.click();
  }

  function confirmDelete() {
    if (!deleteId) return;
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== deleteId);
      saveToStorage(next);
      return next;
    });
    toast.success("Media deleted");
    setDeleteId(null);
  }

  const filtered = items.filter((item) => {
    if (filterType !== "all" && item.type !== filterType) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const imageCount = items.filter((i) => i.type === "image").length;
  const videoCount = items.filter((i) => i.type === "video").length;
  const totalSize = items.reduce((sum, i) => sum + i.size, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-600">
            {items.length} files · {imageCount} images · {videoCount} videos · {formatSize(totalSize)} used
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleUpload}
            style={{ position: "absolute", width: 0, height: 0, opacity: 0, overflow: "hidden", zIndex: -1 }}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="gap-2 bg-blue-900 hover:bg-blue-800"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            Upload Media
          </Button>
        </div>
      </div>

      {/* Drag & drop zone */}
      <div
        className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-blue-400", "bg-blue-50"); }}
        onDragLeave={(e) => { e.currentTarget.classList.remove("border-blue-400", "bg-blue-50"); }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("border-blue-400", "bg-blue-50");
          if (e.dataTransfer.files.length > 0) {
            const input = fileInputRef.current;
            if (input) {
              input.files = e.dataTransfer.files;
              input.dispatchEvent(new Event("change", { bubbles: true }));
            }
          }
        }}
      >
        <FolderOpen className="mx-auto h-8 w-8 text-slate-400" />
        <p className="mt-2 text-sm font-medium text-slate-600">
          Click to upload or drag & drop
        </p>
        <p className="text-[11px] text-slate-400">
          Images (max 5MB) · Videos (max 10MB) · Multiple files supported
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search media..."
              className="h-8 w-48 pl-8 text-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-1">
          {(["all", "image", "video"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors ${
                filterType === t
                  ? "bg-blue-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t === "all" ? "All" : t === "image" ? "Images" : "Videos"}
            </button>
          ))}
        </div>
      </div>

      {/* Media grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">
              {items.length === 0 ? "No media files yet. Upload images and videos to get started." : "No files match your search."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((item) => (
            <Card key={item.id} className="group overflow-hidden">
              <div
                className="relative aspect-square cursor-pointer bg-slate-100"
                onClick={() => setPreviewItem(item)}
              >
                {item.type === "image" ? (
                  <img
                    src={item.dataUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <video
                    src={item.dataUrl}
                    className="h-full w-full object-cover"
                    muted
                    preload="metadata"
                  />
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 w-7 p-0"
                    onClick={(e) => { e.stopPropagation(); copyUrl(item); }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 w-7 p-0"
                    onClick={(e) => { e.stopPropagation(); downloadItem(item); }}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-7 w-7 p-0"
                    onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                {/* Type badge */}
                {item.type === "video" && (
                  <div className="absolute left-1 top-1">
                    <Badge className="bg-black/70 text-white">
                      <Film className="mr-1 h-2.5 w-2.5" /> Video
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium text-slate-700" title={item.name}>
                  {item.name}
                </p>
                <p className="text-[10px] text-slate-400">{formatSize(item.size)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Preview dialog */}
      <Dialog open={!!previewItem} onOpenChange={(v) => !v && setPreviewItem(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-hidden">
          <DialogHeader>
            <DialogTitle className="truncate">{previewItem?.name}</DialogTitle>
          </DialogHeader>
          {previewItem && (
            <div className="space-y-3">
              <div className="flex items-center justify-center rounded-lg bg-slate-900 p-4">
                {previewItem.type === "image" ? (
                  <img
                    src={previewItem.dataUrl}
                    alt={previewItem.name}
                    className="max-h-[60vh] max-w-full object-contain rounded"
                  />
                ) : (
                  <video
                    src={previewItem.dataUrl}
                    controls
                    className="max-h-[60vh] max-w-full rounded"
                  />
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{formatSize(previewItem.size)}</span>
                <span>{new Date(previewItem.createdAt).toLocaleString("en-GB")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={previewItem.dataUrl.slice(0, 60) + "..."}
                  className="text-xs"
                />
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => copyUrl(previewItem)}>
                  <Copy className="h-3.5 w-3.5" /> Copy URL
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => downloadItem(previewItem)}>
                  <Download className="h-3.5 w-3.5" /> Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this media file?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The file will be permanently removed from your media library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
