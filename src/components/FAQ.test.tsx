import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import FAQ from '../components/FAQ';
import { LanguageProvider } from '../i18n/LanguageContext';

describe('FAQ accordion', () => {
  it('expands and collapses an answer on click', async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <MemoryRouter>
          <FAQ />
        </MemoryRouter>
      </LanguageProvider>,
    );

    const firstQuestion = screen.getByText('كيف أستلم الكتاب بعد الشراء؟');
    const button = firstQuestion.closest('button')!;
    expect(button).toHaveAttribute('aria-expanded', 'false');

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.getByText(/فور تأكيد الدفع، يظهر رابط التحميل/, { exact: false }),
    ).toBeInTheDocument();

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
