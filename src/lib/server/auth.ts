import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Owner portal sign-in: one shared password (PORTAL_PASSWORD) + an HMAC-signed, httpOnly session cookie.
// Simple on purpose for a one-owner business; swap for Supabase Auth if crew accounts are added.

export const SESSION_COOKIE = "cyc_portal";
const MAX_AGE = 60 * 60 * 24 * 14; // 14 days

const secret = () => process.env.PORTAL_SESSION_SECRET || process.env.LEAD_TOKEN_SECRET || "";
const sign = (v: string) => createHmac("sha256", secret()).update(v).digest("base64url");
const sha = (v: string) => createHash("sha256").update(v).digest();

export const portalConfigured = () => !!process.env.PORTAL_PASSWORD && secret().length >= 16;

export function checkPassword(pw: string) {
  const want = process.env.PORTAL_PASSWORD;
  if (!want || !portalConfigured()) return false;
  return timingSafeEqual(sha(pw), sha(want));
}

export function sessionValue() {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  return `${exp}.${sign(String(exp))}`;
}

export const sessionCookie = (value: string, maxAge = MAX_AGE) => ({
  name: SESSION_COOKIE,
  value,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge,
});

function validSession(v: string | undefined) {
  if (!v || !portalConfigured()) return false;
  const [exp, sig] = v.split(".");
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  const a = Buffer.from(sign(exp));
  const b = Buffer.from(sig);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isOwner() {
  return validSession((await cookies()).get(SESSION_COOKIE)?.value);
}

/** For API routes: returns a 401 response when not signed in, otherwise null. */
export async function requireOwner() {
  return (await isOwner()) ? null : NextResponse.json({ ok: false, error: "Please sign in" }, { status: 401 });
}
