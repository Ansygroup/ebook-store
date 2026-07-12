import { test, expect } from '@playwright/test';

test('store loads, shows hero and navigable shop with working cart buttons', async ({
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
  await expect(page.locator('.book-card').first()).toBeVisible();

  // Category filter reduces the grid
  const total = await page.locator('.book-card').count();
  const cats = ['القيادة', 'الأعمال', 'الإنتاجية', 'التطوير الذاتي', 'التقنية', 'الصحة', 'المهارات', 'المال', 'التسويق', 'التعليم'];
  for (const c of cats) {
    await page.getByRole('tab', { name: c }).click();
    const n = await page.locator('.book-card').count();
    expect(n).toBeLessThanOrEqual(total);
    expect(n).toBeGreaterThanOrEqual(1);
  }
  await page.getByRole('tab', { name: 'الكل' }).click();

  // An add-to-cart button exists with Snipcart attributes
  const addBtn = page.locator('.snipcart-add-item').first();
  await expect(addBtn).toHaveAttribute('data-item-id');
  await expect(addBtn).toHaveAttribute('data-item-price');

  // Book detail navigation
  await page.locator('.book-card__title a').first().click();
  await expect(page).toHaveURL(/\/book\//);
  await expect(
    page.getByRole('heading', { level: 1 }).first(),
  ).toBeVisible();
});
