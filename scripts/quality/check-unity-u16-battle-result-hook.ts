import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const planDoc = 'docs/unity-u16-battle-result-hook-proof-plan-2026-07-01.md';
const reviewDoc = 'docs/unity-u16-battle-result-hook-proof-review-2026-07-01.md';
const screenshotsRoot = 'docs/design-targets/generated/unity-u16/screenshots';

const requiredFiles = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U16/Battle/BattleSessionStats.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U16/Battle/BattleSessionStatsCollector.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U16/Battle/BattleSessionClock.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U16/Battle/BattleResultSummaryBuilder.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U16/Battle/U16BattleStatsProofAdapter.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U16/Battle/U16BattleResultHookProofController.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U16/Battle/U16BattleResultHookProofView.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U16BattleResultHookVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U16BattleResultHookScreenshotCapture.cs',
];

const screenshots = [
  'u16-battle-result-hook-proof-390x844.png',
  'u16-battle-result-hook-proof-360x800.png',
  'u16-battle-result-hook-proof-430x932.png',
  'u16-result-from-battle-summary-proof-390x844.png',
  'u16-result-from-battle-summary-proof-360x800.png',
  'u16-result-from-battle-summary-proof-430x932.png',
  'u16-stage-return-with-last-result-proof-390x844.png',
  'u16-stage-return-with-last-result-proof-360x800.png',
  'u16-stage-return-with-last-result-proof-430x932.png',
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
  for (const entry of readdirSync(root)) {
    const path = join(root, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) paths.push(...walk(path));
    if (stat.isFile()) paths.push(path);
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
check('contact sheet exists', existsSync(join(screenshotsRoot, 'u16-all-battle-result-hook-contact-sheet.png')));

const u16Text = requiredFiles.map(read).join('\n');
for (const value of ['BattleSessionStats', 'BattleSessionStatsCollector', 'BattleResultSummaryBuilder', 'StageStartRequest', 'BattleResultSummary', 'ResultPresentationModel', 'StageSelectPresentationModel']) {
  check(`U16 text contains ${value}`, u16Text.includes(value));
}
for (const value of ['stage_01', 'はじまりの路地', 'easy', 'やさしい', '08:00', '128', '12', '3', '5', 'A', '記憶', '墨', '灯']) {
  check(`U16 proof value exists: ${value}`, u16Text.includes(value));
}

const scanRoots = ['unity/VampPonUnity/Assets/_Project/Scripts/U16'];
for (const root of scanRoots) {
  check(`${root} has no SaveManager`, !csFilesContain(root, /SaveManager|SaveService|PlayerPrefs|File\.WriteAllText|FileStream/));
  check(`${root} has no RewardManager`, !csFilesContain(root, /RewardManager|RewardService|RewardPersistence|ApplyReward|PersistReward/));
  check(`${root} has no UnlockManager`, !csFilesContain(root, /UnlockManager|StageUnlock|UnlockStage|unlockConfirmed/i));
  check(`${root} has no difficulty production calculator`, !csFilesContain(root, /DifficultyController|DifficultyCalculator/));
  check(`${root} has no black/kokuyou runtime`, !csFilesContain(root, /KokuyouRuntime|KokuyouGauge|KokuyouButton|KokuyouCutIn/));
  check(`${root} has no retired public sprites`, !csFilesContain(root, /public\/assets\/sprites/));
}

check('no AddressableAssetsData folder', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
for (const dir of ['U5Candidates', 'U8Candidates', 'U8Refined', 'U10Candidates']) {
  check(`Resources/${dir} proof root exists`, existsSync(`unity/VampPonUnity/Assets/_Project/Resources/${dir}`));
}
check('ZenMaruGothic SDF asset exists', existsSync('unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset'));

const review = read(reviewDoc);
for (const value of [
  'Battle Result Hook Proof',
  'U15.1 Contract Risk Cleanup',
  'fallback',
  'productionApproved=0',
  'proof-only',
  '実機確認はまだnot executed',
  'RewardSummaryは表示用',
  'UnlockCandidateは候補',
  '黒耀化runtimeを実装していない',
]) {
  check(`review contains ${value}`, review.includes(value));
}

if (existsSync('docs/design-targets/generated/unity-u10/u10-prefab-ready-visual-candidate-manifest.json')) {
  const manifest = JSON.parse(read('docs/design-targets/generated/unity-u10/u10-prefab-ready-visual-candidate-manifest.json'));
  check('U10 productionApprovedCount=0', manifest.productionApprovedCount === 0);
}

if (failures.length > 0) {
  console.error('unity U16 battle result hook check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U16 battle result hook check passed: scripts=${requiredFiles.length}, screenshots=${screenshots.length}, productionApproved=0`);
