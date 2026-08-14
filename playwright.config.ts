import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:3001/api/v1/',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm --filter @game-guide-hub/api dev',
    url: 'http://127.0.0.1:3001/api/v1/health/live',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
