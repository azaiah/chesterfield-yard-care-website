import type { Metadata } from "next";
import { share } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { CtaBand, PageHero } from "@/components/sections";
import { POSTS } from "@/content/blog";
import { fmtDate } from "@/lib/format";
import { BRAND as B } from "@/lib/site";

export const metadata: Metadata = {
  title: "Yard Tips for Chesterfield & Midlothian Homeowners",
  description: "Practical, local lawn and yard advice for Central Virginia: leaf season, aeration timing, mulch, mowing fescue and storm cleanup.",
  ...share("/blog"),
};

export default function Blog() {
  return (
    <>
      <PageHero eyebrow="Yard tips" title="Local advice," accent="no fluff." image={`${B}/images/leaf-season-2400.webp`} alt="" crumbs={[{ name: "Yard tips", href: "/blog" }]} />
      <section className="py-16 md:py-24">
        <ul className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="group block h-full overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] transition hover:border-lime-500">
                <div className="relative aspect-[16/9]">
                  <Image src={`${B}/images/${p.image}-800.webp`} alt="" fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <p className="text-sm text-[var(--muted)]"><time dateTime={p.date}>{fmtDate(p.date)}</time></p>
                  <h2 className="h-display mt-1 text-2xl">{p.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">{p.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </>
  );
}
