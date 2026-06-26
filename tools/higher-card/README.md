# Higher Card

Tap the higher of two cards. A quick value-comparison game for kids, built on
the shared `playing-cards` tool (same structure as `card-adder`).

## How to play

1. On setup, choose your options and press **Start game**.
2. Two cards appear side by side. **Tap the card with the higher value.**
3. The game shows **Correct!** or marks the higher card, and updates the score.
4. **Tap anywhere** (or Space/Enter) to continue to the next pair.
5. The game ends when no differing pair remains, then shows your final score.

## Options

- **Include face cards (J, Q, K)** - off by default (40-card A-10 deck).
- **Advanced mode** - see below.
- **Aces high or low** - High (`A` beats `K`, value 14) or Low (`A` = 1).
- **Seed** (optional) - reproducible card order.

## Advanced mode

Each round randomly asks which card is **bigger / greater / more / larger /
higher** *or* **smaller / less / fewer / lower / littler**, so the player must
read the prompt rather than always picking the higher card.

An **Equal** button is shown for same-value pairs. To make sure that option gets
practiced, advanced mode **forces an equal-value pair about 25% of the time**;
otherwise the two cards differ. The Equal button is the correct answer whenever
the values match (regardless of the wording).

## Ties (basic mode)

In basic mode ties are avoided: each round draws a card and pairs it with the
next card of a **different value**, so there is always a single higher card.

## Reuses the playing-cards tool

Imports directly from `../playing-cards/`:
- `deck.js` - `createDeck` (with `aceHigh`), `filterDeck`, `shuffle`, `mulberry32`
- `render.js` - `renderCardHTML`
- `cards.css` - card visuals

## Running

ES modules need HTTP, and imports reach into `../playing-cards/`, so serve from
the `tools` folder:

```bash
python -m http.server 8000
# then open http://localhost:8000/higher-card/
```
