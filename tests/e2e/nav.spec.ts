// tests/e2e/nav.spec.ts
import { expect, test } from '@playwright/test';

test('category bar links all resolve without error', async ({ page }) => {
  await page.goto('en/');
  const navLinks = page.locator('.category-bar a');
  const hrefs = await navLinks.evaluateAll((links) =>
    links.map((a) => (a as HTMLAnchorElement).getAttribute('href')).filter(Boolean)
  );

  expect(hrefs.length).toBeGreaterThan(0);

  for (const href of hrefs) {
    const response = await page.request.get(href!);
    expect(response.status(), `${href} returned non-200`).toBe(200);
  }
});

test('about page loads', async ({ page }) => {
  await page.goto('en/about/');
  await expect(page).toHaveURL(/\/en\/about/);
  await expect(page.getByRole('heading', { name: 'About', level: 1 })).toBeVisible();
});

test('root JS redirect navigates to /en/', async ({ page }) => {
  await page.goto('./');
  await expect(page).toHaveURL(/\/en\/$/);
});
