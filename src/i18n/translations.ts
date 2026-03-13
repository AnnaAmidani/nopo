export const TRANSLATIONS = {
	en: {
		welcomeTo: 'Welcome to',
		recentPosts: 'Recent Posts',
		allPosts: 'All posts →',
		allPostsLabel: 'All Posts',
		noPosts: 'No posts yet - check back soon.',
		all: 'All',
		about: 'About',
		aboutDescription: 'About me',
		aboutContent: [
			'I come from a small industrial and agricultural town in the Po Valley, where I\'ve lived for the first 19 years of my life. The following ten years, I spent in a wonderful city, Verona, just an hour\'s drive further east, where I lived with my closest friends, completed my university studies, and began my professional career as a software developer in the IT department of a large banking group.',
			'The history and character of these territories are part of my cultural and personal background at various levels, conscious and unconscious - rediscovered, appreciated and better understood after embarking on what is now a decade-long international journey, which has taken me, through various job and company changes, to Ireland, Great Britain, and Canada.',
			'This blog is called Born in NoPo, born North of the Po\' River, to remind me of my roots throughout all this wandering 😀',
			'It\'s a collection of facts, thoughts, analyses, curiosities and opinions I\'ve gathered over all these years, and it ranges across my various interests - from tech to investing, music and film, to the inevitable food-related matters… always a deeply felt topic, rightly or wrongly, among us gentes italicae.',
			'Bon voyage!'
		],
		categories: {
			tech: 'Tech',
			investing: 'Investing',
			music: 'Music',
			films: 'Films',
			culture: 'Culture',
			food: 'Food',
		},
	},
	it: {
		welcomeTo: 'Benvenuto su',
		recentPosts: 'Post recenti',
		allPosts: 'Tutti i post →',
		allPostsLabel: 'Tutti i post',
		noPosts: 'Nessun post ancora - torna presto.',
		all: 'Tutti',
		about: 'Chi sono',
		aboutDescription: 'Su di me',
		aboutContent: [
			'Sono originaria di un piccolo paese industriale e agricolo in Pianura Padana, a Nord del fiume Po’, dove ho trascorso i primi 19 anni della mia vita. I successivi dieci anni li ho passati in una città meravigliosa, Verona, solo un’ora di auto più a Est, dove ho vissuto con i miei amici piu cari, completato gli studi universitari e iniziato la mia carriera professionale come sviluppatore software nel settore IT di un grande gruppo bancario.',
			'La storia e caratteristiche di questi territori fanno parte del mio bagaglio culturale e personale a vari livelli, consci e inconsci - riscoperti, apprezzati e compresi meglio dopo aver intrapreso un percorso internazionale decennale ormai, che mi ha portata, attraverso vari cambi di aziende e lavori, in Irlanda, Gran Bretagna, e Canada.',
			'Questo blog si chiama Born in NoPo, born North of the Po’ River, per ricordarmi le miei origini in tutto questo vagabondare 😀',
			'E’ una raccolta di fatti, pensieri, analisi, curiosità e opinioni che ho raccolto nel corso di tutti questi anni, e spazia tra i miei vari interessi, dal Tech agli investimenti, alla musica e ai film, alle immancabili questioni di cibo… sempre molto sentite, a torto o a ragione, da noi gentes italicae.',
			'Buon viaggio!'
		],
		categories: {
			tech: 'Tech',
			investing: 'Investimenti',
			music: 'Musica',
			films: 'Film',
			culture: 'Cultura',
			food: 'Cibo',
		},
	},
} as const;

export type Lang = keyof typeof TRANSLATIONS;
export const SUPPORTED_LANGS: Lang[] = ['en', 'it'];
export const t = (lang: Lang) => TRANSLATIONS[lang];
