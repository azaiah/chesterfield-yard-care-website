// REAL proof only. Leave these empty until the owner supplies real photos / real reviews.
// Gallery photos live in public/media/work/ (owner's own job photos). Phase 3 feeds approved portal photos here.

export type WorkPhoto = { src: string; alt: string; width: number; height: number; service?: string; town?: string };
export type BeforeAfterPair = { before: string; after: string; alt: string; width: number; height: number; service?: string };
export type Review = { author: string; rating: 1 | 2 | 3 | 4 | 5; text: string; date: string; source: "google" | "facebook" | "nextdoor"; url?: string };

export const WORK_PHOTOS: WorkPhoto[] = [];
export const BEFORE_AFTER: BeforeAfterPair[] = [];
export const REVIEWS: Review[] = [];
