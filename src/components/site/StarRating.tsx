"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  max?: number;
  size?: number;
  className?: string;
  interactive?: boolean;
  onChange?: (v: number) => void;
}

export function StarRating({
  value,
  max = 5,
  size = 16,
  className,
  interactive = false,
  onChange,
}: StarRatingProps) {
  const rounded = Math.round(value);
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5",
        interactive ? "cursor-pointer" : "",
        className
      )}
      role={interactive ? "radiogroup" : "img"}
      aria-label={`Rating: ${value} out of ${max} stars`}
    >
      {Array.from({ length: max }).map((_, i) => {
        const n = i + 1;
        const filled = n <= rounded;
        const Icon = Star;
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={interactive ? () => onChange?.(n) : undefined}
            aria-label={interactive ? `${n} star${n > 1 ? "s" : ""}` : undefined}
            className={cn(
              "p-0 m-0 bg-transparent border-0",
              interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"
            )}
          >
            <Icon
              style={{ width: size, height: size }}
              className={cn(
                filled
                  ? "fill-orange-500 text-orange-500"
                  : "fill-zinc-200 text-zinc-200"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

export { StarRating as default, StarRating };
