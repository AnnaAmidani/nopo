# Sidebar Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a persistent right-side sidebar with curated links to every page via a shared `PageLayout` component and a central data file.

**Architecture:** A new `PageLayout.astro` wraps all pages in a CSS Grid (`1fr 240px`). A `Sidebar.astro` component reads from `src/data/links.ts`. The three standalone page templates (index, blog/index, [category]) are migrated to `PageLayout`; `BlogPost.astro` (which also backs `about.astro`) is migrated too. `global.css` loses the centering on `main` since the grid now handles it.

**Tech Stack:** Astro 6, CSS Grid, TypeScript

---

### Task 1: Create link data file

**Files:**
- Create: `src/data/links.ts`

**Step 1: Create the file with this exact content**

```ts
export interface SidebarLink {
	label: string;
	url: string;
	description?: string;
}

export interface SidebarSection {
	section: string;
	links: SidebarLink[];
}

export const SIDEBAR_LINKS: SidebarSection[] = [
	{
		section: 'Bookmarks',
		links: [
			{ label: 'Example', url: 'https://example.com', description: 'A site worth reading' },
		],
	},
];
```

**Step 2: Run lint**
```bash
npm run lint
```
Expected: no errors

**Step 3: Commit**
```bash
git add src/data/links.ts
git commit -m "Add sidebar link data file"
```

---

### Task 2: Create Sidebar component

**Files:**
- Create: `src/components/Sidebar.astro`

**Step 1: Create the file**

```astro
---
import { SIDEBAR_LINKS } from '../data/links';
---

<aside class="sidebar">
	{SIDEBAR_LINKS.map(({ section, links }) => (
		<div class="sidebar-group">
			<p class="sidebar-label">{section}</p>
			<ul>
				{links.map(({ label, url, description }) => (
					<li>
						<a href={url} target="_blank" rel="noopener noreferrer">
							{label}
						</a>
						{description && <span class="link-desc">{description}</span>}
					</li>
				))}
			</ul>
		</div>
	))}
</aside>

<style>
	.sidebar {
		position: sticky;
		top: 4rem; /* clears the sticky category bar height */
		align-self: start;
		padding-top: 3rem;
	}
	.sidebar-group {
		margin-bottom: 2rem;
	}
	.sidebar-label {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin: 0 0 0.6rem;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	a {
		font-size: 0.9rem;
		color: var(--text);
		text-decoration: none;
		transition: color 0.15s;
		display: block;
	}
	a:hover {
		color: var(--accent);
		text-decoration: none;
	}
	.link-desc {
		display: block;
		font-size: 0.78rem;
		color: var(--text-muted);
		line-height: 1.4;
		margin-top: 0.1rem;
	}

	/* Mobile: card style per group */
	@media (max-width: 1024px) {
		.sidebar {
			position: static;
			padding-top: 0;
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
			gap: 1rem;
		}
		.sidebar-group {
			margin-bottom: 0;
			background: var(--bg-card);
			border: 1px solid var(--border);
			border-radius: var(--radius);
			box-shadow: var(--shadow);
			padding: 1.25rem 1.5rem;
		}
	}
</style>
```

**Step 2: Run lint**
```bash
npm run lint
```
Expected: no errors

**Step 3: Commit**
```bash
git add src/components/Sidebar.astro
git commit -m "Add Sidebar component"
```

---

### Task 3: Create PageLayout and update global.css

**Files:**
- Create: `src/layouts/PageLayout.astro`
- Modify: `src/styles/global.css`

**Step 1: Create `src/layouts/PageLayout.astro`**

```astro
---
import type { ImageMetadata } from 'astro';
import BaseHead from '../components/BaseHead.astro';
import Footer from '../components/Footer.astro';
import Header from '../components/Header.astro';
import Sidebar from '../components/Sidebar.astro';

interface Props {
	title: string;
	description: string;
	image?: ImageMetadata;
}

const { title, description, image } = Astro.props;
---

<!doctype html>
<html lang="en">
	<head>
		<BaseHead title={title} description={description} image={image} />
	</head>
	<body>
		<Header />
		<div class="page-grid">
			<slot />
			<Sidebar />
		</div>
		<Footer />
	</body>
</html>

<style>
	.page-grid {
		display: grid;
		grid-template-columns: 1fr 240px;
		gap: 3rem;
		width: min(1100px, calc(100% - 2rem));
		margin: 0 auto;
	}
	@media (max-width: 1024px) {
		.page-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
	}
</style>
```

**Step 2: Update `src/styles/global.css` — change the `main` block**

Find:
```css
main {
	width: var(--max-width);
	max-width: calc(100% - 2rem);
	margin: 0 auto;
	padding: 3rem 0 5rem;
}
```

Replace with:
```css
main {
	width: 100%;
	min-width: 0; /* prevents grid blowout on narrow viewports */
	padding: 3rem 0 5rem;
}
```

**Step 3: Run lint**
```bash
npm run lint
```
Expected: no errors

**Step 4: Commit**
```bash
git add src/layouts/PageLayout.astro src/styles/global.css
git commit -m "Add PageLayout with two-column grid"
```

---

### Task 4: Migrate src/pages/index.astro

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Replace imports**

Remove these imports from the frontmatter:
```ts
import BaseHead from '../components/BaseHead.astro';
import Footer from '../components/Footer.astro';
import Header from '../components/Header.astro';
```

Add:
```ts
import PageLayout from '../layouts/PageLayout.astro';
```

**Step 2: Replace the page shell**

Replace:
```astro
<!doctype html>
<html lang="en">
	<head>
		<BaseHead title={SITE_TITLE} description={SITE_DESCRIPTION} />
	</head>
	<body>
		<Header />
		<main>
			...content...
		</main>
		<Footer />
	</body>
</html>
```

With:
```astro
<PageLayout title={SITE_TITLE} description={SITE_DESCRIPTION}>
	<main>
		...content... (unchanged)
	</main>
</PageLayout>
```

**Step 3: Build to verify**
```bash
npm run build
```
Expected: successful build, no errors

**Step 4: Commit**
```bash
git add src/pages/index.astro
git commit -m "Migrate home page to PageLayout"
```

---

### Task 5: Migrate src/pages/blog/index.astro

**Files:**
- Modify: `src/pages/blog/index.astro`

Same pattern as Task 4. The import paths use `../../` — adjust accordingly:
- Remove: `BaseHead`, `Footer`, `Header` imports
- Add: `import PageLayout from '../../layouts/PageLayout.astro';`
- Wrap with: `<PageLayout title={...} description={...}>...</PageLayout>`

The title passed is `` `Blog — ${SITE_TITLE}` `` and description is `SITE_DESCRIPTION`.

**Step 2: Build and commit**
```bash
npm run build
git add src/pages/blog/index.astro
git commit -m "Migrate blog index to PageLayout"
```

---

### Task 6: Migrate src/pages/[category].astro

**Files:**
- Modify: `src/pages/[category].astro`

Same pattern. Note: when staging this file in git, quote the brackets:
```bash
git add 'src/pages/[category].astro'
```

The title passed is `` `${categoryMeta.label} — ${SITE_TITLE}` `` and description is `` `Posts about ${categoryMeta.label}` ``.

**Step 2: Build and commit**
```bash
npm run build
git add 'src/pages/[category].astro'
git commit -m "Migrate category page to PageLayout"
```

---

### Task 7: Migrate src/layouts/BlogPost.astro

**Files:**
- Modify: `src/layouts/BlogPost.astro`

This layout is used by all blog posts **and** `src/pages/about.astro` — migrating it covers both automatically.

**Step 1: Replace imports**

Remove:
```ts
import BaseHead from '../components/BaseHead.astro';
import Footer from '../components/Footer.astro';
import Header from '../components/Header.astro';
```

Add:
```ts
import PageLayout from './PageLayout.astro';
```

**Step 2: Replace the page shell**

Replace the outer `<html>…</html>` with `PageLayout`, keeping all the inner article markup unchanged:

```astro
<PageLayout title={title} description={description}>
	<main>
		<article>
			<header class="post-header">
				...unchanged...
			</header>
			<div class="prose">
				<slot />
			</div>
		</article>
	</main>
</PageLayout>
```

Keep all `<style>` blocks exactly as they are.

**Step 3: Build and lint**
```bash
npm run build && npm run lint
```
Expected: clean build, no lint errors

**Step 4: Commit**
```bash
git add src/layouts/BlogPost.astro
git commit -m "Migrate BlogPost layout to PageLayout"
```

---

### Task 8: Final verification and push

**Step 1: Full build + lint**
```bash
npm run lint && npm run build
```
Expected: both pass cleanly

**Step 2: Push**
```bash
git push
```
