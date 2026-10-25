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
