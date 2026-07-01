import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const planDoc = 'docs/unity-u18-kokuyou-runtime-prototype-plan-2026-07-01.md';
const reviewDoc = 'docs/unity-u18-kokuyou-runtime-prototype-review-2026-07-01.md';
const screenshotsRoot = 'docs/design-targets/generated/unity-u18/screenshots';

const requiredFiles = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U18/Kokuyou/KokuyouRuntimeState.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U18/Kokuyou/KokuyouGaugeProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U18/Kokuyou/KokuyouChargeRuleProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U18/Kokuyou/KokuyouRuntimePrototypeController.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U18/Kokuyou/KokuyouRuntimeProofView.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U18/Kokuyou/KokuyouOverlayProofView.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U18/Kokuyou/KokuyouCutinBandProofView.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U18KokuyouRuntimeVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U18KokuyouTimeScaleVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U18KokuyouRuntimeScreenshotCapture.cs',
];

const screenshots = [
  'u18-kokuyou-gauge-empty-390x844.png',
  'u18-kokuyou-gauge-ready-390x844.png',
  'u18-kokuyou-activating-overlay-390x844.png',
  'u18-kokuyou-active-proof-390x844.png',
  'u18-kokuyou-ending-proof-390x844.png',
  'u18-kokuyou-loop-return-390x844.png',
  'u18-kokuyou-active-proof-360x800.png',
  'u18-kokuyou-active-proof-430x932.png',
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

function filesContain(root: string, pattern: RegExp) {
  return walk(root).some((path) => pattern.test(read(path)));
}

function csFilesContain(root: string, pattern: RegExp) {
  return walk(root)
    .filter((path) => path.endsWith('.cs'))
    .some((path) => pattern.test(read(path)));
}

check(`plan doc exists: ${planDoc}`, existsSync(planDoc));
check(`review doc exists: ${reviewDoc}`, existsSync(reviewDoc));
for (const file of requiredFiles) check(`required file exists: ${file}`, existsSync(file));
for (const screenshot of screenshots) check(`screenshot exists: ${screenshot}`, existsSync(join(screenshotsRoot, screenshot)));
check('contact sheet exists', existsSync(join(screenshotsRoot, 'u18-kokuyou-all-contact-sheet.png')));

const u18Text = requiredFiles.map(read).join('\n');
for (const value of ['KokuyouRuntimeState', 'KokuyouGaugeProof', 'KokuyouChargeRuleProof', 'KokuyouRuntimePrototypeController', 'BattleTimeScaleService', 'DamageTakenCharge', 'ActiveDuration']) {
  check(`U18 text contains ${value}`, u18Text.includes(value));
}
for (const value of ['Idle', 'Charging', 'Ready', 'Activating', 'Active', 'Ending', 'Cooldown', '25', '100', '5f']) {
  check(`U18 proof value exists: ${value}`, u18Text.includes(value));
}

check('U18 code has no SaveManager', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U18', /SaveManager|SaveService|PlayerPrefs|File\.WriteAllText|FileStream/));
check('U18 code has no RewardManager', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U18', /RewardManager|RewardService|RewardPersistence|ApplyReward|PersistReward/));
check('U18 code has no UnlockManager', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U18', /UnlockManager|StageUnlock|UnlockStage|unlockConfirmed/i));
check('U18 code has no difficulty production calculator', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U18', /DifficultyController|DifficultyCalculator/));
check('U18 runtime does not directly write Time.timeScale', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U18', /Time\.timeScale\s*=/));
check('U18 code has no retired public sprites', !csFilesContain('unity/VampPonUnity/Assets/_Project/Scripts/U18', /public\/assets\/sprites/));
check('no AddressableAssetsData folder', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('ZenMaruGothic SDF asset exists', existsSync('unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset'));
check('kokuyou candidate B exists', existsSync('unity/VampPonUnity/Assets/_Project/Resources/U10Candidates/FullscreenArt/kokuyou_fullscreen_final_candidate_b.png'));
check('cutin band candidate exists', existsSync('unity/VampPonUnity/Assets/_Project/Resources/U10Candidates/Cutin/cutin_black_ink_band_final_candidate.png'));

check('No forbidden term string', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U18', /黒曜化/) && !filesContain('docs', /U18.*黒曜化/));

const review = read(reviewDoc);
for (const value of [
  '黒耀化runtime prototype',
  'kokuyou_fullscreen_final_candidate_b',
  'cutin_black_ink_band_final_candidate',
  'TimeScale',
  'productionApproved=0',
  'proof-only',
  '実機確認はまだnot executed',
  'RewardSummaryは表示用',
  'UnlockCandidateは候補',
]) {
  check(`review contains ${value}`, review.includes(value));
}

if (failures.length > 0) {
  console.error('unity U18 kokuyou runtime check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U18 kokuyou runtime check passed: scripts=${requiredFiles.length}, screenshots=${screenshots.length}, productionApproved=0`);
