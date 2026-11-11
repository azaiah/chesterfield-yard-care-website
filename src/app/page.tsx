import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MapPin, MessageSquareText, Phone, Zap } from "lucide-react";
import { ElectricButton, FeatureCard, HeroMedia, HowItWorks, LimeButton } from "@/components/brand/CycUI";
import { Estimator } from "@/components/Estimator";
import { LocalPhoto } from "@/components/LocalPhoto";
import { QuickQuote } from "@/components/QuickQuote";
import {
  CtaBand, FaqList, ReviewsBlock, SeasonalFeature, SectionHead, SectionHeadDark, ServiceAreaMap, TownChips, WorkGallery,
} from "@/components/sections";
import { SpotlightArea } from "@/components/SpotlightArea";
import { FAQ } from "@/content/faq";
import { PLANS } from "@/content/yard-club";
import { BRAND as B, SERVICES, SITE, SMS, TEL } from "@/lib/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const HEADLINE = ["Your", "yard,"];

export default function Home() {
  const [leaf, mow, mulch, tree, aerate, junk, any] = [
    SERVICES[2], SERVICES[0], SERVICES[1], SERVICES[3], SERVICES[4], SERVICES[5], SERVICES[6],
  ];
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section aria-labelledby="hero-h" className="relative isolate overflow-hidden text-white">
        <div className="absolute inset-0 -z-20"><HeroMedia /></div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-950/90 via-forest-950/60 to-forest-950/20" />
        <div className="container-x grid min-h-[calc(100svh-112px)] items-center gap-10 py-12 lg:grid-cols-[1.15fr_1fr] lg:py-16">
          <div>
            <p className="eyebrow !text-lime-300">
              <MapPin className="mr-1 inline" size={14} aria-hidden /> Chesterfield &amp; Midlothian, VA
            </p>
            <h1 id="hero-h" className="h-display reveal-words mt-3 text-[3.4rem] !text-white sm:text-7xl xl:text-8xl">
              {HEADLINE.map((w, i) => (
                <span key={w} className="w" style={{ animationDelay: `${i * 70}ms` }}>{w}&nbsp;</span>
              ))}
              <span className="w accent text-lime-300" style={{ animationDelay: "160ms" }}>handled.</span>
              <br />
              <span className="w" style={{ animationDelay: "240ms" }}>Every&nbsp;</span>
              <span className="w" style={{ animationDelay: "300ms" }}>season.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/90 md:text-xl">
              <span className="hl-sun font-semibold">Local</span> and <span className="hl-sun font-semibold">hard-working</span>: mowing,
              mulch, leaf cleanup, tree work, aeration and junk removal. One call, one crew.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 lg:hidden">
              <LimeButton href="#quote">Get my free quote</LimeButton>
              <ElectricButton href={SMS} icon={<MessageSquareText aria-hidden />}>Text a photo</ElectricButton>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-white/90">
              {["Free quotes", "Quote from a photo", "Locally owned"].map((t) => (
                <li key={t} className="flex items-center gap-1.5"><Check size={16} className="text-lime-500" aria-hidden /> {t}</li>
              ))}
            </ul>
          </div>
          <div id="quote" className="cyc-frame scroll-mt-32">
            <QuickQuote />
          </div>
        </div>
      </section>

      {/* ---------- Marquee ---------- */}
      <div className="marquee border-y border-[var(--border)] bg-[var(--surface)] py-4" aria-hidden="true">
        <div className="marquee__track">
          {[...SERVICES, ...SERVICES].map((s, i) => (
            <span key={i} className="flex items-center gap-3 whitespace-nowrap font-head text-2xl font-extrabold uppercase tracking-wide text-[var(--heading)]">
              <Image src={`${B}/badges/${s.badge}.webp`} alt="" width={36} height={36} /> {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* ---------- Services bento ---------- */}
      <section aria-labelledby="svc-h" className="py-20 md:py-28">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead id="svc-h" eyebrow="What we do" title="Seven services," accent="one call." sub="Everything on the flyer, done carefully. Pick one or bundle a few." />
            <Link href="/services" className="inline-flex items-center gap-2 font-head text-lg font-bold uppercase tracking-wide text-[var(--link)] hover:underline">
              All services <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
          <SpotlightArea className="mt-12 grid gap-5 md:grid-cols-3">
            <div className="md:col-span-2 md:row-span-2 [&>a]:h-full [&>a]:min-h-[420px]"><FeatureCard s={leaf} /></div>
            <FeatureCard s={mow} />
            <FeatureCard s={mulch} />
            <FeatureCard s={tree} />
            <FeatureCard s={aerate} />
            <FeatureCard s={junk} />
            <div className="md:col-span-3 [&>a]:min-h-[260px]"><FeatureCard s={any} /></div>
          </SpotlightArea>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section aria-labelledby="how-h" className="band-dark cyc-topo py-20 md:py-28">
        <div className="container-x">
          <SectionHeadDark id="how-h" eyebrow="How it works" title="Three steps." accent="Zero hassle." center />
          <div className="mt-12"><HowItWorks /></div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ElectricButton href={SMS} icon={<MessageSquareText aria-hidden />}>Text a photo now</ElectricButton>
            <a href={TEL} className="cyc-btn cyc-btn--ghost"><Phone aria-hidden /> {SITE.phone}</a>
          </div>
        </div>
      </section>

      {/* ---------- Estimator ---------- */}
      <section id="estimate" aria-labelledby="est-h" className="scroll-mt-28 py-20 md:py-28">
        <div className="container-x">
          <SectionHead id="est-h" eyebrow="Instant estimate" title="Ballpark it in" accent="10 seconds." sub="Pick your services and yard size for a range. Lock it in and we'll confirm the real price fast." />
          <div className="mt-12"><Estimator /></div>
        </div>
      </section>

      {/* ---------- Seasonal ---------- */}
      <SeasonalFeature />

      {/* ---------- Proof ---------- */}
      <section aria-labelledby="work-h" className="py-20 md:py-28">
        <div className="container-x space-y-14">
          <SectionHead id="work-h" eyebrow="Our work" title="Real yards," accent="real results." sub="Only our own job photos go here. Never stock, never AI." />
          <WorkGallery limit={6} />
          <ReviewsBlock limit={3} />
        </div>
      </section>

      {/* ---------- Yard Club teaser ---------- */}
      <section aria-labelledby="club-h" className="band-dark py-20 md:py-28">
        <div className="container-x">
          <div className="grid items-end gap-6 md:grid-cols-[1fr_auto]">
            <SectionHeadDark id="club-h" eyebrow="Yard Club" title="Set it." accent="Forget it." sub="One crew, every season. Recurring plans that cover mowing, mulch, leaves and more." />
            <LimeButton href="/yard-club">See the plans</LimeButton>
          </div>
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {PLANS.map((p) => (
              <li key={p.id} className={`rounded-[var(--radius-xl)] border p-6 ${p.featured ? "border-lime-500 bg-forest-800/40 shadow-[var(--glow-electric)]" : "border-[var(--border)] bg-[var(--surface)]"}`}>
                {p.featured && <span className="pill !border-lime-500 !bg-lime-500 !text-forest-950"><Zap size={13} aria-hidden /> Most popular</span>}
                <h3 className="h-display mt-3 text-3xl">{p.name}</h3>
                <p className="text-[var(--muted)]">{p.tagline}</p>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {p.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-lime-500" aria-hidden /> {f}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Service area ---------- */}
      <section aria-labelledby="area-h" className="py-20 md:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHead id="area-h" eyebrow="Service area" title="Your" accent="neighbors." sub="We're based in Midlothian and work across Chesterfield County. Not sure we cover you? Text us your address." />
            <div className="mt-8"><TownChips /></div>
          </div>
          <div className="space-y-4">
            <ServiceAreaMap />
            <LocalPhoto slug="swift-creek-reservoir" alt="Swift Creek Reservoir in Midlothian, Virginia" className="aspect-[16/7]" />
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section aria-labelledby="faq-h" className="pb-20 md:pb-28">
        <div className="container-x max-w-4xl">
          <SectionHead id="faq-h" eyebrow="FAQ" title="Good" accent="questions." center />
          <div className="mt-10"><FaqList items={FAQ.slice(0, 6)} /></div>
          <p className="mt-6 text-center"><Link href="/faq" className="text-[var(--link)] underline">More questions</Link></p>
        </div>
      </section>

      <CtaBand sub="Call, text a photo, or grab a free quote. We'll get back to you fast." />
    </>
  );
}
