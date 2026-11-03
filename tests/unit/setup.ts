import { mock } from 'bun:test';

// Unit tests never inherit real backend/OAuth credentials from .env.local.
Object.assign(process.env, {
  BACKEND_API_URL: 'http://127.0.0.1:4100', INTERNAL_API_SECRET: 'local-test-api-secret',
  NEXTAUTH_SECRET: 'local-test-session-secret-not-for-deployment', NEXTAUTH_URL: 'http://localhost:3100',
  GOOGLE_CLIENT_ID: 'test-client', GOOGLE_CLIENT_SECRET: 'test-client-secret',
});
mock.module('server-only', () => ({}));
