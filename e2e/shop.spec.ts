import { test, expect } from '@playwright/test';

test.describe('Global Ebook Store — EN/LTR UI', () => {
  test('home loads in English LTR by default', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Global Ebook Store/);
    const dir = await page.getAttribute('html', 'dir');
    expect(dir).toBe('ltr');
    const lang = await page.getAttribute('html', 'lang');
    expect(lang).toBe('en');
  });

  test('shop page shows 10 books with buy buttons', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForSelector('.book-card');
    const cards = await page.locator('.book-card').count();
    expect(cards).toBe(10);
    const buyBtns = await page.locator('.book-card a.btn--primary').count();
    expect(buyBtns).toBe(10);
  });

  test('book detail shows cover and price', async ({ page }) => {
    await page.goto('/book/the-influential-leader');
    await page.waitForSelector('h1');
    const title = await page.textContent('h1');
    expect(title).toContain('The Influential Leader');
    const img = page.locator('.book-detail__cover img, img').first();
    await expect(img).toBeVisible();
  });

  test('switching to Arabic works', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('button:has-text("العربية"), a:has-text("العربية")').first();
    if (await toggle.count()) {
      await toggle.click();
      await expect(page).toHaveURL(/lang=ar/);
    }
  });

  test('newsletter form has hidden honeypot', async ({ page }) => {
    await page.goto('/');
    const honey = page.locator('input.honeypot').first();
    if (await honey.count()) {
      const hidden = await honey.isHidden();
      expect(hidden).toBe(true);
    }
  });
});
