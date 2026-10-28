/**
 * miVIT3 — Módulo de Gestión de Variantes y Versiones del CV (CV Variants & Snapshots)
 * Permite guardar, alternar y gestionar múltiples versiones del currículum localmente en el navegador.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  const STORAGE_KEY = 'mivit3_saved_variants';

  function getVariants() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveVariants(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Error guardando variantes:', e);
    }
  }

  async function promptSaveVariant() {
    // Cerrar dropdown
    document.querySelectorAll('.ribbon-dropdown.open').forEach(d => d.classList.remove('open'));

    const promptFn = window.customPrompt || (window.miVit3 && window.miVit3.prompt);
    const doc = document.getElementById('cv-document');
    if (!doc) return;

    const defaultName = `Versión ${new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
    let name = '';

    if (promptFn) {
      name = await promptFn('Guardar Versión del CV', 'Asigna un nombre para identificar esta variante (ej: "CV Tech", "CV Corto"):', defaultName, 'Nombre de la versión');
    } else {
      name = prompt('Nombre de esta versión del CV:', defaultName);
    }

    if (!name || !name.trim()) return;

    const variant = {
      id: 'var_' + Date.now(),
      name: name.trim(),
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      html: doc.innerHTML,
      classes: doc.className,
      avatarSrc: document.getElementById('cvAvatarImg') ? document.getElementById('cvAvatarImg').src : ''
    };

    const list = getVariants();
    list.unshift(variant);
    saveVariants(list);
    renderVariantsList();

    const toast = window.showToast || (window.miVit3 && window.miVit3.showToast);
    if (toast) toast(`✓ Versión "${variant.name}" guardada con éxito.`);
  }

  function loadVariant(id) {
    const list = getVariants();
    const variant = list.find(v => v.id === id);
    if (!variant) return;

    const doc = document.getElementById('cv-document');
    if (!doc) return;

    doc.innerHTML = variant.html;
    if (variant.classes) {
      doc.className = variant.classes;
    }

    if (variant.avatarSrc && document.getElementById('cvAvatarImg')) {
      const avatarImg = document.getElementById('cvAvatarImg');
      avatarImg.src = variant.avatarSrc;
      avatarImg.style.display = 'block';
      const placeholder = document.getElementById('cvAvatarPlaceholder');
      if (placeholder) placeholder.style.display = 'none';
    }

    // Cerrar dropdown
    document.querySelectorAll('.ribbon-dropdown.open').forEach(d => d.classList.remove('open'));

    if (typeof window.triggerAutoSave === 'function') {
      window.triggerAutoSave();
    } else if (window.miVit3 && typeof window.miVit3.triggerAutoSave === 'function') {
      window.miVit3.triggerAutoSave();
    }

    const toast = window.showToast || (window.miVit3 && window.miVit3.showToast);
    if (toast) toast(`Versión restaurada: "${variant.name}".`);
  }

  function deleteVariant(id, e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    let list = getVariants();
    list = list.filter(v => v.id !== id);
    saveVariants(list);
    renderVariantsList();

    const toast = window.showToast || (window.miVit3 && window.miVit3.showToast);
    if (toast) toast('Versión eliminada.');
  }

  function renderVariantsList() {
    const container = document.getElementById('variantsListContainer');
    if (!container) return;

    const list = getVariants();
    if (list.length === 0) {
      container.innerHTML = `
        <div style="padding: 8px 10px; font-size: 11.5px; color: var(--text-light); text-align: center;">
          No tienes versiones guardadas.<br>Haz clic arriba para guardar la primera.
        </div>
      `;
      return;
    }

    let html = '';
    list.forEach(v => {
      html += `
        <div class="variant-item-row" data-id="${v.id}">
          <button type="button" class="variant-load-btn" title="Cargar versión (${v.date} ${v.time})">
            <span class="variant-name-text">${v.name}</span>
            <span class="variant-date-text">${v.date}</span>
          </button>
          <button type="button" class="variant-del-btn" data-del-id="${v.id}" title="Eliminar esta versión">✕</button>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  function setupVariants() {
    const btnSave = document.getElementById('btnSaveCurrentVariant');
    if (btnSave) {
      btnSave.addEventListener('click', function (e) {
        e.preventDefault();
        promptSaveVariant();
      });
    }

    const container = document.getElementById('variantsListContainer');
    if (container) {
      container.addEventListener('click', function (e) {
        const delBtn = e.target.closest('.variant-del-btn');
        if (delBtn) {
          const id = delBtn.dataset.delId;
          deleteVariant(id, e);
          return;
        }

        const loadBtn = e.target.closest('.variant-load-btn');
        if (loadBtn) {
          const row = loadBtn.closest('.variant-item-row');
          if (row && row.dataset.id) {
            loadVariant(row.dataset.id);
          }
        }
      });
    }

    renderVariantsList();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupVariants);
  } else {
    setupVariants();
  }

  window.miVit3.promptSaveVariant = promptSaveVariant;
  window.miVit3.loadVariant = loadVariant;
})();
