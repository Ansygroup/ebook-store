import { test, expect } from '@playwright/test';

const CATS = [
  'Leadership',
  'Business',
  'Productivity',
  'Self-Development',
  'Technology',
  'Health',
  'Skills',
  'Money',
  'Marketing',
  'Education',
];

test('store loads, shows hero and navigable shop with 10 books', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /career trajectory/ })).toBeVisible();
  await expect(page.locator('.book-card').first()).toBeVisible();
  await page.getByRole('link', { name: 'Shop' }).first().click();
  await expect(page).toHaveURL(/\/shop$/);
  await expect(page.locator('.book-card')).toHaveCount(10);
  for (const c of CATS) {
    await page.getByRole('tab', { name: c }).click();
    const n = await page.locator('.book-card').count();
    expect(n).toBeGreaterThanOrEqual(1);
    expect(n).toBeLessThanOrEqual(10);
  }
  await page.getByRole('tab', { name: 'All' }).click();
  const buyBtn = page.locator('.book-card a.btn--primary').first();
  await expect(buyBtn).toHaveAttribute('href');
  await expect(buyBtn).toHaveAttribute('target', '_blank');
});

test('book detail shows email-order form and PDF download', async ({ page }) => {
  await page.goto('/shop');
  await page.locator('.book-card__title a').first().click();
  await expect(page).toHaveURL(/\/book\//);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  await expect(page.getByText(/Price/)).toBeVisible();
  const emailInput = page.locator('input[type="email"]');
  await expect(emailInput).toBeVisible();
  const orderBtn = page.getByRole('button', { name: /Order by email/ });
  await expect(orderBtn).toBeVisible();
  await expect(orderBtn).toBeDisabled();
  await expect(page.getByRole('link', { name: /Download sample PDF/ })).toBeVisible();
  await emailInput.fill('buyer@example.com');
  await expect(orderBtn).toBeEnabled();
});

test('home shows testimonials and newsletter subscribe form', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.testimonial').first()).toBeVisible();
  await expect(page.locator('.testimonial')).toHaveCount(3);
  const nlInput = page.locator('.newsletter__input');
  await expect(nlInput).toBeVisible();
  const nlBtn = page.getByRole('button', { name: /Subscribe free/ });
  await expect(nlBtn).toBeVisible();
  await expect(nlBtn).toBeDisabled();
  await nlInput.fill('reader@example.com');
  await expect(nlBtn).toBeEnabled();
});

test('email-order form calls /api/confirm-order', async ({ page }) => {
  await page.goto('/book/the-influential-leader');
  const emailInput = page.locator('input[type="email"]');
  await emailInput.fill('buyer@example.com');
  const reqPromise = page.waitForRequest(
    (r) => r.url().includes('/api/confirm-order') && r.method() === 'POST',
    { timeout: 5000 },
  ).catch(() => null);
  await page.getByRole('button', { name: /Order by email/ }).click();
  const req = await reqPromise;
  expect(req).not.toBeNull();
  if (req) {
    const body = req.postDataJSON();
    expect(body.email).toBe('buyer@example.com');
    expect(body.slug).toBe('the-influential-leader');
  }
});

test('404, privacy and terms pages render', async ({ page }) => {
  await page.goto('/this-page-does-not-exist');
  await expect(page.getByText('404')).toBeVisible();
  await page.goto('/privacy');
  await expect(page.getByRole('heading', { name: /Privacy policy/ })).toBeVisible();
  await page.goto('/terms');
  await expect(page.getByRole('heading', { name: /Terms & conditions/ })).toBeVisible();
});
