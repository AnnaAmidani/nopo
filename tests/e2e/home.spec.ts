// tests/e2e/home.spec.ts
import { expect, test } from '@playwright/test';
import { SITE_TITLE } from '../../src/consts';

test('EN home page loads and shows site title', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.getByRole('heading', { name: SITE_TITLE, level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: SITE_TITLE })).toBeVisible();
});

test('IT home page loads and shows Italian welcome text', async ({ page }) => {
  await page.goto('/it/');
  await expect(page.getByRole('heading', { name: SITE_TITLE, level: 1 })).toBeVisible();
  await expect(page.locator('body')).toContainText('Benvenuto');
});

test('lang switcher navigates from EN to IT', async ({ page }) => {
  await page.goto('/en/');
  await page.getByRole('link', { name: 'IT', exact: true }).click();
  await expect(page).toHaveURL(/\/it\//);
});

test('lang switcher navigates from IT to EN', async ({ page }) => {
  await page.goto('/it/');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL(/\/en\//);
});
