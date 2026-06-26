// game.js
// "Card Subtract" - a subtraction drill. Reuses the playing-cards deck tool.
// Basic game avoids negatives by always showing the LARGER card first (left).

import { createDeck, filterDeck, shuffle, mulberry32, makeCard, RANKS } from '../playing-cards/deck.js';
import { renderCardHTML } from '../playing-cards/render.js';

// ---------- State ----------

const state = {
  phase: 'setup',     // 'setup' | 'playing' | 'over'
  compareCard: null,
  queue: [],          // remaining random cards
  currentCard: null,
  index: 0,           // how many random cards shown so far (1-based)
  total: 0,
  showAnswer: false,
  includeFaceCards: false
};

// ---------- Elements ----------

const els = {
  setup: document.getElementById('setup'),
  play: document.getElementById('play'),
  over: document.getElementById('over'),
  picker: document.getElementById('picker'),
  playArea: document.getElementById('playArea'),
  leftSlot: document.getElementById('leftSlot'),
  rightSlot: document.getElementById('rightSlot'),
  op: document.getElementById('op'),
  progress: document.getElementById('progress'),
  showAnswer: document.getElementById('showAnswer'),
  includeFaceCards: document.getElementById('includeFaceCards'),
  restartBtn: document.getElementById('restartBtn'),
  playAgainBtn: document.getElementById('playAgainBtn'),
  seed: document.getElementById('seed')
};

// ---------- View switching ----------

function setPhase(phase) {
  state.phase = phase;
  els.setup.hidden = phase !== 'setup';
  els.play.hidden = phase !== 'playing';
  els.over.hidden = phase !== 'over';
}

// ---------- Setup ----------

function buildPicker() {
  // One selectable card per rank, shown as spades. Face cards optional.
  const ranks = state.includeFaceCards
    ? RANKS
    : RANKS.filter((r) => !['J', 'Q', 'K'].includes(r));
  els.picker.innerHTML = ranks
    .map((rank) => {
      const card = makeCard('spades', rank);
      return `<button class="pick" data-rank="${rank}" aria-label="Choose ${rank}">
                ${renderCardHTML(card)}
              </button>`;
    })
    .join('');
}

function startGame(rank) {
  state.compareCard = makeCard('spades', rank);

  // Deck (no jokers; face cards optional), minus the chosen compare card.
  const full = state.includeFaceCards
    ? createDeck()
    : filterDeck(createDeck(), { excludeFaceCards: true });
  const remaining = full.filter((c) => c.id !== state.compareCard.id);

  const seedRaw = els.seed.value;
  const rng = seedRaw === '' ? Math.random : mulberry32(Number(seedRaw));
  state.queue = shuffle(remaining, rng);

  state.total = state.queue.length;
  state.index = 0;

  setPhase('playing');
  nextCard();
}

// ---------- Play loop ----------

function nextCard() {
  if (state.queue.length === 0) {
    setPhase('over');
    return;
  }
  state.currentCard = state.queue.shift();
  state.index += 1;
  renderRound();
}

// Larger card goes first (left) so the result is never negative.
function orderedPair() {
  const a = state.compareCard;
  const b = state.currentCard;
  const larger = a.value >= b.value ? a : b;
  const smaller = larger === a ? b : a;
  return { larger, smaller };
}

function renderRound() {
  const { larger, smaller } = orderedPair();
  els.leftSlot.innerHTML = renderCardHTML(larger);
  els.rightSlot.innerHTML = renderCardHTML(smaller);
  els.progress.textContent = `Card ${state.index} of ${state.total}`;
  updateDiff();
}

function updateDiff() {
  if (state.showAnswer && state.currentCard) {
    const { larger, smaller } = orderedPair();
    const diff = larger.value - smaller.value;
    els.op.textContent = `${larger.value} \u2212 ${smaller.value} = ${diff}`;
  } else {
    els.op.textContent = '\u2212';
  }
}

function advance() {
  if (state.phase !== 'playing') return;
  nextCard();
}

// ---------- Reset ----------

function resetToSetup() {
  state.compareCard = null;
  state.queue = [];
  state.currentCard = null;
  state.index = 0;
  state.total = 0;
  els.leftSlot.innerHTML = '';
  els.rightSlot.innerHTML = '';
  setPhase('setup');
}

// ---------- Events ----------

els.picker.addEventListener('click', (e) => {
  const btn = e.target.closest('.pick');
  if (!btn) return;
  startGame(btn.dataset.rank);
});

// Tap/click anywhere in the play area advances (but not on the controls bar).
els.playArea.addEventListener('click', advance);

// Keyboard convenience: space/enter advances.
document.addEventListener('keydown', (e) => {
  if (e.code === 'Escape') { window.location.href = '../index.html'; return; }
  if (state.phase === 'playing' && (e.code === 'Space' || e.code === 'Enter')) {
    e.preventDefault();
    advance();
  }
});

els.showAnswer.addEventListener('change', () => {
  state.showAnswer = els.showAnswer.checked;
  updateDiff();
});

els.includeFaceCards.addEventListener('change', () => {
  state.includeFaceCards = els.includeFaceCards.checked;
  buildPicker();
});

els.restartBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  resetToSetup();
});

els.playAgainBtn.addEventListener('click', resetToSetup);

// ---------- Init ----------

buildPicker();
setPhase('setup');
