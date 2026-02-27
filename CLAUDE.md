# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm install          # Install dependencies
npm run dev          # Start dev server at localhost:4321
npm run build        # Build production site to ./dist/
npm run preview      # Preview production build locally
npm run lint         # Lint with ESLint (Astro + TypeScript rules)
npm run astro check  # Type-check .astro files
```

There is no test suite configured.

## Architecture

This is an **Astro 6 blog** using the Content Collections API with MDX and sitemap integrations.

**Content layer:** Blog posts live in `src/content/blog/` as `.md` or `.mdx` files. The schema (title, description, pubDate, updatedDate, heroImage) is defined in `src/content.config.ts`. Use `getCollection('blog')` to query posts at build time.

**Routing:** `src/pages/` maps directly to URL routes. `src/pages/blog/[...slug].astro` is the dynamic route that renders individual posts using the `BlogPost` layout.

**Layout:** `src/layouts/BlogPost.astro` is the only layout, used for all blog posts. It composes `Header`, `Footer`, `BaseHead`, and `FormattedDate` components.

**Shared head:** `src/components/BaseHead.astro` is included on every page — it imports `global.css`, sets all SEO/OG/Twitter meta tags, and preloads fonts.

**Styling:** `src/styles/global.css` defines CSS custom properties (`--accent`, `--text`, `--text-muted`, `--bg`, `--bg-subtle`, `--border`, `--max-width`) with automatic dark mode via `prefers-color-scheme`. Component-scoped styles are written inline in each `.astro` file.

**Site constants:** `src/consts.ts` exports `SITE_TITLE` and `SITE_DESCRIPTION` — update these to customize the site identity. The canonical site URL is set in `astro.config.mjs`.
