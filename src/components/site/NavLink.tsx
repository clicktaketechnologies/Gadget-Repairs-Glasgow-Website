"use client";

import { useNav, pathToRoute } from "@/store/nav";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  onNavigate?: () => void;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  ariaLabel?: string;
}

/**
 * Renders an `<a href>` so search engines and middle-click users get a real link,
 * but prevents default left-click and uses the Zustand nav helper for SPA navigation.
 */
export function NavLink({
  href,
  onNavigate,
  children,
  className,
  active,
  ariaLabel,
}: NavLinkProps) {
  const navigate = useNav((s) => s.navigate);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Allow modifier-clicks (cmd/ctrl/middle) to open in new tab natively.
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    e.preventDefault();
    const route = pathToRoute(href);
    navigate(route);
    onNavigate?.();
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      className={cn(className)}
    >
      {children}
    </a>
  );
}

export { NavLink as default, NavLink };
