import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const planDoc = 'docs/unity-u17-stage1-loop-proof-plan-2026-07-01.md';
const reviewDoc = 'docs/unity-u17-stage1-loop-proof-review-2026-07-01.md';
const navDoc = 'docs/unity-u17-loop-navigation-design-2026-07-01.md';
const screenshotsRoot = 'docs/design-targets/generated/unity-u17/screenshots';

const requiredFiles = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U17/Loop/U17Stage1LoopState.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U17/Loop/U17Stage1LoopProofController.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U17/Loop/U17Stage1LoopProofView.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U17/Loop/U17Stage1LoopRuleProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U17Stage1LoopVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U17Stage1LoopScreenshotCapture.cs',
];

const screenshots = [
  'u17-stage-select-loop-entry-390x844.png',
  'u17-stage-select-loop-entry-360x800.png',
  'u17-stage-select-loop-entry-430x932.png',
  'u17-stage1-loop-battle-proof-390x844.png',
  'u17-stage1-loop-battle-proof-360x800.png',
  'u17-stage1-loop-battle-proof-430x932.png',
  'u17-result-from-loop-proof-390x844.png',
  'u17-result-from-loop-proof-360x800.png',
  'u17-result-from-loop-proof-430x932.png',
  'u17-stage-return-last-result-proof-390x844.png',
  'u17-stage-return-last-result-proof-360x800.png',
  'u17-stage-return-last-result-proof-430x932.png',
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

function csFilesContain(root: string, pattern: RegExp) {
  return walk(root)
    .filter((path) => path.endsWith('.cs'))
    .some((path) => pattern.test(read(path)));
}

check(`plan doc exists: ${planDoc}`, existsSync(planDoc));
check(`review doc exists: ${reviewDoc}`, existsSync(reviewDoc));
check(`navigation design doc exists: ${navDoc}`, existsSync(navDoc));
for (const file of requiredFiles) check(`required file exists: ${file}`, existsSync(file));
for (const screenshot of screenshots) check(`screenshot exists: ${screenshot}`, existsSync(join(screenshotsRoot, screenshot)));
check('contact sheet exists', existsSync(join(screenshotsRoot, 'u17-all-loop-contact-sheet.png')));

const u17Text = requiredFiles.map(read).join('\n');
for (const value of ['StageStartRequest', 'BattleSessionStatsCollector', 'U17Stage1LoopRuleProof', 'BattleResultSummaryBuilder', 'ResultPresentationModel', 'StageSelectPresentationModel', 'LastResultLabel']) {
  check(`U17 text contains ${value}`, u17Text.includes(value));
}
for (const value of ['480', '100', '128', '12', '3', '5', 'Rank A', 'Rank C', 'もう一度', 'ホーム', '戻る']) {
  check(`U17 proof value exists: ${value}`, u17Text.includes(value));
}

check('U17 code has no SaveManager', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U17', /SaveManager|SaveService|PlayerPrefs|File\.WriteAllText|FileStream/));
check('U17 code has no RewardManager', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U17', /RewardManager|RewardService|RewardPersistence|ApplyReward|PersistReward/));
check('U17 code has no UnlockManager', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U17', /UnlockManager|StageUnlock|UnlockStage|unlockConfirmed/i));
check('U17 code has no difficulty production calculator', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U17', /DifficultyController|DifficultyCalculator/));
check('U17 code has no black/kokuyou runtime', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U17', /KokuyouRuntime|KokuyouGauge|KokuyouButton|KokuyouCutIn/));
check('U17 code has no retired public sprites', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U17', /public\/assets\/sprites/));

check('no AddressableAssetsData folder', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
for (const dir of ['U5Candidates', 'U8Candidates', 'U8Refined', 'U10Candidates']) {
  check(`Resources/${dir} proof root exists`, existsSync(`unity/VampPonUnity/Assets/_Project/Resources/${dir}`));
}
check('ZenMaruGothic SDF asset exists', existsSync('unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset'));

const review = read(reviewDoc);
for (const value of [
  'Stage1 Loop Proof',
  'LastResultLabel',
  'clear/fail proof',
  'productionApproved=0',
  'proof-only',
  '実機確認はまだnot executed',
  'RewardSummaryは表示用',
  'UnlockCandidateは候補',
  '黒耀化runtimeを実装していない',
]) {
  check(`review contains ${value}`, review.includes(value));
}

if (failures.length > 0) {
  console.error('unity U17 stage1 loop check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U17 stage1 loop check passed: scripts=${requiredFiles.length}, screenshots=${screenshots.length}, productionApproved=0`);
