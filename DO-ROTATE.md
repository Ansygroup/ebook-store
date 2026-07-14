# 🔐 خطوات التدوير (سويها بنفسك — الأتمتة ما تقدر)

كل التدوير يتطلب لوحات خارجية (ما يمر عبر API). هذا الدليل بصيغة **أوامر جاهزة** — لصق بعد كل خطوة.

---

## 1️⃣ Vercel token (يفك تجميد الموقع الأصلي + الـ API functions)
1. ادخل https://vercel.com/account/tokens
2. احذف **كل** الـ tokens
3. أنشئ **token جديد** (تأكد إنه من فريق `ansygroups-projects` — مو personal)
4. الصق هذا الأمر (استبدل `XXXX` بالـ token):
```bash
cd /d/ebook-store && VERCEL_TOKEN=XXXX node scripts/apply-vercel-token.mjs
```
هذا يحدّث الملف + سر GitHub + يشغّل deploy تجريبي. الموقع يرجع يتحدّث على:
`https://ebook-store-ansygroups-projects.vercel.app`

⚠️ **مهم**: بعد تدوير التوكن، لازم تعيد deploy عشان الـ API functions (confirm-order/subscribe)
تنتشر — الكود الحالي فيه إصلاحات الـ referer guard. بدون redeploy، الـ API يرفض الطلبات
الصحيحة (`Forbidden`) لأن الـ function مجمّد على نسخة قديمة.

---

## 2️⃣ GitHub OAuth token (`gho_`)
1. ادخل https://github.com/settings/tokens
2. احذف الـ token المكشوف
3. أنشئ **PAT جديد** (scope: `repo`, `workflow`)
4. حدّث git credential:
```bash
printf "protocol=https\nhost=github.com\nusername=Ansygroup\npassword=XXXX\n" | git credential approve
```

---

## 3️⃣ Composio API key
1. ادخل https://app.composio.dev → Settings → API Keys
2. احذف الـ key المكشوف
3. أنشئ **key جديد**
4. حدّث الملف:
```bash
echo "XXXX" > ~/.hermes/composio_key
```
5. حدّث سر GitHub (عبر السكربت بعد تحديث الملف):
```bash
cd /d/ebook-store && python scripts/set-gh-secrets.py
```

---

## 4️⃣ Gumroad روابط المنتجات
1. ادخل https://app.gumroad.com/products → New product لكل كتاب
2. انسخ رابط كل منتج (مثل `https://gutwroad.com/l/abc123`)
3. أنشئ `gumroad-links.json`:
```json
{
  "the-influential-leader": "https://gumroad.com/l/XXX",
  "build-your-empire": "https://gumroad.com/l/XXX"
}
```
4. شغّل:
```bash
cd /d/ebook-store && node scripts/fill-gumroad.mjs && git add -A && git commit -m "feat: real Gumroad links" && git push
```

---

## 5️⃣ ربط Instagram (يفعّل النشر التلقائي)
1. ادخل https://app.composio.dev → Connected Accounts → Add → Instagram
2. اربط حساب @dar_alma3rifa
3. جرّب النشر:
```bash
cd /d/ebook-store && node scripts/ig-prepare.mjs
```
المنشور جاهز في `ig-queue/` — أو أضف خطوة نشر Composio للـ cron `f3d80ba9beeb`.

---

## ✅ بعد التدوير
- الموقع الأصلي (Vercel) يرجع يتحدّث
- كل المفاتيح المكشوفة تتبدّل
- Gumroad يبيع فعليًا
- IG ينشر تلقائيًا
