import { test, expect, login } from './fixtures';

for (const theme of ['light', 'dark']) {
  test(`${theme} result loading uses compact story placeholders`, async ({ page, context }, info) => {
    await login(context);
    await page.addInitScript(value => localStorage.setItem('theme', value), theme);
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/api/stories/search', async route => { await gate; await route.continue(); });
    try {
      await page.goto('/search');
      await page.getByRole('textbox', { name: 'חיפוש חופשי' }).fill('בדיקת טעינה');
      await page.getByRole('button', { name: 'הצג תוצאות', exact: true }).click();
      const status = page.getByRole('region', { name: 'תוצאות החיפוש', exact: true }).getByRole('status');
      await expect(status).toHaveCount(1);
      await expect(status).toHaveText('טוען תוצאות חיפוש…');
      const loading = page.locator('[data-search-skeleton]');
      await expect(loading).toBeVisible();
      await expect(page.getByRole('button', { name: 'הצג תוצאות', exact: true })).toBeHidden();
      const screenshot = info.outputPath(`${theme}-search-loading.png`);
      await page.screenshot({ path: screenshot, scale: 'css' });
      await info.attach(`${theme} loading`, { path: screenshot, contentType: 'image/png' });
      release();
      await expect(loading).toBeHidden();
      await expect(status).toHaveText('מציג 10 מתוך 12 תוצאות');
    } finally { release(); }
  });
}
