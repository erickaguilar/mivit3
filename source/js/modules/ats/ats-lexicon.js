/**
 * miVIT3 — Léxico y Diccionario Lingüístico ATS (Fase 2)
 * Listado de verbos de acción fuertes en español, patrones de frases pasivas y stopwords.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

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

  window.miVit3.atsLexicon = {
    STRONG_ACTION_VERBS,
    WEAK_WORDS_PATTERNS,
    SPANISH_STOPWORDS
  };

  // Exposición para compatibilidad
  window.STRONG_ACTION_VERBS = STRONG_ACTION_VERBS;
  window.WEAK_WORDS_PATTERNS = WEAK_WORDS_PATTERNS;
  window.SPANISH_STOPWORDS = SPANISH_STOPWORDS;

})();
