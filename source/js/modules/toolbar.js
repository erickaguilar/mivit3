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

    // Delegación de clics en botones de la barra
    toolbar.addEventListener('click', function (e) {
      const btn = e.target.closest('.tool-btn');
      if (!btn) return;

      const command = btn.dataset.command;
      const value = btn.dataset.value || null;

      if (!command) return;

      e.preventDefault();
      executeFormatCommand(command, value);
      updateToolbarState();
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
    const commands = ['bold', 'italic', 'underline', 'strikeThrough', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'insertUnorderedList', 'insertOrderedList'];
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
        }
        return;
      }

      const reader = new FileReader();
      reader.onload = function (event) {
        const avatarImg = document.getElementById('cvAvatar');
        if (avatarImg) {
          avatarImg.src = event.target.result;
          triggerAutoSave();
          if (window.showToast) window.showToast('Foto de perfil actualizada');
        }
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Atajos de Teclado Estilo Word
   */
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (!cmdOrCtrl) return;

      switch (e.key.toLowerCase()) {
        case 'b': // Negrita
          e.preventDefault();
          executeFormatCommand('bold');
          updateToolbarState();
          break;
        case 'i': // Cursiva
          e.preventDefault();
          executeFormatCommand('italic');
          updateToolbarState();
          break;
        case 'u': // Subrayado
          e.preventDefault();
          executeFormatCommand('underline');
          updateToolbarState();
          break;
        case 's': // Guardar manual
          e.preventDefault();
          triggerAutoSave();
          if (window.showToast) window.showToast('Guardado en el navegador');
          break;
        case 'p': // Imprimir / Exportar PDF
          e.preventDefault();
          window.print();
          break;
      }
    });
  }

  // Exportar funciones
  window.setupWordToolbar = setupWordToolbar;
  window.setupAvatarUpload = setupAvatarUpload;
  window.setupKeyboardShortcuts = setupKeyboardShortcuts;
  window.executeFormatCommand = executeFormatCommand;
  window.updateToolbarState = updateToolbarState;

  window.miVit3.setupWordToolbar = setupWordToolbar;
  window.miVit3.setupAvatarUpload = setupAvatarUpload;
  window.miVit3.setupKeyboardShortcuts = setupKeyboardShortcuts;

})();
