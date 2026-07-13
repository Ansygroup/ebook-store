# 🔐 تدوير المفاتيح المكشوفة — الحالة والتالي

## المكشوف في المحادثة
خلال بناء المشروع، ظهرت هذه المفاتيح في نص المحادثة (مكشوفة لنموذج LLM):
- Vercel token (قديم)
- Composio API key
- GitHub OAuth token (`gho_...`)

## ما اننجز
| المفتاح | الحالة | الإجراء المطلوب |
|---|---|---|
| **Vercel token** | ❌ محطوم حاليًا | **يدوي**: ادخل https://vercel.com/account/tokens → احذف الكل → أنشئ token جديد بصلاحيات الفريق `team_jsDd0T7iHZ26E6GhomgOxE4T` → الصقه في `~/.hermes/vercel_token` + حدّث سر `VERCEL_TOKEN` في repo secrets |
| **GitHub OAuth** | ⏳ يدوي | ادخل https://github.com/settings/tokens → احذف `gho_...` → أنشئ PAT بصلاحيات `repo, workflow` → طبّق عبر `git credential` |
| **Composio key** | ⏳ يدوي | ادخل https://app.composio.dev/settings/api-keys → Rotate → حدّث `~/.hermes/composio_key` |

## خطوات ما بعد التدوير
1. شغّل: `node scripts/rotate-keys.mjs` (يوثّق الحالة)
2. حدّث أسرار GitHub Actions: `python scripts/set-gh-secrets.py`
3. ادفع: `git push origin master` (الـ CI سيتحقق من النشر)

## ⚠️ ملاحظة
الموقع الحي **يعمل حاليًا** (آخر deploy ناجح: `4e1779f`) لكن **لن يُحدّث** حتى يتم تدوير Vercel token يدويًا.
