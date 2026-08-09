const motionStyles = document.createElement('link');
motionStyles.rel = 'stylesheet';
motionStyles.href = './motion.css';
document.head.append(motionStyles);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const paletteStops = [
  {
    at: 0,
    skyTop: [7, 10, 20], skyMid: [14, 17, 31], skyHorizon: [28, 30, 45],
    ink: [233, 224, 200], inkSoft: [189, 179, 157], paper: [33, 31, 39], paper2: [42, 39, 48],
    line: [233, 224, 200], gold: [214, 181, 111], ember: [225, 124, 84], blue: [112, 136, 168],
    starOpacity: .62, horizonOpacity: .03, grainOpacity: .11, surfaceAlpha: .76,
  },
  {
    at: .36,
    skyTop: [13, 20, 38], skyMid: [31, 40, 64], skyHorizon: [74, 68, 82],
    ink: [231, 225, 211], inkSoft: [184, 181, 173], paper: [38, 39, 49], paper2: [49, 49, 59],
    line: [226, 224, 214], gold: [211, 178, 113], ember: [207, 123, 92], blue: [124, 151, 183],
    starOpacity: .47, horizonOpacity: .13, grainOpacity: .1, surfaceAlpha: .73,
  },
  {
    at: .67,
    skyTop: [42, 57, 83], skyMid: [98, 91, 108], skyHorizon: [190, 137, 111],
    ink: [238, 232, 220], inkSoft: [205, 196, 183], paper: [64, 61, 67], paper2: [77, 72, 76],
    line: [229, 220, 205], gold: [219, 177, 103], ember: [194, 112, 78], blue: [139, 164, 188],
    starOpacity: .21, horizonOpacity: .43, grainOpacity: .09, surfaceAlpha: .7,
  },
  {
    at: 1,
    skyTop: [184, 201, 211], skyMid: [223, 211, 191], skyHorizon: [246, 218, 172],
    ink: [47, 44, 40], inkSoft: [91, 84, 76], paper: [241, 235, 221], paper2: [229, 222, 207],
    line: [68, 60, 52], gold: [151, 105, 49], ember: [167, 91, 61], blue: [75, 106, 128],
    starOpacity: .025, horizonOpacity: .74, grainOpacity: .075, surfaceAlpha: .82,
  },
];

function mix(a, b, amount) {
  return a + (b - a) * amount;
}

function mixRgb(a, b, amount) {
  return a.map((value, index) => Math.round(mix(value, b[index], amount)));
}

function rgb(value) {
  return `rgb(${value.join(' ')})`;
}

function rgba(value, alpha) {
  return `rgba(${value.join(',')},${alpha})`;
}

function paletteAt(progress) {
  const p = clamp(progress);
  const upperIndex = paletteStops.findIndex((stop) => p <= stop.at);
  if (upperIndex <= 0) return paletteStops[0];
  if (upperIndex === -1) return paletteStops.at(-1);
  const lower = paletteStops[upperIndex - 1];
  const upper = paletteStops[upperIndex];
  const local = (p - lower.at) / Math.max(.0001, upper.at - lower.at);
  const colorKeys = ['skyTop', 'skyMid', 'skyHorizon', 'ink', 'inkSoft', 'paper', 'paper2', 'line', 'gold', 'ember', 'blue'];
  const numericKeys = ['starOpacity', 'horizonOpacity', 'grainOpacity', 'surfaceAlpha'];
  const result = { at: p };
  colorKeys.forEach((key) => { result[key] = mixRgb(lower[key], upper[key], local); });
  numericKeys.forEach((key) => { result[key] = mix(lower[key], upper[key], local); });
  return result;
}

function dawnLabel(progress) {
  if (progress < .18) return ['夜半', 'MIDNIGHT'];
  if (progress < .4) return ['夜更け', 'LATE NIGHT'];
  if (progress < .62) return ['薄明', 'BLUE HOUR'];
  if (progress < .84) return ['暁', 'DAWN'];
  return ['朝', 'MORNING'];
}

function installDawnAtmosphere() {
  const indicator = document.createElement('div');
  indicator.className = 'dawn-indicator';
  indicator.setAttribute('aria-hidden', 'true');
  indicator.innerHTML = '<span class="dawn-indicator__jp">夜半</span><span class="dawn-indicator__en">MIDNIGHT</span>';
  document.body.append(indicator);

  const root = document.documentElement;
  const overview = document.querySelector('#overview');
  let raf = 0;

  const update = () => {
    raf = 0;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const start = overview ? Math.max(0, overview.offsetTop - innerHeight * .16) : 0;
    const progress = reducedMotion.matches ? clamp((scrollY - start) / Math.max(1, max - start)) : clamp((scrollY - start) / Math.max(1, max - start));
    const palette = paletteAt(progress);

    root.style.setProperty('--dawn-progress', progress.toFixed(4));
    root.style.setProperty('--sky-top', rgb(palette.skyTop));
    root.style.setProperty('--sky-mid', rgb(palette.skyMid));
    root.style.setProperty('--sky-horizon', rgb(palette.skyHorizon));
    root.style.setProperty('--ink', rgb(palette.ink));
    root.style.setProperty('--ink-soft', rgb(palette.inkSoft));
    root.style.setProperty('--paper', rgb(palette.paper));
    root.style.setProperty('--paper-2', rgb(palette.paper2));
    root.style.setProperty('--line', rgba(palette.line, progress > .78 ? .24 : .18));
    root.style.setProperty('--gold', rgb(palette.gold));
    root.style.setProperty('--ember', rgb(palette.ember));
    root.style.setProperty('--blue', rgb(palette.blue));
    root.style.setProperty('--star-opacity', palette.starOpacity.toFixed(3));
    root.style.setProperty('--horizon-opacity', palette.horizonOpacity.toFixed(3));
    root.style.setProperty('--grain-opacity', palette.grainOpacity.toFixed(3));
    root.style.setProperty('--surface-alpha', palette.surfaceAlpha.toFixed(3));
    root.style.colorScheme = progress > .82 ? 'light' : 'dark';

    const [jp, en] = dawnLabel(progress);
    const jpNode = indicator.querySelector('.dawn-indicator__jp');
    const enNode = indicator.querySelector('.dawn-indicator__en');
    if (jpNode.textContent !== jp) jpNode.textContent = jp;
    if (enNode.textContent !== en) enNode.textContent = en;
  };

  const requestUpdate = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };

  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', requestUpdate, { passive: true });
  reducedMotion.addEventListener?.('change', requestUpdate);
  update();
}

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

  const register = (rootNode = document) => {
    if (rootNode.matches?.(selector)) registerElement(rootNode);
    rootNode.querySelectorAll?.(selector).forEach(registerElement);
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
  installDawnAtmosphere();
  bootPrologue();
  installRevealObserver();
  installSectionProgress();
}

bootMotion();
