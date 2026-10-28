/* Eczacı Defteri editor enhancements: view-only list tags and personal checklist. */
(() => {
  'use strict';
  if (!location.pathname.startsWith('/keystatic') || document.getElementById('ed-dock')) return;

  const dock = document.createElement('aside');
  dock.id = 'ed-dock';
  dock.className = 'ed-dock';
  dock.setAttribute('aria-label', 'Eczacı Defteri editör araçları');
  dock.innerHTML = [
    '<section class="ed-dock__panel" id="ed-panel">',
      '<div class="ed-dock__header"><span class="ed-dock__logo"><img src="/favicon.svg" width="29" height="29" alt=""></span><div><div class="ed-dock__title">Editör Masası</div><div class="ed-dock__subtitle">İçerik kontrol ve yayın araçları</div></div></div>',
      '<div class="ed-dock__content">',
        '<p class="ed-dock__eyebrow">Yüklenen yazılar</p>',
        '<div class="ed-dock__summary"><div class="ed-dock__stat"><b class="ed-dock__number" id="ed-total">—</b><small>Toplam</small></div><div class="ed-dock__stat"><b class="ed-dock__number" id="ed-published">—</b><small>Yayında</small></div><div class="ed-dock__stat"><b class="ed-dock__number" id="ed-draft">—</b><small>Taslak</small></div></div>',
        '<p class="ed-dock__eyebrow">Görünen yazıları filtrele</p>',
        '<div class="ed-dock__filters"><button type="button" class="ed-dock__filter" data-ed-filter="all" aria-pressed="true">Tümü</button><button type="button" class="ed-dock__filter" data-ed-filter="published" aria-pressed="false">Yayında</button><button type="button" class="ed-dock__filter" data-ed-filter="draft" aria-pressed="false">Taslak</button></div>',
        '<p class="ed-dock__eyebrow">Hızlı erişim</p>',
        '<div class="ed-dock__links"><a class="ed-dock__link" data-ed-target="posts">Yazılar <span>↗</span></a><a class="ed-dock__link" data-ed-target="categories">Kategoriler <span>↗</span></a><a class="ed-dock__link" data-ed-target="site">Site ayarları <span>↗</span></a><a class="ed-dock__link" href="/" target="_blank" rel="noopener">Siteyi gör <span>↗</span></a></div>',
        '<p class="ed-dock__note">Sayılar panelde o anda yüklenmiş yazılara aittir. Filtre yalnızca liste görünümünü değiştirir; yayın durumuna dokunmaz.</p>',
        '<section class="ed-dock__check" id="ed-check" hidden><div class="ed-dock__check-header"><p class="ed-dock__eyebrow">Makale kontrol listesi</p><b id="ed-check-count" class="ed-dock__check-count">0/5</b></div><div id="ed-tasks" class="ed-dock__tasks"></div><p class="ed-dock__note">Bu işaretler yalnızca mevcut tarayıcıda tutulur; GitHub’a kaydedilmez.</p></section>',
      '</div>',
    '</section>',
    '<button class="ed-dock__toggle" id="ed-toggle" type="button" aria-expanded="false" aria-controls="ed-panel">☰ &nbsp; Editör Masası <kbd>Alt+E</kbd></button>'
  ].join('');

  document.body.appendChild(dock);
  const toggle = dock.querySelector('#ed-toggle');
  const filters = [...dock.querySelectorAll('[data-ed-filter]')];
  const total = dock.querySelector('#ed-total');
  const published = dock.querySelector('#ed-published');
  const drafts = dock.querySelector('#ed-draft');
  const section = dock.querySelector('#ed-check');
  const tasksElement = dock.querySelector('#ed-tasks');
  const taskCounter = dock.querySelector('#ed-check-count');
  const taskNames = ['Kapak görseli', 'Bilimsel kaynakça', 'SEO başlığı / açıklama', 'Dil ve bağlantılar', 'Son editoryal kontrol'];

  let opened = false, filter = 'all', activePost = null, lastRoute = '';
  function setOpen(value) {
    opened = Boolean(value);
    dock.setAttribute('aria-expanded', String(opened));
    toggle.setAttribute('aria-expanded', String(opened));
  }
  setOpen(false);
  toggle.addEventListener('click', () => setOpen(!opened));
  document.addEventListener('keydown', e => {
    const el = e.target;
    if (e.altKey && !e.ctrlKey && !e.metaKey && (e.key || '').toLowerCase() === 'e' &&
        !el.closest?.('input,textarea,[contenteditable="true"]')) {
      e.preventDefault(); setOpen(!opened);
    }
    if (e.key === 'Escape' && opened && dock.contains(document.activeElement)) {
      setOpen(false); toggle.focus();
    }
  });
  filters.forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.edFilter;
    filters.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    enhanceTable();
  }));

  const categoryLabels = {
    'vitaminler':'Vitaminler','mineraller':'Mineraller','dermokozmetik':'Dermokozmetik',
    'eczacilik':'Eczacılık','saglik-ve-bilim':'Sağlık ve Bilim',
    'takviye-edici-gidalar':'Takviye Edici Gıdalar',
    'bitkisel-ueruenler':'Bitkisel Ürünler','diger-takviyeler':'Diğer Takviyeler',
    'probiyotikler-ve-prebiyotikler':'Probiyotikler'
  };
  function enhanceTable() {
    const listPage = /\/collection\/posts\/?$/.test(location.pathname);
    document.body.classList.toggle('ed-admin-list', listPage);
    let rowsCount = 0, liveCount = 0, draftCount = 0;
    if (listPage) {
      for (const table of document.querySelectorAll('table,[role="grid"],[role="table"]')) {
        const heads = [...table.querySelectorAll('thead th,[role="columnheader"]')];
        if (!heads.length) continue;
        const statusAt = heads.findIndex(h => (h.textContent || '').toLocaleLowerCase('tr').includes('taslak'));
        const categoryAt = heads.findIndex(h => (h.textContent || '').toLocaleLowerCase('tr').includes('kategori'));
        if (statusAt < 0) continue;
        const rows = table.querySelectorAll('tbody tr,[role="row"]');
        for (const row of rows) {
          const cells = [...row.querySelectorAll(':scope > td,:scope > [role="gridcell"],:scope > [role="cell"]')];
          if (!cells.length || !cells[statusAt]) continue;
          const text = (cells[statusAt].textContent || '').trim().toLowerCase();
          if (text !== 'true' && text !== 'false') continue;
          const status = text === 'true' ? 'draft' : 'published';
          cells[statusAt].dataset.edStatus = status;
          cells[statusAt].setAttribute('aria-label', status === 'draft' ? 'Taslak' : 'Yayında');
          if (categoryAt >= 0 && cells[categoryAt]) {
            const cat = (cells[categoryAt].textContent || '').trim();
            if (categoryLabels[cat]) {
              cells[categoryAt].dataset.edCategory = categoryLabels[cat];
              cells[categoryAt].setAttribute('aria-label', categoryLabels[cat]);
            }
          }
          rowsCount++; if (status === 'draft') draftCount++; else liveCount++;
          row.classList.toggle('ed-hidden-by-filter', filter !== 'all' && filter !== status);
        }
      }
    }
    const currentValues = [listPage ? String(rowsCount) : '—', listPage ? String(liveCount) : '—', listPage ? String(draftCount) : '—'];
    [total, published, drafts].forEach((node, i) => {
      if (node.textContent !== currentValues[i]) node.textContent = currentValues[i];
    });
    filters.forEach(b => b.disabled = !listPage || rowsCount === 0);
  }

  function refreshNavigation() {
    const branch = location.pathname.match(/^\/keystatic\/branch\/([^/]+)/)?.[1] || 'main';
    const base = '/keystatic/branch/' + branch;
    const hrefs = { posts: base + '/collection/posts', categories: base + '/collection/categories', site: base + '/singleton/site' };
    for (const a of dock.querySelectorAll('[data-ed-target]')) a.href = hrefs[a.dataset.edTarget];

    const post = location.pathname.match(/\/collection\/posts\/item\/([^/]+)/)?.[1] || '';
    section.hidden = !post;
    if (post && post !== activePost) {
      activePost = post;
      tasksElement.replaceChildren();
      const key = 'eczacidefteri:checks:' + branch + ':' + post;
      let saved = {};
      try { saved = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch {}
      const checkboxes = [];
      function sync() { taskCounter.textContent = checkboxes.filter(x => x.checked).length + '/' + checkboxes.length; }
      for (const [i, labelText] of taskNames.entries()) {
        const label = document.createElement('label');
        const box = document.createElement('input');
        box.type = 'checkbox'; box.checked = Boolean(saved[i]);
        label.append(box, document.createTextNode(labelText));
        tasksElement.append(label); checkboxes.push(box);
        box.addEventListener('change', () => {
          const state = Object.fromEntries(checkboxes.map((x, k) => [k, x.checked]));
          try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
          sync();
        });
      }
      sync();
    }
  }

  function update() {
    if (location.pathname !== lastRoute) {
      lastRoute = location.pathname;
      refreshNavigation();
    }
    enhanceTable();
  }
  let scheduled = false;
  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; update(); });
  }
  const observer = new MutationObserver(scheduleUpdate);
  observer.observe(document.body, {subtree:true,childList:true});
  addEventListener('popstate', scheduleUpdate);
  addEventListener('hashchange', scheduleUpdate);
  update();
})();