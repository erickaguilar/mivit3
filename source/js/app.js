/**
 * miVIT3 — Orquestador Principal de la Aplicación (App Bootstrap)
 * Coordina la inicialización secuencial de los subsistemas y gestiona las acciones globales del documento.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  let cvDocument = null;

  // =========================================================================
  // Configuración de Acciones Principales y Modales
  // =========================================================================

  function setupMainActions() {
    // Cargar datos de ejemplo
    const btnSample = document.getElementById('btnSampleData');
    if (btnSample) {
      btnSample.addEventListener('click', async function () {
        const confirmFn = window.customConfirm || (window.miVit3 && window.miVit3.confirm);
        const confirmed = confirmFn
          ? await confirmFn(
              '¿Cargar currículum de ejemplo?',
              'Se reemplazará el contenido actual con los datos profesionales de muestra. Si tienes información personal escrita, te recomendamos descargar un respaldo JSON primero.',
              'warning',
              'Cargar ejemplo',
              'Cancelar'
            )
          : confirm('¿Cargar currículum de ejemplo?');

        if (confirmed && typeof window.loadSampleData === 'function') {
          window.loadSampleData(true);
        }
      });
    }

    // Limpiar documento
    const btnClear = document.getElementById('btnClearData');
    if (btnClear) {
      btnClear.addEventListener('click', async function () {
        const confirmFn = window.customConfirm || (window.miVit3 && window.miVit3.confirm);
        const confirmed = confirmFn
          ? await confirmFn(
              '¿Vaciar currículum completo?',
              '¿Estás seguro de que deseas vaciar el documento para empezar a redactar desde una hoja en blanco?',
              'danger',
              'Sí, vaciar',
              'Cancelar'
            )
          : confirm('¿Vaciar currículum completo?');

        if (confirmed && typeof window.clearDocument === 'function') {
          window.clearDocument();
        }
      });
    }

    // Exportar a JSON
    const btnExport = document.getElementById('btnExportJson');
    if (btnExport) {
      btnExport.addEventListener('click', function () {
        if (typeof window.exportToJson === 'function') {
          window.exportToJson();
        }
      });
    }

    // Importar desde JSON
    const jsonFileInput = document.getElementById('jsonFileInput');
    const btnImport = document.getElementById('btnImportJson');
    if (btnImport && jsonFileInput) {
      btnImport.addEventListener('click', () => jsonFileInput.click());
      jsonFileInput.addEventListener('change', function (e) {
        if (typeof window.importFromJson === 'function') {
          window.importFromJson(e);
        }
      });
    }

    // Exportar a Portafolio Web HTML (Fase 3)
    const btnExportWeb = document.getElementById('btnExportWeb');
    if (btnExportWeb) {
      btnExportWeb.addEventListener('click', function () {
        if (typeof window.exportToWebHtml === 'function') {
          window.exportToWebHtml();
        }
      });
    }

    // Modal de Guía de Publicación (Fase 3)
    const btnShowPublish = document.getElementById('btnShowPublishGuide');
    const modalPublish = document.getElementById('publishModal');
    const btnClosePublish = document.getElementById('btnClosePublish');
    const btnQuickExport = document.getElementById('btnQuickExportFromModal');

    if (btnShowPublish && modalPublish) {
      btnShowPublish.addEventListener('click', function () {
        modalPublish.classList.add('show');
      });
      if (btnClosePublish) {
        btnClosePublish.addEventListener('click', function () {
          modalPublish.classList.remove('show');
        });
      }
      modalPublish.addEventListener('click', function (e) {
        if (e.target === modalPublish) {
          modalPublish.classList.remove('show');
        }
      });
    }

    if (btnQuickExport) {
      btnQuickExport.addEventListener('click', function () {
        if (modalPublish) modalPublish.classList.remove('show');
        if (typeof window.exportToWebHtml === 'function') {
          window.exportToWebHtml();
        }
      });
    }

    // Imprimir / Guardar en PDF
    const btnPrint = document.getElementById('btnPrintPdf');
    if (btnPrint) {
      btnPrint.addEventListener('click', function (e) {
        if (e) e.preventDefault();
        window.print();
      });
    }

    // Añadir sección personalizada
    const btnAddSection = document.getElementById('btnAddSection');
    if (btnAddSection) {
      btnAddSection.addEventListener('click', window.miVit3.addCustomSection);
    }

    // Modal de Tips
    const btnTips = document.getElementById('btnShowTips');
    const modalTips = document.getElementById('tipsModal');
    const btnCloseTips = document.getElementById('btnCloseTips');
    if (btnTips && modalTips) {
      btnTips.addEventListener('click', function () {
        modalTips.classList.add('show');
      });
      if (btnCloseTips) {
        btnCloseTips.addEventListener('click', function () {
          modalTips.classList.remove('show');
        });
      }
      modalTips.addEventListener('click', function (e) {
        if (e.target === modalTips) {
          modalTips.classList.remove('show');
        }
      });
    }
  }

  // =========================================================================
  // Inicialización Global de la Aplicación
  // =========================================================================

  function init() {
    cvDocument = document.getElementById('cv-document');
    window.cvDocument = cvDocument;
    if (!cvDocument) return;

    // 1. Botones de acción principales (PDF, Datos Ejemplo, Limpiar, JSON, Web, Tips, Publicar)
    try {
      setupMainActions();
    } catch (e) {
      console.error('Error inicializando acciones principales:', e);
    }

    // 2. Cargar contenido guardado o datos de ejemplo
    try {
      if (typeof window.loadSavedContent === 'function') {
        window.loadSavedContent();
      }
    } catch (e) {
      console.error('Error cargando contenido guardado:', e);
    }

    // 3. Eventos de barra de herramientas estilo Word
    try {
      if (typeof window.setupWordToolbar === 'function') {
        window.setupWordToolbar();
      }
    } catch (e) {
      console.error('Error configurando barra Word:', e);
    }

    // 4. Eventos de plantillas y colores
    try {
      if (typeof window.setupSettingsBar === 'function') {
        window.setupSettingsBar();
      }
    } catch (e) {
      console.error('Error configurando selector de plantillas:', e);
    }

    // 5. Control de Densidad y Espaciado
    try {
      if (typeof window.setupDensityControls === 'function') {
        window.setupDensityControls();
      }
    } catch (e) {
      console.error('Error configurando controles de densidad:', e);
    }

    // 6. Drag & Drop modular
    try {
      if (typeof window.setupDragAndDrop === 'function') {
        window.setupDragAndDrop();
      }
    } catch (e) {
      console.error('Error configurando drag and drop:', e);
    }

    // 7. Paginación y medición en vivo A4
    try {
      if (typeof window.setupPageBreakObserver === 'function') {
        window.setupPageBreakObserver();
      }
    } catch (e) {
      console.error('Error configurando observador de paginación:', e);
    }

    // 8. Auditor ATS & Comparador de Vacante
    try {
      if (typeof window.setupAtsEngine === 'function') {
        window.setupAtsEngine();
      }
    } catch (e) {
      console.error('Error configurando motor ATS:', e);
    }

    // 9. Eventos de carga de imagen de avatar
    try {
      if (typeof window.setupAvatarUpload === 'function') {
        window.setupAvatarUpload();
      }
    } catch (e) {
      console.error('Error configurando avatar:', e);
    }

    // 10. Atajos de teclado (Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+S, Ctrl+P)
    try {
      if (typeof window.setupKeyboardShortcuts === 'function') {
        window.setupKeyboardShortcuts();
      }
    } catch (e) {
      console.error('Error configurando atajos de teclado:', e);
    }

    // 11. Escuchar cambios para autoguardado
    try {
      if (typeof window.setupAutoSave === 'function') {
        window.setupAutoSave();
      }
    } catch (e) {
      console.error('Error configurando autoguardado:', e);
    }

    // 12. Soporte PWA Offline
    try {
      if (typeof window.setupPwa === 'function') {
        window.setupPwa();
      }
    } catch (e) {
      console.error('Error configurando PWA:', e);
    }
  }

  window.init = init;
  window.miVit3.init = init;

  // Ejecutar al cargar el DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
