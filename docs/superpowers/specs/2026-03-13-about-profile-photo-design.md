# About Page — Profile Photo

**Date:** 2026-03-13
**Branch:** content/bio

## Summary

Add a profile photo to the About page, floated left with text wrapping around it.
The photo renders on both EN (`/en/about`) and IT (`/it/about`) routes — no translation changes needed.

## Changes

### `src/pages/[lang]/about.astro`

1. Remove the existing `import AboutHeroImage from '../../assets/blog-placeholder-about.jpg'` — it was only passed as `heroImage` to `<BlogPost>`, which destructures only `title, description, pubDate, updatedDate` and never reads or renders `heroImage`. Remove the `heroImage` prop from the `<BlogPost>` call too.
2. Add `import { Image } from 'astro:assets'` and `import profilePhoto from '../../assets/Toronto-last-supper-7-cut.png'`.
3. Inside the `<BlogPost>` slot, render `<Image>` before the paragraph loop.
4. Add a scoped `<style>` block for layout.

## Markup

```astro
<Image src={profilePhoto} alt="Photo of Anna Amidani" class="profile-photo" />
{tr.aboutContent.map((para) => <p>{para}</p>)}
```

## Style

```css
.profile-photo {
  float: left;
  width: 160px;
  height: 190px;
  object-fit: cover;
  object-position: center top;
  border-radius: 10px;
  border: 2px solid #d4a060; /* warm gold — matches the site-title gradient end in Header.astro; intentional one-off, not in CSS variables */
  margin: 0 1.5rem 1rem 0;
}
@media (max-width: 480px) {
  .profile-photo {
    float: none;
    display: block;
    margin: 0 auto 1.5rem;
  }
}
```

## Out of Scope

- No changes to `BlogPost.astro` or any other layout/component
- No changes to translations
