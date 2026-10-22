import {
  Smartphone,
  Laptop,
  Tablet,
  Gamepad2,
  Monitor,
  Watch,
  Zap,
  Wrench,
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
};

export const SERVICE_ICON_NAMES = Object.keys(SERVICE_ICONS);

export function ServiceIcon({
  name,
  className,
  size = 18,
}: {
  name?: string;
  className?: string;
  size?: number;
}) {
  const Icon = SERVICE_ICONS[name || ""] || Wrench;
  return <Icon className={className} style={{ width: size, height: size }} />;
}
