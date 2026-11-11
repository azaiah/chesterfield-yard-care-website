import "server-only";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import type { Lead } from "@/lib/portal/types";
import * as db from "./db";
import { putFile, storageMode } from "./db";

// ---------- Validation ----------
const digits = (s: string) => s.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");

export const LEAD_SOURCES = ["quick_quote", "quote_page", "estimator", "yard_club", "service_page", "town_page"] as const;

const utmSchema = z
  .object({
    source: z.string().max(100).optional(),
    medium: z.string().max(100).optional(),
    campaign: z.string().max(150).optional(),
    term: z.string().max(150).optional(),
    content: z.string().max(150).optional(),
    referrer: z.string().max(500).optional(),
    landing: z.string().max(500).optional(),
    gclid: z.string().max(200).optional(),
    fbclid: z.string().max(200).optional(),
  })
  .partial()
  .optional();

export const step1Schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .refine((v) => digits(v).length === 10, "Please enter a 10-digit phone number"),
  address: z.string().trim().min(5, "Please enter the property address").max(200),
  source: z.enum(LEAD_SOURCES).default("quick_quote"),
  page: z.string().max(300).optional(),
  services: z.array(z.string().max(40)).max(10).optional(),
  plan: z.string().max(40).optional(),
  estimate: z.object({ low: z.number(), high: z.number(), size: z.string().max(20), frequency: z.string().max(20) }).partial().optional(),
  utm: utmSchema,
  website: z.string().max(0, "spam").optional(), // honeypot — must stay empty
  turnstileToken: z.string().max(4096).optional(),
});
export type Step1 = z.infer<typeof step1Schema>;

export const step2Schema = z.object({
  services: z.array(z.string().max(40)).max(10).default([]),
  timing: z.enum(["asap", "this_week", "this_month", "flexible"]).optional(),
  notes: z.string().max(2000).optional(),
  contactPref: z.enum(["call", "text", "email"]).default("text"),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
});
export type Step2 = z.infer<typeof step2Schema>;

export const formatPhone = (raw: string) => {
  const d = digits(raw);
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
};
export const e164 = (raw: string) => `+1${digits(raw)}`;

// ---------- Step-2 token (lets the browser add details to the lead it just created, nothing else) ----------
const secret = () => process.env.LEAD_TOKEN_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "dev-only-lead-secret";
export const leadToken = (id: string) => createHmac("sha256", secret()).update(id).digest("base64url");
export const checkToken = (id: string, token: string) => {
  const a = Buffer.from(leadToken(id));
  const b = Buffer.from(token || "");
  return a.length === b.length && timingSafeEqual(a, b);
};

// ---------- Rate limit (best-effort, per instance) ----------
const hits = new Map<string, number[]>();
export function rateLimited(key: string, max = 5, windowMs = 10 * 60_000) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return list.length > max;
}

// ---------- Turnstile ----------
export async function verifyTurnstile(token: string | undefined, ip: string | null) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) return true; // not configured — honeypot + rate limit still apply
  if (!token) return false;
  const body = new URLSearchParams({ secret: secretKey, response: token, ...(ip ? { remoteip: ip } : {}) });
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  const j = (await r.json().catch(() => ({}))) as { success?: boolean };
  return !!j.success;
}

// ---------- Storage ----------
export type LeadRecord = Lead;
export { storageMode } from "./db";

export async function insertLead(lead: LeadRecord) {
  if (storageMode() === "none") { console.error("[leads] No database configured — lead only delivered by alert:", lead.id); return; }
  await db.insert("leads", lead);
}
export const getLead = (id: string) => db.get<LeadRecord>("leads", id);
export const updateLead = (id: string, patch: Partial<LeadRecord>) => db.update<LeadRecord>("leads", id, patch);

const IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/heic": "heic", "image/heif": "heif" };
export const MAX_PHOTOS = 6;
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

/** Saves a photo to private storage; returns its key. Portal views it through /api/portal/photos. */
export async function savePhoto(folder: string, file: File) {
  const ext = IMAGE_TYPES[file.type];
  if (!ext) throw new Error("Only photos (JPG, PNG, WebP, HEIC) can be uploaded");
  if (file.size > MAX_PHOTO_BYTES) throw new Error("Each photo must be under 10 MB");
  const key = `leads/${folder}/${randomUUID()}.${ext}`;
  await putFile(key, Buffer.from(await file.arrayBuffer()), file.type);
  return key;
}

export const newLeadId = () => randomUUID();
