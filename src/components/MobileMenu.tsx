"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, MessageSquareText, Phone, X } from "lucide-react";
import { SERVICES, SITE, SMS, TEL } from "@/lib/site";
import { NAV } from "@/lib/nav";
import { ThemeToggle } from "./ThemeToggle";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="grid h-11 w-11 place-items-center rounded-full border border-[var(--border)] text-[var(--heading)]"
      >
        {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
      </button>
      {open && (
        <div id="mobile-menu" className="band-dark fixed inset-x-0 bottom-0 top-[var(--header-h,112px)] z-50 overflow-y-auto px-4 pb-32 pt-6">
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
      )}
    </div>
  );
}
