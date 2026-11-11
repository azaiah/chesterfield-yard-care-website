import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/server/auth";
import { loadState } from "@/lib/server/portal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireOwner();
  if (denied) return denied;
  return NextResponse.json({ ok: true, state: await loadState() });
}
