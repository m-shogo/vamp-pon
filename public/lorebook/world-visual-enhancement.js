const WORLD_VISUAL_URL = './data/constellation-history.v1.json';

const worldVisualStyles = document.createElement('link');
worldVisualStyles.rel = 'stylesheet';
worldVisualStyles.href = './world-visual.css';
document.head.append(worldVisualStyles);

function constellationMarkup(entry, index) {
  return `
    <article class="world-constellation-card">
      <div class="world-constellation-index">0${index + 1}</div>
      <div><span>${entry.status}</span><h4>${entry.label}</h4><p>${entry.summary}</p></div>
    </article>
  `;
}

function renderWorldConstellations(data) {
  const world = document.querySelector('#world');
  if (!world || world.querySelector('.world-constellation-strip')) return;
  const entries = data.entries ?? [];
  if (!entries.length) return;
  world.insertAdjacentHTML('beforeend', `
    <section class="world-constellation-strip">
      <header><span>SKY / CONSTELLATION HISTORY</span><h3>同じ夜空でも、時代ごとに「星座」は同じではない。</h3><p>史実の採用・廃止・追加を研究し、夢世界の伏線候補へ使う。現時点では最終理由を固定しない。</p></header>
      <div>${entries.map(constellationMarkup).join('')}</div>
    </section>
  `);
}

async function bootWorldVisualEnhancement() {
  try {
    const response = await fetch(WORLD_VISUAL_URL, { cache:'no-store' });
    if (!response.ok) throw new Error(`constellation history HTTP ${response.status}`);
    renderWorldConstellations(await response.json());
  } catch (error) {
    console.error('[lorebook] failed to load world visual enhancement', error);
  }
}

function loadRealityRootAtlasEnhancement() {
  if (document.querySelector('script[data-reality-root-atlas-loader]')) return;
  const script = document.createElement('script');
  script.src = './geography-enhancement.js';
  script.defer = true;
  script.dataset.realityRootAtlasLoader = 'true';
  document.body.append(script);
}

bootWorldVisualEnhancement();
loadRealityRootAtlasEnhancement();
