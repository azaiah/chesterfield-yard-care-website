// Weekly Lead Sweep: what came in, how fast we answered, what's slipping, and one-tap follow-ups.
import { SITE } from "@/lib/site";
import { quoteTotal, type Job, type Lead, type PortalState, type Quote } from "./types";

const DAY = 864e5;
const first = (name: string) => name.trim().split(/\s+/)[0] || "there";
const e164 = (phone: string) => `+1${phone.replace(/\D/g, "").slice(-10)}`;
export const smsLink = (phone: string, body: string) => `sms:${e164(phone)}?&body=${encodeURIComponent(body)}`;
export const telLink = (phone: string) => `tel:${e164(phone)}`;

export type SweepAction = {
  kind: "reply" | "follow_up" | "stale" | "review";
  lead?: Lead;
  job?: Job;
  quote?: Quote;
  title: string;
  detail: string;
  phone?: string | null;
  sms?: string;
};

export function sourceOf(l: Lead) {
  const s = l.utm?.source?.toLowerCase();
  if (!s || s === "direct") {
    try { return l.utm?.referrer ? new URL(l.utm.referrer).hostname.replace(/^www\./, "") : "Direct / typed"; } catch { return "Direct / typed"; }
  }
  if (s.includes("google")) return "Google";
  if (s.includes("facebook") || s.includes("fb") || s.includes("instagram")) return "Facebook / Instagram";
  if (s.includes("nextdoor")) return "Nextdoor";
  return s;
}

export const minutesToFirstContact = (l: Lead) =>
  l.first_contacted_at ? Math.max(0, Math.round((Date.parse(l.first_contacted_at) - Date.parse(l.created_at)) / 60000)) : null;

export function fmtMinutes(m: number | null) {
  if (m == null) return "—";
  if (m < 60) return `${m} min`;
  if (m < 60 * 24) return `${Math.round(m / 6) / 10} hr`;
  return `${Math.round(m / 144) / 10} days`;
}

export function computeSweep(state: PortalState, now = Date.now()) {
  const weekAgo = now - 7 * DAY;
  const recent = state.leads.filter((l) => Date.parse(l.created_at) >= weekAgo);
  const prevWeek = state.leads.filter((l) => Date.parse(l.created_at) >= weekAgo - 7 * DAY && Date.parse(l.created_at) < weekAgo);

  const bySource = new Map<string, number>();
  recent.forEach((l) => bySource.set(sourceOf(l), (bySource.get(sourceOf(l)) ?? 0) + 1));

  const responseTimes = recent.map(minutesToFirstContact).filter((m): m is number => m != null).sort((a, b) => a - b);
  const median = responseTimes.length ? responseTimes[Math.floor(responseTimes.length / 2)] : null;

  const acceptedThisWeek = state.quotes.filter((q) => q.status === "accepted" && Date.parse(q.sent_at ?? q.created_at) >= weekAgo);
  const wonValue = acceptedThisWeek.reduce((a, q) => a + quoteTotal(q), 0);
  const openQuotes = state.quotes.filter((q) => q.status === "sent");
  const pipeline = openQuotes.reduce((a, q) => a + quoteTotal(q), 0);
  const leadById = new Map(state.leads.map((l) => [l.id, l]));

  const actions: SweepAction[] = [];
  for (const l of state.leads) {
    const age = now - Date.parse(l.created_at);
    if (l.status === "new" && age > 15 * 60 * 1000) {
      actions.push({
        kind: "reply", lead: l, phone: l.phone,
        title: `Reply to ${l.name}`,
        detail: `Waiting ${fmtMinutes(Math.round(age / 60000))} · ${l.address}`,
        sms: `Hi ${first(l.name)}, this is ${SITE.name}. Thanks for reaching out! When's a good time to take a look at your yard? A photo works too.`,
      });
    } else if (l.status === "contacted" && age > 3 * DAY && !state.quotes.some((q) => q.lead_id === l.id)) {
      actions.push({
        kind: "stale", lead: l, phone: l.phone,
        title: `Send ${l.name} a quote`,
        detail: `Contacted ${fmtMinutes(Math.round(age / 60000))} ago, no quote yet`,
        sms: `Hi ${first(l.name)}, ${SITE.name} here. Still want that quote for ${l.address}? Send a photo of the yard and I'll get you a price today.`,
      });
    }
  }
  for (const q of openQuotes) {
    const since = now - Date.parse(q.sent_at ?? q.created_at);
    const l = leadById.get(q.lead_id);
    if (l && since > 2 * DAY) {
      actions.push({
        kind: "follow_up", lead: l, quote: q, phone: l.phone,
        title: `Follow up with ${l.name}`,
        detail: `$${quoteTotal(q).toLocaleString()} quote sent ${fmtMinutes(Math.round(since / 60000))} ago`,
        sms: `Hi ${first(l.name)}, just checking in on the quote from ${SITE.name}. Happy to answer questions or adjust anything. Want me to get you on the schedule?`,
      });
    }
  }
  for (const j of state.jobs) {
    const done = j.completed_at ? Date.parse(j.completed_at) : null;
    if (j.status === "done" && done && done >= weekAgo && j.phone) {
      actions.push({
        kind: "review", job: j, phone: j.phone,
        title: `Ask ${j.customer} for a review`,
        detail: `${j.title} finished ${new Date(done).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`,
        sms: `Hi ${first(j.customer)}, thanks for choosing ${SITE.name}! If you were happy with the ${j.title.toLowerCase()}, a quick Google review would mean a lot to a small local business${SITE.googleBusinessUrl ? `: ${SITE.googleBusinessUrl}` : "."}`,
      });
    }
  }
  const order = { reply: 0, follow_up: 1, stale: 2, review: 3 };
  actions.sort((a, b) => order[a.kind] - order[b.kind]);

  return {
    newLeads: recent.length,
    prevLeads: prevWeek.length,
    bySource: [...bySource.entries()].sort((a, b) => b[1] - a[1]),
    medianResponse: median,
    won: acceptedThisWeek.length,
    wonValue,
    openQuotes: openQuotes.length,
    pipeline,
    lost: recent.filter((l) => l.status === "lost").length,
    actions,
  };
}
export type Sweep = ReturnType<typeof computeSweep>;
