// suits.js
// Inline SVG path data for suit symbols. Each is drawn in a 0 0 100 100 viewBox
// and uses fill="currentColor" so the card's color class controls red/black.

export const SUIT_PATHS = {
  spades:
    'M50 8 C50 8 14 40 14 60 C14 74 25 82 36 82 C42 82 47 79 50 74 ' +
    'C50 74 47 88 38 92 L62 92 C53 88 50 74 50 74 C53 79 58 82 64 82 ' +
    'C75 82 86 74 86 60 C86 40 50 8 50 8 Z',
  hearts:
    'M50 88 C50 88 12 60 12 36 C12 22 22 14 33 14 C42 14 48 20 50 26 ' +
    'C52 20 58 14 67 14 C78 14 88 22 88 36 C88 60 50 88 50 88 Z',
  diamonds:
    'M50 8 L86 50 L50 92 L14 50 Z',
  clubs:
    'M50 8 C40 8 32 16 32 26 C32 31 34 35 37 39 C30 36 22 38 18 44 ' +
    'C12 52 14 64 24 68 C32 71 40 68 45 62 C44 70 40 86 32 92 L68 92 ' +
    'C60 86 56 70 55 62 C60 68 68 71 76 68 C86 64 88 52 82 44 ' +
    'C78 38 70 36 63 39 C66 35 68 31 68 26 C68 16 60 8 50 8 Z'
};

/**
 * Build an inline SVG string for a suit symbol.
 */
export function suitSVG(suit) {
  const path = SUIT_PATHS[suit];
  if (!path) return '';
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${path}" /></svg>`;
}
