// tests/e2e/blog.spec.ts
import { expect, test } from '@playwright/test';

test('EN blog index lists at least one post', async ({ page }) => {
  await page.goto('/en/blog/');
  const postLinks = page.locator('main ul li a');
  await expect(postLinks.first()).toBeVisible();
});

test('EN blog post page renders title and content', async ({ page }) => {
  await page.goto('/en/blog/first-post/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('First post');
  await expect(page.locator('article, main').first()).toBeVisible();
});

test('IT blog index shows no-posts message', async ({ page }) => {
  await page.goto('/it/blog/');
  await expect(page.locator('main p.no-posts')).toHaveText('Nessun post ancora — torna presto.');
});
