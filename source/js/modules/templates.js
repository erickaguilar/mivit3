/**
 * miVIT3 — Módulo de Plantillas & Paletas de Color
 * Gestión y conmutación en tiempo real de los diseños fundacionales Alpha, nuevas plantillas y colores de acento.
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

  /**
   * Genera automáticamente un color pastel de fondo suave armónico a partir de cualquier HEX.
   * Calcula el matiz HSL y fija una luminosidad alta (94%) y saturación controlada.
   */
  function generateAccentLight(hex) {
    if (!hex || typeof hex !== 'string') return '#f3e8ff';
    let clean = hex.replace('#', '').trim();
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    }
    if (clean.length !== 6) return '#f3e8ff';

    const num = parseInt(clean, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;

    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
        case gNorm: h = (bNorm - rNorm) / d + 2; break;
        case bNorm: h = (rNorm - gNorm) / d + 4; break;
      }
      h /= 6;
    }

    const lightH = Math.round(h * 360);
    const lightS = Math.min(Math.round(s * 100), 55);
    const lightL = 94;

    return `hsl(${lightH}, ${lightS}%, ${lightL}%)`;
  }

  function setupSettingsBar() {
    // 1. Dropdown menú de plantillas
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

    // 2. Muestras de paleta de color (Rápidas y en Popover)
    const allSwatches = document.querySelectorAll('.palette-swatch, .palette-popover-item');
    allSwatches.forEach(swatch => {
      swatch.addEventListener('click', function () {
        const accent = this.dataset.accent;
        const light = this.dataset.light || generateAccentLight(accent);
        setAccentColor(accent, light, true);

        // Si fue click en el popover, cerrar el dropdown
        const popover = document.getElementById('colorPaletteDropdown');
        if (popover && popover.classList.contains('open')) {
          popover.classList.remove('open');
        }
      });
    });

    // 3. Selector de color libre y caja hexadecimal
    const customPicker = document.getElementById('customAccentPicker');
    const customPreview = document.getElementById('customColorPreview');
    const customHexInput = document.getElementById('customColorHexInput');

    if (customPicker) {
      customPicker.addEventListener('input', function () {
        const hex = this.value;
        const light = generateAccentLight(hex);
        setAccentColor(hex, light, false);
        if (customPreview) customPreview.style.backgroundColor = hex;
        if (customHexInput) customHexInput.value = hex.toUpperCase();
      });

      customPicker.addEventListener('change', function () {
        const hex = this.value;
        const light = generateAccentLight(hex);
        setAccentColor(hex, light, true);
      });
    }

    if (customHexInput) {
      customHexInput.addEventListener('change', function () {
        let val = this.value.trim();
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
          const hex = val.toUpperCase();
          this.value = hex;
          if (customPicker) customPicker.value = hex;
          if (customPreview) customPreview.style.backgroundColor = hex;
          const light = generateAccentLight(hex);
          setAccentColor(hex, light, true);
        } else {
          // Revertir a color actual
          const currentAccent = getComputedStyle(document.documentElement).getPropertyValue('--cv-accent').trim() || '#6400C8';
          this.value = currentAccent.toUpperCase();
        }
      });

      customHexInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          this.blur();
        }
      });
    }
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

  function setAccentColor(accentHex, lightHex, showNotification = true) {
    if (!accentHex) return;
    const light = lightHex || generateAccentLight(accentHex);

    document.documentElement.style.setProperty('--cv-accent', accentHex);
    document.documentElement.style.setProperty('--cv-accent-light', light);
    saveSettings();

    // Sincronizar estado activo en botones de paleta
    const normalizedAccent = accentHex.toLowerCase();
    document.querySelectorAll('.palette-swatch, .palette-popover-item').forEach(el => {
      const elAccent = (el.dataset.accent || '').toLowerCase();
      el.classList.toggle('active', elAccent === normalizedAccent);
    });

    // Sincronizar inputs personalizados
    const customPicker = document.getElementById('customAccentPicker');
    const customPreview = document.getElementById('customColorPreview');
    const customHexInput = document.getElementById('customColorHexInput');

    if (customPicker && customPicker.value.toLowerCase() !== normalizedAccent) {
      // Solo si es formato hex de 7 caracteres
      if (/^#[0-9a-f]{6}$/i.test(accentHex)) {
        customPicker.value = accentHex;
      }
    }
    if (customPreview) {
      customPreview.style.backgroundColor = accentHex;
    }
    if (customHexInput && document.activeElement !== customHexInput) {
      customHexInput.value = accentHex.toUpperCase();
    }

    if (showNotification && window.showToast) {
      window.showToast('Color de acento actualizado');
    }
  }

  // Exportar funciones
  window.setupSettingsBar = setupSettingsBar;
  window.setTemplate = setTemplate;
  window.setAccentColor = setAccentColor;
  window.generateAccentLight = generateAccentLight;

  window.miVit3.setupSettingsBar = setupSettingsBar;
  window.miVit3.setTemplate = setTemplate;
  window.miVit3.setAccentColor = setAccentColor;
  window.miVit3.generateAccentLight = generateAccentLight;

})();
