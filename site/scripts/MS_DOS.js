// ======================================================================
// MS-DOS: ЭМУЛЯТОР DOS В ОКНЕ (js-dos)
// Сам эмулятор работает в <iframe> со страницы assets/jsdos/player.html (там же объяснено, зачем отдельная страница).
// Здесь — окно вокруг него: список программ, «Открыть файл…», «Перезапуск», «На весь экран», строка состояния.
//
// Эмулятор грузится только пока окно открыто (сайт без него не тормозит), при сворачивании окна ставится на паузу,
// при закрытии — полностью выгружается (<iframe> удаляется, звук и вычисления прекращаются).
//
// Как добавить игру или программу:
//   1. Положить набор .jsdos (или .zip) в папку assets/games/.
//      Набор .jsdos — это обычный zip: файлы игры + файл .jsdos/dosbox.conf внутри (с командами запуска в секции [autoexec]).
//      Готовые наборы можно собрать на https://dos.zone/studio или скачать с https://dos.zone
//   2. Добавить строку в список DOS_GAMES ниже.
// Посетитель может и сам открыть свой файл кнопкой «Открыть файл…» — он не загружается на сервер, работает только у него в браузере.
//
// ВАЖНО при обновлении игры: браузер посетителя запоминает скачанный набор по его адресу и потом не скачивает заново.
// Заменили файл на сервере — поменяйте и адрес в списке: 'assets/games/doom.jsdos?v=2' (v=3 и т.д.).
// Сохранения при этом не теряются: они привязаны к адресу без «?v=...».
// Сохранения посетителя лежат в кэше его браузера (кнопки «Сохранить», «В файл», «Из файла…» в окне; см. раздел «Сохранения» ниже).
// ======================================================================

// Список программ в выпадающем списке. Первым пунктом всегда идёт «Командная строка DOS» (пустой DOS), его добавлять не нужно.
//   name — название (строка или { ru: '...', en: '...' }),  url — путь к набору от корня сайта
//   mouse — необязательно: false = игра запускается с выключенной мышью (для игр, где мышь только мешает, например Doom;
//           посетитель может включить её кнопкой «Мышь» в окне). По умолчанию мышь включена
const DOS_GAMES = [
	// { name: { ru: 'Название игры', en: 'Game title' }, url: 'assets/games/game.jsdos' },
	// { name: { ru: 'Doom', en: 'Doom' }, url: 'assets/games/doom.jsdos', mouse: false },   // пример игры без мыши
];

// Страница с эмулятором
const DOS_PLAYER = "assets/jsdos/player.html";

// dosWin, dosScreen, dosSel, dosStat, dosFile — окно, место под <iframe>, список программ, строка состояния, скрытое поле выбора файла
const dosWin = $("#dos"),
	dosScreen = $("#dscreen"),
	dosSel = $("#dsel"),
	dosStat = $("#dstat"),
	dosFile = $("#dfile");

// dosFrame    — <iframe> с эмулятором (null — эмулятор сейчас не запущен);
// dosPick     — что выбрано в списке: '0' — пустой DOS, '1', '2'... — номер игры из DOS_GAMES, 'f' — файл с компьютера;
// dosBlob     — внутренний адрес (blob:) выбранного с компьютера файла, dosFileName — его имя (показываем в списке);
// dosStatKey  — ключ перевода текущей надписи в строке состояния (чтобы перевести её при смене языка);
// dosPaused   — эмулятор сейчас на паузе (окно свёрнуто)
// dosMouse — мышь включена (true) или не передаётся в игру (false); см. кнопку «Мышь» ниже
let dosMouse = true;
// dosKey — ключ сохранений текущей игры ('' — сохранений нет); dosFileSize — размер файла с компьютера (входит в ключ);
// dosNoted — плашка про кэш уже показывалась в этот сеанс (показываем один раз, чтобы не надоедать)
let dosKey = "",
	dosFileSize = 0,
	dosNoted = false;
let dosFrame = null,
	dosPick = "0",
	dosBlob = "",
	dosFileName = "",
	dosStatKey = "dosIdle",
	dosPaused = false;

// Надпись в строке состояния по ключу перевода
function setStat(k) {
	dosStatKey = k;
	dosStat.textContent = t(k);
}

// Заполняет список программ на текущем языке (вызывается и из setLang при смене языка), сохраняя выбранный пункт
function relabelDos() {
	dosSel.textContent = "";
	const add = (v, label) => {
		const o = document.createElement("option");
		o.value = v;
		o.textContent = label;
		dosSel.append(o);
	};
	add("0", t("dosEmpty"));
	DOS_GAMES.forEach((g, i) => add(String(i + 1), nm(g.name)));
	add("s", t("dosStudio"));
	if (dosFileName) add("f", "📁 " + dosFileName);
	dosSel.value = dosPick;
	setStat(dosStatKey);
	stSay(stMsgKey, stMsgN);
	$("#dmouse").textContent = t(dosMouse ? "dosMouseOn" : "dosMouseOff");
}

// Вернуть клавиатурный фокус эмулятору (иначе клавиши после клика по панели окна уходили бы в страницу сайта)
function dosFocus() {
	try {
		dosFrame.contentWindow.focus();
	} catch (e) {}
}

// Выгрузить эмулятор: удаляем <iframe> — браузер останавливает всё, что в нём работало (эмулятор, звук)
function dosKill() {
	if (dosFrame) {
		dosFrame.remove();
		dosFrame = null;
	}
}

// Запустить (или перезапустить) выбранную программу в новом <iframe>
function dosStart() {
	dosKill();
	// Выбрана «Студия»: вместо экрана показываем панель сборки, эмулятор не запускаем
	showStudio(dosPick === "s");
	if (dosPick === "s") {
		setStat("dosStudioStat");
		return;
	}
	// адрес набора: для игры из списка — абсолютный (страница эмулятора лежит в другой папке, относительный не подошёл бы), для файла с компьютера — blob:
	let url = "";
	if (dosPick === "f") url = dosBlob;
	else if (dosPick !== "0") url = new URL(DOS_GAMES[dosPick - 1].url, location.href).href;
	const f = document.createElement("iframe");
	f.title = "MS-DOS";
	f.allow = "fullscreen; autoplay";
	// Ключ сохранений: для игры из списка — её путь без «?v=...», для файла с компьютера — имя и размер. У «пустого DOS» сохранений нет
	dosKey = "";
	if (dosPick === "f") dosKey = "file:" + dosFileName + ":" + dosFileSize;
	else if (dosPick !== "0") dosKey = "game:" + DOS_GAMES[dosPick - 1].url.split("?")[0];
	$("#dsaves").hidden = !dosKey;
	f.src =
		DOS_PLAYER + (url ? "?url=" + encodeURIComponent(url) + (dosKey ? "&key=" + encodeURIComponent(dosKey) : "") : "");
	f.onload = () => {
		setStat("dosRun");
		// Клик внутри <iframe> не доходит до страницы сайта, поэтому «активным» (наверх, с синим заголовком) окно DOS делаем сами
		try {
			f.contentWindow.addEventListener("pointerdown", () => {
				if (cur !== dosWin) focusWin(dosWin);
			});
		} catch (e) {}
		dosFocus();
	};
	setStat("dosLoading");
	dosScreen.append(f);
	dosFrame = f;
	dosPaused = false;
	dosApplyMouse();
}

// Следим за состоянием окна (классы open / min меняют функции open, min и close выше), чтобы не трогать их код:
//   открыто — запускаем эмулятор;  закрыто — выгружаем и сбрасываем выбор;  свёрнуто — пауза, развёрнуто обратно — продолжаем
new MutationObserver(() => {
	const isOpen = dosWin.classList.contains("open"),
		isMin = dosWin.classList.contains("min");
	// развёрнутость снята (кнопка «□» или закрытие окна) — выходим и из программного полного экрана (.dsoft)
	// (проверка обязательна: даже «пустое» снятие класса считается изменением атрибута и заново запускало бы этот же наблюдатель — бесконечно)
	if (dosWin.classList.contains("dsoft") && !dosWin.classList.contains("max")) dosWin.classList.remove("dsoft");
	if (!isOpen) {
		// сбрасываем всегда (даже если эмулятор не запущен — например, была открыта студия); все действия безопасно повторять
		dosKill();
		if (dosBlob) {
			URL.revokeObjectURL(dosBlob);
			dosBlob = "";
		}
		dosPick = "0";
		dosFileName = "";
		dosMouse = true;
		dosNoted = false;
		$("#dsaves").hidden = $("#dnote").hidden = true;
		studioReset();
		showStudio(false);
		relabelDos();
		setStat("dosIdle");
		return;
	}
	if (!dosFrame) {
		dosStart();
		return;
	}
	if (isMin !== dosPaused) {
		dosPaused = isMin;
		try {
			dosFrame.contentWindow.dosPause(isMin);
		} catch (e) {}
		if (!isMin) dosFocus();
	}
}).observe(dosWin, { attributes: true, attributeFilter: ["class"] });

// Мышь: когда выключена, <iframe> с эмулятором перестаёт принимать указатель (pointer-events: none) —
// движения и клики мыши до игры не доходят (клик по экрану по-прежнему делает окно активным и возвращает клавиатуру игре)
function dosApplyMouse() {
	if (dosFrame) dosFrame.style.pointerEvents = dosMouse ? "" : "none";
	$("#dmouse").textContent = t(dosMouse ? "dosMouseOn" : "dosMouseOff");
}
$("#dmouse").onclick = () => {
	dosMouse = !dosMouse;
	dosApplyMouse();
	dosFocus();
};

// Выбрали другую программу в списке — запускаем её. Мышь включаем, если для игры в DOS_GAMES не указано mouse: false
dosSel.onchange = () => {
	dosPick = dosSel.value;
	const g = DOS_GAMES[dosPick - 1];
	dosMouse = !(g && g.mouse === false);
	dosStart();
};

// «Открыть файл…»: кнопка открывает скрытое поле выбора файла; выбранный .jsdos / .zip запускаем из памяти браузера
$("#dopen").onclick = () => dosFile.click();
dosFile.onchange = () => {
	const f = dosFile.files[0];
	if (!f) return;
	if (dosBlob) URL.revokeObjectURL(dosBlob);
	dosBlob = URL.createObjectURL(f);
	dosFileName = f.name;
	dosFileSize = f.size;
	dosPick = "f";
	dosFile.value = ""; // чтобы тот же файл можно было выбрать ещё раз
	dosMouse = true;
	relabelDos();
	dosStart();
};

// «Перезапуск»: та же программа с самого начала
$("#dreset").onclick = () => dosStart();

// «На весь экран». Два способа:
//   • компьютер: настоящий полноэкранный режим браузера для <iframe> с эмулятором;
//   • телефон / планшет (сенсорный экран) и браузеры без полноэкранного режима (iPhone): «программный» полный экран —
//     окно разворачивается на весь экран (как кнопкой «□»), лишнее прячется (класс .dsoft), остаются экран и пульт.
//     Настоящий полноэкранный режим тут не годится: он показал бы только эмулятор без экранного пульта, и играть было бы нечем.
//     Выйти — кнопка «□» в заголовке окна
const fsOk = !!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen);
$("#dfull").onclick = () => {
	const f = dosFrame;
	if (!f) return;
	const go = f.requestFullscreen || f.webkitRequestFullscreen;
	if (go && fsOk && !coarse.matches) {
		const r = go.call(f);
		// В полноэкранном режиме просим браузер (Chrome, Edge) отдавать Esc странице, а не выходить из полного экрана:
		// иначе Esc в играх выкидывал бы из полноэкранного режима. Выйти можно, удерживая Esc, или кнопкой браузера
		if (r && r.then)
			r.then(() => {
				try {
					navigator.keyboard.lock(["Escape"]).catch(() => {});
				} catch (e) {}
			}).catch(() => {});
	} else {
		const on = !dosWin.classList.contains("dsoft");
		dosWin.classList.toggle("dsoft", on);
		dosWin.classList.toggle("max", on);
	}
	dosFocus();
};
// Вышли из полноэкранного режима — отпускаем захват клавиши
document.addEventListener("fullscreenchange", () => {
	if (!document.fullscreenElement) {
		try {
			navigator.keyboard.unlock();
		} catch (e) {}
	}
});

// Экранный пульт (телефоны): пока кнопка зажата, в эмулятор уходит «клавиша нажата», при отпускании — «отпущена».
// Эмулятор слушает обычные события клавиатуры своей страницы (keyCode), поэтому отправляем ему такие же события
$$("#dpad [data-k]").forEach((b) => {
	const code = +b.dataset.k,
		loc = +(b.dataset.l || 0);
	let down = false;
	const send = (type) => {
		try {
			const w = dosFrame.contentWindow;
			w.dispatchEvent(
				new w.KeyboardEvent(type, { keyCode: code, which: code, location: loc, bubbles: true, cancelable: true }),
			);
		} catch (e) {}
	};
	b.addEventListener("pointerdown", (e) => {
		e.preventDefault();
		if (dosFrame) {
			down = true;
			send("keydown");
		}
	});
	// отпускание, отмена касания или выход пальца за кнопку — клавиша отпущена (иначе она «залипла» бы в игре)
	["pointerup", "pointercancel", "pointerleave"].forEach((ev) =>
		b.addEventListener(ev, () => {
			if (down) {
				down = false;
				send("keyup");
			}
		}),
	);
	b.addEventListener("contextmenu", (e) => e.preventDefault());
});

// ----------------------------------------------------------------------
// СТУДИЯ .jsdos: собирает набор из обычного zip с игрой прямо в браузере (на сервер ничего не уходит).
// Набор .jsdos — это zip, в который добавлены два служебных файла:
//   .jsdos/dosbox.conf — настройки DOSBox и команды запуска (секция [autoexec])
//   .jsdos/jsdos.json  — версия формата
// Порядок: выбрать zip → из списка найденных .exe/.com/.bat выбрать запускаемый → «Проверить» (запуск тут же) или «Скачать .jsdos».
// Библиотека JSZip (assets/jsdos/jszip.min.js, лицензия MIT) подгружается только при первом выборе архива.
// ----------------------------------------------------------------------
const DOS_JSZIP = "assets/jsdos/jszip.min.js";
const stZip = $("#szip"),
	stExe = $("#sexe"),
	stCyc = $("#scyc"),
	stTest = $("#stest"),
	stSave = $("#ssave"),
	stMsg = $("#smsg");

// stSrc — загруженный архив (объект JSZip); stName — имя исходного файла без расширения (так назовём результат);
// stMsgKey / stMsgN — ключ перевода и число для текущего сообщения (чтобы перевести его при смене языка); zipLib — загрузка JSZip
let stSrc = null,
	stName = "game",
	stMsgKey = "",
	stMsgN = 0,
	zipLib = null;

// Сообщение под кнопками студии ({n} в тексте заменяется числом)
function stSay(k, n) {
	stMsgKey = k;
	stMsgN = n;
	stMsg.textContent = k ? t(k).replace("{n}", n) : "";
}

// Показать панель студии вместо экрана (и наоборот). В студии нечего перезапускать, на весь экран выводить и нажимать пультом
function showStudio(on) {
	$("#dstudio").hidden = !on;
	dosScreen.hidden = on;
	$("#dpad").hidden = on;
	if (on) {
		$("#dsaves").hidden = true;
		$("#dnote").hidden = true;
	}
	$("#dreset").disabled = $("#dfull").disabled = $("#dmouse").disabled = on;
}

// Сбросить студию (при закрытии окна): забыть архив и очистить поля
function studioReset() {
	stSrc = null;
	stZip.value = "";
	stExe.textContent = "";
	stExe.disabled = stTest.disabled = stSave.disabled = true;
	stSay("");
}

// Подгрузить JSZip один раз
function loadZipLib() {
	if (window.JSZip) return Promise.resolve();
	return (
		zipLib ||
		(zipLib = new Promise((ok, fail) => {
			const sc = document.createElement("script");
			sc.src = DOS_JSZIP;
			sc.onload = ok;
			sc.onerror = () => {
				zipLib = null;
				fail();
			};
			document.head.append(sc);
		}))
	);
}

// Выбрали zip: читаем его и ищем запускаемые файлы
stZip.onchange = async () => {
	const f = stZip.files[0];
	if (!f) return;
	stExe.disabled = stTest.disabled = stSave.disabled = true;
	stSay("stRead");
	try {
		await loadZipLib();
	} catch (e) {
		stSay("stLibErr");
		return;
	}
	try {
		stSrc = await JSZip.loadAsync(f);
	} catch (e) {
		stSrc = null;
		stSay("stBad");
		return;
	}
	stName = f.name.replace(/\.[^.]+$/, "") || "game";
	if (Object.keys(stSrc.files).some((n) => n.startsWith(".jsdos/"))) {
		stSay("stHave");
		return;
	}
	// запускаемые файлы: сначала лежащие ближе к корню архива, внутри уровня — по алфавиту
	const list = Object.keys(stSrc.files)
		.filter((n) => !stSrc.files[n].dir && /\.(exe|com|bat)$/i.test(n))
		.sort((a, b) => a.split("/").length - b.split("/").length || a.localeCompare(b));
	if (!list.length) {
		stSay("stNoExe");
		return;
	}
	stExe.textContent = "";
	list.forEach((n) => {
		const o = document.createElement("option");
		o.value = o.textContent = n;
		stExe.append(o);
	});
	stExe.disabled = stTest.disabled = stSave.disabled = false;
	stSay("stFound", list.length);
};

// Текст dosbox.conf. Путь «папка/подпапка/GAME.EXE» превращается в команды «cd папка\подпапка» и «GAME.EXE»
function stConf(path) {
	const parts = path.split("/"),
		file = parts.pop();
	const lines = [
		"[sdl]",
		"autolock=false",
		"[cpu]",
		"core=auto",
		"cycles=" + stCyc.value,
		"[autoexec]",
		"@echo off",
		"mount c .",
		"c:",
	];
	if (parts.length) lines.push("cd " + parts.join("\\"));
	lines.push(file);
	return lines.join("\n") + "\n";
}

// Собрать набор: копия исходного архива + два служебных файла
async function stBuildBundle() {
	const z = new JSZip();
	for (const n of Object.keys(stSrc.files)) {
		const e = stSrc.files[n];
		if (e.dir) z.folder(n);
		else z.file(n, await e.async("uint8array"));
	}
	z.file(".jsdos/dosbox.conf", stConf(stExe.value));
	z.file(".jsdos/jsdos.json", '{"version":"8.xx"}');
	return z.generateAsync({ type: "blob", compression: "DEFLATE" });
}

// «Проверить»: собранный набор запускаем как «файл с компьютера» (экран возвращается, в списке появляется 📁 имя.jsdos)
stTest.onclick = async () => {
	stSay("stBuild");
	const blob = await stBuildBundle();
	if (dosBlob) URL.revokeObjectURL(dosBlob);
	dosBlob = URL.createObjectURL(blob);
	dosFileName = stName + ".jsdos";
	dosFileSize = blob.size;
	dosPick = "f";
	stSay("stTested");
	relabelDos();
	dosStart();
};

// «Скачать .jsdos»: отдаём собранный файл браузеру на скачивание
stSave.onclick = async () => {
	stSay("stBuild");
	const blob = await stBuildBundle();
	const a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.download = stName + ".jsdos";
	a.click();
	setTimeout(() => URL.revokeObjectURL(a.href), 10000);
	stSay("stSaved");
};

// ----------------------------------------------------------------------
// СОХРАНЕНИЯ. Всё, что игра записала на диск C: (её сейвы), эмулятор собирает в «набор изменений» и при следующем запуске
// накладывает поверх игры. Хранится набор в кэше браузера (IndexedDB этого сайта) — под ключом dosKey, поэтому сохранения
// привязаны к браузеру и устройству. Чтобы их не потерять и переносить, есть выгрузка в файл (.save) и загрузка обратно.
// Сам механизм (хранилище, события) — в assets/jsdos/player.html; тут — кнопки и уведомления.
//   • «Сохранить» — записать в кэш сейчас (кроме того, эмулятор сохраняет сам при выходе из полного экрана)
//   • «В файл» — сохранить и скачать файл;  «Из файла…» — положить сохранение из файла в кэш и перезапустить игру
//   • «Удалить сохранение» — стереть из кэша и перезапустить игру с чистого листа
// Про кэш посетителя предупреждает жёлтая плашка (#dnote) — один раз за сеанс при первом сохранении или загрузке.
// ----------------------------------------------------------------------
const dosNote = $("#dnote"),
	dosImpFile = $("#dimpf");

// Показать жёлтую плашку с текстом по ключу перевода (закрывается кнопкой OK)
function dosNotify(k) {
	$("#dnotet").textContent = t(k);
	dosNote.hidden = false;
	dosNoted = true;
}
$("#dnoteok").onclick = () => {
	dosNote.hidden = true;
	dosFocus();
};

// Вызвать функцию страницы эмулятора (они описаны в конце player.html); null — если эмулятор не запущен
const dosCall = (name, ...a) => {
	try {
		return Promise.resolve(dosFrame.contentWindow[name](...a));
	} catch (e) {
		return Promise.resolve(null);
	}
};

// Сообщения от эмулятора: saved — сохранение записано в кэш, loaded — при запуске подхвачено сохранение из кэша
window.addEventListener("message", (e) => {
	if (e.origin !== location.origin || !dosFrame || e.source !== dosFrame.contentWindow || !e.data) return;
	if (e.data.dos === "saved") {
		setStat("svSavedShort");
		if (!dosNoted) dosNotify("svSaved");
	} else if (e.data.dos === "loaded" && !dosNoted) dosNotify("svLoaded");
});

// «Сохранить»
$("#dsave").onclick = async () => {
	const ok = await dosCall("dosSaveNow");
	if (!ok) setStat("svNone");
	dosFocus();
};

// «В файл»: сохраняем, берём сохранение из кэша и отдаём браузеру на скачивание
$("#dexp").onclick = async () => {
	await dosCall("dosSaveNow");
	const bytes = await dosCall("dosExport");
	if (!bytes) {
		setStat("svNoData");
		return;
	}
	const a = document.createElement("a");
	a.href = URL.createObjectURL(new Blob([bytes], { type: "application/octet-stream" }));
	a.download =
		(dosFileName || dosKey.replace(/^game:.*\//, "").replace(/\.[^.]*$/, "") || "game").replace(/\.jsdos$/i, "") +
		".save";
	a.click();
	setTimeout(() => URL.revokeObjectURL(a.href), 10000);
	setStat("svFile");
	dosNotify("svFile");
};

// «Из файла…»: открываем выбор файла; сохранение кладём в кэш и перезапускаем игру, чтобы эмулятор его подхватил
$("#dimp").onclick = () => dosImpFile.click();
dosImpFile.onchange = async () => {
	const f = dosImpFile.files[0];
	dosImpFile.value = "";
	if (!f || !dosFrame) return;
	const b = new Uint8Array(await f.arrayBuffer());
	if (b.length < 4 || b[0] !== 0x50 || b[1] !== 0x4b) {
		setStat("svBad");
		return;
	} // файл сохранения — zip, он начинается с «PK»
	await dosCall("dosImport", b);
	dosStart();
	setStat("svImported");
	dosNotify("svImported");
};

// «Удалить сохранение»
$("#ddel").onclick = async () => {
	if (!window.confirm(t("svConfirm"))) return;
	await dosCall("dosDeleteSave");
	dosStart();
	setStat("svDeleted");
	dosNotify("svDeleted");
};
// Клик по пустому месту окна (заголовок, поля) возвращает клавиатуру эмулятору; по кнопкам и списку — нет, им нужен свой фокус
dosWin.addEventListener("click", (e) => {
	if (dosFrame && !e.target.closest("select,button,input,a")) dosFocus();
});
