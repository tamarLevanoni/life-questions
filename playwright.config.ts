import { defineConfig, devices } from '@playwright/test';
import { appOrigin, backendOrigin, testEnvironment } from './tests/support/environment';

const ui = process.env.TEST_UI === '1';
const release = process.env.TEST_RELEASE === '1';
export default defineConfig({
  testDir: './tests/e2e', fullyParallel: false, workers: 1,
  forbidOnly: !!process.env.CI, failOnFlakyTests: !!process.env.CI, retries: process.env.CI ? 1 : 0,
  timeout: 30_000, expect: { timeout: 10_000 },
  outputDir: 'test-results',
  reporter: process.env.CI ? [['github'], ['list'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: appOrigin, locale: 'he-IL', trace: 'retain-on-failure',
    screenshot: 'only-on-failure', reducedMotion: 'reduce',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
    ...(release ? [
      { name: 'firefox', grep: /@smoke/, use: { ...devices['Desktop Firefox'] } },
      { name: 'webkit', grep: /@smoke/, use: { ...devices['Desktop Safari'] } },
    ] : []),
  ],
  webServer: [
    { command: 'bun tests/support/mock-backend.ts', url: `${backendOrigin}/health`, env: testEnvironment, reuseExistingServer: ui },
    { command: `bun tests/support/prepare-app.ts ${ui ? 'dev' : 'start'}`, url: appOrigin, env: testEnvironment, timeout: 240_000, reuseExistingServer: ui },
  ],
});
