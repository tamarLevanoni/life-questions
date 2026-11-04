import { test, expect, login } from './fixtures';

test('login callback finishes loading the session before closing its popup', async ({ page, context }) => {
  await page.goto('/search');
  await page.getByRole('button', { name: 'יש להתחבר כדי לחפש' }).click();
  await login(context);

  // Only the test harness replaces Google OAuth; the app still reads a signed session.
  await context.route('**/auth/signin?*', route => route.fulfill({
    status: 302, headers: { location: '/auth/callback' },
  }));
  let releaseSession!: () => void;
  const sessionGate = new Promise<void>(resolve => { releaseSession = resolve; });
  let sessionPending = false;
  const sessionErrors: string[] = [];
  context.on('page', popup => {
    popup.on('console', message => {
      if (message.type() === 'error' && message.text().includes('CLIENT_FETCH_ERROR')) sessionErrors.push(message.text());
    });
  });
  await context.route('**/api/auth/session', async route => {
    if (route.request().frame().page() !== page) {
      sessionPending = true;
      await sessionGate;
    }
    await route.continue();
  });

  try {
    const popupOpened = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'התחברות עם Google' }).click();
    const popup = await popupOpened;
    await expect(popup.getByText('מסיים התחברות...', { exact: true })).toBeVisible();
    await expect.poll(() => sessionPending).toBe(true);
    expect(popup.isClosed()).toBe(false);
    const popupClosed = popup.waitForEvent('close');
    releaseSession();
    await popupClosed;
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page.getByRole('button', { name: 'יש להתחבר כדי לחפש' })).toBeHidden();
    expect(sessionErrors).toEqual([]);
  } finally {
    releaseSession();
  }
});

test('callback notification does not authenticate a guest without a session', async ({ page }) => {
  await page.goto('/search');
  await page.getByRole('button', { name: 'יש להתחבר כדי לחפש' }).click();
  const popupOpened = page.waitForEvent('popup');
  await page.evaluate(() => { window.open('/auth/callback', 'callback-without-session'); });
  const popup = await popupOpened;
  await expect.poll(() => popup.isClosed()).toBe(true);
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.getByRole('button', { name: 'יש להתחבר כדי לחפש' })).toBeVisible();
});

test('callback opened without an opener returns to the home page', async ({ page }) => {
  await page.goto('/auth/callback');
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('button', { name: 'שאלות מהחיים', exact: true })).toBeVisible();
});
