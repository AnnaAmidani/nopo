// tests/e2e/blog.spec.ts
import { expect, test } from '@playwright/test';
import { TRANSLATIONS } from '../../src/i18n/translations';

test('EN blog index lists at least one post', async ({ page }) => {
  await page.goto('/en/blog/');
  const postLinks = page.locator('main ul li a');
  await expect(postLinks.first()).toBeVisible();
});

test('EN blog post page renders title and content', async ({ page }) => {
  // Navigate via the listing so the test does not depend on a specific slug
  await page.goto('/en/blog/');
  const firstPostLink = page.locator('main ul li a').first();
  const href = await firstPostLink.getAttribute('href');
  await page.goto(href!);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  await expect(page.locator('article, main').first()).toBeVisible();
});

test('IT blog index shows no-posts message', async ({ page }) => {
  await page.goto('/it/blog/');
  await expect(page.locator('main p.no-posts')).toHaveText(TRANSLATIONS.it.noPosts);
});
