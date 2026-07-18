import type { Book } from '../types';
import booksData from './books.json';

export const books: Book[] = booksData as Book[];

export const categories: string[] = Array.from(
  new Set(books.map((b) => b.category)),
);

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}

export const featuredBooks = books.filter((b) => b.featured);

// External newsletter signup (optional). Used as a fallback when the API backend
// is unavailable (e.g. before the Cloudflare Worker is deployed). Empty = API only.
// Set via VITE_NEWSLETTER_URL build secret; falls back to empty (API-only).
export const NEWSLETTER_URL: string =
  (import.meta.env.VITE_NEWSLETTER_URL as string | undefined) ?? '';

// Where newsletter signups + orders land via mailto: fallback (no backend needed).
// Set via VITE_SELLER_EMAIL build secret; falls back to a placeholder.
export const SELLER_EMAIL: string =
  (import.meta.env.VITE_SELLER_EMAIL as string | undefined) || 'sales@ebook-store.dev';

export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatPrice(price: number): string {
  return currencyFormatter.format(price);
}

export function buyHref(book: Book): string {
  // Stripe Payment Link preferred, else book page (fallback)
  const stripe = book.stripeUrl;
  if (stripe && !stripe.includes('REPLACE_WITH_YOUR_LINK')) {
    return stripe;
  }
  // no checkout link configured — open the book page (free PDF + order form there)
  return `/book/${book.slug}`;
}
