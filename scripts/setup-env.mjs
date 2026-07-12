#!/usr/bin/env node
// يتحقق من جاهزية الإعداد قبل النشر: .env + ملفات الكتب + Snipcart.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

let ok = true;
const fail = (m) => { console.log('  ❌ ' + m); ok = false; };
const good = (m) => console.log('  ✅ ' + m);

console.log('\n🔍 فحص جاهزية المتجر للنشر\n');

// 1. .env
const envPath = resolve(root, '.env');
if (!existsSync(envPath)) {
  fail('.env غير موجود — انسخ .env.example إلى .env');
} else {
  const env = readFileSync(envPath, 'utf8');
  if (env.includes('YOUR_SNIPCART_PUBLIC_API_KEY')) {
    fail('VITE_SNIPCART_API_KEY لسه placeholder — بدّله بمفتاحك الحقيقي من snipcart.com');
  } else {
    good('VITE_SNIPCART_API_KEY معيّن');
  }
}

// 2. books data
const booksPath = resolve(root, 'src/data/books.ts');
if (existsSync(booksPath)) good('بيانات الكتب موجودة (src/data/books.ts)');
else fail('بيانات الكتب مفقودة');

// 3. download files
const dlDir = resolve(root, 'public/downloads');
if (existsSync(dlDir)) {
  const files = readdirSync(dlDir).filter((f) => !f.startsWith('.'));
  if (files.length === 0) {
    fail('public/downloads/ فاضي — ارفع ملفات PDF/EPUB واربطها بـ data-item-file-guid');
  } else {
    good(`public/downloads/ فيه ${files.length} ملف تحميل`);
  }
} else {
  fail('public/downloads/ غير موجود — أنشئه وارفع ملفات الكتب');
}

console.log('\n' + (ok
  ? '🎉 جاهز للنشر! شغّل: ./deploy.sh'
  : '⚠️  أكمل الخطوات الحمراء ثم أعد التشغيل.') + '\n');

process.exit(ok ? 0 : 1);
