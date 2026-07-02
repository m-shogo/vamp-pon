import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docs = [
  'docs/unity-u32-production-asset-replacement-final-polish-plan-2026-07-03.md',
  'docs/unity-u32-production-asset-replacement-final-polish-review-2026-07-03.md',
  'docs/unity-u32-runtime-asset-inventory-2026-07-03.md',
  'docs/unity-u32-texture-import-safety-review-2026-07-03.md',
  'docs/unity-u32-final-visual-consistency-polish-2026-07-03.md',
  'docs/unity-u32-asset-replacement-readiness-verdict-2026-07-03.md',
  'docs/unity-u32-u30-u31-gate-addendum-2026-07-03.md',
];
const files = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U32/AssetReplacement/U32RuntimeAssetStatus.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U32/AssetReplacement/U32AssetBoundaryStatus.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U32/AssetReplacement/U32RuntimeAssetKey.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U32/AssetReplacement/U32AssetInventoryEntry.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U32/AssetReplacement/U32RuntimeAssetReplacementEntry.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U32/AssetReplacement/U32RuntimeAssetReplacementRegistry.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U32/AssetReplacement/U32RuntimeAssetBoundaryReport.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U32/AssetReplacement/U32MissingAssetFallbackPolicy.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U32ProductionAssetReplacementScreenshotCapture.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U32ProductionAssetReplacementVerification.cs',
];
const artifacts = [
  'runtime-asset-inventory.json',
  'asset-boundary-report.json',
  'sprite-atlas-production-packing-map.json',
  'visual-consistency-polish-actions.json',
  'asset-replacement-readiness-verdict.json',
  'production-boundary-check.json',
];
const screenshots = [
  '01-battle-asset-polish.png',
  '02-levelup-asset-polish.png',
  '03-rare-asset-polish.png',
  '04-evolution-asset-polish.png',
  '05-kokuyou-asset-polish.png',
  '06-result-asset-polish.png',
  '07-stageselect-asset-polish.png',
  '08-retry-asset-polish.png',
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
for (const artifact of artifacts) check(`artifact exists: ${artifact}`, existsSync(join('docs/design-targets/generated/unity-u32', artifact)));
for (const shot of screenshots) check(`screenshot exists: ${shot}`, existsSync(join('docs/design-targets/generated/unity-u32/screenshots', shot)));

const docsText = docs.map(read).join('\n');
const runtimeText = walk('unity/VampPonUnity/Assets/_Project/Scripts/U32').map(read).join('\n');
const editorText = [
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U32ProductionAssetReplacementScreenshotCapture.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U32ProductionAssetReplacementVerification.cs',
].map(read).join('\n');
const artifactText = artifacts.map((artifact) => read(join('docs/design-targets/generated/unity-u32', artifact))).join('\n');
const inventory = read('docs/design-targets/generated/unity-u32/runtime-asset-inventory.json');
const boundary = read('docs/design-targets/generated/unity-u32/asset-boundary-report.json');
const packing = read('docs/design-targets/generated/unity-u32/sprite-atlas-production-packing-map.json');
const readiness = read('docs/design-targets/generated/unity-u32/asset-replacement-readiness-verdict.json');
const productionBoundary = read('docs/design-targets/generated/unity-u32/production-boundary-check.json');
const allUnityRuntime = walk('unity/VampPonUnity/Assets/_Project')
  .filter((path) => !path.includes('/Editor/'))
  .filter((path) => !path.includes('/Logs/'))
  .map(read)
  .join('\n');
const text = `${docsText}\n${runtimeText}\n${editorText}\n${artifactText}`;

for (const value of [
  'assetReplacementReady',
  'productionApproved',
  'runtime asset inventory',
  'Sprite Atlas',
  'docs/design-targets/generated',
  'generated final',
  'Addressables',
  'Cloud Save',
  'draft SE',
  'NOT_MEASURED',
]) {
  check(`contains ${value}`, text.includes(value));
}

check('inventory has blocked docs generated entry', /"key": "GeneratedDocsEvidence"[\s\S]*"productionStatus": "BlockedFromRuntime"/.test(inventory));
check('inventory has draft SE needs review', /"key": "DraftSe"[\s\S]*"productionStatus": "NeedsReview"/.test(inventory));
check('boundary docs generated false', /"runtimeReferencesDocsGenerated": false/.test(boundary));
check('boundary generated final false', /"runtimeUsesGeneratedFinalPng": false/.test(boundary));
check('boundary draft SE final false', /"draftSeFinalApproved": false/.test(boundary));
check('boundary addressables false', /"addressablesIntroduced": false/.test(boundary));
check('boundary cloud save false', /"cloudSaveIntroduced": false/.test(boundary));
check('sprite atlas production incomplete', /"productionPackingComplete": false/.test(packing));
check('sprite atlas excludes docs generated', /docs\/design-targets\/generated/.test(packing));
check('readiness false', /"assetReplacementReady": false/.test(readiness));
check('production boundary false states', /"runtimeDocsGeneratedReference": false/.test(productionBoundary) && /"productionApproved": false/.test(productionBoundary));
check('mobile metrics not measured', /"mobileDeviceMeasurement": "NOT_MEASURED"/.test(productionBoundary));
check('No U32 runtime true approval', !/ProductionApproved\s*=\s*true|"productionApproved": true/.test(runtimeText));
check('No U32 artifact true approval', !/"productionApproved": true/.test(artifactText));
check('No runtime docs generated refs', !/docs\/design-targets\/generated/.test(allUnityRuntime));
check('No generated final image runtime paste', !/top-final|kokuyou-cutin-final|generated\/.*\.png|completed-screen.*\.png/i.test(allUnityRuntime));
check('No Addressables folder', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('Cloud Save API not introduced', !/CloudSaveService|Unity\.Services\.CloudSave|CloudSave\.Models/i.test(allUnityRuntime));
check('Final SE not approved', /draft-placeholder-not-final|本番SE未確定|final SE[^.\n]*(not approved|not finalized)/.test(text));
check('Production balance not finalized', /productionBalanceFinal": false|本番balance未確定|production balance are not finalized/.test(text));
check('No forbidden term string', !text.includes('黒曜化'));

if (failures.length > 0) {
  console.error('unity U32 production asset replacement check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U32 production asset replacement check passed: artifacts=${artifacts.length}, screenshots=${screenshots.length}, assetReplacementReady=false, productionApproved=false`);
