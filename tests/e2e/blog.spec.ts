// tests/e2e/blog.spec.ts
import { expect, test } from '@playwright/test';

test('EN blog index lists at least one post', async ({ page }) => {
  await page.goto('/en/blog/');
  const postLinks = page.locator('ul li a');
  await expect(postLinks.first()).toBeVisible();
});

test('EN blog post page renders title and content', async ({ page }) => {
  await page.goto('/en/blog/first-post/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('article, main').first()).toBeVisible();
});

test('IT blog index loads', async ({ page }) => {
  await page.goto('/it/blog/');
  await expect(page).toHaveURL(/\/it\/blog/);
  await expect(page.locator('body')).toBeVisible();
});
