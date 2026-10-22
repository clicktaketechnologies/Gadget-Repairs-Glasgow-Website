"use client";

import {
  Smartphone,
  Laptop,
  Tablet,
  Gamepad2,
  Monitor,
  Watch,
  Zap,
  Wrench,
  Unlock,
  Droplets,
  MonitorSmartphone,
  BatteryCharging,
  Repeat,
  Plug,
  type LucideIcon,
} from "lucide-react";

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  Smartphone,
  Laptop,
  Tablet,
  Gamepad2,
  Monitor,
  Watch,
  Zap,
  Wrench,
  Unlock,
  Droplets,
  MonitorSmartphone,
  BatteryCharging,
  Repeat,
  Plug,
};

export function ServiceIcon({
  name,
  className,
  ...props
}: { name: string; className?: string } & Omit<
  React.ComponentProps<LucideIcon>,
  "name"
>) {
  const Icon = SERVICE_ICONS[name] ?? Wrench;
  return <Icon className={className} {...props} />;
}

/** Background colour classes for each known service icon. */
export function serviceIconBg(name: string): string {
  const map: Record<string, string> = {
    Smartphone: "bg-blue-50 text-blue-700 ring-blue-100",
    Laptop: "bg-blue-50 text-blue-700 ring-blue-100",
    Tablet: "bg-orange-50 text-orange-600 ring-orange-100",
    Gamepad2: "bg-purple-50 text-purple-700 ring-purple-100",
    Monitor: "bg-slate-100 text-slate-700 ring-slate-200",
    Watch: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Zap: "bg-orange-50 text-orange-600 ring-orange-100",
    Wrench: "bg-blue-50 text-blue-700 ring-blue-100",
    Unlock: "bg-orange-50 text-orange-600 ring-orange-100",
    Droplets: "bg-cyan-50 text-cyan-700 ring-cyan-100",
    MonitorSmartphone: "bg-blue-50 text-blue-700 ring-blue-100",
    BatteryCharging: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Repeat: "bg-orange-50 text-orange-600 ring-orange-100",
    Plug: "bg-amber-50 text-amber-700 ring-amber-100",
  };
  return map[name] ?? "bg-blue-50 text-blue-700 ring-blue-100";
}
