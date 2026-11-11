import type { Metadata } from "next";
import { CtaBand, PageHero, WorkGallery } from "@/components/sections";
import { BRAND as B } from "@/lib/site";

// Gallery reads portal photos; refresh every 5 minutes.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Our Work: Before & After Yard Photos",
  description: "Real before-and-after photos of mowing, mulch, leaf cleanups and yard makeovers by Chesterfield Yard Care in Midlothian and Chesterfield County, VA.",
  alternates: { canonical: "/gallery" },
};

export default function Gallery() {
  return (
    <>
      <PageHero eyebrow="Our work" title="Real yards," accent="real results." sub="Only photos of our own jobs. Never stock, never AI." image={`${B}/images/svc-mowing-2400.webp`} alt="" crumbs={[{ name: "Our Work", href: "/gallery" }]} />
      <section className="py-16 md:py-24">
        <div className="container-x"><WorkGallery /></div>
      </section>
      <CtaBand title="Want yours" accent="next?" />
    </>
  );
}
