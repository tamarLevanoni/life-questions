import AxeBuilder from '@axe-core/playwright';
import type { Page, TestInfo } from '@playwright/test';
import { test, expect, login } from './fixtures';

async function capture(page: Page, info: TestInfo, name: string) {
  const screenshot = info.outputPath(`${name}.png`);
  await page.screenshot({ path: screenshot, fullPage: false, scale: 'css' });
  await info.attach(name, { path: screenshot, contentType: 'image/png' });
}

async function expectInViewport(page: Page, name: string, regionName?: string) {
  const scope = regionName ? page.getByRole('region', { name: regionName, exact: true }) : page;
  const control = scope.getByRole('button', { name, exact: true });
  await expect(control).toBeInViewport({ ratio: 1 });
  const box = await control.boundingBox();
  expect(box, name).not.toBeNull();
  expect(box!.y, name).toBeGreaterThanOrEqual(72);
  expect(box!.y + box!.height, name).toBeLessThanOrEqual(page.viewportSize()!.height);
}

async function visibleFilterRows(page: Page, name: string) {
  return page.getByRole('group', { name, exact: true }).evaluate(group => {
    const bounds = group.getBoundingClientRect();
    return [...group.querySelectorAll('label')].filter(label => {
      const row = label.getBoundingClientRect();
      return row.top >= bounds.top - 1 && row.bottom <= bounds.bottom + 1;
    }).length;
  });
}

async function scan(page: Page) {
  const results = await new AxeBuilder({ page }).include('main').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations.map(violation => ({ id: violation.id, nodes: violation.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) }))).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

for (const theme of ['light', 'dark']) {
  test(`${theme} search tracks and results match the responsive layout and remain accessible`, async ({ page, context }, info) => {
    await login(context);
    await page.addInitScript(value => localStorage.setItem('theme', value), theme);
    await page.goto('/search');
    await expect(page.locator('html')).toHaveClass(new RegExp(theme));
    const books = page.getByRole('tab', { name: 'ספר ונושא' });
    await books.focus();
    await page.keyboard.press('ArrowLeft');
    const sources = page.getByRole('tab', { name: 'מקורות (שו״ע וש״ס)' });
    await expect(sources).toBeFocused();
    await expect(sources).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowRight');
    await expect(books).toBeFocused();
    await page.getByRole('checkbox', { name: 'ספר בדיקה', exact: true }).check();
    await page.getByRole('checkbox', { name: 'נושא בדיקה', exact: true }).check();
    await page.getByRole('textbox', { name: 'חיפוש חופשי' }).fill('שאלה לדוגמה');
    await expectInViewport(page, 'הצג תוצאות');
    const bookList = await page.getByRole('group', { name: 'ספרים', exact: true }).boundingBox();
    const topicList = await page.getByRole('group', { name: 'נושאים', exact: true }).boundingBox();
    if (page.viewportSize()!.width < 768) {
      expect(topicList!.y).toBeGreaterThanOrEqual(bookList!.y + bookList!.height);
      expect(bookList!.width).toBeGreaterThan(page.viewportSize()!.width * 0.8);
      expect(await visibleFilterRows(page, 'ספרים')).toBeGreaterThanOrEqual(5);
      expect(await visibleFilterRows(page, 'נושאים')).toBeGreaterThanOrEqual(5);
    } else {
      expect(Math.abs(bookList!.x - topicList!.x)).toBeGreaterThan(100);
    }
    const actions = await page.getByRole('button', { name: 'הצג תוצאות', exact: true }).boundingBox();
    const footer = await page.getByRole('contentinfo').boundingBox();
    const footerGap = footer!.y - actions!.y - actions!.height;
    if (page.viewportSize()!.width >= 768) {
      expect(footerGap).toBeGreaterThanOrEqual(48);
      expect(footerGap).toBeLessThanOrEqual(60);
    } else {
      expect(footerGap).toBeLessThanOrEqual(28);
    }
    await scan(page);
    await capture(page, info, `${theme}-book-topic`);
    await sources.click();
    await capture(page, info, `${theme}-sources-hints`);
    await page.getByRole('region', { name: 'שולחן ערוך', exact: true }).getByRole('button', { name: 'הוספת מקור', exact: true }).click();
    await page.getByRole('button', { name: 'חלק: בחרו חלק...' }).click();
    await page.getByRole('button', { name: 'אורח חיים', exact: true }).click();
    await page.getByRole('region', { name: 'ש״ס', exact: true }).getByRole('button', { name: 'הוספת מקור', exact: true }).click();
    await page.getByRole('button', { name: 'מסכת: בחרו מסכת...' }).click();
    await page.getByRole('button', { name: 'ברכות', exact: true }).click();
    await expectInViewport(page, 'הוספת מקור', 'שולחן ערוך');
    await expectInViewport(page, 'הוספת מקור', 'ש״ס');
    for (const name of [ 'חלק: אורח חיים', 'סימן: בחרו סימן...', 'מסכת: ברכות', 'דף: בחרו דף...', 'הצג תוצאות']) await expectInViewport(page, name);
    await expect.poll(async () => (await page.getByRole('textbox', { name: 'חיפוש חופשי' }).boundingBox())?.y ?? 0).toBeGreaterThanOrEqual(72);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await scan(page);
    await capture(page, info, `${theme}-sources`);
    await page.getByRole('button', { name: 'הצג תוצאות', exact: true }).click();
    await expect(page.getByText('מציג 10 מתוך 12 תוצאות')).toBeVisible();
    await scan(page);
    await capture(page, info, `${theme}-results`);
  });
}

test('360px and short desktop show setup controls without page scrolling', async ({ page, context }, info) => {
  await login(context);
  for (const viewport of [{ width: 360, height: 640 }, { width: 1280, height: 600 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/search');
    await page.getByRole('checkbox', { name: 'ספר בדיקה', exact: true }).check();
    await page.getByRole('checkbox', { name: 'נושא בדיקה', exact: true }).check();
    await expectInViewport(page, 'הצג תוצאות');
    if (viewport.width < 768) {
      expect(await visibleFilterRows(page, 'ספרים')).toBeGreaterThanOrEqual(4);
      expect(await visibleFilterRows(page, 'נושאים')).toBeGreaterThanOrEqual(3);
    }
    await page.getByRole('tab', { name: 'מקורות (שו״ע וש״ס)' }).click();
    await page.getByRole('region', { name: 'שולחן ערוך', exact: true }).getByRole('button', { name: 'הוספת מקור', exact: true }).click();
    await page.getByRole('region', { name: 'ש״ס', exact: true }).getByRole('button', { name: 'הוספת מקור', exact: true }).click();
    await expectInViewport(page, 'הוספת מקור', 'שולחן ערוך');
    await expectInViewport(page, 'הוספת מקור', 'ש״ס');
    for (const name of [ 'חלק: בחרו חלק...', 'סימן: בחרו סימן...', 'מסכת: בחרו מסכת...', 'דף: בחרו דף...', 'הצג תוצאות']) await expectInViewport(page, name);
    const rows = await page.locator('[data-source-rows]').evaluateAll(nodes => nodes.map(node => ({ content: node.scrollHeight, available: node.clientHeight })));
    expect(rows.every(row => row.content <= row.available), JSON.stringify(rows)).toBe(true);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await scan(page);
    await capture(page, info, `compact-${viewport.width}x${viewport.height}`);
  }
});

test('enlarged text and several source rows keep every control reachable', async ({ page, context }, info) => {
  await login(context);
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto('/search');
  await page.getByRole('tab', { name: 'מקורות (שו״ע וש״ס)' }).click();
  for (let index = 0; index < 5; index++) await page.getByRole('region', { name: 'ש״ס', exact: true }).getByRole('button', { name: 'הוספת מקור', exact: true }).click();
  await page.getByRole('button', { name: 'הסרת מסכת 5', exact: true }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'הסרת מסכת 5', exact: true })).toBeInViewport({ ratio: 1 });
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  const submit = page.getByRole('button', { name: 'הצג תוצאות', exact: true });
  await submit.scrollIntoViewIfNeeded();
  // IntersectionObserver rounds fractional pixels at 200% text size.
  await expect(submit).toBeInViewport({ ratio: 0.999 });
  const submitBox = await submit.boundingBox();
  expect(submitBox!.x).toBeGreaterThanOrEqual(-1);
  expect(submitBox!.x + submitBox!.width).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
  await submit.click();
  await expect(page.getByText('מציג 10 מתוך 12 תוצאות')).toBeVisible();
  await capture(page, info, 'enlarged-text');
});
