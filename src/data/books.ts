import type { Book, Lang } from '../types';
import booksData from './books.json';

export const books: Book[] = booksData as Book[];

export const categories: string[] = Array.from(
  new Set(books.map((b) => b.categoryEn)),
);

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}

export const featuredBooks = books.filter((b) => b.featured);

export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatPrice(price: number): string {
  return currencyFormatter.format(price);
}

// pick the right field by language
export function pick<T = string>(book: Book, field: keyof Book, lang: Lang): T {
  if (lang === 'en') {
    const en = book[`${String(field)}En` as keyof Book];
    if (en) return en as T;
  }
  return book[`${String(field)}Ar` as keyof Book] as T;
}

// purchase link: Gumroad if present, else the book page (fallback)
export function gumroadHref(book: Book): string {
  const u = book.gumroadUrl;
  if (u && !u.includes('REPLACE_WITH_YOUR_LINK')) {
    // add ?wanted=true so the Gumroad buy overlay opens directly
    return u.includes('?') ? `${u}&wanted=true` : `${u}?wanted=true`;
  }
  // placeholder still present — open the book page (free PDF + order form there)
  return `/book/${book.slug}`;
}
