const SILHOUETTE_URL = './data/character-silhouette-anchors.v1.json';
let silhouetteAnchors = [];

const silhouetteStyles = document.createElement('link');
silhouetteStyles.rel = 'stylesheet';
silhouetteStyles.href = './silhouette.css';
document.head.append(silhouetteStyles);

function anchorByName(name) {
  return silhouetteAnchors.find((entry) => entry.name === name);
}

function silhouetteMarkup(anchor) {
  const chubby = ['hana', 'kage1'].includes(anchor.runtimeId);
  return `
    <section class="silhouette-canon-section${chubby ? ' is-body-diversity-anchor' : ''}" data-silhouette-for="${anchor.lorebookId}">
      <div class="silhouette-section-heading">
        <div><span>SILHOUETTE CANON</span><h3>${anchor.role}</h3></div>
        <i style="--anchor-theme:${anchor.themeHex}" aria-hidden="true"></i>
      </div>
      <p class="silhouette-body-direction">${anchor.bodyDirection}</p>
      <dl class="silhouette-facts">
        <div><dt>3秒の輪郭</dt><dd>${anchor.silhouetteRead}</dd></div>
        <div><dt>動き</dt><dd>${anchor.motionLanguage}</dd></div>
        <div><dt>集合絵</dt><dd>${anchor.topUse}</dd></div>
        <div><dt>星獣</dt><dd>${anchor.starBeast}</dd></div>
      </dl>
      ${chubby ? '<p class="silhouette-guardrail">体型はCurrent visual fact。細身への自動補正、体型ギャグ、hitbox / speedへの短絡は禁止。</p>' : ''}
    </section>
  `;
}

function enhanceCards() {
  document.querySelectorAll('.character-card').forEach((card) => {
    if (card.querySelector('.silhouette-hint')) return;
    const name = card.querySelector('h3')?.textContent?.trim();
    if (!name) return;
    const anchor = anchorByName(name);
    if (!anchor) return;
    const core = card.querySelector('.core');
    if (!core) return;
    const chubby = ['hana', 'kage1'].includes(anchor.runtimeId);
    card.dataset.silhouetteAnchor = anchor.runtimeId;
    if (chubby) card.dataset.bodyDiversityAnchor = 'true';
    core.insertAdjacentHTML(
      'beforebegin',
      `<div class="silhouette-hint${chubby ? ' is-body-diversity-anchor' : ''}" style="--anchor-theme:${anchor.themeHex}"><span>SILHOUETTE</span><strong>${anchor.role}</strong></div>`,
    );
  });
}

function enhanceDialog() {
  const body = document.querySelector('#characterDialogBody .dialog-body');
  if (!body || body.querySelector('.silhouette-canon-section')) return;
  const name = body.querySelector('.dialog-head h2')?.textContent?.trim();
  if (!name) return;
  const anchor = anchorByName(name);
  if (!anchor) return;
  const source = body.querySelector('.source-note');
  if (source) source.insertAdjacentHTML('beforebegin', silhouetteMarkup(anchor));
  else body.insertAdjacentHTML('beforeend', silhouetteMarkup(anchor));
}

async function bootSilhouetteCanon() {
  try {
    const response = await fetch(SILHOUETTE_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    silhouetteAnchors = data.anchors ?? [];

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
