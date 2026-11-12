// Service page content. Local, practical, honest — no invented credentials, prices or stats.
import type { Service } from "@/lib/site";

export type QA = { q: string; a: string };
export type ServiceContent = {
  slug: Service["slug"];
  h1: string;
  accent: string;
  seoTitle: string;
  metaDescription: string;
  intro: string;
  included: string[];
  timing: { heading: string; body: string[] };
  sections: { h: string; p: string[] }[];
  process: string[];
  faqs: QA[];
  related: Service["slug"][];
  season: ("spring" | "summer" | "fall" | "winter")[];
};

export const SERVICE_CONTENT: ServiceContent[] = [
  {
    slug: "mowing",
    h1: "Lawn mowing in",
    accent: "Chesterfield",
    seoTitle: "Lawn Mowing in Midlothian & Chesterfield, VA",
    metaDescription:
      "Weekly and biweekly lawn mowing in Midlothian and Chesterfield County: clean stripes, sharp edges, clippings blown off. Call or text 804-773-8271 for a free quote.",
    intro:
      "A good mow is more than short grass. It's the right height for the season, a clean edge along the driveway and walks, clippings blown off the hard surfaces, and a crew that shows up on the same day every week so you never have to think about it.",
    included: [
      "Mowing at the right height for fescue (taller in summer heat)",
      "String-trimming around beds, fences, mailboxes and trees",
      "Hard edging along driveways, sidewalks and curbs",
      "Blowing clippings off drives, walks, patios and porches",
      "Weekly or biweekly visits on a set day",
      "A heads-up text if weather pushes your day",
    ],
    timing: {
      heading: "Mowing season in Central Virginia",
      body: [
        "Most Chesterfield lawns are tall fescue, a cool-season grass. It grows hard in spring, slows down in the July–August heat, then picks back up in fall. Mowing usually runs from late March or early April through November, with weekly cuts in the spring flush and biweekly often enough in the dry stretch of summer.",
        "In summer we raise the deck. Fescue cut at 3½–4 inches shades its own roots, holds moisture in our red clay, and crowds out crabgrass. Scalping a fescue lawn in July is the fastest way to brown it out by August.",
      ],
    },
    sections: [
      {
        h: "Why stripes and edges matter",
        p: [
          "Stripes come from mowing in clean, straight passes and alternating direction. They're a sign the job was done carefully, not just quickly. Changing the pattern from visit to visit also keeps the grass from leaning one way and stops ruts from forming.",
          "Edging is what makes a yard look finished. A crisp line along the concrete and around beds reads as \"cared for\" from the street, even before anyone notices the grass.",
        ],
      },
      {
        h: "Weekly vs. biweekly",
        p: [
          "Weekly service keeps the lawn at a steady height and is best from April through June, when fescue can grow an inch or more in a few days. Biweekly works for smaller or slower lawns, or during summer slowdowns. We'll tell you honestly which fits your yard. Recurring mowing is also the base of our Yard Club plans.",
        ],
      },
    ],
    process: [
      "Text a photo or tell us your address — we'll quote from a quick look.",
      "Pick weekly or biweekly and your start date.",
      "We mow, trim, edge and blow every visit, on the same day each week.",
    ],
    faqs: [
      { q: "How short should I cut tall fescue in summer?", a: "Leave it tall — about 3½ to 4 inches. Taller fescue handles heat and drought far better than a short cut, and it shades out weeds." },
      { q: "Do you bag clippings?", a: "Usually not. Mulching clippings back into the lawn returns nutrients. If the grass got too long or you'd prefer bagging, just ask." },
      { q: "What if it rains on my mowing day?", a: "We'll text you and move to the next workable day. Mowing soaked fescue tears the blades and ruts the lawn." },
      { q: "Do I need to be home?", a: "No. Just let us know about gates, pets or anything in the yard we should watch for." },
    ],
    related: ["leaf-cleanup", "aeration", "mulch-gravel"],
    season: ["spring", "summer"],
  },
  {
    slug: "mulch-gravel",
    h1: "Mulch & gravel in",
    accent: "Midlothian",
    seoTitle: "Mulch & Gravel Installation in Midlothian, VA",
    metaDescription:
      "Fresh mulch, crisp bed edges and river rock or gravel installation across Midlothian and Chesterfield County. Free quotes — call or text 804-773-8271.",
    intro:
      "Fresh mulch is the quickest way to make a whole property look sharp. Dark, even beds with a clean edge frame the house, hold moisture through a Virginia summer and keep weeds down. Gravel and river rock do the same job where you want something that lasts for years.",
    included: [
      "Bed cleanup — weeds, leaves and debris out first",
      "Spade-cut natural edges or re-cut existing ones",
      "Mulch installed at a proper 2–3 inch depth",
      "Mulch pulled back from trunks and siding (no \"volcanoes\")",
      "River rock, pea gravel or stone borders and drainage areas",
      "Landscape fabric under stone where it makes sense",
      "Cleanup of walks and drives when we're done",
    ],
    timing: {
      heading: "When to mulch in Central Virginia",
      body: [
        "Spring, from about mid-March through April, is the most popular time. Beds are cleaned out from winter, perennials haven't filled in yet, and fresh mulch locks in moisture before the summer heat. A fall top-up after leaf cleanup is also a good idea, as it insulates roots through winter and the beds look finished all season.",
      ],
    },
    sections: [
      {
        h: "Mulch vs. gravel: which is right?",
        p: [
          "Mulch feeds the soil as it breaks down, keeps roots cool and looks natural around shrubs and perennials. It needs a refresh every year or so. Gravel and river rock don't break down, so they're great for side yards, around AC units, along foundations where you want drainage, and in spots where mulch keeps washing out after heavy rain.",
          "Plenty of Chesterfield yards use both: mulch in the planted beds, stone in the hard-working spots. We'll walk through which areas suit which.",
        ],
      },
      {
        h: "Depth and edges",
        p: [
          "More mulch isn't better. Two to three inches does the job. Piling it against tree trunks or the house invites rot, insects and moisture problems. A clean spade-cut edge keeps mulch in the bed and grass out of it, and it's the detail that makes the job look professional.",
        ],
      },
    ],
    process: [
      "Send a photo of your beds or book a quick look.",
      "Choose mulch color or stone type, and we'll quote by the job.",
      "We clean, edge, install and tidy up the same day for most yards.",
    ],
    faqs: [
      { q: "How often should mulch be replaced?", a: "Most beds need a fresh top layer once a year. You rarely need to remove old mulch. Just rake it loose and top-dress to keep the total depth around 2–3 inches." },
      { q: "What mulch colors can I choose?", a: "Common choices are dark brown, black and natural hardwood. Tell us what you like and we'll match or refresh what you have." },
      { q: "Will gravel stop weeds completely?", a: "It helps a lot, especially over fabric, but windblown seeds can still sprout on top. An occasional pull keeps it clean." },
      { q: "Can you fix a spot where mulch keeps washing out?", a: "Yes. Often a stone border, river rock channel or re-graded edge solves it. Send a photo after a rain if you can." },
    ],
    related: ["yard-makeovers", "leaf-cleanup", "mowing"],
    season: ["spring", "fall"],
  },
  {
    slug: "leaf-cleanup",
    h1: "Leaf cleanup & removal in",
    accent: "Chesterfield",
    seoTitle: "Leaf Removal in Midlothian & Chesterfield, VA",
    metaDescription:
      "Full leaf cleanups and curbside removal in Midlothian and Chesterfield County. Lawns, beds, gutters-level clean. Free quotes all season — call or text 804-773-8271.",
    intro:
      "Chesterfield is full of oaks, maples, poplars and sweetgums, which is beautiful in October and a lot of leaves in November. A thick layer left on fescue through winter smothers the grass, invites mold and leaves bare patches in spring. We clear lawns and beds and haul the leaves away, or leave them neatly at the curb, whichever you prefer.",
    included: [
      "Leaves blown and raked out of lawns, beds and borders",
      "Leaves cleared from driveways, walks, patios and decks",
      "Haul-away, or tidy curbside piles where your neighborhood allows",
      "One-time cleanups or multiple visits through the fall",
      "Leaves cleared off roofs and out of gutters",
      "Final late-season visit for oaks that drop in December",
      "Optional bed tidy-up and mulch top-dress afterward",
    ],
    timing: {
      heading: "When leaves fall around Richmond",
      body: [
        "Leaf drop in the Richmond area usually peaks from late October through November. Maples and poplars go first, then the oaks, which often hang on into December. That's why many homeowners book two visits: one at peak drop, one after the oaks finish.",
        "Don't wait until spring. Matted wet leaves over winter can kill patches of fescue and give you a muddy start to the season.",
      ],
    },
    sections: [
      {
        h: "What happens to the leaves in Chesterfield?",
        p: [
          "Most Chesterfield neighborhoods don't have county curbside leaf pickup, so leaves need to be hauled off, bagged for a private hauler, or taken to a county convenience center that accepts yard waste. Rules and hours change, so check Chesterfield County's convenience-center page before you load up the car.",
          "The easy option: we take them away for you. If your HOA or hauler handles curbside piles or bags, we can leave them neat and ready instead. Just tell us when you ask for a quote.",
        ],
      },
      {
        h: "Leaf cleanup + aeration: a smart fall pairing",
        p: [
          "Fall is also the best season to core-aerate and overseed fescue. Clearing leaves first lets seed reach the soil and get light. If you're thinking about thickening up your lawn, ask about doing both.",
        ],
      },
    ],
    process: [
      "Text a photo of the yard. Leaf season quotes are free.",
      "Pick a one-time cleanup or a couple of fall visits.",
      "We clear it all and haul away or leave tidy curbside piles.",
    ],
    faqs: [
      { q: "How much does leaf removal cost?", a: "It depends on lot size, tree cover and whether we haul the leaves away. Text us a photo and your address and we'll send a free quote, usually the same day." },
      { q: "Do you take the leaves with you?", a: "We can. Haul-away is the most popular option. If your hauler or HOA takes curbside piles or bags, we can leave them ready at the curb instead." },
      { q: "Should I wait until all the leaves are down?", a: "One visit after everything drops is cheapest, but heavy layers can damage your lawn while you wait. Two visits (peak drop and after the oaks) keeps the grass healthy." },
      { q: "Can you clean leaves out of beds without blowing the mulch away?", a: "Yes. Beds are cleared by hand-raking and low-power blowing so the mulch stays put." },
      { q: "Do you clear leaves off the roof and out of the gutters?", a: "Yes. We get leaves off roofs and out of gutters as part of a cleanup, so the next big rain drains the way it should." },
    ],
    related: ["aeration", "mulch-gravel", "junk-removal"],
    season: ["fall"],
  },
  {
    slug: "tree-work",
    h1: "Tree work &",
    accent: "storm cleanup",
    seoTitle: "Tree Trimming & Limb Removal in Chesterfield, VA",
    metaDescription:
      "Tree trimming, limb removal, small tree removal and storm cleanup in Midlothian and Chesterfield County. Free quotes — call or text 804-773-8271.",
    intro:
      "Overgrown limbs over the roof, branches scraping the car, a crape myrtle that's swallowed the front window, or a yard full of debris after a summer storm. We handle the everyday tree work that keeps a property safe and tidy, and we haul everything away when we're done.",
    included: [
      "Pruning and shaping of small and ornamental trees",
      "Raising canopies off roofs, driveways and walkways",
      "Removing dead, broken or hanging limbs",
      "Small tree and shrub removal",
      "Storm debris cleanup and limb haul-away",
      "Brush cutting along fence lines and wood edges",
    ],
    timing: {
      heading: "Best timing for tree work in Central Virginia",
      body: [
        "Late winter (roughly January through early March) is ideal for most pruning. Trees are dormant, you can see the structure without leaves, and cuts heal fast when spring growth starts. That's also the right time to prune crape myrtles: thin and shape them, don't chop them to stumps.",
        "Storm cleanup can't wait for a season. After summer thunderstorms or the remnants of a tropical system, call or text a photo and we'll get you on the list.",
      ],
    },
    sections: [
      {
        h: "Know what you're dealing with",
        p: [
          "Every tree job starts with an honest look. Many jobs, like limbs over a roof, dead branches or an overgrown ornamental, are straightforward. Large removals right next to a house or near power lines can need specialty equipment. We'll tell you up front what the job really needs. If a limb is touching a power line, call Dominion Energy first.",
        ],
      },
      {
        h: "Please don't top your crape myrtles",
        p: [
          "Cutting crape myrtles back to bare knuckles every winter is common around Richmond, but it weakens the tree and gives you floppy, top-heavy growth. Selective thinning keeps the natural shape and still gives you plenty of summer blooms.",
        ],
      },
    ],
    process: [
      "Text photos of the trees or limbs. Wide shots help.",
      "We quote the work and the haul-away together.",
      "We cut, clean up and leave the yard tidy.",
    ],
    faqs: [
      { q: "Do you remove whole trees?", a: "We handle small tree removals and the cleanup that goes with them. For large trees right over a house or near power lines, we'll be straight with you about whether it needs specialty equipment." },
      { q: "When is the best time to prune?", a: "Late winter, while trees are dormant, is best for most species, crape myrtles included. Dead or dangerous limbs can come off any time." },
      { q: "Do you haul away the branches?", a: "Yes. Limbs and brush are hauled off as part of the job unless you'd like to keep firewood." },
      { q: "Can you help after a storm?", a: "Yes. Text a photo of the damage and your address. If anything is on a power line, stay clear and call the utility first." },
    ],
    related: ["junk-removal", "leaf-cleanup", "yard-makeovers"],
    season: ["winter", "summer"],
  },
  {
    slug: "aeration",
    h1: "Aeration &",
    accent: "overseeding",
    seoTitle: "Lawn Aeration & Overseeding in Midlothian, VA",
    metaDescription:
      "Core aeration and overseeding for fescue lawns in Midlothian and Chesterfield County. Best done in early fall. Free quotes — call or text 804-773-8271.",
    intro:
      "Chesterfield's red clay packs down hard. Compacted soil chokes roots, sheds water and leaves fescue thin and patchy by late summer. Core aeration pulls thousands of small plugs out of the lawn so air, water and seed can get down to the roots. Paired with overseeding, it's the single best thing you can do for a thin fescue lawn.",
    included: [
      "Core aeration (plugs pulled, not just spiked)",
      "Overseeding with a turf-type tall fescue blend",
      "Extra seed on thin and bare spots",
      "Plugs left to break down and return to the soil",
      "Simple watering instructions for new seed",
    ],
    timing: {
      heading: "When to aerate and overseed in Central Virginia",
      body: [
        "For cool-season fescue, early fall is the sweet spot: roughly late August through early October. Soil is still warm enough for fast germination, nights are cooler, and the new grass has two growing seasons (fall and spring) to establish before the next summer heat.",
        "Spring aeration can help with compaction, but spring-seeded fescue often struggles through its first Virginia summer. Fall is worth the wait.",
      ],
    },
    sections: [
      {
        h: "Signs your lawn needs aeration",
        p: [
          "Water puddles or runs off instead of soaking in. The ground feels rock-hard. Grass is thin even though you mow and water. Heavy foot traffic from kids or dogs has worn paths. If a screwdriver won't push into moist soil easily, the lawn is compacted.",
        ],
      },
      {
        h: "Watering new seed",
        p: [
          "New seed needs to stay lightly moist, not soaked: short waterings once or twice a day for the first couple of weeks, then deeper and less often as it fills in. Hold off on leaf blowing and heavy traffic over new seed. We'll coordinate with your fall leaf cleanup so the seedlings aren't smothered.",
        ],
      },
    ],
    process: [
      "Book in late summer to hold an early-fall slot.",
      "Mow short-ish and water the day before (we'll remind you).",
      "We aerate, overseed and leave you a watering plan.",
    ],
    faqs: [
      { q: "Should I pick up the aeration plugs?", a: "No. Leave them. They break down in a week or two of rain and mowing and put soil back into the surface." },
      { q: "How soon can I mow after overseeding?", a: "Wait until the new grass is about 3½–4 inches tall, usually two to three weeks, and mow with a sharp blade." },
      { q: "Is aeration worth it every year?", a: "For clay soil and lawns with kids, dogs or heavy traffic, yearly fall aeration pays off. Healthier lawns can go every other year." },
      { q: "Can you aerate if I have an irrigation system?", a: "Yes. Flag your sprinkler heads (or we can) so we steer around them." },
    ],
    related: ["mowing", "leaf-cleanup", "mulch-gravel"],
    season: ["fall"],
  },
  {
    slug: "junk-removal",
    h1: "Yard junk",
    accent: "hauled away",
    seoTitle: "Yard Debris & Junk Removal in Chesterfield, VA",
    metaDescription:
      "Brush, storm debris, old fencing, playsets and yard junk hauled away in Midlothian and Chesterfield County. Free quotes — call or text 804-773-8271.",
    intro:
      "The brush pile behind the shed. The old fence panels. A rotted playset, broken pavers, a pile of limbs from the last storm. Send us a photo, get a price, and it's gone. We load it, haul it, and sweep up after.",
    included: [
      "Brush, limbs and yard waste piles",
      "Storm debris cleanup",
      "Old fencing, lattice, landscape timbers",
      "Playsets, trampolines and outdoor furniture",
      "Broken pavers, edging, pots and garden debris",
      "Shed and garage clean-outs (yard-related items)",
    ],
    timing: {
      heading: "When people book junk removal",
      body: [
        "Any time of year. It's especially popular in winter, when there's no mowing and it's a good time to clear out the corners of the yard, and right after storms. It's also common before a home goes on the market or after a move-out.",
      ],
    },
    sections: [
      {
        h: "Priced by the load, quoted from a photo",
        p: [
          "Most junk jobs can be quoted from a couple of photos and a rough idea of size. Is it a pickup-bed's worth, half a trailer or more? No surprise fees after the fact. If it's more than it looked, we'll talk before we load it.",
        ],
      },
      {
        h: "What we can't take",
        p: [
          "Paint, chemicals, fuel, tires and other hazardous materials need special disposal. Chesterfield County runs household hazardous waste collection, so check the county's site for current drop-off options.",
        ],
      },
    ],
    process: [
      "Text photos of what needs to go.",
      "Get a price based on the load.",
      "We haul it off and sweep up.",
    ],
    faqs: [
      { q: "Do I need to be home?", a: "Not if it's all outside and clearly marked. Just point out exactly what goes and what stays." },
      { q: "Can you take a whole shed?", a: "Smaller sheds, often. Larger ones may need demolition first. Send photos and we'll tell you." },
      { q: "Do you haul away indoor furniture?", a: "Our focus is yard and outdoor items, but ask. We may be able to add a few pieces to a yard job." },
      { q: "How fast can you come?", a: "Text a photo and your address and we'll let you know the next opening." },
    ],
    related: ["tree-work", "leaf-cleanup", "yard-makeovers"],
    season: ["winter", "spring", "summer", "fall"],
  },
  {
    slug: "yard-makeovers",
    h1: "Anything your",
    accent: "yard needs",
    seoTitle: "Full Yard Cleanups & Makeovers in Chesterfield, VA",
    metaDescription:
      "One call for the whole property: overgrown yard cleanups, bed renovations, move-in/move-out cleanups and curb appeal for listings in Midlothian & Chesterfield. Call or text 804-773-8271.",
    intro:
      "Some yards need more than one service. Maybe it's a rental that got away from the last tenant, a new house with builder-grade beds, a home getting ready to list, or a property that just needs to be brought back. We pull it all together under one quote and one crew.",
    included: [
      "Overgrown yard and lot cleanups",
      "Bed renovation: clear out, re-edge, re-mulch",
      "Shrub trimming and shaping",
      "Curb-appeal refresh before listing a home",
      "Move-in and move-out yard cleanups",
      "Ongoing care afterward through a Yard Club plan",
    ],
    timing: {
      heading: "Any season, with a plan",
      body: [
        "Big cleanups can happen any time of year. The best timing for the details depends on the season: mulch and plantings in spring, aeration and seed in early fall, heavy pruning in late winter. We'll lay out a simple plan that does the right step at the right time.",
      ],
    },
    sections: [
      {
        h: "Selling or just bought?",
        p: [
          "First impressions start at the curb. Fresh mulch, sharp edges, trimmed shrubs and a clean, striped lawn make listing photos pop. If you just moved into a new build in western Chesterfield, we can turn thin builder landscaping into beds and a lawn you're proud of.",
        ],
      },
      {
        h: "Overgrown or vacant property",
        p: [
          "Chesterfield County has rules about tall grass and weeds, and they apply to vacant homes too. We can get an overgrown lot back under control and keep it that way with regular visits.",
        ],
      },
    ],
    process: [
      "Walk us through it with photos or a quick visit.",
      "Get one clear quote for the whole job.",
      "We knock it out and keep it looking good if you'd like.",
    ],
    faqs: [
      { q: "Can you quote a big job from photos?", a: "Often, yes. For larger properties we may stop by for a quick look so the quote is accurate." },
      { q: "Do you work for landlords and property managers?", a: "Yes. Move-out cleanups, overgrown rentals and recurring service between tenants." },
      { q: "Do you plant shrubs and flowers?", a: "Tell us what you have in mind. We'll let you know what we can take on as part of a bed refresh." },
      { q: "Can you handle a property that hasn't been touched in a year?", a: "That's exactly what this service is for. Send photos and we'll make a plan." },
    ],
    related: ["mulch-gravel", "junk-removal", "mowing"],
    season: ["spring", "summer", "fall", "winter"],
  },
  {
    slug: "christmas-lights",
    h1: "Christmas light",
    accent: "installation",
    seoTitle: "Christmas Light Installation in Chesterfield & Midlothian, VA",
    metaDescription:
      "Professional Christmas light installation in Chesterfield County and Midlothian: rooflines, gutters, trees, shrubs and walkways. No ladders for you. Call or text 804-773-8271 for a free quote.",
    intro:
      "Skip the ladder, the tangled strands and the cold fingers. We hang your Christmas lights on the roofline, wrap the trees, light the shrubs and walkways, and make the whole yard glow. Your house, your design, lit up the way you pictured it.",
    included: [
      "Rooflines, gutters, peaks and windows",
      "Tree wrapping: trunks, branches and full canopies",
      "Shrubs, hedges and walkway lights",
      "Your lights or ours. Tell us which when you ask for a quote",
      "Timers set so it all turns on by itself",
      "Clean, safe clips. No staples, no nails in your trim",
      "Take-down after the holidays (just ask)",
    ],
    timing: {
      heading: "When to book holiday lights",
      body: [
        "Installs usually run from early November through mid-December. The earlier you book, the better your pick of dates. Most people want everything lit by Thanksgiving weekend.",
        "We can come back after New Year's to take it all down and pack it up for next year.",
      ],
    },
    sections: [
      {
        h: "Your design, done right",
        p: [
          "Classic warm white on the roofline, colored lights in the trees, a fully wrapped oak out front. Send a photo of the house and tell us what you're picturing, and we'll quote the whole look.",
        ],
      },
      {
        h: "Safer than doing it yourself",
        p: [
          "Every winter people get hurt hanging lights from ladders on cold, slick roofs. Let a crew that's on ladders all year do it. We use proper clips that don't damage shingles or gutters.",
        ],
      },
    ],
    process: [
      "Text a photo of your house and what you want lit.",
      "Get a free quote for install (and take-down if you want it).",
      "We hang it, set the timer, and you flip nothing.",
    ],
    faqs: [
      { q: "Do I need to buy the lights?", a: "Either way works. We can install lights you already own, or quote the job with lights included." },
      { q: "Will you take them down after the holidays?", a: "Yes. Add take-down to your quote and we'll come back after New Year's, take everything down and pack it up." },
      { q: "Can you wrap big trees?", a: "Yes. Trunks, branches or full canopies. Send a photo and we'll quote it." },
      { q: "When should I book?", a: "Early November is ideal. Dates fill up the closer it gets to Thanksgiving and December." },
    ],
    related: ["leaf-cleanup", "tree-work", "yard-makeovers"],
    season: ["fall", "winter"],
  },
  {
    slug: "sod-leveling",
    h1: "Sod install &",
    accent: "yard leveling",
    seoTitle: "Sod Installation & Yard Leveling in Chesterfield, VA",
    metaDescription:
      "Yard leveling, grading and new sod installation in Chesterfield County and Midlothian. Fix bumps, low spots and bare yards fast. Call or text 804-773-8271 for a free quote.",
    intro:
      "Bumpy, patchy or bare? Seed takes a season; sod gives you a finished lawn the day we leave. We level the yard first, fixing the low spots, ruts and humps, then roll out fresh turf in tight seams so it knits together into one smooth lawn.",
    included: [
      "Clearing old, dead or weedy turf",
      "Leveling and grading: low spots, ruts, humps",
      "Topsoil where the ground needs it",
      "Fresh sod laid in tight, staggered seams",
      "Rolling for good root contact",
      "Watering plan for the first few weeks",
    ],
    timing: {
      heading: "Best time for new sod in Central Virginia",
      body: [
        "Fescue sod roots best in fall and spring, when it's cool and moist. You can lay sod in summer too, it just needs more water. Leveling and grading can happen almost any time the ground isn't frozen or soaked.",
      ],
    },
    sections: [
      {
        h: "Why level first",
        p: [
          "Sod on a lumpy yard gives you a lumpy lawn. Low spots hold water and drown grass; humps get scalped by the mower. Getting the grade right first is what makes a new lawn look professional for years.",
        ],
      },
      {
        h: "Watering new sod",
        p: [
          "Keep it soaked for the first couple of weeks: water daily so the soil under the sod stays wet. Once it has rooted (you can't lift a corner), water deeper and less often. We'll leave you a simple schedule.",
        ],
      },
    ],
    process: [
      "Send photos of the yard (wide shots help).",
      "Get a quote for leveling, soil and sod.",
      "We grade it, lay it, and leave you a watering plan.",
    ],
    faqs: [
      { q: "How soon can I walk on new sod?", a: "Keep traffic light for about two weeks while it roots. After the first mow it's ready for normal use." },
      { q: "Can you just level a few low spots?", a: "Yes. Small fixes with topsoil and seed or a few rolls of sod are common. Send a photo." },
      { q: "Sod or seed?", a: "Seed is cheaper but takes a full season to fill in. Sod is an instant lawn. We'll tell you honestly which fits your yard and budget." },
      { q: "What about drainage problems?", a: "Grading fixes a lot of puddling. If water needs to go somewhere specific, we'll talk through options like a gravel channel." },
    ],
    related: ["aeration", "mowing", "yard-makeovers"],
    season: ["spring", "summer", "fall"],
  },
];

export const serviceContent = (slug: string) => SERVICE_CONTENT.find((s) => s.slug === slug);
