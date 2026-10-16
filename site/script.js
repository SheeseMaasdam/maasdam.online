
    (() => {

      // ======================================================================
      // ПОМОЩНИКИ ДЛЯ РАБОТЫ С DOM
      // ======================================================================

      // $  — найти ПЕРВЫЙ элемент по CSS-селектору s (внутри r, по умолчанию — во всём документе)
      // $$ — найти ВСЕ элементы по селектору s и вернуть обычный массив
      const $ = (s, r = document) => r.querySelector(s),
        $$ = (s, r = document) => [...r.querySelectorAll(s)];


      // ======================================================================
      // ПЕРЕВОДЫ (RU / EN)
      // Ключи совпадают со значениями атрибутов data-t в разметке.
      // При смене языка скрипт проходит по всем [data-t] и подставляет сюда текст
      // ======================================================================
      const T = {

        // ---------- Русский ----------
        ru: {
          // кнопка «Пуск»
          start: 'Пуск',
          // подписи ярлыков: «Обо мне» и «Контакты»
          iAbout: 'Обо мне',
          iMail: 'Контакты',
          // заголовок окна «Обо мне»
          tAbout: 'Обо мне.txt — Блокнот',
          // описание проекта в окне «Обо мне»
          aboutTxt: 'Это проект от Владимира «Сыра» Маасдама. Тут начинается проект с несколькими игровыми проектами. Присоединяйтесь к нашему серверу Discord и следите за новостями!',
          // примечание про cookies
          cookies: 'Мы не используем cookies. (Вроде бы...)',
          // окно Minecraft: описание, подписи полей адреса
          mcDesc: 'Режим выживания с пользовательскими плагинами.',
          mcDesc_2: 'Режим выживания с пользовательскими плагинами.',
          mcDesc_3: 'Режим выживания с пользовательскими плагинами.',
          addr: 'Адрес сервера:',
          addrP: 'Адрес с портом:',
          // кнопка копирования и текст на ней после копирования
          copy: 'Копировать',
          copied: '✓ Скопировано!',
          // жёлтая подсказка про файлы в Discord
          files: 'Все файлы для игры находятся в нашем Discord!',
          // кнопка «Открыть Discord»
          openDc: 'Открыть Discord',
          // окно Discord: описание
          dcTxt: 'Наш сервер: общение, новости и все файлы для игры.',
          // окно Telegram: описание и кнопка
          tgTxt: 'Мой телеграм-канал: новости и заметки.',
          openTg: 'Открыть Telegram',
          // окно «Контакты»: описание
          mailTxt: 'Для связи и сотрудничества:',
          // окно предупреждения: заголовок и текст
          warn: 'Предупреждение',
          wip: 'Сайт и весь проект находится в разработке.',
          // подпись на кнопке языка — язык, НА КОТОРЫЙ переключимся при нажатии
          other: 'ENG',
          // Pong: подсказка по управлению, надписи «Победа», «Поражение» и «Пауза»
          pongHint: 'Управление: W/S, ↑/↓, кнопки ниже или палец по полю. До 7 очков.',
          pWin: 'Победа!',
          pLose: 'Поражение',
          pPause: 'Нажмите, чтобы играть'
        },

        // ---------- English ----------
        en: {
          start: 'Start',
          iAbout: 'About me',
          iMail: 'Contacts',
          tAbout: 'About.txt - Notepad',
          aboutTxt: 'This is a project by Vladimir "Syr" Maasdam. This is where a project with several gaming ventures begins. Join our Discord server and stay tuned for updates!',
          cookies: 'We do not use cookies. (Probably...)',
          mcDesc: 'Survival mode with custom plugins.',
          addr: 'Server address:',
          addrP: 'Address with port:',
          copy: 'Copy',
          copied: '✓ Copied!',
          files: 'All game files are available in our Discord!',
          openDc: 'Open Discord',
          dcTxt: 'Our server: chat, news and all the game files.',
          tgTxt: 'My Telegram channel: news and notes.',
          openTg: 'Open Telegram',
          mailTxt: 'For contact and collaboration:',
          warn: 'Warning',
          wip: 'The site and the entire project is under development.',
          other: 'РУС',
          pongHint: 'Controls: W/S, ↑/↓, the buttons below or drag on the field. First to 7.',
          pWin: 'You win!',
          pLose: 'You lose',
          pPause: 'Click to play'
        }
      };

      // Текущий язык. По умолчанию русский; сохранённый выбор берётся из localStorage,
      // а если его нет — язык браузера (английский, если он начинается с «en»).
      // try/catch — на случай, когда localStorage недоступен (приватный режим и т.п.)
      let lang = 'ru';
      try {
        lang = localStorage.getItem('lang') || ((navigator.language || '').startsWith('en') ? 'en' : 'ru')
      } catch (e) { }

      // t(k)      — перевод строки по ключу k на текущем языке
      // small()   — true на узком экране (мобильная раскладка, ширина до 640px)
      // coarse    — медиазапрос «основной указатель грубый» (палец, сенсорный экран)
      const t = k => T[lang][k],
        small = () => matchMedia('(max-width:640px)').matches,
        coarse = matchMedia('(pointer:coarse)');

      // wins — все окна;
      // z    — счётчик z-index: каждое активированное окно получает значение на 1 больше и оказывается сверху;
      // cur  — сейчас активное окно (или null);
      // n    — объявлена, но в коде не используется (в lavaInit есть отдельная локальная n)
      const wins = $$('.win'); let z = 10, cur = null, n = 0;


      // ======================================================================
      // ПАНЕЛЬ ЗАДАЧ И ЯЗЫК
      // ======================================================================

      // Перерисовывает кнопки открытых окон на панели задач
      function tasks() {
        const c = $('#tasks');   // контейнер для кнопок
        c.textContent = '';      // стираем прежние кнопки
        // для каждого открытого окна создаём свою кнопку
        wins.filter(w => w.classList.contains('open')).forEach(w => {
          const b = document.createElement('button');
          // кнопка выглядит «нажатой» (on), если окно активно и не свёрнуто
          const on = w === cur && !w.classList.contains('min');
          b.className = 'tbtn' + (on ? ' on' : '');
          b.textContent = $('.tt', w).textContent;   // текст кнопки = заголовок окна
          // клик: активное окно сворачиваем, иначе — открываем/показываем и выводим наверх
          b.onclick = () => on ? min(w) : open(w.id);
          c.append(b)
        })
      }

      // Смена языка на l ('ru' или 'en'): запоминаем выбор и обновляем все тексты на странице
      function setLang(l) {
        lang = l;
        try {
          localStorage.setItem('lang', l)   // запоминаем выбор между визитами
        } catch (e) { }
        document.documentElement.lang = l;                                        // атрибут lang у <html>
        $$('[data-t]').forEach(e => e.textContent = t(e.dataset.t));              // подставляем переводы
        $('#lang').textContent = t('other');                                      // подпись кнопки языка
        clk(); tasks(); lay()                                                     // часы, панель задач, отступ окон на мобильном
      }


      // ======================================================================
      // УПРАВЛЕНИЕ ОКНАМИ
      // ======================================================================

      // Сделать окно w активным: запомнить, поднять наверх по z-index,
      // класс .act оставить только у него (от этого зависит цвет заголовка), обновить панель задач
      function focus(w) {
        cur = w;
        w.style.zIndex = ++z;
        wins.forEach(x => x.classList.toggle('act', x === w));
        tasks()
      }

      // Открыть (или показать, если свёрнуто) окно по id и сделать его активным
      function open(id) {
        const w = $('#' + id);
        w.classList.add('open');
        w.classList.remove('min');
        // при ПЕРВОМ открытии (флаг data-p) на широком экране выбираем окну начальное место
        if (!w.dataset.p) {
          w.dataset.p = 1;
          if (!small()) {
            if (id === 'err') {
              // окно предупреждения — по центру по горизонтали; по вертикали нижний край окна примерно на середине экрана
              w.style.left = (innerWidth - w.offsetWidth) / 2 + 'px';
              w.style.top = Math.max(8, innerHeight / 2 - w.offsetHeight) + 'px'
            }
            else rnd(w)   // остальные окна — в «случайное, но удачное» место
          }
        }
        // на телефоне открытое окно одно: сворачиваем все остальные открытые
        if (small()) wins.forEach(x => {
          if (x !== w && x.classList.contains('open') && !x.classList.contains('min')) min(x)
        });
        focus(w)
      }

      // Выбор случайного места для окна w: целиком в пределах экрана, правее ярлыков,
      // стараясь не перекрывать другие открытые окна
      function rnd(w) {
        // W, H — размеры окна. Дальше — допустимые границы для ЛЕВОГО ВЕРХНЕГО УГЛА окна:
        // x0..x1 — по горизонтали (от места правее ярлыков до правого края экрана с запасом 8px, чтобы окно влезло целиком),
        // y0..y1 — по вертикали (от верха экрана до положения, при котором окно не заходит под панель задач)
        const W = w.offsetWidth, H = w.offsetHeight, x0 = Math.min(Math.ceil($('#icons').getBoundingClientRect().right) + 8, Math.max(4, innerWidth - W - 8)), x1 = Math.max(x0, innerWidth - W - 8), y0 = 8, y1 = Math.max(y0, innerHeight - H - 48);
        // others — уже открытые окна, с которыми нужно меньше пересекаться (окно предупреждения не считаем)
        const others = wins.filter(o => o !== w && o.dataset.p && o.classList.contains('open') && o.id !== 'err'); let best, bs = 1e12;
        // 40 попыток: берём случайную точку (x, y) и считаем суммарную площадь пересечения
        // окна с остальными (sc); запоминаем точку с наименьшей площадью пересечения
        for (let k = 0; k < 40; k++) {
          const x = x0 + Math.random() * (x1 - x0), y = y0 + Math.random() * (y1 - y0);
          // площадь пересечения двух прямоугольников = (перекрытие по ширине) × (перекрытие по высоте)
          const sc = others.reduce((a, o) => a + Math.max(0, Math.min(x + W, o.offsetLeft + o.offsetWidth) - Math.max(x, o.offsetLeft)) * Math.max(0, Math.min(y + H, o.offsetTop + o.offsetHeight) - Math.max(y, o.offsetTop)), 0);
          if (sc < bs) { bs = sc; best = [x, y] }
        }
        // ставим окно в лучшую найденную точку
        w.style.left = Math.round(best[0]) + 'px'; w.style.top = Math.round(best[1]) + 'px'
      }

      // Свернуть окно: прячем (класс .min) и снимаем активность, если оно было активным
      function min(w) {
        w.classList.add('min');
        if (cur === w) cur = null;
        tasks()
      }

      // Закрыть окно: снимаем все состояния (открыто / свёрнуто / развёрнуто)
      function close(w) {
        w.classList.remove('open', 'min', 'max');
        if (cur === w) cur = null;
        tasks()
      }


      // ======================================================================
      // КОПИРОВАНИЕ В БУФЕР ОБМЕНА
      // ======================================================================

      // Запасной способ копирования (для старых браузеров и http-страниц):
      // создаём невидимое текстовое поле, выделяем в нём текст и выполняем команду copy
      function fb(s) {
        const a = document.createElement('textarea');
        a.value = s;
        a.style.cssText = 'position:fixed;opacity:0;user-select:text';
        document.body.append(a);
        a.select();
        try { document.execCommand('copy') } catch (e) { }
        a.remove()
      }

      // Копирование строки s: современный API буфера обмена (только в безопасном контексте — https),
      // при ошибке или его отсутствии — запасной способ fb
      function copy(s) {
        if (navigator.clipboard && isSecureContext) navigator.clipboard.writeText(s).catch(() => fb(s));
        else fb(s)
      }


      // ======================================================================
      // ЯРЛЫКИ РАБОЧЕГО СТОЛА И МЕНЮ «ПУСК»
      // ======================================================================

      // Для каждого ярлыка вешаем обработчики и создаём копию в меню «Пуск»
      $$('.icon').forEach(b => {
        // Клик: выделяем ярлык (снимая выделение с остальных); на сенсорных экранах сразу открываем окно
        b.onclick = () => {
          $$('.icon.sel').forEach(i => i.classList.remove('sel'));
          b.classList.add('sel');
          if (coarse.matches) open(b.dataset.open)
        };
        // Двойной клик — открыть окно
        b.ondblclick = () => open(b.dataset.open);
        // С клавиатуры: Enter или пробел — открыть окно
        b.onkeydown = e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            open(b.dataset.open)
          }
        };
        // Копия ярлыка для меню «Пуск»: тот же значок и подпись; клик закрывает меню и открывает окно
        const m = document.createElement('button');
        m.innerHTML = b.innerHTML;
        m.onclick = () => {
          $('#start').hidden = true;
          $('#sbtn').classList.remove('on');
          open(b.dataset.open)
        };
        $('.items').append(m)
      });

      // Значок в заголовке окна — копия значка соответствующего ярлыка (для окон с атрибутом data-icon)
      $$('.win[data-icon]').forEach(w => { $('.ti', w).innerHTML = $('.icon[data-open="' + w.id + '"] .ic').innerHTML });


      // ======================================================================
      // ПОВЕДЕНИЕ ОКОН: активация, разворот по двойному клику, перетаскивание
      // ======================================================================
      wins.forEach(w => {
        // Любое нажатие внутри окна делает его активным
        w.addEventListener('pointerdown', () => { if (cur !== w) focus(w) });

        const h = $('.tb', w);   // заголовок окна — за него окно таскают

        // Двойной клик по заголовку — развернуть/вернуть окно (не на телефоне и не для окна предупреждения)
        h.addEventListener('dblclick', e => { if (!e.target.closest('button') && w.id !== 'err' && !small()) w.classList.toggle('max') });

        // Перетаскивание окна за заголовок (мышь, палец, стилус — через pointer events)
        h.addEventListener('pointerdown', e => {
          // не таскаем: если нажата кнопка в заголовке, на телефоне или окно развёрнуто
          if (e.target.closest('button') || small() || w.classList.contains('max')) return;
          // dx, dy — смещение точки нажатия относительно левого верхнего угла окна
          const dx = e.clientX - w.offsetLeft, dy = e.clientY - w.offsetTop; h.setPointerCapture(e.pointerId);
          // mv — движение: ставим окно под указатель, но не даём ему целиком уехать за экран: по горизонтали на экране
          // всегда остаётся не меньше 80px окна, по вертикали — не меньше 80px его верхней части (чтобы можно было
          // «поймать» за заголовок); выше верхнего края экрана окно не уходит
          const mv = ev => { w.style.left = Math.max(80 - w.offsetWidth, Math.min(innerWidth - 80, ev.clientX - dx)) + 'px'; w.style.top = Math.max(0, Math.min(innerHeight - 80, ev.clientY - dy)) + 'px' };
          // up — отпустили: убираем временные обработчики движения
          const up = () => { h.removeEventListener('pointermove', mv); h.removeEventListener('pointerup', up) };
          h.addEventListener('pointermove', mv); h.addEventListener('pointerup', up)
        })
      });


      // ======================================================================
      // ОБЩИЕ ОБРАБОТЧИКИ: клики, «Пуск», язык, клавиатура, часы
      // ======================================================================

      // Один обработчик кликов на весь документ (делегирование событий)
      document.addEventListener('click', e => {
        // 1) Кнопки управления окном (data-act): закрыть / свернуть / развернуть
        const a = e.target.closest('[data-act]');
        if (a) {
          const w = a.closest('.win'), k = a.dataset.act;
          k === 'close' ? close(w) : k === 'min' ? min(w) : w.classList.toggle('max');
          return
        }
        // 2) Кнопки «Копировать» (data-copy): копируем текст и на 1,5 секунды меняем надпись на «✓ Скопировано!»
        const c = e.target.closest('[data-copy]');
        if (c) { copy(c.dataset.copy); const k = c.dataset.t; c.textContent = t('copied'); setTimeout(() => c.textContent = t(k), 1500) }
        // 3) Клик вне меню «Пуск» и кнопки «Пуск» — закрыть меню
        if (!e.target.closest('#start,#sbtn')) { $('#start').hidden = true; $('#sbtn').classList.remove('on') }
        // 4) Клик вне ярлыков — снять выделение с ярлыков
        if (!e.target.closest('.icon')) $$('.icon.sel').forEach(i => i.classList.remove('sel'))
      });

      // Кнопка «Пуск»: показать / скрыть меню и переключить вид кнопки (нажата / отпущена)
      $('#sbtn').onclick = () => { const s = $('#start'); s.hidden = !s.hidden; $('#sbtn').classList.toggle('on', !s.hidden) };

      // Кнопка языка: переключает RU <-> EN
      $('#lang').onclick = () => setLang(lang === 'ru' ? 'en' : 'ru');

      // Клавиша Esc закрывает активное окно
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && cur) close(cur) });

      // Часы в трее: часы и минуты по правилам текущего языка (по-русски «14:05», по-английски «02:05 PM»)
      function clk() { $('#clock').textContent = new Date().toLocaleTimeString(lang === 'en' ? 'en-US' : 'ru-RU', { hour: '2-digit', minute: '2-digit' }) }
      // Обновляем часы каждые 15 секунд
      setInterval(clk, 15000);


      // ======================================================================
      // ФОН: «ЛАВА-ЛАМПА ИЗ СЫРНЫХ ДЫР»
      // Холст рисуется в маленьком разрешении (одна клетка = несколько пикселей экрана) и растягивается на весь экран.
      // «Дыры» — «метаболлы»: у каждой есть центр и радиус, она плавно плавает по экрану и «дышит».
      // Для каждой клетки суммируется влияние всех дыр (поле fld); где сумма велика — рисуем коричневую «дыру»,
      // вокруг неё — мягкую тень. Всё вместе выглядит как слипающиеся и расходящиеся пузыри в сыре.
      // ======================================================================

      // lv — холст, lx — его 2D-контекст; reduce — пользователь просит отключить анимации в системе
      const lv = $('#lava'), lx = lv.getContext('2d'), reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
      // LW, LH — размер холста в клетках; img — буфер пикселей; fld — поле «влияния» дыр; balls — список дыр
      let LW, LH, img, fld, balls = [];
      // sm(a, b, x) — «сглаженная ступенька» (smoothstep): 0 при x<=a, 1 при x>=b, между ними — плавный переход
      const sm = (a, b, x) => { x = Math.max(0, Math.min(1, (x - a) / (b - a))); return x * x * (3 - 2 * x) };

      // Считает отступ сверху (CSS-переменная --wt) для окон на мобильном: сразу под ярлыками
      function lay() { document.documentElement.style.setProperty('--wt', Math.ceil($('#icons').getBoundingClientRect().bottom) + 8 + 'px') }

      // Инициализация фона: размер холста, буферы и случайный набор дыр. Вызывается при загрузке и смене размера окна
      function lavaInit() {
        // cell — размер клетки в пикселях экрана: чем больше экран, тем крупнее клетка (всего порядка 60000 клеток)
        const cell = Math.max(4, Math.ceil(Math.sqrt(innerWidth * innerHeight / 60000)));
        LW = Math.ceil(innerWidth / cell); LH = Math.ceil(innerHeight / cell); lv.width = LW; lv.height = LH;
        img = lx.createImageData(LW, LH); fld = new Float32Array(LW * LH);
        // u — меньшая сторона холста (масштаб для радиусов); n — число дыр: от 10 до 26, зависит от площади экрана
        const u = Math.min(LW, LH), n = Math.max(10, Math.min(26, Math.round(innerWidth * innerHeight / 45000)));
        balls = Array.from({ length: n }, () => {
          const R = Math.random(); return { // у каждой дыры свои размер, амплитуда, скорость и фаза
            // x, y — «центр» траектории; r — радиус (R*R — больше маленьких дыр и мало больших)
            x: Math.random() * LW, y: Math.random() * LH, r: u * (.035 + R * R * .15),
            // ax, ay — амплитуда блуждания по X и по Y
            ax: LW * (.04 + Math.random() * .22), ay: LH * (.08 + Math.random() * .3),
            // fx, fy — скорость блуждания; p, q — начальные фазы; fr, pr — скорость и фаза «дыхания» радиуса
            fx: .04 + Math.random() * .14, fy: .05 + Math.random() * .18, p: Math.random() * 6.3, q: Math.random() * 6.3, fr: .2 + Math.random() * .4, pr: Math.random() * 6.3
          }
        });
        lava(0)   // сразу рисуем первый кадр
      }

      // Рисует кадр для момента времени t (в секундах)
      function lava(t) {
        fld.fill(0);   // обнуляем поле влияния
        // Шаг 1. Для каждой дыры считаем текущее положение и радиус и «добавляем» её влияние в поле
        for (const b of balls) {
          // x, y — текущий центр: основное колебание плюс небольшое «дрожание» с другой частотой;
          // r — радиус с «дыханием» (±14%); R — радиус зоны влияния; R2 — его квадрат;
          // x0, x1, y0, y1 — прямоугольник клеток, который нужно обработать (в пределах холста)
          const x = b.x + b.ax * Math.sin(b.fx * t + b.p) + b.ax * .3 * Math.sin(b.fx * 2.3 * t + b.q), y = b.y + b.ay * Math.sin(b.fy * t + b.q) + b.ay * .25 * Math.sin(b.fy * 1.7 * t + b.p),
            r = b.r * (1 + .14 * Math.sin(b.fr * t + b.pr)), R = r * 1.414, R2 = R * R,
            x0 = Math.max(0, Math.floor(x - R)), x1 = Math.min(LW - 1, Math.ceil(x + R)), y0 = Math.max(0, Math.floor(y - R)), y1 = Math.min(LH - 1, Math.ceil(y + R));
          // влияние клетки = (1 - d²/R²)² — плавно убывает от центра к краю зоны
          for (let j = y0; j <= y1; j++) for (let i = x0; i <= x1; i++) { const dx = i - x, dy = j - y, e = 1 - (dx * dx + dy * dy) / R2; if (e > 0) fld[j * LW + i] += e * e }
        }
        // Шаг 2. Превращаем поле в цвета пикселей
        const D = img.data; let k = 0;
        for (let j = 0; j < LH; j++) {
          // g — положение строки сверху вниз (0..1); cr, cg, cb — цвет «сыра» (жёлтый), к низу немного темнеет
          const g = j / LH, cr = 250 - 6 * g, cg = 204 - 22 * g, cb = 70 - 24 * g;
          for (let i = 0; i < LW; i++, k += 4) {
            // v — значение поля в этой клетке; r, gg, b — итоговый цвет (сначала цвет сыра)
            const v = fld[j * LW + i]; let r = cr, gg = cg, b = cb;
            if (v > .1) {
              // рядом с дырой: мягкое затемнение («тень» вокруг)
              const s = sm(.1, .24, v) * .14; r *= 1 - s; gg *= 1 - s * 1.3; b *= 1 - s * 1.5;
              // h — «резкость» перехода: около порога v≈.25 цвет скачком становится коричневым (сама дыра)
              const h = sm(.235, .265, v); if (h > 0) {
                // dp — «глубина» дыры: чем ближе к центру, тем темнее коричневый
                const dp = Math.min(1, (v - .25) / .9); r += (168 - 62 * dp - r) * h; gg += (104 - 48 * dp - gg) * h; b += (18 - 8 * dp - b) * h
              }
            }
            // записываем цвет пикселя: R, G, B и непрозрачность (255)
            D[k] = r; D[k + 1] = gg; D[k + 2] = b; D[k + 3] = 255
          }
        }
        lx.putImageData(img, 0, 0)   // выводим буфер на холст
      }


      // ======================================================================
      // МИНИ-ИГРА PONG
      // Слева — ракетка игрока, справа — компьютера. Играют до 7 очков.
      // Поле 400×240; игра идёт, только пока окно Pong открыто, не свёрнуто и активно.
      // ======================================================================

      // pw — окно Pong, pc — холст игры, pg — его 2D-контекст;
      // PW, PH — размеры поля; PD — высота ракетки;
      // cl(v, a, b) — «зажать» значение v в диапазоне [a, b]
      const pw = $('#pong'), pc = $('#pc'), pg = pc.getContext('2d'), PW = 400, PH = 240, PD = 46, cl = (v, a, b) => Math.max(a, Math.min(b, v));
      // P — состояние игры:
      //   y  — положение ракетки игрока (верхний край), ay — ракетки компьютера;
      //   s1 — очки игрока, s2 — очки компьютера;
      //   bx, by — координаты мяча, vx, vy — его скорость (пикселей в секунду);
      //   wait — пауза перед подачей (сек.), over — таймер экрана «конец игры» (сек.)
      // K — нажатые управляющие клавиши/кнопки: up/dn — клавиатура, bu/bd — экранные кнопки ▲/▼
      const P = { y: 97, ay: 97, s1: 0, s2: 0, bx: 200, by: 120, vx: 0, vy: 0, wait: 0, over: 0 }, K = { up: 0, dn: 0, bu: 0, bd: 0 };

      // Подача мяча от центра в сторону d (1 — к компьютеру, -1 — к игроку), под небольшим случайным углом
      function serve(d) { P.bx = PW / 2; P.by = PH / 2; const a = (Math.random() - .5) * .8; P.vx = d * 170 * Math.cos(a); P.vy = 170 * Math.sin(a); P.wait = .8 }

      // Отскок мяча от ракетки с верхним краем py в сторону d.
      // o — где мяч попал по ракетке (-1 верх .. 1 низ): от этого зависит угол; скорость растёт на 6% (но не больше 400)
      function bounce(py, d) { const o = cl((P.by - (py + PD / 2)) / (PD / 2), -1, 1), sp = Math.min(400, Math.hypot(P.vx, P.vy) * 1.06), a = o * .85; P.vx = d * sp * Math.cos(a); P.vy = sp * Math.sin(a) }

      // Один шаг игры: dt — сколько секунд прошло с прошлого кадра. Здесь и расчёт, и отрисовка
      function pongStep(dt) {
        // Если окно Pong закрыто или свёрнуто — ничего не делаем
        if (!pw.classList.contains('open') || pw.classList.contains('min')) return;
        // on — окно Pong сейчас активно (иначе игра на паузе и показывается надпись «Нажмите, чтобы играть»)
        const on = cur === pw;
        if (on) {
          if (P.over) {
            // Идёт экран «конец игры»: ждём, потом начинаем заново (счёт обнуляется)
            P.over -= dt; if (P.over <= 0) { P.over = 0; P.s1 = P.s2 = 0; serve(1) }
          }
          else {
            // m — направление движения ракетки игрока: -1 вверх, 1 вниз, 0 стоит; скорость 270 px/сек
            const m = (K.up || K.bu ? -1 : 0) + (K.dn || K.bd ? 1 : 0); P.y = cl(P.y + m * 270 * dt, 0, PH - PD);
            // «Искусственный интеллект» компьютера: tg — желаемое положение ракетки.
            // Если мяч летит к компьютеру — следит за мячом, иначе возвращается к центру.
            // Скорость ракетки ограничена 125 px/сек — поэтому её можно обыграть
            const tg = P.vx > 0 ? P.by - PD / 2 : PH / 2 - PD / 2; P.ay = cl(P.ay + cl(tg - P.ay, -125 * dt, 125 * dt), 0, PH - PD);
            // Мяч стоит до конца паузы после подачи, потом летит
            if (P.wait > 0) P.wait -= dt; else { P.bx += P.vx * dt; P.by += P.vy * dt }
            // Отскок от верхней и нижней стенок
            if (P.by < 4) { P.by = 4; P.vy = Math.abs(P.vy) }
            if (P.by > PH - 4) { P.by = PH - 4; P.vy = -Math.abs(P.vy) }
            // Отскок от ракетки игрока (слева)
            if (P.vx < 0 && P.bx - 4 <= 20 && P.bx > 10 && P.by >= P.y - 4 && P.by <= P.y + PD + 4) { P.bx = 25; bounce(P.y, 1) }
            // Отскок от ракетки компьютера (справа)
            if (P.vx > 0 && P.bx + 4 >= PW - 20 && P.bx < PW - 10 && P.by >= P.ay - 4 && P.by <= P.ay + PD + 4) { P.bx = PW - 25; bounce(P.ay, -1) }
            // Мяч улетел за левый край — очко компьютеру; за правый — очко игроку.
            // Затем новая подача — в сторону того, кто пропустил мяч (serve(-1) — к игроку, serve(1) — к компьютеру)
            if (P.bx < -6) { P.s2++; serve(-1) } else if (P.bx > PW + 6) { P.s1++; serve(1) }
            // Кто-то набрал 7 очков — включаем экран «конец игры» на 2,2 секунды
            if (P.s1 >= 7 || P.s2 >= 7) P.over = 2.2
          }
        }

        // ----- Отрисовка -----
        // чёрный фон
        pg.fillStyle = '#000'; pg.fillRect(0, 0, PW, PH); pg.fillStyle = '#fff';
        // пунктирная линия по центру
        for (let y = 6; y < PH; y += 16) pg.fillRect(PW / 2 - 1, y, 2, 8);
        // ракетка игрока, ракетка компьютера и мяч
        pg.fillRect(14, P.y, 6, PD); pg.fillRect(PW - 20, P.ay, 6, PD); pg.fillRect(P.bx - 4, P.by - 4, 8, 8);
        // счёт: слева — игрок, справа — компьютер
        pg.font = 'bold 30px "Courier New",monospace'; pg.textAlign = 'center'; pg.fillText(P.s1, PW / 2 - 50, 36); pg.fillText(P.s2, PW / 2 + 50, 36);
        // Если игра окончена или на паузе — затемняем поле и пишем надпись по центру:
        // «Победа!» / «Поражение» (конец игры) или «Нажмите, чтобы играть» (пауза)
        if (P.over || !on) {
          pg.fillStyle = 'rgba(0,0,0,.65)'; pg.fillRect(0, 0, PW, PH); pg.fillStyle = '#fff'; pg.font = 'bold 20px "Courier New",monospace';
          pg.fillText(P.over ? (P.s1 > P.s2 ? t('pWin') : t('pLose')) : t('pPause'), PW / 2, PH / 2 + 7)
        }
      }

      // --- Управление Pong ---

      // Соответствие физических клавиш действиям: W и стрелка вверх — вверх, S и стрелка вниз — вниз
      const KM = { KeyW: 'up', ArrowUp: 'up', KeyS: 'dn', ArrowDown: 'dn' };
      // Нажатие: если активно окно Pong и клавиша управляющая — запоминаем нажатие (и не даём странице прокрутиться)
      document.addEventListener('keydown', e => { if (cur === pw && KM[e.code]) { K[KM[e.code]] = 1; e.preventDefault() } });
      // Отпускание клавиши
      document.addEventListener('keyup', e => { if (KM[e.code]) K[KM[e.code]] = 0 });
      // Если окно браузера потеряло фокус — «отпускаем» все клавиши, чтобы ракетка не «залипла»
      addEventListener('blur', () => { K.up = K.dn = K.bu = K.bd = 0 });

      // Экранные кнопки ▲ (#pu -> bu) и ▼ (#pd -> bd): пока кнопка зажата — ракетка двигается
      [['pu', 'bu'], ['pd', 'bd']].forEach(([id, f]) => {
        const b = $('#' + id); b.addEventListener('pointerdown', e => { e.preventDefault(); K[f] = 1 });
        // отпускание, отмена касания или выход пальца/курсора за кнопку — перестаём двигать
        ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => b.addEventListener(ev, () => K[f] = 0)); b.addEventListener('contextmenu', e => e.preventDefault())
      });

      // Управление пальцем/мышью по полю: ракетка следует за указателем по вертикали
      // dr — указатель сейчас зажат на поле; mvp — переводит координату указателя в положение ракетки
      let dr = false; const mvp = e => { const r = pc.getBoundingClientRect(); P.y = cl((e.clientY - r.top) / r.height * PH - PD / 2, 0, PH - PD) };
      pc.addEventListener('pointerdown', e => { dr = true; pc.setPointerCapture(e.pointerId); mvp(e) });
      pc.addEventListener('pointermove', e => { if (dr) mvp(e) }); ['pointerup', 'pointercancel'].forEach(ev => pc.addEventListener(ev, () => dr = false));

      // Первая подача — в сторону компьютера
      serve(1);


      // ======================================================================
      // ГЛАВНЫЙ ЦИКЛ АНИМАЦИИ И ЗАПУСК САЙТА
      // ======================================================================

      // last — время прошлого кадра; lt — время последней перерисовки фона
      let last = 0, lt = 0;

      // Вызывается браузером перед каждой перерисовкой (~60 раз в секунду); ts — время в миллисекундах
      function tick(ts) {
        requestAnimationFrame(tick);                               // сразу планируем следующий кадр
        const dt = Math.min(.05, (ts - last) / 1000 || 0); last = ts;   // dt — секунды с прошлого кадра (не больше 0,05, чтобы игра не «прыгала» после паузы)
        // Фон перерисовываем не чаще ~30 раз в секунду и только если пользователь не отключил анимации
        if (!reduce && ts - lt > 33) { lt = ts; lava(ts / 1000) }
        pongStep(dt)                                               // шаг игры Pong
      }

      // При изменении размера окна браузера: пересчитываем отступ окон и заново строим фон
      addEventListener('resize', () => { lay(); lavaInit() });

      // Запуск: строим фон и запускаем цикл анимации
      lavaInit(); requestAnimationFrame(tick);

      // Применяем язык (подставляем переводы). На широком экране сразу открываем окна
      // «Обо мне», Minecraft, Discord, Telegram и «Контакты». Окно предупреждения открывается на любом экране
      // и последним — поэтому оказывается поверх остальных
      setLang(lang); if (!small()) ['about', 'mc', 'dc', 'tg', 'mail'].forEach(i => open(i)); open('err');
    })();