export function makeToken(email: string): string {
  const payload = { email, exp: Date.now() + 12 * 60 * 60 * 1000 };
  if (typeof Buffer !== "undefined") {
    return Buffer.from(JSON.stringify(payload)).toString("base64");
  }
  return btoa(JSON.stringify(payload));
}

export function verifyToken(token: string): { email: string; exp: number } | null {
  try {
    const json =
      typeof Buffer !== "undefined"
        ? Buffer.from(token, "base64").toString("utf-8")
        : atob(token);
    const payload = JSON.parse(json);
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
