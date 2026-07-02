import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docs = [
  'docs/unity-u22-stage1-battle-hud-playing-visual-polish-plan-2026-07-01.md',
  'docs/unity-u22-library-package-evaluation-2026-07-01.md',
  'docs/unity-u22-stage1-battle-hud-playing-visual-polish-review-2026-07-01.md',
];
const requiredFiles = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U22/BattleVisual/U22BattleVisualPolishState.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U22/BattleVisual/U22BattleVisualPolishConfig.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U22/BattleVisual/U22BattleVisualPolishPresenter.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U22/BattleVisual/U22Stage1PlayingVisualController.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U22/BattleVisual/U22Stage1PlayingVisualView.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U22/BattleVisual/U22BattleHudPolishView.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U22/BattleVisual/U22KokuyouGaugeHudProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U22/BattleVisual/U22PickupReadabilityProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U22/BattleVisual/U22HitFeedbackPolishProof.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U22/BattleVisual/U22ProofLabelPolicy.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U22BattleVisualPolishVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U22BattleVisualPolishScreenshotCapture.cs',
];
const screenshots = [
  'u22-stage1-playing-visual-360x800.png',
  'u22-stage1-playing-visual-390x844.png',
  'u22-stage1-playing-visual-430x932.png',
  'u22-battle-hud-polish-360x800.png',
  'u22-battle-hud-polish-390x844.png',
  'u22-battle-hud-polish-430x932.png',
  'u22-player-enemy-attack-visual-390x844.png',
  'u22-pickup-readability-390x844.png',
  'u22-hit-feedback-390x844.png',
  'u22-ink-burst-lantern-pulse-390x844.png',
  'u22-kokuyou-ready-hud-390x844.png',
  'u22-kokuyou-active-battle-390x844.png',
  'u22-before-after-u21-vs-u22-390x844.png',
  'u22-contact-sheet-battle-polish.png',
  'u22-contact-sheet-mobile-risk.png',
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
for (const shot of screenshots) check(`screenshot exists: ${shot}`, existsSync(join('docs/design-targets/generated/unity-u22/screenshots', shot)));

const u22CodeText = requiredFiles.map(read).join('\n');
check('No SaveManager added', !/SaveManager|SaveService|PlayerPrefs/.test(u22CodeText));
check('No RewardManager added', !/RewardManager|RewardService|RewardPersistence|ApplyReward|PersistReward/.test(u22CodeText));
check('No UnlockManager added', !/UnlockManager|StageUnlock|UnlockStage|unlockConfirmed/i.test(u22CodeText));
check('No reward persistence added', !/PersistReward|RewardPersistence|GrantReward|CommitReward/.test(u22CodeText));
check('No stage unlock runtime logic added', !/StageUnlock|UnlockStage|unlockConfirmed/i.test(u22CodeText));
check('No difficulty production calculator added', !/DifficultyController|DifficultyCalculator/.test(u22CodeText));
check('No Addressables', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('No public/assets/sprites reference', !/public\/assets\/sprites/.test(u22CodeText));
check('productionApproved=0', !/productionApproved\s*=\s*[1-9]/.test(u22CodeText) && docs.every((doc) => !/productionApproved\s*=\s*[1-9]/.test(read(doc))));
check('Resources proof-only maintained', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U22', /Resources\.Load.*Production|productionApproved\s*=\s*1/));
check('ZenMaruGothic SDF asset exists', existsSync('unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset'));
check('No forbidden term string', !u22CodeText.includes('黒曜化') && docs.every((doc) => !read(doc).includes('黒曜化')));

const manifest = read('unity/VampPonUnity/Packages/manifest.json');
const lock = read('unity/VampPonUnity/Packages/packages-lock.json');
const libraryDoc = read(docs[1]);
check('No Addressables package', !manifest.includes('addressables') && !lock.includes('addressables'));
check('Cinemachine not added and documented', !manifest.includes('cinemachine') && libraryDoc.includes('Cinemachine') && libraryDoc.includes('導入しない'));
check('Input System documented as existing', manifest.includes('com.unity.inputsystem') && libraryDoc.includes('すでに導入済み'));
check('No undocumented package manifest change', libraryDoc.includes('manifest / package-lock差分なし'));
check('No undocumented package-lock change', libraryDoc.includes('manifest / package-lock差分なし'));

const plan = read(docs[0]);
for (const value of ['Battle Visual Polish Proof', 'Severity S', '仕様説明リスト', 'productionApproved=0', 'U23', 'U24']) {
  check(`plan contains ${value}`, plan.includes(value));
}

const review = read(docs[2]);
for (const value of [
  'Scope',
  'U21.1までの残懸念引き継ぎ',
  'Library / package evaluation結果',
  '新規package導入なし',
  'Stage1 playing visual polish結果',
  'Battle HUD polish結果',
  'Pickup / Drop readability polish結果',
  'Hit feedback / ink burst / lantern pulse結果',
  'productionApproved=0',
  '実機確認はまだnot executed',
]) {
  check(`review contains ${value}`, review.includes(value));
}

if (failures.length > 0) {
  console.error('unity U22 battle visual polish check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U22 battle visual polish check passed: scripts=${requiredFiles.length}, screenshots=${screenshots.length}, productionApproved=0`);
