import { SERVICES, SITE, BRAND } from "./site";
import { TOWNS_CONTENT } from "@/content/towns";

const BIZ_ID = `${SITE.url}/#business`;

/** LocalBusiness — service-area business (no street address published). Unconfirmed fields are omitted, not faked. */
export function localBusinessSchema() {
  const sameAs = [SITE.facebookUrl, SITE.googleBusinessUrl].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": BIZ_ID,
    name: SITE.name,
    url: SITE.url,
    telephone: SITE.phoneE164,
    description: SITE.tagline,
    image: `${SITE.url}${BRAND}/images/og-image-1200x630.jpg`,
    logo: `${SITE.url}${BRAND}/logo/icon-512.png`,
    priceRange: "$$",
    address: { "@type": "PostalAddress", addressLocality: "Midlothian", addressRegion: "VA", addressCountry: "US" },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Chesterfield County, Virginia" },
      ...TOWNS_CONTENT.map((t) => ({ "@type": "Place", name: `${t.name}, VA` })),
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Yard care services",
      itemListElement: SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.label, url: `${SITE.url}/services/${s.slug}` } })),
    },
    ...(sameAs.length ? { sameAs } : {}),
    ...(SITE.email ? { email: SITE.email } : {}),
  };
}

export function serviceSchema(slug: string, name: string, description: string, area?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: name,
    description,
    url: `${SITE.url}/services/${slug}`,
    provider: { "@id": BIZ_ID },
    areaServed: area ? { "@type": "Place", name: area } : { "@type": "AdministrativeArea", name: "Chesterfield County, Virginia" },
  };
}
