import { describe, it, expect } from 'vitest';
import {
  books,
  categories,
  featuredBooks,
  formatPrice,
  getBookBySlug,
} from '../data/books';

describe('books data', () => {
  it('contains at least 6 books', () => {
    expect(books.length).toBeGreaterThanOrEqual(6);
  });

  it('every book has a positive price, valid slug and formats', () => {
    for (const b of books) {
      expect(b.price).toBeGreaterThan(0);
      expect(b.slug).toMatch(/^[a-z0-9-]+$/);
      expect(b.formats.length).toBeGreaterThan(0);
      expect(b.cover).toMatch(/\.svg$/);
    }
  });

  it('slugs are unique', () => {
    const slugs = books.map((b) => b.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('exposes distinct categories', () => {
    expect(categories.length).toBeGreaterThan(0);
    expect(categories.every((c) => typeof c === 'string')).toBe(true);
  });

  it('has featured books flagged', () => {
    expect(featuredBooks.length).toBeGreaterThan(0);
  });

  it('getBookBySlug resolves a known slug and undefined for unknown', () => {
    const first = books[0];
    expect(getBookBySlug(first.slug)?.id).toBe(first.id);
    expect(getBookBySlug('does-not-exist')).toBeUndefined();
  });

  it('formatPrice renders a USD currency string', () => {
    expect(formatPrice(19.99)).toMatch(/\$19\.99/);
  });
});
