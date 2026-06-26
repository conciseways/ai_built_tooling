// service-worker.js
// Offline caching for the Math Card Games PWA.
// Paths are RELATIVE to this file's location (the app root), so the app works
// at a site root or under any subpath (e.g. GitHub Project Pages).

const CACHE = 'mcg-v1';

// Everything the three games + hub need to run offline.
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './pwa.js',
  './icons/icon.svg',

  './card-adder/',
  './card-adder/index.html',
  './card-adder/game.js',
  './card-adder/game.css',

  './card-subtract/',
  './card-subtract/index.html',
  './card-subtract/game.js',
  './card-subtract/game.css',

  './higher-card/',
  './higher-card/index.html',
  './higher-card/game.js',
  './higher-card/game.css',

  './playing-cards/cards.css',
  './playing-cards/deck.js',
  './playing-cards/render.js',
  './playing-cards/suits.js',
  './playing-cards/faces.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // allSettled => one missing/optional asset won't abort the whole install.
    await Promise.allSettled(
      ASSETS.map((url) => cache.add(new Request(url, { cache: 'reload' })))
    );
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith((async () => {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;

    try {
      const res = await fetch(req);
      // Cache successful same-origin GETs for next time.
      if (res && res.ok && new URL(req.url).origin === self.location.origin) {
        const copy = res.clone();
        const cache = await caches.open(CACHE);
        cache.put(req, copy);
      }
      return res;
    } catch (err) {
      // Offline navigation: fall back to the cached hub.
      if (req.mode === 'navigate') {
        const fallback = (await caches.match('./index.html')) || (await caches.match('./'));
        if (fallback) return fallback;
      }
      throw err;
    }
  })());
});

// Allow the page to trigger an immediate update.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
