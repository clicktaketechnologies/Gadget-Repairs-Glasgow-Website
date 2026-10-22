"use client";

import { useNav } from "@/store/nav";
import { toast } from "sonner";

/**
 * adminFetch — wraps fetch with the admin Bearer token from the nav store.
 * On 401 it clears the admin auth and shows a "Session expired" toast.
 */
export async function adminFetch(
  url: string,
  opts: RequestInit = {}
): Promise<Response> {
  const token = useNav.getState().adminToken;
  const headers: Record<string, string> = {
    ...(opts.headers as Record<string, string> | undefined),
  };
  if (opts.body && !headers["Content-Type"] && !headers["content-type"]) {
    headers["Content-Type"] = "application/json";
  }
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...opts, headers });

  if (res.status === 401) {
    useNav.getState().clearAdminAuth();
    toast.error("Session expired", {
      description: "Please sign in again to continue.",
    });
    throw new Error("Unauthorized");
  }
  return res;
}

/**
 * adminJson — convenience wrapper that returns the parsed JSON body.
 * Throws on non-2xx responses (after showing a toast).
 */
export async function adminJson<T = any>(
  url: string,
  opts: RequestInit = {}
): Promise<T> {
  const res = await adminFetch(url, opts);
  const text = await res.text();
  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }
  if (!res.ok) {
    const msg = data?.error || data?.message || `Request failed (${res.status})`;
    // Don't show toast for 404 (API not available on Firebase static export)
    // or 401 (handled above) — the calling module's .catch() will use fallback data
    if (res.status !== 404 && res.status !== 401) {
      toast.error(msg);
    }
    throw new Error(msg);
  }
  return data as T;
}
