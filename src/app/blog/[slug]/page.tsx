import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand, JsonLd, PageHero, ServiceCardsMini } from "@/components/sections";
import { POSTS, postBySlug } from "@/content/blog";
import { BRAND as B, SITE } from "@/lib/site";
import { fmtDate } from "@/lib/format";

export const dynamicParams = false;
export const generateStaticParams = () => POSTS.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = postBySlug((await params).slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", title: p.title, description: p.description, publishedTime: p.date, images: [{ url: `${B}/images/${p.image}-1600.webp` }] },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = postBySlug((await params).slug);
  if (!p) notFound();
  return (
    <>
      <PageHero eyebrow={fmtDate(p.date)} title={p.title} image={`${B}/images/${p.image}-1600.webp`} alt="" crumbs={[{ name: "Yard tips", href: "/blog" }, { name: p.title, href: `/blog/${p.slug}` }]} />
      <article className="py-16 md:py-24">
        <div className="container-x max-w-3xl space-y-8 text-lg leading-relaxed">
          {p.sections.map((s, i) => (
            <section key={i} className="space-y-4">
              {s.h && <h2 className="h-display text-3xl md:text-4xl">{s.h}</h2>}
              {s.p?.map((t) => <p key={t.slice(0, 30)}>{t}</p>)}
              {s.list && (
                <ul className="list-disc space-y-2 pl-6 marker:text-lime-500">
                  {s.list.map((t) => <li key={t.slice(0, 30)}>{t}</li>)}
                </ul>
              )}
            </section>
          ))}
        </div>
        <div className="container-x mt-16"><ServiceCardsMini slugs={[p.service]} title="Want it handled?" /></div>
      </article>
      <CtaBand />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: p.title,
          description: p.description,
          datePublished: p.date,
          image: `${SITE.url}${B}/images/${p.image}-1600.webp`,
          author: { "@type": "Organization", name: SITE.name },
          publisher: { "@id": `${SITE.url}/#business` },
          mainEntityOfPage: `${SITE.url}/blog/${p.slug}`,
        }}
      />
    </>
  );
}
