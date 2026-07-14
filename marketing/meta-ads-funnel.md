# 📢 Meta Ads Funnel ($5/يوم)

الهدف: Traffic رخيص → Lead magnet (كتاب مجاني) → Newsletter → Sell.
الـ API (`/api/subscribe`) يجمع الإيميلات. الـ PDF المجاني = `health-without-limits.pdf`.

---

## 🎯 الهيكل (3 مستويات)

### المستوى 1 — Awareness (IG/FB Post → Shop)
- **الميزانية:** $3/يوم
- **الجمهور:** عرب (25-45) مهمومين بـ القيادة/التطوير الذاتي/الصحة
- **الإبداع:** صورة `promo/health-without-limits.png` + Hook:
  > "طاقتك = عملتك. حمل كتاب 'صحة بلا حدود' مجانًا ←"
- **الرابط:** https://ansygroup.github.io/ebook-store/shop

### المستوى 2 — Lead Magnet (Landing → Free PDF)
- **الميزانية:** $2/يوم
- **الإبداع:** Carousel (3 كتب) + CTA: "احصل على كتاب مجاني"
- **الرابط:** https://ansygroup.github.io/ebook-store/downloads/health-without-limits.pdf
- **الهدف:** Email signup (عبر الـ newsletter على الصفحة الرئيسية)

### المستوى 3 — Retargeting (Cart/Viewers → Buy)
- **الميزانية:** $1/يوم
- **الجمهور:** زوار الموقع (Pixel) خلال 30 يوم
- **الإبداع:** عرض خصم `DAR20` (20% off) + countdown
- **الرابط:** https://ansygroup.github.io/ebook-store/shop

---

## 📌 إعداد Meta Pixel
1. أنشئ Pixel في Business Manager
2. أضف الكود في `index.html` قبل `</head>`:
```html
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window,document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```
3. أضف `fbq('track','Lead')` في `Newsletter.tsx` عند نجاح الاشتراك.

---

## 📊 Metrics مستهدفة
| المقياس | المستهدف |
|---|---|
| CPM | < $4 |
| CPC | < $0.30 |
| Lead cost | < $0.80 |
| Conv (lead→buy) | > 8% |
| ROAS | > 3x |

## 💡 ملاحظات
- ابدأ بـ $5/يوم → زد لـ $15 لو ROAS > 3x
- أوقف أي إبداع CTR < 1%
- A/B test 2 hooks أسبوعيًا
