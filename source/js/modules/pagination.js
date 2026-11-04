/**
 * miVIT3 — Módulo de Paginación Dinámica A4 y Control de Densidad (Fase 1)
 * Medición geométrica A4 en tiempo real (relación 210x297mm), vista de hojas divididas
 * a tamaño real, guías de corte y advertencia de desborde.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  const STORAGE_VIEW_MODE = 'mivit3_view_mode';
  const PAGE_GAP = 36; // Brecha física en píxeles entre hojas divididas
  let currentViewMode = localStorage.getItem(STORAGE_VIEW_MODE) || 'divided';
  let isUpdatingPagination = false;
  let observerInstance = null;

  function saveSettings() {
    if (typeof window.saveSettings === 'function') {
      window.saveSettings();
    } else if (window.miVit3 && typeof window.miVit3.saveSettings === 'function') {
      window.miVit3.saveSettings();
    }
  }

  function setupDensityControls() {
    const densityButtons = document.querySelectorAll('.pill-btn[data-density]');
    densityButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        setDensity(this.dataset.density);
      });
    });

    const btnAutoFit = document.getElementById('btnAutoFitCompact');
    if (btnAutoFit) {
      btnAutoFit.addEventListener('click', function () {
        setDensity('density-compact');
      });
    }

    setupViewModeToggle();
  }

  function setupViewModeToggle() {
    const btnToggle = document.getElementById('btnToggleViewMode');
    if (btnToggle) {
      btnToggle.onclick = function (e) {
        e.preventDefault();
        toggleViewMode();
      };
    }

    const pageBadge = document.getElementById('pageBadge');
    if (pageBadge) {
      pageBadge.style.cursor = 'pointer';
      pageBadge.onclick = function (e) {
        e.preventDefault();
        toggleViewMode();
      };
    }

    updateViewModeUi(currentViewMode);
  }

  function getViewMode() {
    return currentViewMode;
  }

  function setViewMode(mode) {
    if (mode !== 'divided' && mode !== 'continuous') mode = 'divided';
    currentViewMode = mode;
    try {
      localStorage.setItem(STORAGE_VIEW_MODE, currentViewMode);
    } catch (e) {}

    updateViewModeUi(currentViewMode);
    updatePageBreakAndCapacity();

    const toast = window.showToast || (window.miVit3 && window.miVit3.showToast);
    if (toast) {
      const label = currentViewMode === 'divided' ? 'Hojas Divididas A4 (Tamaño Real)' : 'Vista Continua (Lineal)';
      toast(`Modo de vista: ${label}`);
    }
  }

  function toggleViewMode() {
    setViewMode(currentViewMode === 'divided' ? 'continuous' : 'divided');
  }

  function updateViewModeUi(mode) {
    const btnToggle = document.getElementById('btnToggleViewMode');
    const label = document.getElementById('viewModeLabel');
    const iconDiv = document.getElementById('viewModeIconDivided');
    const iconCont = document.getElementById('viewModeIconContinuous');

    if (btnToggle) {
      btnToggle.classList.toggle('active-divided', mode === 'divided');
      btnToggle.title = mode === 'divided' 
        ? 'Vista activa: Hojas Divididas A4. Haz clic para cambiar a Vista Continua.' 
        : 'Vista activa: Vista Continua. Haz clic para cambiar a Hojas Divididas A4.';
    }

    if (label) {
      label.textContent = mode === 'divided' ? 'Hojas Divididas' : 'Vista Continua';
    }

    if (iconDiv && iconCont) {
      iconDiv.style.display = mode === 'divided' ? 'block' : 'none';
      iconCont.style.display = mode === 'continuous' ? 'block' : 'none';
    }
  }

  function setDensity(densityClass) {
    const cvDoc = document.getElementById('cv-document');
    if (!cvDoc) return;

    cvDoc.classList.remove('density-compact', 'density-normal', 'density-spacious');
    cvDoc.classList.add(densityClass);

    document.querySelectorAll('.pill-btn[data-density]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.density === densityClass);
    });

    saveSettings();
    updatePageBreakAndCapacity();

    const densityNames = {
      'density-compact': 'Compacto',
      'density-normal': 'Normal',
      'density-spacious': 'Espacioso'
    };
    if (window.showToast) {
      window.showToast(`Densidad "${densityNames[densityClass] || densityClass}" activada`);
    }
  }

  function setupPageBreakObserver() {
    setupViewModeToggle();
    const cvDoc = document.getElementById('cv-document');
    if (!cvDoc) return;

    function debounce(fn, delay) {
      let t;
      return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), delay || 120);
      };
    }

    const debouncedUpdate = debounce(updatePageBreakAndCapacity, 120);

    if (window.ResizeObserver) {
      if (observerInstance) {
        observerInstance.disconnect();
      }
      observerInstance = new ResizeObserver(() => {
        if (!isUpdatingPagination) {
          debouncedUpdate();
        }
      });
      observerInstance.observe(cvDoc);
    } else {
      window.addEventListener('resize', debouncedUpdate);
    }

    setTimeout(updatePageBreakAndCapacity, 100);
  }

  function updatePageBreakAndCapacity() {
    if (isUpdatingPagination) return;
    isUpdatingPagination = true;

    try {
      const cvPaper = document.getElementById('cv-paper');
      const cvDoc = document.getElementById('cv-document');
      if (!cvPaper || !cvDoc) return;

      const paperWidth = cvPaper.clientWidth || 794;
      const a4HeightPx = Math.round((paperWidth / 210) * 297);

      if (currentViewMode === 'continuous') {
        renderContinuousView(cvPaper, cvDoc, a4HeightPx);
      } else {
        renderDividedPagesView(cvPaper, cvDoc, a4HeightPx);
      }
    } finally {
      // Liberar guardia de recursión tras breve intervalo
      setTimeout(() => {
        isUpdatingPagination = false;
      }, 50);
    }
  }

  /**
   * Renderiza la vista clásica lineal continua con guías de corte en línea roja
   */
  function renderContinuousView(cvPaper, cvDoc, a4HeightPx) {
    cvPaper.classList.remove('mode-divided-pages');
    cvPaper.classList.add('mode-continuous');
    cvPaper.style.minHeight = 'var(--paper-min-height)';

    // Limpiar márgenes artificiales de salto
    cvDoc.querySelectorAll('[data-page-break-margin]').forEach(el => {
      el.style.marginTop = '';
      el.removeAttribute('data-page-break-margin');
    });

    // Ocultar o vaciar backdrop
    const backdrop = document.getElementById('cvPagesBackdrop');
    if (backdrop) backdrop.innerHTML = '';

    const docHeight = cvDoc.offsetHeight || cvDoc.scrollHeight;
    const percent = Math.round((docHeight / a4HeightPx) * 100);
    const numPages = Math.max(1, Math.ceil(docHeight / a4HeightPx));

    const pageBadgeText = document.getElementById('pageBadgeText');
    const pageBadge = document.getElementById('pageBadge');
    if (pageBadgeText) {
      pageBadgeText.textContent = `${numPages} ${numPages === 1 ? 'pág.' : 'págs.'} (${percent}%)`;
    }
    if (pageBadge) {
      pageBadge.classList.toggle('badge-warning', percent > 100);
    }

    const banner = document.getElementById('pageWarningBanner');
    const overflowPercent = document.getElementById('overflowPercent');
    if (banner) {
      if (percent > 100 && percent <= 115 && !cvDoc.classList.contains('density-compact')) {
        banner.style.display = 'flex';
        if (overflowPercent) overflowPercent.textContent = `${percent}%`;
      } else {
        banner.style.display = 'none';
      }
    }

    renderContinuousBreakGuides(cvPaper, a4HeightPx, numPages);
    updateViewModeUi('continuous');
  }

  function renderContinuousBreakGuides(paper, a4HeightPx, numPages) {
    paper.querySelectorAll('.page-break-guide').forEach(g => g.remove());

    for (let p = 1; p < numPages; p++) {
      const guide = document.createElement('div');
      guide.className = 'page-break-guide';
      guide.style.top = `${p * a4HeightPx}px`;
      guide.innerHTML = `<span class="page-break-label">Límite Página ${p} (A4)</span>`;
      paper.appendChild(guide);
    }
  }

  /**
   * Renderiza la vista de Hojas Divididas a tamaño real A4 (Word / Google Docs Style)
   */
  function renderDividedPagesView(cvPaper, cvDoc, a4HeightPx) {
    cvPaper.classList.remove('mode-continuous');
    cvPaper.classList.add('mode-divided-pages');

    // Eliminar guías rojas de modo continuo
    cvPaper.querySelectorAll('.page-break-guide').forEach(g => g.remove());

    // 1. Resetear cualquier margen de corte previo
    cvDoc.querySelectorAll('[data-page-break-margin]').forEach(el => {
      el.style.marginTop = '';
      el.removeAttribute('data-page-break-margin');
    });

    // 2. Medir la altura NATURAL del documento antes de cualquier salto artificial
    const naturalDocHeight = cvDoc.scrollHeight || cvDoc.offsetHeight;
    const percent = Math.round((naturalDocHeight / a4HeightPx) * 100);

    // El número de páginas está acotado estrictamente por la altura real del contenido
    const numPages = Math.max(1, Math.ceil(naturalDocHeight / a4HeightPx));

    // 3. Si numPages > 1, aplicar saltos limpios en elementos que cruzan el corte A4
    if (numPages > 1) {
      applySmartPageBreaks(cvDoc, a4HeightPx, numPages);
    }

    // 4. Asegurar existencia del backdrop de páginas
    let backdrop = document.getElementById('cvPagesBackdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'cvPagesBackdrop';
      backdrop.className = 'cv-pages-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      cvPaper.insertBefore(backdrop, cvDoc);
    }

    // 5. Ajustar altura exacta del contenedor de papel
    const totalPaperHeight = (numPages * a4HeightPx) + ((numPages - 1) * PAGE_GAP);
    cvPaper.style.minHeight = `${totalPaperHeight}px`;

    // 6. Renderizar las tarjetas de hoja física en el backdrop
    renderSheetCards(backdrop, a4HeightPx, numPages);

    // 7. Actualizar badges e indicadores
    const pageBadgeText = document.getElementById('pageBadgeText');
    const pageBadge = document.getElementById('pageBadge');
    if (pageBadgeText) {
      if (numPages === 1) {
        pageBadgeText.textContent = `1 hoja (${Math.min(100, percent)}%)`;
      } else {
        pageBadgeText.textContent = `${numPages} hojas A4 (${percent}%)`;
      }
    }
    if (pageBadge) {
      pageBadge.classList.toggle('badge-warning', numPages > 1);
    }

    const banner = document.getElementById('pageWarningBanner');
    const overflowPercent = document.getElementById('overflowPercent');
    if (banner) {
      if (percent > 100 && percent <= 115 && !cvDoc.classList.contains('density-compact')) {
        banner.style.display = 'flex';
        if (overflowPercent) overflowPercent.textContent = `${percent}%`;
      } else {
        banner.style.display = 'none';
      }
    }

    updateViewModeUi('divided');
  }

  /**
   * Algoritmo de corte inteligente: empuja los bloques que quedan cortados a caballo entre hojas.
   * Acotado a exactamente (numPages - 1) cortes para evitar cualquier ciclo de incremento.
   */
  function applySmartPageBreaks(cvDoc, a4HeightPx, numPages) {
    const docRect = cvDoc.getBoundingClientRect();
    const directChildren = Array.from(cvDoc.children).filter(el => {
      return el.nodeType === 1 && !el.classList.contains('drag-handle') && el.id !== 'cvPagesBackdrop';
    });

    const candidateBlocks = [];
    directChildren.forEach(child => {
      if (child.classList.contains('cv-section')) {
        const items = child.querySelectorAll('.cv-item');
        if (items.length > 1) {
          const header = child.querySelector('.cv-section-header');
          if (header) candidateBlocks.push(header);
          items.forEach(it => candidateBlocks.push(it));
        } else {
          candidateBlocks.push(child);
        }
      } else if (child.classList.contains('cv-columns-layout')) {
        const innerSections = child.querySelectorAll('.cv-section');
        innerSections.forEach(s => candidateBlocks.push(s));
      } else {
        candidateBlocks.push(child);
      }
    });

    // Evaluar cada límite entre hojas
    for (let p = 1; p < numPages; p++) {
      const pageBoundary = p * a4HeightPx;
      const pageLimit = pageBoundary - 25; // Margen de seguridad inferior

      for (let i = 0; i < candidateBlocks.length; i++) {
        const block = candidateBlocks[i];
        if (!block || !block.getBoundingClientRect) continue;

        const rect = block.getBoundingClientRect();
        const blockTop = rect.top - docRect.top;
        const blockBottom = rect.bottom - docRect.top;

        if (blockTop < pageLimit && blockBottom > pageLimit) {
          // El bloque corta la línea de página: empujarlo a la siguiente hoja
          const targetTop = p * (a4HeightPx + PAGE_GAP) + 24;
          const shiftNeeded = targetTop - blockTop;
          if (shiftNeeded > 0) {
            block.style.marginTop = `${Math.round(shiftNeeded)}px`;
            block.setAttribute('data-page-break-margin', 'true');
          }
          break; // Pasar al siguiente límite de página
        }
      }
    }
  }

  /**
   * Dibuja las tarjetas físicas de cada hoja A4 y los divisores de corte
   */
  function renderSheetCards(backdrop, a4HeightPx, numPages) {
    backdrop.innerHTML = '';
    const pagePitch = a4HeightPx + PAGE_GAP;

    for (let i = 1; i <= numPages; i++) {
      const topPos = (i - 1) * pagePitch;

      // Tarjeta de Hoja A4
      const sheet = document.createElement('div');
      sheet.className = 'cv-sheet-card';
      sheet.style.top = `${topPos}px`;
      sheet.style.height = `${a4HeightPx}px`;

      const footer = document.createElement('div');
      footer.className = 'cv-sheet-footer';
      footer.innerHTML = `
        <span>Hoja ${i} de ${numPages}</span>
        <span>A4 • 210 × 297 mm</span>
      `;
      sheet.appendChild(footer);
      backdrop.appendChild(sheet);

      // Divisor de corte entre hojas (si hay una hoja siguiente)
      if (i < numPages) {
        const cutTop = (i * a4HeightPx) + ((i - 1) * PAGE_GAP);
        const cut = document.createElement('div');
        cut.className = 'cv-sheet-cut';
        cut.style.top = `${cutTop}px`;
        cut.style.height = `${PAGE_GAP}px`;

        cut.innerHTML = `
          <div class="cv-sheet-cut-line"></div>
          <div class="cv-sheet-cut-pill">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor">
              <circle cx="6" cy="6" r="3"></circle>
              <circle cx="6" cy="18" r="3"></circle>
              <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
              <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
              <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
            </svg>
            <span>Corte de Hoja A4 &bull; Hoja ${i} / Hoja ${i + 1}</span>
          </div>
          <div class="cv-sheet-cut-line"></div>
        `;
        backdrop.appendChild(cut);
      }
    }
  }

  // Exportar funciones
  window.setupDensityControls = setupDensityControls;
  window.setDensity = setDensity;
  window.setupPageBreakObserver = setupPageBreakObserver;
  window.updatePageBreakAndCapacity = updatePageBreakAndCapacity;
  window.getViewMode = getViewMode;
  window.setViewMode = setViewMode;
  window.toggleViewMode = toggleViewMode;

  window.miVit3.setupDensityControls = setupDensityControls;
  window.miVit3.setDensity = setDensity;
  window.miVit3.setupPageBreakObserver = setupPageBreakObserver;
  window.miVit3.updatePageBreakAndCapacity = updatePageBreakAndCapacity;
  window.miVit3.getViewMode = getViewMode;
  window.miVit3.setViewMode = setViewMode;
  window.miVit3.toggleViewMode = toggleViewMode;

})();
