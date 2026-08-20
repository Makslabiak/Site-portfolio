(function () {
  'use strict';

  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!menuToggle || !mobileMenu) return;
  mobileMenu.setAttribute('aria-hidden', 'true');

  function setMenu(open) {
    document.documentElement.classList.toggle('menu-open', open);
    document.querySelector('.nav')?.classList.remove('header-hidden');
    menuToggle.classList.toggle('is-open', open);
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  }

  menuToggle.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('is-open')));
  mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 800 && mobileMenu.classList.contains('is-open')) setMenu(false);
  }, { passive: true });
})();
