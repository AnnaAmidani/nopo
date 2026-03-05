// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Born in NoPo';
export const SITE_DESCRIPTION = 'Welcome to my website!';

export const CATEGORIES = [
	{ slug: 'tech', label: 'Tech' },
	{ slug: 'investing', label: 'Investing' },
	{ slug: 'music', label: 'Music' },
	{ slug: 'films', label: 'Films' },
	{ slug: 'culture', label: 'Culture & Fun Facts' },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];
