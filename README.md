# nopo

A personal blog built with [Astro 6](https://astro.build), supporting English and Italian content.

## Setup

**Prerequisites:** Node.js >= 22.12.0. Astro is installed as a local dependency — no global install needed.

```sh
npm install       # install all dependencies (including astro)
```

## Development

```sh
npm run dev       # start dev server at http://localhost:4321
npm run build     # build production site to ./dist/
npm run preview   # preview the production build locally
```

To run Astro CLI commands directly:

```sh
npx astro check   # type-check .astro files
npx astro add     # add integrations
```

## Linting

```sh
npm run lint      # ESLint with Astro + TypeScript rules
```

## Project Structure

```text
src/
  components/         # Astro components (Header, Footer, Sidebar, BaseHead…)
  content/blog/
    en/               # English posts (.md / .mdx)
    it/               # Italian posts (.md / .mdx)
  data/links.ts       # Sidebar link sections
  i18n/translations.ts # EN/IT strings + t(lang) helper
  layouts/            # BlogPost.astro, PageLayout.astro
  pages/
    [lang]/           # All routes are lang-prefixed (/en/, /it/)
  styles/global.css
  consts.ts           # SITE_TITLE, SITE_DESCRIPTION
astro.config.mjs      # site URL, base path, i18n config
```

## Deployment

The site deploys automatically to GitHub Pages (`https://annaamidani.github.io/nopo`) on push to `main` via `.github/workflows/deploy.yml`. The base path is `/nopo` in CI and `/` locally — this is handled automatically via the `GITHUB_ACTIONS` env var in `astro.config.mjs`.
