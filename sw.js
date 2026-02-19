// Service Worker - sw.js
const CACHE_NAME = 'ens-vintage-v10';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const base = self.registration.scope;
      const assets = [
        '',
        'index.html',
        'catalogo.html',
        'prodotto.html',
        'chi-siamo.html',
        'contatti.html',
        'carrello.html',
        'privacy.html',
        'termini.html',
        'css/styles.css',
        'js/app.js',
        'manifest.webmanifest'
      ].map((path) => new URL(path, base).toString());
      return cache.addAll(assets);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const url = new URL(event.request.url);
        const isSameOrigin = url.origin === self.location.origin;
        const isDynamicData = url.pathname.endsWith('/data/products.json') || url.pathname.endsWith('/data/products.json/');
        const hasQuery = url.search && url.search.length > 0;

        // Cache only stable same-origin assets without query params.
        if (response && response.status === 200 && response.type === 'basic' && isSameOrigin && !hasQuery && !isDynamicData) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((response) => {
          return response || new Response('Offline - Pagina non disponibile', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});
