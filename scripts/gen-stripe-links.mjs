#!/usr/bin/env node
/**
 * gen-stripe-links.mjs — creates a Stripe Payment Link per book (with metadata.slug)
 * and writes the URL back into src/data/books.json (stripeUrl field).
 *
 * Prereqs:
 *   - STRIPE_SECRET_KEY in env (sk_live_... or sk_test_...)
 *   - Each book needs a Price. We create a one-time Price per book from book.price (USD).
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_live_xxx node scripts/gen-stripe-links.mjs
 *
 * Idempotent: if a book already has a stripeUrl that isn't a placeholder, it's skipped
 * (delete the stripeUrl field to regenerate).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const booksPath = resolve(root, 'src/data/books.json');
const key = process.env.STRIPE_SECRET_KEY;

if (!key) {
  console.error('❌ STRIPE_SECRET_KEY not set. Usage: STRIPE_SECRET_KEY=sk_... node scripts/gen-stripe-links.mjs');
  process.exit(1);
}

const books = JSON.parse(readFileSync(booksPath, 'utf8'));
const api = 'https://api.stripe.com/v1';
const auth = 'Basic ' + Buffer.from(key + ':').toString('base64');

async function post(path, body) {
  const r = await fetch(api + path, {
    method: 'POST',
    headers: { Authorization: auth, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body).toString(),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error.message);
  return j;
}

let updated = 0;
for (const b of books) {
  if (b.stripeUrl && !b.stripeUrl.includes('REPLACE')) {
    console.log(`⏭  ${b.slug}: already has ${b.stripeUrl} — skip`);
    continue;
  }
  // 1) create a Price for this book
  const price = await post('/prices', {
    currency: 'usd',
    unit_amount: Math.round(b.price * 100),
    product_data: JSON.stringify({ name: b.titleEn, metadata: { slug: b.slug } }),
  });
  // 2) create a Payment Link with metadata.slug (read by the webhook)
  const link = await post('/payment_links', {
    line_items: JSON.stringify([{ price: price.id, quantity: 1 }]),
    metadata: JSON.stringify({ slug: b.slug }),
    after_completion: JSON.stringify({ type: 'redirect', redirect: { url: `https://ansygroup.github.io/ebook-store/verify?paid=1&coupon=${b.slug}` } }),
  });
  b.stripeUrl = link.url;
  console.log(`✅ ${b.slug}: ${link.url}`);
  updated++;
}

writeFileSync(booksPath, JSON.stringify(books, null, 2) + '\n');
console.log(`\n✅ Updated ${updated} books with Stripe Payment Links in src/data/books.json`);
console.log('Next: set STRIPE_WEBHOOK_SECRET + deploy worker, then `npm run build && npm run deploy`');
