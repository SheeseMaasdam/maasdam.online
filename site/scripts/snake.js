/* Nokia 3310 Snake — standalone module for the Windows 98 desktop site.
   Uses localStorage (not cookies) only for the best score. */
(() => {
  'use strict';
  const root = document.getElementById('snake');
  if (!root || root.dataset.snakeReady === '1') return;
  root.dataset.snakeReady = '1';

  const $ = (selector) => root.querySelector(selector);
  const canvas = $('#snake-canvas');
  const ctx = canvas.getContext('2d');
  const overlay = $('#snake-overlay');
  const overlayKicker = $('#snake-overlay-kicker');
  const overlayTitle = $('#snake-overlay-title');
  const overlayText = $('#snake-overlay-text');
  const overlayAction = $('#snake-overlay-action');
  const scoreNode = $('#snake-score');
  const bestNode = $('#snake-best');
  const lengthNode = $('#snake-length');
  const speedSelect = $('#snake-speed');
  const pauseButton = $('#snake-pause');
  const restartButton = $('#snake-restart');
  const SIZE = 20;
  const CELL = canvas.width / SIZE;
  const BEST_KEY = 'maasdamSnakeBest_v1';
  const SPEEDS = { slow: 190, normal: 135, fast: 92, turbo: 62 };
  const DIRS = {
    up: { x: 0, y: -1 }, down: { x: 0, y: 1 },
    left: { x: -1, y: 0 }, right: { x: 1, y: 0 }
  };
  const TEXT = {
    ru: {
      desktopLabel: 'Змейка', title: 'Змейка — Nokia 3310', scoreLabel: 'СЧЁТ', bestLabel: 'РЕКОРД', lengthLabel: 'ДЛИНА',
      speedLabel: 'СКОРОСТЬ', slow: '1 · МЕДЛЕННО', normal: '2 · НОРМАЛЬНО', fast: '3 · БЫСТРО', turbo: '4 · ТУРБО',
      pause: 'ПАУЗА', resume: 'ДАЛЬШЕ', restart: 'ЗАНОВО', hint: 'Стрелки / WASD · Пробел — пауза',
      kicker: 'ИГРА NOKIA', startTitle: 'ЗМЕЙКА', startText: 'Собирай еду и заполни всё поле. Сможешь занять каждую клетку?', start: 'НАЧАТЬ ИГРУ',
      pausedTitle: 'ПАУЗА', pausedText: 'Передохни. Поле никуда не денется.', continue: 'ПРОДОЛЖИТЬ',
      overTitle: 'ИГРА ОКОНЧЕНА', overText: 'Змейка столкнулась с препятствием. Попробуешь ещё раз?', again: 'ЕЩЁ РАЗ',
      winKicker: 'НЕВЕРОЯТНОЕ ДОСТИЖЕНИЕ', winTitle: 'ПОБЕДА!', winText: 'Ты заполнил всё поле. Ни одной свободной клетки не осталось!', winAction: 'СЫГРАТЬ ЕЩЁ',
      best: 'НОВЫЙ РЕКОРД!', record: 'Рекорд', score: 'Счёт', length: 'Длина',
      speedNames: { slow: 'Медленно', normal: 'Нормально', fast: 'Быстро', turbo: 'Турбо' }
    },
    en: {
      desktopLabel: 'Snake', title: 'Snake — Nokia 3310', scoreLabel: 'SCORE', bestLabel: 'BEST', lengthLabel: 'LENGTH',
      speedLabel: 'SPEED', slow: '1 · SLOW', normal: '2 · NORMAL', fast: '3 · FAST', turbo: '4 · TURBO',
      pause: 'PAUSE', resume: 'RESUME', restart: 'RESTART', hint: 'Arrow keys / WASD · Space to pause',
      kicker: 'NOKIA GAME', startTitle: 'SNAKE', startText: 'Eat, grow, and fill the whole screen. Can you occupy every cell?', start: 'START GAME',
      pausedTitle: 'PAUSED', pausedText: 'Take a breath. Your game is waiting.', continue: 'CONTINUE',
      overTitle: 'GAME OVER', overText: 'The snake hit an obstacle. Want another try?', again: 'TRY AGAIN',
      winKicker: 'INCREDIBLE ACHIEVEMENT', winTitle: 'YOU WIN!', winText: 'You filled the entire board. Not a single empty cell remains!', winAction: 'PLAY AGAIN',
      best: 'NEW RECORD!', record: 'Best', score: 'Score', length: 'Length',
      speedNames: { slow: 'Slow', normal: 'Normal', fast: 'Fast', turbo: 'Turbo' }
    }
  };
  let snake = [];
  let direction = { ...DIRS.right };
  let turnQueue = [];   // очередь поворотов (до 2): быстрые нажатия подряд не теряются
  let food = null;
  let score = 0;
  let best = readBest();
  let state = 'ready';
  let lastStep = 0;
  let accumulator = 0;
  let raf = 0;
  let setNewRecordAtWin = false;

  function lang() { return (document.documentElement.lang || 'ru').toLowerCase().startsWith('en') ? 'en' : 'ru'; }
  function tr(key) { return TEXT[lang()][key] ?? TEXT.ru[key] ?? key; }
  function readBest() {
    try { const value = Number(window.localStorage.getItem(BEST_KEY)); return Number.isFinite(value) && value > 0 ? value : 0; }
    catch (_) { return 0; }
  }
  function saveBest(value) {
    try { window.localStorage.setItem(BEST_KEY, String(value)); return true; }
    catch (_) { return false; }
  }
  function formatScore(value) { return String(value).padStart(3, '0'); }
  function updateStats() {
    scoreNode.textContent = formatScore(score);
    bestNode.textContent = formatScore(best);
    lengthNode.textContent = String(snake.length || 3);
  }
  function updateStaticText() {
    document.querySelectorAll('[data-snake-t]').forEach((node) => {
      const key = node.dataset.snakeT;
      if (key === 'pause') node.textContent = state === 'paused' ? tr('resume') : tr('pause');
      else if (TEXT[lang()][key] !== undefined) node.textContent = tr(key);
    });
    if (state === 'ready') showOverlay('ready');
    else if (state === 'paused') showOverlay('paused');
    else if (state === 'over') showOverlay('over');
    else if (state === 'won') showOverlay('won');
    updateStats();
    // подпись кнопки окна на панели задач берётся из заголовка — обновляем её после перевода
    if (typeof tasks === 'function') tasks();
  }
  function setOverlayContent(kicker, title, text, action) {
    overlayKicker.textContent = kicker;
    overlayTitle.textContent = title;
    overlayText.textContent = text;
    overlayAction.textContent = action;
  }
  function showOverlay(kind) {
    overlay.classList.remove('is-hidden', 'is-victory');
    if (kind === 'ready') setOverlayContent(tr('kicker'), tr('startTitle'), tr('startText'), tr('start'));
    if (kind === 'paused') setOverlayContent(tr('kicker'), tr('pausedTitle'), tr('pausedText'), tr('continue'));
    if (kind === 'over') setOverlayContent(tr('kicker'), tr('overTitle'), tr('overText'), tr('again'));
    if (kind === 'won') {
      overlay.classList.add('is-victory');
      setOverlayContent(tr('winKicker'), tr('winTitle'), `${tr('winText')} ${tr('score')}: ${score} · ${tr('length')}: ${snake.length}${setNewRecordAtWin ? ` · ${tr('best')}` : ''}`, tr('winAction'));
    }
    overlayAction.dataset.action = kind === 'paused' ? 'resume' : 'start';
  }
  function hideOverlay() { overlay.classList.add('is-hidden'); overlay.classList.remove('is-victory'); }
  function resetGame() {
    snake = [{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }];
    direction = { ...DIRS.right };
    turnQueue = [];
    score = 0;
    setNewRecordAtWin = false;
    lastStep = 0;
    accumulator = 0;
    state = 'ready';
    placeFood();
    updateStats();
    draw();
    showOverlay('ready');
    pauseButton.textContent = tr('pause');
  }
  function placeFood() {
    const free = [];
    const occupied = new Set(snake.map((part) => `${part.x},${part.y}`));
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) if (!occupied.has(`${x},${y}`)) free.push({ x, y });
    if (!free.length) { food = null; return false; }
    food = free[Math.floor(Math.random() * free.length)];
    return true;
  }
  function startGame() {
    if (state === 'over' || state === 'won') resetGame();
    state = 'playing';
    hideOverlay();
    pauseButton.textContent = tr('pause');
    lastStep = 0;
    accumulator = 0;
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function togglePause() {
    if (state === 'playing') {
      state = 'paused'; showOverlay('paused'); pauseButton.textContent = tr('resume');
    } else if (state === 'paused') startGame();
    else if (state === 'ready') startGame();
    else if (state === 'over' || state === 'won') { resetGame(); startGame(); }
  }
  function setDirection(name) {
    const proposed = DIRS[name];
    if (!proposed || state !== 'playing' || turnQueue.length >= 2) return;
    // сравниваем с последним поворотом в очереди (а если очередь пуста — с текущим направлением)
    const base = turnQueue.length ? turnQueue[turnQueue.length - 1] : direction;
    if (proposed.x === -base.x && proposed.y === -base.y) return;   // разворот на 180° запрещён
    if (proposed.x === base.x && proposed.y === base.y) return;     // то же направление — ничего не меняет
    turnQueue.push({ ...proposed });
  }
  function step() {
    if (turnQueue.length) direction = turnQueue.shift();
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    const eating = food && head.x === food.x && head.y === food.y;
    const bodyToCheck = eating ? snake : snake.slice(0, -1);
    if (head.x < 0 || head.y < 0 || head.x >= SIZE || head.y >= SIZE || bodyToCheck.some((part) => part.x === head.x && part.y === head.y)) {
      state = 'over'; showOverlay('over'); draw(); return;
    }
    snake.unshift(head);
    if (eating) {
      score += 10;
      if (score > best) { best = score; setNewRecordAtWin = true; saveBest(best); }
      if (!placeFood() || snake.length === SIZE * SIZE) {
        // A filled board is the only victory condition. There is no final food to spawn.
        state = 'won';
        updateStats();
        draw();
        showOverlay('won');
        return;
      }
    } else snake.pop();
    updateStats();
    draw();
  }
  function drawGrid() {
    ctx.fillStyle = '#c7d7a2'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(39,65,38,.10)'; ctx.lineWidth = 1;
    for (let i = 1; i < SIZE; i++) {
      const p = i * CELL + .5;
      ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(canvas.width, p); ctx.stroke();
    }
  }
  function draw() {
    drawGrid();
    if (food) {
      const fx = food.x * CELL, fy = food.y * CELL;
      ctx.fillStyle = '#244b2c'; ctx.fillRect(fx + 2, fy + 2, CELL - 4, CELL - 4);
      ctx.fillStyle = '#c7d7a2'; ctx.fillRect(fx + 5, fy + 5, 3, 3);
      ctx.fillRect(fx + 11, fy + 11, 3, 3);
    }
    snake.forEach((part, index) => {
      const x = part.x * CELL, y = part.y * CELL;
      ctx.fillStyle = index === 0 ? '#102f1b' : '#244b2c';
      ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
      if (index === 0) {
        ctx.fillStyle = '#c7d7a2';
        let eyes;
        if (direction.x) eyes = [{ x: direction.x > 0 ? 13 : 3, y: 4 }, { x: direction.x > 0 ? 13 : 3, y: 11 }];
        else eyes = [{ x: 4, y: direction.y > 0 ? 13 : 3 }, { x: 11, y: direction.y > 0 ? 13 : 3 }];
        eyes.forEach((eye) => ctx.fillRect(x + eye.x, y + eye.y, 2, 2));
      } else {
        ctx.fillStyle = 'rgba(199,215,162,.18)'; ctx.fillRect(x + 3, y + 3, CELL - 6, 2);
      }
    });
  }
  function loop(now) {
    raf = 0;
    if (state !== 'playing') return;
    if (!lastStep) lastStep = now;
    accumulator += Math.min(100, now - lastStep);
    lastStep = now;
    const delay = SPEEDS[speedSelect.value] || SPEEDS.normal;
    while (accumulator >= delay && state === 'playing') { step(); accumulator -= delay; }
    if (state === 'playing') raf = requestAnimationFrame(loop);
  }
  function visibleInDesktop() {
    // Клавиши обрабатываем только когда окно открыто, не свёрнуто и активно (класс .act ставит windows.js).
    // Если модуль открыт вне рабочего стола (нет #icons), он остаётся управляемым с клавиатуры.
    if (!document.querySelector('#icons')) return true;
    return root.classList.contains('open') && !root.classList.contains('min') && root.classList.contains('act');
  }
  overlayAction.addEventListener('click', () => {
    if (overlayAction.dataset.action === 'resume') startGame();
    else startGame();
  });
  pauseButton.addEventListener('click', togglePause);
  restartButton.addEventListener('click', () => { resetGame(); startGame(); });
  speedSelect.addEventListener('change', () => { accumulator = 0; });
  root.querySelectorAll('[data-dir]').forEach((button) => button.addEventListener('click', () => setDirection(button.dataset.dir)));
  document.addEventListener('keydown', (event) => {
    if (!visibleInDesktop() || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (target && /INPUT|TEXTAREA|SELECT/.test(target.tagName)) return;
    // Enter/пробел на любой кнопке или ссылке — это нажатие на неё, а не команда змейке
    if (target && target !== document.body && /BUTTON|A/.test(target.tagName) && (event.key === 'Enter' || event.key === ' ')) return;
    const key = event.key.toLowerCase();
    const map = { arrowup: 'up', w: 'up', arrowdown: 'down', s: 'down', arrowleft: 'left', a: 'left', arrowright: 'right', d: 'right' };
    // WASD по физическим клавишам (event.code), чтобы работало и на русской раскладке (где key = «ц/ф/ы/в»)
    const dir = map[key] || { keyw: 'up', keya: 'left', keys: 'down', keyd: 'right' }[(event.code || '').toLowerCase()];
    if (dir) { event.preventDefault(); if (state === 'ready') startGame(); setDirection(dir); }
    else if (key === ' ') { if (state === 'playing' || state === 'paused') { event.preventDefault(); togglePause(); } }
    else if (key === 'enter' && state !== 'playing') { event.preventDefault(); startGame(); }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state === 'playing') togglePause();
  });
  // A small CSS-driven celebration; no external images, libraries, cookies, or network requests.
  const confetti = $('#snake-confetti');
  for (let i = 0; i < 34; i++) {
    const piece = document.createElement('i');
    piece.style.left = `${(i * 37) % 100}%`;
    piece.style.animationDelay = `${((i * 17) % 24) / 10}s`;
    piece.style.animationDuration = `${2 + ((i * 13) % 15) / 10}s`;
    confetti.appendChild(piece);
  }
  // Окно свёрнуто, закрыто или потеряло активность — ставим игру на паузу (как Pong)
  new MutationObserver(() => {
    if (state === 'playing' && !visibleInDesktop()) togglePause();
  }).observe(root, { attributes: true, attributeFilter: ['class'] });
  // If the site's language toggle changes <html lang>, refresh this module's labels.
  const langObserver = new MutationObserver(() => updateStaticText());
  langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  bestNode.textContent = formatScore(best);
  resetGame();
})();
