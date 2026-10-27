/**
 * miVIT3 — Motor Algorítmico y Scoring ATS (Fase 2)
 * Cálculo matemático puro de puntuación (0-100), impacto STAR y coincidencia con vacantes.
 * Totalmente desacoplado del DOM para permitir pruebas y ejecución independiente.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  function getLexicon() {
    return window.miVit3.atsLexicon || {
      STRONG_ACTION_VERBS: window.STRONG_ACTION_VERBS || [],
      WEAK_WORDS_PATTERNS: window.WEAK_WORDS_PATTERNS || [],
      SPANISH_STOPWORDS: window.SPANISH_STOPWORDS || new Set()
    };
  }

  /**
   * Evalúa el contenido del currículum y retorna un objeto estructurado de diagnóstico
   */
  function scoreResume({ docText = '', name = '', contactItems = [], sections = [] }) {
    const lexicon = getLexicon();
    const lowerDoc = (docText || '').toLowerCase();

    // 1. Datos de Contacto Clave
    const hasName = Boolean(name && name.trim().length >= 3 && !name.includes('Tu Nombre'));
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const hasEmail = emailRegex.test(docText);
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/;
    const hasPhone = phoneRegex.test(docText);
    const hasLocationOrWeb = contactItems.some(item => {
      const txt = (typeof item === 'string' ? item : (item.text || '')).trim().toLowerCase();
      return txt.length > 3 && !txt.includes('correo@') && !phoneRegex.test(txt);
    });

    // 2. Secciones Fundamentales
    const hasProfile = sections.some(s => s.type === 'profile' || /perfil|resumen|objetivo|sobre m[ií]|profile|summary/i.test(s.title || ''));
    const hasExperience = sections.some(s => s.type === 'experience' || /experiencia|laboral|empleo|trayectoria|historial|experience|work/i.test(s.title || ''));
    const hasEducation = sections.some(s => s.type === 'education' || /educaci[oó]n|estudios|formaci[oó]n|acad[eé]mic|education/i.test(s.title || ''));
    const hasSkills = sections.some(s => s.type === 'skills' || /habilidad|competencia|tecnolog|skills|stack|herramientas/i.test(s.title || ''));

    // 3. Verbos STAR y Cuantificadores
    const foundVerbs = [];
    for (const verb of lexicon.STRONG_ACTION_VERBS) {
      const rx = new RegExp(`\\b${verb}\\b`, 'i');
      if (rx.test(lowerDoc) && !foundVerbs.includes(verb)) {
        foundVerbs.push(verb);
      }
    }

    const metricRegex = /(\b\d+[\.,]?\d*\s*%|\$\s*\d+[\.,]?\d*|\b\d+\s*x\b|\b\d{2,}\b|\b\+\s*\d+|\b\d+\s*(?:usuarios|clientes|proyectos|ventas|visitas|descargas|equipos|horas|días|semanas|meses|años|empresas)\b)/gi;
    const metricMatches = docText.match(metricRegex) || [];

    const foundWeak = [];
    for (const item of lexicon.WEAK_WORDS_PATTERNS) {
      if (item.regex.test(lowerDoc) && !foundWeak.includes(item.phrase)) {
        foundWeak.push(item.phrase);
      }
    }

    // 4. Extensión y Palabras
    const words = docText.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    // 5. Cálculo del Puntaje Global (0-100)
    let contactScore = (hasName ? 5 : 0) + (hasEmail ? 5 : 0) + (hasPhone ? 5 : 0) + (hasLocationOrWeb ? 5 : 0);
    let sectionScore = (hasProfile ? 6 : 0) + (hasExperience ? 7 : 0) + (hasEducation ? 6 : 0) + (hasSkills ? 6 : 0);
    let verbScore = foundVerbs.length >= 5 ? 20 : (foundVerbs.length >= 3 ? 15 : (foundVerbs.length >= 1 ? 10 : 0));
    verbScore = Math.max(0, verbScore - (foundWeak.length * 2));
    let metricScore = metricMatches.length >= 3 ? 20 : (metricMatches.length === 2 ? 15 : (metricMatches.length === 1 ? 10 : 0));

    let densityScore = 2;
    if (wordCount >= 320 && wordCount <= 680) {
      densityScore = 15;
    } else if ((wordCount >= 240 && wordCount < 320) || (wordCount > 680 && wordCount <= 800)) {
      densityScore = 10;
    } else if ((wordCount >= 140 && wordCount < 240) || (wordCount > 800 && wordCount <= 1000)) {
      densityScore = 5;
    }

    const totalScore = Math.max(0, Math.min(100, contactScore + sectionScore + verbScore + metricScore + densityScore));

    let scoreLevel = 'bad';
    let diagnosisTitle = 'Optimización requerida';
    let diagnosisDesc = 'Faltan secciones esenciales o datos de contacto críticos para superar filtros ATS.';

    if (totalScore >= 80) {
      scoreLevel = 'excellent';
      diagnosisTitle = '¡Excelente optimización ATS!';
      diagnosisDesc = 'Estructura sólida, datos completos y alta probabilidad de superar filtros automáticos.';
    } else if (totalScore >= 60) {
      scoreLevel = 'good';
      diagnosisTitle = 'Buen nivel con oportunidades';
      diagnosisDesc = 'Bases correctas. Te recomendamos incorporar más resultados cuantificables y verbos de acción.';
    }

    return {
      totalScore,
      scoreLevel,
      diagnosisTitle,
      diagnosisDesc,
      contact: {
        hasName,
        hasEmail,
        hasPhone,
        hasLocationOrWeb,
        score: contactScore
      },
      sections: {
        hasProfile,
        hasExperience,
        hasEducation,
        hasSkills,
        score: sectionScore
      },
      star: {
        foundVerbs,
        metricMatches,
        foundWeak,
        verbScore,
        metricScore
      },
      length: {
        wordCount,
        densityScore
      }
    };
  }

  /**
   * Compara los términos clave de una vacante con el currículum
   */
  function matchJobKeywords(docText = '', rawJob = '') {
    const lexicon = getLexicon();
    if (!rawJob || !rawJob.trim()) {
      return null;
    }

    const lowerDoc = (docText || '').toLowerCase();

    // Extraer tokens válidos del texto de la vacante
    const words = rawJob.toLowerCase()
      .replace(/[^a-záéíóúüñ0-9+#.-]/gi, ' ')
      .split(/\s+/)
      .map(w => w.trim().replace(/^[-.]+|[-.]+$/g, ''))
      .filter(w => {
        if (!w || w.length < 2) return false;
        if (/^\d+$/.test(w)) return false;
        if (lexicon.SPANISH_STOPWORDS.has(w)) return false;
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
      return null;
    }

    const matched = [];
    const missing = [];

    for (const kw of sortedKeywords) {
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|[^a-záéíóúüñ0-9])${escaped}([^a-záéíóúüñ0-9]|$)`, 'i');
      if (regex.test(lowerDoc)) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    }

    const matchRate = Math.round((matched.length / sortedKeywords.length) * 100);

    return {
      sortedKeywords,
      matched,
      missing,
      matchRate
    };
  }

  window.miVit3.atsScorer = {
    scoreResume,
    matchJobKeywords
  };

})();
