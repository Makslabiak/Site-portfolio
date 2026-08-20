const root = document.documentElement;

const serviceOrderButton = document.querySelector('.service-button--primary');
if (serviceOrderButton) {
  serviceOrderButton.href = 'https://t.me/maxlobyak';
  serviceOrderButton.target = '_blank';
  serviceOrderButton.rel = 'noopener noreferrer';
}

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
  ['case-il-sogno.html', 'https://ilsognobianco.com/', 'image/Il Sogno Bianco/Il Sogno Bianco.jpg', 'Il Sogno Bianco', 'Италия · Bridal fashion', 'стратегия, UX/UI, сайт'],
  ['case-narin.html', 'https://vezminarin.cz', 'image/narin/narin.jpg', 'Narin', 'Чехия · Flowers', 'e-commerce, UX/UI, сайт'],
  ['case-lumo.html', 'https://www.behance.net/gallery/222522823/Lumo-store-lamp-decor', 'image/Lumo store/Lumo store.jpg', 'Lumo Store', 'Англия · Collectible design', 'концепция, UX/UI, сайт'],
  ['case-pkl.html', 'https://pklagency.ru', 'image/pkl/pkl.jpg', 'По Колькиной Линии', 'Россия · Marketing', 'арт-дирекшн, UX/UI, сайт'],
  ['case-kyznya.html', 'https://kuznyapr.com', 'image/kyznya/kyznya.jpg', 'Кузня', 'Россия · Digital agency', 'концепция, UX/UI, сайт'],
  ['case-watt.html', 'https://wattstudio.art', 'image/watt game/watt game.jpg', 'Watt', 'Россия · Gamedev', 'стратегия, UX/UI, сайт'],
];

const projectGrid = document.querySelector('.projects');
if (projectGrid) {
  projectGrid.innerHTML = projects.map(([caseUrl, siteUrl, image, title]) => `
    <div class="project">
      <a href="${caseUrl}" aria-label="Открыть кейс ${title}"><div class="project-art real-art"><img src="${image}" alt="${title}" loading="lazy" decoding="async"></div></a>
      <div class="meta"><h3><a href="${caseUrl}">${title}</a></h3><a class="project-link" href="${siteUrl}" target="_blank" rel="noopener noreferrer">Смотреть сайт <span>↗</span></a></div>
    </div>`).join('');
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

const examplesTrigger = document.querySelector('.service-button[href="#work"]');
if (examplesTrigger) {
  const exampleProjects = projects.slice(0, 5);
  const examplesPopup = document.createElement('div');
  examplesPopup.className = 'examples-popup';
  examplesPopup.setAttribute('role', 'dialog');
  examplesPopup.setAttribute('aria-modal', 'true');
  examplesPopup.setAttribute('aria-label', 'Примеры сайтов');
  examplesPopup.setAttribute('aria-hidden', 'true');
  examplesPopup.innerHTML = `
    <div class="examples-popup__list">
      <span class="examples-popup__eyebrow">Примеры сайтов</span>
      <div class="examples-popup__items">
        ${exampleProjects.map(([, , , title], index) => `
          <button class="examples-popup__item" type="button" data-example-index="${index}">
            <span>${String(index + 1).padStart(2, '0')}</span><strong>${title}</strong><i>↗</i>
          </button>`).join('')}
      </div>
    </div>
    <div class="examples-popup__preview">
      <img alt="" decoding="async">
    </div>
    <button class="examples-popup__close examples-popup__close--top" type="button" aria-label="Закрыть">×</button>
    <button class="examples-popup__close" type="button" aria-label="Закрыть">×</button>`;
  document.body.appendChild(examplesPopup);

  exampleProjects.forEach(([, , image]) => {
    const preload = new Image();
    preload.src = image;
  });

  const preview = examplesPopup.querySelector('.examples-popup__preview img');
  const exampleItems = [...examplesPopup.querySelectorAll('.examples-popup__item')];
  const closeButton = examplesPopup.querySelector('.examples-popup__close');
  const closeButtons = examplesPopup.querySelectorAll('.examples-popup__close');

  function selectExample(index) {
    const [, , image, title] = exampleProjects[index];
    exampleItems.forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex === index));
    preview.classList.add('is-changing');
    const randomX = 4 + Math.random() * 20;
    const randomY = 5 + Math.random() * 34;
    window.setTimeout(() => {
      preview.src = image;
      preview.alt = title;
      preview.style.setProperty('--preview-x', `${randomX}%`);
      preview.style.setProperty('--preview-y', `${randomY}%`);
      preview.parentElement.classList.add('has-preview');
      preview.classList.remove('is-changing');
    }, 120);
  }

  function setExamplesPopup(open) {
    examplesPopup.classList.toggle('is-open', open);
    examplesPopup.setAttribute('aria-hidden', String(!open));
    document.documentElement.classList.toggle('examples-open', open);
    if (open) {
      exampleItems.forEach((item) => item.classList.remove('is-active'));
      preview.removeAttribute('src');
      preview.alt = '';
      preview.parentElement.classList.remove('has-preview');
      closeButton.focus();
    }
    else examplesTrigger.focus();
  }

  examplesTrigger.addEventListener('click', (event) => {
    event.preventDefault();
    setExamplesPopup(true);
  });
  exampleItems.forEach((item) => {
    const index = Number(item.dataset.exampleIndex);
    item.addEventListener('mouseenter', () => selectExample(index));
    item.addEventListener('focus', () => selectExample(index));
    item.addEventListener('click', () => selectExample(index));
  });
  closeButtons.forEach((button) => button.addEventListener('click', () => setExamplesPopup(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && examplesPopup.classList.contains('is-open')) setExamplesPopup(false);
  });
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
