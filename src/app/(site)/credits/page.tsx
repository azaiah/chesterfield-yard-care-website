import type { Metadata } from "next";
import { share } from "@/lib/seo";
import Image from "next/image";
import { PHOTO_CREDITS } from "@/components/LocalPhoto";

export const metadata: Metadata = {
  title: "Photo Credits",
  description: "Credits and licenses for the photographs of Chesterfield County and Midlothian, VA used on this site.",
  ...share("/credits"),
};

export default function CreditsPage() {
  return (
    <div className="container-x py-14 md:py-20">
      <p className="eyebrow">Credits</p>
      <h1 className="h-display mt-2 text-5xl md:text-7xl">
        Photo <span className="accent">credits</span>
      </h1>
      <div className="mt-6 max-w-2xl space-y-3 text-[var(--muted)]">
        <p>
          Photos of local places around Chesterfield County and Midlothian come from Wikimedia Commons and are used under
          the licenses listed below. They show our home turf, not our work.
        </p>
        <p>
          Some background and atmosphere images on this site were made with AI image tools. They are never presented as
          real jobs. Photos in our gallery and before/after sections come from our own crew.
        </p>
      </div>

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PHOTO_CREDITS.map((c) => (
          <li key={c.slug} className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]">
            <Image
              src={`/media/local/${c.slug}-800.webp`}
              alt={c.title}
              width={800}
              height={Math.round((800 * c.height) / c.width)}
              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="space-y-1 p-4 text-sm">
              <p className="font-semibold text-[var(--heading)]">{c.title}</p>
              <p>By {c.artist}</p>
              <p>
                License:{" "}
                {c.licenseUrl ? (
                  <a className="text-[var(--link)] underline" href={c.licenseUrl} target="_blank" rel="noopener noreferrer">{c.license}</a>
                ) : (
                  c.license
                )}
              </p>
              <p>
                <a className="text-[var(--link)] underline" href={c.source} target="_blank" rel="noopener noreferrer">
                  Source on Wikimedia Commons
                </a>
              </p>
            </div>
          </li>
        ))}
      </ul>

      <section className="mt-16 max-w-2xl space-y-2 text-sm text-[var(--muted)]">
        <h2 className="h-display text-2xl">Fonts</h2>
        <p>Graduate, Barlow Condensed, Instrument Serif and Inter, all via Google Fonts under the SIL Open Font License.</p>
      </section>
    </div>
  );
}
