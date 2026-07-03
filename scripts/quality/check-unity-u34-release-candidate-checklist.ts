import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docs = [
  'docs/unity-u34-release-candidate-checklist-plan-2026-07-03.md',
  'docs/unity-u34-release-candidate-checklist-review-2026-07-03.md',
  'docs/unity-u34-stage1-rc-checklist-2026-07-03.md',
  'docs/unity-u34-stage1-rc-blocker-register-2026-07-03.md',
  'docs/unity-u34-stage1-rc-caution-register-2026-07-03.md',
  'docs/unity-u34-stage1-rc-evidence-index-2026-07-03.md',
  'docs/unity-u34-stage1-next-action-matrix-2026-07-03.md',
  'docs/unity-u34-stage1-rc-verdict-2026-07-03.md',
  'docs/unity-u34-u30-u36-gate-addendum-2026-07-03.md',
];
const modelFiles = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U34/ReleaseCandidate/U34ReleaseCandidateReadiness.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U34/ReleaseCandidate/U34RcChecklistItem.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U34/ReleaseCandidate/U34RcStatus.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U34/ReleaseCandidate/U34RcBlocker.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U34/ReleaseCandidate/U34RcCaution.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U34/ReleaseCandidate/U34RcNextAction.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U34/ReleaseCandidate/U34RcVerdict.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U34/ReleaseCandidate/U34ReleaseCandidateReadinessFactory.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U34ReleaseCandidateChecklistVerification.cs',
];
const artifacts = [
  'stage1-rc-checklist.json',
  'stage1-rc-verdict.json',
  'stage1-rc-blocker-register.json',
  'stage1-rc-caution-register.json',
  'stage1-next-action-matrix.json',
  'stage1-rc-evidence-index.json',
];
const screenshots = [
  '01-rc-stageselect.png',
  '02-rc-battle-opening.png',
  '03-rc-levelup.png',
  '04-rc-climax.png',
  '05-rc-result.png',
  '06-rc-stageselect-after-clear.png',
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
for (const file of modelFiles) check(`model file exists: ${file}`, existsSync(file));
for (const artifact of artifacts) check(`artifact exists: ${artifact}`, existsSync(join('docs/design-targets/generated/unity-u34', artifact)));
for (const shot of screenshots) check(`screenshot exists: ${shot}`, existsSync(join('docs/design-targets/generated/unity-u34/screenshots', shot)));

const docsText = docs.map(read).join('\n');
const modelText = modelFiles.map(read).join('\n');
const artifactText = artifacts.map((artifact) => read(join('docs/design-targets/generated/unity-u34', artifact))).join('\n');
const allUnityRuntime = walk('unity/VampPonUnity/Assets/_Project/Scripts')
  .filter((path) => !path.includes('/Editor/'))
  .map(read)
  .join('\n');
const text = `${docsText}\n${modelText}\n${artifactText}`;
const verdict = read('docs/design-targets/generated/unity-u34/stage1-rc-verdict.json');
const checklist = read('docs/design-targets/generated/unity-u34/stage1-rc-checklist.json');
const blockers = read('docs/design-targets/generated/unity-u34/stage1-rc-blocker-register.json');
const cautions = read('docs/design-targets/generated/unity-u34/stage1-rc-caution-register.json');

for (const value of [
  'rcReady=false',
  'productionApproved=false',
  'mobileMetricsReady=false',
  'assetReplacementReady=false',
  'balanceHardeningReady=true',
  'spriteAtlasPackingReady=true',
  'NOT_MEASURED',
  'BLOCKED',
  'CAUTION',
  'U37',
  'U38',
  'U39',
  'U40',
  'Addressables',
  'Cloud Save',
  '本番SE未確定',
  '本番balance未確定',
]) {
  check(`contains ${value}`, text.includes(value));
}

check('rc ready false json', /"rcReady": false/.test(verdict));
check('production false json', /"productionApproved": false/.test(verdict));
check('mobile metrics false json', /"mobileMetricsReady": false/.test(verdict));
check('asset replacement false json', /"assetReplacementReady": false/.test(verdict));
check('sprite atlas ready true', /"spriteAtlasPackingReady": true/.test(verdict));
check('NOT_MEASURED not pass', /"status": "NOT_MEASURED"/.test(checklist) && !/"id": "mobile-metrics"[\s\S]{0,120}"status": "PASS"/.test(checklist));
check('blocker register has mobile metrics', /rc-block-mobile-metrics/.test(blockers));
check('caution register exists', /rc-caution-atlas-device/.test(cautions));
check('model rc ready false', /RcReady = false/.test(modelText));
check('model production false', /ProductionApproved = false/.test(modelText));
check('No production approval true', !/productionApproved\s*=\s*1|ProductionApproved\s*=\s*true|"productionApproved": true/.test(text));
check('No runtime docs generated refs', !/docs\/design-targets\/generated/.test(allUnityRuntime));
check('No generated final image runtime paste', !/top-final|kokuyou-cutin-final|generated\/.*\.png|completed screen image/i.test(allUnityRuntime));
check('No Addressables folder', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('Cloud Save API not introduced', !/CloudSaveService|Unity\.Services\.CloudSave|CloudSave\.Models/i.test(allUnityRuntime));
check('Final SE not approved', /本番SE未確定|final SE[^.\n]*(not approved|not finalized)|draft SE/.test(text));
check('Economy not final', /経済バランス|reward economy|economy draft/.test(text));
check('No forbidden term string', !text.includes('黒曜化'));

if (failures.length > 0) {
  console.error('unity U34 release candidate checklist check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U34 release candidate checklist check passed: docs=${docs.length}, artifacts=${artifacts.length}, screenshots=${screenshots.length}, rcReady=false`);
