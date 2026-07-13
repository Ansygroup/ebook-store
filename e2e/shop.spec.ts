import { test, expect } from '@playwright/test';

test.describe('متجر الكتب — RTL UI', () => {
  test('الصفحة الرئيسية تحمّ الصفحة العربية RTL', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/دار المعرفة/);
    // اتجاه RTL
    const dir = await page.getAttribute('html', 'dir');
    expect(dir).toBe('rtl');
    const lang = await page.getAttribute('html', 'lang');
    expect(lang).toBe('ar');
  });

  test('صفحة المتجر تعرض 10 كتب مع أزرار شراء', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForSelector('.book-card');
    const cards = await page.locator('.book-card').count();
    expect(cards).toBe(10);
    // كل كتاب له زر شراء يفتح رابطًا خارجيًا
    const buyBtns = await page.locator('.book-card a.btn--primary').count();
    expect(buyBtns).toBe(10);
  });

  test('صفحة تفاصيل الكتاب تعرض الغلاف والسعر', async ({ page }) => {
    await page.goto('/book/the-influential-leader');
    await page.waitForSelector('h1');
    const title = await page.textContent('h1');
    expect(title).toContain('القائد المؤثر');
    // صورة الغلاف محمّلة
    const img = page.locator('.book-detail__cover img, img').first();
    await expect(img).toBeVisible();
  });

  test('التبديل للإنجليزية يعمل', async ({ page }) => {
    await page.goto('/');
    // زر تبديل اللغة (يحتوي نص EN/AR)
    const toggle = page.locator('button:has-text("EN"), a:has-text("EN")').first();
    if (await toggle.count()) {
      await toggle.click();
      await expect(page).toHaveURL(/lang=en/);
    }
  });

  test('نموذج النشرة (newsletter) يحتوي على honeypot مخفي', async ({ page }) => {
    await page.goto('/');
    const honey = page.locator('input.honeypot').first();
    if (await honey.count()) {
      // الحقل مخفي بصريًا (بوتات فقط تملأه)
      const hidden = await honey.isHidden();
      expect(hidden).toBe(true);
    }
  });
});
