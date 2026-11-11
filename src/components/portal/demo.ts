// DEMO ONLY: fictional customers (555 numbers), generated relative to "now" so the demo always looks current.
// Demo photos are the site's own atmosphere images, never shown as real work.
import { defaultPriceBook } from "@/content/pricing";
import type { Job, Lead, PortalConfig, PortalState, Quote } from "@/lib/portal/types";
import type { TourStep } from "./Tour";
import { todayYmd } from "./ui";

const B = "/media/brand/images";
const ago = (min: number) => new Date(Date.now() - min * 60_000).toISOString();
const H = 60, D = 24 * 60;

export const DEMO_IDS = {
  hotLead: "00000000-0000-4000-8000-000000000001",
  quoteLead: "00000000-0000-4000-8000-000000000002",
  sentQuote: "00000000-0000-4000-8000-0000000000a1",
  wonQuote: "00000000-0000-4000-8000-0000000000a2",
  doneJob: "00000000-0000-4000-8000-0000000000b1",
  todayJob: "00000000-0000-4000-8000-0000000000b2",
};

export function demoState(): PortalState {
  const L = (id: number, l: Partial<Lead> & Pick<Lead, "name" | "address" | "created_at">): Lead => ({
    id: `00000000-0000-4000-8000-${String(id).padStart(12, "0")}`,
    status: "new", source: "quick_quote", phone: `804-555-01${String(id).padStart(2, "0")}`, services: [], photos: [], ...l,
  });
  const leads: Lead[] = [
    L(1, { name: "Dana Whitfield", address: "14 Sample Ridge Ct, Midlothian", created_at: ago(42), services: ["leaf-cleanup", "aeration"], timing: "this_week", contact_pref: "text",
      notes: "Big oak in the back, leaves are knee deep by the fence.", photos: [`${B}/leaf-season-800.webp`, `${B}/svc-leaf-cleanup-800.webp`], utm: { source: "google", medium: "cpc", landing: "/services/leaf-cleanup" }, page: "/services/leaf-cleanup" }),
    L(2, { name: "Marcus Bell", address: "220 Demo Creek Ln, Chesterfield", created_at: ago(3 * D + 5 * H), status: "quote_sent", first_contacted_at: ago(3 * D + 4 * H + 40),
      services: ["mulch-gravel"], source: "estimator", estimate: { low: 400, high: 720, size: "half", frequency: "once" }, utm: { source: "facebook", landing: "/" } }),
    L(3, { name: "Priya Raman", address: "9 Example Oak Dr, Woodlake", created_at: ago(5 * D), status: "won", first_contacted_at: ago(5 * D - 18),
      services: ["leaf-cleanup"], utm: { source: "nextdoor" } }),
    L(4, { name: "Tom Okafor", address: "51 Placeholder Pl, Brandermill", created_at: ago(2 * H + 10), services: ["tree-work"], timing: "asap", utm: { source: "google" } }),
    L(5, { name: "Sheila Grant", address: "300 Testing Way, Chester", created_at: ago(4 * D), status: "contacted", first_contacted_at: ago(4 * D - 25), services: ["junk-removal"], utm: { source: "direct" } }),
    L(6, { name: "Luis Moreno", address: "77 Sample Hill Rd, Moseley", created_at: ago(6 * D), status: "lost", lost_reason: "Price", first_contacted_at: ago(6 * D - 90), services: ["mowing"], plan: "mow-club", source: "yard_club", utm: { source: "google" } }),
    L(7, { name: "Grace Kim", address: "18 Demo Meadow Ct, Bon Air", created_at: ago(1 * D + 3 * H), status: "contacted", first_contacted_at: ago(1 * D + 2 * H + 48), services: ["mowing", "mulch-gravel"], utm: { source: "google" } }),
    L(8, { name: "Ray Jennings", address: "402 Example Ave, North Chesterfield", created_at: ago(9 * D), status: "won", first_contacted_at: ago(9 * D - 12), services: ["yard-makeovers"], utm: { source: "facebook" } }),
  ];
  const quotes: Quote[] = [
    { id: DEMO_IDS.sentQuote, lead_id: leads[1].id, created_at: ago(3 * D + 3 * H), sent_at: ago(3 * D + 2 * H), status: "sent",
      items: [{ service: "mulch-gravel", label: "Mulch & Gravel: front + side beds", price: 520 }, { service: "mulch-gravel", label: "Re-cut bed edges", price: 60 }], note: "Dark brown mulch, about 6 yards." },
    { id: DEMO_IDS.wonQuote, lead_id: leads[2].id, created_at: ago(5 * D - H), sent_at: ago(5 * D - H), status: "accepted",
      items: [{ service: "leaf-cleanup", label: "Leaf Cleanup with haul-away", price: 285 }] },
    { id: "00000000-0000-4000-8000-0000000000a3", lead_id: leads[7].id, created_at: ago(8 * D), sent_at: ago(8 * D), status: "accepted",
      items: [{ service: "yard-makeovers", label: "Full cleanup + shrub trim", price: 640 }, { service: "mulch-gravel", label: "Fresh mulch", price: 340 }] },
    { id: "00000000-0000-4000-8000-0000000000a4", lead_id: leads[5].id, created_at: ago(6 * D - 2 * H), sent_at: ago(6 * D - 2 * H), status: "declined",
      items: [{ service: "mowing", label: "Weekly mowing (per visit)", price: 70 }] },
  ];
  const jobs: Job[] = [
    { id: DEMO_IDS.doneJob, lead_id: leads[2].id, quote_id: DEMO_IDS.wonQuote, created_at: ago(5 * D), title: "Leaf Cleanup with haul-away", customer: "Priya Raman", phone: leads[2].phone,
      address: leads[2].address, date: todayYmd(-2), time: "10:00 AM", status: "done", completed_at: ago(2 * D), notes: "Gate on left side.",
      photos: [
        { key: `${B}/leaf-season-800.webp`, kind: "before", public: true, width: 800, height: 450 },
        { key: `${B}/season-fall-800.webp`, kind: "after", public: true, width: 800, height: 597 },
      ] },
    { id: DEMO_IDS.todayJob, lead_id: leads[7].id, created_at: ago(7 * D), title: "Full cleanup + fresh mulch", customer: "Ray Jennings", phone: leads[7].phone,
      address: leads[7].address, date: todayYmd(), time: "1:00 PM", status: "scheduled", notes: "Bring extra edging blades.", photos: [] },
    { id: "00000000-0000-4000-8000-0000000000b3", created_at: ago(D), title: "Weekly mow", customer: "Alma Ortiz", phone: "804-555-0190", address: "6 Sample Spring Ln, Midlothian",
      date: todayYmd(1), time: "8:30 AM", status: "scheduled", photos: [] },
  ];
  return { leads, quotes, jobs, priceBook: defaultPriceBook() };
}

export const DEMO_CONFIG: PortalConfig = { db: "demo", email: true, sms: true, ownerEmail: true, ownerPhone: true, turnstile: true, analytics: true, cron: true };

export const TOUR: TourStep[] = [
  { chapter: "Today", nav: { tab: "today" }, target: "stat-new", title: "Your morning in one screen", body: "New leads waiting, how fast you're replying, money out on quotes, and what you won this week." },
  { chapter: "Today", nav: { tab: "today" }, target: "needs-you", title: "Needs you now", body: "The portal tells you who to call next. Each one has a ready-to-send text. One tap opens your Messages app." },
  { chapter: "Leads", nav: { tab: "leads" }, target: "lead-list", title: "Every request, instantly", body: "Website quote requests land here the second they're sent. You also get a text and email alert." },
  { chapter: "Leads", nav: { tab: "leads", lead: DEMO_IDS.hotLead }, target: "lead-actions", title: "Call or text in one tap", body: "Dana asked 42 minutes ago. Tap Text and a friendly reply is already written. Replying fast is the #1 way to win the job." },
  { chapter: "Leads", nav: { tab: "leads", lead: DEMO_IDS.hotLead }, target: "lead-status", title: "Track where it stands", body: "New → Contacted → Quote sent → Won or Lost. Lost reasons show you what to fix (price, too slow, out of area)." },
  { chapter: "Quotes", nav: { tab: "leads", lead: DEMO_IDS.hotLead }, target: "lead-quote", title: "Build a quote in seconds", body: "Services they picked are pre-filled with prices from your price book. Try it: tap Build quote." },
  { chapter: "Quotes", nav: { tab: "quotes", quote: DEMO_IDS.sentQuote }, target: "quote-items", title: "Adjust the price", body: "Change any line, add services, add a note. The total updates as you type." },
  { chapter: "Quotes", nav: { tab: "quotes", quote: DEMO_IDS.sentQuote }, target: "quote-send", title: "Text the quote", body: "Sends from your own phone, so customers see your number. It's marked “sent” so the Lead Sweep can remind you to follow up." },
  { chapter: "Quotes", nav: { tab: "quotes", quote: DEMO_IDS.sentQuote }, target: "quote-decide", title: "Won it? Schedule it", body: "Mark it Won and one tap turns it into a job on the calendar, with the address and notes carried over." },
  { chapter: "Jobs", nav: { tab: "jobs", job: DEMO_IDS.doneJob }, target: "job-photos", title: "Photos that sell the next job", body: "Snap a before and after. Tick “Show on website” and they appear in the public gallery as a before/after slider. No AI, no stock." },
  { chapter: "Lead Sweep", nav: { tab: "sweep" }, target: "sweep-first", title: "The weekly Lead Sweep", body: "Every Monday you get this by email: who's waiting, quotes to follow up, and happy customers to ask for a review. Nothing falls through the cracks." },
  { chapter: "Prices", nav: { tab: "prices" }, target: "prices", title: "Your prices, your website", body: "Set your ranges once. The instant estimate on the website and every new quote use them." },
];
