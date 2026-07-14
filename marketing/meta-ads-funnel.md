# 📢 Meta Ads Funnel ($5/day)

Goal: cheap traffic → Lead magnet (free book) → Newsletter → Sell.
The API (`/api/subscribe`) collects emails. Free PDF = `health-without-limits.pdf`.

> Store: https://ansygroup.github.io/ebook-store

---

## 🎯 Funnel structure (3 levels)

### Level 1 — TOFU (awareness) · $2/day
- **Objective:** Traffic / Engagement
- **Audience:** Broad — interests: self-improvement, entrepreneurship, productivity, books, Kindle. Age 22–45, worldwide English.
- **Creative:** Best IG hooks (reuse captions A). Carousel of 5 covers.
- **CTA:** "Get a free book" → landing page (homepage with newsletter form).

### Level 2 — MOFU (consideration) · $2/day
- **Objective:** Leads (or Traffic to `/shop`)
- **Audience:** Retarget — website visitors (last 30 days) + video viewers (50%+).
- **Creative:** "Which book do you need?" carousel. Testimonial-style copy.
- **CTA:** "Browse all 10 books" → `/shop`.

### Level 3 — BOFU (conversion) · $1/day
- **Objective:** Conversions (Purchase via Pixel)
- **Audience:** Retarget — added-to-cart / viewed a book page / newsletter subscribers.
- **Creative:** Single best-seller (Build Your Empire / Smart Investing). Price + urgency.
- **CTA:** "Get instant access" → specific book page.

---

## 📊 Meta Pixel setup
The Pixel is already installed in `index.html` (safe no-op until you add a real ID):

1. Create a Pixel at business.facebook.com → Events Manager.
2. Replace `YOUR_PIXEL_ID` in `index.html` with the real ID.
3. Events already wired:
   - `PageView` — automatic on every page.
   - `Lead` — fires on newsletter subscribe (`Newsletter.tsx`).
4. Add `Purchase` on the Gumroad thank-you page (Gumroad → Settings → Analytics → Facebook Pixel).

---

## 💰 Budget math ($5/day = ~$150/month)
- Target CPC: $0.10–0.30 (broad English) → ~500–1,500 clicks/month.
- Lead magnet opt-in rate ~20% → 100–300 emails/month.
- Email→sale ~2–4% → a handful of sales; the email list compounds.

## Scaling rule
Only scale a level once it's profitable. Kill any ad set with CPC > $0.50 after 3 days. Double budget on winners weekly (max +50%/day to avoid resetting learning).
