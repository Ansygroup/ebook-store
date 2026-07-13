import { test, expect } from '@playwright/test';
test('book covers render as PNG', async ({ page }) => {
  await page.goto('/');
  const img = page.locator('.hero__book img, .book-card img').first();
  await expect(img).toBeVisible();
  await expect(img).toHaveAttribute('src', /\.png$/);
  const src = await img.getAttribute('src');
  const resp = await page.goto(src!);
  expect(resp?.status()).toBe(200);
});
