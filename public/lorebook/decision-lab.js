const DECISION_DATA_URL = './data/setting-decision-lab.v1.json';

const decisionStyles = document.createElement('link');
decisionStyles.rel = 'stylesheet';
decisionStyles.href = './decision-lab.css';
document.head.append(decisionStyles);

function scoreDots(value) {
  return `<span class="score-dots" aria-label="5点中${value}点">${Array.from({ length: 5 }, (_, index) => `<i class="${index < value ? 'is-on' : ''}"></i>`).join('')}</span>`;
}

function optionMarkup(option, recommended) {
  return `
    <article class="decision-option ${recommended ? 'is-recommended' : ''}">
      <header><div>${recommended ? '<span>RECOMMENDED CANDIDATE</span>' : '<span>OPTION</span>'}<h5>${option.label}</h5></div></header>
      <p>${option.summary}</p>
      <dl class="option-scores">
        <div><dt>整合</dt><dd>${scoreDots(option.coherence)}</dd></div>
        <div><dt>感情</dt><dd>${scoreDots(option.emotion)}</dd></div>
        <div><dt>自由度</dt><dd>${scoreDots(option.futureFreedom)}</dd></div>
        <div><dt>Risk</dt><dd>${scoreDots(6 - option.risk)}<small>低いほど良</small></dd></div>
      </dl>
      <p class="option-note">${option.notes}</p>
    </article>
  `;
}

function decisionMarkup(decision, orderIndex) {
  return `
    <details class="decision-card" data-decision-id="${decision.id}" ${orderIndex < 2 ? 'open' : ''}>
      <summary>
        <span class="decision-order">${String(orderIndex + 1).padStart(2,'0')}</span>
        <div><small>NEXT SETTING DECISION</small><h4>${decision.title}</h4><p>${decision.decisionNow}</p></div>
        <span class="decision-chevron">＋</span>
      </summary>
      <div class="decision-body">
        <div class="decision-options">${decision.options.map((option) => optionMarkup(option, option.id === decision.recommendedOptionId)).join('')}</div>
        <aside class="decision-recommendation"><span>AI DESIGN RECOMMENDATION — CANDIDATE ONLY</span><p>${decision.recommendation}</p></aside>
        <div class="do-not-lock"><span>まだLOCKしない</span><ul>${decision.doNotLockYet.map((item) => `<li>${item}</li>`).join('')}</ul></div>
      </div>
    </details>
  `;
}

function renderDecisionLab(data) {
  const desk = document.querySelector('#authors-desk');
  const source = desk?.querySelector('.source-note');
  if (!desk || !source || desk.querySelector('.decision-lab')) return;
  const byId = new Map(data.decisions.map((decision) => [decision.id, decision]));
  const ordered = data.recommendedDecisionOrder.map((id) => byId.get(id)).filter(Boolean);
  source.insertAdjacentHTML('beforebegin', `
    <section class="decision-lab">
      <header class="decision-lab-heading">
        <span>SETTING DECISION LAB</span>
        <h3>未確定を、迷子にしない。</h3>
        <p>候補を比較して「次に何を決めると他が進むか」を見る場所。推奨案もすべて <b>CANDIDATE</b> で、ここから自動で正史にはなりません。</p>
      </header>
      <div class="decision-order-note"><b>推奨検討順</b><span>${ordered.map((decision, index) => `${index + 1}. ${decision.title}`).join(' → ')}</span></div>
      <div class="decision-list">${ordered.map(decisionMarkup).join('')}</div>
    </section>
  `);
}

async function bootDecisionLab() {
  try {
    const response = await fetch(DECISION_DATA_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    renderDecisionLab(await response.json());
  } catch (error) {
    console.error('[lorebook] failed to load setting decision lab', error);
  }
}

bootDecisionLab();
