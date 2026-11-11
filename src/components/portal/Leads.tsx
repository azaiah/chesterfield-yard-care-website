"use client";
import { useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, FileText, MapPin, MessageSquareText, Phone, Search } from "lucide-react";
import { smsLink, sourceOf, telLink } from "@/lib/portal/sweep";
import { LEAD_STATUSES, LOST_REASONS, quoteTotal, uid, type Lead, type LeadStatus, type Quote } from "@/lib/portal/types";
import { SITE } from "@/lib/site";
import { usePortal } from "./context";
import { btn, Card, Empty, H, input, money, serviceLabel, StatusPill, timeAgo } from "./ui";

export function Leads() {
  const { state, nav, go } = usePortal();
  const [filter, setFilter] = useState<LeadStatus | "all" | "open">("open");
  const [q, setQ] = useState("");
  const lead = nav.lead ? state.leads.find((l) => l.id === nav.lead) : null;

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: state.leads.length, open: 0 };
    state.leads.forEach((l) => { c[l.status] = (c[l.status] ?? 0) + 1; if (l.status !== "won" && l.status !== "lost") c.open++; });
    return c;
  }, [state.leads]);

  if (lead) return <LeadDetail lead={lead} onBack={() => go({ tab: "leads" })} />;

  const needle = q.trim().toLowerCase();
  const list = state.leads.filter(
    (l) =>
      (filter === "all" || (filter === "open" ? l.status !== "won" && l.status !== "lost" : l.status === filter)) &&
      (!needle || `${l.name} ${l.phone} ${l.address} ${l.services.join(" ")}`.toLowerCase().includes(needle)),
  );
  const chips: { id: typeof filter; label: string }[] = [{ id: "open", label: "Open" }, ...LEAD_STATUSES, { id: "all", label: "All" }];

  return (
    <div>
      <H sub="Every quote request from the website, newest first.">Leads</H>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter leads" data-tour="lead-filters">
          {chips.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={filter === c.id}
              onClick={() => setFilter(c.id)}
              className={`min-h-10 shrink-0 rounded-full border px-3.5 text-sm font-semibold ${filter === c.id ? "border-lime-500 bg-lime-500 text-forest-950" : "border-[var(--border)] text-[var(--heading)]"}`}
            >
              {c.label} <span className="opacity-70">{counts[c.id] ?? 0}</span>
            </button>
          ))}
        </div>
        <label className="relative md:ml-auto md:w-72">
          <span className="sr-only">Search leads</span>
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" aria-hidden />
          <input className={`${input} pl-9`} placeholder="Search name, phone, address" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>
      {list.length ? (
        <ul className="space-y-2">
          {list.map((l, i) => {
            const quote = state.quotes.find((x) => x.lead_id === l.id);
            return (
              <li key={l.id} data-tour={i === 0 ? "lead-list" : undefined}>
                <button className="w-full text-left" onClick={() => go({ tab: "leads", lead: l.id })}>
                  <Card className="grid gap-1 transition hover:border-lime-500 md:grid-cols-[1.2fr_1.4fr_auto] md:items-center md:gap-4">
                    <div>
                      <p className="flex flex-wrap items-center gap-2 font-semibold text-[var(--heading)]">{l.name} <StatusPill status={l.status} /></p>
                      <p className="text-sm text-[var(--muted)]">{l.phone} · {timeAgo(l.created_at)}</p>
                    </div>
                    <p className="truncate text-sm">{l.services.map(serviceLabel).join(", ") || "General quote"} · <span className="text-[var(--muted)]">{l.address}</span></p>
                    <p className="text-sm font-semibold text-[var(--heading)]">{quote ? money(quoteTotal(quote)) : l.photos.length ? `${l.photos.length} photo${l.photos.length > 1 ? "s" : ""}` : ""}</p>
                  </Card>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <Empty title={needle ? "No matches" : "Nothing here"}>{needle ? "Try a different search." : "New quote requests show up here instantly."}</Empty>
      )}
    </div>
  );
}

export function newQuoteFor(lead: Lead, book: Record<string, { low: number; high: number }>): Quote {
  const services = lead.services.length ? lead.services : [];
  return {
    id: uid(),
    lead_id: lead.id,
    created_at: new Date().toISOString(),
    status: "draft",
    items: services.map((s) => ({ service: s, label: serviceLabel(s), price: book[s] ? Math.round((book[s].low + book[s].high) / 2 / 5) * 5 : 0 })),
    note: null,
  };
}

function LeadDetail({ lead, onBack }: { lead: Lead; onBack: () => void }) {
  const { state, dispatch, go, photoSrc } = usePortal();
  const quotes = state.quotes.filter((q) => q.lead_id === lead.id);
  const [notes, setNotes] = useState(lead.owner_notes ?? "");
  const first = lead.name.split(" ")[0];
  const hello = `Hi ${first}, this is ${SITE.name}. Thanks for your request for ${lead.address}! When's a good time to swing by, or can you text a photo of the yard?`;
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.address)}`;

  const setStatus = (status: LeadStatus) => dispatch({ op: "lead.update", id: lead.id, patch: { status, ...(status !== "lost" ? { lost_reason: null } : {}) } });
  const markContacted = () => lead.status === "new" && setStatus("contacted");

  const createQuote = async () => {
    const q = newQuoteFor(lead, state.priceBook);
    if (await dispatch({ op: "quote.create", quote: q })) go({ tab: "quotes", quote: q.id });
  };

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--link)]"><ArrowLeft size={16} aria-hidden /> All leads</button>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="h-display text-4xl md:text-5xl">{lead.name}</h1>
          <p className="mt-1 text-[var(--muted)]">Came in {timeAgo(lead.created_at)} · from {sourceOf(lead)}{lead.page ? ` (${lead.page})` : ""}</p>
        </div>
        <StatusPill status={lead.status} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap" data-tour="lead-actions">
        <a className={btn.lime} href={telLink(lead.phone)} onClick={markContacted}><Phone size={16} aria-hidden /> Call {lead.phone}</a>
        <a className={btn.blue} href={smsLink(lead.phone, hello)} onClick={markContacted}><MessageSquareText size={16} aria-hidden /> Text</a>
        <a className={btn.ghost} href={maps} target="_blank" rel="noopener noreferrer"><MapPin size={16} aria-hidden /> Map</a>
        <button className={btn.ghost} onClick={createQuote} data-tour="lead-quote"><FileText size={16} aria-hidden /> {quotes.length ? "New quote" : "Build quote"}</button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5">
          <Card>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div><dt className="text-xs font-bold uppercase text-[var(--muted)]">Address</dt><dd>{lead.address}</dd></div>
              <div><dt className="text-xs font-bold uppercase text-[var(--muted)]">Phone</dt><dd>{lead.phone}{lead.contact_pref ? ` · prefers ${lead.contact_pref}` : ""}</dd></div>
              <div><dt className="text-xs font-bold uppercase text-[var(--muted)]">Wants</dt><dd>{lead.services.map(serviceLabel).join(", ") || "Not specified"}{lead.plan ? ` · ${lead.plan} plan` : ""}</dd></div>
              <div><dt className="text-xs font-bold uppercase text-[var(--muted)]">Timing</dt><dd>{lead.timing?.replace("_", " ") ?? "—"}</dd></div>
              {lead.estimate?.low != null && (
                <div><dt className="text-xs font-bold uppercase text-[var(--muted)]">Saw estimate</dt><dd>{money(lead.estimate.low)}–{money(lead.estimate.high ?? 0)} ({lead.estimate.size})</dd></div>
              )}
              {lead.email && <div><dt className="text-xs font-bold uppercase text-[var(--muted)]">Email</dt><dd><a className="underline" href={`mailto:${lead.email}`}>{lead.email}</a></dd></div>}
            </dl>
            {lead.notes && <p className="mt-4 rounded-xl bg-[var(--bg)] p-3 text-sm"><b>Their note:</b> {lead.notes}</p>}
          </Card>

          {lead.photos.length > 0 && (
            <Card>
              <h2 className="mb-3 font-head text-xl font-bold uppercase">Their photos</h2>
              <ul className="grid grid-cols-3 gap-2">
                {lead.photos.map((k) => (
                  <li key={k}>
                    <a href={photoSrc(k)} target="_blank" rel="noopener noreferrer">
                      {/* eslint-disable-next-line @next/next/no-img-element -- private, auth-gated photos */}
                      <img src={photoSrc(k)} alt="Customer yard photo" className="aspect-square w-full rounded-lg object-cover" />
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card>
            <h2 className="mb-3 font-head text-xl font-bold uppercase">Quotes</h2>
            {quotes.length ? (
              <ul className="space-y-2">
                {quotes.map((q) => (
                  <li key={q.id}>
                    <button className="flex w-full items-center justify-between gap-3 rounded-xl border border-[var(--border)] p-3 text-left hover:border-lime-500" onClick={() => go({ tab: "quotes", quote: q.id })}>
                      <span>{q.items.map((i) => i.label).join(", ") || "Empty quote"}</span>
                      <span className="flex items-center gap-2 font-semibold">{money(quoteTotal(q))} <StatusPill status={q.status} /> <ExternalLink size={14} aria-hidden /></span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[var(--muted)]">No quote yet. Build one in seconds from your price book.</p>
            )}
          </Card>
        </div>

        <div className="space-y-5">
          <Card data-tour="lead-status">
            <h2 className="mb-3 font-head text-xl font-bold uppercase">Status</h2>
            <div className="flex flex-wrap gap-2">
              {LEAD_STATUSES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStatus(s.id)}
                  aria-pressed={lead.status === s.id}
                  className={`min-h-10 rounded-full border px-3.5 text-sm font-semibold ${lead.status === s.id ? "border-lime-500 bg-lime-500 text-forest-950" : "border-[var(--border)]"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            {lead.status === "lost" && (
              <label className="mt-4 block text-sm">
                <span className="mb-1 block font-semibold">Why did we lose it?</span>
                <select className={input} value={lead.lost_reason ?? ""} onChange={(e) => dispatch({ op: "lead.update", id: lead.id, patch: { lost_reason: e.target.value || null } })}>
                  <option value="">Pick a reason</option>
                  {[...LOST_REASONS, ...(lead.lost_reason && !LOST_REASONS.includes(lead.lost_reason) ? [lead.lost_reason] : [])].map((r) => <option key={r}>{r}</option>)}
                </select>
              </label>
            )}
          </Card>
          <Card>
            <label htmlFor="owner-notes" className="mb-2 block font-head text-xl font-bold uppercase">Your notes</label>
            <textarea
              id="owner-notes"
              rows={5}
              className={`${input} py-2`}
              placeholder="Gate code, dog, what they said on the phone…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => notes !== (lead.owner_notes ?? "") && dispatch({ op: "lead.update", id: lead.id, patch: { owner_notes: notes || null } })}
            />
            <p className="mt-1 text-xs text-[var(--muted)]">Saves when you tap away.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
