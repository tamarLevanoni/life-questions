import AxeBuilder from '@axe-core/playwright';
import { test, expect, login } from './fixtures';

for (const theme of ['light', 'dark']) {
  for (const route of ['/', '/search', '/contact', '/profile', '/story/story-1']) {
    test(`${theme} ${route} remains accessible and fits the viewport`, async ({ page, context }, info) => {
      await login(context);
      await page.addInitScript(value => localStorage.setItem('theme', value), theme);
      await page.goto(route);
      if (route === '/profile') await page.getByRole('button', { name: 'עריכת פרטים' }).click();
      await expect(page.locator('html')).toHaveClass(new RegExp(theme));
      const results = await new AxeBuilder({ page }).include('main').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) }))).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      const screenshot = info.outputPath(`${theme}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      await info.attach(`${theme} design review`, { path: screenshot, contentType: 'image/png' });
    });
  }
}

test('form labels focus unique controls and validation describes the first invalid field', async ({ page }) => {
  await page.goto('/contact');
  const name = page.getByRole('textbox', { name: 'שם מלא *', exact: true });
  await page.getByText('שם מלא *', { exact: true }).click(); await expect(name).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.getByRole('textbox', { name: 'אימייל *', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'שלח פנייה' }).click(); await expect(name).toBeFocused();
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  await expect(name).toHaveAccessibleDescription(/לפחות/);
  const ids = await page.locator('input:not([type=hidden]), textarea').evaluateAll(nodes => nodes.map(n => n.id).filter(Boolean));
  expect(new Set(ids).size).toBe(ids.length);
});

for (const theme of ['light', 'dark']) {
  test(`${theme} guest search skips covered content when tabbing in both directions`, async ({ page }) => {
    await page.addInitScript(value => localStorage.setItem('theme', value), theme);
    await page.goto('/search');
    const main = page.getByRole('main');
    const trigger = main.getByRole('button', { name: 'יש להתחבר כדי לחפש' });
    await expect(trigger).toBeVisible();
    await expect(page.locator('html')).toHaveClass(new RegExp(theme));
    await trigger.focus();
    await page.keyboard.press('Shift+Tab');
    expect(await main.evaluate(node => node.contains(document.activeElement))).toBe(false);
    await page.keyboard.press('Tab');
    await expect(trigger).toBeFocused();
    await page.keyboard.press('Tab');
    expect(await main.evaluate(node => node.contains(document.activeElement))).toBe(false);
    await page.keyboard.press('Shift+Tab');
    await expect(trigger).toBeFocused();
  });
}

test('login dialog opens by keyboard, traps focus, closes and returns focus', async ({ page }) => {
  await page.goto('/search');
  const trigger = page.getByRole('button', { name: 'יש להתחבר כדי לחפש' });
  await trigger.focus(); await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog'); await expect(dialog).toBeVisible();
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Escape'); await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('onboarding errors remain accessible and leaving requires confirmation', async ({ page, context }) => {
  await login(context, false); await page.goto('/');
  const dialog = page.getByRole('dialog', { name: 'השלמת הרשמה' });
  await dialog.getByRole('button', { name: 'סיום הרשמה' }).click();
  await expect(dialog.getByLabel('שם פרטי', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  const results = await new AxeBuilder({ page }).include('[role=dialog]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) }))).toEqual([]);
  await dialog.getByRole('button', { name: 'דלג לעת עתה' }).click();
  await expect(page.getByRole('alertdialog')).toBeVisible();
  await page.getByRole('button', { name: 'חזור להרשמה' }).click();
  await expect(dialog).toBeVisible();
});
