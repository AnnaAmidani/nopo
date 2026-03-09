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
