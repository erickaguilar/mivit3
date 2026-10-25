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

### 🎨 4 Plantillas Fundacionales Intercambiables (Basadas en `alpha/`)
1. **00 Bicolor (Inspirada en `alpha/00`):** Encabezado con franja oscura superior, doble línea de acento inferior en contraste (rojo y naranja/acento), foto superpuesta con marco blanco y títulos de sección en versalitas (*small-caps*).
2. **01 Columnas ATS (Inspirada en `alpha/01`):** Títulos de sección con barra sólida de color de acento y estructura cronológica de 2 columnas (fechas y ubicación geográfica a la izquierda; cargo, empresa y viñetas de logros a la derecha). Formato óptimo para filtros automáticos ATS de reclutamiento.
3. **02 Banner Credencial (Inspirada en `alpha/02`):** Franja vibrante superior con borde inferior grueso, avatar enmarcado a la izquierda estilo tarjeta/credencial y datos personales integrados dentro del banner.
4. **03 Monograma Editorial (Inspirada en `alpha/03`):** Insignia o monograma cuadrado personalizable en la esquina superior (`CV`), nombre en gran formato tipográfico (32px+) y diagramación con títulos de sección en rail lateral derecho.

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
- **SVG Nativo:** Iconos vectoriales nítidos en cualquier pantalla, sin archivos PNG ni JPG.
- **Web Storage API (`localStorage`) & File API (`FileReader`):** Procesamiento de imágenes y datos localmente en el cliente.

---

## 📁 Estructura del Proyecto

```text
mivit3/
├── index.html              # Aplicación principal y editor estilo Word
├── README.md               # Documentación general del proyecto
├── CHANGELOG.md            # Historial de cambios y versiones
├── source/
│   ├── css/
│   │   ├── normalize.css   # Reset estándar de estilos
│   │   └── style.css       # Estilos del editor, ribbon, templates y print
│   ├── img/                # Iconos vectoriales SVG (reemplazo de png/jpg)
│   │   ├── home.svg
│   │   ├── menu.svg
│   │   ├── mivit3.svg
│   │   ├── one.svg
│   │   ├── two.svg
│   │   ├── three.svg
│   │   ├── tips.svg
│   │   └── user.svg
│   └── js/
│       └── script.js       # Motor de edición Vanilla JS, plantillas y almacenamiento
└── alpha/                  # Prototipos y exploraciones visuales tempranas
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
