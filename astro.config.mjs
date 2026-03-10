// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const isCI = process.env.GITHUB_ACTIONS === 'true';

// https://astro.build/config
export default defineConfig({
	site: 'https://annaamidani.github.io',
	base: isCI ? '/nopo' : '/',
	integrations: [mdx(), sitemap()],
});
