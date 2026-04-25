// Service Worker — Thuis Quest (network-first)
const CACHE = 'thuisquest-v4';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first: altijd vers van de server, cache enkel als fallback
self.addEventListener('fetch', e => {
  if (e.request.url.includes('googleapis') || e.request.url.includes('firebase') || e.request.url.includes('gstatic')) {
    return; // Firebase/fonts niet cachen
  }
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
