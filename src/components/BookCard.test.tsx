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
    expect(screen.getByText('The Influential Leader')).toBeInTheDocument();
    expect(screen.getByText('Dr. Khalid Al-Mansour')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
  });

  it('buy button links to Stripe checkout', () => {
    const { container } = renderCard('build-your-empire');
    const btn = container.querySelector('a.btn--primary') as HTMLElement;
    expect(btn).toBeTruthy();
    // stripeUrl is configured → links to Stripe Payment Link
    expect(btn.getAttribute('href')).toContain('buy.stripe.com');
    expect(btn.getAttribute('target')).toBe('_blank');
  });

  it('links to the book detail page', () => {
    renderCard('deep-productivity');
    const links = screen.getAllByRole('link', { name: /Deep Productivity/ });
    expect(links.length).toBeGreaterThan(0);
    expect(links[0].getAttribute('href')).toBe('/book/deep-productivity');
  });
});
