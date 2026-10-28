/**
 * miVIT3 — Módulo de Exportación a Portafolio Web (Fase 4)
 * Extrae los datos semánticos del CV, invoca el generador de plantilla desacoplado y gestiona la descarga y vista previa.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  function escapeHtml(str) {
    if (window.escapeHtml) return window.escapeHtml(str);
    if (window.miVit3 && window.miVit3.escapeHtml) return window.miVit3.escapeHtml(str);
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function cleanHtmlContent(raw) {
    const temp = document.createElement('div');
    temp.innerHTML = raw;
    temp.querySelectorAll('.section-actions, .item-actions, .drag-handle, .cv-tag-del').forEach(el => el.remove());
    temp.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
    return temp.innerHTML;
  }

  function buildWebPortfolioHtml() {
    const cvDocument = document.getElementById('cv-document');
    if (!cvDocument) return null;

    // 1. Datos Personales
    const nameEl = cvDocument.querySelector('.cv-name');
    const personName = (nameEl ? nameEl.textContent.trim() : '') || 'Mi Currículum';

    const roleEl = cvDocument.querySelector('.cv-role');
    const personRole = (roleEl ? roleEl.textContent.trim() : '') || 'Profesional';

    const DEFAULT_AVATAR_DATA_URI = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128" fill="none"><circle cx="64" cy="64" r="62" fill="%23F1F5F9" stroke="%23CBD5E1" stroke-width="2"/><circle cx="64" cy="48" r="22" fill="%2364748B"/><path d="M26 108c4-22 20-34 38-34s34 12 38 34" fill="%2364748B"/></svg>';

    const avatarEl = cvDocument.querySelector('#cvAvatar');
    let avatarSrc = (avatarEl ? avatarEl.getAttribute('src') || avatarEl.src : '').trim();
    if (!avatarSrc || avatarSrc.includes('user.svg') || (!avatarSrc.startsWith('data:image/') && !avatarSrc.startsWith('http://') && !avatarSrc.startsWith('https://'))) {
      avatarSrc = DEFAULT_AVATAR_DATA_URI;
    }

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
        // Habilidades
        const tags = Array.from(tagsWrap.querySelectorAll('.cv-tag')).map(t => {
          const editable = t.querySelector('[contenteditable]') || t;
          return editable.textContent.replace('✕', '').trim();
        }).filter(t => t.length > 0);

        bodyHtml = `<div class="skills-grid">${tags.map(t => `<span class="skill-badge">${escapeHtml(t)}</span>`).join('')}</div>`;
      } else if (items.length > 0) {
        // Elementos estructurados
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
        // Texto general
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

    // 4. Invocar generador de plantilla desacoplado
    const generateFn = (window.miVit3 && window.miVit3.generateWebPortfolioHtml) || window.generateWebPortfolioHtml;
    if (!generateFn) {
      console.error('El generador de plantilla web no está cargado');
      return null;
    }

    const htmlOutput = generateFn({
      personName,
      personRole,
      avatarSrc,
      accent,
      accentLight,
      contactLinks,
      sectionsHtml
    });

    return { htmlOutput, personName };
  }

  function exportToWebHtml() {
    const data = buildWebPortfolioHtml();
    if (!data) return;

    // Descargar archivo cv-web.html
    const blob = new Blob([data.htmlOutput], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const slug = data.personName.toLowerCase().replace(/[^a-záéíóúüñ0-9]+/g, '-').replace(/^-|-$/g, '') || 'cv';
    a.href = url;
    a.download = `cv-web-${slug}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.showToast) {
      window.showToast('Portafolio web (cv-web.html) descargado');
    }

    // Mostrar modal con guía de publicación si aún no está abierto
    const modalPublish = document.getElementById('publishModal');
    if (modalPublish) {
      setTimeout(() => {
        modalPublish.classList.add('show');
      }, 700);
    }
  }

  function previewWebPortfolioInTab() {
    const data = buildWebPortfolioHtml();
    if (!data) return;

    const blob = new Blob([data.htmlOutput], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');

    if (window.showToast) {
      window.showToast('Vista previa abierta en una nueva pestaña');
    }
  }

  // Inicialización de escuchadores al cargar el DOM
  document.addEventListener('DOMContentLoaded', function () {
    const btnPreviewWebTab = document.getElementById('btnPreviewWebTab');
    if (btnPreviewWebTab) {
      btnPreviewWebTab.addEventListener('click', previewWebPortfolioInTab);
    }
  });

  // Exportar funciones
  window.buildWebPortfolioHtml = buildWebPortfolioHtml;
  window.exportToWebHtml = exportToWebHtml;
  window.previewWebPortfolioInTab = previewWebPortfolioInTab;
  window.miVit3.buildWebPortfolioHtml = buildWebPortfolioHtml;
  window.miVit3.exportToWebHtml = exportToWebHtml;
  window.miVit3.previewWebPortfolioInTab = previewWebPortfolioInTab;

})();
