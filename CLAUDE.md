# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## General Rules

- Always run commands from the project directory (`/Users/annaamidani/Projects/apps/nopo`). If unsure, run `pwd` first.
- When installing dev tools, use user-local installations only. Never use `sudo` for package manager installs.
- When making styling changes (colors, fonts, layout), confirm choices with the user before applying broadly.

## Setup

Node.js >= 22.12.0 is required. Astro is a local dependency — no global install needed.

```sh
npm install   # installs all dependencies including astro
```

`astro` is not on PATH directly; use `npm run <script>` or `npx astro <cmd>`.

## Commands

```sh
npm run dev          # Start dev server at localhost:4321
npm run build        # Build production site to ./dist/
npm run preview      # Preview production build locally
npm run lint         # Lint with ESLint (Astro + TypeScript rules)
npx astro check      # Type-check .astro files
```

There is no test suite configured.

## Architecture

This is an **Astro 6 blog** using the Content Collections API with MDX and sitemap integrations, deployed to GitHub Pages at `https://annaamidani.github.io/nopo`.

### i18n

The site supports **English (`en`) and Italian (`it`)** via Astro's built-in i18n routing with `prefixDefaultLocale: true`. All routes are prefixed: `/en/`, `/it/`. The root `/` redirects to `/en/`. `SUPPORTED_LANGS` and the `t(lang)` helper live in `src/i18n/translations.ts`.

### Content Layer

Blog posts live in `src/content/blog/{lang}/` (e.g. `src/content/blog/en/my-post.md`). The collection loader globs `**/*.{md,mdx}` from `src/content/blog/`. The slug's leading `{lang}/` segment is stripped when building URLs. Frontmatter schema (defined in `src/content.config.ts`) requires `title`, `description`, `pubDate`; optional fields: `updatedDate`, `heroImage`, `category`. Valid categories: `tech`, `investing`, `music`, `films`, `culture`.

### Routing

All lang-scoped pages are under `src/pages/[lang]/`:
- `index.astro` — home, shows 5 most recent posts for the selected lang
- `about.astro` — about page
- `blog/index.astro` — full post list
- `blog/[...slug].astro` — individual post (slug excludes lang prefix)
- `[category].astro` — category filter page

### Layouts & Components

- `PageLayout.astro` — wraps most pages; composes `Header`, `Sidebar`, `Footer`, `BaseHead`
- `BlogPost.astro` — used only for individual post rendering; also composes above components
- `Sidebar.astro` — link sections defined in `src/data/links.ts` (`SIDEBAR_LINKS`)
- `BaseHead.astro` — SEO/OG tags + font preloads; included on every page via layouts

### Styling

`src/styles/global.css` defines CSS custom properties: `--accent`, `--accent-sage`, `--accent-lavender`, `--accent-peach`, `--accent-lime`, `--text`, `--text-muted`, `--bg`, `--bg-card`, `--bg-subtle`, `--border`, `--shadow`, `--shadow-hover`, `--radius`, `--max-width`. Dark mode is automatic via `prefers-color-scheme`. Component styles are scoped inline in each `.astro` file.

### Site Constants

`src/consts.ts` exports `SITE_TITLE` and `SITE_DESCRIPTION`. The canonical URL and base path are set in `astro.config.mjs`. In CI (`GITHUB_ACTIONS=true`) the base is `/nopo`; locally it's `/`.

### Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages on push to `main`. The `GITHUB_ACTIONS` env var toggles the base URL.
