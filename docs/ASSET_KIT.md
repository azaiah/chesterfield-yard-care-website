# Chesterfield Yard Care — Custom Asset Kit (Powered by DataIsData)

Hand this folder to Claude Code together with `CHESTERFIELD_YARD_CARE_BUILD_PROMPT.md`.
**Instruction for Claude Code:** Copy this whole folder (`asset-kit/`) to `public/media/brand/`, then use these assets instead of generating new ones in Phase 1. Only call Kie AI for anything missing.

## What's inside
| Folder | Contents | Where it goes on the site |
|---|---|---|
| `images/` | `hero` (main, open space on left for headline), `hero-alt`, `hero-mobile` (9:16), `leaf-season`, `cta-dusk` (21:9 final CTA band), `og-base`, `og-image-1200x630.jpg` (ready share image), 7 service photos `svc-*`, 4 `season-*` — each at 800/1600/2400 `.webp` + a 1600 `.jpg` | Hero, service cards + service page heroes, seasonal module, Yard Club calendar, final CTA, Open Graph |
| `video/` | `hero-loop` (8s, 1280×720 mp4 ≈3 MB + webm ≈1.9 MB + 9:16 `-mobile.mp4` + poster), `leaf-loop` (fall module, + mobile + poster) | Hero background (poster first, video lazy), leaf-season band |
| `badges/` | 7 glossy 3D service badges (navy center, electric-blue ring, lime icon), 512px transparent PNG + webp | Service strip under hero, card icons, nav mega-menu |
| `illustrations/` | Clay-style spot art: text-a-photo, quote, done (mini zero-turn diorama), calendar, map pin, leaf pile | "How it works", Yard Club, service area, leaf-season promos, empty states |
| `ui/` | `btn-skin-lime`, `btn-skin-blue` (button skins), `frame-electric` (flyer-style frame), leaf sprites (maple, oak, green) | Buttons, quote card, falling-leaf effect |
| `textures/` | Seamless tiles: grass stripes, mulch, river rock, navy topo lines, fall leaves (1024px) | Section backgrounds, dark bands, footer |
| `logo/` | Outlined SVG lockups rebuilt from the flyer: full color, on navy, reversed, one-color, `CYC` badge icon + favicon.ico, 32/180/192/512 icons, PNGs | Header, footer, favicon, PWA manifest, portal |
| `components/` | `cyc-ui.css` (tokens, lime/electric/ghost buttons, phone pill, electric frame, badge hover, feature card, step card, stripe/topo/mulch backgrounds, sticky mobile action bar, falling leaves, before/after handle) and `CycUI.tsx` (React/Next components using all of the above) | Import into `app/globals.css` and `components/` |
| `real-photos/` | `real-photos.json` (22 licensed photos of real Chesterfield/Midlothian places) + `fetch-real-photos.mjs` | Town pages, service-area section, About |
| `scripts/` | `kie.py` + `assets.json` (exact prompts used, re-runnable, reads `KIE_API_KEY` from env) | Regenerate or add assets in the same style |

## Real local photos — rules
- Run `node scripts/fetch-real-photos.mjs` (copy `real-photos/` into `scripts/`). It downloads from Wikimedia Commons, makes 800/1600/2400 AVIF+WebP into `public/media/local/`, and writes `photo-credits.json`.
- CC0 needs no credit. **CC BY 2.0 / BY 4.0 / BY-SA 3.0 must show photographer + license**: add a `/credits` page and a small caption on the image. The Pocahontas State Park shots are by Virginia State Parks staff (credit "Virginia State Parks / DCR, CC BY 2.0").
- These are not the company's work. Never put them in "Our Work" / before-after.
- Suggested mapping: Swift Creek Reservoir + Woodlake tower → Woodlake/Brandermill pages; Historic Courthouse + Pocahontas SP → Chesterfield Court House page; Mid-Lothian Mines Park + Robious Landing + Tarrington → Midlothian page; Buford Oaks → Bon Air/North Chesterfield; Ramsgate / Spring Grove / Smoketree entrances → HOA section ("we keep entrances like these sharp").

## Honesty rules for AI imagery
- Kie images are atmosphere. Label nothing as a real job. Gallery and before/after = owner's photos only.
- No AI people, trucks with branding, or fake reviews were generated.

## Notes
- Generated with Kie AI `nano-banana-pro` (images) and `veo3_fast` (video), Nov 11 2026.
- Fonts used for the logo (open-source, Google Fonts): Graduate (wordmark), Barlow Condensed ExtraBold. Site also uses Instrument Serif + Inter.
- Footer must carry "Powered by DataIsData" using the official DataIsData lockup file (not included here; ask Azaiah).
- Rotate the Kie API key after launch — it was shared in chat.
