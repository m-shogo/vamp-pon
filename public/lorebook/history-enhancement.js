const HISTORY_DATA_URL = './data/history-atlas.v1.json';
const CORE5_ERA_DATA_URL = './data/core5-era-canon.v1.json';

const historyStyles = document.createElement('link');
historyStyles.rel = 'stylesheet';
historyStyles.href = './history.css';
document.head.append(historyStyles);

const historyNames = {
  yui:'ユイ', asa:'アサ', nagi:'ナギ', michiru:'ミチル', tomori:'トモリ', sen:'セン', ritsu:'リツ', koyori:'コヨリ', gen:'ゲン', hana:'ハナ',
  yuubi:'ユウビ', madoka:'マドカ', shiro:'シロ', tobari:'トバリ', nemu:'ネム', kuroori:'クロオリ', kaname:'カナメ', kasumi:'カスミ', toki:'トキ', tsumugi:'ツムギ', ren:'レン',
};

function threadMarkup(thread, index) {
  const knownItems = thread.known.map((item) => `<li>${item}</li>`).join('');
  const memberNames = thread.members.map((id) => historyNames[id] ?? id).join(' → ');
  return `
    <article class="history-thread">
      <header>
        <span>THREAD ${String(index + 1).padStart(2,'0')} / ${thread.status}</span>
        <h4>${thread.label}</h4>
        <small>${memberNames}</small>
      </header>
      <div class="history-thread-body">
        <div><b>Source anchors / Candidate boundary</b><ul>${knownItems}</ul></div>
        <div class="history-gap"><b>まだ空いている時間</b><p>${thread.gap}</p></div>
        <div class="history-payoff"><b>この線が生きると</b><p>${thread.payoff}</p></div>
      </div>
      <footer><span>${thread.kind}</span><span>${thread.evidenceState}</span></footer>
    </article>
  `;
}

function eraMarkup(eraMethod) {
  const laneCards = eraMethod.lanes.map((lane) => `
    <article data-era-kind="${lane.kind}">
      <b>${lane.label}</b>
      <small>${lane.kind === 'REALITY_LANE' ? 'REALITY LANE' : 'OPEN SPECIAL'}</small>
      <p>${lane.meaning}</p>
    </article>
  `).join('');
  const evidence = eraMethod.requiredEvidence.join(' / ');
  const lockCards = eraMethod.upstreamLocks.map((lock) => {
    const name = historyNames[lock.characterId] ?? lock.characterId;
    return `<article><span>${name} · ${lock.status}</span><b>${lock.lane}</b><p>${lock.note}</p></article>`;
  }).join('');
  const rules = eraMethod.rules.map((rule) => `<li>${rule}</li>`).join('');
  return `
    <section class="era-method author-only">
      <header>
        <span>36 CHARACTER ERA METHOD / AUTHOR CANDIDATE</span>
        <h3>OLD / RECENTではなく、生活のEvidenceから5つのReality laneへ置く。</h3>
        <p>${eraMethod.principle}</p>
        <small>${eraMethod.characterCount} characters · Current21 ${eraMethod.current21Count} · Future15 ${eraMethod.future15Count} · exact year OPEN</small>
      </header>
      <div class="era-layer-row">${laneCards}</div>
      <div class="era-evidence"><b>Eraを置く時に必要なevidence</b><p>${evidence}</p></div>
      <div class="era-anchors">${lockCards}</div>
      <div class="era-method-rules"><b>HARD BOUNDARIES</b><ul>${rules}</ul></div>
    </section>
  `;
}

function temporalLaneMarkup(assignment, index) {
  const exactYear = assignment.exactYear == null ? 'EXACT YEAR / OPEN' : `EXACT YEAR / ${assignment.exactYear}`;
  return `
    <article class="temporal-lane" data-era="${assignment.era}" data-character="${assignment.id}">
      <div class="temporal-lane-index">0${index + 1}</div>
      <div class="temporal-lane-copy">
        <div class="temporal-lane-meta"><span>${assignment.name}</span><b>${exactYear}</b></div>
        <h4>${assignment.eraLabel}</h4>
        <p class="temporal-band">${assignment.roughHistoricalBand} <em>≈ rough band</em></p>
        <dl>
          <div><dt>PRESSURE</dt><dd>${assignment.primaryPressure}</dd></div>
          <div><dt>BRIDGE</dt><dd>${assignment.coreBridge}</dd></div>
        </dl>
      </div>
    </article>
  `;
}

function renderTemporalMap(eraBook) {
  const history = document.querySelector('#history');
  if (!history || history.querySelector('.temporal-map')) return;
  const assignments = eraBook.assignments ?? [];
  if (assignments.length !== 5) return;
  const laneCards = assignments.map(temporalLaneMarkup).join('');
  const markup = `
    <section class="temporal-map" aria-labelledby="temporalMapHeading">
      <header class="temporal-map-heading">
        <span>TEMPORAL MAP / FIVE REALITY LANES</span>
        <div>
          <h3 id="temporalMapHeading">同じ「今」ではない5人。</h3>
          <p>左から右は時系列方向。ただしrough bandはExact yearではない。未確定の年号を見た目の都合で埋めない。</p>
        </div>
        <small>${eraBook.authority}<br>${eraBook.researchAuthority}</small>
      </header>
      <div class="temporal-lane-track">${laneCards}</div>
      <div class="temporal-cross-overlays">
        <article class="dream-cross-overlay">
          <span>DREAM OVERLAY</span>
          <strong>ヨルノシルベは第6の時代ではない。</strong>
          <p>Realityの時系列を横断して交差する層。起床は一つの現代ではなく、それぞれのRealityへ戻る。</p>
        </article>
        <article class="sky-cross-overlay">
          <span>SKY / CONSTELLATION OVERLAY</span>
          <strong>同じ星空でも、参照している資料の時代は違いうる。</strong>
          <p>obsolete constellationは古い星図・Archive・名称化石として重ねる。TomoriとPresent Yuiのofficial IAU 88 set差を年代伏線にはしない。</p>
        </article>
      </div>
      <footer class="temporal-map-rule">
        <b>READING RULE</b>
        <p>Present ≠ 正解側 / Future ≠ Human upgrade / Dream ≠ 後の時代 / rough band ≠ exact date</p>
      </footer>
    </section>
  `;
  history.insertAdjacentHTML('beforeend', markup);
}

function renderHistoryAtlas(data) {
  const history = document.querySelector('#history');
  if (!history || history.querySelector('.history-atlas')) return;
  const layerCards = data.timeLayers.map((layer, index) => `<article><span>0${index + 1}</span><h4>${layer.label}</h4><p>${layer.summary}</p></article>`).join('');
  const threadCards = data.objectThreads.map(threadMarkup).join('');
  const eraSection = eraMarkup(data.eraMethod);
  const markup = `
    <section class="history-atlas">
      <header class="history-atlas-heading">
        <span>OBJECT LINEAGE / HISTORY ATLAS</span>
        <h3>人が会えなくても、物は時代を渡れる。</h3>
        <p>Exact yearを埋める代わりに、Current anchor、Candidate、まだ分からない受け渡しを同時に見せる。Candidate handoffを「今わかっている事実」へ混ぜない。</p>
      </header>
      <div class="time-layer-strip">${layerCards}</div>
      <div class="history-thread-grid">${threadCards}</div>
      ${eraSection}
    </section>
  `;
  history.insertAdjacentHTML('beforeend', markup);
}

async function bootHistoryAtlas() {
  try {
    const [historyResponse, eraResponse] = await Promise.all([
      fetch(HISTORY_DATA_URL, { cache: 'no-store' }),
      fetch(CORE5_ERA_DATA_URL, { cache: 'no-store' }),
    ]);
    if (!historyResponse.ok || !eraResponse.ok) throw new Error(`history=${historyResponse.status} era=${eraResponse.status}`);
    const [historyData, eraBook] = await Promise.all([historyResponse.json(), eraResponse.json()]);
    renderTemporalMap(eraBook);
    renderHistoryAtlas(historyData);
  } catch (error) {
    console.error('[lorebook] failed to load history/temporal atlas', error);
  }
}

bootHistoryAtlas();
