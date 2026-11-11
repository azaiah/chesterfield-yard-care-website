"use client";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Camera, Loader2, MessageSquareText } from "lucide-react";
import { SERVICES, SITE, SMS } from "@/lib/site";
import { getUtm, track } from "./Tracking";

type Source = "quick_quote" | "quote_page" | "estimator" | "yard_club" | "service_page" | "town_page";
type Props = {
  source?: Source;
  services?: string[];
  plan?: string;
  estimate?: { low: number; high: number; size: string; frequency: string };
  heading?: string;
  sub?: string;
  submitLabel?: string;
  tone?: "dark" | "light";
  autoFocus?: boolean;
};

const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; reset: (id?: string) => void };
  }
}

function useTurnstile(ref: React.RefObject<HTMLDivElement | null>) {
  const [token, setToken] = useState<string>();
  useEffect(() => {
    if (!TURNSTILE_KEY || !ref.current) return;
    const el = ref.current;
    const render = () => window.turnstile?.render(el, { sitekey: TURNSTILE_KEY, size: "flexible", callback: setToken, "expired-callback": () => setToken(undefined) });
    if (window.turnstile) { render(); return; }
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = render;
    document.head.appendChild(s);
  }, [ref]);
  return token;
}

export function QuickQuote({
  source = "quick_quote", services, plan, estimate, heading = "Get your free quote",
  sub = "Three quick fields. We'll text or call you back fast.", submitLabel = "Get my free quote", tone = "dark", autoFocus,
}: Props) {
  const id = useId();
  const router = useRouter();
  const tsRef = useRef<HTMLDivElement>(null);
  const turnstileToken = useTurnstile(tsRef);
  const [step, setStep] = useState<1 | 2>(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ field?: string; msg: string } | null>(null);
  const [lead, setLead] = useState<{ id: string; token: string; first: string } | null>(null);
  const [photoCount, setPhotoCount] = useState(0);

  const dark = tone === "dark";
  const input = `h-14 w-full rounded-2xl border px-4 text-base outline-none transition focus:border-electric-500 focus:ring-2 focus:ring-electric-500/40 ${
    dark ? "border-white/25 bg-white/[.07] text-white placeholder:text-white/55" : "border-forest-950/20 bg-white text-forest-950 placeholder:text-forest-950/50"
  }`;
  const label = `mb-1.5 block text-sm font-semibold ${dark ? "text-white/90" : "text-forest-950"}`;
  const muted = dark ? "text-white/75" : "text-forest-950/70";
  const errCls = dark ? "text-sun-400" : "text-red-700";

  async function submit1(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setError(null);
    const f = new FormData(e.currentTarget);
    if (TURNSTILE_KEY && !turnstileToken) { setError({ msg: "Please complete the quick check below." }); return; }
    setBusy(true);
    try {
      const r = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"), phone: f.get("phone"), address: f.get("address"), website: f.get("website") ?? "",
          source, services, plan, estimate, page: location.pathname, utm: getUtm(), turnstileToken,
        }),
      });
      const j = await r.json();
      if (!j.ok) { setError({ field: j.field, msg: j.error ?? "Something went wrong." }); return; }
      track("generate_lead", { source, services: services?.join(",") });
      setLead({ id: j.id, token: j.token, first: String(f.get("name")).trim().split(" ")[0] });
      setStep(2);
    } catch {
      setError({ msg: `Couldn't send — please call or text ${SITE.phone}.` });
    } finally {
      setBusy(false);
    }
  }

  async function submit2(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!lead || busy) return;
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    f.set("token", lead.token);
    try {
      const r = await fetch(`/api/leads/${lead.id}`, { method: "POST", body: f });
      const j = await r.json();
      if (!j.ok) { setError({ field: j.field, msg: j.error ?? "Something went wrong." }); return; }
      track("lead_details", { photos: photoCount });
      router.push(`/quote/thanks?n=${encodeURIComponent(lead.first)}`);
    } catch {
      setError({ msg: "Couldn't upload — you can text your photos instead." });
    } finally {
      setBusy(false);
    }
  }

  const err = (field: string) =>
    error?.field === field ? <p id={`${id}-${field}-err`} className={`mt-1 text-sm font-semibold ${errCls}`}>{error.msg}</p> : null;

  if (step === 2 && lead) {
    return (
      <form onSubmit={submit2} className="space-y-5" aria-labelledby={`${id}-s2`} encType="multipart/form-data">
        <div aria-live="polite">
          <p className="eyebrow !text-lime-300">Step 2 of 2 · optional</p>
          <h2 id={`${id}-s2`} className={`h-display mt-1 text-3xl ${dark ? "!text-white" : ""}`}>
            Got it, {lead.first}! <span className="accent text-lime-300">Want it faster?</span>
          </h2>
          <p className={`mt-1 text-sm ${muted}`}>Your request is in. Add a few details or photos and we can price it right away.</p>
        </div>

        <fieldset>
          <legend className={label}>What do you need?</legend>
          <div className="grid grid-cols-2 gap-2">
            {SERVICES.map((s) => (
              <label key={s.slug} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm ${dark ? "border-white/20 text-white has-[:checked]:border-lime-500 has-[:checked]:bg-lime-500/15" : "border-forest-950/15 has-[:checked]:border-lime-500 has-[:checked]:bg-lime-500/15"}`}>
                <input type="checkbox" name="services" value={s.slug} defaultChecked={services?.includes(s.slug)} className="h-4 w-4 accent-lime-500" />
                {s.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor={`${id}-photos`} className={label}>Photos of your yard</label>
          <label htmlFor={`${id}-photos`} className={`flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-3 text-sm font-semibold ${dark ? "border-white/30 text-white" : "border-forest-950/25"}`}>
            <Camera size={18} aria-hidden /> {photoCount ? `${photoCount} photo${photoCount > 1 ? "s" : ""} ready` : "Add up to 6 photos"}
          </label>
          <input id={`${id}-photos`} name="photos" type="file" accept="image/*" multiple className="sr-only" onChange={(e) => setPhotoCount(Math.min(6, e.target.files?.length ?? 0))} aria-describedby={`${id}-photos-err`} />
          {err("photos")}
        </div>

        <fieldset>
          <legend className={label}>When do you need it?</legend>
          <div className="flex flex-wrap gap-2">
            {[["asap", "ASAP"], ["this_week", "This week"], ["this_month", "This month"], ["flexible", "Flexible"]].map(([v, l]) => (
              <label key={v} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm ${dark ? "border-white/20 text-white has-[:checked]:border-lime-500" : "border-forest-950/15 has-[:checked]:border-lime-500"}`}>
                <input type="radio" name="timing" value={v} className="accent-lime-500" /> {l}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={label}>Best way to reach you</legend>
          <div className="flex flex-wrap gap-2">
            {[["text", "Text"], ["call", "Call"], ["email", "Email"]].map(([v, l]) => (
              <label key={v} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm ${dark ? "border-white/20 text-white has-[:checked]:border-lime-500" : "border-forest-950/15 has-[:checked]:border-lime-500"}`}>
                <input type="radio" name="contactPref" value={v} defaultChecked={v === "text"} className="accent-lime-500" /> {l}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor={`${id}-email`} className={label}>Email <span className="font-normal opacity-70">(optional)</span></label>
          <input id={`${id}-email`} name="email" type="email" autoComplete="email" className={input} aria-describedby={`${id}-email-err`} />
          {err("email")}
        </div>
        <div>
          <label htmlFor={`${id}-notes`} className={label}>Anything else? <span className="font-normal opacity-70">(gate code, dogs, details)</span></label>
          <textarea id={`${id}-notes`} name="notes" rows={3} maxLength={2000} className={`${input} h-auto py-3`} />
        </div>

        {error && !error.field && <p role="alert" className={`text-sm font-semibold ${errCls}`}>{error.msg}</p>}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={busy} className="cyc-btn cyc-btn--lime flex-1 disabled:opacity-70">
            {busy ? <Loader2 className="animate-spin" aria-hidden /> : null} Send details
          </button>
          <button type="button" onClick={() => router.push(`/quote/thanks?n=${encodeURIComponent(lead.first)}`)} className={`cyc-btn ${dark ? "cyc-btn--ghost" : "border border-forest-950/20 text-forest-950"}`}>
            I&apos;m done
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={submit1} className="space-y-4" noValidate aria-labelledby={`${id}-h`}>
      <div>
        <h2 id={`${id}-h`} className={`h-display text-3xl md:text-4xl ${dark ? "!text-white" : ""}`}>{heading}</h2>
        <p className={`mt-1 text-sm ${muted}`}>{sub}</p>
      </div>
      <div>
        <label htmlFor={`${id}-name`} className={label}>Your name</label>
        <input id={`${id}-name`} name="name" required autoComplete="name" autoFocus={autoFocus} className={input} aria-invalid={error?.field === "name"} aria-describedby={`${id}-name-err`} />
        {err("name")}
      </div>
      <div>
        <label htmlFor={`${id}-phone`} className={label}>Mobile phone</label>
        <input id={`${id}-phone`} name="phone" type="tel" inputMode="tel" required autoComplete="tel" className={input} aria-invalid={error?.field === "phone"} aria-describedby={`${id}-phone-err`} />
        {err("phone")}
      </div>
      <div>
        <label htmlFor={`${id}-address`} className={label}>Property address</label>
        <input id={`${id}-address`} name="address" required autoComplete="street-address" className={input} aria-invalid={error?.field === "address"} aria-describedby={`${id}-address-err`} />
        {err("address")}
      </div>
      {/* Honeypot: hidden from people and screen readers */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {TURNSTILE_KEY && <div ref={tsRef} />}
      {error && !error.field && <p role="alert" className={`text-sm font-semibold ${errCls}`}>{error.msg}</p>}
      <button type="submit" disabled={busy} className="cyc-btn cyc-btn--lime w-full disabled:opacity-70">
        {busy ? <Loader2 className="animate-spin" aria-hidden /> : null} {submitLabel}
      </button>
      <p className={`text-center text-sm ${muted}`}>
        Faster:{" "}
        <a href={SMS} className={`inline-flex items-center gap-1 font-semibold underline ${dark ? "text-lime-300" : "text-royal-600"}`}>
          <MessageSquareText size={15} aria-hidden /> text a photo
        </a>{" "}
        to {SITE.phone}
      </p>
    </form>
  );
}
