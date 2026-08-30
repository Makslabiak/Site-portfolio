(function () {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  let isLeaving = false;

  // "Первый заход" определяем через sessionStorage: пока вкладка открыта,
  // любая следующая страница считается переходом внутри сайта, даже если
  // она открыта не кликом по ссылке (адресная строка, "назад/вперёд" и т.д.)
  let isFirstVisit = true;
  try {
    isFirstVisit = sessionStorage.getItem('portfolio-visited') !== '1';
    sessionStorage.setItem('portfolio-visited', '1');
  } catch (error) {
    isFirstVisit = true;
  }

  const style = document.createElement('style');
  style.textContent = `
    .page-loader {
      position: fixed; inset: 0; z-index: 2147482000;
      display: grid; place-items: center;
      background: var(--page-loader-bg);
      color: var(--page-loader-color);
      opacity: 1; visibility: visible;
      transition: opacity .62s cubic-bezier(.22,1,.36,1), visibility 0s;
    }
    .page-loader__center { display:flex; flex-direction:column; align-items:center; gap:15px; perspective: 300px; }
    .page-loader__logo {
      display:block; width: 26px; height: 26px; object-fit:contain;
      filter: var(--page-loader-logo-filter);
      opacity: 0; translate: 0 9px; scale: .92;
      animation: loader-mark-in .62s .08s cubic-bezier(.22,1,.36,1) forwards,
        loader-logo-flip 1.5s linear infinite;
    }
    .page-loader__name {
      font: 400 20px/1 "DM Sans", Arial, sans-serif;
      letter-spacing: .02em; opacity: 0; translate: 0 7px;
      animation: loader-mark-in .62s .16s cubic-bezier(.22,1,.36,1) forwards;
    }
    .page-loader.is-hidden { opacity:0; visibility:hidden; transition-delay:0s,.62s; }
    .page-content-ready body > *:not(.page-loader) { animation:page-content-in .5s cubic-bezier(.22,1,.36,1); }
    .page-is-leaving body > *:not(.page-loader) {
      opacity: 0 !important; transform: translate3d(0,-8px,0) !important;
      transition: opacity .35s ease, transform .35s cubic-bezier(.4,0,.2,1) !important;
    }
    @keyframes loader-mark-in { to { opacity:1; translate:0 0; scale:1; } }
    @keyframes loader-logo-flip { to { rotate: y 360deg; } }
    @keyframes page-content-in { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
    @media (prefers-reduced-motion: reduce) {
      .page-loader,.page-loader *,.page-content-ready body > * { animation:none!important; transition:none!important; transform:none!important; translate:none!important; scale:none!important; rotate:none!important; }
    }
    html.page-loader-active { overflow: hidden; }
  `;
  document.head.appendChild(style);

  if (isFirstVisit) {
    // Полноценный лоадер: только при первом заходе на сайт за сессию
    const startedAt = performance.now();
    root.classList.add('page-loader-active');

    const background = getComputedStyle(body).backgroundColor || '#ffffff';
    const rgb = background.match(/[\d.]+/g);
    const isDark = rgb && rgb.length >= 3
      ? (Number(rgb[0]) * 0.299 + Number(rgb[1]) * 0.587 + Number(rgb[2]) * 0.114) < 140
      : false;

    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.setAttribute('aria-hidden', 'true');
    loader.style.setProperty('--page-loader-bg', background);
    loader.style.setProperty('--page-loader-color', isDark ? '#ffffff' : '#080808');
    loader.style.setProperty('--page-loader-logo-filter', isDark ? 'none' : 'invert(1)');
    loader.innerHTML = '<div class="page-loader__center"><img class="page-loader__logo" src="image/shared/Logo.svg" alt=""><span class="page-loader__name">Maksim Labiak</span></div>';
    body.appendChild(loader);
    root.classList.remove('loader-pending');

    const minimumVisibleTime = 2000;
    window.setTimeout(() => {
      loader.classList.add('is-hidden');
      root.classList.add('page-content-ready');
      root.classList.remove('page-loader-active');
      window.dispatchEvent(new Event('page-loader:hide'));
    }, Math.max(0, minimumVisibleTime - (performance.now() - startedAt)));
  } else {
    // Переход внутри сайта: без лоадера, просто плавное появление контента
    root.classList.remove('loader-pending');
    root.classList.add('page-content-ready');
    window.dispatchEvent(new Event('page-loader:hide'));
  }

  function isInternalPageLink(link, event) {
    if (event.defaultPrevented || event.button !== 0) return false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (link.target && link.target !== '_self') return false;
    if (link.hasAttribute('download')) return false;
    const rawHref = link.getAttribute('href');
    if (!rawHref || rawHref.startsWith('#')) return false;
    const destination = new URL(link.href, location.href);
    if (destination.origin !== location.origin) return false;
    if (destination.pathname === location.pathname && destination.search === location.search) return false;
    return destination.pathname === '/' || /^\/case-[a-z0-9-]+\/?$/i.test(destination.pathname);
  }

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const link = target && target.closest('a');
    if (!link || isLeaving || !isInternalPageLink(link, event)) return;
    event.preventDefault();
    isLeaving = true;
    root.classList.add('page-is-leaving');
    window.setTimeout(() => location.assign(link.href), 350);
  });

  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    isLeaving = false;
    root.classList.remove('page-is-leaving');
    root.classList.add('page-content-ready');
  });
})();
