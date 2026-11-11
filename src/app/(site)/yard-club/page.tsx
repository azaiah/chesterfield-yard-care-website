import type { Metadata } from "next";
import { share } from "@/lib/seo";
import Image from "next/image";
import { Check, Zap } from "lucide-react";
import { Pending } from "@/components/brand/CycUI";
import { QuickQuote } from "@/components/QuickQuote";
import { CtaBand, FaqList, PageHero, SectionHead } from "@/components/sections";
import { CALENDAR, PLANS } from "@/content/yard-club";
import { BRAND as B } from "@/lib/site";

export const metadata: Metadata = {
  title: "Yard Club: Seasonal Lawn Care Plans in Chesterfield, VA",
  description: "One crew, every season. Recurring yard care plans covering mowing, spring mulch, fall aeration and leaf cleanup in Midlothian and Chesterfield County.",
  ...share("/yard-club"),
};

const CLUB_FAQ = [
  { q: "Is there a contract?", a: "Plan terms are confirmed with your quote. Ask us about seasonal and month-to-month options." },
  { q: "Can I switch plans?", a: "Yes. Tell us before the next season starts and we'll adjust your visits." },
  { q: "What if I only need mowing?", a: "That's exactly what Mow Club is for. Add leaves or mulch any time as a one-off." },
  { q: "How do I sign up?", a: "Fill out the form below or text us your address. We'll look at your yard and send a price for the plan you pick." },
];

export default function YardClub() {
  return (
    <>
      <PageHero
        eyebrow="Yard Club"
        title="Set it."
        accent="Forget it."
        sub="One crew, every season. Pick a plan and your yard is handled from the first spring cut to the last oak leaf."
        image={`${B}/images/season-summer-1600.webp`}
        alt=""
        crumbs={[{ name: "Yard Club", href: "/yard-club" }]}
      />

      <section className="py-16 md:py-24">
        <div className="container-x">
          <SectionHead eyebrow="Plans" title="Pick your" accent="level." center />
          <ul className="mt-12 grid gap-6 lg:grid-cols-3">
            {PLANS.map((p) => (
              <li
                key={p.id}
                className={`flex flex-col rounded-[var(--radius-xl)] p-7 ${p.featured ? "cyc-frame lg:-mt-4" : "border border-[var(--border)] bg-[var(--surface)]"}`}
              >
                {p.featured && <span className="pill self-start !border-lime-500 !bg-lime-500 !text-forest-950"><Zap size={13} aria-hidden /> Most popular</span>}
                <h2 className={`h-display mt-3 text-4xl ${p.featured ? "!text-white" : ""}`}>{p.name}</h2>
                <p className={p.featured ? "text-white/80" : "text-[var(--muted)]"}>{p.tagline}</p>
                <p className={`mt-5 font-head text-3xl font-extrabold ${p.featured ? "text-white" : "text-[var(--heading)]"}`}>
                  {p.price ?? <Pending note="Plan prices not set yet">Price: confirm with owner</Pending>}
                </p>
                <ul className={`mt-5 flex-1 space-y-2 ${p.featured ? "text-white/90" : ""}`}>
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2"><Check size={18} className="mt-0.5 shrink-0 text-lime-500" aria-hidden /> {f}</li>
                  ))}
                </ul>
                <a href="#join" className={`cyc-btn mt-7 ${p.featured ? "cyc-btn--lime" : "cyc-btn--electric"}`}>Choose {p.name}</a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-sm text-[var(--muted)]">Plan names, contents and prices are drafts until confirmed.</p>
        </div>
      </section>

      <section className="band-dark py-16 md:py-24">
        <div className="container-x">
          <p className="eyebrow">Your year with us</p>
          <h2 className="h-display mt-2 text-4xl md:text-6xl">Every season, <span className="accent text-lime-300">covered.</span></h2>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CALENDAR.map((c) => (
              <li key={c.season} className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]">
                <div className="relative aspect-[4/3]">
                  <Image src={`${B}/images/${c.image}-800.webp`} alt="" fill sizes="(max-width:640px) 100vw, 25vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <p className="h-display text-3xl capitalize">{c.season}</p>
                  <p className="text-sm text-[var(--muted)]">{c.months}</p>
                  <ul className="mt-3 space-y-1 text-sm">
                    {c.items.map((i) => <li key={i} className="flex gap-2"><Check size={16} className="mt-0.5 text-lime-500" aria-hidden /> {i}</li>)}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="join" className="scroll-mt-32 py-16 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHead eyebrow="Join" title="Get your" accent="plan price." sub="Tell us where you are and we'll price a plan for your yard." />
            <div className="mt-10"><FaqList items={CLUB_FAQ} /></div>
          </div>
          <div className="cyc-frame self-start">
            <QuickQuote source="yard_club" heading="Join Yard Club" sub="We'll confirm your plan and price by text." submitLabel="Get my plan price" />
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
