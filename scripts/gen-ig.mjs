#!/usr/bin/env node
/**
 * gen-ig.mjs — builds Instagram-ready content for the 10 books + 8 blog posts.
 *
 * Output (in ig-queue/):
 *   - <slug>.svg       1080x1080 card (upload to IG)
 *   - <slug>.txt       caption + hashtags (copy-paste)
 *
 * No secrets needed — runs fully offline. Publish manually from ig-queue/,
 * or wire to Meta Graph API / Composio IG later.
 *
 * Usage: node scripts/gen-ig.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const out = resolve(root, 'ig-queue');
mkdirSync(out, { recursive: true });

const books = JSON.parse(readFileSync(resolve(root, 'src/data/books.json'), 'utf8'));
const posts = JSON.parse(readFileSync(resolve(root, 'src/data/posts.json'), 'utf8'));

const SITE = 'https://ansygroup.github.io/ebook-store';

// Brand palette
const BRAND = { a: '#6d5efc', b: '#22d3ee', ink: '#0f1020', paper: '#ffffff' };

function card(title, subtitle, tag) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${BRAND.a}"/>
      <stop offset="1" stop-color="${BRAND.b}"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(#g)"/>
  <rect x="60" y="60" width="960" height="960" rx="48" fill="${BRAND.ink}" opacity="0.12"/>
  <text x="540" y="180" font-family="Arial, sans-serif" font-size="42" fill="${BRAND.paper}" opacity="0.75" text-anchor="middle" font-weight="700">DAR AL-MAARIFA</text>
  ${tag ? `<rect x="440" y="220" width="200" height="56" rx="28" fill="${BRAND.paper}" opacity="0.18"/><text x="540" y="258" font-family="Arial, sans-serif" font-size="30" fill="${BRAND.paper}" text-anchor="middle" font-weight="700">${tag}</text>` : ''}
  <text x="540" y="560" font-family="Arial, sans-serif" font-size="72" fill="${BRAND.paper}" text-anchor="middle" font-weight="800">${escapeXml(title)}</text>
  <text x="540" y="650" font-family="Arial, sans-serif" font-size="36" fill="${BRAND.paper}" opacity="0.85" text-anchor="middle">${escapeXml(subtitle)}</text>
  <text x="540" y="960" font-family="Arial, sans-serif" font-size="34" fill="${BRAND.paper}" opacity="0.7" text-anchor="middle">${SITE.replace('https://', '')} · Link in bio</text>
</svg>`;
}

function caption(titleEn, titleAr, url) {
  return `${titleEn}\n${titleAr}\n\n📚 Get the ebook: ${url}\n\n#ebooks #leadership #selfdevelopment #reading #productivity #investing #Arabentrepreneurs #books #kindle #learning`;
}

function escapeXml(s = '') {
  return s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
}

let n = 0;
for (const b of books) {
  const title = b.titleEn;
  const subtitle = `by ${b.authorEn} · $${b.price}`;
  writeFileSync(resolve(out, `${b.slug}.svg`), card(title, subtitle, b.categoryEn));
  writeFileSync(resolve(out, `${b.slug}.txt`), caption(title, b.titleAr, `${SITE}/book/${b.slug}`));
  n++;
}
for (const p of posts) {
  const title = p.titleEn;
  const subtitle = p.tags[0] || 'Blog';
  writeFileSync(resolve(out, `post-${p.slug}.svg`), card(title, subtitle, 'BLOG'));
  writeFileSync(resolve(out, `post-${p.slug}.txt`), caption(title, p.titleAr || '', `${SITE}/blog/${p.slug}`));
  n++;
}

console.log(`✅ Generated ${n} IG cards + captions in ig-queue/`);
