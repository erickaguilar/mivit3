/**
 * miVIT3 — Bundle Monolítico Compilado de Compatibilidad
 * Contiene todos los módulos de source/js/modules/ en orden secuencial.
 */

/* --- Módulo: dialogs.js --- */
/**
 * miVIT3 — Módulo de Diálogos, Notificaciones y Utilidades UI
 * Reemplazo 100% accesible y estilizado de alert, confirm y prompt nativos del navegador.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  let toastTimeout = null;
  let savedRange = null;

  /**
   * Escapar caracteres HTML para prevención XSS
   */
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Función debounce para optimizar eventos de alto disparo
   */
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  /**
   * Guarda y restaura el rango de selección de texto para comandos Word
   */
  function saveSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRange = sel.getRangeAt(0);
      return savedRange;
    }
    return null;
  }

  function restoreSelection(range) {
    const targetRange = range || savedRange;
    if (targetRange) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(targetRange);
    }
  }

  /**
   * Muestra un diálogo modal personalizado con soporte de teclado (Enter / Escape)
   */
  function showCustomDialog({
    title = '',
    message = '',
    type = 'info', // 'info' | 'success' | 'warning' | 'danger'
    confirmText = 'Aceptar',
    cancelText = null,
    showInput = false,
    defaultValue = '',
    placeholder = ''
  }) {
    return new Promise((resolve) => {
      let backdrop = document.getElementById('customDialogBackdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'customDialogBackdrop';
        backdrop.className = 'custom-dialog-backdrop';
        document.body.appendChild(backdrop);
      }

      const icons = {
        info: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
        success: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
        warning: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
        danger: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
      };

      const iconSvg = icons[type] || icons.info;
      const confirmBtnClass = type === 'danger' ? 'dialog-btn btn-danger' : 'dialog-btn btn-confirm';

      backdrop.innerHTML = `
        <div class="custom-dialog-card" role="dialog" aria-modal="true">
          <div class="dialog-header">
            <div class="dialog-icon icon-${type}">
              ${iconSvg}
            </div>
            <div class="dialog-title-wrap">
              <h3>${escapeHtml(title)}</h3>
              <p>${escapeHtml(message)}</p>
            </div>
          </div>
          ${showInput ? `
            <div class="dialog-input-wrap">
              <input type="text" id="customDialogInput" class="dialog-input" value="${escapeHtml(defaultValue)}" placeholder="${escapeHtml(placeholder)}" autocomplete="off">
            </div>
          ` : ''}
          <div class="dialog-actions">
            ${cancelText ? `<button type="button" id="customDialogCancelBtn" class="dialog-btn btn-cancel">${escapeHtml(cancelText)}</button>` : ''}
            <button type="button" id="customDialogConfirmBtn" class="${confirmBtnClass}">${escapeHtml(confirmText)}</button>
          </div>
        </div>
      `;

      backdrop.classList.add('show');

      const input = document.getElementById('customDialogInput');
      const confirmBtn = document.getElementById('customDialogConfirmBtn');
      const cancelBtn = document.getElementById('customDialogCancelBtn');

      if (input) {
        input.focus();
        input.select();
      } else if (confirmBtn) {
        confirmBtn.focus();
      }

      function cleanup(result) {
        backdrop.classList.remove('show');
        document.removeEventListener('keydown', onKeyDown);
        setTimeout(() => {
          backdrop.innerHTML = '';
          resolve(result);
        }, 220);
      }

      function onKeyDown(e) {
        if (e.key === 'Escape') {
          e.preventDefault();
          cleanup(showInput ? null : false);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const val = input ? input.value : true;
          cleanup(val);
        }
      }

      document.addEventListener('keydown', onKeyDown);

      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
          const val = input ? input.value : true;
          cleanup(val);
        });
      }

      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          cleanup(showInput ? null : false);
        });
      }

      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          cleanup(showInput ? null : false);
        }
      });
    });
  }

  function customAlert(title, message, type = 'info') {
    return showCustomDialog({ title, message, type, confirmText: 'Entendido' });
  }

  function customConfirm(title, message, type = 'warning', confirmText = 'Aceptar', cancelText = 'Cancelar') {
    return showCustomDialog({ title, message, type, confirmText, cancelText });
  }

  function customPrompt(title, message, defaultValue = '', placeholder = '') {
    return showCustomDialog({ title, message, type: 'info', showInput: true, defaultValue, placeholder, confirmText: 'Aceptar', cancelText: 'Cancelar' });
  }

  /**
   * Notificación Toast flotante
   */
  function showToast(message, type = 'success') {
    let toast = document.getElementById('toastNotification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotification';
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }

    const iconSvg = type === 'warning'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

    toast.innerHTML = `
      ${iconSvg}
      <span id="toastMsg">${escapeHtml(message)}</span>
    `;

    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // Exportar a nivel global y en window.miVit3
  window.escapeHtml = escapeHtml;
  window.debounce = debounce;
  window.saveSelection = saveSelection;
  window.restoreSelection = restoreSelection;
  window.customAlert = customAlert;
  window.customConfirm = customConfirm;
  window.customPrompt = customPrompt;
  window.showToast = showToast;

  window.miVit3.escapeHtml = escapeHtml;
  window.miVit3.debounce = debounce;
  window.miVit3.saveSelection = saveSelection;
  window.miVit3.restoreSelection = restoreSelection;
  window.miVit3.alert = customAlert;
  window.miVit3.confirm = customConfirm;
  window.miVit3.prompt = customPrompt;
  window.miVit3.showToast = showToast;

})();


/* --- Módulo: sample-data.js --- */
/**
 * miVIT3 — Módulo de Datos de Ejemplo (Sample Data)
 * Currículum vitae profesional inicial de muestra, optimizado para impacto y ATS.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  // =========================================================================
  // Datos de Ejemplo Predefinidos
  // =========================================================================
  const SAMPLE_DATA = {
    template: 'template-alpha00',
    accent: '#6400c8',
    accentLight: '#f3e8ff',
    html: `
      <!-- Cabecera de Perfil (Diseño adaptable a las 4 plantillas Alpha) -->
      <header class="cv-profile-header">
        <!-- Decoración Bicolor para Plantilla Alpha 00 -->
        <div class="cv-bicolor-decor">
          <div class="cv-bicolor-darkbar"></div>
          <div class="cv-bicolor-stripes">
            <div class="stripe-1"></div>
            <div class="stripe-2"></div>
          </div>
        </div>

        <div class="cv-header-main">
          <div class="cv-avatar-wrap">
            <img id="cvAvatar" class="cv-avatar" src="source/img/user.svg" alt="Foto de perfil">
            <label for="avatarFileInput" class="avatar-upload-btn" title="Cambiar foto de perfil">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </label>
          </div>

          <div class="cv-personal-details">
            <div class="cv-name-row">
              <h1 class="cv-name" contenteditable="true" data-placeholder="Tu Nombre Completo">Jonathan López Aguilar</h1>
              <!-- Monograma badge para Plantilla Alpha 03 -->
              <div class="cv-monogram-badge" contenteditable="true" title="Monograma / Iniciales">CV</div>
            </div>
            <div class="cv-role" contenteditable="true" data-placeholder="Tu Título o Profesión">Ingeniero de Software Senior &amp; Diseñador UI/UX</div>
            <ul class="cv-contact-list">
              <li class="cv-contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <span contenteditable="true" data-placeholder="correo@ejemplo.com">jonathan.lopez@mivit3.com</span>
              </li>
              <li class="cv-contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <span contenteditable="true" data-placeholder="+52 55 1234 5678">+52 55 1234 5678</span>
              </li>
              <li class="cv-contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span contenteditable="true" data-placeholder="Ciudad, País">Ciudad de México, México</span>
              </li>
              <li class="cv-contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                <span contenteditable="true" data-placeholder="linkedin.com/in/usuario">linkedin.com/in/jonathan-lopez</span>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <!-- Perfil Profesional / Objetivo -->
      <section class="cv-section" data-section-type="profile">
        <div class="cv-section-header">
          <span class="cv-section-title" contenteditable="true">Perfil Profesional</span>
          <div class="section-actions">
            <button class="action-btn btn-del" onclick="window.miVit3.deleteSection(this)">Eliminar sección</button>
          </div>
        </div>
        <div class="cv-item-desc" contenteditable="true">
          Profesional apasionado con más de 7 años de experiencia liderando el desarrollo de aplicaciones web interactivas y escalables de alto impacto. Especializado en JavaScript moderno (Vanilla ES6+), diseño de interfaces de usuario centradas en la accesibilidad, arquitecturas desacopladas y optimización de rendimiento. Enfocado en transformar requisitos complejos en experiencias intuitivas y elegantes.
        </div>
      </section>

      <!-- Experiencia Laboral -->
      <section class="cv-section" data-section-type="experience">
        <div class="cv-section-header">
          <span class="cv-section-title" contenteditable="true">Experiencia Laboral</span>
          <div class="section-actions">
            <button class="action-btn" onclick="window.miVit3.addExperienceItem(this)">+ Añadir empleo</button>
            <button class="action-btn btn-del" onclick="window.miVit3.deleteSection(this)">Eliminar sección</button>
          </div>
        </div>
        <div class="cv-section-body">
          <div class="cv-item">
            <div class="item-actions">
              <button class="action-btn btn-del" onclick="window.miVit3.deleteItem(this)" title="Eliminar empleo">✕</button>
            </div>
            <div class="cv-item-side">
              <span class="cv-item-date" contenteditable="true">2021 — Presente</span>
              <span class="cv-item-location" contenteditable="true">CDMX, México</span>
            </div>
            <div class="cv-item-main">
              <div class="cv-item-header">
                <span class="cv-item-title" contenteditable="true">Líder Técnico Frontend</span> · 
                <span class="cv-item-subtitle" contenteditable="true">Tech Solutions Global</span>
              </div>
              <div class="cv-item-desc" contenteditable="true">
                <ul>
                  <li>Dirección técnica del equipo frontend en el rediseño de la plataforma SaaS principal, reduciendo los tiempos de carga en un 42%.</li>
                  <li>Implementación de un sistema de diseño modular y componentes reutilizables sin dependencias pesadas, mejorando la velocidad de entrega en un 35%.</li>
                  <li>Mentoría y capacitación a 8 ingenieros de software en estándares modernos de la web y accesibilidad WCAG 2.1 AA.</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="cv-item">
            <div class="item-actions">
              <button class="action-btn btn-del" onclick="window.miVit3.deleteItem(this)" title="Eliminar empleo">✕</button>
            </div>
            <div class="cv-item-side">
              <span class="cv-item-date" contenteditable="true">2018 — 2021</span>
              <span class="cv-item-location" contenteditable="true">Guadalajara, México</span>
            </div>
            <div class="cv-item-main">
              <div class="cv-item-header">
                <span class="cv-item-title" contenteditable="true">Desarrollador Web Senior</span> · 
                <span class="cv-item-subtitle" contenteditable="true">Innova Digital Studio</span>
              </div>
              <div class="cv-item-desc" contenteditable="true">
                <ul>
                  <li>Desarrollo de módulos interactivos de comercio electrónico con procesamiento de pagos en tiempo real y alta concurrencia.</li>
                  <li>Migración exitosa de librerías obsoletas (como jQuery legacy) hacia arquitectura limpia en Vanilla JavaScript y APIs nativas del DOM.</li>
                  <li>Integración continua y automatización de pruebas unitarias logrando un 92% de cobertura de código.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Formación Académica -->
      <section class="cv-section" data-section-type="education">
        <div class="cv-section-header">
          <span class="cv-section-title" contenteditable="true">Formación Académica</span>
          <div class="section-actions">
            <button class="action-btn" onclick="window.miVit3.addEducationItem(this)">+ Añadir estudio</button>
            <button class="action-btn btn-del" onclick="window.miVit3.deleteSection(this)">Eliminar sección</button>
          </div>
        </div>
        <div class="cv-section-body">
          <div class="cv-item">
            <div class="item-actions">
              <button class="action-btn btn-del" onclick="window.miVit3.deleteItem(this)" title="Eliminar estudio">✕</button>
            </div>
            <div class="cv-item-side">
              <span class="cv-item-date" contenteditable="true">2013 — 2017</span>
              <span class="cv-item-location" contenteditable="true">CDMX, México</span>
            </div>
            <div class="cv-item-main">
              <div class="cv-item-header">
                <span class="cv-item-title" contenteditable="true">Licenciatura en Ciencias de la Computación</span> · 
                <span class="cv-item-subtitle" contenteditable="true">Universidad Nacional Autónoma de México</span>
              </div>
              <div class="cv-item-desc" contenteditable="true">
                Graduado con Mención Honorífica por proyecto de grado en algoritmos interactivos de renderizado web.
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Habilidades y Competencias -->
      <section class="cv-section" data-section-type="skills">
        <div class="cv-section-header">
          <span class="cv-section-title" contenteditable="true">Habilidades &amp; Tecnologías</span>
          <div class="section-actions">
            <button class="action-btn" onclick="window.miVit3.addSkillTag(this)">+ Añadir habilidad</button>
            <button class="action-btn btn-del" onclick="window.miVit3.deleteSection(this)">Eliminar sección</button>
          </div>
        </div>
        <div class="cv-tags-wrap">
          <span class="cv-tag"><span contenteditable="true">JavaScript (ES6+)</span><span class="cv-tag-del" onclick="this.parentElement.remove()">✕</span></span>
          <span class="cv-tag"><span contenteditable="true">HTML5 &amp; CSS3 Moderno</span><span class="cv-tag-del" onclick="this.parentElement.remove()">✕</span></span>
          <span class="cv-tag"><span contenteditable="true">Diseño UI/UX (Figma)</span><span class="cv-tag-del" onclick="this.parentElement.remove()">✕</span></span>
          <span class="cv-tag"><span contenteditable="true">Arquitectura de Software</span><span class="cv-tag-del" onclick="this.parentElement.remove()">✕</span></span>
          <span class="cv-tag"><span contenteditable="true">SVG &amp; Gráficos Web</span><span class="cv-tag-del" onclick="this.parentElement.remove()">✕</span></span>
          <span class="cv-tag"><span contenteditable="true">Rendimiento Web (Core Web Vitals)</span><span class="cv-tag-del" onclick="this.parentElement.remove()">✕</span></span>
          <span class="cv-tag"><span contenteditable="true">Git &amp; CI/CD</span><span class="cv-tag-del" onclick="this.parentElement.remove()">✕</span></span>
          <span class="cv-tag"><span contenteditable="true">Metodologías Ágiles (Scrum)</span><span class="cv-tag-del" onclick="this.parentElement.remove()">✕</span></span>
        </div>
      </section>

      <!-- Idiomas -->
      <section class="cv-section" data-section-type="languages">
        <div class="cv-section-header">
          <span class="cv-section-title" contenteditable="true">Idiomas</span>
          <div class="section-actions">
            <button class="action-btn" onclick="window.miVit3.addLanguageItem(this)">+ Añadir idioma</button>
            <button class="action-btn btn-del" onclick="window.miVit3.deleteSection(this)">Eliminar sección</button>
          </div>
        </div>
        <div class="cv-item-desc" contenteditable="true">
          <strong>Español:</strong> Nativo &nbsp;|&nbsp; 
          <strong>Inglés:</strong> Profesional Avanzado (C1) &nbsp;|&nbsp; 
          <strong>Francés:</strong> Intermedio (B1)
        </div>
      </section>
    `
  };


  window.SAMPLE_DATA = SAMPLE_DATA;
  window.miVit3.SAMPLE_DATA = SAMPLE_DATA;

})();


/* --- Módulo: toolbar.js --- */
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


/* --- Módulo: templates.js --- */
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


/* --- Módulo: pagination.js --- */
/**
 * miVIT3 — Módulo de Paginación Dinámica A4 y Control de Densidad (Fase 1)
 * Medición geométrica A4 en tiempo real (relación 210x297mm), guías de corte y advertencia de desborde.
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

  function setupDensityControls() {
    const densityButtons = document.querySelectorAll('.pill-btn[data-density]');
    densityButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        setDensity(this.dataset.density);
      });
    });

    const btnAutoFit = document.getElementById('btnAutoFitCompact');
    if (btnAutoFit) {
      btnAutoFit.addEventListener('click', function () {
        setDensity('density-compact');
      });
    }
  }

  function setDensity(densityClass) {
    const cvDoc = document.getElementById('cv-document');
    if (!cvDoc) return;

    cvDoc.classList.remove('density-compact', 'density-normal', 'density-spacious');
    cvDoc.classList.add(densityClass);

    document.querySelectorAll('.pill-btn[data-density]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.density === densityClass);
    });

    saveSettings();
    updatePageBreakAndCapacity();

    const densityNames = {
      'density-compact': 'Compacto',
      'density-normal': 'Normal',
      'density-spacious': 'Espacioso'
    };
    if (window.showToast) {
      window.showToast(`Densidad "${densityNames[densityClass] || densityClass}" activada`);
    }
  }

  function setupPageBreakObserver() {
    const cvDoc = document.getElementById('cv-document');
    if (!cvDoc) return;

    const debounceFn = window.debounce || ((fn) => fn);
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(debounceFn(updatePageBreakAndCapacity, 80));
      ro.observe(cvDoc);
    } else {
      window.addEventListener('resize', debounceFn(updatePageBreakAndCapacity, 150));
    }
    setTimeout(updatePageBreakAndCapacity, 200);
  }

  function updatePageBreakAndCapacity() {
    const cvPaper = document.getElementById('cv-paper');
    const cvDoc = document.getElementById('cv-document');
    if (!cvPaper || !cvDoc) return;

    const paperWidth = cvPaper.clientWidth || 794;
    const a4HeightPx = Math.round((paperWidth / 210) * 297);
    const docHeight = cvDoc.offsetHeight || cvDoc.scrollHeight;

    const percent = Math.round((docHeight / a4HeightPx) * 100);
    const numPages = Math.max(1, Math.ceil(docHeight / a4HeightPx));

    const pageBadgeText = document.getElementById('pageBadgeText');
    const pageBadge = document.getElementById('pageBadge');
    if (pageBadgeText) {
      pageBadgeText.textContent = `${numPages} ${numPages === 1 ? 'pág.' : 'págs.'} (${percent}%)`;
    }
    if (pageBadge) {
      pageBadge.classList.toggle('badge-warning', percent > 100);
    }

    const banner = document.getElementById('pageWarningBanner');
    const overflowPercent = document.getElementById('overflowPercent');
    if (banner) {
      if (percent > 100 && percent <= 115 && !cvDoc.classList.contains('density-compact')) {
        banner.style.display = 'flex';
        if (overflowPercent) overflowPercent.textContent = `${percent}%`;
      } else {
        banner.style.display = 'none';
      }
    }

    renderPageBreakGuides(cvPaper, a4HeightPx, numPages);
  }

  function renderPageBreakGuides(paper, a4HeightPx, numPages) {
    paper.querySelectorAll('.page-break-guide').forEach(g => g.remove());

    for (let p = 1; p < numPages; p++) {
      const guide = document.createElement('div');
      guide.className = 'page-break-guide';
      guide.style.top = `${p * a4HeightPx}px`;
      guide.innerHTML = `<span class="page-break-label">Límite Página ${p} (A4)</span>`;
      paper.appendChild(guide);
    }
  }

  // Exportar funciones
  window.setupDensityControls = setupDensityControls;
  window.setDensity = setDensity;
  window.setupPageBreakObserver = setupPageBreakObserver;
  window.updatePageBreakAndCapacity = updatePageBreakAndCapacity;
  window.renderPageBreakGuides = renderPageBreakGuides;

  window.miVit3.setupDensityControls = setupDensityControls;
  window.miVit3.setDensity = setDensity;
  window.miVit3.setupPageBreakObserver = setupPageBreakObserver;
  window.miVit3.updatePageBreakAndCapacity = updatePageBreakAndCapacity;

})();


/* --- Módulo: drag-drop.js --- */
/**
 * miVIT3 — Módulo de Arrastrar y Soltar (HTML5 Drag & Drop - Fase 1)
 * Reordenamiento fluido y modular de bloques de sección e ítems individuales con asas dedicadas.
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

  function updatePageBreakAndCapacity() {
    if (typeof window.updatePageBreakAndCapacity === 'function') {
      window.updatePageBreakAndCapacity();
    } else if (window.miVit3 && typeof window.miVit3.updatePageBreakAndCapacity === 'function') {
      window.miVit3.updatePageBreakAndCapacity();
    }
  }

  function setupDragAndDrop() {
    ensureDragHandles();

    const cvDoc = document.getElementById('cv-document');
    if (!cvDoc) return;

    let draggedEl = null;
    let dragType = null; // 'section' | 'item'

    cvDoc.addEventListener('dragstart', function (e) {
      const handle = e.target.closest('.drag-handle');
      if (!handle) return;

      const item = handle.closest('.cv-item');
      const section = handle.closest('.cv-section');

      if (handle.classList.contains('item-drag-handle') && item) {
        draggedEl = item;
        dragType = 'item';
      } else if (section) {
        draggedEl = section;
        dragType = 'section';
      }

      if (draggedEl) {
        draggedEl.classList.add('is-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');
      }
    });

    cvDoc.addEventListener('dragover', function (e) {
      if (!draggedEl) return;

      const target = dragType === 'section'
        ? e.target.closest('.cv-section')
        : e.target.closest('.cv-item');

      if (!target || target === draggedEl) return;

      if (dragType === 'item' && target.closest('.cv-section') !== draggedEl.closest('.cv-section')) {
        return;
      }

      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';

      const rect = target.getBoundingClientRect();
      const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;

      target.classList.toggle('drag-over-top', !next);
      target.classList.toggle('drag-over-bottom', next);
    });

    cvDoc.addEventListener('dragleave', function (e) {
      const target = e.target.closest('.cv-section, .cv-item');
      if (target) {
        target.classList.remove('drag-over-top', 'drag-over-bottom');
      }
    });

    cvDoc.addEventListener('drop', function (e) {
      if (!draggedEl) return;

      const target = dragType === 'section'
        ? e.target.closest('.cv-section')
        : e.target.closest('.cv-item');

      if (!target || target === draggedEl) return;

      e.preventDefault();
      const rect = target.getBoundingClientRect();
      const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;

      target.parentNode.insertBefore(draggedEl, next ? target.nextSibling : target);
      target.classList.remove('drag-over-top', 'drag-over-bottom');

      triggerAutoSave();
      updatePageBreakAndCapacity();
      if (window.showToast) {
        window.showToast(dragType === 'section' ? 'Sección reordenada' : 'Elemento reordenado');
      }
    });

    cvDoc.addEventListener('dragend', function () {
      if (draggedEl) {
        draggedEl.classList.remove('is-dragging');
        draggedEl = null;
        dragType = null;
      }
      cvDoc.querySelectorAll('.drag-over-top, .drag-over-bottom').forEach(el => {
        el.classList.remove('drag-over-top', 'drag-over-bottom');
      });
      updatePageBreakAndCapacity();
    });
  }

  function ensureDragHandles() {
    const cvDoc = document.getElementById('cv-document');
    if (!cvDoc) return;

    // Secciones
    cvDoc.querySelectorAll('.cv-section').forEach(section => {
      const header = section.querySelector('.cv-section-header');
      if (header && !header.querySelector('.drag-handle:not(.item-drag-handle)')) {
        const handle = document.createElement('span');
        handle.className = 'drag-handle';
        handle.setAttribute('draggable', 'true');
        handle.setAttribute('title', 'Arrastrar sección para reordenar');
        handle.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>`;
        header.insertBefore(handle, header.firstChild);
      }
    });

    // Items individuales
    cvDoc.querySelectorAll('.cv-item').forEach(item => {
      const actions = item.querySelector('.item-actions');
      if (actions && !actions.querySelector('.item-drag-handle')) {
        const handle = document.createElement('span');
        handle.className = 'drag-handle item-drag-handle';
        handle.setAttribute('draggable', 'true');
        handle.setAttribute('title', 'Arrastrar elemento para reordenar');
        handle.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>`;
        actions.insertBefore(handle, actions.firstChild);
      }
    });
  }

  // Exportar funciones
  window.setupDragAndDrop = setupDragAndDrop;
  window.ensureDragHandles = ensureDragHandles;

  window.miVit3.setupDragAndDrop = setupDragAndDrop;
  window.miVit3.ensureDragHandles = ensureDragHandles;

})();


/* --- Módulo: ats-engine.js --- */
/**
 * miVIT3 — Módulo del Motor Auditor ATS & Comparador de Vacante (Fase 2)
 * Puntuación algorítmica 0-100, fórmula STAR de logros cuantificables y matching de palabras clave.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  // Auditor ATS, Impacto STAR y Comparador de Vacante (Fase 2)
  // =========================================================================

  const STRONG_ACTION_VERBS = [
    'lideré', 'liderar', 'lideró', 'liderando', 'liderado',
    'dirigí', 'dirigir', 'dirigió', 'dirigiendo',
    'gestioné', 'gestionar', 'gestionó', 'gestionando',
    'coordiné', 'coordinar', 'coordinó', 'coordinando',
    'desarrollé', 'desarrollar', 'desarrolló', 'desarrollando',
    'diseñé', 'diseñar', 'diseñó', 'diseñando',
    'implementé', 'implementar', 'implementó', 'implementando',
    'construí', 'construir', 'construyó', 'construyendo',
    'creé', 'crear', 'creó', 'creando',
    'arquitecté', 'arquitectar', 'programé', 'programar', 'codifiqué',
    'estructuré', 'estructurar',
    'optimicé', 'optimizar', 'optimizó', 'optimizando',
    'mejoré', 'mejorar', 'mejoró', 'mejorando',
    'aumenté', 'aumentar', 'aumentó', 'incrementé', 'incrementar',
    'reduje', 'reducir', 'redujo', 'reduciendo',
    'aceleré', 'acelerar', 'automaticé', 'automatizar', 'automatizó',
    'estandaricé', 'estandarizar', 'escalé', 'escalar', 'escaló',
    'transformé', 'transformar', 'resolví', 'resolver', 'resuelto',
    'alcancé', 'alcanzar', 'logré', 'lograr', 'logrado',
    'superé', 'superar', 'superó', 'maximizé', 'maximizar',
    'minimicé', 'minimizar', 'generé', 'generar', 'generó',
    'ahorré', 'ahorrar', 'fundé', 'fundar', 'lancé', 'lanzar', 'lanzó',
    'inicié', 'iniciar', 'establecí', 'establecer', 'estableció',
    'desplegué', 'desplegar', 'desplegado', 'refactoricé', 'refactorizar',
    'migré', 'migrar', 'migrado', 'integré', 'integrar', 'integró',
    'audité', 'auditar', 'entrené', 'entrenar', 'capacité', 'capacitar',
    'negocié', 'negociar', 'centralicé', 'centralizar', 'consolidé'
  ];

  const WEAK_WORDS_PATTERNS = [
    { regex: /\bresponsable de\b/gi, phrase: 'responsable de' },
    { regex: /\bencargado de\b/gi, phrase: 'encargado de' },
    { regex: /\bayudé en\b/gi, phrase: 'ayudé en' },
    { regex: /\basistí en\b/gi, phrase: 'asistí en' },
    { regex: /\bapoyé en\b/gi, phrase: 'apoyé en' },
    { regex: /\btrabajé en\b/gi, phrase: 'trabajé en' },
    { regex: /\bcolaboré con\b/gi, phrase: 'colaboré con' },
    { regex: /\bparticipé en\b/gi, phrase: 'participé en' },
    { regex: /\btareas de\b/gi, phrase: 'tareas de' }
  ];

  const SPANISH_STOPWORDS = new Set([
    'de', 'la', 'que', 'el', 'en', 'y', 'a', 'los', 'del', 'se', 'las', 'por', 'un', 'para', 'con', 'no', 'una',
    'su', 'al', 'lo', 'como', 'más', 'pero', 'sus', 'le', 'ya', 'o', 'este', 'sí', 'porque', 'esta', 'entre',
    'cuando', 'muy', 'sin', 'sobre', 'también', 'me', 'hasta', 'hay', 'donde', 'quien', 'desde', 'todo', 'nos',
    'durante', 'todos', 'uno', 'les', 'ni', 'contra', 'otros', 'ese', 'eso', 'ante', 'ellos', 'e', 'esto', 'mí',
    'antes', 'algunos', 'qué', 'unos', 'yo', 'otro', 'otras', 'otra', 'él', 'tanto', 'esa', 'estos', 'mucho',
    'quienes', 'nada', 'muchos', 'cual', 'sea', 'poco', 'ella', 'estar', 'haber', 'ser', 'tener', 'hacer',
    'poder', 'decir', 'ir', 'ver', 'dar', 'saber', 'querer', 'llegar', 'pasar', 'deber', 'poner', 'parecer',
    'quedar', 'creer', 'hablar', 'llevar', 'dejar', 'seguir', 'encontrar', 'llamar', 'venir', 'pensar', 'salir',
    'volver', 'tomar', 'conocer', 'vivir', 'sentir', 'tratar', 'mirar', 'contar', 'empezar', 'esperar', 'buscar',
    'existir', 'entrar', 'trabajar', 'escribir', 'perder', 'producir', 'ocurrir', 'entender', 'pedir', 'recibir',
    'recordar', 'terminar', 'permitir', 'aparecer', 'conseguir', 'comenzar', 'servir', 'sacar', 'necesitar',
    'mantener', 'resultar', 'leer', 'caer', 'cambiar', 'presentar', 'abrir', 'considerar', 'oír', 'buscamos',
    'vacante', 'requisitos', 'empresa', 'candidato', 'experiencia', 'años', 'conocimientos', 'habilidades',
    'the', 'and', 'with', 'for', 'you', 'are', 'this', 'that', 'our', 'will', 'have', 'from', 'team'
  ]);

  function getCvDocument() {
    return document.getElementById('cv-document');
  }

  function openDrawer() {
    const drawer = document.getElementById('atsDrawer');
    const backdrop = document.getElementById('atsDrawerBackdrop');
    if (drawer) drawer.classList.add('show');
    if (backdrop) backdrop.classList.add('show');
    runAtsAudit();
    runJobMatch();
  }

  function closeDrawer() {
    const drawer = document.getElementById('atsDrawer');
    const backdrop = document.getElementById('atsDrawerBackdrop');
    if (drawer) drawer.classList.remove('show');
    if (backdrop) backdrop.classList.remove('show');
  }

  function setupAtsEngine() {
    const btnToggle = document.getElementById('btnToggleAts');
    const drawer = document.getElementById('atsDrawer');
    const backdrop = document.getElementById('atsDrawerBackdrop');
    const btnClose = document.getElementById('btnCloseAts');

    if (btnToggle) {
      btnToggle.addEventListener('click', function () {
        if (drawer && drawer.classList.contains('show')) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });
    }

    if (btnClose) {
      btnClose.addEventListener('click', closeDrawer);
    }

    if (backdrop) {
      backdrop.addEventListener('click', closeDrawer);
    }

    // Navegación de pestañas en el panel lateral
    const tabBtnAudit = document.getElementById('tabBtnAudit');
    const tabBtnJobMatch = document.getElementById('tabBtnJobMatch');
    const tabContentAudit = document.getElementById('tabContentAudit');
    const tabContentJobMatch = document.getElementById('tabContentJobMatch');

    if (tabBtnAudit && tabBtnJobMatch && tabContentAudit && tabContentJobMatch) {
      tabBtnAudit.addEventListener('click', function () {
        tabBtnAudit.classList.add('active');
        tabBtnJobMatch.classList.remove('active');
        tabContentAudit.classList.add('active');
        tabContentJobMatch.classList.remove('active');
      });

      tabBtnJobMatch.addEventListener('click', function () {
        tabBtnJobMatch.classList.add('active');
        tabBtnAudit.classList.remove('active');
        tabContentJobMatch.classList.add('active');
        tabContentAudit.classList.remove('active');
      });
    }

    // Input en vivo de descripción de vacante
    const jobInput = document.getElementById('jobDescriptionInput');
    const debounceFn = window.debounce || ((fn) => fn);
    if (jobInput) {
      jobInput.addEventListener('input', debounceFn(runJobMatch, 250));
    }

    // Ejecutar auditoría inicial
    runAtsAudit();
    runJobMatch();
  }

  function createCheckItemHtml(passed, label, detail) {
    const icon = passed
      ? `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    return `
      <li class="ats-check-item ${passed ? 'passed' : 'failed'}">
        ${icon}
        <span><strong>${escapeHtml(label)}:</strong> ${escapeHtml(detail)}</span>
      </li>
    `;
  }

  function runAtsAudit() {
    const cvDocument = getCvDocument();
    if (!cvDocument) return;

    const docText = (cvDocument.innerText || cvDocument.textContent || '').trim();
    const lowerDoc = docText.toLowerCase();

    // 1. Datos de Contacto Clave
    const nameEl = cvDocument.querySelector('.cv-name');
    const hasName = Boolean(nameEl && nameEl.textContent.trim().length >= 3 && !nameEl.textContent.includes('Tu Nombre'));

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const hasEmail = emailRegex.test(docText);

    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/;
    const hasPhone = phoneRegex.test(docText);

    const contactItems = cvDocument.querySelectorAll('.cv-contact-item');
    const hasLocationOrWeb = Array.from(contactItems).some(item => {
      const txt = item.textContent.trim().toLowerCase();
      return txt.length > 3 && !txt.includes('correo@') && !phoneRegex.test(txt);
    });

    const contactChecklist = document.getElementById('atsContactChecklist');
    if (contactChecklist) {
      contactChecklist.innerHTML = `
        ${createCheckItemHtml(hasName, 'Nombre completo', hasName ? 'Visible y profesional' : 'Falta nombre o contiene texto de ejemplo')}
        ${createCheckItemHtml(hasEmail, 'Correo electrónico', hasEmail ? 'Formato de email válido detectado' : 'Falta dirección de correo electrónico')}
        ${createCheckItemHtml(hasPhone, 'Teléfono de contacto', hasPhone ? 'Número telefónico detectado' : 'Recomendado incluir número telefónico')}
        ${createCheckItemHtml(hasLocationOrWeb, 'Ubicación / Perfil web', hasLocationOrWeb ? 'Ciudad, enlace o portafolio incluido' : 'Sugerido indicar ciudad/país o LinkedIn')}
      `;
    }

    // 2. Secciones Fundamentales
    const sections = Array.from(cvDocument.querySelectorAll('.cv-section'));

    const hasProfile = sections.some(s => {
      const type = s.dataset.sectionType;
      const title = (s.querySelector('.cv-section-title') || {}).textContent || '';
      return type === 'profile' || /perfil|resumen|objetivo|sobre m[ií]|profile|summary/i.test(title);
    });

    const hasExperience = sections.some(s => {
      const type = s.dataset.sectionType;
      const title = (s.querySelector('.cv-section-title') || {}).textContent || '';
      return type === 'experience' || /experiencia|laboral|empleo|trayectoria|historial|experience|work/i.test(title);
    });

    const hasEducation = sections.some(s => {
      const type = s.dataset.sectionType;
      const title = (s.querySelector('.cv-section-title') || {}).textContent || '';
      return type === 'education' || /educaci[oó]n|estudios|formaci[oó]n|acad[eé]mic|education/i.test(title);
    });

    const hasSkills = sections.some(s => {
      const type = s.dataset.sectionType;
      const title = (s.querySelector('.cv-section-title') || {}).textContent || '';
      return type === 'skills' || /habilidad|competencia|tecnolog|skills|stack|herramientas/i.test(title);
    });

    const sectionsChecklist = document.getElementById('atsSectionsChecklist');
    if (sectionsChecklist) {
      sectionsChecklist.innerHTML = `
        ${createCheckItemHtml(hasProfile, 'Perfil Profesional', hasProfile ? 'Presente y estructurado' : 'Se recomienda agregar un breve extracto/perfil')}
        ${createCheckItemHtml(hasExperience, 'Experiencia Laboral', hasExperience ? 'Historial profesional detectado' : 'Fundamental para cualquier filtro ATS')}
        ${createCheckItemHtml(hasEducation, 'Formación / Estudios', hasEducation ? 'Sección académica presente' : 'Falta registrar títulos o grados')}
        ${createCheckItemHtml(hasSkills, 'Habilidades & Tecnologías', hasSkills ? 'Competencias clave identificadas' : 'Crucial para el filtrado de palabras clave')}
      `;
    }

    // 3. Fórmula STAR y Verbos de Acción
    const foundVerbs = [];
    for (const verb of STRONG_ACTION_VERBS) {
      const rx = new RegExp(`\\b${verb}\\b`, 'i');
      if (rx.test(lowerDoc) && !foundVerbs.includes(verb)) {
        foundVerbs.push(verb);
      }
    }

    const actionVerbsCount = document.getElementById('atsActionVerbsCount');
    const actionVerbsList = document.getElementById('atsActionVerbsList');
    if (actionVerbsCount) actionVerbsCount.textContent = foundVerbs.length;
    if (actionVerbsList) {
      if (foundVerbs.length === 0) {
        actionVerbsList.innerHTML = `<span class="ats-hint-text">No se detectaron verbos directos de alto impacto (ej: lideré, implementé, optimicé, diseñé).</span>`;
      } else {
        actionVerbsList.innerHTML = foundVerbs.slice(0, 16).map(v => `<span class="ats-tag-badge ats-tag-match">✓ ${escapeHtml(v)}</span>`).join('');
      }
    }

    // Métricas cuantificables
    const metricRegex = /(\b\d+[\.,]?\d*\s*%|\$\s*\d+[\.,]?\d*|\b\d+\s*x\b|\b\d{2,}\b|\b\+\s*\d+|\b\d+\s*(?:usuarios|clientes|proyectos|ventas|visitas|descargas|equipos|horas|días|semanas|meses|años|empresas)\b)/gi;
    const metricMatches = docText.match(metricRegex) || [];
    const metricsCount = document.getElementById('atsMetricsCount');
    const metricsHint = document.getElementById('atsMetricsHint');
    if (metricsCount) metricsCount.textContent = metricMatches.length;
    if (metricsHint) {
      if (metricMatches.length >= 2) {
        metricsHint.textContent = `¡Excelente! Se detectaron ${metricMatches.length} métricas o cifras de impacto numérico.`;
        metricsHint.style.color = '#0f766e';
      } else if (metricMatches.length === 1) {
        metricsHint.textContent = 'Tienes 1 métrica numérica. Intenta sumar más resultados cuantitativos (%, $, tiempos).';
        metricsHint.style.color = '#b45309';
      } else {
        metricsHint.textContent = 'Procura que tus logros incluyan resultados numéricos (ej: "+30% rendimiento", "8 ingenieros").';
        metricsHint.style.color = '#64748b';
      }
    }

    // Frases pasivas o débiles
    const foundWeak = [];
    for (const item of WEAK_WORDS_PATTERNS) {
      if (item.regex.test(lowerDoc) && !foundWeak.includes(item.phrase)) {
        foundWeak.push(item.phrase);
      }
    }
    const weakWordsCount = document.getElementById('atsWeakWordsCount');
    const weakWordsList = document.getElementById('atsWeakWordsList');
    if (weakWordsCount) weakWordsCount.textContent = foundWeak.length;
    if (weakWordsList) {
      if (foundWeak.length === 0) {
        weakWordsList.innerHTML = `<span class="ats-hint-text" style="color:#0f766e;">¡Excelente! Sin frases pasivas débiles o clichés detectados.</span>`;
      } else {
        weakWordsList.innerHTML = foundWeak.map(w => `<span class="ats-tag-badge ats-tag-weak">⚠ ${escapeHtml(w)}</span>`).join('');
      }
    }

    // 4. Extensión y Palabras
    const words = docText.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const atsWordCount = document.getElementById('atsWordCount');
    const atsWordProgressBar = document.getElementById('atsWordProgressBar');
    const atsWordCountHint = document.getElementById('atsWordCountHint');

    if (atsWordCount) atsWordCount.textContent = `${wordCount} palabras`;
    if (atsWordProgressBar) {
      const pct = Math.min(100, Math.round((wordCount / 650) * 100));
      atsWordProgressBar.style.width = `${pct}%`;

      if (wordCount >= 320 && wordCount <= 680) {
        atsWordProgressBar.style.backgroundColor = '#22c55e';
        if (atsWordCountHint) {
          atsWordCountHint.textContent = 'Extensión óptima para un CV de 1 página (350 - 650 palabras).';
          atsWordCountHint.style.color = '#0f766e';
        }
      } else if (wordCount < 320) {
        atsWordProgressBar.style.backgroundColor = '#f59e0b';
        if (atsWordCountHint) {
          atsWordCountHint.textContent = `Breve (${wordCount}/350 mín sugerido). Desarrolla los detalles de tus responsabilidades y logros.`;
          atsWordCountHint.style.color = '#b45309';
        }
      } else {
        atsWordProgressBar.style.backgroundColor = '#ef4444';
        if (atsWordCountHint) {
          atsWordCountHint.textContent = `Extenso (${wordCount}/650 máx sugerido). Podría rebasar 1 página en formato impreso; considera sintetizar.`;
          atsWordCountHint.style.color = '#dc2626';
        }
      }
    }

    // 5. Cálculo del Puntaje Global (0-100)
    // Contacto: max 20 pts (5 c/u)
    let contactScore = (hasName ? 5 : 0) + (hasEmail ? 5 : 0) + (hasPhone ? 5 : 0) + (hasLocationOrWeb ? 5 : 0);

    // Secciones: max 25 pts (6, 7, 6, 6)
    let sectionScore = (hasProfile ? 6 : 0) + (hasExperience ? 7 : 0) + (hasEducation ? 6 : 0) + (hasSkills ? 6 : 0);

    // Verbos de acción: max 20 pts
    let verbScore = foundVerbs.length >= 5 ? 20 : (foundVerbs.length >= 3 ? 15 : (foundVerbs.length >= 1 ? 10 : 0));
    verbScore = Math.max(0, verbScore - (foundWeak.length * 2));

    // Métricas cuantificables: max 20 pts
    let metricScore = metricMatches.length >= 3 ? 20 : (metricMatches.length === 2 ? 15 : (metricMatches.length === 1 ? 10 : 0));

    // Densidad y palabras: max 15 pts
    let densityScore = 2;
    if (wordCount >= 320 && wordCount <= 680) {
      densityScore = 15;
    } else if ((wordCount >= 240 && wordCount < 320) || (wordCount > 680 && wordCount <= 800)) {
      densityScore = 10;
    } else if ((wordCount >= 140 && wordCount < 240) || (wordCount > 800 && wordCount <= 1000)) {
      densityScore = 5;
    }

    const totalScore = Math.max(0, Math.min(100, contactScore + sectionScore + verbScore + metricScore + densityScore));

    // Actualizar Insignia en Header
    const headerAtsBadge = document.getElementById('headerAtsBadge');
    if (headerAtsBadge) {
      headerAtsBadge.textContent = totalScore;
      headerAtsBadge.classList.remove('score-warn', 'score-bad');
      if (totalScore < 60) {
        headerAtsBadge.classList.add('score-bad');
      } else if (totalScore < 80) {
        headerAtsBadge.classList.add('score-warn');
      }
    }

    // Actualizar Tarjeta de Puntaje en Drawer
    const atsScoreNumber = document.getElementById('atsScoreNumber');
    if (atsScoreNumber) atsScoreNumber.textContent = totalScore;

    const atsScoreCircle = document.getElementById('atsScoreCircle');
    if (atsScoreCircle) {
      atsScoreCircle.style.borderColor = totalScore >= 80 ? '#22c55e' : (totalScore >= 60 ? '#f59e0b' : '#ef4444');
    }

    const atsScoreTitle = document.getElementById('atsScoreTitle');
    const atsScoreDesc = document.getElementById('atsScoreDesc');
    if (atsScoreTitle && atsScoreDesc) {
      if (totalScore >= 80) {
        atsScoreTitle.textContent = '¡Excelente optimización ATS!';
        atsScoreDesc.textContent = 'Estructura sólida, datos completos y alta probabilidad de superar filtros automáticos.';
      } else if (totalScore >= 60) {
        atsScoreTitle.textContent = 'Buen nivel con oportunidades';
        atsScoreDesc.textContent = 'Bases correctas. Te recomendamos incorporar más resultados cuantificables y verbos de acción.';
      } else {
        atsScoreTitle.textContent = 'Optimización requerida';
        atsScoreDesc.textContent = 'Faltan secciones esenciales o datos de contacto críticos para superar filtros ATS.';
      }
    }
  }

  function runJobMatch() {
    const cvDocument = getCvDocument();
    const jobInput = document.getElementById('jobDescriptionInput');
    const resultsContainer = document.getElementById('jobMatchResults');
    if (!jobInput || !resultsContainer || !cvDocument) return;

    const rawJob = jobInput.value.trim();
    if (!rawJob) {
      resultsContainer.style.display = 'none';
      return;
    }

    resultsContainer.style.display = 'block';

    const docText = (cvDocument.innerText || cvDocument.textContent || '').toLowerCase();

    // Extraer tokens válidos del texto de la vacante
    const words = rawJob.toLowerCase()
      .replace(/[^a-záéíóúüñ0-9+#.-]/gi, ' ')
      .split(/\s+/)
      .map(w => w.trim().replace(/^[-.]+|[-.]+$/g, ''))
      .filter(w => {
        if (!w || w.length < 2) return false;
        if (/^\d+$/.test(w)) return false;
        if (SPANISH_STOPWORDS.has(w)) return false;
        if (w.length < 3) {
          return ['ui', 'ux', 'qa', 'ci', 'cd', 'ai', 'js', 'ts', 'go', 'c#', 'c++', 'r'].includes(w);
        }
        return true;
      });

    // Frecuencia de términos en la vacante
    const freqMap = new Map();
    for (const w of words) {
      freqMap.set(w, (freqMap.get(w) || 0) + 1);
    }

    // Tomar las palabras clave más representativas (hasta 25)
    const sortedKeywords = Array.from(freqMap.keys())
      .sort((a, b) => freqMap.get(b) - freqMap.get(a))
      .slice(0, 25);

    if (sortedKeywords.length === 0) {
      resultsContainer.style.display = 'none';
      return;
    }

    const matched = [];
    const missing = [];

    for (const kw of sortedKeywords) {
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|[^a-záéíóúüñ0-9])${escaped}([^a-záéíóúüñ0-9]|$)`, 'i');
      if (regex.test(docText)) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    }

    const matchRate = Math.round((matched.length / sortedKeywords.length) * 100);

    const matchRatePercent = document.getElementById('matchRatePercent');
    if (matchRatePercent) {
      matchRatePercent.textContent = `${matchRate}%`;
      matchRatePercent.style.color = matchRate >= 70 ? '#0f766e' : (matchRate >= 45 ? '#b45309' : '#dc2626');
    }

    const matchedKeywordsCount = document.getElementById('matchedKeywordsCount');
    if (matchedKeywordsCount) matchedKeywordsCount.textContent = matched.length;

    const matchedKeywordsList = document.getElementById('matchedKeywordsList');
    if (matchedKeywordsList) {
      if (matched.length === 0) {
        matchedKeywordsList.innerHTML = `<span class="ats-hint-text">Aún no hay coincidencias con los términos de la vacante.</span>`;
      } else {
        matchedKeywordsList.innerHTML = matched.map(k => `<span class="ats-tag-badge ats-tag-match">✓ ${escapeHtml(k)}</span>`).join('');
      }
    }

    const missingKeywordsCount = document.getElementById('missingKeywordsCount');
    if (missingKeywordsCount) missingKeywordsCount.textContent = missing.length;

    const missingKeywordsList = document.getElementById('missingKeywordsList');
    if (missingKeywordsList) {
      if (missing.length === 0) {
        missingKeywordsList.innerHTML = `<span class="ats-hint-text" style="color:#0f766e;">¡Excelente! Tu CV incluye todas las palabras clave prioritarias detectadas.</span>`;
      } else {
        missingKeywordsList.innerHTML = missing.map(k => `<span class="ats-tag-badge ats-tag-missing">+ ${escapeHtml(k)}</span>`).join('');
      }
    }
  }

  const debounceFn = window.debounce || ((fn) => fn);
  const debouncedAudit = debounceFn(function () {
    runAtsAudit();
    runJobMatch();
  }, 200);

  // Exportar funciones
  window.setupAtsEngine = setupAtsEngine;
  window.openAtsDrawer = openDrawer;
  window.closeAtsDrawer = closeDrawer;
  window.runAtsAudit = runAtsAudit;
  window.runJobMatch = runJobMatch;
  window.debouncedAudit = debouncedAudit;

  window.miVit3.setupAtsEngine = setupAtsEngine;
  window.miVit3.openAtsDrawer = openDrawer;
  window.miVit3.closeAtsDrawer = closeDrawer;
  window.miVit3.runAtsAudit = runAtsAudit;
  window.miVit3.runJobMatch = runJobMatch;
  window.miVit3.debouncedAudit = debouncedAudit;

})();


/* --- Módulo: storage.js --- */
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
            'template-tech', 'template-executive', 'template-timeline', 'template-nordic',
            'template-alpha00', 'template-alpha01', 'template-alpha02', 'template-alpha03',
            'template-moderna', 'template-clasica', 'template-columnas', 'template-creativa'
          );
          cvDoc.classList.add(settings.template);

          document.querySelectorAll('[data-template]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.template === settings.template);
          });

          const currentNameEl = document.getElementById('currentTemplateName');
          const templateNames = {
            'template-tech': 'Tech Minimalista',
            'template-executive': 'Ejecutivo Harvard',
            'template-timeline': 'Línea de Tiempo',
            'template-nordic': 'Nordic Clean',
            'template-alpha00': 'Bicolor Moderno',
            'template-alpha01': 'Columnas ATS',
            'template-alpha02': 'Banner Credencial',
            'template-alpha03': 'Editorial Monograma'
          };
          if (currentNameEl && templateNames[settings.template]) {
            currentNameEl.textContent = templateNames[settings.template];
          }
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

    document.querySelectorAll('[data-template]').forEach(btn => {
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


/* --- Módulo: web-exporter.js --- */
/**
 * miVIT3 — Módulo de Exportación a Mini-Web Autocontenida (Fase 3)
 * Genera un archivo cv-web.html autónomo, responsivo, con dark mode, SEO semántico y cero dependencias.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  // Exportador a "Mini-Web" Autocontenida (cv-web.html) & PWA (Fase 3)
  // =========================================================================
  function exportToWebHtml() {
    const cvDocument = document.getElementById('cv-document');
    if (!cvDocument) return;

    // 1. Datos Personales
    const nameEl = cvDocument.querySelector('.cv-name');
    const personName = (nameEl ? nameEl.textContent.trim() : '') || 'Mi Currículum';

    const roleEl = cvDocument.querySelector('.cv-role');
    const personRole = (roleEl ? roleEl.textContent.trim() : '') || 'Profesional';

    const avatarEl = cvDocument.querySelector('#cvAvatar');
    const avatarSrc = (avatarEl ? avatarEl.src : '') || 'source/img/user.svg';

    const accent = getComputedStyle(document.documentElement).getPropertyValue('--cv-accent').trim() || '#6400c8';
    const accentLight = getComputedStyle(document.documentElement).getPropertyValue('--cv-accent-light').trim() || '#f3e8ff';

    // 2. Datos de Contacto
    const contactLinks = [];
    cvDocument.querySelectorAll('.cv-contact-item').forEach(li => {
      const span = li.querySelector('span');
      const text = span ? span.textContent.trim() : li.textContent.trim();
      if (!text || text.includes('correo@') || text.includes('placeholder')) return;

      if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) {
        const email = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)[0];
        contactLinks.push(`<a class="contact-link" href="mailto:${email}"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> ${escapeHtml(text)}</a>`);
      } else if (/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/.test(text) && text.replace(/\D/g, '').length >= 7) {
        const phone = text.replace(/[^0-9+]/g, '');
        contactLinks.push(`<a class="contact-link" href="tel:${phone}"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> ${escapeHtml(text)}</a>`);
      } else if (/linkedin\.com|github\.com|http/i.test(text)) {
        const href = text.startsWith('http') ? text : `https://${text}`;
        contactLinks.push(`<a class="contact-link" href="${href}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg> ${escapeHtml(text)}</a>`);
      } else {
        contactLinks.push(`<span class="contact-link"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> ${escapeHtml(text)}</span>`);
      }
    });

    // 3. Procesar Secciones
    let sectionsHtml = '';
    const sections = cvDocument.querySelectorAll('.cv-section');

    sections.forEach(sec => {
      const titleEl = sec.querySelector('.cv-section-title');
      const title = titleEl ? titleEl.textContent.trim() : 'Sección';

      const tagsWrap = sec.querySelector('.cv-tags-wrap');
      const items = sec.querySelectorAll('.cv-item');
      const descEl = sec.querySelector('.cv-item-desc:not(.cv-item .cv-item-desc)');

      let bodyHtml = '';

      if (tagsWrap) {
        // Etiquetas de habilidades
        const tags = Array.from(tagsWrap.querySelectorAll('.cv-tag')).map(t => {
          const editable = t.querySelector('[contenteditable]') || t;
          return editable.textContent.replace('✕', '').trim();
        }).filter(t => t.length > 0);

        bodyHtml = `<div class="skills-grid">${tags.map(t => `<span class="skill-badge">${escapeHtml(t)}</span>`).join('')}</div>`;
      } else if (items.length > 0) {
        // Elementos estructurados (Empleo / Educación)
        bodyHtml = Array.from(items).map(item => {
          const itemTitle = (item.querySelector('.cv-item-title') || {}).textContent || '';
          const itemSubtitle = (item.querySelector('.cv-item-subtitle') || {}).textContent || '';
          const itemDate = (item.querySelector('.cv-item-date') || {}).textContent || '';
          const itemLoc = (item.querySelector('.cv-item-location') || {}).textContent || '';
          const itemDesc = (item.querySelector('.cv-item-desc') || {}).innerHTML || '';

          const metaText = [itemDate.trim(), itemLoc.trim()].filter(Boolean).join(' · ');

          return `
            <div class="web-item">
              <div class="web-item-header">
                <div>
                  <h3 class="web-item-title">${escapeHtml(itemTitle.trim())}</h3>
                  ${itemSubtitle ? `<div class="web-item-subtitle">${escapeHtml(itemSubtitle.trim())}</div>` : ''}
                </div>
                ${metaText ? `<span class="web-item-date">${escapeHtml(metaText)}</span>` : ''}
              </div>
              ${itemDesc ? `<div class="web-item-desc">${cleanHtmlContent(itemDesc)}</div>` : ''}
            </div>
          `;
        }).join('');
      } else if (descEl) {
        // Texto general (Perfil, Idiomas)
        bodyHtml = `<div class="web-desc">${cleanHtmlContent(descEl.innerHTML)}</div>`;
      }

      if (bodyHtml.trim()) {
        sectionsHtml += `
          <section class="web-section">
            <h2 class="web-section-title">${escapeHtml(title)}</h2>
            ${bodyHtml}
          </section>
        `;
      }
    });

    function cleanHtmlContent(raw) {
      const temp = document.createElement('div');
      temp.innerHTML = raw;
      temp.querySelectorAll('.section-actions, .item-actions, .drag-handle, .cv-tag-del').forEach(el => el.remove());
      temp.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
      return temp.innerHTML;
    }

    // 5. Construir documento HTML autocontenido
    const htmlOutput = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Currículum Vitae y Portafolio Profesional de ${escapeHtml(personName)}.">
  <title>${escapeHtml(personName)} — Portafolio Profesional</title>
  <style>
    :root {
      --accent: ${accent};
      --accent-light: ${accentLight};
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08);
      --radius: 12px;
      --max-width: 860px;
    }
    body.dark-theme {
      --bg: #090d16;
      --card-bg: #131c2e;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --border: #1e293b;
      --shadow: 0 4px 24px -2px rgba(0, 0, 0, 0.4);
    }
    @media (prefers-color-scheme: dark) {
      body:not(.light-theme) {
        --bg: #090d16;
        --card-bg: #131c2e;
        --text: #f8fafc;
        --text-muted: #94a3b8;
        --border: #1e293b;
        --shadow: 0 4px 24px -2px rgba(0, 0, 0, 0.4);
      }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 30px 16px 80px 16px;
      transition: background-color 0.25s ease, color 0.25s ease;
    }
    .web-container {
      max-width: var(--max-width);
      margin: 0 auto;
    }
    .web-actions-bar {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 10px;
      margin-bottom: 24px;
    }
    .web-action-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      color: var(--text);
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      transition: all 0.2s ease;
      text-decoration: none;
    }
    .web-action-btn:hover {
      border-color: var(--accent);
      color: var(--accent);
    }
    .web-action-btn.btn-primary {
      background: var(--accent);
      color: #ffffff;
      border-color: var(--accent);
    }
    .web-action-btn.btn-primary:hover {
      opacity: 0.9;
      color: #ffffff;
    }
    .web-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 36px 40px;
      margin-bottom: 24px;
      transition: all 0.2s ease;
    }
    .profile-header {
      display: flex;
      align-items: center;
      gap: 28px;
      padding-bottom: 28px;
      border-bottom: 2px solid var(--border);
      margin-bottom: 30px;
    }
    .profile-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid var(--accent);
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .profile-info h1 {
      font-size: 28px;
      font-weight: 800;
      color: var(--text);
      line-height: 1.2;
      margin-bottom: 6px;
    }
    .profile-role {
      font-size: 16px;
      font-weight: 600;
      color: var(--accent);
      margin-bottom: 12px;
    }
    .contact-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 12px 20px;
    }
    .contact-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13.5px;
      color: var(--text-muted);
      text-decoration: none;
      transition: color 0.15s ease;
    }
    .contact-link:hover {
      color: var(--accent);
      text-decoration: underline;
    }
    .web-section {
      margin-bottom: 32px;
    }
    .web-section:last-child {
      margin-bottom: 0;
    }
    .web-section-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--text);
      text-transform: uppercase;
      letter-spacing: 0.6px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--accent);
      display: inline-block;
      margin-bottom: 18px;
    }
    .web-desc {
      font-size: 14.5px;
      color: var(--text);
      line-height: 1.7;
    }
    .web-item {
      padding: 16px 0;
      border-bottom: 1px dashed var(--border);
    }
    .web-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .web-item:first-child {
      padding-top: 0;
    }
    .web-item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 6px;
    }
    .web-item-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--text);
    }
    .web-item-subtitle {
      font-size: 15px;
      font-weight: 600;
      color: var(--accent);
    }
    .web-item-date {
      font-size: 12.5px;
      font-weight: 600;
      color: var(--text-muted);
      background: var(--bg);
      border: 1px solid var(--border);
      padding: 2px 10px;
      border-radius: 12px;
    }
    .web-item-desc {
      font-size: 14px;
      color: var(--text);
      line-height: 1.6;
    }
    .web-item-desc ul {
      padding-left: 20px;
      margin-top: 6px;
    }
    .web-item-desc li {
      margin-bottom: 4px;
    }
    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .skill-badge {
      background: var(--bg);
      border: 1px solid var(--border);
      color: var(--text);
      font-size: 13px;
      font-weight: 600;
      padding: 5px 12px;
      border-radius: 20px;
      transition: all 0.2s ease;
    }
    .skill-badge:hover {
      border-color: var(--accent);
      color: var(--accent);
      transform: translateY(-1px);
    }
    .web-footer {
      text-align: center;
      font-size: 12.5px;
      color: var(--text-muted);
      margin-top: 40px;
    }
    @media (max-width: 680px) {
      .web-card { padding: 24px 20px; }
      .profile-header { flex-direction: column; text-align: center; gap: 16px; }
      .contact-grid { justify-content: center; }
      .web-item-header { flex-direction: column; align-items: flex-start; }
      .web-actions-bar { justify-content: center; }
    }
    @media print {
      body { background: #fff !important; color: #000 !important; padding: 0 !important; }
      .web-actions-bar, .web-footer { display: none !important; }
      .web-card { border: none !important; box-shadow: none !important; padding: 0 !important; }
    }
  </style>
</head>
<body>
  <div class="web-container">
    <div class="web-actions-bar">
      <button id="themeToggleBtn" class="web-action-btn" title="Alternar Modo Oscuro / Claro">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        <span id="themeToggleLabel">Tema</span>
      </button>

      <button onclick="window.print()" class="web-action-btn btn-primary" title="Imprimir o Guardar como PDF">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        Imprimir / Guardar PDF
      </button>
    </div>

    <main class="web-card">
      <header class="profile-header">
        ${avatarSrc ? `<img src="${avatarSrc}" alt="${escapeHtml(personName)}" class="profile-avatar">` : ''}
        <div class="profile-info">
          <h1>${escapeHtml(personName)}</h1>
          ${personRole ? `<div class="profile-role">${escapeHtml(personRole)}</div>` : ''}
          ${contactLinks.length > 0 ? `<div class="contact-grid">${contactLinks.join('')}</div>` : ''}
        </div>
      </header>

      ${sectionsHtml}
    </main>

    <footer class="web-footer">
      <p>Portafolio web creado con <strong>miVIT3</strong> — Editor de CV profesional libre y privado</p>
    </footer>
  </div>

  <script>
    (function () {
      const btn = document.getElementById('themeToggleBtn');
      const label = document.getElementById('themeToggleLabel');
      const isDarkPreferred = window.matchMedia('(prefers-color-scheme: dark)').matches;
      let currentTheme = localStorage.getItem('mivit3_web_theme') || (isDarkPreferred ? 'dark' : 'light');

      function applyTheme(theme) {
        if (theme === 'dark') {
          document.body.classList.add('dark-theme');
          document.body.classList.remove('light-theme');
          if (label) label.textContent = 'Modo Claro';
        } else {
          document.body.classList.add('light-theme');
          document.body.classList.remove('dark-theme');
          if (label) label.textContent = 'Modo Oscuro';
        }
        localStorage.setItem('mivit3_web_theme', theme);
      }

      applyTheme(currentTheme);

      if (btn) {
        btn.addEventListener('click', function () {
          currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
          applyTheme(currentTheme);
        });
      }
    })();
  <\/script>
</body>
</html>`;

    // 6. Descargar archivo cv-web.html
    const blob = new Blob([htmlOutput], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const slug = personName.toLowerCase().replace(/[^a-záéíóúüñ0-9]+/g, '-').replace(/^-|-$/g, '') || 'cv';
    a.href = url;
    a.download = `cv-web-${slug}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Portafolio web (cv-web.html) descargado');

    // Mostrar modal con guía de publicación si aún no está abierto
    const modalPublish = document.getElementById('publishModal');
    if (modalPublish) {
      setTimeout(() => {
        modalPublish.classList.add('show');
      }, 700);
    }
  }


  // Exportar funciones
  window.exportToWebHtml = exportToWebHtml;
  window.miVit3.exportToWebHtml = exportToWebHtml;

})();


/* --- Módulo: pwa.js --- */
/**
 * miVIT3 — Módulo PWA & Soporte Offline (Fase 3)
 * Registro del Service Worker para capacidades sin conexión y caching local.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  function setupPwa() {
    if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((reg) => {
            console.log('miVIT3 PWA ServiceWorker registrado con alcance:', reg.scope);
          })
          .catch((err) => {
            console.warn('Error al registrar ServiceWorker PWA:', err);
          });
      });
    }
  }

  // Exportar funciones
  window.setupPwa = setupPwa;
  window.miVit3.setupPwa = setupPwa;

})();


/* --- Módulo: app.js --- */
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


