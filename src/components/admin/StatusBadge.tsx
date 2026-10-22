import { cn } from "@/lib/utils";
import { STATUS_COLORS } from "@/lib/utils2";

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const color =
    STATUS_COLORS[status] ||
    "bg-zinc-100 text-zinc-700 border-zinc-200";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        color,
        className
      )}
    >
      {status}
    </span>
  );
}
