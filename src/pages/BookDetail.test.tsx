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
    // العنوان المعروض هو العربي (الافتراضي)
    expect(h1.textContent).toBe(book.titleAr);
    expect(screen.getByText(book.authorAr)).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes(`${book.pages}`)),
    ).toBeInTheDocument();
  });

  it('shows the buy button linking to Gumroad (or book page fallback)', () => {
    const book = books[1];
    const { container } = renderDetail(book.slug);
    const btn = container.querySelector('a.btn--primary') as HTMLElement;
    expect(btn).toBeTruthy();
    // placeholder gumroadUrl → falls back to book page
    expect(btn.getAttribute('href')).toContain(`/book/${book.slug}`);
    expect(btn.getAttribute('target')).toBe('_blank');
  });

  it('handles an unknown slug with a not-found message', () => {
    renderDetail('nope');
    expect(screen.getByText('الكتاب غير موجود')).toBeInTheDocument();
  });
});
