// ============================================================================
// Часы в трее = счётчик посетителей, показанный как время: 156 → 01:56, 3456 → 34:56
// (часы = число // 100, минуты = число % 100). Клик по часам открывает/закрывает окно #clk
// (его текст — ключ clkTxt в language.js).
//
// ЗАГЛУШКА: сам счётчик пока не реализован. Реальную логику нужно написать в функции getVisitors() ниже —
// она должна вернуть число посетителей (целое >= 0). Остальной код (формат ЧЧ:ММ, часы, окно) уже готов.
// ============================================================================

let visitors = null;   // null — число неизвестно, в часах будет «--:--»

// TODO: здесь будет получение числа посетителей (запрос к своему серверу / сервису и т.п.).
// Сейчас возвращает 0, поэтому часы показывают 00:00. Если получить число не удалось — бросьте ошибку или верните null,
// тогда часы покажут «--:--».
async function getVisitors() {
  return 0
}

// Число → «ЧЧ:ММ»: 156 → «01:56». Больше 9999 просто даёт три цифры часов («100:00» — это 10000)
function fmtVisitors(n) {
  if (!Number.isFinite(n) || n < 0) return '--:--';
  return String(Math.floor(n / 100)).padStart(2, '0') + ':' + String(n % 100).padStart(2, '0')
}

// Показать число в часах. Вызывается и при смене языка (setLang), и когда число получено
function clk() { $('#clock').textContent = fmtVisitors(visitors) }

async function visitorsInit() {
  try { visitors = await getVisitors(); clk() } catch (e) { /* число не получено — остаётся «--:--» */ }
}

// Клик (и Enter / пробел) по часам — открыть окно; если оно уже активно — закрыть
function toggleClockWin() {
  const w = $('#clk');
  if (w.classList.contains('open') && !w.classList.contains('min') && cur === w) closeWin(w); else openWin('clk')
}
$('#clock').addEventListener('click', toggleClockWin);
$('#clock').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleClockWin() } });

visitorsInit();
