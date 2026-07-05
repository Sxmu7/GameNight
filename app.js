/* ==========================================================================
   CardParty — app logic
   ========================================================================== */

/* ---------------- GLOBAL STATE ---------------- */
let LANG = localStorage.getItem('cp_lang') || (navigator.language && navigator.language.startsWith('de') ? 'de' : 'en');
let players = JSON.parse(localStorage.getItem('cp_players') || '[]');
let currentPlayerIndex = 0;
let deck = [];
let mode = null;
const ICONS = { kings: '♛', bus: '▤', streak: '↗', redblack: '◐', dealer: '♣', akqj: '♦', mostlikely: '✦', party: '✺', mix: '⟳' };

/* ---------------- CORE HELPERS ---------------- */
function T() { return I18N[LANG]; }
function buildDeck() {
  let d = [];
  SUITS.forEach(su => { for (let r = 2; r <= 14; r++) d.push({ rank: r, suit: su.s, color: su.c }); });
  return d;
}
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]]; }
  return arr;
}
function draw() {
  if (deck.length === 0) { deck = shuffle(buildDeck()); showToast(T().deckReshuffled); }
  return deck.pop();
}
function currentPlayer() { return players.length ? players[currentPlayerIndex] : { name: T().ready, drinks: 0 }; }
function advanceTurn() { if (players.length) currentPlayerIndex = (currentPlayerIndex + 1) % players.length; renderTurnBadge(); }
function renderTurnBadge() { const el = document.getElementById('turnBadge'); if (el) el.textContent = currentPlayer().name; }
function addDrink(n = 1, idx = null) {
  if (!players.length) return;
  const i = idx === null ? currentPlayerIndex : idx;
  if (i < 0 || i >= players.length) return;
  players[i].drinks = (players[i].drinks || 0) + n;
  savePlayers();
  floatPlus('+' + n);
}
function floatPlus(text) {
  const el = document.createElement('div');
  el.className = 'floatPlus'; el.textContent = text;
  el.style.left = (window.innerWidth / 2 - 8) + 'px';
  el.style.top = (window.innerHeight / 2) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}
function savePlayers() { localStorage.setItem('cp_players', JSON.stringify(players)); }
function vib(ms = 10) { if (navigator.vibrate) navigator.vibrate(ms); }
let toastT;
function showToast(msg) {
  const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 1800);
}
function cardFaceHTML(card) {
  const cls = card.color === 'red' ? 'red' : '';
  return `<div class="rankBig ${cls}">${RANK_LABEL(card.rank)}</div><div class="suitBig ${cls}">${card.suit}</div>`;
}
/* shared guess evaluator — kind: 0 color, 1 higher/lower vs refs[0], 2 inside/outside vs refs[0..1], 3 exact suit */
function evaluateGuess(kind, guess, card, refs) {
  if (kind === 0) return (guess === 'red' && card.color === 'red') || (guess === 'black' && card.color === 'black');
  if (kind === 1) {
    if (card.rank === refs[0].rank) return null;
    return (guess === 'higher' && card.rank > refs[0].rank) || (guess === 'lower' && card.rank < refs[0].rank);
  }
  if (kind === 2) {
    const lo = Math.min(refs[0].rank, refs[1].rank), hi = Math.max(refs[0].rank, refs[1].rank);
    if (card.rank === lo || card.rank === hi) return false;
    return (guess === 'inside' && card.rank > lo && card.rank < hi) || (guess === 'outside' && (card.rank < lo || card.rank > hi));
  }
  if (kind === 3) return guess === card.suit;
  return false;
}

/* ---------------- PLAYERS UI ---------------- */
function addPlayer() {
  const inp = document.getElementById('playerInput');
  const name = inp.value.trim();
  if (!name) return;
  players.push({ name, drinks: 0 });
  inp.value = '';
  savePlayers(); renderChips(); vib();
}
function removePlayer(i) { players.splice(i, 1); savePlayers(); renderChips(); }
function renderChips() {
  const box = document.getElementById('chipList');
  if (!players.length) { box.innerHTML = `<span class="empty-hint">${T().playersEmpty}</span>`; return; }
  box.innerHTML = players.map((p, i) => `<div class="chip">${p.name}${p.drinks ? ` · ${p.drinks}` : ''} <b onclick="removePlayer(${i})">✕</b></div>`).join('');
}

/* ---------------- LANGUAGE ---------------- */
function setLang(l) {
  LANG = l; localStorage.setItem('cp_lang', l);
  document.documentElement.lang = l;
  renderTopbar(); renderChips(); renderModeGrid();
}
function renderTopbar() {
  document.getElementById('tagline').textContent = T().tagline;
  document.getElementById('playerInput').placeholder = T().addPlaceholder;
  document.getElementById('playersLabel').textContent = T().playersLabel;
  document.getElementById('gamesLabel').textContent = T().gamesLabel;
  document.getElementById('rulesLinkTxt').textContent = T().rulesLabel;
  document.querySelectorAll('.langToggle button').forEach(b => b.classList.toggle('on', b.dataset.lang === LANG));
}

/* ---------------- MODE LIST ---------------- */
const MODE_IDS = ['kings', 'bus', 'streak', 'redblack', 'dealer', 'akqj', 'mostlikely', 'party', 'mix'];
function renderModeGrid() {
  document.getElementById('modeGrid').innerHTML = MODE_IDS.map(id => {
    const m = T().modes[id];
    return `<div class="mode-row" onclick="startMode('${id}')">
      <div class="ic">${ICONS[id]}</div>
      <div class="info"><h3>${m.title}</h3><p>${m.desc}</p></div>
      <div class="chev">›</div>
    </div>`;
  }).join('');
}

/* ---------------- SCREEN NAV ---------------- */
function goHome() {
  document.getElementById('screen-game').classList.remove('active');
  document.getElementById('screen-rules').classList.remove('active');
  document.getElementById('screen-home').classList.add('active');
  renderChips();
}
function goGame(title) {
  document.getElementById('gameTitle').textContent = title;
  document.getElementById('screen-home').classList.remove('active');
  document.getElementById('screen-rules').classList.remove('active');
  document.getElementById('screen-game').classList.add('active');
  renderTurnBadge();
}
function goRules() {
  renderRules();
  document.getElementById('screen-home').classList.remove('active');
  document.getElementById('screen-rules').classList.add('active');
}

/* ---------------- LOADING OVERLAY + START ---------------- */
function startMode(id) {
  vib();
  const overlay = document.getElementById('loadOverlay');
  document.getElementById('loadText').textContent = T().loadingMsgs[Math.floor(Math.random() * T().loadingMsgs.length)];
  overlay.classList.add('show');
  setTimeout(() => {
    mode = id;
    deck = shuffle(buildDeck());
    dispatchInit(id);
    setTimeout(() => overlay.classList.remove('show'), 80);
  }, 900);
}
function dispatchInit(id) {
  const m = T().modes[id];
  if (id === 'kings') { goGame(m.title); initKings(); }
  if (id === 'bus') { goGame(m.title); initBus(); }
  if (id === 'streak') { goGame(m.title); initStreak('rank'); }
  if (id === 'redblack') { goGame(m.title); initStreak('color'); }
  if (id === 'dealer') { goGame(m.title); initDealer(); }
  if (id === 'akqj') { goGame(m.title); initAKQJ(); }
  if (id === 'mostlikely') { goGame(m.title); initMostLikely(); }
  if (id === 'party') { goGame(m.title); initParty(); }
  if (id === 'mix') { goGame(m.title); initMix(); }
}

/* ================= KING'S CUP ================= */
let kcDrawn = null;
function initKings() {
  kcDrawn = null;
  document.getElementById('gameBody').innerHTML = `
    <div class="scene">
      <div class="perspective"><div class="cardFlip" id="kcCard" onclick="kcTap()">
        <div class="face back"></div>
        <div class="face front" id="kcFront"></div>
      </div></div>
      <div class="rulebox plain show" id="kcRule"><div class="rtxt">${T().tapDraw}</div></div>
      <div class="btnRow">
        <button class="btn primary wide" id="kcNextBtn" style="display:none" onclick="kcNext()">${T().nextBtn}</button>
      </div>
    </div>`;
}
function kcTap() {
  if (kcDrawn) return;
  const card = draw(); kcDrawn = card;
  document.getElementById('kcCard').classList.add('flipped');
  document.getElementById('kcFront').innerHTML = cardFaceHTML(card);
  vib(15);
  setTimeout(() => {
    const rb = document.getElementById('kcRule');
    rb.classList.remove('plain');
    rb.querySelector('.rtxt').textContent = KC_RULES[LANG][card.rank];
    rb.classList.add('show');
    document.getElementById('kcNextBtn').style.display = 'block';
  }, 300);
}
function kcNext() {
  advanceTurn();
  document.getElementById('kcCard').classList.remove('flipped');
  const rb = document.getElementById('kcRule');
  rb.classList.add('plain');
  rb.querySelector('.rtxt').textContent = T().tapDraw;
  document.getElementById('kcNextBtn').style.display = 'none';
  kcDrawn = null;
}

/* ================= RIDE THE BUS ================= */
let busPlayers, busPlayerIdx, busQIdx, busRefs, busStage;
function initBus() {
  busPlayers = players.length ? players.map((p, i) => ({ i, name: p.name, mistakes: 0 })) : [{ i: -1, name: T().ready, mistakes: 0 }];
  busPlayerIdx = 0; busQIdx = 0; busRefs = []; busStage = 'phase1';
  renderBusPhase1();
}
function dots(idx) { return `<div class="phaseDots">${[0, 1, 2, 3].map(i => `<span class="${i <= idx ? 'on' : ''}"></span>`).join('')}</div>`; }
function renderBusPhase1() {
  const bp = busPlayers[busPlayerIdx];
  let controls = '';
  if (busQIdx === 0) controls = `<div class="btnRow"><button class="btn red-out" onclick="busGuess('red')">${T().red}</button><button class="btn dark-out" onclick="busGuess('black')">${T().black}</button></div>`;
  else if (busQIdx === 1) controls = `<div class="btnRow"><button class="btn primary" onclick="busGuess('higher')">${T().higher}</button><button class="btn primary" onclick="busGuess('lower')">${T().lower}</button></div>`;
  else if (busQIdx === 2) controls = `<div class="btnRow"><button class="btn primary" onclick="busGuess('inside')">${T().inside}</button><button class="btn primary" onclick="busGuess('outside')">${T().outside}</button></div>`;
  else controls = `<div class="btnRow">
      <button class="btn suit" onclick="busGuess('♠')">♠</button>
      <button class="btn suit red-out" onclick="busGuess('♥')">♥</button>
      <button class="btn suit red-out" onclick="busGuess('♦')">♦</button>
      <button class="btn suit" onclick="busGuess('♣')">♣</button></div>`;
  const refsHTML = busRefs.length ? `<div class="refs">${busRefs.map(c => `<div class="miniCard ${c.color}">${RANK_LABEL(c.rank)}${c.suit}</div>`).join('')}</div>` : '';
  document.getElementById('gameBody').innerHTML = `
    <div class="scene">
      ${dots(busQIdx)}
      <div class="rulebox plain show"><div class="rtxt">${T().bus.phase1Title}</div></div>
      <div class="rulebox show"><div class="rtxt">${T().bus.phase1Player.replace('{name}', bp.name)} — ${T().bus.phaseNames[busQIdx]}</div></div>
      ${refsHTML}
      <div class="perspective"><div class="cardFlip" id="busCard"><div class="face back"></div><div class="face front" id="busFront"></div></div></div>
      <div class="feedback" id="busFeedback"></div>
      ${controls}
    </div>`;
}
function busGuess(guess) {
  const card = draw();
  document.getElementById('busFront').innerHTML = cardFaceHTML(card);
  document.getElementById('busCard').classList.add('flipped'); vib(15);
  const result = evaluateGuess(busQIdx, guess, card, busRefs);
  setTimeout(() => {
    const fb = document.getElementById('busFeedback');
    if (result === null) { fb.textContent = T().push; fb.className = 'feedback show'; setTimeout(renderBusPhase1, 1100); return; }
    const bp = busPlayers[busPlayerIdx];
    if (result) { fb.textContent = T().correct; fb.className = 'feedback show ok'; }
    else { fb.textContent = T().wrong; fb.className = 'feedback show bad'; bp.mistakes++; if (bp.i >= 0) addDrink(1, bp.i); }
    busRefs.push(card);
    setTimeout(() => {
      busQIdx++;
      if (busQIdx >= 4) { busQIdx = 0; busRefs = []; busPlayerIdx++; }
      if (busPlayerIdx >= busPlayers.length) renderBusSummary();
      else renderBusPhase1();
    }, 1100);
  }, 300);
}
function renderBusSummary() {
  const rows = busPlayers.map(p => `<div class="assignRow"><span>${p.name}</span><span class="count">${p.mistakes} ${T().bus.mistakes}</span></div>`).join('');
  document.getElementById('gameBody').innerHTML = `
    <div class="scene">
      <div class="rulebox show"><div class="rtxt">${T().bus.allDone}</div></div>
      <div class="assignList">${rows}</div>
      <div class="btnRow"><button class="btn primary wide" onclick="initPyramid()">${T().bus.continueBtn}</button></div>
    </div>`;
}
/* ---- Phase 2: Pyramid ---- */
let pyGrid, pySequence, pyPos;
function initPyramid() {
  pyGrid = [[null], [null, null], [null, null, null], [null, null, null, null], [null, null, null, null, null]];
  pySequence = [];
  for (let r = 4; r >= 0; r--) for (let c = 0; c <= r; c++) pySequence.push({ row: r, col: c, value: 5 - r });
  pyPos = 0;
  pyReveal();
}
function pyReveal() {
  if (pyPos >= pySequence.length) { renderPyramidDone(); return; }
  const seq = pySequence[pyPos];
  const card = draw();
  pyGrid[seq.row][seq.col] = card;
  renderPyramidScreen(seq.value);
}
function renderPyramidScreen(value) {
  const rowsHTML = pyGrid.map((row, r) => `<div class="pyRow">${row.map((cell, c) => {
    if (!cell) return `<div class="pyCard"></div>`;
    return `<div class="pyCard revealed ${cell.color}">${RANK_LABEL(cell.rank)}${cell.suit}</div>`;
  }).join('')}</div>`).join('');
  const assignRows = players.length
    ? players.map((p, i) => `<div class="assignRow" onclick="pyAssign(${i},${value})"><span>${p.name}</span><span class="count">+${value}</span></div>`).join('')
    : `<div class="empty-hint">${T().playersEmpty}</div>`;
  document.getElementById('gameBody').innerHTML = `
    <div class="scene">
      <div class="rulebox plain show"><div class="rtxt">${T().bus.pyramidTitle}</div></div>
      <div class="pyramid">${rowsHTML}</div>
      <div class="rulebox show"><div class="rtxt">${T().bus.pyramidHint.replace('{row}', value).replace('{v}', value)}</div></div>
      <div class="assignList">${assignRows}</div>
      <div class="btnRow"><button class="btn primary wide" onclick="pyNext()">${T().nextBtn}</button></div>
    </div>`;
}
function pyAssign(i, value) { addDrink(value, i); vib(12); }
function pyNext() { pyPos++; pyReveal(); }
function renderPyramidDone() {
  document.getElementById('gameBody').innerHTML = `
    <div class="scene">
      <div class="rulebox show"><div class="rtxt">${T().bus.pyramidDone}</div></div>
      <div class="btnRow"><button class="btn primary wide" onclick="initBusFinal()">${T().bus.startBus}</button></div>
    </div>`;
}
/* ---- Phase 3: The Bus ---- */
const BUS_LEN = 5;
let busFinalCard, busFinalIdx, busFinalDrinks, busDriverIdx, busDriverName;
function initBusFinal() {
  const worst = busPlayers.reduce((a, b) => (b.mistakes > a.mistakes ? b : a), busPlayers[0]);
  busDriverIdx = worst.i; busDriverName = worst.name;
  busFinalCard = draw(); busFinalIdx = 0; busFinalDrinks = 0;
  renderBusFinal();
}
function renderBusFinal(feedback) {
  document.getElementById('gameBody').innerHTML = `
    <div class="scene">
      <div class="rulebox plain show"><div class="rtxt">${T().bus.busTitle}</div></div>
      <div class="rulebox show"><div class="rtxt">${T().bus.busDriver.replace('{name}', busDriverName)} · ${T().bus.busProgress.replace('{n}', busFinalIdx + 1).replace('{total}', BUS_LEN)}</div></div>
      <div class="refs"><div class="miniCard ${busFinalCard.color}">${RANK_LABEL(busFinalCard.rank)}${busFinalCard.suit}</div></div>
      <div class="perspective small"><div class="cardFlip" id="bfCard"><div class="face back"></div><div class="face front" id="bfFront"></div></div></div>
      <div class="feedback ${feedback ? ('show ' + feedback.cls) : ''}" id="bfFeedback">${feedback ? feedback.text : ''}</div>
      <div class="statPill"><b>${busFinalDrinks}</b><span>${T().drinksLabel}</span></div>
      <div class="btnRow"><button class="btn primary" onclick="busFinalGuess('higher')">${T().higher}</button><button class="btn primary" onclick="busFinalGuess('lower')">${T().lower}</button></div>
    </div>`;
}
function busFinalGuess(guess) {
  const next = draw();
  document.getElementById('bfFront').innerHTML = cardFaceHTML(next);
  document.getElementById('bfCard').classList.add('flipped'); vib(15);
  let result;
  if (next.rank === busFinalCard.rank) result = null;
  else result = ((guess === 'higher' && next.rank > busFinalCard.rank) || (guess === 'lower' && next.rank < busFinalCard.rank));
  setTimeout(() => {
    if (result === null) { busFinalCard = next; renderBusFinal({ cls: '', text: T().push }); return; }
    if (result) {
      busFinalIdx++; busFinalCard = next;
      if (busFinalIdx >= BUS_LEN - 1) {
        document.getElementById('gameBody').innerHTML = `
          <div class="scene">
            <div class="rulebox show"><div class="rtxt">${T().bus.busWin}</div></div>
            <div class="btnRow"><button class="btn primary wide" onclick="initBus()">${T().newRound}</button><button class="btn wide" onclick="goHome()">${T().nextPlayer}</button></div>
          </div>`;
        return;
      }
      renderBusFinal({ cls: 'ok', text: T().correct });
    } else {
      busFinalDrinks++; if (busDriverIdx >= 0) addDrink(1, busDriverIdx);
      busFinalIdx = 0; busFinalCard = draw();
      renderBusFinal({ cls: 'bad', text: T().bus.busWrong });
    }
  }, 300);
}

/* ================= HIGHER/LOWER + RED/BLACK (shared streak engine) ================= */
let stCard, stStreak, stBest, stKind;
function initStreak(kind) {
  stKind = kind; stStreak = 0; stBest = parseInt(localStorage.getItem('cp_best_' + kind) || '0');
  stCard = draw();
  renderStreak();
}
function renderStreak(feedback) {
  const isRank = stKind === 'rank';
  document.getElementById('gameBody').innerHTML = `
    <div class="scene">
      <div class="streakRow">
        <div class="statPill"><b>${stStreak}</b><span>${T().streak}</span></div>
        <div class="statPill"><b>${stBest}</b><span>${T().best}</span></div>
      </div>
      <div class="perspective"><div class="cardFlip flipped" id="stCard"><div class="face back"></div><div class="face front" id="stFront">${cardFaceHTML(stCard)}</div></div></div>
      <div class="feedback ${feedback ? ('show ' + feedback.cls) : ''}" id="stFeedback">${feedback ? feedback.text : ''}</div>
      <div class="btnRow">
        ${isRank
          ? `<button class="btn primary" onclick="stGuess('higher')">${T().higher}</button><button class="btn primary" onclick="stGuess('lower')">${T().lower}</button>`
          : `<button class="btn red-out" onclick="stGuess('red')">${T().red}</button><button class="btn dark-out" onclick="stGuess('black')">${T().black}</button>`}
      </div>
    </div>`;
}
function stGuess(guess) {
  const next = draw();
  vib(15);
  let result;
  if (stKind === 'rank') {
    if (next.rank === stCard.rank) result = null;
    else result = (guess === 'higher' && next.rank > stCard.rank) || (guess === 'lower' && next.rank < stCard.rank);
  } else {
    result = (guess === 'red' && next.color === 'red') || (guess === 'black' && next.color === 'black');
  }
  if (result === null) { stCard = next; renderStreak({ cls: '', text: T().push }); return; }
  if (result) {
    stStreak++; if (stStreak > stBest) { stBest = stStreak; localStorage.setItem('cp_best_' + stKind, stBest); }
    stCard = next; renderStreak({ cls: 'ok', text: T().correct + ' — ' + T().streak + ' ' + stStreak });
  } else {
    addDrink(Math.max(1, stStreak));
    showToast(currentPlayer().name + ' ' + Math.max(1, stStreak) + '×');
    advanceTurn();
    stStreak = 0; stCard = next;
    renderStreak({ cls: 'bad', text: T().wrong });
  }
}

/* ================= FUCK THE DEALER ================= */
let fdDealerIdx, fdSubIdx, fdRefs, fdWinStreak;
function initDealer() {
  fdDealerIdx = players.length ? 0 : -1;
  fdSubIdx = 0; fdRefs = []; fdWinStreak = 0;
  renderDealer();
}
function dealerName() { return fdDealerIdx >= 0 ? players[fdDealerIdx].name : T().ready; }
function renderDealer(feedback) {
  let controls;
  if (fdSubIdx === 0) controls = `<div class="btnRow"><button class="btn red-out" onclick="fdGuess('red')">${T().red}</button><button class="btn dark-out" onclick="fdGuess('black')">${T().black}</button></div>`;
  else if (fdSubIdx === 1) controls = `<div class="btnRow"><button class="btn primary" onclick="fdGuess('higher')">${T().higher}</button><button class="btn primary" onclick="fdGuess('lower')">${T().lower}</button></div>`;
  else controls = `<div class="btnRow"><button class="btn primary" onclick="fdGuess('inside')">${T().inside}</button><button class="btn primary" onclick="fdGuess('outside')">${T().outside}</button></div>`;
  const refsHTML = fdRefs.length ? `<div class="refs">${fdRefs.map(c => `<div class="miniCard ${c.color}">${RANK_LABEL(c.rank)}${c.suit}</div>`).join('')}</div>` : '';
  document.getElementById('gameBody').innerHTML = `
    <div class="scene">
      ${dots(fdSubIdx)}
      <div class="streakRow">
        <div class="statPill"><b style="font-size:14px">${dealerName()}</b><span>${T().dealer.dealerLabel}</span></div>
        <div class="statPill"><b style="font-size:14px">${currentPlayer().name}</b><span>${T().dealer.guesserLabel}</span></div>
      </div>
      ${refsHTML}
      <div class="perspective"><div class="cardFlip" id="fdCard"><div class="face back"></div><div class="face front" id="fdFront"></div></div></div>
      <div class="feedback ${feedback ? ('show ' + feedback.cls) : ''}" id="fdFeedback">${feedback ? feedback.text : ''}</div>
      ${controls}
      <div class="btnRow"><button class="btn wide" onclick="changeDealer()">${T().dealer.changeDealer}</button></div>
    </div>`;
}
function fdGuess(guess) {
  const card = draw();
  document.getElementById('fdFront').innerHTML = cardFaceHTML(card);
  document.getElementById('fdCard').classList.add('flipped'); vib(15);
  const result = evaluateGuess(fdSubIdx, guess, card, fdRefs);
  setTimeout(() => {
    if (result === null) { renderDealer({ cls: '', text: T().push }); return; }
    if (result) {
      if (fdDealerIdx >= 0) addDrink(1, fdDealerIdx);
      fdRefs.push(card); fdSubIdx++;
      if (fdSubIdx >= 3) {
        fdWinStreak++; fdSubIdx = 0; fdRefs = []; advanceTurn();
        renderDealer({ cls: 'ok', text: T().dealer.dealerDrinks + ' ×3' });
      } else {
        renderDealer({ cls: 'ok', text: T().dealer.dealerDrinks });
      }
    } else {
      addDrink(1); fdSubIdx = 0; fdRefs = []; fdWinStreak = 0; advanceTurn();
      renderDealer({ cls: 'bad', text: T().dealer.guesserDrinksTxt });
    }
  }, 300);
}
function changeDealer() {
  if (players.length) fdDealerIdx = (fdDealerIdx + 1) % players.length;
  fdWinStreak = 0; fdSubIdx = 0; fdRefs = [];
  renderDealer();
}

/* ================= ACE, KING, QUEEN, JACK ================= */
let akqjDrawn;
function initAKQJ() { akqjDrawn = null; renderAKQJ(); }
function renderAKQJ() {
  document.getElementById('gameBody').innerHTML = `
    <div class="scene">
      <div class="perspective"><div class="cardFlip" id="akCard" onclick="akTap()"><div class="face back"></div><div class="face front" id="akFront"></div></div></div>
      <div class="rulebox plain show" id="akRule"><div class="rtxt">${T().tapDraw}</div></div>
      <div class="btnRow"><button class="btn primary wide" id="akNextBtn" style="display:none" onclick="akNext()">${T().nextBtn}</button></div>
    </div>`;
}
function akTap() {
  if (akqjDrawn) return;
  const card = draw(); akqjDrawn = card;
  document.getElementById('akCard').classList.add('flipped');
  document.getElementById('akFront').innerHTML = cardFaceHTML(card);
  vib(15);
  const map = { 14: ['ace', 1], 13: ['king', 2], 12: ['queen', 3], 11: ['jack', 4] };
  const hit = map[card.rank];
  setTimeout(() => {
    const rb = document.getElementById('akRule');
    rb.classList.remove('plain');
    rb.querySelector('.rtxt').textContent = hit ? T().akqjText[hit[0]] : T().akqjText.safe;
    rb.classList.add('show');
    if (hit) akqjDrawn.pending = hit[1];
    document.getElementById('akNextBtn').style.display = 'block';
  }, 300);
}
function akNext() {
  if (akqjDrawn && akqjDrawn.pending) addDrink(akqjDrawn.pending);
  advanceTurn();
  document.getElementById('akCard').classList.remove('flipped');
  const rb = document.getElementById('akRule');
  rb.classList.add('plain');
  rb.querySelector('.rtxt').textContent = T().tapDraw;
  document.getElementById('akNextBtn').style.display = 'none';
  akqjDrawn = null;
}

/* ================= MOST LIKELY TO ================= */
let mlDeck, mlPos, mlRevealed;
function initMostLikely() { mlDeck = shuffle([...MOST_LIKELY[LANG]]); mlPos = 0; mlRevealed = false; renderMostLikely(); }
function renderMostLikely() {
  const q = mlDeck[mlPos % mlDeck.length];
  document.getElementById('gameBody').innerHTML = `
    <div class="scene">
      <div class="rulebox ${mlRevealed ? 'show' : 'plain show'}" style="min-height:110px;"><div class="rtxt" style="font-size:${mlRevealed ? '16px' : '13px'}">${mlRevealed ? q : '✦ ✦ ✦'}</div></div>
      <div class="btnRow">
        ${mlRevealed
          ? `<button class="btn primary wide" onclick="mlNext()">${T().mostLikelyNext}</button>`
          : `<button class="btn primary wide" onclick="mlReveal()">${T().mostLikelyReveal}</button>`}
      </div>
    </div>`;
}
function mlReveal() { mlRevealed = true; vib(15); renderMostLikely(); }
function mlNext() { mlPos++; mlRevealed = false; advanceTurn(); renderMostLikely(); }

/* ================= PARTY PROMPTS ================= */
function initParty() { renderParty(partyPromptPool(LANG)[0]); }
function renderParty(item) {
  document.getElementById('gameBody').innerHTML = `
    <div class="scene">
      <div class="rulebox plain show"><div class="rtxt">${item.title}</div></div>
      <div class="rulebox show" style="min-height:100px;"><div class="rtxt">${item.body}</div></div>
      <div class="btnRow"><button class="btn primary wide" onclick="partyNext()">${T().partyNext}</button></div>
    </div>`;
}
function partyNext() {
  const pool = partyPromptPool(LANG);
  const item = pool[Math.floor(Math.random() * pool.length)];
  advanceTurn();
  renderParty(item);
}

/* ================= MIX MODE ================= */
function initMix() { mixRound(); }
function mixRound() {
  const pick = Math.floor(Math.random() * 5);
  if (pick === 0) {
    const card = draw();
    document.getElementById('gameBody').innerHTML = `
      <div class="scene">
        <div class="rulebox plain show"><div class="rtxt">${T().modes.kings.title}</div></div>
        <div class="perspective"><div class="cardFlip flipped"><div class="face back"></div><div class="face front">${cardFaceHTML(card)}</div></div></div>
        <div class="rulebox show"><div class="rtxt">${KC_RULES[LANG][card.rank]}</div></div>
        <div class="btnRow"><button class="btn primary wide" onclick="advanceTurn(); mixRound();">${T().nextBtn}</button></div>
      </div>`;
  } else if (pick === 1) {
    mixChallenge(0);
  } else if (pick === 2) {
    mixChallenge(1);
  } else if (pick === 3) {
    const q = MOST_LIKELY[LANG][Math.floor(Math.random() * MOST_LIKELY[LANG].length)];
    document.getElementById('gameBody').innerHTML = `
      <div class="scene">
        <div class="rulebox plain show"><div class="rtxt">${T().modes.mostlikely.title}</div></div>
        <div class="rulebox show" style="min-height:90px;"><div class="rtxt">${q}</div></div>
        <div class="btnRow"><button class="btn primary wide" onclick="advanceTurn(); mixRound();">${T().nextBtn}</button></div>
      </div>`;
  } else {
    const item = partyPromptPool(LANG)[Math.floor(Math.random() * 5)];
    document.getElementById('gameBody').innerHTML = `
      <div class="scene">
        <div class="rulebox plain show"><div class="rtxt">${item.title}</div></div>
        <div class="rulebox show" style="min-height:90px;"><div class="rtxt">${item.body}</div></div>
        <div class="btnRow"><button class="btn primary wide" onclick="advanceTurn(); mixRound();">${T().nextBtn}</button></div>
      </div>`;
  }
}
function mixChallenge(kind) {
  const controls = kind === 0
    ? `<div class="btnRow"><button class="btn red-out" onclick="mixGuess(0,'red')">${T().red}</button><button class="btn dark-out" onclick="mixGuess(0,'black')">${T().black}</button></div>`
    : `<div class="btnRow"><button class="btn primary" onclick="mixGuess(1,'higher')">${T().higher}</button><button class="btn primary" onclick="mixGuess(1,'lower')">${T().lower}</button></div>`;
  window._mixRef = kind === 1 ? draw() : null;
  const refHTML = window._mixRef ? `<div class="refs"><div class="miniCard ${window._mixRef.color}">${RANK_LABEL(window._mixRef.rank)}${window._mixRef.suit}</div></div>` : '';
  document.getElementById('gameBody').innerHTML = `
    <div class="scene">
      <div class="rulebox plain show"><div class="rtxt">${kind === 0 ? T().modes.redblack.title : T().modes.streak.title}</div></div>
      ${refHTML}
      <div class="perspective"><div class="cardFlip" id="mixCard"><div class="face back"></div><div class="face front" id="mixFront"></div></div></div>
      <div class="feedback" id="mixFeedback"></div>
      ${controls}
    </div>`;
}
function mixGuess(kind, guess) {
  const card = draw();
  document.getElementById('mixFront').innerHTML = cardFaceHTML(card);
  document.getElementById('mixCard').classList.add('flipped'); vib(15);
  let correct;
  if (kind === 0) correct = (guess === 'red' && card.color === 'red') || (guess === 'black' && card.color === 'black');
  else correct = (guess === 'higher' && card.rank > window._mixRef.rank) || (guess === 'lower' && card.rank < window._mixRef.rank);
  setTimeout(() => {
    const fb = document.getElementById('mixFeedback');
    if (correct) { fb.textContent = T().correct; fb.className = 'feedback show ok'; }
    else { fb.textContent = T().wrong; fb.className = 'feedback show bad'; addDrink(1); }
    setTimeout(() => { advanceTurn(); mixRound(); }, 1100);
  }, 300);
}

/* ================= RULES REFERENCE ================= */
function renderRules() {
  document.getElementById('rulesBody').innerHTML = RULEBOOK[LANG].map((sec, i) => `
    <div class="acc-item" id="acc-${i}" style="animation-delay:${i * 0.04}s">
      <div class="acc-head" onclick="toggleAcc(${i})"><span>${sec.title}</span><span class="arrow">⌄</span></div>
      <div class="acc-body" id="acc-body-${i}"><div class="acc-body-inner">${sec.body}</div></div>
    </div>`).join('');
}
function toggleAcc(i) {
  const item = document.getElementById('acc-' + i);
  const body = document.getElementById('acc-body-' + i);
  const open = item.classList.toggle('open');
  body.style.maxHeight = open ? body.scrollHeight + 'px' : '0px';
}

/* ---------------- INIT ---------------- */
renderTopbar();
renderModeGrid();
renderChips();
