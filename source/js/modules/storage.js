/**
 * miVIT3 — Módulo de Persistencia y Almacenamiento (LocalStorage y JSON)
 * Autoguardado reactivo continuo, respaldos JSON y restauración de estados.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  const STORAGE_KEY = 'mivit3_cv_content_v2';
  const STORAGE_SETTINGS = 'mivit3_cv_settings_v2';
  let saveTimeout = null;

  function debouncedAudit() {
    if (typeof window.debouncedAudit === 'function') {
      window.debouncedAudit();
    } else if (window.miVit3 && typeof window.miVit3.debouncedAudit === 'function') {
      window.miVit3.debouncedAudit();
    }
  }

  function setupAutoSave() {
    const cvDoc = document.getElementById('cv-document');
    if (!cvDoc) return;

    cvDoc.addEventListener('input', function () {
      triggerAutoSave();
      debouncedAudit();
    });
  }

  function triggerAutoSave() {
    clearTimeout(saveTimeout);
    updateSaveIndicator(false);

    saveTimeout = setTimeout(function () {
      const cvDoc = document.getElementById('cv-document');
      if (!cvDoc) return;

      localStorage.setItem(STORAGE_KEY, cvDoc.innerHTML);
      saveSettings();
      updateSaveIndicator(true);
      debouncedAudit();
    }, 600);
  }

  function saveSettings() {
    const cvDoc = document.getElementById('cv-document');
    if (!cvDoc) return;

    const currentTemplate = Array.from(cvDoc.classList).find(c => c.startsWith('template-')) || 'template-alpha00';
    const currentDensity = Array.from(cvDoc.classList).find(c => c.startsWith('density-')) || 'density-normal';
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--cv-accent').trim();
    const accentLight = getComputedStyle(document.documentElement).getPropertyValue('--cv-accent-light').trim();

    const settings = {
      template: currentTemplate,
      density: currentDensity,
      accent: accent,
      accentLight: accentLight
    };
    localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(settings));
  }

  function loadSavedContent() {
    const cvDoc = document.getElementById('cv-document');
    if (!cvDoc) return;

    const savedHtml = localStorage.getItem(STORAGE_KEY);
    const savedSettingsRaw = localStorage.getItem(STORAGE_SETTINGS);

    if (savedHtml && savedHtml.trim().length > 100) {
      cvDoc.innerHTML = savedHtml;
    } else {
      loadSampleData(false);
    }

    if (savedSettingsRaw) {
      try {
        const settings = JSON.parse(savedSettingsRaw);
        if (settings.template) {
          cvDoc.classList.remove(
            'template-alpha00', 'template-alpha01', 'template-alpha02', 'template-alpha03',
            'template-moderna', 'template-clasica', 'template-columnas', 'template-creativa'
          );
          cvDoc.classList.add(settings.template);

          document.querySelectorAll('.pill-btn[data-template]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.template === settings.template);
          });
        }
        if (settings.density) {
          cvDoc.classList.remove('density-compact', 'density-normal', 'density-spacious');
          cvDoc.classList.add(settings.density);

          document.querySelectorAll('.pill-btn[data-density]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.density === settings.density);
          });
        }
        if (settings.accent && settings.accentLight) {
          document.documentElement.style.setProperty('--cv-accent', settings.accent);
          document.documentElement.style.setProperty('--cv-accent-light', settings.accentLight);

          document.querySelectorAll('.palette-swatch').forEach(s => {
            s.classList.toggle('active', s.dataset.accent.toLowerCase() === settings.accent.toLowerCase());
          });
        }
      } catch (e) {
        console.error('Error al restaurar configuración:', e);
      }
    }

    if (typeof window.ensureDragHandles === 'function') window.ensureDragHandles();
    if (typeof window.updatePageBreakAndCapacity === 'function') window.updatePageBreakAndCapacity();
    updateSaveIndicator(true);
  }

  function updateSaveIndicator(isSaved) {
    const statusText = document.getElementById('saveStatusText');
    const statusDot = document.getElementById('saveStatusDot');
    if (!statusText || !statusDot) return;

    if (isSaved) {
      statusDot.style.backgroundColor = '#22c55e';
      statusText.textContent = 'Guardado en el navegador';
    } else {
      statusDot.style.backgroundColor = '#f59e0b';
      statusText.textContent = 'Guardando cambios...';
    }
  }

  function loadSampleData(withNotification = true) {
    const cvDoc = document.getElementById('cv-document');
    if (!cvDoc) return;

    const sample = window.SAMPLE_DATA || (window.miVit3 && window.miVit3.SAMPLE_DATA);
    if (!sample) return;

    cvDoc.innerHTML = sample.html;
    if (typeof window.setTemplate === 'function') window.setTemplate(sample.template);
    if (typeof window.setAccentColor === 'function') window.setAccentColor(sample.accent, sample.accentLight);

    document.querySelectorAll('.pill-btn[data-template]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.template === sample.template);
    });
    document.querySelectorAll('.palette-swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.accent.toLowerCase() === sample.accent.toLowerCase());
    });

    if (typeof window.ensureDragHandles === 'function') window.ensureDragHandles();
    if (typeof window.updatePageBreakAndCapacity === 'function') window.updatePageBreakAndCapacity();
    triggerAutoSave();

    if (withNotification && window.showToast) {
      window.showToast('Datos de ejemplo cargados exitosamente');
    }
  }

  function clearDocument() {
    const cvDoc = document.getElementById('cv-document');
    if (!cvDoc) return;

    cvDoc.innerHTML = `
      <header class="cv-profile-header">
        <div class="cv-avatar-wrap">
          <img id="cvAvatar" class="cv-avatar" src="source/img/user.svg" alt="Foto de perfil">
          <label for="avatarFileInput" class="avatar-upload-btn" title="Cambiar foto">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
          </label>
        </div>
        <div class="cv-personal-details">
          <h1 class="cv-name" contenteditable="true" data-placeholder="Tu Nombre Completo"></h1>
          <div class="cv-role" contenteditable="true" data-placeholder="Tu Profesión o Título"></div>
          <ul class="cv-contact-list">
            <li class="cv-contact-item">
              <span contenteditable="true" data-placeholder="correo@ejemplo.com"></span>
            </li>
            <li class="cv-contact-item">
              <span contenteditable="true" data-placeholder="Teléfono"></span>
            </li>
            <li class="cv-contact-item">
              <span contenteditable="true" data-placeholder="Ciudad, País"></span>
            </li>
          </ul>
        </div>
      </header>

      <section class="cv-section">
        <div class="cv-section-header">
          <span class="cv-section-title" contenteditable="true">Perfil Profesional</span>
        </div>
        <div class="cv-item-desc" contenteditable="true" data-placeholder="Escribe un breve resumen de tu trayectoria y objetivos profesionales..."></div>
      </section>

      <section class="cv-section">
        <div class="cv-section-header">
          <span class="cv-section-title" contenteditable="true">Experiencia</span>
          <div class="section-actions">
            <button class="action-btn" onclick="window.miVit3.addExperienceItem(this)">+ Añadir empleo</button>
          </div>
        </div>
        <div class="cv-section-body">
          <div class="cv-item">
            <div class="cv-item-header">
              <div>
                <span class="cv-item-title" contenteditable="true" data-placeholder="Cargo"></span> · 
                <span class="cv-item-subtitle" contenteditable="true" data-placeholder="Empresa"></span>
              </div>
              <span class="cv-item-date" contenteditable="true" data-placeholder="Periodo"></span>
            </div>
            <div class="cv-item-desc" contenteditable="true" data-placeholder="Logros y responsabilidades..."></div>
          </div>
        </div>
      </section>
    `;
    if (typeof window.ensureDragHandles === 'function') window.ensureDragHandles();
    if (typeof window.updatePageBreakAndCapacity === 'function') window.updatePageBreakAndCapacity();
    triggerAutoSave();

    if (window.showToast) {
      window.showToast('Documento en blanco listo para editar');
    }
  }

  function exportToJson() {
    const cvDoc = document.getElementById('cv-document');
    if (!cvDoc) return;

    const currentTemplate = Array.from(cvDoc.classList).find(c => c.startsWith('template-')) || 'template-alpha00';
    const currentDensity = Array.from(cvDoc.classList).find(c => c.startsWith('density-')) || 'density-normal';
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--cv-accent').trim();
    const accentLight = getComputedStyle(document.documentElement).getPropertyValue('--cv-accent-light').trim();

    const data = {
      app: 'miVIT3',
      version: '2.5.0',
      exportedAt: new Date().toISOString(),
      template: currentTemplate,
      density: currentDensity,
      accent: accent,
      accentLight: accentLight,
      html: cvDoc.innerHTML
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `curriculum-mivit3-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.showToast) {
      window.showToast('Archivo JSON descargado exitosamente');
    }
  }

  function importFromJson(e) {
    const file = e.target.files[0];
    if (!file) return;

    const cvDoc = document.getElementById('cv-document');
    if (!cvDoc) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const data = JSON.parse(event.target.result);
        if (!data.html) {
          const alertFn = window.customAlert || (window.miVit3 && window.miVit3.alert);
          if (alertFn) alertFn('Formato de archivo no válido', 'El archivo seleccionado no tiene la estructura de datos requerida por miVIT3.', 'warning');
          return;
        }

        cvDoc.innerHTML = data.html;
        if (data.template && typeof window.setTemplate === 'function') window.setTemplate(data.template);
        if (data.density && typeof window.setDensity === 'function') window.setDensity(data.density);
        if (data.accent && data.accentLight && typeof window.setAccentColor === 'function') {
          window.setAccentColor(data.accent, data.accentLight);
        }

        if (typeof window.ensureDragHandles === 'function') window.ensureDragHandles();
        if (typeof window.updatePageBreakAndCapacity === 'function') window.updatePageBreakAndCapacity();
        triggerAutoSave();

        if (window.showToast) {
          window.showToast('CV restaurado correctamente desde archivo');
        }
      } catch (err) {
        const alertFn = window.customAlert || (window.miVit3 && window.miVit3.alert);
        if (alertFn) alertFn('Error al importar', 'No se pudo leer el archivo JSON: ' + err.message, 'danger');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  // Exportar funciones
  window.STORAGE_KEY = STORAGE_KEY;
  window.STORAGE_SETTINGS = STORAGE_SETTINGS;
  window.setupAutoSave = setupAutoSave;
  window.triggerAutoSave = triggerAutoSave;
  window.saveSettings = saveSettings;
  window.loadSavedContent = loadSavedContent;
  window.updateSaveIndicator = updateSaveIndicator;
  window.loadSampleData = loadSampleData;
  window.clearDocument = clearDocument;
  window.exportToJson = exportToJson;
  window.importFromJson = importFromJson;

  window.miVit3.setupAutoSave = setupAutoSave;
  window.miVit3.triggerAutoSave = triggerAutoSave;
  window.miVit3.saveSettings = saveSettings;
  window.miVit3.loadSavedContent = loadSavedContent;
  window.miVit3.loadSampleData = loadSampleData;
  window.miVit3.clearDocument = clearDocument;
  window.miVit3.exportToJson = exportToJson;
  window.miVit3.importFromJson = importFromJson;

})();
