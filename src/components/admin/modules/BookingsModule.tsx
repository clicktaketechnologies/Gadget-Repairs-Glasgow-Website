"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminJson } from "@/lib/admin-fetch";
import { fmtDateTime } from "@/lib/utils2";
import {
  Search,
  Download,
  Eye,
  Trash2,
  Save,
  Mail,
  Loader2,
  Inbox,
  RotateCcw,
  Copy,
  Printer,
  MoreVertical,
  CheckSquare,
  X,
  Check,
  Clock,
  Wrench,
  PackageCheck,
  Ban,
} from "lucide-react";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  "all",
  "Pending",
  "In Progress",
  "Ready",
  "Completed",
  "Cancelled",
];

const BULK_STATUS_OPTIONS = [
  "Pending",
  "In Progress",
  "Ready",
  "Completed",
  "Cancelled",
];

interface Booking {
  id: string;
  ticketId: string;
  customerName: string;
  email: string;
  phone: string;
  deviceType: string;
  deviceModel: string;
  issue: string;
  needsCollection: boolean;
  collectionAddr: string | null;
  status: string;
  technicianNotes: string | null;
  quotedPrice: string | null;
  finalPrice: string | null;
  source: string;
  bookingDate: string | null;
  bookingTime: string | null;
  createdAt: string;
  updatedAt?: string;
}

interface SentEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  bookingId: string;
  timestamp: string;
  status: "queued";
}

const STORAGE_KEY = "grg-admin-bookings";
const PUBLIC_KEY = "grg-public-bookings";
const TRASH_KEY = "grg-admin-bookings-trash";
const SENT_EMAILS_KEY = "grg-admin-sent-emails";

const FALLBACK_BOOKINGS: Booking[] = [
  { id: "b1", ticketId: "GD-1024", customerName: "John Smith", email: "john@example.com", phone: "+44 7700 900100", deviceType: "Phone", deviceModel: "iPhone 14 Pro", issue: "Cracked screen", needsCollection: false, collectionAddr: null, status: "Pending", technicianNotes: null, quotedPrice: "£120", finalPrice: null, source: "online", bookingDate: "2025-10-21", bookingTime: "10:30", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "b2", ticketId: "GD-1025", customerName: "Sarah McLean", email: "sarah@example.com", phone: "+44 7700 900101", deviceType: "Phone", deviceModel: "Samsung S22", issue: "Battery replacement", needsCollection: false, collectionAddr: null, status: "In Progress", technicianNotes: "Battery ordered", quotedPrice: "£60", finalPrice: null, source: "walk-in", bookingDate: "2025-10-20", bookingTime: "14:00", createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "b3", ticketId: "GD-1026", customerName: "David Wilson", email: "david@example.com", phone: "+44 7700 900102", deviceType: "Laptop", deviceModel: "MacBook Pro 2019", issue: "Keyboard failure", needsCollection: false, collectionAddr: null, status: "Completed", technicianNotes: "Replaced top case", quotedPrice: "£180", finalPrice: "£180", source: "online", bookingDate: "2025-10-19", bookingTime: "11:00", createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "b4", ticketId: "GD-1027", customerName: "Aisha Rahman", email: "aisha@example.com", phone: "+44 7700 900103", deviceType: "GHD", deviceModel: "GHD Platinum+", issue: "Won't heat", needsCollection: false, collectionAddr: null, status: "Ready", technicianNotes: "Thermal fuse replaced", quotedPrice: "£25", finalPrice: "£25", source: "walk-in", bookingDate: "2025-10-18", bookingTime: "15:00", createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "b5", ticketId: "GD-1028", customerName: "James O'Brien", email: "james@example.com", phone: "+44 7700 900104", deviceType: "Console", deviceModel: "PlayStation 5", issue: "HDMI port broken", needsCollection: false, collectionAddr: null, status: "Completed", technicianNotes: "HDMI port resoldered", quotedPrice: "£100", finalPrice: "£100", source: "online", bookingDate: "2025-10-17", bookingTime: "09:30", createdAt: new Date(Date.now() - 4 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 4 * 86400000).toISOString() },
];

function loadFromStorage(): Booking[] | null {
  if (typeof window === "undefined") return null;
  try {
    // Read admin bookings
    const raw = localStorage.getItem(STORAGE_KEY);
    const adminBookings = raw ? JSON.parse(raw) : [];

    // Also read public bookings (submitted via the website booking form)
    const publicRaw = localStorage.getItem(PUBLIC_KEY);
    const publicBookings = publicRaw ? JSON.parse(publicRaw) : [];

    // Merge: public bookings first (most recent), then admin bookings (dedup by id)
    const adminIds = new Set(adminBookings.map((b: any) => b.id));
    const merged = [
      ...publicBookings.filter((b: any) => !adminIds.has(b.id)),
      ...adminBookings,
    ];

    if (Array.isArray(merged) && merged.length > 0) return merged;
    return null;
  } catch {
    return null;
  }
}

function saveToStorage(bookings: Booking[]) {
  if (typeof window === "undefined") return;
  try {
    // Save admin bookings (exclude public ones by id prefix)
    const adminOnly = bookings.filter((b) => !b.id.startsWith("pub-"));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(adminOnly));

    // Only update public bookings if there are any in the current list
    // (don't remove the public key — public bookings might exist outside this list)
    const publicBookings = bookings.filter((b) => b.id.startsWith("pub-"));
    if (publicBookings.length > 0) {
      localStorage.setItem(PUBLIC_KEY, JSON.stringify(publicBookings));
    }
    // NEVER removeItem(PUBLIC_KEY) — it would delete customer submissions
  } catch {}
}

function loadTrashFromStorage(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TRASH_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTrashToStorage(trash: Booking[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TRASH_KEY, JSON.stringify(trash));
  } catch {}
}

function saveSentEmail(email: SentEmail) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(SENT_EMAILS_KEY);
    const existing: SentEmail[] = raw ? JSON.parse(raw) : [];
    existing.unshift(email);
    localStorage.setItem(SENT_EMAILS_KEY, JSON.stringify(existing));
  } catch {}
}

export function BookingsModule() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trash, setTrash] = useState<Booking[]>([]);
  const [view, setView] = useState<"active" | "trash">("active");
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailOpen, setDetailOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [permanentDeleteOpen, setPermanentDeleteOpen] = useState(false);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<Booking | null>(null);

  // Editable form fields
  const [editStatus, setEditStatus] = useState<string>("Pending");
  const [editNotes, setEditNotes] = useState("");
  const [editQuoted, setEditQuoted] = useState("");
  const [editFinal, setEditFinal] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (status !== "all") params.set("status", status);
      const data = await adminJson<{ bookings: Booking[] }>(
        `/api/admin/bookings?${params.toString()}`
      );
      if (data.bookings && data.bookings.length > 0) {
        setBookings(data.bookings);
        saveToStorage(data.bookings);
      } else {
        const stored = loadFromStorage();
        setBookings(stored || FALLBACK_BOOKINGS);
      }
    } catch {
      // API unreachable — use localStorage or fallback
      const stored = loadFromStorage();
      setBookings(stored || FALLBACK_BOOKINGS);
    } finally {
      setLoading(false);
    }
  }, [q, status]);

  useEffect(() => {
    setTrash(loadTrashFromStorage());
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  // Reload when window regains focus (e.g. user switches from public site to admin)
  useEffect(() => {
    const onFocus = () => {
      load();
      setTrash(loadTrashFromStorage());
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  // Visible bookings depend on current view + filters (active only)
  const visibleBookings = useMemo(() => bookings, [bookings]);

  function openDetail(b: Booking) {
    setSelected(b);
    setEditStatus(b.status);
    setEditNotes(b.technicianNotes || "");
    setEditQuoted(b.quotedPrice || "");
    setEditFinal(b.finalPrice || "");
    setDetailOpen(true);
  }

  // Quick status change directly from the table (no need to open detail dialog)
  async function quickStatus(b: Booking, status: string) {
    setBookings((prev) => {
      const next = prev.map((x) => x.id === b.id ? { ...x, status, updatedAt: new Date().toISOString() } : x);
      saveToStorage(next);
      return next;
    });
    try {
      await adminJson(`/api/admin/bookings/${b.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(`${b.ticketId}: marked as ${status}`);
    } catch {
      toast.success(`${b.ticketId}: marked as ${status} (saved locally)`);
    }
  }

  async function saveBooking() {
    if (!selected) return;
    setSaving(true);
    const now = new Date().toISOString();
    try {
      const data = await adminJson<{ booking: Booking }>(
        `/api/admin/bookings/${selected.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: editStatus,
            technicianNotes: editNotes || null,
            quotedPrice: editQuoted || null,
            finalPrice: editFinal || null,
          }),
        }
      );
      setBookings((prev) =>
        prev.map((b) => (b.id === data.booking.id ? data.booking : b))
      );
      setSelected(data.booking);
      toast.success("Booking updated");
    } catch {
      // API failed — save locally so data persists across refreshes
      const updated: Booking = {
        ...selected,
        status: editStatus,
        technicianNotes: editNotes || null,
        quotedPrice: editQuoted || null,
        finalPrice: editFinal || null,
        updatedAt: now,
      };
      setBookings((prev) => {
        const next = prev.map((b) => (b.id === updated.id ? updated : b));
        saveToStorage(next);
        return next;
      });
      setSelected(updated);
      toast.success("Booking updated (saved locally)");
    } finally {
      setSaving(false);
    }
  }

  function openDelete() {
    setDeleteOpen(true);
  }

  async function confirmDelete() {
    if (!selected) return;
    setDeleting(true);
    const idToDelete = selected.id;
    const target = selected;
    // Soft delete — move to trash, remove from active list
    setBookings((prev) => {
      const next = prev.filter((b) => b.id !== idToDelete);
      saveToStorage(next);
      return next;
    });
    setTrash((prev) => {
      const next = [target, ...prev];
      saveTrashToStorage(next);
      return next;
    });
    try {
      await adminJson(`/api/admin/bookings/${idToDelete}`, {
        method: "DELETE",
      });
      toast.success(`Booking ${target.ticketId} moved to trash`);
    } catch {
      // API failed — booking already moved to trash locally, that's fine
      toast.success(`Booking ${target.ticketId} moved to trash (saved locally)`);
    }
    setDeleteOpen(false);
    setDetailOpen(false);
    setSelected(null);
    setDeleting(false);
  }

  function openReply() {
    if (!selected) return;
    setReplySubject(`Update on your repair ${selected.ticketId}`);
    setReplyBody(
      `Hi ${selected.customerName},\n\nUpdate on your ${selected.deviceType} repair (ticket ${selected.ticketId}):\n\n[Type your update here]\n\nMany thanks,\nGadget Repairs Glasgow`
    );
    setReplyOpen(true);
  }

  function sendReply() {
    if (!selected) return;
    setSending(true);
    try {
      const email: SentEmail = {
        id: `email-${Date.now()}`,
        to: selected.email,
        subject: replySubject,
        body: replyBody,
        bookingId: selected.id,
        timestamp: new Date().toISOString(),
        status: "queued",
      };
      saveSentEmail(email);
      toast.success("Email saved (SMTP not configured — configure in Email Settings)");
      setReplyOpen(false);
    } catch {
      toast.error("Could not save email");
    } finally {
      setSending(false);
    }
  }

  // ── Bulk selection helpers ────────────────────────────────────────────────
  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds((prev) => {
      if (prev.size === visibleBookings.length && visibleBookings.length > 0) {
        return new Set();
      }
      return new Set(visibleBookings.map((b) => b.id));
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function bulkDelete() {
    if (selectedIds.size === 0) return;
    const toTrash = bookings.filter((b) => selectedIds.has(b.id));
    const count = toTrash.length;
    setBookings((prev) => {
      const next = prev.filter((b) => !selectedIds.has(b.id));
      saveToStorage(next);
      return next;
    });
    setTrash((prev) => {
      const next = [...toTrash, ...prev];
      saveTrashToStorage(next);
      return next;
    });
    toast.success(`${count} booking${count > 1 ? "s" : ""} moved to trash`);
    clearSelection();
  }

  function bulkStatusChange(newStatus: string) {
    if (selectedIds.size === 0) return;
    const count = selectedIds.size;
    const now = new Date().toISOString();
    setBookings((prev) => {
      const next = prev.map((b) =>
        selectedIds.has(b.id) ? { ...b, status: newStatus, updatedAt: now } : b
      );
      saveToStorage(next);
      return next;
    });
    toast.success(`${count} booking${count > 1 ? "s" : ""} marked as ${newStatus}`);
    clearSelection();
  }

  // ── Trash helpers ──────────────────────────────────────────────────────────
  function restoreFromTrash(id: string) {
    const target = trash.find((b) => b.id === id);
    if (!target) return;
    setTrash((prev) => {
      const next = prev.filter((b) => b.id !== id);
      saveTrashToStorage(next);
      return next;
    });
    setBookings((prev) => {
      const next = [target, ...prev];
      saveToStorage(next);
      return next;
    });
    toast.success(`Booking ${target.ticketId} restored`);
  }

  function openPermanentDelete(b: Booking) {
    setPermanentDeleteTarget(b);
    setPermanentDeleteOpen(true);
  }

  function confirmPermanentDelete() {
    if (!permanentDeleteTarget) return;
    const target = permanentDeleteTarget;
    setTrash((prev) => {
      const next = prev.filter((b) => b.id !== target.id);
      saveTrashToStorage(next);
      return next;
    });
    toast.success(`Booking ${target.ticketId} permanently deleted`);
    setPermanentDeleteOpen(false);
    setPermanentDeleteTarget(null);
  }

  // ── More-actions helpers ───────────────────────────────────────────────────
  function duplicateBooking(b: Booking) {
    const newTicket = `GD-${Math.floor(1000 + Math.random() * 9000)}`;
    const copy: Booking = {
      ...b,
      id: `dup-${Date.now()}`,
      ticketId: newTicket,
      status: "Pending",
      technicianNotes: null,
      finalPrice: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBookings((prev) => {
      const next = [copy, ...prev];
      saveToStorage(next);
      return next;
    });
    toast.success(`Duplicated as ${newTicket}`);
    setDetailOpen(false);
  }

  function moveToTrash(b: Booking) {
    setBookings((prev) => {
      const next = prev.filter((x) => x.id !== b.id);
      saveToStorage(next);
      return next;
    });
    setTrash((prev) => {
      const next = [b, ...prev];
      saveTrashToStorage(next);
      return next;
    });
    toast.success(`Booking ${b.ticketId} moved to trash`);
    setDetailOpen(false);
    setSelected(null);
  }

  function printTicket(b: Booking) {
    const html = `<!DOCTYPE html><html><head><title>Ticket ${b.ticketId}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 2rem; color: #1e293b; max-width: 700px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 1rem; margin-bottom: 1.5rem; }
  .brand { font-weight: bold; font-size: 1.25rem; }
  .sub { color: #64748b; font-size: 0.875rem; }
  .ticket { font-size: 1.75rem; font-weight: bold; color: #0f172a; font-family: monospace; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 0.35rem 0; vertical-align: top; }
  td.left { width: 50%; padding-right: 1rem; }
  .label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 600; }
  .value { font-size: 0.95rem; font-weight: 500; }
  .section { margin-bottom: 1rem; }
  .footer { margin-top: 3rem; text-align: center; color: #94a3b8; font-size: 0.75rem; border-top: 1px solid #e2e8f0; padding-top: 1rem; }
  @media print { body { padding: 1rem; } }
</style></head><body>
  <div class="header">
    <div>
      <div class="brand">Gadget Repairs Glasgow</div>
      <div class="sub">Repair Ticket</div>
    </div>
    <div class="ticket">${b.ticketId}</div>
  </div>
  <table>
    <tr>
      <td class="left"><div class="label">Customer</div><div class="value">${escapeHtml(b.customerName)}</div></td>
      <td><div class="label">Status</div><div class="value">${escapeHtml(b.status)}</div></td>
    </tr>
    <tr>
      <td class="left"><div class="label">Phone</div><div class="value">${escapeHtml(b.phone || "—")}</div></td>
      <td><div class="label">Email</div><div class="value">${escapeHtml(b.email || "—")}</div></td>
    </tr>
    <tr>
      <td class="left"><div class="label">Device Type</div><div class="value">${escapeHtml(b.deviceType)}</div></td>
      <td><div class="label">Model</div><div class="value">${escapeHtml(b.deviceModel)}</div></td>
    </tr>
    <tr>
      <td class="left"><div class="label">Source</div><div class="value">${escapeHtml(b.source)}</div></td>
      <td><div class="label">Booked For</div><div class="value">${escapeHtml(b.bookingDate || "—")} ${escapeHtml(b.bookingTime || "")}</div></td>
    </tr>
  </table>
  <div class="section" style="margin-top:1rem;">
    <div class="label">Issue</div>
    <div class="value">${escapeHtml(b.issue)}</div>
  </div>
  ${b.collectionAddr ? `<div class="section"><div class="label">Collection Address</div><div class="value">${escapeHtml(b.collectionAddr)}</div></div>` : ""}
  ${b.technicianNotes ? `<div class="section"><div class="label">Technician Notes</div><div class="value">${escapeHtml(b.technicianNotes)}</div></div>` : ""}
  <div class="section" style="margin-top:1.5rem;border-top:1px solid #e2e8f0;padding-top:1rem;">
    <table>
      <tr>
        <td class="left"><div class="label">Quoted Price</div><div class="value">${escapeHtml(b.quotedPrice || "—")}</div></td>
        <td><div class="label">Final Price</div><div class="value">${escapeHtml(b.finalPrice || "—")}</div></td>
      </tr>
      <tr>
        <td class="left"><div class="label">Created</div><div class="value">${b.createdAt ? new Date(b.createdAt).toLocaleString() : "—"}</div></td>
        <td><div class="label">Last Updated</div><div class="value">${b.updatedAt ? new Date(b.updatedAt).toLocaleString() : "—"}</div></td>
      </tr>
    </table>
  </div>
  <div class="footer">
    Generated ${new Date().toLocaleString()} • Gadget Repairs Glasgow
  </div>
  <script>
    window.onload = function() { window.print(); };
  </script>
</body></html>`;
    const w = window.open("", "_blank", "width=720,height=900");
    if (!w) {
      toast.error("Pop-up blocked — allow pop-ups to print the ticket");
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    toast.success(`Printing ticket ${b.ticketId}`);
  }

  async function copyTicketId(b: Booking) {
    try {
      await navigator.clipboard.writeText(b.ticketId);
      toast.success(`Copied ${b.ticketId} to clipboard`);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  }

  function exportCsv() {
    const rows = [
      [
        "ticketId",
        "customerName",
        "email",
        "phone",
        "deviceType",
        "deviceModel",
        "issue",
        "status",
        "quotedPrice",
        "finalPrice",
        "source",
        "createdAt",
      ],
      ...bookings.map((b) => [
        b.ticketId,
        b.customerName,
        b.email,
        b.phone,
        b.deviceType,
        b.deviceModel,
        (b.issue || "").replace(/"/g, '""'),
        b.status,
        b.quotedPrice || "",
        b.finalPrice || "",
        b.source,
        b.createdAt,
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${bookings.length} bookings`);
  }

  const allSelected =
    visibleBookings.length > 0 && selectedIds.size === visibleBookings.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  return (
    <div className="space-y-4">
      <Tabs
        value={view}
        onValueChange={(v) => setView(v as "active" | "trash")}
      >
        <div className="flex items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="active" className="gap-1.5">
              <Inbox className="h-3.5 w-3.5" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="trash" className="gap-1.5">
              <Trash2 className="h-3.5 w-3.5" />
              Trash
              {trash.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-[10px]">
                  {trash.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ─────────────── Active Bookings ─────────────── */}
        {view === "active" && (
          <div className="space-y-4">
            {/* Toolbar */}
            <Card>
              <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search ticket, customer, email, phone, device, issue…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s === "all" ? "All statuses" : s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={exportCsv}
                  disabled={!bookings.length}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  CSV
                </Button>
              </CardContent>
            </Card>

            {/* Bulk action bar */}
            {selectedIds.size > 0 && (
              <Card className="border-slate-300 bg-slate-50">
                <CardContent className="flex flex-wrap items-center gap-2 py-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <CheckSquare className="h-4 w-4 text-slate-500" />
                    {selectedIds.size} selected
                  </div>
                  <div className="ml-auto flex flex-wrap items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <CheckSquare className="h-4 w-4" />
                          Change status
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Set status for selected</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {BULK_STATUS_OPTIONS.map((s) => (
                          <DropdownMenuItem
                            key={s}
                            onClick={() => bulkStatusChange(s)}
                          >
                            {s}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={bulkDelete}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Bulk delete
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSelection}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Table */}
            <Card>
              <CardHeader className="border-b py-4">
                <CardTitle className="flex items-center justify-between text-base">
                  <span>Bookings</span>
                  <span className="text-xs font-normal text-slate-500">
                    {bookings.length} shown
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pt-0">
                {loading ? (
                  <div className="space-y-2 p-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-500">
                    <Inbox className="h-10 w-10 text-slate-300" />
                    <p className="text-sm">No bookings match your filters.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10">
                          <Checkbox
                            checked={
                              allSelected
                                ? true
                                : someSelected
                                ? "indeterminate"
                                : false
                            }
                            onCheckedChange={toggleSelectAll}
                            aria-label="Select all bookings"
                          />
                        </TableHead>
                        <TableHead>Ticket</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="hidden md:table-cell">Device</TableHead>
                        <TableHead className="hidden lg:table-cell">Issue</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden sm:table-cell">Source</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((b) => (
                        <TableRow
                          key={b.id}
                          data-state={
                            selectedIds.has(b.id) ? "selected" : undefined
                          }
                          className={
                            selectedIds.has(b.id)
                              ? "bg-slate-50"
                              : undefined
                          }
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedIds.has(b.id)}
                              onCheckedChange={() => toggleSelect(b.id)}
                              aria-label={`Select booking ${b.ticketId}`}
                            />
                          </TableCell>
                          <TableCell className="font-mono text-xs font-semibold text-slate-900">
                            {b.ticketId}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-slate-900">
                              {b.customerName}
                            </div>
                            <div className="text-xs text-slate-500">{b.phone || b.email}</div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="text-sm">{b.deviceType}</div>
                            <div className="text-xs text-slate-500">
                              {b.deviceModel}
                            </div>
                          </TableCell>
                          <TableCell className="hidden max-w-xs lg:table-cell">
                            <div className="truncate text-xs text-slate-600">
                              {b.issue}
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={b.status} />
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="outline" className="text-[10px]">
                              {b.source}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs text-slate-600">
                            {b.createdAt ? fmtDateTime(b.createdAt) : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-52">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => openDetail(b)} className="gap-2">
                                  <Eye className="h-4 w-4" /> View details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel className="text-xs text-slate-400">Change status</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => quickStatus(b, "In Progress")} className="gap-2">
                                  <Wrench className="h-4 w-4 text-blue-600" /> Mark In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => quickStatus(b, "Ready")} className="gap-2">
                                  <PackageCheck className="h-4 w-4 text-emerald-600" /> Mark Ready
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => quickStatus(b, "Completed")} className="gap-2">
                                  <Check className="h-4 w-4 text-zinc-600" /> Mark Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => quickStatus(b, "Pending")} className="gap-2">
                                  <Clock className="h-4 w-4 text-orange-600" /> Set Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => quickStatus(b, "Cancelled")} className="gap-2">
                                  <Ban className="h-4 w-4 text-red-600" /> Cancel booking
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => duplicateBooking(b)} className="gap-2">
                                  <Copy className="h-4 w-4" /> Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(b.ticketId); toast.success("Ticket ID copied"); }} className="gap-2">
                                  <Copy className="h-4 w-4" /> Copy ticket ID
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => moveToTrash(b)} className="gap-2 text-red-600">
                                  <Trash2 className="h-4 w-4" /> Move to trash
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ─────────────── Trash ─────────────── */}
        {view === "trash" && (
          <Card>
            <CardHeader className="border-b py-4">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4 text-slate-500" />
                  Trash
                </span>
                <span className="text-xs font-normal text-slate-500">
                  {trash.length} item{trash.length === 1 ? "" : "s"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pt-0">
              {trash.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-500">
                  <Trash2 className="h-10 w-10 text-slate-300" />
                  <p className="text-sm">Trash is empty.</p>
                  <p className="text-xs text-slate-400">
                    Deleted bookings will appear here and can be restored.
                  </p>
                </div>
              ) : (
                <div className="max-h-[60vh] overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-card">
                      <TableRow>
                        <TableHead>Ticket</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="hidden md:table-cell">Device</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden sm:table-cell">Deleted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trash.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell className="font-mono text-xs font-semibold text-slate-700">
                            {b.ticketId}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-slate-700">
                              {b.customerName}
                            </div>
                            <div className="text-xs text-slate-500">
                              {b.phone || b.email}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="text-sm text-slate-700">{b.deviceType}</div>
                            <div className="text-xs text-slate-500">{b.deviceModel}</div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={b.status} />
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-xs text-slate-500">
                            {b.updatedAt
                              ? fmtDateTime(b.updatedAt)
                              : b.createdAt
                              ? fmtDateTime(b.createdAt)
                              : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => restoreFromTrash(b.id)}
                                className="gap-1"
                              >
                                <RotateCcw className="h-4 w-4" />
                                <span className="hidden sm:inline">Restore</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => openPermanentDelete(b)}
                                className="gap-1"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="hidden sm:inline">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Booking</span>
              {selected && (
                <span className="font-mono text-sm text-slate-700">
                  {selected.ticketId}
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              Update status, add notes, adjust prices, or email the customer.
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-4">
              {/* Read-only summary */}
              <div className="grid grid-cols-2 gap-3 rounded-lg border bg-slate-50 p-3 text-sm">
                <Info label="Customer" value={selected.customerName} />
                <Info label="Email" value={selected.email} />
                <Info label="Phone" value={selected.phone || "—"} />
                <Info label="Source" value={selected.source} />
                <Info label="Device" value={`${selected.deviceType} ${selected.deviceModel}`} />
                <Info
                  label="Booked"
                  value={
                    selected.bookingDate
                      ? `${selected.bookingDate} ${selected.bookingTime || ""}`
                      : "—"
                  }
                />
                <div className="col-span-2">
                  <Info label="Issue" value={selected.issue} />
                </div>
                {selected.needsCollection && (
                  <div className="col-span-2">
                    <Info
                      label="Collection address"
                      value={selected.collectionAddr || "—"}
                    />
                  </div>
                )}
              </div>

              {/* Editable fields */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.filter((s) => s !== "all").map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Quoted price</Label>
                  <Input
                    value={editQuoted}
                    onChange={(e) => setEditQuoted(e.target.value)}
                    placeholder="e.g. £49"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Final price</Label>
                  <Input
                    value={editFinal}
                    onChange={(e) => setEditFinal(e.target.value)}
                    placeholder="e.g. £49"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Technician notes</Label>
                  <Textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Internal notes about the repair…"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-wrap gap-2">
            <div className="mr-auto flex flex-wrap gap-2">
              <Button
                variant="destructive"
                onClick={openDelete}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <MoreVertical className="h-4 w-4" />
                    More
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52">
                  <DropdownMenuLabel>More actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => selected && duplicateBooking(selected)}
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Duplicate booking
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => selected && printTicket(selected)}
                    className="gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    Print ticket
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => selected && copyTicketId(selected)}
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy ticket ID
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => selected && moveToTrash(selected)}
                    className="gap-2 text-red-600 focus:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Move to trash
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              variant="outline"
              onClick={openReply}
              className="gap-2"
              disabled={!selected?.email}
            >
              <Mail className="h-4 w-4" />
              Email customer
            </Button>
            <Button
              onClick={saveBooking}
              disabled={saving}
              className="gap-2 bg-slate-900 hover:bg-slate-800"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm (moves to trash) */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move this booking to trash?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-mono font-semibold">
                {selected?.ticketId}
              </span>{" "}
              for {selected?.customerName} will be moved to the trash. You can
              restore it later or permanently delete it from the Trash tab.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Move to trash"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent delete confirm */}
      <AlertDialog
        open={permanentDeleteOpen}
        onOpenChange={setPermanentDeleteOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently delete this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-mono font-semibold">
                {permanentDeleteTarget?.ticketId}
              </span>{" "}
              for {permanentDeleteTarget?.customerName} will be removed
              permanently. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmPermanentDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Permanently delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reply dialog */}
      <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Email customer</DialogTitle>
            <DialogDescription>
              To: {selected?.email || "—"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Input
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Message</Label>
              <Textarea
                rows={8}
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={sendReply}
              disabled={sending}
              className="gap-2 bg-slate-900 hover:bg-slate-800"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              Send email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="text-sm text-slate-900">{value || "—"}</div>
    </div>
  );
}

function escapeHtml(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
