import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { LocalPhoto } from "@/components/LocalPhoto";
import { QuickQuote } from "@/components/QuickQuote";
import { CtaBand, JsonLd, PageHero, ServiceAreaMap, ServiceCardsMini, TownChips } from "@/components/sections";
import { TOWNS_CONTENT, townBySlug } from "@/content/towns";
import { BRAND as B, SITE } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => TOWNS_CONTENT.map((t) => ({ slug: t.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = townBySlug((await params).slug);
  if (!t) return {};
  const title = `Lawn Care & Yard Services in ${t.name}, VA`;
  const description = `Mowing, leaf cleanup, mulch, tree work, aeration and junk removal in ${t.name}, VA. Local crew, free quotes. Call or text ${SITE.phone}.`;
  return { title, description, alternates: { canonical: `/areas/${t.slug}` }, openGraph: { title, description } };
}

const heroImage = (t: NonNullable<ReturnType<typeof townBySlug>>) =>
  t.photo.local ? `/media/local/${t.photo.local}-1600.webp` : `${B}/images/${t.photo.brand}.webp`;

export default async function TownPage({ params }: { params: Promise<{ slug: string }> }) {
  const t = townBySlug((await params).slug);
  if (!t) notFound();

  return (
    <>
      <PageHero
        eyebrow={`${t.name}, Virginia`}
        title="Yard care in"
        accent={`${t.name}.`}
        sub={t.lead}
        image={heroImage(t)}
        alt={t.photo.alt}
        local={!!t.photo.local}
        crumbs={[{ name: "Service Area", href: "/areas" }, { name: t.name, href: `/areas/${t.slug}` }]}
      />

      <section className="py-16 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-10">
            <div className="space-y-5 text-lg">
              {t.body.map((p) => <p key={p.slice(0, 30)}>{p}</p>)}
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="bento-tile">
                <p className="eyebrow">Typical yards</p>
                <p className="mt-2">{t.lots}</p>
              </div>
              <div className="bento-tile">
                <p className="eyebrow">Around {t.name}</p>
                <ul className="mt-2 space-y-1">
                  {t.landmarks.map((l) => (
                    <li key={l} className="flex gap-2"><MapPin size={16} className="mt-1 shrink-0 text-lime-500" aria-hidden /> {l}</li>
                  ))}
                </ul>
              </div>
            </div>
            {t.photo.local && (
              <LocalPhoto slug={t.photo.local} alt={t.photo.alt} className="aspect-[16/9]" sizes="(max-width:1024px) 100vw, 60vw" />
            )}
            <ServiceCardsMini slugs={t.popular} title={`Popular in ${t.name}`} />
          </div>
          <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start" aria-label="Free quote">
            <div className="cyc-frame">
              <QuickQuote source="town_page" heading={`${t.name} quote`} sub="Three fields. We'll text you back fast." />
            </div>
          </aside>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <ServiceAreaMap highlight={{ lat: t.lat, lon: t.lon, name: t.name }} />
          <div>
            <h2 className="h-display text-4xl">Nearby <span className="accent">too</span></h2>
            <p className="mt-3 text-[var(--muted)]">We work all over Chesterfield County, including these spots near {t.name}.</p>
            <div className="mt-6"><TownChips only={t.nearby} /></div>
          </div>
        </div>
      </section>

      <CtaBand title={`${t.name} yards,`} accent="handled." />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `Yard care in ${t.name}, VA`,
          serviceType: "Lawn care and yard services",
          provider: { "@id": `${SITE.url}/#business` },
          areaServed: { "@type": "Place", name: `${t.name}, VA`, geo: { "@type": "GeoCoordinates", latitude: t.lat, longitude: t.lon } },
        }}
      />
    </>
  );
}
