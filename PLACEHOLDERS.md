# 📋 الـ Placeholders المطلوبة (إعبيها يدويًا)

كل هذي **مقصودة** — الموقع يشتغل بدونها (fallbacks) بس ما يبيع/ينشر فعليًا.

---

## 🔴 حرجة (تمنع البيع/التأكيد)
| الملف | الحقل | القيمة الحالية | البديل |
|---|---|---|---|
| `src/data/books.json` (×10) | `gumroadUrl` | `REPLACE_WITH_YOUR_LINK_XXX` | رابط Gumroad حقيقي |
| `src/data/books.json` (×10) | `downloadUrl` | `/downloads/<slug>.pdf` | ✅ صحيح (PDFs placeholder) |
| `public/downloads/*.pdf` | الملف نفسه | ~900B stub | PDF الكتاب الحقيقي |
| `index.html` | `YOUR_PIXEL_ID` | `YOUR_PIXEL_ID` | Meta Pixel ID |
| `scripts/apply-vercel-token.mjs` ← env | `VERCEL_TOKEN` | (مشوه) | token جديد من vercel.com |
| `~/.hermes/composio_key` | Composio API key | (مشوه) | key جديد |
| `~/.hermes/vercel_token` | Vercel token | (مشوه) | token جديد |

---

## 🟡 حسابات Composio (من الذاكرة — متغيرة)
| المعرّف | الحالة | الاستخدام |
|---|---|---|
| `ca_ru-ZbwXlFsGQ` | **Gumroad ACTIVE** | تأكيد الطلب/الإيميل |
| `ca_d461BvmxN65-` | **IG STALE** | النشر التلقائي (اربط IG جديد) |
| `ca_BmQnzbsU5u3T` | Gmail placeholder | fallback في `api/*.ts` — استبدله بـ `GMAIL_ACCOUNT` env |

---

## 🟢 جاهز (ما يحتاج تعديل)
- ✅ GitHub Pages منشور + كل الأصول حية
- ✅ Vercel API functions (محتاجة token صالح بس)
- ✅ SEO/AEO (llms.txt, sitemap, JSON-LD)
- ✅ 30 IG captions + 5-email + 10 Pinterest + Meta funnel
- ✅ Meta Pixel (يشتغل فورًا بـ ID حقيقي)
- ✅ cron IG يومي (`f3d80ba9beeb`)

---

## 🚀 الخطوات السريعة
```bash
# 1) Gumroad links
node scripts/gumroad_sync.mjs --links   # شوف وين الناقص
# عبّي gumroad-links.json ثم:
node scripts/fill-gumroad.mjs && git add -A && git commit -m "feat: real Gumroad" && git push

# 2) Vercel token (يفك الـ API)
VERCEL_TOKEN=XXX node scripts/apply-vercel-token.mjs

# 3) Pixel ID (في index.html سطر ~139)
# استبدل YOUR_PIXEL_ID

# 4) PDFs حقيقية → public/downloads/<slug>.pdf
```
