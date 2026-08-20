const CROSS_ERA_ECHO_URL = './data/cross-era-echo-chains.v1.json';

const echoStyles = document.createElement('link');
echoStyles.rel = 'stylesheet';
echoStyles.href = './cross-era-echo.css';
document.head.append(echoStyles);

const usefulnessLabel = {
  CORE: 'CORE / MAIN THREAD',
  STRONG: 'STRONG / CHARACTER THREAD',
  SUPPORT: 'SUPPORT / BOUNDARY TEACHING',
};

function dialogueMarkup(lines, label) {
  return `
    <div class="echo-dialogue-block">
      <span>${label}</span>
      ${lines.map((line) => `<p>${line}</p>`).join('')}
    </div>
  `;
}

function echoCardMarkup(entry) {
  return `
    <article class="echo-chain-card" data-echo-usefulness="${entry.storyUsefulness}">
      <header>
        <span>${usefulnessLabel[entry.storyUsefulness] ?? entry.storyUsefulness}</span>
        <b>${entry.canonStatus}</b>
      </header>
      <h3>${entry.id}</h3>
      <div class="echo-participants">${entry.participantIds.map((id) => `<code>${id}</code>`).join('')}</div>
      <p class="echo-story-function">${entry.storyFunction}</p>
      <div class="echo-dialogue-grid">
        ${dialogueMarkup(entry.setupDialogue, 'SETUP / FIRST READ')}
        ${dialogueMarkup(entry.payoffDialogue, 'PAYOFF / REINTERPRETED')}
      </div>
      <details class="echo-evidence-gate">
        <summary>EVIDENCE GATE · ${entry.evidenceGateCount}+ sources required before Canon consideration</summary>
        <p>このカードはAUTHOR_CANDIDATE。会話だけ、物1つだけ、モチーフ一致だけではCanonへ昇格しない。</p>
      </details>
      <div class="echo-forbidden"><b>禁止ショートカット</b><p>${entry.forbiddenShortcut}</p></div>
    </article>
  `;
}

function renderEchoDesk(data) {
  const overview = document.querySelector('#overview');
  if (!overview || overview.querySelector('.cross-era-echo-desk')) return;
  const entries = data.entries ?? [];
  if (entries.length !== data.chainCount) return;

  const filters = ['ALL', 'CORE', 'STRONG', 'SUPPORT']
    .map((filter, index) => `<button type="button" data-echo-filter="${filter}" class="${index === 0 ? 'is-active' : ''}">${filter}</button>`)
    .join('');

  const anchor = overview.querySelector('.author-overview-dashboard') ?? overview.querySelector('.overview-grid') ?? overview.querySelector('.overview-board') ?? overview.querySelector('.section-head');
  if (!anchor) return;

  anchor.insertAdjacentHTML('afterend', `
    <section class="cross-era-echo-desk" id="crossEraEchoChains" aria-labelledby="crossEraEchoTitle">
      <header class="echo-desk-heading">
        <div>
          <span>FORESHADOW DESK / CROSS-CHARACTER ECHO</span>
          <h2 id="crossEraEchoTitle">最初は性格描写。後から、別の人の言葉と物証で意味が変わる。</h2>
          <p>16本のCandidate chainを、序盤会話 → 後半の意味反転 → Evidence Gateの順で読む。CORE/STRONG/SUPPORTは完成度点数ではなく、Story上の使い方。</p>
        </div>
        <dl>
          <div><dt>CORE</dt><dd>${data.coreCount}</dd></div>
          <div><dt>STRONG</dt><dd>${data.strongCount}</dd></div>
          <div><dt>SUPPORT</dt><dd>${data.supportCount}</dd></div>
        </dl>
      </header>
      <div class="echo-desk-boundary">
        <b>AUTHOR RULE</b>
        <p>Candidate != Canon / one clue != era proof / one object != identity proof / dialogue pairing != relationship or group Canon / obsolete constellation != Star Beast or enemy assignment</p>
      </div>
      <div class="echo-desk-filters">${filters}</div>
      <div class="echo-chain-grid">${entries.map(echoCardMarkup).join('')}</div>
    </section>
  `);

  const desk = overview.querySelector('.cross-era-echo-desk');
  desk?.querySelectorAll('[data-echo-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.echoFilter;
      desk.querySelectorAll('[data-echo-filter]').forEach((item) => item.classList.toggle('is-active', item === button));
      desk.querySelectorAll('.echo-chain-card').forEach((card) => {
        card.hidden = filter !== 'ALL' && card.dataset.echoUsefulness !== filter;
      });
    });
  });
}

async function bootCrossEraEchoDesk() {
  try {
    const response = await fetch(CROSS_ERA_ECHO_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`cross-era echo HTTP ${response.status}`);
    renderEchoDesk(await response.json());
  } catch (error) {
    console.error('[lorebook] failed to load cross-era echo desk', error);
  }
}

bootCrossEraEchoDesk();
