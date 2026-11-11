import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { BRAND, SITE, TEL, seasonFor } from "@/lib/site";
import { PhonePill } from "./brand/CycUI";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  const season = seasonFor();
  return (
    <header className="sticky top-0 z-50">
      <Link
        href="/quote"
        className="block bg-forest-950 px-4 py-2 text-center text-sm font-semibold text-cream-50 hover:text-lime-300"
      >
        {season.bar} <span className="text-lime-500">→</span>
      </Link>
      <div className="border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md">
        <div className="container-x flex h-[72px] items-center justify-between gap-3">
          <Link href="/" className="shrink-0" aria-label={`${SITE.name} — home`}>
            {/* Light logo in light mode, navy-friendly logo in dark mode */}
            <Image src={`${BRAND}/logo/logo-full-color-tight.svg`} alt="" width={180} height={45} priority className="h-11 w-auto dark-hide" />
            <Image src={`${BRAND}/logo/logo-on-navy-tight.svg`} alt="" width={180} height={45} className="h-11 w-auto dark-show" />
          </Link>
          <div className="flex items-center gap-2">
            {/* Mobile: big tappable number (sticky action bar handles text/quote) */}
            <a
              href={TEL}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-navy-950 px-4 font-head text-lg font-extrabold tracking-wide text-white shadow-[var(--glow-electric)] md:hidden"
            >
              <Phone size={16} aria-hidden /> {SITE.phone}
            </a>
            <div className="hidden md:block"><PhonePill /></div>
            <ThemeToggle className="hidden sm:grid" />
          </div>
        </div>
      </div>
    </header>
  );
}
