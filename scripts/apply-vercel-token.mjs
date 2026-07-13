#!/usr/bin/env node
/**
 * apply-vercel-token.mjs — يطبّق Vercel token جديد (صالح) على كل المسارات.
 *
 * الخطوات من المستخدم:
 *   1) ادخل https://vercel.com/account/tokens
 *   2) احذف الـ tokens القديمة (الكل)
 *   3) أنشئ token جديد (تأكد إنه للفريق ansygroups-projects)
 *   4) الصق الـ token هنا:
 *        VERCEL_TOKEN=xxxxx node scripts/apply-vercel-token.mjs
 *
 * السكربت:
 *   - يحفظه في ~/.hermes/vercel_token
 *   - يحدّث سر VERCEL_TOKEN في GitHub Actions (عبر set-gh-secrets.py)
 *   - يتحقق من وصول المشروع
 *   - يشغّل deploy تجريبي (git push فارغ) لإثبات الـ CI
 */
import { writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const HERMES = resolve(process.env.HOME || process.env.USERPROFILE || '~', '.hermes');
const TOKEN = process.env.VERCEL_TOKEN;

if (!TOKEN || TOKEN.length < 20) {
  console.log('❌ مرّر الـ token: VERCEL_TOKEN=xxx node scripts/apply-vercel-token.mjs');
  process.exit(1);
}

// 1) اختبار الوصول للمشروع
console.log('🔍 اختبار وصول المشروع...');
const test = execSync(
  `curl -s "https://api.vercel.com/v9/projects/prj_5WkQL5myJXkFRIn41AbdXpvXM7bg?teamId=team_jsDd0T7iHZ26E6GhomgOxE4T" -H "Authorization: Bearer ${TOKEN}"`,
).toString();
const parsed = JSON.parse(test);
if (parsed.error || !parsed.name) {
  console.log('❌ الـ token ما عنده وصول للمشروع:', parsed.error?.message || 'unknown');
  console.log('   تأكد إنك أنشأت الـ token من فريق ansygroups-projects (مو personal).');
  process.exit(1);
}
console.log(`✅ وصول مؤكد للمشروع: ${parsed.name}`);

// 2) حفظ في الملف
const tokPath = resolve(HERMES, 'vercel_token');
writeFileSync(tokPath, TOKEN.trim());
console.log('✅ حُفظ في ~/.hermes/vercel_token');

// 3) تحديث سر GitHub Actions
console.log('🔄 تحديث سر VERCEL_TOKEN في GitHub Actions...');
try {
  execSync('python scripts/set-gh-secrets.py', { stdio: 'inherit', cwd: root });
} catch (e) {
  console.log('⚠️ فشل تحديث السر (تأكد من GitHub token في git credential)');
}

// 4) deploy تجريبي
console.log('🚀 تشغيل deploy تجريبي عبر CI...');
try {
  execSync('git commit --allow-empty -m "chore: verify rotated Vercel token" && git push origin master', { stdio: 'inherit', cwd: root });
  console.log('✅ تم الدفع — راقب الـ CI على GitHub Actions');
} catch (e) {
  console.log('⚠️ فشل الدفع (تأكد من GitHub token)');
}

console.log('\n🎉 اكتمل تدوير Vercel token!');
