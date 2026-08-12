const CONSTELLATION_ARCHIVE_URL = './data/constellation-archive.v1.json';

function archiveStatusBadge(status) {
  return `<span class="status-badge ${status === 'CANON_CURRENT' ? 'CANON' : status === 'CANDIDATE' ? 'CANDIDATE' : 'OPEN_QUESTION'}">${status.replaceAll('_', ' ')}</span>`;
}

function clueResearchEvidenceMarkup(clue) {
  const evidence = clue.researchEvidence;
  if (!evidence) return '';
  return `
    <div class="clue-evidence-state">
      <span>RESEARCH EVIDENCE / NOT CONFIDENCE SCORE</span>
      <dl>
        <div><dt>EVIDENCE</dt><dd>${evidence.evidenceCount}</dd></div>
        <div><dt>VERIFIED</dt><dd>${evidence.verifiedResearchCount}</dd></div>
        <div><dt>CONTENT OPEN</dt><dd>${evidence.bibliographicContentOpenCount}</dd></div>
      </dl>
      <p><b>Exact artifact:</b> ${evidence.tomoriSpecificArtifactConfirmed ? 'CONFIRMED' : 'OPEN'} · <b>Quadrans in Japanese candidate:</b> ${evidence.quadransInJapaneseCandidateConfirmed ? 'CONFIRMED' : 'OPEN'}</p>
      <small>${evidence.recommendedStoryState}</small>
      ${clue.researchSource ? `<code>${clue.researchSource}</code>` : ''}
    </div>
  `;
}

function renderConstellationArchive(data) {
  const root = document.querySelector('#constellationArchive');
  if (!root) return;

  root.innerHTML = `
    <div class="constellation-archive-rules">
      ${data.rules.map((rule) => `<span>${rule}</span>`).join('')}
    </div>
    <div class="constellation-category-grid">
      ${data.categories.map((category) => `
        <article class="constellation-category-card">
          <span class="eyebrow">${category.label}</span>
          <p>${category.meaning}</p>
        </article>
      `).join('')}
    </div>
    <div class="constellation-entry-grid">
      ${data.entries.map((entry) => `
        <article class="constellation-entry-card">
          <div class="card-top"><span class="group-mark">${entry.categoryIds.join(' · ')}</span>${archiveStatusBadge(entry.canonStatus)}</div>
          <h3>${entry.name}</h3>
          <p>${entry.storyUse}</p>
          <small>${entry.evidenceState}</small>
          <div class="callout"><b>禁止ショートカット:</b> ${entry.forbiddenShortcut}</div>
        </article>
      `).join('')}
    </div>
  `;

  const clues = document.querySelector('#constellationStoryClues');
  if (clues) {
    clues.innerHTML = data.storyClues.map((clue) => `
      <article class="question-card">
        <span class="question-area">${clue.tier} · ${clue.status}</span>
        <h3>${clue.label}</h3>
        ${clueResearchEvidenceMarkup(clue)}
        <p><b>次に見るSource:</b> ${clue.nextSource}</p>
      </article>
    `).join('');
  }

  const glossary = document.querySelector('#groupGlossary');
  if (glossary) {
    glossary.innerHTML = data.groupGlossary.map((entry) => `
      <article class="constellation-entry-card">
        <div class="card-top"><span class="group-mark">${entry.kind}</span>${archiveStatusBadge(entry.status)}</div>
        <h3>${entry.term}</h3>
        <p>${entry.definition}</p>
        <small><code>${entry.source}</code></small>
      </article>
    `).join('');
  }
}

async function bootConstellationArchive() {
  try {
    const response = await fetch(CONSTELLATION_ARCHIVE_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    renderConstellationArchive(await response.json());
  } catch (error) {
    console.error('[lorebook] failed to load constellation archive', error);
    const root = document.querySelector('#constellationArchive');
    if (root) root.innerHTML = `<div class="empty-state">星座史Archiveを読み込めませんでした。${String(error)}</div>`;
  }
}

bootConstellationArchive();
