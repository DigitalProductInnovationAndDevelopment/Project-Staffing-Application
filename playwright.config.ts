import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './frontend/src/tests',
  retries: 2,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
  },
});
