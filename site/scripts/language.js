// ======================================================================
// ПЕРЕВОДЫ (RU / EN)
// Ключи совпадают со значениями атрибутов data-t в разметке.
// При смене языка скрипт проходит по всем [data-t] и подставляет сюда текст
// ======================================================================
const T = {
	// ---------- Русский ----------
	ru: {
		// кнопка «Пуск»
		start: "Пуск",
		// подписи ярлыков: «Обо мне» и «Контакты»
		iAbout: "Обо мне",
		iMail: "Контакты",
		iFolder: "Новая папка",
		// заголовок окна «Обо мне»
		tAbout: "Обо мне.txt — Блокнот",
		// описание проекта в окне «Обо мне»
		aboutTxt:
			"Это небольшой проект от Владимира «Сыра» Маасдама и разраба-самоучки," +
			" по совместительству его лучшего друга, Евгения (Дасти)." +
			"\n" +
			" Здесь берут начало несколько игровых проектов, под руководством абсолютнейших дилетантов, любящих угарать." +
			"\n" +
			" Присоединяйтесь к нашему серверу Discord и следите за новостями!",
		// примечание про cookies
		cookies: "Мы не используем cookies. (Вроде бы...)",
		// окно Minecraft: описание, подписи полей адреса
		mcDesc: "Режим выживания с пользовательскими плагинами.",
		mcDesc2: "Давай, вошли и вышли. Приключение на 20 минут.",
		addr: "Адрес сервера:",
		addrP: "Адрес с портом:",
		// кнопка копирования и текст на ней после копирования
		copy: "Копировать",
		copied: "✓ Скопировано!",
		// жёлтая подсказка про файлы в Discord
		files: "Все файлы для игры находятся в нашем Discord!",
		// кнопка «Открыть Discord»
		openDc: "Открыть Discord",
		// окно Discord: описание
		dcTxt: "Наш сервер: общение, новости и все файлы для игры.",
		// окно Telegram: описание и кнопка
		tgTxt: "Мой телеграм-канал: анонсы стримов, новости и заметки.",
		openTg: "Открыть Telegram",
		// окно «Контакты»: описание
		mailTxt: "Для связи и сотрудничества:",
		// текст кнопки
		mailto: "Написать",
		// окно предупреждения: заголовок и текст
		warn: "Предупреждение",
		clkTitle: "Часы",
		clkTxt: "Здесь будет ваша надпись.",
		wip: "Сайт и весь проект находятся в разработке.",
		// подписи для скринридеров и всплывающие подсказки у кнопок окон и у кнопок ▲ / ▼ в Pong
		aMin: "Свернуть",
		aMax: "Развернуть",
		aClose: "Закрыть",
		aUp: "Вверх",
		aDown: "Вниз",
		// подпись на кнопке языка — язык, НА КОТОРЫЙ переключимся при нажатии
		other: "ENG",
		// Pong: подсказка по управлению, надписи «Победа», «Поражение» и «Пауза»
		pongHint: "Управление: W/S, ↑/↓, кнопки ниже или палец по полю. До 7 очков.",
		pWin: "Победа!",
		pLose: "Поражение",
		pPause: "Нажмите, чтобы играть",
		// окно MS-DOS: заголовок, кнопки, подсказка, надписи списка и строки состояния
		tDos: "MS-DOS",
		dosOpen: "Открыть файл…",
		dosReset: "Перезапуск",
		dosFull: "На весь экран",
		dosHint:
			"Клавиатура работает внутри экрана DOS (Esc — тоже). Свою игру можно открыть кнопкой «Открыть файл…» (.jsdos). Закрыть окно — кнопка ×.",
		dosTouch:
			"На телефоне нет клавиатуры для ввода текста — есть только кнопки выше. Касание экрана двигает мышь, быстрый тап — клик.",
		// студия .jsdos (сборка набора из zip)
		dosStudio: "Студия .jsdos (собрать из zip)",
		dosStudioStat: "Студия: набор .jsdos собирается из zip-архива с игрой",
		stZip: "1. Zip-архив с игрой",
		stExe: "2. Что запускать",
		stCyc: "Скорость процессора (cycles)",
		stTest: "Проверить",
		stSave: "Скачать .jsdos",
		stRead: "Читаю архив…",
		stBad: "Не удалось прочитать архив — это точно zip?",
		stHave: "В архиве уже есть папка .jsdos — это готовый набор, собирать ничего не нужно.",
		stNoExe: "В архиве нет файлов .exe / .com / .bat — запускать нечего.",
		stFound: "Найдено файлов для запуска: {n}. Выберите нужный и нажмите «Проверить».",
		stBuild: "Собираю…",
		stTested: "Запущено. Чтобы вернуться в студию, выберите «Студия .jsdos» в списке.",
		stSaved: "Готово, файл скачан. Положите его в assets/games/ и добавьте строку в DOS_GAMES.",
		stLibErr: "Не удалось загрузить библиотеку для работы с zip.",
		dosMouseOn: "Мышь: вкл",
		dosMouseOff: "Мышь: выкл",
		// сохранения игры
		dosSave: "Сохранить",
		dosExp: "В файл",
		dosImp: "Из файла…",
		dosDel: "Удалить сохранение",
		svSavedShort: "Сохранено в кэш браузера",
		svSaved:
			"Сохранение записано в кэш этого браузера. Оно хранится только на этом устройстве и пропадёт, если очистить данные сайта или открыть игру в другом браузере. Чтобы не потерять — кнопка «В файл».",
		svLoaded:
			"Загружено сохранение из кэша этого браузера. Чтобы начать игру с чистого листа — кнопка «Удалить сохранение».",
		svNone: "Нечего сохранять: в игре пока нет изменений.",
		svFile:
			"Файл сохранения скачан. Вернуть его в игру можно кнопкой «Из файла…» — в любом браузере и на любом устройстве.",
		svNoData: "Сохранения ещё нет — сначала нажмите «Сохранить».",
		svImported: "Сохранение из файла загружено в кэш браузера, игра перезапущена.",
		svDeleted: "Сохранение удалено из кэша, игра перезапущена с чистого листа.",
		svConfirm: "Удалить сохранение этой игры из кэша браузера?",
		svBad: "Не удалось прочитать файл: это не файл сохранения.",
		dosEmpty: "Командная строка DOS",
		dosLoading: "Загрузка эмулятора…",
		dosRun: "Эмулятор запущен",
		dosIdle: "Эмулятор остановлен",
		empty: "Папка пуста",
		up: "Вверх",
		notepad: " — Блокнот",
	},

	// ---------- English ----------
	en: {
		start: "Start",
		iAbout: "About me",
		iMail: "Contacts",
		iFolder: "New Folder",
		tAbout: "About.txt - Notepad",
		aboutTxt:
			"This is a small project by Vladimir “Cheese” Maasdam and a self‑taught developer who is also his best friend," +
			" Evgeny (Dusty)." +
			"\n" +
			"Several game projects originate here, under the guidance of absolute amateurs who love to have fun." +
			"\n" +
			" Join our Discord server and stay up to date with the news!",
		cookies: "We do not use cookies. (Probably...)",
		mcDesc: "Survival mode with custom plugins.",
		mcDesc2: "Come on, went in and came out. Twenty minute adventure.",
		addr: "Server address:",
		addrP: "Address with port:",
		copy: "Copy",
		copied: "✓ Copied!",
		files: "All game files are available in our Discord!",
		openDc: "Open Discord",
		dcTxt: "Our server: chat, news and all the game files.",
		tgTxt: "My Telegram channel: stream announcements, news and notes.",
		openTg: "Open Telegram",
		mailTxt: "For contact and collaboration:",
		mailto: "Write",
		warn: "Warning",
		clkTitle: "Clock",
		clkTxt: "Your message will be here.",
		wip: "The site and the entire project are under development.",
		aMin: "Minimize",
		aMax: "Maximize",
		aClose: "Close",
		aUp: "Up",
		aDown: "Down",
		other: "РУС",
		pongHint: "Controls: W/S, ↑/↓, the buttons below or drag on the field. First to 7.",
		pWin: "You win!",
		pLose: "You lose",
		pPause: "Click to play",
		tDos: "MS-DOS",
		dosOpen: "Open file…",
		dosReset: "Restart",
		dosFull: "Fullscreen",
		dosHint:
			"The keyboard works inside the DOS screen (Esc too). You can open your own game with “Open file…” (.jsdos). To close the window use ×.",
		dosTouch:
			"There is no keyboard for typing text on a phone — only the buttons above. Touching the screen moves the mouse, a quick tap clicks.",
		dosStudio: "Studio: make .jsdos from zip",
		dosStudioStat: "Studio: builds a .jsdos bundle from a zip with the game",
		stZip: "1. Zip archive with the game",
		stExe: "2. What to run",
		stCyc: "CPU speed (cycles)",
		stTest: "Test",
		stSave: "Download .jsdos",
		stRead: "Reading the archive…",
		stBad: "Could not read the archive — is it really a zip?",
		stHave: "The archive already has a .jsdos folder — it is a ready bundle, nothing to build.",
		stNoExe: "No .exe / .com / .bat files in the archive — nothing to run.",
		stFound: "Files to run found: {n}. Pick one and press “Test”.",
		stBuild: "Building…",
		stTested: "Running. To come back to the studio, choose “Studio” in the list.",
		stSaved: "Done, the file is downloaded. Put it into assets/games/ and add a line to DOS_GAMES.",
		stLibErr: "Could not load the zip library.",
		dosMouseOn: "Mouse: on",
		dosMouseOff: "Mouse: off",
		dosSave: "Save",
		dosExp: "To file",
		dosImp: "From file…",
		dosDel: "Delete save",
		svSavedShort: "Saved to the browser cache",
		svSaved:
			"The save was written to this browser’s cache. It lives only on this device and will be lost if you clear the site data or open the game in another browser. To keep it safe, use “To file”.",
		svLoaded: "A save from this browser’s cache was loaded. To start the game from scratch, use “Delete save”.",
		svNone: "Nothing to save: there are no changes in the game yet.",
		svFile: "The save file was downloaded. You can put it back with “From file…” — in any browser, on any device.",
		svNoData: "There is no save yet — press “Save” first.",
		svImported: "The save from the file was loaded into the browser cache, the game was restarted.",
		svDeleted: "The save was deleted from the cache, the game restarted from scratch.",
		svConfirm: "Delete this game’s save from the browser cache?",
		svBad: "Could not read the file: it is not a save file.",
		dosEmpty: "DOS command prompt",
		dosLoading: "Loading the emulator…",
		dosRun: "Emulator is running",
		dosIdle: "Emulator is stopped",
		empty: "This folder is empty",
		up: "Up",
		notepad: " - Notepad",
	},
};
// Текущий язык. По умолчанию русский; сохранённый выбор берётся из localStorage,
// а если его нет — язык браузера (английский, если он начинается с «en»).
// try/catch — на случай, когда localStorage недоступен (приватный режим и т.п.)
let lang = "ru";
try {
	lang = localStorage.getItem("lang") || ((navigator.language || "").toLowerCase().startsWith("en") ? "en" : "ru");
} catch (e) {}
// В localStorage мог оказаться посторонний язык (старая версия сайта, ручная правка) —
// без этой проверки t() падала бы с ошибкой и сайт не запускался вовсе
if (!T[lang]) lang = "ru";

// t(k)      — перевод строки по ключу k на текущем языке (если ключа нет — русский текст, а в крайнем случае сам ключ)
// small()   — true на узком экране (мобильная раскладка, ширина до 640px)
// coarse    — медиазапрос «основной указатель грубый» (палец, сенсорный экран)
const t = (k) => T[lang][k] ?? T.ru[k] ?? k,
	small = () => matchMedia("(max-width:640px)").matches,
	coarse = matchMedia("(pointer:coarse)");

// wins — все окна;
// z    — счётчик z-index: каждое активированное окно получает значение на 1 больше и оказывается сверху;
// cur  — сейчас активное окно (или null)
const wins = $$(".win");
let z = 10,
	cur = null;
