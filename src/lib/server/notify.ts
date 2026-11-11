import "server-only";
import { SITE } from "@/lib/site";
import type { LeadRecord } from "./leads";

// Email via Resend, SMS via Twilio. No SDKs — plain fetch keeps functions small.
// SMS is behind SMS_ENABLED=true because US business texting needs A2P 10DLC registration first (see docs/SMS_A2P_10DLC.md).

const smsEnabled = () =>
  process.env.SMS_ENABLED === "true" && !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_AUTH_TOKEN && !!process.env.TWILIO_FROM_NUMBER;

export async function sendSms(to: string, body: string) {
  if (!smsEnabled()) { console.info(`[sms disabled] to ${to}: ${body.slice(0, 80)}…`); return { skipped: true }; }
  const sid = process.env.TWILIO_ACCOUNT_SID!;
  const auth = Buffer.from(`${sid}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");
  const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: to, From: process.env.TWILIO_FROM_NUMBER!, Body: body }),
  });
  if (!r.ok) throw new Error(`Twilio ${r.status}: ${await r.text()}`);
  return { skipped: false };
}

export async function sendEmail(to: string, subject: string, html: string, text: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) { console.info(`[email disabled] to ${to}: ${subject}`); return { skipped: true }; }
  const from = process.env.RESEND_FROM || "Chesterfield Yard Care <onboarding@resend.dev>";
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html, text }),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
  return { skipped: false };
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function leadSummary(l: LeadRecord) {
  const lines = [
    `Name: ${l.name}`,
    `Phone: ${l.phone}`,
    `Address: ${l.address}`,
    l.services.length ? `Services: ${l.services.join(", ")}` : "",
    l.plan ? `Plan: ${l.plan}` : "",
    l.timing ? `Timing: ${l.timing}` : "",
    l.contact_pref ? `Prefers: ${l.contact_pref}` : "",
    l.email ? `Email: ${l.email}` : "",
    l.notes ? `Notes: ${l.notes}` : "",
    l.photos.length ? `Photos: ${l.photos.length} uploaded (see portal)` : "",
    `Source: ${l.source}${(l.utm as { source?: string } | undefined)?.source ? ` / ${(l.utm as { source?: string }).source}` : ""}`,
  ].filter(Boolean);
  return lines;
}

/** New lead: instant owner alert (SMS + email) and a confirmation text to the customer. Never throws. */
export async function notifyNewLead(l: LeadRecord, customerE164: string) {
  const ownerPhone = process.env.OWNER_ALERT_PHONE;
  const ownerEmail = process.env.OWNER_ALERT_EMAIL;
  const lines = leadSummary(l);
  const tasks: Promise<unknown>[] = [];
  if (ownerPhone) tasks.push(sendSms(ownerPhone, `🌿 New quote request\n${l.name} · ${l.phone}\n${l.address}${l.services.length ? `\n${l.services.join(", ")}` : ""}\nCall/text them now — speed wins.`));
  if (ownerEmail)
    tasks.push(
      sendEmail(
        ownerEmail,
        `New quote request — ${l.name} (${l.address})`,
        `<h2 style="font-family:sans-serif">New quote request</h2><p style="font-family:sans-serif;line-height:1.6">${lines.map(esc).join("<br>")}</p><p style="font-family:sans-serif"><a href="tel:${customerE164}">Call ${esc(l.phone)}</a> · <a href="sms:${customerE164}">Text ${esc(l.phone)}</a></p>`,
        lines.join("\n"),
      ),
    );
  tasks.push(
    sendSms(customerE164, `Got it! ${SITE.name} will reach out shortly. Want a faster quote? Reply with a photo of your yard. Reply STOP to opt out.`),
  );
  const results = await Promise.allSettled(tasks);
  results.forEach((r) => r.status === "rejected" && console.error("[notify]", r.reason));
}

/** Step 2 details added: short follow-up to the owner + customer email confirmation if they gave one. */
export async function notifyLeadDetails(l: LeadRecord) {
  const ownerEmail = process.env.OWNER_ALERT_EMAIL;
  const tasks: Promise<unknown>[] = [];
  const lines = leadSummary(l);
  if (ownerEmail)
    tasks.push(sendEmail(ownerEmail, `Quote details added — ${l.name}`, `<p style="font-family:sans-serif;line-height:1.6">${lines.map(esc).join("<br>")}</p>`, lines.join("\n")));
  if (l.email)
    tasks.push(
      sendEmail(
        l.email,
        `We got your request — ${SITE.name}`,
        `<p style="font-family:sans-serif;line-height:1.6">Hi ${esc(l.name.split(" ")[0])},<br><br>Thanks for reaching out! ${SITE.name} will get back to you shortly with your free quote.<br><br>Want it even faster? Text a photo of your yard to <a href="sms:${SITE.phoneE164}">${SITE.phone}</a>.<br><br>— ${SITE.name}</p>`,
        `Hi ${l.name.split(" ")[0]}, thanks for reaching out! ${SITE.name} will get back to you shortly. Want it faster? Text a photo of your yard to ${SITE.phone}.`,
      ),
    );
  const results = await Promise.allSettled(tasks);
  results.forEach((r) => r.status === "rejected" && console.error("[notify]", r.reason));
}
