/**
 * miVIT3 — Gestor Dinámico de Secciones & Elementos (Section Manager - Fase 3)
 * Adición, eliminación y manipulación de empleos, estudios, habilidades y secciones personalizadas
 * mediante plantillas semánticas HTML5 (<template>).
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

  function debouncedAudit() {
    if (typeof window.debouncedAudit === 'function') {
      window.debouncedAudit();
    } else if (window.miVit3 && typeof window.miVit3.debouncedAudit === 'function') {
      window.miVit3.debouncedAudit();
    }
  }

  function updatePageBreakAndCapacity() {
    if (typeof window.updatePageBreakAndCapacity === 'function') {
      window.updatePageBreakAndCapacity();
    } else if (window.miVit3 && typeof window.miVit3.updatePageBreakAndCapacity === 'function') {
      window.miVit3.updatePageBreakAndCapacity();
    }
  }

  function ensureDragHandles() {
    if (typeof window.ensureDragHandles === 'function') {
      window.ensureDragHandles();
    } else if (window.miVit3 && typeof window.miVit3.ensureDragHandles === 'function') {
      window.miVit3.ensureDragHandles();
    }
  }

  /**
   * Añade un nuevo empleo a la sección correspondiente
   */
  function addExperienceItem(btn) {
    const section = btn.closest('.cv-section');
    if (!section) return;
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
    ensureDragHandles();
    triggerAutoSave();
    debouncedAudit();

    const titleEl = newItem.querySelector('.cv-item-title');
    if (titleEl) titleEl.focus();
  }

  /**
   * Añade una nueva formación académica
   */
  function addEducationItem(btn) {
    const section = btn.closest('.cv-section');
    if (!section) return;
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
    ensureDragHandles();
    triggerAutoSave();
    debouncedAudit();

    const titleEl = newItem.querySelector('.cv-item-title');
    if (titleEl) titleEl.focus();
  }

  /**
   * Añade una nueva insignia / etiqueta de habilidad
   */
  function addSkillTag(btn) {
    const section = btn.closest('.cv-section');
    if (!section) return;
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
    triggerAutoSave();
    debouncedAudit();

    const editable = newTag.querySelector('[contenteditable]');
    if (editable) {
      editable.focus();
      document.execCommand('selectAll', false, null);
    }
  }

  /**
   * Añade un idioma al formato de resumen
   */
  function addLanguageItem(btn) {
    const section = btn.closest('.cv-section');
    if (!section) return;
    const desc = section.querySelector('.cv-item-desc');
    if (!desc) return;

    desc.innerHTML += ' &nbsp;|&nbsp; <strong>Nuevo Idioma:</strong> Nivel';
    triggerAutoSave();
    debouncedAudit();
  }

  /**
   * Elimina un ítem individual de empleo, formación o proyecto
   */
  function deleteItem(btn) {
    const item = btn.closest('.cv-item');
    if (item) {
      item.remove();
      triggerAutoSave();
      updatePageBreakAndCapacity();
      debouncedAudit();
      if (window.showToast) window.showToast('Elemento eliminado');
    }
  }

  /**
   * Elimina una sección completa con confirmación personalizada
   */
  async function deleteSection(btn) {
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
      triggerAutoSave();
      updatePageBreakAndCapacity();
      debouncedAudit();
      if (window.showToast) window.showToast('Sección eliminada');
    }
  }

  /**
   * Crea y añade una nueva sección personalizada al CV
   */
  async function addCustomSection() {
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
    ensureDragHandles();
    triggerAutoSave();
    updatePageBreakAndCapacity();
    debouncedAudit();

    section.scrollIntoView({ behavior: 'smooth' });
    if (window.showToast) window.showToast(`Sección "${cleanTitle}" añadida`);
  }

  // Exportar funciones en window.miVit3 y a nivel global
  window.miVit3.addExperienceItem = addExperienceItem;
  window.miVit3.addEducationItem = addEducationItem;
  window.miVit3.addSkillTag = addSkillTag;
  window.miVit3.addLanguageItem = addLanguageItem;
  window.miVit3.deleteItem = deleteItem;
  window.miVit3.deleteSection = deleteSection;
  window.miVit3.addCustomSection = addCustomSection;

  window.addExperienceItem = addExperienceItem;
  window.addEducationItem = addEducationItem;
  window.addSkillTag = addSkillTag;
  window.addLanguageItem = addLanguageItem;
  window.deleteItem = deleteItem;
  window.deleteSection = deleteSection;
  window.addCustomSection = addCustomSection;

})();
