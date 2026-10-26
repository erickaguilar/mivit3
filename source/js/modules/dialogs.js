/**
 * miVIT3 — Módulo de Diálogos, Notificaciones y Utilidades UI
 * Reemplazo 100% accesible y estilizado de alert, confirm y prompt nativos del navegador.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  let toastTimeout = null;
  let savedRange = null;

  /**
   * Escapar caracteres HTML para prevención XSS
   */
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Función debounce para optimizar eventos de alto disparo
   */
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  /**
   * Guarda y restaura el rango de selección de texto para comandos Word
   */
  function saveSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRange = sel.getRangeAt(0);
      return savedRange;
    }
    return null;
  }

  function restoreSelection(range) {
    const targetRange = range || savedRange;
    if (targetRange) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(targetRange);
    }
  }

  /**
   * Muestra un diálogo modal personalizado con soporte de teclado (Enter / Escape)
   */
  function showCustomDialog({
    title = '',
    message = '',
    type = 'info', // 'info' | 'success' | 'warning' | 'danger'
    confirmText = 'Aceptar',
    cancelText = null,
    showInput = false,
    defaultValue = '',
    placeholder = ''
  }) {
    return new Promise((resolve) => {
      let backdrop = document.getElementById('customDialogBackdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'customDialogBackdrop';
        backdrop.className = 'custom-dialog-backdrop';
        document.body.appendChild(backdrop);
      }

      const icons = {
        info: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
        success: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
        warning: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
        danger: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
      };

      const iconSvg = icons[type] || icons.info;
      const confirmBtnClass = type === 'danger' ? 'dialog-btn btn-danger' : 'dialog-btn btn-confirm';

      backdrop.innerHTML = `
        <div class="custom-dialog-card" role="dialog" aria-modal="true">
          <div class="dialog-header">
            <div class="dialog-icon icon-${type}">
              ${iconSvg}
            </div>
            <div class="dialog-title-wrap">
              <h3>${escapeHtml(title)}</h3>
              <p>${escapeHtml(message)}</p>
            </div>
          </div>
          ${showInput ? `
            <div class="dialog-input-wrap">
              <input type="text" id="customDialogInput" class="dialog-input" value="${escapeHtml(defaultValue)}" placeholder="${escapeHtml(placeholder)}" autocomplete="off">
            </div>
          ` : ''}
          <div class="dialog-actions">
            ${cancelText ? `<button type="button" id="customDialogCancelBtn" class="dialog-btn btn-cancel">${escapeHtml(cancelText)}</button>` : ''}
            <button type="button" id="customDialogConfirmBtn" class="${confirmBtnClass}">${escapeHtml(confirmText)}</button>
          </div>
        </div>
      `;

      backdrop.classList.add('show');

      const input = document.getElementById('customDialogInput');
      const confirmBtn = document.getElementById('customDialogConfirmBtn');
      const cancelBtn = document.getElementById('customDialogCancelBtn');

      if (input) {
        input.focus();
        input.select();
      } else if (confirmBtn) {
        confirmBtn.focus();
      }

      function cleanup(result) {
        backdrop.classList.remove('show');
        document.removeEventListener('keydown', onKeyDown);
        setTimeout(() => {
          backdrop.innerHTML = '';
          resolve(result);
        }, 220);
      }

      function onKeyDown(e) {
        if (e.key === 'Escape') {
          e.preventDefault();
          cleanup(showInput ? null : false);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const val = input ? input.value : true;
          cleanup(val);
        }
      }

      document.addEventListener('keydown', onKeyDown);

      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
          const val = input ? input.value : true;
          cleanup(val);
        });
      }

      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          cleanup(showInput ? null : false);
        });
      }

      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          cleanup(showInput ? null : false);
        }
      });
    });
  }

  function customAlert(title, message, type = 'info') {
    return showCustomDialog({ title, message, type, confirmText: 'Entendido' });
  }

  function customConfirm(title, message, type = 'warning', confirmText = 'Aceptar', cancelText = 'Cancelar') {
    return showCustomDialog({ title, message, type, confirmText, cancelText });
  }

  function customPrompt(title, message, defaultValue = '', placeholder = '') {
    return showCustomDialog({ title, message, type: 'info', showInput: true, defaultValue, placeholder, confirmText: 'Aceptar', cancelText: 'Cancelar' });
  }

  /**
   * Notificación Toast flotante
   */
  function showToast(message, type = 'success') {
    let toast = document.getElementById('toastNotification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotification';
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }

    const iconSvg = type === 'warning'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

    toast.innerHTML = `
      ${iconSvg}
      <span id="toastMsg">${escapeHtml(message)}</span>
    `;

    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // Exportar a nivel global y en window.miVit3
  window.escapeHtml = escapeHtml;
  window.debounce = debounce;
  window.saveSelection = saveSelection;
  window.restoreSelection = restoreSelection;
  window.customAlert = customAlert;
  window.customConfirm = customConfirm;
  window.customPrompt = customPrompt;
  window.showToast = showToast;

  window.miVit3.escapeHtml = escapeHtml;
  window.miVit3.debounce = debounce;
  window.miVit3.saveSelection = saveSelection;
  window.miVit3.restoreSelection = restoreSelection;
  window.miVit3.alert = customAlert;
  window.miVit3.confirm = customConfirm;
  window.miVit3.prompt = customPrompt;
  window.miVit3.showToast = showToast;

})();
