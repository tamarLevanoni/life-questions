import AxeBuilder from '@axe-core/playwright';
import { test, expect, login, backendRequests } from './fixtures';

test('a guest can open, reload and return to a story absent from the home selections', async ({ page, request }) => {
  const response = await page.goto('/story/story-5');
  expect(await response!.text()).not.toContain('זו הרחבה למשתמשים מחוברים בלבד.');
  const title = page.getByRole('heading', { name: 'סיפור בדיקה 5', exact: true });
  await expect(title).toBeVisible();
  await page.reload();
  await expect(title).toBeVisible();
  await page.getByRole('button', { name: 'תשובה קצרה', exact: true }).click();
  await expect(page.getByText('זו תשובה קצרה לבדיקה.')).toBeVisible();
  await expect(page.getByText('זו הרחבה למשתמשים מחוברים בלבד.')).toHaveCount(0);
  await page.getByRole('link', { name: 'חזרה לחיפוש', exact: true }).click();
  await expect(page).toHaveURL('/search');
  await expect(page.getByRole('button', { name: 'יש להתחבר כדי לחפש' })).toBeVisible();
  await page.goBack();
  await expect(title).toBeVisible();
  expect((await backendRequests(request)).some(r => r.path === '/api/stories/story-5')).toBe(true);
  await page.getByRole('link', { name: 'שאל שאלה/דווח על טעות בהמשך לסיפור זה', exact: true }).click();
  await expect(page).toHaveURL('/contact');
  await expect(page.getByRole('status')).toContainText('יש להתחבר כדי לשלוח שאלת המשך');
  expect((await backendRequests(request)).filter(r => r.path === '/api/contact')).toHaveLength(0);
});

test('home examples and the weekly answer use ordinary story pages with locked expansions', async ({ page }) => {
  const response = await page.goto('/');
  expect(await response!.text()).not.toContain('זו הרחבה למשתמשים מחוברים בלבד.');
  await page.getByRole('link', { name: /סיפור בדיקה 2/ }).click();
  await expect(page).toHaveURL('/story/story-2');
  await expect(page.getByRole('button', { name: /הרחבה יש להתחבר כדי לצפות/ })).toBeVisible();
  await expect(page.getByText('זו הרחבה למשתמשים מחוברים בלבד.')).toHaveCount(0);
  await page.goBack();
  await page.getByRole('link', { name: 'מעבר לתשובה', exact: true }).click();
  await expect(page).toHaveURL('/story/story-4');
  await expect(page.getByRole('heading', { name: 'סיפור בדיקה 4', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /הרחבה יש להתחבר כדי לצפות/ })).toBeVisible();
  await expect(page.getByText('זו הרחבה למשתמשים מחוברים בלבד.')).toHaveCount(0);
  await page.getByRole('link', { name: 'חזרה לחיפוש' }).click();
  await expect(page).toHaveURL('/search');
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'סיפור בדיקה 4', exact: true })).toBeVisible();
});

test('old featured URLs return 404 without redirecting or fetching a story', async ({ page, request, context }) => {
  for (const registered of [false, true]) {
    if (registered) await login(context);
    const response = await page.goto('/story/featured/story-1');
    expect(response!.status()).toBe(404);
    await expect(page).toHaveURL('/story/featured/story-1');
    await expect(page.getByRole('heading', { name: 'הדף לא נמצא' })).toBeVisible();
  }
  expect((await backendRequests(request)).filter(r => r.path === '/api/stories/story-1')).toHaveLength(0);
});

test('a guest sees the not-found page for a missing story', async ({ page }) => {
  for (const route of ['/story/story-999', '/story']) {
    await page.goto(route);
    await expect(page.getByRole('heading', { name: 'הדף לא נמצא' })).toBeVisible();
    await expect(page).toHaveURL(route);
  }
});

for (const theme of ['light', 'dark']) {
  test(`${theme} guest navigation opens login by keyboard and restores focus`, async ({ page }, info) => {
    await page.addInitScript(value => localStorage.setItem('theme', value), theme);
    await page.goto('/story/story-2');
    await expect(page.locator('html')).toHaveClass(new RegExp(theme));
    const navigation = page.getByRole('navigation', { name: 'ניווט בין סיפורים' });
    for (const label of ['הסיפור הקודם', 'הסיפור הבא']) {
      const trigger = navigation.getByRole('button', { name: label, exact: true });
      await expect(trigger).toBeEnabled();
      await trigger.focus();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page).toHaveURL('/story/story-2');
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toBeHidden();
      await expect(trigger).toBeFocused();
    }
    await expect(navigation.getByRole('link')).toHaveCount(0);
    const expansion = page.getByRole('button', { name: /הרחבה יש להתחבר כדי לצפות/ });
    await expansion.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page).toHaveURL('/story/story-2');
    await expect(page.getByText('זו הרחבה למשתמשים מחוברים בלבד.')).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(expansion).toBeFocused();
    expect(await page.locator('html').getAttribute('dir')).toBe('rtl');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const results = await new AxeBuilder({ page }).include('main').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
    const screenshot = info.outputPath(`guest-story-${theme}.png`);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: screenshot, fullPage: true });
    await info.attach('Guest story design review', { path: screenshot, contentType: 'image/png' });
  });
}

test('navigation stays disabled until the session has loaded', async ({ page }) => {
  let releaseSession!: () => void;
  const gate = new Promise<void>(resolve => { releaseSession = resolve; });
  await page.route('**/api/auth/session', async route => { await gate; await route.continue(); });
  try {
    await page.goto('/story/story-2');
    const navigation = page.getByRole('navigation', { name: 'ניווט בין סיפורים' });
    await expect(navigation.getByRole('button', { name: 'הסיפור הקודם' })).toBeDisabled();
    await expect(navigation.getByRole('button', { name: 'הסיפור הבא' })).toBeDisabled();
    await page.getByRole('button', { name: /הרחבה/ }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
    releaseSession();
    await expect(navigation.getByRole('button', { name: 'הסיפור הבא' })).toBeEnabled();
  } finally { releaseSession(); }
});

for (const registered of [true, false]) {
  test(`story login ${registered ? 'allows navigation on a second click' : 'requires onboarding before navigation'}`, async ({ page, context }) => {
    // Refresh must work even when the popup's cross-window storage event is lost.
    await context.addInitScript(() => {
      window.addEventListener('storage', event => {
        if (event.isTrusted) event.stopImmediatePropagation();
      }, true);
    });
    await page.goto('/story/story-2');
    await expect(page.getByRole('button', { name: 'הסיפור הבא', exact: true })).toBeEnabled();
    await page.getByRole('button', { name: registered ? 'הסיפור הבא' : /הרחבה יש להתחבר כדי לצפות/, exact: true }).click();
    await login(context, registered);
    // OAuth is replaced only in the test harness; session verification stays real.
    await context.route('**/auth/signin?*', route => route.fulfill({ status: 302, headers: { location: '/auth/callback' } }));
    const popupOpened = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'התחברות עם Google' }).click();
    const popup = await popupOpened;
    await expect.poll(() => popup.isClosed()).toBe(true);
    if (!registered) {
      const onboarding = page.getByRole('dialog', { name: 'השלמת הרשמה' });
      await expect(onboarding).toBeVisible();
      await expect(page.getByRole('link', { name: 'הסיפור הבא', exact: true })).toHaveCount(0);
      await onboarding.getByLabel('שם פרטי', { exact: true }).fill('משתמש');
      await onboarding.getByLabel('שם משפחה', { exact: true }).fill('חדש');
      await onboarding.getByLabel('טלפון', { exact: true }).fill('0501234567');
      await onboarding.getByRole('button', { name: 'לומד', exact: true }).click();
      await onboarding.getByRole('checkbox', { name: 'אני מסכים לקבל עדכונים ותוכן שיווקי במייל (חובה)' }).check();
      await onboarding.getByRole('button', { name: 'סיום הרשמה' }).click();
      await expect(onboarding).toBeHidden();
      await page.getByRole('button', { name: 'אולי מאוחר יותר', exact: true }).click();
    }
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page).toHaveURL('/story/story-2');
    await expect(page.getByRole('heading', { name: 'סיפור בדיקה 2', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'הרחבה', exact: true }).click();
    await expect(page.getByText('זו הרחבה למשתמשים מחוברים בלבד.')).toBeVisible();
    await page.getByRole('link', { name: 'הסיפור הבא', exact: true }).click();
    await expect(page).toHaveURL('/story/story-3');
    await expect(page.getByRole('heading', { name: 'סיפור בדיקה 3', exact: true })).toBeVisible();
  });
}

test('story sequence ends omit the unavailable direction', async ({ page, context }) => {
  for (const registered of [false, true]) {
    if (registered) await login(context);
    for (const [id, missingLabel] of [['story-1', 'הסיפור הקודם'], ['story-12', 'הסיפור הבא']]) {
      await page.goto(`/story/${id}`);
      await expect(page.getByRole('heading', { name: id === 'story-1' ? 'סיפור בדיקה 1' : 'סיפור בדיקה 12', exact: true })).toBeVisible();
      await expect(page.getByRole('navigation', { name: 'ניווט בין סיפורים' }).getByText(missingLabel, { exact: true })).toHaveCount(0);
    }
  }
});
