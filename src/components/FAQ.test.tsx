import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import FAQ from '../components/FAQ';

describe('FAQ accordion', () => {
  it('expands and collapses an answer on click', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <FAQ />
      </MemoryRouter>,
    );

    const firstQuestion = screen.getByText('How do I receive the book after purchase?');
    const button = firstQuestion.closest('button')!;
    expect(button).toHaveAttribute('aria-expanded', 'false');

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.getByText(/Once payment is confirmed, the download link appears/, { exact: false }),
    ).toBeInTheDocument();

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
