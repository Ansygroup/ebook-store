import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BookDetail from '../pages/BookDetail';
import { books } from '../data/books';
import { LanguageProvider } from '../i18n/LanguageContext';

function renderDetail(slug: string) {
  return render(
    <LanguageProvider>
      <MemoryRouter initialEntries={[`/book/${slug}`]}>
        <Routes>
          <Route path="/book/:slug" element={<BookDetail />} />
        </Routes>
      </MemoryRouter>
    </LanguageProvider>,
  );
}

describe('BookDetail page', () => {
  it('renders full details for a known book', () => {
    const book = books[0];
    renderDetail(book.slug);
    const h1 = screen.getByRole('heading', { level: 1 });
    // Displayed title is English (default)
    expect(h1.textContent).toBe(book.titleEn);
    expect(screen.getByText(book.authorEn)).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes(`${book.pages}`)),
    ).toBeInTheDocument();
  });

  it('shows the buy button linking to Stripe checkout', () => {
    const book = books[1];
    const { container } = renderDetail(book.slug);
    const btn = container.querySelector('a.btn--primary') as HTMLElement;
    expect(btn).toBeTruthy();
    // stripeUrl is configured → links to Stripe Payment Link
    expect(btn.getAttribute('href')).toContain('buy.stripe.com');
    expect(btn.getAttribute('target')).toBe('_blank');
  });

  it('handles an unknown slug with a not-found message', () => {
    renderDetail('nope');
    expect(screen.getByText('Book not found')).toBeInTheDocument();
  });
});
