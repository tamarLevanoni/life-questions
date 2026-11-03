import { test, expect, backendRequests } from './fixtures';
import { apiSecret, backendOrigin } from '../support/environment';
import { validContact } from '../fixtures/data';

async function fillContact(page: import('@playwright/test').Page) {
  await page.getByPlaceholder('ישראל ישראלי', { exact: true }).fill(validContact.name);
  await page.getByPlaceholder('example@email.com', { exact: true }).fill(validContact.email);
  await page.getByPlaceholder('נושא הפנייה...').fill(validContact.subject);
  await page.getByPlaceholder('כתוב את הודעתך כאן...').fill(validContact.message);
}

test('valid general contact is submitted once and confirms success @smoke', async ({ page, request }) => {
  await page.goto('/contact'); await fillContact(page);
  await page.getByRole('button', { name: 'שלח פנייה' }).click();
  await expect(page.getByRole('heading', { name: 'הפנייה נשלחה!' })).toBeVisible();
  const submissions = (await backendRequests(request)).filter(r => r.path === '/api/contact');
  expect(submissions).toHaveLength(1);
  expect(submissions[0].body).toMatchObject(validContact);
});

test('failed contact submission preserves the entered message', async ({ page, request }) => {
  await request.post(`${backendOrigin}/__test/contact-failure`, { headers: { 'x-api-secret': apiSecret } });
  await page.goto('/contact'); await fillContact(page);
  await page.getByRole('button', { name: 'שלח פנייה' }).click();
  await expect(page.getByRole('status')).toBeVisible();
  await expect(page.getByRole('button', { name: 'שלח פנייה' })).toBeEnabled();
  await expect.poll(async () => (await backendRequests(request)).filter(r => r.path === '/api/contact').length).toBe(1);
  await expect(page.getByPlaceholder('כתוב את הודעתך כאן...')).toHaveValue(validContact.message);
  await expect(page.getByRole('dialog')).toBeHidden();
});
