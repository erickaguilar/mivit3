# Registro de Cambios (Changelog)

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/)
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
