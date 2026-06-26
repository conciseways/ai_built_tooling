// deck.js
// Pure, dependency-free playing-card deck data + utilities (no DOM).
// Usable by any app via ES module imports.

// ---------- Constants ----------

export const SUITS = ['spades', 'hearts', 'diamonds', 'clubs'];

export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const FACE_RANKS = ['J', 'Q', 'K'];

export const SUIT_SYMBOLS = {
  spades: '\u2660',   // ♠
  hearts: '\u2665',   // ♥
  diamonds: '\u2666', // ♦
  clubs: '\u2663'     // ♣
};

export const SUIT_LETTERS = {
  spades: 'S',
  hearts: 'H',
  diamonds: 'D',
  clubs: 'C'
};

const LETTER_TO_SUIT = {
  S: 'spades',
  H: 'hearts',
  D: 'diamonds',
  C: 'clubs'
};

export const RED_SUITS = ['hearts', 'diamonds'];

export const JOKERS = [
  { rank: 'JOKER', suit: null, color: 'red', id: 'JOKER_RED', isJoker: true },
  { rank: 'JOKER', suit: null, color: 'black', id: 'JOKER_BLACK', isJoker: true }
];

// ---------- Helpers ----------

function suitColor(suit) {
  return RED_SUITS.includes(suit) ? 'red' : 'black';
}

function isFaceRank(rank) {
  return FACE_RANKS.includes(rank);
}

// Stable id: suit letter + rank, e.g. "S3", "HK", "D10". Aces "SA".
function cardId(suit, rank) {
  return `${SUIT_LETTERS[suit]}${rank}`;
}

// Numeric value. aceHigh controls whether Ace is 14 (high) or 1 (low).
function rankValue(rank, aceHigh = false) {
  if (rank === 'A') return aceHigh ? 14 : 1;
  if (rank === 'J') return 11;
  if (rank === 'Q') return 12;
  if (rank === 'K') return 13;
  return Number(rank);
}

/**
 * Create a single normalized card object from a suit + rank.
 */
export function makeCard(suit, rank, { aceHigh = false } = {}) {
  return {
    rank,
    suit,
    id: cardId(suit, rank),
    color: suitColor(suit),
    isFace: isFaceRank(rank),
    isAce: rank === 'A',
    isJoker: false,
    value: rankValue(rank, aceHigh)
  };
}

/**
 * Parse a card id like "S3", "HK", "D10", or "JOKER_RED" back into a card object.
 */
export function parseId(id, opts = {}) {
  if (typeof id !== 'string') throw new Error(`Invalid card id: ${id}`);

  if (id.startsWith('JOKER')) {
    const joker = JOKERS.find((j) => j.id === id);
    if (!joker) throw new Error(`Unknown joker id: ${id}`);
    return { ...joker };
  }

  const letter = id[0];
  const rank = id.slice(1);
  const suit = LETTER_TO_SUIT[letter];

  if (!suit) throw new Error(`Unknown suit letter in id: ${id}`);
  if (!RANKS.includes(rank)) throw new Error(`Unknown rank in id: ${id}`);

  return makeCard(suit, rank, opts);
}

// ---------- Deck generation ----------

/**
 * Create a standard 52-card deck in canonical order.
 * options:
 *   - jokers: 0 | 1 | 2   (default 0)
 *   - aceHigh: boolean     (affects card.value)
 * Returns a new array each call (pure).
 */
export function createDeck({ jokers = 0, aceHigh = false } = {}) {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push(makeCard(suit, rank, { aceHigh }));
    }
  }

  const jokerCount = Math.max(0, Math.min(2, Math.floor(jokers)));
  for (let i = 0; i < jokerCount; i++) {
    deck.push({ ...JOKERS[i] });
  }

  return deck;
}

// ---------- Randomization ----------

/**
 * Seeded PRNG (same family used elsewhere in the repo) for reproducible shuffles.
 */
export function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fisher-Yates shuffle. Non-mutating: returns a new array.
 * Pass an optional rng (e.g. mulberry32(seed)) for deterministic output.
 */
export function shuffle(deck, rng = Math.random) {
  const out = deck.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ---------- Limited / filtered decks ----------

/**
 * Filter a deck by flexible criteria. Non-mutating: returns a new array.
 * criteria:
 *   - excludeRanks: string[]        e.g. ['J']
 *   - excludeSuits: string[]        e.g. ['hearts']
 *   - excludeFaceCards: boolean     removes J/Q/K
 *   - excludeJokers: boolean        removes jokers
 *   - onlyRanks: string[]           allowlist of ranks
 *   - onlySuits: string[]           allowlist of suits
 */
export function filterDeck(deck, criteria = {}) {
  const {
    excludeRanks = [],
    excludeSuits = [],
    excludeFaceCards = false,
    excludeJokers = false,
    onlyRanks = null,
    onlySuits = null
  } = criteria;

  return deck.filter((card) => {
    if (card.isJoker) return !excludeJokers;

    if (excludeFaceCards && card.isFace) return false;
    if (excludeRanks.includes(card.rank)) return false;
    if (excludeSuits.includes(card.suit)) return false;
    if (onlyRanks && !onlyRanks.includes(card.rank)) return false;
    if (onlySuits && !onlySuits.includes(card.suit)) return false;

    return true;
  });
}

// ---------- Convenience presets ----------

export function withoutJokers(deck) {
  return filterDeck(deck, { excludeJokers: true });
}

export function withoutFaceCards(deck) {
  return filterDeck(deck, { excludeFaceCards: true });
}

export function withoutRank(deck, rank) {
  return filterDeck(deck, { excludeRanks: [rank] });
}

export function withoutSuit(deck, suit) {
  return filterDeck(deck, { excludeSuits: [suit] });
}
