import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Shop from '../pages/Shop';
import { books, categories } from '../data/books';
import { LanguageProvider } from '../i18n/LanguageContext';

function renderShop() {
  return render(
    <LanguageProvider>
      <MemoryRouter>
        <Shop />
      </MemoryRouter>
    </LanguageProvider>,
  );
}

describe('Shop page', () => {
  it('renders every book in the catalogue', () => {
    renderShop();
    expect(screen.getByTestId('book-grid').querySelectorAll('.book-card').length).toBe(
      books.length,
    );
  });

  it('filters books by category', async () => {
    const user = userEvent.setup();
    renderShop();
    const target = categories[0];
    const expectedCount = books.filter((b) => b.categoryEn === target).length;

    await user.click(screen.getByRole('tab', { name: target }));

    const grid = screen.getByTestId('book-grid');
    expect(grid.querySelectorAll('.book-card').length).toBe(expectedCount);
  });

  it('sorts by ascending price', async () => {
    const user = userEvent.setup();
    renderShop();
    await user.selectOptions(screen.getByRole('combobox'), 'price-asc');

    const prices = Array.from(
      screen.getByTestId('book-grid').querySelectorAll('.book-card__price'),
    ).map((el) => parseFloat(el.textContent!.replace('$', '')));
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  it('marks the active category chip', async () => {
    const user = userEvent.setup();
    renderShop();
    const chip = screen.getByRole('tab', { name: 'All' });
    expect(chip.className).toContain('is-active');

    await user.click(screen.getByRole('tab', { name: categories[0] }));
    expect(screen.getByRole('tab', { name: categories[0] })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
