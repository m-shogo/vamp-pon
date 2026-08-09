const DATA_URL = './data/world-bible.v1.json';

const state = {
  data: null,
  group: 'all',
  characterQuery: '',
  glossaryQuery: '',
  relationFocus: null,
  authorMode: localStorage.getItem('yoruno-lorebook-author-mode') === 'true',
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function statusBadge(status) {
  const label = status === 'OPEN_QUESTION' ? 'OPEN' : status === 'USER_DIRECTION' ? 'DIRECTION' : status;
  return `<span class="status-badge ${status}">${label}</span>`;
}

function groupLabel(id) {
  return state.data.groups.find((group) => group.id === id)?.label ?? id;
}

function characterById(id) {
  return state.data.characters.find((character) => character.id === id);
}

function relationsForCharacter(id) {
  return state.data.relationships.filter((relation) => relation.from === id || relation.to === id);
}

function applyAuthorMode() {
  document.body.classList.toggle('author-mode', state.authorMode);
  const toggle = $('#spoilerToggle');
  toggle.textContent = `作者ノート ${state.authorMode ? 'ON' : 'OFF'}`;
  toggle.setAttribute('aria-pressed', String(state.authorMode));
  localStorage.setItem('yoruno-lorebook-author-mode', String(state.authorMode));
}

function renderGroupFilters() {
  const filters = [{ id: 'all', label: '全員' }, ...state.data.groups];
  $('#groupFilters').innerHTML = filters.map((group) => `
    <button type="button" class="filter-button ${state.group === group.id ? 'is-active' : ''}" data-group="${group.id}">
      ${group.label}
    </button>
  `).join('');

  $$('.filter-button', $('#groupFilters')).forEach((button) => {
    button.addEventListener('click', () => {
      state.group = button.dataset.group;
      renderGroupFilters();
      renderCharacters();
    });
  });
}

function renderCharacters() {
  const query = state.characterQuery.trim().toLowerCase();
  const characters = state.data.characters.filter((character) => {
    const groupMatch = state.group === 'all' || character.group === state.group;
    const haystack = [character.name, character.core, character.starBeast, character.motif, ...character.tags].join(' ').toLowerCase();
    return groupMatch && (!query || haystack.includes(query));
  });

  $('#characterGrid').innerHTML = characters.length ? characters.map((character) => `
    <article class="character-card" tabindex="0" role="button" data-character-id="${character.id}" aria-label="${character.name}のプロフィールを開く">
      <div class="card-top">
        <span class="group-mark">${groupLabel(character.group)}</span>
        ${statusBadge(character.status)}
      </div>
      <h3>${character.name}</h3>
      <div class="star">✦ 星獣 ${character.starBeast}</div>
      <p class="core">${character.core}</p>
      <p class="growth">${character.growth}</p>
      <div class="tags">${character.tags.map((tag) => `<span>#${tag}</span>`).join('')}</div>
    </article>
  `).join('') : '<div class="empty-state">該当する人物がいません。</div>';

  $$('.character-card').forEach((card) => {
    const open = () => openCharacter(card.dataset.characterId);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });
}

function openCharacter(id) {
  const character = characterById(id);
  if (!character) return;
  const relations = relationsForCharacter(id);
  $('#characterDialogBody').innerHTML = `
    <div class="dialog-body">
      <div class="dialog-head">
        <div>
          <span class="eyebrow">${groupLabel(character.group)}</span>
          <h2>${character.name}</h2>
          <div class="star">✦ ${character.starBeast}</div>
        </div>
        ${statusBadge(character.status)}
      </div>
      <p class="dialog-core">${character.core}</p>
      <div class="dialog-facts">
        <div class="dialog-fact"><span>QUESTION</span><strong>${character.question}</strong></div>
        <div class="dialog-fact"><span>ANSWER</span><strong>${character.answer}</strong></div>
        <div class="dialog-fact"><span>GROWTH</span><strong>${character.growth}</strong></div>
        <div class="dialog-fact"><span>MOTIF</span><strong>${character.motif}</strong></div>
      </div>
      <div class="dialog-relations">
        <h3>この人物の優先関係 ${relations.length}</h3>
        ${relations.map((relation) => {
          const otherId = relation.from === id ? relation.to : relation.from;
          return `<button type="button" data-relation-id="${relation.id}"><span>${characterById(otherId)?.name ?? otherId} — ${relation.label}</span><small>${relation.status}</small></button>`;
        }).join('') || '<p>現在の優先関係は未登録です。</p>'}
      </div>
      <div class="source-note">
        <h3>Source</h3>
        <ul>${character.sources.map((source) => `<li><code>${source}</code></li>`).join('')}</ul>
      </div>
    </div>
  `;
  $$('[data-relation-id]', $('#characterDialogBody')).forEach((button) => {
    button.addEventListener('click', () => {
      $('#characterDialog').close();
      location.hash = '#relationships';
      focusRelation(button.dataset.relationId);
    });
  });
  $('#characterDialog').showModal();
}

const relationPositions = {
  yui:[12,13], asa:[31,9], nagi:[50,13], michiru:[69,9], tomori:[88,13],
  sen:[10,38], ritsu:[26,33], koyori:[42,40], gen:[58,33], hana:[74,40], yuubi:[90,34],
  madoka:[15,61], shiro:[33,58], tobari:[51,64], nemu:[69,57], ren:[87,63],
  kuroori:[12,87], kasumi:[31,82], kaname:[50,88], toki:[69,82], tsumugi:[88,88],
};

function renderRelationshipMap() {
  const map = $('#relationshipMap');
  const focus = state.relationFocus;
  const connectedIds = focus ? new Set([focus, ...relationsForCharacter(focus).flatMap((relation) => [relation.from, relation.to])]) : null;
  const lines = state.data.relationships.map((relation) => {
    const from = relationPositions[relation.from];
    const to = relationPositions[relation.to];
    if (!from || !to) return '';
    const dimmed = focus && relation.from !== focus && relation.to !== focus;
    return `<line class="relation-line ${relation.status === 'CANDIDATE' ? 'candidate' : ''} ${dimmed ? 'is-dimmed' : ''}" data-line-relation-id="${relation.id}" x1="${from[0]}%" y1="${from[1]}%" x2="${to[0]}%" y2="${to[1]}%"></line>`;
  }).join('');

  const nodes = state.data.characters.map((character) => {
    const pos = relationPositions[character.id] ?? [50,50];
    const dimmed = connectedIds && !connectedIds.has(character.id);
    return `<button type="button" class="relation-node ${state.relationFocus === character.id ? 'is-focused' : ''} ${dimmed ? 'is-dimmed' : ''}" style="left:${pos[0]}%;top:${pos[1]}%" data-map-character="${character.id}">
      <span class="node-orb">${character.name.slice(0,1)}</span><small>${character.name}</small>
    </button>`;
  }).join('');

  map.innerHTML = `<svg aria-hidden="true" preserveAspectRatio="none">${lines}</svg>${nodes}`;
  $$('[data-map-character]', map).forEach((button) => {
    button.addEventListener('click', () => {
      state.relationFocus = state.relationFocus === button.dataset.mapCharacter ? null : button.dataset.mapCharacter;
      renderRelationshipMap();
      renderRelationshipList();
      renderRelationDetailForCharacter(state.relationFocus);
    });
  });
}

function renderRelationshipList() {
  const relations = state.relationFocus
    ? relationsForCharacter(state.relationFocus)
    : state.data.relationships;
  $('#relationshipList').innerHTML = relations.map((relation) => {
    const from = characterById(relation.from);
    const to = characterById(relation.to);
    return `
      <article class="relationship-item" data-relation-id="${relation.id}">
        <div class="pair">${from.name}<br>× ${to.name}</div>
        <div><h4>${relation.label}</h4><p>${relation.summary}</p></div>
        ${statusBadge(relation.status)}
      </article>
    `;
  }).join('');
  $$('.relationship-item').forEach((item) => item.addEventListener('click', () => focusRelation(item.dataset.relationId)));
}

function renderRelationDetailForCharacter(characterId) {
  const detail = $('#relationshipDetail');
  if (!characterId) {
    detail.innerHTML = '<p class="eyebrow">RELATION FILE</p><h3>関係を選んでください</h3><p>CANONとCANDIDATEを混ぜず、思想・家族・夜で初めて生まれた関係を見分けられます。</p>';
    return;
  }
  const character = characterById(characterId);
  detail.innerHTML = `
    <p class="eyebrow">CHARACTER FOCUS</p>
    <h3>${character.name}</h3>
    <p>${character.core}</p>
    <p><b>${relationsForCharacter(characterId).length}</b> 本の優先関係を表示中。線が少ないことより、相手ごとに違う面が出ることを重視します。</p>
  `;
}

function focusRelation(id) {
  const relation = state.data.relationships.find((item) => item.id === id);
  if (!relation) return;
  const from = characterById(relation.from);
  const to = characterById(relation.to);
  state.relationFocus = null;
  renderRelationshipMap();
  renderRelationshipList();
  $('#relationshipDetail').innerHTML = `
    <p class="eyebrow">RELATION FILE</p>
    <div class="relation-pair"><span>${from.name}</span><span>×</span><span>${to.name}</span></div>
    <h3>${relation.label}</h3>
    ${statusBadge(relation.status)}
    <p>${relation.summary}</p>
    <p><small>TYPE — ${relation.type}</small></p>
  `;
  $('#relationshipDetail').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function renderTimeline() {
  $('#timeline').innerHTML = state.data.timeline.map((item, index) => `
    <article class="timeline-item">
      <div class="index">${String(index + 1).padStart(2,'0')}</div>
      <div>${statusBadge(item.status)}<h3>${item.label}</h3><p>${item.summary}</p></div>
    </article>
  `).join('');
}

function renderStory() {
  $('#storyIdentity').textContent = state.data.story.identity;
  $('#mysteryLanes').innerHTML = state.data.story.mysteryLanes.map((lane, index) => `
    <article class="mystery-card"><span>0${index + 1}</span><h3>${lane.label}</h3><p>${lane.description}</p></article>
  `).join('');
  $('#engineCandidate').innerHTML = `
    <p class="eyebrow">HIGH-VALUE CANDIDATE</p>
    <h3>黒インク Story Engine</h3>
    <blockquote>${state.data.story.engineCandidate}</blockquote>
    <p>※ Main Mysteryの最終正史ではありません。</p>
  `;
}

function renderGlossary() {
  const query = state.glossaryQuery.trim().toLowerCase();
  const entries = state.data.glossary.filter((entry) => `${entry.term} ${entry.meaning}`.toLowerCase().includes(query));
  $('#glossaryList').innerHTML = entries.length ? entries.map((entry) => `
    <dl class="glossary-item"><dt>${entry.term}</dt><dd>${entry.meaning}</dd></dl>
  `).join('') : '<div class="empty-state">該当する用語がありません。</div>';
}

function renderAuthorsDesk() {
  $('#openQuestions').innerHTML = state.data.openQuestions.map((item) => `
    <article class="question-card">
      <span class="question-area">${item.area}</span>
      <h3>${item.question}</h3>
      <p>影響: ${item.impact}</p>
    </article>
  `).join('');
  $('#sourceList').innerHTML = state.data.authority.sources.map((source) => `<li><code>${source}</code></li>`).join('');
}

function installNavigation() {
  const menu = $('#menuToggle');
  const rail = $('#sectionNav');
  menu.addEventListener('click', () => {
    const open = rail.classList.toggle('is-open');
    menu.setAttribute('aria-expanded', String(open));
  });
  $$('a', rail).forEach((link) => link.addEventListener('click', () => {
    rail.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
  }));

  const sectionLinks = $$('a[href^="#"]', rail);
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    sectionLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`));
  }, { rootMargin: '-18% 0px -68% 0px', threshold: [0,.2,.5] });
  $$('main section[id]').forEach((section) => observer.observe(section));
}

function installEvents() {
  $('#spoilerToggle').addEventListener('click', () => {
    state.authorMode = !state.authorMode;
    applyAuthorMode();
  });
  $('#characterSearch').addEventListener('input', (event) => {
    state.characterQuery = event.target.value;
    renderCharacters();
  });
  $('#glossarySearch').addEventListener('input', (event) => {
    state.glossaryQuery = event.target.value;
    renderGlossary();
  });
  $('#resetRelationFocus').addEventListener('click', () => {
    state.relationFocus = null;
    renderRelationshipMap();
    renderRelationshipList();
    renderRelationDetailForCharacter(null);
  });
  $('.dialog-close').addEventListener('click', () => $('#characterDialog').close());
  $('#characterDialog').addEventListener('click', (event) => {
    if (event.target === $('#characterDialog')) $('#characterDialog').close();
  });
}

function renderAll() {
  $('#heroCharacterCount').textContent = String(state.data.characters.length);
  $('#heroRelationCount').textContent = String(state.data.relationships.length);
  $('#dataUpdatedAt').textContent = `Data ${state.data.updatedAt}`;
  renderGroupFilters();
  renderCharacters();
  renderRelationshipMap();
  renderRelationshipList();
  renderTimeline();
  renderStory();
  renderGlossary();
  renderAuthorsDesk();
  applyAuthorMode();
}

async function boot() {
  try {
    const response = await fetch(DATA_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.data = await response.json();
    renderAll();
    installEvents();
    installNavigation();
  } catch (error) {
    console.error('[lorebook] failed to load data', error);
    document.querySelector('main').innerHTML = `
      <section class="chapter"><div class="empty-state"><h1>世界設定データを読み込めませんでした。</h1><p>${String(error)}</p></div></section>
    `;
  }
}

boot();
