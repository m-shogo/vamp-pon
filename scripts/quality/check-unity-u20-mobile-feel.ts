import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docs = [
  'docs/unity-u20-mobile-feel-qa-plan-2026-07-01.md',
  'docs/unity-u20-mobile-feel-qa-review-2026-07-01.md',
  'docs/unity-u20-mobile-environment-report-2026-07-01.md',
  'docs/unity-u20-real-device-checklist-2026-07-01.md',
];
const requiredFiles = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U20/MobileQA/U20MobileQABaseline.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U20/MobileQA/U20MobileQAResult.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U20/MobileQA/U20MobileQAStatus.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U20/MobileQA/U20PerformanceBudgetReport.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U20MobileEnvironmentVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U20SafeAreaVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U20TouchTargetVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U20TextReadabilityVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U20GameFeelMobileVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U20KokuyouMobileVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U20PerformanceBudgetVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U20MobileFeelVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U20MobileQAScreenshotCapture.cs',
];
const screenshots = [
  'u20-stage-select-mobile-360x800.png',
  'u20-stage-select-mobile-390x844.png',
  'u20-stage-select-mobile-430x932.png',
  'u20-stage1-loop-mobile-360x800.png',
  'u20-stage1-loop-mobile-390x844.png',
  'u20-stage1-loop-mobile-430x932.png',
  'u20-levelup-mobile-360x800.png',
  'u20-levelup-mobile-390x844.png',
  'u20-levelup-mobile-430x932.png',
  'u20-result-mobile-360x800.png',
  'u20-result-mobile-390x844.png',
  'u20-result-mobile-430x932.png',
  'u20-kokuyou-mobile-360x800.png',
  'u20-kokuyou-mobile-390x844.png',
  'u20-kokuyou-mobile-430x932.png',
  'u20-game-feel-mobile-390x844.png',
  'u20-contact-sheet-mobile-core.png',
  'u20-contact-sheet-mobile-risk.png',
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

for (const doc of docs) check(`doc exists: ${doc}`, existsSync(doc));
for (const file of requiredFiles) check(`required file exists: ${file}`, existsSync(file));
for (const shot of screenshots) check(`screenshot exists: ${shot}`, existsSync(join('docs/design-targets/generated/unity-u20/screenshots', shot)));

check('no SaveManager added', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U20', /SaveManager|SaveService|PlayerPrefs|File\.WriteAllText|FileStream/));
check('no RewardManager added', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U20', /RewardManager|RewardService|RewardPersistence|ApplyReward|PersistReward/));
check('no UnlockManager added', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U20', /UnlockManager|StageUnlock|UnlockStage|unlockConfirmed/i));
check('no difficulty production calculator added', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U20', /DifficultyController|DifficultyCalculator/));
check('no Addressables', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('no public/assets/sprites reference', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U20', /public\/assets\/sprites/));
check('ZenMaruGothic SDF asset exists', existsSync('unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset'));
check('No forbidden term string in U20 files', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U20', /黒曜化/) && !filesContain('docs', /U20.*黒曜化/));

const review = read('docs/unity-u20-mobile-feel-qa-review-2026-07-01.md');
for (const value of ['Mobile Feel / QA Pass', 'iOS Build Support', 'Android Build Support', 'not executed', 'productionApproved=0', 'Safe Area QA', 'Touch target QA', 'Text readability QA']) {
  check(`review contains ${value}`, review.includes(value));
}

if (failures.length > 0) {
  console.error('unity U20 mobile feel check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`unity U20 mobile feel check passed: scripts=${requiredFiles.length}, screenshots=${screenshots.length}, productionApproved=0`);
