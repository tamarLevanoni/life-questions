import { test, expect } from './fixtures';
import { legalTestPdf } from '../fixtures/pdf';

test('legal PDFs render inline, resize and remain reachable from the footer', async ({ page }, testInfo) => {
  await page.route('https://res.cloudinary.com/**/legal-documents/*.pdf', route => route.fulfill({
    contentType: 'application/pdf', body: legalTestPdf(),
  }));
  await page.goto('/');
  for (const [path, title] of [['privacy', 'מדיניות פרטיות'], ['terms', 'תנאי שימוש'], ['accessibility', 'הצהרת נגישות']]) {
    await page.getByRole('navigation', { name: 'מסמכים משפטיים ונגישות' }).getByRole('link', { name: title }).click();
    await expect(page).toHaveURL(new RegExp(`/${path}$`));
    await expect(page.getByRole('region', { name: `${title}, עמוד 2 מתוך 2` }).getByText('Legal document test')).toBeVisible();
    await expect(page.getByRole('region', { name: `${title}, עמוד 1 מתוך 2` }).locator('canvas')).toBeVisible();
    const original = page.getByRole('link', { name: 'המסמך המקורי (PDF, לשונית חדשה)' });
    await expect(original).toHaveAttribute('target', '_blank');
    await original.focus();
    await expect(original).toBeFocused();
  }
  for (const width of [360, 1024]) {
    await page.setViewportSize({ width, height: 800 });
    await expect.poll(async () => {
      const canvas = await page.getByRole('region', { name: 'הצהרת נגישות, עמוד 1 מתוך 2' }).locator('canvas').boundingBox();
      return canvas ? Math.abs(canvas.width - (Math.min(width - 32, 896))) : 100;
    }).toBeLessThan(2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  for (const theme of ['light', 'dark']) {
    await page.evaluate(theme => document.documentElement.classList.toggle('dark', theme === 'dark'), theme);
    await page.screenshot({ path: testInfo.outputPath(`legal-${theme}.png`), fullPage: true });
  }
});

test('a PDF delivery failure keeps the original document link available', async ({ page }) => {
  await page.route('https://res.cloudinary.com/**/legal-documents/*.pdf', route => route.fulfill({ status: 401 }));
  await page.goto('/privacy');
  await expect(page.getByRole('main').getByRole('alert')).toContainText('לא ניתן להציג את המסמך כרגע');
  await expect(page.getByRole('link', { name: 'המסמך המקורי (PDF, לשונית חדשה)' })).toBeVisible();
});
