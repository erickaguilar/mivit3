/**
 * miVIT3 — Service Worker PWA (Offline Support)
 * Cero dependencias externas
 */

const CACHE_NAME = 'mivit3-cache-v2.7.1';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './source/css/normalize.css',
  './source/css/style.css',
  './source/css/modules/variables.css',
  './source/css/modules/header.css',
  './source/css/modules/toolbar.css',
  './source/css/modules/desk.css',
  './source/css/modules/cv-sections.css',
  './source/css/modules/templates.css',
  './source/css/templates/alpha-00-bicolor.css',
  './source/css/templates/alpha-01-columns.css',
  './source/css/templates/alpha-02-banner.css',
  './source/css/templates/alpha-03-monogram.css',
  './source/css/templates/template-tech.css',
  './source/css/templates/template-executive.css',
  './source/css/templates/template-timeline.css',
  './source/css/templates/template-nordic.css',
  './source/css/modules/ats-drawer.css',
  './source/css/modules/dialogs.css',
  './source/css/modules/print.css',
  './source/js/modules/dialogs.js',
  './source/js/modules/sample-data.js',
  './source/js/modules/toolbar.js',
  './source/js/modules/templates.js',
  './source/js/modules/pagination.js',
  './source/js/modules/drag-drop.js',
  './source/js/modules/ats/ats-lexicon.js',
  './source/js/modules/ats/ats-scorer.js',
  './source/js/modules/ats/ats-drawer-ui.js',
  './source/js/modules/storage.js',
  './source/js/modules/web-exporter.js',
  './source/js/modules/pwa.js',
  './source/js/app.js',
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
