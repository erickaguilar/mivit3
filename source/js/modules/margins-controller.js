/**
 * miVIT3 — Módulo de Control Interactivo de Márgenes A4 (Margins Controller)
 * Permite seleccionar presets estándar (Normal, Estrecho, Moderado, Amplio)
 * o definir milímetro a milímetro los márgenes Superior, Inferior, Izquierdo y Derecho.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  const STORAGE_MARGINS = 'mivit3_custom_margins_v1';

  const PRESETS = {
    normal: { name: 'Normal', top: 16, bottom: 16, left: 18, right: 18 },
    narrow: { name: 'Estrecho', top: 10, bottom: 10, left: 12, right: 12 },
    moderate: { name: 'Moderado', top: 14, bottom: 14, left: 15, right: 15 },
    spacious: { name: 'Amplio', top: 20, bottom: 20, left: 22, right: 22 }
  };

  let currentMargins = {
    top: 16,
    bottom: 16,
    left: 18,
    right: 18,
    preset: 'normal'
  };

  function getMargins() {
    return { ...currentMargins };
  }

  function setMargins(top, bottom, left, right, preset = null, showNotification = true) {
    top = Math.max(4, Math.min(45, parseInt(top, 10) || 16));
    bottom = Math.max(4, Math.min(45, parseInt(bottom, 10) || 16));
    left = Math.max(4, Math.min(45, parseInt(left, 10) || 18));
    right = Math.max(4, Math.min(45, parseInt(right, 10) || 18));

    // Determinar si coincide con algún preset conocido
    if (!preset) {
      for (const [key, val] of Object.entries(PRESETS)) {
        if (val.top === top && val.bottom === bottom && val.left === left && val.right === right) {
          preset = key;
          break;
        }
      }
      if (!preset) preset = 'custom';
    }

    currentMargins = { top, bottom, left, right, preset };

    // Aplicar al documento
    applyMarginsToDoc();

    // Actualizar controles visuales
    updateMarginsUi();

    // Guardar en Storage
    try {
      localStorage.setItem(STORAGE_MARGINS, JSON.stringify(currentMargins));
      if (typeof window.saveSettings === 'function') {
        window.saveSettings();
      }
    } catch (e) {}

    // Recalcular paginación dinámica A4
    if (typeof window.updatePageBreakAndCapacity === 'function') {
      window.updatePageBreakAndCapacity();
    }

    if (showNotification) {
      const toast = window.showToast || (window.miVit3 && window.miVit3.showToast);
      if (toast) {
        const label = preset !== 'custom' && PRESETS[preset] ? PRESETS[preset].name : `${top}×${left}mm`;
        toast(`Márgenes A4 actualizados: ${label} (${top}mm sup, ${bottom}mm inf, ${left}mm izq, ${right}mm der)`);
      }
    }
  }

  function applyMarginsToDoc() {
    const cvDoc = document.getElementById('cv-document');
    if (!cvDoc) return;

    const { top, bottom, left, right } = currentMargins;
    const paddingStr = `${top}mm ${right}mm ${bottom}mm ${left}mm`;

    cvDoc.style.setProperty('--paper-padding', paddingStr);
    cvDoc.style.padding = paddingStr;

    // Actualizar variables de posición para pie de hoja
    document.documentElement.style.setProperty('--paper-margin-left', `${left}mm`);
    document.documentElement.style.setProperty('--paper-margin-right', `${right}mm`);
  }

  function updateMarginsUi() {
    const label = document.getElementById('currentMarginLabel');
    const inputTop = document.getElementById('marginInputTop');
    const inputBottom = document.getElementById('marginInputBottom');
    const inputLeft = document.getElementById('marginInputLeft');
    const inputRight = document.getElementById('marginInputRight');

    const { top, bottom, left, right, preset } = currentMargins;

    if (inputTop) inputTop.value = top;
    if (inputBottom) inputBottom.value = bottom;
    if (inputLeft) inputLeft.value = left;
    if (inputRight) inputRight.value = right;

    if (label) {
      if (preset !== 'custom' && PRESETS[preset]) {
        label.textContent = `Márgenes: ${PRESETS[preset].name}`;
      } else {
        label.textContent = `Márgenes: ${top}×${left}mm`;
      }
    }

    // Actualizar botones de preset
    document.querySelectorAll('.margin-preset-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.preset === preset);
    });

    // Sincronizar botones de densidad si corresponde
    document.querySelectorAll('.pill-btn[data-density]').forEach(btn => {
      if (preset === 'narrow') {
        btn.classList.toggle('active', btn.dataset.density === 'density-compact');
      } else if (preset === 'normal') {
        btn.classList.toggle('active', btn.dataset.density === 'density-normal');
      } else if (preset === 'spacious') {
        btn.classList.toggle('active', btn.dataset.density === 'density-spacious');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function initMargins() {
    // 1. Cargar márgenes guardados
    try {
      const saved = localStorage.getItem(STORAGE_MARGINS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.top && parsed.bottom && parsed.left && parsed.right) {
          currentMargins = parsed;
        }
      }
    } catch (e) {}

    applyMarginsToDoc();
    updateMarginsUi();

    // 2. Control del Menú Desplegable
    const dropdown = document.getElementById('marginsDropdown');
    const btn = document.getElementById('marginsDropdownBtn');
    const menu = document.getElementById('marginsMenu');

    if (btn && dropdown) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('open');

        // Cerrar otros dropdowns del ribbon
        document.querySelectorAll('.ribbon-dropdown.open').forEach(d => {
          if (d !== dropdown) d.classList.remove('open');
        });

        dropdown.classList.toggle('open', !isOpen);
        btn.setAttribute('aria-expanded', !isOpen);
      });
    }

    // Cerrar al hacer clic fuera
    document.addEventListener('click', function (e) {
      if (dropdown && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });

    // Cerrar con Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && dropdown && dropdown.classList.contains('open')) {
        dropdown.classList.remove('open');
        if (btn) {
          btn.setAttribute('aria-expanded', 'false');
          btn.focus();
        }
      }
    });

    // 3. Clics en presets
    document.querySelectorAll('.margin-preset-item').forEach(itemBtn => {
      itemBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const presetKey = this.dataset.preset;
        if (PRESETS[presetKey]) {
          const p = PRESETS[presetKey];
          setMargins(p.top, p.bottom, p.left, p.right, presetKey, true);
        }
      });
    });

    // 4. Inputs numéricos con actualización en tiempo real
    const inputs = [
      { id: 'marginInputTop', prop: 'top' },
      { id: 'marginInputBottom', prop: 'bottom' },
      { id: 'marginInputLeft', prop: 'left' },
      { id: 'marginInputRight', prop: 'right' }
    ];

    let inputTimeout = null;
    inputs.forEach(({ id, prop }) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', function (e) {
          e.stopPropagation();
          clearTimeout(inputTimeout);
          inputTimeout = setTimeout(() => {
            const val = parseInt(this.value, 10);
            if (!isNaN(val) && val >= 4 && val <= 45) {
              const updated = { ...currentMargins, [prop]: val };
              setMargins(updated.top, updated.bottom, updated.left, updated.right, 'custom', false);
            }
          }, 150);
        });
      }
    });

    // 5. Vincular botones de densidad existentes para que sincronicen con márgenes
    document.querySelectorAll('.pill-btn[data-density]').forEach(btn => {
      btn.addEventListener('click', function () {
        const d = this.dataset.density;
        if (d === 'density-compact') {
          const p = PRESETS.narrow;
          setMargins(p.top, p.bottom, p.left, p.right, 'narrow', false);
        } else if (d === 'density-normal') {
          const p = PRESETS.normal;
          setMargins(p.top, p.bottom, p.left, p.right, 'normal', false);
        } else if (d === 'density-spacious') {
          const p = PRESETS.spacious;
          setMargins(p.top, p.bottom, p.left, p.right, 'spacious', false);
        }
      });
    });
  }

  // Inicializar al cargar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMargins);
  } else {
    setTimeout(initMargins, 50);
  }

  // Exportar API
  window.setCustomMargins = setMargins;
  window.getCustomMargins = getMargins;
  window.initMarginsController = initMargins;

  window.miVit3.setMargins = setMargins;
  window.miVit3.getMargins = getMargins;
  window.miVit3.initMarginsController = initMargins;

})();
