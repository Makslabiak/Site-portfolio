(function () {
  'use strict';

  const caseCta = document.querySelector('.case-hero > .case-cta');
  let caseActions = null;
  if (caseCta) {
    caseActions = document.createElement('div');
    caseActions.className = 'case-actions';
    const backToCases = document.createElement('a');
    backToCases.className = 'case-back';
    backToCases.href = 'index.html#work';
    backToCases.setAttribute('aria-label', 'Вернуться к кейсам');
    backToCases.textContent = '←';
    const floatingCta = caseCta.cloneNode(true);
    caseActions.append(backToCases, floatingCta);
    document.body.appendChild(caseActions);
  }

  function updateCaseActionsVisibility() {
    if (!caseActions) return;
    const atPageBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
    caseActions.classList.toggle('is-hidden', atPageBottom);
  }

  window.addEventListener('scroll', updateCaseActionsVisibility, { passive: true });
  window.addEventListener('resize', updateCaseActionsVisibility);
  updateCaseActionsVisibility();

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('motion-ready');

  const nextCase = document.querySelector('.next');
  if (nextCase && window.matchMedia('(pointer: fine)').matches) {
    const nextCursor = document.createElement('div');
    nextCursor.className = 'project-cursor next-case-cursor';
    nextCursor.innerHTML = '<span class="project-cursor__icon">↗</span>';
    nextCursor.style.left = '-200px';
    nextCursor.style.top = '-200px';
    document.body.appendChild(nextCursor);

    nextCase.addEventListener('pointermove', (event) => {
      nextCursor.style.left = `${event.clientX}px`;
      nextCursor.style.top = `${event.clientY}px`;
      nextCursor.classList.add('is-visible');
    });
    nextCase.addEventListener('pointerleave', () => nextCursor.classList.remove('is-visible'));
  }

  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);

  const revealTargets = document.querySelectorAll(
    '.facts, .intro, .story, .asset-grid, .result, .next, footer'
  );
  revealTargets.forEach((element) => element.classList.add('reveal-block'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  revealTargets.forEach((element) => observer.observe(element));

  const animatedHeadings = [...document.querySelectorAll('.intro h2, .chapter-copy h2, .result blockquote')];

  function wrapWords(node) {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part.trim()) {
            fragment.appendChild(document.createTextNode(part));
            return;
          }
          const word = document.createElement('span');
          word.className = 'motion-word';
          word.textContent = part;
          fragment.appendChild(word);
        });
        child.replaceWith(fragment);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        wrapWords(child);
      }
    });
  }

  animatedHeadings.forEach(wrapWords);

  function updateHeadingWords() {
    animatedHeadings.forEach((heading) => {
      const rect = heading.getBoundingClientRect();
      const start = window.innerHeight * 0.88;
      const finish = window.innerHeight * 0.34 - 100;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - finish)));
      const words = heading.querySelectorAll('.motion-word');
      words.forEach((word, index) => {
        const local = Math.max(0, Math.min(1, progress * (words.length + 3) - index));
        word.style.opacity = String(0.16 + local * 0.84);
      });
    });
  }

  const heroMedia = document.querySelector('.hero-image > img');
  let ticking = false;

  function updateMotion() {
    const scrollTop = window.scrollY;
    const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${scrollRange > 0 ? scrollTop / scrollRange : 0})`;

    if (heroMedia) {
      const rect = heroMedia.parentElement.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const offset = (window.innerHeight * 0.5 - rect.top) * 0.035;
        heroMedia.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    }
    updateHeadingWords();
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateMotion);
  }, { passive: true });

  updateMotion();
})();
