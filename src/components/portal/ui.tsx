"use client";
import type { ReactNode } from "react";
import { SERVICES } from "@/lib/site";
import type { JobStatus, LeadStatus, QuoteStatus } from "@/lib/portal/types";

export const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
export const serviceLabel = (slug: string) => SERVICES.find((s) => s.slug === slug)?.label ?? slug;

export function timeAgo(iso: string, now = Date.now()) {
  const m = Math.round((now - Date.parse(iso)) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return d < 7 ? `${d}d ago` : new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const fmtDay = (ymd: string) =>
  new Date(`${ymd}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
export const todayYmd = (offsetDays = 0) => {
  const d = new Date(Date.now() + offsetDays * 864e5);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const PILL: Record<string, string> = {
  new: "bg-sun-400 text-forest-950",
  contacted: "bg-sky-300 text-navy-950",
  quote_sent: "bg-electric-500 text-white",
  won: "bg-lime-500 text-forest-950",
  lost: "bg-[var(--border)] text-[var(--muted)]",
  draft: "bg-[var(--border)] text-[var(--heading)]",
  sent: "bg-electric-500 text-white",
  accepted: "bg-lime-500 text-forest-950",
  declined: "bg-[var(--border)] text-[var(--muted)]",
  scheduled: "bg-sky-300 text-navy-950",
  done: "bg-lime-500 text-forest-950",
  canceled: "bg-[var(--border)] text-[var(--muted)]",
};
const LABEL: Record<string, string> = { quote_sent: "Quote sent" };
export function StatusPill({ status }: { status: LeadStatus | QuoteStatus | JobStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${PILL[status] ?? ""}`}>
      {LABEL[status] ?? status.replace("_", " ")}
    </span>
  );
}

export function Card({ children, className = "", ...rest }: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 md:p-5 ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function H({ children, sub, action }: { children: ReactNode; sub?: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="h-display text-4xl md:text-5xl">{children}</h1>
        {sub && <p className="mt-1 text-[var(--muted)]">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export const btn = {
  lime: "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-lime-500 px-4 font-bold text-forest-950 transition hover:bg-lime-300 disabled:opacity-50",
  blue: "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-royal-600 px-4 font-bold text-white transition hover:bg-electric-500 disabled:opacity-50",
  ghost: "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--border)] px-4 font-semibold text-[var(--heading)] transition hover:border-lime-500 disabled:opacity-50",
};
export const input =
  "min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-[var(--fg)] outline-none focus:border-electric-500 focus:ring-2 focus:ring-electric-500/30";

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[var(--border)] p-8 text-center">
      <p className="font-head text-xl font-bold uppercase tracking-wide text-[var(--heading)]">{title}</p>
      {children && <div className="mt-2 text-sm text-[var(--muted)]">{children}</div>}
    </div>
  );
}

export function Stat({ label, value, sub, tour }: { label: string; value: ReactNode; sub?: ReactNode; tour?: string }) {
  return (
    <Card data-tour={tour}>
      <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">{label}</p>
      <p className="mt-1 font-head text-4xl font-extrabold text-[var(--heading)]">{value}</p>
      {sub && <p className="mt-0.5 text-sm text-[var(--muted)]">{sub}</p>}
    </Card>
  );
}
