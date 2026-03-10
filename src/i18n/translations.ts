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
