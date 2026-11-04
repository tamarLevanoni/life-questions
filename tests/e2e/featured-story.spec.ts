import { test, expect } from './fixtures';

test('featured stories survive navigation to search and browser history', async ({ page }) => {
  const storyErrors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error' && message.text().includes('[FeaturedStoryView]')) {
      storyErrors.push(message.text());
    }
  });

  await page.goto('/story/featured/story-1');
  await expect(page.getByRole('heading', { name: 'סיפור בדיקה 1', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'סיפור בדיקה 1', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'לכל הסיפורים', exact: true }).click();
  await expect(page).toHaveURL(/\/search$/);
  await expect(page.getByRole('textbox', { name: 'חיפוש חופשי' })).toBeVisible();
  await expect(page.getByText('הסיפור לא נמצא', { exact: true })).toHaveCount(0);
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'סיפור בדיקה 1', exact: true })).toBeVisible();
  await page.goto('/');
  await page.getByRole('link', { name: /סיפור בדיקה 2/ }).click();
  await expect(page.getByRole('heading', { name: 'סיפור בדיקה 2', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'לכל הסיפורים', exact: true }).click();
  await expect(page).toHaveURL(/\/search$/);
  await expect(page.getByText('הסיפור לא נמצא', { exact: true })).toHaveCount(0);
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'סיפור בדיקה 2', exact: true })).toBeVisible();
  expect(storyErrors).toEqual([]);
});

test('an unavailable featured story shows the empty state', async ({ page }) => {
  await page.goto('/story/featured/missing-story');
  await expect(page.getByText('הסיפור לא נמצא', { exact: true })).toBeVisible();
});
