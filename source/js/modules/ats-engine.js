/**
 * miVIT3 — Módulo del Motor Auditor ATS & Comparador de Vacante (Fase 2)
 * Puntuación algorítmica 0-100, fórmula STAR de logros cuantificables y matching de palabras clave.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

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


  // Exportar funciones
  window.setupAtsEngine = setupAtsEngine;
  window.openAtsDrawer = openAtsDrawer;
  window.closeAtsDrawer = closeAtsDrawer;
  window.auditCvForAts = auditCvForAts;
  window.auditKeywordsAgainstJob = auditKeywordsAgainstJob;
  window.debouncedAudit = debouncedAudit;

  window.miVit3.setupAtsEngine = setupAtsEngine;
  window.miVit3.openAtsDrawer = openAtsDrawer;
  window.miVit3.closeAtsDrawer = closeAtsDrawer;
  window.miVit3.auditCvForAts = auditCvForAts;
  window.miVit3.auditKeywordsAgainstJob = auditKeywordsAgainstJob;
  window.miVit3.debouncedAudit = debouncedAudit;

})();
