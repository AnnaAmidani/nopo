# Test Suite Design

## Goal

Add a Vitest + Playwright test suite that runs as part of every build, locally and in CI.

## Tooling

- **Vitest** — unit tests (fast, no browser, Vite-native)
- **Playwright** — E2E tests (real browser, against built static output)

## Test Structure

```
tests/
  unit/
    i18n.test.ts      # all translation keys present in both langs
    consts.test.ts    # SITE_TITLE and SITE_DESCRIPTION are non-empty strings
  e2e/
    home.spec.ts      # home page renders, title visible, lang switcher works
    blog.spec.ts      # blog index lists posts, individual post renders
    nav.spec.ts       # nav links resolve without 404
```

## Build Integration

```
test:unit   →  vitest run
test:e2e    →  playwright test
build       →  npm run test:unit && astro build && npm run test:e2e
```

Unit tests run first for fast feedback. Site is built next. Playwright tests the real static output last. CI picks this up automatically since `deploy.yml` calls `npm run build`.

## Playwright Configuration

- Uses `webServer` to auto-start `astro preview` against `dist/` before E2E tests
- `baseURL` set to `http://localhost:4321/nopo` in CI (`GITHUB_ACTIONS=true`), `http://localhost:4321` locally — mirrors `astro.config.mjs` base path logic

## Test Cases

### Vitest unit tests

| File | Assertions |
|---|---|
| `i18n.test.ts` | Every key in `TRANSLATIONS.en` exists in `TRANSLATIONS.it` and vice versa |
| `consts.test.ts` | `SITE_TITLE` and `SITE_DESCRIPTION` are defined, non-empty strings |

The i18n test will catch translation drift as new UI strings are added (e.g. upcoming interactive components need both `en` and `it` entries).

### Playwright E2E tests

| File | Assertions |
|---|---|
| `home.spec.ts` | `/en/` loads, `SITE_TITLE` visible in `<h1>`; `/it/` loads with Italian content |
| `blog.spec.ts` | `/en/blog/` lists at least one post; a post detail page renders title and content |
| `nav.spec.ts` | All header nav links return HTTP 200; lang switcher navigates between `/en/` and `/it/` |

## Out of Scope (for now)

- Screenshot / visual regression tests
- RSS and sitemap validation
- Interactive component tests (added when Comments, Share, Subscribe, Buy me a coffee components are built)
