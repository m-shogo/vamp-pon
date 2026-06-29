export type LocalQaLink = {
  label: string;
  href: string;
  note: string;
};

export const LOCAL_QA_LINKS: LocalQaLink[] = [
  { label: 'Main game', href: '/', note: '通常のStage1確認' },
  { label: 'Stage2', href: '/?stage=2', note: 'Stage2背景・本編導線の確認' },
  { label: 'Quick clear', href: '/?qa=quick-clear', note: '15秒でクリア→Stage2ボタン確認' },
  { label: 'Dawn ticket', href: '/?qa=dawn-ticket-revival&debug=true&play=1', note: '夜明けの切符を所持し、Kで復帰確認' },
  { label: 'Main berserk auto', href: '/?qa=berserk-auto', note: '本編で黒曜化カットインを即確認' },
  { label: 'Yui 96 cells', href: '/?scene=yui96-qa', note: '全96セル・76px/300px比較' },
  { label: 'Yui rage cycle', href: '/?scene=yui-rage-cycle', note: '充填→変身→疲労のRuntime遷移' },
  { label: 'Cutin QA', href: '/?scene=cutin-qa', note: '通常必殺・黒曜化カットイン' },
  { label: 'Elite beat QA', href: '/?scene=elite-beat-qa', note: 'エリート撃破ビート' },
  { label: 'Weapon FX QA', href: '/?scene=weapon-fx-qa', note: '武器別hit/trail/bounce/tick' },
];

const HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0']);
const LAUNCHER_ID = 'vamp-pon-local-qa-launcher';

export function shouldShowLocalQaLauncher(locationLike = window.location): boolean {
  if (new URLSearchParams(locationLike.search).get('hideQa') === '1') return false;
  return HOSTS.has(locationLike.hostname);
}

export function installLocalQaLauncher(): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  if (!shouldShowLocalQaLauncher()) return;
  if (document.getElementById(LAUNCHER_ID)) return;

  const root = document.createElement('aside');
  root.id = LAUNCHER_ID;
  root.style.position = 'fixed';
  root.style.right = '10px';
  root.style.top = '86px';
  root.style.zIndex = '9999';
  root.style.width = '214px';
  root.style.maxWidth = 'calc(100vw - 20px)';
  root.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
  root.style.color = '#f8ecd0';
  root.style.filter = 'drop-shadow(0 10px 26px rgba(0, 0, 0, 0.38))';

  const details = document.createElement('details');
  details.open = false;
  details.style.border = '1px solid rgba(239, 215, 156, 0.75)';
  details.style.borderRadius = '12px';
  details.style.background = 'rgba(16, 17, 36, 0.9)';
  details.style.backdropFilter = 'blur(6px)';
  details.style.overflow = 'hidden';

  const summary = document.createElement('summary');
  summary.textContent = 'Vamp Pon QA';
  summary.style.cursor = 'pointer';
  summary.style.padding = '9px 11px';
  summary.style.fontWeight = '800';
  summary.style.fontSize = '13px';
  summary.style.letterSpacing = '0.03em';
  summary.style.background = 'rgba(234, 217, 166, 0.14)';
  details.appendChild(summary);

  const body = document.createElement('div');
  body.style.display = 'grid';
  body.style.gap = '7px';
  body.style.padding = '9px';

  for (const link of LOCAL_QA_LINKS) {
    const anchor = document.createElement('a');
    anchor.href = link.href;
    anchor.style.display = 'block';
    anchor.style.padding = '8px 9px';
    anchor.style.border = '1px solid rgba(255, 239, 191, 0.24)';
    anchor.style.borderRadius = '9px';
    anchor.style.background = 'rgba(255, 242, 199, 0.08)';
    anchor.style.color = '#fff2c7';
    anchor.style.textDecoration = 'none';

    const title = document.createElement('div');
    title.textContent = link.label;
    title.style.fontWeight = '800';
    title.style.fontSize = '12px';
    title.style.lineHeight = '1.2';

    const note = document.createElement('div');
    note.textContent = link.note;
    note.style.marginTop = '3px';
    note.style.fontSize = '10px';
    note.style.lineHeight = '1.25';
    note.style.color = '#cfe6f0';

    anchor.append(title, note);
    body.appendChild(anchor);
  }

  const hint = document.createElement('p');
  hint.textContent = 'localhost専用。実機確認は同じpathをMacのIPへ置換。';
  hint.style.margin = '2px 2px 0';
  hint.style.color = '#9eb3c5';
  hint.style.fontSize = '10px';
  hint.style.lineHeight = '1.35';
  body.appendChild(hint);

  details.appendChild(body);
  root.appendChild(details);
  document.body.appendChild(root);
}
