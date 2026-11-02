export const appOrigin = 'http://localhost:3100';
export const backendOrigin = 'http://127.0.0.1:4100';
export const sessionSecret = 'local-test-session-secret-not-for-deployment';
export const apiSecret = 'local-test-api-secret';

// Always override inherited .env.local values before starting either test server.
export const testEnvironment = {
  QUALITY_TEST: '1', NEXT_TELEMETRY_DISABLED: '1',
  NEXTAUTH_URL: appOrigin, NEXT_PUBLIC_SITE_URL: appOrigin,
  NEXTAUTH_SECRET: sessionSecret, BACKEND_API_URL: backendOrigin,
  INTERNAL_API_SECRET: apiSecret, GOOGLE_CLIENT_ID: 'test-client', GOOGLE_CLIENT_SECRET: 'test-client-secret',
  PLAYWRIGHT_HTML_OPEN: 'never',
};
