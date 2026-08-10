const SERIES_CAST_URL = './data/series-cast-selection.v1.json';

const seriesCastStyles = document.createElement('link');
seriesCastStyles.rel = 'stylesheet';
seriesCastStyles.href = './series-cast.css';
document.head.append(seriesCastStyles);

let seriesCastData = null;
let activeTitleId = 'yoruno-2';
let maturityFilter = 'all';

const maturityLabel = {
  anchor_potential: 'ANCHOR POTENTIAL',
  high_priority: 'HIGH PRIORITY',
  deepen_before_promotion: 'DEEPEN FIRST',
};

function scoreFor(scores) {
  const opportunity = scores.slice(0, 6).reduce((sum, value) => sum + value, 0);
  const risk = scores.slice(6, 8).reduce((sum, value) => sum + value, 0);
  return { opportunity, risk, net: opportunity - risk };
}

function axisMarkup(axis, value) {
  const risk = axis.kind === 'risk';
  return `
    <div class="series-axis${risk ? ' is-risk' : ''}">
      <span>${axis.label}</span>
      <div class="series-axis-track" aria-hidden="true"><i style="--axis-value:${value}"></i></div>
      <b>${value}</b>
    </div>
  `;
}

function candidateMarkup(candidate) {
  const titleKey = activeTitleId === 'yoruno-2' ? 'title2' : 'title3';
  const title = candidate[titleKey];
  const { opportunity, risk } = scoreFor(title.scores);
  const filtered = maturityFilter !== 'all' && candidate.maturity !== maturityFilter;
  return `
    <article class="series-candidate${filtered ? ' is-filtered' : ''}" data-series-candidate="${candidate.id}">
      <header class="series-candidate-head">
        <div>
          <span class="series-candidate-id">${candidate.id}</span>
          <h4>${candidate.name}</h4>
        </div>
        <span class="series-maturity" data-maturity="${candidate.maturity}">${maturityLabel[candidate.maturity] ?? candidate.maturity}</span>
      </header>
      <p class="series-candidate-core">${candidate.core}</p>
      <div class="series-candidate-score-note" aria-label="opportunity and risk">
        <span>OPPORTUNITY <b>${opportunity}/30</b></span>
        <span>RISK <b>${risk}/10</b></span>
      </div>
      <div class="series-axis-grid">
        ${seriesCastData.axes.map((axis, index) => axisMarkup(axis, title.scores[index])).join('')}
      </div>
      <div class="series-candidate-editorial">
        <div><span>STRONGEST LANE</span><p>${title.lane}</p></div>
        <div class="is-concern"><span>DO NOT COLLAPSE INTO</span><p>${title.concern}</p></div>
      </div>
    </article>
  `;
}

function bundleMarkup(bundle) {
  const names = bundle.members
    .map((id) => seriesCastData.candidates.find((candidate) => candidate.id === id)?.name ?? id)
    .join(' / ');
  const bridges = bundle.returningBridgeCandidates.length
    ? bundle.returningBridgeCandidates.join(' / ')
    : '旧cast bridgeを前提にしない';
  return `
    <article class="series-bundle">
      <span>${bundle.id} · ${bundle.status}</span>
      <h4>${bundle.title}</h4>
      <p>${names}</p>
      <small>RETURNING BRIDGE CANDIDATES — ${bridges}</small>
    </article>
  `;
}

function policyMarkup() {
  return `
    <div class="series-policy-strip">
      <div><span>NEW VIEWPOINT</span><strong>${seriesCastData.policy.newViewpointMajority ? 'MAJORITY' : 'OPEN'}</strong></div>
      <div><span>SCORE</span><strong>${seriesCastData.policy.noAutomaticSelectionByScore ? 'NO AUTO LOCK' : 'REVIEW'}</strong></div>
      <div><span>POPULARITY FORECAST</span><strong>${seriesCastData.policy.noPopularityForecastInScore ? 'EXCLUDED' : 'CHECK'}</strong></div>
    </div>
  `;
}

function boardMarkup() {
  const question = seriesCastData.titleQuestions[activeTitleId];
  const bundles = seriesCastData.bundles.filter((bundle) => bundle.titleId === activeTitleId);
  return `
    <section class="series-cast-board" id="seriesCastBoard" aria-labelledby="seriesCastTitle">
      <div class="series-cast-kicker">AUTHOR BOARD · FUTURE15 · CANDIDATE ONLY</div>
      <div class="series-cast-heading">
        <div>
          <h3 id="seriesCastTitle">SERIES CAST SELECTION</h3>
          <p>順位ではなく、次作の問いへ何を持ち込めるかと、その時に壊れやすいものを比較する。</p>
        </div>
        <div class="series-cast-status">NO GREENLIGHT<br>NO AUTO CANON</div>
      </div>
      <div class="series-title-tabs" role="tablist" aria-label="シリーズ候補比較">
        <button type="button" data-series-title="yoruno-2" aria-selected="${activeTitleId === 'yoruno-2'}">2 · 継ぐ / 渡す / 受け取る</button>
        <button type="button" data-series-title="yoruno-3" aria-selected="${activeTitleId === 'yoruno-3'}">3 · 残す / 手放す / 夜を選ぶ</button>
      </div>
      <blockquote class="series-question">${question}</blockquote>
      ${policyMarkup()}
      <div class="series-cast-toolbar" aria-label="maturity filter">
        <button type="button" data-maturity-filter="all" aria-pressed="${maturityFilter === 'all'}">ALL 15</button>
        <button type="button" data-maturity-filter="anchor_potential" aria-pressed="${maturityFilter === 'anchor_potential'}">ANCHOR POTENTIAL</button>
        <button type="button" data-maturity-filter="high_priority" aria-pressed="${maturityFilter === 'high_priority'}">HIGH PRIORITY</button>
        <button type="button" data-maturity-filter="deepen_before_promotion" aria-pressed="${maturityFilter === 'deepen_before_promotion'}">DEEPEN FIRST</button>
      </div>
      <div class="series-candidate-list">
        ${seriesCastData.candidates.map(candidateMarkup).join('')}
      </div>
      <div class="series-bundle-section">
        <div class="series-bundle-heading"><span>EXPLORATION BUNDLES</span><p>final castではない。重複・Gameplay・returning bridgeを見るための組み合わせ。</p></div>
        <div class="series-bundle-list">${bundles.map(bundleMarkup).join('')}</div>
      </div>
      <div class="series-immutable">
        <span>TITLE 1 — IMMUTABLE</span>
        <ul>${seriesCastData.policy.immutableFromTitle1.map((item) => `<li>${item}</li>`).join('')}</ul>
        <p>${seriesCastData.policy.returningCastRule}</p>
      </div>
    </section>
  `;
}

function locateHost() {
  const franchise = document.querySelector('#franchiseBoard');
  if (franchise?.parentElement) return { host: franchise.parentElement, after: franchise };
  const decision = document.querySelector('#decisionLab');
  if (decision?.parentElement) return { host: decision.parentElement, after: decision };
  const author = document.querySelector('#authorDesk, [data-author-desk], .author-desk');
  if (author) return { host: author, after: null };
  return null;
}

function installBoard() {
  const existing = document.querySelector('#seriesCastBoard');
  const markup = boardMarkup();
  if (existing) {
    existing.outerHTML = markup;
  } else {
    const location = locateHost();
    if (!location) return false;
    if (location.after) location.after.insertAdjacentHTML('afterend', markup);
    else location.host.insertAdjacentHTML('beforeend', markup);
  }
  wireBoard();
  return true;
}

function wireBoard() {
  const board = document.querySelector('#seriesCastBoard');
  if (!board) return;
  board.querySelectorAll('[data-series-title]').forEach((button) => {
    button.addEventListener('click', () => {
      activeTitleId = button.dataset.seriesTitle;
      installBoard();
    });
  });
  board.querySelectorAll('[data-maturity-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      maturityFilter = button.dataset.maturityFilter;
      installBoard();
    });
  });
}

async function bootSeriesCastBoard() {
  try {
    const response = await fetch(SERIES_CAST_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    seriesCastData = await response.json();
    if (!installBoard()) {
      const observer = new MutationObserver(() => {
        if (installBoard()) observer.disconnect();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  } catch (error) {
    console.error('[lorebook] failed to load series cast board', error);
  }
}

bootSeriesCastBoard();
