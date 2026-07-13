#!/usr/bin/env node
/**
 * generate-promo.mjs — يولّد 10 صور ترويجية للإنستغرام (1080x1080) لكل كتاب.
 * يستخدم sharp (npm) — متوافق مع CI بدون تثبيت system.
 * النمط: خلفية متدرجة + غلاف الكتاب + عنوان + سعر + CTA.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

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

function svgFor(book, c1, c2) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  return Buffer.from(`<svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b0d17"/><stop offset="100%" stop-color="#1a1f3a"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${c1}" stop-opacity="0.45"/><stop offset="100%" stop-color="${c1}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(#bg)"/>
  <rect width="1080" height="1080" fill="url(#glow)"/>
  <image href="/covers/${book.cover}" x="390" y="120" width="300" height="450" preserveAspectRatio="xMidYMid slice"/>
  <rect x="390" y="120" width="300" height="450" fill="none" stroke="${c1}" stroke-width="3" rx="8"/>
  <text x="540" y="660" font-family="Tahoma" font-size="56" fill="#ffffff" text-anchor="middle" font-weight="bold">${esc(book.title)}</text>
  <text x="540" y="720" font-family="Tahoma" font-size="30" fill="#9aa0c7" text-anchor="middle">${esc(book.author)}</text>
  <rect x="440" y="770" width="200" height="64" rx="32" fill="${c2}" opacity="0.18"/>
  <text x="540" y="813" font-family="Tahoma" font-size="34" fill="${c2}" text-anchor="middle" font-weight="bold">$${book.price} • PDF+EPUB</text>
  <text x="540" y="930" font-family="Tahoma" font-size="28" fill="#c4c8e8" text-anchor="middle">📚 دار المعرفة — رابط في البايو</text>
  <text x="540" y="975" font-family="Tahoma" font-size="22" fill="#5b608f" text-anchor="middle">ansygroup.github.io/ebook-store</text>
</svg>`);
}

let ok = 0;
for (const b of books) {
  const [c1, c2] = palettes[b.categoryAr] || ['#6d5efc', '#a78bfa'];
  const svg = svgFor(b, c1, c2);
  const pngPath = resolve(outDir, `${b.slug}.png`);
  try {
    await sharp(svg, { density: 150 }).resize(1080, 1080).png().toFile(pngPath);
    ok++;
    console.log(`✅ ${b.slug}.png`);
  } catch (e) {
    console.error(`❌ ${b.slug}:`, e.message);
  }
}
console.log(`\n📸 ${ok}/${books.length} صور ترويجية جاهزة في public/promo/`);
