import { NextResponse, type NextRequest } from "next/server";
import { checkPassword, portalConfigured, sessionCookie, sessionValue } from "@/lib/server/auth";
import { rateLimited } from "@/lib/server/leads";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(`login:${ip}`, 8, 15 * 60_000)) return NextResponse.json({ ok: false, error: "Too many tries. Wait 15 minutes." }, { status: 429 });
  if (!portalConfigured()) return NextResponse.json({ ok: false, error: "Portal sign-in isn't set up yet (PORTAL_PASSWORD)." }, { status: 503 });
  const body = (await req.json().catch(() => ({}))) as { password?: unknown };
  if (typeof body.password !== "string" || !checkPassword(body.password)) {
    return NextResponse.json({ ok: false, error: "That password didn't work." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookie(sessionValue()));
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookie("", 0));
  return res;
}
