#!/usr/bin/env node
/**
 * gen-stripe-links.mjs — create a per-book Stripe Payment Link for the
 * ANSY ebook store and write it back into public/books.json (stripeUrl field).
 *
 * Prereqs:
 *   - STRIPE_SECRET_KEY in env (live or test)
 *   - public/books.json present (array of book objects with `price`, `title`, `slug`)
 *
 * Idempotent: re-running reuses existing links (Stripe Payment Links are
 * stable), so it is safe to run on every deploy.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_live_xxx node scripts/gen-stripe-links.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
// src/data/books.json is the SOURCE OF TRUTH (src/data/books.ts imports it, and
// `npm run build` runs sync-books.mjs which copies src -> public). Writing links
// only to public/ meant the next build silently wiped every generated link.
// Write to src/, then sync public/ - same order as fill-gumroad.mjs.
const BOOKS = join(ROOT, 'src', 'data', 'books.json')
const PUBLIC_BOOKS = join(ROOT, 'public', 'books.json')

const key = process.env.STRIPE_SECRET_KEY
if (!key) {
  console.error('STRIPE_SECRET_KEY not set. Usage: STRIPE_SECRET_KEY=sk_... node scripts/gen-stripe-links.mjs')
  process.exit(1)
}

// SAFETY GATE: src/data/books.json + public/books.json are the LIVE store
// catalog. Test-mode keys produce links that reject real cards, so writing them
// here would silently break checkout in production. Refuse unless explicitly opted in.
const isTest = key.startsWith('sk_test_')
if (isTest && process.env.ALLOW_TEST_LINKS !== '1') {
  console.error(
    'REFUSED: STRIPE_SECRET_KEY is a TEST key (sk_test_...).\n' +
    'the books catalog is live - test payment links would break\n' +
    'real checkout. Re-run with a live sk_live_... key, or set\n' +
    'ALLOW_TEST_LINKS=1 if you really want test links in books.json.'
  )
  process.exit(2)
}
if (isTest) console.warn('! ALLOW_TEST_LINKS=1 — writing TEST links into the live catalog')

const books = JSON.parse(readFileSync(BOOKS, 'utf8'))

async function createPriceLink(book) {
  // 1. price (per-book, not shared)
  const priceRes = await fetch('https://api.stripe.com/v1/prices', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      currency: 'usd',
      unit_amount: String(Math.round(book.price * 100)),
      'product_data[name]': book.title,
    }),
  })
  const price = await priceRes.json()
  if (price.error) throw new Error(`price: ${price.error.message}`)

  // 2. payment link
  const linkRes = await fetch('https://api.stripe.com/v1/payment_links', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ line_items: JSON.stringify([{ price: price.id, quantity: 1 }]) }),
  })
  const link = await linkRes.json()
  if (link.error) throw new Error(`link: ${link.error.message}`)
  return link.url
}

// How many books currently point at each link. A link shared by >1 book is a
// legacy catch-all link, not a per-book link, so it must be regenerated.
const owners = new Map()
for (const book of books) {
  if (book.stripeUrl) owners.set(book.stripeUrl, (owners.get(book.stripeUrl) ?? 0) + 1)
}

let changed = 0
for (const book of books) {
  // Skip only if it already has a per-book Payment Link.
  //
  // NOTE: this used to test `stripeUrl.includes('plink_')`, but real Stripe
  // Payment Link URLs are `https://buy.stripe.com/<token>` and the token never
  // contains 'plink_' - that string only shows up as an API *object id*. Against
  // real data the guard never fired, so every run recreated all 15 links.
  //
  // 'Per-book' therefore means "a buy.stripe.com link unique to this book".
  // Books still sharing one legacy link (all 15 do today) must be replaced,
  // so a link is only skippable when it appears exactly once in the catalog.
  if (book.stripeUrl && /^https:\/\/buy\.stripe\.com\/[A-Za-z0-9]+$/.test(book.stripeUrl) && owners.get(book.stripeUrl) === 1) {
    console.log(`skip ${book.slug} (has its own per-book link)`)
    continue
  }
  try {
    book.stripeUrl = await createPriceLink(book)
    changed++
    console.log(`created ${book.slug} -> ${book.stripeUrl}`)
  } catch (e) {
    console.error(`FAILED ${book.slug}: ${e.message}`)
  }
}

if (changed) {
  writeFileSync(BOOKS, JSON.stringify(books, null, 2) + '\n')
  // keep public/ in sync so the API functions (api/confirm-order.ts reads
  // public/books.json) see the new links before the next build runs.
  writeFileSync(PUBLIC_BOOKS, JSON.stringify(books, null, 2) + '\n')
  console.log(`\nWrote ${changed} new link(s) to src/data/books.json + public/books.json`)
} else {
  console.log('\nAll books already have links.')
}
