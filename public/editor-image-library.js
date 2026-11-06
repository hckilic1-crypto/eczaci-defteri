/* Existing Eczacı Defteri images inside the Keystatic SEO collection. */
(() => {
  'use strict';
  if (!location.pathname.startsWith('/keystatic')) return;

  let inventory = null;
  let request = null;
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  })[c]);
  const isGallery = () => /\/collection\/imageSeo\/?$/.test(location.pathname);
  const base = () => {
    const m = location.pathname.match(/^\/keystatic\/branch\/([^/]+)/);
    return '/keystatic/branch/' + (m ? m[1] : 'main');
  };

  function load() {
    if (!request) request = fetch('/api/editor-images.json', {credentials:'same-origin'})
      .then(res => { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
      .then(data => { inventory = data; return data; })
      .catch(err => { request = null; throw err; });
    return request;
  }

  function paint(panel) {
    const list = panel.querySelector('#ed-media-grid');
    const count = panel.querySelector('#ed-media-count');
    if (!list || !inventory) return;
    const term = (panel.querySelector('#ed-media-query')?.value || '').toLocaleLowerCase('tr-TR').trim();
    const mode = panel.querySelector('#ed-media-kind')?.value || 'all';
    const items = inventory.items.filter(item =>
      (mode === 'all' || (mode === 'cover' ? item.type === 'Kapak görseli' : item.type === 'Yazı içi görsel')) &&
      (!term || item.path.toLocaleLowerCase('tr-TR').includes(term))
    );
    if (count) count.textContent = items.length + ' / ' + inventory.total + ' görsel';
    list.innerHTML = items.length ? items.map(item =>
      '<article class="ed-media-card">' +
        '<div class="ed-media-preview"><img loading="lazy" src="' + escapeHtml(item.path) + '" alt=""></div>' +
        '<div class="ed-media-cardbody">' +
        '<span class="ed-media-type">' + escapeHtml(item.type) + '</span>' +
        '<strong title="' + escapeHtml(item.name) + '">' + escapeHtml(item.name) + '</strong>' +
        '<small title="' + escapeHtml(item.path) + '">' + escapeHtml(item.path) + '</small>' +
        '<div class="ed-media-actions">' +
        '<button type="button" data-copy-path="' + escapeHtml(item.path) + '">Yolu kopyala</button>' +
        (item.seoSlug
          ? '<a href="' + escapeHtml(base() + '/collection/imageSeo/item/' + encodeURIComponent(item.seoSlug)) + '">SEO düzenle</a>'
          : '<span class="ed-media-unset">SEO kaydı yok</span>') +
        '</div></div></article>'
    ).join('') : '<div class="ed-media-empty">Eşleşen görsel bulunamadı.</div>';
  }

  function mount() {
    if (!isGallery()) return;
    const main = document.querySelector('[data-split-pane="secondary"] main') || document.querySelector('main');
    if (!main || main.querySelector('#ed-media-library')) return;
    const panel = document.createElement('section');
    panel.id = 'ed-media-library';
    panel.className = 'ed-media-library';
    panel.innerHTML =
      '<div class="ed-media-heading"><div><span>ECZACI DEFTERİ / MEDYA KÜTÜPHANESİ</span>' +
      '<h2>Mevcut görseller</h2><p>Kapak ve yazı içi görselleri otomatik listelenir. Yeni SEO kaydı için üstteki Add butonunu kullan; önce görsel yolunu kopyala.</p></div>' +
      '<b id="ed-media-count">Yükleniyor...</b></div>' +
      '<div class="ed-media-filters"><input id="ed-media-query" type="search" placeholder="Dosya adı veya klasör ara..." aria-label="Görsel ara">' +
      '<select id="ed-media-kind" aria-label="Görsel türü"><option value="all">Tüm görseller</option><option value="cover">Kapak görselleri</option><option value="upload">Yazı içi görseller</option></select></div>' +
      '<div class="ed-media-grid" id="ed-media-grid"><div class="ed-media-empty">Görseller yükleniyor...</div></div>';
    const header = main.querySelector(':scope > header');
    if (header) header.insertAdjacentElement('afterend', panel);
    else main.prepend(panel);
    panel.querySelector('#ed-media-query')?.addEventListener('input', () => paint(panel));
    panel.querySelector('#ed-media-kind')?.addEventListener('change', () => paint(panel));
    panel.addEventListener('click', event => {
      const button = event.target.closest('[data-copy-path]');
      if (!button) return;
      const value = button.getAttribute('data-copy-path');
      navigator.clipboard.writeText(value).then(() => {
        button.textContent = 'Kopyalandı';
        button.focus();
      }).catch(() => {
        const input = panel.querySelector('#ed-media-query');
        if (input) { input.value = value; input.select(); }
        button.textContent = 'Yolu arama alanından kopyala';
      });
    });
    if (inventory) paint(panel);
    else load().then(() => { if (panel.isConnected) paint(panel); }).catch(() => {
      const list = panel.querySelector('#ed-media-grid');
      if (list) list.innerHTML = '<div class="ed-media-empty">Görsel listesi yüklenemedi. Hostinger yeni sürümü dağıttıktan sonra sayfayı yenile.</div>';
    });
  }

  let scheduled = false;
  new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; mount(); });
  }).observe(document.body, {childList: true, subtree: true});
  addEventListener('popstate', mount);
  mount();
})();
