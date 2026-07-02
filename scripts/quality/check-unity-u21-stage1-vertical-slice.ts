import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docs = [
  'docs/unity-u21-stage1-vertical-slice-integration-plan-2026-07-01.md',
  'docs/unity-u21-stage1-vertical-slice-integration-review-2026-07-01.md',
];
const requiredFiles = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U21/VerticalSlice/U21Stage1VerticalSliceState.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U21/VerticalSlice/U21Stage1VerticalSliceController.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U21/VerticalSlice/U21Stage1VerticalSliceRule.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U21/VerticalSlice/U21Stage1VerticalSliceView.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U21/VerticalSlice/U21Stage1VerticalSlicePresenter.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U21Stage1VerticalSliceVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U21Stage1VerticalSliceScreenshotCapture.cs',
];
const screenshots = [
  'u21-stage-select-entry-360x800.png',
  'u21-stage-select-entry-390x844.png',
  'u21-stage-select-entry-430x932.png',
  'u21-stage1-playing-360x800.png',
  'u21-stage1-playing-390x844.png',
  'u21-stage1-playing-430x932.png',
  'u21-levelup-integrated-360x800.png',
  'u21-levelup-integrated-390x844.png',
  'u21-levelup-integrated-430x932.png',
  'u21-rare-integrated-390x844.png',
  'u21-evolution-integrated-390x844.png',
  'u21-kokuyou-ready-390x844.png',
  'u21-kokuyou-active-360x800.png',
  'u21-kokuyou-active-390x844.png',
  'u21-kokuyou-active-430x932.png',
  'u21-clear-result-360x800.png',
  'u21-clear-result-390x844.png',
  'u21-clear-result-430x932.png',
  'u21-fail-result-390x844.png',
  'u21-stage-return-last-result-390x844.png',
  'u21-contact-sheet-flow.png',
  'u21-contact-sheet-risk.png',
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
for (const shot of screenshots) check(`screenshot exists: ${shot}`, existsSync(join('docs/design-targets/generated/unity-u21/screenshots', shot)));

check('No SaveManager added', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U21', /SaveManager|SaveService|PlayerPrefs|File\.WriteAllText|FileStream/));
check('No RewardManager added', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U21', /RewardManager|RewardService|RewardPersistence|ApplyReward|PersistReward/));
check('No UnlockManager added', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U21', /UnlockManager|StageUnlock|UnlockStage|unlockConfirmed/i));
check('No reward persistence added', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U21', /PersistReward|RewardPersistence|GrantReward|CommitReward/));
check('No stage unlock runtime logic added', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U21', /StageUnlock|UnlockStage|unlockConfirmed/i));
check('No difficulty production calculator added', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U21', /DifficultyController|DifficultyCalculator/));
check('No Addressables', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('No public/assets/sprites reference', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U21', /public\/assets\/sprites/));
check('Resources proof-only maintained', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U21', /Resources\.Load.*Production|productionApproved\s*=\s*1/));
check('ZenMaruGothic SDF asset exists', existsSync('unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset'));
check('No forbidden term string', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U21', /黒曜化/) && !filesContain('docs', /U21.*黒曜化/));

const plan = read(docs[0]);
for (const value of ['Vertical Slice Integration', 'U16', 'U17', 'U18', 'U19', 'U20', 'productionApproved=0', 'U22', 'BattleResultSummary', 'StageSelect -> U21 Stage1 -> Result -> StageSelect']) {
  check(`plan contains ${value}`, plan.includes(value));
}

const review = read(docs[1]);
for (const value of [
  'Scope',
  'U20までの残懸念引き継ぎ',
  'Clear path結果',
  'Fail path結果',
  'productionApproved=0',
  'Addressablesを導入していない',
  '実機確認はまだnot executed',
  'U21はVertical Slice Integrationであり、Stage1本番完成ではない',
]) {
  check(`review contains ${value}`, review.includes(value));
}

if (failures.length > 0) {
  console.error('unity U21 stage1 vertical slice check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`unity U21 stage1 vertical slice check passed: scripts=${requiredFiles.length}, screenshots=${screenshots.length}, productionApproved=0`);
