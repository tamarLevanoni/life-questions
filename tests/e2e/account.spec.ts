import { test, expect, login, backendRequests } from './fixtures';
import { apiSecret, backendOrigin } from '../support/environment';

test('guest profile and ordinary stories redirect while examples stay public @smoke', async ({ page }) => {
  const profile = await page.goto('/profile'); expect(new URL(profile!.url()).searchParams.get('alert')).toBe('auth-profile');
  const story = await page.goto('/story/story-1'); expect(new URL(story!.url()).searchParams.get('alert')).toBe('auth-story');
  await page.goto('/story/featured/story-1');
  await expect(page.getByRole('heading', { name: 'סיפור בדיקה 1' })).toBeVisible();
});

test('registered user edits, cancels, saves and refreshes their profile', async ({ page, context, request }) => {
  await login(context); await page.goto('/profile');
  await expect(page.getByRole('heading', { name: 'ישראל ישראלי', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'עריכת פרטים' }).click();
  await page.getByPlaceholder('שם פרטי', { exact: true }).fill('לא לשמור');
  await page.getByRole('button', { name: 'ביטול', exact: true }).click();
  expect((await backendRequests(request)).filter(r => r.method === 'PATCH')).toHaveLength(0);
  await page.getByRole('button', { name: 'עריכת פרטים' }).click();
  await expect(page.getByPlaceholder('שם פרטי', { exact: true })).toHaveValue('ישראל');
  await page.getByPlaceholder('שם פרטי', { exact: true }).fill('דוד');
  await page.getByRole('button', { name: 'שמירה', exact: true }).click();
  await expect(page.getByRole('button', { name: 'עריכת פרטים' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'דוד ישראלי', exact: true })).toBeVisible();
});

test('profile rejects invalid edits without calling the backend', async ({ page, context, request }) => {
  await login(context); await page.goto('/profile');
  await page.getByRole('button', { name: 'עריכת פרטים' }).click();
  await page.getByPlaceholder('שם פרטי', { exact: true }).fill('א');
  await page.getByRole('button', { name: 'שמירה', exact: true }).click();
  await expect(page.getByText('שם פרטי חייב להכיל לפחות 2 תווים')).toBeVisible();
  expect((await backendRequests(request)).filter(r => r.method === 'PATCH')).toHaveLength(0);
});

test('profile requires marketing consent before saving and can clear its institution', async ({ page, context, request }) => {
  await login(context); await page.goto('/profile');
  await page.getByRole('button', { name: 'עריכת פרטים' }).click();
  await page.getByPlaceholder('ישיבה, בית ספר, קהילה...').fill('');
  const consent = page.getByRole('checkbox', { name: 'אני מסכים לקבל עדכונים ותוכן שיווקי במייל (חובה)' });
  await consent.uncheck();
  await page.getByRole('button', { name: 'שמירה', exact: true }).click();
  await expect(consent).toHaveAttribute('aria-invalid', 'true');
  await expect(consent).toHaveAccessibleDescription('יש לאשר קבלת עדכונים ותוכן שיווקי במייל');
  expect((await backendRequests(request)).filter(r => r.method === 'PATCH')).toHaveLength(0);
  await consent.focus();
  await page.keyboard.press('Space');
  await expect(consent).toBeChecked();
  await page.getByRole('button', { name: 'שמירה', exact: true }).click();
  await expect(page.getByRole('button', { name: 'עריכת פרטים' })).toBeVisible();
  expect((await backendRequests(request)).find(r => r.method === 'PATCH')?.body)
    .toMatchObject({ institutionName: null, marketingConsent: true });
  await page.reload();
  await expect(page.getByText('מסכים לקבל עדכונים ותוכן שיווקי במייל', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'עריכת פרטים' }).click();
  await expect(page.getByPlaceholder('ישיבה, בית ספר, קהילה...')).toHaveValue('');
});

test('new Google user must explicitly consent before completing onboarding', async ({ page, context, request }) => {
  await login(context, false); await page.goto('/');
  const dialog = page.getByRole('dialog', { name: 'השלמת הרשמה' });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel('שם פרטי', { exact: true }).fill('משתמש');
  await dialog.getByLabel('שם משפחה', { exact: true }).fill('חדש');
  await dialog.getByLabel('טלפון', { exact: true }).fill('0501234567');
  await dialog.getByRole('button', { name: 'לומד', exact: true }).click();
  const consent = dialog.getByRole('checkbox', { name: 'אני מסכים לקבל עדכונים ותוכן שיווקי במייל (חובה)' });
  await expect(consent).not.toBeChecked();
  await dialog.getByRole('button', { name: 'סיום הרשמה' }).click();
  await expect(consent).toHaveAccessibleDescription('יש לאשר קבלת עדכונים ותוכן שיווקי במייל');
  expect((await backendRequests(request)).filter(r => r.path === '/api/users' && r.method === 'POST')).toHaveLength(0);
  await consent.check();
  await dialog.getByRole('button', { name: 'סיום הרשמה' }).click();
  await expect(dialog).toBeHidden();
  const response = await context.request.get('/api/auth/session');
  expect((await response.json()).user).toMatchObject({ id: 'user-new', googleId: 'google-new', isRegistrationComplete: true });
});

test('authenticated story navigation and missing-story handling @smoke', async ({ page, context }) => {
  await login(context); await page.goto('/story/story-1');
  await expect(page.getByRole('heading', { name: 'סיפור בדיקה 1', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /הרחבה/ }).click();
  await expect(page.getByText('זו הרחבה למשתמשים מחוברים בלבד.')).toBeVisible();
  await page.getByRole('link', { name: 'הסיפור הבא' }).click();
  await expect(page.getByRole('heading', { name: 'סיפור בדיקה 2', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'הסיפור הקודם' }).click();
  await expect(page.getByRole('heading', { name: 'סיפור בדיקה 1', exact: true })).toBeVisible();
  await page.goto('/story/story-999');
  await expect(page.getByText(/לא נמצא/).first()).toBeVisible();
});


test('failed profile save preserves the draft and allows cancel', async ({ page, context, request }) => {
  await login(context); await page.goto('/profile');
  await request.post(`${backendOrigin}/__test/user-failure`, { headers: { 'x-api-secret': apiSecret } });
  await page.getByRole('button', { name: 'עריכת פרטים' }).click();
  await page.getByLabel('שם פרטי', { exact: true }).fill('דוד');
  await page.getByRole('button', { name: 'שמירה', exact: true }).click();
  await expect(page.getByRole('status')).toBeVisible();
  await expect(page.getByLabel('שם פרטי', { exact: true })).toHaveValue('דוד');
  await page.getByRole('button', { name: 'ביטול', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'ישראל ישראלי', exact: true })).toBeVisible();
});

test('failed onboarding preserves details without marking registration complete', async ({ page, context, request }) => {
  await login(context, false); await page.goto('/');
  await request.post(`${backendOrigin}/__test/user-failure`, { headers: { 'x-api-secret': apiSecret } });
  const dialog = page.getByRole('dialog', { name: 'השלמת הרשמה' });
  await dialog.getByLabel('שם פרטי', { exact: true }).fill('משתמש');
  await dialog.getByLabel('שם משפחה', { exact: true }).fill('חדש');
  await dialog.getByLabel('טלפון', { exact: true }).fill('0501234567');
  await dialog.getByRole('button', { name: 'לומד', exact: true }).click();
  await dialog.getByRole('checkbox', { name: 'אני מסכים לקבל עדכונים ותוכן שיווקי במייל (חובה)' }).check();
  await dialog.getByRole('button', { name: 'סיום הרשמה' }).click();
  await expect(page.getByRole('status')).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'סיום הרשמה' })).toBeEnabled();
  await expect(dialog.getByLabel('שם פרטי', { exact: true })).toHaveValue('משתמש');
  expect((await (await context.request.get('/api/auth/session')).json()).user.isRegistrationComplete).toBe(false);
});
