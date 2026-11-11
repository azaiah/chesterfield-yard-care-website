// Kie AI asset generator (Node, no SDK). Idempotent: any asset whose output already exists is skipped.
//
//   node --env-file=.env.local scripts/kie/generate.mjs            # generate anything missing
//   node --env-file=.env.local scripts/kie/generate.mjs hero-still # only these ids
//
// Reads scripts/kie/assets.json (same format as the asset kit's: style_* anchors + images[] + videos[]).
// Writes to public/media/generated/: original + AVIF/WebP (images) or mp4 (videos), plus <id>.prompt.txt.
// Verify model ids / params at https://docs.kie.ai before running — they change.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(HERE, "../../public/media/generated");
const BASE = "https://api.kie.ai/api/v1";
const KEY = process.env.KIE_API_KEY;
if (!KEY) throw new Error("KIE_API_KEY missing — run with --env-file=.env.local");

const cfg = JSON.parse(await fs.readFile(path.join(HERE, "assets.json"), "utf8"));
const only = new Set(process.argv.slice(2));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const exists = (f) => fs.access(f).then(() => true, () => false);
await fs.mkdir(OUT, { recursive: true });

// Kie returns HTTP 200 even on errors — the real status is body.code.
async function kie(method, route, body) {
  for (let attempt = 0; attempt < 8; attempt++) {
    const res = await fetch(BASE + route, {
      method,
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const j = await res.json().catch(() => ({ code: res.status, msg: res.statusText }));
    if (j.code === 200) return j.data;
    if (j.code === 429) { await sleep(5000 * 2 ** Math.min(attempt, 4)); continue; }
    const why = { 401: "auth failed", 402: "out of credits", 422: "validation error", 501: "generation failed" }[j.code] ?? "error";
    throw new Error(`Kie ${route} → ${j.code} ${why}: ${j.msg ?? JSON.stringify(j)}`);
  }
  throw new Error(`Kie ${route} rate-limited too many times`);
}

const fullPrompt = (a) => `${a.prompt} ${cfg["style_" + (a.style ?? "photo")] ?? ""}`.trim();

async function poll(check, timeoutMs) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    const r = await check();
    if (r) return r;
    await sleep(5000);
  }
  throw new Error("timed out");
}

async function download(url, file) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status}`);
  await fs.writeFile(file, Buffer.from(await res.arrayBuffer()));
}

async function image(a) {
  const png = path.join(OUT, `${a.id}.png`);
  if (await exists(png)) return console.log("skip", a.id);
  const prompt = fullPrompt(a);
  const { taskId } = await kie("POST", "/jobs/createTask", {
    model: a.model ?? "nano-banana-pro",
    input: { prompt, aspect_ratio: a.aspect_ratio ?? "16:9", resolution: a.resolution ?? "2K", output_format: "png", image_input: a.image_input ?? [] },
  });
  console.log("task", a.id, taskId);
  const urls = await poll(async () => {
    const d = await kie("GET", `/jobs/recordInfo?taskId=${taskId}`);
    if (d.state === "fail") throw new Error(`${a.id} failed: ${d.failMsg ?? ""}`);
    return d.state === "success" ? JSON.parse(d.resultJson).resultUrls : null;
  }, 10 * 60_000);
  await download(urls[0], png); // result URLs expire — fetch right away
  for (const w of [800, 1600, 2400]) {
    const base = () => sharp(png).resize({ width: w, withoutEnlargement: true });
    await base().webp({ quality: 80 }).toFile(path.join(OUT, `${a.id}-${w}.webp`));
    await base().avif({ quality: 55, effort: 4 }).toFile(path.join(OUT, `${a.id}-${w}.avif`));
  }
  await fs.writeFile(path.join(OUT, `${a.id}.prompt.txt`), `model: ${a.model ?? "nano-banana-pro"}\n\n${prompt}\n`);
  console.log("done", a.id);
}

async function video(v) {
  const mp4 = path.join(OUT, `${v.id}.mp4`);
  if (await exists(mp4)) return console.log("skip", v.id);
  const prompt = fullPrompt(v);
  const { taskId } = await kie("POST", "/veo/generate", {
    prompt,
    model: v.model ?? "veo3_fast",
    generationType: v.imageUrls ? "REFERENCE_2_VIDEO" : "TEXT_2_VIDEO",
    aspect_ratio: v.aspect_ratio ?? "16:9",
    ...(v.imageUrls ? { imageUrls: v.imageUrls } : {}),
  });
  console.log("task", v.id, taskId);
  const urls = await poll(async () => {
    const d = await kie("GET", `/veo/record-info?taskId=${taskId}`);
    if (d.successFlag === 1) return d.response.resultUrls;
    if (d.successFlag === 2 || d.successFlag === 3) throw new Error(`${v.id} failed: ${d.errorMessage ?? ""}`);
    return null;
  }, 20 * 60_000);
  await download(urls[0], mp4);
  await fs.writeFile(path.join(OUT, `${v.id}.prompt.txt`), `model: ${v.model ?? "veo3_fast"}\n\n${prompt}\n`);
  console.log("done", v.id);
}

const pick = (arr = []) => arr.filter((a) => !only.size || only.has(a.id));
for (const a of pick(cfg.images)) await image(a).catch((e) => console.error("FAIL", a.id, e.message));
for (const v of pick(cfg.videos)) await video(v).catch((e) => console.error("FAIL", v.id, e.message));
