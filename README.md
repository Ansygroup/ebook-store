# دار المعرفة — متجر الكتب الإلكترونية

متجر احترافي جاهز لبيع الكتب الإلكترونية (eBooks) مبني بـ:
**React + TypeScript + Vite + Framer Motion (موشن) + Snipcart (سلة ودفع)**
مع **فحوصات آلية** (Unit بـ Vitest + E2E بـ Playwright).

## الميزات
- تصميم عربي احترافي RTL عصري (وضع داكن، تدرّجات، ظلال).
- أنيميشن موشن حي عبر Framer Motion (Hero، بطاقات، نقرات FAQ).
- متجر كامل: صفحة رئيسية + متجر بفلترة وتصنيفات وترتيب + صفحة تفاصيل لكل كتاب.
- سلة دفع جاهزة عبر Snipcart (بطاقات + Apple Pay) مع روابط تحميل فورية.
- 6 كتب نموذجية بأغلفة SVG مولّدة + أسعار + تقييمات.
- فحوصات: `vitest` (وحدة + مكوّنات) و `playwright` (تدفق المتجر كاملاً).

## التشغيل السريع
```bash
npm install
npm run covers      # يولّد أغلفة الكتب في public/covers/
npm run dev        # http://localhost:5173
```

## ربط الدفع الحقيقي (Snipcart)
1. أنشئ حساباً على https://snipcart.com واحصل على **Public API Key**.
2. ضعه في `.env`:
   ```
   VITE_SNIPCART_API_KEY=مفتاحك_العام_هنا
   ```
3. ارفع ملفات الكتب (PDF/EPUB) إلى `public/downloads/` واربط كل كتاب
   عبر `data-item-file-guid` في `src/components/BookCard.tsx` و
   `src/pages/BookDetail.tsx` (المعرّف الفريد لكل ملف تحميل).
4. عدّل بيانات الكتب/الأسعار في `src/data/books.ts`.

## الفحوصات
```bash
npm test                 # اختبارات الوحدة (Vitest)
npm run test:e2e:install # تثبيت متصفح Playwright (مرة واحدة)
npm run test:e2e         # اختبار تدفق المتجر النهائي (E2E)
npm run check-env        # يتحقق من جاهزية الإعداد للنشر
```

## النشر
- **يدوي/آلي على Netlify:**
  ```bash
  export NETLIFY_AUTH_TOKEN="ntn_xxxx"   # من لوحة Netlify
  npm run deploy                          # يبني وينشر على Netlify
  ```
- **أسهل (مستمر):** اربط الريبو بـ GitHub ثم بـ Netlify (يقرأ `netlify.toml`
  تلقائياً). ارفع محتوى `dist/` على أي استضافة ثابتة أخرى إن رغبت.
- ملف `_redirects` + `netlify.toml` يضمنون عمل SPA (إعادة كل المسارات لـ index.html).


## البناء للإنتاج
```bash
npm run build            # يخرج مجلد dist/ الجاهز للنشر
npm run preview          # معاينة النسخة المبنية
```

## النشر
ارفع محتوى `dist/` على أي استضافة ثابتة (Netlify / Vercel / Cloudflare Pages).
تأكد من ضبط إعادة التوجيه (SPA fallback) إلى `index.html`.
