import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docs = [
  'docs/unity-u23-levelup-result-stageselect-visual-polish-plan-2026-07-01.md',
  'docs/unity-u23-visual-target-alignment-2026-07-01.md',
  'docs/unity-u23-levelup-result-stageselect-visual-polish-review-2026-07-01.md',
];
const files = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U23/VisualPolish/U23LevelUpCardPolishView.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U23/VisualPolish/U23ResultLedgerPolishView.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U23/VisualPolish/U23StageSelectMapPolishView.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U23LevelUpResultStageSelectPolishVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U23LevelUpResultStageSelectPolishScreenshotCapture.cs',
];
const screenshots = [
  'u23-levelup-polish-360x800.png',
  'u23-levelup-polish-390x844.png',
  'u23-levelup-polish-430x932.png',
  'u23-result-clear-polish-360x800.png',
  'u23-result-clear-polish-390x844.png',
  'u23-result-clear-polish-430x932.png',
  'u23-result-fail-polish-390x844.png',
  'u23-stageselect-polish-360x800.png',
  'u23-stageselect-polish-390x844.png',
  'u23-stageselect-polish-430x932.png',
  'u23-stage-return-polish-390x844.png',
  'u23-before-after-u22-vs-u23-levelup-390x844.png',
  'u23-before-after-u22-vs-u23-result-390x844.png',
  'u23-before-after-u22-vs-u23-stageselect-390x844.png',
  'u23-visual-target-alignment-contact-sheet.png',
  'u23-contact-sheet-ui-polish.png',
  'u23-contact-sheet-mobile-risk.png',
];

function check(label: string, ok: boolean) { if (!ok) failures.push(label); }
function read(path: string) { return existsSync(path) ? readFileSync(path, 'utf8') : ''; }
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
for (const file of files) check(`required file exists: ${file}`, existsSync(file));
for (const shot of screenshots) check(`screenshot exists: ${shot}`, existsSync(join('docs/design-targets/generated/unity-u23/screenshots', shot)));

const u23Text = [...docs, ...walk('unity/VampPonUnity/Assets/_Project/Scripts/U23')].map(read).join('\n');
check('No SaveManager added', !/SaveManager|SaveService|PlayerPrefs/.test(u23Text));
check('No RewardManager added', !/RewardManager|RewardService|RewardPersistence|ApplyReward|PersistReward/.test(u23Text));
check('No UnlockManager added', !/UnlockManager|StageUnlock|UnlockStage|unlockConfirmed/i.test(u23Text));
check('No reward persistence added', !/PersistReward|RewardPersistence|GrantReward|CommitReward/.test(u23Text));
check('No stage unlock runtime logic added', !/StageUnlock|UnlockStage|unlockConfirmed/i.test(u23Text));
check('No difficulty production calculator added', !/DifficultyController|DifficultyCalculator/.test(u23Text));
check('No Addressables', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('No public/assets/sprites', !/public\/assets\/sprites/.test(u23Text));
check('productionApproved=0', !/productionApproved\s*=\s*[1-9]/.test(u23Text));
check('Resources proof-only maintained', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U23', /Resources\.Load.*Production|productionApproved\s*=\s*1/));
check('ZenMaruGothic SDF asset exists', existsSync('unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset'));
check('No forbidden term string', !u23Text.includes('黒曜化'));

const libraryDoc = read('docs/unity-u22-library-package-evaluation-2026-07-01.md');
check('No undocumented package manifest change', libraryDoc.includes('manifest / package-lock差分なし'));
check('No undocumented package-lock change', libraryDoc.includes('manifest / package-lock差分なし'));

for (const value of ['Visual Polish Proof', 'final画像をそのままruntimeへ貼らない', 'productionApproved=0']) {
  check(`plan/review contains ${value}`, u23Text.includes(value));
}

if (failures.length > 0) {
  console.error('unity U23 UI visual polish check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`unity U23 UI visual polish check passed: files=${files.length}, screenshots=${screenshots.length}, productionApproved=0`);
