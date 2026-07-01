import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const planDoc = 'docs/unity-u15-production-data-contract-plan-2026-07-01.md';
const reviewDoc = 'docs/unity-u15-production-data-contract-review-2026-07-01.md';
const screenshotsRoot = 'docs/design-targets/generated/unity-u15/screenshots';

const requiredFiles = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U15/Contracts/StageStartRequest.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U15/Contracts/BattleResultSummary.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U15/Contracts/RewardSummary.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U15/Contracts/UnlockCandidate.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U15/Contracts/ResultPresentationModel.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U15/Contracts/StageSelectPresentationModel.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U15/Contracts/StageNodePresentationModel.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U15/Contracts/StageInfoPresentationModel.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U15/Mappers/U14ToU15ContractMapper.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U15/Mappers/BattleResultToPresentationMapper.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U15/Mappers/StageSelectPresentationMapper.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U15ContractVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U15ContractProofScreenshotCapture.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U14/README.md',
  'unity/VampPonUnity/Assets/_Project/Scenes/Proof/README.md',
];

const screenshots = [
  'u15-contract-flow-proof-390x844.png',
  'u15-contract-flow-proof-360x800.png',
  'u15-contract-flow-proof-430x932.png',
  'u15-result-presentation-proof-390x844.png',
  'u15-result-presentation-proof-360x800.png',
  'u15-result-presentation-proof-430x932.png',
  'u15-stageselect-presentation-proof-390x844.png',
  'u15-stageselect-presentation-proof-360x800.png',
  'u15-stageselect-presentation-proof-430x932.png',
];

function check(label: string, condition: boolean) {
  if (!condition) failures.push(label);
}

function read(path: string) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function walk(root: string): string[] {
  if (!existsSync(root)) return [];
  const paths: string[] = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) paths.push(...walk(path));
    if (entry.isFile()) paths.push(path);
  }
  return paths;
}

function csFilesContain(root: string, pattern: RegExp, ignored: RegExp[] = []) {
  return walk(root)
    .filter((path) => path.endsWith('.cs'))
    .filter((path) => !ignored.some((ignore) => ignore.test(path)))
    .some((path) => pattern.test(read(path)));
}

check(`plan doc exists: ${planDoc}`, existsSync(planDoc));
check(`review doc exists: ${reviewDoc}`, existsSync(reviewDoc));
for (const file of requiredFiles) check(`required file exists: ${file}`, existsSync(file));
for (const screenshot of screenshots) check(`screenshot exists: ${screenshot}`, existsSync(join(screenshotsRoot, screenshot)));
check('contact sheet exists', existsSync(join(screenshotsRoot, 'u15-all-contract-contact-sheet.png')));

const contractsText = requiredFiles.map(read).join('\n');
for (const value of ['StageStartRequest', 'BattleResultSummary', 'RewardSummary', 'UnlockCandidate', 'ResultPresentationModel', 'StageSelectPresentationModel']) {
  check(`contract text contains ${value}`, contractsText.includes(value));
}
for (const value of ['stage_01', 'はじまりの路地', 'easy', 'やさしい', 'proof-start', 'stage_select', '08:00', '128', '12', '3', 'A', '記憶', '墨', '灯']) {
  check(`sample contract value exists: ${value}`, contractsText.includes(value));
}

check('U15 code has no SaveManager', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U15', /SaveManager|SaveService|PlayerPrefs|File\.WriteAllText|FileStream/));
check('U15 code has no RewardManager', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U15', /RewardManager|RewardService|RewardPersistence|ApplyReward|PersistReward/));
check('U15 code has no UnlockManager', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U15', /UnlockManager|StageUnlock|UnlockStage|unlockConfirmed/i));
check('U15 code has no difficulty production calculator', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U15', /DifficultyController|DifficultyCalculator/));
check('U15 code has no kokuyou runtime', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U15', /KokuyouRuntime|KokuyouGauge|KokuyouButton|KokuyouCutIn/));
check('no AddressableAssetsData folder', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('no U15 code references retired public sprites', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U15', /public\/assets\/sprites/));

for (const dir of ['U5Candidates', 'U8Candidates', 'U8Refined', 'U10Candidates']) {
  check(`Resources/${dir} proof root exists`, existsSync(`unity/VampPonUnity/Assets/_Project/Resources/${dir}`));
}
check('Resources/U15Proof not created', !existsSync('unity/VampPonUnity/Assets/_Project/Resources/U15Proof'));
check('ZenMaruGothic SDF asset exists', existsSync('unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset'));

const u10Manifest = 'docs/design-targets/generated/unity-u10/u10-prefab-ready-visual-candidate-manifest.json';
if (existsSync(u10Manifest)) {
  const manifest = JSON.parse(read(u10Manifest));
  check('U10 productionApprovedCount=0', manifest.productionApprovedCount === 0);
  for (const item of manifest.items ?? []) {
    check(`${item.id}: productionStatus=candidate`, item.productionStatus === 'candidate');
    check(`${item.id}: textBakedRuntimeImage=false`, item.textBakedRuntimeImage === false);
  }
}

const review = read(reviewDoc);
check('review states productionApproved=0', review.includes('productionApproved=0'));
check('review states real device not executed', review.includes('not executed'));
check('review states contract proof', review.includes('contract proof'));
check('review states no formal Result/StageSelect', review.includes('正式Result/StageSelect実装をしていない'));
check('review states no Battle production implementation', review.includes('Battle本番実装をしていない'));
check('review states no reward/save/unlock logic', review.includes('報酬/セーブ/Stage解放ロジックを作っていない'));
check('review states BattleResultSummary not production Battle result', review.includes('BattleResultSummaryは本番Battle結果からはまだ生成されていない'));

if (failures.length > 0) {
  console.error('unity U15 contracts check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U15 contracts check passed: contracts=8, mappers=3, screenshots=${screenshots.length}, productionApproved=0`);
