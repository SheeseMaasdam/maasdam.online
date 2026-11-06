// ======================================================================
// УПРАВЛЕНИЕ ОКНАМИ
// ======================================================================

// Сделать окно w активным: запомнить, поднять наверх по z-index,
// класс .act оставить только у него (от этого зависит цвет заголовка), обновить панель задач
function focusWin(w) {
	cur = w;
	w.style.zIndex = ++z;
	wins.forEach((x) => x.classList.toggle("act", x === w));
	tasks();
}

// Открыть (или показать, если свёрнуто) окно по id и сделать его активным
function openWin(id) {
	const w = $("#" + id);
	w.classList.add("open");
	w.classList.remove("min");
	place(w);
	// на телефоне открытое окно одно: сворачиваем все остальные открытые
	if (small())
		wins.forEach((x) => {
			if (x !== w && x.classList.contains("open") && !x.classList.contains("min")) minWin(x);
		});
	focusWin(w);
}

// Начальное место окна на широком экране. Выбирается один раз — когда окно впервые показано на широком экране
// (флаг data-p). На телефоне место задаёт CSS, поэтому флаг не ставится: если потом экран расширят,
// окно получит нормальное место, а не окажется в левом верхнем углу под ярлыками.
// Уже размещённое окно просто возвращаем в границы экрана (его могли закрыть, пока экран был меньше)
function place(w) {
	if (small()) return fit(w); // на телефоне место задаёт CSS; сдвинутое пальцем окно только возвращаем в экран
	if (w.dataset.p) return fit(w);
	w.dataset.p = 1;
	if (w.id === "err") {
		// окно предупреждения — ровно по центру экрана (по вертикали — центр области над панелью задач), как системное сообщение
		w.style.left = Math.max(0, (innerWidth - w.offsetWidth) / 2) + "px";
		w.style.top = Math.max(8, (innerHeight - 40 - w.offsetHeight) / 2) + "px";
	} else if (w.id === "clk") {
		// окно часов — у правого нижнего края, прямо над часами в трее
		w.style.left = Math.max(0, innerWidth - w.offsetWidth - 8) + "px";
		w.style.top = Math.max(8, innerHeight - 40 - w.offsetHeight - 8) + "px";
	} else rnd(w); // остальные окна — в «случайное, но удачное» место
}

// Вернуть окно w целиком в пределы экрана (над панелью задач). Нужно при уменьшении окна браузера:
// иначе окна, стоявшие у правого/нижнего края, уезжают за экран. Развёрнутые окна не трогаем
function fit(w) {
	// на узком экране позицию имеют только сдвинутые пальцем окна (.moved); остальные ставит CSS
	if ((small() && !w.classList.contains("moved")) || w.classList.contains("max") || !w.offsetWidth) return;
	w.style.left = Math.max(0, Math.min(w.offsetLeft, innerWidth - w.offsetWidth)) + "px";
	w.style.top = Math.max(0, Math.min(w.offsetTop, innerHeight - w.offsetHeight - 40)) + "px";
}

// Выбор случайного места для окна w: целиком в пределах экрана, правее ярлыков,
// стараясь не перекрывать другие открытые окна
function rnd(w) {
	// W, H — размеры окна. Дальше — допустимые границы для ЛЕВОГО ВЕРХНЕГО УГЛА окна:
	// x0..x1 — по горизонтали (от места правее ярлыков до правого края экрана с запасом 8px, чтобы окно влезло целиком),
	// y0..y1 — по вертикали (от верха экрана до положения, при котором окно не заходит под панель задач)
	const W = w.offsetWidth,
		H = w.offsetHeight,
		x0 = Math.min(Math.ceil($("#icons").getBoundingClientRect().right) + 8, Math.max(4, innerWidth - W - 8)),
		x1 = Math.max(x0, innerWidth - W - 8),
		y0 = 8,
		y1 = Math.max(y0, innerHeight - H - 48);
	// others — уже открытые окна, с которыми нужно меньше пересекаться (окно предупреждения не считаем)
	const others = wins.filter((o) => o !== w && o.dataset.p && o.classList.contains("open") && o.id !== "err");
	let best,
		bs = 1e12;
	// 40 попыток: берём случайную точку (x, y) и считаем суммарную площадь пересечения
	// окна с остальными (sc); запоминаем точку с наименьшей площадью пересечения
	for (let k = 0; k < 40; k++) {
		const x = x0 + Math.random() * (x1 - x0),
			y = y0 + Math.random() * (y1 - y0);
		// площадь пересечения двух прямоугольников = (перекрытие по ширине) × (перекрытие по высоте)
		const sc = others.reduce(
			(a, o) =>
				a +
				Math.max(0, Math.min(x + W, o.offsetLeft + o.offsetWidth) - Math.max(x, o.offsetLeft)) *
					Math.max(0, Math.min(y + H, o.offsetTop + o.offsetHeight) - Math.max(y, o.offsetTop)),
			0,
		);
		if (sc < bs) {
			bs = sc;
			best = [x, y];
		}
	}
	// ставим окно в лучшую найденную точку
	w.style.left = Math.round(best[0]) + "px";
	w.style.top = Math.round(best[1]) + "px";
}

// Свернуть окно: прячем (класс .min) и снимаем активность, если оно было активным
function minWin(w) {
	w.classList.add("min");
	if (cur === w) cur = null;
	tasks();
}

// Закрыть окно: снимаем все состояния (открыто / свёрнуто / развёрнуто)
function closeWin(w) {
	w.classList.remove("open", "min", "max");
	if (cur === w) cur = null;
	tasks();
	// Окно предупреждения закрыть насовсем нельзя — как настоящая системная ошибка, оно появляется снова
	if (w === errWin) respawnErr();
}

// errWin     — окно предупреждения (#err);
// ERR_DELAY  — через сколько миллисекунд оно возвращается после закрытия (кнопки × и OK, клавиша Esc);
// errTimer   — таймер возвращения (чтобы не запустить два сразу)
const errWin = $("#err"),
	ERR_DELAY = 800;
let errTimer = 0;

// Вернуть окно предупреждения после короткой паузы. Флаг data-p сбрасываем, чтобы оно снова встало по центру
// экрана (даже если его успели перетащить в угол), а openWin() выдвинул его поверх всех окон и сделал активным
function respawnErr() {
	clearTimeout(errTimer);
	errTimer = setTimeout(() => {
		delete errWin.dataset.p;
		openWin("err");
	}, ERR_DELAY);
}

// ======================================================================
// ПОВЕДЕНИЕ ОКОН: активация, разворот (кнопка «□», на компьютере ещё двойной клик по заголовку), перетаскивание
// (мышью, а на телефоне пальцем за заголовок: окно получает класс .moved)
// ======================================================================
function wire(w) {
	// Любое нажатие внутри окна делает его активным
	w.addEventListener("pointerdown", () => {
		if (cur !== w) focusWin(w);
	});

	const h = $(".tb", w); // заголовок окна — за него окно таскают

	// Двойной клик по заголовку — развернуть/вернуть окно (не на телефоне и не для окна предупреждения)
	h.addEventListener("dblclick", (e) => {
		if (!e.target.closest("button") && w.id !== "err" && !small()) w.classList.toggle("max");
	});

	// Перетаскивание окна за заголовок (мышь, палец, стилус — через pointer events)
	h.addEventListener("pointerdown", (e) => {
		// не таскаем: если нажата не основная кнопка мыши (правая кнопка открывала «зависшее» перетаскивание),
		// нажата кнопка в заголовке или окно развёрнуто
		if (e.button !== 0 || e.target.closest("button") || w.classList.contains("max")) return;
		// на телефоне окно по умолчанию стоит на месте, которое задаёт CSS; как только его потащили, помечаем классом .moved —
		// с этого момента CSS не фиксирует позицию (left и top пишем сами), а ширина остаётся «почти на весь экран»
		if (small()) w.classList.add("moved");
		// dx, dy — смещение точки нажатия относительно левого верхнего угла окна
		const dx = e.clientX - w.offsetLeft,
			dy = e.clientY - w.offsetTop;
		h.setPointerCapture(e.pointerId);
		// mv — движение: ставим окно под указатель, но не даём ему целиком уехать за экран: по горизонтали на экране
		// всегда остаётся не меньше 80px окна, по вертикали — не меньше 80px его верхней части (чтобы можно было
		// «поймать» за заголовок); выше верхнего края экрана окно не уходит
		// На телефоне окно почти во всю ширину экрана, поэтому по горизонтали оно целиком остаётся на экране (двигается в основном вверх-вниз)
		const mv = (ev) => {
			const x0 = small() ? 0 : 80 - w.offsetWidth,
				x1 = small() ? Math.max(0, innerWidth - w.offsetWidth) : innerWidth - 80;
			w.style.left = Math.max(x0, Math.min(x1, ev.clientX - dx)) + "px";
			w.style.top = Math.max(0, Math.min(innerHeight - 80, ev.clientY - dy)) + "px";
		};
		// up — указатель отпущен ИЛИ касание прервано системой (pointercancel): в обоих случаях браузер снимает «захват»
		// указателя и присылает lostpointercapture. Раньше слушали только pointerup — при отмене касания обработчик
		// движения оставался навсегда, и окно потом следовало за курсором без нажатой кнопки
		const up = () => {
			h.removeEventListener("pointermove", mv);
			h.removeEventListener("lostpointercapture", up);
		};
		h.addEventListener("pointermove", mv);
		h.addEventListener("lostpointercapture", up);
	});
}
wins.forEach(wire);

// ======================================================================
// ЯРЛЫКИ РАБОЧЕГО СТОЛА И МЕНЮ «ПУСК»
// ======================================================================

// Для каждого ярлыка вешаем обработчики и создаём копию в меню «Пуск»
$$(".icon").forEach((b) => {
	// Клик: выделяем ярлык (снимая выделение с остальных); на сенсорных экранах сразу открываем окно
	b.onclick = () => {
		$$(".icon.sel").forEach((i) => i.classList.remove("sel"));
		b.classList.add("sel");
		if (coarse.matches) openWin(b.dataset.open);
	};
	// Двойной клик — открыть окно
	b.ondblclick = () => openWin(b.dataset.open);
	// С клавиатуры: Enter или пробел — открыть окно
	b.onkeydown = (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			openWin(b.dataset.open);
		}
	};
	// Копия ярлыка для меню «Пуск»: тот же значок и подпись; клик закрывает меню и открывает окно
	const m = document.createElement("button");
	m.innerHTML = b.innerHTML;
	m.onclick = () => {
		$("#start").hidden = true;
		$("#sbtn").classList.remove("on");
		openWin(b.dataset.open);
	};
	$(".items").append(m);
});

// Значок в заголовке окна — копия значка соответствующего ярлыка (для окон с атрибутом data-icon)
$$(".win[data-icon]").forEach((w) => {
	$(".ti", w).innerHTML = $('.icon[data-open="' + w.id + '"] .ic').innerHTML;
});
