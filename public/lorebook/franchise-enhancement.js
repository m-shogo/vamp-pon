const FRANCHISE_DATA_URL = './data/franchise-strategy.v1.json';

const franchiseStyles = document.createElement('link');
franchiseStyles.rel = 'stylesheet';
franchiseStyles.href = './franchise.css';
document.head.append(franchiseStyles);

function list(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
}

function renderFranchiseBoard(data) {
  const desk = document.querySelector('#authors-desk');
  const source = desk?.querySelector('.source-note');
  if (!desk || !source || desk.querySelector('.franchise-board')) return;

  source.insertAdjacentHTML('beforebegin', `
    <section class="franchise-board">
      <header class="franchise-heading">
        <span>IP / SERIES BOARD</span>
        <h3>売れる入口を増やしても、物語は曲げない。</h3>
        <p>Characterだけに人気を集中させず、星獣・Named Object・Relationship・Sceneまで複数の入口を持つ。人気dataは露出の判断に使い、Canon変更には使わない。</p>
      </header>

      <div class="franchise-pillars">
        ${data.entryPillars.map((pillar, index) => `
          <article>
            <span>${String(index + 1).padStart(2, '0')}</span>
            <h4>${pillar.label}</h4>
            <p>${pillar.summary}</p>
            <small>${pillar.examples.join(' / ')}</small>
          </article>
        `).join('')}
      </div>

      <div class="franchise-subheading"><span>POPULARITY</span><h4>「好き」を一種類の順位へ潰さない</h4></div>
      <div class="popularity-grid">
        ${data.popularityDimensions.map((item) => `
          <article><strong>${item.label}</strong><p>${item.use}</p></article>
        `).join('')}
      </div>

      <div class="franchise-subheading"><span>RELATIONSHIP LANES</span><h4>恋愛以外にも売れる関係を作る</h4></div>
      <div class="commercial-relation-list">
        ${data.relationshipLanes.map((lane) => `
          <article>
            <div><span>${lane.label}</span><strong>${lane.pairs.join(' / ')}</strong></div>
            <p>${lane.strength}</p>
          </article>
        `).join('')}
      </div>

      <div class="franchise-subheading"><span>SERIES 1 → 2 → 3</span><h4>続編が出ても1の朝を壊さない</h4></div>
      <div class="series-grid">
        ${data.series.map((title) => `
          <article>
            <span>${title.label}</span>
            <h4>${title.theme}</h4>
            <blockquote>${title.question}</blockquote>
            <div class="series-contract"><b>PAY</b>${list(title.mustPay)}</div>
            <div class="series-contract"><b>DON'T</b>${list(title.mustNotDo)}</div>
          </article>
        `).join('')}
      </div>

      <div class="commercial-guardrail">
        <div><span>人気から変えてよい</span>${list(data.commercialGuardrails.allowedFromPopularity)}</div>
        <div><span>人気でも変えない</span>${list(data.commercialGuardrails.forbiddenFromPopularity)}</div>
      </div>
    </section>
  `);
}

async function bootFranchiseBoard() {
  try {
    const response = await fetch(FRANCHISE_DATA_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    renderFranchiseBoard(await response.json());
  } catch (error) {
    console.error('[lorebook] failed to load franchise strategy', error);
  }
}

bootFranchiseBoard();
