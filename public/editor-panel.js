/* Eczacı Defteri Keystatic shortcut tray: no API calls or CMS writes. */
(() => {
  'use strict';
  if (!location.pathname.startsWith('/keystatic') || document.getElementById('ed-dock')) return;

  const dock = document.createElement('aside');
  dock.id = 'ed-dock';
  dock.className = 'ed-dock';
  dock.setAttribute('aria-label', 'Eczacı Defteri editör kısayolları');
  dock.innerHTML = [
    '<div class="ed-dock__panel" id="ed-dock-panel">',
      '<div class="ed-dock__header">',
        '<span class="ed-dock__logo"><img src="/favicon.svg" alt="" width="29" height="29"></span>',
        '<div><div class="ed-dock__title">Editör Masası</div><div class="ed-dock__sub">Eczacı Defteri · hızlı işlemler</div></div>',
      '</div>',
      '<div class="ed-dock__body">',
        '<p class="ed-dock__label">İçerik yönetimi</p>',
        '<div class="ed-dock__grid">',
          '<a class="ed-dock__link" data-target="posts"><strong>Yazılar</strong><small>Taslak / Yayında</small></a>',
          '<a class="ed-dock__link" data-target="categories"><strong>Kategoriler</strong><small>İçerik grupları</small></a>',
          '<a class="ed-dock__link" data-target="settings"><strong>Site ayarları</strong><small>Genel bilgiler</small></a>',
          '<a class="ed-dock__link" data-target="website" target="_blank" rel="noopener"><strong>Siteyi aç ↗</strong><small>Yeni sekmede</small></a>',
        '</div>',
        '<p class="ed-dock__hint"><b>Yayın durumu:</b> “Taslak mı?” sütununda <b>Evet</b> = Taslak, <b>Hayır</b> = Yayında.</p>',
        '<section class="ed-dock__check" id="ed-dock-check" hidden>',
          '<div class="ed-dock__check-head"><p class="ed-dock__label" style="margin:0">Editör kontrolü</p><span class="ed-dock__progress" id="ed-dock-progress">0/5</span></div>',
          '<div class="ed-dock__checks" id="ed-dock-checks"></div>',
          '<p class="ed-dock__note">İşaretler yalnızca bu tarayıcıda saklanır. GitHub kaydını veya yayın durumunu değiştirmez.</p>',
        '</section>',
      '</div>',
    '</div>',
    '<button id="ed-dock-toggle" class="ed-dock__toggle" type="button" aria-controls="ed-dock-panel" aria-expanded="false">',
      '☰ Editör araçları <span class="ed-dock__key">Alt+E</span>',
    '</button>'
  ].join('');
  document.body.appendChild(dock);

  const toggle = dock.querySelector('#ed-dock-toggle');
  const checkSection = dock.querySelector('#ed-dock-check');
  const checks = dock.querySelector('#ed-dock-checks');
  const progress = dock.querySelector('#ed-dock-progress');
  const tasks = [
    'Kapak görseli',
    'Bilimsel kaynakça',
    'SEO başlığı ve açıklama',
    'Yazım ve bağlantılar',
    'Son editoryal kontrol'
  ];

  let open = false;
  let currentPost = '';
  function setOpen(value) {
    open = !!value;
    dock.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-expanded', String(open));
  }
  setOpen(false);
  toggle.addEventListener('click', () => setOpen(!open));
  document.addEventListener('keydown', event => {
    if (event.altKey && !event.ctrlKey && !event.metaKey && event.key.toLowerCase() === 'e') {
      event.preventDefault();
      setOpen(!open);
    } else if (event.key === 'Escape' && open && dock.contains(document.activeElement)) {
      setOpen(false);
      toggle.focus();
    }
  });

  function refreshNavigation() {
    const branchMatch = location.pathname.match(/^\/keystatic\/branch\/([^/]+)/);
    const branch = branchMatch ? branchMatch[1] : 'main';
    const prefix = '/keystatic/branch/' + branch;
    const hrefs = {
      posts: prefix + '/collection/posts',
      categories: prefix + '/collection/categories',
      settings: prefix + '/singleton/site',
      website: '/'
    };

    for (const link of dock.querySelectorAll('[data-target]')) {
      const type = link.getAttribute('data-target');
      link.setAttribute('href', hrefs[type]);
      link.classList.toggle('is-active', type !== 'website' && location.pathname.startsWith(hrefs[type]));
    }

    const match = location.pathname.match(/^\/keystatic\/branch\/[^/]+\/collection\/posts\/item\/([^/]+)/);
    const post = match ? decodeURIComponent(match[1]) : '';
    checkSection.hidden = !post;
    if (!post || post === currentPost) return;
    currentPost = post;
    checks.replaceChildren();

    const key = 'eczaci-editor-checklist:' + post;
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch { saved = {}; }
    const inputs = [];
    function updateProgress() {
      progress.textContent = inputs.filter(x => x.checked).length + '/' + inputs.length;
    }

    tasks.forEach((title, index) => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = !!saved[index];
      const name = document.createElement('span');
      name.textContent = title;
      label.append(checkbox, name);
      checks.append(label);
      inputs.push(checkbox);
      checkbox.addEventListener('change', () => {
        const next = Object.fromEntries(inputs.map((input, i) => [i, input.checked]));
        try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* optional */ }
        updateProgress();
      });
    });
    updateProgress();
  }

  let lastPath = location.pathname;
  new MutationObserver(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      refreshNavigation();
    }
  }).observe(document.body, {childList: true, subtree: true});
  addEventListener('popstate', refreshNavigation);
  addEventListener('hashchange', refreshNavigation);
  refreshNavigation();
})();