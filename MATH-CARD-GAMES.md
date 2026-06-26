# Math Card Games

A small suite of kid-friendly card games built on a reusable `playing-cards` library. The whole suite is packaged as an installable Progressive Web App (PWA) and deployed to GitHub Pages.

## Live app

Deployed from the `tools/` folder via GitHub Actions:

```
https://<your-username>.github.io/ai_built_tooling/
```

## Games

### Card Adder

- **Goal:** Practice addition with a fixed compare card.
- **Setup:** Pick a card (A–10, optional face cards) to keep on the left. The remaining deck is shuffled.
- **Play:** One card appears on the right. Tap/click anywhere to flip to the next card. The parent or child can toggle **Show answer** to see the sum.
- **Values:** A = 1, J = 11, Q = 12, K = 13 (when face cards are enabled).
- **File:** `tools/card-adder/`

### Card Subtract

- **Goal:** Practice subtraction with no negative results.
- **Setup:** Pick a card to practice with. The larger card always appears on the left so the result is never negative.
- **Play:** Same tap-to-advance flow as Card Adder.
- **Values:** A = 1, face cards optional.
- **File:** `tools/card-subtract/`

### Higher Card

- **Goal:** Compare two cards and pick the higher value.
- **Setup:** Enable face cards and choose whether aces are high or low.
- **Basic mode:** Two cards appear; tap the higher one.
- **Advanced mode:** The prompt randomly says "bigger" or "smaller", and an **Equal** button appears for ties.
- **File:** `tools/higher-card/`

## Shared library

`packages/playing-cards/` provides the deck, rendering, and CSS used by all three games.

- `deck.js` — card data, deck creation, shuffle, filtering, presets
- `render.js` — turn card objects into HTML
- `faces.js` — stylized SVG face cards (J, Q, K)
- `suits.js` — SVG suit symbols
- `cards.css` — responsive card visuals

The PWA keeps a vendored copy at `tools/playing-cards/` so GitHub Pages can deploy it without bundling. Run `npm run sync:playing-cards` to refresh the copy after editing the package.

## Architecture

- **Multi-page app:** each game is its own folder with an `index.html`.
- **Zero extra navigation buttons on game screens** — the title acts as a home link, and **Esc** returns to the hub.
- **ES modules** with relative imports; no bundler.
- **PWA files at the app root:**
  - `manifest.json` — app metadata and icons
  - `service-worker.js` — offline cache
  - `pwa.js` — service worker registration and install prompt
  - `icons/icon.svg` — master icon
  - `icons/icon-generator.html` — PNG generator for iOS

## Local development

Serve from the repo root:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/tools/`.

Use Chrome DevTools → **Application** → **Manifest / Service Workers** to inspect the PWA.

## Deploy to GitHub Pages

You already did this once; the steps are kept here for repeatability.

### 1. Make sure the package is synced

After any edit to `packages/playing-cards/`, copy it into `tools/`:

```bash
npm run sync:playing-cards
```

Commit and push:

```bash
git add .
git commit -m "sync playing-cards and update PWA"
git push
```

### 2. Enable Pages on GitHub

- Go to the repo on GitHub.
- **Settings → Pages**.
- Under **Source**, choose **GitHub Actions**.

### 3. Wait for the workflow

The deploy workflow is at `.github/workflows/deploy-pages.yml`. It runs automatically on every push to `main` and can also be triggered manually from the **Actions** tab.

It performs three steps:
1. Checks out the repo.
2. Runs `node scripts/sync-playing-cards.js`.
3. Uploads the `tools/` folder as the GitHub Pages site.

### 4. Visit the live URL

```
https://<your-username>.github.io/ai_built_tooling/
```

### 5. Install on a device

- **Android / desktop Chrome:** open the URL → tap **Add to Home screen** (or use the hub's install button).
- **iOS / iPad:** open the URL in Safari → **Share → Add to Home Screen**.

## Icons

The master icon is an SVG at `tools/icons/icon.svg`. Chrome can install the PWA with just the SVG, but iOS needs PNGs.

After deploying, generate the PNGs from the live URL:

```
https://<your-username>.github.io/ai_built_tooling/icons/icon-generator.html
```

Click **Generate → Download all**, move the four files into `tools/icons/`, commit, and push.

Required files:

- `icon-192.png`
- `icon-512.png`
- `icon-maskable-512.png`
- `apple-touch-icon-180.png`

## Updating the app

When you change any cached file, bump the cache name in `tools/service-worker.js`:

```js
const CACHE = 'mcg-v2'; // change this for each release
```

This forces the browser to download and cache the new assets. Existing users will see the update after they close and reopen the app.

## Optional: move the PWA into a package

If you want the PWA to live alongside `packages/playing-cards` instead of in `tools/`, create a new package `packages/math-card-games` and update `.github/workflows/deploy-pages.yml` to upload that package instead of `tools/`. This is cleaner if you add more games but is not required for the current setup.

## Files to know

| File | Purpose |
|------|---------|
| `tools/index.html` | Hub with game tiles and install button |
| `tools/manifest.json` | PWA manifest |
| `tools/service-worker.js` | Offline cache and fallback |
| `tools/pwa.js` | SW registration and install prompt |
| `tools/card-adder/index.html` | Card Adder game |
| `tools/card-subtract/index.html` | Card Subtract game |
| `tools/higher-card/index.html` | Higher Card game |
| `packages/playing-cards/` | Shared playing-card library |
| `scripts/sync-playing-cards.js` | Copies the package into `tools/` for deploy |
| `.github/workflows/deploy-pages.yml` | Deploys `tools/` to GitHub Pages |

## Troubleshooting

- **Service Worker not registering?** Serve via `http://`/`https://` (not `file://`). HTTPS is required on real devices but `localhost` is exempt.
- **Manifest errors in Lighthouse?** Generate the PNG icons; the SVG icon alone may trigger warnings.
- **Scope errors?** All paths are relative. `manifest.json` and `service-worker.js` stay at the root of the deployed folder.
