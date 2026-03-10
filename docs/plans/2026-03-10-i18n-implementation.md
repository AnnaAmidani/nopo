# i18n Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add bilingual (EN/IT) support with locale-prefixed URLs, browser-based auto-detection, a language switcher, and translated UI strings.

**Architecture:** Posts move to `src/content/blog/en/` and `src/content/blog/it/`. All page templates move under `src/pages/[lang]/` using `getStaticPaths()` to generate both locales. The root `index.astro` becomes a client-side locale-detection redirect. The Header derives the current lang from `Astro.url.pathname` and renders locale-aware nav links and an EN/IT toggle.

**Tech Stack:** Astro 6 i18n config, TypeScript, localStorage for preference persistence.

---

### Task 1: Create translations file

**Files:**
- Create: `src/i18n/translations.ts`

**Step 1: Create the file**

```ts
export const TRANSLATIONS = {
	en: {
		welcomeTo: 'Welcome to',
		recentPosts: 'Recent Posts',
		allPosts: 'All posts →',
		allPostsLabel: 'All Posts',
		noPosts: 'No posts yet — check back soon.',
		all: 'All',
		about: 'About',
		aboutDescription: 'About me',
		categories: {
			tech: 'Tech',
			investing: 'Investing',
			music: 'Music',
			films: 'Films',
			culture: 'Culture',
		},
	},
	it: {
		welcomeTo: 'Benvenuto su',
		recentPosts: 'Post recenti',
		allPosts: 'Tutti i post →',
		allPostsLabel: 'Tutti i post',
		noPosts: 'Nessun post ancora — torna presto.',
		all: 'Tutti',
		about: 'Chi sono',
		aboutDescription: 'Su di me',
		categories: {
			tech: 'Tech',
			investing: 'Investimenti',
			music: 'Musica',
			films: 'Film',
			culture: 'Cultura',
		},
	},
} as const;

export type Lang = keyof typeof TRANSLATIONS;
export const SUPPORTED_LANGS: Lang[] = ['en', 'it'];
export const t = (lang: Lang) => TRANSLATIONS[lang];
```

**Step 2: Run lint**
```bash
npm run lint
```
Expected: no errors

**Step 3: Commit**
```bash
git add src/i18n/translations.ts
git commit -m "Add i18n translations file"
```

---

### Task 2: Add i18n config to astro.config.mjs

**Files:**
- Modify: `astro.config.mjs`

**Step 1: Add i18n block**

Add `i18n` to the `defineConfig` call:

```js
const isCI = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
	site: 'https://annaamidani.github.io',
	base: isCI ? '/nopo' : '/',
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'it'],
		routing: {
			prefixDefaultLocale: true,
		},
	},
	integrations: [mdx(), sitemap()],
});
```

**Step 2: Run build to verify config is valid**
```bash
npm run build
```
Expected: successful build

**Step 3: Commit**
```bash
git add astro.config.mjs
git commit -m "Add Astro i18n config"
```

---

### Task 3: Move posts to locale subdirectory

**Files:**
- Move: `src/content/blog/*.md` → `src/content/blog/en/`
- Create: `src/content/blog/it/` (empty directory with a `.gitkeep`)

**Step 1: Move existing posts**
```bash
mkdir -p src/content/blog/en src/content/blog/it
mv src/content/blog/*.md src/content/blog/en/
mv src/content/blog/*.mdx src/content/blog/en/
touch src/content/blog/it/.gitkeep
```

**Step 2: Run build to verify posts are still found**
```bash
npm run build
```
Expected: same 13 pages built (post slugs now have `en/` prefix in ids, but build should still work)

**Step 3: Commit**
```bash
git add src/content/blog/
git commit -m "Move posts to src/content/blog/en/"
```

---

### Task 4: Create [lang]/index.astro

**Files:**
- Create: `src/pages/[lang]/index.astro`

**Step 1: Create the directory and file**
```bash
mkdir -p src/pages/\[lang\]/blog
```

Create `src/pages/[lang]/index.astro` with this content (keep the existing `<style>` block from `src/pages/index.astro` verbatim):

```astro
---
import { getCollection } from 'astro:content';
import FormattedDate from '../../components/FormattedDate.astro';
import { SITE_DESCRIPTION, SITE_TITLE } from '../../consts';
import { SUPPORTED_LANGS, t, type Lang } from '../../i18n/translations';
import PageLayout from '../../layouts/PageLayout.astro';

export function getStaticPaths() {
	return SUPPORTED_LANGS.map((lang) => ({ params: { lang } }));
}

const { lang } = Astro.params as { lang: Lang };
const tr = t(lang);

const posts = (await getCollection('blog'))
	.filter((p) => p.id.startsWith(lang + '/'))
	.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
	.slice(0, 5);

const cardAccents = ['var(--accent)', 'var(--accent-sage)', 'var(--accent-lavender)', 'var(--accent-peach)', 'var(--accent-lime)'];
---

<PageLayout title={SITE_TITLE} description={SITE_DESCRIPTION}>
	<main>
		<section class="hero">
			<p class="eyebrow">{tr.welcomeTo}</p>
			<h1>{SITE_TITLE}</h1>
			<p class="tagline">{SITE_DESCRIPTION}</p>
		</section>
		<section class="recent">
			<h2 class="section-label"><span>{tr.recentPosts}</span></h2>
			<ul>
				{posts.map((post, i) => {
					const slug = post.id.replace(lang + '/', '');
					return (
						<li>
							<a href={`/${lang}/blog/${slug}/`} style={`--card-accent: ${cardAccents[i % cardAccents.length]}`}>
								<div class="card-meta">
									<FormattedDate date={post.data.pubDate} />
									{post.data.category && (
										<a href={`/${lang}/${post.data.category}`} class="category-badge" onclick="event.stopPropagation()">
											{tr.categories[post.data.category as keyof typeof tr.categories]}
										</a>
									)}
								</div>
								<div class="card-title">{post.data.title}</div>
								{post.data.description && <div class="card-desc">{post.data.description}</div>}
							</a>
						</li>
					);
				})}
			</ul>
			<a href={`/${lang}/blog`} class="all-posts">{tr.allPosts}</a>
		</section>
	</main>
</PageLayout>

<!-- IMPORTANT: copy the full <style> block here from src/pages/index.astro unchanged -->
```

**Step 2: Build to verify**
```bash
npm run build
```
Expected: routes `/en/` and `/it/` now appear in the build output

**Step 3: Commit**
```bash
git add 'src/pages/[lang]/index.astro'
git commit -m "Add [lang]/index.astro"
```

---

### Task 5: Create [lang]/blog/index.astro

**Files:**
- Create: `src/pages/[lang]/blog/index.astro`

```astro
---
import { getCollection } from 'astro:content';
import FormattedDate from '../../../components/FormattedDate.astro';
import { SITE_DESCRIPTION, SITE_TITLE } from '../../../consts';
import { SUPPORTED_LANGS, t, type Lang } from '../../../i18n/translations';
import PageLayout from '../../../layouts/PageLayout.astro';

export function getStaticPaths() {
	return SUPPORTED_LANGS.map((lang) => ({ params: { lang } }));
}

const { lang } = Astro.params as { lang: Lang };
const tr = t(lang);

const posts = (await getCollection('blog'))
	.filter((p) => p.id.startsWith(lang + '/'))
	.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

const cardAccents = ['var(--accent)', 'var(--accent-sage)', 'var(--accent-lavender)', 'var(--accent-peach)', 'var(--accent-lime)'];
---

<PageLayout title={`${tr.allPostsLabel} — ${SITE_TITLE}`} description={SITE_DESCRIPTION}>
	<main>
		<h1>{tr.allPostsLabel}</h1>
		<ul>
			{posts.map((post, i) => {
				const slug = post.id.replace(lang + '/', '');
				return (
					<li>
						<a href={`/${lang}/blog/${slug}/`} style={`--card-accent: ${cardAccents[i % cardAccents.length]}`}>
							<div class="card-meta">
								<FormattedDate date={post.data.pubDate} />
								{post.data.category && (
									<a href={`/${lang}/${post.data.category}`} class="category-badge" onclick="event.stopPropagation()">
										{tr.categories[post.data.category as keyof typeof tr.categories]}
									</a>
								)}
							</div>
							<div class="card-title">{post.data.title}</div>
							{post.data.description && <div class="card-desc">{post.data.description}</div>}
						</a>
					</li>
				);
			})}
		</ul>
	</main>
</PageLayout>

<!-- IMPORTANT: copy the full <style> block from src/pages/blog/index.astro unchanged -->
```

**Step 2: Build and commit**
```bash
npm run build
git add 'src/pages/[lang]/blog/index.astro'
git commit -m "Add [lang]/blog/index.astro"
```

---

### Task 6: Create [lang]/blog/[...slug].astro

**Files:**
- Create: `src/pages/[lang]/blog/[...slug].astro`

```astro
---
import { type CollectionEntry, getCollection, render } from 'astro:content';
import BlogPost from '../../../layouts/BlogPost.astro';
import { SUPPORTED_LANGS, type Lang } from '../../../i18n/translations';

export async function getStaticPaths() {
	const posts = await getCollection('blog');
	return posts.flatMap((post) => {
		const [postLang, ...slugParts] = post.id.split('/');
		if (!SUPPORTED_LANGS.includes(postLang as Lang)) return [];
		return [{
			params: { lang: postLang, slug: slugParts.join('/') },
			props: post,
		}];
	});
}

type Props = CollectionEntry<'blog'>;
const post = Astro.props;
const { Content } = await render(post);
---

<BlogPost {...post.data}>
	<Content />
</BlogPost>
```

**Step 2: Build and commit**
```bash
npm run build
git add 'src/pages/[lang]/blog/[...slug].astro'
git commit -m "Add [lang]/blog/[...slug].astro"
```

---

### Task 7: Create [lang]/[category].astro

**Files:**
- Create: `src/pages/[lang]/[category].astro`

Note: when staging this file in git, quote the brackets: `git add 'src/pages/[lang]/[category].astro'`

```astro
---
import { getCollection } from 'astro:content';
import FormattedDate from '../../components/FormattedDate.astro';
import { CATEGORIES, SITE_TITLE } from '../../consts';
import { SUPPORTED_LANGS, t, type Lang } from '../../i18n/translations';
import PageLayout from '../../layouts/PageLayout.astro';

export function getStaticPaths() {
	return SUPPORTED_LANGS.flatMap((lang) =>
		CATEGORIES.map(({ slug }) => ({ params: { lang, category: slug } }))
	);
}

const { lang, category } = Astro.params as { lang: Lang; category: string };
const tr = t(lang);
const categoryLabel = tr.categories[category as keyof typeof tr.categories] ?? category;

const posts = (await getCollection('blog'))
	.filter((p) => p.id.startsWith(lang + '/') && p.data.category === category)
	.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

const cardAccents = ['var(--accent)', 'var(--accent-sage)', 'var(--accent-lavender)', 'var(--accent-peach)'];
---

<PageLayout title={`${categoryLabel} — ${SITE_TITLE}`} description={`Posts about ${categoryLabel}`}>
	<main>
		<h1>{categoryLabel}</h1>
		{posts.length === 0 ? (
			<p class="empty">{tr.noPosts}</p>
		) : (
			<ul>
				{posts.map((post, i) => {
					const slug = post.id.replace(lang + '/', '');
					return (
						<li>
							<a href={`/${lang}/blog/${slug}/`} style={`--card-accent: ${cardAccents[i % cardAccents.length]}`}>
								<div class="card-meta">
									<FormattedDate date={post.data.pubDate} />
								</div>
								<div class="card-title">{post.data.title}</div>
								{post.data.description && <div class="card-desc">{post.data.description}</div>}
							</a>
						</li>
					);
				})}
			</ul>
		)}
	</main>
</PageLayout>

<!-- IMPORTANT: copy the full <style> block from src/pages/[category].astro unchanged -->
```

**Step 2: Build and commit**
```bash
npm run build
git add 'src/pages/[lang]/[category].astro'
git commit -m "Add [lang]/[category].astro"
```

---

### Task 8: Create [lang]/about.astro

**Files:**
- Create: `src/pages/[lang]/about.astro`

```astro
---
import AboutHeroImage from '../../assets/blog-placeholder-about.jpg';
import BlogPost from '../../layouts/BlogPost.astro';
import { SUPPORTED_LANGS, t, type Lang } from '../../i18n/translations';

export function getStaticPaths() {
	return SUPPORTED_LANGS.map((lang) => ({ params: { lang } }));
}

const { lang } = Astro.params as { lang: Lang };
const tr = t(lang);
---

<BlogPost
	title={tr.about}
	description={tr.aboutDescription}
	pubDate={new Date('August 08 2021')}
	heroImage={AboutHeroImage}
>
	<!-- Copy the paragraph content from src/pages/about.astro here.
	     Replace with real content in each language when ready. -->
	<p>Lorem ipsum dolor sit amet...</p>
</BlogPost>
```

**Step 2: Build and commit**
```bash
npm run build
git add 'src/pages/[lang]/about.astro'
git commit -m "Add [lang]/about.astro"
```

---

### Task 9: Replace root index.astro with locale redirect

**Files:**
- Modify: `src/pages/index.astro` (full replacement)

Replace the entire file content with:

```astro
---
---
<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>Born in NoPo</title>
		<script>
			const stored = localStorage.getItem('lang');
			const lang =
				stored === 'it' ? 'it'
				: stored === 'en' ? 'en'
				: navigator.language.startsWith('it') ? 'it'
				: 'en';
			window.location.replace('/' + lang + '/');
		</script>
		<noscript>
			<meta http-equiv="refresh" content="0;url=/en/" />
		</noscript>
	</head>
	<body></body>
</html>
```

**Step 2: Build and commit**
```bash
npm run build
git add src/pages/index.astro
git commit -m "Replace root index with locale-detection redirect"
```

---

### Task 10: Delete old page files

The old top-level page files are now superseded by the `[lang]/` equivalents. Delete them to avoid route conflicts.

**Step 1: Delete old files**
```bash
rm -rf src/pages/blog
rm 'src/pages/[category].astro'
rm src/pages/about.astro
```

**Step 2: Build to verify no missing routes**
```bash
npm run build
```
Expected: clean build, same number of pages (now under `/en/` and `/it/` prefixes)

**Step 3: Run lint**
```bash
npm run lint
```
Expected: no errors

**Step 4: Commit**
```bash
git add -A
git commit -m "Remove old top-level page files superseded by [lang]/ routes"
```

---

### Task 11: Update Header with language switcher

**Files:**
- Modify: `src/components/Header.astro`

Replace the full file content:

```astro
---
import { CATEGORIES, SITE_TITLE } from '../consts';
import { t, type Lang } from '../i18n/translations';
import HeaderLink from './HeaderLink.astro';

const segments = Astro.url.pathname.split('/').filter(Boolean);
const lang: Lang = segments[0] === 'it' ? 'it' : 'en';
const altLang: Lang = lang === 'en' ? 'it' : 'en';
const altPath = Astro.url.pathname.replace(/^\/(en|it)/, '/' + altLang) || '/' + altLang + '/';
const tr = t(lang);
---

<header>
	<div class="banner">
		<div class="lang-switch">
			<a
				href={`/${lang}/`}
				class:list={['lang-btn', 'active']}
				onclick={`localStorage.setItem('lang','${lang}')`}
			>{lang.toUpperCase()}</a>
			<span class="lang-sep">/</span>
			<a
				href={altPath}
				class="lang-btn"
				onclick={`localStorage.setItem('lang','${altLang}')`}
			>{altLang.toUpperCase()}</a>
		</div>
		<a href={`/${lang}/`} class="site-title">{SITE_TITLE}</a>
	</div>
	<div class="sticky-bar">
		<div class="header-stripe"></div>
		<div class="category-bar">
			<div class="category-bar-inner">
				<HeaderLink href={`/${lang}/blog`}>{tr.all}</HeaderLink>
				{CATEGORIES.map(({ slug }) => (
					<HeaderLink href={`/${lang}/${slug}`}>
						{tr.categories[slug]}
					</HeaderLink>
				))}
				<div class="spacer"></div>
				<HeaderLink href={`/${lang}/about`}>{tr.about}</HeaderLink>
			</div>
		</div>
	</div>
</header>

<style>
	/* ── Banner (scrolls away) ─────────────────────────────── */
	.banner {
		min-height: 200px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		background-color: #005461;
		padding: 2rem 1rem 2.5rem;
	}
	.lang-switch {
		position: absolute;
		top: 1rem;
		right: 1.5rem;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
	.lang-btn {
		font-family: 'Outfit', system-ui, sans-serif;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.45);
		text-decoration: none;
		transition: color 0.15s;
	}
	.lang-btn:hover,
	.lang-btn.active {
		color: white;
		text-decoration: none;
	}
	.lang-sep {
		font-size: 0.7rem;
		color: rgba(255, 255, 255, 0.25);
	}
	.spacer {
		flex: 1;
	}
	.site-title {
		font-family: 'Outfit', system-ui, sans-serif;
		font-weight: 700;
		font-size: clamp(2.5rem, 6vw, 4rem);
		letter-spacing: -0.03em;
		color: white;
		text-decoration: none;
		transition: color 0.2s;
	}
	.site-title:hover {
		color: var(--accent);
		text-decoration: none;
	}

	/* ── Sticky bar (stays on scroll) ─────────────────────── */
	.sticky-bar {
		position: sticky;
		top: 0;
		z-index: 100;
		background: linear-gradient(to right, rgba(180, 230, 225, 0.95), rgba(237, 247, 189, 0.95));
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--border);
	}
	.header-stripe {
		height: 3px;
		background: linear-gradient(to right, var(--accent), var(--accent-lavender), var(--accent-sage), var(--accent-lime));
	}
	.category-bar-inner {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		width: min(1100px, calc(100% - 2rem));
		margin: 0 auto;
		height: 40px;
		overflow-x: auto;
		scrollbar-width: none;
	}
	.category-bar-inner::-webkit-scrollbar {
		display: none;
	}
	.category-bar :global(a) {
		font-size: 0.85rem;
		font-weight: 800;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: var(--text-muted);
		text-decoration: none;
		padding: 0.25rem 0.75rem;
		border-radius: 6px;
		border: 1px solid transparent;
		white-space: nowrap;
		transition: all 0.2s;
		flex-shrink: 0;
	}
	.category-bar :global(a:hover),
	.category-bar :global(a.active) {
		color: white;
		border-color: transparent;
		background: #0E8F8F;
		text-decoration: none;
	}
</style>
```

**Step 2: Build and lint**
```bash
npm run build && npm run lint
```
Expected: clean build, no lint errors

**Step 3: Commit**
```bash
git add src/components/Header.astro
git commit -m "Add EN/IT language switcher to header"
```

---

### Task 12: Final verification and push

**Step 1: Full build + lint**
```bash
npm run lint && npm run build
```
Expected: both pass cleanly

**Step 2: Verify locally**
```bash
npm run dev
```
- Visit `http://localhost:4321/` — should redirect to `/en/` or `/it/` based on browser locale
- Visit `http://localhost:4321/en/` — English home page
- Visit `http://localhost:4321/it/` — Italian home page
- Visit `http://localhost:4321/en/blog/first-post/` — blog post renders
- Check `EN / IT` toggle appears top-right of the banner
- Click `IT` — should navigate to `/it/` equivalent and save to localStorage

**Step 3: Push**
```bash
git push -u origin feature/i18n
```
