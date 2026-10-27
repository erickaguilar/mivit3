/**
 * miVIT3 — Módulo PWA & Soporte Offline (Fase 3)
 * Registro del Service Worker para capacidades sin conexión y caching local.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  function setupPwa() {
    if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((reg) => {
            console.log('miVIT3 PWA ServiceWorker registrado con alcance:', reg.scope);
            reg.addEventListener('updatefound', () => {
              const newWorker = reg.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    if (window.showToast) {
                      window.showToast('Nueva versión de miVIT3 disponible. Recarga para actualizar.');
                    }
                  }
                });
              }
            });
          })
          .catch((err) => {
            console.warn('Error al registrar ServiceWorker PWA:', err);
          });
      });
    }
  }

  // Exportar funciones
  window.setupPwa = setupPwa;
  window.miVit3.setupPwa = setupPwa;

})();
