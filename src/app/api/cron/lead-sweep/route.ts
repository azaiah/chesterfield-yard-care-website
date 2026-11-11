import { NextResponse, type NextRequest } from "next/server";
import { computeSweep, fmtMinutes } from "@/lib/portal/sweep";
import { SITE } from "@/lib/site";
import { sendEmail } from "@/lib/server/notify";
import { loadState } from "@/lib/server/portal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Weekly Lead Sweep email to the owner. Called by the Netlify scheduled function with `Authorization: Bearer CRON_SECRET`. */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return new NextResponse("Unauthorized", { status: 401 });
  const to = process.env.OWNER_ALERT_EMAIL;
  if (!to) return NextResponse.json({ ok: false, error: "OWNER_ALERT_EMAIL not set" }, { status: 503 });

  const s = computeSweep(await loadState());
  const money = (n: number) => `$${n.toLocaleString("en-US")}`;
  const stats: [string, string][] = [
    ["New leads", `${s.newLeads} (week before: ${s.prevLeads})`],
    ["Median reply time", fmtMinutes(s.medianResponse)],
    ["Won", `${s.won} · ${money(s.wonValue)}`],
    ["Open quotes", `${s.openQuotes} · ${money(s.pipeline)}`],
  ];
  const portal = `${SITE.url}/portal?tab=sweep`;
  const row = ([k, v]: [string, string]) =>
    `<tr><td style="padding:6px 0;border-bottom:1px solid #e5e7eb">${k}</td><td style="padding:6px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:bold">${esc(v)}</td></tr>`;
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;line-height:1.5;color:#06210F">
  <h2 style="margin:0 0 4px">Your weekly Lead Sweep</h2>
  <p style="margin:0 0 16px;color:#3f5446">${SITE.name} · week ending ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}</p>
  <table style="width:100%;border-collapse:collapse">${stats.map(row).join("")}</table>
  ${s.bySource.length ? `<p style="margin:16px 0 4px;font-weight:bold">Where leads came from</p><p style="margin:0">${s.bySource.map(([k, v]) => `${esc(k)}: ${v}`).join(" · ")}</p>` : ""}
  <p style="margin:20px 0 6px;font-weight:bold">To do (${s.actions.length})</p>
  ${
    s.actions.length
      ? `<ul style="padding-left:18px;margin:0">${s.actions.slice(0, 15).map((a) => `<li style="margin-bottom:6px"><b>${esc(a.title)}</b><br><span style="color:#3f5446">${esc(a.detail)}</span></li>`).join("")}</ul>`
      : `<p style="margin:0">Nothing slipping. Nice work.</p>`
  }
  <p style="margin:24px 0"><a href="${portal}" style="background:#8DC63F;color:#06210F;padding:12px 18px;border-radius:999px;text-decoration:none;font-weight:bold">Open the Lead Sweep</a></p>
  <p style="color:#3f5446;font-size:12px">Each to-do in the portal has a one-tap text with the message already written.</p></div>`;
  const text = `Weekly Lead Sweep\n${stats.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nTo do:\n${s.actions.map((a) => `- ${a.title} (${a.detail})`).join("\n") || "Nothing slipping."}\n\n${portal}`;

  await sendEmail(to, `Lead Sweep: ${s.newLeads} new, ${s.actions.length} to do`, html, text);
  return NextResponse.json({ ok: true, newLeads: s.newLeads, actions: s.actions.length });
}
