const REALITY_ROOT_DATA_URL = './data/reality-root-candidates.v1.json';

const geographyStyles = document.createElement('link');
geographyStyles.rel = 'stylesheet';
geographyStyles.href = './geography.css';
document.head.append(geographyStyles);

const regionRules = [
  ['北海道', ['北海道']],
  ['東北', ['青森','岩手','宮城','秋田','山形','福島','仙台','庄内']],
  ['関東', ['東京','神奈川','埼玉','千葉','茨城','栃木','群馬','横浜','川口','荒川']],
  ['中部・北陸', ['新潟','富山','石川','福井','山梨','長野','岐阜','静岡','愛知','金沢']],
  ['近畿', ['三重','滋賀','京都','大阪','兵庫','奈良','和歌山']],
  ['中国・四国', ['鳥取','島根','岡山','広島','山口','徳島','香川','愛媛','高知']],
  ['九州・沖縄', ['福岡','佐賀','長崎','熊本','大分','宮崎','鹿児島','沖縄','奄美']],
];

function placementFor(entry) {
  if (entry.root.includes('Far Future')) return { id:'future', label:'FUTURE ABSTRACT', group:'Future' };
  if (entry.root.includes('Open')) return { id:'open', label:'OPEN / UNMAPPED', group:'Open' };
  const match = regionRules.find(([, needles]) => needles.some((needle) => entry.root.includes(needle)));
  return { id:'region', label:'REGION LEVEL', group:match?.[0] ?? 'その他' };
}

function rootCardMarkup(entry) {
  const placement = placementFor(entry);
  const movement = entry.incidentArea && entry.incidentArea !== entry.root
    ? `<div class="root-journey"><span>ROOT</span><b>${entry.root}</b><i>→</i><span>INCIDENT</span><b>${entry.incidentArea}</b></div>`
    : `<div class="root-journey is-local"><span>ROOT / INCIDENT</span><b>${entry.root}</b></div>`;
  return `
    <article class="reality-root-card" data-root-group="${placement.group}" data-root-placement="${placement.id}" data-root-status="${entry.status}">
      <header><span>${placement.label}</span><b>${entry.status}</b></header>
      <h4>${entry.name}</h4>
      ${movement}
      <dl>
        <div><dt>MOBILITY</dt><dd>${entry.mobility}</dd></div>
        <div><dt>DIALECT</dt><dd>${entry.dialect}</dd></div>
      </dl>
      <footer><code>${entry.id}</code><span>exact coordinate / OPEN</span></footer>
    </article>
  `;
}

function renderRootAtlas(data) {
  const world = document.querySelector('#world');
  if (!world || world.querySelector('.reality-root-atlas')) return;
  const entries = data.entries ?? [];
  if (entries.length !== 36) return;
  const cards = entries.map(rootCardMarkup).join('');
  const groups = [...new Set(entries.map((entry) => placementFor(entry).group))];
  const filters = ['すべて', ...groups].map((group, index) => `<button type="button" data-root-filter="${group}" class="${index === 0 ? 'is-active' : ''}">${group}</button>`).join('');
  const realCount = entries.filter((entry) => placementFor(entry).id === 'region').length;
  const futureCount = entries.filter((entry) => placementFor(entry).id === 'future').length;
  const openCount = entries.filter((entry) => placementFor(entry).id === 'open').length;

  world.insertAdjacentHTML('beforeend', `
    <section class="reality-root-atlas" aria-labelledby="realityRootAtlasTitle">
      <header class="reality-root-atlas-heading">
        <div><span>REALITY ROOT ATLAS / REGION LEVEL</span><h3 id="realityRootAtlasTitle">どこから来て、なぜ別の場所へ行けたのか。</h3><p>出身地と事件地域を同じpinにしない。正確な住所は置かず、地域・移動理由・Source statusを読む。</p></div>
        <dl><div><dt>REAL JAPAN</dt><dd>${realCount}</dd></div><div><dt>FUTURE</dt><dd>${futureCount}</dd></div><div><dt>OPEN</dt><dd>${openCount}</dd></div></dl>
      </header>
      <div class="reality-root-boundary">
        <b>MAP RULE</b><p>地域 = 性格ではない / 肌 = 出身ではない / incident area = birthplaceではない / exact home coordinate = OPEN</p>
      </div>
      <div class="reality-root-filters">${filters}</div>
      <div class="reality-root-grid">${cards}</div>
      <footer class="reality-root-atlas-footer">
        <span>UI REGION GROUPING / DERIVED FOR NAVIGATION ONLY</span>
        <p>Future abstract / Openは現代日本のfake座標へ置かない。Dialectは脚本生成器ではなくSource metadata。</p>
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
    const response = await fetch(REALITY_ROOT_DATA_URL, { cache:'no-store' });
    if (!response.ok) throw new Error(`Reality Root atlas HTTP ${response.status}`);
    const data = await response.json();
    renderRootAtlas(data);
  } catch (error) {
    console.error('[lorebook] failed to load Reality Root atlas', error);
  }
}

bootRealityRootAtlas();
