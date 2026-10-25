/**
 * miVIT3 — Módulo de Arrastrar y Soltar (HTML5 Drag & Drop - Fase 1)
 * Reordenamiento fluido y modular de bloques de sección e ítems individuales con asas dedicadas.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  function triggerAutoSave() {
    if (typeof window.triggerAutoSave === 'function') {
      window.triggerAutoSave();
    } else if (window.miVit3 && typeof window.miVit3.triggerAutoSave === 'function') {
      window.miVit3.triggerAutoSave();
    }
  }

  function updatePageBreakAndCapacity() {
    if (typeof window.updatePageBreakAndCapacity === 'function') {
      window.updatePageBreakAndCapacity();
    } else if (window.miVit3 && typeof window.miVit3.updatePageBreakAndCapacity === 'function') {
      window.miVit3.updatePageBreakAndCapacity();
    }
  }

  function setupDragAndDrop() {
    ensureDragHandles();

    const cvDoc = document.getElementById('cv-document');
    if (!cvDoc) return;

    let draggedEl = null;
    let dragType = null; // 'section' | 'item'

    cvDoc.addEventListener('dragstart', function (e) {
      const handle = e.target.closest('.drag-handle');
      if (!handle) return;

      const item = handle.closest('.cv-item');
      const section = handle.closest('.cv-section');

      if (handle.classList.contains('item-drag-handle') && item) {
        draggedEl = item;
        dragType = 'item';
      } else if (section) {
        draggedEl = section;
        dragType = 'section';
      }

      if (draggedEl) {
        draggedEl.classList.add('is-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');
      }
    });

    cvDoc.addEventListener('dragover', function (e) {
      if (!draggedEl) return;

      const target = dragType === 'section'
        ? e.target.closest('.cv-section')
        : e.target.closest('.cv-item');

      if (!target || target === draggedEl) return;

      if (dragType === 'item' && target.closest('.cv-section') !== draggedEl.closest('.cv-section')) {
        return;
      }

      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';

      const rect = target.getBoundingClientRect();
      const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;

      target.classList.toggle('drag-over-top', !next);
      target.classList.toggle('drag-over-bottom', next);
    });

    cvDoc.addEventListener('dragleave', function (e) {
      const target = e.target.closest('.cv-section, .cv-item');
      if (target) {
        target.classList.remove('drag-over-top', 'drag-over-bottom');
      }
    });

    cvDoc.addEventListener('drop', function (e) {
      if (!draggedEl) return;

      const target = dragType === 'section'
        ? e.target.closest('.cv-section')
        : e.target.closest('.cv-item');

      if (!target || target === draggedEl) return;

      e.preventDefault();
      const rect = target.getBoundingClientRect();
      const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;

      target.parentNode.insertBefore(draggedEl, next ? target.nextSibling : target);
      target.classList.remove('drag-over-top', 'drag-over-bottom');

      triggerAutoSave();
      updatePageBreakAndCapacity();
      if (window.showToast) {
        window.showToast(dragType === 'section' ? 'Sección reordenada' : 'Elemento reordenado');
      }
    });

    cvDoc.addEventListener('dragend', function () {
      if (draggedEl) {
        draggedEl.classList.remove('is-dragging');
        draggedEl = null;
        dragType = null;
      }
      cvDoc.querySelectorAll('.drag-over-top, .drag-over-bottom').forEach(el => {
        el.classList.remove('drag-over-top', 'drag-over-bottom');
      });
      updatePageBreakAndCapacity();
    });
  }

  function ensureDragHandles() {
    const cvDoc = document.getElementById('cv-document');
    if (!cvDoc) return;

    // Secciones
    cvDoc.querySelectorAll('.cv-section').forEach(section => {
      const header = section.querySelector('.cv-section-header');
      if (header && !header.querySelector('.drag-handle:not(.item-drag-handle)')) {
        const handle = document.createElement('span');
        handle.className = 'drag-handle';
        handle.setAttribute('draggable', 'true');
        handle.setAttribute('title', 'Arrastrar sección para reordenar');
        handle.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>`;
        header.insertBefore(handle, header.firstChild);
      }
    });

    // Items individuales
    cvDoc.querySelectorAll('.cv-item').forEach(item => {
      const actions = item.querySelector('.item-actions');
      if (actions && !actions.querySelector('.item-drag-handle')) {
        const handle = document.createElement('span');
        handle.className = 'drag-handle item-drag-handle';
        handle.setAttribute('draggable', 'true');
        handle.setAttribute('title', 'Arrastrar elemento para reordenar');
        handle.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>`;
        actions.insertBefore(handle, actions.firstChild);
      }
    });
  }

  // Exportar funciones
  window.setupDragAndDrop = setupDragAndDrop;
  window.ensureDragHandles = ensureDragHandles;

  window.miVit3.setupDragAndDrop = setupDragAndDrop;
  window.miVit3.ensureDragHandles = ensureDragHandles;

})();
