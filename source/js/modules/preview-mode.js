/**
 * miVIT3 — Módulo de Vista Previa Limpia (Preview Mode)
 * Muestra el currículum exactamente como lo verá el reclutador, ocultando controles de edición.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  let isPreview = false;
  let exitBar = null;

  function togglePreview() {
    isPreview = !isPreview;
    const doc = document.getElementById('cv-document');
    const btn = document.getElementById('btnTogglePreview');
    if (!doc) return;

    if (isPreview) {
      document.body.classList.add('cv-preview-mode');
      if (btn) btn.classList.add('active');

      // Desactivar temporalmente contenteditable
      const editableElements = doc.querySelectorAll('[contenteditable="true"]');
      editableElements.forEach(el => {
        el.setAttribute('data-was-editable', 'true');
        el.setAttribute('contenteditable', 'false');
      });

      showExitBar();

      const toast = window.showToast || (window.miVit3 && window.miVit3.showToast);
      if (toast) toast('Vista previa activa: Así verá tu CV el reclutador.');
    } else {
      document.body.classList.remove('cv-preview-mode');
      if (btn) btn.classList.remove('active');

      // Restaurar contenteditable
      const previouslyEditable = doc.querySelectorAll('[data-was-editable="true"]');
      previouslyEditable.forEach(el => {
        el.setAttribute('contenteditable', 'true');
        el.removeAttribute('data-was-editable');
      });

      hideExitBar();
    }
  }

  function showExitBar() {
    if (!exitBar) {
      exitBar = document.createElement('div');
      exitBar.className = 'preview-exit-floating-pill';
      exitBar.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        <span>Modo Vista Previa · Volver a Editar</span>
      `;
      exitBar.addEventListener('click', togglePreview);
    }
    document.body.appendChild(exitBar);
  }

  function hideExitBar() {
    if (exitBar && exitBar.parentElement) {
      exitBar.parentElement.removeChild(exitBar);
    }
  }

  function setupPreview() {
    const btn = document.getElementById('btnTogglePreview');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        togglePreview();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isPreview) {
        togglePreview();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPreview);
  } else {
    setupPreview();
  }

  window.miVit3.togglePreview = togglePreview;
})();
