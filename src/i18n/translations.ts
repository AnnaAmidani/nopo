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
			'I come from a small industrial and agricultural town in the Po Valley, north of the River Po, where I spent the first 18 years of my life. ',
			'After a brief chapter of one year in Parma, I moved to another wonderful city, Verona - just an hour\'s drive further east - where I spent the following 11 years, living with my closest friends, completing my university studies, and beginning my professional career as a software developer.',
			'First, at a small but excellent company, working on customisations of Open Source solutions in an Agile environment and using development practices such as XP and TDD. Then, for the next 7 years, I worked in IT at a major Italian Banking Group: crossing departments, shifting projects, and growing steadily across an international, enterprise-scale environment.'			'The history and character of my home region are part of my cultural and personal makeup at various levels - conscious and unconscious - rediscovered, appreciated, and better understood after embarking on what has now become a decade-long international journey, which has taken me, through various changes of companies and roles, to Ireland, Great Britain, and Canada. ',
			'This blog is called Born in NoPo, or Born North of the Po River, to remind me of my roots throughout all this wandering 😀 ',
			'It is a collection of facts, thoughts, analyses, curiosities, and opinions gathered over all these years that I would like to share - ranging across my various interests, from Tech to investing, music and films, to the inevitable food-related matters… always a deeply felt topic, rightly or wrongly, among us gentes italicae. ',
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
			'Sono originaria di un piccolo paese industriale e agricolo in Pianura Padana, a Nord del fiume Po, dove ho trascorso i primi 18 anni della mia vita. ',
			'Dopo un breve capitolo di un anno a Parma, mi sono trasferita in un\'altra città meravigliosa, Verona,  solo un\'ora di auto più a Est, dove ho trascorsi i successivi 11 anni, vissuto con i miei amici più cari, completato gli studi universitari e iniziato la mia carriera professionale come sviluppatrice  software. ',
			'Prima, in una piccola azienda d\'eccellenza, facendomi le ossa su customizzazioni di soluzioni Open Source in un contesto Agile ed utilizzando pratiche di sviluppo come XP e TDD. In seguito, e per i successivi 7 anni, nel settore IT di un grande gruppo bancario italiano, in un contesto internazionale e enterprise, cambiando dipartimenti e progetti in continua evoluzione professionale. ',
			'La storia e caratteristiche dei miei territori d\'origine fanno parte del mio bagaglio culturale e personale a vari livelli, consci e inconsci - riscoperti, apprezzati e compresi meglio dopo aver intrapreso un percorso internazionale decennale ormai, che mi ha portata, attraverso vari cambi di aziende e lavori, in Irlanda, Gran Bretagna, e Canada. ',
			'Questo blog si chiama Born in NoPo, o born North of the Po River, per ricordarmi le miei origini in tutto questo vagabondare 😀',
			'E\' una raccolta di fatti, pensieri, analisi, curiosità e opinioni che ho raccolto nel corso di tutti questi anni e vorrei condividere, e spazia tra i miei vari interessi, dal Tech agli investimenti, alla musica e ai film, alle immancabili questioni di cibo… sempre molto sentite, a torto o a ragione, da noi gentes italicae.',
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
