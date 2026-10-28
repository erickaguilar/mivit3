/**
 * miVIT3 — Módulo de Exportación a Texto Plano ATS (Plain Text ATS Exporter)
 * Genera una versión en texto plano limpio y jerarquizado, listo para copiar y pegar en portales corporativos (Workday, Taleo, etc.).
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  function generatePlainTextCv() {
    const doc = document.getElementById('cv-document');
    if (!doc) return '';

    let out = [];

    // 1. Datos Personales / Cabecera
    const name = doc.querySelector('.cv-name') ? doc.querySelector('.cv-name').innerText.trim() : '';
    const role = doc.querySelector('.cv-role') ? doc.querySelector('.cv-role').innerText.trim() : '';

    if (name) out.push(name.toUpperCase());
    if (role) out.push(role);

    const contactItems = doc.querySelectorAll('.cv-contact-item');
    if (contactItems.length > 0) {
      const contacts = [];
      contactItems.forEach(item => {
        const txt = item.innerText.trim();
        if (txt) contacts.push(txt);
      });
      out.push(contacts.join(' | '));
    }

    out.push('\n' + '='.repeat(50) + '\n');

    // 2. Secciones del CV
    const sections = doc.querySelectorAll('.cv-section');
    sections.forEach(sec => {
      const titleEl = sec.querySelector('.cv-section-title');
      const title = titleEl ? titleEl.innerText.trim() : 'SECCIÓN';

      out.push(`\n=== ${title.toUpperCase()} ===\n`);

      // Elementos de experiencia / educación
      const items = sec.querySelectorAll('.cv-item');
      if (items.length > 0) {
        items.forEach(item => {
          const itemTitle = item.querySelector('.cv-item-title') ? item.querySelector('.cv-item-title').innerText.trim() : '';
          const subtitle = item.querySelector('.cv-item-subtitle') ? item.querySelector('.cv-item-subtitle').innerText.trim() : '';
          const date = item.querySelector('.cv-item-date') ? item.querySelector('.cv-item-date').innerText.trim() : '';
          const location = item.querySelector('.cv-item-location') ? item.querySelector('.cv-item-location').innerText.trim() : '';

          let headerLine = itemTitle;
          if (subtitle) headerLine += ` · ${subtitle}`;
          if (headerLine) out.push(headerLine);

          let metaLine = [];
          if (date) metaLine.push(date);
          if (location) metaLine.push(location);
          if (metaLine.length > 0) out.push(metaLine.join(' | '));

          const desc = item.querySelector('.cv-item-desc');
          if (desc) {
            const listItems = desc.querySelectorAll('li');
            if (listItems.length > 0) {
              listItems.forEach(li => {
                const liText = li.innerText.trim();
                if (liText) out.push(`  • ${liText}`);
              });
            } else {
              const descText = desc.innerText.trim();
              if (descText) out.push(`  ${descText}`);
            }
          }
          out.push('');
        });
      }

      // Habilidades / Tags
      const tags = sec.querySelectorAll('.cv-tag');
      if (tags.length > 0) {
        const skillList = [];
        tags.forEach(tag => {
          const t = tag.innerText.replace('✕', '').trim();
          if (t) skillList.push(t);
        });
        out.push(skillList.join(', '));
      }

      // Tablas
      const table = sec.querySelector('.cv-table');
      if (table) {
        const rows = table.querySelectorAll('tr');
        rows.forEach(r => {
          const cells = Array.from(r.querySelectorAll('th, td')).map(c => c.innerText.trim());
          out.push(cells.join(' | '));
        });
      }

      // Párrafos sueltos
      const standalonePs = sec.querySelectorAll('.cv-section-body > p, .cv-section-body > blockquote');
      standalonePs.forEach(p => {
        const pt = p.innerText.trim();
        if (pt) out.push(pt);
      });
    });

    return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  async function copyOrDownloadPlainText() {
    const text = generatePlainTextCv();
    if (!text) return;

    // 1. Intentar copiar al portapapeles
    let copied = false;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch (e) {
        copied = false;
      }
    }

    // 2. Descargar archivo .txt como respaldo
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const nameEl = document.querySelector('.cv-name');
    const safeName = nameEl ? nameEl.innerText.trim().replace(/\s+/g, '_') : 'Mi_Curriculum';
    link.download = `${safeName}_ATS_Plano.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    const toast = window.showToast || (window.miVit3 && window.miVit3.showToast);
    if (toast) {
      toast(copied
        ? '✓ CV copiado al portapapeles y descargado en formato .txt plano ATS.'
        : '✓ CV descargado en archivo .txt plano optimizado para ATS.');
    }
  }

  function setupPlainTextExporter() {
    const btn = document.getElementById('btnExportPlainText');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        // Cerrar dropdown
        document.querySelectorAll('.ribbon-dropdown.open').forEach(d => d.classList.remove('open'));
        copyOrDownloadPlainText();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPlainTextExporter);
  } else {
    setupPlainTextExporter();
  }

  window.miVit3.generatePlainTextCv = generatePlainTextCv;
  window.miVit3.copyOrDownloadPlainText = copyOrDownloadPlainText;
})();
