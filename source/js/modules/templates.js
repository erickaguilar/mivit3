/**
 * miVIT3 — Módulo de Plantillas & Paletas de Color
 * Gestión y conmutación en tiempo real de los diseños fundacionales Alpha y colores de acento.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  function saveSettings() {
    if (typeof window.saveSettings === 'function') {
      window.saveSettings();
    } else if (window.miVit3 && typeof window.miVit3.saveSettings === 'function') {
      window.miVit3.saveSettings();
    }
  }

  function setupSettingsBar() {
    // Botones de plantilla
    const pillButtons = document.querySelectorAll('.pill-btn[data-template]');
    pillButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        pillButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        setTemplate(this.dataset.template);
      });
    });

    // Muestras de paleta de color
    const swatches = document.querySelectorAll('.palette-swatch');
    swatches.forEach(swatch => {
      swatch.addEventListener('click', function () {
        swatches.forEach(s => s.classList.remove('active'));
        this.classList.add('active');
        setAccentColor(this.dataset.accent, this.dataset.light);
      });
    });
  }

  function setTemplate(templateClass) {
    const cvDoc = document.getElementById('cv-document');
    if (!cvDoc) return;

    cvDoc.classList.remove(
      'template-alpha00', 'template-alpha01', 'template-alpha02', 'template-alpha03',
      'template-moderna', 'template-clasica', 'template-columnas', 'template-creativa'
    );
    cvDoc.classList.add(templateClass);
    saveSettings();

    const templateNames = {
      'template-alpha00': '00 Bicolor',
      'template-alpha01': '01 Columnas ATS',
      'template-alpha02': '02 Banner',
      'template-alpha03': '03 Editorial'
    };

    if (window.showToast) {
      window.showToast(`Plantilla "${templateNames[templateClass] || templateClass}" activada`);
    }
  }

  function setAccentColor(accentHex, lightHex) {
    document.documentElement.style.setProperty('--cv-accent', accentHex);
    document.documentElement.style.setProperty('--cv-accent-light', lightHex);
    saveSettings();

    if (window.showToast) {
      window.showToast('Color de acento actualizado');
    }
  }

  // Exportar funciones
  window.setupSettingsBar = setupSettingsBar;
  window.setTemplate = setTemplate;
  window.setAccentColor = setAccentColor;

  window.miVit3.setupSettingsBar = setupSettingsBar;
  window.miVit3.setTemplate = setTemplate;
  window.miVit3.setAccentColor = setAccentColor;

})();
