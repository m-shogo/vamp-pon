const HISTORY_DATA_URL = './data/history-atlas.v1.json';

const historyStyles = document.createElement('link');
historyStyles.rel = 'stylesheet';
historyStyles.href = './history.css';
document.head.append(historyStyles);

const historyNames = {
  yui:'ユイ', asa:'アサ', nagi:'ナギ', michiru:'ミチル', tomori:'トモリ', sen:'セン', ritsu:'リツ', koyori:'コヨリ', gen:'ゲン', hana:'ハナ',
  yuubi:'ユウビ', madoka:'マドカ', shiro:'シロ', tobari:'トバリ', nemu:'ネム', kuroori:'クロオリ', kaname:'カナメ', kasumi:'カスミ', toki:'トキ', tsumugi:'ツムギ', ren:'レン',
};

function threadMarkup(thread, index) {
  return `
    <article class="history-thread">
      <header>
        <span>THREAD ${String(index + 1).padStart(2,'0')} / ${thread.status}</span>
        <h4>${thread.label}</h4>
        <small>${thread.members.map((id) => historyNames[id] ?? id).join(' → ')}</small>
      </header>
      <div class="history-thread-body">
        <div><b>今わかっていること</b><ul>${thread.known.map((item) => `<li>${item}</li>`).join('')}</ul></div>
        <div class="history-gap"><b>まだ空いている時間</b><p>${thread.gap}</p></div>
        <div class="history-payoff"><b>この線が生きると</b><p>${thread.payoff}</p></div>
      </div>
      <footer><span>${thread.kind}</span><span>${thread.confidence}</span></footer>
    </article>
  `;
}

function eraMarkup(eraMethod) {
  return `
    <section class="era-method author-only">
      <header><span>RELATIVE ERA METHOD / CANDIDATE</span><h3>西暦より先に、時代の根拠を持つ。</h3><p>${eraMethod.principle}</p></header>
      <div class="era-layer-row">${eraMethod.layers.map((layer) => `<article><b>${layer.label}</b><p>${layer.meaning}</p></article>`).join('')}</div>
      <div class="era-evidence"><b>Eraを置く時に必要なevidence</b><p>${eraMethod.requiredEvidence.join(' / ')}</p></div>
      <div class="era-anchors">${eraMethod.firstAnchors.map((anchor) => `<article><span>${historyNames[anchor.characterId] ?? anchor.characterId}</span><p>${anchor.note}</p></article>`).join('')}</div>
    </section>
  `;
}

function renderHistoryAtlas(data) {
  const history = document.querySelector('#history');
  if (!history || history.querySelector('.history-atlas')) return;
  history.insertAdjacentHTML('beforeend', `
    <section class="history-atlas">
      <header class="history-atlas-heading">
        <span>OBJECT LINEAGE / HISTORY ATLAS</span>
        <h3>人が会えなくても、物は時代を渡れる。</h3>
        <p>Exact yearを埋める代わりに、両端の事実と「まだ分からない受け渡し」を同時に見せる。破線部分を勝手に歴史として埋めない。</p>
      </header>
      <div class="time-layer-strip">${data.timeLayers.map((layer, index) => `<article><span>0${index + 1}</span><h4>${layer.label}</h4><p>${layer.summary}</p></article>`).join('')}</div>
      <div class="history-thread-grid">${data.objectThreads.map(threadMarkup).join('')}</div>
      ${eraMarkup(data.eraMethod)}
    </section>
  `);
}

async function bootHistoryAtlas() {
  try {
    const response = await fetch(HISTORY_DATA_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    renderHistoryAtlas(await response.json());
  } catch (error) {
    console.error('[lorebook] failed to load history atlas', error);
  }
}

bootHistoryAtlas();
