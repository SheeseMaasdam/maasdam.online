// Language translations
export const translations = {
	en: {
		home: 'Home',
		blog: 'Blog',
		community: 'About',
		serverTitle: 'Our Servers',
		minecraftName: 'Minecraft Server',
		minecraftDesc: 'Survival mode with custom plugins',
		rimworldName: 'Rimworld Server',
		rimworldDesc: 'Multiplayer storytelling & survival',
		latestNews: 'Latest News',
		checkBlog: 'Check out our blog for the latest server updates, patch notes, and community events!',
		joinCommunity: 'Join Community',
		joinDiscord: 'Join us on Discord for live chat, events, and community discussions.',
		copyIp: 'Copy IP',
		gameFiles: 'All game files are available in our Discord!',
		contact: 'Contact',
		noCookies: 'We do not use cookies. (Probably...)',
		wip: 'The site and the entire project is under development.',
		wipTitle: 'Warning',
	},
	ru: {
		home: 'Главная',
		blog: 'Блог',
		community: 'О нас',
		serverTitle: 'Наши серверы',
		minecraftName: 'Сервер Minecraft',
		minecraftDesc: 'Режим выживания с пользовательскими плагинами',
		rimworldName: 'Сервер Rimworld',
		rimworldDesc: 'Многопользовательское повествование и выживание',
		latestNews: 'Последние новости',
		checkBlog: 'Посетите наш блог для последних обновлений сервера, заметок о патчах и событий сообщества!',
		joinCommunity: 'Присоединиться',
		joinDiscord: 'Присоединитесь к нам в Discord для прямого чата, событий и обсуждений сообщества.',
		copyIp: 'Копировать IP',
		gameFiles: 'Все файлы для игры находятся в нашем Discord!',
		contact: 'Контакты',
		noCookies: 'Мы не используем cookies. (Вроде бы...)',
		wip: 'Сайт и весь проект находится в разработке.',
		wipTitle: 'Предупреждение',
	}
};

export type Language = 'en' | 'ru';
export type TranslationKey = keyof typeof translations.en;

export function getTranslation(lang: Language, key: TranslationKey): string {
	return translations[lang][key] || translations.en[key];
}
