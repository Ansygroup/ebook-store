# دار المعرفة — متجر الكتب الإلكترونية (E-Book Store)

متجر عربي RTL جاهز للإنتاج لبيع الكتب الإلكترونية، مبني بـ:
**React + TypeScript + Vite + Framer Motion + Gumroad (دفع) + API خادمي (Vercel functions)**
مع **فحوصات آلية** (Unit بـ Vitest + E2E بـ Playwright).

## الميزات
- تصميم عربي احترافي RTL (داكن، تدرّجات، ظلال) + نسخة إنجليزية عبر i18n.
- أنيميشن موشن حي عبر Framer Motion (Hero، بطاقات، FAQ).
- متجر كامل: صفحة رئيسية + متجر بفلترة/تصنيفات/ترتيب + صفحة تفاصيل لكل كتاب.
- **زر شراء Gumroad** (overlay) — أو fallback لصفحة الكتاب إن الرابط placeholder.
- **10 كتب** بأغلفة PNG 1200×1800 + promo 1080×1080 + PDFs نموذجية.
- **API خادمي**: تأكيد طلب عبر Gmail + نشرة بريدية، محمي بـ (rate-limit IP+email + honeypot + referer guard).
- **SEO/AEO**: sitemap + robots + llms.txt + JSON-LD (BookStore + FAQPage + OfferCatalog).
- فحوصات: `vitest` (30 unit) + `playwright` (10 e2e).

## التشغيل المحلي
```bash
npm install
npm run dev          # http://localhost:5173
```

## ربط الدفع الحقيقي (Gumroad)
1. أنشئ المنتجات على https://gumroad.com/products واحصل على روابط الشراء.
2. انسخ `gumroad-links.example.json` → `gumroad-links.json` واملأ الروابط.
3. شغّل: `node scripts/fill-gumroad.mjs` (يحدّث `src/data/books.json`).
4. `git add -A && git commit && git push`.

> حتى بدون روابط حقيقية، زر الشراء يفتح صفحة الكتاب (فيه نموذج طلب بالإيميل + تحميل PDF).

## الفحوصات
```bash
npm test               # وحدة (Vitest)
npm run test:e2e       # E2E (Playwright — متصفح حقيقي)
npm run check-env      # يتحقق من جاهزية الإعداد
```

## النشر (GitHub Pages = القناة الحية)
```bash
git push origin master   # Pages ينشر dist/ تلقائيًا عبر pages.yml
```
- **Vercel** (اختياري): ينشر الـ API functions — `vercel deploy --prod` (يتطلب `VERCEL_TOKEN`).
- الـ API (`/api/confirm-order`, `/api/subscribe`) يشير لـ Vercel عبر `VITE_API_BASE`.

## البناء للإنتاج
```bash
npm run build          # يولّد كل الأصول (covers/promo/pdfs/seo) → dist/
npm run preview        # معاينة
```

## التدوير اليدوي (مفاتيح/حسابات)
انظر `DO-ROTATE.md` — خطوات جاهزة لتدوير: Vercel token، GitHub OAuth، Composio (Gmail/IG)، روابط Gumroad.

## التسويق (Instagram)
- `scripts/ig-prepare.mjs` يحضّر منشور يومي (صورة promo + كابشن) في `ig-queue/` (cron 09:00).
- `IG_GUIDE.md` يشرح النشر اليدوي من `ig-queue/`.

## البنية
```
src/                  الكود المصدري (React + API client)
api/                  Vercel functions (confirm-order, subscribe)
scripts/              توليد الأصول (covers/promo/pdfs/seo) + ig-prepare + fill-gumroad
public/               الأصول الثابتة (covers/promo/downloads + llms.txt/sitemap/robots)
e2e/ tests/           فحوصات Playwright + Vitest
```
