/**
 * miVIT3 — Módulo de Conteo Dinámico de Palabras y Caracteres (Word & Character Counter)
 * Analiza en tiempo real el contenido del currículum con métricas de palabras, caracteres y tiempo de lectura.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  function updateWordCount() {
    const doc = document.getElementById('cv-document');
    const badgeText = document.getElementById('wordCountText');
    const badge = document.getElementById('wordCountBadge');
    if (!doc || !badgeText) return;

    const text = doc.innerText || '';
    const trimmed = text.trim();
    const words = trimmed.length ? trimmed.split(/\s+/).filter(w => w.length > 0).length : 0;
    const chars = text.replace(/\s/g, '').length;
    const readingTimeMin = Math.max(1, Math.ceil(words / 180));

    badgeText.textContent = `${words} pal.`;
    if (badge) {
      badge.title = `${words} palabras | ${chars} caracteres | ~${readingTimeMin} min de lectura estimado`;
    }
  }

  function init() {
    const doc = document.getElementById('cv-document');
    if (doc) {
      const debouncedFn = window.debounce ? window.debounce(updateWordCount, 250) : updateWordCount;
      doc.addEventListener('input', debouncedFn);
      document.addEventListener('selectionchange', debouncedFn);
    }
    // Conteo inicial una vez restaurado el contenido
    setTimeout(updateWordCount, 350);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.miVit3.updateWordCount = updateWordCount;
})();
