import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const reviewDoc = 'docs/unity-u10-1-u11-prefab-component-proof-review-2026-07-01.md';
const planDoc = 'docs/unity-u11-prefab-component-proof-plan-2026-07-01.md';
const screenshotsRoot = 'docs/design-targets/generated/unity-u11/screenshots';
const requiredScreenshots = [
  'u11-result-component-proof-390x844.png',
  'u11-result-component-proof-360x800.png',
  'u11-result-component-proof-430x932.png',
  'u11-stageselect-component-proof-390x844.png',
  'u11-stageselect-component-proof-360x800.png',
  'u11-stageselect-component-proof-430x932.png',
  'u11-kokuyou-rare-cutin-review-390x844.png',
];
const componentFiles = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U11/Common/PaperLabelProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U11/Common/PaperButtonProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U11/Common/PaperPanelProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U11/Result/ResultRootProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U11/Result/ResultPaperLedgerPanelProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U11/Result/ResultRewardCardProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U11/Result/ResultStatsLineProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U11/Result/ResultContinueButtonProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U11/StageSelect/StageSelectRootProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U11/StageSelect/StageMapPanelProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U11/StageSelect/StageRouteLineProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U11/StageSelect/StageRouteNodeProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U11/StageSelect/StageLanternMarkerProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U11/StageSelect/StageInfoPanelProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U11/StageSelect/StageStartButtonProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U11PrefabComponentProofScreenshotCapture.cs',
];

function check(label: string, condition: boolean) {
  if (!condition) failures.push(label);
}

function read(path: string) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function searchFiles(dir: string, pattern: RegExp): boolean {
  if (!existsSync(dir)) return false;
  for (const entry of readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.cs') || entry.name.includes('Editor')) continue;
    const path = join(entry.parentPath, entry.name);
    if (path.includes('/Editor/')) continue;
    if (path.includes('/U14/')) continue;
    if (path.includes('/U18/')) continue;
    if (path.includes('/U19/')) continue;
    if (pattern.test(readFileSync(path, 'utf8'))) return true;
  }
  return false;
}

check(`review doc exists: ${reviewDoc}`, existsSync(reviewDoc));
check(`plan doc exists: ${planDoc}`, existsSync(planDoc));
for (const screenshot of requiredScreenshots) {
  check(`screenshot exists: ${screenshot}`, existsSync(join(screenshotsRoot, screenshot)));
}
for (const file of componentFiles) {
  check(`component file exists: ${file}`, existsSync(file));
}

const u10ManifestPath = 'docs/design-targets/generated/unity-u10/u10-prefab-ready-visual-candidate-manifest.json';
if (existsSync(u10ManifestPath)) {
  const manifest = JSON.parse(readFileSync(u10ManifestPath, 'utf8'));
  check('U10 productionApprovedCount=0', manifest.productionApprovedCount === 0);
  for (const item of manifest.items ?? []) {
    check(`${item.id}: productionStatus=candidate`, item.productionStatus === 'candidate');
    check(`${item.id}: textBakedRuntimeImage=false`, item.textBakedRuntimeImage === false);
  }
}

const u11ManifestPath = 'docs/design-targets/generated/unity-u11/u11-visual-refinement-manifest.json';
if (existsSync(u11ManifestPath)) {
  const manifest = JSON.parse(readFileSync(u11ManifestPath, 'utf8'));
  check('U11 productionApprovedCount=0', manifest.productionApprovedCount === 0);
}

for (const dir of ['U5Candidates', 'U8Candidates', 'U8Refined', 'U10Candidates']) {
  check(`Resources/${dir} proof root exists`, existsSync(`unity/VampPonUnity/Assets/_Project/Resources/${dir}`));
}
check('ZenMaruGothic SDF asset exists', existsSync('unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset'));
const checkedText = [reviewDoc, planDoc, ...componentFiles]
  .map(read)
  .join('\n');
check('no U11 public/assets/sprites reference', !checkedText.includes('public/assets/sprites'));
check('no Addressables data', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('no formal Result Scene asset', !existsSync('unity/VampPonUnity/Assets/_Project/Scenes/Result'));
check('no formal StageSelect Scene asset', !existsSync('unity/VampPonUnity/Assets/_Project/Scenes/StageSelect'));
check('no formal Result runtime hook', !searchFiles('unity/VampPonUnity/Assets/_Project/Scripts', /ResultScene|ResultManager|ResultController/));
check('no formal StageSelect runtime hook', !searchFiles('unity/VampPonUnity/Assets/_Project/Scripts', /StageSelectScene|StageSelectManager|StageSelectController/));
check('no reward/save/stage-unlock runtime logic', !searchFiles('unity/VampPonUnity/Assets/_Project/Scripts', /RewardService|SaveService|StageUnlock|UnlockStage|DifficultyController/));
check('no kokuyou runtime hook', !searchFiles('unity/VampPonUnity/Assets/_Project/Scripts', /KokuyouRuntime|KokuyouGauge|KokuyouButton/));

const review = read(reviewDoc);
check('review states no regeneration', review.includes('再生成は未実施'));
check('review states productionApproved=0', review.includes('productionApproved=0'));
check('review states real device not executed', review.includes('not executed'));

if (failures.length > 0) {
  console.error('unity U11 prefab component proof check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U11 prefab component proof check passed: screenshots=${requiredScreenshots.length}, components=${componentFiles.length}, productionApproved=0`);
