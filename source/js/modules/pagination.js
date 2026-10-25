/**
 * miVIT3 — Módulo de Paginación Dinámica A4 y Control de Densidad (Fase 1)
 * Medición geométrica A4 en tiempo real (relación 210x297mm), guías de corte y advertencia de desborde.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

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
    const cvDoc = document.getElementById('cv-document');
    if (!cvDoc) return;

    const debounceFn = window.debounce || ((fn) => fn);
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(debounceFn(updatePageBreakAndCapacity, 80));
      ro.observe(cvDoc);
    } else {
      window.addEventListener('resize', debounceFn(updatePageBreakAndCapacity, 150));
    }
    setTimeout(updatePageBreakAndCapacity, 200);
  }

  function updatePageBreakAndCapacity() {
    const cvPaper = document.getElementById('cv-paper');
    const cvDoc = document.getElementById('cv-document');
    if (!cvPaper || !cvDoc) return;

    const paperWidth = cvPaper.clientWidth || 794;
    const a4HeightPx = Math.round((paperWidth / 210) * 297);
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

    renderPageBreakGuides(cvPaper, a4HeightPx, numPages);
  }

  function renderPageBreakGuides(paper, a4HeightPx, numPages) {
    paper.querySelectorAll('.page-break-guide').forEach(g => g.remove());

    for (let p = 1; p < numPages; p++) {
      const guide = document.createElement('div');
      guide.className = 'page-break-guide';
      guide.style.top = `${p * a4HeightPx}px`;
      guide.innerHTML = `<span class="page-break-label">Límite Página ${p} (A4)</span>`;
      paper.appendChild(guide);
    }
  }

  // Exportar funciones
  window.setupDensityControls = setupDensityControls;
  window.setDensity = setDensity;
  window.setupPageBreakObserver = setupPageBreakObserver;
  window.updatePageBreakAndCapacity = updatePageBreakAndCapacity;
  window.renderPageBreakGuides = renderPageBreakGuides;

  window.miVit3.setupDensityControls = setupDensityControls;
  window.miVit3.setDensity = setDensity;
  window.miVit3.setupPageBreakObserver = setupPageBreakObserver;
  window.miVit3.updatePageBreakAndCapacity = updatePageBreakAndCapacity;

})();
