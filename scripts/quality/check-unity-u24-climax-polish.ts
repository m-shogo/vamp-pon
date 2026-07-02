import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docs = [
  'docs/unity-u24-kokuyou-rare-evolution-climax-polish-plan-2026-07-01.md',
  'docs/unity-u24-kokuyou-climax-visual-target-alignment-2026-07-01.md',
  'docs/unity-u24-kokuyou-rare-evolution-climax-polish-review-2026-07-01.md',
  'docs/unity-u24-climax-se-haptic-camera-hook-design-2026-07-01.md',
];
const files = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U24/ClimaxPolish/U24KokuyouClimaxView.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U24/ClimaxPolish/U24RarePresentationPolishView.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U24/ClimaxPolish/U24EvolutionClimaxView.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U24/ClimaxPolish/U24ClimaxFeedbackHook.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U24KokuyouRareEvolutionClimaxVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U24KokuyouRareEvolutionClimaxScreenshotCapture.cs',
];
const screenshots = [
  'u24-kokuyou-ready-360x800.png',
  'u24-kokuyou-ready-390x844.png',
  'u24-kokuyou-ready-430x932.png',
  'u24-kokuyou-activation-cutin-390x844.png',
  'u24-kokuyou-active-360x800.png',
  'u24-kokuyou-active-390x844.png',
  'u24-kokuyou-active-430x932.png',
  'u24-kokuyou-ending-390x844.png',
  'u24-rare-presentation-390x844.png',
  'u24-rare-seal-pulse-390x844.png',
  'u24-evolution-converge-390x844.png',
  'u24-evolution-complete-390x844.png',
  'u24-before-after-u22-vs-u24-kokuyou-390x844.png',
  'u24-before-after-u23-vs-u24-rare-390x844.png',
  'u24-before-after-u23-vs-u24-evolution-390x844.png',
  'u24-visual-target-alignment-kokuyou-contact-sheet.png',
  'u24-contact-sheet-climax-polish.png',
  'u24-contact-sheet-mobile-risk.png',
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
for (const shot of screenshots) check(`screenshot exists: ${shot}`, existsSync(join('docs/design-targets/generated/unity-u24/screenshots', shot)));

const u24Text = [...docs, ...walk('unity/VampPonUnity/Assets/_Project/Scripts/U24')].map(read).join('\n');
check('No SaveManager added', !/SaveManager|SaveService|PlayerPrefs/.test(u24Text));
check('No RewardManager added', !/RewardManager|RewardService|RewardPersistence|ApplyReward|PersistReward/.test(u24Text));
check('No UnlockManager added', !/UnlockManager|StageUnlock|UnlockStage|unlockConfirmed/i.test(u24Text));
check('No reward persistence added', !/PersistReward|RewardPersistence|GrantReward|CommitReward/.test(u24Text));
check('No stage unlock runtime logic added', !/StageUnlock|UnlockStage|unlockConfirmed/i.test(u24Text));
check('No difficulty production calculator added', !/DifficultyController|DifficultyCalculator/.test(u24Text));
check('No Addressables', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('No public/assets/sprites', !/public\/assets\/sprites/.test(u24Text));
check('productionApproved=0', !/productionApproved\s*=\s*[1-9]/.test(u24Text));
check('Resources proof-only maintained', !filesContain('unity/VampPonUnity/Assets/_Project/Scripts/U24', /Resources\.Load.*Production|productionApproved\s*=\s*1/));
check('ZenMaruGothic SDF asset exists', existsSync('unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset'));
check('No forbidden term string', !u24Text.includes('黒曜化'));

const libraryDoc = read('docs/unity-u22-library-package-evaluation-2026-07-01.md');
check('No undocumented package manifest change', libraryDoc.includes('manifest / package-lock差分なし'));
check('No undocumented package-lock change', libraryDoc.includes('manifest / package-lock差分なし'));

for (const value of ['Climax Polish Proof', 'kokuyou-cutin-final.png', 'productionApproved=0', 'kokuyou_activate_cutin']) {
  check(`U24 text contains ${value}`, u24Text.includes(value));
}

if (failures.length > 0) {
  console.error('unity U24 climax polish check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`unity U24 climax polish check passed: files=${files.length}, screenshots=${screenshots.length}, productionApproved=0`);
