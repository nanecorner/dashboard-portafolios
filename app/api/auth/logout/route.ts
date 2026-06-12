import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  const cookieDef = clearSessionCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookieDef);
  return res;
}
