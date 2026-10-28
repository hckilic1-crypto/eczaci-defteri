/* Editor presentation only. ASCII source prevents encoding issues. */
(() => {
  'use strict';
  if (!location.pathname.startsWith('/keystatic')) return;
  const categoryNames = {
    'vitaminler':'Vitaminler',
    'mineraller':'Mineraller',
    'dermokozmetik':'Dermokozmetik',
    'eczacilik':'Eczac\u0131l\u0131k',
    'saglik-ve-bilim':'Sa\u011fl\u0131k ve Bilim',
    'takviye-edici-gidalar':'Takviye Edici G\u0131dalar',
    'bitkisel-ueruenler':'Bitkisel \u00dcr\u00fcnler',
    'diger-takviyeler':'Di\u011fer Takviyeler',
    'probiyotikler-ve-prebiyotikler':'Probiyotikler ve Prebiyotikler'
  };
  let updating = false;
  function getCells(row) {
    return Array.from(row.children).filter(el => {
      const role = el.getAttribute('role');
      return /^(TD|TH)$/.test(el.tagName) || role === 'gridcell' || role === 'rowheader' || role === 'cell' || role === 'columnheader';
    });
  }
  function enhance() {
    const isList = /\/collection\/posts\/?$/.test(location.pathname);
    document.documentElement.classList.toggle('ed-editor-post-list', isList);
    if (!isList) return;
    const heads = Array.from(document.querySelectorAll('th,[role="columnheader"]'));
    for (const slugHead of heads.filter(el => (el.textContent || '').trim().toLowerCase() === 'slug')) {
      const headerRow = slugHead.closest('tr,[role="row"]');
      if (!headerRow) continue;
      const columns = getCells(headerRow);
      if (columns.length < 3) continue;
      const position = columns.indexOf(slugHead);
      if (position < 0) continue;
      const table = slugHead.closest('table,[role="grid"],[role="table"]') || headerRow.parentElement?.parentElement;
      if (!table) continue;
      const colIndex = key => columns.findIndex(el => (el.textContent || '').toLocaleLowerCase('tr').includes(key));
      const titleAt = colIndex('ba\u015fl\u0131k');
      const statusAt = colIndex('taslak');
      const categoryAt = colIndex('kategori');
      if (titleAt < 0 || statusAt < 0) continue;
      table.setAttribute('data-ed-articles-table', '');
      for (const cell of columns) {
        const isSlug = cell === slugHead;
        cell.toggleAttribute('data-ed-hide-slug', isSlug);
      }
      for (const row of table.querySelectorAll('tr,[role="row"]')) {
        if (row === headerRow) continue;
        const cells = getCells(row);
        if (cells.length !== columns.length) continue;
        const slugCell = cells[position];
        const titleCell = cells[titleAt];
        const statusCell = cells[statusAt];
        const statusValue = (statusCell?.textContent || '').trim().toLowerCase();
        if (statusValue !== 'true' && statusValue !== 'false' && !statusCell?.hasAttribute('data-ed-status')) continue;
        if (slugCell) slugCell.setAttribute('data-ed-hide-slug', '');
        if (titleCell) {
          titleCell.setAttribute('data-ed-title-cell', '');
          const fullTitle = titleCell.textContent?.trim();
          if (fullTitle && !titleCell.hasAttribute('title')) titleCell.setAttribute('title', fullTitle);
        }
        if (statusCell) {
          const value = statusValue === 'true' || statusCell.dataset.edStatus === 'draft' ? 'draft' : 'published';
          if (statusCell.dataset.edStatus !== value) {
            statusCell.dataset.edStatus = value;
            statusCell.dataset.edLabel = value === 'draft' ? 'Taslak' : 'Yay\u0131nda';
            statusCell.setAttribute('aria-label', statusCell.dataset.edLabel);
          }
        }
        if (categoryAt >= 0 && cells[categoryAt]) {
          const catCell = cells[categoryAt];
          const key = (catCell.textContent || '').trim();
          if (categoryNames[key] && catCell.dataset.edCategoryLabel !== categoryNames[key]) {
            catCell.dataset.edCategoryLabel = categoryNames[key];
            catCell.setAttribute('aria-label', categoryNames[key]);
          }
        }
      }
    }
  }
  let pending = false;
  const observer = new MutationObserver(() => {
    if (pending || updating) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      updating = true;
      try { enhance(); } finally { updating = false; }
    });
  });
  observer.observe(document.body, {subtree:true,childList:true});
  addEventListener('popstate', enhance);
  enhance();
})();