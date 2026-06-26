// render.js
// Turns card objects (from deck.js) into nicely styled DOM/HTML using cards.css.

import { SUIT_SYMBOLS } from './deck.js';
import { suitSVG } from './suits.js';
import { faceSVG } from './faces.js';

// Pip positions as [x%, y%] within the center pip area.
// A pip is rotated 180deg ("flipped") when its y > 50, mimicking real cards.
const PIP_LAYOUTS = {
  '2': [[50, 8], [50, 92]],
  '3': [[50, 8], [50, 50], [50, 92]],
  '4': [[20, 8], [80, 8], [20, 92], [80, 92]],
  '5': [[20, 8], [80, 8], [50, 50], [20, 92], [80, 92]],
  '6': [[20, 8], [80, 8], [20, 50], [80, 50], [20, 92], [80, 92]],
  '7': [[20, 8], [80, 8], [50, 29], [20, 50], [80, 50], [20, 92], [80, 92]],
  '8': [[20, 8], [80, 8], [50, 29], [20, 50], [80, 50], [50, 71], [20, 92], [80, 92]],
  '9': [
    [20, 8], [80, 8], [20, 36], [80, 36], [50, 50],
    [20, 64], [80, 64], [20, 92], [80, 92]
  ],
  '10': [
    [20, 8], [80, 8], [50, 21], [20, 33], [80, 33],
    [20, 67], [80, 67], [50, 79], [20, 92], [80, 92]
  ]
};

function cornerHTML(rankText, suit, position) {
  return `
    <div class="card__corner card__corner--${position}">
      <span class="rank">${rankText}</span>
      <span class="suit">${suitSVG(suit)}</span>
    </div>`;
}

function pipsHTML(rank, suit) {
  const layout = PIP_LAYOUTS[rank];
  if (!layout) return '';
  const svg = suitSVG(suit);
  return layout
    .map(([x, y]) => {
      const flipped = y > 50 ? ' is-flipped' : '';
      return `<div class="pip${flipped}" style="left:${x}%;top:${y}%">${svg}</div>`;
    })
    .join('');
}

function rankLabel(card) {
  if (card.isJoker) return '\u2605'; // star
  return card.rank;
}

/**
 * Render a single card to an HTML string.
 * opts:
 *   - faceVariant: 'standard' | 'oneEyed' | 'suicideKing'
 *   - faceDown: boolean   (renders the card back)
 */
export function renderCardHTML(card, opts = {}) {
  const { faceVariant = 'standard', faceDown = false } = opts;

  if (faceDown) {
    return `<div class="card is-back" aria-label="Face-down card"></div>`;
  }

  const colorClass = card.color === 'red' ? 'is-red' : 'is-black';

  // Jokers
  if (card.isJoker) {
    const jokerCorner = (pos) =>
      `<div class="card__corner card__corner--${pos}"><span class="rank">\u2605</span></div>`;
    return `
      <div class="card is-joker ${colorClass}" aria-label="Joker">
        ${jokerCorner('tl')}
        <div class="card__center">
          <span class="joker-label">JOKER</span>
        </div>
        ${jokerCorner('br')}
      </div>`;
  }

  const label = rankLabel(card);
  const classes = ['card', colorClass];
  if (card.isAce) classes.push('is-ace');
  if (card.isFace) classes.push('is-face');

  let center;
  if (card.isFace) {
    center = `<div class="card__face">${faceSVG(card.rank, card.suit, card.id, { variant: faceVariant })}</div>`;
  } else if (card.isAce) {
    center = `<div class="card__center"><div class="pip pip--ace">${suitSVG(card.suit)}</div></div>`;
  } else {
    center = `<div class="card__center"><div class="card__pips">${pipsHTML(card.rank, card.suit)}</div></div>`;
  }

  return `
    <div class="${classes.join(' ')}" aria-label="${label} of ${card.suit}">
      ${cornerHTML(label, card.suit, 'tl')}
      ${center}
      ${cornerHTML(label, card.suit, 'br')}
    </div>`;
}

/**
 * Render a single card as a DOM element.
 */
export function renderCard(card, opts = {}) {
  const wrap = document.createElement('div');
  wrap.innerHTML = renderCardHTML(card, opts).trim();
  return wrap.firstElementChild;
}

/**
 * Render a list of cards into a container element.
 * opts:
 *   - layout: 'grid' | 'row'   (default 'grid')
 *   - faceVariant, faceDown    (passed to each card)
 */
export function renderDeck(deck, container, opts = {}) {
  const { layout = 'grid', ...cardOpts } = opts;
  container.classList.add(layout === 'row' ? 'card-row' : 'card-grid');
  container.innerHTML = deck.map((c) => renderCardHTML(c, cardOpts)).join('');
  return container;
}

// Re-export for convenience so apps can pull symbols from one place.
export { SUIT_SYMBOLS };
