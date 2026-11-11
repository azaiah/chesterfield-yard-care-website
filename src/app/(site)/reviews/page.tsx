import type { Metadata } from "next";
import { CtaBand, PageHero, ReviewsBlock } from "@/components/sections";
import { BRAND as B } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reviews",
  description: "What Chesterfield and Midlothian homeowners say about Chesterfield Yard Care.",
  alternates: { canonical: "/reviews" },
};

// Only real reviews (src/content/proof.ts). No aggregate rating schema until real ones exist.
export default function Reviews() {
  return (
    <>
      <PageHero eyebrow="Reviews" title="Straight from" accent="the neighbors." image={`${B}/images/season-fall-1600.webp`} alt="" crumbs={[{ name: "Reviews", href: "/reviews" }]} />
      <section className="py-16 md:py-24">
        <div className="container-x"><ReviewsBlock /></div>
      </section>
      <CtaBand />
    </>
  );
}
