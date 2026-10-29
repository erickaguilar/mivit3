/**
 * miVIT3 — Módulo de Carta de Presentación Membretada (Cover Letter Builder)
 * Genera, personaliza, sincroniza y exporta cartas de presentación de alto impacto
 * manteniendo la identidad visual (membrete, tipografía y color de acento) del CV.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  const STORAGE_KEY = 'mivit3_cover_letter_data';

  // Plantillas de redacción con fórmulas profesionales
  const PRESET_TEMPLATES = {
    ejecutiva: {
      name: 'Ejecutiva & Estratégica',
      description: 'Formal, orientada a liderazgo, visión de negocio y valor corporativo.',
      body: function (data) {
        return `
<p>Estimado/a <strong>${escapeHtml(data.recipient)}</strong>,</p>

<p>Me dirijo a usted con gran interés y entusiasmo para presentar mi postulación a la posición de <strong>${escapeHtml(data.role)}</strong> en <strong>${escapeHtml(data.company)}</strong>. A lo largo de mi trayectoria profesional como ${escapeHtml(data.candidateRole)}, he liderado iniciativas estratégicas enfocadas en la optimización de procesos, el cumplimiento riguroso de objetivos y la entrega de valor tangible y cuantificable para la organización.</p>

<p>En mis responsabilidades recientes, he coordinado equipos de trabajo multidisciplinarios, impulsando proyectos orientados a la eficiencia operativa y la superación de metas clave de negocio. Mi enfoque profesional combina una sólida capacidad analítica para la toma de decisiones basada en datos con una probada habilidad para construir relaciones de confianza a todo nivel corporativo.</p>

<p>Sigo con profunda admiración la trayectoria y el liderazgo de <strong>${escapeHtml(data.company)}</strong> en el sector, y me identifico plenamente con sus valores de innovación y excelencia. Estoy convencido/a de que mi experiencia y competencias me permitirán integrarme de manera ágil y contribuir decididamente a sus objetivos estratégicos a corto y largo plazo.</p>

<p>Agradezco de antemano el tiempo dedicado a evaluar mi perfil y currículum adjunto. Quedo a su completa disposición para coordinar una entrevista en la que podamos profundizar en cómo mi experiencia puede generar impacto inmediato en su equipo.</p>
        `.trim();
      }
    },

    tecnica: {
      name: 'Técnica & Orientada a Logros (STAR)',
      description: 'Enfoque en métricas, resolución de problemas y stack de competencias.',
      body: function (data) {
        return `
<p>Estimado equipo de selección de <strong>${escapeHtml(data.company)}</strong>,</p>

<p>Les escribo para postular a la vacante de <strong>${escapeHtml(data.role)}</strong>. Con sólida experiencia en el área de ${escapeHtml(data.candidateRole)}, he diseñado, implementado y escalado soluciones de alto impacto técnico, aplicando buenas prácticas de ingeniería, rigor en la ejecución y una clara orientación a resultados medibles.</p>

<p>Durante mi trayectoria, me he especializado en identificar cuellos de botella, automatizar flujos de trabajo críticos y optimizar el rendimiento operativo de los proyectos a mi cargo. Me apasiona resolver problemas complejos mediante soluciones elegantes y mantenibles, asegurando siempre altos estándares de calidad y colaboración ágil entre áreas técnicas y de negocio.</p>

<p>El stack, los desafíos técnicos y la visión de producto que distinguen a <strong>${escapeHtml(data.company)}</strong> representan el entorno ideal en el que puedo aportar máxima eficiencia. Cuento con la adaptabilidad y el impulso continuo de aprendizaje necesarios para responder a entornos de alta exigencia.</p>

<p>En mi currículum adjunto encontrarán el detalle de mis logros, proyectos y competencias técnicas. Agradezco su atención y quedo a su entera disposición para conversar en una entrevista técnica sobre cómo puedo aportar valor tangible a sus proyectos.</p>
        `.trim();
      }
    },

    startup: {
      name: 'Startup / Creativa & Dinámica',
      description: 'Tono proactivo, entusiasmo, agilidad y ajuste a la cultura del equipo.',
      body: function (data) {
        return `
<p>¡Hola, equipo de <strong>${escapeHtml(data.company)}</strong>!</p>

<p>Sigo de cerca el crecimiento y los grandes hitos que vienen logrando en la industria, y cuando descubrí la oportunidad para integrarme como <strong>${escapeHtml(data.role)}</strong>, supe de inmediato que era el lugar indicado donde quiero sumar mi talento y pasión como ${escapeHtml(data.candidateRole)}.</p>

<p>Me defino como una persona autónoma, orientada a la acción y con una mentalidad de crecimiento ágil (*growth mindset*). Disfruto transformar ideas ambiciosas en realidades tangibles, colaborar de forma cercana y transversal, y encontrar formas más inteligentes y creativas de resolver las necesidades de los usuarios.</p>

<p>Lo que más me entusiasma de <strong>${escapeHtml(data.company)}</strong> es su cultura de innovación continua y el impacto positivo que generan día a día. Me encantaría aportar mi energía, experiencia práctica y pensamiento propositivo para acelerar las metas de su próximo trimestre.</p>

<p>Les invito a revisar mi currículum adjunto. Estaré encantado/a de coordinar una breve llamada para compartir ideas y conversar sobre cómo podemos construir cosas extraordinarias juntos.</p>
        `.trim();
      }
    }
  };

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getFormattedCurrentDate() {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    try {
      return new Date().toLocaleDateString('es-ES', options);
    } catch (e) {
      return new Date().toLocaleDateString();
    }
  }

  function getCandidateDataFromCV() {
    const cvDoc = document.getElementById('cv-document');
    if (!cvDoc) {
      return {
        name: 'Mi Nombre',
        role: 'Profesional Especialista',
        contacts: []
      };
    }

    const nameEl = cvDoc.querySelector('.cv-name');
    const roleEl = cvDoc.querySelector('.cv-role');

    const name = (nameEl ? nameEl.textContent.trim() : '') || 'Mi Nombre';
    const role = (roleEl ? roleEl.textContent.trim() : '') || 'Profesional';

    const contacts = [];
    cvDoc.querySelectorAll('.cv-contact-item').forEach(li => {
      const span = li.querySelector('span');
      const text = span ? span.textContent.trim() : li.textContent.trim();
      const svg = li.querySelector('svg');
      if (text && !text.includes('placeholder')) {
        contacts.push({
          text: text,
          svgHtml: svg ? svg.outerHTML : ''
        });
      }
    });

    return { name, role, contacts };
  }

  function renderCoverLetterHeader(candidate) {
    const headerEl = document.getElementById('clSheetHeader');
    if (!headerEl) return;

    let contactsHtml = '';
    candidate.contacts.forEach(c => {
      contactsHtml += `
        <span class="cl-sheet-contact-item">
          ${c.svgHtml || ''}
          ${escapeHtml(c.text)}
        </span>
      `;
    });

    headerEl.innerHTML = `
      <div class="cl-sheet-name">${escapeHtml(candidate.name)}</div>
      <div class="cl-sheet-role">${escapeHtml(candidate.role)}</div>
      <div class="cl-sheet-contacts">${contactsHtml}</div>
    `;
  }

  function updateLetterRecipientAndSalutation(data) {
    const metaEl = document.getElementById('clSheetMeta');
    if (!metaEl) return;

    metaEl.innerHTML = `
      <div class="cl-sheet-date">${escapeHtml(data.date)}</div>
      <div class="cl-sheet-recipient-name">${escapeHtml(data.recipient)}</div>
      <div class="cl-sheet-company-name">${escapeHtml(data.company)}</div>
    `;

    const sigNameEl = document.getElementById('clSheetSignatureName');
    const sigRoleEl = document.getElementById('clSheetSignatureRole');
    if (sigNameEl) sigNameEl.textContent = data.candidateName;
    if (sigRoleEl) sigRoleEl.textContent = data.candidateRole;
  }

  function applyPreset(presetKey, isInitial = false) {
    const preset = PRESET_TEMPLATES[presetKey] || PRESET_TEMPLATES.ejecutiva;

    // Actualizar botones de tono activo
    document.querySelectorAll('.cl-preset-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.preset === presetKey);
    });

    const candidate = getCandidateDataFromCV();
    const company = (document.getElementById('clInputCompany') || {}).value || 'Empresa Destino';
    const recipient = (document.getElementById('clInputRecipient') || {}).value || 'Equipo de Selección';
    const role = (document.getElementById('clInputRole') || {}).value || candidate.role;
    const date = (document.getElementById('clInputDate') || {}).value || getFormattedCurrentDate();

    const data = {
      presetKey,
      candidateName: candidate.name,
      candidateRole: candidate.role,
      company,
      recipient,
      role,
      date
    };

    updateLetterRecipientAndSalutation(data);

    const bodyEl = document.getElementById('clSheetBody');
    if (bodyEl) {
      bodyEl.innerHTML = preset.body(data);
    }

    saveCoverLetterState();

    if (!isInitial && window.showToast) {
      window.showToast(`Plantilla "${preset.name}" aplicada`);
    }
  }

  function saveCoverLetterState() {
    const bodyEl = document.getElementById('clSheetBody');
    const companyInput = document.getElementById('clInputCompany');
    const recipientInput = document.getElementById('clInputRecipient');
    const roleInput = document.getElementById('clInputRole');
    const dateInput = document.getElementById('clInputDate');
    const activePresetBtn = document.querySelector('.cl-preset-btn.active');

    const state = {
      presetKey: activePresetBtn ? activePresetBtn.dataset.preset : 'ejecutiva',
      company: companyInput ? companyInput.value : '',
      recipient: recipientInput ? recipientInput.value : '',
      role: roleInput ? roleInput.value : '',
      date: dateInput ? dateInput.value : '',
      bodyHtml: bodyEl ? bodyEl.innerHTML : ''
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // Ignorar quota exceeded
    }
  }

  function loadSavedCoverLetterState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function openCoverLetterModal() {
    const modal = document.getElementById('coverLetterModal');
    if (!modal) return;

    const candidate = getCandidateDataFromCV();
    renderCoverLetterHeader(candidate);

    const saved = loadSavedCoverLetterState();
    const companyInput = document.getElementById('clInputCompany');
    const recipientInput = document.getElementById('clInputRecipient');
    const roleInput = document.getElementById('clInputRole');
    const dateInput = document.getElementById('clInputDate');

    if (saved) {
      if (companyInput) companyInput.value = saved.company || 'Empresa Destino';
      if (recipientInput) recipientInput.value = saved.recipient || 'Equipo de Selección';
      if (roleInput) roleInput.value = saved.role || candidate.role;
      if (dateInput) dateInput.value = saved.date || getFormattedCurrentDate();

      const activeKey = saved.presetKey || 'ejecutiva';
      document.querySelectorAll('.cl-preset-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.preset === activeKey);
      });

      const data = {
        candidateName: candidate.name,
        candidateRole: candidate.role,
        company: companyInput ? companyInput.value : '',
        recipient: recipientInput ? recipientInput.value : '',
        role: roleInput ? roleInput.value : candidate.role,
        date: dateInput ? dateInput.value : getFormattedCurrentDate()
      };
      updateLetterRecipientAndSalutation(data);

      const bodyEl = document.getElementById('clSheetBody');
      if (bodyEl && saved.bodyHtml) {
        bodyEl.innerHTML = saved.bodyHtml;
      } else {
        applyPreset(activeKey, true);
      }
    } else {
      if (companyInput && !companyInput.value) companyInput.value = 'Empresa Destino';
      if (recipientInput && !recipientInput.value) recipientInput.value = 'Equipo de Selección y Contratación';
      if (roleInput && !roleInput.value) roleInput.value = candidate.role;
      if (dateInput && !dateInput.value) dateInput.value = getFormattedCurrentDate();
      applyPreset('ejecutiva', true);
    }

    modal.classList.add('show');
  }

  function closeCoverLetterModal() {
    const modal = document.getElementById('coverLetterModal');
    if (modal) {
      modal.classList.remove('show');
    }
  }

  function copyCoverLetterText() {
    const sheet = document.getElementById('clSheet');
    if (!sheet) return;

    // Extraer texto limpio
    const candidate = getCandidateDataFromCV();
    const metaEl = document.getElementById('clSheetMeta');
    const bodyEl = document.getElementById('clSheetBody');

    const metaText = metaEl ? metaEl.innerText.trim() : '';
    const bodyText = bodyEl ? bodyEl.innerText.trim() : '';

    const fullText = [
      candidate.name.toUpperCase(),
      candidate.role,
      candidate.contacts.map(c => c.text).join(' | '),
      '----------------------------------------',
      metaText,
      '',
      bodyText,
      '',
      'Atentamente,',
      candidate.name,
      candidate.role
    ].join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullText).then(() => {
        if (window.showToast) window.showToast('Carta copiada al portapapeles');
      });
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = fullText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      if (window.showToast) window.showToast('Carta copiada al portapapeles');
    }
  }

  function printCoverLetter() {
    const sheet = document.getElementById('clSheet');
    if (!sheet) return;

    const accent = getComputedStyle(document.documentElement).getPropertyValue('--cv-accent').trim() || '#6400c8';
    const accentLight = getComputedStyle(document.documentElement).getPropertyValue('--cv-accent-light').trim() || '#f3e8ff';

    const printHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Carta de Presentación</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 18mm 20mm 20mm 20mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1e293b;
      line-height: 1.6;
      background: #ffffff;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .cl-sheet-header {
      border-bottom: 2.5px solid ${accent};
      padding-bottom: 14px;
      margin-bottom: 22px;
    }
    .cl-sheet-name {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.15;
    }
    .cl-sheet-role {
      font-size: 13px;
      font-weight: 700;
      color: ${accent};
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 4px;
      margin-bottom: 8px;
    }
    .cl-sheet-contacts {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      font-size: 11px;
      color: #475569;
    }
    .cl-sheet-contact-item {
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    .cl-sheet-contact-item svg {
      width: 12px;
      height: 12px;
      stroke: ${accent};
    }
    .cl-sheet-meta {
      margin-bottom: 20px;
      font-size: 12px;
      line-height: 1.45;
      color: #334155;
    }
    .cl-sheet-date {
      font-weight: 600;
      color: #64748b;
      margin-bottom: 12px;
    }
    .cl-sheet-recipient-name {
      font-weight: 700;
      color: #0f172a;
    }
    .cl-sheet-company-name {
      font-weight: 600;
      color: #475569;
    }
    .cl-sheet-body {
      font-size: 12px;
      line-height: 1.65;
      color: #1e293b;
    }
    .cl-sheet-body p {
      margin-bottom: 14px;
    }
    .cl-sheet-footer {
      margin-top: 32px;
      font-size: 12px;
      color: #1e293b;
    }
    .cl-sheet-signature-name {
      font-weight: 800;
      color: #0f172a;
      margin-top: 18px;
      font-size: 13.5px;
    }
    .cl-sheet-signature-role {
      color: #64748b;
      font-size: 11px;
    }
  </style>
</head>
<body>
  ${sheet.innerHTML}
</body>
</html>
    `.trim();

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(printHtml);
    doc.close();

    iframe.contentWindow.focus();
    setTimeout(() => {
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 250);

    if (window.showToast) {
      window.showToast('Generando vista de impresión de Carta...');
    }
  }

  function setupCoverLetterEventListeners() {
    const btnOpen = document.getElementById('btnOpenCoverLetter');
    if (btnOpen) {
      btnOpen.addEventListener('click', openCoverLetterModal);
    }

    const btnClose = document.getElementById('btnCloseCoverLetter');
    const btnCloseFooter = document.getElementById('btnCloseCoverLetterFooter');
    const modal = document.getElementById('coverLetterModal');

    if (btnClose) btnClose.addEventListener('click', closeCoverLetterModal);
    if (btnCloseFooter) btnCloseFooter.addEventListener('click', closeCoverLetterModal);

    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeCoverLetterModal();
      });
    }

    // Botones de presets
    document.querySelectorAll('.cl-preset-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        applyPreset(this.dataset.preset);
      });
    });

    // Inputs en vivo
    const inputs = ['clInputCompany', 'clInputRecipient', 'clInputRole', 'clInputDate'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', function () {
          const candidate = getCandidateDataFromCV();
          const company = (document.getElementById('clInputCompany') || {}).value || '';
          const recipient = (document.getElementById('clInputRecipient') || {}).value || '';
          const role = (document.getElementById('clInputRole') || {}).value || candidate.role;
          const date = (document.getElementById('clInputDate') || {}).value || getFormattedCurrentDate();

          updateLetterRecipientAndSalutation({
            candidateName: candidate.name,
            candidateRole: candidate.role,
            company,
            recipient,
            role,
            date
          });
          saveCoverLetterState();
        });
      }
    });

    // Botón de regenerar
    const btnRegen = document.getElementById('clBtnRegenerate');
    if (btnRegen) {
      btnRegen.addEventListener('click', function () {
        const activePreset = document.querySelector('.cl-preset-btn.active');
        const key = activePreset ? activePreset.dataset.preset : 'ejecutiva';
        applyPreset(key);
      });
    }

    // Auto-guardar edición en vivo del cuerpo
    const bodyEl = document.getElementById('clSheetBody');
    if (bodyEl) {
      bodyEl.addEventListener('input', saveCoverLetterState);
    }

    // Acciones de pie: Copiar e Imprimir
    const btnCopy = document.getElementById('btnCopyCoverLetterText');
    if (btnCopy) btnCopy.addEventListener('click', copyCoverLetterText);

    const btnPrint = document.getElementById('btnPrintCoverLetter');
    if (btnPrint) btnPrint.addEventListener('click', printCoverLetter);
  }

  // Inicialización al cargar el DOM
  document.addEventListener('DOMContentLoaded', setupCoverLetterEventListeners);

  // Exportar funciones globales
  window.openCoverLetterModal = openCoverLetterModal;
  window.closeCoverLetterModal = closeCoverLetterModal;
  window.printCoverLetter = printCoverLetter;
  window.copyCoverLetterText = copyCoverLetterText;

  window.miVit3.coverLetter = {
    open: openCoverLetterModal,
    close: closeCoverLetterModal,
    print: printCoverLetter,
    copy: copyCoverLetterText
  };

})();
