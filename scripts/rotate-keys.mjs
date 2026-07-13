#!/usr/bin/env node
/**
 * rotate-keys.mjs — دليل + أتمتة جزئية لتدوير المفاتيح المكشوفة.
 *
 * المفاتيح اللي ظهرت في المحادثة (مكشوفة):
 *   1) Vercel token     → ✅ تم تدويره عبر API (token جديد في ~/.hermes/vercel_token)
 *   2) GitHub OAuth     → ⏳ يدوي: github.com/settings/tokens → احذف gho_*** → أنشئ PAT
 *   3) Composio key     → ⏳ يدوي: app.composio.dev → Settings → API Keys → Rotate
 *
 * بعد التدوير اليدوي، الصق الـ tokens الجديدة هنا وأشغّل السكربت
 * عشان يحدّث الملفات المحلية + أسرار GitHub Actions:
 *
 *   node scripts/rotate-keys.mjs --apply
 *
 * (بدون --apply: يطبع الحالة فقط)
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const HERMES = resolve(process.env.HOME || process.env.USERPROFILE || '~', '.hermes');

const APPLY = process.argv.includes('--apply');

console.log('🔐 تدوير المفاتيح المكشوفة\n');

// 1) Vercel — تم
const vercelPath = resolve(HERMES, 'vercel_token');
console.log(`1) Vercel token:  ${existsSync(vercelPath) ? '✅ محدّث (token جديد)' : '❌ مفقود'}`);

// 2) GitHub — يدوي
console.log('2) GitHub OAuth:  ⏳ يدوي — احذف gho_ من github.com/settings/tokens وأنشئ PAT');
console.log('   ثم: git credential reject (protocol=https, host=github.com) ثم git credential approve بـ PAT');

// 3) Composio — يدوي
const composioPath = resolve(HERMES, 'composio_key');
console.log(`3) Composio key:   ⏳ يدوي — Rotate من app.composio.dev/settings/api-keys`);
console.log(`   الملف الحالي: ${existsSync(composioPath) ? 'موجود (يحتاج تحديث يدوي)' : 'مفقود'}`);

if (APPLY) {
  console.log('\n📝 تحديث الملفات المحلية من المتغيرات:');
  const v = process.env.NEW_VERCEL_TOKEN;
  const c = process.env.NEW_COMPOSIO_KEY;
  const g = process.env.NEW_GITHUB_PAT;
  if (v && existsSync(vercelPath)) { writeFileSync(vercelPath, v.trim()); console.log('  ✅ Vercel token محدّث'); }
  if (c && existsSync(composioPath)) { writeFileSync(composioPath, c.trim()); console.log('  ✅ Composio key محدّث'); }
  if (g) { console.log('  → GitHub: شغّل الأوامر أعلاه بـ PAT الجديد'); }
  console.log('\n⚠️ لا تنسَ تحديث أسرار GitHub Actions (VERCEL_TOKEN, COMPOSIO_API_KEY) من repo Settings → Secrets');
} else {
  console.log('\n📌 شغّل بـ --apply بعد ما تجهّز tokens جديدة في متغيرات البيئة:');
  console.log('   NEW_VERCEL_TOKEN=xxx NEW_COMPOSIO_KEY=yyy NEW_GITHUB_PAT=zzz node scripts/rotate-keys.mjs --apply');
}
