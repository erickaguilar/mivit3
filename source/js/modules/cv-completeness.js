/**
 * miVIT3 — Módulo de Scorecard y Checklist de Completitud del CV
 * Evalúa automáticamente la calidad estructural del currículum y guía al usuario para lograr un CV de impacto.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  function evaluateCompleteness() {
    const doc = document.getElementById('cv-document');
    const badgeText = document.getElementById('completenessPercentText');
    const badge = document.getElementById('completenessBadge');
    if (!doc || !badgeText) return;

    const checklist = [
      {
        id: 'name_role',
        label: 'Nombre completo y cargo profesional definidos',
        weight: 15,
        done: false
      },
      {
        id: 'contact',
        label: 'Datos de contacto esenciales (Email y Teléfono)',
        weight: 15,
        done: false
      },
      {
        id: 'summary',
        label: 'Perfil profesional claro (al menos 30 palabras)',
        weight: 20,
        done: false
      },
      {
        id: 'experience',
        label: 'Al menos 2 experiencias laborales con logros',
        weight: 25,
        done: false
      },
      {
        id: 'skills',
        label: 'Al menos 4 habilidades o competencias clave',
        weight: 15,
        done: false
      },
      {
        id: 'education',
        label: 'Formación académica o certificaciones añadidas',
        weight: 10,
        done: false
      }
    ];

    // 1. Nombre y Cargo
    const name = doc.querySelector('.cv-name');
    const role = doc.querySelector('.cv-role');
    if (name && role && name.innerText.trim().length > 3 && role.innerText.trim().length > 3) {
      checklist[0].done = true;
    }

    // 2. Contacto
    const contacts = doc.querySelectorAll('.cv-contact-item');
    let hasEmail = false;
    let hasPhone = false;
    contacts.forEach(c => {
      const txt = c.innerText.toLowerCase();
      if (txt.includes('@')) hasEmail = true;
      if (/\d{7,}/.test(txt.replace(/\D/g, ''))) hasPhone = true;
    });
    if (contacts.length >= 2 || (hasEmail && hasPhone)) {
      checklist[1].done = true;
    }

    // 3. Perfil Profesional
    const docText = doc.innerText || '';
    const words = docText.trim().split(/\s+/).length;
    // Buscar si hay párrafo o sección de perfil con al menos 25 palabras
    const firstP = doc.querySelector('.cv-section-body p, blockquote');
    if (firstP && firstP.innerText.trim().split(/\s+/).length >= 25) {
      checklist[2].done = true;
    } else if (words >= 150) {
      checklist[2].done = true;
    }

    // 4. Experiencia
    const expItems = doc.querySelectorAll('.cv-item');
    if (expItems.length >= 2) {
      checklist[3].done = true;
    }

    // 5. Habilidades
    const tags = doc.querySelectorAll('.cv-tag');
    if (tags.length >= 4) {
      checklist[4].done = true;
    }

    // 6. Educación o Certificaciones
    let hasEdu = false;
    const sections = doc.querySelectorAll('.cv-section-title');
    sections.forEach(s => {
      const st = s.innerText.toLowerCase();
      if (st.includes('educa') || st.includes('formaci') || st.includes('certifica')) {
        hasEdu = true;
      }
    });
    if (hasEdu || expItems.length >= 3) {
      checklist[5].done = true;
    }

    // Calcular puntaje total
    let totalScore = 0;
    checklist.forEach(item => {
      if (item.done) totalScore += item.weight;
    });

    badgeText.textContent = `${totalScore}% Listo`;

    if (badge) {
      badge.classList.remove('score-good', 'score-mid', 'score-low');
      if (totalScore >= 85) {
        badge.classList.add('score-good');
      } else if (totalScore >= 60) {
        badge.classList.add('score-mid');
      } else {
        badge.classList.add('score-low');
      }
      badge.title = `Nivel de completitud: ${totalScore}% · Clic para ver checklist de optimización`;
    }

    return { totalScore, checklist };
  }

  function showChecklistDialog() {
    const { totalScore, checklist } = evaluateCompleteness();

    let itemsHtml = '';
    checklist.forEach(item => {
      itemsHtml += `
        <div style="display:flex; align-items:flex-start; gap:10px; margin-bottom:10px; font-size:12.5px;">
          <span style="font-size:15px; line-height:1; color:${item.done ? '#22c55e' : '#f59e0b'};">
            ${item.done ? '✓' : '○'}
          </span>
          <div style="flex:1;">
            <div style="font-weight:${item.done ? '600' : '500'}; color:${item.done ? '#0f172a' : '#64748b'};">
              ${item.label}
            </div>
            <div style="font-size:11px; color:var(--text-light);">
              ${item.done ? `Completado (+${item.weight}%)` : `Pendiente (+${item.weight}%)`}
            </div>
          </div>
        </div>
      `;
    });

    const modalHtml = `
      <div id="completenessModal" class="symbol-modal-backdrop show">
        <div class="symbol-picker-card" style="max-width: 400px;">
          <div class="symbol-header">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Calidad y Completitud (${totalScore}%)
            </h3>
            <button type="button" class="symbol-close-btn" onclick="document.getElementById('completenessModal').remove()">✕</button>
          </div>
          <div class="symbol-body" style="padding: 16px 20px;">
            <p style="font-size:12px; color:var(--text-muted); margin-bottom:14px;">
              Este checklist evalúa los componentes clave que los reclutadores y sistemas ATS esperan encontrar en un CV competitivo:
            </p>
            ${itemsHtml}
          </div>
          <div class="symbol-footer">
            ${totalScore >= 85 ? '🎉 ¡Excelente! Tu CV cuenta con una estructura muy sólida.' : '💡 Completa los puntos marcados con ○ para maximizar tus posibilidades de entrevista.'}
          </div>
        </div>
      </div>
    `;

    const existing = document.getElementById('completenessModal');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.innerHTML = modalHtml;
    const modalEl = div.firstElementChild;
    document.body.appendChild(modalEl);

    modalEl.addEventListener('click', function (e) {
      if (e.target === modalEl) modalEl.remove();
    });

    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        modalEl.remove();
        document.removeEventListener('keydown', escHandler);
      }
    });
  }

  function setupCompleteness() {
    const badge = document.getElementById('completenessBadge');
    if (badge) {
      badge.addEventListener('click', function (e) {
        e.preventDefault();
        showChecklistDialog();
      });
    }

    const doc = document.getElementById('cv-document');
    if (doc) {
      const debouncedFn = window.debounce ? window.debounce(evaluateCompleteness, 300) : evaluateCompleteness;
      doc.addEventListener('input', debouncedFn);
      document.addEventListener('selectionchange', debouncedFn);
    }

    setTimeout(evaluateCompleteness, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCompleteness);
  } else {
    setupCompleteness();
  }

  window.miVit3.evaluateCompleteness = evaluateCompleteness;
})();
