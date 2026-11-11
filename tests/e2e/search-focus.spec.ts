import { test, expect, login } from './fixtures';

test('removing tags keeps focus on surviving filters, including dependent topic removal', async ({ page, context }) => {
  await login(context);
  await page.goto('/search');
  await page.getByRole('textbox', { name: 'חיפוש חופשי' }).fill('שאלה');
  await page.getByRole('checkbox', { name: 'ספר בדיקה', exact: true }).check();
  await page.getByRole('checkbox', { name: 'נושא בדיקה', exact: true }).check();
  await page.getByRole('button', { name: 'הצג תוצאות', exact: true }).click();
  await expect(page.getByText('מציג 10 מתוך 12 תוצאות')).toBeVisible();

  const removeQuery = page.getByRole('button', { name: 'הסרת מסנן שאלה', exact: true });
  await removeQuery.focus();
  await page.keyboard.press('Enter');
  const removeBook = page.getByRole('button', { name: 'הסרת מסנן ספר בדיקה', exact: true });
  await expect(removeBook).toBeFocused();
  await expect(page.getByText('מציג 10 מתוך 12 תוצאות')).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'הסרת מסנן נושא בדיקה', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'חזרה לחיפוש ולסינון המלא', exact: true })).toBeFocused();
  await expect(page.getByText('מציג 10 מתוך 12 תוצאות')).toBeVisible();
});

for (const source of [
  { region: 'ש״ס', field: 'מסכת', placeholder: 'בחרו מסכת...', option: 'ברכות', remove: 'הסרת מסכת' },
  { region: 'שולחן ערוך', field: 'חלק', placeholder: 'בחרו חלק...', option: 'אורח חיים', remove: 'הסרת סימן' },
]) {
  test(source.region + ' clearing and removing sources preserves keyboard focus', async ({ page, context }) => {
    await login(context);
    await page.goto('/search');
    await page.getByRole('tab', { name: 'מקורות (שו״ע וש״ס)' }).click();
    const region = page.getByRole('region', { name: source.region, exact: true });
    const add = region.getByRole('button', { name: 'הוספת מקור', exact: true });
    await add.click();
    const trigger = region.getByRole('button', { name: source.field + ': ' + source.placeholder, exact: true });
    await trigger.click();
    await page.getByRole('button', { name: source.option, exact: true }).click();
    const removeSelected = region.getByRole('button', { name: source.remove + ' 1: ' + source.option, exact: true });
    await expect(removeSelected).toBeVisible();
    await region.getByRole('button', { name: 'ניקוי ' + source.field, exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toBeFocused();

    await add.click();
    const firstRemove = region.getByRole('button', { name: source.remove + ' 1', exact: true });
    await firstRemove.focus();
    await page.keyboard.press('Enter');
    await expect(firstRemove).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(add).toBeFocused();
    await expect(region.getByRole('button', { name: new RegExp(source.remove) })).toHaveCount(0);
  });
}

test('clearing query and resetting setup leave focus on the query field', async ({ page, context }) => {
  await login(context);
  await page.goto('/search');
  const query = page.getByRole('textbox', { name: 'חיפוש חופשי', exact: true });
  await query.fill('טיוטה');
  await page.getByRole('button', { name: 'נקה חיפוש', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(query).toBeFocused();
  await expect(query).toHaveValue('');
  await query.fill('חיפוש');
  await page.getByRole('button', { name: 'הצג תוצאות', exact: true }).click();
  await expect(page.getByText('מציג 10 מתוך 12 תוצאות')).toBeVisible();
  await page.getByRole('button', { name: 'נקה הכל', exact: true }).click();
  await expect(query).toBeFocused();
  await expect(query).toHaveValue('');
});
