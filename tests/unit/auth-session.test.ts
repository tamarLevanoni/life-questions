import { afterEach, beforeEach, describe, expect, spyOn, test } from 'bun:test';
import type { JWT } from 'next-auth/jwt';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { testUser } from '../fixtures/data';

let fetchMock: ReturnType<typeof spyOn<typeof globalThis, 'fetch'>>;
beforeEach(() => { fetchMock = spyOn(globalThis, 'fetch'); });
afterEach(() => fetchMock.mockRestore());

const token = (): JWT => ({ sub: testUser.googleId, ...testUser, identityVersion: 1, isRegistrationComplete: true });
const update = (jwt: JWT, payload: Record<string, unknown> = {}) => authOptions.callbacks!.jwt!({
  token: jwt, trigger: 'update', session: payload, user: { id: 'unused' }, account: null,
});

describe('Trusted session identity', () => {
  test('cannot replace identity or profile with client update input', async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ success: true, data: testUser }));
    const result = await update(token(), { id: 'victim', googleId: 'google-victim', email: 'attacker@example.test', firstName: 'forged', isRegistrationComplete: false });
    expect(result.id).toBe(testUser.id);
    expect(result.googleId).toBe(testUser.googleId);
    expect(result.email).toBe(testUser.email);
    expect(result.firstName).toBe(testUser.firstName);
    expect(result.isRegistrationComplete).toBe(true);
    expect(String(fetchMock.mock.calls[0][0])).toEndWith(`/api/users/google/${testUser.googleId}`);
  });

  test('completes onboarding only from a validated backend user', async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ success: true, data: testUser }));
    const result = await update({ sub: testUser.googleId, googleId: testUser.googleId, identityVersion: 1, isRegistrationComplete: false });
    expect(result.id).toBe(testUser.id);
    expect(result.isRegistrationComplete).toBe(true);
  });

  test('a real 404 clears registered identity and cannot be overridden by client flags', async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ success: false, error: 'Not found' }, { status: 404 }));
    const result = await update(token(), { id: 'forged', isRegistrationComplete: true });
    expect(result.id).toBeUndefined();
    expect(result.isRegistrationComplete).toBe(false);
  });

  test('rejects an upstream account that belongs to another Google identity', async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ success: true, data: { ...testUser, googleId: 'someone-else' } }));
    await expect(update(token())).rejects.toThrow();
  });

  test('does not treat upstream failure or malformed data as a new account', async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ success: false, error: 'Unavailable' }, { status: 503 }));
    await expect(update(token())).rejects.toThrow();
    fetchMock.mockResolvedValueOnce(Response.json({ success: true, data: { id: 'incomplete' } }));
    await expect(update(token())).rejects.toThrow();
  });

  test('legacy sessions require a fresh Google sign-in', async () => {
    const old = token(); delete old.identityVersion;
    await expect(update(old)).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
