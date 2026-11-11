"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Compass, X } from "lucide-react";
import type { Nav } from "./context";

export type TourStep = { chapter: string; nav: Nav; target?: string; title: string; body: string };

/**
 * Guided demo: dims the page, rings the element marked data-tour="…", and shows a guide card.
 * Step -1 is the welcome card with one guide card per chapter.
 */
export function Tour({ steps, step, setStep, go, onClose }: {
  steps: TourStep[]; step: number; setStep: (n: number) => void; go: (n: Nav) => void; onClose: () => void;
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const s = step >= 0 ? steps[step] : null;

  useEffect(() => { if (s) go(s.nav); }, [s, go]);

  const measure = useCallback(() => {
    if (!s?.target) { setRect(null); return; }
    const el = document.querySelector(`[data-tour="${s.target}"]`);
    setRect(el ? el.getBoundingClientRect() : null);
  }, [s]);

  // Scroll the target into view once it renders, then keep the ring glued to it.
  useLayoutEffect(() => {
    if (!s?.target) { setRect(null); return; }
    let tries = 0;
    const find = () => {
      const el = document.querySelector(`[data-tour="${s.target}"]`);
      if (el) { el.scrollIntoView({ block: "start", behavior: "smooth" }); setTimeout(measure, 350); }
      else if (tries++ < 20) setTimeout(find, 50);
    };
    find();
    const id = setInterval(measure, 250);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => { clearInterval(id); window.removeEventListener("resize", measure); window.removeEventListener("scroll", measure, true); };
  }, [s, measure]);

  useEffect(() => { cardRef.current?.focus(); }, [step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (step < 0) return;
      if (e.key === "ArrowRight") setStep(Math.min(step + 1, steps.length - 1));
      if (e.key === "ArrowLeft") setStep(Math.max(step - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, steps.length, setStep, onClose]);

  const chapters = [...new Set(steps.map((x) => x.chapter))];

  if (step < 0) {
    return (
      <div className="fixed inset-0 z-[80] grid place-items-center bg-navy-950/70 p-4 backdrop-blur-sm">
        <div ref={cardRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="tour-welcome" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-[var(--surface)] p-6 shadow-2xl outline-none md:p-8">
          <p className="eyebrow">Demo portal</p>
          <h2 id="tour-welcome" className="h-display mt-1 text-4xl md:text-5xl">Run the business <span className="accent">from your phone.</span></h2>
          <p className="mt-3 text-[var(--muted)]">
            This is the owner&apos;s side of the website, loaded with sample customers. Click anything. Nothing here is real and nothing is sent or saved.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {chapters.map((c, i) => {
              const first = steps.findIndex((x) => x.chapter === c);
              return (
                <li key={c}>
                  <button
                    onClick={() => setStep(first)}
                    className="flex h-full w-full flex-col items-start rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 text-left transition hover:-translate-y-0.5 hover:border-lime-500"
                  >
                    <span className="font-head text-sm font-bold uppercase tracking-wider text-[var(--muted)]">Guide {i + 1}</span>
                    <span className="mt-0.5 font-head text-xl font-extrabold uppercase text-[var(--heading)]">{c}</span>
                    <span className="mt-1 text-sm text-[var(--muted)]">{steps[first].title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="inline-flex min-h-12 items-center gap-2 rounded-full bg-lime-500 px-5 font-bold text-forest-950 hover:bg-lime-300" onClick={() => setStep(0)}>
              <Compass size={18} aria-hidden /> Take the 2-minute tour
            </button>
            <button className="min-h-12 rounded-full border border-[var(--border)] px-5 font-semibold" onClick={onClose}>Explore on my own</button>
          </div>
        </div>
      </div>
    );
  }

  if (!s) return null;
  const pad = 8;
  // Put the card on the opposite half of the screen from the highlighted item.
  const cardOnTop = !!rect && typeof window !== "undefined" && rect.top > window.innerHeight / 2;
  const chapterIdx = chapters.indexOf(s.chapter);
  return (
    <>
      {rect ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-[70] rounded-2xl ring-4 ring-lime-500 transition-all duration-300"
          style={{ top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2, boxShadow: "0 0 0 9999px rgba(7,20,43,.55)" }}
        />
      ) : (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] bg-navy-950/55" />
      )}
      <div
        ref={cardRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="false"
        aria-labelledby="tour-title"
        aria-live="polite"
        className={`fixed inset-x-3 z-[90] mx-auto max-w-md rounded-3xl border border-lime-500/60 bg-navy-950 p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,.5)] outline-none lg:inset-x-auto lg:right-6 ${cardOnTop ? "top-3 lg:top-24" : "bottom-24 lg:bottom-6"}`}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="eyebrow !text-lime-300">Guide {chapterIdx + 1} · {s.chapter}</p>
          <button onClick={onClose} aria-label="Close tour" className="-mr-2 -mt-2 grid h-10 w-10 place-items-center rounded-full text-white/70 hover:text-white"><X size={18} aria-hidden /></button>
        </div>
        <h2 id="tour-title" className="mt-1 font-head text-2xl font-extrabold uppercase leading-tight">{s.title}</h2>
        <p className="mt-2 text-white/85">{s.body}</p>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex flex-1 gap-1" aria-label={`Step ${step + 1} of ${steps.length}`}>
            {steps.map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-lime-500" : "bg-white/20"}`} />)}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button onClick={() => (step === 0 ? setStep(-1) : setStep(step - 1))} className="inline-flex min-h-11 items-center gap-1 rounded-full border border-white/25 px-4 text-sm font-semibold">
            <ArrowLeft size={16} aria-hidden /> {step === 0 ? "Guides" : "Back"}
          </button>
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(step + 1)} className="ml-auto inline-flex min-h-11 items-center gap-1 rounded-full bg-lime-500 px-5 text-sm font-bold text-forest-950">
              Next <ArrowRight size={16} aria-hidden />
            </button>
          ) : (
            <button onClick={onClose} className="ml-auto inline-flex min-h-11 items-center rounded-full bg-lime-500 px-5 text-sm font-bold text-forest-950">Explore on my own</button>
          )}
        </div>
      </div>
    </>
  );
}
