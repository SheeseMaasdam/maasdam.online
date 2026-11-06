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
          // Пример: 1000 вложенных папок, в самой глубокой лежит текстовый файл. Число 1000 и содержимое файла — ваши
          chain(1000,
            { name: { ru: 'Секрет.txt', en: 'Secret.txt' },
              text: { ru: 'О, ты, муж одержимый и помраченный рассудком, кто в гордыне своей мнил, ' +
                    'что познал истину, и прошел стезю великого безумия. Ты взирал на бесконечные чертоги папок, ' +
                    'дабы в конце пути обрести всеобъемлющее и всепоглощающее НИХУЯ.' +
                    ' Ибо сказано: «Гордость предшествует падению, а надменный дух — гибели». ' +
                    'Ныне же нуждаешься ты в палатах белых, в кресте сульфазиновом и в милосердии врачевателей, ' +
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
        $('.fup', w).onclick = () => folderUp(w);
        showFolder(w);
        return w
      }

      // На уровень выше (в корне ничего не делает)
      function folderUp(w) { if (w._path.length > 1) { w._path.pop(); showFolder(w) } }

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
      document.addEventListener('keydown', e => { if (e.key === 'Backspace' && cur && explorers.includes(cur) && !e.target.closest('input,textarea')) { e.preventDefault(); folderUp(cur) } });

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
        openWin(it._w.id)   // openWin() сам вернёт окно в границы экрана
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
