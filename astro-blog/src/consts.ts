// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'maasdam.online';
export const SITE_DESCRIPTION = 'Minecraft & Rimworld Gaming Community - mc.maasdam.online | rim.maasdam.online';

export const DISCORD_URL = 'https://discord.gg/FZrCXCAJts';
export const CONTACT_EMAIL = 'maasdam_business@internet.ru';

const mineIcon = '⛏️';
const rimIcon = '🌍';

// Server Info
export const SERVERS = {
	minecraft: {
		name: 'Minecraft Server',
		nameRu: 'Сервер Minecraft',
		ip: 'mc.maasdam.online',
		port: 30002,
		description: 'Survival mode with custom plugins. Game files available in our Discord!',
		descRu: 'Режим выживания с пользовательскими плагинами. Все файлы для игры — в нашем Discord!',
		icon: mineIcon
	},
	rimworld: {
		name: 'Rimworld Server',
		nameRu: 'Сервер Rimworld',
		ip: 'rim.maasdam.online',
		port: 30010,
		description: 'Multiplayer storytelling & survival. Game files available in our Discord!',
		descRu: 'Многопользовательское повествование и выживание. Все файлы для игры — в нашем Discord!',
		icon: rimIcon
	}
};
