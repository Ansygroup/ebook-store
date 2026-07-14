import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Newsletter from './Newsletter';
import { LanguageProvider } from '../i18n/LanguageContext';

function renderNL() {
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <Newsletter />
      </LanguageProvider>
    </MemoryRouter>,
  );
}

// API down → shows graceful "unavailable" message (no crash)
describe('Newsletter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    (globalThis as any).fetch = vi.fn(() => Promise.reject(new Error('network')));
  });

  it('shows unavailable message when API fails and no fallback URL', async () => {
    renderNL();
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));
    await waitFor(() =>
      expect(screen.getByText(/temporarily unavailable/i)).toBeTruthy(),
    );
  });

  it('opens fallback URL when API fails and NEWSLETTER_URL set', async () => {
    vi.doMock('../data/books', () => ({
      ...vi.importActual('../data/books'),
      NEWSLETTER_URL: 'https://example.com/news',
    }));
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    const { unmount } = renderNL();
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));
    await waitFor(() => expect(open).toHaveBeenCalledWith('https://example.com/news', '_blank', 'noopener'));
    unmount();
  });
});
