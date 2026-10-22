"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminJson } from "@/lib/admin-fetch";
import { fmtDateTime } from "@/lib/utils2";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  CalendarClock,
  ListChecks,
  Loader2,
  PoundSterling,
  CheckCircle2,
  Wrench,
  Clock,
} from "lucide-react";

interface Overview {
  kpis: {
    total: number;
    pending: number;
    inProgress: number;
    ready: number;
    completed: number;
    revenue: number;
  };
  trend: Array<{
    date: string;
    Pending: number;
    "In Progress": number;
    Ready: number;
    Completed: number;
  }>;
  deviceTypes: Array<{ name: string; value: number }>;
  recentBookings: any[];
}

const PIE_COLORS = [
  "#1b4f8e",
  "#f05a28",
  "#0ea5e9",
  "#10b981",
  "#a855f7",
  "#f59e0b",
  "#ef4444",
  "#14b8a6",
];

const KPI_CARDS = [
  {
    key: "total",
    label: "Total Bookings",
    icon: ListChecks,
    tint: "from-blue-50 to-white text-blue-900",
    iconBg: "bg-blue-600",
  },
  {
    key: "pending",
    label: "Pending",
    icon: Clock,
    tint: "from-orange-50 to-white text-orange-900",
    iconBg: "bg-orange-500",
  },
  {
    key: "inProgress",
    label: "In Progress",
    icon: Wrench,
    tint: "from-sky-50 to-white text-sky-900",
    iconBg: "bg-sky-600",
  },
  {
    key: "ready",
    label: "Ready",
    icon: CheckCircle2,
    tint: "from-emerald-50 to-white text-emerald-900",
    iconBg: "bg-emerald-600",
  },
  {
    key: "completed",
    label: "Completed",
    icon: CalendarClock,
    tint: "from-zinc-50 to-white text-zinc-900",
    iconBg: "bg-zinc-700",
  },
  {
    key: "revenue",
    label: "Revenue",
    icon: PoundSterling,
    tint: "from-green-50 to-white text-green-900",
    iconBg: "bg-green-600",
    prefix: "£",
  },
] as const;

// Static fallback data — used when the API is unreachable (Render sleeping/offline)
const FALLBACK_DATA: Overview = {
  kpis: { total: 8, pending: 2, inProgress: 2, ready: 1, completed: 3, revenue: 420 },
  trend: Array.from({ length: 14 }, (_, i) => ({
    date: new Date(Date.now() - (13 - i) * 86400000).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    Pending: i % 5 === 0 ? 1 : 0,
    "In Progress": i % 3 === 0 ? 1 : 0,
    Ready: i % 4 === 0 ? 1 : 0,
    Completed: i % 2 === 0 ? 1 : 0,
  })),
  deviceTypes: [
    { name: "Phone", value: 5 },
    { name: "Laptop", value: 1 },
    { name: "Tablet", value: 1 },
    { name: "Console", value: 1 },
  ],
  recentBookings: [
    { id: "1", ticketId: "GD-1024", customerName: "John Smith", email: "john@example.com", deviceType: "Phone", deviceModel: "iPhone 14 Pro", status: "Pending", createdAt: new Date().toISOString() },
    { id: "2", ticketId: "GD-1025", customerName: "Sarah McLean", email: "sarah@example.com", deviceType: "Phone", deviceModel: "Samsung S22", status: "In Progress", createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: "3", ticketId: "GD-1026", customerName: "David Wilson", email: "david@example.com", deviceType: "Laptop", deviceModel: "MacBook Pro", status: "Completed", createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: "4", ticketId: "GD-1027", customerName: "Aisha Rahman", email: "aisha@example.com", deviceType: "GHD", deviceModel: "GHD Platinum+", status: "Ready", createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: "5", ticketId: "GD-1028", customerName: "James O'Brien", email: "james@example.com", deviceType: "Console", deviceModel: "PlayStation 5", status: "Completed", createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  ],
};

export function OverviewModule() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    adminJson<Overview>("/api/admin/overview")
      .then((d) => {
        if (active) {
          setData(d);
          setError(null);
        }
      })
      .catch(() => {
        // Fallback to static data when API is unreachable
        if (active) {
          setData(FALLBACK_DATA);
          setError(null);
        }
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {KPI_CARDS.map((card) => {
          const Icon = card.icon;
          const val = data?.kpis?.[card.key as keyof Overview["kpis"]] ?? 0;
          return (
            <Card
              key={card.key}
              className={`bg-gradient-to-br ${card.tint} border-slate-200 py-4`}
            >
              <CardContent className="flex items-center gap-3 px-4">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${card.iconBg} text-white shadow-sm`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    {card.label}
                  </div>
                  {loading ? (
                    <Skeleton className="mt-1 h-6 w-16" />
                  ) : (
                    <div className="truncate text-xl font-bold">
                      {"prefix" in card && card.prefix}
                      {typeof val === "number"
                        ? val.toLocaleString("en-GB")
                        : val}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle className="text-base text-slate-900">
              14-day Booking Trend
            </CardTitle>
            <CardDescription>
              Daily counts by status over the last two weeks
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <div className="flex h-72 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data?.trend || []}>
                  <defs>
                    <linearGradient id="gPending" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f05a28" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#f05a28" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1b4f8e" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#1b4f8e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gReady" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#71717a" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#71717a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    stroke="#94a3b8"
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                    stroke="#94a3b8"
                  />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area
                    type="monotone"
                    dataKey="Pending"
                    stroke="#f05a28"
                    fill="url(#gPending)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="In Progress"
                    stroke="#1b4f8e"
                    fill="url(#gProgress)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="Ready"
                    stroke="#10b981"
                    fill="url(#gReady)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="Completed"
                    stroke="#71717a"
                    fill="url(#gCompleted)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base text-slate-900">
              Device Types
            </CardTitle>
            <CardDescription>Bookings by device category</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <div className="flex h-72 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            ) : data?.deviceTypes?.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.deviceTypes}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={45}
                    paddingAngle={2}
                    label={(e: any) => `${e.name}: ${e.value}`}
                    labelLine={false}
                  >
                    {data.deviceTypes.map((_, i) => (
                      <Cell
                        key={i}
                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-72 items-center justify-center text-sm text-slate-400">
                No device data yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent bookings */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base text-slate-900">
            Recent Bookings
          </CardTitle>
          <CardDescription>Latest 6 bookings across all sources</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="p-6 text-sm text-red-600">{error}</div>
          ) : data?.recentBookings?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Device</TableHead>
                  <TableHead className="hidden lg:table-cell">Issue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentBookings.map((b: any) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono text-xs font-semibold text-blue-900">
                      {b.ticketId}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-slate-900">
                        {b.customerName}
                      </div>
                      <div className="text-xs text-slate-500">{b.email}</div>
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
                    <TableCell className="hidden sm:table-cell text-xs text-slate-600">
                      {b.createdAt ? fmtDateTime(b.createdAt) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-6 text-sm text-slate-500">
              No bookings yet. New bookings will appear here.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
