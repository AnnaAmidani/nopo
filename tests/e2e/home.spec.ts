// tests/e2e/home.spec.ts
import { expect, test } from '@playwright/test';

test('EN home page loads and shows site title', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.site-title')).toBeVisible();
});

test('IT home page loads and shows Italian welcome text', async ({ page }) => {
  await page.goto('/it/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('body')).toContainText('Benvenuto');
});

test('lang switcher navigates from EN to IT', async ({ page }) => {
  await page.goto('/en/');
  // The inactive lang button links to the alternate language
  await page.locator('.lang-btn:not(.active)').click();
  await expect(page).toHaveURL(/\/it\//);
});

test('lang switcher navigates from IT to EN', async ({ page }) => {
  await page.goto('/it/');
  await page.locator('.lang-btn:not(.active)').click();
  await expect(page).toHaveURL(/\/en\//);
});
