# miVIT3 — Editor de Currículum Vitae estilo Word

> **escoge · edita · envía**  
> Editor interactivo de Currículum Vitae en tiempo real con experiencia de procesador de texto (WYSIWYG tipo Microsoft Word), 100% Vanilla JavaScript, iconos SVG vectoriales y sin dependencias externas pesadas.

---

## 📋 Descripción

**miVIT3** es una herramienta web ligera, moderna y enfocada en la privacidad para crear y personalizar currículums profesionales directamente desde el navegador. Permite escribir, formatear y estructurar tu hoja de vida como si estuvieras en Microsoft Word o Google Docs, con soporte para cambio de plantillas al vuelo, selección de colores, subida de foto de perfil, autoguardado local y exportación a PDF de alta fidelidad sin marcas de agua.

---

## ✨ Características Principales

### ✍️ Procesador de Texto Estilo Word (Ribbon Toolbar)
- **Formato Tipográfico:** Selección de familias de fuentes (*Sans-Serif Moderno, Georgia Elegante, Times New Roman Clásico, Arial, Courier*), tamaños de fuente precisos (11px a 28px) y estilos de bloque (Normal, Título H1, Encabezado H2, Subtítulo H3).
- **Estilos de Carácter:** Negrita (**B**), Cursiva (*I*), Subrayado (<u>U</u>) y Tachado (<s>S</s>).
- **Colores y Resaltador:** Selector de color de texto personalizado y resaltador de fondo en tiempo real con vista previa en la barra.
- **Párrafos y Listas:** Alineación a la izquierda, centrada, derecha y justificada; listas con viñetas y listas numeradas.
- **Inserción y Utilidades:** Inserción de enlaces web, líneas divisorias horizontales, limpiador de formato y acciones Deshacer (`undo`) / Rehacer (`redo`).

### 📄 Lienzo A4 Realista y Edición Directa
- Visualización en hoja de papel estándar A4 (210mm × 297mm) con proporciones y sombras suaves.
- **Edición WYSIWYG directa:** Haz clic en cualquier texto del CV y edítalo inmediatamente sin formularios intermedios.
- Marcadores de posición inteligentes (`placeholder`) en campos vacíos.

### 🎨 8 Plantillas Profesionales Intercambiables

#### 🚀 Colección Moderna de Alto Impacto (Fase 4: Mercado Laboral Actual)
1. **Tech Minimalista (`template-tech`):** Inspirada en la cultura tecnológica de Silicon Valley (Stripe, Vercel). Pila tipográfica del sistema (`system-ui`), avatar circular con halo sutil, barra superior de acento, datos de contacto en cápsulas suaves (*chips*), títulos con barra vertical y etiquetas de habilidades tipo insignias tech optimizadas para ATS.
2. **Ejecutivo Harvard (`template-executive`):** Distinción formal para directores, finanzas, legal, consultoría y gerencia. Tipografía clásica serif (`Georgia / Merriweather`), cabecera centrada de alto impacto, divisiones sutiles y viñetas elegantes.
3. **Línea de Tiempo / Career Path (`template-timeline`):** Visualización cronológica vertical con nodos circulares de acento que conectan cada empleo y formación académica. Diseñada para capturar la atención del reclutador en los primeros 6 segundos mostrando estabilidad y ascensos continuos.
4. **Nordic Clean (`template-nordic`):** Estética minimalista suizo-escandinava de alto contraste, inspirada en diseño de producto digital. Tipografía grotesca con nombre en 30px, metadatos monoespaciados (`ui-monospace`), prefijo `// ` en secciones y etiquetas monocromáticas con micro-interacciones.

#### 🏛️ Colección Fundacional Alpha (Basadas en prototipos `alpha/`)
5. **00 Bicolor:** Encabezado con franja oscura superior, doble línea de acento inferior en contraste (rojo y naranja/acento), foto superpuesta con marco blanco y títulos de sección en versalitas (*small-caps*).
6. **01 Columnas ATS:** Títulos de sección con barra sólida de color de acento y estructura cronológica de 2 columnas (fechas y ubicación geográfica a la izquierda; cargo, empresa y viñetas a la derecha). Formato óptimo para filtros ATS.
7. **02 Banner Credencial:** Franja vibrante superior con borde inferior grueso, avatar enmarcado a la izquierda estilo tarjeta/credencial y datos personales integrados dentro del banner.
8. **03 Monograma Editorial:** Insignia o monograma cuadrado personalizable en la esquina superior (`CV`), nombre en gran formato tipográfico (32px+) y diagramación con títulos de sección en rail lateral derecho.

### 🌈 Paleta de Colores de Acento
- Púrpura miVIT3 (`#6400c8`)
- Azul Ejecutivo (`#1e40af`)
- Verde Esmeralda (`#0f766e`)
- Grafito Oscuro (`#334155`)
- Borgoña Elegante (`#881337`)

### 📏 Paginación Dinámica A4, Densidad & Drag and Drop (Fase 1)
- **Medidor de Altura de Página en Vivo:** Indicador en tiempo real de capacidad ocupada en hoja A4 (ej. `1 pág. (82%)`).
- **Guías de Corte Visuales:** Líneas punteadas (`.page-break-guide`) que señalan el final exacto de cada página para garantizar una exportación a PDF sin elementos cortados a la mitad.
- **Control de Densidad:** Modos *Compacto* (márgenes e interlineado estrechos), *Normal* y *Espacioso* para adaptar currículums extensos a una sola página.
- **Alerta de Desbordamiento con Ajuste Automático:** Notificación cuando el texto supera una página por poco (101%-115%), permitiendo ajustarlo a modo compacto con un solo clic.
- **Reordenamiento Modular (Drag & Drop):** Arrastra y suelta secciones completas o elementos individuales de empleo/educación para reordenarlos al instante.

### 🎯 Auditoría ATS en Tiempo Real & Comparador de Vacante (Fase 2)
- **Puntaje Global ATS (0 a 100):** Medición instantánea en la cabecera e interior del panel lateral con tarjeta diagnóstica visual.
- **Verificación de Datos Críticos:** Detección automática de nombre completo, correo con formato válido, teléfono y ubicación o enlaces a portafolio.
- **Secciones Fundamentales:** Validación de presencia de Perfil Profesional, Experiencia Laboral, Formación y Habilidades.
- **Impacto de Redacción (Fórmula STAR):**
  - Conteo y listado de verbos de acción fuertes en español (*lideré, optimicé, implementé, diseñé, coordiné, automaticé, etc.*).
  - Alerta de frases pasivas y clichés (*responsable de, encargado de, tareas de*).
  - Identificación de resultados numéricos cuantificables (*%, $, cifras numéricas*).
- **Control de Extensión:** Conteo de palabras en vivo calibrado para el rango recomendado de 1 página (350 - 650 palabras).
- **Comparador de Vacantes (Job Description Keyword Matcher):** Pega cualquier oferta laboral para calcular el porcentaje de coincidencia en tiempo real, visualizar palabras clave detectadas y recibir sugerencias de términos clave faltantes.

### 🌐 Exportación como Portafolio Web & PWA Offline (Fase 3)
- **Portafolio Web Autocontenido (`cv-web.html`):** Genera y descarga un sitio web personal en un solo archivo HTML (~25 KB) sin dependencias externas, completamente responsivo para smartphones y pantallas grandes.
- **Modo Oscuro / Claro en el Portafolio:** Detecta automáticamente el tema del sistema (`prefers-color-scheme`) y cuenta con conmutador manual interactivo con memoria.
- **Acciones Rápidas del Portafolio:** Botón para imprimir/PDF en 1 clic, envío de correo directo (`mailto:`) y enlaces automáticos a redes y teléfono.
- **Guía de Publicación Gratuita Integrada:** Modal con instrucciones paso a paso para publicar online gratis en menos de 2 minutos mediante Netlify Drop (arrastrar y soltar) o GitHub Pages con HTTPS.
- **Soporte PWA (Progressive Web App):** Instalable como aplicación nativa en Windows, macOS, Linux, Android e iOS con `manifest.webmanifest`, icono PWA vectorial y soporte de edición 100% offline con Service Worker (`sw.js`).

### 🔔 Sistema de Alertas y Diálogos Personalizados
- **Cero Diálogos Nativos Bloqueantes:** Todos los avisos, confirmaciones y preguntas de texto usan modales personalizados visualmente integrados, asíncronos y no invasivos.
- **Iconos Contextuales por Estado:** Indicadores visuales para *Información* (azul), *Éxito* (verde), *Advertencia* (ámbar) y *Peligro* (rojo).
- **Accesibilidad y Atajos de Teclado:** Confirmar con `Enter`, cancelar con `Escape` o clic en el telón de fondo.
- **Notificaciones Toast Dinámicas:** Mensajes flotantes temporales con retroalimentación inmediata de acciones.

### 🧩 Gestión Dinámica de Secciones
- Añade o elimina empleos y grados académicos con un solo clic.
- Agrega etiquetas interactivas de habilidades técnicas y blandas.
- Añade nuevas secciones personalizadas (ej. *Proyectos, Certificaciones, Publicaciones, Referencias*).

### 💾 Autoguardado & Respaldo JSON
- **Autoguardado en LocalStorage:** Cualquier cambio que realices se almacena automáticamente en el navegador para que nunca pierdas tu progreso.
- **Exportar e Importar JSON:** Descarga un archivo `.json` con tu CV completo para guardarlo en tu computadora o cargar distintas versiones cuando lo necesites.
- **Cargar Ejemplo / Limpiar:** Botón para rellenar el documento con un currículum profesional de muestra o iniciar desde una hoja en blanco.

### 🖨️ Exportación a PDF e Impresión Optimizada
- Reglas CSS avanzadas `@media print` que ocultan toda la interfaz de edición (barras, botones, indicadores) y ajustan la página al tamaño exacto de impresión.
- Compatible con el diálogo nativo del navegador (*Guardar como PDF* o impresión en papel físico).

### ⌨️ Atajos de Teclado
| Atajo | Acción |
| :--- | :--- |
| `Ctrl + B` / `Cmd + B` | Activar / desactivar Negrita |
| `Ctrl + I` / `Cmd + I` | Activar / desactivar Cursiva |
| `Ctrl + U` / `Cmd + U` | Activar / desactivar Subrayado |
| `Ctrl + S` / `Cmd + S` | Guardar respaldo manual en el navegador |
| `Ctrl + P` / `Cmd + P` | Imprimir / Guardar como PDF |
| `Ctrl + Z` / `Cmd + Z` | Deshacer |
| `Ctrl + Y` / `Cmd + Y` | Rehacer |

---

## 🛠️ Tecnologías Utilizadas

- **HTML5 Semántico:** Estructura accesible y modular.
- **CSS3 Moderno:** Variables CSS (`custom properties`), Flexbox, CSS Grid y optimizaciones de impresión `@media print`.
- **Vanilla JavaScript (ES6+):** Sin librerías externas, sin jQuery, sin Bootstrap JS.
- **Progressive Web App (PWA):** `ServiceWorker` para funcionamiento 100% offline y `Web App Manifest` para instalación en escritorio y móviles.
- **SVG Nativo:** Iconos vectoriales nítidos en cualquier pantalla, sin archivos PNG ni JPG.
- **Web Storage API (`localStorage`) & File API (`FileReader`):** Procesamiento de imágenes y datos localmente en el cliente.

---

## 📁 Estructura del Proyecto

```text
mivit3/
├── index.html              # Aplicación principal y editor estilo Word
├── manifest.webmanifest    # Manifiesto PWA para instalación de la app
├── sw.js                   # Service Worker para soporte offline
├── README.md               # Documentación general del proyecto
├── CHANGELOG.md            # Historial de cambios y versiones
├── source/
│   ├── css/
│   │   ├── normalize.css           # Reset estándar de estilos
│   │   ├── style.css               # Agregador maestro (@import de módulos)
│   │   └── modules/                # Módulos CSS separados por funcionalidad
│   │       ├── variables.css       # Tokens, variables CSS y reset base
│   │       ├── header.css          # Cabecera, marca, acciones y autoguardado
│   │       ├── toolbar.css         # Cinta de opciones Word, selectores y colores
│   │       ├── desk.css            # Lienzo A4, densidades y guías de corte
│   │       ├── cv-sections.css     # Estructura común, drag handles, perfil y tags
│   │       ├── templates.css       # 4 Plantillas Alpha (00, 01, 02, 03)
│   │       ├── ats-drawer.css      # Panel lateral de auditoría ATS
│   │       ├── dialogs.css         # Alertas, confirmaciones, modales y toasts
│   │       └── print.css           # Reglas de impresión y PDF (@media print)
│   ├── img/                        # Iconos vectoriales SVG (reemplazo de png/jpg)
│   │   ├── home.svg
│   │   ├── icon-pwa.svg            # Icono principal de la aplicación PWA
│   │   ├── menu.svg
│   │   ├── mivit3.svg
│   │   ├── one.svg
│   │   ├── two.svg
│   │   ├── three.svg
│   │   ├── tips.svg
│   │   └── user.svg
│   └── js/
│       ├── app.js                  # Orquestador principal e integración de <template>
│       ├── script.js               # Paquete compilado de compatibilidad retrospectiva
│       └── modules/                # Módulos JavaScript independientes
│           ├── dialogs.js          # Alertas asíncronas, confirm, prompt y toasts
│           ├── sample-data.js      # Datos iniciales profesionales de muestra
│           ├── toolbar.js          # Comandos Word, atajos de teclado y avatar
│           ├── templates.js        # Cambio de plantillas Alpha y paletas de color
│           ├── pagination.js       # Medición geométrica A4 y guías de página
│           ├── drag-drop.js        # Reordenamiento drag & drop de secciones e ítems
│           ├── ats-engine.js       # Auditor ATS, STAR method y keyword matcher
│           ├── storage.js          # Persistencia LocalStorage y respaldos JSON
│           ├── web-exporter.js     # Generador de mini-web portafolio (cv-web.html)
│           └── pwa.js              # Registro de Service Worker para soporte offline
└── alpha/                          # Prototipos y exploraciones visuales tempranas
    ├── index.html
    └── 00 ... 03/
```

---

## 🚀 Cómo Usar

1. **Abrir directamente:**
   No necesitas instalar Node.js ni configurar servidores pesados. Simplemente abre `index.html` en tu navegador web preferido (Chrome, Edge, Firefox, Safari).

2. **Servidor local (opcional):**
   Si prefieres ejecutarlo con un servidor web local:
   ```bash
   # Con Python 3:
   python3 -m http.server 8000
   # Abrir en el navegador: http://localhost:8000
   ```

3. **Editar y Descargar:**
   - Escribe y da formato a tu texto con la barra superior.
   - Escoge tu plantilla favorita y el color de acento.
   - Haz clic en **"Exportar a PDF"** (`Ctrl + P`), selecciona "Guardar como PDF" y ¡listo!

---

## 🔒 Privacidad

Toda la información ingresada, las fotos de perfil y los respaldos JSON se procesan **únicamente en tu propio navegador**. No se transmite ningún dato a servidores externos.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo de licencia o el código para más detalles.
