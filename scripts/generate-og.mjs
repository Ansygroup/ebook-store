#!/usr/bin/env node
/**
 * generate-og.mjs — generates Open Graph cover images (1200×630) in the store's
 * visual identity. One global cover (EN-first) + one per book (for rich shares).
 * SVG → PNG via sharp (if available) or leaves SVG as a fallback.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
mkdirSync(resolve(root, 'public'), { recursive: true });
mkdirSync(resolve(root, 'public/og'), { recursive: true });

const books = JSON.parse(readFileSync('src/data/books.json', 'utf8'));

function cover({ title, subtitle, badge, out }) {
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
  <g transform="translate(900 315)">
    <rect x="-70" y="-150" width="140" height="200" rx="10" fill="#1c1a30" stroke="url(#accent)" stroke-width="2" transform="rotate(-8)"/>
    <rect x="-55" y="-120" width="140" height="200" rx="10" fill="#232042" stroke="url(#accent)" stroke-width="2" transform="rotate(4)"/>
    <rect x="-40" y="-90" width="140" height="200" rx="10" fill="#2a2650" stroke="url(#accent)" stroke-width="2.5"/>
    <circle cx="30" cy="10" r="22" fill="url(#accent)" opacity="0.9"/>
  </g>
  <text x="90" y="200" font-family="Segoe UI, Tahoma, Arial, sans-serif" font-size="34" font-weight="700" fill="#00e0ff">${badge}</text>
  <text x="90" y="290" font-family="Segoe UI, Tahoma, Arial, sans-serif" font-size="68" font-weight="800" fill="#ffffff">${escapeXml(title)}</text>
  <text x="90" y="360" font-family="Segoe UI, Tahoma, Arial, sans-serif" font-size="30" fill="#9b98b8">${escapeXml(subtitle)}</text>
  <rect x="90" y="430" width="260" height="62" rx="31" fill="url(#accent)"/>
  <text x="220" y="470" font-family="Segoe UI, Tahoma, Arial, sans-serif" font-size="26" font-weight="700" fill="#0b0d17" text-anchor="middle">Dar Al-Maarifa</text>
</svg>`;
  writeFileSync(out + '.svg', svg);
  toPng(svg, out + '.png');
}

function escapeXml(s = '') {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// real import (ESM) — books already loaded at top
import { readFileSync } from 'node:fs';

async function toPng(svg, pngPath) {
  try {
    const sharp = (await import('sharp')).default;
    await sharp(Buffer.from(svg)).png().toFile(pngPath);
    console.log('✅ ' + pngPath.split('/').pop() + ' (sharp)');
  } catch {
    console.log('⚠️ no sharp — ' + pngPath.split('/').pop().replace('.png', '.svg') + ' kept as fallback');
  }
}

const allBooks = books;

// global cover (EN-first)
cover({
  title: 'Dar Al-Maarifa',
  subtitle: 'Global e-book store — leadership, business & self-growth',
  badge: 'E-BOOK STORE',
  out: resolve(root, 'public/og-cover'),
});

// per-book covers
for (const b of allBooks) {
  cover({
    title: b.titleEn || b.title,
    subtitle: `${b.authorEn || b.author} · $${b.price}`,
    badge: (b.categoryEn || b.category || 'BOOK').toUpperCase(),
    out: resolve(root, `public/og/${b.slug}`),
  });
}

console.log(`✅ generated ${allBooks.length + 1} OG covers`);
