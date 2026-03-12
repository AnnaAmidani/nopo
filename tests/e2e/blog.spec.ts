// tests/e2e/blog.spec.ts
import { expect, test } from '@playwright/test';

test('EN blog index lists at least one post', async ({ page }) => {
  await page.goto('en/blog/');
  const postLinks = page.locator('main ul li a');
  await expect(postLinks.first()).toBeVisible();
});

test('EN blog post page renders title and content', async ({ page }) => {
  // Navigate via the listing so the test does not depend on a specific slug
  await page.goto('en/blog/');
  const firstPostLink = page.locator('main ul li a').first();
  const href = await firstPostLink.getAttribute('href');
  await page.goto(href!);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  await expect(page.locator('article, main').first()).toBeVisible();
});

test('IT blog index lists at least one post', async ({ page }) => {
  await page.goto('it/blog/');
  const postLinks = page.locator('main ul li a');
  await expect(postLinks.first()).toBeVisible();
});

// ── Card rendering ────────────────────────────────────────────────────────────

test('blog card shows title and description', async ({ page }) => {
  await page.goto('en/blog/');
  const card = page.locator('main ul li').first();
  await expect(card.locator('.card-title')).toBeVisible();
  await expect(card.locator('.card-desc')).toBeVisible();
});

test('blog card title link navigates to the post', async ({ page }) => {
  await page.goto('en/blog/');
  const card = page.locator('main ul li').first();
  const cardLink = card.locator('a.card-link');
  const href = await cardLink.getAttribute('href');
  expect(href).toMatch(/\/en\/blog\/.+/);
  await cardLink.click();
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

test('blog card with category shows category badge', async ({ page }) => {
  await page.goto('en/blog/');
  // Find a card that has a category badge
  const badge = page.locator('main ul li .category-badge').first();
  await expect(badge).toBeVisible();
  const text = await badge.innerText();
  expect(text.trim().length).toBeGreaterThan(0);
});

test('blog card category badge links to the category page', async ({ page }) => {
  await page.goto('en/blog/');
  const badge = page.locator('main ul li .category-badge').first();
  const href = await badge.getAttribute('href');
  expect(href).toMatch(/\/en\/[a-z]+\//);
  await badge.click();
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

test('blog card has no nested anchor elements', async ({ page }) => {
  await page.goto('en/blog/');
  // An <a> inside an <a> is invalid HTML — browser will eject the inner one
  // so we verify no .card-link contains another <a>
  const nestedAnchors = page.locator('main ul li a.card-link a');
  await expect(nestedAnchors).toHaveCount(0);
});

test('home page cards have no nested anchor elements', async ({ page }) => {
  await page.goto('en/');
  const nestedAnchors = page.locator('main ul li a.card-link a');
  await expect(nestedAnchors).toHaveCount(0);
});
