"use client";
import { ArrowRight, MapPin, MessageSquareText, Phone } from "lucide-react";
import { computeSweep, fmtMinutes, smsLink, telLink } from "@/lib/portal/sweep";
import { quoteTotal } from "@/lib/portal/types";
import { usePortal } from "./context";
import { btn, Card, Empty, fmtDay, H, money, serviceLabel, Stat, StatusPill, timeAgo, todayYmd } from "./ui";

export function Today() {
  const { state, go } = usePortal();
  const sweep = computeSweep(state);
  const waiting = state.leads.filter((l) => l.status === "new");
  const today = todayYmd();
  const todays = state.jobs.filter((j) => j.date === today && j.status === "scheduled").sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));
  const upcoming = state.jobs.filter((j) => j.date > today && j.status === "scheduled").sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
  const hour = new Date().getHours();

  return (
    <div className="space-y-6">
      <H sub={new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}>
        Good {hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening"}
      </H>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat tour="stat-new" label="Waiting on you" value={waiting.length} sub={waiting.length ? "new leads" : "all caught up"} />
        <Stat label="Reply time" value={fmtMinutes(sweep.medianResponse)} sub="median, last 7 days" />
        <Stat label="Open quotes" value={money(sweep.pipeline)} sub={`${sweep.openQuotes} out for decision`} />
        <Stat label="Won this week" value={money(sweep.wonValue)} sub={`${sweep.won} accepted`} />
      </div>

      <section data-tour="needs-you" aria-labelledby="needs-h">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="needs-h" className="h-display text-2xl">Needs you now</h2>
          <button className="min-h-11 inline-flex items-center text-sm font-semibold text-[var(--link)]" onClick={() => go({ tab: "sweep" })}>Full Lead Sweep →</button>
        </div>
        {sweep.actions.length ? (
          <ul className="space-y-2">
            {sweep.actions.slice(0, 3).map((a, i) => (
              <li key={i}>
                <Card className="flex flex-wrap items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[var(--heading)]">{a.title}</p>
                    <p className="text-sm text-[var(--muted)]">{a.detail}</p>
                  </div>
                  {a.phone && a.sms && <a className={btn.blue} href={smsLink(a.phone, a.sms)}><MessageSquareText size={16} aria-hidden /> Text</a>}
                  {a.lead && <button className={btn.ghost} onClick={() => go({ tab: "leads", lead: a.lead!.id })}>Open</button>}
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <Empty title="Nothing slipping">Every lead has an answer. Nice.</Empty>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="jobs-h" className="min-w-0">
          <h2 id="jobs-h" className="h-display mb-3 text-2xl">Today&apos;s jobs</h2>
          {todays.length ? (
            <ul className="space-y-2">
              {todays.map((j) => (
                <li key={j.id}>
                  <Card className="flex items-center gap-3">
                    <button className="min-w-0 flex-1 text-left" onClick={() => go({ tab: "jobs", job: j.id })}>
                      <p className="font-semibold text-[var(--heading)]">{j.time ? `${j.time} · ` : ""}{j.title}</p>
                      <p className="truncate text-sm text-[var(--muted)]"><MapPin size={13} className="inline" aria-hidden /> {j.customer} · {j.address}</p>
                    </button>
                    {j.phone && <a className={btn.ghost} href={telLink(j.phone)} aria-label={`Call ${j.customer}`}><Phone size={16} aria-hidden /></a>}
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <Empty title="No jobs today">{upcoming.length ? `Next: ${upcoming[0].title} on ${fmtDay(upcoming[0].date)}` : "Schedule one from an accepted quote."}</Empty>
          )}
          {upcoming.length > 0 && todays.length > 0 && (
            <p className="mt-2 text-sm text-[var(--muted)]">Coming up: {upcoming.map((j) => `${j.customer} (${fmtDay(j.date)})`).join(", ")}</p>
          )}
        </section>

        <section aria-labelledby="recent-h" className="min-w-0">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="recent-h" className="h-display text-2xl">Latest leads</h2>
            <button className="min-h-11 inline-flex items-center text-sm font-semibold text-[var(--link)]" onClick={() => go({ tab: "leads" })}>All leads →</button>
          </div>
          {state.leads.length ? (
            <ul className="space-y-2">
              {state.leads.slice(0, 5).map((l) => {
                const q = state.quotes.find((x) => x.lead_id === l.id);
                return (
                  <li key={l.id}>
                    <button className="w-full text-left" onClick={() => go({ tab: "leads", lead: l.id })}>
                      <Card className="flex items-center gap-3 transition hover:border-lime-500">
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-2 font-semibold text-[var(--heading)]">{l.name} <StatusPill status={l.status} /></p>
                          <p className="truncate text-sm text-[var(--muted)]">
                            {l.services.map(serviceLabel).join(", ") || "Quote request"} · {timeAgo(l.created_at)}
                            {q ? ` · ${money(quoteTotal(q))}` : ""}
                          </p>
                        </div>
                        <ArrowRight size={16} aria-hidden className="shrink-0 text-[var(--muted)]" />
                      </Card>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Empty title="No leads yet">Quote requests from the website land here instantly.</Empty>
          )}
        </section>
      </div>
    </div>
  );
}
