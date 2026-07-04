import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docs = [
  'docs/unity-u41-economy-reward-unlock-hardening-plan-2026-07-03.md',
  'docs/unity-u41-economy-reward-unlock-hardening-review-2026-07-03.md',
  'docs/unity-u41-economy-baseline-audit-2026-07-03.md',
  'docs/unity-u41-rank-reward-hardening-2026-07-03.md',
  'docs/unity-u41-result-reward-display-hardening-2026-07-03.md',
  'docs/unity-u41-retry-motivation-hardening-2026-07-03.md',
  'docs/unity-u41-save-economy-safety-review-2026-07-03.md',
  'docs/unity-u41-economy-readiness-verdict-2026-07-03.md',
  'docs/unity-u41-u34-u40-gate-addendum-2026-07-03.md',
];
const artifacts = [
  'economy-baseline-audit.json',
  'reward-hardening-before-after.json',
  'rank-reward-table.json',
  'unlock-hardening-map.json',
  'result-reward-display-map.json',
  'retry-motivation-map.json',
  'save-economy-safety-report.json',
  'economy-readiness-verdict.json',
];
const screenshots = [
  '01-result-clear-reward-hardening.png',
  '02-result-defeat-reward-hardening.png',
  '03-result-first-clear-bonus.png',
  '04-result-best-updated.png',
  '05-result-new-unlock.png',
  '06-stageselect-progress-reward-hardening.png',
  '07-retry-motivation-hardening.png',
];
const models = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U41/EconomyRewardUnlock/U41RewardHardeningConstants.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U41/EconomyRewardUnlock/U41RewardHardeningCalculator.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U41/EconomyRewardUnlock/U41RewardHardeningResult.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U41/EconomyRewardUnlock/U41RewardBand.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U41/EconomyRewardUnlock/U41RankRewardBand.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U41/EconomyRewardUnlock/U41UnlockHardeningRule.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U41/EconomyRewardUnlock/U41UnlockDuplicateGuard.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U41/EconomyRewardUnlock/U41EconomyReadinessFactory.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U41/EconomyRewardUnlock/U41EconomyReadinessReport.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U41EconomyRewardUnlockHardeningVerification.cs',
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
for (const artifact of artifacts) check(`artifact exists: ${artifact}`, existsSync(join('docs/design-targets/generated/unity-u41', artifact)));
for (const shot of screenshots) check(`screenshot exists: ${shot}`, existsSync(join('docs/design-targets/generated/unity-u41/screenshots', shot)));
for (const model of models) check(`model exists: ${model}`, existsSync(model));
check('evidence generator exists', existsSync('scripts/assets/generate-u41-economy-evidence.mjs'));

const docsText = docs.map(read).join('\n');
const artifactText = artifacts.map((artifact) => read(join('docs/design-targets/generated/unity-u41', artifact))).join('\n');
const modelText = models.map(read).join('\n');
const text = `${docsText}\n${artifactText}\n${modelText}`;
const verdict = read('docs/design-targets/generated/unity-u41/economy-readiness-verdict.json');
const runtime = walk('unity/VampPonUnity/Assets/_Project/Scripts')
  .filter((path) => !path.includes('/Editor/'))
  .map(read)
  .join('\n');

for (const value of [
  'economyReadyForRc: true',
  'rewardReadyForRc: true',
  'unlockReadyForRc: true',
  'saveEconomySafe: true',
  'productionApproved: false',
  'rcReady: false',
  'productionEconomyFinal: false',
  '本番経済未確定',
  'Cloud Save未導入',
  'Addressables未導入',
  'mobile metrics NOT_MEASURED',
  'audioMixer未確定',
  'haptic未測定',
]) {
  check(`contains ${value}`, text.includes(value));
}

check('verdict economyReadyForRc true', /"economyReadyForRc": true/.test(verdict));
check('verdict rewardReadyForRc true', /"rewardReadyForRc": true/.test(verdict));
check('verdict unlockReadyForRc true', /"unlockReadyForRc": true/.test(verdict));
check('verdict saveEconomySafe true', /"saveEconomySafe": true/.test(verdict));
check('verdict production false', /"productionApproved": false/.test(verdict));
check('verdict rc false', /"rcReady": false/.test(verdict));
check('verdict production economy false', /"productionEconomyFinal": false/.test(verdict));
check('model economy ready true', /EconomyReadyForRc = true/.test(modelText));
check('model production false', /ProductionApproved = false/.test(modelText));
check('model rc false', /RcReady = false/.test(modelText));
check('No productionApproved true', !/ProductionApproved\s*=\s*true|"productionApproved": true|productionApproved=1|productionApproved\s*=\s*1/.test(`${artifactText}\n${modelText}`));
check('No rcReady true', !/RcReady\s*=\s*true|"rcReady": true/.test(`${artifactText}\n${modelText}`));
check('No production economy final true', !/ProductionEconomyFinal\s*=\s*true|"productionEconomyFinal": true/.test(`${artifactText}\n${modelText}`));
check('No runtime docs generated refs', !/docs\/design-targets\/generated/.test(runtime));
check('No generated final image runtime paste', !/top-final|kokuyou-cutin-final|generated\/.*\.png|completed screen image/i.test(runtime));
check('No Addressables folder', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('Cloud Save API not introduced', !/CloudSaveService|Unity\.Services\.CloudSave|CloudSave\.Models/i.test(runtime));
check('Mobile not measured', /mobile metrics NOT_MEASURED|mobileMetricsReady=false|MobileMetricsReady = false/.test(text));
check('Audio/haptic not measured', /audio latency|haptic.*NOT_MEASURED|HapticMeasured = false|haptic未測定/.test(text));
check('No forbidden term string', !text.includes('黒曜化'));

if (failures.length > 0) {
  console.error('unity U41 economy reward unlock hardening check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U41 economy reward unlock hardening check passed: docs=${docs.length}, artifacts=${artifacts.length}, screenshots=${screenshots.length}, economyReadyForRc=true`);
