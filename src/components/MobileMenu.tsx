"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Compass, LayoutDashboard, Menu, MessageSquareText, Phone, X } from "lucide-react";
import { SERVICES, SITE, SMS, TEL } from "@/lib/site";
import { NAV } from "@/lib/nav";
import { ThemeToggle } from "./ThemeToggle";

/**
 * The panel is portaled to <body>: the header uses backdrop-filter, which would otherwise become the
 * containing block for this fixed panel and clip it to the 72px header bar.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [top, setTop] = useState(116);
  const [mounted, setMounted] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const path = usePathname();

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (open) {
      const h = btn.current?.closest("header");
      if (h) setTop(Math.round(h.getBoundingClientRect().bottom));
    }
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.documentElement.style.overflow = ""; };
  }, [open]);

  const panel = (
    <div
      id="mobile-menu"
      className="band-dark fixed inset-x-0 bottom-0 z-[60] overflow-y-auto px-4 pb-32 pt-6"
      style={{ top }}
    >
      <nav aria-label="Mobile">
        <ul className="space-y-1">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="block rounded-xl px-3 py-3 font-head text-3xl font-extrabold uppercase tracking-wide hover:bg-white/5 hover:text-lime-300">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid gap-2 px-3 sm:grid-cols-2">
          <Link href="/portal" className="flex min-h-14 items-center gap-3 rounded-2xl border border-lime-500/60 bg-lime-500/10 px-4 font-head text-xl font-extrabold uppercase tracking-wide text-white hover:bg-lime-500/20">
            <LayoutDashboard size={22} className="text-lime-300" aria-hidden /> Owner portal
          </Link>
          <Link href="/portal/demo" className="flex min-h-14 items-center gap-3 rounded-2xl border border-[var(--border)] px-4 font-head text-xl font-extrabold uppercase tracking-wide text-white hover:border-lime-500">
            <Compass size={22} className="text-sky-300" aria-hidden /> Try the demo
          </Link>
        </div>

        <p className="eyebrow mt-8 px-3">Services</p>
        <ul className="mt-2 grid grid-cols-2 gap-1">
          {SERVICES.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="block rounded-lg px-3 py-2.5 text-[var(--muted)] hover:text-lime-300">{s.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-8 grid gap-3 px-3">
        <a href={TEL} className="cyc-btn cyc-btn--ghost"><Phone aria-hidden /> Call {SITE.phone}</a>
        <a href={SMS} className="cyc-btn cyc-btn--electric"><MessageSquareText aria-hidden /> Text a photo</a>
        <div className="flex items-center gap-3 pt-2 text-sm text-[var(--muted)]"><ThemeToggle /> Light / dark</div>
      </div>
    </div>
  );

  return (
    <div className="xl:hidden">
      <button
        ref={btn}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="grid h-11 w-11 place-items-center rounded-full border border-[var(--border)] text-[var(--heading)]"
      >
        {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
      </button>
      {open && mounted && createPortal(panel, document.body)}
    </div>
  );
}
