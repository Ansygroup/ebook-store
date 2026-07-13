#!/usr/bin/env node
/**
 * generate-og.mjs — يولّد og-cover.png (1200×630) بهوية المتجر البصرية.
 * SVG → PNG عبر sharp (لو متاح) أو يترك SVG كـ fallback.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
mkdirSync(resolve(root, 'public'), { recursive: true });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b0d17"/>
      <stop offset="1" stop-color="#141225"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.4" r="0.6">
      <stop offset="0" stop-color="#6d5efc" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#6d5efc" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#6d5efc"/>
      <stop offset="1" stop-color="#00e0ff"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <!-- book stack -->
  <g transform="translate(880 315)">
    <rect x="-70" y="-150" width="140" height="200" rx="10" fill="#1c1a30" stroke="url(#accent)" stroke-width="2" transform="rotate(-8)"/>
    <rect x="-55" y="-120" width="140" height="200" rx="10" fill="#232042" stroke="url(#accent)" stroke-width="2" transform="rotate(4)"/>
    <rect x="-40" y="-90" width="140" height="200" rx="10" fill="#2a2650" stroke="url(#accent)" stroke-width="2.5"/>
    <circle cx="30" cy="10" r="22" fill="url(#accent)" opacity="0.9"/>
  </g>
  <!-- text -->
  <text x="90" y="250" font-family="Segoe UI, Tahoma, Arial, sans-serif" font-size="72" font-weight="800" fill="#ffffff" direction="rtl">دار المعرفة</text>
  <text x="90" y="330" font-family="Segoe UI, Tahoma, Arial, sans-serif" font-size="38" font-weight="600" fill="#00e0ff" direction="rtl">متجر الكتب الإلكترونية</text>
  <text x="90" y="400" font-family="Segoe UI, Tahoma, Arial, sans-serif" font-size="28" fill="#9b98b8" direction="rtl">كتب القيادة والأعمال والتطوير الذاتي</text>
  <rect x="90" y="440" width="220" height="60" rx="30" fill="url(#accent)"/>
  <text x="200" y="479" font-family="Segoe UI, Tahoma, Arial, sans-serif" font-size="26" font-weight="700" fill="#0b0d17" text-anchor="middle" direction="rtl">تصفّح الآن</text>
</svg>`;

const svgPath = resolve(root, 'public/og-cover.svg');
writeFileSync(svgPath, svg);
console.log('✅ og-cover.svg');

// حاول تحويل PNG: sharp → ImageMagick → SVG fallback
const pngPath = resolve(root, 'public/og-cover.png');
try {
  const sharp = (await import('sharp')).default;
  await sharp(Buffer.from(svg)).png().toFile(pngPath);
  console.log('✅ og-cover.png (1200×630 via sharp)');
} catch {
  try {
    execSync(`magick -density 150 -background none "${svgPath}" -resize 1200x630 "${pngPath}"`, { stdio: 'ignore' });
    console.log('✅ og-cover.png (1200×630 via ImageMagick)');
  } catch {
    console.log('⚠️ لا sharp ولا ImageMagick — og-cover.svg جاهز (حوّله يدويًا لـ PNG)');
  }
}
