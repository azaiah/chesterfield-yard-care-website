import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { QuickQuote } from "@/components/QuickQuote";
import { CtaBand, FaqList, JsonLd, PageHero, ServiceCardsMini, TownChips, WorkGallery } from "@/components/sections";
import { SERVICE_CONTENT, serviceContent } from "@/content/services";
import { serviceSchema } from "@/lib/schema";
import { BRAND as B, SERVICES } from "@/lib/site";

// Gallery reads portal photos; refresh every 5 minutes.
export const revalidate = 300;
export const dynamicParams = false;
export const generateStaticParams = () => SERVICE_CONTENT.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = serviceContent((await params).slug);
  if (!c) return {};
  const svc = SERVICES.find((s) => s.slug === c.slug)!;
  return {
    title: c.seoTitle,
    description: c.metaDescription,
    alternates: { canonical: `/services/${c.slug}` },
    openGraph: { title: c.seoTitle, description: c.metaDescription, images: [{ url: `${B}/images/${svc.photo}-1600.webp`, width: 1600, height: 900 }] },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const c = serviceContent((await params).slug);
  if (!c) notFound();
  const svc = SERVICES.find((s) => s.slug === c.slug)!;

  return (
    <>
      <PageHero
        eyebrow={svc.label}
        title={c.h1}
        accent={c.accent}
        sub={svc.blurb}
        image={`${B}/images/${svc.photo}-2400.webp`}
        alt=""
        crumbs={[{ name: "Services", href: "/services" }, { name: svc.label, href: `/services/${c.slug}` }]}
      />

      <section className="py-16 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-12">
            <p className="text-xl leading-relaxed">{c.intro}</p>

            <div>
              <h2 className="h-display text-4xl">What&apos;s <span className="accent">included</span></h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {c.included.map((i) => (
                  <li key={i} className="flex gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                    <Check className="mt-0.5 shrink-0 text-lime-500" size={20} aria-hidden /> {i}
                  </li>
                ))}
              </ul>
            </div>

            <div className="cyc-frame cyc-frame--light">
              <p className="eyebrow">Local timing</p>
              <h2 className="h-display mt-1 text-3xl !text-forest-800">{c.timing.heading}</h2>
              {c.timing.body.map((p) => <p key={p.slice(0, 30)} className="mt-3 text-forest-950/85">{p}</p>)}
            </div>

            {c.sections.map((s) => (
              <div key={s.h}>
                <h2 className="h-display text-4xl">{s.h}</h2>
                {s.p.map((p) => <p key={p.slice(0, 30)} className="mt-4 text-lg text-[var(--muted)]">{p}</p>)}
              </div>
            ))}

            <div>
              <h2 className="h-display text-4xl">How it <span className="accent">works</span></h2>
              <ol className="mt-6 space-y-3">
                {c.process.map((p, i) => (
                  <li key={p} className="flex items-start gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lime-500 font-head text-xl font-extrabold text-forest-950">{i + 1}</span>
                    <span className="pt-2">{p}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start" aria-label="Free quote">
            <div className="cyc-frame">
              <div className="mb-5 flex items-center gap-3">
                <Image src={`${B}/badges/${svc.badge}.webp`} alt="" width={56} height={56} />
                <p className="font-head text-xl font-bold uppercase tracking-wide text-white">{svc.label}</p>
              </div>
              <QuickQuote source="service_page" services={[c.slug]} heading="Free quote" sub="Three fields. Fast reply." />
            </div>
          </aside>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container-x space-y-16">
          <div>
            <h2 className="h-display text-4xl">Our {svc.label.toLowerCase()} <span className="accent">work</span></h2>
            <div className="mt-6"><WorkGallery limit={3} /></div>
          </div>
          <div className="max-w-4xl">
            <h2 className="h-display text-4xl">{svc.label} <span className="accent">FAQ</span></h2>
            <div className="mt-6"><FaqList items={c.faqs} /></div>
          </div>
          <div>
            <h2 className="h-display text-3xl">{svc.label} near you</h2>
            <div className="mt-5"><TownChips /></div>
          </div>
          <ServiceCardsMini slugs={c.related} />
        </div>
      </section>

      <CtaBand title="Let's get your" accent="quote going." />
      <JsonLd data={serviceSchema(c.slug, svc.label, c.metaDescription)} />
    </>
  );
}
