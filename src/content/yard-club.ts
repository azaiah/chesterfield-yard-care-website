// Yard Club tiers — names, contents and prices are DRAFTS until the owner confirms (CONFIRM_WITH_OWNER.md).
export const PLANS = [
  {
    id: "mow-club",
    name: "Mow Club",
    tagline: "The lawn, handled.",
    price: null as string | null,
    features: ["Weekly or biweekly mowing, April–November", "String-trimming and hard edging", "Clippings blown off drives and walks", "Same day each week, rain-delay texts"],
    featured: false,
  },
  {
    id: "full-season",
    name: "Full Season",
    tagline: "One crew, every season.",
    price: null as string | null,
    features: ["Everything in Mow Club", "Spring bed cleanup + fresh mulch", "Fall core aeration + overseeding", "Fall leaf cleanup with haul-away", "First dibs on storm-cleanup slots"],
    featured: true,
  },
  {
    id: "estate",
    name: "Estate",
    tagline: "Everything, first in line.",
    price: null as string | null,
    features: ["Everything in Full Season", "Second leaf cleanup after the oaks drop", "Winter limb & brush haul-away", "Shrub trimming twice a year", "Priority scheduling all year"],
    featured: false,
  },
];

export const CALENDAR = [
  { season: "spring", months: "Mar–May", image: "season-spring", items: ["Spring cleanup", "Fresh mulch & edges", "Mowing starts weekly"] },
  { season: "summer", months: "Jun–Aug", image: "season-summer", items: ["Mowing at summer height", "Edging & trimming", "Storm cleanup on call"] },
  { season: "fall", months: "Sep–Nov", image: "season-fall", items: ["Aeration & overseeding", "Leaf cleanups", "Final mows"] },
  { season: "winter", months: "Dec–Feb", image: "season-winter", items: ["Late oak-leaf cleanup", "Pruning & limb removal", "Junk & brush haul-away"] },
] as const;
