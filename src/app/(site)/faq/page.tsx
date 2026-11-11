import type { Metadata } from "next";
import { share } from "@/lib/seo";
import { CtaBand, FaqList, JsonLd, PageHero } from "@/components/sections";
import { FAQ } from "@/content/faq";
import { SERVICE_CONTENT } from "@/content/services";
import { BRAND as B, SERVICES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Yard Care FAQ",
  description: "Answers about quotes, scheduling, leaf season, aeration timing and service area for Chesterfield Yard Care in Midlothian and Chesterfield County, VA.",
  ...share("/faq"),
};

export default function FaqPage() {
  const all = [...FAQ, ...SERVICE_CONTENT.flatMap((s) => s.faqs.slice(0, 2))];
  return (
    <>
      <PageHero eyebrow="FAQ" title="Good" accent="questions." image={`${B}/images/season-spring-1600.webp`} alt="" crumbs={[{ name: "FAQ", href: "/faq" }]} />
      <section className="py-16 md:py-24">
        <div className="container-x max-w-4xl space-y-14">
          <div>
            <h2 className="h-display text-4xl">General</h2>
            <div className="mt-6"><FaqList items={FAQ} schema={false} /></div>
          </div>
          {SERVICE_CONTENT.map((s) => (
            <div key={s.slug}>
              <h2 className="h-display text-4xl">{SERVICES.find((x) => x.slug === s.slug)!.label}</h2>
              <div className="mt-6"><FaqList items={s.faqs.slice(0, 2)} schema={false} /></div>
            </div>
          ))}
        </div>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: all.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }}
        />
      </section>
      <CtaBand />
    </>
  );
}
