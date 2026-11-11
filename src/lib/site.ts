// Single source of truth for business facts.
// Anything marked `confirmed: false` is unverified — render it with <Pending>, never as fact.
// See content/CONFIRM_WITH_OWNER.md.

export const BRAND = "/media/brand";

export const SITE = {
  name: "Chesterfield Yard Care",
  // Every share link, canonical and sitemap entry points here, even on deploy previews or if the env var is missing.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://chesterfield-yard-care-website.netlify.app").replace(/\/$/, ""),
  tagline: "Local and hard-working to meet all your yard care needs.",
  phone: "804-773-8271",
  phoneE164: "+18047738271",
  region: "Chesterfield County & Midlothian, VA",
  // Unverified until the owner confirms — keep `null` so the UI shows a placeholder.
  email: null as string | null,
  hours: null as string | null,
  facebookUrl: null as string | null,
  googleBusinessUrl: null as string | null,
  ownerName: { value: "Breydon Robertson", confirmed: false },
  yearsInBusiness: { value: null as number | null, confirmed: false },
  insured: { value: null as boolean | null, confirmed: false },
  electricEquipment: { value: "Greenworks commercial electric zero-turn", confirmed: false },
} as const;

export const TEL = `tel:${SITE.phoneE164}`;
// iOS reads "&body=", Android reads "?body=" — "?&body=" works on both.
export const SMS_QUOTE_BODY = "Hi! I'd like a free quote. My address is: ";
export const SMS = `sms:${SITE.phoneE164}?&body=${encodeURIComponent(SMS_QUOTE_BODY)}`;

export const SERVICES = [
  { slug: "mowing", label: "Mowing", badge: "badge-mowing", photo: "svc-mowing", blurb: "Crisp stripes, clean edges, clippings blown off every walk." },
  { slug: "mulch-gravel", label: "Mulch & Gravel", badge: "badge-mulch-gravel", photo: "svc-mulch-gravel", blurb: "Fresh beds, spade-cut edges, river rock that stays put." },
  { slug: "leaf-cleanup", label: "Leaf Cleanup & Removal", badge: "badge-leaf-cleanup", photo: "svc-leaf-cleanup", blurb: "Full cleanups and curbside removal all season." },
  { slug: "tree-work", label: "Tree Work", badge: "badge-tree-work", photo: "svc-tree-work", blurb: "Pruning, limb removal and storm cleanup." },
  { slug: "aeration", label: "Aerating", badge: "badge-aeration", photo: "svc-aeration", blurb: "Core aeration and overseeding for thicker fescue." },
  { slug: "junk-removal", label: "Junk Removal", badge: "badge-junk-removal", photo: "svc-junk-removal", blurb: "Brush, debris, old fencing — hauled away." },
  { slug: "yard-makeovers", label: "Anything Your Yard Needs", badge: "badge-anything", photo: "svc-yard-makeovers", blurb: "One call for the whole property." },
] as const;

export type Service = (typeof SERVICES)[number];

export const TOWNS = [
  "Midlothian", "Chester", "Chesterfield Court House", "North Chesterfield", "Moseley", "Brandermill",
  "Woodlake", "Bon Air", "Swift Creek", "Matoaca", "Ettrick", "Enon",
] as const;

/** Month-driven seasonal message (announcement bar, seasonal module). */
export function seasonFor(date = new Date()) {
  const m = date.getMonth(); // 0 = Jan
  if (m >= 9 && m <= 11) return { key: "fall", bar: "🍂 Leaf season is here — free quotes on full cleanups & curbside removal" } as const;
  if (m <= 1) return { key: "winter", bar: "Winter is tree-work season — free quotes on limb removal & junk haul-away" } as const;
  if (m <= 4) return { key: "spring", bar: "Spring cleanup & fresh mulch — book your free quote now" } as const;
  return { key: "summer", bar: "Mowing slots open — weekly & biweekly service across Chesterfield" } as const;
}
