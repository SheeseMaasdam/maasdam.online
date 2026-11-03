
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
          iFolder: 'Новая папка',
          // заголовок окна «Обо мне»
          tAbout: 'Обо мне.txt — Блокнот',
          // описание проекта в окне «Обо мне»
          aboutTxt: 'Это небольшой проект от Владимира «Сыра» Маасдама и разраба-самоучки,' +
              ' по совместительству его лучшего друга, Евгения (Дасти).' + '\n' +
              ' Здесь берут начало несколько игровых проектов, под руководством абсолютнейших дилетантов, любящих угарать.' + '\n' +
              ' Присоединяйтесь к нашему серверу Discord и следите за новостями!',
          // примечание про cookies
          cookies: 'Мы не используем cookies. (Вроде бы...)',
          // окно Minecraft: описание, подписи полей адреса
          mcDesc: 'Режим выживания с пользовательскими плагинами.',
          mcDesc2: 'Давай, вошли и вышли. Приключение на 20 минут.',
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
          tgTxt: 'Мой телеграм-канал: анонсы стримов, новости и заметки.',
          openTg: 'Открыть Telegram',
          // окно «Контакты»: описание
          mailTxt: 'Для связи и сотрудничества:',
          // текст кнопки
          mailto: 'Написать',
          // окно предупреждения: заголовок и текст
          warn: 'Предупреждение',
          wip: 'Сайт и весь проект находятся в разработке.',
          // подписи для скринридеров и всплывающие подсказки у кнопок окон и у кнопок ▲ / ▼ в Pong
          aMin: 'Свернуть',
          aMax: 'Развернуть',
          aClose: 'Закрыть',
          aUp: 'Вверх',
          aDown: 'Вниз',
          // подпись на кнопке языка — язык, НА КОТОРЫЙ переключимся при нажатии
          other: 'ENG',
          // Pong: подсказка по управлению, надписи «Победа», «Поражение» и «Пауза»
          pongHint: 'Управление: W/S, ↑/↓, кнопки ниже или палец по полю. До 7 очков.',
          pWin: 'Победа!',
          pLose: 'Поражение',
          pPause: 'Нажмите, чтобы играть',
          // окно MS-DOS: заголовок, кнопки, подсказка, надписи списка и строки состояния
          tDos: 'MS-DOS',
          dosOpen: 'Открыть файл…',
          dosReset: 'Перезапуск',
          dosFull: 'На весь экран',
          dosHint: 'Клавиатура работает внутри экрана DOS (Esc — тоже). Свою игру можно открыть кнопкой «Открыть файл…» (.jsdos). Закрыть окно — кнопка ×.',
          dosTouch: 'На телефоне нет клавиатуры для ввода текста — есть только кнопки выше. Касание экрана двигает мышь, быстрый тап — клик.',
          // студия .jsdos (сборка набора из zip)
          dosStudio: 'Студия .jsdos (собрать из zip)',
          dosStudioStat: 'Студия: набор .jsdos собирается из zip-архива с игрой',
          stZip: '1. Zip-архив с игрой',
          stExe: '2. Что запускать',
          stCyc: 'Скорость процессора (cycles)',
          stTest: 'Проверить',
          stSave: 'Скачать .jsdos',
          stRead: 'Читаю архив…',
          stBad: 'Не удалось прочитать архив — это точно zip?',
          stHave: 'В архиве уже есть папка .jsdos — это готовый набор, собирать ничего не нужно.',
          stNoExe: 'В архиве нет файлов .exe / .com / .bat — запускать нечего.',
          stFound: 'Найдено файлов для запуска: {n}. Выберите нужный и нажмите «Проверить».',
          stBuild: 'Собираю…',
          stTested: 'Запущено. Чтобы вернуться в студию, выберите «Студия .jsdos» в списке.',
          stSaved: 'Готово, файл скачан. Положите его в assets/games/ и добавьте строку в DOS_GAMES.',
          stLibErr: 'Не удалось загрузить библиотеку для работы с zip.',
          dosMouseOn: 'Мышь: вкл',
          dosMouseOff: 'Мышь: выкл',
          // сохранения игры
          dosSave: 'Сохранить',
          dosExp: 'В файл',
          dosImp: 'Из файла…',
          dosDel: 'Удалить сохранение',
          svSavedShort: 'Сохранено в кэш браузера',
          svSaved: 'Сохранение записано в кэш этого браузера. Оно хранится только на этом устройстве и пропадёт, если очистить данные сайта или открыть игру в другом браузере. Чтобы не потерять — кнопка «В файл».',
          svLoaded: 'Загружено сохранение из кэша этого браузера. Чтобы начать игру с чистого листа — кнопка «Удалить сохранение».',
          svNone: 'Нечего сохранять: в игре пока нет изменений.',
          svFile: 'Файл сохранения скачан. Вернуть его в игру можно кнопкой «Из файла…» — в любом браузере и на любом устройстве.',
          svNoData: 'Сохранения ещё нет — сначала нажмите «Сохранить».',
          svImported: 'Сохранение из файла загружено в кэш браузера, игра перезапущена.',
          svDeleted: 'Сохранение удалено из кэша, игра перезапущена с чистого листа.',
          svConfirm: 'Удалить сохранение этой игры из кэша браузера?',
          svBad: 'Не удалось прочитать файл: это не файл сохранения.',
          dosEmpty: 'Командная строка DOS',
          dosLoading: 'Загрузка эмулятора…',
          dosRun: 'Эмулятор запущен',
          dosIdle: 'Эмулятор остановлен',
          empty: 'Папка пуста',
          up: 'Вверх',
          notepad: ' — Блокнот'
        },

        // ---------- English ----------
        en: {
          start: 'Start',
          iAbout: 'About me',
          iMail: 'Contacts',
          iFolder: 'New Folder',
          tAbout: 'About.txt - Notepad',
          aboutTxt: 'This is a small project by Vladimir “Syir” Maasdam and a self‑taught developer who is also his best friend,' +
              ' Evgeny (Dusty).' + '\n' + 'Several game projects originate here, under the guidance of absolute amateurs who love to have fun.' + '\n' +
              ' Join our Discord server and stay up to date with the news!!',
          cookies: 'We do not use cookies. (Probably...)',
          mcDesc: 'Survival mode with custom plugins.',
          mcDesc2: 'Come on, went in and came out. Twenty minute adventure.',
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
          mailto: 'Mail to',
          warn: 'Warning',
          wip: 'The site and the entire project are under development.',
          aMin: 'Minimize',
          aMax: 'Maximize',
          aClose: 'Close',
          aUp: 'Up',
          aDown: 'Down',
          other: 'РУС',
          pongHint: 'Controls: W/S, ↑/↓, the buttons below or drag on the field. First to 7.',
          pWin: 'You win!',
          pLose: 'You lose',
          pPause: 'Click to play',
          tDos: 'MS-DOS',
          dosOpen: 'Open file…',
          dosReset: 'Restart',
          dosFull: 'Fullscreen',
          dosHint: 'The keyboard works inside the DOS screen (Esc too). You can open your own game with “Open file…” (.jsdos). To close the window use ×.',
          dosTouch: 'There is no keyboard for typing text on a phone — only the buttons above. Touching the screen moves the mouse, a quick tap clicks.',
          dosStudio: 'Studio: make .jsdos from zip',
          dosStudioStat: 'Studio: builds a .jsdos bundle from a zip with the game',
          stZip: '1. Zip archive with the game',
          stExe: '2. What to run',
          stCyc: 'CPU speed (cycles)',
          stTest: 'Test',
          stSave: 'Download .jsdos',
          stRead: 'Reading the archive…',
          stBad: 'Could not read the archive — is it really a zip?',
          stHave: 'The archive already has a .jsdos folder — it is a ready bundle, nothing to build.',
          stNoExe: 'No .exe / .com / .bat files in the archive — nothing to run.',
          stFound: 'Files to run found: {n}. Pick one and press “Test”.',
          stBuild: 'Building…',
          stTested: 'Running. To come back to the studio, choose “Studio” in the list.',
          stSaved: 'Done, the file is downloaded. Put it into assets/games/ and add a line to DOS_GAMES.',
          stLibErr: 'Could not load the zip library.',
          dosMouseOn: 'Mouse: on',
          dosMouseOff: 'Mouse: off',
          dosSave: 'Save',
          dosExp: 'To file',
          dosImp: 'From file…',
          dosDel: 'Delete save',
          svSavedShort: 'Saved to the browser cache',
          svSaved: 'The save was written to this browser’s cache. It lives only on this device and will be lost if you clear the site data or open the game in another browser. To keep it safe, use “To file”.',
          svLoaded: 'A save from this browser’s cache was loaded. To start the game from scratch, use “Delete save”.',
          svNone: 'Nothing to save: there are no changes in the game yet.',
          svFile: 'The save file was downloaded. You can put it back with “From file…” — in any browser, on any device.',
          svNoData: 'There is no save yet — press “Save” first.',
          svImported: 'The save from the file was loaded into the browser cache, the game was restarted.',
          svDeleted: 'The save was deleted from the cache, the game restarted from scratch.',
          svConfirm: 'Delete this game’s save from the browser cache?',
          svBad: 'Could not read the file: it is not a save file.',
          dosEmpty: 'DOS command prompt',
          dosLoading: 'Loading the emulator…',
          dosRun: 'Emulator is running',
          dosIdle: 'Emulator is stopped',
          empty: 'This folder is empty',
          up: 'Up',
          notepad: ' - Notepad'
        }
      };

      // Текущий язык. По умолчанию русский; сохранённый выбор берётся из localStorage,
      // а если его нет — язык браузера (английский, если он начинается с «en»).
      // try/catch — на случай, когда localStorage недоступен (приватный режим и т.п.)
      let lang = 'ru';
      try {
        lang = localStorage.getItem('lang') || ((navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'ru')
      } catch (e) { }
      // В localStorage мог оказаться посторонний язык (старая версия сайта, ручная правка) —
      // без этой проверки t() падала бы с ошибкой и сайт не запускался вовсе
      if (!T[lang]) lang = 'ru';

      // t(k)      — перевод строки по ключу k на текущем языке (если ключа нет — русский текст, а в крайнем случае сам ключ)
      // small()   — true на узком экране (мобильная раскладка, ширина до 640px)
      // coarse    — медиазапрос «основной указатель грубый» (палец, сенсорный экран)
      const t = k => T[lang][k] ?? T.ru[k] ?? k,
        small = () => matchMedia('(max-width:640px)').matches,
        coarse = matchMedia('(pointer:coarse)');

      // wins — все окна;
      // z    — счётчик z-index: каждое активированное окно получает значение на 1 больше и оказывается сверху;
      // cur  — сейчас активное окно (или null)
      const wins = $$('.win'); let z = 10, cur = null;


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
        // подписи (для скринридеров) и подсказки у кнопок «свернуть / развернуть / закрыть» и ▲ / ▼
        $$('.tbb [data-act]').forEach(b => { const s = t({ min: 'aMin', max: 'aMax', close: 'aClose' }[b.dataset.act]); b.setAttribute('aria-label', s); b.title = s });
        [['pu', 'aUp'], ['pd', 'aDown']].forEach(([id, k]) => { const b = $('#' + id); b.setAttribute('aria-label', t(k)); b.title = t(k) });
        if (typeof relabelFolders === 'function') relabelFolders(); if (typeof relabelDos === 'function') relabelDos(); clk(); tasks(); lay()                                                     // часы, панель задач, отступ окон на мобильном
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
        place(w);
        // на телефоне открытое окно одно: сворачиваем все остальные открытые
        if (small()) wins.forEach(x => {
          if (x !== w && x.classList.contains('open') && !x.classList.contains('min')) min(x)
        });
        focus(w)
      }

      // Начальное место окна на широком экране. Выбирается один раз — когда окно впервые показано на широком экране
      // (флаг data-p). На телефоне место задаёт CSS, поэтому флаг не ставится: если потом экран расширят,
      // окно получит нормальное место, а не окажется в левом верхнем углу под ярлыками.
      // Уже размещённое окно просто возвращаем в границы экрана (его могли закрыть, пока экран был меньше)
      function place(w) {
        if (small()) return fit(w);   // на телефоне место задаёт CSS; сдвинутое пальцем окно только возвращаем в экран
        if (w.dataset.p) return fit(w);
        w.dataset.p = 1;
        if (w.id === 'err') {
          // окно предупреждения — ровно по центру экрана (по вертикали — центр области над панелью задач), как системное сообщение
          w.style.left = Math.max(0, (innerWidth - w.offsetWidth) / 2) + 'px';
          w.style.top = Math.max(8, (innerHeight - 40 - w.offsetHeight) / 2) + 'px'
        }
        else rnd(w)   // остальные окна — в «случайное, но удачное» место
      }

      // Вернуть окно w целиком в пределы экрана (над панелью задач). Нужно при уменьшении окна браузера:
      // иначе окна, стоявшие у правого/нижнего края, уезжают за экран. Развёрнутые окна не трогаем
      function fit(w) {
        // на узком экране позицию имеют только сдвинутые пальцем окна (.moved); остальные ставит CSS
        if ((small() && !w.classList.contains('moved')) || w.classList.contains('max') || !w.offsetWidth) return;
        w.style.left = Math.max(0, Math.min(w.offsetLeft, innerWidth - w.offsetWidth)) + 'px';
        w.style.top = Math.max(0, Math.min(w.offsetTop, innerHeight - w.offsetHeight - 40)) + 'px'
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
        tasks();
        // Окно предупреждения закрыть насовсем нельзя — как настоящая системная ошибка, оно появляется снова
        if (w === errWin) respawnErr()
      }

      // errWin     — окно предупреждения (#err);
      // ERR_DELAY  — через сколько миллисекунд оно возвращается после закрытия (кнопки × и OK, клавиша Esc);
      // errTimer   — таймер возвращения (чтобы не запустить два сразу)
      const errWin = $('#err'), ERR_DELAY = 800; let errTimer = 0;

      // Вернуть окно предупреждения после короткой паузы. Флаг data-p сбрасываем, чтобы оно снова встало по центру
      // экрана (даже если его успели перетащить в угол), а open() выдвинул его поверх всех окон и сделал активным
      function respawnErr() {
        clearTimeout(errTimer);
        errTimer = setTimeout(() => { delete errWin.dataset.p; open('err') }, ERR_DELAY)
      }


      // ======================================================================
      // КОПИРОВАНИЕ В БУФЕР ОБМЕНА
      // ======================================================================

      // Запасной способ копирования (для старых браузеров и http-страниц):
      // создаём невидимое текстовое поле, выделяем в нём текст и выполняем команду copy
      function fb(s) {
        const a = document.createElement('textarea');
        a.value = s;
        // -webkit-user-select нужен Safari: у body выделение отключено, и без него поле нельзя выделить, а значит и скопировать.
        // readonly — чтобы на телефоне не выезжала экранная клавиатура
        a.readOnly = true;
        a.style.cssText = 'position:fixed;opacity:0;user-select:text;-webkit-user-select:text';
        document.body.append(a);
        a.select();
        a.setSelectionRange(0, s.length);   // select() одного мало для iOS
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
      // ПОВЕДЕНИЕ ОКОН: активация, разворот (кнопка «□», на компьютере ещё двойной клик по заголовку), перетаскивание
      // (мышью, а на телефоне пальцем за заголовок: окно получает класс .moved)
      // ======================================================================
      function wire(w) {
        // Любое нажатие внутри окна делает его активным
        w.addEventListener('pointerdown', () => { if (cur !== w) focus(w) });

        const h = $('.tb', w);   // заголовок окна — за него окно таскают

        // Двойной клик по заголовку — развернуть/вернуть окно (не на телефоне и не для окна предупреждения)
        h.addEventListener('dblclick', e => { if (!e.target.closest('button') && w.id !== 'err' && !small()) w.classList.toggle('max') });

        // Перетаскивание окна за заголовок (мышь, палец, стилус — через pointer events)
        h.addEventListener('pointerdown', e => {
          // не таскаем: если нажата не основная кнопка мыши (правая кнопка открывала «зависшее» перетаскивание),
          // нажата кнопка в заголовке или окно развёрнуто
          if (e.button !== 0 || e.target.closest('button') || w.classList.contains('max')) return;
          // на телефоне окно по умолчанию стоит на месте, которое задаёт CSS; как только его потащили, помечаем классом .moved —
          // с этого момента CSS не фиксирует позицию (left и top пишем сами), а ширина остаётся «почти на весь экран»
          if (small()) w.classList.add('moved');
          // dx, dy — смещение точки нажатия относительно левого верхнего угла окна
          const dx = e.clientX - w.offsetLeft, dy = e.clientY - w.offsetTop; h.setPointerCapture(e.pointerId);
          // mv — движение: ставим окно под указатель, но не даём ему целиком уехать за экран: по горизонтали на экране
          // всегда остаётся не меньше 80px окна, по вертикали — не меньше 80px его верхней части (чтобы можно было
          // «поймать» за заголовок); выше верхнего края экрана окно не уходит
          // На телефоне окно почти во всю ширину экрана, поэтому по горизонтали оно целиком остаётся на экране (двигается в основном вверх-вниз)
          const mv = ev => {
            const x0 = small() ? 0 : 80 - w.offsetWidth, x1 = small() ? Math.max(0, innerWidth - w.offsetWidth) : innerWidth - 80;
            w.style.left = Math.max(x0, Math.min(x1, ev.clientX - dx)) + 'px';
            w.style.top = Math.max(0, Math.min(innerHeight - 80, ev.clientY - dy)) + 'px'
          };
          // up — указатель отпущен ИЛИ касание прервано системой (pointercancel): в обоих случаях браузер снимает «захват»
          // указателя и присылает lostpointercapture. Раньше слушали только pointerup — при отмене касания обработчик
          // движения оставался навсегда, и окно потом следовало за курсором без нажатой кнопки
          const up = () => { h.removeEventListener('pointermove', mv); h.removeEventListener('lostpointercapture', up) };
          h.addEventListener('pointermove', mv); h.addEventListener('lostpointercapture', up)
        })
      }
      wins.forEach(wire);



      // ======================================================================
      // ПАПКИ: одно окно-проводник; вложенные папки открываются В ТОМ ЖЕ окне (как в Проводнике Windows)
      // Всё содержимое описывается деревом FS ниже — HTML для папок писать не нужно.
      // Что может лежать внутри папки (name — строка или { ru: '...', en: '...' }; icon — необязательный эмодзи вместо значка):
      //   { name, items: [ ... ] }   — папка с вложенным содержимым
      //   { name, text: '...' }      — «текстовый файл» (.txt): при открытии появляется окно Блокнота с этим текстом, как «Обо мне»
      //   { name, url: '...' }       — ссылка (открывается в новой вкладке)
      // Двойной клик по папке или файлу — открыть; кнопка «Вверх» (или Backspace) — выйти на уровень выше.
      //
      // chain(уровней, конец) — собирает цепочку из нужного числа вложенных папок, в самой глубокой лежит «конец» —
      // любой элемент из списка выше (файл, ссылка или обычная папка со своим содержимым). Имена уровней — вторым
      // необязательным параметром: функция (номер) => имя либо массив имён (тогда число уровней = длина массива).
      //   chain(5, { name: 'Секрет', text: 'Вы дошли до конца!' })           — 5 папок подряд, в последней файл «Секрет»
      //   chain(['Раз', 'Два', 'Три'], { name: 'Приз', url: 'https://...' })  — 3 папки со своими именами
      // ======================================================================
      function chain(levels, end, name = i => ({ ru: 'Уровень ' + i, en: 'Level ' + i })) {
        const names = Array.isArray(levels) ? levels : Array.from({ length: levels }, (_, k) => name(k + 1));
        return names.reduceRight((inner, n) => ({ name: n, items: [inner] }), end)
      }

      const FS = {
        name: { ru: 'Новая папка', en: 'New folder' },
        items: [
          // Пример: 5 вложенных папок, в самой глубокой лежит текстовый файл. Число 5 и содержимое файла — ваши
          chain(1000,
            { name: { ru: 'Секрет.txt', en: 'Secret.txt' },
              text: { ru: 'О, ты, муж одержимый и помраченный рассудком, кто в гордыне своей мнил,' +
                    'что познал истину, и прошел стезю великого безумия. Ты взирал на бесконечные чертоги папок,' +
                    'дабы в конце пути обрести всеобъемлющее и всепоглощающее НИХУЯ.' +
                    ' Ибо сказано: «Гордость предшествует падению, а надменный дух — гибели».' +
                    'Ныне же нуждаешься ты в палатах белых, в кресте сульфазиновом и в милосердии врачевателей,' +
                    'дабы исцелить разум свой.' + '\n' + '\n' +
                    'Приветик от второго разраба (:' + '\n' +
                    'Можете написать свой отзыв об этом увлекательном аттракционе на почту: vtoroy-razrab@maasdam.online',
                en: 'Oh, you, man possessed and befuddled in mind, who in your pride thought you had found the truth and walked the path of great madness.' +
                    ' You gazed upon the endless halls of folders, so that at the end of the journey you might attain the all‑encompassing and all‑consuming NOTHING.' +
                    ' For it is said: “Pride precedes the fall, and an arrogant spirit leads to ruin.”' +
                    ' Now you need white chambers, a sulfazine cross, and the mercy of healers to heal your mind.' + '\n' +
                    '\n' + 'Hi there from the second developer (:' + '\n' +
                    'You can write your feedback about this exciting attraction to the email: vtoroy-razrab@maasdam.online'}},
            i => ({ ru: 'Новая папка ('+ i +')', en: 'New folder ('+ i +')' }))
        ]
      };

      const FOLDER_ICON = '<svg><use href="#i-folder" /></svg>', NOTE_ICON = '<svg><use href="#i-note" /></svg>';
      const nm = x => typeof x === 'string' ? x : (x[lang] || x.ru);   // имя на текущем языке
      const explorers = [];                                            // все окна-проводники (сейчас одно)

      // Создаёт окно-проводник с корневой папкой root и id окна id
      function folderWin(root, id) {
        const w = document.createElement('section');
        w.className = 'win raised';
        w.id = id;
        w.innerHTML = '<header class="tb"><span class="ti">' + FOLDER_ICON + '</span><span class="tt"></span>' +
          '<span class="tbb"><button data-act="min">_</button><button data-act="max">□</button><button data-act="close">×</button></span></header>' +
          '<div class="body"><div class="ftool"><button class="btn fup"></button><div class="faddr sunken"></div></div><div class="fgrid sunken"></div></div>';
        document.body.append(w);
        wins.push(w); wire(w);
        w._path = [root];                 // путь от корня до текущей папки
        explorers.push(w);
        $('.fup', w).onclick = () => up(w);
        showFolder(w);
        return w
      }

      // На уровень выше (в корне ничего не делает)
      function up(w) { if (w._path.length > 1) { w._path.pop(); showFolder(w) } }

      // Перерисовывает окно w под текущую папку: заголовок, адрес, кнопку «Вверх» и значки внутри
      function showFolder(w) {
        const node = w._path[w._path.length - 1], grid = $('.fgrid', w);
        // заголовок окна (он же подпись на панели задач) и адресная строка; длинный путь сокращаем до последних трёх папок
        $('.tt', w).textContent = nm(node.name);
        const names = w._path.map(n => nm(n.name));
        $('.faddr', w).textContent = (names.length > 3 ? '…\\' : '') + names.slice(-3).join('\\');
        const u = $('.fup', w); u.textContent = '⬆️ ' + t('up'); u.disabled = w._path.length < 2;
        // значки внутри папки
        grid.textContent = '';
        const list = typeof node.items === 'function' ? node.items() : (node.items || []);
        list.forEach(it => {
          const b = document.createElement('button');
          b.className = 'fi';
          b.innerHTML = '<span class="ic">' + (it.icon || (it.url ? '🔗' : it.text !== undefined ? NOTE_ICON : FOLDER_ICON)) + '</span><span></span>';
          $('span:last-child', b).textContent = nm(it.name);
          // ссылка — в новой вкладке; папка — входим в неё в этом же окне
          const go = () => { if (it.url) window.open(it.url, '_blank', 'noopener,noreferrer'); else if (it.text !== undefined) openNote(it, w); else { w._path.push(it); showFolder(w) } };
          b.onclick = () => { $$('.fi.sel', grid).forEach(i => i.classList.remove('sel')); b.classList.add('sel'); if (coarse.matches) go() };
          b.ondblclick = go;
          b.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go() } };
          grid.append(b)
        });
        if (!list.length) { const p = document.createElement('p'); p.className = 'small'; p.textContent = t('empty'); grid.append(p) }
        tasks()   // подпись кнопки окна на панели задач
      }

      // Запрет выделения текста у значков папок и кнопки «Вверх» (дополнение к user-select в CSS: работает и там, где CSS не помог)
      document.addEventListener('selectstart', e => { const n = e.target.nodeType === 1 ? e.target : e.target.parentElement; if (n && n.closest('.fgrid,.ftool .btn')) e.preventDefault() });

      // Backspace — «Вверх» в активном окне-проводнике (в полях ввода не мешает)
      document.addEventListener('keydown', e => { if (e.key === 'Backspace' && cur && explorers.includes(cur) && !e.target.closest('input,textarea')) { e.preventDefault(); up(cur) } });

      // Окно Блокнота для текстового файла it (создаётся один раз, потом открывается то же самое).
      // Оформлено так же, как окно «Обо мне»: серая рамка, значок блокнота, белый «лист» внутри.
      // parent — окно-проводник, из которого открыли файл (Блокнот ставим чуть правее и ниже него)
      const notes = []; let nseq = 0;
      function openNote(it, parent) {
        if (!it._w) {
          const w = document.createElement('section');
          w.className = 'win raised';
          w.id = 'txt' + (++nseq);
          w.innerHTML = '<header class="tb"><span class="ti">' + NOTE_ICON + '</span><span class="tt"></span>' +
            '<span class="tbb"><button data-act="min">_</button><button data-act="max">□</button><button data-act="close">×</button></span></header>' +
            '<div class="body"><div class="doc txt sunken"></div></div>';
          document.body.append(w);
          wins.push(w); wire(w);
          $$('.tbb [data-act]', w).forEach(b => { const s = t({ min: 'aMin', max: 'aMax', close: 'aClose' }[b.dataset.act]); b.setAttribute('aria-label', s); b.title = s });
          it._w = w; notes.push(it);
          labelNote(it);
          if (parent && !small()) { w.dataset.p = 1; w.style.left = (parent.offsetLeft + 40) + 'px'; w.style.top = (parent.offsetTop + 40) + 'px' }
        }
        open(it._w.id)   // open() сам вернёт окно в границы экрана
      }
      // Заголовок «Имя.txt — Блокнот» и текст файла на текущем языке
      function labelNote(it) { $('.tt', it._w).textContent = nm(it.name) + t('notepad'); linkify($('.doc', it._w), nm(it.text)) }

      // Кладёт текст в элемент el, превращая e-mail и телефоны в кликабельные ссылки (mailto: и tel:).
      // Ссылки создаются через DOM (textContent), поэтому любой посторонний текст остаётся просто текстом, а не разметкой.
      //   e-mail:   имя@домен.зона
      //   телефон:  от 10 цифр, допускаются +, пробелы, скобки, дефисы и точки: +7 (926) 930-08-19
      function linkify(el, text) {
        el.textContent = '';
        const re = /([\w.+-]+@[\w-]+(?:\.[\w-]+)+)|(\+?\d[\d ().-]{8,}\d)/g;
        let last = 0, m;
        while ((m = re.exec(text))) {
          if (m.index > last) el.append(text.slice(last, m.index));
          const a = document.createElement('a');
          a.textContent = m[0];
          a.href = m[1] ? 'mailto:' + m[0] : 'tel:' + m[0].replace(/[^\d+]/g, '');
          el.append(a);
          last = re.lastIndex
        }
        el.append(text.slice(last))
      }

      // Окно «folder» создаётся сразу, чтобы ярлык с data-open="folder" работал как все остальные
      folderWin(FS, 'folder');

      // Смена языка: перерисовываем проводники (вызывается из setLang)
      function relabelFolders() { explorers.forEach(showFolder); notes.forEach(labelNote) }

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

      // Клавиша Esc: если открыто меню «Пуск» — закрывает его, иначе закрывает активное окно
      document.addEventListener('keydown', e => {
        if (e.key !== 'Escape') return;
        // Esc нужен самой DOS-программе (многие игры выходят в меню по Esc) — окно DOS им не закрываем; оно закрывается кнопкой ×
        if (cur === dosWin && dosFrame) return;
        const s = $('#start');
        if (!s.hidden) { s.hidden = true; $('#sbtn').classList.remove('on') }
        else if (cur) close(cur)
      });

      // Часы в трее: часы и минуты по правилам текущего языка (по-русски «14:05», по-английски «02:05 PM»)
      function clk() { $('#clock').textContent = new Date().toLocaleTimeString(lang === 'en' ? 'en-US' : 'ru-RU', { hour: '2-digit', minute: '2-digit' }) }
      // Обновляем часы каждые 15 секунд
      setInterval(clk, 15000);


      // ======================================================================
      // ФОН: «ЖИВОЙ СЫР»
      // Картинка — тот же сыр, что в assets/background.svg: светло-жёлтый фон и мягкие янтарные дырки.
      // Формы и градиенты дырок скопированы из этого SVG в assets/background-holes.js и попадают сюда как window.CHEESE.
      // Каждая дырка заранее «печётся» в маленькую картинку-спрайт (bake), а в каждом кадре спрайты рисуются заново (bgDraw):
      //   — весь узор медленно плывёт вверх (плитка бесшовная, поэтому за краем он «заворачивается» с другой стороны);
      //   — каждая дырка ещё немного блуждает, «дышит» (чуть растёт и сжимается), слегка вытягивается и покачивается.
      // Блуждание заранее рассчитано так, чтобы соседние дырки не наезжали друг на друга и узор оставался похожим на SVG.
      // Если background-holes.js не загрузился — остаётся статичный SVG, заданный у body в style.css.
      // ======================================================================

      // bg — холст фона, bc — его 2D-контекст; reduce — пользователь просит отключить анимации в системе;
      // CH — данные дырок (из assets/background-holes.js); t0 — момент запуска страницы (от него считается время анимации)
      const bg = $('#bg'), bc = bg.getContext('2d'), reduce = matchMedia('(prefers-reduced-motion:reduce)').matches, CH = window.CHEESE, t0 = performance.now();

      // ----- Настройки движения (можно менять) -----
      // DX, DY — скорость общего сноса узора в долях плитки за секунду (минус по Y — вверх; .010 — плитка проплывает за ~100 секунд);
      // WANDER — множитель блуждания дырок: 0 — стоят на месте, 1 — как рассчитано, больше 1 — дырки начнут наезжать друг на друга;
      // BREATH — насколько дырка «дышит»: .05 — радиус меняется на ±5%
      const DX = .004, DY = -.010, WANDER = 1, BREATH = .05;

      // tile — размер одной плитки узора в пикселях холста; zoom — во сколько раз плитка больше, чем в SVG (там 450);
      // spr — готовые спрайты дырок: для каждой дырки [тень, тело]; mot — «характер» каждой дырки: скорости (f) и начальные фазы (p) колебаний.
      // mot создаётся один раз, чтобы при изменении размера окна дырки не «перепрыгивали» на новые места
      let tile = 1, zoom = 1, spr = [];
      const rr = (a, b) => a + Math.random() * (b - a),
        mot = CH ? CH.holes.map(() => ({ f: Array.from({ length: 7 }, () => rr(.09, .24)), p: Array.from({ length: 7 }, () => rr(0, 6.283)) })) : [];

      // Считает отступ сверху (CSS-переменная --wt) для окон на мобильном: сразу под ярлыками
      function lay() { document.documentElement.style.setProperty('--wt', Math.ceil($('#icons').getBoundingClientRect().bottom) + 8 + 'px') }

      // «Выпекает» спрайт одного слоя дырки L (тени или тела): рисует его контур, залитый тем же градиентом, что в SVG
      function bake(L) {
        // [x, y, w, h] — рамка слоя в единицах SVG; по краям запас в 2 единицы, чтобы сглаженный край не обрезался
        const [x, y, w, h] = L.b, c = document.createElement('canvas'), cx = c.getContext('2d');
        c.width = Math.ceil((w + 4) * zoom); c.height = Math.ceil((h + 4) * zoom);
        cx.scale(zoom, zoom); cx.translate(2 - x, 2 - y);   // единицы SVG -> пиксели спрайта
        cx.clip(new Path2D(L.d));                            // красим только внутри контура дырки
        cx.transform(...L.m);                                // в SVG градиент «растянут» и повёрнут матрицей m — применяем её же
        // радиальный градиент: центр и радиус — из SVG, цветовые остановки — из общего списка CH.stops
        const g = cx.createRadialGradient(L.g[0], L.g[1], 0, L.g[0], L.g[1], L.g[2]);
        CH.stops[L.s].forEach(([o, col]) => g.addColorStop(o, col));
        cx.fillStyle = g; cx.fillRect(-1e4, -1e4, 2e4, 2e4);
        return c
      }

      // Инициализация фона: размер холста и спрайты. Вызывается при загрузке и смене размера окна
      function bgInit() {
        if (!CH) return;   // данных нет — остаётся статичный SVG
        // k — плотность пикселей холста: как у экрана, но не больше 2 и не больше ~8,5 млн пикселей всего
        // (на «ретине» чётко, на огромных экранах не тормозит)
        const k = Math.min(devicePixelRatio || 1, 2, Math.sqrt(8.5e6 / (innerWidth * innerHeight)));
        bg.width = Math.round(innerWidth * k); bg.height = Math.round(innerHeight * k);
        // плитка — как если бы SVG открыли на весь экран: по меньшей стороне окна, но не мельче 560px (на телефоне).
        // Та же формула — у background-size в style.css, поэтому статичный SVG и холст совпадают
        tile = Math.max(560, Math.min(innerWidth, innerHeight)) * k; zoom = tile / CH.size;
        // для каждой дырки — два спрайта; x, y — где левый верхний угол спрайта относительно центра дырки (в пикселях холста)
        spr = CH.holes.map(h => ['halo', 'body'].map(n => {
          const L = h[n]; return { c: bake(L), x: (L.b[0] - 2 - h.x) * zoom, y: (L.b[1] - 2 - h.y) * zoom }
        }));
        bgDraw((performance.now() - t0) / 1000)   // сразу рисуем кадр
      }

      // Рисует кадр для момента времени t (в секундах от запуска страницы)
      function bgDraw(t) {
        if (!CH) return;
        const W = bg.width, H = bg.height,
          // e — плавный «разгон»: первые 5 секунд движение нарастает от нуля, поэтому узор «оживает» из статичного SVG без рывка;
          // mv — множитель блуждания/дыхания (при «уменьшении движения» всегда 0 — рисуется неподвижный узор, точь-в-точь как в SVG)
          e = reduce ? 0 : Math.min(1, t / 5), mv = e * e * (3 - 2 * e),
          // общий снос узора в пикселях (при «уменьшении движения» — ноль)
          ox = reduce ? 0 : DX * t * tile, oy = reduce ? 0 : DY * t * tile;

        // Шаг 1. Для каждой дырки считаем положение и форму в этот момент
        const st = CH.holes.map((h, i) => {
          const f = mot[i].f, p = mot[i].p, wv = j => Math.sin(f[j] * t + p[j]),
            // w — размах блуждания в пикселях (.7071 = √2/2: так сдвиг по X и по Y вместе не больше h.a)
            w = h.a * zoom * WANDER * mv * .7071,
            // dx, dy — сдвиг дырки: основное колебание плюс небольшое «дрожание» с другой скоростью
            dx = w * (.75 * wv(0) + .25 * wv(1)), dy = w * (.75 * wv(2) + .25 * wv(3)),
            // s — «дыхание» (общий масштаб), q — вытягивание (по X растёт, по Y сжимается и наоборот), r — поворот в радианах
            s = 1 + BREATH * mv * wv(4), q = .02 * mv * wv(5), r = .05 * mv * wv(6),
            co = Math.cos(r), si = Math.sin(r), sx = s * (1 + q), sy = s * (1 - q);
          return {
            // центр дырки: исходное место плюс общий снос, «завёрнутый» в пределы плитки, плюс блуждание
            x: ((h.x * zoom + ox) % tile + tile) % tile + dx, y: ((h.y * zoom + oy) % tile + tile) % tile + dy,
            m: [sx * co, sx * si, -sy * si, sy * co]   // матрица поворота и растяжения
          }
        });

        // Шаг 2. Рисуем: сначала фон, потом тени всех дырок, потом тела всех дырок —
        // тогда тень одной дырки никогда не ложится поверх тела другой
        bc.setTransform(1, 0, 0, 1, 0, 0);
        bc.fillStyle = CH.color; bc.fillRect(0, 0, W, H);
        for (let n = 0; n < 2; n++) st.forEach((o, i) => {
          const s = spr[i][n], c = s.c,
            // ex, ey — как далеко спрайт заходит от центра дырки (с запасом на растяжение): по ним пропускаем невидимые копии
            ex = Math.max(-s.x, s.x + c.width) * 1.2, ey = Math.max(-s.y, s.y + c.height) * 1.2;
          // плитка бесшовная: рисуем дырку во всех «копиях» плиток, которые попадают на экран
          for (let X = o.x - tile; X - ex < W; X += tile) {
            if (X + ex < 0) continue;
            for (let Y = o.y - tile; Y - ey < H; Y += tile) {
              if (Y + ey < 0) continue;
              bc.setTransform(o.m[0], o.m[1], o.m[2], o.m[3], X, Y); bc.drawImage(c, s.x, s.y)
            }
          }
        });
        bc.setTransform(1, 0, 0, 1, 0, 0)
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

      // Один маленький шаг физики: dt — длительность шага в секундах
      function pongPhys(dt) {
        // m — направление движения ракетки игрока: -1 вверх, 1 вниз, 0 стоит; скорость 270 px/сек
        const m = (K.up || K.bu ? -1 : 0) + (K.dn || K.bd ? 1 : 0); P.y = cl(P.y + m * 270 * dt, 0, PH - PD);
        // «Искусственный интеллект» компьютера: tg — желаемое положение ракетки.
        // Если мяч летит к компьютеру — следит за мячом, иначе возвращается к центру.
        // Скорость ракетки ограничена 125 px/сек — поэтому её можно обыграть
        const tg = P.vx > 0 ? P.by - PD / 2 : PH / 2 - PD / 2; P.ay = cl(P.ay + cl(tg - P.ay, -200 * dt, 200 * dt), 0, PH - PD);
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

      // Один кадр игры: dt — сколько секунд прошло с прошлого кадра. Здесь и расчёт, и отрисовка
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
            // Физику считаем шагами не длиннее 1/120 сек. На медленных устройствах кадр может длиться до 0,05 сек,
            // а мяч на максимальной скорости (400 px/сек) за это время пролетает 20px — больше «зоны» ракетки,
            // и он пролетал бы сквозь неё. Мелкие шаги это исключают
            for (let r = dt; r > 1e-6 && !P.over; r -= 1 / 120) pongPhys(Math.min(r, 1 / 120))
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
      // (рамка холста 2px входит в getBoundingClientRect, поэтому вычитаем её: иначе ракетка сдвигалась бы на пару пикселей)
      let dr = false; const mvp = e => { const r = pc.getBoundingClientRect(); P.y = cl((e.clientY - r.top - pc.clientTop) / pc.clientHeight * PH - PD / 2, 0, PH - PD) };
      pc.addEventListener('pointerdown', e => { dr = true; pc.setPointerCapture(e.pointerId); mvp(e) });
      pc.addEventListener('pointermove', e => { if (dr) mvp(e) }); ['pointerup', 'pointercancel'].forEach(ev => pc.addEventListener(ev, () => dr = false));

      // Первая подача — в сторону компьютера
      serve(1);


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
      const DOS_PLAYER = 'assets/jsdos/player.html';

      // dosWin, dosScreen, dosSel, dosStat, dosFile — окно, место под <iframe>, список программ, строка состояния, скрытое поле выбора файла
      const dosWin = $('#dos'), dosScreen = $('#dscreen'), dosSel = $('#dsel'), dosStat = $('#dstat'), dosFile = $('#dfile');

      // dosFrame    — <iframe> с эмулятором (null — эмулятор сейчас не запущен);
      // dosPick     — что выбрано в списке: '0' — пустой DOS, '1', '2'... — номер игры из DOS_GAMES, 'f' — файл с компьютера;
      // dosBlob     — внутренний адрес (blob:) выбранного с компьютера файла, dosFileName — его имя (показываем в списке);
      // dosStatKey  — ключ перевода текущей надписи в строке состояния (чтобы перевести её при смене языка);
      // dosPaused   — эмулятор сейчас на паузе (окно свёрнуто)
      // dosMouse — мышь включена (true) или не передаётся в игру (false); см. кнопку «Мышь» ниже
      let dosMouse = true;
      // dosKey — ключ сохранений текущей игры ('' — сохранений нет); dosFileSize — размер файла с компьютера (входит в ключ);
      // dosNoted — плашка про кэш уже показывалась в этот сеанс (показываем один раз, чтобы не надоедать)
      let dosKey = '', dosFileSize = 0, dosNoted = false;
      let dosFrame = null, dosPick = '0', dosBlob = '', dosFileName = '', dosStatKey = 'dosIdle', dosPaused = false;

      // Надпись в строке состояния по ключу перевода
      function setStat(k) { dosStatKey = k; dosStat.textContent = t(k) }

      // Заполняет список программ на текущем языке (вызывается и из setLang при смене языка), сохраняя выбранный пункт
      function relabelDos() {
        dosSel.textContent = '';
        const add = (v, label) => { const o = document.createElement('option'); o.value = v; o.textContent = label; dosSel.append(o) };
        add('0', t('dosEmpty'));
        DOS_GAMES.forEach((g, i) => add(String(i + 1), nm(g.name)));
        add('s', t('dosStudio'));
        if (dosFileName) add('f', '📁 ' + dosFileName);
        dosSel.value = dosPick;
        setStat(dosStatKey);
        stSay(stMsgKey, stMsgN);
        $('#dmouse').textContent = t(dosMouse ? 'dosMouseOn' : 'dosMouseOff')
      }

      // Вернуть клавиатурный фокус эмулятору (иначе клавиши после клика по панели окна уходили бы в страницу сайта)
      function dosFocus() { try { dosFrame.contentWindow.focus() } catch (e) { } }

      // Выгрузить эмулятор: удаляем <iframe> — браузер останавливает всё, что в нём работало (эмулятор, звук)
      function dosKill() { if (dosFrame) { dosFrame.remove(); dosFrame = null } }

      // Запустить (или перезапустить) выбранную программу в новом <iframe>
      function dosStart() {
        dosKill();
        // Выбрана «Студия»: вместо экрана показываем панель сборки, эмулятор не запускаем
        showStudio(dosPick === 's');
        if (dosPick === 's') { setStat('dosStudioStat'); return }
        // адрес набора: для игры из списка — абсолютный (страница эмулятора лежит в другой папке, относительный не подошёл бы), для файла с компьютера — blob:
        let url = '';
        if (dosPick === 'f') url = dosBlob;
        else if (dosPick !== '0') url = new URL(DOS_GAMES[dosPick - 1].url, location.href).href;
        const f = document.createElement('iframe');
        f.title = 'MS-DOS';
        f.allow = 'fullscreen; autoplay';
        f.allowFullscreen = true;
        // Ключ сохранений: для игры из списка — её путь без «?v=...», для файла с компьютера — имя и размер. У «пустого DOS» сохранений нет
        dosKey = '';
        if (dosPick === 'f') dosKey = 'file:' + dosFileName + ':' + dosFileSize;
        else if (dosPick !== '0') dosKey = 'game:' + DOS_GAMES[dosPick - 1].url.split('?')[0];
        $('#dsaves').hidden = !dosKey;
        f.src = DOS_PLAYER + (url ? '?url=' + encodeURIComponent(url) + (dosKey ? '&key=' + encodeURIComponent(dosKey) : '') : '');
        f.onload = () => {
          setStat('dosRun');
          // Клик внутри <iframe> не доходит до страницы сайта, поэтому «активным» (наверх, с синим заголовком) окно DOS делаем сами
          try { f.contentWindow.addEventListener('pointerdown', () => { if (cur !== dosWin) focus(dosWin) }) } catch (e) { }
          dosFocus()
        };
        setStat('dosLoading');
        dosScreen.append(f);
        dosFrame = f; dosPaused = false;
        dosApplyMouse()
      }

      // Следим за состоянием окна (классы open / min меняют функции open, min и close выше), чтобы не трогать их код:
      //   открыто — запускаем эмулятор;  закрыто — выгружаем и сбрасываем выбор;  свёрнуто — пауза, развёрнуто обратно — продолжаем
      new MutationObserver(() => {
        const isOpen = dosWin.classList.contains('open'), isMin = dosWin.classList.contains('min');
        // развёрнутость снята (кнопка «□» или закрытие окна) — выходим и из программного полного экрана (.dsoft)
        // (проверка обязательна: даже «пустое» снятие класса считается изменением атрибута и заново запускало бы этот же наблюдатель — бесконечно)
        if (dosWin.classList.contains('dsoft') && !dosWin.classList.contains('max')) dosWin.classList.remove('dsoft');
        if (!isOpen) {
          // сбрасываем всегда (даже если эмулятор не запущен — например, была открыта студия); все действия безопасно повторять
          dosKill();
          if (dosBlob) { URL.revokeObjectURL(dosBlob); dosBlob = '' }
          dosPick = '0'; dosFileName = ''; dosMouse = true; dosNoted = false;
          $('#dsaves').hidden = $('#dnote').hidden = true;
          studioReset(); showStudio(false);
          relabelDos(); setStat('dosIdle');
          return
        }
        if (!dosFrame) { dosStart(); return }
        if (isMin !== dosPaused) {
          dosPaused = isMin;
          try { dosFrame.contentWindow.dosPause(isMin) } catch (e) { }
          if (!isMin) dosFocus()
        }
      }).observe(dosWin, { attributes: true, attributeFilter: ['class'] });

      // Мышь: когда выключена, <iframe> с эмулятором перестаёт принимать указатель (pointer-events: none) —
      // движения и клики мыши до игры не доходят (клик по экрану по-прежнему делает окно активным и возвращает клавиатуру игре)
      function dosApplyMouse() {
        if (dosFrame) dosFrame.style.pointerEvents = dosMouse ? '' : 'none';
        $('#dmouse').textContent = t(dosMouse ? 'dosMouseOn' : 'dosMouseOff')
      }
      $('#dmouse').onclick = () => { dosMouse = !dosMouse; dosApplyMouse(); dosFocus() };

      // Выбрали другую программу в списке — запускаем её. Мышь включаем, если для игры в DOS_GAMES не указано mouse: false
      dosSel.onchange = () => {
        dosPick = dosSel.value;
        const g = DOS_GAMES[dosPick - 1];
        dosMouse = !(g && g.mouse === false);
        dosStart()
      };

      // «Открыть файл…»: кнопка открывает скрытое поле выбора файла; выбранный .jsdos / .zip запускаем из памяти браузера
      $('#dopen').onclick = () => dosFile.click();
      dosFile.onchange = () => {
        const f = dosFile.files[0];
        if (!f) return;
        if (dosBlob) URL.revokeObjectURL(dosBlob);
        dosBlob = URL.createObjectURL(f); dosFileName = f.name; dosFileSize = f.size; dosPick = 'f';
        dosFile.value = '';   // чтобы тот же файл можно было выбрать ещё раз
        dosMouse = true;
        relabelDos(); dosStart()
      };

      // «Перезапуск»: та же программа с самого начала
      $('#dreset').onclick = () => dosStart();

      // «На весь экран». Два способа:
      //   • компьютер: настоящий полноэкранный режим браузера для <iframe> с эмулятором;
      //   • телефон / планшет (сенсорный экран) и браузеры без полноэкранного режима (iPhone): «программный» полный экран —
      //     окно разворачивается на весь экран (как кнопкой «□»), лишнее прячется (класс .dsoft), остаются экран и пульт.
      //     Настоящий полноэкранный режим тут не годится: он показал бы только эмулятор без экранного пульта, и играть было бы нечем.
      //     Выйти — кнопка «□» в заголовке окна
      const fsOk = !!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen);
      $('#dfull').onclick = () => {
        const f = dosFrame;
        if (!f) return;
        const go = f.requestFullscreen || f.webkitRequestFullscreen;
        if (go && fsOk && !coarse.matches) {
          const r = go.call(f);
          // В полноэкранном режиме просим браузер (Chrome, Edge) отдавать Esc странице, а не выходить из полного экрана:
          // иначе Esc в играх выкидывал бы из полноэкранного режима. Выйти можно, удерживая Esc, или кнопкой браузера
          if (r && r.then) r.then(() => { try { navigator.keyboard.lock(['Escape']).catch(() => { }) } catch (e) { } }).catch(() => { })
        } else {
          const on = !dosWin.classList.contains('dsoft');
          dosWin.classList.toggle('dsoft', on);
          dosWin.classList.toggle('max', on)
        }
        dosFocus()
      };
      // Вышли из полноэкранного режима — отпускаем захват клавиши
      document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement) { try { navigator.keyboard.unlock() } catch (e) { } } });

      // Экранный пульт (телефоны): пока кнопка зажата, в эмулятор уходит «клавиша нажата», при отпускании — «отпущена».
      // Эмулятор слушает обычные события клавиатуры своей страницы (keyCode), поэтому отправляем ему такие же события
      $$('#dpad [data-k]').forEach(b => {
        const code = +b.dataset.k, loc = +(b.dataset.l || 0);
        let down = false;
        const send = type => {
          try {
            const w = dosFrame.contentWindow;
            w.dispatchEvent(new w.KeyboardEvent(type, { keyCode: code, which: code, location: loc, bubbles: true, cancelable: true }))
          } catch (e) { }
        };
        b.addEventListener('pointerdown', e => { e.preventDefault(); if (dosFrame) { down = true; send('keydown') } });
        // отпускание, отмена касания или выход пальца за кнопку — клавиша отпущена (иначе она «залипла» бы в игре)
        ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => b.addEventListener(ev, () => { if (down) { down = false; send('keyup') } }));
        b.addEventListener('contextmenu', e => e.preventDefault())
      });

      // ----------------------------------------------------------------------
      // СТУДИЯ .jsdos: собирает набор из обычного zip с игрой прямо в браузере (на сервер ничего не уходит).
      // Набор .jsdos — это zip, в который добавлены два служебных файла:
      //   .jsdos/dosbox.conf — настройки DOSBox и команды запуска (секция [autoexec])
      //   .jsdos/jsdos.json  — версия формата
      // Порядок: выбрать zip → из списка найденных .exe/.com/.bat выбрать запускаемый → «Проверить» (запуск тут же) или «Скачать .jsdos».
      // Библиотека JSZip (assets/jsdos/jszip.min.js, лицензия MIT) подгружается только при первом выборе архива.
      // ----------------------------------------------------------------------
      const DOS_JSZIP = 'assets/jsdos/jszip.min.js';
      const stZip = $('#szip'), stExe = $('#sexe'), stCyc = $('#scyc'), stTest = $('#stest'), stSave = $('#ssave'), stMsg = $('#smsg');

      // stSrc — загруженный архив (объект JSZip); stName — имя исходного файла без расширения (так назовём результат);
      // stMsgKey / stMsgN — ключ перевода и число для текущего сообщения (чтобы перевести его при смене языка); zipLib — загрузка JSZip
      let stSrc = null, stName = 'game', stMsgKey = '', stMsgN = 0, zipLib = null;

      // Сообщение под кнопками студии ({n} в тексте заменяется числом)
      function stSay(k, n) { stMsgKey = k; stMsgN = n; stMsg.textContent = k ? t(k).replace('{n}', n) : '' }

      // Показать панель студии вместо экрана (и наоборот). В студии нечего перезапускать, на весь экран выводить и нажимать пультом
      function showStudio(on) {
        $('#dstudio').hidden = !on;
        dosScreen.hidden = on;
        $('#dpad').hidden = on;
        if (on) { $('#dsaves').hidden = true; $('#dnote').hidden = true }
        $('#dreset').disabled = $('#dfull').disabled = $('#dmouse').disabled = on
      }

      // Сбросить студию (при закрытии окна): забыть архив и очистить поля
      function studioReset() {
        stSrc = null; stZip.value = '';
        stExe.textContent = '';
        stExe.disabled = stTest.disabled = stSave.disabled = true;
        stSay('')
      }

      // Подгрузить JSZip один раз
      function loadZipLib() {
        if (window.JSZip) return Promise.resolve();
        return zipLib || (zipLib = new Promise((ok, fail) => {
          const sc = document.createElement('script');
          sc.src = DOS_JSZIP; sc.onload = ok; sc.onerror = () => { zipLib = null; fail() };
          document.head.append(sc)
        }))
      }

      // Выбрали zip: читаем его и ищем запускаемые файлы
      stZip.onchange = async () => {
        const f = stZip.files[0];
        if (!f) return;
        stExe.disabled = stTest.disabled = stSave.disabled = true;
        stSay('stRead');
        try { await loadZipLib() } catch (e) { stSay('stLibErr'); return }
        try { stSrc = await JSZip.loadAsync(f) } catch (e) { stSrc = null; stSay('stBad'); return }
        stName = f.name.replace(/\.[^.]+$/, '') || 'game';
        if (Object.keys(stSrc.files).some(n => n.startsWith('.jsdos/'))) { stSay('stHave'); return }
        // запускаемые файлы: сначала лежащие ближе к корню архива, внутри уровня — по алфавиту
        const list = Object.keys(stSrc.files)
          .filter(n => !stSrc.files[n].dir && /\.(exe|com|bat)$/i.test(n))
          .sort((a, b) => a.split('/').length - b.split('/').length || a.localeCompare(b));
        if (!list.length) { stSay('stNoExe'); return }
        stExe.textContent = '';
        list.forEach(n => { const o = document.createElement('option'); o.value = o.textContent = n; stExe.append(o) });
        stExe.disabled = stTest.disabled = stSave.disabled = false;
        stSay('stFound', list.length)
      };

      // Текст dosbox.conf. Путь «папка/подпапка/GAME.EXE» превращается в команды «cd папка\подпапка» и «GAME.EXE»
      function stConf(path) {
        const parts = path.split('/'), file = parts.pop();
        const lines = ['[sdl]', 'autolock=false', '[cpu]', 'core=auto', 'cycles=' + stCyc.value, '[autoexec]', '@echo off', 'mount c .', 'c:'];
        if (parts.length) lines.push('cd ' + parts.join('\\'));
        lines.push(file);
        return lines.join('\n') + '\n'
      }

      // Собрать набор: копия исходного архива + два служебных файла
      async function stBuildBundle() {
        const z = new JSZip();
        for (const n of Object.keys(stSrc.files)) {
          const e = stSrc.files[n];
          if (e.dir) z.folder(n); else z.file(n, await e.async('uint8array'))
        }
        z.file('.jsdos/dosbox.conf', stConf(stExe.value));
        z.file('.jsdos/jsdos.json', '{"version":"8.xx"}');
        return z.generateAsync({ type: 'blob', compression: 'DEFLATE' })
      }

      // «Проверить»: собранный набор запускаем как «файл с компьютера» (экран возвращается, в списке появляется 📁 имя.jsdos)
      stTest.onclick = async () => {
        stSay('stBuild');
        const blob = await stBuildBundle();
        if (dosBlob) URL.revokeObjectURL(dosBlob);
        dosBlob = URL.createObjectURL(blob); dosFileName = stName + '.jsdos'; dosFileSize = 0; dosPick = 'f';
        stSay('stTested');
        relabelDos(); dosStart()
      };

      // «Скачать .jsdos»: отдаём собранный файл браузеру на скачивание
      stSave.onclick = async () => {
        stSay('stBuild');
        const blob = await stBuildBundle();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = stName + '.jsdos';
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 10000);
        stSay('stSaved')
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
      const dosNote = $('#dnote'), dosImpFile = $('#dimpf');

      // Показать жёлтую плашку с текстом по ключу перевода (закрывается кнопкой OK)
      function dosNotify(k) { $('#dnotet').textContent = t(k); dosNote.hidden = false; dosNoted = true }
      $('#dnoteok').onclick = () => { dosNote.hidden = true; dosFocus() };

      // Вызвать функцию страницы эмулятора (они описаны в конце player.html); null — если эмулятор не запущен
      const dosCall = (name, ...a) => { try { return Promise.resolve(dosFrame.contentWindow[name](...a)) } catch (e) { return Promise.resolve(null) } };

      // Сообщения от эмулятора: saved — сохранение записано в кэш, loaded — при запуске подхвачено сохранение из кэша
      window.addEventListener('message', e => {
        if (e.origin !== location.origin || !dosFrame || e.source !== dosFrame.contentWindow || !e.data) return;
        if (e.data.dos === 'saved') { setStat('svSavedShort'); if (!dosNoted) dosNotify('svSaved') }
        else if (e.data.dos === 'loaded' && !dosNoted) dosNotify('svLoaded')
      });

      // «Сохранить»
      $('#dsave').onclick = async () => {
        const ok = await dosCall('dosSaveNow');
        if (!ok) setStat('svNone');
        dosFocus()
      };

      // «В файл»: сохраняем, берём сохранение из кэша и отдаём браузеру на скачивание
      $('#dexp').onclick = async () => {
        await dosCall('dosSaveNow');
        const bytes = await dosCall('dosExport');
        if (!bytes) { setStat('svNoData'); return }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([bytes], { type: 'application/octet-stream' }));
        a.download = (dosFileName || dosKey.replace(/^game:.*\//, '').replace(/\.[^.]*$/, '') || 'game').replace(/\.jsdos$/i, '') + '.save';
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 10000);
        setStat('svFile'); dosNotify('svFile')
      };

      // «Из файла…»: открываем выбор файла; сохранение кладём в кэш и перезапускаем игру, чтобы эмулятор его подхватил
      $('#dimp').onclick = () => dosImpFile.click();
      dosImpFile.onchange = async () => {
        const f = dosImpFile.files[0];
        dosImpFile.value = '';
        if (!f || !dosFrame) return;
        const b = new Uint8Array(await f.arrayBuffer());
        if (b.length < 4 || b[0] !== 0x50 || b[1] !== 0x4B) { setStat('svBad'); return }   // файл сохранения — zip, он начинается с «PK»
        await dosCall('dosImport', b);
        dosStart();
        setStat('svImported'); dosNotify('svImported')
      };

      // «Удалить сохранение»
      $('#ddel').onclick = async () => {
        if (!window.confirm(t('svConfirm'))) return;
        await dosCall('dosDeleteSave');
        dosStart();
        setStat('svDeleted'); dosNotify('svDeleted')
      };

      // Клик по пустому месту окна (заголовок, поля) возвращает клавиатуру эмулятору; по кнопкам и списку — нет, им нужен свой фокус
      dosWin.addEventListener('click', e => { if (dosFrame && !e.target.closest('select,button,input,a')) dosFocus() });


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
        if (!reduce && ts - lt > 33) { lt = ts; bgDraw((ts - t0) / 1000) }
        pongStep(dt)                                               // шаг игры Pong
      }

      // При изменении размера окна браузера:
      //  — сразу пересчитываем отступ окон на мобильном и приводим окна в порядок: на широком экране размещаем окна,
      //    открытые на узком, и возвращаем в экран те, что оказались за его краем; на узком возвращаем в экран сдвинутые пальцем.
      //    «Развёрнутость» не сбрасываем: на телефоне кнопка «□» есть, а размер окна браузера меняется при каждом
      //    сворачивании адресной строки — окно с игрой не должно из-за этого сжиматься;
      //  — фон строим заново не на каждое событие (при перетаскивании края окна их десятки, а «выпекание» 60+ спрайтов
      //    дорогое), а один раз, когда размер перестал меняться
      let rt = 0;
      addEventListener('resize', () => {
        lay();
        wins.forEach(w => {
          if (w.classList.contains('open') && !w.classList.contains('min')) place(w)
        });
        clearTimeout(rt); rt = setTimeout(bgInit, 120)
      });

      // Запуск: строим фон и запускаем цикл анимации
      bgInit(); requestAnimationFrame(tick);

      // Применяем язык (подставляем переводы) и открываем ТОЛЬКО окно предупреждения (на любом экране).
      // Остальные окна пользователь открывает сам — двойным кликом (на телефоне — касанием) по ярлыку или через «Пуск».
      // Закроет предупреждение — оно вернётся (см. respawnErr)
      setLang(lang); open('err');
    })();
