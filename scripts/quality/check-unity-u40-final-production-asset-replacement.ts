import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docs = [
  'docs/unity-u40-final-production-asset-replacement-pass-plan-2026-07-03.md',
  'docs/unity-u40-final-production-asset-replacement-pass-review-2026-07-03.md',
  'docs/unity-u40-final-asset-inventory-re-audit-2026-07-03.md',
  'docs/unity-u40-asset-replacement-readiness-rules-2026-07-03.md',
  'docs/unity-u40-production-candidate-replacement-map-2026-07-03.md',
  'docs/unity-u40-final-visual-asset-consistency-review-2026-07-03.md',
  'docs/unity-u40-asset-replacement-ready-verdict-2026-07-03.md',
  'docs/unity-u40-u34-u36-u39-gate-addendum-2026-07-03.md',
];
const artifacts = [
  'final-asset-inventory-re-audit.json',
  'runtime-reference-boundary-scan.json',
  'blocked-runtime-reference-report.json',
  'production-candidate-replacement-map.json',
  'safe-replacement-actions.json',
  'final-visual-asset-consistency-review.json',
  'asset-replacement-ready-verdict.json',
];
const screenshots = [
  '01-battle-final-asset-review.png',
  '02-levelup-final-asset-review.png',
  '03-rare-final-asset-review.png',
  '04-evolution-final-asset-review.png',
  '05-kokuyou-final-asset-review.png',
  '06-result-final-asset-review.png',
  '07-stageselect-final-asset-review.png',
  '08-retry-final-asset-review.png',
];
const models = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U40/FinalAssetReplacement/U40FinalAssetCategory.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U40/FinalAssetReplacement/U40FinalAssetStatus.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U40/FinalAssetReplacement/U40FinalAssetReplacementEntry.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U40/FinalAssetReplacement/U40FinalAssetBoundaryPolicy.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U40/FinalAssetReplacement/U40MissingFinalAssetFallbackPolicy.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U40/FinalAssetReplacement/U40FinalAssetReadinessReport.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U40/FinalAssetReplacement/U40FinalAssetReplacementRegistry.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U40FinalProductionAssetReplacementVerification.cs',
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
for (const model of models) check(`model exists: ${model}`, existsSync(model));
for (const artifact of artifacts) check(`artifact exists: ${artifact}`, existsSync(join('docs/design-targets/generated/unity-u40', artifact)));
for (const shot of screenshots) check(`screenshot exists: ${shot}`, existsSync(join('docs/design-targets/generated/unity-u40/screenshots', shot)));
check('evidence generator exists', existsSync('scripts/assets/generate-u40-final-asset-evidence.mjs'));

const docsText = docs.map(read).join('\n');
const modelText = models.map(read).join('\n');
const artifactText = artifacts.map((artifact) => read(join('docs/design-targets/generated/unity-u40', artifact))).join('\n');
const text = `${docsText}\n${modelText}\n${artifactText}`;
const verdict = read('docs/design-targets/generated/unity-u40/asset-replacement-ready-verdict.json');
const inventory = read('docs/design-targets/generated/unity-u40/final-asset-inventory-re-audit.json');
const boundary = read('docs/design-targets/generated/unity-u40/runtime-reference-boundary-scan.json');
const blocked = read('docs/design-targets/generated/unity-u40/blocked-runtime-reference-report.json');
const runtime = walk('unity/VampPonUnity/Assets/_Project/Scripts')
  .filter((path) => !path.includes('/Editor/'))
  .map(read)
  .join('\n');

for (const value of [
  'assetReplacementReady: true',
  'productionApproved: false',
  'rcReady: false',
  'mobileMetricsReady: false',
  'finalSeReady: true',
  'audioMixerReady: false',
  'NOT_MEASURED',
  'blockedFromRuntime',
  'docs/design-targets/generated',
  'Addressables未導入',
  'Cloud Save未導入',
  'final SEはfinalCandidate止まり',
  '本番balance未確定',
  '経済バランス未確定',
]) {
  check(`contains ${value}`, text.includes(value));
}

check('verdict assetReplacementReady true', /"assetReplacementReady": true/.test(verdict));
check('verdict production false', /"productionApproved": false/.test(verdict));
check('verdict rc false', /"rcReady": false/.test(verdict));
check('verdict mobile false', /"mobileMetricsReady": false/.test(verdict));
check('verdict finalSe true', /"finalSeReady": true/.test(verdict));
check('verdict audioMixer false', /"audioMixerReady": false/.test(verdict));
check('inventory entries count', (inventory.match(/"assetKey":/g) ?? []).length >= 15);
check('generated docs blocked count zero', /"docsDesignTargetsGeneratedRuntimeRefs": 0/.test(boundary));
check('generated final png blocked count zero', /"generatedFinalPngRuntimeRefs": 0/.test(boundary));
check('blocked runtime report exists', /docs\/design-targets\/generated/.test(blocked));
check('model assetReplacementReady true', /AssetReplacementReady = true/.test(modelText));
check('model production false', /ProductionApproved = false/.test(modelText));
check('model rc false', /RcReady = false/.test(modelText));
check('No runtime docs generated refs', !/docs\/design-targets\/generated/.test(runtime));
check('No generated final image runtime paste', !/top-final|kokuyou-cutin-final|generated\/.*\.png|completed screen image/i.test(runtime));
check('No productionApproved true', !/ProductionApproved\s*=\s*true|"productionApproved": true|productionApproved=1|productionApproved\s*=\s*1/.test(`${artifactText}\n${modelText}`));
check('No rcReady true', !/RcReady\s*=\s*true|"rcReady": true/.test(`${artifactText}\n${modelText}`));
check('No Addressables folder', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('Cloud Save API not introduced', !/CloudSaveService|Unity\.Services\.CloudSave|CloudSave\.Models/i.test(runtime));
check('SE not final approved', !/final approved SE is complete|final-approved draft SE|SE.*最終承認済み/i.test(text));
check('Economy not final', /経済バランス未確定|reward economy/.test(text));
check('Mobile not measured', /mobile metrics NOT_MEASURED|mobileMetricsReady: false|mobileMetricsReady=false/.test(text));
check('No forbidden term string', !text.includes('黒曜化'));

if (failures.length > 0) {
  console.error('unity U40 final production asset replacement check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U40 final production asset replacement check passed: docs=${docs.length}, artifacts=${artifacts.length}, screenshots=${screenshots.length}, assetReplacementReady=true`);
