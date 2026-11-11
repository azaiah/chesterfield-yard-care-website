"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, Compass, DollarSign, FileText, Home, Inbox, Radar, Settings as Gear, X } from "lucide-react";
import { applyAll, type Op, type PortalConfig, type PortalState } from "@/lib/portal/types";
import { BRAND } from "@/lib/site";
import { ThemeToggle } from "../ThemeToggle";
import { Ctx, type Nav, type PortalCtx, type Tab } from "./context";
import { DEMO_CONFIG, demoState, TOUR } from "./demo";
import { Jobs } from "./Jobs";
import { Leads } from "./Leads";
import { Prices, Settings, SweepView } from "./Panels";
import { Quotes } from "./Quotes";
import { Today } from "./Today";
import { Tour } from "./Tour";

const TABS: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "today", label: "Today", icon: Home },
  { id: "leads", label: "Leads", icon: Inbox },
  { id: "quotes", label: "Quotes", icon: FileText },
  { id: "jobs", label: "Jobs", icon: CalendarDays },
  { id: "sweep", label: "Sweep", icon: Radar },
  { id: "prices", label: "Prices", icon: DollarSign },
  { id: "settings", label: "Settings", icon: Gear },
];
const isTab = (t: string | null): t is Tab => !!t && TABS.some((x) => x.id === t);

export function PortalApp({ mode, initial, config, startNav }: { mode: "live" | "demo"; initial?: PortalState; config?: PortalConfig; startNav?: Partial<Nav> }) {
  const [state, setState] = useState<PortalState>(() => initial ?? demoState());
  const stateRef = useRef(state);
  const commit = useCallback((next: PortalState) => { stateRef.current = next; setState(next); }, []);
  const [nav, setNav] = useState<Nav>({ tab: isTab(startNav?.tab ?? null) ? startNav!.tab! : "today", lead: startNav?.lead, quote: startNav?.quote, job: startNav?.job });
  const [msg, setMsg] = useState<string | null>(null);
  const [tourStep, setTourStep] = useState<number | null>(mode === "demo" ? -1 : null);
  const mainRef = useRef<HTMLElement>(null);

  const toast = useCallback((m: string) => { setMsg(m); setTimeout(() => setMsg((cur) => (cur === m ? null : cur)), 3500); }, []);

  const go = useCallback((n: Nav) => {
    setNav((cur) => (cur.tab === n.tab && cur.lead === n.lead && cur.quote === n.quote && cur.job === n.job ? cur : n));
  }, []);

  // Keep the URL in sync so refresh/back work and links can deep-link (e.g. the Monday email → ?tab=sweep).
  const firstSync = useRef(true);
  useEffect(() => {
    if (firstSync.current) { firstSync.current = false; return; }
    const p = new URLSearchParams();
    if (nav.tab !== "today") p.set("tab", nav.tab);
    if (nav.lead) p.set("lead", nav.lead);
    if (nav.quote) p.set("quote", nav.quote);
    if (nav.job) p.set("job", nav.job);
    const qs = p.toString();
    const url = `${location.pathname}${qs ? `?${qs}` : ""}`;
    if (url !== `${location.pathname}${location.search}`) history.pushState(null, "", url);
    if (tourStep == null) mainRef.current?.focus({ preventScroll: true });
    if (tourStep == null) window.scrollTo({ top: 0 });
  }, [nav, tourStep]);
  // Static demo page: read deep links (?tab=…&lead=…) on the client.
  useEffect(() => {
    if (startNav) return;
    const p = new URLSearchParams(location.search);
    const t = p.get("tab");
    if (isTab(t)) setNav({ tab: t, lead: p.get("lead"), quote: p.get("quote"), job: p.get("job") });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);
  useEffect(() => {
    const onPop = () => {
      const p = new URLSearchParams(location.search);
      const t = p.get("tab");
      setNav({ tab: isTab(t) ? t : "today", lead: p.get("lead"), quote: p.get("quote"), job: p.get("job") });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const dispatch = useCallback(async (op: Op) => {
    const before = stateRef.current;
    commit(applyAll(before, op));
    if (mode === "demo") return true;
    try {
      const r = await fetch("/api/portal/mutate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(op) });
      if (r.status === 401) { location.href = "/portal/login"; return false; }
      const j = await r.json();
      if (!j.ok) throw new Error(j.error);
      return true;
    } catch (e) {
      commit(before);
      toast((e as Error).message || "Couldn't save. Check your connection.");
      return false;
    }
  }, [mode, toast, commit]);

  const upload = useCallback(async (file: File) => {
    if (mode === "demo") return { key: URL.createObjectURL(file) };
    const fd = new FormData();
    fd.set("file", file);
    try {
      const r = await fetch("/api/portal/photos", { method: "POST", body: fd });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error);
      return { key: j.key as string, width: j.width as number, height: j.height as number };
    } catch (e) {
      toast((e as Error).message || "Upload failed");
      return null;
    }
  }, [mode, toast]);

  const photoSrc = useCallback((key: string) => (mode === "demo" || key.startsWith("/") || key.startsWith("blob:") ? key : `/api/portal/photos?key=${encodeURIComponent(key)}`), [mode]);

  // Live: refresh data when the app comes back to the foreground (new leads arrive while the phone is in a pocket).
  useEffect(() => {
    if (mode !== "live") return;
    const refresh = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const r = await fetch("/api/portal/data", { cache: "no-store" });
        if (r.ok) { const j = await r.json(); if (j.ok) commit(j.state); }
      } catch {}
    };
    document.addEventListener("visibilitychange", refresh);
    const id = setInterval(refresh, 60_000);
    return () => { document.removeEventListener("visibilitychange", refresh); clearInterval(id); };
  }, [mode, commit]);

  const signOut = async () => { await fetch("/api/portal/session", { method: "DELETE" }); location.href = "/portal/login"; };

  const ctx: PortalCtx = useMemo(
    () => ({ mode, state, config: config ?? DEMO_CONFIG, dispatch, upload, photoSrc, nav, go, toast }),
    [mode, state, config, dispatch, upload, photoSrc, nav, go, toast],
  );
  const newCount = state.leads.filter((l) => l.status === "new").length;

  return (
    <Ctx.Provider value={ctx}>
      <div className="min-h-svh bg-[var(--bg)] text-[var(--fg)]">
        <div className="sticky top-0 z-50">
        {mode === "demo" && (
          <div className="flex flex-wrap items-center justify-center gap-x-4 bg-sun-400 px-4 py-0.5 text-center text-sm font-semibold text-forest-950">
            <span>Demo portal · sample customers · nothing is sent or saved</span>
            <button className="inline-flex min-h-10 items-center gap-1 underline" onClick={() => setTourStep(-1)}><Compass size={14} aria-hidden /> Guides</button>
            <Link className="inline-flex min-h-10 items-center underline" href="/">Back to website</Link>
          </div>
        )}
        <header className="border-b border-[var(--border)] bg-[var(--bg)]/92 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
            <Image src={`${BRAND}/logo/logo-badge.svg`} alt="" width={36} height={36} />
            <p className="font-head text-xl font-extrabold uppercase tracking-wide text-[var(--heading)]">Owner portal</p>
            <div className="ml-auto flex items-center gap-2"><ThemeToggle /></div>
          </div>
        </header>
        </div>

        <div className="mx-auto flex max-w-7xl">
          <nav aria-label="Portal" className="sticky top-28 hidden h-[calc(100svh-7rem)] w-56 shrink-0 flex-col gap-1 p-4 lg:flex">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => go({ tab: t.id })}
                aria-current={nav.tab === t.id ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 font-semibold transition ${nav.tab === t.id ? "bg-lime-500 text-forest-950" : "text-[var(--heading)] hover:bg-[var(--surface)]"}`}
              >
                <t.icon size={18} aria-hidden /> {t.label}
                {t.id === "leads" && newCount > 0 && <span className="ml-auto rounded-full bg-sun-400 px-2 text-xs font-bold text-forest-950">{newCount}</span>}
              </button>
            ))}
          </nav>
          <main ref={mainRef} tabIndex={-1} className="min-w-0 flex-1 px-4 pb-32 pt-6 outline-none lg:px-8 lg:pb-12">
            {nav.tab === "today" && <Today />}
            {nav.tab === "leads" && <Leads />}
            {nav.tab === "quotes" && <Quotes />}
            {nav.tab === "jobs" && <Jobs />}
            {nav.tab === "sweep" && <SweepView />}
            {nav.tab === "prices" && <Prices />}
            {nav.tab === "settings" && <Settings onSignOut={signOut} />}
          </main>
        </div>

        <nav aria-label="Portal" className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[var(--surface)] pb-[env(safe-area-inset-bottom)] lg:hidden">
          <ul className="grid grid-cols-7">
            {TABS.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => go({ tab: t.id })}
                  aria-current={nav.tab === t.id ? "page" : undefined}
                  className={`relative flex min-h-16 w-full flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${nav.tab === t.id ? "text-royal-600" : "text-[var(--muted)]"}`}
                >
                  <t.icon size={20} aria-hidden />
                  {t.label}
                  {t.id === "leads" && newCount > 0 && <span className="absolute right-2 top-2 h-4 min-w-4 rounded-full bg-sun-400 px-1 text-[11px] font-bold leading-4 text-forest-950">{newCount}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {msg && (
          <div role="status" className="fixed inset-x-4 bottom-24 z-[95] mx-auto flex max-w-sm items-center gap-3 rounded-2xl bg-forest-950 px-4 py-3 text-sm font-semibold text-white shadow-xl lg:bottom-6">
            {msg}
            <button className="ml-auto" onClick={() => setMsg(null)} aria-label="Dismiss"><X size={16} aria-hidden /></button>
          </div>
        )}
        {tourStep != null && <Tour steps={TOUR} step={tourStep} setStep={setTourStep} go={go} onClose={() => setTourStep(null)} />}
      </div>
    </Ctx.Provider>
  );
}
