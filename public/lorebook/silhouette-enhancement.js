const SILHOUETTE_HARD_URL = './data/character-silhouette-anchors.v1.json';
const SILHOUETTE_MATRIX_URL = './data/current21-silhouette-matrix.v1.json';
let hardAnchors = [];
let silhouetteMatrix = [];

const silhouetteStyles = document.createElement('link');
silhouetteStyles.rel = 'stylesheet';
silhouetteStyles.href = './silhouette.css';
document.head.append(silhouetteStyles);

function hardAnchorByName(name) {
  return hardAnchors.find((entry) => entry.name === name);
}

function matrixByName(name) {
  return silhouetteMatrix.find((entry) => entry.name === name);
}

function silhouetteMarkup(entry, hardAnchor) {
  const chubby = ['hana', 'kage1'].includes(entry.runtimeId);
  const bodyDirection = hardAnchor?.bodyDirection
    ?? 'Exact body measurements are not locked here. Differentiate this character through posture, clothing mass, object placement and motion without collapsing them into a generic body template.';
  return `
    <section class="silhouette-canon-section${chubby ? ' is-body-diversity-anchor' : ''}" data-silhouette-for="${entry.lorebookId}">
      <div class="silhouette-section-heading">
        <div><span>SILHOUETTE CANON</span><h3>${entry.visualLane}</h3></div>
        <i style="--anchor-theme:${entry.themeHex}" aria-hidden="true"></i>
      </div>
      <p class="silhouette-body-direction">${bodyDirection}</p>
      <dl class="silhouette-facts">
        <div><dt>3秒の輪郭</dt><dd>${entry.silhouetteRead}</dd></div>
        <div><dt>姿勢</dt><dd>${entry.posture}</dd></div>
        <div><dt>動き</dt><dd>${entry.motionSignature}</dd></div>
        <div><dt>集合絵</dt><dd>${entry.ensemblePosition}</dd></div>
        <div><dt>星獣</dt><dd>${entry.starBeast}</dd></div>
      </dl>
      ${hardAnchor ? '<p class="silhouette-authority-note">HARD VISUAL ANCHOR — body / age / accessory direction is separately locked in production data.</p>' : ''}
      ${chubby ? '<p class="silhouette-guardrail">体型はCurrent visual fact。細身への自動補正、体型ギャグ、hitbox / speedへの短絡は禁止。</p>' : ''}
    </section>
  `;
}

function enhanceCards() {
  document.querySelectorAll('.character-card').forEach((card) => {
    if (card.querySelector('.silhouette-hint')) return;
    const name = card.querySelector('h3')?.textContent?.trim();
    if (!name) return;
    const entry = matrixByName(name);
    if (!entry) return;
    const core = card.querySelector('.core');
    if (!core) return;
    const chubby = ['hana', 'kage1'].includes(entry.runtimeId);
    card.dataset.silhouetteAnchor = entry.runtimeId;
    if (chubby) card.dataset.bodyDiversityAnchor = 'true';
    core.insertAdjacentHTML(
      'beforebegin',
      `<div class="silhouette-hint${chubby ? ' is-body-diversity-anchor' : ''}" style="--anchor-theme:${entry.themeHex}"><span>SILHOUETTE</span><strong>${entry.visualLane}</strong></div>`,
    );
  });
}

function enhanceDialog() {
  const body = document.querySelector('#characterDialogBody .dialog-body');
  if (!body || body.querySelector('.silhouette-canon-section')) return;
  const name = body.querySelector('.dialog-head h2')?.textContent?.trim();
  if (!name) return;
  const entry = matrixByName(name);
  if (!entry) return;
  const hardAnchor = hardAnchorByName(name);
  const source = body.querySelector('.source-note');
  if (source) source.insertAdjacentHTML('beforebegin', silhouetteMarkup(entry, hardAnchor));
  else body.insertAdjacentHTML('beforeend', silhouetteMarkup(entry, hardAnchor));
}

async function bootSilhouetteCanon() {
  try {
    const [hardResponse, matrixResponse] = await Promise.all([
      fetch(SILHOUETTE_HARD_URL, { cache: 'no-store' }),
      fetch(SILHOUETTE_MATRIX_URL, { cache: 'no-store' }),
    ]);
    if (!hardResponse.ok) throw new Error(`hard anchors HTTP ${hardResponse.status}`);
    if (!matrixResponse.ok) throw new Error(`matrix HTTP ${matrixResponse.status}`);
    const [hardData, matrixData] = await Promise.all([hardResponse.json(), matrixResponse.json()]);
    hardAnchors = hardData.anchors ?? [];
    silhouetteMatrix = matrixData.entries ?? [];

    const grid = document.querySelector('#characterGrid');
    const dialogBody = document.querySelector('#characterDialogBody');
    if (grid) new MutationObserver(enhanceCards).observe(grid, { childList: true, subtree: true });
    if (dialogBody) new MutationObserver(enhanceDialog).observe(dialogBody, { childList: true, subtree: true });
    enhanceCards();
    enhanceDialog();
  } catch (error) {
    console.error('[lorebook] failed to load silhouette canon', error);
  }
}

bootSilhouetteCanon();
