import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { MessageSquareText, Phone } from "lucide-react";
import {
  ElectricButton, FallingLeaves, FeatureCard, GhostButton, HowItWorks, LimeButton, Pending, PhonePill, ServiceBadges,
} from "@/components/brand/CycUI";
import { LocalPhoto } from "@/components/LocalPhoto";
import { BRAND as B, SERVICES, SITE, SMS, TEL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Style Tile",
  robots: { index: false, follow: false },
};

const COLORS = [
  { token: "forest-950", hex: "#06210F", use: "Darkest text / backgrounds" },
  { token: "forest-800", hex: "#0F3B1C", use: "Primary dark green, headings" },
  { token: "lime-500", hex: "#8DC63F", use: "Signature accent, CTAs, icons" },
  { token: "lime-300", hex: "#B8E06A", use: "Hover / highlight" },
  { token: "royal-600", hex: "#1D4ED8", use: "Primary blue, links" },
  { token: "electric-500", hex: "#2F7BFF", use: "Glows, focus rings, frame" },
  { token: "navy-950", hex: "#07142B", use: "Dark sections" },
  { token: "sky-300", hex: "#8CC8F5", use: "Light sections, gradients" },
  { token: "sun-400", hex: "#F5E21A", use: "1–2 words per screen, max" },
  { token: "mulch-700", hex: "#5B3A1E", use: "Earth accent" },
  { token: "cream-50", hex: "#F7F8F2", use: "Light page background" },
];

function Section({ id, eyebrow, title, accent, children, dark = false }: {
  id: string; eyebrow: string; title: string; accent?: string; children: ReactNode; dark?: boolean;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={dark ? "band-dark py-16 md:py-20" : "py-16 md:py-20"}>
      <div className="container-x">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={`${id}-h`} className="h-display mt-2 text-4xl md:text-6xl">
          {title} {accent && <span className="accent">{accent}</span>}
        </h2>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function Tile({ label, className = "", children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <figure className="space-y-2">
      <div className={`grid min-h-40 place-items-center rounded-[var(--radius-xl)] p-6 ${className}`}>{children}</div>
      <figcaption className="text-sm text-[var(--muted)]">{label}</figcaption>
    </figure>
  );
}

export default function StyleGuide() {
  return (
    <>
      {/* Intro */}
      <section className="relative overflow-hidden cyc-stripes py-20 text-white md:py-28">
        <div className="container-x relative">
          <p className="eyebrow !text-lime-300">Phase 1 · Brand system</p>
          <h1 className="h-display mt-3 max-w-4xl text-6xl !text-white md:text-8xl">
            Style <span className="accent text-lime-300">tile</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/85">
            The flyer&apos;s energy — collegiate block letters, electric-blue frame, lime mower green, navy service panel —
            executed with a clean grid and restrained motion. Toggle dark mode in the header to check both themes.
          </p>
          <nav aria-label="Style tile sections" className="mt-8 flex flex-wrap gap-2">
            {["logo", "color", "type", "buttons", "frame", "badges", "cards", "textures", "imagery", "illustrations", "motion", "local", "honesty"].map((s) => (
              <a key={s} href={`#${s}`} className="pill !border-white/25 !bg-white/10 !text-white hover:!border-lime-500">{s}</a>
            ))}
          </nav>
        </div>
      </section>

      <Section id="logo" eyebrow="01 · Logo" title="The" accent="lockup">
        <div className="grid gap-6 sm:grid-cols-2">
          <Tile label="Full color — light backgrounds" className="bg-cream-50 ring-1 ring-black/5">
            <Image src={`${B}/logo/logo-full-color-tight.svg`} alt="Chesterfield Yard Care logo, full color" width={420} height={105} />
          </Tile>
          <Tile label="On navy — dark sections, portal" className="bg-navy-950 shadow-[var(--glow-electric)]">
            <Image src={`${B}/logo/logo-on-navy-tight.svg`} alt="Chesterfield Yard Care logo on navy" width={420} height={105} />
          </Tile>
          <Tile label="Reversed white — over photos" className="relative overflow-hidden">
            <Image src={`${B}/images/svc-mowing-800.webp`} alt="" fill sizes="50vw" className="object-cover" />
            <div className="absolute inset-0 bg-forest-950/55" />
            <Image src={`${B}/logo/logo-reversed-white-tight.svg`} alt="Chesterfield Yard Care logo, reversed white" width={420} height={105} className="relative" />
          </Tile>
          <Tile label="One color forest — print, stamps" className="bg-white ring-1 ring-black/5">
            <Image src={`${B}/logo/logo-one-color-forest-tight.svg`} alt="Chesterfield Yard Care logo, one color" width={420} height={105} />
          </Tile>
        </div>
        <div className="mt-6 flex flex-wrap items-end gap-6">
          <Image src={`${B}/logo/logo-badge.svg`} alt="CYC badge icon" width={128} height={128} />
          <Image src={`${B}/logo/icon-180.png`} alt="Apple touch icon" width={64} height={64} className="rounded-2xl" />
          <Image src={`${B}/logo/icon-32.png`} alt="Favicon 32px" width={32} height={32} />
          <p className="max-w-xs text-sm text-[var(--muted)]">Badge icon → favicon, apple-touch-icon, PWA icon, before/after handle.</p>
        </div>
      </Section>

      <Section id="color" eyebrow="02 · Color" title="Pulled from" accent="the flyer" dark>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {COLORS.map((c) => (
            <li key={c.token} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <div className="h-24" style={{ background: c.hex }} />
              <div className="p-3 text-sm">
                <p className="font-head text-lg font-bold tracking-wide text-[var(--heading)]">--{c.token}</p>
                <p className="font-mono text-xs text-[var(--muted)]">{c.hex}</p>
                <p className="mt-1 text-[var(--muted)]">{c.use}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-[var(--muted)]">
          Light sections: cream + forest. Dark sections: navy-950 with an electric-blue edge glow and lime CTAs.
          Yellow only for one or two words a screen — like <span className="hl-sun font-semibold">LOCAL</span> and{" "}
          <span className="hl-sun font-semibold">HARD-WORKING</span>.
        </p>
      </Section>

      <Section id="type" eyebrow="03 · Type" title="Four voices," accent="one brand">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-[var(--muted)]">Graduate — wordmark &amp; eyebrows</p>
              <p className="font-collegiate text-4xl text-forest-800 dark-hide md:text-5xl">CHESTERFIELD</p>
              <p className="font-collegiate text-4xl text-lime-300 dark-show md:text-5xl">CHESTERFIELD</p>
              <p className="eyebrow mt-2">Chesterfield &amp; Midlothian, VA</p>
            </div>
            <div>
              <p className="text-sm text-[var(--muted)]">Barlow Condensed 800 — section heads, uppercase</p>
              <p className="h-display text-6xl md:text-7xl">Leaf cleanup</p>
              <p className="h-display text-4xl">Mulch &amp; gravel</p>
              <p className="h-display text-2xl">Junk removal</p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-[var(--muted)]">Instrument Serif italic — 1–3 accent words per headline</p>
              <p className="h-display text-5xl md:text-6xl">
                Yards that look <span className="accent text-royal-600 dark-hide">cared for.</span>
                <span className="accent text-lime-300 dark-show">cared for.</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--muted)]">Inter — body &amp; UI</p>
              <p className="max-w-prose text-lg">
                Fall aeration and overseeding works best for the cool-season fescue lawns common around Richmond. We
                schedule it after the summer heat breaks so new seed has time to root before frost.
              </p>
              <p className="mt-2 max-w-prose text-sm text-[var(--muted)]">Small text, captions and form hints use the muted token.</p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="buttons" eyebrow="04 · Calls to action" title="Every screen" accent="pushes to a call" dark>
        <div className="flex flex-wrap items-center gap-4">
          <LimeButton href="/quote">Get my free quote</LimeButton>
          <ElectricButton href={SMS} icon={<MessageSquareText aria-hidden />}>Text a photo</ElectricButton>
          <GhostButton href={TEL} icon={<Phone aria-hidden />}>Call now</GhostButton>
          <PhonePill />
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] p-5 text-sm">
            <p className="font-head text-lg font-bold uppercase tracking-wide text-[var(--heading)]">Call link</p>
            <code className="break-all text-lime-300">{TEL}</code>
          </div>
          <div className="rounded-2xl border border-[var(--border)] p-5 text-sm">
            <p className="font-head text-lg font-bold uppercase tracking-wide text-[var(--heading)]">Text link (iOS + Android)</p>
            <code className="break-all text-lime-300">{SMS}</code>
          </div>
        </div>
        <p className="mt-6 text-sm text-[var(--muted)]">
          On phones a sticky action bar (Call · Text a photo · Free quote) sits at the bottom of every page — resize the window to see it.
        </p>
      </Section>

      <Section id="frame" eyebrow="05 · Electric frame" title="The flyer's" accent="glow">
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <div className="cyc-frame" aria-label="Quote card preview">
            <p className="eyebrow !text-lime-300">Free quote · 30 seconds</p>
            <p className="h-display mt-2 text-4xl !text-white">Get your price <span className="accent text-lime-300">fast</span></p>
            <div className="mt-6 space-y-3" aria-hidden="true">
              {["Your name", "Mobile phone", "Property address"].map((f) => (
                <div key={f} className="flex h-14 items-center rounded-2xl border border-white/20 bg-white/5 px-4 text-white/60">{f}</div>
              ))}
            </div>
            <div className="mt-5"><LimeButton href="/quote" className="w-full">Get my free quote</LimeButton></div>
            <p className="mt-3 text-center text-sm text-white/70">
              Or <a className="text-lime-300 underline" href={SMS}>text a photo</a> to {SITE.phone}
            </p>
          </div>
          <div className="space-y-4">
            <div className="cyc-frame cyc-frame--light">
              <p className="h-display text-3xl !text-forest-800">Light frame</p>
              <p className="mt-2 text-forest-950/80">For cards that sit on cream sections — same gradient border, no dark fill.</p>
            </div>
            <figure>
              <Image src={`${B}/ui/frame-electric.webp`} alt="Electric frame artwork from the asset kit" width={1200} height={820} sizes="(max-width:1024px) 100vw, 50vw" className="rounded-2xl" />
              <figcaption className="mt-2 text-sm text-[var(--muted)]">Raster frame art — for social graphics and promos.</figcaption>
            </figure>
          </div>
        </div>
      </Section>

      <Section id="badges" eyebrow="06 · Service badges" title="Seven services," accent="one call" dark>
        <ServiceBadges />
        <p className="mt-8 text-sm text-[var(--muted)]">Hover: badge lifts, tilts and its electric ring glows. Rebuilt in 3D from the flyer&apos;s seven circles.</p>
      </Section>

      <Section id="cards" eyebrow="07 · Cards" title="Services" accent="bento">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="md:col-span-2"><FeatureCard s={SERVICES[2]} priceFrom="$__" /></div>
          <FeatureCard s={SERVICES[0]} priceFrom="$__" />
          <FeatureCard s={SERVICES[1]} />
          <FeatureCard s={SERVICES[3]} />
          <FeatureCard s={SERVICES[4]} />
        </div>
        <p className="mt-4 text-sm text-[var(--muted)]">&ldquo;From $__&rdquo; stays a placeholder until the owner sets prices in the portal.</p>
        <div className="mt-14"><HowItWorks /></div>
      </Section>

      <Section id="textures" eyebrow="08 · Backgrounds" title="Mowing stripes &" accent="topo lines" dark>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["cyc-stripes", "Animated mowing stripes (CSS)"],
            ["cyc-stripes--photo", "Grass stripe texture"],
            ["cyc-topo", "Navy topo lines — dark bands"],
            ["cyc-mulch", "Mulch — mulch & gravel pages"],
          ].map(([cls, label]) => (
            <Tile key={cls} label={label} className={`${cls} min-h-48`}><span className="sr-only">{label}</span></Tile>
          ))}
          <Tile label="Fall leaves — leaf season module" className="min-h-48 bg-[url(/media/brand/textures/texture-leaves.webp)] bg-[length:420px]">
            <span className="sr-only">Fall leaves</span>
          </Tile>
          <Tile label="River rock / gravel" className="min-h-48 bg-[url(/media/brand/textures/texture-gravel.webp)] bg-[length:420px]">
            <span className="sr-only">Gravel</span>
          </Tile>
        </div>
      </Section>

      <Section id="imagery" eyebrow="09 · Atmosphere imagery" title="Bright Virginia" accent="daylight">
        <p className="-mt-4 mb-8 max-w-2xl text-[var(--muted)]">
          AI-made atmosphere images: backgrounds and service headers only. Never labeled or used as our real work.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative aspect-video overflow-hidden rounded-[var(--radius-xl)] md:col-span-2">
            <Image src={`${B}/images/hero-1600.webp`} alt="Striped lawn in front of a brick colonial home" fill sizes="(max-width:768px) 100vw, 66vw" className="object-cover" />
          </div>
          <div className="relative aspect-video overflow-hidden rounded-[var(--radius-xl)] md:aspect-auto">
            <Image src={`${B}/images/leaf-season-800.webp`} alt="Autumn front yard mid-cleanup with leaf piles at the curb" fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
          </div>
          {(["spring", "summer", "fall", "winter"] as const).map((s) => (
            <figure key={s} className={s === "winter" ? "md:col-span-3" : ""}>
              <div className={`relative overflow-hidden rounded-[var(--radius-xl)] ${s === "winter" ? "aspect-[21/9]" : "aspect-[4/3]"}`}>
                <Image src={`${B}/images/${s === "winter" ? "cta-dusk-1600" : `season-${s}-800`}.webp`} alt={s === "winter" ? "Dusk lawn with an electric-blue sky glow" : `${s} yard`} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
              </div>
              <figcaption className="mt-2 text-sm capitalize text-[var(--muted)]">{s === "winter" ? "Final CTA band (cta-dusk)" : `Season · ${s}`}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section id="illustrations" eyebrow="10 · Spot art" title="Clay" accent="illustrations" dark>
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {["text-photo", "quote", "done", "calendar", "map-pin", "leaf-pile"].map((n) => (
            <li key={n} className="text-center">
              <div className="rounded-3xl bg-white p-3"><Image src={`${B}/illustrations/illo-${n}.webp`} alt="" width={240} height={240} /></div>
              <p className="mt-2 text-sm text-[var(--muted)]">{n}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="motion" eyebrow="11 · Motion" title="Restrained," accent="seasonal">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative grid min-h-72 place-items-center overflow-hidden rounded-[var(--radius-xl)] bg-[url(/media/brand/images/leaf-season-800.webp)] bg-cover bg-center">
            <div className="absolute inset-0 bg-forest-950/40" />
            <FallingLeaves count={12} />
            <p className="h-display relative text-4xl !text-white">Leaf season</p>
          </div>
          <div className="cyc-ba relative min-h-72" aria-label="Before/after slider handle preview">
            <Image src={`${B}/images/svc-leaf-cleanup-800.webp`} alt="" fill sizes="50vw" className="object-cover" />
            <div className="absolute inset-y-0 left-0 w-1/2 bg-forest-950/50 backdrop-grayscale" />
            <div className="handle" style={{ left: "50%" }} />
            <span className="absolute left-3 top-3 pill">Before</span>
            <span className="absolute right-3 top-3 pill">After</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Falling leaves run Oct–Nov only and switch off with reduced motion. The before/after slider will only ever show the owner&apos;s real job photos (preview uses atmosphere art).
        </p>
      </Section>

      <Section id="local" eyebrow="12 · Real local photos" title="Our home" accent="turf" dark>
        <div className="grid gap-4 md:grid-cols-3">
          <LocalPhoto slug="swift-creek-reservoir" alt="Swift Creek Reservoir in Midlothian" className="aspect-[4/3]" sizes="(max-width:768px) 100vw, 33vw" />
          <LocalPhoto slug="chesterfield-historic-courthouse" alt="Historic Chesterfield County Courthouse" className="aspect-[4/3]" sizes="(max-width:768px) 100vw, 33vw" />
          <LocalPhoto slug="pocahontas-fall-trail" alt="Fall trail in Pocahontas State Park" className="aspect-[4/3]" sizes="(max-width:768px) 100vw, 33vw" />
        </div>
        <p className="mt-4 text-sm text-[var(--muted)]">22 licensed Wikimedia photos for town pages and the service-area section. Credits on every image and on /credits.</p>
      </Section>

      <Section id="honesty" eyebrow="13 · Honesty rule" title="No fake" accent="facts">
        <div className="max-w-2xl space-y-4">
          <p>Unconfirmed details render as visible placeholders until the owner signs off:</p>
          <ul className="space-y-2">
            <li>Years in business: <Pending>confirm with owner</Pending></li>
            <li>Licensed &amp; insured: <Pending>confirm with owner</Pending></li>
            <li>Rating: <Pending>no reviews connected yet</Pending></li>
            <li>Owner: <Pending>{SITE.ownerName.value}?</Pending></li>
          </ul>
          <p className="text-sm text-[var(--muted)]">Full list: content/CONFIRM_WITH_OWNER.md</p>
        </div>
      </Section>
    </>
  );
}
