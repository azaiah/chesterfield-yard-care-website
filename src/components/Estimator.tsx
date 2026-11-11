"use client";
import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { estimate, PRICING, type Book, type FreqKey, type SizeKey } from "@/content/pricing";
import { QuickQuote } from "./QuickQuote";
import { track } from "./Tracking";

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

export function Estimator() {
  const [services, setServices] = useState<string[]>(["leaf-cleanup"]);
  const [size, setSize] = useState<SizeKey>("quarter");
  const [freq, setFreq] = useState<FreqKey>("weekly");
  const [locked, setLocked] = useState(false);
  const [book, setBook] = useState<Book | null>(null);
  useEffect(() => {
    fetch("/api/pricing")
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { book: Book; custom: boolean } | null) => { if (j?.custom) setBook(j.book); })
      .catch(() => {});
  }, []);
  const est = useMemo(() => estimate(services, size, freq, book ?? undefined), [services, size, freq, book]);
  const hasRecurring = services.includes("mowing");

  const toggle = (s: string) => setServices((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  const chip = "flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition";

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-7">
        <fieldset>
          <legend className="eyebrow mb-3">1 · Pick services</legend>
          <div className="flex flex-wrap gap-2">
            {Object.entries(PRICING.services).map(([slug, p]) => {
              const on = services.includes(slug);
              return (
                <label key={slug} className={`${chip} ${on ? "border-lime-500 bg-lime-500 text-forest-950" : "border-[var(--border)] bg-[var(--surface)] text-[var(--heading)] hover:border-lime-500"}`}>
                  <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(slug)} />
                  {on && <Check size={15} aria-hidden />} {p.label}
                </label>
              );
            })}
          </div>
        </fieldset>
        <fieldset>
          <legend className="eyebrow mb-3">2 · Yard size</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(Object.keys(PRICING.size) as SizeKey[]).map((k) => (
              <label key={k} className={`${chip} justify-center ${size === k ? "border-electric-500 bg-royal-600 text-white" : "border-[var(--border)] bg-[var(--surface)] text-[var(--heading)]"}`}>
                <input type="radio" name="size" className="sr-only" checked={size === k} onChange={() => setSize(k)} />
                {PRICING.sizeLabel[k]}
              </label>
            ))}
          </div>
        </fieldset>
        {hasRecurring && (
          <fieldset>
            <legend className="eyebrow mb-3">3 · Mowing frequency</legend>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PRICING.frequency) as FreqKey[]).map((k) => (
                <label key={k} className={`${chip} ${freq === k ? "border-electric-500 bg-royal-600 text-white" : "border-[var(--border)] bg-[var(--surface)] text-[var(--heading)]"}`}>
                  <input type="radio" name="freq" className="sr-only" checked={freq === k} onChange={() => setFreq(k)} />
                  {PRICING.frequencyLabel[k]}
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </div>

      <div className="cyc-frame self-start" aria-live="polite">
        {!locked ? (
          <>
            <p className="eyebrow !text-lime-300">Your ballpark</p>
            {est.lines.length ? (
              <>
                <p className="h-display mt-2 text-5xl !text-white md:text-6xl">
                  {money(est.low)}<span className="text-white/50">–</span>{money(est.high)}
                </p>
                <ul className="mt-4 space-y-1.5 text-sm text-white/85">
                  {est.lines.map((l) => (
                    <li key={l.slug} className="flex justify-between gap-3 border-b border-white/10 pb-1.5">
                      <span>{l.label}</span>
                      <span className="tabular-nums">{money(l.low)}–{money(l.high)} <span className="text-white/55">{l.unit}</span></span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-3 text-white/80">Pick at least one service to see a range.</p>
            )}
            <p className="mt-4 text-sm text-white/70">
              {PRICING.placeholder && !book ? (
                <span className="pending !text-white">Sample ranges. Owner pricing is coming soon.</span>
              ) : null}{" "}
              Final price after a quick look at your yard. No surprises.
            </p>
            <button
              type="button"
              disabled={!est.lines.length}
              onClick={() => { setLocked(true); track("estimator_lock", { services: services.join(","), size }); }}
              className="cyc-btn cyc-btn--lime mt-5 w-full disabled:opacity-50"
            >
              Lock in this quote
            </button>
          </>
        ) : (
          <QuickQuote
            source="estimator"
            services={services}
            estimate={{ low: est.low, high: est.high, size, frequency: hasRecurring ? freq : "once" }}
            heading="Lock it in"
            sub={`${est.lines.map((l) => l.label).join(" + ")} · ${PRICING.sizeLabel[size]}`}
            submitLabel="Send my quote request"
            autoFocus
          />
        )}
      </div>
    </div>
  );
}
