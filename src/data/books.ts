import type { Book, Lang } from '../types';
import booksData from './books.json';

export const books: Book[] = booksData as Book[];

export const categories: string[] = Array.from(
  new Set(books.map((b) => b.categoryAr)),
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

// اختيار الحقل المناسب حسب اللغة
export function pick<T = string>(book: Book, field: keyof Book, lang: Lang): T {
  if (lang === 'en') {
    const en = book[`${String(field)}En` as keyof Book];
    if (en) return en as T;
  }
  return book[`${String(field)}Ar` as keyof Book] as T;
}

// رابط Gumroad الحقيقي (بدون placeholders) — يفتح overlay مباشرة
export function gumroadHref(book: Book): string | undefined {
  const u = book.gumroadUrl;
  if (!u || u.includes('REPLACE_WITH_YOUR_LINK')) return undefined;
  // أضف ?wanted=true عشان يفتح overlay الشراء مباشرة
  return u.includes('?') ? `${u}&wanted=true` : `${u}?wanted=true`;
}
