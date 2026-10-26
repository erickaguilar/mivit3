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
