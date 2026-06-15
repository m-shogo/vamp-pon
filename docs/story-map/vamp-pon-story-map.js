const DATA_URL = './vamp-pon-story-map-data.json';
const POSITION_KEY = 'vampPon.storyMap.positions';
const NOTE_KEY = 'vampPon.storyMap.notes';

let data = null;
let activeId = 'yui';

const $ = (id) => document.getElementById(id);
const els = {
  stats: $('stats'),
  board: $('nodeBoard'),
  svg: $('edgeSvg'),
  detail: $('detailPanel'),
  count: $('visibleCount'),
  search: $('searchInput'),
  lineage: $('lineageFilter'),
  season: $('seasonFilter'),
  status: $('statusFilter'),
  reset: $('resetButton'),
  brief: $('briefBox'),
  itemTable: $('itemTable'),
  readingTable: $('readingTable'),
  edgeTable: $('edgeTable'),
  backlogTable: $('backlogTable')
};

function readStore(key, fallback = {}) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function tagClass(lineage) {
  return ['fire', 'water', 'light', 'dark', 'neutral'].includes(lineage) ? lineage : '';
}

function characterName(id) {
  return data.characters.find((c) => c.id === id)?.name || id;
}

function getPosition(c) {
  const saved = readStore(POSITION_KEY, {});
  return saved[c.id] || c.pos || { x: 0, y: 0 };
}

function setPosition(id, pos) {
  const saved = readStore(POSITION_KEY, {});
  saved[id] = pos;
  writeStore(POSITION_KEY, saved);
}

function getNotes(id) {
  return readStore(NOTE_KEY, {})[id] || '';
}

function setNotes(id, value) {
  const notes = readStore(NOTE_KEY, {});
  notes[id] = value;
  writeStore(NOTE_KEY, notes);
}

async function loadData() {
  const response = await fetch(DATA_URL, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Failed to load ${DATA_URL}`);
  data = await response.json();
}

function renderStats() {
  const s1 = data.characters.filter((c) => c.season === 's1').length;
  const future = data.characters.filter((c) => c.season === 'future').length;
  const now = data.characters.filter((c) => c.status === 'design-now').length;
  const trace = data.characters.filter((c) => c.status === 'trace-only').length;
  els.stats.innerHTML = `
    <div class="stat"><strong>${data.characters.length}</strong>Total nodes</div>
    <div class="stat"><strong>${s1}</strong>Season 1</div>
    <div class="stat"><strong>${future}</strong>Future</div>
    <div class="stat"><strong>${now + trace}</strong>Design-visible now</div>`;
}

function renderNodes() {
  els.board.innerHTML = data.characters.map((c) => {
    const pos = getPosition(c);
    return `
      <article class="node" tabindex="0" data-id="${c.id}" data-season="${c.season}" data-status="${c.status}" data-lineage="${c.lineage.join(' ')}" style="left:${pos.x}px;top:${pos.y}px">
        <div class="node-title"><strong>${c.name}</strong><span class="${c.season === 's1' ? 's1' : 'future'}">${c.season === 's1' ? 'Season 1' : 'Future'}</span></div>
        <div>${c.lineage.map((l) => `<span class="tag ${tagClass(l)}">${l}</span>`).join('')}<span class="tag">${c.status}</span></div>
        <p><b>Vessel:</b> ${c.vessel}</p>
        <p><b>Role:</b> ${c.role}</p>
        <p class="small">Next: ${c.next}</p>
      </article>`;
  }).join('');

  els.board.querySelectorAll('.node').forEach((node) => {
    node.addEventListener('click', () => showCharacter(node.dataset.id));
    node.addEventListener('keydown', (event) => { if (event.key === 'Enter') showCharacter(node.dataset.id); });
    enableDrag(node);
  });
}

function enableDrag(node) {
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let baseX = 0;
  let baseY = 0;

  node.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    dragging = true;
    node.setPointerCapture(event.pointerId);
    startX = event.clientX;
    startY = event.clientY;
    baseX = Number.parseFloat(node.style.left) || 0;
    baseY = Number.parseFloat(node.style.top) || 0;
  });

  node.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const x = Math.max(0, baseX + event.clientX - startX);
    const y = Math.max(0, baseY + event.clientY - startY);
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    renderEdges();
  });

  node.addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false;
    setPosition(node.dataset.id, {
      x: Math.round(Number.parseFloat(node.style.left) || 0),
      y: Math.round(Number.parseFloat(node.style.top) || 0)
    });
  });
}

function nodeCenter(id) {
  const node = els.board.querySelector(`[data-id="${id}"]`);
  if (!node || node.classList.contains('hidden')) return null;
  return {
    x: (Number.parseFloat(node.style.left) || 0) + node.offsetWidth / 2,
    y: (Number.parseFloat(node.style.top) || 0) + node.offsetHeight / 2
  };
}

function renderEdges() {
  const maxX = Math.max(1500, ...data.characters.map((c) => getPosition(c).x + 230));
  const maxY = Math.max(920, ...data.characters.map((c) => getPosition(c).y + 190));
  els.svg.setAttribute('viewBox', `0 0 ${maxX} ${maxY}`);
  els.svg.style.width = `${maxX}px`;
  els.svg.style.height = `${maxY}px`;
  els.board.style.width = `${maxX}px`;
  els.board.style.height = `${maxY}px`;

  const lines = data.edges.map(([from, to, relation]) => {
    const a = nodeCenter(from);
    const b = nodeCenter(to);
    if (!a || !b) return '';
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    return `<g><line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/><text x="${mx}" y="${my}">${relation}</text></g>`;
  }).join('');
  els.svg.innerHTML = lines;
}

function briefFor(c) {
  return [
    `Target: ${c.name}`,
    `Season: ${c.season}`,
    `Status: ${c.status}`,
    `Lineage: ${c.lineage.join(' / ')}`,
    `Vessel: ${c.vessel}`,
    `First action: ${c.first}`,
    `Yui link: ${c.yui}`,
    `Other link: ${c.other}`,
    `Items: ${c.items.join(', ')}`,
    `Blank: ${c.blank}`,
    `Happy direction: ${c.happy}`,
    `Next design action: ${c.next}`,
    `Review doc: ${c.reviewDoc || '(not assigned yet)'}`,
    `Preview path: ${c.previewPath || '(not assigned yet)'}`
  ].join('\n');
}

function showCharacter(id) {
  activeId = id;
  const c = data.characters.find((entry) => entry.id === id);
  if (!c) return;
  els.board.querySelectorAll('.node').forEach((node) => node.classList.toggle('active', node.dataset.id === id));
  els.detail.innerHTML = `
    <h2>${c.name}</h2>
    <div class="chips">${c.lineage.map((l) => `<span class="tag ${tagClass(l)}">${l}</span>`).join('')}<span class="tag">${c.status}</span></div>
    <dl>
      <dt>Season</dt><dd>${c.season === 's1' ? 'Season 1' : 'Future'}</dd>
      <dt>Vessel</dt><dd>${c.vessel}</dd>
      <dt>First</dt><dd>${c.first}</dd>
      <dt>Yui link</dt><dd>${c.yui}</dd>
      <dt>Other link</dt><dd>${c.other}</dd>
      <dt>Items</dt><dd>${c.items.join(' / ')}</dd>
      <dt>Blank</dt><dd>${c.blank}</dd>
      <dt>Happy</dt><dd>${c.happy}</dd>
      <dt>Next</dt><dd>${c.next}</dd>
      <dt>Review</dt><dd>${c.reviewDoc || 'not assigned yet'}</dd>
      <dt>Preview</dt><dd>${c.previewPath || 'not assigned yet'}</dd>
    </dl>
    <h3>Local memo</h3>
    <textarea id="nodeNotes" placeholder="このブラウザだけに保存されるメモ">${getNotes(c.id)}</textarea>
    <p class="small">メモはlocalStorage保存。Gitには入りません。</p>`;
  $('nodeNotes').addEventListener('input', (event) => setNotes(c.id, event.target.value));
  els.brief.value = briefFor(c);
}

function showLookup(title, rows) {
  els.detail.innerHTML = `<h2>${title}</h2><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
  els.brief.value = `${title}\n` + rows.map(([k, v]) => `${k}: ${v}`).join('\n');
}

function applyFilters() {
  const q = els.search.value.trim().toLowerCase();
  const lineage = els.lineage.value;
  const season = els.season.value;
  const status = els.status.value;
  let visible = 0;
  els.board.querySelectorAll('.node').forEach((node) => {
    const c = data.characters.find((entry) => entry.id === node.dataset.id);
    const haystack = [c.name, c.vessel, c.role, c.first, c.yui, c.other, c.blank, c.happy, c.next, c.status, ...c.items, ...c.lineage].join(' ').toLowerCase();
    const show = (!q || haystack.includes(q)) && (lineage === 'all' || c.lineage.includes(lineage)) && (season === 'all' || c.season === season) && (status === 'all' || c.status === status);
    node.classList.toggle('hidden', !show);
    if (show) visible += 1;
  });
  els.count.textContent = `${visible} / ${data.characters.length} nodes visible`;
  renderEdges();
}

function renderTables() {
  els.itemTable.innerHTML = data.items.map(([item, owner, meaning]) => `<tr data-click><td>${item}</td><td>${owner}</td><td>${meaning}</td></tr>`).join('');
  els.readingTable.innerHTML = data.readings.map(([type, reading, clue]) => `<tr data-click><td>${type}</td><td>${reading}</td><td>${clue}</td></tr>`).join('');
  els.edgeTable.innerHTML = data.edges.map(([from, to, relation]) => `<tr data-click><td>${characterName(from)}</td><td>${characterName(to)}</td><td>${relation}</td></tr>`).join('');
  els.backlogTable.innerHTML = data.backlog.map(([priority, target, action]) => `<tr data-click><td class="priority-${priority}">${priority}</td><td>${target}</td><td>${action}</td></tr>`).join('');

  document.querySelectorAll('#itemTable tr').forEach((row) => row.addEventListener('click', () => showLookup('Item Reverse Lookup', [['Item', row.children[0].textContent], ['Character', row.children[1].textContent], ['Meaning', row.children[2].textContent]])));
  document.querySelectorAll('#readingTable tr').forEach((row) => row.addEventListener('click', () => showLookup('Reading Lookup', [['Type', row.children[0].textContent], ['Wrong reading', row.children[1].textContent], ['Released clue', row.children[2].textContent]])));
  document.querySelectorAll('#edgeTable tr').forEach((row) => row.addEventListener('click', () => showLookup('Relationship Edge', [['From', row.children[0].textContent], ['To', row.children[1].textContent], ['Relation', row.children[2].textContent]])));
  document.querySelectorAll('#backlogTable tr').forEach((row) => row.addEventListener('click', () => showLookup('Design Backlog', [['Priority', row.children[0].textContent], ['Target', row.children[1].textContent], ['Next action', row.children[2].textContent]])));
}

function bindControls() {
  [els.search, els.lineage, els.season, els.status].forEach((el) => el.addEventListener('input', applyFilters));
  els.reset.addEventListener('click', () => {
    els.search.value = '';
    els.lineage.value = 'all';
    els.season.value = 'all';
    els.status.value = 'all';
    applyFilters();
    showCharacter('yui');
  });
  window.addEventListener('resize', renderEdges);
}

async function init() {
  try {
    await loadData();
    renderStats();
    renderNodes();
    renderTables();
    bindControls();
    showCharacter(activeId);
    applyFilters();
  } catch (error) {
    els.detail.innerHTML = `<h2>Data load error</h2><p>Run a local server from docs/story-map.</p><pre>${String(error)}</pre>`;
  }
}

init();
