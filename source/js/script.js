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
    }, 600);
  }

  function saveSettings() {
    const currentTemplate = Array.from(cvDocument.classList).find(c => c.startsWith('template-')) || 'template-moderna';
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--cv-accent').trim();
    const accentLight = getComputedStyle(document.documentElement).getPropertyValue('--cv-accent-light').trim();

    const settings = {
      template: currentTemplate,
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
          cvDocument.classList.remove('template-moderna', 'template-clasica', 'template-columnas', 'template-creativa');
          cvDocument.classList.add(settings.template);

          document.querySelectorAll('.pill-btn[data-template]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.template === settings.template);
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
    const currentTemplate = Array.from(cvDocument.classList).find(c => c.startsWith('template-')) || 'template-moderna';
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--cv-accent').trim();
    const accentLight = getComputedStyle(document.documentElement).getPropertyValue('--cv-accent-light').trim();

    const data = {
      app: 'miVIT3',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      template: currentTemplate,
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
        if (data.accent && data.accentLight) setAccentColor(data.accent, data.accentLight);

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