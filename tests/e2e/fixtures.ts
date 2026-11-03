import { test as base, expect, type BrowserContext, type APIRequestContext } from '@playwright/test';
import { encode } from 'next-auth/jwt';
import { apiSecret, appOrigin, backendOrigin, sessionSecret } from '../support/environment';
import { testUser } from '../fixtures/data';
import { AUTH_IDENTITY_VERSION } from '@/lib/auth-identity';

export async function login(context: BrowserContext, registered = true) {
  const identity = registered ? testUser.googleId : 'google-new';
  const value = await encode({
    secret: sessionSecret, maxAge: 3600,
    token: {
      sub: identity, googleId: identity, identityVersion: AUTH_IDENTITY_VERSION,
      email: registered ? testUser.email : 'new@example.test',
      ...(registered ? testUser : {}), isRegistrationComplete: registered,
    },
  });
  await context.addCookies([{ name: 'next-auth.session-token', value, url: appOrigin, httpOnly: true, sameSite: 'Lax' }]);
}

export async function backendRequests(request: APIRequestContext): Promise<{ method: string; path: string; body: Record<string, unknown> | null }[]> {
  const response = await request.get(`${backendOrigin}/__test/requests`, { headers: { 'x-api-secret': apiSecret } });
  return (await response.json()).data;
}

export const test = base.extend<{ isolatedBackend: void; runtimeErrors: void }>({
  runtimeErrors: [async ({ page }, use) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error' && /hydration|hydrated but|Cannot update a component/i.test(message.text())) errors.push(message.text());
    });
    await use();
    expect(errors, 'No unhandled runtime or hydration errors').toEqual([]);
  }, { auto: true }],
  isolatedBackend: [async ({ request, context }, use) => {
    const response = await request.post(`${backendOrigin}/__test/reset`, { headers: { 'x-api-secret': apiSecret } });
    expect(response.ok()).toBe(true);
    // Network outside the local application is not part of deterministic E2E.
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin === appOrigin) return route.continue();
      if (route.request().resourceType() === 'image') {
        return route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#ddd"/></svg>' });
      }
      return route.fulfill({ status: 200, contentType: 'text/plain', body: '' });
    });
    await use();
  }, { auto: true }],
});
export { expect };
