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

  const TEMPLATE_NAMES = {
    'template-tech': 'Tech Minimalista',
    'template-executive': 'Ejecutivo Harvard',
    'template-timeline': 'Línea de Tiempo',
    'template-nordic': 'Nordic Clean',
    'template-swiss': 'Swiss Minimal Grid',
    'template-sidebar': 'Sidebar Ejecutivo',
    'template-compact-ats': 'Compact ATS (1 Pág.)',
    'template-corporate-duo': 'Corporate Duo-Tone',
    'template-alpha00': 'Bicolor Moderno',
    'template-alpha01': 'Columnas ATS',
    'template-alpha02': 'Banner Credencial',
    'template-alpha03': 'Editorial Monograma'
  };

  function setupSettingsBar() {
    // Dropdown menú de plantillas
    const dropdown = document.getElementById('templateDropdown');
    const dropdownBtn = document.getElementById('templateDropdownBtn');

    if (dropdown && dropdownBtn) {
      dropdownBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isOpen = dropdown.classList.toggle('open');
        dropdownBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      document.addEventListener('click', function (e) {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('open');
          dropdownBtn.setAttribute('aria-expanded', 'false');
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && dropdown.classList.contains('open')) {
          dropdown.classList.remove('open');
          dropdownBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Elementos del menú de plantilla
    const templateItems = document.querySelectorAll('[data-template]');
    templateItems.forEach(item => {
      item.addEventListener('click', function () {
        templateItems.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        setTemplate(this.dataset.template);
        if (dropdown) {
          dropdown.classList.remove('open');
          if (dropdownBtn) dropdownBtn.setAttribute('aria-expanded', 'false');
        }
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
      'template-tech', 'template-executive', 'template-timeline', 'template-nordic',
      'template-swiss', 'template-sidebar', 'template-compact-ats', 'template-corporate-duo',
      'template-alpha00', 'template-alpha01', 'template-alpha02', 'template-alpha03',
      'template-moderna', 'template-clasica', 'template-columnas', 'template-creativa'
    );
    cvDoc.classList.add(templateClass);
    saveSettings();

    // Actualizar texto del botón dropdown
    const currentNameEl = document.getElementById('currentTemplateName');
    const readableName = TEMPLATE_NAMES[templateClass] || templateClass;
    if (currentNameEl) {
      currentNameEl.textContent = readableName;
    }

    // Actualizar estado activo en los items
    document.querySelectorAll('[data-template]').forEach(el => {
      el.classList.toggle('active', el.dataset.template === templateClass);
    });

    if (window.showToast) {
      window.showToast(`Plantilla "${readableName}" activada`);
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
