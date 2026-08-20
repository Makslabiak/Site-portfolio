(function () {
  'use strict';

  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.documentElement.classList.add('custom-cursor-enabled');

  const style = document.createElement('style');
  style.textContent = `
    .custom-cursor-enabled body,
    .custom-cursor-enabled body * { cursor: none !important; }
    .site-cursor, .site-cursor-trail {
      position: fixed; left: 0; top: 0; z-index: 2147483000;
      pointer-events: none; border-radius: 50%; opacity: 0;
      will-change: transform, opacity;
    }
    .site-cursor {
      width: 12px; height: 12px; background: #080808;
      box-shadow: 0 0 0 1px rgba(255,255,255,.4);
      transition: width .18s ease, height .18s ease, opacity .15s ease;
    }
    .site-cursor-trail { background: #080808; }
    .site-cursor.is-visible, .site-cursor-trail.is-visible { opacity: 1; }
    .site-cursor.is-link { width: 20px; height: 20px; }
    .site-cursor.is-hidden, .site-cursor-trail.is-hidden { opacity: 0 !important; }
  `;
  document.head.appendChild(style);

  const cursor = document.createElement('div');
  cursor.className = 'site-cursor';
  document.body.appendChild(cursor);

  const count = 9;
  const dots = [];
  for (let index = 0; index < count; index += 1) {
    const dot = document.createElement('div');
    const size = Math.max(2, 8 - index * 0.65);
    dot.className = 'site-cursor-trail';
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.opacity = String(Math.max(0.08, 0.48 - index * 0.045));
    document.body.appendChild(dot);
    dots.push({ element: dot, x: -40, y: -40, halfSize: size / 2 });
  }

  let pointerX = -40;
  let pointerY = -40;
  let visible = false;

  function setVisible(nextVisible) {
    visible = nextVisible;
    cursor.classList.toggle('is-visible', nextVisible);
    dots.forEach(({ element }) => element.classList.toggle('is-visible', nextVisible));
  }

  document.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!visible) setVisible(true);
    startRender();
    const target = event.target instanceof Element ? event.target : null;
    const overProject = Boolean(target && target.closest('.real-art, .next'));
    const overLink = Boolean(target && target.closest('a, button, [role="button"]'));
    cursor.classList.toggle('is-link', overLink && !overProject);
    cursor.classList.toggle('is-hidden', overProject);
    dots.forEach(({ element }) => element.classList.toggle('is-hidden', overProject));
  }, { passive: true });

  document.addEventListener('pointerleave', () => setVisible(false));
  window.addEventListener('blur', () => setVisible(false));

  let rafId = null;

  function render() {
    cursor.style.left = `${pointerX}px`;
    cursor.style.top = `${pointerY}px`;
    cursor.style.transform = 'translate3d(-50%,-50%,0)';
    let leaderX = pointerX;
    let leaderY = pointerY;
    dots.forEach((dot, index) => {
      const ease = 0.28 - index * 0.012;
      dot.x += (leaderX - dot.x) * ease;
      dot.y += (leaderY - dot.y) * ease;
      dot.element.style.transform = `translate3d(${dot.x - dot.halfSize}px, ${dot.y - dot.halfSize}px, 0)`;
      leaderX = dot.x;
      leaderY = dot.y;
    });
    rafId = requestAnimationFrame(render);
  }

  function startRender() {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(render);
  }

  function stopRender() {
    if (rafId === null) return;
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopRender();
    else startRender();
  });

  startRender();
})();

(function () {
  'use strict';

  const header = document.querySelector('header.nav, header.case-nav');
  if (!header) return;

  let previousY = window.scrollY;
  let ticking = false;

  function updateHeader() {
    const currentY = Math.max(0, window.scrollY);
    const delta = currentY - previousY;

    if (currentY <= 10) {
      header.classList.remove('header-hidden');
    } else if (delta > 6) {
      header.classList.add('header-hidden');
    } else if (delta < -6) {
      header.classList.remove('header-hidden');
    }

    previousY = currentY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateHeader);
  }, { passive: true });

  window.addEventListener('pageshow', () => {
    previousY = window.scrollY;
    header.classList.toggle('header-hidden', window.scrollY > 10);
  });
})();
