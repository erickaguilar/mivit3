/**
 * miVIT3 — Módulo de Control de Zoom del Lienzo (Zoom Controller)
 * Permite alejar para ver la página completa o acercar para editar detalles en cualquier resolución.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  let currentZoom = 1.0;
  const MIN_ZOOM = 0.6;
  const MAX_ZOOM = 1.4;
  const STEP = 0.1;

  function applyZoom(zoom) {
    currentZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(zoom * 10) / 10));
    const paper = document.getElementById('cv-paper');
    const label = document.getElementById('zoomLevelText');

    if (paper) {
      paper.style.transform = `scale(${currentZoom})`;
      paper.style.transformOrigin = 'top center';

      // Ajustar margen inferior si se agranda para evitar cortes
      if (currentZoom > 1) {
        const extraHeight = paper.offsetHeight * (currentZoom - 1);
        paper.style.marginBottom = `${extraHeight + 20}px`;
      } else {
        paper.style.marginBottom = '20px';
      }
    }

    if (label) {
      label.textContent = `${Math.round(currentZoom * 100)}%`;
    }
  }

  function zoomIn() {
    applyZoom(currentZoom + STEP);
  }

  function zoomOut() {
    applyZoom(currentZoom - STEP);
  }

  function zoomReset() {
    applyZoom(1.0);
    const toast = window.showToast || (window.miVit3 && window.miVit3.showToast);
    if (toast) toast('Zoom restablecido al 100%.');
  }

  function setupZoom() {
    const btnIn = document.getElementById('btnZoomIn');
    const btnOut = document.getElementById('btnZoomOut');
    const label = document.getElementById('zoomLevelText');

    if (btnIn) btnIn.addEventListener('click', zoomIn);
    if (btnOut) btnOut.addEventListener('click', zoomOut);
    if (label) label.addEventListener('click', zoomReset);

    // Atajos de teclado: Ctrl + rueda del ratón sobre el escritorio
    const desk = document.querySelector('.document-desk');
    if (desk) {
      desk.addEventListener('wheel', function (e) {
        if (e.ctrlKey) {
          e.preventDefault();
          if (e.deltaY < 0) {
            zoomIn();
          } else {
            zoomOut();
          }
        }
      }, { passive: false });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupZoom);
  } else {
    setupZoom();
  }

  window.miVit3.applyZoom = applyZoom;
  window.miVit3.zoomIn = zoomIn;
  window.miVit3.zoomOut = zoomOut;
  window.miVit3.zoomReset = zoomReset;
})();
