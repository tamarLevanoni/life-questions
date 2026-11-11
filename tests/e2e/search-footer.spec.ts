import type { Page, TestInfo } from '@playwright/test';
import { test, expect, login } from './fixtures';

async function expectDocumentEndsAtFooter(page: Page) {
  await expect.poll(() => page.evaluate(() => {
    const footerBottom = document.querySelector('footer')!.getBoundingClientRect().bottom + window.scrollY;
    return document.documentElement.scrollHeight - Math.max(footerBottom, window.innerHeight);
  })).toBeLessThanOrEqual(2);
}

async function captureFooter(page: Page, info: TestInfo, name: string) {
  await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
  const screenshot = info.outputPath(`${name}.png`);
  await page.screenshot({ path: screenshot, fullPage: true, scale: 'css' });
  await info.attach(name, { path: screenshot, contentType: 'image/png' });
}

for (const authenticated of [false, true]) {
  test(`${authenticated ? 'registered' : 'guest'} search with long filters has no space after its footer`, async ({ page, context }, info) => {
    if (authenticated) await login(context);
    await page.goto('/search');
    // A small reference list cannot reproduce the invisible checkbox-input overflow.
    if (!authenticated) {
      await expect(page.getByRole('button', { name: 'יש להתחבר כדי לחפש' })).toBeVisible();
    } else {
      const topics = page.getByRole('group', { name: 'נושאים', exact: true });
      await expect(topics.getByRole('checkbox')).toHaveCount(63);
      const lastTopic = topics.getByRole('checkbox').last();
      await lastTopic.check();
      await expect(lastTopic).toBeChecked();
    }
    await expectDocumentEndsAtFooter(page);
    await captureFooter(page, info, 'setup-footer');
    if (!authenticated) return;

    await page.getByRole('tab', { name: 'מקורות (שו״ע וש״ס)' }).click();
    await expectDocumentEndsAtFooter(page);
    await page.getByRole('tab', { name: 'ספר ונושא' }).click();
    await expectDocumentEndsAtFooter(page);
    await page.getByRole('button', { name: 'הצג תוצאות', exact: true }).click();
    await expect(page.getByText('מציג 10 מתוך 12 תוצאות')).toBeVisible();
    await expectDocumentEndsAtFooter(page);
    await page.getByRole('button', { name: 'טען עוד', exact: true }).click();
    await expect(page.getByText('מציג 12 מתוך 12 תוצאות')).toBeVisible();
    await expectDocumentEndsAtFooter(page);
    await page.getByRole('button', { name: 'נקה הכל', exact: true }).click();
    await expect(page.getByRole('tab', { name: 'ספר ונושא' })).toBeVisible();
    await expectDocumentEndsAtFooter(page);
    await captureFooter(page, info, 'reset-footer');
  });
}
