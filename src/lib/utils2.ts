export function ticketId(): string {
  const n = Math.floor(1024 + Math.random() * 8000);
  return `GD-${String(n).padStart(4, "0")}`;
}

export function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

export function fmtDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function fmtDateTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
  Ready: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Completed: "bg-zinc-100 text-zinc-800 border-zinc-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
};

export const STATUS_STEPS = ["Pending", "In Progress", "Ready", "Completed"];
