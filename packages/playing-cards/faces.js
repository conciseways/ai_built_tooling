// faces.js
// Stylized SVG art for face cards (J/Q/K) and special variants.
// Court cards are drawn "double-headed": one bust in the top-left half and a
// 180deg-rotated copy in the bottom-right half, split by a diagonal divider.

import { SUIT_PATHS } from './suits.js';

// Which cards are traditionally "one-eyed" (shown in profile).
export const ONE_EYED_CARDS = new Set(['SJ', 'HJ', 'DK']);

// Variant catalog the UI can offer.
export const FACE_VARIANTS = {
  standard: 'Standard',
  oneEyed: 'One-eyed (profile)',
  suicideKing: 'Suicide King'
};

// A white suit emblem centered at (cx, cy), scaled from the 0..100 suit path.
function whiteSuit(suit, cx, cy, scale) {
  const path = SUIT_PATHS[suit];
  return `<g transform="translate(${cx} ${cy}) scale(${scale}) translate(-50 -50)">
            <path d="${path}" fill="#fff"/>
          </g>`;
}

// ---------- Headwear ----------

function crownKing() {
  return `
    <g>
      <path d="M30 31 L34 14 L41 26 L50 9 L59 26 L66 14 L70 31 Z"
            fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/>
      <circle cx="34" cy="13" r="2.4" fill="currentColor"/>
      <circle cx="50" cy="8" r="2.8" fill="currentColor"/>
      <circle cx="66" cy="13" r="2.4" fill="currentColor"/>
      <rect x="30" y="31" width="40" height="6" rx="1.5" fill="currentColor"/>
      <circle cx="38" cy="34" r="1.5" fill="#fff"/>
      <circle cx="50" cy="34" r="1.7" fill="#fff"/>
      <circle cx="62" cy="34" r="1.5" fill="#fff"/>
    </g>`;
}

function crownQueen() {
  return `
    <g>
      <path d="M34 31 L38 18 L44 27 L50 15 L56 27 L62 18 L66 31 Z"
            fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/>
      <circle cx="38" cy="17" r="1.8" fill="currentColor"/>
      <circle cx="50" cy="14" r="2.2" fill="currentColor"/>
      <circle cx="62" cy="17" r="1.8" fill="currentColor"/>
      <rect x="34" y="31" width="32" height="5" rx="1.5" fill="currentColor"/>
      <circle cx="50" cy="33.5" r="1.6" fill="#fff"/>
    </g>`;
}

function capJack() {
  return `
    <g>
      <path d="M50 12 C56 4 64 3 70 6 C63 9 60 14 58 19 Z" fill="currentColor"/>
      <path d="M32 33 C31 19 41 12 50 12 C60 12 69 18 69 30 L65 34 L35 34 Z"
            fill="currentColor"/>
      <rect x="33" y="33" width="34" height="4" rx="1.5" fill="currentColor"/>
      <circle cx="50" cy="35" r="1.4" fill="#fff"/>
    </g>`;
}

// ---------- Hair ----------

function hairKing() {
  return `
    <path d="M36 35 C28 39 27 52 35 60 C30 56 31 60 34 64 C30 60 28 46 33 38 Z"
          fill="currentColor"/>
    <path d="M64 35 C72 39 73 52 65 60 C70 56 69 60 66 64 C70 60 72 46 67 38 Z"
          fill="currentColor"/>`;
}

function hairQueen() {
  return `
    <path d="M37 34 C28 40 27 58 33 72 C35 64 34 56 39 50 C36 44 36 38 40 34 Z"
          fill="currentColor"/>
    <path d="M63 34 C72 40 73 58 67 72 C65 64 66 56 61 50 C64 44 64 38 60 34 Z"
          fill="currentColor"/>`;
}

// ---------- Faces ----------

function frontFace({ beard = false, mustache = false, lips = false } = {}) {
  return `
    <ellipse cx="50" cy="46" rx="12" ry="14" fill="#fff" stroke="currentColor" stroke-width="1.6"/>
    <path d="M41 41 C43 39 46 39 47 41" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M53 41 C54 39 57 39 59 41" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <circle cx="45" cy="44" r="1.4" fill="currentColor"/>
    <circle cx="55" cy="44" r="1.4" fill="currentColor"/>
    <path d="M50 45 L47.5 52 L52.5 52 Z" fill="none" stroke="currentColor" stroke-width="1.1"/>
    ${mustache
      ? `<path d="M43 54 C46 57 49 56 50 54 C51 56 54 57 57 54"
               fill="none" stroke="currentColor" stroke-width="1.6"/>`
      : lips
        ? `<path d="M46 55 C48 57 52 57 54 55" fill="none" stroke="currentColor" stroke-width="1.4"/>`
        : `<path d="M46 55 C48 56 52 56 54 55" fill="none" stroke="currentColor" stroke-width="1.2"/>`}
    ${beard
      ? `<path d="M38 50 C38 64 44 72 50 72 C56 72 62 64 62 50
                  C58 57 54 59 50 59 C46 59 42 57 38 50 Z" fill="currentColor"/>`
      : ''}`;
}

function profileFace() {
  return `
    <path d="M60 33 C49 32 40 39 39 48 C38 53 41 56 36 60
             C40 63 44 62 46 60 C49 64 56 65 61 60
             C66 55 66 38 60 33 Z"
          fill="#fff" stroke="currentColor" stroke-width="1.6"/>
    <path d="M44 43 C46 42 49 42 50 44" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <circle cx="48" cy="46" r="1.4" fill="currentColor"/>
    <path d="M40 50 L37 53 L41 55" fill="none" stroke="currentColor" stroke-width="1.1"/>
    <path d="M42 58 C45 60 49 60 51 58" fill="none" stroke="currentColor" stroke-width="1.3"/>`;
}

// ---------- Torso / robe ----------

function ermineMark(x, y) {
  return `
    <g fill="#fff">
      <path d="M${x} ${y} L${x - 1.6} ${y + 3} L${x + 1.6} ${y + 3} Z"/>
      <circle cx="${x - 2.4}" cy="${y - 0.4}" r="0.8"/>
      <circle cx="${x}" cy="${y - 1.6}" r="0.8"/>
      <circle cx="${x + 2.4}" cy="${y - 0.4}" r="0.8"/>
    </g>`;
}

function torso(suit) {
  return `
    <path d="M26 88 C26 69 36 61 50 61 C64 61 74 69 74 88 Z" fill="currentColor"/>
    <path d="M47 61 L53 61 L52 88 L48 88 Z" fill="#fff"/>
    ${whiteSuit(suit, 50, 74, 0.18)}
    ${ermineMark(35, 74)}
    ${ermineMark(65, 74)}
    ${ermineMark(33, 83)}
    ${ermineMark(67, 83)}`;
}

// ---------- Held attributes ----------

function scepterKing() {
  return `
    <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <line x1="76" y1="44" x2="76" y2="70"/>
    </g>
    <circle cx="76" cy="40" r="3.2" fill="currentColor"/>
    <path d="M76 33 L76 39 M73 36 L79 36" stroke="currentColor" stroke-width="1.6"/>`;
}

function flowerQueen() {
  return `
    <g stroke="currentColor" stroke-width="1.6" fill="none">
      <path d="M75 68 C75 58 73 50 74 43"/>
      <path d="M75 60 C70 58 68 55 69 52" />
    </g>
    <g fill="none" stroke="currentColor" stroke-width="1.4">
      <circle cx="74" cy="40" r="2.4"/>
      <circle cx="69" cy="42" r="2.4"/>
      <circle cx="79" cy="42" r="2.4"/>
      <circle cx="71" cy="37" r="2.4"/>
      <circle cx="77" cy="37" r="2.4"/>
    </g>`;
}

function halberdJack() {
  return `
    <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <line x1="74" y1="34" x2="74" y2="74"/>
    </g>
    <path d="M74 36 C82 36 84 44 76 46 L74 44 Z" fill="currentColor"/>
    <path d="M74 34 L78 30 L74 30 Z" fill="currentColor"/>`;
}

function sword() {
  // Sword angled behind the head (suicide king signature).
  return `
    <g stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
      <line x1="66" y1="58" x2="40" y2="18"/>
      <line x1="58" y1="44" x2="70" y2="38"/>
    </g>
    <path d="M37 13 L44 20 L40 24 L33 17 Z" fill="currentColor"/>`;
}

/**
 * Draw a single upright bust within the 0 0 100 100 viewBox (top region).
 */
function bust(rank, suit, { oneEye = false, withSword = false } = {}) {
  if (rank === 'K') {
    return `
      <g>
        ${withSword ? sword() : scepterKing()}
        ${hairKing()}
        ${crownKing()}
        ${oneEye ? profileFace() : frontFace({ beard: true, mustache: true })}
        ${torso(suit)}
      </g>`;
  }
  if (rank === 'Q') {
    return `
      <g>
        ${flowerQueen()}
        ${hairQueen()}
        ${crownQueen()}
        ${oneEye ? profileFace() : frontFace({ lips: true })}
        ${torso(suit)}
      </g>`;
  }
  // Jack
  return `
    <g>
      ${halberdJack()}
      ${capJack()}
      ${oneEye ? profileFace() : frontFace({})}
      ${torso(suit)}
    </g>`;
}

/**
 * Build the full double-headed face-card SVG for the center frame.
 * opts:
 *   - variant: 'standard' | 'oneEyed' | 'suicideKing'
 */
export function faceSVG(rank, suit, id, { variant = 'standard' } = {}) {
  const isOneEyed = variant === 'oneEyed' || (variant === 'standard' && ONE_EYED_CARDS.has(id));
  const isSuicideKing =
    variant === 'suicideKing' || (variant === 'standard' && id === 'HK');

  const single = bust(rank, suit, {
    oneEye: isOneEyed,
    withSword: rank === 'K' && isSuicideKing
  });

  return `
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" stroke-width="1" opacity="0.4"/>
      <g>${single}</g>
      <g transform="rotate(180 50 50)">${single}</g>
    </svg>`;
}
