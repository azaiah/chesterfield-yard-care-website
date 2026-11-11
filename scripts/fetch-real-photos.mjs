// Downloads the real Chesterfield/Midlothian photos listed in real-photos.json from
// Wikimedia Commons, resizes to web sizes, and writes credits.json for the /credits page.
// Run from the project root:  node scripts/fetch-real-photos.mjs
// Needs: npm i sharp
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const list = JSON.parse(await fs.readFile(path.join(HERE, "real-photos.json"), "utf8")).photos;
sharp.concurrency(1);
sharp.cache(false);
const OUT = path.resolve("public/media/local");
const exists = (f) => fs.access(f).then(() => true, () => false);
await fs.mkdir(OUT, { recursive: true });
const UA = "ChesterfieldYardCareSite/1.0 (local-business website build; https://commons.wikimedia.org)"; // Wikimedia asks for a descriptive UA

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function getRetry(url, as = "json") {
  for (let i = 0; i < 6; i++) {
    const r = await fetch(url, { headers: { "User-Agent": UA } });
    if (r.ok) return as === "json" ? r.json() : Buffer.from(await r.arrayBuffer());
    console.warn(`  ${r.status} — backing off`);
    await sleep(5000 * 2 ** i);
  }
  throw new Error("gave up on " + url);
}
const credits = [];
for (const p of list) {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent("File:" + p.file)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=2400`;
  const j = await getRetry(api);
  await sleep(1500);
  const ii = Object.values(j.query.pages)[0].imageinfo?.[0];
  if (!ii) { console.warn("missing", p.file); continue; }
  const m = ii.extmetadata || {};
  const done = await exists(path.join(OUT, `${p.slug}-2400.webp`));
  if (!done) {
    const buf = await getRetry(ii.thumburl || ii.url, "buf");
    for (const w of [800, 1600, 2400]) {
      const base = () => sharp(buf).rotate().resize({ width: w, withoutEnlargement: true });
      await base().webp({ quality: 78 }).toFile(path.join(OUT, `${p.slug}-${w}.webp`));
      try {
        await base().avif({ quality: 55, effort: 2 }).toFile(path.join(OUT, `${p.slug}-${w}.avif`));
      } catch (e) {
        console.warn("  avif skipped", p.slug, w, String(e.message).slice(0, 80));
      }
    }
    await new Promise((r) => setTimeout(r, 2500)); // be polite to Wikimedia
  }
  const meta = await sharp(path.join(OUT, `${p.slug}-1600.webp`)).metadata();
  credits.push({
    slug: p.slug, width: meta.width, height: meta.height, title: p.file.replace(/\.\w+$/, ""), artist: p.artist,
    license: m.LicenseShortName?.value || p.license, licenseUrl: m.LicenseUrl?.value || "",
    source: ii.descriptionurl, attributionRequired: !/CC0|Public domain/i.test(p.license),
  });
  console.log("ok", p.slug);
}
await fs.writeFile(path.resolve("src/content/photo-credits.json"), JSON.stringify(credits, null, 2)).catch(async () => {
  await fs.writeFile(path.join(OUT, "photo-credits.json"), JSON.stringify(credits, null, 2));
});
console.log(`done: ${credits.length} photos`);
