const RELATION_DATA_URL = './data/world-bible.v1.json';
const ARC_DATA_URL = './data/relationship-arcs.v1.json';

let relationshipData = [];
let arcData = [];
let activeFilter = 'all';

const typeBuckets = [
  { id: 'all', label: 'すべて' },
  { id: 'canon', label: 'CANON' },
  { id: 'candidate', label: 'CANDIDATE' },
  { id: 'family', label: '家族' },
  { id: 'ideological', label: '思想の鏡' },
  { id: 'night', label: '夜で育つ' },
  { id: 'temporal', label: '時間 / 観測' },
  { id: 'mystery', label: 'Mystery' },
];

const relationshipStyles = document.createElement('link');
relationshipStyles.rel = 'stylesheet';
relationshipStyles.href = './relationship.css';
document.head.append(relationshipStyles);

function relationById(id) {
  return relationshipData.find((relation) => relation.id === id);
}

function arcById(id) {
  return arcData.find((arc) => arc.relationshipId === id);
}

function relationMatchesFilter(relation) {
  if (!relation || activeFilter === 'all') return true;
  if (activeFilter === 'canon') return relation.status === 'CANON';
  if (activeFilter === 'candidate') return relation.status === 'CANDIDATE';
  if (activeFilter === 'family') return relation.type === 'family';
  if (activeFilter === 'ideological') return relation.type.includes('ideological');
  if (activeFilter === 'night') return ['night_bond', 'contrast', 'boundary', 'timing'].includes(relation.type);
  if (activeFilter === 'temporal') return ['temporal', 'observation', 'knowledge'].includes(relation.type);
  if (activeFilter === 'mystery') return relation.type === 'mystery' || relation.summary.toLowerCase().includes('真相');
  return true;
}

function ensureFilterBar() {
  const chapter = document.querySelector('#relationships');
  const layout = chapter?.querySelector('.relation-layout');
  if (!chapter || !layout || chapter.querySelector('.relation-filter-row')) return;
  layout.insertAdjacentHTML('beforebegin', `
    <div class="relation-filter-row" aria-label="人間関係フィルター">
      <span>関係の読み方</span>
      <div>${typeBuckets.map((bucket) => `<button type="button" data-relation-filter="${bucket.id}" class="${bucket.id === activeFilter ? 'is-active' : ''}">${bucket.label}</button>`).join('')}</div>
    </div>
  `);
  chapter.querySelectorAll('[data-relation-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.relationFilter;
      chapter.querySelectorAll('[data-relation-filter]').forEach((item) => item.classList.toggle('is-active', item === button));
      applyRelationFilter();
    });
  });
}

function applyRelationFilter() {
  document.querySelectorAll('.relationship-item[data-relation-id]').forEach((item) => {
    const relation = relationById(item.dataset.relationId);
    item.hidden = !relationMatchesFilter(relation);
  });
  document.querySelectorAll('[data-line-relation-id]').forEach((line) => {
    const relation = relationById(line.dataset.lineRelationId);
    line.classList.toggle('filter-hidden', !relationMatchesFilter(relation));
  });
}

function arcMarkup(arc) {
  if (!arc) return '';
  const steps = [
    ['A', 'First read', arc.firstRead],
    ['B', 'Useful friction', arc.usefulFriction],
    ['C', 'Failure / exposure', arc.failureExposure],
    ['D', 'Chosen trust', arc.chosenTrust],
    ['E', 'Dawn proof', arc.dawnProof],
  ];
  return `
    <section class="relation-arc" data-enhanced-relation="${arc.relationshipId}">
      <div class="relation-arc-heading"><span>RELATION ARC</span><strong>${arc.relationshipType}</strong></div>
      <ol>${steps.map(([code, label, text]) => `<li><span class="arc-code">${code}</span><div><b>${label}</b><p>${text}</p></div></li>`).join('')}</ol>
    </section>
  `;
}

function enhanceRelationDetail() {
  const detail = document.querySelector('#relationshipDetail');
  if (!detail) return;
  const title = detail.querySelector('h3')?.textContent?.trim();
  if (!title || title === '関係を選んでください') return;
  const relation = relationshipData.find((item) => item.label === title);
  if (!relation) return;
  const existing = detail.querySelector('.relation-arc');
  if (existing?.dataset.enhancedRelation === relation.id) return;
  existing?.remove();
  const arc = arcById(relation.id);
  if (arc) detail.insertAdjacentHTML('beforeend', arcMarkup(arc));
  else detail.insertAdjacentHTML('beforeend', `<div class="relation-arc-empty"><span>ARC STATUS</span><p>この関係は現在relation reservoir段階。5段階arcはまだ未確定です。</p></div>`);
}

function renderEnsembles() {
  const chapter = document.querySelector('#relationships');
  if (!chapter || chapter.querySelector('.ensemble-section')) return;
  const data = window.__yorunoRelationshipArcData;
  if (!data?.ensembles?.length) return;
  chapter.insertAdjacentHTML('beforeend', `
    <section class="ensemble-section">
      <header><span>ENSEMBLE RELATIONS</span><h3>2人では見えない関係</h3><p>説明役を一人に集めず、3人以上の違う証拠や正しさが重なって世界が見える。</p></header>
      <div class="ensemble-grid">${data.ensembles.map((ensemble) => {
        const names = ensemble.members.map((id) => relationshipData.__characters?.get(id) ?? id).join(' / ');
        return `<article><small>${names}</small><h4>${ensemble.label}</h4><p>${ensemble.summary}</p></article>`;
      }).join('')}</div>
    </section>
  `);
}

async function bootRelationshipEnhancement() {
  try {
    const [worldResponse, arcResponse] = await Promise.all([
      fetch(RELATION_DATA_URL, { cache: 'no-store' }),
      fetch(ARC_DATA_URL, { cache: 'no-store' }),
    ]);
    if (!worldResponse.ok || !arcResponse.ok) throw new Error(`world=${worldResponse.status} arc=${arcResponse.status}`);
    const world = await worldResponse.json();
    const arcBook = await arcResponse.json();
    relationshipData = world.relationships ?? [];
    relationshipData.__characters = new Map((world.characters ?? []).map((character) => [character.id, character.name]));
    arcData = arcBook.arcs ?? [];
    window.__yorunoRelationshipArcData = arcBook;

    ensureFilterBar();
    applyRelationFilter();
    enhanceRelationDetail();
    renderEnsembles();

    const list = document.querySelector('#relationshipList');
    const map = document.querySelector('#relationshipMap');
    const detail = document.querySelector('#relationshipDetail');
    if (list) new MutationObserver(() => applyRelationFilter()).observe(list, { childList: true, subtree: true });
    if (map) new MutationObserver(() => applyRelationFilter()).observe(map, { childList: true, subtree: true });
    if (detail) new MutationObserver(() => queueMicrotask(enhanceRelationDetail)).observe(detail, { childList: true, subtree: true });
  } catch (error) {
    console.error('[lorebook] failed to load relationship enhancement', error);
  }
}

bootRelationshipEnhancement();
