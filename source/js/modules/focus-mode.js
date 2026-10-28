/**
 * miVIT3 — Módulo de Modo Enfoque / Pantalla Completa (Zen Focus Mode)
 * Oculta distracciones y maximiza el lienzo de trabajo para una redacción fluida.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  let isFocusMode = false;
  let exitPill = null;

  function toggleFocusMode() {
    isFocusMode = !isFocusMode;
    const btn = document.getElementById('btnFocusMode');

    if (isFocusMode) {
      document.body.classList.add('zen-focus-mode');
      if (btn) btn.classList.add('active');

      // Intentar pantalla completa nativa
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }

      showExitPill();

      const toast = window.showToast || (window.miVit3 && window.miVit3.showToast);
      if (toast) toast('Modo Enfoque activado. Presiona Esc para salir.');
    } else {
      document.body.classList.remove('zen-focus-mode');
      if (btn) btn.classList.remove('active');

      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }

      hideExitPill();
    }
  }

  function showExitPill() {
    if (!exitPill) {
      exitPill = document.createElement('div');
      exitPill.className = 'zen-exit-pill';
      exitPill.innerHTML = `
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        Salir de Enfoque (Esc)
      `;
      exitPill.addEventListener('click', toggleFocusMode);
    }
    document.body.appendChild(exitPill);
  }

  function hideExitPill() {
    if (exitPill && exitPill.parentElement) {
      exitPill.parentElement.removeChild(exitPill);
    }
  }

  function setupFocusMode() {
    const btn = document.getElementById('btnFocusMode');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        toggleFocusMode();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isFocusMode) {
        toggleFocusMode();
      }
      if (e.key === 'F11' && !e.ctrlKey) {
        // Permitir alternar con F11
        e.preventDefault();
        toggleFocusMode();
      }
    });

    document.addEventListener('fullscreenchange', function () {
      if (!document.fullscreenElement && isFocusMode) {
        toggleFocusMode();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFocusMode);
  } else {
    setupFocusMode();
  }

  window.miVit3.toggleFocusMode = toggleFocusMode;
})();
