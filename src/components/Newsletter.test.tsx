import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// hoisted mock: NEWSLETTER_URL controlled per-test via vi.mocked
vi.mock('../data/books', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../data/books')>();
  return { ...actual, NEWSLETTER_URL: '' as string, SELLER_EMAIL: 'sales@ebook-store.dev' };
});

import Newsletter from './Newsletter';
import * as booksMod from '../data/books';

function renderNL() {
  return render(
    <MemoryRouter>
      <Newsletter />
    </MemoryRouter>,
  );
}

describe('Newsletter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    (globalThis as any).fetch = vi.fn(() => Promise.reject(new Error('network')));
    vi.mocked(booksMod).NEWSLETTER_URL = '';
  });

  it('opens mailto: fallback when API fails and no NEWSLETTER_URL set', async () => {
    const loc = vi.spyOn(window, 'location', 'get').mockReturnValue({ href: '' } as any);
    renderNL();
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));
    await waitFor(() =>
      expect(loc.mock.results[0]?.value?.href || (window.location as any).href).toMatch(/^mailto:/),
    );
  });

  it('opens fallback URL when API fails and NEWSLETTER_URL set', async () => {
    vi.mocked(booksMod).NEWSLETTER_URL = 'https://example.com/news' as string;
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    renderNL();
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));
    await waitFor(() =>
      expect(open).toHaveBeenCalledWith('https://example.com/news', '_blank', 'noopener'),
    );
  });

  it('opens mailto: fallback when API fails and no NEWSLETTER_URL', async () => {
    const loc = vi.spyOn(window, 'location', 'get').mockReturnValue({ href: '' } as any);
    renderNL();
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));
    await waitFor(() =>
      expect(loc.mock.results[0]?.value?.href || (window.location as any).href).toMatch(/^mailto:/),
    );
  });
});
