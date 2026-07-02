import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const planDoc = 'docs/unity-u13-result-stageselect-prefab-flow-plan-2026-07-01.md';
const flowDoc = 'docs/unity-u13-stage-result-flow-design-2026-07-01.md';
const reviewDoc = 'docs/unity-u13-result-stageselect-prefab-flow-review-2026-07-01.md';
const screenshotsRoot = 'docs/design-targets/generated/unity-u13/screenshots';

const resultPrefabs = [
  'ResultRoot.prefab',
  'ResultPaperLedgerPanel.prefab',
  'ResultRewardCard.prefab',
  'ResultStatsLine.prefab',
  'ResultContinueButton.prefab',
  'ResultRankSeal.prefab',
  'ResultNewBadge.prefab',
].map((name) => `unity/VampPonUnity/Assets/_Project/Prefabs/UI/Result/${name}`);

const stagePrefabs = [
  'StageSelectRoot.prefab',
  'StageMapPanel.prefab',
  'StageRouteLine.prefab',
  'StageRouteNode.prefab',
  'StageLanternMarker.prefab',
  'StageInfoPanel.prefab',
  'StageStartButton.prefab',
].map((name) => `unity/VampPonUnity/Assets/_Project/Prefabs/UI/StageSelect/${name}`);

const commonPrefabs = [
  'PaperLabel.prefab',
  'PaperButton.prefab',
  'PaperPanel.prefab',
  'MemoryCard.prefab',
  'InkRouteLine.prefab',
  'LanternMarker.prefab',
].map((name) => `unity/VampPonUnity/Assets/_Project/Prefabs/UI/Common/${name}`);

const screenshots = [
  'u13-result-prefab-candidate-390x844.png',
  'u13-result-prefab-candidate-360x800.png',
  'u13-result-prefab-candidate-430x932.png',
  'u13-stageselect-prefab-candidate-390x844.png',
  'u13-stageselect-prefab-candidate-360x800.png',
  'u13-stageselect-prefab-candidate-430x932.png',
  'u13-flow-map-proof-390x844.png',
];

const requiredFiles = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U13/Result/ResultViewModel.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U13/Result/ResultRewardCardViewModel.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U13/StageSelect/StageSelectViewModel.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U13/StageSelect/StageNodeViewModel.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U13/StageSelect/StageInfoViewModel.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U13/Flow/IResultActionHandler.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U13/Flow/IStageSelectActionHandler.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U13PrefabCandidateBuilder.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U13PrefabFlowScreenshotCapture.cs',
];

function check(label: string, condition: boolean) {
  if (!condition) failures.push(label);
}

function read(path: string) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function searchCs(root: string, pattern: RegExp): boolean {
  for (const entry of readdirSync(root, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.cs') || entry.name.includes('Editor')) continue;
    const path = join(entry.parentPath, entry.name);
    if (path.includes('/Editor/')) continue;
    if (path.includes('/U14/') || path.includes('/U15/') || path.includes('/U18/') || path.includes('/U19/')) continue;
    const text = readFileSync(path, 'utf8');
    if (pattern.test(text)) return true;
  }
  return false;
}

check(`plan doc exists: ${planDoc}`, existsSync(planDoc));
check(`flow doc exists: ${flowDoc}`, existsSync(flowDoc));
check(`review doc exists: ${reviewDoc}`, existsSync(reviewDoc));
for (const screenshot of screenshots) check(`screenshot exists: ${screenshot}`, existsSync(join(screenshotsRoot, screenshot)));
for (const file of [...resultPrefabs, ...stagePrefabs, ...commonPrefabs, ...requiredFiles]) check(`required file exists: ${file}`, existsSync(file));

const resultVm = read('unity/VampPonUnity/Assets/_Project/Scripts/U13/Result/ResultViewModel.cs');
check('ResultViewModel has title', resultVm.includes('今夜の記録'));
check('ResultViewModel has elapsed time', resultVm.includes('08:00'));
check('ResultViewModel has defeated enemies', resultVm.includes('128'));
check('ResultViewModel has button label', resultVm.includes('次へ'));

const stageVm = read('unity/VampPonUnity/Assets/_Project/Scripts/U13/StageSelect/StageSelectViewModel.cs');
check('StageSelectViewModel has stage_01', stageVm.includes('stage_01'));
check('StageSelectViewModel has stage_02', stageVm.includes('stage_02'));
check('StageSelectViewModel has stage_03', stageVm.includes('stage_03'));
check('StageSelectViewModel has start label', stageVm.includes('出発'));

for (const dir of ['U5Candidates', 'U8Candidates', 'U8Refined', 'U10Candidates']) {
  check(`Resources/${dir} proof root exists`, existsSync(`unity/VampPonUnity/Assets/_Project/Resources/${dir}`));
}

check('Resources/U13Proof not created', !existsSync('unity/VampPonUnity/Assets/_Project/Resources/U13Proof'));
check('ZenMaruGothic SDF asset exists', existsSync('unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset'));
check('no Addressables data', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('no formal Result Scene asset', !existsSync('unity/VampPonUnity/Assets/_Project/Scenes/Result'));
check('no formal StageSelect Scene asset', !existsSync('unity/VampPonUnity/Assets/_Project/Scenes/StageSelect'));
check('no actual Battle scene transition in U13', !searchCs('unity/VampPonUnity/Assets/_Project/Scripts/U13', /SceneManager\.LoadScene|LoadSceneAsync|StartBattleRuntime|BattleSceneTransition/));
check('no reward/save/stage-unlock runtime logic', !searchCs('unity/VampPonUnity/Assets/_Project/Scripts', /RewardService|SaveService|SaveManager|StageUnlock|UnlockStage|DifficultyController/));
check('no kokuyou runtime hook', !searchCs('unity/VampPonUnity/Assets/_Project/Scripts', /KokuyouRuntime|KokuyouGauge|KokuyouButton/));

const u10Manifest = 'docs/design-targets/generated/unity-u10/u10-prefab-ready-visual-candidate-manifest.json';
if (existsSync(u10Manifest)) {
  const manifest = JSON.parse(read(u10Manifest));
  check('U10 productionApprovedCount=0', manifest.productionApprovedCount === 0);
  for (const item of manifest.items ?? []) {
    check(`${item.id}: productionStatus=candidate`, item.productionStatus === 'candidate');
    check(`${item.id}: textBakedRuntimeImage=false`, item.textBakedRuntimeImage === false);
  }
}

const checkedText = [planDoc, flowDoc, reviewDoc, ...requiredFiles].map(read).join('\n');
check('no public/assets/sprites reference', !checkedText.includes('public/assets/sprites'));
check('review states productionApproved=0', read(reviewDoc).includes('productionApproved=0'));
check('review states real device not executed', read(reviewDoc).includes('not executed'));
check('review states no formal Result/StageSelect', read(reviewDoc).includes('正式Result/StageSelect実装をしていない'));
check('review states no Battle production transition', read(reviewDoc).includes('Battle本番遷移を作っていない'));

if (failures.length > 0) {
  console.error('unity U13 prefab flow check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U13 prefab flow check passed: resultPrefabs=${resultPrefabs.length}, stagePrefabs=${stagePrefabs.length}, commonPrefabs=${commonPrefabs.length}, screenshots=${screenshots.length}, productionApproved=0`);
