import { test, expect, login, backendRequests } from './fixtures';

test('guest search prompts login and does not send a backend search', async ({ page, request }) => {
  await page.goto('/search');
  await page.getByRole('button', { name: 'יש להתחבר כדי לחפש' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('button', { name: 'התחברות עם Google' })).toBeVisible();
  expect((await backendRequests(request)).filter(r => r.path === '/api/stories/search')).toHaveLength(0);
  expect((await request.post('/api/stories/search', { data: { q: 'direct' } })).status()).toBe(401);
});

test('authenticated search sends free text and selected categories', async ({ page, context, request }) => {
  await login(context);
  await page.goto('/search');
  await page.getByRole('textbox', { name: 'חיפוש חופשי' }).fill('שאלת בדיקה');
  await page.getByRole('button', { name: 'ספר בדיקה', exact: true }).click();
  await page.getByRole('button', { name: 'חיפוש', exact: true }).click();
  await expect(page.getByText('מציג 10 מתוך 12 תוצאות')).toBeVisible();
  expect((await backendRequests(request)).find(r => r.path === '/api/stories/search')?.body).toMatchObject({ q: 'שאלת בדיקה', bookIds: ['book-1'], page: 1, limit: 10 });
  await page.getByRole('heading', { name: 'סיפור בדיקה 1', exact: true }).click();
  await expect(page).toHaveURL(/\/story\/story-1$/);
  await expect(page.getByRole('heading', { name: 'סיפור בדיקה 1', exact: true })).toBeVisible();
});

test('pagination uses submitted filters even after editing the draft', async ({ page, context, request }) => {
  await login(context); await page.goto('/search');
  const query = page.getByRole('textbox', { name: 'חיפוש חופשי' });
  await query.fill('החיפוש שנשלח');
  await page.getByRole('button', { name: 'חיפוש', exact: true }).click();
  await expect(page.getByText('מציג 10 מתוך 12 תוצאות')).toBeVisible();
  await query.fill('טיוטה שטרם נשלחה');
  await page.getByRole('button', { name: 'טען עוד' }).click();
  await expect(page.getByText('מציג 12 מתוך 12 תוצאות')).toBeVisible();
  const searches = (await backendRequests(request)).filter(r => r.path === '/api/stories/search');
  expect(searches.at(-1)?.body).toMatchObject({ q: 'החיפוש שנשלח', page: 2 });
});

test('URL parameters trigger a single authorized initial search', async ({ page, context, request }) => {
  await login(context); await page.goto('/search?q=בדיקה&bookId=book-1');
  await expect(page.getByText('מציג 10 מתוך 12 תוצאות')).toBeVisible();
  const searches = (await backendRequests(request)).filter(r => r.path === '/api/stories/search');
  expect(searches).toHaveLength(1);
  expect(searches[0].body).toMatchObject({ q: 'בדיקה', bookIds: ['book-1'] });
});

test('empty results explain how to change the search', async ({ page, context }) => {
  await login(context); await page.goto('/search');
  await page.getByRole('textbox', { name: 'חיפוש חופשי' }).fill('ללא תוצאות');
  await page.getByRole('button', { name: 'חיפוש', exact: true }).click();
  await expect(page.getByText('לא נמצאו תוצאות לחיפוש זה')).toBeVisible();
});

for (const query of ['שגיאה', 'לא תקין']) {
  test(`search failure is visible and preserves the query: ${query}`, async ({ page, context }) => {
    await login(context); await page.goto('/search');
    await page.getByRole('textbox', { name: 'חיפוש חופשי' }).fill(query);
    await page.getByRole('button', { name: 'חיפוש', exact: true }).click();
    await expect(page.getByRole('alert').filter({ hasText: 'אירעה שגיאה בחיפוש' })).toContainText('אירעה שגיאה בחיפוש');
    await expect(page.getByRole('textbox', { name: 'חיפוש חופשי' })).toHaveValue(query);
  });
}

test('a late search cannot replace the latest submitted request', async ({ page, context }) => {
  await login(context); await page.goto('/search');
  const query = page.getByRole('textbox', { name: 'חיפוש חופשי' });
  await query.fill('איטי');
  const firstSent = page.waitForRequest(r => r.url().endsWith('/api/stories/search') && r.postDataJSON().q === 'איטי');
  await page.getByRole('button', { name: 'חיפוש', exact: true }).click(); await firstSent;
  await query.fill('ללא תוצאות');
  await page.getByRole('button', { name: 'חיפוש', exact: true }).click();
  await expect(page.getByText('לא נמצאו תוצאות לחיפוש זה')).toBeVisible();
  await expect(query).toHaveValue('ללא תוצאות');
});
