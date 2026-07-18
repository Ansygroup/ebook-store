import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { books, featuredBooks } from '../data/books';
import Home from '../pages/Home';

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
}

describe('Home page', () => {
  it('renders the hero headline and CTA', () => {
    renderHome();
    expect(
      screen.getByRole('heading', { level: 1, name: /Books that change/i }),
    ).toBeInTheDocument();
    const ctas = screen.getAllByRole('link', { name: /Shop now/ });
    expect(ctas.length).toBeGreaterThan(0);
  });

  it('shows all featured books in the grid', () => {
    renderHome();
    for (const b of featuredBooks) {
      expect(screen.getAllByText(b.title).length).toBeGreaterThan(0);
    }
  });

  it('shows pricing starting at $9.99 in the CTA band', () => {
    renderHome();
    expect(books.length).toBeGreaterThanOrEqual(6);
    expect(screen.getAllByText('$9.99').length).toBeGreaterThan(0);
  });
});
