const ERA_DIALOGUE_ATLAS_URL = './data/era-dialogue-atlas.v1.json';

const eraDialogueStyles = document.createElement('link');
eraDialogueStyles.rel = 'stylesheet';
eraDialogueStyles.href = './era-dialogue-atlas.css';
document.head.append(eraDialogueStyles);

const laneLabels = {
  POSTWAR_RECOVERY_SCARCITY: 'POSTWAR / RECOVERY',
  GROWTH_POLLUTION_ENERGY_TRANSITION: 'GROWTH / TRANSITION',
  POST_BUBBLE_EARLY_MOBILE_INTERNET: 'POST-BUBBLE / EARLY NET',
  PRESENT_INFORMATION_ABUNDANCE: 'PRESENT / INFO ABUNDANCE',
  FAR_FUTURE_IDENTITY_COEXISTENCE: 'FAR FUTURE / IDENTITY',
  CROSS_ERA_LONG_LIVED: 'CROSS-ERA / OPEN SPECIAL',
};

function fingerprintSummary(fingerprints) {
  return Object.entries(fingerprints)
    .map(([key, values]) => `<details><summary>${key}</summary><ul>${values.map((value) => `<li>${value}</li>`).join('')}</ul></details>`)
    .join('');
}

function eraDialogueCard(entry) {
  return `
    <article class="era-dialogue-card" data-era-lane="${entry.lane}" data-roster="${entry.rosterLayer}" data-era-status="${entry.assignmentStatus}">
      <header>
        <div><span>${entry.rosterLayer}</span><h3>${entry.name}</h3><code>${entry.id}</code></div>
        <div class="era-dialogue-status"><b>${entry.assignmentStatus}</b><small>${laneLabels[entry.lane] ?? entry.lane}</small></div>
      </header>
      <div class="era-dialogue-anchors">
        <span>PERSONAL ANCHORS</span>
        ${entry.personalAnchors.map((anchor) => `<p>${anchor}</p>`).join('')}
      </div>
      <div class="era-reveal-sequence">
        <article><span>01 / ORDINARY MISMATCH</span><p>${entry.ordinaryMismatch}</p></article>
        <article><span>02 / PLAUSIBLE MISREAD</span><p>${entry.plausibleMisread}</p></article>
        <article><span>03 / MATERIAL OR RECORD</span><p>${entry.materialOrRecordEvidence}</p></article>
        <article><span>04 / REINTERPRETATION</span><p>${entry.reinterpretation}</p></article>
      </div>
      <div class="era-dialogue-pair">
        <blockquote><span>FIRST READ</span>${entry.dialogueA}</blockquote>
        <blockquote><span>SECOND LINE</span>${entry.dialogueB}</blockquote>
      </div>
      <div class="era-trace-row"><div><span>OBJECT / TRACE</span><p>${entry.objectOrTrace}</p></div><div><span>DO NOT JUMP TO</span><p>${entry.forbiddenShortcut}</p></div></div>
      <details class="era-fingerprint-details">
        <summary>9 ERA FINGERPRINT DIMENSIONS</summary>
        <div>${fingerprintSummary(entry.fingerprints)}</div>
      </details>
    </article>
  `;
}

function renderEraDialogueAtlas(data) {
  const history = document.querySelector('#history');
  if (!history || history.querySelector('.era-dialogue-atlas')) return;
  const entries = data.entries ?? [];
  if (entries.length !== 36) return;

  const laneFilters = Object.keys(data.laneCounts ?? {}).map((lane) => `<button type="button" data-era-filter-lane="${lane}">${laneLabels[lane] ?? lane} · ${data.laneCounts[lane]}</button>`).join('');
  const anchor = history.querySelector('.history-atlas') ?? history.querySelector('.temporal-map') ?? history.querySelector('.section-head');
  if (!anchor) return;

  anchor.insertAdjacentHTML('afterend', `
    <section class="era-dialogue-atlas" aria-labelledby="eraDialogueAtlasTitle">
      <header class="era-dialogue-heading">
        <div><span>36 CHARACTER / ERA DIALOGUE ATLAS</span><h2 id="eraDialogueAtlasTitle">世代を説明しない。会話と物の扱いから、あとで気づけるようにする。</h2><p>Exact year / ageを埋めず、Era lane・日常違和感・誤読・物証・意味反転を一人ずつ追うAuthor read-model。生成元はTypeScript Author DBで、この画面は新しいStory masterではない。</p></div>
        <dl><div><dt>CHARACTERS</dt><dd>${data.characterCount}</dd></div><div><dt>CURRENT21</dt><dd>${data.current21Count}</dd></div><div><dt>FUTURE15</dt><dd>${data.future15Count}</dd></div></dl>
      </header>
      <div class="era-dialogue-boundary"><b>WRITING RULE</b><p>one clue != era proof / Future15 != future era / old != ignorant / future != superior / dialogue != relationship Canon / scene != Star Beast or obsolete-constellation assignment</p></div>
      <div class="era-dialogue-toolbar">
        <div class="era-dialogue-filter-row"><button type="button" data-era-filter-all class="is-active">ALL · ${data.characterCount}</button>${laneFilters}</div>
        <div class="era-dialogue-filter-row secondary"><button type="button" data-roster-filter="CURRENT21">CURRENT21</button><button type="button" data-roster-filter="FUTURE15">FUTURE15</button><button type="button" data-status-filter="UPSTREAM_CURRENT">UPSTREAM CURRENT</button><button type="button" data-status-filter="AUTHOR_CANDIDATE">AUTHOR CANDIDATE</button><button type="button" data-status-filter="OPEN_SPECIAL">OPEN SPECIAL</button></div>
      </div>
      <div class="era-dialogue-grid">${entries.map(eraDialogueCard).join('')}</div>
    </section>
  `);

  const atlas = history.querySelector('.era-dialogue-atlas');
  let lane = null;
  let roster = null;
  let status = null;
  const apply = () => {
    atlas.querySelectorAll('.era-dialogue-card').forEach((card) => {
      card.hidden = Boolean((lane && card.dataset.eraLane !== lane) || (roster && card.dataset.roster !== roster) || (status && card.dataset.eraStatus !== status));
    });
  };
  atlas.querySelector('[data-era-filter-all]')?.addEventListener('click', (event) => {
    lane = null; roster = null; status = null;
    atlas.querySelectorAll('button').forEach((button) => button.classList.remove('is-active'));
    event.currentTarget.classList.add('is-active');
    apply();
  });
  atlas.querySelectorAll('[data-era-filter-lane]').forEach((button) => button.addEventListener('click', () => {
    lane = button.dataset.eraFilterLane === lane ? null : button.dataset.eraFilterLane;
    atlas.querySelectorAll('[data-era-filter-lane]').forEach((item) => item.classList.toggle('is-active', item.dataset.eraFilterLane === lane));
    atlas.querySelector('[data-era-filter-all]')?.classList.toggle('is-active', !lane && !roster && !status);
    apply();
  }));
  atlas.querySelectorAll('[data-roster-filter]').forEach((button) => button.addEventListener('click', () => {
    roster = button.dataset.rosterFilter === roster ? null : button.dataset.rosterFilter;
    atlas.querySelectorAll('[data-roster-filter]').forEach((item) => item.classList.toggle('is-active', item.dataset.rosterFilter === roster));
    atlas.querySelector('[data-era-filter-all]')?.classList.toggle('is-active', !lane && !roster && !status);
    apply();
  }));
  atlas.querySelectorAll('[data-status-filter]').forEach((button) => button.addEventListener('click', () => {
    status = button.dataset.statusFilter === status ? null : button.dataset.statusFilter;
    atlas.querySelectorAll('[data-status-filter]').forEach((item) => item.classList.toggle('is-active', item.dataset.statusFilter === status));
    atlas.querySelector('[data-era-filter-all]')?.classList.toggle('is-active', !lane && !roster && !status);
    apply();
  }));
}

async function bootEraDialogueAtlas() {
  try {
    const response = await fetch(ERA_DIALOGUE_ATLAS_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Era Dialogue Atlas HTTP ${response.status}`);
    renderEraDialogueAtlas(await response.json());
  } catch (error) {
    console.error('[lorebook] failed to load Era Dialogue Atlas', error);
  }
}

bootEraDialogueAtlas();
