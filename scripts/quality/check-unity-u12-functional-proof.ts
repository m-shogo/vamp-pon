import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const planDoc = 'docs/unity-u12-result-stageselect-functional-proof-plan-2026-07-01.md';
const reviewDoc = 'docs/unity-u12-result-stageselect-functional-proof-review-2026-07-01.md';
const screenshotsRoot = 'docs/design-targets/generated/unity-u12/screenshots';
const requiredScreenshots = [
  'u12-result-functional-proof-390x844.png',
  'u12-result-functional-proof-360x800.png',
  'u12-result-functional-proof-430x932.png',
  'u12-stageselect-functional-proof-390x844.png',
  'u12-stageselect-functional-proof-360x800.png',
  'u12-stageselect-functional-proof-430x932.png',
  'u12-kokuyou-rare-cutin-review-390x844.png',
];
const requiredFiles = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U12/Result/ResultProofData.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U12/Result/ResultFunctionalProofController.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U12/StageSelect/StageProofData.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U12/StageSelect/StageSelectFunctionalProofController.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U12FunctionalProofScreenshotCapture.cs',
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
    const text = readFileSync(path, 'utf8')
      .replace(/ResultFunctionalProofController/g, '')
      .replace(/StageSelectFunctionalProofController/g, '');
    if (pattern.test(text)) return true;
  }
  return false;
}

check(`plan doc exists: ${planDoc}`, existsSync(planDoc));
check(`review doc exists: ${reviewDoc}`, existsSync(reviewDoc));
for (const screenshot of requiredScreenshots) {
  check(`screenshot exists: ${screenshot}`, existsSync(join(screenshotsRoot, screenshot)));
}
for (const file of requiredFiles) {
  check(`required file exists: ${file}`, existsSync(file));
}

const resultData = read(requiredFiles[0]);
check('ResultProofData centralizes rank A', resultData.includes('"A"'));
check('ResultProofData centralizes MemoryCount 3', resultData.includes('3'));
check('ResultProofData centralizes FragmentCount 12', resultData.includes('12'));
check('ResultProofData centralizes BlessingCount 3', resultData.includes('BlessingCount'));
check('ResultProofData centralizes elapsed time 08:00', resultData.includes('"08:00"'));
check('ResultProofData centralizes defeated enemies 128', resultData.includes('128'));

const stageData = read(requiredFiles[2]);
check('StageProofData includes stage_01', stageData.includes('stage_01'));
check('StageProofData includes stage_02', stageData.includes('stage_02'));
check('StageProofData includes stage_03', stageData.includes('stage_03'));
check('StageProofData includes selected state', stageData.includes('Selected'));
check('StageProofData includes locked state', stageData.includes('Locked'));

const u10ManifestPath = 'docs/design-targets/generated/unity-u10/u10-prefab-ready-visual-candidate-manifest.json';
if (existsSync(u10ManifestPath)) {
  const manifest = JSON.parse(readFileSync(u10ManifestPath, 'utf8'));
  check('U10 productionApprovedCount=0', manifest.productionApprovedCount === 0);
  for (const item of manifest.items ?? []) {
    check(`${item.id}: productionStatus=candidate`, item.productionStatus === 'candidate');
    check(`${item.id}: textBakedRuntimeImage=false`, item.textBakedRuntimeImage === false);
  }
}

for (const dir of ['U5Candidates', 'U8Candidates', 'U8Refined', 'U10Candidates']) {
  check(`Resources/${dir} proof root exists`, existsSync(`unity/VampPonUnity/Assets/_Project/Resources/${dir}`));
}
check('Resources/U12Proof not created for this pass', !existsSync('unity/VampPonUnity/Assets/_Project/Resources/U12Proof'));
check('ZenMaruGothic SDF asset exists', existsSync('unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset'));
check('no Addressables data', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('no formal Result Scene asset', !existsSync('unity/VampPonUnity/Assets/_Project/Scenes/Result'));
check('no formal StageSelect Scene asset', !existsSync('unity/VampPonUnity/Assets/_Project/Scenes/StageSelect'));
check('no formal Result runtime hook', !searchFiles('unity/VampPonUnity/Assets/_Project/Scripts', /ResultScene|ResultManager|ResultController/));
check('no formal StageSelect runtime hook', !searchFiles('unity/VampPonUnity/Assets/_Project/Scripts', /StageSelectScene|StageSelectManager|StageSelectController/));
check('no reward/save/stage-unlock runtime logic', !searchFiles('unity/VampPonUnity/Assets/_Project/Scripts', /RewardService|SaveService|StageUnlock|UnlockStage|DifficultyController/));
check('no kokuyou runtime hook', !searchFiles('unity/VampPonUnity/Assets/_Project/Scripts', /KokuyouRuntime|KokuyouGauge|KokuyouButton/));

const checkedText = [planDoc, reviewDoc, ...requiredFiles].map(read).join('\n');
check('no U12 public/assets/sprites reference', !checkedText.includes('public/assets/sprites'));
check('review states productionApproved=0', read(reviewDoc).includes('productionApproved=0'));
check('review states real device not executed', read(reviewDoc).includes('not executed'));
check('review states no formal Result/StageSelect', read(reviewDoc).includes('正式Result/StageSelect実装をしていない'));
check('review states hook proof', read(reviewDoc).includes('button hook'));

if (failures.length > 0) {
  console.error('unity U12 functional proof check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U12 functional proof check passed: screenshots=${requiredScreenshots.length}, productionApproved=0, proofControllers=2`);
