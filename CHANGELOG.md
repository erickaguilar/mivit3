# Registro de Cambios (Changelog)

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/)
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.6.0] - 2026-10-25

### ✨ Añadido (Added)
- **Nuevas Plantillas de Alto Impacto para Búsqueda de Empleo**:
  - **🚀 Tech Minimalista (`template-tech`)**:
    - Inspirada en la estética contemporánea de Silicon Valley y empresas tecnológicas líderes (Meta, Stripe, Vercel).
    - Tipografía moderna basada en la pila del sistema (`system-ui`), avatar circular con halo sutil, barra indicadora de color de acento superior y datos de contacto organizados en cápsulas suaves (*chips*).
    - Títulos de sección con barra vertical de acento izquierda y badges de fecha redondeados (`cv-item-date`).
    - Etiquetas de habilidades (*skills*) estilizadas como insignias de tecnología con fondo suave y tipografía seminegrita de alta legibilidad para reclutadores técnicos y filtros ATS.
  - **💼 Ejecutivo Harvard (`template-executive`)**:
    - Diseñada para directores, gerentes, consultores, finanzas, legal y puestos de liderazgo senior.
    - Tipografía clásica serif de alta distinción (`Georgia / Merriweather`), cabecera centrada formal con avatar enmarcado, división de líneas finas de equilibrio y datos personales en versalitas.
    - Secciones con títulos en mayúsculas sobrias y subrayado de alto contraste. Formato cronológico clásico con viñetas elegantes.
  - **⏱️ Línea de Tiempo / Career Path (`template-timeline`)**:
    - Línea de progresión cronológica vertical con nodos circulares de acento (`::before`) que unen visualmente cada empleo y grado educativo.
    - Diseñada específicamente para capturar la atención en los primeros 6 segundos de escaneo del reclutador, evidenciando estabilidad, promociones y crecimiento profesional constante.
    - Cabecera en tarjeta contemporánea y etiquetas de habilidades con borde de acento.
  - **📐 Nordic Clean (`template-nordic`)**:
    - Estética minimalista suizo-escandinava de alto contraste, inspirada en diseño de producto digital (Figma, Linear).
    - Cabecera asimétrica de gran impacto visual con nombre en tipografía grotesca negra de 30px, metadatos en fuente monoespaciada moderna (`ui-monospace`) y prefijo de barra doble `// ` en los títulos de sección.
    - Etiquetas de competencias en cápsulas monocromáticas con micro-interacción al pasar el cursor.
- **Nuevo Selector de Plantillas tipo Menú Lista (Dropdown Menu List)**:
  - Eliminación de números redundantes (00, 01...) e iconos/emojis para lograr un diseño sobrio, formal y minimalista.
  - Transformación del selector en un menú desplegable compacto (`.template-dropdown`) que muestra el nombre de la plantilla activa y se despliega al hacer clic.
  - Opciones organizadas en dos categorías limpias: *Alto Impacto Laboral* y *Clásicas y Estructuradas*, con indicador de selección activa (✓).
  - Soporte de accesibilidad con cierre automático al hacer clic fuera o presionar la tecla `Escape`.
- **Configuración y Soporte para Despliegue en Vercel**:
  - Incorporación de [`vercel.json`](file:///home/erickaguilar/Documentos/mivit3/vercel.json) con directivas `cleanUrls: true`, reglas de seguridad (`X-Frame-Options`, `X-Content-Type-Options`) y cabeceras `Cache-Control` calibradas para invalidación inmediata de `sw.js` y `manifest.webmanifest`.
  - Integración de opción Vercel en el modal de publicación web (`publishModal`).
  - Documentación de despliegue mediante GitHub y Vercel CLI (`npx vercel`) con botón 1-click deploy en el README.

---

## [2.5.0] - 2026-10-25

### 🏗️ Arquitectura & Refactorización Modular (Refactor)
- **Separación de Documentos Monolíticos por Funcionalidades (HTML, JS, CSS)**:
  - **Modularización CSS (`source/css/modules/`)**:
    - División del archivo monolítico `style.css` (~2,110 líneas) en 9 módulos temáticos independientes:
      - `variables.css`: Propiedades personalizadas, tokens de diseño y reset base.
      - `header.css`: Barra de cabecera, marca, acciones principales y estado de autoguardado.
      - `toolbar.css`: Barra de herramientas estilo Word, tipografías, selector de colores y configuración.
      - `desk.css`: Lienzo de trabajo A4, medición y guías dinámicas de corte de página.
      - `cv-sections.css`: Estructura común de bloques, asas de arrastre, cabecera de perfil y tags.
      - `templates.css`: Definición y estilos de las 4 plantillas Alpha (00, 01, 02, 03) y densidades.
      - `ats-drawer.css`: Panel lateral deslizable del auditor ATS y comparador de vacantes.
      - `dialogs.css`: Modales de tips, alertas/confirmaciones personalizadas y notificaciones toast.
      - `print.css`: Estilos de optimización para impresión y exportación a PDF (`@media print`).
    - `source/css/style.css` actúa como agregador maestro mediante `@import` nativo de Vanilla CSS.
  - **Modularización JavaScript (`source/js/modules/`)**:
    - División del archivo monolítico `script.js` (~2,370 líneas) en 10 módulos funcionales independientes:
      - `dialogs.js`: Sistema de modales, alertas asíncronas, confirmaciones, prompts y notificaciones toast.
      - `sample-data.js`: Objeto de datos de currículum profesional de ejemplo.
      - `toolbar.js`: Formateo de texto enriquecido, comandos Word, atajos de teclado y carga de avatar.
      - `templates.js`: Conmutador dinámico de plantillas y esquemas de color de acento.
      - `pagination.js`: Medición geométrica A4 en tiempo real, observador de redimensionamiento y densidades.
      - `drag-drop.js`: Motor de arrastrar y soltar HTML5 para secciones e ítems individuales.
      - `ats-engine.js`: Auditor de puntaje ATS, detector de verbos de acción, fórmula STAR y comparador de vacantes.
      - `storage.js`: Persistencia local continua (LocalStorage), respaldos y restauración JSON.
      - `web-exporter.js`: Generador de portafolio web autónomo autocontenido (`cv-web.html`).
      - `pwa.js`: Registro de Service Worker para funcionamiento sin conexión.
    - Nuevo archivo orquestador principal `source/js/app.js` que coordina los ciclos de vida e inicialización.
    - Mantenimiento de `source/js/script.js` como paquete consolidado para máxima compatibilidad retrospectiva.
  - **Separación Semántica de Plantillas HTML (`<template>`)**:
    - Extracción de las estructuras HTML que antes estaban embebidas en cadenas de JavaScript dentro de `index.html` mediante etiquetas `<template>` nativas:
      - `#tpl-experience-item`: Estructura para nuevos puestos de trabajo.
      - `#tpl-education-item`: Estructura para nuevos grados académicos.
      - `#tpl-skill-tag`: Estructura para etiquetas de competencias.
      - `#tpl-custom-section`: Estructura base para secciones personalizadas.
    - Los métodos de adición ahora clonan los nodos del DOM (`cloneNode(true)`), permitiendo editar el marcado de elementos directamente en HTML sin tocar código JavaScript.
  - **Actualización de Service Worker PWA (`sw.js`)**:
    - Actualización de la caché a `mivit3-cache-v2.5.0` incluyendo todos los nuevos módulos CSS y JS para soporte offline completo.

---

## [2.4.0] - 2026-10-25

### ✨ Añadido (Added)
- **Sistema de Alertas, Confirmaciones y Prompts Personalizados**:
  - Reemplazo total de los diálogos nativos del navegador (`alert`, `confirm`, `prompt`) por un sistema modal personalizado basado en `Promise` y 100% Vanilla JS.
  - Diseño visual integrado con la interfaz: tarjeta flotante con sombras suaves, telón de desenfoque (`backdrop-filter`), animaciones fluidas y cuatro estados temáticos (*información, éxito, advertencia y peligro*).
  - Diálogos interactivos con soporte de teclado accesible: tecla `Enter` para confirmar y tecla `Escape` para cancelar o cerrar.
  - Campos de entrada con auto-enfoque y selección de texto en los diálogos de tipo *prompt* (ej. añadir secciones o insertar enlaces web con preservación del rango seleccionado).
  - Notificaciones *toast* mejoradas con iconos de verificación e indicación contextual.
  - API pública expuesta en `window.miVit3.alert()`, `window.miVit3.confirm()` y `window.miVit3.prompt()`.

---

## [2.3.0] - 2026-10-25

### ✨ Añadido (Added)
- **Fase 3 de Evolución — Exportación como Portafolio Web Interactivo & PWA Offline**:
  - **Exportador a "Mini-Web" Autocontenida (`cv-web.html`):** Generación automática en el navegador de un sitio web de portafolio personal independiente, 100% responsivo y sin dependencias externas, listo para hospedar o enviar a reclutadores.
  - **Modo Oscuro / Claro en el Portafolio Web:** Soporte nativo para preferencia de tema del sistema operativo (`prefers-color-scheme`) y botón conmutador de tema interactivo con persistencia local.
  - **Barra de Acciones en la Web Generada:** Botones rápidos para impresión o guardado directo a PDF (`window.print()`), envío de correo directo (`mailto:`), llamada (`tel:`) y enlaces sociales.
  - **Modal de Guía de Publicación Gratuita:** Diálogo interactivo con guías paso a paso para publicar el portafolio en 2 minutos con Netlify Drop (arrastrar y soltar), GitHub Pages o adjunto directo.
  - **Soporte PWA (Progressive Web App):**
    - Manifiesto de aplicación web `manifest.webmanifest` con metadatos para instalación en dispositivos de escritorio y móviles.
    - Icono de aplicación PWA vectorial de alta definición (`source/img/icon-pwa.svg`).
    - Service Worker (`sw.js`) con almacenamiento en caché estratégico para soporte de edición y navegación 100% offline.

---

## [2.2.0] - 2026-10-25

### ✨ Añadido (Added)
- **Fase 2 de Evolución — Auditor ATS, Analizador STAR & Comparador de Vacante**:
  - **Auditor ATS en Tiempo Real con Puntaje (0-100):** Algoritmo heurístico client-side que califica la estructura del currículum, legibilidad y compatibilidad con sistemas de seguimiento de candidatos de RRHH.
  - **Insignia Dinámica en Header:** Botón con indicador visual de puntaje ATS en tiempo real en la cabecera superior con código de color dinámico (verde para ≥80, ámbar para 60-79, rojo para <60).
  - **Panel Lateral Desplegable (Drawer Panel):** Interfaz deslizable con desenfoque de fondo (`backdrop-filter`) y navegación por pestañas (*Diagnóstico del CV* y *Comparador de Vacante*).
  - **Verificación de Datos de Contacto y Secciones Fundamentales:** Validación automática de nombre completo, correo electrónico, teléfono, ubicación y presencia de secciones clave (*Perfil, Experiencia, Educación, Habilidades*).
  - **Analizador de Impacto de Redacción (Fórmula STAR):**
    - Detección de verbos de acción fuertes en español (*lideré, optimicé, implementé, diseñé, coordiné, automaticé, etc.*).
    - Identificación y alerta de frases pasivas débiles o clichés (*responsable de, encargado de, ayudé en, tareas de*).
    - Detección de métricas numéricas cuantificables (*%, $, multiplicadores y números de impacto*).
  - **Diagnóstico de Extensión y Densidad:** Conteo de palabras en tiempo real con barra de avance calibrada para el rango óptimo de 1 página (350 a 650 palabras).
  - **Comparador de Vacantes (Job Description Keyword Matcher):** Analizador de coincidencia de palabras clave que extrae los términos relevantes de cualquier oferta de empleo pegada por el usuario, calcula el porcentaje de compatibilidad y sugiere las palabras clave faltantes a incorporar.

---

## [2.1.0] - 2026-10-25

### ✨ Añadido (Added)
- **Fase 1 de Evolución — Paginación A4, Densidad & Drag and Drop**:
  - **Paginación Dinámica A4 en Vivo:** Medidor continuo de altura del documento respecto a la proporción estándar A4 (210mm × 297mm), con indicador de páginas y porcentaje de capacidad ocupada en la barra de herramientas.
  - **Líneas de Corte Visuales:** Guía punteada en rojo (`.page-break-guide`) que marca el final exacto de la primera página A4 y páginas subsecuentes.
  - **Control de Densidad del Documento:** Selector de espaciado con tres modos (*Compacto*, *Normal* y *Espacioso*) que ajusta márgenes, interlineado y paddings mediante variables CSS.
  - **Alerta Inteligente de Desbordamiento:** Si el contenido excede una página entre el 101% y 115%, aparece una sugerencia con botón de ajuste automático en un clic a modo Compacto.
  - **Reordenamiento Modular (Drag & Drop):** Tiradores de arrastre (`drag-handle`) para reordenar secciones completas y elementos de experiencia/educación de forma intuitiva con HTML5 nativo y autoguardado.

---

## [2.0.0] - 2026-10-25

### ✨ Añadido (Added)
- **Editor de Currículum Vitae interactivo tipo Microsoft Word**:
  - Lienzo de documento A4 con márgenes, proporciones y sombra realista de hoja de papel.
  - Edición en línea directa (*WYSIWYG*) mediante `contenteditable` y APIs nativas del DOM.
  - Barra de herramientas superior (*Word Ribbon Toolbar*) con formato de texto enriquecido:
    - Selección de familias tipográficas (*Sans-Serif, Georgia, Times New Roman, Arial, Courier*).
    - Selector de tamaños de fuente (11px a 28px) y estilos de bloque (Normal, H1, H2, H3).
    - Negrita, Cursiva, Subrayado y Tachado.
    - Selector de color de texto y color de resaltador/fondo con previsualización en la barra.
    - Alineación (izquierda, centrado, derecha, justificado).
    - Listas con viñetas y listas numeradas.
    - Inserción de enlaces web y líneas divisorias horizontales.
    - Acciones de Deshacer (`undo`) y Rehacer (`redo`).
- **4 Plantillas visuales intercambiables al instante (Basadas en `alpha/`)**:
  - `template-alpha00` (00 Bicolor): Franja oscura superior, doble línea de acento bicolor en contraste, avatar superpuesto y títulos en versalitas.
  - `template-alpha01` (01 Columnas ATS): Títulos con barra sólida en color de acento y estructura en 2 columnas cronológicas (*fechas a la izquierda, cargo y logros a la derecha*).
  - `template-alpha02` (02 Banner Credencial): Banner superior de acento con borde inferior grueso, avatar enmarcado a la izquierda y datos personales dentro del banner.
  - `template-alpha03` (03 Monograma Editorial): Insignia cuadrada con monograma en esquina superior (`CV`), nombre tipográfico a 32px+ y títulos en rail lateral.
- **Selector de Paletas de Color de Acento** (Púrpura miVIT3, Azul Ejecutivo, Verde Esmeralda, Grafito Oscuro y Borgoña).
- **Gestor de Fotografía de Perfil** con previsualización en vivo mediante `FileReader` nativo (sin envío al servidor).
- **Gestión dinámica de secciones**:
  - Botones para añadir y eliminar empleos y estudios.
  - Inserción y eliminación de etiquetas de habilidades e idiomas.
  - Creación de secciones personalizadas (Proyectos, Certificaciones, etc.).
- **Sistema de persistencia**:
  - Autoguardado debounced en `localStorage` con indicador visual de estado.
  - Exportación de la estructura del CV a archivo `.json` descargable.
  - Importación y restauración de respaldo desde archivo `.json`.
  - Botón para rellenar con datos de ejemplo profesionales o iniciar en blanco.
- **Reglas de impresión avanzadas (`@media print`)**:
  - Ocultación automática de la barra de herramientas, controles y elementos UI.
  - Ajuste exacto al tamaño de página A4 para exportar a PDF vectorial con `window.print()`.
- **Atajos de teclado estilo procesador de texto** (`Ctrl+B`, `Ctrl+I`, `Ctrl+U`, `Ctrl+S`, `Ctrl+P`, `Ctrl+Z`, `Ctrl+Y`).
- **Modal de Consejos y Mejores Prácticas (Tips)** para redacción de CV y método STAR.
- **Iconos vectoriales en formato SVG**:
  - `menu.svg`, `tips.svg`, `mivit3.svg`, `home.svg`, `one.svg`, `two.svg`, `three.svg` y `user.svg`.
  - Iconos SVG en línea integrados en la barra de herramientas y botones de acción.
- **Documentación oficial del proyecto**:
  - `README.md` detallado con descripción, características, tecnologías y guía de uso.
  - `CHANGELOG.md` estructurado.

### 🔄 Modificado (Changed)
- Migración arquitectónica completa de jQuery / Bootstrap 3 a **100% Vanilla JavaScript (ES6+) y CSS3 nativo**.
- Modernización de `source/css/style.css` utilizando variables CSS (`custom properties`), Flexbox y CSS Grid.
- Actualización de las plantillas históricas en `alpha/` para vincular los nuevos recursos SVG.

### 🗑️ Eliminado (Removed)
- Eliminada por completo la dependencia de **jQuery** (`jquery.min.js`, `jquery-ui.min.js`, `jquery-ui.min.css`).
- Eliminados plugins dependientes de jQuery: `material.js`, `material.min.js`, `ripples.js`, `ripples.min.js` y hojas de estilo asociadas.
- Eliminada carpeta obsoleta de `alpha/source/angular-xeditable-v0.1.8`.
- Eliminados todos los archivos de imagen en formato **PNG** y **JPG** del proyecto:
  - `source/img/` (`38.jpg`, `39.jpg`, `40.jpg`, `Bone.png`, `Btwo.png`, `Bthree.png`, `home.png`, `homeWhite.png`, `menu.png`, `menuWhite.png`, `mivit3.png`, `mivit3White.png`, `one.png`, `two.png`, `three.png`, `tips.png`, `tipsWhite.png`).
  - `alpha/source/img/` (`Sin título1.png`, `boy-128.png`, `perfil.png`, `user-128.png`, `user.png`, `user_copia.png`).

---

## [1.0.0] - 2015-05-14

### ✨ Añadido (Added)
- Creación inicial del proyecto **miVIT3** ("curriculum vía web").
- Landing page inicial con carrusel y secciones informativas ("escoge, edita, envia").
- Primeros prototipos de plantillas de CV en el directorio `alpha/` (`00`, `01`, `02`, `03`).
- Integración experimental con librerías Bootstrap 3, jQuery UI y Material Design ripples.
