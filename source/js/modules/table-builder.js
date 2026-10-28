/**
 * miVIT3 — Módulo de Generación y Manejo de Tablas Editables (Table Builder)
 * Permite insertar tablas estilizadas (idiomas, certificaciones, métricas) con controles de fila.
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

  function insertTable(rows = 3, cols = 2) {
    const doc = document.getElementById('cv-document');
    if (!doc) return;

    let headersHtml = '';
    for (let c = 1; c <= cols; c++) {
      headersHtml += `<th contenteditable="true">Encabezado ${c}</th>`;
    }

    let rowsHtml = '';
    for (let r = 1; r < rows; r++) {
      let cellsHtml = '';
      for (let c = 1; c <= cols; c++) {
        cellsHtml += `<td contenteditable="true">Dato ${r}.${c}</td>`;
      }
      rowsHtml += `<tr>${cellsHtml}</tr>`;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'cv-table-wrapper';
    wrapper.innerHTML = `
      <div class="cv-table-actions" contenteditable="false">
        <button type="button" class="table-action-btn btn-add-row" title="Añadir fila abajo">+ Fila</button>
        <button type="button" class="table-action-btn btn-del-row" title="Eliminar última fila">- Fila</button>
        <button type="button" class="table-action-btn btn-del-table" title="Eliminar tabla completa">✕</button>
      </div>
      <table class="cv-table">
        <thead>
          <tr>${headersHtml}</tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;

    // Intentar insertar en la posición actual del cursor si está dentro del documento
    const selection = window.getSelection();
    let inserted = false;

    if (selection && selection.rangeCount) {
      const range = selection.getRangeAt(0);
      if (doc.contains(range.commonAncestorContainer)) {
        range.collapse(false);
        range.insertNode(wrapper);
        inserted = true;
      }
    }

    // Si no había cursor dentro del documento, anexar al final de la primera sección visible
    if (!inserted) {
      const firstSectionBody = doc.querySelector('.cv-section-body') || doc;
      firstSectionBody.appendChild(wrapper);
    }

    triggerAutoSave();

    // Enfocar el primer encabezado
    const firstTh = wrapper.querySelector('th');
    if (firstTh) {
      firstTh.focus();
    }

    const toast = window.showToast || (window.miVit3 && window.miVit3.showToast);
    if (toast) toast(`Tabla de ${rows}×${cols} insertada.`);
  }

  function promptAndInsertTable() {
    // Cerrar cualquier dropdown del ribbon
    document.querySelectorAll('.ribbon-dropdown.open').forEach(d => d.classList.remove('open'));

    const promptFn = window.customPrompt || (window.miVit3 && window.miVit3.prompt);
    if (promptFn) {
      promptFn('Insertar Tabla en CV', 'Ingresa el número de filas y columnas (ejemplo: 3x2):', '3x2', 'Filas x Columnas').then(res => {
        if (!res) return;
        parseAndInsert(res);
      });
    } else {
      const res = prompt('Ingresa el tamaño de la tabla (filas x columnas, ej: 3x2):', '3x2');
      if (res) parseAndInsert(res);
    }
  }

  function parseAndInsert(str) {
    const parts = str.toLowerCase().split('x');
    let rows = parseInt(parts[0], 10) || 3;
    let cols = parseInt(parts[1], 10) || 2;

    rows = Math.max(2, Math.min(rows, 15));
    cols = Math.max(1, Math.min(cols, 8));

    insertTable(rows, cols);
  }

  function setupTableActions() {
    // Delegación de eventos para botones de tabla dentro de cv-document
    const doc = document.getElementById('cv-document');
    if (!doc) return;

    doc.addEventListener('click', function (e) {
      const addRowBtn = e.target.closest('.btn-add-row');
      if (addRowBtn) {
        e.preventDefault();
        const wrapper = addRowBtn.closest('.cv-table-wrapper');
        const table = wrapper ? wrapper.querySelector('.cv-table') : null;
        if (!table) return;

        const tbody = table.querySelector('tbody');
        const headerCols = table.querySelectorAll('thead th').length || 2;

        let cellsHtml = '';
        for (let i = 0; i < headerCols; i++) {
          cellsHtml += `<td contenteditable="true">Nuevo dato</td>`;
        }

        const newRow = document.createElement('tr');
        newRow.innerHTML = cellsHtml;
        tbody.appendChild(newRow);

        triggerAutoSave();
        return;
      }

      const delRowBtn = e.target.closest('.btn-del-row');
      if (delRowBtn) {
        e.preventDefault();
        const wrapper = delRowBtn.closest('.cv-table-wrapper');
        const tbody = wrapper ? wrapper.querySelector('tbody') : null;
        if (!tbody) return;

        const rows = tbody.querySelectorAll('tr');
        if (rows.length > 1) {
          tbody.removeChild(rows[rows.length - 1]);
          triggerAutoSave();
        } else {
          const toast = window.showToast || (window.miVit3 && window.miVit3.showToast);
          if (toast) toast('La tabla debe tener al menos una fila de datos.');
        }
        return;
      }

      const delTableBtn = e.target.closest('.btn-del-table');
      if (delTableBtn) {
        e.preventDefault();
        const wrapper = delTableBtn.closest('.cv-table-wrapper');
        if (wrapper && wrapper.parentNode) {
          wrapper.parentNode.removeChild(wrapper);
          triggerAutoSave();
          const toast = window.showToast || (window.miVit3 && window.miVit3.showToast);
          if (toast) toast('Tabla eliminada.');
        }
      }
    });

    // Enlazar botón del ribbon "Insertar Tabla"
    const btn = document.getElementById('btnInsertTable');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        promptAndInsertTable();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupTableActions);
  } else {
    setupTableActions();
  }

  window.miVit3.insertTable = insertTable;
  window.miVit3.promptAndInsertTable = promptAndInsertTable;
})();
