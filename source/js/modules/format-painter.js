/**
 * miVIT3 — Módulo de Brocha de Copiar Formato (Format Painter)
 * Permite clonar tipografía, tamaño, color, estilo y peso de un texto y aplicarlo en otra selección.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  let copiedStyles = null;
  let isActive = false;
  let isPersistent = false; // Activado con doble clic para múltiples aplicaciones

  function getSelectionStyles() {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return null;

    let node = selection.anchorNode;
    if (!node) return null;
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentElement;
    }

    if (!node) return null;

    const computed = window.getComputedStyle(node);
    return {
      fontFamily: computed.fontFamily,
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      fontStyle: computed.fontStyle,
      textDecoration: computed.textDecorationLine || computed.textDecoration,
      color: computed.color,
      backgroundColor: computed.backgroundColor
    };
  }

  function activate(persistent = false) {
    const btn = document.getElementById('btnFormatPainter');
    const doc = document.getElementById('cv-document');
    if (!btn || !doc) return;

    const styles = getSelectionStyles();
    if (!styles) {
      const toast = window.showToast || (window.miVit3 && window.miVit3.showToast);
      if (toast) toast('Selecciona primero el texto del cual deseas copiar el formato.');
      return;
    }

    copiedStyles = styles;
    isActive = true;
    isPersistent = persistent;

    btn.classList.add('active');
    if (persistent) {
      btn.classList.add('painter-persistent');
    }

    document.body.classList.add('format-painter-active');

    const toast = window.showToast || (window.miVit3 && window.miVit3.showToast);
    if (toast) {
      toast(persistent
        ? 'Brocha activa (modo continuo). Pinta varias selecciones. Presiona Esc para salir.'
        : 'Brocha de formato activa. Selecciona el texto destino para aplicar.');
    }
  }

  function deactivate() {
    const btn = document.getElementById('btnFormatPainter');
    if (btn) {
      btn.classList.remove('active', 'painter-persistent');
    }
    document.body.classList.remove('format-painter-active');
    isActive = false;
    isPersistent = false;
    copiedStyles = null;
  }

  function applyCopiedStyles() {
    if (!isActive || !copiedStyles) return;

    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    // Verificar que la selección esté dentro del documento editable
    const doc = document.getElementById('cv-document');
    if (!doc || !doc.contains(range.commonAncestorContainer)) return;

    try {
      const span = document.createElement('span');
      span.style.fontFamily = copiedStyles.fontFamily;
      span.style.fontSize = copiedStyles.fontSize;
      span.style.fontWeight = copiedStyles.fontWeight;
      span.style.fontStyle = copiedStyles.fontStyle;
      span.style.textDecoration = copiedStyles.textDecoration;
      span.style.color = copiedStyles.color;

      if (
        copiedStyles.backgroundColor &&
        copiedStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
        copiedStyles.backgroundColor !== 'transparent'
      ) {
        span.style.backgroundColor = copiedStyles.backgroundColor;
      }

      span.appendChild(range.extractContents());
      range.insertNode(span);

      // Mantener la selección en el nuevo span
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      selection.addRange(newRange);
    } catch (e) {
      // Fallback nativo
      if (copiedStyles.fontFamily) document.execCommand('fontName', false, copiedStyles.fontFamily);
      if (copiedStyles.color) document.execCommand('foreColor', false, copiedStyles.color);
    }

    if (typeof window.triggerAutoSave === 'function') {
      window.triggerAutoSave();
    } else if (window.miVit3 && typeof window.miVit3.triggerAutoSave === 'function') {
      window.miVit3.triggerAutoSave();
    }

    const toast = window.showToast || (window.miVit3 && window.miVit3.showToast);
    if (toast) toast('Formato aplicado correctamente.');

    if (!isPersistent) {
      deactivate();
    }
  }

  function setupFormatPainter() {
    const btn = document.getElementById('btnFormatPainter');
    if (!btn) return;

    let clickTimer = null;

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (isActive && !isPersistent) {
        deactivate();
        return;
      }

      // Si es un clic simple
      if (clickTimer === null) {
        clickTimer = setTimeout(() => {
          clickTimer = null;
          if (isActive) {
            deactivate();
          } else {
            activate(false);
          }
        }, 220);
      }
    });

    // Doble clic para activación persistente (modo continuo)
    btn.addEventListener('dblclick', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
      }
      activate(true);
    });

    // Aplicar al terminar de seleccionar en el lienzo
    document.addEventListener('mouseup', function (e) {
      if (!isActive) return;
      // No aplicar si se hace clic sobre la barra de herramientas
      if (e.target.closest('.sticky-toolbars-wrapper')) return;

      setTimeout(applyCopiedStyles, 10);
    });

    // Desactivar con tecla Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isActive) {
        deactivate();
      }
    });
  }

  // Inicialización
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFormatPainter);
  } else {
    setupFormatPainter();
  }

  window.miVit3.setupFormatPainter = setupFormatPainter;
})();
