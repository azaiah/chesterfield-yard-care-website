import type { Metadata } from "next";
import { share } from "@/lib/seo";
import Image from "next/image";
import { MessageSquareText, Phone } from "lucide-react";
import { HowItWorks } from "@/components/brand/CycUI";
import { QuickQuote } from "@/components/QuickQuote";
import { BRAND as B, SITE, SMS, TEL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get a Free Quote",
  description: `Free yard care quotes in Chesterfield & Midlothian, VA. Three quick fields, or text a photo to ${SITE.phone}.`,
  ...share("/quote"),
};

export default function QuotePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden band-dark">
        <Image src={`${B}/images/cta-dusk-2400.webp`} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-navy-950/75" />
        <div className="container-x grid gap-10 py-12 md:py-20 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <div>
            <p className="eyebrow">Free quote</p>
            <h1 className="h-display mt-2 text-5xl md:text-7xl">Get your price <span className="accent text-lime-300">fast.</span></h1>
            <p className="mt-4 max-w-lg text-lg text-white/85">Three fields and you&apos;re done. Add photos on the next screen if you want an even faster, sharper quote.</p>
            <div className="mt-8 grid max-w-md gap-3">
              <a href={SMS} className="cyc-btn cyc-btn--electric"><MessageSquareText aria-hidden /> Or text a photo</a>
              <a href={TEL} className="cyc-btn cyc-btn--ghost"><Phone aria-hidden /> Call {SITE.phone}</a>
            </div>
          </div>
          <div className="cyc-frame">
            <QuickQuote source="quote_page" heading="Your free quote" autoFocus />
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="container-x"><HowItWorks /></div>
      </section>
    </>
  );
}
