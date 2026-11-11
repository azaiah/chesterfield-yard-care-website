import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Check, ChevronDown, MessageSquareText, Phone, Star } from "lucide-react";
import { BEFORE_AFTER, REVIEWS, WORK_PHOTOS } from "@/content/proof";
import { TOWNS_CONTENT } from "@/content/towns";
import type { QA } from "@/content/services";
import { BRAND as B, SERVICES, SITE, SMS, TEL, seasonFor } from "@/lib/site";
import { publicWork } from "@/lib/server/portal";
import { BeforeAfter } from "./BeforeAfter";
import { ElectricButton, FallingLeaves, GhostButton, LimeButton, Pending } from "./brand/CycUI";
import { HeroVideo } from "./brand/HeroVideo";

export function SectionHead({ eyebrow, title, accent, sub, center = false, id }: { eyebrow: string; title: ReactNode; accent?: string; sub?: ReactNode; center?: boolean; id?: string }) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="h-display mt-2 text-4xl md:text-6xl">
        {title} {accent && <span className="accent text-royal-600 dark-hide">{accent}</span>}
        {accent && <span className="accent text-lime-300 dark-show">{accent}</span>}
      </h2>
      {sub && <p className="mt-4 text-lg text-[var(--muted)]">{sub}</p>}
    </div>
  );
}

/** Dark-band variant: accent is always lime. */
export function SectionHeadDark({ eyebrow, title, accent, sub, center = false, id }: { eyebrow: string; title: ReactNode; accent?: string; sub?: ReactNode; center?: boolean; id?: string }) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="h-display mt-2 text-4xl md:text-6xl">
        {title} {accent && <span className="accent text-lime-300">{accent}</span>}
      </h2>
      {sub && <p className="mt-4 text-lg text-[var(--muted)]">{sub}</p>}
    </div>
  );
}

export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 text-white/75">
          {all.map((c, i) => (
            <li key={c.href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden>/</span>}
              {i === all.length - 1 ? <span aria-current="page" className="text-white">{c.name}</span> : <Link className="hover:text-lime-300" href={c.href}>{c.name}</Link>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: `${SITE.url}${c.href === "/" ? "" : c.href}` })),
        }}
      />
    </>
  );
}

/** Photo-backed page hero used by service, town, blog and utility pages. */
export function PageHero({ eyebrow, title, accent, sub, image, alt, crumbs, children, local }: {
  eyebrow: string; title: string; accent?: string; sub?: string; image: string; alt: string; crumbs: { name: string; href: string }[]; children?: ReactNode; local?: boolean;
}) {
  return (
    <section className="relative isolate overflow-hidden text-white">
      <Image src={image} alt={alt} fill priority sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-950/90 via-forest-950/70 to-forest-950/30" />
      <div className="container-x py-12 md:py-20">
        <Breadcrumbs items={crumbs} />
        <p className="eyebrow mt-6 !text-lime-300">{eyebrow}</p>
        <h1 className="h-display mt-2 max-w-4xl text-5xl !text-white md:text-7xl">
          {title} {accent && <span className="accent text-lime-300">{accent}</span>}
        </h1>
        {sub && <p className="mt-4 max-w-2xl text-lg text-white/90">{sub}</p>}
        <div className="mt-7 flex flex-wrap gap-3">
          {children ?? (
            <>
              <LimeButton href="/quote">Get my free quote</LimeButton>
              <ElectricButton href={SMS} icon={<MessageSquareText aria-hidden />}>Text a photo</ElectricButton>
            </>
          )}
        </div>
      </div>
      {local && <span className="sr-only">Photo of a local landmark, not our work.</span>}
    </section>
  );
}

export function CtaBand({ title = "Ready when", accent = "you are.", sub }: { title?: string; accent?: string; sub?: string }) {
  return (
    <section aria-labelledby="cta-band-h" className="relative isolate overflow-hidden band-dark py-20 text-center md:py-28">
      <Image src={`${B}/images/cta-dusk-1600.webp`} alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-navy-950/70" />
      <div className="container-x">
        <p className="eyebrow">Free quotes · {SITE.region}</p>
        <h2 id="cta-band-h" className="h-display mx-auto mt-2 max-w-3xl text-5xl md:text-7xl">
          {title} <span className="accent text-lime-300">{accent}</span>
        </h2>
        {sub && <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">{sub}</p>}
        <a href={TEL} className="mt-8 inline-block font-head text-6xl font-extrabold tracking-wide text-white drop-shadow-[0_0_24px_rgba(47,123,255,.8)] hover:text-lime-300 md:text-8xl">
          {SITE.phone}
        </a>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <GhostButton href={TEL} icon={<Phone aria-hidden />}>Call</GhostButton>
          <ElectricButton href={SMS} icon={<MessageSquareText aria-hidden />}>Text a photo</ElectricButton>
          <LimeButton href="/quote">Free quote</LimeButton>
        </div>
      </div>
    </section>
  );
}

export function FaqList({ items, schema = true }: { items: QA[]; schema?: boolean }) {
  return (
    <>
      <div className="divide-y divide-[var(--border)] rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]">
        {items.map((f) => (
          <details key={f.q} className="group px-5 py-1 md:px-7">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-head text-xl font-bold tracking-wide text-[var(--heading)] [&::-webkit-details-marker]:hidden">
              {f.q}
              <ChevronDown aria-hidden className="shrink-0 transition group-open:rotate-180" />
            </summary>
            <p className="pb-5 text-[var(--muted)]">{f.a}</p>
          </details>
        ))}
      </div>
      {schema && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }}
        />
      )}
    </>
  );
}

export function ReviewsBlock({ limit }: { limit?: number }) {
  const list = limit ? REVIEWS.slice(0, limit) : REVIEWS;
  const reviewLink = SITE.googleBusinessUrl;
  if (!list.length) {
    return (
      <div className="cyc-frame cyc-frame--light grid items-center gap-6 md:grid-cols-[auto_1fr_auto]">
        <div className="flex gap-1 text-sun-400" aria-hidden>
          {Array.from({ length: 5 }, (_, i) => <Star key={i} fill="currentColor" size={28} className="drop-shadow" />)}
        </div>
        <div>
          <p className="h-display text-3xl !text-forest-800">Be our next 5-star review</p>
          <p className="mt-1 text-forest-950/75">We&apos;re building our reviews one yard at a time. Had us out? We&apos;d love to hear how it went.</p>
        </div>
        {reviewLink ? (
          <LimeButton href={reviewLink}>Leave a review</LimeButton>
        ) : (
          <Pending note="Google Business Profile URL needed">Review link pending</Pending>
        )}
      </div>
    );
  }
  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {list.map((r) => (
        <li key={r.author + r.date} className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex gap-0.5 text-sun-400" aria-label={`${r.rating} out of 5 stars`}>
            {Array.from({ length: r.rating }, (_, i) => <Star key={i} fill="currentColor" size={18} aria-hidden />)}
          </div>
          <blockquote className="mt-3">&ldquo;{r.text}&rdquo;</blockquote>
          <p className="mt-3 text-sm text-[var(--muted)]">— {r.author}, via {r.source}</p>
        </li>
      ))}
    </ul>
  );
}

const workSrc = (key: string) => `/api/work-photo?key=${encodeURIComponent(key)}`;

/** Owner's real work only: static proof.ts entries + photos marked "Show on website" in the portal. */
export async function WorkGallery({ limit }: { limit?: number }) {
  const portal = await publicWork();
  const pairs = [
    ...BEFORE_AFTER.map((p) => ({ ...p, unoptimized: false })),
    ...portal.flatMap(({ job, photos }) => {
      const b = photos.find((p) => p.kind === "before");
      const a = photos.find((p) => p.kind === "after");
      return b && a ? [{ before: workSrc(b.key), after: workSrc(a.key), alt: `${job.title} in ${job.address.split(",").slice(-1)[0]?.trim() || "Chesterfield"}`, width: a.width ?? 1600, height: a.height ?? 1200, unoptimized: true }] : [];
    }),
  ];
  const paired = new Set(pairs.flatMap((p) => [p.before, p.after]));
  const photos = [
    ...WORK_PHOTOS.map((p) => ({ ...p, unoptimized: false })),
    ...portal.flatMap(({ job, photos }) =>
      photos.filter((p) => !paired.has(workSrc(p.key))).map((p) => ({ src: workSrc(p.key), alt: p.caption || job.title, width: p.width ?? 1600, height: p.height ?? 1200, unoptimized: true })),
    ),
  ].slice(0, limit ?? 999);

  if (!photos.length && !pairs.length) {
    return (
      <div className="grid items-center gap-6 rounded-[var(--radius-xl)] border-2 border-dashed border-[var(--border)] p-8 text-center md:grid-cols-[200px_1fr] md:text-left">
        <Image src={`${B}/illustrations/illo-done.webp`} alt="" width={200} height={200} className="mx-auto" />
        <div>
          <p className="h-display text-3xl">Real jobs, coming right up</p>
          <p className="mt-2 text-[var(--muted)]">
            This space is only for photos of our own work. No stock shots, no AI. We&apos;re adding before-and-afters from local yards as jobs wrap up.
          </p>
          <div className="mt-5"><LimeButton href="/quote">Be one of our first yards</LimeButton></div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {pairs.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {pairs.slice(0, limit ?? 99).map((p) => <BeforeAfter key={p.before} {...p} />)}
        </div>
      )}
      {photos.length > 0 && (
        <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {photos.map((p) => (
            <li key={p.src} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl">
              <Image src={p.src} alt={p.alt} width={p.width} height={p.height} sizes="(max-width:640px) 100vw, 33vw" unoptimized={p.unoptimized} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ServiceAreaMap({ highlight }: { highlight?: { lat: number; lon: number; name: string } }) {
  const bbox = highlight
    ? `${highlight.lon - 0.06},${highlight.lat - 0.04},${highlight.lon + 0.06},${highlight.lat + 0.04}`
    : "-77.88,37.20,-77.25,37.58";
  const marker = highlight ? `&marker=${highlight.lat},${highlight.lon}` : "&marker=37.5057,-77.6494";
  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--glow-electric)]">
      <iframe
        title={highlight ? `Map of ${highlight.name}, Virginia` : "Map of Chesterfield County, Virginia service area"}
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${marker}`}
        loading="lazy"
        className="h-80 w-full md:h-[26rem]"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export function TownChips({ exclude, only }: { exclude?: string; only?: string[] }) {
  const list = TOWNS_CONTENT.filter((t) => t.slug !== exclude && (!only || only.includes(t.slug)));
  return (
    <ul className="flex flex-wrap gap-2">
      {list.map((t) => (
        <li key={t.slug}>
          <Link href={`/areas/${t.slug}`} className="pill min-h-11 hover:!border-lime-500 hover:!bg-lime-500 hover:!text-forest-950">
            {t.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ServiceCardsMini({ slugs, title = "Related services" }: { slugs: string[]; title?: string }) {
  const list = SERVICES.filter((s) => slugs.includes(s.slug));
  return (
    <div>
      <h2 className="h-display text-3xl">{title}</h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-3">
        {list.map((s) => (
          <li key={s.slug}>
            <Link href={`/services/${s.slug}`} className="group flex h-full items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-lime-500">
              <Image src={`${B}/badges/${s.badge}.webp`} alt="" width={56} height={56} />
              <span className="font-head text-lg font-bold uppercase leading-tight tracking-wide text-[var(--heading)]">{s.label}</span>
              <ArrowRight aria-hidden className="ml-auto shrink-0 transition group-hover:translate-x-1" size={18} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SEASONAL = {
  fall: { eyebrow: "Fall in Chesterfield", title: "Leaf season is", accent: "here.", body: "Free quotes on full leaf cleanups and curbside removal. Book one cleanup at peak drop, a second after the oaks let go, and pair it with fall aeration and overseeding while the soil's still warm.", items: ["Full leaf cleanups", "Haul-away or curbside piles", "Aeration + overseeding", "Bed cleanup + mulch top-up"], image: "leaf-season-1600", cta: "Get my leaf quote", video: true },
  winter: { eyebrow: "Winter in Chesterfield", title: "Prune now,", accent: "thank us in spring.", body: "Trees are dormant, so it's the best time for pruning and limb removal. It's also the perfect time to clear out brush piles and yard junk while nothing's growing.", items: ["Pruning & limb removal", "Late oak-leaf cleanup", "Brush & junk haul-away", "Storm cleanup"], image: "season-winter-1600", cta: "Get my winter quote", video: false },
  spring: { eyebrow: "Spring in Chesterfield", title: "Fresh beds,", accent: "first cuts.", body: "Spring cleanup, sharp new edges and fresh mulch make the whole property pop. Lock in your weekly mowing slot before the fescue takes off.", items: ["Spring cleanup", "Fresh mulch & edging", "Weekly mowing", "Shrub trimming"], image: "season-spring-1600", cta: "Get my spring quote", video: false },
  summer: { eyebrow: "Summer in Chesterfield", title: "Mowed right,", accent: "all summer.", body: "We raise the deck so your fescue survives the heat, keep edges sharp, and come running when summer storms drop limbs.", items: ["Weekly/biweekly mowing", "Edging & trimming", "Storm cleanup", "Junk haul-away"], image: "season-summer-1600", cta: "Get my mowing quote", video: false },
} as const;

export function SeasonalFeature() {
  const s = SEASONAL[seasonFor().key];
  return (
    <section aria-labelledby="season-h" className="relative isolate overflow-hidden band-dark py-20 md:py-28">
      <Image src={`${B}/images/${s.image}.webp`} alt="" fill sizes="100vw" className="-z-20 object-cover" />
      {s.video && (
        <div className="absolute inset-0 -z-20">
          <HeroVideo
            whenVisible
            poster={`${B}/video/leaf-loop-poster.jpg`}
            sources={[
              { src: `${B}/video/leaf-loop-mobile.mp4`, type: "video/mp4", media: "(max-width: 700px)" },
              { src: `${B}/video/leaf-loop.mp4`, type: "video/mp4" },
            ]}
          />
        </div>
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-navy-950/20" />
      {s.video && <FallingLeaves count={9} />}
      <div className="container-x relative">
        <div className="max-w-xl">
          <SectionHeadDark id="season-h" eyebrow={s.eyebrow} title={s.title} accent={s.accent} sub={s.body} />
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {s.items.map((i) => (
              <li key={i} className="flex items-center gap-2 font-semibold"><Check className="text-lime-500" size={20} aria-hidden /> {i}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <LimeButton href="/quote">{s.cta}</LimeButton>
            <ElectricButton href={SMS} icon={<MessageSquareText aria-hidden />}>Text a photo</ElectricButton>
          </div>
        </div>
      </div>
    </section>
  );
}
