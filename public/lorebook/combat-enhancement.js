const COMBAT_DATA_URL = './data/combat-guide.v1.json';
let combatEntries = [];

const combatStyles = document.createElement('link');
combatStyles.rel = 'stylesheet';
combatStyles.href = './combat.css';
document.head.append(combatStyles);

const statusLabels = {
  playable_data: 'PLAYABLE DATA',
  season_seed: 'SEASON SEED',
  future_seed: 'FUTURE SEED',
  official_reserve: 'OFFICIAL RESERVE',
};

function combatByName(name) {
  const profile = window.__yorunoCombatNameMap?.get(name);
  return profile ?? null;
}

function combatMarkup(entry) {
  return `
    <section class="combat-guide-section" data-combat-for="${entry.lorebookId}">
      <div class="combat-heading">
        <div><span>FIELD GUIDE / COMBAT</span><h3>戦い方を思い出す</h3></div>
        <span class="implementation-badge ${entry.implementationStatus}">${statusLabels[entry.implementationStatus] ?? entry.implementationStatus}</span>
      </div>
      <div class="combat-lead">
        <div><small>ROLE</small><strong>${entry.role}</strong></div>
        <div><small>STARTER</small><strong>${entry.starter}</strong></div>
      </div>
      <p class="combat-playfeel">${entry.playFeel}</p>
      <div class="combat-procon">
        <div><span>得意</span><b>${entry.strength}</b></div>
        <div><span>苦手</span><b>${entry.weakness}</b></div>
      </div>
      <div class="arts-line" aria-label="キャラクター技の進化">
        <div><small>灯技</small><strong>${entry.arts.lampArt}</strong></div>
        <i>→</i>
        <div><small>継灯</small><strong>${entry.arts.inheritedLight}</strong></div>
        <i>→</i>
        <div><small>暁灯</small><strong>${entry.arts.dawnLight}</strong></div>
      </div>
      <div class="combat-object"><span>器 / 系統</span><b>${entry.vessel}</b><small>${entry.lineage}</small></div>
      <div class="combat-blank author-only"><span>CHARACTER MYSTERY BLANK</span><p>${entry.blank}</p></div>
    </section>
  `;
}

function enhanceCombatDialog() {
  const body = document.querySelector('#characterDialogBody .dialog-body');
  if (!body || body.querySelector('.combat-guide-section')) return;
  const name = body.querySelector('.dialog-head h2')?.textContent?.trim();
  if (!name) return;
  const entry = combatByName(name);
  if (!entry) return;
  const personal = body.querySelector('.personal-profile-section');
  const source = body.querySelector('.source-note');
  if (personal) personal.insertAdjacentHTML('beforebegin', combatMarkup(entry));
  else if (source) source.insertAdjacentHTML('beforebegin', combatMarkup(entry));
  else body.insertAdjacentHTML('beforeend', combatMarkup(entry));
}

async function bootCombatGuide() {
  try {
    const response = await fetch(COMBAT_DATA_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    combatEntries = data.entries ?? [];
    window.__yorunoCombatNameMap = new Map(combatEntries.map((entry) => {
      const profile = window.__yorunoProfileNameMap?.get(entry.lorebookId);
      return [profile?.name ?? entry.lorebookId, entry];
    }));

    // Personal profile module may not expose its map, so the stable visible-name table is kept here.
    const visibleNames = {
      yui:'ユイ', asa:'アサ', nagi:'ナギ', michiru:'ミチル', tomori:'トモリ', sen:'セン', ritsu:'リツ', koyori:'コヨリ', gen:'ゲン', hana:'ハナ',
      yuubi:'ユウビ', madoka:'マドカ', shiro:'シロ', tobari:'トバリ', nemu:'ネム', kuroori:'クロオリ', kaname:'カナメ', kasumi:'カスミ', toki:'トキ', tsumugi:'ツムギ', ren:'レン',
    };
    window.__yorunoCombatNameMap = new Map(combatEntries.map((entry) => [visibleNames[entry.lorebookId] ?? entry.lorebookId, entry]));

    const dialogBody = document.querySelector('#characterDialogBody');
    if (dialogBody) new MutationObserver(() => queueMicrotask(enhanceCombatDialog)).observe(dialogBody, { childList: true, subtree: true });
    enhanceCombatDialog();
  } catch (error) {
    console.error('[lorebook] failed to load combat guide', error);
  }
}

bootCombatGuide();
