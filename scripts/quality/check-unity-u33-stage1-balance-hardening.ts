import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docs = [
  'docs/unity-u33-stage1-balance-hardening-plan-2026-07-03.md',
  'docs/unity-u33-stage1-balance-baseline-audit-2026-07-03.md',
  'docs/unity-u33-stage1-8min-timeline-2026-07-03.md',
  'docs/unity-u33-xp-levelup-cadence-review-2026-07-03.md',
  'docs/unity-u33-enemy-wave-damage-review-2026-07-03.md',
  'docs/unity-u33-drop-pickup-heal-review-2026-07-03.md',
  'docs/unity-u33-weapon-passive-evolution-review-2026-07-03.md',
  'docs/unity-u33-kokuyou-rare-hardening-review-2026-07-03.md',
  'docs/unity-u33-result-reward-retry-review-2026-07-03.md',
  'docs/unity-u33-u30-u31-u32-gate-addendum-2026-07-03.md',
  'docs/unity-u33-stage1-balance-hardening-verdict-2026-07-03.md',
  'docs/unity-u33-stage1-balance-hardening-review-2026-07-03.md',
];
const artifacts = [
  'stage1-balance-before-after.json',
  'stage1-tuning-actions.json',
  'stage1-balance-risk-map.json',
  'stage1-hardening-summary.json',
];
const screenshots = [
  '01-stage1-opening-balance-hardening.png',
  '02-first-30-seconds-balance-hardening.png',
  '03-first-levelup-balance-hardening.png',
  '04-two-minute-wave-balance-hardening.png',
  '05-four-minute-wave-balance-hardening.png',
  '06-six-minute-climax-balance-hardening.png',
  '07-kokuyou-balance-hardening.png',
  '08-evolution-balance-hardening.png',
  '09-result-clear-balance-hardening.png',
  '10-stageselect-after-run-balance-hardening.png',
];

function check(label: string, ok: boolean) {
  if (!ok) failures.push(label);
}
function read(path: string) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}
function walk(root: string): string[] {
  if (!existsSync(root)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(root)) {
    const path = join(root, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) out.push(...walk(path));
    if (stat.isFile()) out.push(path);
  }
  return out;
}

for (const doc of docs) check(`doc exists: ${doc}`, existsSync(doc));
for (const artifact of artifacts) check(`artifact exists: ${artifact}`, existsSync(join('docs/design-targets/generated/unity-u33', artifact)));
for (const shot of screenshots) check(`screenshot exists: ${shot}`, existsSync(join('docs/design-targets/generated/unity-u33/screenshots', shot)));

const docsText = docs.map(read).join('\n');
const artifactText = artifacts.map((artifact) => read(join('docs/design-targets/generated/unity-u33', artifact))).join('\n');
const runtimeText = walk('unity/VampPonUnity/Assets/_Project/Scripts')
  .filter((path) => !path.includes('/Editor/'))
  .map(read)
  .join('\n');
const u26Text = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U26/FirstPlayableBalance/U26Stage1BalanceConstants.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U26/FirstPlayableBalance/U26Stage1WaveDraft.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U26/FirstPlayableBalance/U26Stage1XpDraft.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U26/FirstPlayableBalance/U26Stage1BalanceSimulator.cs',
].map(read).join('\n');
const text = `${docsText}\n${artifactText}\n${u26Text}`;
const beforeAfter = read('docs/design-targets/generated/unity-u33/stage1-balance-before-after.json');
const tuning = read('docs/design-targets/generated/unity-u33/stage1-tuning-actions.json');
const risk = read('docs/design-targets/generated/unity-u33/stage1-balance-risk-map.json');
const summary = read('docs/design-targets/generated/unity-u33/stage1-hardening-summary.json');

for (const value of [
  'productionApproved=false',
  '本番balance未確定',
  'mobile実機metrics未測定',
  'first 30 seconds',
  'XP / LevelUp',
  'enemy wave / damage',
  'drop / pickup / heal',
  'weapon / passive / evolution',
  'Kokuyou / Rare',
  'Result / Reward / Retry',
  'balanceHardeningReady',
  'U35 mobile device metrics pass',
  'U34 release candidate checklist',
  'Addressables',
  'Cloud Save',
]) {
  check(`contains ${value}`, text.includes(value));
}

check('U33 pickup radius tuned', /PickupRadius = 1\.8f/.test(u26Text));
check('U33 weapon cooldown tuned', /BasicWeaponCooldownMs = 880/.test(u26Text));
check('U33 weapon damage tuned', /BasicWeaponDamage = 13/.test(u26Text));
check('U33 XP curve tuned', /LevelThresholds = \{ 0, 7, 18, 34, 56, 84, 120, 162 \}/.test(u26Text));
check('U33 opening wave tuned', /new Wave\(0, 30, "opening", 2\.45f, 1, 8, 5f\)/.test(u26Text));
check('U33 first pressure tuned', /new Wave\(30, 120, "first_levelup_pressure", 2\.0f, 2, 13, 6f\)/.test(u26Text));
check('U33 cap respects U29', /new Wave\(450, 480, "clear_push", 0\.95f, 4, 38, 12f\)/.test(u26Text));
check('before/after has before after reason', /"before"/.test(beforeAfter) && /"after"/.test(beforeAfter) && /"reason"/.test(beforeAfter));
check('tuning actions not production final', /"productionBalanceFinal": false/.test(tuning));
check('risk map mobile not measured', /"mobileMetrics": "NOT_MEASURED"/.test(risk));
check('summary flags', /"productionApproved": false/.test(summary) && /"assetReplacementReady": false/.test(summary));
check('balance hardening ready true', /"balanceHardeningReady": true/.test(summary) && /balanceHardeningReady: true/.test(text));
check('No productionApproved=1', !/productionApproved\s*=\s*1|ProductionApproved\s*=\s*true|"productionApproved": true/.test(text));
check('No generated final image runtime paste', !/docs\/design-targets\/generated|top-final|kokuyou-cutin-final|completed screen image/i.test(runtimeText));
check('No runtime docs generated refs', !/docs\/design-targets\/generated/.test(runtimeText));
check('No Addressables folder', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('Cloud Save API not introduced', !/CloudSaveService|Unity\.Services\.CloudSave|CloudSave\.Models/i.test(runtimeText));
check('Final SE not approved', /本番SE未確定|final SE[^.\n]*(not approved|not finalized)/.test(text));
check('Economy not final', /経済バランス確定扱いにしない|reward economy.*draft|本番balance未確定/.test(text));
check('No forbidden term string', !text.includes('黒曜化'));

if (failures.length > 0) {
  console.error('unity U33 stage1 balance hardening check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U33 stage1 balance hardening check passed: docs=${docs.length}, artifacts=${artifacts.length}, screenshots=${screenshots.length}, productionApproved=false`);
