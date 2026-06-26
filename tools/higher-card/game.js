// game.js
// "Higher Card" - tap the higher of two cards. Reuses the playing-cards tool.

import { createDeck, filterDeck, shuffle, mulberry32 } from '../playing-cards/deck.js';
import { renderCardHTML } from '../playing-cards/render.js';

// ---------- State ----------

const state = {
  phase: 'setup',        // 'setup' | 'playing' | 'over'
  queue: [],             // shuffled remaining cards
  left: null,
  right: null,
  prompt: { dir: 'higher', word: 'higher' },
  round: 0,
  correct: 0,
  answered: 0,
  awaitingNext: false,   // true while feedback is shown
  settings: { includeFaceCards: false, aceHigh: false, advanced: false }
};

// Descriptor words grouped by the direction they ask for.
const WORDS = {
  higher: ['bigger', 'greater', 'more', 'larger', 'higher'],
  lower: ['smaller', 'less', 'fewer', 'lower', 'littler']
};

const FORCE_TIE_CHANCE = 0.25;

function pickPrompt() {
  const dir = Math.random() < 0.5 ? 'higher' : 'lower';
  const pool = WORDS[dir];
  return { dir, word: pool[Math.floor(Math.random() * pool.length)] };
}

// ---------- Elements ----------

const els = {
  setup: document.getElementById('setup'),
  play: document.getElementById('play'),
  over: document.getElementById('over'),
  includeFaceCards: document.getElementById('includeFaceCards'),
  advanced: document.getElementById('advanced'),
  seed: document.getElementById('seed'),
  startBtn: document.getElementById('startBtn'),
  playArea: document.getElementById('playArea'),
  slotLeft: document.getElementById('slotLeft'),
  slotRight: document.getElementById('slotRight'),
  slotEqual: document.getElementById('slotEqual'),
  prompt: document.getElementById('prompt'),
  vs: document.querySelector('.vs'),
  progress: document.getElementById('progress'),
  score: document.getElementById('score'),
  feedback: document.getElementById('feedback'),
  hint: document.getElementById('hint'),
  restartBtn: document.getElementById('restartBtn'),
  playAgainBtn: document.getElementById('playAgainBtn'),
  finalScore: document.getElementById('finalScore')
};

// ---------- View switching ----------

function setPhase(phase) {
  state.phase = phase;
  els.setup.hidden = phase !== 'setup';
  els.play.hidden = phase !== 'playing';
  els.over.hidden = phase !== 'over';
}

// ---------- Setup / deck ----------

function readSettings() {
  state.settings.includeFaceCards = els.includeFaceCards.checked;
  state.settings.advanced = els.advanced.checked;
  const aces = document.querySelector('input[name="aces"]:checked');
  state.settings.aceHigh = aces && aces.value === 'high';
}

function buildDeck() {
  let deck = createDeck({ aceHigh: state.settings.aceHigh });
  if (!state.settings.includeFaceCards) {
    deck = filterDeck(deck, { excludeFaceCards: true });
  }
  const seedRaw = els.seed.value;
  const rng = seedRaw === '' ? Math.random : mulberry32(Number(seedRaw));
  return shuffle(deck, rng);
}

function startGame() {
  readSettings();
  state.queue = buildDeck();
  state.round = 0;
  state.correct = 0;
  state.answered = 0;
  state.awaitingNext = false;
  setPhase('playing');
  nextRound();
}

// ---------- Round loop ----------

// Place two cards on random sides.
function assignSides(a, b) {
  if (Math.random() < 0.5) {
    state.left = a;
    state.right = b;
  } else {
    state.left = b;
    state.right = a;
  }
}

// Remove two cards (by index) from the queue, higher index first.
function takeTwo(i, j) {
  const a = state.queue[i];
  const b = state.queue[j];
  state.queue.splice(Math.max(i, j), 1);
  state.queue.splice(Math.min(i, j), 1);
  return [a, b];
}

// Draw a pair. Basic mode: always different values (avoid ties).
// Advanced mode: ~25% forced equal-value pair, otherwise a differing pair.
function drawPair() {
  if (state.queue.length < 2) return false;
  const advanced = state.settings.advanced;

  if (advanced && Math.random() < FORCE_TIE_CHANCE) {
    // Find two cards sharing a value.
    for (let i = 0; i < state.queue.length; i++) {
      const j = state.queue.findIndex((c, k) => k !== i && c.value === state.queue[i].value);
      if (j !== -1) {
        const [a, b] = takeTwo(i, j);
        assignSides(a, b);
        return true;
      }
    }
    // No tie available; fall through to a differing pair.
  }

  const first = state.queue.shift();
  const idx = state.queue.findIndex((c) => c.value !== first.value);
  if (idx === -1) {
    // Only same-value cards remain.
    if (advanced) {
      const second = state.queue.shift();
      assignSides(first, second);
      return true;
    }
    return false;
  }
  const second = state.queue.splice(idx, 1)[0];
  assignSides(first, second);
  return true;
}

function nextRound() {
  if (!drawPair()) {
    endGame();
    return;
  }
  state.round += 1;
  state.awaitingNext = false;
  state.prompt = state.settings.advanced ? pickPrompt() : { dir: 'higher', word: 'higher' };
  renderRound();
}

function renderRound() {
  const advanced = state.settings.advanced;

  els.slotLeft.innerHTML = renderCardHTML(state.left);
  els.slotRight.innerHTML = renderCardHTML(state.right);
  els.slotLeft.className = 'slot pick';
  els.slotRight.className = 'slot pick';
  els.slotEqual.className = 'equal-btn pick';
  els.slotLeft.disabled = false;
  els.slotRight.disabled = false;
  els.slotEqual.disabled = false;
  els.slotEqual.hidden = !advanced;

  if (advanced) {
    els.prompt.innerHTML = `Which card is <strong>${state.prompt.word.toUpperCase()}</strong>?`;
    els.hint.textContent = 'Tap a card, or Equal if they match';
  } else {
    els.prompt.textContent = '';
    els.hint.textContent = 'Tap the higher card';
  }

  els.feedback.textContent = '';
  els.feedback.className = 'feedback';
  updateStatus();
}

function updateStatus() {
  els.progress.textContent = `Round ${state.round}`;
  els.score.textContent = `Correct: ${state.correct} / ${state.answered}`;
}

// ---------- Answering ----------

function targetEl(target) {
  if (target === 'left') return els.slotLeft;
  if (target === 'right') return els.slotRight;
  return els.slotEqual;
}

function correctTargetFor() {
  if (state.left.value === state.right.value) return 'equal';
  const higherSide = state.left.value > state.right.value ? 'left' : 'right';
  const lowerSide = higherSide === 'left' ? 'right' : 'left';
  return state.prompt.dir === 'higher' ? higherSide : lowerSide;
}

function choose(target) {
  if (state.phase !== 'playing' || state.awaitingNext) return;

  const correctTarget = correctTargetFor();
  const isCorrect = target === correctTarget;

  state.answered += 1;
  if (isCorrect) state.correct += 1;

  targetEl(correctTarget).classList.add('is-correct');
  if (!isCorrect) targetEl(target).classList.add('is-wrong');

  els.slotLeft.disabled = true;
  els.slotRight.disabled = true;
  els.slotEqual.disabled = true;

  let msg;
  if (isCorrect) {
    msg = correctTarget === 'equal' ? 'Correct \u2014 they are equal!' : 'Correct!';
  } else {
    msg = 'Not quite \u2014 the answer is marked.';
  }
  els.feedback.textContent = msg;
  els.feedback.className = 'feedback ' + (isCorrect ? 'is-ok' : 'is-bad');
  els.hint.textContent = 'Tap anywhere to continue';
  state.awaitingNext = true;
  updateStatus();
}

function continueIfWaiting() {
  if (state.phase === 'playing' && state.awaitingNext) {
    nextRound();
  }
}

// ---------- End ----------

function endGame() {
  setPhase('over');
  els.finalScore.textContent =
    `You got ${state.correct} out of ${state.answered} correct.`;
}

function resetToSetup() {
  state.queue = [];
  state.left = null;
  state.right = null;
  state.round = 0;
  state.correct = 0;
  state.answered = 0;
  state.awaitingNext = false;
  setPhase('setup');
}

// ---------- Events ----------

els.startBtn.addEventListener('click', startGame);

function bindTarget(el, target) {
  el.addEventListener('click', (e) => {
    if (state.awaitingNext) { continueIfWaiting(); return; }
    e.stopPropagation();
    choose(target);
  });
}
bindTarget(els.slotLeft, 'left');
bindTarget(els.slotRight, 'right');
bindTarget(els.slotEqual, 'equal');

// Tapping anywhere in the play area continues once feedback is shown.
els.playArea.addEventListener('click', continueIfWaiting);

document.addEventListener('keydown', (e) => {
  if (e.code === 'Escape') { window.location.href = '../index.html'; return; }
  if (state.phase === 'playing' && state.awaitingNext &&
      (e.code === 'Space' || e.code === 'Enter')) {
    e.preventDefault();
    nextRound();
  }
});

els.restartBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  resetToSetup();
});

els.playAgainBtn.addEventListener('click', resetToSetup);

// ---------- Init ----------

setPhase('setup');
