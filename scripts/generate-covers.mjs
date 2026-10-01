#!/usr/bin/env node
/**
 * generate-covers.mjs — يولّد 10 غلاف احترافية (1200x1800) من SVG → PNG عبر ImageMagick.
 * نمط موحّد: خلفية متدرجة داكنة + شعاع لوني + العنوان (عربي) + المؤلف + شارة البرند.
 */
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';

const books = JSON.parse(readFileSync('src/data/books.json', 'utf8'));
mkdirSync('public/covers', { recursive: true });

// لوحة ألوان لكل تصنيف
const palette = {
  'القيادة': ['#6d5efc', '#a78bfa'],
  'Leadership': ['#6d5efc', '#a78bfa'],
  'الأعمال': ['#f59e0b', '#fb923c'],
  'Business': ['#f59e0b', '#fb923c'],
  'الإنتاجية': ['#10b981', '#34d399'],
  'Productivity': ['#10b981', '#34d399'],
  'التطوير الذاتي': ['#ec4899', '#f472b6'],
  'Self-Development': ['#ec4899', '#f472b6'],
  'التقنية': ['#06b6d4', '#22d3ee'],
  'Technology': ['#06b6d4', '#22d3ee'],
  'الصحة': ['#14b8a6', '#2dd4bf'],
  'Health': ['#14b8a6', '#2dd4bf'],
  'المهارات': ['#8b5cf6', '#c084fc'],
  'Skills': ['#8b5cf6', '#c084fc'],
  'المال': ['#eab308', '#facc15'],
  'Money': ['#eab308', '#facc15'],
  'التسويق': ['#f43f5e', '#fb7185'],
  'Marketing': ['#f43f5e', '#fb7185'],
  'التعليم': ['#3b82f6', '#60a5fa'],
  'Education': ['#3b82f6', '#60a5fa'],
};
const fallback = ['#6d5efc', '#a78bfa'];

const pick = (b, arKey, enKey) => b[arKey] || b[enKey];

for (const b of books) {
  // books.json is English-only since 3e813b5 (i18n removal). The palette was
  // keyed ONLY by Arabic category, so all 15 books silently hit `fallback`:
  // identical text + identical colour => 15 byte-identical covers.
  const [c1, c2] = palette[b.categoryAr] || palette[b.category] || fallback;
  const title = pick(b, 'titleAr', 'title');
  const author = pick(b, 'authorAr', 'author');
  const category = pick(b, 'categoryAr', 'category');
  for (const [k, v] of [['title', title], ['author', author], ['category', category]]) {
    if (typeof v !== 'string' || !v.trim() || v === 'undefined') {
      throw new Error(
        `generate-covers: book "${b.slug || b.cover}" has no usable "${k}" (got ${JSON.stringify(v)}). ` +
        `Refusing to render a cover with "undefined" baked in.`
      );
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1800" viewBox="0 0 1200 1800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b0d17"/>
      <stop offset="1" stop-color="#13152b"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="1800" fill="url(#bg)"/>
  <circle cx="980" cy="240" r="520" fill="url(#accent)" opacity="0.16"/>
  <circle cx="180" cy="1560" r="400" fill="url(#accent)" opacity="0.12"/>
  <rect x="90" y="90" width="1020" height="1620" rx="36" fill="none" stroke="url(#accent)" stroke-width="4" opacity="0.5"/>
  <text x="600" y="250" font-family="Tahoma" font-size="120" fill="url(#accent)" text-anchor="middle" font-weight="700">د</text>
  <text x="600" y="730" font-family="Tahoma" font-size="78" fill="#f4f5ff" text-anchor="middle" font-weight="700">${title}</text>
  <line x1="360" y1="800" x2="840" y2="800" stroke="url(#accent)" stroke-width="3"/>
  <text x="600" y="880" font-family="Tahoma" font-size="44" fill="#a9addc" text-anchor="middle">${author}</text>
  <text x="600" y="980" font-family="Tahoma" font-size="34" fill="#7b80b0" text-anchor="middle">${category}</text>
  <text x="600" y="1560" font-family="Tahoma" font-size="36" fill="#6d5efc" text-anchor="middle" font-weight="700" letter-spacing="2">دار المعرفة</text>
  <text x="600" y="1620" font-family="Tahoma" font-size="26" fill="#5b608f" text-anchor="middle">Dar Al-Maarifa</text>
</svg>`;

  const outName = b.cover.replace(/\.svg$/, '.png'); // e.g. leadership.png
  const svgPath = `public/covers/${outName}.tmp.svg`;
  writeFileSync(svgPath, svg);
  const pngPath = `public/covers/${outName}`;
  try {
    // -strip is REQUIRED: without it ImageMagick embeds a date:create/date:modify
    // chunk, so every `npm run build` rewrites all 15 cover PNGs (598 KB each)
    // -> ~9 MB of pure noise per build -> self-evolve/auto-complete committed
    // 4 identical-looking "chore: auto-complete pending work" commits on 2026-10-01.
    // Verified locally: identical PNG bytes with -strip, different bytes without.
    execSync(`magick -density 150 -background none "${svgPath}" -resize 1200x1800 -strip "${pngPath}"`);
    execSync(`rm -f "${svgPath}"`);
    console.log(`✅ ${outName}`);
  } catch (e) {
    console.error(`❌ ${b.slug}:`, e.message);
  }
}
console.log('✅ covers generated');
