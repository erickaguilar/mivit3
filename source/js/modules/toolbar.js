/**
 * miVIT3 — Módulo de Barra de Herramientas Word (Toolbar, Atajos y Avatar)
 * Edición enriquecida en vivo (Rich Text Formatting), atajos de teclado y carga de fotos.
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

  function setupWordToolbar() {
    const toolbar = document.querySelector('.word-toolbar');
    if (!toolbar) return;

    // Delegación de clics en la barra de herramientas (botones y dropdowns)
    toolbar.addEventListener('click', function (e) {
      // 1. Manejo de botones de apertura/cierre de menús desplegables del ribbon
      const dropdownBtn = e.target.closest('.ribbon-dropdown-btn');
      if (dropdownBtn) {
        e.preventDefault();
        e.stopPropagation();
        const dropdown = dropdownBtn.closest('.ribbon-dropdown');
        if (!dropdown) return;
        const wasOpen = dropdown.classList.contains('open');

        // Cerrar otros dropdowns del ribbon
        document.querySelectorAll('.ribbon-dropdown.open').forEach(d => {
          if (d !== dropdown) d.classList.remove('open');
        });

        if (wasOpen) {
          dropdown.classList.remove('open');
        } else {
          dropdown.classList.add('open');
        }
        return;
      }

      // 2. Manejo de ítems de menú del dropdown o botones de herramientas
      const btn = e.target.closest('.tool-btn') || e.target.closest('.ribbon-menu-item');
      if (!btn) return;

      const command = btn.dataset.command;
      const value = btn.dataset.value || null;

      // Cerrar cualquier dropdown abierto al ejecutar acción
      document.querySelectorAll('.ribbon-dropdown.open').forEach(d => d.classList.remove('open'));

      if (!command) return;

      e.preventDefault();
      executeFormatCommand(command, value);
      updateToolbarState();
    });

    // Cerrar menús desplegables al hacer clic fuera o presionar Escape
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.ribbon-dropdown')) {
        document.querySelectorAll('.ribbon-dropdown.open').forEach(d => d.classList.remove('open'));
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.ribbon-dropdown.open').forEach(d => d.classList.remove('open'));
      }
    });

    // Selector de tipografía
    const fontSelect = document.getElementById('fontFamilySelect');
    if (fontSelect) {
      fontSelect.addEventListener('change', function () {
        executeFormatCommand('fontName', this.value);
        triggerAutoSave();
      });
    }

    // Selector de tamaño de fuente
    const sizeSelect = document.getElementById('fontSizeSelect');
    if (sizeSelect) {
      sizeSelect.addEventListener('change', function () {
        applyFontSize(this.value);
        triggerAutoSave();
      });
    }

    // Selector de formato de bloque (Párrafo / H1 / H2 / H3)
    const blockSelect = document.getElementById('blockFormatSelect');
    if (blockSelect) {
      blockSelect.addEventListener('change', function () {
        executeFormatCommand('formatBlock', this.value);
        triggerAutoSave();
      });
    }

    // Selector de color de texto
    const textColorPicker = document.getElementById('textColorPicker');
    if (textColorPicker) {
      textColorPicker.addEventListener('input', function () {
        executeFormatCommand('foreColor', this.value);
        const indicator = document.getElementById('textColorIndicator');
        if (indicator) indicator.style.backgroundColor = this.value;
        triggerAutoSave();
      });
    }

    // Selector de color de resaltador
    const highlightColorPicker = document.getElementById('highlightColorPicker');
    if (highlightColorPicker) {
      highlightColorPicker.addEventListener('input', function () {
        executeFormatCommand('hiliteColor', this.value);
        const indicator = document.getElementById('highlightColorIndicator');
        if (indicator) indicator.style.backgroundColor = this.value;
        triggerAutoSave();
      });
    }

    // Actualizar estado activo de botones al cambiar selección
    document.addEventListener('selectionchange', window.debounce ? window.debounce(updateToolbarState, 100) : updateToolbarState);
  }

  async function executeFormatCommand(command, value = null) {
    if (command === 'createLink') {
      const savedRange = typeof window.saveSelection === 'function' ? window.saveSelection() : null;
      const promptFn = window.customPrompt || (window.miVit3 && window.miVit3.prompt);
      const url = promptFn
        ? await promptFn('Insertar Enlace Web', 'Ingresa la dirección URL para el texto seleccionado:', 'https://', 'https://ejemplo.com')
        : prompt('Ingresa la URL:', 'https://');

      if (url && url.trim() && url.trim() !== 'https://') {
        if (typeof window.restoreSelection === 'function') window.restoreSelection(savedRange);
        document.execCommand('createLink', false, url.trim());
        triggerAutoSave();
      }
      return;
    }

    if (command === 'insertQuote') {
      document.execCommand('formatBlock', false, '<blockquote>');
      triggerAutoSave();
      return;
    }

    document.execCommand(command, false, value);
    triggerAutoSave();
  }

  function applyFontSize(sizeValue) {
    const cvDoc = document.getElementById('cv-document');
    if (!cvDoc) return;
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    document.execCommand('fontSize', false, '3');
    const fontElements = cvDoc.getElementsByTagName('font');
    for (let i = 0; i < fontElements.length; i++) {
      if (fontElements[i].size === '3') {
        fontElements[i].removeAttribute('size');
        fontElements[i].style.fontSize = sizeValue;
      }
    }
  }

  function updateToolbarState() {
    const commands = [
      'bold', 'italic', 'underline', 'strikeThrough',
      'subscript', 'superscript',
      'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
      'insertUnorderedList', 'insertOrderedList'
    ];
    commands.forEach(cmd => {
      const btn = document.querySelector(`.tool-btn[data-command="${cmd}"]`);
      if (btn) {
        try {
          if (document.queryCommandState(cmd)) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        } catch (e) {
          // Ignorar comandos no soportados en el contexto actual
        }
      }
    });
  }

  /**
   * Carga de Fotografía de Perfil (Vanilla FileReader)
   */
  function setupAvatarUpload() {
    const fileInput = document.getElementById('avatarFileInput');
    if (!fileInput) return;

    fileInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        const alertFn = window.customAlert || (window.miVit3 && window.miVit3.alert);
        if (alertFn) {
          alertFn('Archivo de imagen no válido', 'Por favor selecciona un archivo con formato de imagen válido (PNG, JPG, SVG o WebP).', 'warning');
        } else {
          alert('Por favor selecciona un archivo de imagen válido.');
        }
        return;
      }

      const reader = new FileReader();
      reader.onload = function (event) {
        const avatarImg = document.getElementById('cvAvatarImg');
        const avatarPlaceholder = document.getElementById('cvAvatarPlaceholder');

        if (avatarImg) {
          avatarImg.src = event.target.result;
          avatarImg.style.display = 'block';
        }
        if (avatarPlaceholder) {
          avatarPlaceholder.style.display = 'none';
        }

        triggerAutoSave();
        const toastFn = window.showToast || (window.miVit3 && window.miVit3.showToast);
        if (toastFn) toastFn('Foto de perfil actualizada correctamente.');
      };

      reader.readAsDataURL(file);
    });
  }

  // Inicialización cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    setupWordToolbar();
    setupAvatarUpload();
  }

  // Exportar al namespace global miVit3
  window.miVit3.setupWordToolbar = setupWordToolbar;
  window.miVit3.setupAvatarUpload = setupAvatarUpload;
  window.miVit3.executeFormatCommand = executeFormatCommand;
  window.miVit3.updateToolbarState = updateToolbarState;

})();
