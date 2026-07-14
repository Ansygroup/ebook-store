# 🟢 ONE-COMMAND LAUNCH (when you have the accounts)

## Prerequisites (your accounts — I can't access these)
1. Gumroad links (10 product URLs) → paste into `gumroad-links.json`
2. Vercel token (rotate at vercel.com/account/tokens) → GitHub secret `VERCEL_TOKEN`
   → enables newsletter + order-confirm APIs
3. IG account linked on Composio → GitHub secret `IG_ACCOUNT`
4. Gmail account id → GitHub secret `GMAIL_ACCOUNT`
5. Meta Pixel ID → replace `YOUR_PIXEL_ID` in `index.html`

## Run everything (after prerequisites)
```bash
# 1. Gumroad links
cp gumroad-links.example.json gumroad-links.json
#   ← paste your 10 Gumroad product URLs
npm run gumroad:fill

# 2. Build + deploy (Pages goes live with buy buttons)
npm run launch
#   (fills links, regenerates assets/SEO, builds, commits, pushes)

# 3. That's it — marketing.yml auto-posts IG daily + emails Mondays
#    (needs IG_ACCOUNT + GMAIL_ACCOUNT secrets set in GitHub)
```

## What runs automatically (zero touch after setup)
| Cadence | Action | Needs |
|---------|--------|-------|
| Every push | Build + deploy to Pages + Vercel | VERCEL_TOKEN (for API) |
| Daily 09:00 UTC | Post 1 IG caption+image from `ig-queue/` | IG_ACCOUNT |
| Monday 09:00 UTC | Send 5-email welcome sequence | GMAIL_ACCOUNT + SEND=1 |
| On signup | Newsletter confirm email | VERCEL_TOKEN + GMAIL_ACCOUNT |

## Status
- [x] Code global (EN/LTR) + bilingual AR
- [x] Marketing EN (30 IG / 5 email / 10 Pinterest / Meta)
- [x] Assets (10 promo / 10 covers / 10 PDF)
- [x] Automation scripts (launch / gumroad:fill / email:send / ig:promote)
- [x] CI workflows (deploy + marketing cron)
- [x] 40 tests green + CI green + live on Pages
- [ ] Gumroad links — YOU (gumroad-links.json)
- [ ] Vercel token — YOU (rotate)
- [ ] IG account — YOU (link on Composio)
- [ ] Gmail account — YOU (verify id)
- [ ] Meta Pixel — YOU (index.html)
