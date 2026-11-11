// Builds the link-preview card (what iMessage/WhatsApp/Facebook show when the site link is texted or shared).
//   node scripts/og/make-preview-card.mjs
// Output: public/og/preview-card.jpg (1200x630). After changing it, bump ?v= in src/lib/seo.ts so apps refetch.
// Uses the Satori renderer bundled with Next (next/og), fonts in scripts/og/fonts (SIL OFL).
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const require = createRequire(path.join(ROOT, "package.json"));
const sharp = require("sharp");
const { createElement: h } = require("react");
const { ImageResponse } = await import(pathToFileURL(path.join(ROOT, "node_modules/next/dist/compiled/@vercel/og/index.node.js")).href);

const W = 1200, H = 630;
const brand = (p) => path.join(ROOT, "public/media/brand", p);
const font = (f) => fs.readFile(path.join(ROOT, "scripts/og/fonts", f));
const dataUri = async (buf, type) => `data:${type};base64,${buf.toString("base64")}`;

const bg = await dataUri(
  await sharp(brand("images/hero-2400.webp")).resize(W, H, { fit: "cover", position: "right" }).modulate({ saturation: 1.08 }).jpeg({ quality: 88 }).toBuffer(),
  "image/jpeg",
);
const logo = await dataUri(await sharp(brand("logo/logo-on-navy-tight.svg"), { density: 300 }).resize({ width: 820 }).png().toBuffer(), "image/png");
const badges = await Promise.all(
  ["badge-mowing", "badge-leaf-cleanup", "badge-mulch-gravel", "badge-tree-work"].map(async (b) =>
    dataUri(await sharp(brand(`badges/${b}.webp`)).resize(160).png().toBuffer(), "image/png"),
  ),
);

const LIME = "#8DC63F", LIME_LT = "#B8E06A", NAVY = "#07142B", FOREST = "#06210F", ELECTRIC = "#2F7BFF", SUN = "#F5E21A";

const card = h(
  "div",
  { style: { width: W, height: H, display: "flex", position: "relative", background: NAVY, fontFamily: "Inter" } },
  h("img", { src: bg, width: W, height: H, style: { position: "absolute", top: 0, left: 0, objectFit: "cover" } }),
  h("div", {
    style: {
      position: "absolute", top: 0, left: 0, width: W, height: H, display: "flex",
      backgroundImage: "linear-gradient(90deg, rgba(6,33,15,0.96) 0%, rgba(6,33,15,0.9) 40%, rgba(6,33,15,0.45) 62%, rgba(6,33,15,0) 82%)",
    },
  }),
  // Electric-blue frame from the flyer
  h("div", {
    style: {
      position: "absolute", top: 18, left: 18, right: 18, bottom: 18, display: "flex", borderRadius: 30,
      border: `4px solid ${ELECTRIC}`, boxShadow: `0 0 28px rgba(47,123,255,0.85), inset 0 0 24px rgba(47,123,255,0.35)`,
    },
  }),
  // FREE QUOTES sticker
  h(
    "div",
    {
      style: {
        position: "absolute", top: 54, right: 62, width: 168, height: 168, borderRadius: 999, background: SUN,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: "rotate(-10deg)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)", border: `5px solid ${FOREST}`,
      },
    },
    h("div", { style: { fontFamily: "Barlow", fontSize: 50, color: FOREST, lineHeight: 0.9 } }, "FREE"),
    h("div", { style: { fontFamily: "Barlow", fontSize: 36, color: FOREST, lineHeight: 0.95 } }, "QUOTES"),
  ),
  // Left content
  h(
    "div",
    { style: { position: "absolute", left: 66, top: 52, width: 720, display: "flex", flexDirection: "column" } },
    h("img", { src: logo, width: 410, height: 103, style: { marginLeft: -6 } }),
    h("div", { style: { marginTop: 22, fontFamily: "Graduate", fontSize: 22, letterSpacing: 3, color: LIME_LT } }, "CHESTERFIELD & MIDLOTHIAN, VA"),
    h(
      "div",
      { style: { marginTop: 10, display: "flex", flexDirection: "column", fontFamily: "Barlow", fontSize: 112, lineHeight: 0.88, color: "#fff" } },
      h("div", null, "YOUR YARD,"),
      h("div", { style: { color: LIME } }, "HANDLED."),
    ),
    h("div", { style: { marginTop: 20, fontSize: 24, color: "rgba(255,255,255,0.92)", lineHeight: 1.35, maxWidth: 640 } },
      "Mowing · Mulch & Gravel · Leaf Cleanup · Tree Work · Aeration · Junk Removal"),
    h(
      "div",
      { style: { marginTop: 26, display: "flex", alignItems: "center" } },
      h(
        "div",
        { style: { display: "flex", alignItems: "center", background: LIME, color: FOREST, borderRadius: 999, padding: "12px 30px", fontFamily: "Barlow", fontSize: 40, boxShadow: "0 8px 24px rgba(141,198,63,0.45)" } },
        "CALL OR TEXT 804-773-8271",
      ),
    ),
  ),
  // Service badges, bottom right
  h(
    "div",
    { style: { position: "absolute", right: 58, bottom: 50, display: "flex" } },
    ...badges.map((src, i) => h("img", { key: i, src, width: 92, height: 92, style: { marginLeft: i ? -14 : 0, borderRadius: 999, boxShadow: "0 6px 18px rgba(0,0,0,0.45)" } })),
  ),
);

const res = new ImageResponse(card, {
  width: W,
  height: H,
  fonts: [
    { name: "Barlow", data: await font("barlow-condensed-800.ttf"), weight: 800, style: "normal" },
    { name: "Graduate", data: await font("graduate-400.ttf"), weight: 400, style: "normal" },
    { name: "Inter", data: await font("inter-600.ttf"), weight: 600, style: "normal" },
  ],
});
const png = Buffer.from(await res.arrayBuffer());
await fs.mkdir(path.join(ROOT, "public/og"), { recursive: true });
const out = path.join(ROOT, "public/og/preview-card.jpg");
await sharp(png).jpeg({ quality: 88, mozjpeg: true }).toFile(out);
const { size } = await fs.stat(out);
console.log(`wrote ${out} (${Math.round(size / 1024)} KB)`);
