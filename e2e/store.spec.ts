import { test, expect } from '@playwright/test';

const CATS = [
  'القيادة',
  'الأعمال',
  'الإنتاجية',
  'التطوير الذاتي',
  'التقنية',
  'الصحة',
  'المهارات',
  'المال',
  'التسويق',
  'التعليم',
];

test('store loads, shows hero and navigable shop with 10 books', async ({
  page,
}) => {
  await page.goto('/');

  // Hero headline visible
  await expect(
    page.getByRole('heading', { name: /مسار حياتك المهنية/ }),
  ).toBeVisible();

  // Featured books rendered on home
  await expect(page.locator('.book-card').first()).toBeVisible();

  // Navigate to shop
  await page.getByRole('link', { name: 'المتجر' }).first().click();
  await expect(page).toHaveURL(/\/shop$/);

  // All 10 books present
  await expect(page.locator('.book-card')).toHaveCount(10);

  // Category filter reduces the grid but never empty
  for (const c of CATS) {
    await page.getByRole('tab', { name: c }).click();
    const n = await page.locator('.book-card').count();
    expect(n).toBeGreaterThanOrEqual(1);
    expect(n).toBeLessThanOrEqual(10);
  }
  await page.getByRole('tab', { name: 'الكل' }).click();

  // An add-to-cart button exists with Snipcart attributes
  const addBtn = page.locator('.snipcart-add-item').first();
  await expect(addBtn).toHaveAttribute('data-item-id');
  await expect(addBtn).toHaveAttribute('data-item-price');
});

test('book detail shows email-order form and PDF download', async ({ page }) => {
  await page.goto('/shop');
  await page.locator('.book-card__title a').first().click();
  await expect(page).toHaveURL(/\/book\//);

  // Title + price visible
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  await expect(page.getByText(/السعر/)).toBeVisible();

  // Email-order form present
  const emailInput = page.locator('input[type="email"]');
  await expect(emailInput).toBeVisible();
  const orderBtn = page.getByRole('button', { name: /أطلب عبر الإيميل/ });
  await expect(orderBtn).toBeVisible();
  // Disabled until a valid email is typed
  await expect(orderBtn).toBeDisabled();

  // PDF download button present
  await expect(page.getByRole('link', { name: /تحميل نموذج PDF/ })).toBeVisible();

  // Fill email → button enables
  await emailInput.fill('buyer@example.com');
  await expect(orderBtn).toBeEnabled();
});

test('home shows testimonials and newsletter subscribe form', async ({ page }) => {
  await page.goto('/');

  // Testimonials section present with 3 cards
  await expect(page.locator('.testimonial').first()).toBeVisible();
  await expect(page.locator('.testimonial')).toHaveCount(3);

  // Newsletter form
  const nlInput = page.locator('.newsletter__input');
  await expect(nlInput).toBeVisible();
  const nlBtn = page.getByRole('button', { name: /اشترك مجاناً/ });
  await expect(nlBtn).toBeVisible();
  await expect(nlBtn).toBeDisabled();

  await nlInput.fill('reader@example.com');
  await expect(nlBtn).toBeEnabled();
});

test('email-order form calls /api/confirm-order', async ({ page }) => {
  await page.goto('/book/the-influential-leader');
  const emailInput = page.locator('input[type="email"]');
  await emailInput.fill('buyer@example.com');
  // API route may be protected on preview; we only assert the request is made
  const reqPromise = page.waitForRequest(
    (r) => r.url().includes('/api/confirm-order') && r.method() === 'POST',
    { timeout: 5000 },
  ).catch(() => null);
  await page.getByRole('button', { name: /أطلب عبر الإيميل/ }).click();
  const req = await reqPromise;
  expect(req).not.toBeNull();
  if (req) {
    const body = req.postDataJSON();
    expect(body.email).toBe('buyer@example.com');
    expect(body.slug).toBe('the-influential-leader');
  }
});

test('404, privacy and terms pages render', async ({ page }) => {
  // 404 page renders (dev SPA returns 200, so assert content not status)
  await page.goto('/this-page-does-not-exist');
  await expect(page.getByText('404')).toBeVisible();

  // Privacy + Terms render
  await page.goto('/privacy');
  await expect(
    page.getByRole('heading', { name: /سياسة الخصوصية/ }),
  ).toBeVisible();
  await page.goto('/terms');
  await expect(
    page.getByRole('heading', { name: /الشروط والأحكام/ }),
  ).toBeVisible();
});
