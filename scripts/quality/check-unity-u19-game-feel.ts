import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const planDoc = 'docs/unity-u19-game-feel-levelup-drop-evolution-polish-plan-2026-07-01.md';
const reviewDoc = 'docs/unity-u19-game-feel-levelup-drop-evolution-polish-review-2026-07-01.md';
const hookDoc = 'docs/unity-u19-se-haptic-hook-design-2026-07-01.md';
const screenshotsRoot = 'docs/design-targets/generated/unity-u19/screenshots';

const requiredFiles = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U19/GameFeel/U19GameFeelProofState.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U19/GameFeel/U19GameFeelProofController.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U19/GameFeel/U19GameFeelProofView.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U19/GameFeel/U19ExpMagnetProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U19/GameFeel/U19ExpCollectTrailProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U19/GameFeel/U19ExpPopProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U19/GameFeel/U19DropProofController.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U19/GameFeel/U19DropProofItem.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U19/GameFeel/U19HealingDropProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U19/GameFeel/U19LevelUpProofController.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U19/GameFeel/U19RarePresentationProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U19/GameFeel/U19EvolutionProofController.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U19/GameFeel/U19FeedbackHookProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U19/GameFeel/U19GameFeelImpulseProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U19/GameFeel/U19HitFlashProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U19/GameFeel/U19ParticleBudgetProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U19GameFeelVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U19GameFeelScreenshotCapture.cs',
];

const screenshots = [
  'u19-exp-magnet-proof-390x844.png',
  'u19-drop-healing-proof-390x844.png',
  'u19-levelup-proof-390x844.png',
  'u19-rare-proof-390x844.png',
  'u19-evolution-proof-390x844.png',
  'u19-kokuyou-feel-proof-390x844.png',
  'u19-stage1-loop-feel-proof-390x844.png',
  'u19-levelup-proof-360x800.png',
  'u19-levelup-proof-430x932.png',
  'u19-stage1-loop-feel-proof-360x800.png',
  'u19-stage1-loop-feel-proof-430x932.png',
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

check(`plan doc exists: ${planDoc}`, existsSync(planDoc));
check(`review doc exists: ${reviewDoc}`, existsSync(reviewDoc));
check(`SE/haptic hook design doc exists: ${hookDoc}`, existsSync(hookDoc));
for (const file of requiredFiles) check(`required file exists: ${file}`, existsSync(file));
for (const screenshot of screenshots) check(`screenshot exists: ${screenshot}`, existsSync(join(screenshotsRoot, screenshot)));
check('contact sheet exists', existsSync(join(screenshotsRoot, 'u19-all-game-feel-contact-sheet.png')));

const u19Text = requiredFiles.map(read).join('\n');
for (const value of ['U19GameFeelProofState', 'U19GameFeelProofController', 'U19ExpMagnetProof', 'U19DropProofController', 'U19LevelUpProofController', 'U19RarePresentationProof', 'U19EvolutionProofController', 'U19FeedbackHookProof']) {
  check(`U19 text contains ${value}`, u19Text.includes(value));
}
for (const value of ['OnExpCollect', 'OnLevelUpOpen', 'OnRareAppear', 'OnEvolutionTrigger', 'OnKokuyouActivate', 'Heart', '夜明けのインク灯']) {
  check(`U19 proof value exists: ${value}`, u19Text.includes(value));
}

check('U19 code has no SaveManager', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U19', /SaveManager|SaveService|PlayerPrefs|File\.WriteAllText|FileStream/));
check('U19 code has no RewardManager', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U19', /RewardManager|RewardService|RewardPersistence|ApplyReward|PersistReward/));
check('U19 code has no UnlockManager', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U19', /UnlockManager|StageUnlock|UnlockStage|unlockConfirmed/i));
check('U19 code has no difficulty production calculator', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U19', /DifficultyController|DifficultyCalculator/));
check('U19 code does not directly write Time.timeScale', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U19', /Time\.timeScale\s*=/));
check('U19 code has no retired public sprites', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U19', /public\/assets\/sprites/));
check('no AddressableAssetsData folder', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('ZenMaruGothic SDF asset exists', existsSync('unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset'));
check('No forbidden term string in U19 files', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U19', /黒曜化/) && !filesContain('docs', /U19.*黒曜化/));

const review = read(reviewDoc);
for (const value of ['Game Feel Proof', 'EXP吸引', '回復drop', 'LevelUp', 'Rare', 'Evolution', '黒耀化中', 'productionApproved=0', '実機確認はまだnot executed']) {
  check(`review contains ${value}`, review.includes(value));
}

if (failures.length > 0) {
  console.error('unity U19 game feel check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U19 game feel check passed: scripts=${requiredFiles.length}, screenshots=${screenshots.length}, productionApproved=0`);
