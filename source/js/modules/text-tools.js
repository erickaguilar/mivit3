/**
 * miVIT3 — Módulo de Herramientas de Texto (Text Tools)
 * Capitalización de texto (Aa), Interlineado de párrafo y Selector de Símbolos/Emojis para CV.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  let savedRangeForSymbols = null;

  function triggerAutoSave() {
    if (typeof window.triggerAutoSave === 'function') {
      window.triggerAutoSave();
    } else if (window.miVit3 && typeof window.miVit3.triggerAutoSave === 'function') {
      window.miVit3.triggerAutoSave();
    }
  }

  /* ==========================================================================
     1. Menú de Capitalización ("Aa")
     ========================================================================== */

  function changeCase(caseType) {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount || selection.isCollapsed) {
      const toast = window.showToast || (window.miVit3 && window.miVit3.showToast);
      if (toast) toast('Selecciona el texto que deseas modificar.');
      return;
    }

    const text = selection.toString();
    if (!text) return;

    let transformed = text;
    if (caseType === 'upper') {
      transformed = text.toUpperCase();
    } else if (caseType === 'lower') {
      transformed = text.toLowerCase();
    } else if (caseType === 'title') {
      // Capitalizar cada palabra respetando puntuación
      transformed = text.toLowerCase().replace(/(?:^|\s|\/|-|\()\w/g, match => match.toUpperCase());
    } else if (caseType === 'sentence') {
      // Capitalizar inicio de frase y después de puntos
      transformed = text.toLowerCase().replace(/(^\s*|[.!?]\s+|\n\s*)\w/g, match => match.toUpperCase());
    }

    // Insertar el texto transformado
    document.execCommand('insertText', false, transformed);

    triggerAutoSave();

    // Cerrar cualquier dropdown abierto
    document.querySelectorAll('.ribbon-dropdown.open').forEach(d => d.classList.remove('open'));

    const labels = {
      upper: 'MAYÚSCULAS',
      lower: 'minúsculas',
      title: 'Tipo Título',
      sentence: 'Tipo Oración'
    };
    const toast = window.showToast || (window.miVit3 && window.miVit3.showToast);
    if (toast) toast(`Texto transformado a ${labels[caseType] || caseType}.`);
  }

  function setupCaseChanger() {
    const caseMenu = document.getElementById('caseMenu');
    if (!caseMenu) return;

    caseMenu.addEventListener('click', function (e) {
      const item = e.target.closest('.ribbon-menu-item[data-case]');
      if (!item) return;

      e.preventDefault();
      const caseType = item.dataset.case;
      changeCase(caseType);
    });
  }

  /* ==========================================================================
     2. Selector de Interlineado de Párrafo (Line-Height / Spacing)
     ========================================================================== */

  function applyLineSpacing(spacingValue) {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const doc = document.getElementById('cv-document');
    if (!doc) return;

    let node = selection.anchorNode;
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;

    // Buscar el bloque de párrafo más cercano dentro del documento
    const block = node.closest('p, li, blockquote, h1, h2, h3, .cv-item-desc, .cv-section-body');
    if (block && doc.contains(block)) {
      block.style.lineHeight = spacingValue;
    } else if (node && doc.contains(node)) {
      node.style.lineHeight = spacingValue;
    }

    triggerAutoSave();

    // Cerrar dropdown
    document.querySelectorAll('.ribbon-dropdown.open').forEach(d => d.classList.remove('open'));

    const toast = window.showToast || (window.miVit3 && window.miVit3.showToast);
    if (toast) toast(`Interlineado establecido en ${spacingValue}.`);
  }

  function setupLineSpacing() {
    const spacingMenu = document.getElementById('lineSpacingMenu');
    if (!spacingMenu) return;

    spacingMenu.addEventListener('click', function (e) {
      const item = e.target.closest('.ribbon-menu-item[data-spacing]');
      if (!item) return;

      e.preventDefault();
      const spacing = item.dataset.spacing;
      applyLineSpacing(spacing);
    });
  }

  /* ==========================================================================
     3. Selector Popover de Símbolos & Emojis para CV
     ========================================================================== */

  const CV_SYMBOLS = [
    {
      category: 'Contacto & Redes',
      symbols: ['✉', '📧', '📞', '📱', '📍', '🔗', '💼', '🌐', '🏠', '💬', '🎂', '🆔', '📷', '✈']
    },
    {
      category: 'Viñetas & Logros',
      symbols: ['•', '➔', '➤', '✔', '✓', '✕', '★', '☆', '◆', '◇', '❖', '▸', '⦿', '✦']
    },
    {
      category: 'Separadores & Tipografía',
      symbols: ['|', '•', '—', '–', '·', 'º', 'ª', '©', '®', '™', '§', '€', '$', '%']
    }
  ];

  function createSymbolModal() {
    if (document.getElementById('symbolPickerModal')) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'symbolPickerModal';
    backdrop.className = 'symbol-modal-backdrop';

    let categoriesHtml = '';
    CV_SYMBOLS.forEach(cat => {
      let buttonsHtml = '';
      cat.symbols.forEach(sym => {
        buttonsHtml += `<button type="button" class="symbol-btn" data-symbol="${sym}" title="Insertar ${sym}">${sym}</button>`;
      });

      categoriesHtml += `
        <div class="symbol-category">
          <div class="symbol-category-title">${cat.category}</div>
          <div class="symbol-grid">${buttonsHtml}</div>
        </div>
      `;
    });

    backdrop.innerHTML = `
      <div class="symbol-picker-card" role="dialog" aria-modal="true" aria-labelledby="symbolPickerTitle">
        <div class="symbol-header">
          <h3 id="symbolPickerTitle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            Insertar Símbolo o Icono en CV
          </h3>
          <button type="button" class="symbol-close-btn" id="btnSymbolPickerClose" title="Cerrar (Esc)">✕</button>
        </div>
        <div class="symbol-body">
          ${categoriesHtml}
        </div>
        <div class="symbol-footer">
          Haz clic en cualquier símbolo para insertarlo en la posición actual del cursor.
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    // Eventos del modal
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop || e.target.closest('#btnSymbolPickerClose')) {
        closeSymbolPicker();
        return;
      }

      const symBtn = e.target.closest('.symbol-btn');
      if (symBtn) {
        e.preventDefault();
        const symbol = symBtn.dataset.symbol;
        insertSymbol(symbol);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && backdrop.classList.contains('show')) {
        closeSymbolPicker();
      }
    });
  }

  function openSymbolPicker() {
    createSymbolModal();

    // Guardar selección actual antes de abrir el modal
    const selection = window.getSelection();
    if (selection && selection.rangeCount) {
      savedRangeForSymbols = selection.getRangeAt(0).cloneRange();
    } else {
      savedRangeForSymbols = null;
    }

    // Cerrar cualquier dropdown del ribbon
    document.querySelectorAll('.ribbon-dropdown.open').forEach(d => d.classList.remove('open'));

    const modal = document.getElementById('symbolPickerModal');
    if (modal) {
      modal.classList.add('show');
    }
  }

  function closeSymbolPicker() {
    const modal = document.getElementById('symbolPickerModal');
    if (modal) {
      modal.classList.remove('show');
    }
  }

  function insertSymbol(symbol) {
    closeSymbolPicker();

    // Restaurar el rango o enfocar el documento
    const doc = document.getElementById('cv-document');
    if (!doc) return;

    if (savedRangeForSymbols) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedRangeForSymbols);
    } else {
      doc.focus();
    }

    // Insertar el carácter
    document.execCommand('insertText', false, symbol + ' ');

    triggerAutoSave();

    const toast = window.showToast || (window.miVit3 && window.miVit3.showToast);
    if (toast) toast(`Símbolo insertado: ${symbol}`);
  }

  function setupSymbols() {
    const btn = document.getElementById('btnInsertSymbols');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openSymbolPicker();
      });
    }
  }

  // Inicialización
  function init() {
    setupCaseChanger();
    setupLineSpacing();
    setupSymbols();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.miVit3.changeCase = changeCase;
  window.miVit3.applyLineSpacing = applyLineSpacing;
  window.miVit3.openSymbolPicker = openSymbolPicker;
})();
