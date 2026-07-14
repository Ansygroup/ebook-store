#!/usr/bin/env node
/**
 * launch.mjs — one-command store launch.
 *
 * What it does (all automatable, no secrets needed):
 *   1) fills real Gumroad links (if gumroad-links.json exists)
 *   2) regenerates PDFs / covers / promo / SEO
 *   3) builds
 *   4) commits + pushes
 *
 * What it CANNOT do (needs your accounts — manual):
 *   - actually sell (needs Gumroad links in gumroad-links.json)
 *   - post to IG (needs IG linked on Composio)
 *   - send emails (needs SEND=1 + Gmail account)
 *   - Meta Pixel (needs YOUR_PIXEL_ID in index.html)
 *
 * Usage: node scripts/launch.mjs
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const run = (cmd) => { console.log(`▶ ${cmd}`); execSync(cmd, { stdio: 'inherit', cwd: root }); };

console.log('🚀 launch.mjs — automated store build & deploy\n');

// 1) Gumroad links (optional)
if (existsSync(resolve(root, 'gumroad-links.json'))) {
  run('node scripts/fill-gumroad.mjs');
} else {
  console.log('⚠️  gumroad-links.json missing — buy buttons stay as book-page fallback');
}

// 2) assets + seo
run('node scripts/generate-pdfs.mjs');
run('node scripts/generate-covers.mjs');
run('node scripts/generate-promo.mjs');
run('node scripts/generate-seo.mjs');

// 3) build
run('npm run build');

// 4) commit + push
run('git add -A');
run('git commit -q -m "chore: automated launch build" || echo "(nothing to commit)"');
run('git push origin master');

console.log('\n✅ Done. Store deployed to https://ansygroup.github.io/ebook-store');
console.log('   Next manual steps in marketing/LAUNCH.md');
