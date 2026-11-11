# Chesterfield Yard Care — website, owner portal, weekly Lead Sweep

Built by DataIsData. Next.js 15 (App Router) + TypeScript + Tailwind v4.

## Run it

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

Useful pages while building: `/styleguide` (brand style tile), `/credits` (photo licenses).

## Where things live

| Path | What |
|---|---|
| `src/lib/site.ts` | Business facts (phone, services, towns). Unconfirmed facts stay `null` / `confirmed: false`. |
| `src/app/globals.css` + `src/app/cyc-ui.css` | Brand tokens (Tailwind theme + CSS vars), light/dark themes, UI kit classes |
| `src/components/brand/CycUI.tsx` | Buttons, phone pill, badges, feature/step cards, hero media, mobile action bar, `<Pending>` |
| `public/media/brand/` | The asset kit (images, video loops, badges, illustrations, logos, textures, UI art) |
| `public/media/local/` + `src/content/photo-credits.json` | 22 licensed Wikimedia photos of Chesterfield/Midlothian, credited on `/credits` and on each image |
| `content/CONFIRM_WITH_OWNER.md` | Every unverified fact. Shown as dashed placeholders until confirmed. |
| `scripts/fetch-real-photos.mjs` | Re-downloads the local photos (`node scripts/fetch-real-photos.mjs`) |
| `scripts/kie/generate.mjs` | Generates any *missing* Kie AI asset from `scripts/kie/assets.json` (skips existing outputs) |

## Honesty rules
- AI images are atmosphere only — never "our work". Gallery/before-after = owner's real photos only.
- No invented reviews, ratings, years, licenses or prices. Use `<Pending>` until confirmed.
- Local Wikimedia photos need visible credit when the license is CC BY / BY-SA.

## Rotate the Kie key after launch
The Kie API key was shared in chat while building. After launch:
1. Sign in at https://kie.ai → API keys → create a new key and revoke the old one.
2. Update `KIE_API_KEY` in `.env.local` (and in Netlify env vars if it's ever added there — it shouldn't need to be).
3. The key is only used by `scripts/kie/generate.mjs` on a developer machine. It is never shipped to the browser.
