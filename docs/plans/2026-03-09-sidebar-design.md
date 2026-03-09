# Sidebar Design — Born in NoPo

**Date:** 2026-03-09

## Goal

Add a persistent right-side sidebar to every page for curated links and resources.

## Requirements

- Appears on all pages (home, blog index, category pages, individual posts, about)
- Contains grouped curated links managed via a single data file
- Desktop: right rail alongside main content
- Mobile: collapses below main content, each link group rendered as a card

## Data Layer

**`src/data/links.ts`** — single source of truth for sidebar content.

```ts
export const SIDEBAR_LINKS = [
  {
    section: 'Reading',
    links: [
      { label: 'Example', url: 'https://example.com', description: 'Optional note' },
    ],
  },
];
```

Only this file needs editing to add, remove, or reorder links.

## Components

### `src/components/Sidebar.astro`
- Reads `SIDEBAR_LINKS`
- Renders each group with an all-caps section label and a list of links
- Desktop: lightweight plain list with accent hover
- Mobile: each group becomes a card (white bg, rounded corners, soft shadow — matching existing post card style)
- Sticky on scroll (desktop)

### `src/layouts/PageLayout.astro`
- New shared layout replacing manual Header + Footer composition in each page
- Renders: `<Header />` → two-column grid (`<slot />` + `<Sidebar />`) → `<Footer />`
- All existing pages (index, blog/index, [category], about, BlogPost) adopt this layout

## Layout

```
Desktop (≥ 1024px):
┌─────────────────────────────────────┬────────────┐
│  main content  (1fr, ~820px)        │  Sidebar   │
│                                     │  (240px)   │
└─────────────────────────────────────┴────────────┘

Mobile (< 1024px):
┌──────────────────────────────────┐
│  main content                    │
├──────────────────────────────────┤
│  [Link Group Card]               │
│  [Link Group Card]               │
└──────────────────────────────────┘
```

- Overall container: ~1100px max-width
- Grid: `1fr 240px`, gap `3rem`
- Below 1024px: single column, sidebar below content

## Files Changed

| File | Action |
|------|--------|
| `src/data/links.ts` | Create |
| `src/components/Sidebar.astro` | Create |
| `src/layouts/PageLayout.astro` | Create |
| `src/styles/global.css` | Update container width |
| `src/pages/index.astro` | Adopt PageLayout |
| `src/pages/blog/index.astro` | Adopt PageLayout |
| `src/pages/[category].astro` | Adopt PageLayout |
| `src/pages/about.astro` | Adopt PageLayout |
| `src/layouts/BlogPost.astro` | Adopt PageLayout |
