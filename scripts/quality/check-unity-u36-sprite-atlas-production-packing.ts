import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docs = [
  'docs/unity-u36-sprite-atlas-production-packing-plan-2026-07-03.md',
  'docs/unity-u36-sprite-atlas-production-packing-review-2026-07-03.md',
  'docs/unity-u36-sprite-atlas-target-inventory-2026-07-03.md',
  'docs/unity-u36-texture-import-consistency-check-2026-07-03.md',
  'docs/unity-u36-runtime-reference-safety-check-2026-07-03.md',
  'docs/unity-u36-asset-replacement-ready-re-evaluation-2026-07-03.md',
  'docs/unity-u36-u30-u35-gate-addendum-2026-07-03.md',
];
const atlases = [
  ['U36Characters.spriteatlas', 1],
  ['U36Enemies.spriteatlas', 1],
  ['U36ItemsIcons.spriteatlas', 2],
  ['U36UiPaper.spriteatlas', 14],
  ['U36Effects.spriteatlas', 7],
] as const;
const artifacts = [
  'sprite-atlas-production-packing-completion-map.json',
  'sprite-atlas-target-inventory.json',
  'sprite-atlas-excluded-assets.json',
  'sprite-atlas-risk-map.json',
  'runtime-reference-safety-check.json',
];
const screenshots = [
  '01-battle-atlas-safety.png',
  '02-levelup-atlas-safety.png',
  '03-rare-atlas-safety.png',
  '04-evolution-atlas-safety.png',
  '05-kokuyou-atlas-safety.png',
  '06-result-atlas-safety.png',
  '07-stageselect-atlas-safety.png',
  '08-retry-atlas-safety.png',
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
for (const [atlas, count] of atlases) {
  const path = join('unity/VampPonUnity/Assets/_Project/SpriteAtlases/U36', atlas);
  const text = read(path);
  check(`atlas exists: ${atlas}`, existsSync(path));
  check(`atlas meta exists: ${atlas}`, existsSync(`${path}.meta`));
  check(`atlas packable count: ${atlas}`, (text.match(/fileID: 2800000/g) ?? []).length === count);
  check(`atlas excludes docs generated: ${atlas}`, !/docs\/design-targets\/generated/.test(text));
}
for (const artifact of artifacts) check(`artifact exists: ${artifact}`, existsSync(join('docs/design-targets/generated/unity-u36', artifact)));
for (const shot of screenshots) check(`screenshot exists: ${shot}`, existsSync(join('docs/design-targets/generated/unity-u36/screenshots', shot)));

const docsText = docs.map(read).join('\n');
const atlasText = atlases.map(([atlas]) => read(join('unity/VampPonUnity/Assets/_Project/SpriteAtlases/U36', atlas))).join('\n');
const artifactText = artifacts.map((artifact) => read(join('docs/design-targets/generated/unity-u36', artifact))).join('\n');
const editorText = read('unity/VampPonUnity/Assets/_Project/Scripts/Editor/U36SpriteAtlasProductionPackingVerification.cs');
const allUnityRuntime = walk('unity/VampPonUnity/Assets/_Project/Scripts')
  .filter((path) => !path.includes('/Editor/'))
  .map(read)
  .join('\n');
const text = `${docsText}\n${artifactText}\n${editorText}\n${atlasText}`;
const completion = read('docs/design-targets/generated/unity-u36/sprite-atlas-production-packing-completion-map.json');
const excluded = read('docs/design-targets/generated/unity-u36/sprite-atlas-excluded-assets.json');
const safety = read('docs/design-targets/generated/unity-u36/runtime-reference-safety-check.json');

for (const value of [
  'productionApproved=false',
  'Addressables',
  'Cloud Save',
  'docs/design-targets/generated',
  'generated final PNG',
  'assetReplacementReady',
  'spriteAtlasProductionPackingComplete',
  'mobile metrics NOT_MEASURED',
  '本番SE未確定',
  '本番balance未確定',
]) {
  check(`contains ${value}`, text.includes(value));
}

check('completion true', /"spriteAtlasProductionPackingComplete": true/.test(completion));
check('asset replacement stays false', /"assetReplacementReady": false/.test(completion) && /assetReplacementReady: false/.test(docsText));
check('generated excluded false', /"generatedAssetIncluded": false/.test(completion) && /"docsGeneratedIncluded": false/.test(completion));
check('addressables false', /"addressablesUsed": false/.test(completion) && /"addressablesIntroduced": false/.test(safety));
check('excluded docs generated', /docs\/design-targets\/generated/.test(excluded));
check('runtime safety false states', /"runtimeReferencesDocsGenerated": false/.test(safety) && /"runtimeUsesGeneratedFinalPng": false/.test(safety));
check('mobile metrics not measured', /"mobileMetrics": "NOT_MEASURED"/.test(safety));
check('No production approval true', !/productionApproved\s*=\s*1|ProductionApproved\s*=\s*true|"productionApproved": true/.test(text));
check('No runtime docs generated refs', !/docs\/design-targets\/generated/.test(allUnityRuntime));
check('No generated final image runtime paste', !/top-final|kokuyou-cutin-final|generated\/.*\.png|completed screen image/i.test(allUnityRuntime));
check('No generated docs or public prototypes in atlas', !/docs\/design-targets\/generated|public\/assets\/prototypes|FullscreenArt/.test(atlasText));
check('No Addressables folder', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('Cloud Save API not introduced', !/CloudSaveService|Unity\.Services\.CloudSave|CloudSave\.Models/i.test(allUnityRuntime));
check('Final SE not approved', /本番SE未確定|final SE[^.\n]*(not approved|not finalized)|draft SE remains draft/.test(text));
check('Economy not final', /経済バランス|reward economy|本番balance未確定/.test(text));
check('No forbidden term string', !text.includes('黒曜化'));

if (failures.length > 0) {
  console.error('unity U36 sprite atlas production packing check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U36 sprite atlas production packing check passed: atlases=${atlases.length}, artifacts=${artifacts.length}, screenshots=${screenshots.length}, productionPackingComplete=true`);
