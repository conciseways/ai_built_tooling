# Card Adder

A simple addition-drill game for young children, built on top of the
`playing-cards` tool.

## How to play

1. **Pick a compare card** (A through 10). It stays fixed on the left for the
   whole game.
2. A **random card** appears on the right. The child adds the two cards
   together (e.g., compare `3` + current `5` = `8`).
3. **Tap/click anywhere** (or press Space/Enter) to reveal the next random card.
4. The game continues until **all 39 remaining cards** have been shown.

Scoring is intentionally left to the **parent**, who decides whether each answer
is correct. A discreet **Show answer** toggle (off by default) reveals the sum
for the parent.

## Deck

Uses a limited deck via the shared `deck.js`:
- **No face cards**, **no jokers** -> 40 cards (A-10).
- The chosen compare card is removed; the other 39 are shuffled.
- Aces count as **1**.

## Reuses the playing-cards tool

This game imports directly from `../playing-cards/`:
- `deck.js` - `createDeck`, `filterDeck`, `shuffle`, `mulberry32`, `makeCard`
- `render.js` - `renderCardHTML`
- `cards.css` - card visuals

## Running

Uses ES modules, so serve over HTTP (not `file://`). From the repo's `tools`
folder:

```bash
python -m http.server 8000
# then open http://localhost:8000/card-adder/
```

(Serving from `tools` keeps the `../playing-cards/` imports resolvable.)

## Options

- **Seed**: enter a number on the setup screen for a reproducible card order
  (handy for repeating the same session).
