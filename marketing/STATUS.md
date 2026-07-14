# 📊 Marketing Status & Action Plan (auto-generated)

Generated: 2026-07-14 · Store: https://ansygroup.github.io/ebook-store (EN/LTR, global)

## ✅ Done (automated)
- [x] Promo images: `public/promo/<slug>.png` (10/10) — live on Pages
- [x] Book covers: `public/covers/<slug>.png` (10/10)
- [x] IG captions: `marketing/ig-captions.md` (30 EN) + `ig-queue/<date>-<slug>.md` (EN-first, regenerated)
- [x] Email sequence: `marketing/email-sequence.md` (5 EN) → `marketing/sequence.json` (ready to send)
- [x] Pinterest pins: `marketing/pinterest-pins.md` (10 EN)
- [x] Meta ads funnel: `marketing/meta-ads-funnel.md` (EN)
- [x] Newsletter live: `/api/subscribe` → Gmail confirmation (Composio)

## 🔴 Blocked (manual — needs secrets/accounts)
| Item | Why blocked | Action |
|------|-------------|--------|
| **Gumroad product links** | `books.json` has 10× `REPLACE_WITH_YOUR_LINK_X` | Create 10 products on gumroad.com → paste URLs into `books.json` → `npm run gumroad:sync` |
| **IG auto-post** | No IG account linked on Composio (expired `ca_d461BvmxN65-`); toolkit has no post/schedule tool | Link IG business account on Composio OR post manually from `ig-queue/` |
| **Email send** | Sequence staged but not dispatched (no bulk send wired) | Paste `sequence.json` into Gumroad/Mailchimp, OR wire Composio Gmail loop |
| **Meta Pixel** | `YOUR_PIXEL_ID` placeholder in `index.html` | Create Pixel → replace ID → rebuild |
| **Real PDFs** | `public/downloads/*.pdf` are ~900B placeholders | Generate real PDFs via `scripts/generate-pdfs.mjs` or drop files |

## 🚀 To actually launch (manual)
1. Gumroad: create 10 products, copy URLs → `src/data/books.json` + `public/books.json`
2. `npm run build && git push` → Pages goes live with buy buttons
3. IG: post `ig-queue/*.md` (caption + image) weekly, or link Composio IG
4. Email: import `marketing/sequence.json` to your sender, trigger on signup
5. Meta: launch $5/day campaign from `meta-ads-funnel.md` after Pixel is set

## 📈 What's working right now (no manual step)
- Store renders globally (EN/LTR) — verified live
- SEO/AEO: llms.txt, sitemap.xml, robots.txt live
- Newsletter capture works (writes email, sends confirm via Gmail)
- All 40 tests green, CI green
