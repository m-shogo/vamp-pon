import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docs = [
  'docs/unity-u30-production-approval-gate-plan-2026-07-03.md',
  'docs/unity-u30-stage1-vertical-slice-approval-gate-2026-07-03.md',
  'docs/unity-u30-stage1-current-verdict-2026-07-03.md',
  'docs/unity-u30-regression-matrix-2026-07-03.md',
  'docs/unity-u31-stage1-mobile-qa-handoff-2026-07-03.md',
  'docs/unity-u30-production-approval-gate-review-2026-07-03.md',
];
const files = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U30/ApprovalGate/U30ApprovalState.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U30/ApprovalGate/U30ApprovalGateStatus.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U30/ApprovalGate/U30ApprovalGateResult.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U30/ApprovalGate/U30Stage1ApprovalReport.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U30/ApprovalGate/U30ProductionApprovalPolicy.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U30ProductionApprovalGateVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U30ProductionApprovalGateScreenshotCapture.cs',
];
const artifacts = [
  'stage1-approval-report.json',
  'stage1-gate-results.json',
  'stage1-regression-matrix.json',
  'sprite-atlas-packing-map.json',
  'production-boundary-check.json',
];
const screenshots = [
  '01-stageselect-before-run.png',
  '02-stage1-opening.png',
  '03-first-levelup.png',
  '04-rare-or-reward-moment.png',
  '05-evolution-moment.png',
  '06-kokuyou-ready-or-active.png',
  '07-result-clear.png',
  '08-result-reward-unlock.png',
  '09-stageselect-after-clear.png',
  '10-retry-flow.png',
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
for (const file of files) check(`required file exists: ${file}`, existsSync(file));
for (const artifact of artifacts) check(`artifact exists: ${artifact}`, existsSync(join('docs/design-targets/generated/unity-u30', artifact)));
for (const shot of screenshots) check(`screenshot exists: ${shot}`, existsSync(join('docs/design-targets/generated/unity-u30/screenshots', shot)));

const docsText = docs.map(read).join('\n');
const runtimeText = walk('unity/VampPonUnity/Assets/_Project/Scripts/U30').map(read).join('\n');
const editorText = [
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U30ProductionApprovalGateVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U30ProductionApprovalGateScreenshotCapture.cs',
].map(read).join('\n');
const artifactsText = artifacts.map((artifact) => read(join('docs/design-targets/generated/unity-u30', artifact))).join('\n');
const text = `${docsText}\n${runtimeText}\n${editorText}\n${artifactsText}`;
const report = read('docs/design-targets/generated/unity-u30/stage1-approval-report.json');
const gates = read('docs/design-targets/generated/unity-u30/stage1-gate-results.json');
const atlas = read('docs/design-targets/generated/unity-u30/sprite-atlas-packing-map.json');
const boundary = read('docs/design-targets/generated/unity-u30/production-boundary-check.json');
const allUnityRuntime = walk('unity/VampPonUnity/Assets/_Project/Scripts')
  .filter((path) => !path.includes('/Editor/'))
  .map(read)
  .join('\n');

for (const value of [
  'productionApproved',
  'internalPreviewReady',
  'mobileQaReady',
  'assetReplacementReady',
  'performanceQaReady',
  'NOT_MEASURED',
  'Sprite Atlas',
  'not measured',
  'Addressables',
  'Cloud Save',
  'generated final',
]) {
  check(`contains ${value}`, text.includes(value));
}

check('report production approval false', /"productionApproved": false/.test(report));
check('report internal preview ready', /"internalPreviewReady": true/.test(report));
check('report mobile QA ready', /"mobileQaReady": true/.test(report));
check('report asset replacement false', /"assetReplacementReady": false/.test(report));
check('critical blocker count 2', /"criticalBlockerCount": 2/.test(report));
check('mobile performance not measured critical', /"id": "mobile-performance"[\s\S]*"status": "NOT_MEASURED"[\s\S]*"critical": true/.test(gates));
check('sprite atlas fail critical', /"id": "sprite-atlas"[\s\S]*"status": "FAIL"[\s\S]*"critical": true/.test(gates));
check('atlas production packing incomplete', /"productionPackingComplete": false/.test(atlas) && /"criticalBlocker": true/.test(atlas));
check('boundary generated final false', /"runtimeGeneratedFinalPngPaste": false/.test(boundary));
check('boundary design target false', /"runtimeDesignTargetReference": false/.test(boundary));
check('boundary addressables false', /"addressablesIntroduced": false/.test(boundary));
check('boundary cloud save false', /"cloudSaveIntroduced": false/.test(boundary));
check('No U30 runtime true approval', !/ProductionApproved\s*=\s*true|"productionApproved": true/.test(runtimeText));
check('No U30 artifact true approval', !/"productionApproved": true/.test(artifactsText));
check('No generated final image runtime paste', !/docs\/design-targets\/generated|top-final|kokuyou-cutin-final|completed screen image/i.test(allUnityRuntime));
check('No Addressables folder', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('Cloud Save API not introduced in U30 runtime', !/CloudSaveService|Unity\.Services\.CloudSave|CloudSave\.Models/i.test(runtimeText));
check('No forbidden term string', !text.includes('黒曜化'));

if (failures.length > 0) {
  console.error('unity U30 production approval gate check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U30 production approval gate check passed: artifacts=${artifacts.length}, screenshots=${screenshots.length}, productionApproved=false`);
