/**
 * miVIT3 — Generador de Plantilla de Portafolio Web (Fase 4)
 * Genera el documento HTML5 autónomo, responsivo, con dark mode, SEO semántico y cero dependencias.
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

  /**
   * Construye el documento HTML completo del portafolio web personal
   */
  function generateWebPortfolioHtml({
    personName = 'Mi Currículum',
    personRole = 'Profesional',
    avatarSrc = '',
    accent = '#6400c8',
    accentLight = '#f3e8ff',
    contactLinks = [],
    sectionsHtml = ''
  }) {
    return `<!DOCTYPE html>
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
    a.contact-link:hover {
      color: var(--accent);
    }
    .contact-link svg {
      stroke: var(--accent);
      flex-shrink: 0;
    }
    .web-section {
      margin-bottom: 32px;
    }
    .web-section:last-child {
      margin-bottom: 0;
    }
    .web-section-title {
      font-size: 16px;
      font-weight: 800;
      color: var(--text);
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 2px solid var(--accent);
      padding-bottom: 6px;
      margin-bottom: 18px;
    }
    .web-item {
      margin-bottom: 20px;
    }
    .web-item:last-child {
      margin-bottom: 0;
    }
    .web-item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 4px;
    }
    .web-item-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--text);
    }
    .web-item-subtitle {
      font-size: 14px;
      color: var(--accent);
      font-weight: 600;
    }
    .web-item-date {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 500;
    }
    .web-item-desc, .web-desc {
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.6;
    }
    .web-item-desc ul, .web-desc ul {
      padding-left: 20px;
      margin: 6px 0;
    }
    .web-item-desc li, .web-desc li {
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
      font-size: 12.5px;
      font-weight: 600;
      padding: 6px 14px;
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
  }

  // Exportar funciones
  window.miVit3.generateWebPortfolioHtml = generateWebPortfolioHtml;
  window.generateWebPortfolioHtml = generateWebPortfolioHtml;

})();
