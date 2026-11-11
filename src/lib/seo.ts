import type { Metadata } from "next";
import { SITE } from "./site";

/** The custom link-preview card (iMessage, WhatsApp, Facebook, Slack, X). Bump ?v= when the image changes so apps refetch. */
export const SHARE_IMAGE = {
  url: "/og/preview-card.jpg?v=1",
  width: 1200,
  height: 630,
  alt: `${SITE.name}: lawn care and yard services in Chesterfield & Midlothian, VA. Call or text ${SITE.phone}.`,
  type: "image/jpeg",
};

export const SHARE_TITLE = `${SITE.name} | Mowing, Mulch, Leaves & More`;
export const SHARE_DESCRIPTION = `Local and hard-working yard care in Chesterfield & Midlothian, VA. Free quotes. Call or text ${SITE.phone}.`;

/** Canonical + Open Graph + Twitter for a page, always pointing at the main site address. */
export function share(path: string, o: { title?: string; description?: string; type?: "website" | "article"; publishedTime?: string } = {}): Metadata {
  const title = o.title ?? SHARE_TITLE;
  const description = o.description ?? SHARE_DESCRIPTION;
  return {
    alternates: { canonical: path },
    openGraph: {
      type: o.type ?? "website",
      url: path,
      siteName: SITE.name,
      locale: "en_US",
      title,
      description,
      images: [SHARE_IMAGE],
      ...(o.publishedTime ? { publishedTime: o.publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [SHARE_IMAGE.url] },
  };
}
