import { NextResponse, type NextRequest } from "next/server";
import { after } from "next/server";
import {
  e164, formatPhone, insertLead, leadToken, newLeadId, rateLimited, step1Schema, verifyTurnstile, type LeadRecord,
} from "@/lib/server/leads";
import { notifyNewLead } from "@/lib/server/notify";

export const runtime = "nodejs";

const clientIp = (req: NextRequest) =>
  req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

/** Step 1: name, phone, address → lead saved, owner alerted, customer auto-texted. */
export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (rateLimited(`lead:${ip ?? "unknown"}`)) {
    return NextResponse.json({ ok: false, error: "Too many requests — please call or text 804-773-8271." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = step1Schema.safeParse(json);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    // Honeypot hit: pretend success so bots learn nothing.
    if (issue?.path[0] === "website") return NextResponse.json({ ok: true, id: "ok", token: "ok" });
    return NextResponse.json({ ok: false, field: issue?.path[0], error: issue?.message ?? "Invalid form" }, { status: 400 });
  }
  const d = parsed.data;
  if (!(await verifyTurnstile(d.turnstileToken, ip))) {
    return NextResponse.json({ ok: false, error: "Couldn't verify you're human — please try again, or call/text 804-773-8271." }, { status: 400 });
  }

  const lead: LeadRecord = {
    id: newLeadId(),
    created_at: new Date().toISOString(),
    status: "new" as const,
    source: d.source,
    name: d.name,
    phone: formatPhone(d.phone),
    address: d.address,
    services: d.services ?? [],
    plan: d.plan ?? null,
    estimate: d.estimate ?? null,
    photos: [],
    utm: d.utm ?? null,
    page: d.page ?? null,
  };

  try {
    await insertLead(lead);
  } catch (e) {
    console.error("[leads] insert failed", e);
    // Still alert the owner so the lead isn't lost.
  }
  after(() => notifyNewLead(lead, e164(d.phone)));

  return NextResponse.json({ ok: true, id: lead.id, token: leadToken(lead.id) });
}
