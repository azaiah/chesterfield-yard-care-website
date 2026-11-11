import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

// Tiny table store: Supabase REST (service role, server only) in production, JSON files in .data/ for local dev.
export type Table = "leads" | "quotes" | "jobs" | "settings";
type Row = { id: string } & Record<string, unknown>;

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const LOCAL_DIR = path.join(process.cwd(), ".data");

export const storageMode = (): "supabase" | "local" | "none" =>
  SB_URL && SB_KEY ? "supabase" : process.env.NODE_ENV !== "production" || process.env.LEADS_LOCAL === "true" ? "local" : "none";

export async function sb(pathname: string, init: RequestInit = {}) {
  const r = await fetch(`${SB_URL}${pathname}`, {
    ...init,
    cache: "no-store",
    headers: { apikey: SB_KEY!, Authorization: `Bearer ${SB_KEY}`, ...(init.headers ?? {}) },
  });
  if (!r.ok) throw new Error(`Supabase ${pathname} ${r.status}: ${await r.text()}`);
  return r;
}

const file = (t: Table) => path.join(LOCAL_DIR, `${t}.json`);
async function readLocal<T extends Row>(t: Table): Promise<T[]> {
  try { return JSON.parse(await fs.readFile(file(t), "utf8")); } catch { return []; }
}
// Serialize local writes so concurrent requests don't clobber each other.
let chain: Promise<unknown> = Promise.resolve();
function writeLocal<T extends Row>(t: Table, fn: (rows: T[]) => T[]) {
  const next = chain.then(async () => {
    const rows = fn(await readLocal<T>(t));
    await fs.mkdir(LOCAL_DIR, { recursive: true });
    await fs.writeFile(file(t), JSON.stringify(rows, null, 2));
  });
  chain = next.catch(() => {});
  return next;
}

export async function list<T extends Row>(t: Table): Promise<T[]> {
  const mode = storageMode();
  if (mode === "supabase") return (await sb(`/rest/v1/${t}?select=*`)).json();
  if (mode === "local") return readLocal<T>(t);
  return [];
}

export async function get<T extends Row>(t: Table, id: string): Promise<T | null> {
  const mode = storageMode();
  if (mode === "supabase") return ((await (await sb(`/rest/v1/${t}?id=eq.${encodeURIComponent(id)}&select=*`)).json()) as T[])[0] ?? null;
  if (mode === "local") return (await readLocal<T>(t)).find((r) => r.id === id) ?? null;
  return null;
}

export async function insert<T extends Row>(t: Table, row: T) {
  const mode = storageMode();
  if (mode === "supabase")
    await sb(`/rest/v1/${t}`, { method: "POST", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(row) });
  else if (mode === "local") await writeLocal<T>(t, (rows) => [...rows, row]);
  else throw new Error("No database configured");
}

export async function update<T extends Row>(t: Table, id: string, patch: Partial<T>) {
  const mode = storageMode();
  if (mode === "supabase")
    await sb(`/rest/v1/${t}?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(patch) });
  else if (mode === "local") await writeLocal<T>(t, (rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  else throw new Error("No database configured");
}

export async function upsert<T extends Row>(t: Table, row: T) {
  const mode = storageMode();
  if (mode === "supabase")
    await sb(`/rest/v1/${t}`, { method: "POST", headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(row) });
  else if (mode === "local") await writeLocal<T>(t, (rows) => (rows.some((r) => r.id === row.id) ? rows.map((r) => (r.id === row.id ? row : r)) : [...rows, row]));
  else throw new Error("No database configured");
}

// ---------- Files (private bucket in Supabase, .data/uploads locally) ----------
const BUCKET = "quote-uploads";
const safeKey = (key: string) => {
  if (!/^[a-z]+\/[A-Za-z0-9-]+\/[A-Za-z0-9-]+\.(jpg|png|webp|heic|heif)$/.test(key)) throw new Error("Bad file key");
  return key;
};

export async function putFile(key: string, buf: Buffer, type: string) {
  const mode = storageMode();
  if (mode === "supabase") {
    await sb(`/storage/v1/object/${BUCKET}/${safeKey(key)}`, { method: "POST", headers: { "Content-Type": type, "x-upsert": "false" }, body: new Uint8Array(buf) });
  } else if (mode === "local") {
    const dest = path.join(LOCAL_DIR, "uploads", safeKey(key));
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, buf);
  } else throw new Error("No storage configured");
}

const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", heic: "image/heic", heif: "image/heif" };
export async function getFile(key: string): Promise<{ body: Uint8Array; type: string } | null> {
  const k = safeKey(key);
  const type = TYPES[k.split(".").pop()!] ?? "application/octet-stream";
  const mode = storageMode();
  try {
    if (mode === "supabase") return { body: new Uint8Array(await (await sb(`/storage/v1/object/${BUCKET}/${k}`)).arrayBuffer()), type };
    if (mode === "local") return { body: new Uint8Array(await fs.readFile(path.join(LOCAL_DIR, "uploads", k))), type };
  } catch {
    return null;
  }
  return null;
}
