/**
 * miVIT3 — Controlador de Interfaz del Panel ATS (Drawer UI)
 * Renderizado de resultados, badges de puntuación y gestión de eventos del panel lateral.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  function getCvDocument() {
    return document.getElementById('cv-document');
  }

  function escapeHtml(str) {
    if (window.escapeHtml) return window.escapeHtml(str);
    if (window.miVit3 && window.miVit3.escapeHtml) return window.miVit3.escapeHtml(str);
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
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
    if (!cvDocument || !window.miVit3.atsScorer) return;

    const docText = (cvDocument.innerText || cvDocument.textContent || '').trim();
    const nameEl = cvDocument.querySelector('.cv-name');
    const name = nameEl ? nameEl.textContent.trim() : '';

    const contactItems = Array.from(cvDocument.querySelectorAll('.cv-contact-item')).map(item => ({
      text: item.textContent.trim()
    }));

    const sections = Array.from(cvDocument.querySelectorAll('.cv-section')).map(sec => ({
      type: sec.dataset.sectionType || '',
      title: (sec.querySelector('.cv-section-title') || {}).textContent || ''
    }));

    const result = window.miVit3.atsScorer.scoreResume({ docText, name, contactItems, sections });

    // 1. Checklist Contacto
    const contactChecklist = document.getElementById('atsContactChecklist');
    if (contactChecklist) {
      contactChecklist.innerHTML = `
        ${createCheckItemHtml(result.contact.hasName, 'Nombre completo', result.contact.hasName ? 'Visible y profesional' : 'Falta nombre o contiene texto de ejemplo')}
        ${createCheckItemHtml(result.contact.hasEmail, 'Correo electrónico', result.contact.hasEmail ? 'Formato de email válido detectado' : 'Falta dirección de correo electrónico')}
        ${createCheckItemHtml(result.contact.hasPhone, 'Teléfono de contacto', result.contact.hasPhone ? 'Número telefónico detectado' : 'Recomendado incluir número telefónico')}
        ${createCheckItemHtml(result.contact.hasLocationOrWeb, 'Ubicación / Perfil web', result.contact.hasLocationOrWeb ? 'Ciudad, enlace o portafolio incluido' : 'Sugerido indicar ciudad/país o LinkedIn')}
      `;
    }

    // 2. Checklist Secciones
    const sectionsChecklist = document.getElementById('atsSectionsChecklist');
    if (sectionsChecklist) {
      sectionsChecklist.innerHTML = `
        ${createCheckItemHtml(result.sections.hasProfile, 'Perfil Profesional', result.sections.hasProfile ? 'Presente y estructurado' : 'Se recomienda agregar un breve extracto/perfil')}
        ${createCheckItemHtml(result.sections.hasExperience, 'Experiencia Laboral', result.sections.hasExperience ? 'Historial profesional detectado' : 'Fundamental para cualquier filtro ATS')}
        ${createCheckItemHtml(result.sections.hasEducation, 'Formación / Estudios', result.sections.hasEducation ? 'Sección académica presente' : 'Falta registrar títulos o grados')}
        ${createCheckItemHtml(result.sections.hasSkills, 'Habilidades & Tecnologías', result.sections.hasSkills ? 'Competencias clave identificadas' : 'Crucial para el filtrado de palabras clave')}
      `;
    }

    // 3. Verbos de Acción
    const actionVerbsCount = document.getElementById('atsActionVerbsCount');
    const actionVerbsList = document.getElementById('atsActionVerbsList');
    if (actionVerbsCount) actionVerbsCount.textContent = result.star.foundVerbs.length;
    if (actionVerbsList) {
      if (result.star.foundVerbs.length === 0) {
        actionVerbsList.innerHTML = `<span class="ats-hint-text">No se detectaron verbos directos de alto impacto (ej: lideré, implementé, optimicé, diseñé).</span>`;
      } else {
        actionVerbsList.innerHTML = result.star.foundVerbs.slice(0, 16).map(v => `<span class="ats-tag-badge ats-tag-match">✓ ${escapeHtml(v)}</span>`).join('');
      }
    }

    // Métricas cuantificables
    const metricsCount = document.getElementById('atsMetricsCount');
    const metricsHint = document.getElementById('atsMetricsHint');
    if (metricsCount) metricsCount.textContent = result.star.metricMatches.length;
    if (metricsHint) {
      if (result.star.metricMatches.length >= 2) {
        metricsHint.textContent = `¡Excelente! Se detectaron ${result.star.metricMatches.length} métricas o cifras de impacto numérico.`;
        metricsHint.style.color = '#0f766e';
      } else if (result.star.metricMatches.length === 1) {
        metricsHint.textContent = 'Tienes 1 métrica numérica. Intenta sumar más resultados cuantitativos (%, $, tiempos).';
        metricsHint.style.color = '#b45309';
      } else {
        metricsHint.textContent = 'Procura que tus logros incluyan resultados numéricos (ej: "+30% rendimiento", "8 ingenieros").';
        metricsHint.style.color = '#64748b';
      }
    }

    // Frases pasivas
    const weakWordsCount = document.getElementById('atsWeakWordsCount');
    const weakWordsList = document.getElementById('atsWeakWordsList');
    if (weakWordsCount) weakWordsCount.textContent = result.star.foundWeak.length;
    if (weakWordsList) {
      if (result.star.foundWeak.length === 0) {
        weakWordsList.innerHTML = `<span class="ats-hint-text" style="color:#0f766e;">¡Excelente! Sin frases pasivas débiles o clichés detectados.</span>`;
      } else {
        weakWordsList.innerHTML = result.star.foundWeak.map(w => `<span class="ats-tag-badge ats-tag-weak">⚠ ${escapeHtml(w)}</span>`).join('');
      }
    }

    // 4. Extensión y Palabras
    const wordCount = result.length.wordCount;
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

    // 5. Puntaje Global
    const totalScore = result.totalScore;
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

    const atsScoreNumber = document.getElementById('atsScoreNumber');
    if (atsScoreNumber) atsScoreNumber.textContent = totalScore;

    const atsScoreCircle = document.getElementById('atsScoreCircle');
    if (atsScoreCircle) {
      atsScoreCircle.style.borderColor = totalScore >= 80 ? '#22c55e' : (totalScore >= 60 ? '#f59e0b' : '#ef4444');
    }

    const atsScoreTitle = document.getElementById('atsScoreTitle');
    const atsScoreDesc = document.getElementById('atsScoreDesc');
    if (atsScoreTitle && atsScoreDesc) {
      atsScoreTitle.textContent = result.diagnosisTitle;
      atsScoreDesc.textContent = result.diagnosisDesc;
    }
  }

  function runJobMatch() {
    const cvDocument = getCvDocument();
    const jobInput = document.getElementById('jobDescriptionInput');
    const resultsContainer = document.getElementById('jobMatchResults');
    if (!jobInput || !resultsContainer || !cvDocument || !window.miVit3.atsScorer) return;

    const rawJob = jobInput.value.trim();
    const docText = (cvDocument.innerText || cvDocument.textContent || '').trim();

    const matchData = window.miVit3.atsScorer.matchJobKeywords(docText, rawJob);
    if (!matchData) {
      resultsContainer.style.display = 'none';
      return;
    }

    resultsContainer.style.display = 'block';

    const matchRatePercent = document.getElementById('matchRatePercent');
    if (matchRatePercent) {
      matchRatePercent.textContent = `${matchData.matchRate}%`;
      matchRatePercent.style.color = matchData.matchRate >= 70 ? '#0f766e' : (matchData.matchRate >= 45 ? '#b45309' : '#dc2626');
    }

    const matchedKeywordsCount = document.getElementById('matchedKeywordsCount');
    if (matchedKeywordsCount) matchedKeywordsCount.textContent = matchData.matched.length;

    const matchedKeywordsList = document.getElementById('matchedKeywordsList');
    if (matchedKeywordsList) {
      if (matchData.matched.length === 0) {
        matchedKeywordsList.innerHTML = `<span class="ats-hint-text">Aún no hay coincidencias con los términos de la vacante.</span>`;
      } else {
        matchedKeywordsList.innerHTML = matchData.matched.map(k => `<span class="ats-tag-badge ats-tag-match">✓ ${escapeHtml(k)}</span>`).join('');
      }
    }

    const missingKeywordsCount = document.getElementById('missingKeywordsCount');
    if (missingKeywordsCount) missingKeywordsCount.textContent = matchData.missing.length;

    const missingKeywordsList = document.getElementById('missingKeywordsList');
    if (missingKeywordsList) {
      if (matchData.missing.length === 0) {
        missingKeywordsList.innerHTML = `<span class="ats-hint-text" style="color:#0f766e;">¡Excelente! Tu CV incluye todas las palabras clave prioritarias detectadas.</span>`;
      } else {
        missingKeywordsList.innerHTML = matchData.missing.map(k => `<span class="ats-tag-badge ats-tag-missing">+ ${escapeHtml(k)}</span>`).join('');
      }
    }
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

    const jobInput = document.getElementById('jobDescriptionInput');
    const debounceFn = window.debounce || ((fn) => fn);
    if (jobInput) {
      jobInput.addEventListener('input', debounceFn(runJobMatch, 250));
    }

    runAtsAudit();
    runJobMatch();
  }

  const debounceFn = window.debounce || ((fn) => fn);
  const debouncedAudit = debounceFn(function () {
    runAtsAudit();
    runJobMatch();
  }, 200);

  // Exportar funciones para compatibilidad
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
