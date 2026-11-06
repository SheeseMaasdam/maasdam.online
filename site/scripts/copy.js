// ======================================================================
// КОПИРОВАНИЕ В БУФЕР ОБМЕНА
// ======================================================================

// Запасной способ копирования (для старых браузеров и http-страниц):
// создаём невидимое текстовое поле, выделяем в нём текст и выполняем команду copy
function fb(s) {
	const a = document.createElement("textarea");
	a.value = s;
	// -webkit-user-select нужен Safari: у body выделение отключено, и без него поле нельзя выделить, а значит и скопировать.
	// readonly — чтобы на телефоне не выезжала экранная клавиатура
	a.readOnly = true;
	a.style.cssText = "position:fixed;opacity:0;user-select:text;-webkit-user-select:text";
	document.body.append(a);
	a.select();
	a.setSelectionRange(0, s.length); // select() одного мало для iOS
	try {
		document.execCommand("copy");
	} catch (e) {}
	a.remove();
}

// Копирование строки s: современный API буфера обмена (только в безопасном контексте — https),
// при ошибке или его отсутствии — запасной способ fb
function copyText(s) {
	if (navigator.clipboard && isSecureContext) navigator.clipboard.writeText(s).catch(() => fb(s));
	else fb(s);
}
