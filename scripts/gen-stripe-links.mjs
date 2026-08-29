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
const BOOKS = join(ROOT, 'public', 'books.json')

const key = process.env.STRIPE_SECRET_KEY
if (!key) {
  console.error('STRIPE_SECRET_KEY not set. Usage: STRIPE_SECRET_KEY=sk_... node scripts/gen-stripe-links.mjs')
  process.exit(1)
}

const books = JSON.parse(readFileSync(BOOKS, 'utf8'))

async function createPriceLink(book) {
  // 1. price (per-book, not shared)
  const priceRes = await fetch('https://api.stripe.com/v1/prices', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      currency: 'usd',
      unit_amount: String(Math.round(book.price * 100)),
      product_data_name: book.title,
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

let changed = 0
for (const book of books) {
  // Skip only if it already has a per-book Payment Link (starts with plink_).
  // A shared legacy link (buy.stripe.com/eVq...) must be replaced with a per-book one.
  if (book.stripeUrl && book.stripeUrl.includes('plink_')) {
    console.log(`skip ${book.slug} (has per-book link)`)
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
  console.log(`\nWrote ${changed} new link(s) to public/books.json`)
} else {
  console.log('\nAll books already have links.')
}
