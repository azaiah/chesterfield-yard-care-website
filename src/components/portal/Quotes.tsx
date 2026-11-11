"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarPlus, Check, Copy, MessageSquareText, Plus, Trash2, X } from "lucide-react";
import { smsLink } from "@/lib/portal/sweep";
import { quoteTotal, uid, type Job, type Quote, type QuoteItem } from "@/lib/portal/types";
import { SERVICES, SITE } from "@/lib/site";
import { usePortal } from "./context";
import { btn, Card, Empty, H, input, money, serviceLabel, StatusPill, timeAgo, todayYmd } from "./ui";

export function quoteMessage(name: string, q: Pick<Quote, "items" | "note">) {
  const lines = q.items.map((i) => `• ${i.label}: ${money(i.price)}`).join("\n");
  return `Hi ${name.split(" ")[0]}! Here's your quote from ${SITE.name}:\n${lines}\nTotal: ${money(quoteTotal(q))}${q.note ? `\n${q.note}` : ""}\nReply YES and I'll get you on the schedule.`;
}

export function Quotes() {
  const { state, nav, go } = usePortal();
  const quote = nav.quote ? state.quotes.find((q) => q.id === nav.quote) : null;
  if (quote) return <QuoteEditor key={quote.id} quote={quote} />;

  const leadName = (id: string) => state.leads.find((l) => l.id === id)?.name ?? "Unknown";
  const groups: { title: string; list: Quote[] }[] = [
    { title: "Waiting on customer", list: state.quotes.filter((q) => q.status === "sent") },
    { title: "Drafts", list: state.quotes.filter((q) => q.status === "draft") },
    { title: "Decided", list: state.quotes.filter((q) => q.status === "accepted" || q.status === "declined") },
  ];
  return (
    <div>
      <H sub="Build a quote from a lead, text it, and mark it won.">Quotes</H>
      {state.quotes.length === 0 ? (
        <Empty title="No quotes yet">Open a lead and tap “Build quote”.</Empty>
      ) : (
        <div className="space-y-8">
          {groups.filter((g) => g.list.length).map((g) => (
            <section key={g.title}>
              <h2 className="h-display mb-3 text-2xl">{g.title} <span className="text-[var(--muted)]">{g.list.length}</span></h2>
              <ul className="space-y-2">
                {g.list.map((q) => (
                  <li key={q.id}>
                    <button className="w-full text-left" onClick={() => go({ tab: "quotes", quote: q.id })}>
                      <Card className="flex flex-wrap items-center gap-3 transition hover:border-lime-500">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-[var(--heading)]">{leadName(q.lead_id)}</p>
                          <p className="truncate text-sm text-[var(--muted)]">{q.items.map((i) => i.label).join(", ") || "Empty"} · {timeAgo(q.sent_at ?? q.created_at)}</p>
                        </div>
                        <span className="font-head text-2xl font-extrabold text-[var(--heading)]">{money(quoteTotal(q))}</span>
                        <StatusPill status={q.status} />
                      </Card>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function QuoteEditor({ quote }: { quote: Quote }) {
  const { state, dispatch, go, toast } = usePortal();
  const lead = state.leads.find((l) => l.id === quote.lead_id);
  const [items, setItems] = useState<QuoteItem[]>(quote.items);
  const [note, setNote] = useState(quote.note ?? "");
  useEffect(() => setItems(quote.items), [quote.items]);
  const editable = quote.status === "draft" || quote.status === "sent";
  const dirty = JSON.stringify(items) !== JSON.stringify(quote.items) || note !== (quote.note ?? "");
  const total = quoteTotal({ items });
  const job = state.jobs.find((j) => j.quote_id === quote.id);

  const save = () => dispatch({ op: "quote.update", id: quote.id, patch: { items, note: note || null } });
  const addService = (slug: string) => {
    const b = state.priceBook[slug];
    setItems((cur) => [...cur, { service: slug, label: serviceLabel(slug), price: b ? Math.round((b.low + b.high) / 2 / 5) * 5 : 0 }]);
  };
  const message = lead ? quoteMessage(lead.name, { items, note }) : "";
  const send = async () => {
    await dispatch({ op: "quote.update", id: quote.id, patch: { items, note: note || null, status: "sent", sent_at: new Date().toISOString() } });
  };
  const schedule = async () => {
    if (!lead) return;
    const j: Job = {
      id: uid(), lead_id: lead.id, quote_id: quote.id, created_at: new Date().toISOString(),
      title: items.map((i) => i.label).join(" + ") || "Yard work", customer: lead.name, phone: lead.phone, address: lead.address,
      date: todayYmd(2), time: "9:00 AM", status: "scheduled", notes: lead.owner_notes ?? null, photos: [],
    };
    if (await dispatch({ op: "job.create", job: j })) go({ tab: "jobs", job: j.id });
  };

  return (
    <div className="space-y-5">
      <button onClick={() => go({ tab: "quotes" })} className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--link)]"><ArrowLeft size={16} aria-hidden /> All quotes</button>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="h-display text-4xl md:text-5xl">Quote for {lead?.name ?? "customer"}</h1>
          <p className="mt-1 text-[var(--muted)]">{lead?.address}</p>
        </div>
        <StatusPill status={quote.status} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Card data-tour="quote-items">
          <ul className="divide-y divide-[var(--border)]">
            {items.map((it, i) => (
              <li key={i} className="flex items-center gap-2 py-2">
                <input
                  aria-label="Line item"
                  className={`${input} flex-1`}
                  value={it.label}
                  disabled={!editable}
                  onChange={(e) => setItems((c) => c.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                />
                <label className="relative w-28 shrink-0">
                  <span className="sr-only">Price for {it.label}</span>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    className={`${input} pl-6 text-right`}
                    value={it.price}
                    disabled={!editable}
                    onChange={(e) => setItems((c) => c.map((x, j) => (j === i ? { ...x, price: Number(e.target.value) || 0 } : x)))}
                  />
                </label>
                {editable && (
                  <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[var(--muted)] hover:text-red-600" aria-label={`Remove ${it.label}`} onClick={() => setItems((c) => c.filter((_, j) => j !== i))}>
                    <Trash2 size={16} aria-hidden />
                  </button>
                )}
              </li>
            ))}
          </ul>
          {state.priceBook && editable && (
            <div className="mt-3 flex flex-wrap gap-2">
              {SERVICES.map((s) => (
                <button key={s.slug} className="inline-flex min-h-9 items-center gap-1 rounded-full border border-dashed border-[var(--border)] px-3 text-sm hover:border-lime-500" onClick={() => addService(s.slug)}>
                  <Plus size={14} aria-hidden /> {s.label}
                </button>
              ))}
            </div>
          )}
          <label className="mt-4 block text-sm">
            <span className="mb-1 block font-semibold">Note to customer <span className="font-normal text-[var(--muted)]">(optional)</span></span>
            <input className={input} value={note} disabled={!editable} onChange={(e) => setNote(e.target.value)} placeholder="Includes haul-away. Can start Thursday." />
          </label>
          <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4">
            <span className="font-head text-xl font-bold uppercase">Total</span>
            <span className="font-head text-4xl font-extrabold text-[var(--heading)]">{money(total)}</span>
          </div>
          {dirty && editable && <button className={`${btn.ghost} mt-3 w-full`} onClick={save}>Save changes</button>}
        </Card>

        <div className="space-y-4">
          {lead && editable && (
            <Card data-tour="quote-send">
              <h2 className="mb-2 font-head text-xl font-bold uppercase">Send it</h2>
              <pre className="whitespace-pre-wrap rounded-xl bg-[var(--bg)] p-3 font-sans text-sm">{message}</pre>
              <div className="mt-3 grid gap-2">
                <a className={btn.blue} href={smsLink(lead.phone, message)} onClick={send}><MessageSquareText size={16} aria-hidden /> Text to {lead.phone}</a>
                <button
                  className={btn.ghost}
                  onClick={async () => { try { await navigator.clipboard.writeText(message); toast("Copied"); } catch { toast("Couldn't copy"); } }}
                >
                  <Copy size={16} aria-hidden /> Copy message
                </button>
              </div>
              <p className="mt-2 text-xs text-[var(--muted)]">Opens your phone&apos;s Messages with the quote written in. Marks it “sent”.</p>
            </Card>
          )}
          <Card data-tour="quote-decide">
            <h2 className="mb-3 font-head text-xl font-bold uppercase">Decision</h2>
            {quote.status === "accepted" ? (
              job ? (
                <button className={`${btn.lime} w-full`} onClick={() => go({ tab: "jobs", job: job.id })}>View the job</button>
              ) : (
                <button className={`${btn.lime} w-full`} onClick={schedule}><CalendarPlus size={16} aria-hidden /> Schedule the job</button>
              )
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button className={btn.lime} onClick={() => dispatch({ op: "quote.update", id: quote.id, patch: { status: "accepted", items, note: note || null } })}><Check size={16} aria-hidden /> Won</button>
                <button className={btn.ghost} onClick={() => dispatch({ op: "quote.update", id: quote.id, patch: { status: "declined" } })}><X size={16} aria-hidden /> Declined</button>
              </div>
            )}
            {quote.status === "declined" && (
              <button className={`${btn.ghost} mt-2 w-full`} onClick={() => dispatch({ op: "quote.update", id: quote.id, patch: { status: "draft" } })}>Reopen</button>
            )}
          </Card>
          {lead && <button className="text-sm font-semibold text-[var(--link)]" onClick={() => go({ tab: "leads", lead: lead.id })}>Open {lead.name}&apos;s lead →</button>}
        </div>
      </div>
    </div>
  );
}
