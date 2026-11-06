// ======================================================================
// ПАНЕЛЬ ЗАДАЧ И ЯЗЫК
// ======================================================================

// Перерисовывает кнопки открытых окон на панели задач
function tasks() {
	const c = $("#tasks"); // контейнер для кнопок
	c.textContent = ""; // стираем прежние кнопки
	// для каждого открытого окна создаём свою кнопку
	wins
		.filter((w) => w.classList.contains("open"))
		.forEach((w) => {
			const b = document.createElement("button");
			// кнопка выглядит «нажатой» (on), если окно активно и не свёрнуто
			const on = w === cur && !w.classList.contains("min");
			b.className = "tbtn" + (on ? " on" : "");
			b.textContent = $(".tt", w).textContent; // текст кнопки = заголовок окна
			// клик: активное окно сворачиваем, иначе — открываем/показываем и выводим наверх
			b.onclick = () => (on ? minWin(w) : openWin(w.id));
			c.append(b);
		});
}

// Смена языка на l ('ru' или 'en'): запоминаем выбор и обновляем все тексты на странице
function setLang(l) {
	lang = l;
	try {
		localStorage.setItem("lang", l); // запоминаем выбор между визитами
	} catch (e) {}
	document.documentElement.lang = l; // атрибут lang у <html>
	$$("[data-t]").forEach((e) => (e.textContent = t(e.dataset.t))); // подставляем переводы
	$("#lang").textContent = t("other"); // подпись кнопки языка
	// подписи (для скринридеров) и подсказки у кнопок «свернуть / развернуть / закрыть» и ▲ / ▼
	$$(".tbb [data-act]").forEach((b) => {
		const s = t({ min: "aMin", max: "aMax", close: "aClose" }[b.dataset.act]);
		b.setAttribute("aria-label", s);
		b.title = s;
	});
	[
		["pu", "aUp"],
		["pd", "aDown"],
	].forEach(([id, k]) => {
		const b = $("#" + id);
		b.setAttribute("aria-label", t(k));
		b.title = t(k);
	});
	if (typeof relabelFolders === "function") relabelFolders();
	if (typeof relabelDos === "function") relabelDos();
	clk();
	tasks();
	lay(); // часы, панель задач, отступ окон на мобильном
}
