// Chesterfield Yard Care — React components for the custom asset kit (adapted from asset-kit/components/CycUI.tsx).
// Styles live in src/app/cyc-ui.css; assets in /public/media/brand.
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { MessageSquareText, Phone } from "lucide-react";
import { BRAND as B, SERVICES, SITE, SMS, TEL, type Service } from "@/lib/site";
import { HeroVideo } from "./HeroVideo";

export { SERVICES, SMS, TEL };
export const PHONE = SITE.phone;

type BtnProps = { href: string; children: ReactNode; icon?: ReactNode; className?: string };

function SmartLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  return href.startsWith("/") ? (
    <Link className={className} href={href}>{children}</Link>
  ) : (
    <a className={className} href={href}>{children}</a>
  );
}

export function LimeButton({ href, children, icon, className = "" }: BtnProps) {
  return <SmartLink className={`cyc-btn cyc-btn--lime ${className}`} href={href}>{icon}{children}</SmartLink>;
}
export function ElectricButton({ href, children, icon, className = "" }: BtnProps) {
  return <SmartLink className={`cyc-btn cyc-btn--electric ${className}`} href={href}>{icon}{children}</SmartLink>;
}
export function GhostButton({ href, children, icon, className = "" }: BtnProps) {
  return <SmartLink className={`cyc-btn cyc-btn--ghost ${className}`} href={href}>{icon}{children}</SmartLink>;
}

export function PhonePill({ compact = false }: { compact?: boolean }) {
  return (
    <div className="cyc-phone" role="group" aria-label="Call or text Chesterfield Yard Care">
      <a href={TEL} aria-label={`Call ${SITE.phone}`}>
        <Phone aria-hidden size={18} />
        {compact ? <span className="sr-only sm:not-sr-only">{SITE.phone}</span> : SITE.phone}
      </a>
      <a href={SMS} aria-label={`Text ${SITE.phone}`}>
        <MessageSquareText aria-hidden size={18} /> Text
      </a>
    </div>
  );
}

export function ServiceBadges() {
  return (
    <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-5 p-0">
      {SERVICES.map((s) => (
        <li key={s.slug}>
          <Link className="cyc-badge" href={`/services/${s.slug}`}>
            <Image src={`${B}/badges/${s.badge}.webp`} alt="" width={112} height={112} />
            <span>{s.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function FeatureCard({ s, priceFrom }: { s: Service; priceFrom?: string }) {
  return (
    <Link className="cyc-feature" href={`/services/${s.slug}`}>
      <Image className="bg" src={`${B}/images/${s.photo}-1600.webp`} alt="" fill sizes="(max-width:768px) 100vw, 33vw" />
      <span className="spot" aria-hidden="true" />
      <Image className="icon" src={`${B}/badges/${s.badge}.webp`} alt="" width={64} height={64} />
      <div className="body">
        <h3>{s.label}</h3>
        <p>{s.blurb}</p>
        <span className="cta">{priceFrom ? `From ${priceFrom} · ` : ""}Get a quote →</span>
      </div>
    </Link>
  );
}

const STEPS = [
  { img: "illo-text-photo", title: "Text a photo or call", body: `Snap your yard and send it to ${SITE.phone}, or fill out three fields.` },
  { img: "illo-quote", title: "Get a free quote fast", body: "Clear price, no surprises, no pressure." },
  { img: "illo-done", title: "We handle the rest", body: "Local crew shows up, does it right, cleans up after." },
];
export function HowItWorks() {
  return (
    <ol className="grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5 p-0">
      {STEPS.map((s, i) => (
        <li key={s.img} className="cyc-step">
          <Image src={`${B}/illustrations/${s.img}.webp`} alt="" width={120} height={120} />
          <span className="n">Step 0{i + 1}</span>
          <h3>{s.title}</h3>
          <p className="text-forest-950/80">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

/** Hero background: poster image is the LCP element; the video attaches after load, never on reduced motion / save-data. */
export function HeroMedia() {
  return (
    <>
      <Image
        src={`${B}/images/hero-2400.webp`}
        alt="Freshly striped lawn and mulch beds in front of a brick home"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover"
      />
      <HeroVideo
        poster={`${B}/video/hero-loop-poster.jpg`}
        sources={[
          { src: `${B}/video/hero-loop-mobile.mp4`, type: "video/mp4", media: "(max-width: 700px)" },
          { src: `${B}/video/hero-loop.webm`, type: "video/webm" },
          { src: `${B}/video/hero-loop.mp4`, type: "video/mp4" },
        ]}
      />
    </>
  );
}

export function MobileActionBar() {
  return (
    <nav className="cyc-actionbar" aria-label="Quick contact">
      <a href={TEL}><Phone aria-hidden size={18} />Call</a>
      <a href={SMS}><MessageSquareText aria-hidden size={18} />Text a photo</a>
      <Link href="/quote">Free quote</Link>
    </nav>
  );
}

export function FallingLeaves({ count = 10 }: { count?: number }) {
  return (
    <div className="cyc-leaves" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <i key={i} style={{ left: `${(i * 97) % 100}%`, animationDuration: `${9 + (i % 5) * 2.3}s`, animationDelay: `${-i * 1.7}s` }} />
      ))}
    </div>
  );
}

/** Wrap any unverified fact. Renders a visible "confirm with owner" marker. */
export function Pending({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <span className="pending" title={note ?? "Placeholder — confirm with owner before launch"}>
      {children}
    </span>
  );
}
