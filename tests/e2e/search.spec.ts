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
  await page.getByRole('checkbox', { name: 'ספר בדיקה', exact: true }).check();
  await page.getByRole('button', { name: 'הצג תוצאות', exact: true }).click();
  await expect(page.getByText('מציג 10 מתוך 12 תוצאות')).toBeVisible();
  expect((await backendRequests(request)).find(r => r.path === '/api/stories/search')?.body).toMatchObject({ q: 'שאלת בדיקה', bookIds: ['book-1'], page: 1, limit: 10 });
  await page.getByRole('heading', { name: 'סיפור בדיקה 1', exact: true }).click();
  await expect(page).toHaveURL(/\/story\/story-1$/);
  await expect(page.getByRole('heading', { name: 'סיפור בדיקה 1', exact: true })).toBeVisible();
});

test('desktop result query edits do not change the submitted pagination filters', async ({ page, context, request }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await login(context); await page.goto('/search');
  const query = page.getByRole('textbox', { name: 'חיפוש חופשי' });
  await query.fill('החיפוש שנשלח');
  await page.getByRole('button', { name: 'הצג תוצאות', exact: true }).click();
  await expect(page.getByText('מציג 10 מתוך 12 תוצאות')).toBeVisible();
  await expect(query).toHaveValue('החיפוש שנשלח');
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
  await page.getByRole('button', { name: 'הצג תוצאות', exact: true }).click();
  await expect(page.getByText('לא נמצאו תוצאות לחיפוש זה')).toBeVisible();
});

for (const query of ['שגיאה', 'לא תקין']) {
  test(`search failure is visible and preserves the query: ${query}`, async ({ page, context }) => {
    await login(context); await page.goto('/search');
    await page.getByRole('textbox', { name: 'חיפוש חופשי' }).fill(query);
    await page.getByRole('button', { name: 'הצג תוצאות', exact: true }).click();
    await expect(page.getByRole('alert').filter({ hasText: 'אירעה שגיאה בחיפוש' })).toContainText('אירעה שגיאה בחיפוש');
    await page.getByRole('button', { name: 'חזרה לחיפוש ולסינון המלא' }).click();
    await expect(page.getByRole('textbox', { name: 'חיפוש חופשי' })).toHaveValue(query);
  });
}

test('a late search cannot replace the latest submitted request', async ({ page, context }) => {
  await login(context); await page.goto('/search');
  const query = page.getByRole('textbox', { name: 'חיפוש חופשי' });
  await query.fill('איטי');
  const firstSent = page.waitForRequest(r => r.url().endsWith('/api/stories/search') && r.postDataJSON().q === 'איטי');
  await page.getByRole('button', { name: 'הצג תוצאות', exact: true }).click(); await firstSent;
  await page.getByRole('button', { name: 'חזרה לחיפוש ולסינון המלא' }).click();
  await query.fill('ללא תוצאות');
  await page.getByRole('button', { name: 'הצג תוצאות', exact: true }).click();
  await expect(page.getByText('לא נמצאו תוצאות לחיפוש זה')).toBeVisible();
  await page.getByRole('button', { name: 'חזרה לחיפוש ולסינון המלא' }).click();
  await expect(query).toHaveValue('ללא תוצאות');
});

test('filter tabs preserve selections and combine both tracks in a single request', async ({ page, context, request }) => {
  await login(context); await page.goto('/search');
  await expect(page.getByRole('heading', { name: 'תוצאות החיפוש' })).toBeHidden();
  await page.getByRole('checkbox', { name: 'ספר בדיקה', exact: true }).check();
  await page.getByRole('checkbox', { name: 'נושא בדיקה', exact: true }).check();
  await page.getByRole('tab', { name: 'מקורות (שו״ע וש״ס)' }).click();
  await expect(page.getByRole('checkbox', { name: 'ספר בדיקה', exact: true })).toBeHidden();
  await page.getByRole('region', { name: 'שולחן ערוך', exact: true }).getByRole('button', { name: 'הוספת מקור', exact: true }).click();
  await page.getByRole('button', { name: 'חלק: בחרו חלק...' }).click();
  await page.getByRole('button', { name: 'אורח חיים', exact: true }).click();
  await page.getByRole('button', { name: 'סימן: בחרו סימן...' }).click();
  await page.getByRole('button', { name: 'א׳', exact: true }).click();
  await page.getByRole('region', { name: 'ש״ס', exact: true }).getByRole('button', { name: 'הוספת מקור', exact: true }).click();
  await page.getByRole('button', { name: 'מסכת: בחרו מסכת...' }).click();
  await page.getByRole('button', { name: 'ברכות', exact: true }).click();
  await page.getByRole('button', { name: 'דף: בחרו דף...' }).click();
  await page.getByRole('button', { name: 'ב׳', exact: true }).click();
  await page.getByRole('tab', { name: 'ספר ונושא' }).click();
  await expect(page.getByRole('checkbox', { name: 'ספר בדיקה', exact: true })).toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'נושא בדיקה', exact: true })).toBeChecked();
  expect((await backendRequests(request)).filter(r => r.path === '/api/stories/search')).toHaveLength(0);
  await expect(page.getByLabel('מסננים פעילים', { exact: true })).toBeHidden();
  await page.getByRole('tab', { name: 'מקורות (שו״ע וש״ס)' }).click();
  await expect(page.getByRole('button', { name: 'מסכת: ברכות' })).toBeVisible();
  await page.getByRole('button', { name: 'הצג תוצאות', exact: true }).click();
  await expect(page.getByText('מציג 10 מתוך 12 תוצאות')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'תוצאות החיפוש' })).toBeFocused();
  await expect(page.getByRole('tablist')).toBeHidden();
  await expect(page.getByLabel('מסננים פעילים', { exact: true })).toBeVisible();
  expect((await backendRequests(request)).filter(r => r.path === '/api/stories/search').at(-1)?.body).toMatchObject({
    bookIds: ['book-1'], topicIds: ['topic-1'], shasRefs: [{ masechetId: 'masechet-1', daf: 2 }], shuRefs: [{ shuSectionId: 'section-1', simanId: 'siman-1' }], page: 1,
  });
  await page.getByRole('button', { name: 'חזרה לחיפוש ולסינון המלא' }).click();
  await expect(page.getByRole('textbox', { name: 'חיפוש חופשי' })).toBeFocused();
  await expect(page.getByRole('tab', { name: 'מקורות (שו״ע וש״ס)' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('button', { name: 'דף: ב׳' })).toBeVisible();
  await expect(page.getByLabel('מסננים פעילים', { exact: true })).toBeHidden();
});

test('removing an applied book searches immediately, clears its topics and preserves unrelated draft edits', async ({ page, context, request }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await login(context); await page.goto('/search');
  await page.getByRole('textbox', { name: 'חיפוש חופשי' }).fill('נשלח');
  await page.getByRole('checkbox', { name: 'ספר בדיקה', exact: true }).check();
  await page.getByRole('checkbox', { name: 'נושא בדיקה', exact: true }).check();
  await page.getByRole('button', { name: 'הצג תוצאות', exact: true }).click();
  await expect(page.getByText('מציג 10 מתוך 12 תוצאות')).toBeVisible();
  await page.getByRole('textbox', { name: 'חיפוש חופשי' }).fill('טיוטה שמורה');
  const sent = page.waitForRequest(r => r.url().endsWith('/api/stories/search') && !r.postDataJSON().bookIds);
  await page.getByRole('button', { name: 'הסרת מסנן ספר בדיקה', exact: true }).click();
  await sent;
  await expect(page.getByText('מציג 10 מתוך 12 תוצאות')).toBeVisible();
  const body = (await backendRequests(request)).filter(r => r.path === '/api/stories/search').at(-1)?.body;
  expect(body).toMatchObject({ q: 'נשלח', page: 1 });
  expect(body).not.toHaveProperty('bookIds'); expect(body).not.toHaveProperty('topicIds');
  await page.getByRole('button', { name: 'טען עוד' }).click();
  await expect(page.getByText('מציג 12 מתוך 12 תוצאות')).toBeVisible();
  await page.getByRole('button', { name: 'חזרה לחיפוש ולסינון המלא' }).click();
  await expect(page.getByRole('textbox', { name: 'חיפוש חופשי' })).toHaveValue('טיוטה שמורה');
  await expect(page.getByRole('checkbox', { name: 'ספר בדיקה', exact: true })).not.toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'נושא בדיקה', exact: true })).not.toBeChecked();
});

test('source rows prevent duplicate pages and reset dependent choices', async ({ page, context }) => {
  await login(context); await page.goto('/search');
  await page.getByRole('tab', { name: 'מקורות (שו״ע וש״ס)' }).click();
  for (let index = 0; index < 2; index++) {
    await page.getByRole('region', { name: 'ש״ס', exact: true }).getByRole('button', { name: 'הוספת מקור', exact: true }).click();
    await page.getByRole('button', { name: 'מסכת: בחרו מסכת...' }).click();
    await page.getByRole('button', { name: 'ברכות', exact: true }).click();
    await page.getByRole('button', { name: 'דף: בחרו דף...' }).click();
    if (index === 1) await expect(page.getByRole('button', { name: 'ב׳', exact: true })).toBeHidden();
    await page.getByRole('button', { name: index ? 'ג׳' : 'ב׳', exact: true }).click();
  }
  await page.getByRole('button', { name: 'ניקוי מסכת', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'דף: בחרו דף...' })).toBeDisabled();
  await page.getByRole('button', { name: 'הסרת מסכת 1', exact: true }).click();
  await expect(page.getByRole('button', { name: 'דף: ג׳' })).toBeVisible();
  await page.getByRole('button', { name: 'איפוס בחירה', exact: true }).click();
  await expect(page.getByRole('button', { name: 'מסכת: ברכות' })).toBeHidden();
});

test('clear all returns to empty setup without another search or a return-to-results button', async ({ page, context, request }) => {
  await login(context); await page.goto('/search?q=בדיקה&bookId=book-1');
  await expect(page.getByText('מציג 10 מתוך 12 תוצאות')).toBeVisible();
  await page.getByRole('button', { name: 'נקה הכל', exact: true }).click();
  await expect(page.getByRole('tab', { name: 'ספר ונושא' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('textbox', { name: 'חיפוש חופשי' })).toHaveValue('');
  await expect(page.getByRole('checkbox', { name: 'ספר בדיקה', exact: true })).not.toBeChecked();
  await expect(page.getByRole('button', { name: 'חזרה לתוצאות', exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'תוצאות החיפוש' })).toBeHidden();
  expect((await backendRequests(request)).filter(r => r.path === '/api/stories/search')).toHaveLength(1);
});

test('desktop results submit edited text with the current category filters', async ({ page, context, request }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await login(context); await page.goto('/search?q=בדיקה&bookId=book-1');
  await expect(page.getByText('מציג 10 מתוך 12 תוצאות')).toBeVisible();
  const query = page.getByRole('textbox', { name: 'חיפוש חופשי' });
  await expect(query).toHaveValue('בדיקה');
  await query.fill('שאלה חדשה');
  await page.getByRole('button', { name: 'חיפוש', exact: true }).click();
  await expect(page.getByText('מציג 10 מתוך 12 תוצאות')).toBeVisible();
  expect((await backendRequests(request)).filter(r => r.path === '/api/stories/search').at(-1)?.body).toMatchObject({ q: 'שאלה חדשה', bookIds: ['book-1'], page: 1 });
});
