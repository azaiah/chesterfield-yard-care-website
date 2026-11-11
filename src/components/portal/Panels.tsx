"use client";
import { useState } from "react";
import { CheckCircle2, CircleDashed, LogOut, MessageSquareText, Phone } from "lucide-react";
import { defaultPriceBook } from "@/content/pricing";
import { computeSweep, fmtMinutes, smsLink, telLink } from "@/lib/portal/sweep";
import type { PriceBook } from "@/lib/portal/types";
import { SERVICES } from "@/lib/site";
import { usePortal } from "./context";
import { btn, Card, Empty, H, input, money, Stat } from "./ui";

const KIND_LABEL = { reply: "Reply now", follow_up: "Follow up", stale: "Send a quote", review: "Ask for a review" } as const;

export function SweepView() {
  const { state, go, dispatch } = usePortal();
  const s = computeSweep(state);
  const trend = s.newLeads - s.prevLeads;
  return (
    <div className="space-y-6">
      <H sub="Your week at a glance, plus every lead that's slipping, with the text already written. Emailed to you every Monday.">Lead Sweep</H>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4" data-tour="sweep-stats">
        <Stat label="New leads" value={s.newLeads} sub={`${trend >= 0 ? "+" : ""}${trend} vs week before`} />
        <Stat label="Median reply" value={fmtMinutes(s.medianResponse)} sub="faster = more wins" />
        <Stat label="Won" value={money(s.wonValue)} sub={`${s.won} accepted`} />
        <Stat label="Open quotes" value={money(s.pipeline)} sub={`${s.openQuotes} waiting`} />
      </div>
      {s.bySource.length > 0 && (
        <Card>
          <h2 className="mb-3 font-head text-xl font-bold uppercase">Where leads came from</h2>
          <ul className="space-y-2">
            {s.bySource.map(([src, n]) => (
              <li key={src} className="grid grid-cols-[9rem_1fr_2rem] items-center gap-3 text-sm">
                <span className="truncate">{src}</span>
                <span className="h-3 overflow-hidden rounded-full bg-[var(--bg)]"><span className="block h-full rounded-full bg-lime-500" style={{ width: `${(n / s.newLeads) * 100}%` }} /></span>
                <span className="text-right font-semibold">{n}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
      <section data-tour="sweep-actions">
        <h2 className="h-display mb-3 text-2xl">To do <span className="text-[var(--muted)]">{s.actions.length}</span></h2>
        {s.actions.length ? (
          <ul className="space-y-2">
            {s.actions.map((a, i) => (
              <li key={i} data-tour={i === 0 ? "sweep-first" : undefined}>
                <Card className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[var(--bg)] px-2.5 py-1 text-xs font-bold uppercase tracking-wide">{KIND_LABEL[a.kind]}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[var(--heading)]">{a.title}</p>
                    <p className="text-sm text-[var(--muted)]">{a.detail}</p>
                  </div>
                  {a.phone && a.sms && (
                    <a
                      className={btn.blue}
                      href={smsLink(a.phone, a.sms)}
                      onClick={() => a.kind === "reply" && a.lead && dispatch({ op: "lead.update", id: a.lead.id, patch: { status: "contacted" } })}
                    >
                      <MessageSquareText size={16} aria-hidden /> Text
                    </a>
                  )}
                  {a.phone && <a className={btn.ghost} href={telLink(a.phone)} aria-label={`Call about: ${a.title}`}><Phone size={16} aria-hidden /></a>}
                  {a.lead && <button className={btn.ghost} onClick={() => go({ tab: "leads", lead: a.lead!.id })}>Open</button>}
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <Empty title="Nothing slipping">Every lead is answered and every quote is fresh.</Empty>
        )}
      </section>
    </div>
  );
}

export function Prices() {
  const { state, dispatch, toast } = usePortal();
  const [book, setBook] = useState<PriceBook>(state.priceBook);
  const dirty = JSON.stringify(book) !== JSON.stringify(state.priceBook);
  const set = (slug: string, k: "low" | "high", v: number) => setBook((b) => ({ ...b, [slug]: { ...b[slug], [k]: v } }));
  const save = async () => {
    for (const [slug, p] of Object.entries(book)) if (p.low > p.high) { toast(`${slug}: low price is above high price`); return; }
    if (await dispatch({ op: "prices.set", priceBook: book })) toast("Prices saved. The website estimator updates within a few minutes.");
  };
  return (
    <div>
      <H sub="Ranges for a ¼-acre yard. The website's instant estimate scales them by yard size, and new quotes start from the middle.">Price book</H>
      <Card data-tour="prices">
        <div className="hidden grid-cols-[1fr_7rem_7rem_8rem] gap-3 pb-2 text-xs font-bold uppercase text-[var(--muted)] sm:grid">
          <span>Service</span><span>Low</span><span>High</span><span>Per</span>
        </div>
        <ul className="divide-y divide-[var(--border)]">
          {SERVICES.map((s) => {
            const p = book[s.slug] ?? defaultPriceBook()[s.slug];
            return (
              <li key={s.slug} className="grid grid-cols-2 gap-3 py-3 sm:grid-cols-[1fr_7rem_7rem_8rem] sm:items-center">
                <span className="col-span-2 font-semibold sm:col-span-1">{s.label}</span>
                {(["low", "high"] as const).map((k) => (
                  <label key={k} className="relative">
                    <span className="sr-only">{s.label} {k} price</span>
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">$</span>
                    <input type="number" min={0} inputMode="numeric" className={`${input} pl-6`} value={p[k]} onChange={(e) => set(s.slug, k, Number(e.target.value) || 0)} />
                  </label>
                ))}
                <span className="col-span-2 text-sm text-[var(--muted)] sm:col-span-1">{p.unit}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className={btn.lime} disabled={!dirty} onClick={save}>Save prices</button>
          {dirty && <button className={btn.ghost} onClick={() => setBook(state.priceBook)}>Undo</button>}
        </div>
      </Card>
    </div>
  );
}

export function Settings({ onSignOut }: { onSignOut?: () => void }) {
  const { config, mode } = usePortal();
  const rows: [boolean, string, string][] = [
    [config.db === "supabase" || config.db === "demo", "Database", config.db === "supabase" ? "Supabase connected" : config.db === "local" ? "Local test file (dev only)" : config.db === "demo" ? "Demo data" : "Not connected: leads are only emailed"],
    [config.ownerEmail && config.email, "Email alerts", config.email ? (config.ownerEmail ? "On" : "Add OWNER_ALERT_EMAIL") : "Add a Resend API key"],
    [config.sms && config.ownerPhone, "Text alerts", config.sms ? "On" : "Waiting on Twilio business texting approval"],
    [config.cron, "Monday Lead Sweep email", config.cron ? "Scheduled" : "Add CRON_SECRET in Netlify"],
    [config.turnstile, "Spam check", config.turnstile ? "Cloudflare Turnstile on" : "Basic protection (honeypot + rate limit)"],
    [config.analytics, "Analytics", config.analytics ? "On" : "Add a GA4 or Meta Pixel ID"],
  ];
  return (
    <div className="space-y-5">
      <H sub="What's connected behind the scenes.">Settings</H>
      <Card>
        <ul className="divide-y divide-[var(--border)]">
          {rows.map(([ok, label, detail]) => (
            <li key={label} className="flex items-center gap-3 py-3">
              {ok ? <CheckCircle2 className="shrink-0 text-lime-500" aria-label="On" /> : <CircleDashed className="shrink-0 text-[var(--muted)]" aria-label="Not set up" />}
              <span className="font-semibold">{label}</span>
              <span className="ml-auto text-right text-sm text-[var(--muted)]">{detail}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="mb-2 font-head text-xl font-bold uppercase">Put the portal on your home screen</h2>
        <p className="text-sm text-[var(--muted)]">iPhone: open this page in Safari → Share → Add to Home Screen. Android: Chrome menu → Install app.</p>
      </Card>
      {mode === "live" && onSignOut && <button className={btn.ghost} onClick={onSignOut}><LogOut size={16} aria-hidden /> Sign out</button>}
    </div>
  );
}
