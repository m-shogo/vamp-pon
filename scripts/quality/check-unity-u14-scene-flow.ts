import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];

const planDoc = 'docs/unity-u14-stage-result-scene-flow-proof-plan-2026-07-01.md';
const reviewDoc = 'docs/unity-u14-stage-result-scene-flow-proof-review-2026-07-01.md';
const screenshotsRoot = 'docs/design-targets/generated/unity-u14/screenshots';
const scriptsRoot = 'unity/VampPonUnity/Assets/_Project/Scripts';

const proofScenes = [
  'U14StageSelectFlowProof.unity',
  'U14BattleFlowProof.unity',
  'U14ResultFlowProof.unity',
].map((name) => `unity/VampPonUnity/Assets/_Project/Scenes/Proof/${name}`);

const requiredFiles = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U14/Flow/U14FlowState.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U14/Flow/U14ProofSceneRouter.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U14/Flow/BattleStartRequestProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U14/Flow/BattleResultSummaryProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U14/StageSelect/U14StageSelectFlowProofController.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U14/Battle/U14BattleFlowProofController.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U14/Battle/U14BattleFlowProofView.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U14/Result/U14ResultFlowProofController.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U14ProofSceneBuilder.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U14FlowProofVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U14SceneFlowScreenshotCapture.cs',
];

const screenshots = [
  'u14-stage-select-flow-proof-390x844.png',
  'u14-stage-select-flow-proof-360x800.png',
  'u14-stage-select-flow-proof-430x932.png',
  'u14-battle-flow-proof-390x844.png',
  'u14-battle-flow-proof-360x800.png',
  'u14-battle-flow-proof-430x932.png',
  'u14-result-flow-proof-390x844.png',
  'u14-result-flow-proof-360x800.png',
  'u14-result-flow-proof-430x932.png',
  'u14-flow-sequence-proof-390x844.png',
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

function csFiles(root: string) {
  return walk(root).filter((path) => path.endsWith('.cs'));
}

function csFilesContain(root: string, pattern: RegExp, ignored: RegExp[] = []) {
  return csFiles(root)
    .filter((path) => !ignored.some((ignore) => ignore.test(path)))
    .some((path) => pattern.test(read(path)));
}

check(`plan doc exists: ${planDoc}`, existsSync(planDoc));
check(`review doc exists: ${reviewDoc}`, existsSync(reviewDoc));
for (const scene of proofScenes) check(`proof scene exists: ${scene}`, existsSync(scene));
for (const file of requiredFiles) check(`required file exists: ${file}`, existsSync(file));
for (const screenshot of screenshots) check(`screenshot exists: ${screenshot}`, existsSync(join(screenshotsRoot, screenshot)));
for (const sheet of ['u14-stage-select-contact-sheet.png', 'u14-battle-contact-sheet.png', 'u14-result-contact-sheet.png', 'u14-all-flow-contact-sheet.png']) {
  check(`contact sheet exists: ${sheet}`, existsSync(join(screenshotsRoot, sheet)));
}

const flowState = read('unity/VampPonUnity/Assets/_Project/Scripts/U14/Flow/U14FlowState.cs');
check('U14FlowState has selected stage id', flowState.includes('SelectedStageId'));
check('U14FlowState has selected difficulty', flowState.includes('SelectedDifficulty'));
check('U14FlowState has last played stage id', flowState.includes('LastPlayedStageId'));
check('U14FlowState has last result summary', flowState.includes('LastResultSummary'));
check('U14FlowState has flow step', flowState.includes('FlowStep'));
check('U14FlowState does not use PlayerPrefs', !flowState.includes('PlayerPrefs'));

const startRequest = read('unity/VampPonUnity/Assets/_Project/Scripts/U14/Flow/BattleStartRequestProof.cs');
check('BattleStartRequestProof has stage_01', startRequest.includes('stage_01'));
check('BattleStartRequestProof has やさしい', startRequest.includes('やさしい'));

const summary = read('unity/VampPonUnity/Assets/_Project/Scripts/U14/Flow/BattleResultSummaryProof.cs');
for (const value of ['clear', 'stage_01', 'はじまりの路地', 'やさしい', '08:00', '128', '12', '3', 'A', '記憶', '墨', '灯']) {
  check(`BattleResultSummaryProof contains ${value}`, summary.includes(value));
}

const router = read('unity/VampPonUnity/Assets/_Project/Scripts/U14/Flow/U14ProofSceneRouter.cs');
check('router has StageSelect proof scene', router.includes('U14StageSelectFlowProof'));
check('router has Battle proof scene', router.includes('U14BattleFlowProof'));
check('router has Result proof scene', router.includes('U14ResultFlowProof'));
check('router has GoToStageSelect', router.includes('GoToStageSelect'));
check('router has GoToBattle', router.includes('GoToBattle'));
check('router has GoToResult', router.includes('GoToResult'));

check('no SaveManager added in U14', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U14', /SaveManager|SaveService|PlayerPrefs|File\.WriteAllText|FileStream/));
check('no reward persistence in U14', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U14', /RewardService|RewardPersistence|ApplyReward|PersistReward/));
check('no stage unlock runtime in U14', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U14', /StageUnlock|UnlockStage|unlockCandidate/i));
check('no difficulty production calculator in U14', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U14', /DifficultyController|DifficultyCalculator/));
check('no kokuyou runtime in U14', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U14', /KokuyouRuntime|KokuyouGauge|KokuyouButton|KokuyouCutIn/));
check('no AddressableAssetsData folder', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('no U14 code references retired public sprites', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U14', /public\/assets\/sprites/));

for (const dir of ['U5Candidates', 'U8Candidates', 'U8Refined', 'U10Candidates']) {
  check(`Resources/${dir} proof root exists`, existsSync(`unity/VampPonUnity/Assets/_Project/Resources/${dir}`));
}
check('Resources/U14Proof not created', !existsSync('unity/VampPonUnity/Assets/_Project/Resources/U14Proof'));
check('ZenMaruGothic SDF asset exists', existsSync('unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset'));

check(
  'U14 SceneManager.LoadScene only in U14ProofSceneRouter',
  !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U14', /SceneManager\.LoadScene|LoadSceneAsync/, [/U14ProofSceneRouter\.cs$/]),
);

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
check('review states no formal Result/StageSelect', review.includes('正式Result/StageSelect実装をしていない'));
check('review states no Battle production implementation', review.includes('Battle本番実装をしていない'));
check('review states no reward/save/unlock logic', review.includes('報酬/セーブ/Stage解放ロジックを作っていない'));

if (failures.length > 0) {
  console.error('unity U14 scene flow check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U14 scene flow check passed: scenes=${proofScenes.length}, scripts=${requiredFiles.length}, screenshots=${screenshots.length}, productionApproved=0`);
