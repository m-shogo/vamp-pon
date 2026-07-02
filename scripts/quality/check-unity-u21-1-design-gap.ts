import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docs = [
  'docs/unity-u21-1-design-gap-analysis-visual-polish-gate-plan-2026-07-01.md',
  'docs/unity-u21-1-design-gap-analysis-2026-07-01.md',
  'docs/unity-u21-1-design-severity-ranking-2026-07-01.md',
  'docs/unity-u21-1-visual-polish-candidate-notes-2026-07-01.md',
  'docs/unity-u21-1-design-gap-analysis-visual-polish-gate-review-2026-07-01.md',
];
const requiredFiles = [
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U21_1DesignGapScreenshotCapture.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U21_1DesignGapVerification.cs',
];
const screenshots = [
  'u21-1-stage-select-review-390x844.png',
  'u21-1-stage1-playing-review-390x844.png',
  'u21-1-levelup-review-390x844.png',
  'u21-1-rare-review-390x844.png',
  'u21-1-evolution-review-390x844.png',
  'u21-1-kokuyou-ready-review-390x844.png',
  'u21-1-kokuyou-active-review-390x844.png',
  'u21-1-clear-result-review-390x844.png',
  'u21-1-fail-result-review-390x844.png',
  'u21-1-stage-return-review-390x844.png',
  'u21-1-contact-sheet-flow-review.png',
  'u21-1-contact-sheet-risk-review.png',
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
for (const shot of screenshots) check(`screenshot exists: ${shot}`, existsSync(join('docs/design-targets/generated/unity-u21-1/screenshots', shot)));

const u211CodeText = requiredFiles.map(read).join('\n');
check('No SaveManager added', !/SaveManager|SaveService|PlayerPrefs/.test(u211CodeText));
check('No RewardManager added', !/RewardManager|RewardService|RewardPersistence|ApplyReward|PersistReward/.test(u211CodeText));
check('No UnlockManager added', !/UnlockManager|StageUnlock|UnlockStage|unlockConfirmed/i.test(u211CodeText));
check('No reward persistence added', !/PersistReward|RewardPersistence|GrantReward|CommitReward/.test(u211CodeText));
check('No stage unlock runtime logic added', !/StageUnlock|UnlockStage|unlockConfirmed/i.test(u211CodeText));
check('No difficulty production calculator added', !/DifficultyController|DifficultyCalculator/.test(u211CodeText));
check('No Addressables', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('No public/assets/sprites reference in U21.1 files', !/public\/assets\/sprites/.test(u211CodeText));
check('productionApproved=0', !/productionApproved\s*=\s*[1-9]/.test(u211CodeText));
check('Resources proof-only maintained', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/Editor', /Resources\/U21_1Proof/));
check('ZenMaruGothic SDF asset exists', existsSync('unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset'));
check('No forbidden term string in U21.1 docs/files', !docs.some((doc) => read(doc).includes('黒曜化')) && !u211CodeText.includes('黒曜化'));

const plan = read(docs[0]);
for (const value of ['Design Gap Analysis / Visual Polish Gate', 'U21 screenshots', 'productionApproved=0', 'U22', 'U23', 'U24']) {
  check(`plan contains ${value}`, plan.includes(value));
}

const gap = read(docs[1]);
for (const value of ['StageSelect entry', 'Stage1 playing', 'LevelUp integrated', '黒耀化 active', 'Readability', 'Premium Feel', 'Decision']) {
  check(`gap contains ${value}`, gap.includes(value));
}

const severity = read(docs[2]);
for (const value of ['Severity', 'Battle / Stage1', 'LevelUp', '黒耀化', '修正フェーズ候補']) {
  check(`severity contains ${value}`, severity.includes(value));
}

const notes = read(docs[3]);
for (const value of ['Battle HUD polish candidates', 'LevelUp card polish candidates', 'SE / haptic polish candidates']) {
  check(`candidate notes contains ${value}`, notes.includes(value));
}

const review = read(docs[4]);
for (const value of ['Scope', 'U21 screenshots / contact sheet review結果', '小さなVisual Polish修正内容', 'productionApproved=0', '実機確認はまだnot executed']) {
  check(`review contains ${value}`, review.includes(value));
}

if (failures.length > 0) {
  console.error('unity U21.1 design gap check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U21.1 design gap check passed: docs=${docs.length}, screenshots=${screenshots.length}, productionApproved=0`);
