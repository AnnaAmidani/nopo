# Test Suite Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Vitest (unit) + Playwright (E2E) tests that run as part of every `npm run build`, locally and in CI.

**Architecture:** Unit tests live in `tests/unit/` and run via `vitest run` before the build. E2E tests live in `tests/e2e/` and run via `playwright test` after `astro build`, using Playwright's `webServer` to auto-start `astro preview` against the built `dist/`. The `build` script becomes `npm run test:unit && astro build && npm run test:e2e`.

**Tech Stack:** Vitest 3, @playwright/test, Chromium browser (installed via `npx playwright install chromium`)

---

### Task 1: Install dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install Vitest**

```bash
npm install --save-dev vitest
```

Expected: `vitest` appears in `devDependencies` in `package.json`.

**Step 2: Install Playwright**

```bash
npm install --save-dev @playwright/test
```

**Step 3: Install Chromium browser for Playwright**

```bash
npx playwright install chromium
```

Expected: Chromium downloaded to Playwright's cache. No errors.

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install vitest and playwright"
```

---

### Task 2: Configure Vitest

**Files:**
- Create: `vitest.config.ts`

**Step 1: Create the config**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
  },
});
```

**Step 2: Add the `test:unit` script to `package.json`**

In the `"scripts"` block, add:

```json
"test:unit": "vitest run"
```

**Step 3: Verify Vitest is wired up**

```bash
npm run test:unit
```

Expected output: `No test files found` (or similar — no errors, exit 0).

**Step 4: Commit**

```bash
git add vitest.config.ts package.json
git commit -m "chore: configure vitest"
```

---

### Task 3: Configure Playwright

**Files:**
- Create: `playwright.config.ts`

**Step 1: Create the config**

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const isCI = process.env.GITHUB_ACTIONS === 'true';
const basePath = isCI ? '/nopo' : '';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: `http://localhost:4321${basePath}`,
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
```

**Step 2: Add the `test:e2e` script to `package.json`**

```json
"test:e2e": "playwright test"
```

**Step 3: Update the `build` script in `package.json`**

Replace:
```json
"build": "astro build"
```
With:
```json
"build": "npm run test:unit && astro build && npm run test:e2e"
```

**Step 4: Commit**

```bash
git add playwright.config.ts package.json
git commit -m "chore: configure playwright"
```

---

### Task 4: Write unit tests — i18n

**Files:**
- Create: `tests/unit/i18n.test.ts`

**Step 1: Create the test file**

```ts
// tests/unit/i18n.test.ts
import { describe, expect, it } from 'vitest';
import { SUPPORTED_LANGS, TRANSLATIONS } from '../../src/i18n/translations';

describe('SUPPORTED_LANGS', () => {
  it('contains en and it', () => {
    expect(SUPPORTED_LANGS).toContain('en');
    expect(SUPPORTED_LANGS).toContain('it');
  });
});

describe('TRANSLATIONS', () => {
  it('all languages have the same top-level keys', () => {
    const enKeys = Object.keys(TRANSLATIONS.en).sort();
    const itKeys = Object.keys(TRANSLATIONS.it).sort();
    expect(itKeys).toEqual(enKeys);
  });

  it('all languages have the same category keys', () => {
    const enCats = Object.keys(TRANSLATIONS.en.categories).sort();
    const itCats = Object.keys(TRANSLATIONS.it.categories).sort();
    expect(itCats).toEqual(enCats);
  });

  it('no translation value is an empty string', () => {
    for (const lang of SUPPORTED_LANGS) {
      for (const [key, value] of Object.entries(TRANSLATIONS[lang])) {
        if (typeof value === 'string') {
          expect(value, `TRANSLATIONS.${lang}.${key} is empty`).not.toBe('');
        }
      }
    }
  });
});
```

**Step 2: Run the test**

```bash
npm run test:unit
```

Expected: 4 tests pass. If any fail, fix the translation keys in `src/i18n/translations.ts` before continuing.

**Step 3: Commit**

```bash
git add tests/unit/i18n.test.ts
git commit -m "test: add i18n unit tests"
```

---

### Task 5: Write unit tests — consts

**Files:**
- Create: `tests/unit/consts.test.ts`

**Step 1: Create the test file**

```ts
// tests/unit/consts.test.ts
import { describe, expect, it } from 'vitest';
import { CATEGORIES, SITE_DESCRIPTION, SITE_TITLE } from '../../src/consts';

describe('site constants', () => {
  it('SITE_TITLE is a non-empty string', () => {
    expect(typeof SITE_TITLE).toBe('string');
    expect(SITE_TITLE.length).toBeGreaterThan(0);
  });

  it('SITE_DESCRIPTION is a non-empty string', () => {
    expect(typeof SITE_DESCRIPTION).toBe('string');
    expect(SITE_DESCRIPTION.length).toBeGreaterThan(0);
  });

  it('CATEGORIES is a non-empty array with slug and label', () => {
    expect(CATEGORIES.length).toBeGreaterThan(0);
    for (const cat of CATEGORIES) {
      expect(typeof cat.slug).toBe('string');
      expect(typeof cat.label).toBe('string');
    }
  });
});
```

**Step 2: Run all unit tests**

```bash
npm run test:unit
```

Expected: 7 tests pass across both test files.

**Step 3: Commit**

```bash
git add tests/unit/consts.test.ts
git commit -m "test: add consts unit tests"
```

---

### Task 6: Write E2E tests — home page

**Files:**
- Create: `tests/e2e/home.spec.ts`

Note: these tests require a built `dist/`. Run `npx astro build` once before running `npm run test:e2e` directly during development. When running `npm run build`, the build step happens automatically before E2E.

**Step 1: Create the test file**

```ts
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
```

**Step 2: Build and run E2E tests**

```bash
npx astro build && npm run test:e2e -- --project=chromium tests/e2e/home.spec.ts
```

Expected: 4 tests pass.

**Step 3: Commit**

```bash
git add tests/e2e/home.spec.ts
git commit -m "test: add home page E2E tests"
```

---

### Task 7: Write E2E tests — blog

**Files:**
- Create: `tests/e2e/blog.spec.ts`

**Step 1: Create the test file**

```ts
// tests/e2e/blog.spec.ts
import { expect, test } from '@playwright/test';

test('EN blog index lists at least one post', async ({ page }) => {
  await page.goto('/en/blog/');
  // Posts are rendered as list items containing links
  const postLinks = page.locator('ul li a');
  await expect(postLinks.first()).toBeVisible();
});

test('EN blog post page renders title and content', async ({ page }) => {
  await page.goto('/en/blog/first-post/');
  await expect(page.locator('h1')).toBeVisible();
  // The post body content is inside <article> or <main>
  await expect(page.locator('article, main')).toBeVisible();
});

test('IT blog index loads', async ({ page }) => {
  await page.goto('/it/blog/');
  await expect(page).toHaveURL(/\/it\/blog/);
  // No posts yet — page should still load without error
  await expect(page.locator('body')).toBeVisible();
});
```

**Step 2: Run**

```bash
npm run test:e2e -- --project=chromium tests/e2e/blog.spec.ts
```

Expected: 3 tests pass.

**Step 3: Commit**

```bash
git add tests/e2e/blog.spec.ts
git commit -m "test: add blog E2E tests"
```

---

### Task 8: Write E2E tests — navigation

**Files:**
- Create: `tests/e2e/nav.spec.ts`

**Step 1: Create the test file**

```ts
// tests/e2e/nav.spec.ts
import { expect, test } from '@playwright/test';

test('category bar links all resolve without error', async ({ page }) => {
  await page.goto('/en/');
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
  await page.goto('/en/about/');
  await expect(page).toHaveURL(/\/en\/about/);
  await expect(page.locator('body')).toBeVisible();
});

test('root redirects to /en/', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/en\//);
});
```

**Step 2: Run**

```bash
npm run test:e2e -- --project=chromium tests/e2e/nav.spec.ts
```

Expected: 3 tests pass.

**Step 3: Commit**

```bash
git add tests/e2e/nav.spec.ts
git commit -m "test: add navigation E2E tests"
```

---

### Task 9: Full build verification

**Step 1: Run the full build (unit + build + E2E)**

```bash
npm run build
```

Expected output (in order):
1. Vitest: `7 tests pass`
2. Astro: `22 page(s) built`
3. Playwright: `10 tests pass`

If any step fails, fix before proceeding.

**Step 2: Verify CI would pass by checking the build script**

```bash
cat package.json | grep '"build"'
```

Expected: `"build": "npm run test:unit && astro build && npm run test:e2e"`

---

### Task 10: Update README and CLAUDE.md

**Files:**
- Modify: `README.md`
- Modify: `CLAUDE.md`

**Step 1: Add testing section to README.md**

In `README.md`, after the `## Development` section, add:

```markdown
## Testing

Tests run automatically as part of every build. To run them manually:

```sh
npm run test:unit          # Vitest unit tests (fast, no browser)
npx astro build            # build first if running E2E standalone
npm run test:e2e           # Playwright E2E tests (requires dist/ to exist)
```

Unit tests cover i18n translation completeness and site constants. E2E tests cover page rendering, navigation, and language switching using Chromium.
```

**Step 2: Update CLAUDE.md**

In the `## Commands` section, add the test commands:

```markdown
npm run test:unit    # Vitest unit tests (fast)
npm run test:e2e     # Playwright E2E (requires built dist/)
```

Also update the note under the section:

```markdown
There is no test suite configured.
```

Replace with:

```markdown
Unit tests: `tests/unit/` (Vitest). E2E tests: `tests/e2e/` (Playwright, Chromium). Both run automatically as part of `npm run build`.
```

**Step 3: Commit**

```bash
git add README.md CLAUDE.md
git commit -m "docs: document test suite in README and CLAUDE.md"
```

---

### Task 11: Final smoke check

**Step 1: Clean build from scratch**

```bash
rm -rf dist && npm run build
```

Expected: all tests pass, 22 pages built, no errors.

**Step 2: Confirm git log is clean**

```bash
git log --oneline -8
```

Expected: all commits from this plan are present and sequential.
