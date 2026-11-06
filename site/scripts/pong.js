// ======================================================================
// МИНИ-ИГРА PONG
// Слева — ракетка игрока, справа — компьютера. Играют до 7 очков.
// Поле 400×240; игра идёт, только пока окно Pong открыто, не свёрнуто и активно.
// ======================================================================

// pw — окно Pong, pc — холст игры, pg — его 2D-контекст;
// PW, PH — размеры поля; PD — высота ракетки;
// cl(v, a, b) — «зажать» значение v в диапазоне [a, b]
const pw = $("#pong"),
	pc = $("#pc"),
	pg = pc.getContext("2d"),
	PW = 400,
	PH = 240,
	PD = 46,
	cl = (v, a, b) => Math.max(a, Math.min(b, v));
// P — состояние игры:
//   y  — положение ракетки игрока (верхний край), ay — ракетки компьютера;
//   s1 — очки игрока, s2 — очки компьютера;
//   bx, by — координаты мяча, vx, vy — его скорость (пикселей в секунду);
//   wait — пауза перед подачей (сек.), over — таймер экрана «конец игры» (сек.)
// K — нажатые управляющие клавиши/кнопки: up/dn — клавиатура, bu/bd — экранные кнопки ▲/▼
const P = { y: 97, ay: 97, s1: 0, s2: 0, bx: 200, by: 120, vx: 0, vy: 0, wait: 0, over: 0 },
	K = { up: 0, dn: 0, bu: 0, bd: 0 };

// Подача мяча от центра в сторону d (1 — к компьютеру, -1 — к игроку), под небольшим случайным углом
function serve(d) {
	P.bx = PW / 2;
	P.by = PH / 2;
	const a = (Math.random() - 0.5) * 0.8;
	P.vx = d * 170 * Math.cos(a);
	P.vy = 170 * Math.sin(a);
	P.wait = 0.8;
}

// Отскок мяча от ракетки с верхним краем py в сторону d.
// o — где мяч попал по ракетке (-1 верх .. 1 низ): от этого зависит угол; скорость растёт на 6% (но не больше 400)
function bounce(py, d) {
	const o = cl((P.by - (py + PD / 2)) / (PD / 2), -1, 1),
		sp = Math.min(400, Math.hypot(P.vx, P.vy) * 1.06),
		a = o * 0.85;
	P.vx = d * sp * Math.cos(a);
	P.vy = sp * Math.sin(a);
}

// Один маленький шаг физики: dt — длительность шага в секундах
function pongPhys(dt) {
	// m — направление движения ракетки игрока: -1 вверх, 1 вниз, 0 стоит; скорость 270 px/сек
	const m = (K.up || K.bu ? -1 : 0) + (K.dn || K.bd ? 1 : 0);
	P.y = cl(P.y + m * 270 * dt, 0, PH - PD);
	// «Искусственный интеллект» компьютера: tg — желаемое положение ракетки.
	// Если мяч летит к компьютеру — следит за мячом, иначе возвращается к центру.
	// Скорость ракетки ограничена 200 px/сек — поэтому её можно обыграть
	const tg = P.vx > 0 ? P.by - PD / 2 : PH / 2 - PD / 2;
	P.ay = cl(P.ay + cl(tg - P.ay, -200 * dt, 200 * dt), 0, PH - PD);
	// Мяч стоит до конца паузы после подачи, потом летит
	if (P.wait > 0) P.wait -= dt;
	else {
		P.bx += P.vx * dt;
		P.by += P.vy * dt;
	}
	// Отскок от верхней и нижней стенок
	if (P.by < 4) {
		P.by = 4;
		P.vy = Math.abs(P.vy);
	}
	if (P.by > PH - 4) {
		P.by = PH - 4;
		P.vy = -Math.abs(P.vy);
	}
	// Отскок от ракетки игрока (слева)
	if (P.vx < 0 && P.bx - 4 <= 20 && P.bx > 10 && P.by >= P.y - 4 && P.by <= P.y + PD + 4) {
		P.bx = 25;
		bounce(P.y, 1);
	}
	// Отскок от ракетки компьютера (справа)
	if (P.vx > 0 && P.bx + 4 >= PW - 20 && P.bx < PW - 10 && P.by >= P.ay - 4 && P.by <= P.ay + PD + 4) {
		P.bx = PW - 25;
		bounce(P.ay, -1);
	}
	// Мяч улетел за левый край — очко компьютеру; за правый — очко игроку.
	// Затем новая подача — в сторону того, кто пропустил мяч (serve(-1) — к игроку, serve(1) — к компьютеру)
	if (P.bx < -6) {
		P.s2++;
		serve(-1);
	} else if (P.bx > PW + 6) {
		P.s1++;
		serve(1);
	}
	// Кто-то набрал 7 очков — включаем экран «конец игры» на 2,2 секунды
	if (P.s1 >= 7 || P.s2 >= 7) P.over = 2.2;
}

// Один кадр игры: dt — сколько секунд прошло с прошлого кадра. Здесь и расчёт, и отрисовка
function pongStep(dt) {
	// Если окно Pong закрыто или свёрнуто — ничего не делаем
	if (!pw.classList.contains("open") || pw.classList.contains("min")) return;
	// on — окно Pong сейчас активно (иначе игра на паузе и показывается надпись «Нажмите, чтобы играть»)
	const on = cur === pw;
	if (on) {
		if (P.over) {
			// Идёт экран «конец игры»: ждём, потом начинаем заново (счёт обнуляется)
			P.over -= dt;
			if (P.over <= 0) {
				P.over = 0;
				P.s1 = P.s2 = 0;
				serve(1);
			}
		} else {
			// Физику считаем шагами не длиннее 1/120 сек. На медленных устройствах кадр может длиться до 0,05 сек,
			// а мяч на максимальной скорости (400 px/сек) за это время пролетает 20px — больше «зоны» ракетки,
			// и он пролетал бы сквозь неё. Мелкие шаги это исключают
			for (let r = dt; r > 1e-6 && !P.over; r -= 1 / 120) pongPhys(Math.min(r, 1 / 120));
		}
	}

	// ----- Отрисовка -----
	// чёрный фон
	pg.fillStyle = "#000";
	pg.fillRect(0, 0, PW, PH);
	pg.fillStyle = "#fff";
	// пунктирная линия по центру
	for (let y = 6; y < PH; y += 16) pg.fillRect(PW / 2 - 1, y, 2, 8);
	// ракетка игрока, ракетка компьютера и мяч
	pg.fillRect(14, P.y, 6, PD);
	pg.fillRect(PW - 20, P.ay, 6, PD);
	pg.fillRect(P.bx - 4, P.by - 4, 8, 8);
	// счёт: слева — игрок, справа — компьютер
	pg.font = 'bold 30px "Courier New",monospace';
	pg.textAlign = "center";
	pg.fillText(P.s1, PW / 2 - 50, 36);
	pg.fillText(P.s2, PW / 2 + 50, 36);
	// Если игра окончена или на паузе — затемняем поле и пишем надпись по центру:
	// «Победа!» / «Поражение» (конец игры) или «Нажмите, чтобы играть» (пауза)
	if (P.over || !on) {
		pg.fillStyle = "rgba(0,0,0,.65)";
		pg.fillRect(0, 0, PW, PH);
		pg.fillStyle = "#fff";
		pg.font = 'bold 20px "Courier New",monospace';
		pg.fillText(P.over ? (P.s1 > P.s2 ? t("pWin") : t("pLose")) : t("pPause"), PW / 2, PH / 2 + 7);
	}
}

// --- Управление Pong ---

// Соответствие физических клавиш действиям: W и стрелка вверх — вверх, S и стрелка вниз — вниз
const KM = { KeyW: "up", ArrowUp: "up", KeyS: "dn", ArrowDown: "dn" };
// Нажатие: если активно окно Pong и клавиша управляющая — запоминаем нажатие (и не даём странице прокрутиться)
document.addEventListener("keydown", (e) => {
	if (cur === pw && KM[e.code]) {
		K[KM[e.code]] = 1;
		e.preventDefault();
	}
});
// Отпускание клавиши
document.addEventListener("keyup", (e) => {
	if (KM[e.code]) K[KM[e.code]] = 0;
});
// Если окно браузера потеряло фокус — «отпускаем» все клавиши, чтобы ракетка не «залипла»
addEventListener("blur", () => {
	K.up = K.dn = K.bu = K.bd = 0;
});

// Экранные кнопки ▲ (#pu -> bu) и ▼ (#pd -> bd): пока кнопка зажата — ракетка двигается
[
	["pu", "bu"],
	["pd", "bd"],
].forEach(([id, f]) => {
	const b = $("#" + id);
	b.addEventListener("pointerdown", (e) => {
		e.preventDefault();
		K[f] = 1;
	});
	// отпускание, отмена касания или выход пальца/курсора за кнопку — перестаём двигать
	["pointerup", "pointercancel", "pointerleave"].forEach((ev) => b.addEventListener(ev, () => (K[f] = 0)));
	b.addEventListener("contextmenu", (e) => e.preventDefault());
});

// Управление пальцем/мышью по полю: ракетка следует за указателем по вертикали
// dr — указатель сейчас зажат на поле; mvp — переводит координату указателя в положение ракетки
// (рамка холста 2px входит в getBoundingClientRect, поэтому вычитаем её: иначе ракетка сдвигалась бы на пару пикселей)
let dr = false;
const mvp = (e) => {
	const r = pc.getBoundingClientRect();
	P.y = cl(((e.clientY - r.top - pc.clientTop) / pc.clientHeight) * PH - PD / 2, 0, PH - PD);
};
pc.addEventListener("pointerdown", (e) => {
	dr = true;
	pc.setPointerCapture(e.pointerId);
	mvp(e);
});
pc.addEventListener("pointermove", (e) => {
	if (dr) mvp(e);
});
["pointerup", "pointercancel"].forEach((ev) => pc.addEventListener(ev, () => (dr = false)));

// Первая подача — в сторону компьютера
serve(1);
