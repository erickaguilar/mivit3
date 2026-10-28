/**
 * miVIT3 — Módulo de Búsqueda y Reemplazo Interactivo (Search & Replace)
 * Atajos Ctrl+F / Ctrl+H, navegación de coincidencias y reemplazo en tiempo real en el DOM.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  let searchBarEl = null;
  let matches = [];
  let currentIndex = -1;

  function triggerAutoSave() {
    if (typeof window.triggerAutoSave === 'function') {
      window.triggerAutoSave();
    } else if (window.miVit3 && typeof window.miVit3.triggerAutoSave === 'function') {
      window.miVit3.triggerAutoSave();
    }
  }

  function createSearchBar() {
    if (searchBarEl) return;

    searchBarEl = document.createElement('div');
    searchBarEl.className = 'search-replace-bar';
    searchBarEl.innerHTML = `
      <div class="search-input-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" id="cvSearchInput" placeholder="Buscar..." autocomplete="off">
      </div>
      <div class="search-input-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
        <input type="text" id="cvReplaceInput" placeholder="Reemplazar..." autocomplete="off">
      </div>
      <span class="search-counter" id="cvSearchCounter">0 de 0</span>
      <div class="search-btn-group">
        <button type="button" class="search-btn" id="btnSearchPrev" title="Coincidencia anterior (Shift+Enter)">▲</button>
        <button type="button" class="search-btn" id="btnSearchNext" title="Siguiente coincidencia (Enter)">▼</button>
        <button type="button" class="search-btn" id="btnSearchReplaceSingle" title="Reemplazar coincidencia actual">Reemplazar</button>
        <button type="button" class="search-btn btn-replace-action" id="btnSearchReplaceAll" title="Reemplazar todas las coincidencias">Todos</button>
      </div>
      <button type="button" class="search-close-btn" id="btnSearchClose" title="Cerrar (Esc)">✕</button>
    `;

    document.body.appendChild(searchBarEl);

    // Eventos
    const searchInput = document.getElementById('cvSearchInput');
    const replaceInput = document.getElementById('cvReplaceInput');
    const btnPrev = document.getElementById('btnSearchPrev');
    const btnNext = document.getElementById('btnSearchNext');
    const btnReplace = document.getElementById('btnSearchReplaceSingle');
    const btnReplaceAll = document.getElementById('btnSearchReplaceAll');
    const btnClose = document.getElementById('btnSearchClose');

    searchInput.addEventListener('input', () => performSearch(searchInput.value));
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          navigatePrev();
        } else {
          navigateNext();
        }
      }
      if (e.key === 'Escape') closeSearchBar();
    });

    replaceInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        replaceCurrent();
      }
      if (e.key === 'Escape') closeSearchBar();
    });

    btnPrev.addEventListener('click', navigatePrev);
    btnNext.addEventListener('click', navigateNext);
    btnReplace.addEventListener('click', replaceCurrent);
    btnReplaceAll.addEventListener('click', replaceAll);
    btnClose.addEventListener('click', closeSearchBar);
  }

  function openSearchBar(focusReplace = false) {
    createSearchBar();
    searchBarEl.style.display = 'flex';

    const searchInput = document.getElementById('cvSearchInput');
    const replaceInput = document.getElementById('cvReplaceInput');

    // Pre-llenar con texto seleccionado si existe
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && searchInput) {
      const selectedText = selection.toString().trim();
      if (selectedText.length > 0 && selectedText.length < 50) {
        searchInput.value = selectedText;
      }
    }

    if (focusReplace && replaceInput) {
      replaceInput.focus();
      replaceInput.select();
    } else if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }

    if (searchInput && searchInput.value) {
      performSearch(searchInput.value);
    }
  }

  function closeSearchBar() {
    clearHighlights();
    if (searchBarEl) {
      searchBarEl.style.display = 'none';
    }
    const doc = document.getElementById('cv-document');
    if (doc) doc.focus();
  }

  function clearHighlights() {
    const doc = document.getElementById('cv-document');
    if (!doc) return;

    const marks = doc.querySelectorAll('mark.cv-search-highlight');
    marks.forEach(mark => {
      const parent = mark.parentNode;
      while (mark.firstChild) {
        parent.insertBefore(mark.firstChild, mark);
      }
      parent.removeChild(mark);
      parent.normalize();
    });

    matches = [];
    currentIndex = -1;
    updateCounter();
  }

  function performSearch(query) {
    clearHighlights();
    const doc = document.getElementById('cv-document');
    if (!doc || !query || !query.trim()) return;

    const searchTerm = query.trim().toLowerCase();
    const walker = document.createTreeWalker(doc, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];

    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue && node.nodeValue.toLowerCase().includes(searchTerm)) {
        // Ignorar scripts o elementos de control
        if (!node.parentElement.closest('.section-actions, .item-actions, button')) {
          textNodes.push(node);
        }
      }
    }

    textNodes.forEach(textNode => {
      const text = textNode.nodeValue;
      const lower = text.toLowerCase();
      let startIdx = 0;
      let matchIdx;

      const fragment = document.createDocumentFragment();

      while ((matchIdx = lower.indexOf(searchTerm, startIdx)) !== -1) {
        if (matchIdx > startIdx) {
          fragment.appendChild(document.createTextNode(text.substring(startIdx, matchIdx)));
        }

        const mark = document.createElement('mark');
        mark.className = 'cv-search-highlight';
        mark.textContent = text.substring(matchIdx, matchIdx + searchTerm.length);
        fragment.appendChild(mark);
        matches.push(mark);

        startIdx = matchIdx + searchTerm.length;
      }

      if (startIdx < text.length) {
        fragment.appendChild(document.createTextNode(text.substring(startIdx)));
      }

      if (textNode.parentNode) {
        textNode.parentNode.replaceChild(fragment, textNode);
      }
    });

    if (matches.length > 0) {
      currentIndex = 0;
      highlightCurrentMatch();
    } else {
      currentIndex = -1;
      updateCounter();
    }
  }

  function highlightCurrentMatch() {
    matches.forEach((m, idx) => {
      if (idx === currentIndex) {
        m.classList.add('current');
        m.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        m.classList.remove('current');
      }
    });
    updateCounter();
  }

  function navigateNext() {
    if (matches.length === 0) return;
    currentIndex = (currentIndex + 1) % matches.length;
    highlightCurrentMatch();
  }

  function navigatePrev() {
    if (matches.length === 0) return;
    currentIndex = (currentIndex - 1 + matches.length) % matches.length;
    highlightCurrentMatch();
  }

  function updateCounter() {
    const counter = document.getElementById('cvSearchCounter');
    if (!counter) return;

    if (matches.length === 0) {
      counter.textContent = '0 de 0';
    } else {
      counter.textContent = `${currentIndex + 1} de ${matches.length}`;
    }
  }

  function replaceCurrent() {
    if (currentIndex < 0 || currentIndex >= matches.length) return;

    const replaceInput = document.getElementById('cvReplaceInput');
    const replacement = replaceInput ? replaceInput.value : '';
    const currentMark = matches[currentIndex];

    if (!currentMark) return;

    const textNode = document.createTextNode(replacement);
    currentMark.parentNode.replaceChild(textNode, currentMark);
    triggerAutoSave();

    // Actualizar búsqueda restante
    const searchInput = document.getElementById('cvSearchInput');
    if (searchInput) {
      performSearch(searchInput.value);
    }
  }

  function replaceAll() {
    if (matches.length === 0) return;

    const replaceInput = document.getElementById('cvReplaceInput');
    const replacement = replaceInput ? replaceInput.value : '';
    const total = matches.length;

    matches.forEach(mark => {
      const textNode = document.createTextNode(replacement);
      if (mark.parentNode) {
        mark.parentNode.replaceChild(textNode, mark);
      }
    });

    matches = [];
    currentIndex = -1;
    updateCounter();

    const doc = document.getElementById('cv-document');
    if (doc) doc.normalize();

    triggerAutoSave();

    const toast = window.showToast || (window.miVit3 && window.miVit3.showToast);
    if (toast) toast(`Se reemplazaron ${total} coincidencia(s).`);

    closeSearchBar();
  }

  function setupShortcuts() {
    const btn = document.getElementById('btnSearchReplace');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openSearchBar(false);
      });
    }

    document.addEventListener('keydown', function (e) {
      // Ctrl+F o Cmd+F
      if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        openSearchBar(false);
      }
      // Ctrl+H o Cmd+H
      if ((e.ctrlKey || e.metaKey) && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        openSearchBar(true);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupShortcuts);
  } else {
    setupShortcuts();
  }

  window.miVit3.openSearchBar = openSearchBar;
  window.miVit3.closeSearchBar = closeSearchBar;
})();
