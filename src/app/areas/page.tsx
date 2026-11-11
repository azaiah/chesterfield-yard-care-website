import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand, PageHero, ServiceAreaMap } from "@/components/sections";
import { TOWNS_CONTENT } from "@/content/towns";
import { BRAND as B } from "@/lib/site";

export const metadata: Metadata = {
  title: "Service Area: Chesterfield County & Midlothian, VA",
  description: "Chesterfield Yard Care serves Midlothian, Chester, Chesterfield Court House, North Chesterfield, Moseley, Brandermill, Woodlake, Bon Air, Swift Creek, Matoaca, Ettrick and Enon.",
  alternates: { canonical: "/areas" },
};

export default function AreasIndex() {
  return (
    <>
      <PageHero
        eyebrow="Service area"
        title="All over"
        accent="Chesterfield."
        sub="Based in Midlothian, working across the county. Not sure we cover you? Text us your address."
        image="/media/local/swift-creek-reservoir-1600.webp"
        alt="Swift Creek Reservoir in Midlothian, Virginia"
        local
        crumbs={[{ name: "Service Area", href: "/areas" }]}
      />
      <section className="py-16 md:py-24">
        <div className="container-x space-y-12">
          <ServiceAreaMap />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TOWNS_CONTENT.map((t) => (
              <li key={t.slug}>
                <Link href={`/areas/${t.slug}`} className="group block overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] transition hover:border-lime-500">
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={t.photo.local ? `/media/local/${t.photo.local}-800.webp` : `${B}/images/${t.photo.brand!.replace("-1600", "-800")}.webp`}
                      alt=""
                      fill
                      sizes="(max-width:640px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h2 className="h-display flex items-center justify-between text-3xl">
                      {t.name} <ArrowRight aria-hidden className="transition group-hover:translate-x-1" />
                    </h2>
                    <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">{t.lead}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-sm text-[var(--muted)]">Local landmark photos are credited on the <Link className="underline" href="/credits">photo credits</Link> page.</p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
