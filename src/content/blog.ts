// Starter posts targeting real local search intent. Practical advice, no invented stats.
import type { Service } from "@/lib/site";

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  image: string; // brand image base name
  service: Service["slug"];
  sections: { h?: string; p?: string[]; list?: string[] }[];
};

export const POSTS: Post[] = [
  {
    slug: "fall-leaf-cleanup-chesterfield-county",
    title: "Fall leaf cleanup in Chesterfield County: timing, options and where leaves go",
    description: "When leaves peak around Richmond, why you shouldn't leave them on fescue all winter, and your options for getting rid of them in Chesterfield County.",
    date: "2026-11-11",
    image: "leaf-season",
    service: "leaf-cleanup",
    sections: [
      { p: ["Every fall, Chesterfield's oaks, maples, poplars and sweetgums drop a remarkable amount of leaves. They look great on the trees and terrible matted down on a fescue lawn in February. Here's how to plan your leaf cleanup so the lawn comes out of winter healthy."] },
      { h: "When do leaves fall around Richmond?", p: ["Leaf drop in the Richmond area usually peaks from late October through November. Maples, poplars and sweetgums tend to go first. Oaks hold on longest, and many drop well into December. If your yard is oak-heavy, plan on a second cleanup after Thanksgiving."] },
      { h: "Why not just leave them?", p: ["A thin scattering of leaves can be mulched into the lawn with a mower. A thick layer is different. It blocks light, traps moisture, and smothers fescue right when it should be storing energy for winter. The result is thin, patchy or moldy spots in spring."] },
      { h: "Your options for getting rid of leaves", list: [
        "Mulch-mow light layers back into the lawn. This works when you can still see grass through the leaves.",
        "Bag them for your private trash hauler, if your hauler accepts yard waste. Check their rules first.",
        "Haul them to a Chesterfield County convenience center that accepts yard waste. Check the county website for current locations, hours and rules.",
        "Compost them, or use shredded leaves as mulch in beds.",
        "Have a crew clear lawns and beds and haul everything away.",
      ] },
      { h: "One visit or two?", p: ["One cleanup after everything drops is the cheapest option, but if you have heavy tree cover, the lawn sits under a thick layer for weeks while you wait. Two visits, one at peak drop and one after the oaks finish, is easier on the grass and keeps the yard looking cared for through the holidays."] },
      { h: "Pair it with aeration", p: ["Early fall is also the best time to core-aerate and overseed fescue. If you're seeding, keep leaves off the new grass so it gets light. A cleanup crew that knows your seeding schedule can time visits so seedlings aren't smothered or blown away."] },
    ],
  },
  {
    slug: "when-to-aerate-and-overseed-central-virginia",
    title: "When to aerate and overseed in Central Virginia",
    description: "Why early fall is the best window for core aeration and overseeding fescue lawns around Richmond and Chesterfield, and how to water new seed.",
    date: "2026-11-11",
    image: "svc-aeration",
    service: "aeration",
    sections: [
      { p: ["Most lawns in Chesterfield County are tall fescue, a cool-season grass that grows best in spring and fall. Our red clay soil compacts easily, which is why so many fescue lawns look thin by the end of summer. Core aeration plus overseeding is the fix, and timing is everything."] },
      { h: "The best window: early fall", p: ["Aim for roughly late August through early October. The soil is still warm from summer, so seed germinates quickly. Nights are cooling off, so young grass isn't fighting heat stress. And new seedlings get a full fall and a full spring to build roots before the next July."] },
      { h: "Why not spring?", p: ["Spring aeration can relieve compaction, but spring-seeded fescue has only a few weeks before summer heat arrives. Young grass often thins out or dies in its first Virginia summer. If you can only seed once a year, make it fall."] },
      { h: "Core vs. spike aeration", p: ["Core aerators pull out plugs of soil about the size of your finger. That actually relieves compaction and opens space for air, water and seed. Spike aerators just poke holes and can press the soil tighter around them. Leave the plugs on the lawn. They break down in a week or two."] },
      { h: "Watering new seed", list: [
        "Weeks 1–2: keep the top half-inch lightly moist with short waterings once or twice a day.",
        "Weeks 3–4: water less often but longer as seedlings fill in.",
        "After that: water deeply about once a week if it doesn't rain.",
        "Skip weed killers and heavy foot traffic until the new grass has been mowed a few times.",
      ] },
      { h: "First mow", p: ["Mow new grass once it reaches about 3½–4 inches, with a sharp blade. Then keep fescue tall through fall and especially through the following summer."] },
    ],
  },
  {
    slug: "mulch-vs-gravel-beds",
    title: "Mulch vs. gravel: choosing the right bed cover for your yard",
    description: "The pros and cons of hardwood mulch and stone for Central Virginia yards, and where each one works best.",
    date: "2026-11-11",
    image: "svc-mulch-gravel",
    service: "mulch-gravel",
    sections: [
      { p: ["Fresh beds make a house look cared for. But should you use mulch, gravel or river rock? In most Chesterfield yards the answer is both, each in the right place."] },
      { h: "Where mulch shines", list: [
        "Around shrubs, perennials and trees, where it keeps roots cool and moist.",
        "In beds you want to look natural and soft.",
        "In clay soil, where it slowly breaks down and improves the soil underneath.",
        "Downside: it fades and breaks down, so it needs a top-up about once a year.",
      ] },
      { h: "Where gravel and stone shine", list: [
        "Along foundations and downspouts, where you want drainage.",
        "Around AC units, side yards and utility areas.",
        "In spots where mulch keeps washing out after heavy rain.",
        "Downside: it holds heat, it's harder to replant through, and it costs more up front.",
      ] },
      { h: "Mulch tips", p: ["Keep total depth at about 2–3 inches. Don't pile mulch against tree trunks or siding (no \"mulch volcanoes\"). Re-cut a clean spade edge each spring so the bed line stays sharp and grass stays out."] },
      { h: "Stone tips", p: ["Use landscape fabric under stone in non-planted areas, edge it so it doesn't migrate into the lawn, and pick a size that suits the spot. Pea gravel for paths, larger river rock for drainage channels and borders."] },
    ],
  },
  {
    slug: "spring-yard-cleanup-checklist",
    title: "Spring yard cleanup checklist for Chesterfield homeowners",
    description: "A practical spring checklist for Central Virginia yards: clear, edge, mulch, mow high and plan ahead for fall seeding.",
    date: "2026-11-11",
    image: "season-spring",
    service: "mulch-gravel",
    sections: [
      { p: ["Spring in Central Virginia moves fast. Fescue wakes up in March and can grow an inch or more a week by April. Get ahead of it with this checklist."] },
      { h: "Late February – March", list: [
        "Clear leftover leaves, sticks and debris from lawns and beds.",
        "Cut back ornamental grasses and dead perennial stems.",
        "Finish any pruning while trees are still dormant.",
        "Re-cut bed edges with a flat spade.",
      ] },
      { h: "March – April", list: [
        "Weed beds, then add fresh mulch to about 2–3 inches total depth.",
        "Start mowing when the grass reaches about 4 inches. Don't scalp it on the first cut.",
        "Sharpen mower blades. Dull blades tear fescue and leave brown tips.",
        "Check gutters and downspouts so spring rains drain away from beds.",
      ] },
      { h: "May", list: [
        "Mow weekly during the spring flush.",
        "Raise the mowing height as temperatures climb.",
        "Make a note of thin or bare spots. Those get aerated and overseeded in early fall, not now.",
      ] },
      { h: "Want it done for you?", p: ["A single spring cleanup with fresh mulch and sharp edges is one of the highest-impact things you can do for curb appeal. Text a photo for a free quote."] },
    ],
  },
  {
    slug: "storm-cleanup-tree-limb-removal",
    title: "After the storm: tree limb removal and yard cleanup in Chesterfield",
    description: "What to do (and not do) after a summer thunderstorm or tropical system drops limbs and debris on your Chesterfield property.",
    date: "2026-11-11",
    image: "svc-tree-work",
    service: "tree-work",
    sections: [
      { p: ["Summer thunderstorms and the remnants of tropical systems regularly bring down limbs across Chesterfield County. Here's how to handle the cleanup safely."] },
      { h: "Safety first", list: [
        "Stay away from any downed or sagging power lines, and from limbs touching them. Report them to the utility right away.",
        "Look up before you walk under trees. Broken \"hangers\" can drop without warning.",
        "Don't run a chainsaw on limbs under tension or on a ladder.",
      ] },
      { h: "Document it", p: ["Take photos of damage to the house, fences, cars and other structures before anything is moved. If you might file an insurance claim, those photos help."] },
      { h: "What you can handle yourself", p: ["Small sticks and branches can be gathered, bundled or composted. Light debris can go out with your hauler if they accept yard waste, or to a county convenience center that takes it. Check the county's current rules."] },
      { h: "When to call for help", p: ["Large limbs, anything hanging, anything on a roof or fence, and big brush piles are worth handing off. A crew can cut, load and haul it away in one visit. Text photos of the damage and your address for a quote."] },
      { h: "Prevent the next one", p: ["Late winter is the best time to prune dead, crossing or overhanging limbs before storm season. Raising canopies off the roof and removing dead wood now means less damage later."] },
    ],
  },
  {
    slug: "how-often-to-mow-fescue-in-summer",
    title: "How often should you mow fescue in a Virginia summer?",
    description: "Mowing height and frequency for tall fescue in Central Virginia heat, and why cutting short in July is a mistake.",
    date: "2026-11-11",
    image: "svc-mowing",
    service: "mowing",
    sections: [
      { p: ["Tall fescue is the go-to lawn grass around Richmond because it stays green much of the year. But it's a cool-season grass, and our July and August heat stresses it. How you mow in summer makes a big difference."] },
      { h: "Mow tall: 3½ to 4 inches", p: ["Taller grass shades the soil, keeps roots cooler, holds moisture and crowds out crabgrass. Cutting fescue short in summer is one of the most common reasons lawns brown out by August."] },
      { h: "The one-third rule", p: ["Never remove more than a third of the blade in one cut. If you mow at 4 inches, cut before the grass passes about 6 inches. In the spring flush that usually means weekly. In a hot, dry summer, growth slows and every 10–14 days is often enough."] },
      { h: "Other summer tips", list: [
        "Keep blades sharp. Torn tips turn brown and lose water faster.",
        "Mow in the cooler part of the day when you can, not in mid-afternoon heat.",
        "Leave the clippings. They return moisture and nutrients.",
        "Skip mowing a drought-stressed lawn that isn't growing. Walking on brittle grass damages it.",
        "Water deeply and less often, early in the morning.",
      ] },
      { h: "Weekly or biweekly service?", p: ["Weekly is best from April through June. Biweekly often works from July through early September. A good crew adjusts with the weather instead of mowing on autopilot."] },
    ],
  },
];

export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);
