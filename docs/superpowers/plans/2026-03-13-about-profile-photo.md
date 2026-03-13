# About Page Profile Photo Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a profile photo (Toronto-last-supper-7-cut.png) to the About page, floated left with text wrapping around it.

**Architecture:** Edit `src/pages/[lang]/about.astro` only — import Astro's `<Image>` component and the photo asset, render the image before the paragraph loop, add scoped CSS for float layout with a mobile fallback. Remove the now-unused `blog-placeholder-about.jpg` import and `heroImage` prop.

**Tech Stack:** Astro 6, `astro:assets` Image component, scoped CSS, Playwright E2E tests.

---

## Chunk 1: Implement and test

### Task 1: Add profile photo to About page

**Files:**
- Modify: `src/pages/[lang]/about.astro`
- Modify: `tests/e2e/nav.spec.ts` (add photo assertion to existing about page test)

- [ ] **Step 1: Write the failing E2E test**

Add a new assertion to the existing `'about page loads'` test in `tests/e2e/nav.spec.ts`:

```typescript
test('about page loads', async ({ page }) => {
  await page.goto('en/about/');
  await expect(page).toHaveURL(/\/en\/about/);
  await expect(page.getByRole('heading', { name: 'About', level: 1 })).toBeVisible();
  const photo = page.locator('img[alt="Photo of Anna Amidani"]');
  await expect(photo).toBeVisible();
});
```

- [ ] **Step 2: Build and run the test to verify it fails**

```bash
npm run build
```

Expected: E2E test `'about page loads'` fails with element not found for `img[alt="Photo of Anna Amidani"]`.

- [ ] **Step 3: Update `src/pages/[lang]/about.astro`**

Replace the entire file with:

```astro
---
import { Image } from 'astro:assets';
import profilePhoto from '../../assets/Toronto-last-supper-7-cut.png';
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
>
	<Image src={profilePhoto} alt="Photo of Anna Amidani" class="profile-photo" />
	{tr.aboutContent.map((para) => <p>{para}</p>)}
</BlogPost>

<style>
	.profile-photo {
		float: left;
		width: 160px;
		height: 190px;
		object-fit: cover;
		object-position: center top;
		border-radius: 10px;
		border: 2px solid #d4a060; /* warm gold — matches site-title gradient end in Header.astro */
		margin: 0 1.5rem 1rem 0;
	}
	@media (max-width: 480px) {
		.profile-photo {
			float: none;
			display: block;
			margin: 0 auto 1.5rem;
		}
	}
</style>
```

- [ ] **Step 4: Build and run tests to verify they pass**

```bash
npm run build
```

Expected: all tests pass, including `'about page loads'`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/\[lang\]/about.astro tests/e2e/nav.spec.ts src/assets/Toronto-last-supper-7-cut.png docs/superpowers/specs/2026-03-13-about-profile-photo-design.md docs/superpowers/plans/2026-03-13-about-profile-photo.md
git commit -m "feat: add profile photo to About page, float left"
```
