import { cookies } from "next/headers";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

const SESSION_COOKIE = "dash_session";
const SECRET = process.env.SESSION_SECRET ?? "fallback_secret";

// Simple token: profileId:slug:timestamp signed trivially (not crypto-grade, but fine for internal tool)
export function makeToken(profileId: string, slug: string): string {
  const payload = `${profileId}|${slug}|${Date.now()}`;
  const sig = Buffer.from(`${payload}${SECRET}`).toString("base64url");
  return Buffer.from(`${payload}|${sig}`).toString("base64url");
}

export function verifyToken(token: string): { profileId: string; slug: string } | null {
  try {
    const raw = Buffer.from(token, "base64url").toString();
    const parts = raw.split("|");
    if (parts.length !== 4) return null;
    const [profileId, slug, ts, sig] = parts;
    const payload = `${profileId}|${slug}|${ts}`;
    const expected = Buffer.from(`${payload}${SECRET}`).toString("base64url");
    if (sig !== expected) return null;
    // 24h expiry
    if (Date.now() - Number(ts) > 86_400_000) return null;
    return { profileId, slug };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<{ profileId: string; slug: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function setSessionCookie(token: string): ResponseCookie {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 86400,
  };
}

export function clearSessionCookie(): ResponseCookie {
  return {
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  };
}
