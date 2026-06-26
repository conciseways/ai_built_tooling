# Card Subtract

A subtraction drill for young children, built on the shared `playing-cards`
tool. It's the subtraction counterpart to `card-adder`.

## How to play

1. **Pick a card** (A through 10). This is the number you're practicing.
2. Each round a **random card** is drawn. The two cards are shown with a minus
   sign between them. The child says the difference.
3. **Tap/click anywhere** (or press Space/Enter) to reveal the next random card.
4. The game continues until **all remaining cards** have been shown.

Scoring is left to the **parent**. A discreet **Show answer** toggle (off by
default) reveals the subtraction for the parent.

## No negatives (basic game)

To keep results non-negative, the **larger card is always shown first** (on the
left), so each round is `larger - smaller`. If the two cards have the same value
the answer is `0`.

## Options

- **Include face cards (J, Q, K)** - off by default (40-card A-10 deck).
- **Seed** (optional) - reproducible card order.
- Aces count as **1**.

## Reuses the playing-cards tool

Imports directly from `../playing-cards/`:
- `deck.js` - `createDeck`, `filterDeck`, `shuffle`, `mulberry32`, `makeCard`
- `render.js` - `renderCardHTML`
- `cards.css` - card visuals

## Running

ES modules need HTTP, and imports reach into `../playing-cards/`, so serve from
the `tools` folder:

```bash
python -m http.server 8000
# then open http://localhost:8000/card-subtract/
```
