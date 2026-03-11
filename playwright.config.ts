// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const isCI = process.env.GITHUB_ACTIONS === 'true';
const basePath = isCI ? '/nopo' : '';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: `http://localhost:4321${basePath}/`,
  },
  webServer: {
    command: 'npm run preview',
    url: `http://localhost:4321${basePath}/en/`,
    reuseExistingServer: !isCI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
