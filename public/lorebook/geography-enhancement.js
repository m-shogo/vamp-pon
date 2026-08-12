const REALITY_ROOT_DATA_URL = './data/reality-root-map.v1.json';

const geographyStyles = document.createElement('link');
geographyStyles.rel = 'stylesheet';
geographyStyles.href = './geography.css';
document.head.append(geographyStyles);

const REGION_RULES = [
  ['北海道', ['北海道']],
  ['東北', ['青森', '岩手', '宮城', '秋田', '山形', '福島', '仙台', '庄内']],
  ['関東', ['東京', '神奈川', '埼玉', '千葉', '茨城', '栃木', '群馬', '横浜', '川口', '荒川']],
  ['中部・北陸', ['新潟', '富山', '石川', '福井', '山梨', '長野', '岐阜', '静岡', '愛知', '金沢']],
  ['近畿', ['三重', '滋賀', '京都', '大阪', '兵庫', '奈良', '和歌山', '神戸']],
  ['中国・四国', ['鳥取', '島根', '岡山', '広島', '山口', '徳島', '香川', '愛媛', '高知', '尾道', '高松']],
  ['九州・沖縄', ['福岡', '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島', '沖縄', '奄美']],
];

function uiRegionGroup(entry) {
  if (entry.placementKind === 'FUTURE_ABSTRACT') return 'Future abstract';
  if (entry.placementKind === 'OPEN_UNMAPPED') return 'Open / unmapped';
  const match = REGION_RULES.find(([, needles]) => needles.some((needle) => entry.root.includes(needle)));
  return match?.[0] ?? 'その他';
}

function placementLabel(entry) {
  if (entry.placementKind === 'FUTURE_ABSTRACT') return 'FUTURE ABSTRACT';
  if (entry.placementKind === 'OPEN_UNMAPPED') return 'OPEN / UNMAPPED';
  return 'REAL JAPAN / REGION LEVEL';
}

function rootCardMarkup(entry) {
  const group = uiRegionGroup(entry);
  return `
    <article class="reality-root-card" data-root-group="${group}" data-root-placement="${entry.placementKind}" data-root-status="${entry.sourceStatus}" data-roster-layer="${entry.rosterLayer}">
      <header><span>${placementLabel(entry)}</span><b>${entry.sourceStatus}</b></header>
      <h4>${entry.name}</h4>
      <div class="root-journey">
        <div><span>REALITY ROOT</span><b>${entry.root}</b></div>
        <i>→</i>
        <div><span>INCIDENT AREA</span><b>${entry.incidentArea}</b></div>
      </div>
      <dl>
        <div><dt>MOBILITY</dt><dd>${entry.mobility}</dd></div>
        <div><dt>DIALECT VISIBILITY</dt><dd>${entry.dialectVisibility}</dd></div>
        <div><dt>PIN POLICY</dt><dd>${entry.pinPolicy}</dd></div>
      </dl>
      <footer><code>${entry.authorId}</code><span>exact coordinate / OPEN</span></footer>
    </article>
  `;
}

function renderRootAtlas(data) {
  const world = document.querySelector('#world');
  if (!world || world.querySelector('.reality-root-atlas')) return;
  const entries = data.entries ?? [];
  if (entries.length !== 36) return;

  const groups = [...new Set(entries.map(uiRegionGroup))];
  const filters = ['すべて', ...groups]
    .map((group, index) => `<button type="button" data-root-filter="${group}" class="${index === 0 ? 'is-active' : ''}">${group}</button>`)
    .join('');

  world.insertAdjacentHTML('beforeend', `
    <section class="reality-root-atlas" aria-labelledby="realityRootAtlasTitle">
      <header class="reality-root-atlas-heading">
        <div>
          <span>REALITY ROOT ATLAS / AUTHOR READ MODEL</span>
          <h3 id="realityRootAtlasTitle">どこから来たかではなく、どのReality Rootと移動経路を持つか。</h3>
          <p>Reality Root、incident area、birthplace/homeは同義ではない。正確な住所や事件現場pinを作らず、Source statusと移動理由まで一緒に読む。</p>
        </div>
        <dl>
          <div><dt>REAL JAPAN</dt><dd>${data.realJapanRegionCount}</dd></div>
          <div><dt>FUTURE</dt><dd>${data.futureAbstractCount}</dd></div>
          <div><dt>OPEN</dt><dd>${data.openUnmappedCount}</dd></div>
          <div><dt>COORD</dt><dd>${data.exactCoordinateCount}</dd></div>
        </dl>
      </header>
      <div class="reality-root-boundary">
        <b>MAP RULE</b>
        <p>root != incident area / incident area != birthplace / region != personality / dialect != intelligence or class / skin tone != origin / Future15 != future-era origin</p>
      </div>
      <div class="reality-root-filters">${filters}</div>
      <div class="reality-root-grid">${entries.map(rootCardMarkup).join('')}</div>
      <footer class="reality-root-atlas-footer">
        <span>UI REGION GROUPING / DERIVED FOR NAVIGATION ONLY</span>
        <p>Future abstractとOpenはfakeな現代日本座標へ置かない。線や地域分類は作者ナビゲーションであり、人物の性格・階級・運命を決めない。</p>
      </footer>
    </section>
  `);

  const atlas = world.querySelector('.reality-root-atlas');
  atlas?.querySelectorAll('[data-root-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.rootFilter;
      atlas.querySelectorAll('[data-root-filter]').forEach((item) => item.classList.toggle('is-active', item === button));
      atlas.querySelectorAll('.reality-root-card').forEach((card) => {
        card.hidden = filter !== 'すべて' && card.dataset.rootGroup !== filter;
      });
    });
  });
}

async function bootRealityRootAtlas() {
  try {
    const response = await fetch(REALITY_ROOT_DATA_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Reality Root atlas HTTP ${response.status}`);
    renderRootAtlas(await response.json());
  } catch (error) {
    console.error('[lorebook] failed to load Reality Root atlas', error);
  }
}

bootRealityRootAtlas();
