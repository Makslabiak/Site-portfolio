const root = document.documentElement;

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
if (menuToggle && mobileMenu) {
  function setMenu(open) {
    document.documentElement.classList.toggle('menu-open', open);
    menuToggle.classList.toggle('is-open', open);
    mobileMenu.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  }
  menuToggle.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('is-open')));
  mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });
}

const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const shouldOpen = !item.classList.contains('is-open');
    faqItems.forEach((otherItem) => {
      const otherQuestion = otherItem.querySelector('.faq-question');
      const isCurrentItem = otherItem === item && shouldOpen;
      otherItem.classList.toggle('is-open', isCurrentItem);
      otherQuestion.setAttribute('aria-expanded', String(isCurrentItem));
    });
  });
});

window.addEventListener('pointermove', (event) => {
  root.style.setProperty('--x', `${event.clientX}px`);
  root.style.setProperty('--y', `${event.clientY}px`);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.project, .about, .play').forEach((element) => observer.observe(element));

const projects = [
  ['case-il-sogno.html', 'image/Il Sogno Bianco/Il Sogno Bianco.jpg', 'Il Sogno Bianco', 'Италия · Bridal fashion', 'стратегия, UX/UI, сайт'],
  ['case-narin.html', 'image/narin/narin.jpg', 'Narin', 'Чехия · Flowers', 'e-commerce, UX/UI, сайт'],
  ['case-lumo.html', 'image/Lumo store/Lumo store.jpg', 'Lumo Store', 'Англия · Collectible design', 'концепция, UX/UI, сайт'],
  ['case-pkl.html', 'image/pkl/pkl.jpg', 'По Колькиной Линии', 'Россия · Marketing', 'арт-дирекшн, UX/UI, сайт'],
  ['case-kyznya.html', 'image/kyznya/kyznya.jpg', 'Кузня', 'Россия · Digital agency', 'концепция, UX/UI, сайт'],
  ['case-watt.html', 'image/watt game/watt game.jpg', 'Watt', 'Россия · Gamedev', 'стратегия, UX/UI, сайт'],
];

const projectGrid = document.querySelector('.projects');
if (projectGrid) {
  projectGrid.innerHTML = projects.map(([url, image, title, category, role]) => `
    <a class="project" href="${url}">
      <div class="project-art real-art"><img src="${image}" alt="${title}" loading="lazy" decoding="async"></div>
      <div class="meta"><h3>${title}</h3><span class="project-link">Смотреть сайт ↗</span></div>
    </a>`).join('');
  projectGrid.querySelectorAll('.project').forEach((element) => observer.observe(element));

  if (window.matchMedia('(pointer: fine)').matches) {
    const projectCursor = document.createElement('div');
    projectCursor.className = 'project-cursor';
    projectCursor.innerHTML = '<span class="project-cursor__icon">↗</span><span class="project-cursor__label">разбор сайта</span>';
    document.body.appendChild(projectCursor);

    projectGrid.addEventListener('pointermove', (event) => {
      const artwork = event.target.closest('.real-art');
      projectCursor.classList.toggle('is-visible', Boolean(artwork));
      if (!artwork) return;
      projectCursor.style.left = `${event.clientX}px`;
      projectCursor.style.top = `${event.clientY}px`;
    });
    projectGrid.addEventListener('pointerleave', () => projectCursor.classList.remove('is-visible'));
  }
}

function startHomeMotion() {
  document.documentElement.classList.add('home-motion');

  const heroHeading = document.querySelector('.hero h1');
  if (heroHeading) {
    let heroWordIndex = 0;
    function wrapHeroWords(node) {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const fragment = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part.trim()) {
              fragment.appendChild(document.createTextNode(part));
              return;
            }
            const span = document.createElement('span');
            span.className = 'hero-word';
            span.style.setProperty('--word-index', heroWordIndex);
            span.textContent = part;
            span.addEventListener('animationend', () => span.classList.add('hero-word-settled'), { once: true });
            heroWordIndex += 1;
            fragment.appendChild(span);
          });
          child.replaceWith(fragment);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
          wrapHeroWords(child);
        }
      });
    }
    wrapHeroWords(heroHeading);
    heroHeading.classList.add('hero-word-reveal');
  }

  const progress = document.createElement('div');
  progress.className = 'home-progress';
  document.body.appendChild(progress);

  const motionSections = [...document.querySelectorAll('.about, .services, .play, footer')];
  motionSections.forEach((section) => section.classList.add('home-reveal'));

  const motionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      motionObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -7% 0px' });
  motionSections.forEach((section) => motionObserver.observe(section));

  const headings = [...document.querySelectorAll('.about h2')];
  function wrapWords(node) {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part.trim()) return fragment.appendChild(document.createTextNode(part));
          const span = document.createElement('span');
          span.className = 'home-motion-word';
          span.textContent = part;
          fragment.appendChild(span);
        });
        child.replaceWith(fragment);
      } else if (child.nodeType === Node.ELEMENT_NODE) wrapWords(child);
    });
  }
  headings.forEach(wrapWords);

  let motionTicking = false;
  function updateHomeMotion() {
    const range = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${range > 0 ? window.scrollY / range : 0})`;
    headings.forEach((heading) => {
      const rect = heading.getBoundingClientRect();
      const start = window.innerHeight * 0.88;
      const finish = window.innerHeight * 0.34 - 100;
      const amount = Math.max(0, Math.min(1, (start - rect.top) / (start - finish)));
      const words = heading.querySelectorAll('.home-motion-word');
      words.forEach((word, index) => {
        const local = Math.max(0, Math.min(1, amount * (words.length + 3) - index));
        word.style.opacity = String(0.16 + local * 0.84);
      });
    });
    motionTicking = false;
  }
  window.addEventListener('scroll', () => {
    if (motionTicking) return;
    motionTicking = true;
    requestAnimationFrame(updateHomeMotion);
  }, { passive: true });
  updateHomeMotion();
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let homeMotionStarted = false;
  function runHomeMotionOnce() {
    if (homeMotionStarted) return;
    homeMotionStarted = true;
    startHomeMotion();
  }
  if (document.documentElement.classList.contains('page-content-ready')) {
    runHomeMotionOnce();
  } else {
    window.addEventListener('page-loader:hide', runHomeMotionOnce, { once: true });
    // Safety net in case page-loader.js failed to load or fire its event
    window.setTimeout(runHomeMotionOnce, 2400);
  }
}
