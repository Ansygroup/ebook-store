import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BookDetail from '../pages/BookDetail';
import { books } from '../data/books';

function renderDetail(slug: string) {
  return render(
    <MemoryRouter initialEntries={[`/book/${slug}`]}>
      <Routes>
        <Route path="/book/:slug" element={<BookDetail />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('BookDetail page', () => {
  it('renders full details for a known book', () => {
    const book = books[0];
    renderDetail(book.slug);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toBe(book.title);
    expect(screen.getByText(book.author)).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes(`${book.pages} صفحة`)),
    ).toBeInTheDocument();
  });

  it('shows the buy button with the correct Snipcart payload', () => {
    const book = books[1];
    const { container } = renderDetail(book.slug);
    const btn = container.querySelector('.snipcart-add-item') as HTMLElement;
    expect(btn.getAttribute('data-item-id')).toBe(book.id);
    expect(btn.getAttribute('data-item-price')).toBe(String(book.price));
    expect(btn.getAttribute('data-item-file-guid')).toBe(`${book.id}-download`);
  });

  it('handles an unknown slug with a not-found message', () => {
    renderDetail('nope');
    expect(screen.getByText('الكتاب غير موجود')).toBeInTheDocument();
  });
});
