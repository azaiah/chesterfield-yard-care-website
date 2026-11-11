import Image from "next/image";
import Link from "next/link";
import { BRAND, SERVICES, SITE, SMS, TEL, TOWNS } from "@/lib/site";
import { Pending } from "./brand/CycUI";

export function SiteFooter() {
  return (
    <footer className="band-dark cyc-topo pb-28 pt-14 md:pb-10">
      <div className="container-x grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div className="space-y-4">
          <Image src={`${BRAND}/logo/logo-on-navy-tight.svg`} alt={SITE.name} width={240} height={60} className="h-14 w-auto" />
          <p className="max-w-sm text-[var(--muted)]">{SITE.tagline}</p>
          <p className="font-head text-3xl font-extrabold tracking-wide">
            <a href={TEL} className="text-white hover:text-lime-300">{SITE.phone}</a>
          </p>
          <p className="text-sm text-[var(--muted)]">
            Call or <a className="underline hover:text-lime-300" href={SMS}>text</a> · {SITE.region}
          </p>
          <p className="text-sm text-[var(--muted)]">
            Hours: {SITE.hours ?? <Pending>hours — confirm with owner</Pending>}
          </p>
        </div>
        <nav aria-label="Services">
          <h2 className="eyebrow mb-3">Services</h2>
          <ul className="space-y-1.5 text-[var(--muted)]">
            {SERVICES.map((s) => (
              <li key={s.slug}><Link className="hover:text-lime-300" href={`/services/${s.slug}`}>{s.label}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Service area">
          <h2 className="eyebrow mb-3">Service area</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-[var(--muted)]">
            {TOWNS.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </nav>
      </div>
      <div className="container-x mt-12 flex flex-col gap-4 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {SITE.name} · <Link className="hover:text-lime-300" href="/credits">Photo credits</Link></p>
        {/* TODO(Phase 2): swap in the official DataIsData silver double-ring lockup file once provided. Never retype the wordmark. */}
        <p className="inline-flex items-center gap-2">
          Powered by <Pending note="Official DataIsData lockup file not yet provided">DataIsData lockup</Pending>
        </p>
      </div>
    </footer>
  );
}
