# Number Bonds Worksheet / Quiz Generator

A single-file, print-friendly HTML worksheet generator for number bonds.

- Renders a grid of number-bond diagrams.
- Can generate **quiz worksheets** by leaving one circle blank.
- Supports **deterministic randomization** via a seed.
- Supports generating questions across a **range of whole numbers** (e.g. wholes 1–6).

## Files

- `index.html`
  - Contains all HTML/CSS/JS for rendering and quiz generation.

## How to use

1. Open `index.html` in a browser.
2. Use the controls at the top:

- **Whole min / Whole max**
  - The range of wholes to generate from.
  - Example: set **Whole min** to `1` and **Whole max** to `6` to generate bonds for wholes 1 through 6.

- **Items**
  - How many problems to generate.
  - If `Items` is larger than the available pool, it will cap at the pool size.

- **Omit**
  - Which value is blanked out in each bond:
    - `part1`
    - `part2`
    - `whole`
    - `random` (randomly chooses which of the three is blank per problem)

- **Seed (optional)**
  - Leave blank for non-deterministic randomness.
  - Enter a number (e.g. `123`) to get the same randomized worksheet every time.

- **Ramp difficulty**
  - `true`: roughly ramps from easier to harder by preferring smaller wholes first, then within a whole from more “obvious” splits toward less obvious ones.
  - `false`: fully shuffled/random selection.

3. Click **Regenerate** to rebuild the worksheet.

## Printing

- Use your browser’s Print feature.
- The control bar is hidden automatically in print (`@media print`).
- The layout is sized for **Letter**.

## Developer notes (key functions)

All logic lives in the `<script>` tag in `index.html`.

- `generateAllBonds(whole)`
  - Creates all decompositions for a given `whole`.

- `generateQuizBonds({ wholeMin, wholeMax, count, omit, rampDifficulty, seed })`
  - Builds a pool across the inclusive whole range (`wholeMin..wholeMax`), selects up to `count` items, then applies omission.

- `mulberry32(seed)`
  - Seeded pseudo-random generator used to make worksheets reproducible.

- `applyOmission(bond, omit, rand)`
  - Replaces `whole`, `part1`, or `part2` with `null` (rendered as blank).
