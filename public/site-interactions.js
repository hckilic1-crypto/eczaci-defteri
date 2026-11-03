/* Shared site interactions. Cached across page navigation. */
(function () {
"use strict";

  (() => {
    const root = document.documentElement;
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    const sync = () => {
      const dark = root.dataset.theme === 'dark';
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'Açık temaya geç' : 'Koyu temaya geç');
      button.title = dark ? 'Açık temaya geç' : 'Koyu temaya geç';
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', dark ? '#0b0b0d' : '#f7f4ea');
    };
    button.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('ed-theme', next); } catch (_) {}
      sync();
    });
    sync();
  })();



  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const desktopFlyouts = [...document.querySelectorAll('.edf-nav details.edf-flyout')];

  const closeMobile = () => {
    mobileMenu?.classList.remove('is-open');
    menuButton?.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded','false');
    document.body.classList.remove('menu-open');
  };
  menuButton?.addEventListener('click', () => {
    const open = !mobileMenu?.classList.contains('is-open');
    mobileMenu?.classList.toggle('is-open', open);
    menuButton?.classList.toggle('is-open', open);
    menuButton?.setAttribute('aria-expanded',String(open));
    document.body.classList.toggle('menu-open',open);
    if (open) desktopFlyouts.forEach(x => x.open = false);
  });
  mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click',closeMobile));
  desktopFlyouts.forEach(current => current.addEventListener('toggle', () => {
    if(current.open) desktopFlyouts.filter(other => other !== current).forEach(other => other.open = false);
  }));
  document.addEventListener('pointerdown', event => {
    if (!event.target?.closest?.('.edf-flyout')) desktopFlyouts.forEach(x=>x.open=false);
  });
  document.addEventListener('keydown', event => {
    if(event.key==='Escape') {
      desktopFlyouts.forEach(x=>x.open=false);
      closeMobile();
    }
  });
  window.addEventListener('resize',()=>{
    if(window.innerWidth>1080) closeMobile();
    else desktopFlyouts.forEach(x=>x.open=false);
  });




  let posts = [];
  let indexPromise = null;

  // Fetch once only when somebody searches; don't repeat the entire index in every page.
  const ensureSearchIndex = () => {
    if (!indexPromise) {
      indexPromise = fetch('/search-index.json', { credentials: 'same-origin' })
        .then(response => {
          if (!response.ok) throw new Error('Arama dizini yüklenemedi');
          return response.json();
        })
        .then(data => {
          if (!Array.isArray(data)) throw new Error('Arama dizini geçersiz');
          posts = data;
        })
        .catch(error => {
          indexPromise = null; // Retrying is possible after a temporary network failure.
          throw error;
        });
    }
    return indexPromise;
  };

  const searchAndRender = async (value, container, input) => {
    if (!container || !value.trim()) {
      if (container) container.innerHTML = '';
      return;
    }
    if (!posts.length) container.textContent = 'Arama yükleniyor…';
    try {
      await ensureSearchIndex();
      // Ignore stale responses while the person is still typing.
      if (input.value !== value) return;
      renderResults(filterPosts(value), container);
    } catch {
      if (input.value === value) container.textContent = 'Arama şu anda yüklenemiyor. Tekrar deneyin.';
    }
  };


  const normalizeText = (value) => {
    return String(value ?? '')
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      );
  };


  const escapeHTML = (value) => {
    return String(value ?? '')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');
  };


  const filterPosts = (query) => {

    const search =
      normalizeText(
        query.trim()
      );

    if(!search){
      return [];
    }

    return posts
      .filter((post) => {

        const content =
          normalizeText(
            `${post.title} ${post.excerpt} ${post.category}`
          );

        return content.includes(
          search
        );

      })
      .slice(0,8);

  };


  const renderResults = (
    foundPosts,
    container
  ) => {

    if(!container){
      return;
    }

    if(!foundPosts.length){

      container.innerHTML = `
        <div class="search-empty">
          Sonuç bulunamadı.
        </div>
      `;

      return;
    }

    container.innerHTML =
      foundPosts
        .map((post) => {
          return `
            <a
              class="search-result-item"
              href="${escapeHTML(post.href)}"
            >
              <div>

                <span
                  class="search-result-category"
                >
                  ${escapeHTML(post.category)}
                </span>

                <strong>
                  ${escapeHTML(post.title)}
                </strong>

                <p>
                  ${escapeHTML(post.excerpt)}
                </p>

              </div>

              <span
                class="search-result-arrow"
              >
                →
              </span>

            </a>
          `;
        })
        .join('');

  };


  /* DESKTOP SEARCH */

  const searchTrigger =
    document.getElementById(
      'search-trigger'
    );

  const searchOverlay =
    document.getElementById(
      'search-overlay'
    );

  const searchClose =
    document.getElementById(
      'search-close'
    );

  const searchInput =
    document.getElementById(
      'search-input'
    );

  const searchResults =
    document.getElementById(
      'search-results'
    );


  const openSearch = () => {

    searchOverlay?.classList.add(
      'is-open'
    );

    searchOverlay?.setAttribute(
      'aria-hidden',
      'false'
    );

    document.body.classList.add(
      'search-open'
    );

    setTimeout(() => {
      searchInput?.focus();
    },50);

  };


  const closeSearch = () => {

    searchOverlay?.classList.remove(
      'is-open'
    );

    searchOverlay?.setAttribute(
      'aria-hidden',
      'true'
    );

    document.body.classList.remove(
      'search-open'
    );

    if(searchInput){
      searchInput.value = '';
    }

    if(searchResults){
      searchResults.innerHTML = '';
    }

  };


  searchTrigger?.addEventListener(
    'click',
    openSearch
  );

  searchClose?.addEventListener(
    'click',
    closeSearch
  );


  searchOverlay?.addEventListener(
    'click',
    (event) => {

      if(
        event.target ===
        searchOverlay
      ){
        closeSearch();
      }

    }
  );


  document.addEventListener(
    'keydown',
    (event) => {

      if(event.key === 'Escape'){
        closeSearch();
      }

    }
  );


  searchInput?.addEventListener(
    'input',
    (event) => {

      const target =
        event.target;

      const value =
        target instanceof HTMLInputElement
          ? target.value
          : '';

      if(!value.trim()){

        if(searchResults){
          searchResults.innerHTML = '';
        }

        return;
      }

      searchAndRender(value,searchResults,target);

    }
  );


  /* MOBILE SEARCH */

  const mobileSearchInput =
    document.getElementById(
      'mobile-search-input'
    );

  const mobileSearchResults =
    document.getElementById(
      'mobile-search-results'
    );


  mobileSearchInput?.addEventListener(
    'input',
    (event) => {

      const target =
        event.target;

      const value =
        target instanceof HTMLInputElement
          ? target.value
          : '';

      if(!value.trim()){

        if(mobileSearchResults){
          mobileSearchResults.innerHTML = '';
        }

        return;
      }

      searchAndRender(value,mobileSearchResults,target);

    }
  );


})();
