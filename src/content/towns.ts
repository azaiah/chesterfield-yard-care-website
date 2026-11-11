// Town pages. Each one is written for that place — no copy-paste with the name swapped.
// Landmarks are public places; we never claim to have worked in a specific neighborhood unless the owner confirms it.
import type { Service } from "@/lib/site";

export type Town = {
  slug: string;
  name: string;
  lat: number;
  lon: number;
  photo: { local?: string; brand?: string; alt: string };
  lead: string;
  body: string[];
  lots: string;
  popular: Service["slug"][];
  landmarks: string[];
  nearby: string[]; // slugs
};

export const TOWNS_CONTENT: Town[] = [
  {
    slug: "midlothian",
    name: "Midlothian",
    lat: 37.5057, lon: -77.6494,
    photo: { local: "midlothian-mines-park", alt: "Mid-Lothian Mines Park in Midlothian, Virginia" },
    lead: "Midlothian is home base. From the older streets off Route 60 to the cul-de-sacs off Robious, Huguenot Springs and Charter Colony Parkway, we keep Midlothian yards mowed, mulched and leaf-free.",
    body: [
      "Midlothian yards run the full range: established neighborhoods with big oaks and mature beds near the old coal-mining village, newer subdivisions along the Route 288 corridor, and wooded lots that back up to the James River side of the county. The common thread is tall fescue lawns, red clay that compacts, and a lot of trees. That means fall leaf cleanup and core aeration matter here more than almost anywhere in the county.",
      "Many Midlothian neighborhoods have HOAs with standards for lawn height, bed upkeep and leaf removal. Weekly mowing in spring, a fresh mulch refresh in March or April, and one or two leaf cleanups in November keep you comfortably ahead of the letters.",
    ],
    lots: "Quarter- to half-acre lots with mature trees, plus larger wooded lots west toward Powhatan County.",
    popular: ["leaf-cleanup", "mowing", "mulch-gravel", "aeration"],
    landmarks: ["Mid-Lothian Mines Park", "Robious Landing Park on the James River", "Route 60 / Midlothian Turnpike corridor", "Swift Creek Reservoir to the south"],
    nearby: ["bon-air", "woodlake", "brandermill", "north-chesterfield"],
  },
  {
    slug: "chester",
    name: "Chester",
    lat: 37.3568, lon: -77.4419,
    photo: { brand: "season-spring-1600", alt: "Spring front yard with fresh mulch beds" },
    lead: "Chester has a small-town core and a lot of yard to keep up. We handle mowing, cleanups and haul-away from the village center out to the newer neighborhoods along Route 10 and Route 1.",
    body: [
      "Around Chester you'll find older brick ranches and Cape Cods on generous lots near the village, plus newer subdivisions spreading toward the Appomattox and James rivers. Bigger lots mean mowing is often the main job, and storm debris is common after summer thunderstorms roll across the flatter eastern side of the county.",
      "Chester yards also tend to have long side and back fence lines that get overgrown. Brush cutting, limb cleanup and junk haul-away are frequent add-ons to a regular mowing schedule.",
    ],
    lots: "Half-acre-plus lots near the village, with quarter-acre lots in newer subdivisions.",
    popular: ["mowing", "junk-removal", "tree-work", "leaf-cleanup"],
    landmarks: ["Chester Village Green", "Route 10 / West Hundred Road", "U.S. Route 1 corridor", "Appomattox River to the south"],
    nearby: ["chesterfield-court-house", "enon", "ettrick", "north-chesterfield"],
  },
  {
    slug: "chesterfield-court-house",
    name: "Chesterfield Court House",
    lat: 37.3771, lon: -77.5053,
    photo: { local: "chesterfield-historic-courthouse", alt: "Historic Chesterfield County Courthouse" },
    lead: "Around the county seat, from the government complex out along Route 10 and Iron Bridge Road, we take care of everything from weekly mowing to full-property cleanups.",
    body: [
      "The Court House area mixes established neighborhoods, newer subdivisions and wooded properties close to Pocahontas State Park. Heavy tree cover means leaves can pile up fast in late fall, and the park-side woods send plenty of limbs and brush into yards after storms.",
      "Because many lots here back up to woods, edges and fence lines need regular attention. A twice-a-year brush cut along the tree line keeps the yard from creeping in, and it pairs well with a spring mulch refresh.",
    ],
    lots: "Quarter- to one-acre lots, many backing to wooded areas.",
    popular: ["leaf-cleanup", "tree-work", "mowing", "yard-makeovers"],
    landmarks: ["Historic Chesterfield County Courthouse", "Pocahontas State Park", "Iron Bridge Road (Route 10)", "Chesterfield County Government Center"],
    nearby: ["chester", "matoaca", "swift-creek", "north-chesterfield"],
  },
  {
    slug: "north-chesterfield",
    name: "North Chesterfield",
    lat: 37.4555, lon: -77.5300,
    photo: { local: "buford-oaks", alt: "Buford Oaks neighborhood entrance in North Chesterfield" },
    lead: "North Chesterfield packs a lot of neighborhoods between Chippenham, Hull Street and the Richmond city line. We keep these established yards mowed, edged and leaf-free all season.",
    body: [
      "Many North Chesterfield homes date from the 1950s through the 1980s. That means mature shade trees, older foundation plantings that have outgrown their spots, and lawns that thin out under the canopy. Overgrown shrubs and tired beds are often the biggest curb-appeal win here: a hard prune, fresh edges and new mulch make an older house look sharp again.",
      "Shade and tree roots make fescue struggle, so aeration and overseeding every fall is the best way to keep these lawns full. Leaf season is big here too. Mature oaks drop well into December.",
    ],
    lots: "Quarter-acre lots on established streets with mature trees and older foundation plantings.",
    popular: ["leaf-cleanup", "yard-makeovers", "aeration", "mulch-gravel"],
    landmarks: ["Chippenham Parkway corridor", "Hull Street Road (Route 360)", "Huguenot Road area", "Falling Creek"],
    nearby: ["bon-air", "midlothian", "chester", "chesterfield-court-house"],
  },
  {
    slug: "moseley",
    name: "Moseley",
    lat: 37.4040, lon: -77.7720,
    photo: { brand: "season-summer-1600", alt: "Summer lawn with crisp mowing stripes" },
    lead: "Moseley is growing fast, with new homes along Hull Street Road and big planned communities in western Chesterfield. We help new homeowners turn builder-grade yards into lawns and beds they're proud of.",
    body: [
      "If you just closed on a new build, your yard probably came with fresh sod or seed, thin mulch and young shrubs. The first two years matter most: steady mowing at the right height, fall aeration and overseeding where the seed didn't take, and a real mulch layer to protect the new plantings through the summer.",
      "Further out, Moseley still has larger rural lots and acreage where mowing time adds up fast and fence lines need clearing. We handle both: tidy HOA-standard yards in the new communities and bigger properties down the country roads.",
    ],
    lots: "New-construction lots in planned communities, plus one-acre-plus rural properties.",
    popular: ["mowing", "aeration", "mulch-gravel", "yard-makeovers"],
    landmarks: ["Hull Street Road (Route 360) west", "Route 288 interchange", "Skinquarter area", "Powhatan County line"],
    nearby: ["woodlake", "brandermill", "swift-creek", "midlothian"],
  },
  {
    slug: "brandermill",
    name: "Brandermill",
    lat: 37.4300, lon: -77.6480,
    photo: { local: "swift-creek-reservoir", alt: "Swift Creek Reservoir beside Brandermill" },
    lead: "Brandermill's wooded lots along Swift Creek Reservoir are beautiful, and they shed a lot of leaves and limbs. We keep Brandermill yards cleaned up, mulched and mowed through every season.",
    body: [
      "Brandermill was built to keep the trees, so most homes sit on wooded lots with natural areas, slopes and pine straw or mulch beds rather than big open lawns. Yard care here is more about cleanups than mowing: leaves, pine needles, fallen limbs and keeping the natural areas tidy without stripping them bare.",
      "Shade lawns in Brandermill benefit from fall overseeding with a shade-tolerant fescue blend. The community association has its own standards, so we keep things neat and within the lines.",
    ],
    lots: "Wooded quarter- to half-acre lots with slopes, natural areas and shade lawns.",
    popular: ["leaf-cleanup", "tree-work", "mulch-gravel", "aeration"],
    landmarks: ["Swift Creek Reservoir", "Sunday Park", "Route 288 / Hull Street", "Brandermill Country Club area"],
    nearby: ["woodlake", "swift-creek", "midlothian", "moseley"],
  },
  {
    slug: "woodlake",
    name: "Woodlake",
    lat: 37.4140, lon: -77.6740,
    photo: { local: "woodlake-sign", alt: "Woodlake community sign in Chesterfield County" },
    lead: "Woodlake sits on the south shore of Swift Creek Reservoir, with lots of families, lots of trees and HOA standards to match. We keep Woodlake yards neat from spring mowing to the last oak leaf.",
    body: [
      "Woodlake homes mix open front lawns with wooded backyards that slope toward the water. Front yards get the mowing, edging and mulch. Backyards get the leaf, pine-needle and limb cleanups. Kids, dogs and backyard games compact the lawn, so yearly fall aeration pays off here.",
      "Leaf season hits Woodlake hard. Two cleanups, one at peak drop and one after the oaks finish, keep the lawn from matting down over winter.",
    ],
    lots: "Quarter-acre lots with open front lawns and wooded backyards.",
    popular: ["leaf-cleanup", "mowing", "aeration", "mulch-gravel"],
    landmarks: ["Swift Creek Reservoir south shore", "Woodlake community trails", "Hull Street Road (Route 360)", "Route 288"],
    nearby: ["brandermill", "moseley", "swift-creek", "midlothian"],
  },
  {
    slug: "bon-air",
    name: "Bon Air",
    lat: 37.5243, lon: -77.5578,
    photo: { local: "pocahontas-fall-trail", alt: "Fall trail with autumn leaves near Chesterfield County" },
    lead: "Bon Air's old trees and established streets make it one of the prettiest corners of Chesterfield, and one of the leafiest. We keep Bon Air yards clean, edged and ready for every season.",
    body: [
      "Bon Air grew up as a Victorian-era resort community, and the area still has big hardwoods, deep lots and older homes with mature landscaping. Those big trees mean serious fall leaf cleanup, regular limb removal, and lawns that need help in the shade.",
      "Older foundation plantings here are often overgrown. A careful renewal prune, cleaned-up beds and fresh mulch bring back the character of the house without losing the established feel.",
    ],
    lots: "Deep, tree-heavy lots on established streets, many with older landscaping.",
    popular: ["leaf-cleanup", "tree-work", "yard-makeovers", "aeration"],
    landmarks: ["Bon Air Historic District", "Buford Road", "Huguenot Road", "Powhite Parkway"],
    nearby: ["north-chesterfield", "midlothian", "brandermill", "woodlake"],
  },
  {
    slug: "swift-creek",
    name: "Swift Creek",
    lat: 37.4100, lon: -77.5950,
    photo: { local: "swift-creek-reservoir-dam", alt: "Swift Creek Reservoir dam" },
    lead: "From Swift Creek Reservoir east toward Route 10, the Swift Creek area is full of family neighborhoods with real lawns to keep up. We mow, mulch and clean up across the whole stretch.",
    body: [
      "The Swift Creek area covers a lot of ground: neighborhoods near the reservoir, subdivisions along Hull Street and Genito, and wooded lots near the creek itself. Lawns here are mostly fescue on clay, so the formula is steady mowing at the right height, fall aeration, and staying ahead of the leaves in November.",
      "Families here often want one crew for the whole year. Mowing in spring and summer, leaves in fall, and limb and junk haul-away in winter is exactly what our Yard Club plans are for.",
    ],
    lots: "Quarter- to half-acre suburban lots, some backing to creek-side woods.",
    popular: ["mowing", "leaf-cleanup", "aeration", "junk-removal"],
    landmarks: ["Swift Creek Reservoir", "Swift Creek", "Genito Road", "Hull Street Road (Route 360)"],
    nearby: ["brandermill", "woodlake", "chesterfield-court-house", "north-chesterfield"],
  },
  {
    slug: "matoaca",
    name: "Matoaca",
    lat: 37.2310, lon: -77.4770,
    photo: { local: "pocahontas-beaver-lake-loop", alt: "Wooded trail in Pocahontas State Park" },
    lead: "Down in southern Chesterfield near the Appomattox River, Matoaca properties are bigger and more rural. We handle the mowing, brush and cleanup that come with more land.",
    body: [
      "Matoaca has a country feel: larger lots, long driveways, fields and wood lines. That means mowing time adds up, fence lines get overgrown, and storm limbs land in places that are hard to reach. Regular mowing plus a couple of brush and debris cleanups a year keep a big property under control.",
      "Newer subdivisions around the area need the same attention as anywhere else in the county: steady mowing, real mulch beds and fall leaf cleanup.",
    ],
    lots: "Half-acre to multi-acre properties, plus newer subdivision lots.",
    popular: ["mowing", "junk-removal", "tree-work", "yard-makeovers"],
    landmarks: ["Appomattox River", "Pocahontas State Park to the north", "River Road area", "Route 36 toward Petersburg"],
    nearby: ["ettrick", "chesterfield-court-house", "chester", "swift-creek"],
  },
  {
    slug: "ettrick",
    name: "Ettrick",
    lat: 37.2401, lon: -77.4283,
    photo: { brand: "season-fall-1600", alt: "Fall yard with neat leaf piles" },
    lead: "Ettrick sits along the Appomattox across from Petersburg, home to Virginia State University and a lot of established homes and rentals. We keep yards here mowed, cleaned up and ready to show.",
    body: [
      "Ettrick has older homes with mature trees, newer neighborhoods, and plenty of rental properties near the university. For landlords and property managers, the job is usually keeping lawns at a tidy height between tenants and doing move-out cleanups that make a place easy to rent again.",
      "Homeowners here get the same full lineup: mowing, mulch, fall leaf cleanup and limb haul-away after storms.",
    ],
    lots: "Quarter-acre established lots, older homes with mature trees, and rental properties.",
    popular: ["mowing", "yard-makeovers", "leaf-cleanup", "junk-removal"],
    landmarks: ["Virginia State University", "Appomattox River", "Route 36", "Chesterfield Avenue"],
    nearby: ["matoaca", "chester", "enon", "chesterfield-court-house"],
  },
  {
    slug: "enon",
    name: "Enon",
    lat: 37.3307, lon: -77.3227,
    photo: { brand: "season-winter-1600", alt: "Tidy winter yard in Central Virginia" },
    lead: "Enon sits on the eastern side of Chesterfield between the James and the Appomattox, near Hopewell. We bring the same mowing, cleanup and haul-away service out east.",
    body: [
      "Enon has a mix of established neighborhoods, newer subdivisions and bigger lots near the rivers. Flatter ground and sandier soil toward the eastern side of the county drain differently from the clay in the west, so lawns here can dry out faster in summer. Mowing high and watering deep matter even more.",
      "Storm cleanup is common out east when summer thunderstorms and tropical remnants come up the James. Limbs, debris and brush haul-away are a big part of the work here.",
    ],
    lots: "Quarter- to one-acre lots, some near the James and Appomattox rivers.",
    popular: ["mowing", "tree-work", "junk-removal", "leaf-cleanup"],
    landmarks: ["Point of Rocks Park", "Route 10 east toward Hopewell", "Appomattox River", "James River"],
    nearby: ["chester", "ettrick", "chesterfield-court-house", "matoaca"],
  },
];

export const townBySlug = (slug: string) => TOWNS_CONTENT.find((t) => t.slug === slug);
