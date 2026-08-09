const motionStyles = document.createElement('link');
motionStyles.rel = 'stylesheet';
motionStyles.href = './motion.css';
document.head.append(motionStyles);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer: fine)');
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function bootPrologue() {
  const prologue = document.querySelector('#prologue');
  if (!prologue) return;
  const panels = [...prologue.querySelectorAll('[data-prologue-step]')];
  const skip = prologue.querySelector('#skipPrologue');
  const enter = prologue.querySelector('#enterLorebook');
  const progress = prologue.querySelector('.prologue-progress__bar');
  let raf = 0;

  const update = () => {
    raf = 0;
    if (reducedMotion.matches) {
      panels.forEach((panel, index) => panel.classList.toggle('is-active', index === 0));
      return;
    }
    const rect = prologue.getBoundingClientRect();
    const scrollable = Math.max(1, rect.height - window.innerHeight);
    const p = clamp(-rect.top / scrollable);
    const stepFloat = p * panels.length;
    const activeIndex = Math.min(panels.length - 1, Math.floor(stepFloat));
    const local = stepFloat - activeIndex;
    prologue.style.setProperty('--prologue-progress', p.toFixed(4));
    prologue.style.setProperty('--prologue-local', local.toFixed(4));
    if (progress) progress.style.transform = `scaleX(${p})`;
    panels.forEach((panel, index) => panel.classList.toggle('is-active', index === activeIndex));
  };

  const requestUpdate = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };

  const leaveIntro = () => {
    document.querySelector('#overview')?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  };

  skip?.addEventListener('click', leaveIntro);
  enter?.addEventListener('click', leaveIntro);
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  reducedMotion.addEventListener?.('change', requestUpdate);
  update();
}

function installRevealObserver() {
  const selector = '.chapter, .character-card, .relationship-item, .timeline-item, .mystery-card, .question-card, .history-thread-card';
  const seen = new WeakSet();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

  const registerElement = (element) => {
    if (seen.has(element)) return;
    seen.add(element);
    element.classList.add('motion-reveal');
    if (reducedMotion.matches) element.classList.add('is-revealed');
    else observer.observe(element);
  };

  const register = (root = document) => {
    if (root.matches?.(selector)) registerElement(root);
    root.querySelectorAll?.(selector).forEach(registerElement);
  };

  register();
  new MutationObserver((records) => {
    for (const record of records) {
      record.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) register(node);
      });
    }
  }).observe(document.body, { childList: true, subtree: true });
}

function installPointerLight() {
  if (!finePointer.matches || reducedMotion.matches) return;
  const root = document.documentElement;
  let raf = 0;
  let x = innerWidth * .5;
  let y = innerHeight * .3;
  window.addEventListener('pointermove', (event) => {
    x = event.clientX;
    y = event.clientY;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      root.style.setProperty('--pointer-x', `${x}px`);
      root.style.setProperty('--pointer-y', `${y}px`);
    });
  }, { passive: true });
}

function installCardLight() {
  if (!finePointer.matches || reducedMotion.matches) return;
  const install = (card) => {
    if (card.dataset.motionPointer === 'true') return;
    card.dataset.motionPointer = 'true';
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  };
  const scan = () => document.querySelectorAll('.character-card, .relationship-item, .question-card').forEach(install);
  scan();
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
}

function installSectionProgress() {
  const bar = document.querySelector('#readingProgress');
  if (!bar) return;
  let raf = 0;
  const update = () => {
    raf = 0;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const value = clamp(scrollY / max);
    bar.style.transform = `scaleX(${value})`;
  };
  addEventListener('scroll', () => {
    if (!raf) raf = requestAnimationFrame(update);
  }, { passive: true });
  update();
}

function bootMotion() {
  document.documentElement.classList.add('motion-ready');
  bootPrologue();
  installRevealObserver();
  installPointerLight();
  installCardLight();
  installSectionProgress();
}

bootMotion();
