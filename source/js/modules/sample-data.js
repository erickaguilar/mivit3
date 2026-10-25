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
