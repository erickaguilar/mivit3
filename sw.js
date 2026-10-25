/**
 * miVIT3 — Service Worker PWA (Offline Support)
 * Cero dependencias externas
 */

const CACHE_NAME = 'mivit3-cache-v2.3.0';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './source/css/normalize.css',
  './source/css/style.css',
  './source/js/script.js',
  './source/img/home.svg',
  './source/img/menu.svg',
  './source/img/mivit3.svg',
  './source/img/one.svg',
  './source/img/two.svg',
  './source/img/three.svg',
  './source/img/tips.svg',
  './source/img/user.svg',
  './source/img/icon-pwa.svg'
];

// Instalación: Cachear recursos críticos inmediatamente
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activación: Limpiar caches obsoletos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepción de peticiones (Stale-while-revalidate con fallback a cache)
self.addEventListener('fetch', (event) => {
  // Ignorar peticiones no GET o de esquemas distintos (ej: chrome-extension)
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Si falla la red (offline), cachedResponse cubrirá la petición
          return cachedResponse;
        });

      // Retornar de inmediato el cache si existe, mientras la red actualiza en segundo plano
      return cachedResponse || fetchPromise;
    })
  );
});
