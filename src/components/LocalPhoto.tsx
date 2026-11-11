import Image from "next/image";
import credits from "@/content/photo-credits.json";

type Credit = (typeof credits)[number];
export const PHOTO_CREDITS = credits as Credit[];

/** Real Chesterfield/Midlothian photo from Wikimedia Commons with the required credit caption. Never use for "our work". */
export function LocalPhoto({ slug, alt, sizes = "(max-width:768px) 100vw, 50vw", className = "", priority = false }: {
  slug: string; alt: string; sizes?: string; className?: string; priority?: boolean;
}) {
  const c = PHOTO_CREDITS.find((p) => p.slug === slug);
  if (!c) throw new Error(`Unknown local photo: ${slug}`);
  return (
    <figure className={`relative overflow-hidden rounded-[var(--radius-xl)] ${className}`}>
      <Image
        src={`/media/local/${slug}-1600.webp`}
        alt={alt}
        width={c.width}
        height={c.height}
        sizes={sizes}
        priority={priority}
        className="h-full w-full object-cover"
      />
      <figcaption className="absolute bottom-2 right-2 max-w-[90%] rounded-md bg-black/60 px-2 py-0.5 text-xs leading-snug text-white/90">
        {c.attributionRequired ? (
          <>
            Photo: {c.artist} ·{" "}
            <a className="underline" href={c.licenseUrl || c.source} target="_blank" rel="noopener noreferrer">{c.license}</a>
          </>
        ) : (
          <>Photo: {c.artist} ({c.license})</>
        )}
      </figcaption>
    </figure>
  );
}
