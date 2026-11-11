import "server-only";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

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

// ---------- Storage: Supabase (prod) or local JSON file (dev) ----------
export type LeadRecord = {
  id: string;
  created_at: string;
  status: "new";
  source: string;
  name: string;
  phone: string;
  address: string;
  email?: string | null;
  services: string[];
  plan?: string | null;
  estimate?: unknown;
  timing?: string | null;
  notes?: string | null;
  contact_pref?: string | null;
  photos: string[];
  utm?: unknown;
  page?: string | null;
};

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const storageMode = () =>
  SB_URL && SB_KEY ? "supabase" : process.env.NODE_ENV !== "production" || process.env.LEADS_LOCAL === "true" ? "local" : "none";
const LOCAL = path.join(process.cwd(), ".data");

async function sb(pathname: string, init: RequestInit) {
  const r = await fetch(`${SB_URL}${pathname}`, {
    ...init,
    headers: { apikey: SB_KEY!, Authorization: `Bearer ${SB_KEY}`, ...(init.headers ?? {}) },
  });
  if (!r.ok) throw new Error(`Supabase ${pathname} ${r.status}: ${await r.text()}`);
  return r;
}

async function readLocal(): Promise<LeadRecord[]> {
  try { return JSON.parse(await fs.readFile(path.join(LOCAL, "leads.json"), "utf8")); } catch { return []; }
}
async function writeLocal(rows: LeadRecord[]) {
  await fs.mkdir(LOCAL, { recursive: true });
  await fs.writeFile(path.join(LOCAL, "leads.json"), JSON.stringify(rows, null, 2));
}

export async function insertLead(lead: LeadRecord) {
  const mode = storageMode();
  if (mode === "supabase") {
    await sb("/rest/v1/leads", { method: "POST", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(lead) });
  } else if (mode === "local") {
    const rows = await readLocal();
    rows.push(lead);
    await writeLocal(rows);
  } else {
    console.error("[leads] No database configured — lead only delivered by alert:", lead.id);
  }
}

export async function getLead(id: string): Promise<LeadRecord | null> {
  const mode = storageMode();
  if (mode === "supabase") {
    const r = await sb(`/rest/v1/leads?id=eq.${encodeURIComponent(id)}&select=*`, { method: "GET" });
    return ((await r.json()) as LeadRecord[])[0] ?? null;
  }
  if (mode === "local") return (await readLocal()).find((l) => l.id === id) ?? null;
  return null;
}

export async function updateLead(id: string, patch: Partial<LeadRecord>) {
  const mode = storageMode();
  if (mode === "supabase") {
    await sb(`/rest/v1/leads?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(patch) });
  } else if (mode === "local") {
    const rows = await readLocal();
    const i = rows.findIndex((l) => l.id === id);
    if (i >= 0) { rows[i] = { ...rows[i], ...patch }; await writeLocal(rows); }
  }
}

const IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/heic": "heic", "image/heif": "heif" };
export const MAX_PHOTOS = 6;
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

/** Saves a customer photo; returns a storage path (private bucket — viewed from the portal via signed URLs). */
export async function savePhoto(leadId: string, file: File) {
  const ext = IMAGE_TYPES[file.type];
  if (!ext) throw new Error("Only photos (JPG, PNG, WebP, HEIC) can be uploaded");
  if (file.size > MAX_PHOTO_BYTES) throw new Error("Each photo must be under 10 MB");
  const key = `leads/${leadId}/${randomUUID()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const mode = storageMode();
  if (mode === "supabase") {
    await sb(`/storage/v1/object/quote-uploads/${key}`, { method: "POST", headers: { "Content-Type": file.type, "x-upsert": "false" }, body: buf });
  } else if (mode === "local") {
    const dest = path.join(LOCAL, "uploads", key);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, buf);
  }
  return key;
}

export const newLeadId = () => randomUUID();
