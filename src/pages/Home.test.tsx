import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { books, featuredBooks } from '../data/books';
import Home from '../pages/Home';

describe('Home page', () => {
  it('renders the hero headline and CTA', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', { level: 1, name: /مسار حياتك المهنية/ }),
    ).toBeInTheDocument();
    const ctas = screen.getAllByRole('link', { name: /تسوّق الآن/ });
    expect(ctas.length).toBeGreaterThan(0);
  });

  it('shows all featured books in the grid', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );
    for (const b of featuredBooks) {
      // titles appear both in the hero showcase and the featured grid
      expect(screen.getAllByText(b.title).length).toBeGreaterThan(0);
    }
  });

  it('shows pricing starting at $9.99 in the CTA band', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );
    expect(books.length).toBeGreaterThanOrEqual(6);
    expect(screen.getAllByText('$9.99').length).toBeGreaterThan(0);
  });
});
