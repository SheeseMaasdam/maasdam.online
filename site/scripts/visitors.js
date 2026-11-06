// ============================================================================
// Счётчик посетителей. Часы в трее показывают число уникальных посетителей как время:
//   156 → 01:56, 3456 → 34:56 (часы = число // 100, минуты = число % 100).
// Клик по часам открывает/закрывает окно #clk (текст — ключ clkTxt в language.js).
//
// Счётчик хранится на бесплатном сервисе Abacus (https://abacus.jasoncameron.dev), своего сервера у сайта нет.
// Человек считается один раз на браузер: после первого визита в localStorage ставится метка,
// и дальше скрипт только читает число (/get), не увеличивая его (/hit).
// Если очистить данные сайта или зайти из другого браузера — посчитает ещё раз.
// ============================================================================

const VISITORS_API = 'https://abacus.jasoncameron.dev';
const VISITORS_NS = 'maasdam.online';   // 3–64 символа: буквы, цифры, «-», «_», «.»
const VISITORS_KEY = 'visitors';
const VISITORS_OFFSET = 0;              // если сайт уже был до счётчика — впишите сюда, сколько человек добавить к числу

let visitors = null;                    // null — число ещё неизвестно (показываем «--:--»)

// Безопасная работа с localStorage (в приватном режиме он может быть недоступен)
function lsGet(k) { try { return localStorage.getItem(k) } catch (e) { return null } }
function lsSet(k, v) { try { localStorage.setItem(k, v) } catch (e) { } }

// Число → «ЧЧ:ММ»: 156 → «01:56». Больше 9999 просто даёт три цифры часов («100:00» — это 10000)
function fmtVisitors(n) {
  if (!Number.isFinite(n) || n < 0) return '--:--';
  return String(Math.floor(n / 100)).padStart(2, '0') + ':' + String(n % 100).padStart(2, '0')
}

// Показать число в часах. Вызывается и при смене языка (setLang), и когда пришёл ответ от сервера
function clk() { $('#clock').textContent = fmtVisitors(visitors) }

async function visitorsCall(kind) {
  const r = await fetch(`${VISITORS_API}/${kind}/${VISITORS_NS}/${VISITORS_KEY}`);
  if (!r.ok) { const e = new Error('HTTP ' + r.status); e.status = r.status; throw e }
  const v = (await r.json()).value;
  if (!Number.isFinite(v)) throw new Error('bad value');
  return v
}

async function visitorsInit() {
  // пока ждём сервер — показываем последнее известное число (если оно было)
  const cached = Number(lsGet('visitorsLast'));
  if (lsGet('visitorsLast') !== null && Number.isFinite(cached)) { visitors = cached; clk() }
  try {
    let v;
    if (lsGet('visitorCounted') !== '1') { v = await visitorsCall('hit'); lsSet('visitorCounted', '1') }
    else {
      try { v = await visitorsCall('get') }
      catch (e) { if (e.status === 404) v = await visitorsCall('hit'); else throw e }   // счётчика ещё нет — создаём
    }
    visitors = v + VISITORS_OFFSET; lsSet('visitorsLast', String(visitors)); clk()
  } catch (e) { /* сервер недоступен — остаётся последнее известное число или «--:--» */ }
}

// Клик (и Enter / пробел) по часам — открыть окно; если оно уже активно — закрыть
function toggleClockWin() {
  const w = $('#clk');
  if (w.classList.contains('open') && !w.classList.contains('min') && cur === w) closeWin(w); else openWin('clk')
}
$('#clock').addEventListener('click', toggleClockWin);
$('#clock').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleClockWin() } });

visitorsInit();
