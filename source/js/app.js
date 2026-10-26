/**
 * miVIT3 — Orquestador Principal de la Aplicación (App Bootstrap)
 * Conecta los módulos funcionales, gestiona adición/eliminación de secciones con plantillas semánticas HTML5 (<template>)
 * y coordina la inicialización sin dependencias externas.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  let cvDocument = null;

  // =========================================================================
  // Gestión Dinámica de Secciones & Elementos (Add/Delete) usando <template>
  // =========================================================================

  window.miVit3.addExperienceItem = function (btn) {
    const section = btn.closest('.cv-section');
    const body = section.querySelector('.cv-section-body') || section;
    const tpl = document.getElementById('tpl-experience-item');
    let newItem;

    if (tpl && tpl.content && tpl.content.firstElementChild) {
      newItem = tpl.content.firstElementChild.cloneNode(true);
    } else {
      newItem = document.createElement('div');
      newItem.className = 'cv-item';
      newItem.innerHTML = `
        <div class="item-actions">
          <button class="action-btn btn-del" onclick="window.miVit3.deleteItem(this)" title="Eliminar empleo">✕</button>
        </div>
        <div class="cv-item-side">
          <span class="cv-item-date" contenteditable="true">2023 — Presente</span>
          <span class="cv-item-location" contenteditable="true">Ciudad, País</span>
        </div>
        <div class="cv-item-main">
          <div class="cv-item-header">
            <span class="cv-item-title" contenteditable="true">Puesto o Cargo</span> ·
            <span class="cv-item-subtitle" contenteditable="true">Nombre de la Empresa</span>
          </div>
          <div class="cv-item-desc" contenteditable="true">
            <ul>
              <li>Describe tus responsabilidades clave y logros destacados con datos medibles.</li>
              <li>Iniciativa o proyecto liderado con resultados positivos.</li>
            </ul>
          </div>
        </div>
      `;
    }

    body.appendChild(newItem);
    if (typeof window.ensureDragHandles === 'function') window.ensureDragHandles();
    if (typeof window.triggerAutoSave === 'function') window.triggerAutoSave();
    if (typeof window.debouncedAudit === 'function') window.debouncedAudit();

    const titleEl = newItem.querySelector('.cv-item-title');
    if (titleEl) titleEl.focus();
  };

  window.miVit3.addEducationItem = function (btn) {
    const section = btn.closest('.cv-section');
    const body = section.querySelector('.cv-section-body') || section;
    const tpl = document.getElementById('tpl-education-item');
    let newItem;

    if (tpl && tpl.content && tpl.content.firstElementChild) {
      newItem = tpl.content.firstElementChild.cloneNode(true);
    } else {
      newItem = document.createElement('div');
      newItem.className = 'cv-item';
      newItem.innerHTML = `
        <div class="item-actions">
          <button class="action-btn btn-del" onclick="window.miVit3.deleteItem(this)" title="Eliminar estudio">✕</button>
        </div>
        <div class="cv-item-side">
          <span class="cv-item-date" contenteditable="true">2018 — 2022</span>
          <span class="cv-item-location" contenteditable="true">Ciudad, País</span>
        </div>
        <div class="cv-item-main">
          <div class="cv-item-header">
            <span class="cv-item-title" contenteditable="true">Título o Carrera</span> ·
            <span class="cv-item-subtitle" contenteditable="true">Institución Educativa</span>
          </div>
          <div class="cv-item-desc" contenteditable="true">
            Menciones, especializaciones, proyectos académicos o reconocimientos relevantes.
          </div>
        </div>
      `;
    }

    body.appendChild(newItem);
    if (typeof window.ensureDragHandles === 'function') window.ensureDragHandles();
    if (typeof window.triggerAutoSave === 'function') window.triggerAutoSave();
    if (typeof window.debouncedAudit === 'function') window.debouncedAudit();

    const titleEl = newItem.querySelector('.cv-item-title');
    if (titleEl) titleEl.focus();
  };

  window.miVit3.addSkillTag = function (btn) {
    const section = btn.closest('.cv-section');
    const wrap = section.querySelector('.cv-tags-wrap');
    if (!wrap) return;

    const tpl = document.getElementById('tpl-skill-tag');
    let newTag;

    if (tpl && tpl.content && tpl.content.firstElementChild) {
      newTag = tpl.content.firstElementChild.cloneNode(true);
    } else {
      newTag = document.createElement('span');
      newTag.className = 'cv-tag';
      newTag.innerHTML = `
        <span contenteditable="true">Nueva Habilidad</span>
        <span class="cv-tag-del" onclick="this.parentElement.remove(); if (window.triggerAutoSave) window.triggerAutoSave();">✕</span>
      `;
    }

    wrap.appendChild(newTag);
    if (typeof window.triggerAutoSave === 'function') window.triggerAutoSave();
    if (typeof window.debouncedAudit === 'function') window.debouncedAudit();

    const editable = newTag.querySelector('[contenteditable]');
    if (editable) {
      editable.focus();
      document.execCommand('selectAll', false, null);
    }
  };

  window.miVit3.addLanguageItem = function (btn) {
    const section = btn.closest('.cv-section');
    const desc = section.querySelector('.cv-item-desc');
    if (!desc) return;

    desc.innerHTML += ' &nbsp;|&nbsp; <strong>Nuevo Idioma:</strong> Nivel';
    if (typeof window.triggerAutoSave === 'function') window.triggerAutoSave();
    if (typeof window.debouncedAudit === 'function') window.debouncedAudit();
  };

  window.miVit3.deleteItem = function (btn) {
    const item = btn.closest('.cv-item');
    if (item) {
      item.remove();
      if (typeof window.triggerAutoSave === 'function') window.triggerAutoSave();
      if (typeof window.updatePageBreakAndCapacity === 'function') window.updatePageBreakAndCapacity();
      if (typeof window.debouncedAudit === 'function') window.debouncedAudit();
      if (window.showToast) window.showToast('Elemento eliminado');
    }
  };

  window.miVit3.deleteSection = async function (btn) {
    const section = btn.closest('.cv-section');
    if (!section) return;

    const confirmFn = window.customConfirm || (window.miVit3 && window.miVit3.confirm);
    const confirmed = confirmFn
      ? await confirmFn(
          '¿Eliminar sección completa?',
          'Esta acción eliminará el encabezado y todos los elementos contenidos en esta sección.',
          'danger',
          'Sí, eliminar',
          'Cancelar'
        )
      : confirm('¿Eliminar sección completa?');

    if (confirmed) {
      section.remove();
      if (typeof window.triggerAutoSave === 'function') window.triggerAutoSave();
      if (typeof window.updatePageBreakAndCapacity === 'function') window.updatePageBreakAndCapacity();
      if (typeof window.debouncedAudit === 'function') window.debouncedAudit();
      if (window.showToast) window.showToast('Sección eliminada');
    }
  };

  window.miVit3.addCustomSection = async function () {
    const promptFn = window.customPrompt || (window.miVit3 && window.miVit3.prompt);
    const title = promptFn
      ? await promptFn(
          'Nueva Sección Personalizada',
          'Ingresa el título de la nueva sección que deseas añadir:',
          'Proyectos Destacados',
          'ej: Certificaciones, Voluntariado, Premios...'
        )
      : prompt('Título de la nueva sección:', 'Proyectos Destacados');

    if (!title || !title.trim()) return;

    const cleanTitle = title.trim();
    const cvDoc = document.getElementById('cv-document');
    if (!cvDoc) return;

    const tpl = document.getElementById('tpl-custom-section');
    let section;

    if (tpl && tpl.content && tpl.content.firstElementChild) {
      section = tpl.content.firstElementChild.cloneNode(true);
      const titleEl = section.querySelector('.cv-section-title');
      if (titleEl) titleEl.textContent = cleanTitle;
    } else {
      section = document.createElement('section');
      section.className = 'cv-section';
      section.innerHTML = `
        <div class="cv-section-header">
          <span class="cv-section-title" contenteditable="true">${window.escapeHtml ? window.escapeHtml(cleanTitle) : cleanTitle}</span>
          <div class="section-actions">
            <button class="action-btn" onclick="window.miVit3.addExperienceItem(this)">+ Añadir elemento</button>
            <button class="action-btn btn-del" onclick="window.miVit3.deleteSection(this)">Eliminar sección</button>
          </div>
        </div>
        <div class="cv-section-body">
          <div class="cv-item">
            <div class="item-actions">
              <button class="action-btn btn-del" onclick="window.miVit3.deleteItem(this)">✕</button>
            </div>
            <div class="cv-item-header">
              <div>
                <span class="cv-item-title" contenteditable="true">Nombre del Elemento</span> ·
                <span class="cv-item-subtitle" contenteditable="true">Subtítulo u Organización</span>
              </div>
              <span class="cv-item-date" contenteditable="true">2024</span>
            </div>
            <div class="cv-item-desc" contenteditable="true">
              Descripción del proyecto, certificación o detalle relevante.
            </div>
          </div>
        </div>
      `;
    }

    cvDoc.appendChild(section);
    if (typeof window.ensureDragHandles === 'function') window.ensureDragHandles();
    if (typeof window.triggerAutoSave === 'function') window.triggerAutoSave();
    if (typeof window.updatePageBreakAndCapacity === 'function') window.updatePageBreakAndCapacity();
    if (typeof window.debouncedAudit === 'function') window.debouncedAudit();

    section.scrollIntoView({ behavior: 'smooth' });
    if (window.showToast) window.showToast(`Sección "${cleanTitle}" añadida`);
  };

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

    // 5. Control de Densidad y Espaciado (Fase 1)
    try {
      if (typeof window.setupDensityControls === 'function') {
        window.setupDensityControls();
      }
    } catch (e) {
      console.error('Error configurando controles de densidad:', e);
    }

    // 6. Drag & Drop modular (Fase 1)
    try {
      if (typeof window.setupDragAndDrop === 'function') {
        window.setupDragAndDrop();
      }
    } catch (e) {
      console.error('Error configurando drag and drop:', e);
    }

    // 7. Paginación y medición en vivo A4 (Fase 1)
    try {
      if (typeof window.setupPageBreakObserver === 'function') {
        window.setupPageBreakObserver();
      }
    } catch (e) {
      console.error('Error configurando observador de paginación:', e);
    }

    // 8. Auditor ATS & Comparador de Vacante (Fase 2)
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

    // 12. Soporte PWA Offline (Fase 3)
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
