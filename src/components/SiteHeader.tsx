import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { BRAND, SITE, TEL, seasonFor } from "@/lib/site";
import { PhonePill } from "./brand/CycUI";
import { NAV } from "@/lib/nav";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  const season = seasonFor();
  return (
    <header className="sticky top-0 z-50 [--header-h:116px]">
      <Link
        href="/quote"
        className="block truncate bg-forest-950 px-4 py-3 text-center text-sm font-semibold text-cream-50 hover:text-lime-300"
      >
        {season.bar} <span className="text-lime-500" aria-hidden>→</span>
      </Link>
      <div className="border-b border-[var(--border)] bg-[var(--bg)]/92 backdrop-blur-md">
        <div className="container-x flex h-[72px] items-center justify-between gap-3">
          <Link href="/" className="flex min-h-11 shrink-0 items-center" aria-label={`${SITE.name} — home`}>
            <Image src={`${BRAND}/logo/logo-full-color-tight.svg`} alt="" width={176} height={44} priority className="dark-hide h-8 w-auto sm:h-11" />
            <Image src={`${BRAND}/logo/logo-on-navy-tight.svg`} alt="" width={176} height={44} className="dark-show h-8 w-auto sm:h-11" />
          </Link>
          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="whitespace-nowrap rounded-full px-2.5 py-2 font-head text-[1.05rem] font-bold uppercase tracking-wide text-[var(--heading)] hover:text-royal-600">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={TEL}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-navy-950 px-3.5 font-head text-lg font-extrabold tracking-wide text-white shadow-[var(--glow-electric)] md:hidden"
            >
              <Phone size={16} aria-hidden /> {SITE.phone}
            </a>
            <div className="hidden md:block"><PhonePill /></div>
            <ThemeToggle className="hidden shrink-0 xl:grid" />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
