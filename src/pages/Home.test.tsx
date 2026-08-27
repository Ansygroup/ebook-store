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

  it('shows the real book count (no hard-coded "10+")', () => {
    renderHome();
    // The hero badge must reflect the actual catalog size, not a frozen "10+"
    expect(screen.queryByText(/10\+\s*ebooks/i)).not.toBeInTheDocument();
    // The trust strip must show the real total
    const totalText = String(books.length);
    expect(screen.getAllByText(totalText).length).toBeGreaterThan(0);
  });

  it('does not render invented social proof (fake readers, fake rating)', () => {
    renderHome();
    // Numbers that were invented before the audit must not appear anywhere
    expect(screen.queryByText(/happy readers/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/2000\+/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/avg\. rating/i)).not.toBeInTheDocument();
  });

  it('does not render invented testimonials', () => {
    renderHome();
    expect(screen.queryByText(/Sara Al-Mutairi/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Khalid Al-Otaibi/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Mona Al-Ahmed/i)).not.toBeInTheDocument();
  });
});
