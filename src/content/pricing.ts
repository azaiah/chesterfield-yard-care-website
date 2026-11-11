// PLACEHOLDER pricing for the instant estimator. The owner sets real ranges in the portal (price_book, Phase 3).
// While `placeholder` is true the UI labels every number as a sample and never as a firm price.
// Ranges are per visit (or per job) in USD for a quarter-acre lot; size multipliers scale them.

export type SizeKey = "quarter" | "half" | "acre" | "more";
export type FreqKey = "once" | "biweekly" | "weekly";

export const PRICING = {
  placeholder: true,
  services: {
    mowing: { label: "Mowing", base: [45, 60], unit: "per visit", recurring: true },
    "mulch-gravel": { label: "Mulch & Gravel", base: [250, 450], unit: "per job", recurring: false },
    "leaf-cleanup": { label: "Leaf Cleanup", base: [175, 325], unit: "per cleanup", recurring: false },
    "tree-work": { label: "Tree Work", base: [200, 500], unit: "per job", recurring: false },
    aeration: { label: "Aeration + Seed", base: [150, 250], unit: "per job", recurring: false },
    "junk-removal": { label: "Junk Removal", base: [150, 400], unit: "per load", recurring: false },
    "yard-makeovers": { label: "Full Cleanup", base: [400, 900], unit: "per job", recurring: false },
  } as Record<string, { label: string; base: [number, number]; unit: string; recurring: boolean }>,
  size: { quarter: 1, half: 1.6, acre: 2.6, more: 3.8 } as Record<SizeKey, number>,
  sizeLabel: { quarter: "¼ acre or less", half: "About ½ acre", acre: "About 1 acre", more: "More than 1 acre" } as Record<SizeKey, string>,
  // Discount on recurring services (mowing) by frequency
  frequency: { once: 1, biweekly: 1, weekly: 0.92 } as Record<FreqKey, number>,
  frequencyLabel: { once: "One-time", biweekly: "Every 2 weeks", weekly: "Every week" } as Record<FreqKey, string>,
};

export function estimate(services: string[], size: SizeKey, freq: FreqKey) {
  const lines = services
    .map((s) => {
      const p = PRICING.services[s];
      if (!p) return null;
      const m = PRICING.size[size] * (p.recurring ? PRICING.frequency[freq] : 1);
      const round = (n: number) => Math.round((n * m) / 5) * 5;
      return { slug: s, label: p.label, unit: p.recurring && freq !== "once" ? "per visit" : p.unit, low: round(p.base[0]), high: round(p.base[1]) };
    })
    .filter((x): x is NonNullable<typeof x> => !!x);
  return { lines, low: lines.reduce((a, l) => a + l.low, 0), high: lines.reduce((a, l) => a + l.high, 0) };
}
