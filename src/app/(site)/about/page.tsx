import type { Metadata } from "next";
import { share } from "@/lib/seo";
import { Check } from "lucide-react";
import { Pending } from "@/components/brand/CycUI";
import { LocalPhoto } from "@/components/LocalPhoto";
import { CtaBand, PageHero } from "@/components/sections";
import { BRAND as B, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `${SITE.name} is a local, hard-working yard care crew based in Midlothian, serving Chesterfield County, VA.`,
  ...share("/about"),
};

const PROMISES = [
  "We show up when we say we will, and text you if weather changes the plan.",
  "Clear quotes before any work starts. No surprise add-ons.",
  "We clean up after ourselves: walks, drives and beds left tidy.",
  "Honest advice, even when it means a smaller job.",
];

export default function About() {
  return (
    <>
      <PageHero eyebrow="About" title="Local and" accent="hard-working." sub={SITE.tagline} image={`${B}/images/hero-2400.webp`} alt="" crumbs={[{ name: "About", href: "/about" }]} />
      <section className="py-16 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="space-y-5 text-lg">
            <p>
              {SITE.name} is a Chesterfield County yard care crew based in Midlothian. We mow, mulch, clean up leaves, handle tree work,
              aerate, and haul away yard junk for homeowners across the county.
            </p>
            <p>
              Owner: <Pending>{SITE.ownerName.value}? Confirm name, bio and photo</Pending>
            </p>
            <p>
              In business since: <Pending>confirm with owner</Pending> · Licensed &amp; insured: <Pending>confirm with owner</Pending>
            </p>
            <h2 className="h-display pt-4 text-4xl">What you can <span className="accent">count on</span></h2>
            <ul className="space-y-3 text-base">
              {PROMISES.map((p) => <li key={p} className="flex gap-3"><Check className="mt-0.5 shrink-0 text-lime-500" aria-hidden /> {p}</li>)}
            </ul>
          </div>
          <LocalPhoto slug="chesterfield-historic-courthouse" alt="Historic Chesterfield County Courthouse" className="aspect-[4/3]" />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
