import "server-only";
import { z } from "zod";
import { defaultPriceBook } from "@/content/pricing";
import type { Job, Lead, Op, PortalConfig, PortalState, PriceBook, Quote } from "@/lib/portal/types";
import { expandOp } from "@/lib/portal/types";
import * as db from "./db";

type SettingRow = { id: string; value: unknown };

export async function getPriceBook(): Promise<{ book: PriceBook; custom: boolean }> {
  try {
    const row = await db.get<SettingRow>("settings", "price_book");
    if (row?.value && typeof row.value === "object") return { book: { ...defaultPriceBook(), ...(row.value as PriceBook) }, custom: true };
  } catch (e) {
    console.error("[portal] price book", e);
  }
  return { book: defaultPriceBook(), custom: false };
}

export async function loadState(): Promise<PortalState> {
  const [leads, quotes, jobs, prices] = await Promise.all([
    db.list<Lead>("leads"),
    db.list<Quote>("quotes"),
    db.list<Job>("jobs"),
    getPriceBook(),
  ]);
  const byNewest = <T extends { created_at: string }>(a: T, b: T) => b.created_at.localeCompare(a.created_at);
  return {
    leads: leads.map((l) => ({ ...l, status: l.status ?? "new", photos: l.photos ?? [], services: l.services ?? [] })).sort(byNewest),
    quotes: quotes.map((q) => ({ ...q, items: q.items ?? [] })).sort(byNewest),
    jobs: jobs.map((j) => ({ ...j, photos: j.photos ?? [] })),
    priceBook: prices.book,
  };
}

export function portalConfig(): PortalConfig {
  const e = process.env;
  return {
    db: db.storageMode(),
    email: !!e.RESEND_API_KEY,
    sms: e.SMS_ENABLED === "true" && !!e.TWILIO_ACCOUNT_SID && !!e.TWILIO_AUTH_TOKEN && !!e.TWILIO_FROM_NUMBER,
    ownerEmail: !!e.OWNER_ALERT_EMAIL,
    ownerPhone: !!e.OWNER_ALERT_PHONE,
    turnstile: !!e.TURNSTILE_SECRET_KEY && !!e.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    analytics: !!e.NEXT_PUBLIC_GA4_ID || !!e.NEXT_PUBLIC_META_PIXEL_ID,
    cron: !!e.CRON_SECRET,
  };
}

// ---------- Validation for portal changes ----------
const str = (max = 500) => z.string().max(max);
const iso = z.string().max(40);
const item = z.object({ service: str(40), label: str(80), price: z.number().min(0).max(1_000_000) });
const photo = z.object({
  key: str(200), kind: z.enum(["before", "after", "other"]), public: z.boolean(),
  width: z.number().int().positive().optional(), height: z.number().int().positive().optional(), caption: str(200).optional(),
});
const quote = z.object({
  id: z.string().uuid(), lead_id: z.string().uuid(), created_at: iso, status: z.enum(["draft", "sent", "accepted", "declined"]),
  items: z.array(item).max(30), note: str(2000).nullish(), sent_at: iso.nullish(),
});
const jobFields = {
  lead_id: z.string().uuid().nullish(), quote_id: z.string().uuid().nullish(), title: str(120), customer: str(80), phone: str(20).nullish(),
  address: str(200), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), time: str(20).nullish(), status: z.enum(["scheduled", "done", "canceled"]),
  notes: str(2000).nullish(), photos: z.array(photo).max(60), completed_at: iso.nullish(),
};
const book = z.record(z.string().max(40), z.object({ low: z.number().min(0), high: z.number().min(0), unit: str(40) }));

export const opSchema = z.discriminatedUnion("op", [
  z.object({
    op: z.literal("lead.update"), id: z.string().uuid(),
    patch: z.object({
      status: z.enum(["new", "contacted", "quote_sent", "won", "lost"]).optional(), lost_reason: str(80).nullish(),
      owner_notes: str(4000).nullish(), value_estimate: z.number().min(0).nullish(), first_contacted_at: iso.nullish(),
    }).strict(),
  }),
  z.object({ op: z.literal("quote.create"), quote }),
  z.object({
    op: z.literal("quote.update"), id: z.string().uuid(),
    patch: z.object({ status: quote.shape.status.optional(), items: quote.shape.items.optional(), note: quote.shape.note, sent_at: quote.shape.sent_at }).strict(),
  }),
  z.object({ op: z.literal("job.create"), job: z.object({ id: z.string().uuid(), created_at: iso, ...jobFields }) }),
  z.object({ op: z.literal("job.update"), id: z.string().uuid(), patch: z.object(jobFields).partial().strict() }),
  z.object({ op: z.literal("prices.set"), priceBook: book }),
]);

/** Persists an op (and the side effects expandOp derives) using current server state. */
export async function persistOp(op: Op) {
  const state = await loadState();
  for (const o of expandOp(state, op)) {
    switch (o.op) {
      case "lead.update": await db.update<Lead>("leads", o.id, o.patch as Partial<Lead>); break;
      case "quote.create": await db.insert<Quote>("quotes", o.quote); break;
      case "quote.update": await db.update<Quote>("quotes", o.id, o.patch as Partial<Quote>); break;
      case "job.create": await db.insert<Job>("jobs", o.job); break;
      case "job.update": await db.update<Job>("jobs", o.id, o.patch as Partial<Job>); break;
      case "prices.set": await db.upsert<SettingRow>("settings", { id: "price_book", value: o.priceBook }); break;
    }
  }
}

/** Photos the owner marked public, for the website gallery. */
export async function publicWork(): Promise<{ job: Job; photos: Job["photos"] }[]> {
  try {
    const jobs = await db.list<Job>("jobs");
    return jobs
      .map((job) => ({ job, photos: (job.photos ?? []).filter((p) => p.public) }))
      .filter((x) => x.photos.length)
      .sort((a, b) => (b.job.completed_at ?? b.job.date).localeCompare(a.job.completed_at ?? a.job.date));
  } catch {
    return [];
  }
}
