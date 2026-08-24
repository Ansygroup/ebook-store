# 🔗 Stripe Setup — خطوات مطلوبة منك (15 دقيقة)

## المشكلة الحالية
كل الكتب العشر تشير إلى نفس رابط الدفع ($19.99). مشتري كتاب $24.99 سيُحاسب $19.99 ويستلم الكتاب الخطأ.

## الحل: أنشئ Payment Link لكل كتاب

1. ادخل [dashboard.stripe.com/payment-links](https://dashboard.stripe.com/payment-links)
2. اضغط **+ Add new** → **Payment link**
3. لكل كتاب: اسم المنتج + السعر الصحيح (من القائمة أدناه) 
4. **مهم جداً**: في إعدادات الرابط، أضف `client_reference_id` = slug الكتاب
   (أو في After payment → add metadata: `slug = {slug}`)
5. انسخ الرابط الناتج

### الأسعار والـ slugs:

| الكتاب | السعر | client_reference_id |
|---|---|---|
| The Influential Leader | $19.99 | the-influential-leader |
| Build Your Empire | $24.99 | build-your-empire |
| Deep Productivity | $14.99 | deep-productivity |
| Design Your Mindset | $12.99 | design-your-mindset |
| Tech for Everyone | $17.99 | tech-for-everyone |
| Health Without Limits | $9.99 | health-without-limits |
| The Art of Negotiation | $15.99 | art-of-negotiation |
| Smart Investing | $21.99 | smart-investing |
| Content Craft | $13.99 | content-writing |
| Learn Languages | $11.99 | learn-languages |

## بعد إنشاء الروابط:

### أ) حدّث books.json
استبدل كل `stripeUrl` بالرابط الصحيح لكتابه، ثم:
```
git add -A && git commit -m "fix: per-book Stripe payment links" && git push
```

### ب) فعّل Webhook (للتسليم الآلي)
1. [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks) → **Add endpoint**
2. URL: `https://ebook-store-ten-flax.vercel.app/api/stripe-webhook`
3. Event: `checkout.session.completed`
4. انسخ `whsec_...` ثم:
```
cd repos/ebook-store
npx vercel env add STRIPE_WEBHOOK_SECRET production
# الصق القيمة عند الطلب
npx vercel deploy --prod --yes
```

### ج) اختبار
اشترِ كتاباً بنفسك → المفروض يوصلك الإيميل بمرفق PDF خلال دقيقة.

---
**بعد هذه الخطوات: المتجر يعمل أوتوماتيكياً 100% — عميل يشتري → يستلم كتابه فوراً بدون تدخلك.**
