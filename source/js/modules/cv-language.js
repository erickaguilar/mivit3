/**
 * miVIT3 — Módulo de Traducción Rápida de Encabezados (CV Language Toggle)
 * Permite alternar instantáneamente entre Español e Inglés los encabezados estándar y metadatos del CV.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  let currentLang = 'ES'; // 'ES' o 'EN'

  const TRANSLATIONS = [
    // Secciones
    { es: 'Experiencia Laboral', en: 'Work Experience' },
    { es: 'Educación y Formación', en: 'Education & Training' },
    { es: 'Educación', en: 'Education' },
    { es: 'Habilidades y Competencias', en: 'Skills & Competencies' },
    { es: 'Habilidades', en: 'Skills' },
    { es: 'Extracto Profesional', en: 'Professional Summary' },
    { es: 'Perfil Profesional', en: 'Professional Profile' },
    { es: 'Proyectos Destacados', en: 'Key Projects' },
    { es: 'Proyectos', en: 'Projects' },
    { es: 'Certificaciones', en: 'Certifications' },
    { es: 'Idiomas', en: 'Languages' },

    // Metadatos y fechas
    { es: 'Presente', en: 'Present' },
    { es: 'Ciudad, País', en: 'City, Country' },
    { es: 'Puesto o Cargo', en: 'Job Title / Role' },
    { es: 'Nombre de la Empresa', en: 'Company Name' },
    { es: 'Institución Educativa', en: 'Institution' },
    { es: 'Título o Carrera', en: 'Degree or Field' }
  ];

  function toggleLanguage() {
    const doc = document.getElementById('cv-document');
    if (!doc) return;

    const toEn = (currentLang === 'ES');
    currentLang = toEn ? 'EN' : 'ES';

    // Actualizar indicador visual en el botón
    const flagEl = document.getElementById('cvLangFlag');
    const codeEl = document.getElementById('cvLangCode');
    if (flagEl) flagEl.textContent = toEn ? '🇺🇸' : '🇪🇸';
    if (codeEl) codeEl.textContent = currentLang;

    // Traducir títulos de sección y campos estándar
    const walker = document.createTreeWalker(doc, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const textNodes = [];
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    textNodes.forEach(textNode => {
      let val = textNode.nodeValue;
      if (!val) return;

      TRANSLATIONS.forEach(pair => {
        const from = toEn ? pair.es : pair.en;
        const to = toEn ? pair.en : pair.es;

        if (val.includes(from)) {
          val = val.split(from).join(to);
        }
      });

      textNode.nodeValue = val;
    });

    if (typeof window.triggerAutoSave === 'function') {
      window.triggerAutoSave();
    } else if (window.miVit3 && typeof window.miVit3.triggerAutoSave === 'function') {
      window.miVit3.triggerAutoSave();
    }

    const toast = window.showToast || (window.miVit3 && window.miVit3.showToast);
    if (toast) {
      toast(toEn
        ? '🇺🇸 Encabezados y fechas traducidos a Inglés.'
        : '🇪🇸 Encabezados y fechas traducidos a Español.');
    }
  }

  function setupLanguage() {
    const btn = document.getElementById('btnToggleLanguage');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        toggleLanguage();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLanguage);
  } else {
    setupLanguage();
  }

  window.miVit3.toggleLanguage = toggleLanguage;
})();
