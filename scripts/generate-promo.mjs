#!/usr/bin/env node
/**
 * generate-promo.mjs — يولّد 10 صور ترويجية للإنستغرام (1080x1080) لكل كتاب.
 * نمط موحّد: خلفية متدرجة + غلاف الكتاب + عنوان + سعر + CTA.
 * تُستخدم لاحقًا مع cron IG (f3d80ba9beeb) أو نشر يدوي.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const books = JSON.parse(readFileSync(resolve(root, 'src/data/books.json'), 'utf8'));
const outDir = resolve(root, 'public/promo');
mkdirSync(outDir, { recursive: true });

const palettes = {
  'القيادة': ['#6d5efc', '#a78bfa'],
  'الأعمال': ['#0ea5e9', '#38bdf8'],
  'الإنتاجية': ['#10b981', '#34d399'],
  'تطوير الذات': ['#f59e0b', '#fbbf24'],
  'التقنية': ['#3b82f6', '#60a5fa'],
  'الصحة': ['#ef4444', '#f87171'],
  'المفاوضات': ['#8b5cf6', '#a78bfa'],
  'الاستثمار': ['#059669', '#34d399'],
  'الكتابة': ['#ec4899', '#f472b6'],
  'اللغات': ['#0891b2', '#22d3ee'],
};

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

books.forEach((b) => {
  const [c1, c2] = palettes[b.categoryAr] || ['#6d5efc', '#a78bfa'];
  const title = escapeXml(b.title);
  const price = `$${b.price}`;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b0d17"/>
      <stop offset="100%" stop-color="#1a1f3a"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${c1}" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="${c1}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(#bg)"/>
  <rect width="1080" height="1080" fill="url(#glow)"/>

  <!-- book cover -->
  <image href="/covers/${b.cover}" x="390" y="120" width="300" height="450" preserveAspectRatio="xMidYMid slice"/>
  <rect x="390" y="120" width="300" height="450" fill="none" stroke="${c1}" stroke-width="3" rx="8"/>

  <!-- title -->
  <text x="540" y="660" font-family="Tahoma" font-size="56" fill="#ffffff" text-anchor="middle" font-weight="bold">${title}</text>

  <!-- author -->
  <text x="540" y="720" font-family="Tahoma" font-size="30" fill="#9aa0c7" text-anchor="middle">${escapeXml(b.author)}</text>

  <!-- price badge -->
  <rect x="440" y="770" width="200" height="64" rx="32" fill="${c2}" opacity="0.18"/>
  <text x="540" y="813" font-family="Tahoma" font-size="34" fill="${c2}" text-anchor="middle" font-weight="bold">${price} • PDF+EPUB</text>

  <!-- CTA -->
  <text x="540" y="930" font-family="Tahoma" font-size="28" fill="#c4c8e8" text-anchor="middle">📚 دار المعرفة — رابط في البايو</text>
  <text x="540" y="975" font-family="Tahoma" font-size="22" fill="#5b608f" text-anchor="middle">ebook-store.vercel.app</text>
</svg>`;

  const svgPath = `${outDir}/${b.slug}.tmp.svg`;
  writeFileSync(svgPath, svg);
  const pngPath = `${outDir}/${b.slug}.png`;
  try {
    execSync(`magick -density 150 -background none "${svgPath}" -resize 1080x1080 "${pngPath}"`);
    console.log(`✅ ${b.slug}.png`);
  } catch (e) {
    console.error(`❌ ${b.slug}:`, e.message);
  }
  try { execSync(`rm -f "${svgPath}"`); } catch {}
});

console.log(`\n📸 ${books.length} صور ترويجية جاهزة في public/promo/`);
