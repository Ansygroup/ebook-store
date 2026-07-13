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

export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatPrice(price: number): string {
  return currencyFormatter.format(price);
}
