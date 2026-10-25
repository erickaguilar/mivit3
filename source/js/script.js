/**
 * miVIT3 — Procesador de CV estilo Word en Vanilla JavaScript
 * escoge · edita · envía
 * Cero dependencias externas (Sin jQuery)
 */

(function () {
  'use strict';

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

  // =========================================================================
  // Inicialización y Referencias DOM
  // =========================================================================
  let cvDocument = null;
  let saveTimeout = null;
  const STORAGE_KEY = 'mivit3_cv_content_v2';
  const STORAGE_SETTINGS = 'mivit3_cv_settings_v2';

  function init() {
    cvDocument = document.getElementById('cv-document');
    if (!cvDocument) return;

    // Cargar contenido guardado o datos de ejemplo
    loadSavedContent();

    // Eventos de barra de herramientas estilo Word
    setupWordToolbar();

    // Eventos de plantillas y colores
    setupSettingsBar();

    // Control de Densidad y Espaciado (Fase 1)
    setupDensityControls();

    // Drag & Drop modular (Fase 1)
    setupDragAndDrop();

    // Paginación y medición en vivo A4 (Fase 1)
    setupPageBreakObserver();

    // Auditor ATS & Comparador de Vacante (Fase 2)
    setupAtsEngine();

    // Eventos de carga de imagen
    setupAvatarUpload();

    // Atajos de teclado (Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+S, Ctrl+P)
    setupKeyboardShortcuts();

    // Escuchar cambios para autoguardado
    setupAutoSave();

    // Botones de acción principales
    setupMainActions();
  }

  // =========================================================================
  // Barra de Herramientas Estilo Word (Rich Text Formatting)
  // =========================================================================
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
        // En execCommand los tamaños son 1 a 7 o aplicamos tamaño vía span
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
        document.getElementById('textColorIndicator').style.backgroundColor = this.value;
        triggerAutoSave();
      });
    }

    // Selector de color de resaltador
    const highlightColorPicker = document.getElementById('highlightColorPicker');
    if (highlightColorPicker) {
      highlightColorPicker.addEventListener('input', function () {
        executeFormatCommand('hiliteColor', this.value);
        document.getElementById('highlightColorIndicator').style.backgroundColor = this.value;
        triggerAutoSave();
      });
    }

    // Actualizar estado activo de botones al hacer clic o soltar tecla en el documento
    document.addEventListener('selectionchange', debounce(updateToolbarState, 100));
  }

  function executeFormatCommand(command, value = null) {
    if (command === 'createLink') {
      const url = prompt('Ingresa el enlace URL (ejemplo: https://github.com/usuario):', 'https://');
      if (url) {
        document.execCommand('createLink', false, url);
      }
      return;
    }

    document.execCommand(command, false, value);
    triggerAutoSave();
  }

  function applyFontSize(sizeValue) {
    // Usamos fontSize nativo o aplicamos estilo
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    document.execCommand('fontSize', false, '3');
    const fontElements = cvDocument.getElementsByTagName('font');
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

  // =========================================================================
  // Plantillas & Colores de Acento
  // =========================================================================
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
    if (!cvDocument) return;
    cvDocument.classList.remove('template-alpha00', 'template-alpha01', 'template-alpha02', 'template-alpha03', 'template-moderna', 'template-clasica', 'template-columnas', 'template-creativa');
    cvDocument.classList.add(templateClass);
    saveSettings();

    const templateNames = {
      'template-alpha00': '00 Bicolor',
      'template-alpha01': '01 Columnas ATS',
      'template-alpha02': '02 Banner',
      'template-alpha03': '03 Editorial'
    };
    showToast(`Plantilla "${templateNames[templateClass] || templateClass}" activada`);
  }

  function setAccentColor(accentHex, lightHex) {
    document.documentElement.style.setProperty('--cv-accent', accentHex);
    document.documentElement.style.setProperty('--cv-accent-light', lightHex);
    saveSettings();
    showToast(`Color de acento actualizado`);
  }

  // =========================================================================
  // Control de Densidad y Espaciado (Fase 1)
  // =========================================================================
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
    if (!cvDocument) return;
    cvDocument.classList.remove('density-compact', 'density-normal', 'density-spacious');
    cvDocument.classList.add(densityClass);

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
    showToast(`Densidad "${densityNames[densityClass] || densityClass}" activada`);
  }

  // =========================================================================
  // Paginación Dinámica A4 & Medición en Vivo (Fase 1)
  // =========================================================================
  function setupPageBreakObserver() {
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(debounce(updatePageBreakAndCapacity, 80));
      ro.observe(cvDocument);
    } else {
      window.addEventListener('resize', debounce(updatePageBreakAndCapacity, 150));
    }
    setTimeout(updatePageBreakAndCapacity, 200);
  }

  function updatePageBreakAndCapacity() {
    const cvPaper = document.getElementById('cv-paper');
    if (!cvPaper || !cvDocument) return;

    const paperWidth = cvPaper.clientWidth || 794;
    const a4HeightPx = Math.round((paperWidth / 210) * 297);
    const docHeight = cvDocument.offsetHeight || cvDocument.scrollHeight;

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
      if (percent > 100 && percent <= 115 && !cvDocument.classList.contains('density-compact')) {
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

  // =========================================================================
  // Drag & Drop Modular de Secciones y Elementos (Fase 1)
  // =========================================================================
  function setupDragAndDrop() {
    ensureDragHandles();

    let draggedEl = null;
    let dragType = null; // 'section' | 'item'

    cvDocument.addEventListener('dragstart', function (e) {
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

    cvDocument.addEventListener('dragover', function (e) {
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

    cvDocument.addEventListener('dragleave', function (e) {
      const target = e.target.closest('.cv-section, .cv-item');
      if (target) {
        target.classList.remove('drag-over-top', 'drag-over-bottom');
      }
    });

    cvDocument.addEventListener('drop', function (e) {
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
      showToast(dragType === 'section' ? 'Sección reordenada' : 'Elemento reordenado');
    });

    cvDocument.addEventListener('dragend', function () {
      if (draggedEl) {
        draggedEl.classList.remove('is-dragging');
        draggedEl = null;
        dragType = null;
      }
      cvDocument.querySelectorAll('.drag-over-top, .drag-over-bottom').forEach(el => {
        el.classList.remove('drag-over-top', 'drag-over-bottom');
      });
      updatePageBreakAndCapacity();
    });
  }

  function ensureDragHandles() {
    if (!cvDocument) return;

    // Secciones
    cvDocument.querySelectorAll('.cv-section').forEach(section => {
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
    cvDocument.querySelectorAll('.cv-item').forEach(item => {
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

  // =========================================================================
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

  function setupAtsEngine() {
    const btnToggle = document.getElementById('btnToggleAts');
    const drawer = document.getElementById('atsDrawer');
    const backdrop = document.getElementById('atsDrawerBackdrop');
    const btnClose = document.getElementById('btnCloseAts');

    function openDrawer() {
      if (drawer) drawer.classList.add('show');
      if (backdrop) backdrop.classList.add('show');
      runAtsAudit();
      runJobMatch();
    }

    function closeDrawer() {
      if (drawer) drawer.classList.remove('show');
      if (backdrop) backdrop.classList.remove('show');
    }

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
    if (jobInput) {
      jobInput.addEventListener('input', debounce(runJobMatch, 250));
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

  const debouncedAudit = debounce(function () {
    runAtsAudit();
    runJobMatch();
  }, 200);

  // =========================================================================
  // Carga de Fotografía de Perfil (Vanilla FileReader)
  // =========================================================================
  function setupAvatarUpload() {
    const fileInput = document.getElementById('avatarFileInput');
    if (!fileInput) return;

    fileInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido.');
        return;
      }

      const reader = new FileReader();
      reader.onload = function (event) {
        const avatarImg = document.getElementById('cvAvatar');
        if (avatarImg) {
          avatarImg.src = event.target.result;
          triggerAutoSave();
          showToast('Foto de perfil actualizada');
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // =========================================================================
  // Gestión Dinámica de Secciones & Elementos (Add/Delete)
  // =========================================================================
  window.miVit3 = {
    // Añadir nuevo empleo
    addExperienceItem: function (btn) {
      const section = btn.closest('.cv-section');
      const body = section.querySelector('.cv-section-body') || section;
      const newItem = document.createElement('div');
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
      body.appendChild(newItem);
      triggerAutoSave();
      newItem.querySelector('.cv-item-title').focus();
    },

    // Añadir nuevo estudio
    addEducationItem: function (btn) {
      const section = btn.closest('.cv-section');
      const body = section.querySelector('.cv-section-body') || section;
      const newItem = document.createElement('div');
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
      body.appendChild(newItem);
      triggerAutoSave();
      newItem.querySelector('.cv-item-title').focus();
    },

    // Añadir tag de habilidad
    addSkillTag: function (btn) {
      const section = btn.closest('.cv-section');
      const wrap = section.querySelector('.cv-tags-wrap');
      if (!wrap) return;

      const newTag = document.createElement('span');
      newTag.className = 'cv-tag';
      newTag.innerHTML = `
        <span contenteditable="true">Nueva Habilidad</span>
        <span class="cv-tag-del" onclick="this.parentElement.remove()">✕</span>
      `;
      wrap.appendChild(newTag);
      triggerAutoSave();
      const editable = newTag.querySelector('[contenteditable]');
      editable.focus();
      document.execCommand('selectAll', false, null);
    },

    // Añadir idioma
    addLanguageItem: function (btn) {
      const section = btn.closest('.cv-section');
      const desc = section.querySelector('.cv-item-desc');
      if (!desc) return;

      desc.innerHTML += ' &nbsp;|&nbsp; <strong>Nuevo Idioma:</strong> Nivel';
      triggerAutoSave();
    },

    // Eliminar item individual
    deleteItem: function (btn) {
      const item = btn.closest('.cv-item');
      if (item) {
        item.remove();
        triggerAutoSave();
        showToast('Elemento eliminado');
      }
    },

    // Eliminar sección completa
    deleteSection: function (btn) {
      const section = btn.closest('.cv-section');
      if (section && confirm('¿Estás seguro de que deseas eliminar esta sección completa?')) {
        section.remove();
        triggerAutoSave();
        showToast('Sección eliminada');
      }
    },

    // Añadir sección personalizada
    addCustomSection: function () {
      const title = prompt('Ingresa el título de la nueva sección (ej: Proyectos, Certificaciones, Referencias):', 'Proyectos Destacados');
      if (!title) return;

      const section = document.createElement('section');
      section.className = 'cv-section';
      section.innerHTML = `
        <div class="cv-section-header">
          <span class="cv-section-title" contenteditable="true">${escapeHtml(title)}</span>
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
      cvDocument.appendChild(section);
      triggerAutoSave();
      section.scrollIntoView({ behavior: 'smooth' });
      showToast(`Sección "${title}" añadida`);
    }
  };

  // =========================================================================
  // Autoguardado & Persistencia Local (LocalStorage)
  // =========================================================================
  function setupAutoSave() {
    cvDocument.addEventListener('input', function () {
      triggerAutoSave();
      debouncedAudit();
    });
  }

  function triggerAutoSave() {
    clearTimeout(saveTimeout);
    updateSaveIndicator(false);

    saveTimeout = setTimeout(function () {
      if (!cvDocument) return;
      localStorage.setItem(STORAGE_KEY, cvDocument.innerHTML);
      saveSettings();
      updateSaveIndicator(true);
      debouncedAudit();
    }, 600);
  }

  function saveSettings() {
    const currentTemplate = Array.from(cvDocument.classList).find(c => c.startsWith('template-')) || 'template-alpha00';
    const currentDensity = Array.from(cvDocument.classList).find(c => c.startsWith('density-')) || 'density-normal';
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
    const savedHtml = localStorage.getItem(STORAGE_KEY);
    const savedSettingsRaw = localStorage.getItem(STORAGE_SETTINGS);

    if (savedHtml && savedHtml.trim().length > 100) {
      cvDocument.innerHTML = savedHtml;
    } else {
      loadSampleData(false);
    }

    if (savedSettingsRaw) {
      try {
        const settings = JSON.parse(savedSettingsRaw);
        if (settings.template) {
          cvDocument.classList.remove('template-alpha00', 'template-alpha01', 'template-alpha02', 'template-alpha03', 'template-moderna', 'template-clasica', 'template-columnas', 'template-creativa');
          cvDocument.classList.add(settings.template);

          document.querySelectorAll('.pill-btn[data-template]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.template === settings.template);
          });
        }
        if (settings.density) {
          cvDocument.classList.remove('density-compact', 'density-normal', 'density-spacious');
          cvDocument.classList.add(settings.density);

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

    ensureDragHandles();
    updatePageBreakAndCapacity();
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

  // =========================================================================
  // Botones Principales (Ejemplo, Limpiar, JSON, Imprimir, Tips)
  // =========================================================================
  function setupMainActions() {
    // Cargar datos de ejemplo
    const btnSample = document.getElementById('btnSampleData');
    if (btnSample) {
      btnSample.addEventListener('click', function () {
        if (confirm('¿Deseas reemplazar el contenido actual con los datos de ejemplo profesionales?')) {
          loadSampleData(true);
        }
      });
    }

    // Limpiar documento
    const btnClear = document.getElementById('btnClearData');
    if (btnClear) {
      btnClear.addEventListener('click', function () {
        if (confirm('¿Estás seguro de vaciar el CV para empezar desde cero?')) {
          clearDocument();
        }
      });
    }

    // Exportar a JSON
    const btnExport = document.getElementById('btnExportJson');
    if (btnExport) {
      btnExport.addEventListener('click', exportToJson);
    }

    // Importar desde JSON
    const jsonFileInput = document.getElementById('jsonFileInput');
    const btnImport = document.getElementById('btnImportJson');
    if (btnImport && jsonFileInput) {
      btnImport.addEventListener('click', () => jsonFileInput.click());
      jsonFileInput.addEventListener('change', importFromJson);
    }

    // Imprimir / Exportar a PDF
    const btnPrint = document.getElementById('btnPrintPdf');
    if (btnPrint) {
      btnPrint.addEventListener('click', function () {
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

  function loadSampleData(withNotification = true) {
    cvDocument.innerHTML = SAMPLE_DATA.html;
    setTemplate(SAMPLE_DATA.template);
    setAccentColor(SAMPLE_DATA.accent, SAMPLE_DATA.accentLight);

    document.querySelectorAll('.pill-btn[data-template]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.template === SAMPLE_DATA.template);
    });
    document.querySelectorAll('.palette-swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.accent.toLowerCase() === SAMPLE_DATA.accent.toLowerCase());
    });

    triggerAutoSave();
    if (withNotification) {
      showToast('Datos de ejemplo cargados exitosamente');
    }
  }

  function clearDocument() {
    cvDocument.innerHTML = `
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
    triggerAutoSave();
    showToast('Documento en blanco listo para editar');
  }

  function exportToJson() {
    const currentTemplate = Array.from(cvDocument.classList).find(c => c.startsWith('template-')) || 'template-alpha00';
    const currentDensity = Array.from(cvDocument.classList).find(c => c.startsWith('density-')) || 'density-normal';
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--cv-accent').trim();
    const accentLight = getComputedStyle(document.documentElement).getPropertyValue('--cv-accent-light').trim();

    const data = {
      app: 'miVIT3',
      version: '2.1.0',
      exportedAt: new Date().toISOString(),
      template: currentTemplate,
      density: currentDensity,
      accent: accent,
      accentLight: accentLight,
      html: cvDocument.innerHTML
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

    showToast('Archivo JSON descargado exitosamente');
  }

  function importFromJson(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const data = JSON.parse(event.target.result);
        if (!data.html) {
          alert('El archivo seleccionado no tiene un formato válido de miVIT3.');
          return;
        }

        cvDocument.innerHTML = data.html;
        if (data.template) setTemplate(data.template);
        if (data.density) setDensity(data.density);
        if (data.accent && data.accentLight) setAccentColor(data.accent, data.accentLight);

        ensureDragHandles();
        updatePageBreakAndCapacity();
        triggerAutoSave();
        showToast('CV restaurado correctamente desde archivo');
      } catch (err) {
        alert('Error al leer el archivo JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  // =========================================================================
  // Atajos de Teclado Estilo Word
  // =========================================================================
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
          showToast('Guardado en el navegador');
          break;
        case 'p': // Imprimir / Exportar PDF
          e.preventDefault();
          window.print();
          break;
      }
    });
  }

  // =========================================================================
  // Utilidades (Toast, Debounce, Escapar HTML)
  // =========================================================================
  let toastTimeout = null;
  function showToast(message) {
    let toast = document.getElementById('toastNotification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotification';
      toast.className = 'toast-notification';
      toast.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span id="toastMsg"></span>
      `;
      document.body.appendChild(toast);
    }

    const toastMsg = document.getElementById('toastMsg');
    if (toastMsg) toastMsg.textContent = message;

    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Ejecutar al cargar el DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();