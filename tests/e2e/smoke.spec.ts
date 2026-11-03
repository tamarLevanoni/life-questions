import { test, expect } from './fixtures';

test('home shows the public example stories @smoke', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'דוגמאות לסיפורים' })).toBeVisible();
  await expect(page.getByRole('link', { name: /סיפור בדיקה 1/ })).toBeVisible();
});

test('a home example opens the matching full story @smoke', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /סיפור בדיקה 1/ }).click();
  await expect(page).toHaveURL(/\/story\/featured\/story-1$/);
  await expect(page.getByRole('heading', { name: 'סיפור בדיקה 1' })).toBeVisible();
  await expect(page.getByText('זהו סיפור בדיוני המשמש לבדיקת האתר בלבד.')).toBeVisible();
});

test('invalid contact submission explains required fields @smoke', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: 'שלח פנייה' }).click();
  await expect(page.getByText('שם חייב להכיל לפחות 2 תווים')).toBeVisible();
  await expect(page.getByText('ההודעה חייבת להכיל לפחות 10 תווים')).toBeVisible();
});
