/* Keystatic editorial analytics v6. Runs only in the admin frontend. */
(() => {
  'use strict';
  if (!location.pathname.startsWith('/keystatic') || window.__eczaciSeoDashboardV6) return;
  window.__eczaciSeoDashboardV6 = true;

  const API = '/api/editor-overview.json';
  const GSC = 'https://search.google.com/search-console/performance/search-analytics';
  let reportPromise = null;
  let report = null;
  let csvReport = null;
  let queryFilter = '';
  let lastPath = '';

  const escapeHtml = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
  const formatInt = n => new Intl.NumberFormat('tr-TR').format(Number(n) || 0);
  const pct = (part, total) => total ? Math.round(100 * part / total) : 0;
  function loadOverview() {
    if (!reportPromise) reportPromise = fetch(API, {credentials:'same-origin'})
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(data => { report = data; return data; });
    return reportPromise;
  }
  function isDashboard() {
    return /^\/keystatic(?:\/branch\/[^/]+)?\/?$/.test(location.pathname);
  }
  function editorBase() {
    const m = location.pathname.match(/^\/keystatic\/branch\/([^/]+)/);
    return '/keystatic/branch/' + (m ? m[1] : 'main');
  }

  const frame = () => [
    '<section class="ed-analytics" aria-label="Icerik ve SEO kontrol merkezi">',
      '<div class="ed-analytics__heading">',
        '<div><div class="ed-analytics__eyebrow">ECZACI DEFTER\u0130 / Y\u00d6NET\u0130M</div>',
          '<h2>\u0130\u00e7erik ve SEO Kontrol Merkezi</h2>',
          '<p>Yay\u0131n durumu, i\u00e7erik kalitesi ve Google arama performans\u0131 tek ekranda.</p>',
        '</div>',
        '<div class="ed-analytics__actions">',
          '<a class="ed-analytics__button ed-analytics__button--quiet" href="' + GSC + '" target="_blank" rel="noopener noreferrer">Search Console &#8599;</a>',
          '<a class="ed-analytics__button" href="' + editorBase() + '/collection/posts">Yaz\u0131lar\u0131 y\u00f6net &#8594;</a>',
        '</div>',
      '</div>',
      '<div id="ed-overview" class="ed-analytics__loading" role="status">\u0130\u00e7erik verileri okunuyor...</div>',
      '<div class="ed-analytics__layout">',
        '<section class="ed-analytics__panel">',
          '<div class="ed-analytics__panelhead"><div><span class="ed-analytics__kicker">\u0130\u00c7ER\u0130K STRATEJ\u0130S\u0130</span><h3>Hedeflenen konular</h3></div><span class="ed-analytics__subtle">Ba\u015fl\u0131k ve metadata</span></div>',
          '<p class="ed-analytics__helper">Buradaki konular makale ba\u015fl\u0131klar\u0131ndan gelir; Google s\u0131ralamas\u0131 de\u011fildir.</p>',
          '<label class="ed-analytics__search"><span class="ed-sr">Yaz\u0131larda ara</span><input type="search" id="ed-article-search" placeholder="Konu veya makale ara..." autocomplete="off"></label>',
          '<div id="ed-topic-list" class="ed-analytics__topic-list"></div>',
        '</section>',
        '<section class="ed-analytics__panel ed-analytics__panel--gsc">',
          '<div class="ed-analytics__panelhead"><div><span class="ed-analytics__kicker">GER\u00c7EK GOOGLE VER\u0130LER\u0130</span><h3>Anahtar kelime performans\u0131</h3></div></div>',
          '<p class="ed-analytics__helper">Google Search Console &gt; Performans &gt; Arama sonu\u00e7lar\u0131 &gt; Sorgular tablosunu CSV olarak d\u0131\u015fa aktar, buraya y\u00fckle.</p>',
          '<div class="ed-analytics__gsc-upload"><input type="file" id="ed-gsc-file" accept=".csv,text/csv" hidden><button type="button" id="ed-gsc-upload">CSV raporu se\u00e7</button>',
            '<span>Dosya yaln\u0131zca bu taray\u0131c\u0131da i\u015flenir; sunucuya y\u00fcklenmez.</span></div>',
          '<div id="ed-gsc-results" aria-live="polite" class="ed-analytics__gsc-results">',
            '<div class="ed-analytics__empty"><b>Hen\u00fcz Search Console raporu yok.</b><p>Ger\u00e7ek sorgular\u0131n t\u0131klama, g\u00f6sterim, TO ve ortalama konum bilgileri burada g\u00f6r\u00fcnecek. S\u0131ralama tahmin edilmiyor.</p></div>',
          '</div>',
        '</section>',
      '</div>',
      '<p class="ed-analytics__footnote" id="ed-data-date"></p>',
    '</section>'
  ].join('');

  function createDashboard() {
    if (!isDashboard()) return;
    const main = document.querySelector('[data-split-pane="secondary"] main');
    if (!main || main.querySelector(':scope > .ed-analytics')) return;
    const section = document.createElement('div');
    section.className = 'ed-analytics';
    section.innerHTML = frame();
    const header = main.querySelector(':scope > header');
    if (header) header.insertAdjacentElement('afterend', section);
    else main.prepend(section);
    setupEvents(section);
    if (report) drawOverview(section, report);
    else loadOverview().then(data => {
      if (section.isConnected) drawOverview(section, data);
    }).catch(() => {
      const el = section.querySelector('#ed-overview');
      if (el) el.innerHTML = '<p>\u0130\u00e7erik \u00f6zeti y\u00fcklenemedi. Hostinger da\u011f\u0131t\u0131m\u0131ndan sonra sayfay\u0131 yenile.</p>';
    });
    if (csvReport) drawGsc(section);
  }

  function metric(label, value, info) {
    return '<div class="ed-analytics__stat"><div>' + escapeHtml(label) +
      '</div><strong>' + formatInt(value) + '</strong><small>' + escapeHtml(info || '') + '</small></div>';
  }
  function drawOverview(root, data) {
    const s = data.summary;
    const overview = root.querySelector('#ed-overview');
    if (!overview) return;
    overview.className = 'ed-analytics__summary';
    overview.innerHTML = '<div class="ed-analytics__stats">' +
      metric('Toplam makale', s.total, 'Son derleme') +
      metric('Yay\u0131nda', s.published, pct(s.published, s.total) + '%') +
      metric('Taslak', s.draft, 'Ziyaret\u00e7ilere kapal\u0131') +
      metric('Kapakl\u0131 yaz\u0131', s.cover, s.published ? pct(s.cover, s.published) + '% yayinda' : '') +
      '</div>' +
      '<div class="ed-analytics__insights">' +
        '<div class="ed-analytics__insight"><b>SEO ba\u015fl\u0131\u011f\u0131</b><strong>' + formatInt(s.customSeoTitle) + '/' + formatInt(s.published) + '</strong><span>\u00d6zel ba\u015fl\u0131k girilmi\u015f</span></div>' +
        '<div class="ed-analytics__insight"><b>Meta a\u00e7\u0131klamas\u0131</b><strong>' + formatInt(s.customSeoDescription) + '/' + formatInt(s.published) + '</strong><span>\u00d6zel a\u00e7\u0131klama girilmi\u015f</span></div>' +
        '<div class="ed-analytics__insight"><b>Kaynak\u00e7al\u0131 makale</b><strong>' + formatInt(s.references) + '/' + formatInt(s.published) + '</strong><span>En az bir bilimsel kaynak</span></div>' +
        '<div class="ed-analytics__insight"><b>Metin i\u00e7i ba\u011flant\u0131</b><strong>' + formatInt(s.contextualLinks) + '/' + formatInt(s.published) + '</strong><span>\u0130lgili i\u00e7eri\u011fe ba\u011flant\u0131</span></div>' +
      '</div>' +
      '<div class="ed-analytics__categories"><div class="ed-analytics__smalltitle">KATEGOR\u0130 DA\u011eILIMI (YAYINDA)</div><div class="ed-analytics__bars">' +
        data.categories.map(c => {
          const width = Math.max(4, pct(c.count, s.published));
          return '<div class="ed-analytics__barrow"><span>' + escapeHtml(c.name) +
            '</span><div class="ed-analytics__bartrack"><i style="width:' + width + '%"></i></div><b>' +
            formatInt(c.count) + '</b></div>';
        }).join('') + '</div></div>';
    const date = root.querySelector('#ed-data-date');
    if (date) date.textContent = '\u0130\u00e7erik metrikleri son Hostinger derlemesine aittir. G\u00fcncellenme: ' +
      new Date(data.generatedAt).toLocaleString('tr-TR') +
      '. Search Console verileri yalnizca CSV y\u00fcklendiginde gosterilir.';
    drawTopics(root, data);
  }

  function drawTopics(root, data) {
    const target = root.querySelector('#ed-topic-list');
    if (!target) return;
    const search = (root.querySelector('#ed-article-search')?.value || '')
      .toLocaleLowerCase('tr-TR').trim();
    const filtered = data.articles.filter(a => !search ||
      (a.title + ' ' + a.category + ' ' + a.excerpt).toLocaleLowerCase('tr-TR').includes(search));
    target.innerHTML = !filtered.length
      ? '<div class="ed-analytics__empty">E\u015fle\u015fen yaz\u0131 bulunamad\u0131.</div>'
      : filtered.slice(0, 35).map(a => {
        const weak = [];
        if (!a.cover) weak.push('Kapak eksik');
        if (!a.seoDescription) weak.push('\u00d6zel meta yok');
        if (!a.contextualLinks) weak.push('\u0130\u00e7 ba\u011flant\u0131 yok');
        const href = editorBase() + '/collection/posts/item/' + encodeURIComponent(a.slug);
        return '<a class="ed-analytics__topic" href="' + escapeHtml(href) + '">' +
          '<span><b>' + escapeHtml(a.title) + '</b><small>' + escapeHtml(a.category) +
          ' \u00b7 ' + a.references + ' kaynak</small></span>' +
          '<span class="ed-analytics__topicflags">' + (weak.length
            ? '<em>' + escapeHtml(weak.slice(0,2).join(' / ')) + '</em>'
            : '<em class="ed-analytics__ok">Temel alanlar dolu</em>') + '</span></a>';
      }).join('');
  }

  function parseCsv(text) {
    const first = (text.replace(/^\uFEFF/,'').split(/\r?\n/)[0] || '');
    const delimiter = [';', ',', '\t'].sort((a,b) => first.split(b).length - first.split(a).length)[0];
    let cur = '', cells = [], records = [], quoted = false;
    const src = text.replace(/^\uFEFF/,'');
    for (let i = 0; i < src.length; i++) {
      const c = src[i];
      if (c === '"') {
        if (quoted && src[i+1] === '"') { cur += '"'; i++; } else quoted = !quoted;
      } else if (c === delimiter && !quoted) {
        cells.push(cur); cur = '';
      } else if ((c === '\n' || c === '\r') && !quoted) {
        if (c === '\r' && src[i+1] === '\n') i++;
        cells.push(cur);
        if (cells.some(v => v.trim())) records.push(cells);
        cells = []; cur = '';
      } else cur += c;
    }
    cells.push(cur);
    if (cells.some(v => v.trim())) records.push(cells);
    return records;
  }
  function normalize(value) {
    return String(value || '').toLocaleLowerCase('tr-TR')
      .replace(/\u0131/g, 'i').normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
  }
  function numberValue(value) {
    let s = String(value || '').trim().replace(/[%\s\u00A0]/g,'');
    const comma = s.lastIndexOf(','), dot = s.lastIndexOf('.');
    if (comma >= 0 && dot >= 0) {
      s = comma > dot ? s.replace(/\./g,'').replace(',','.') : s.replace(/,/g,'');
    } else if (comma >= 0) {
      s = /^\d{1,3}(,\d{3})+$/.test(s) ? s.replace(/,/g,'') : s.replace(',','.');
    } else if (dot >= 0 && /^\d{1,3}(\.\d{3})+$/.test(s)) {
      s = s.replace(/\./g,'');
    }
    return Number(s);
  }
  function readGscCsv(text) {
    const rows = parseCsv(text);
    if (rows.length < 2) throw new Error('CSV bo\u015f veya ba\u015fl\u0131k sat\u0131r\u0131 eksik.');
    const heads = rows[0].map(normalize);
    const find = a => heads.findIndex(h => a.includes(h));
    const q = find(['topqueries','queries','query','sorgular','sorgu','encokyapilansorgular','ensiksorgulananlar','arama sorgulari'.replace(/ /g,'')]);
    const clicks = find(['clicks','click','tiklamalar','tiklama']);
    const imp = find(['impressions','impression','gosterimler','gosterim']);
    const pos = find(['position','averageposition','avgposition','konum','ortalamakonum']);
    if (q < 0 || clicks < 0 || imp < 0 || pos < 0) {
      throw new Error('Sorgular, T\u0131klamalar, G\u00f6sterimler ve Konum s\u00fctunlar\u0131n\u0131 i\u00e7eren Search Console CSV dosyas\u0131n\u0131 se\u00e7.');
    }
    const data = rows.slice(1).map(row => ({
      query: (row[q] || '').trim(),
      clicks: numberValue(row[clicks]),
      impressions: numberValue(row[imp]),
      position: numberValue(row[pos])
    })).filter(r => r.query && [r.clicks,r.impressions,r.position].every(Number.isFinite));
    if (!data.length) throw new Error('Ge\u00e7erli anahtar kelime sat\u0131r\u0131 bulunamad\u0131.');
    data.sort((a,b) => b.impressions - a.impressions);
    return data;
  }
  function drawGsc(root) {
    const slot = root.querySelector('#ed-gsc-results');
    if (!slot || !csvReport) return;
    const filtered = csvReport.filter(r => r.query.toLocaleLowerCase('tr-TR')
      .includes(queryFilter.toLocaleLowerCase('tr-TR')));
    const clk = csvReport.reduce((s,r)=>s+r.clicks,0);
    const imp = csvReport.reduce((s,r)=>s+r.impressions,0);
    const weighted = csvReport.reduce((s,r)=>s+r.position*r.impressions,0);
    slot.innerHTML = '<div class="ed-analytics__gsc-stats">' +
      metric('T\u0131klama', clk, 'CSV sorgulari') +
      metric('G\u00f6sterim', imp, 'CSV sorgulari') +
      '<div class="ed-analytics__stat"><div>Ort. konum</div><strong>' + (imp ? (weighted/imp).toFixed(1) : '-') + '</strong><small>G\u00f6sterim agirlikli</small></div>' +
      '<div class="ed-analytics__stat"><div>TO</div><strong>' + (imp ? (100*clk/imp).toFixed(1) + '%' : '-') + '</strong><small>T\u0131klama / gosterim</small></div></div>' +
      '<label class="ed-analytics__search"><span class="ed-sr">Sorgularda ara</span><input type="search" id="ed-gsc-search" placeholder="Google sorgusu ara..." value="' + escapeHtml(queryFilter) + '"></label>' +
      '<div class="ed-analytics__table-wrap"><table><thead><tr><th>Sorgu</th><th>T\u0131klama</th><th>G\u00f6sterim</th><th>Konum</th></tr></thead><tbody>' +
      filtered.slice(0,40).map(r=>'<tr><td>' + escapeHtml(r.query) + '</td><td>' + formatInt(r.clicks) +
        '</td><td>' + formatInt(r.impressions) + '</td><td>' + r.position.toFixed(1) + '</td></tr>').join('') +
      '</tbody></table></div>' +
      '<p class="ed-analytics__helper">' + filtered.length + ' sorgu eslesiyor. Ortalama konum, sorgular icin gosterim agirlikli hesaplanir; bir URL siralamas\u0131 degildir.</p>';
    const search = root.querySelector('#ed-gsc-search');
    if (search) search.addEventListener('input', () => {
      queryFilter = search.value;
      drawGsc(root);
      const node = root.querySelector('#ed-gsc-search');
      node?.focus();
      node?.setSelectionRange(queryFilter.length,queryFilter.length);
    });
  }
  function setupEvents(root) {
    root.querySelector('#ed-article-search')?.addEventListener('input', () => {
      if (report) drawTopics(root, report);
    });
    const input = root.querySelector('#ed-gsc-file');
    root.querySelector('#ed-gsc-upload')?.addEventListener('click', () => input?.click());
    input?.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) return;
      const slot = root.querySelector('#ed-gsc-results');
      try {
        if (file.size > 5_000_000) throw new Error('L\u00fctfen 5 MB alt\u0131nda bir CSV se\u00e7.');
        csvReport = readGscCsv(await file.text());
        queryFilter = '';
        drawGsc(root);
      } catch (err) {
        if (slot) slot.innerHTML = '<div class="ed-analytics__error">' + escapeHtml(err.message) + '</div>';
      }
      input.value = '';
    });
  }

  let scheduled = false;
  function check() {
    if (lastPath !== location.pathname) lastPath = location.pathname;
    createDashboard();
  }
  new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; check(); });
  }).observe(document.body, {childList:true,subtree:true});
  addEventListener('popstate', check);
  check();
})();