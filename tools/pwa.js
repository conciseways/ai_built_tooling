// pwa.js (ES module)
// Registers the service worker and wires an optional Install button.
// Loaded from every page; using import.meta.url means the SW is always found
// at the app root next to this file, so its scope covers all games.

const swUrl = new URL('service-worker.js', import.meta.url);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(swUrl)
      .catch((err) => console.warn('Service worker registration failed:', err));
  });
}

// Android / desktop Chrome install flow. (iOS Safari has no prompt; users tap
// Share -> Add to Home Screen.)
let deferredPrompt = null;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) installBtn.hidden = false;
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.hidden = true;
  });
}

window.addEventListener('appinstalled', () => {
  if (installBtn) installBtn.hidden = true;
});
