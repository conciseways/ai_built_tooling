# Math Card Games — PWA Setup

The games are now packaged as an installable Progressive Web App (PWA). The web app works as-is on any modern browser, and can be installed to the home screen on Android, iOS, and desktop.

## What makes it a PWA

- `manifest.json` — tells the browser the app name, icons, theme, and start URL.
- `service-worker.js` — caches the app so it works offline after the first visit.
- `pwa.js` — registers the service worker and shows the Android/desktop install button.
- `icons/icon.svg` — master icon; `icons/icon-generator.html` creates the PNG sizes needed for stores and iOS.

## Local development

Serve from the `tools` folder (required because ES modules can't load from `file://`):

```bash
python -m http.server 8000
```

Open `http://localhost:8000/tools/` (serve from the repo root) and use Chrome DevTools → Application → Manifest / Service Workers to inspect the PWA.

## Hosting on GitHub Pages (recommended)

A GitHub Actions workflow is already included in `.github/workflows/deploy-pages.yml`. It publishes the `tools/` folder as the site root so the app URL is clean.

1. Push the whole repo to GitHub.
2. Go to **Settings → Pages** in your GitHub repo.
3. Under **Source**, choose **GitHub Actions**.
4. Push any change to `main` (or run the workflow manually). GitHub will deploy `https://<you>.github.io/ai_built_tooling/`.

Because all paths are relative, the PWA works at that root URL without any edits. If you prefer the old "branch" style of Pages, rename `tools/` to `docs/` and set Pages source to **Deploy from a branch → main → /docs**.

## Generate the PNG icons (optional but recommended for iOS)

Open the hosted icon generator:

```
http://localhost:8000/icons/icon-generator.html
```

Click **Generate**, then **Download all**. Move the four PNGs into `tools/icons/`:

- `icon-192.png`
- `icon-512.png`
- `icon-maskable-512.png`
- `apple-touch-icon-180.png`

These are already referenced in `manifest.json` and each page's `apple-touch-icon` meta.

## Installing on Android

- Open the hosted URL in Chrome.
- A banner may appear; tap **Add to Home screen**.
- If not, tap the menu (⋮) → **Add to Home screen**.
- The hub also shows an **Install app** button when the browser offers an install prompt.

## Installing on iOS / iPadOS

- Open the hosted URL in **Safari**.
- Tap the **Share** button.
- Scroll down and tap **Add to Home Screen**.
- iOS Safari does not support the browser install prompt, so this is the only way.

## Offline behavior

After the first load, the service worker caches the entire app. On repeat visits the app works offline — you can open the hub, play each game, and return home. Updates to the app files are fetched in the background; close and reopen the app to pick up a new version.

## Updating the app

When you change files, bump the cache name in `service-worker.js`:

```js
const CACHE = 'mcg-v2'; // change this for each release
```

This forces the browser to download and cache the new assets.

## Native app stores (optional Phase 3)

To put the app in the Google Play Store or Apple App Store, you can use the same approaches as `packages/fast-tracker`:

- **PWA Builder** — host the PWA, paste the HTTPS URL, and download Android/iOS packages.
- **Capacitor** — add `capacitor.config.json` and native projects to wrap the web app.

Those routes require store accounts ($25 one-time Google, $99/year Apple) and are beyond the current installable-PWA scope.

## Troubleshooting

- **Service Worker not registering?** Make sure you serve via `http://` (not `file://`). HTTPS is required for real devices but `localhost` is exempt.
- **Manifest errors in Lighthouse?** Generate the PNG icons; the SVG icon alone may trigger warnings but will still install on Android.
- **Scope errors?** The manifest and service worker use relative `./` paths, so the app works under any root or subpath. Do not move `service-worker.js` or `manifest.json` to a subfolder.
