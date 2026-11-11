import type { Metadata } from "next";
import { FeatureCard, HowItWorks } from "@/components/brand/CycUI";
import { CtaBand, PageHero, SectionHeadDark } from "@/components/sections";
import { SpotlightArea } from "@/components/SpotlightArea";
import { BRAND as B, SERVICES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Yard Care Services in Chesterfield & Midlothian, VA",
  description: "Mowing, mulch & gravel, leaf cleanup, tree work, aeration, junk removal and full yard makeovers across Chesterfield County. Free quotes: call or text 804-773-8271.",
  alternates: { canonical: "/services" },
};

export default function ServicesIndex() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything your yard"
        accent="needs."
        sub="Seven services, one local crew. Book one, or bundle a few into a single visit."
        image={`${B}/images/hero-2400.webp`}
        alt=""
        crumbs={[{ name: "Services", href: "/services" }]}
      />
      <section className="py-16 md:py-24">
        <SpotlightArea className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => <FeatureCard key={s.slug} s={s} />)}
        </SpotlightArea>
      </section>
      <section className="band-dark cyc-topo py-16 md:py-24">
        <div className="container-x">
          <SectionHeadDark eyebrow="How it works" title="Three steps." accent="Zero hassle." center />
          <div className="mt-10"><HowItWorks /></div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
