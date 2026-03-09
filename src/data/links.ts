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
		section: 'References',
		links: [
			{ label: 'MDN Web Docs', url: 'https://developer.mozilla.org', description: 'The go-to reference for web standards' },
			{ label: 'Astro Docs', url: 'https://docs.astro.build', description: 'Official Astro documentation' },
			{ label: 'CSS Tricks', url: 'https://css-tricks.com', description: 'Practical CSS guides and techniques' },
		],
	},
	{
		section: 'Bio',
		links: [
			{ label: 'About me', url: '/about', description: 'Who I am and what I write about' },
			{ label: 'GitHub', url: 'https://github.com', description: 'My open-source projects' },
			{ label: 'RSS Feed', url: '/rss.xml', description: 'Subscribe to new posts' },
		],
	},
	{
		section: 'Donate',
		links: [
			{ label: 'Buy me a coffee', url: 'https://buymeacoffee.com', description: 'Support my writing' },
			{ label: 'Ko-fi', url: 'https://ko-fi.com', description: 'One-time or monthly support' },
		],
	},
];
