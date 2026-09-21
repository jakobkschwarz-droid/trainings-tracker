const CACHE = 'tt-v1';   // Präfix 'tt-': fasse nur eigene Caches an
const FILES = ['./', './index.html', './version.json', './manifest.webmanifest', './icon-180.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('tt-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Netzwerk zuerst und immer beim Server nachfragen (damit Updates sofort ankommen), sonst Cache -> läuft offline
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request, {cache: 'no-cache'}).then(r => { const c = r.clone(); caches.open(CACHE).then(ch => ch.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(m => m || caches.match('./index.html'))));
});
