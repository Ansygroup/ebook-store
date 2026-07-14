# 📋 Required Placeholders (fill in manually)

All of these are **intentional** — the site works without them (via fallbacks) but won't actually sell/post.

---

## 🔴 Critical (block selling / confirmation)
| File | Field | Current value | Replace with |
|---|---|---|---|
| `src/data/books.json` (×10) | `gumroadUrl` | `REPLACE_WITH_YOUR_LINK_XXX` | real Gumroad link |
| `src/data/books.json` (×10) | `downloadUrl` | `/downloads/<slug>.pdf` | ✅ correct (placeholder PDFs) |
| `public/downloads/*.pdf` | the file itself | ~900B stub | the real book PDF |
| `index.html` | `YOUR_PIXEL_ID` | `YOUR_PIXEL_ID` | Meta Pixel ID |
| `scripts/apply-vercel-token.mjs` ← env | `VERCEL_TOKEN` | (redacted) | fresh token from vercel.com |
| `~/.hermes/composio_key` | Composio API key | (redacted) | new key |
| `~/.hermes/vercel_token` | Vercel token | (redacted) | new token |

---

## 🟡 Composio accounts (from memory — may drift)
| ID | Status | Use |
|---|---|---|
| `ca_ru-ZbwXlFsGQ` | **Gumroad ACTIVE** | order/email confirmation |
| `ca_d461BvmxN65-` | **IG STALE** | auto-posting (link a new IG) |
| `ca_BmQnzbsU5u3T` | Gmail placeholder | fallback in `api/*.ts` — replace with real `GMAIL_ACCOUNT` env |

---

## 🟢 Ready (no change needed)
- ✅ GitHub Pages live + all assets served
- ✅ Vercel API functions (just need a valid token)
- ✅ SEO/AEO (llms.txt, sitemap, JSON-LD)
- ✅ 30 IG captions + 5-email + 10 Pinterest + Meta funnel (all English)
- ✅ Meta Pixel (fires instantly with a real ID)
- ✅ daily IG cron (`f3d80ba9beeb`)

---

## 🚀 Quick steps
```bash
# 1) Gumroad links
node scripts/gumroad_sync.mjs --links   # see what's missing
# fill gumroad-links.json then:
node scripts/fill-gumroad.mjs && git add -A && git commit -m "feat: real Gumroad" && git push

# 2) Vercel token (unfreezes the API)
VERCEL_TOKEN=XXX node scripts/apply-vercel-token.mjs

# 3) Pixel ID (index.html around line 139)
# replace YOUR_PIXEL_ID

# 4) Real PDFs → public/downloads/<slug>.pdf
```
