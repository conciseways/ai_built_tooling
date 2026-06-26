# Playing Cards

A reusable playing-card **deck utility** plus a **CSS/SVG renderer** for displaying
cards in the browser.

The logic and the rendering are intentionally separated so the deck utilities can
be reused in any app (games, draws, simulations) without pulling in DOM code.

## Files

- `deck.js`
  - Pure, dependency-free deck data + utilities (no DOM). ES module.
- `suits.js`
  - Inline SVG path data for the four suit symbols.
- `faces.js`
  - Stylized SVG art for face cards (J/Q/K) and variants.
- `render.js`
  - Turns card objects into styled HTML/DOM using `cards.css`.
- `cards.css`
  - All card visuals: frame, corners, pip layouts, face frame, card back.
- `index.html`
  - Interactive gallery/demo (shuffle, limited decks, variant showcase).

## Running

These files use **ES modules** (`import`/`export`). Browsers block module imports
over the `file://` protocol, so open via a local server:

```bash
# from this folder
python -m http.server 8000
# then visit http://localhost:8000/
```

## Data model

A card is a plain object:

```js
{
  rank: 'A' | '2'..'10' | 'J' | 'Q' | 'K',
  suit: 'spades' | 'hearts' | 'diamonds' | 'clubs',
  id:   'S3' | 'HK' | 'D10' | ...,   // suit letter + rank
  color: 'red' | 'black',
  isFace: boolean,                   // J/Q/K
  isAce: boolean,
  isJoker: boolean,
  value: number                      // A=1 (or 14 if aceHigh), J=11, Q=12, K=13
}
```

Jokers use `{ rank: 'JOKER', suit: null, color, id: 'JOKER_RED' | 'JOKER_BLACK', isJoker: true }`.

## Deck API (`deck.js`)

- `createDeck({ jokers = 0, aceHigh = false })`
  - Returns a fresh 52-card deck in canonical order (+0/1/2 jokers).
- `shuffle(deck, rng = Math.random)`
  - Non-mutating Fisher–Yates. Pass `mulberry32(seed)` for reproducible shuffles.
- `mulberry32(seed)`
  - Seeded PRNG returning a `() => float in [0,1)`.
- `filterDeck(deck, criteria)`
  - `criteria`: `excludeRanks`, `excludeSuits`, `excludeFaceCards`,
    `excludeJokers`, `onlyRanks`, `onlySuits`.
- Presets: `withoutJokers`, `withoutFaceCards`, `withoutRank(deck, rank)`,
  `withoutSuit(deck, suit)`.
- `makeCard(suit, rank, opts)` / `parseId(id, opts)`
  - Build a card object, or parse one back from its `id`.

### Examples

```js
import { createDeck, shuffle, filterDeck, mulberry32 } from './deck.js';

const deck = createDeck();                       // 52 cards
const noJacks = filterDeck(deck, { excludeRanks: ['J'] });
const noFaces = filterDeck(deck, { excludeFaceCards: true });
const seeded = shuffle(deck, mulberry32(42));    // same order every run
```

## Render API (`render.js`)

- `renderCardHTML(card, opts)` → HTML string
- `renderCard(card, opts)` → DOM element
- `renderDeck(deck, container, opts)` → fills a container

`opts`:
- `faceVariant`: `'standard' | 'oneEyed' | 'suicideKing'`
  - `standard` auto-applies the famous specials (one-eyed J♠/J♥/K♦, suicide K♥).
- `faceDown`: render the card back.
- `layout` (renderDeck only): `'grid' | 'row'`.

### Example

```js
import { createDeck } from './deck.js';
import { renderDeck } from './render.js';

renderDeck(createDeck(), document.getElementById('deck'), { layout: 'grid' });
```

## Styling

- Set `--card-w` (card width) on any ancestor to scale cards; height follows
  `--card-ratio` (default 1.4).
- Suit colors via `--ink-red` / `--ink-black`.

## Face-card variants

- **Standard** – front-facing busts; the well-known specials are applied
  automatically by id.
- **One-eyed** – profile portraits (traditionally J♠, J♥, K♦).
- **Suicide King** – K♥ drawn with the sword behind the head.

## Tests

Open `test.html` via the local server to run lightweight assertions in the
browser console (deck size, shuffle preserves the multiset, filters remove the
right cards, id round-trips).
