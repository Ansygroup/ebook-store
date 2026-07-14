# 🚀 Launch Checklist (manual steps — cannot be automated)

Store is live & global: https://ansygroup.github.io/ebook-store
Everything below needs YOUR accounts/secrets. Automation is ready; execution is manual.

---

## 1. Gumroad products (enables selling)
1. Go to gumroad.com → Products → New
2. Create 10 products (one per book). Use `public/books.json` for titles/prices:
   | slug | price |
   |------|-------|
   | the-influential-leader | $19.99 |
   | build-your-empire | $24.99 |
   | deep-productivity | $14.99 |
   | design-your-mindset | $12.99 |
   | tech-for-everyne | $11.99 |
   | health-without-limits | $9.99 |
   | art-of-negotiation | $13.99 |
   | smart-investing | $21.99 |
   | content-writing | $10.99 |
   | learn-languages | $15.99 |
3. Copy each product URL
4. `cp gumroad-links.example.json gumroad-links.json` → paste URLs
5. `npm run gumroad:fill` (fills src/data/books.json + syncs public/books.json)
6. `npm run build && git push` → buy buttons go live

## 2. Real PDFs (replace placeholders)
Option A: drop real `<slug>.pdf` into `public/downloads/` (overwrites generated samples)
Option B: `node scripts/generate-pdfs.mjs` regenerates valid sample PDFs
Then `npm run build && git push`

## 3. Instagram (manual post — Composio IG has no post/schedule tool)
- Captions ready: `marketing/ig-captions.md` (30) + `ig-queue/<date>-<slug>.md` (daily)
- Images ready: `public/promo/<slug>.png` (live on Pages)
- To auto-post later: link an IG Business account on Composio dashboard, then
  `npm run ig:promote` (script exists, needs linked account)
- Or post manually: open `public/promo/<slug>.png` + copy caption from `ig-queue/`

## 4. Email sequence (staged, not sent)
- `marketing/sequence.json` = 5 emails, ready
- Send via your sender (Gumroad/Mailchimp), OR
- `SEND=1 GMAIL_ACCOUNT=<your-gmail-account-id> npm run email:send`
  ⚠️ verify GMAIL_ACCOUNT is actually Gmail first (default ca_BmQnzbsU5u3T unverified)
  ⚠️ this actually emails people — review sequence.json

## 5. Meta Pixel (analytics)
1. business.facebook.com → Events Manager → create Pixel
2. Copy Pixel ID
3. In `index.html`: replace `YOUR_PIXEL_ID` in the Meta Pixel snippet
4. `npm run build && git push`

## 6. Verify live
- Store: https://ansygroup.github.io/ebook-store (EN/LTR confirmed)
- Buy button → Gumroad overlay (after step 1)
- Newsletter signup → Gmail confirm (already working via Composio)
- SEO: https://ansygroup.github.io/ebook-store/llms.txt

## Status
- [x] Code global (EN/LTR) — DONE
- [x] Marketing content EN — DONE
- [x] Assets (promo/covers/PDFs) — DONE
- [x] Email sequence staged — DONE
- [x] Scripts ready (gumroad:fill, email:send, ig:promote) — DONE
- [ ] Gumroad links — YOU
- [ ] Real PDFs — YOU (or keep samples)
- [ ] IG posting — YOU (or link account)
- [ ] Email send — YOU (review + SEND=1)
- [ ] Meta Pixel — YOU
