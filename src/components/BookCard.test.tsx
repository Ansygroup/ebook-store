import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookCard from '../components/BookCard';
import { books } from '../data/books';
import { LanguageProvider } from '../i18n/LanguageContext';

function renderCard(slug: string) {
  const book = books.find((b) => b.slug === slug)!;
  return render(
    <LanguageProvider>
      <MemoryRouter>
        <BookCard book={book} />
      </MemoryRouter>
    </LanguageProvider>,
  );
}

describe('BookCard', () => {
  it('renders the book title, author and price', () => {
    renderCard('the-influential-leader');
    expect(screen.getByText('القائد المؤثر')).toBeInTheDocument();
    expect(screen.getByText('د. خالد المنصور')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
  });

  it('add-to-cart button carries correct Snipcart data attributes', () => {
    const { container } = renderCard('build-your-empire');
    const btn = container.querySelector('.snipcart-add-item') as HTMLElement;
    expect(btn).toBeTruthy();
    expect(btn.getAttribute('data-item-id')).toBe('build-empire');
    expect(btn.getAttribute('data-item-name')).toBe('بناء إمبراطورية');
    expect(btn.getAttribute('data-item-price')).toBe('24.99');
    expect(btn.getAttribute('data-item-file-guid')).toBe('build-empire-download');
  });

  it('links to the book detail page', () => {
    renderCard('deep-productivity');
    const links = screen.getAllByRole('link', { name: /الإنتاجية العميقة/ });
    expect(links.length).toBeGreaterThan(0);
    expect(links[0].getAttribute('href')).toBe('/book/deep-productivity');
  });
});
