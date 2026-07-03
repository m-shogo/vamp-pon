import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docs = [
  'docs/unity-u26-stage1-first-playable-balance-plan-2026-07-02.md',
  'docs/unity-u26-stage1-first-playable-balance-draft-2026-07-02.md',
  'docs/unity-u26-stage1-first-playable-balance-review-2026-07-02.md',
];
const files = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U26/FirstPlayableBalance/U26Stage1BalanceConstants.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U26/FirstPlayableBalance/U26Stage1WaveDraft.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U26/FirstPlayableBalance/U26Stage1XpDraft.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U26/FirstPlayableBalance/U26Stage1DropDraft.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U26/FirstPlayableBalance/U26Stage1WeaponPassiveDraft.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U26/FirstPlayableBalance/U26Stage1FirstPlayableBalanceState.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U26/FirstPlayableBalance/U26Stage1BalanceSimulator.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U26Stage1FirstPlayableBalanceVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U26Stage1FirstPlayableBalanceScreenshotCapture.cs',
];
const screenshots = [
  'stage1-0000-opening-balance.png',
  'stage1-0030-first-levelup-balance.png',
  'stage1-0200-multi-choice-balance.png',
  'stage1-0400-wave-intensity-balance.png',
  'stage1-0600-kokuyou-ready-balance.png',
  'stage1-0730-clear-push-balance.png',
  'stage1-result-balance.png',
];
function check(label: string, ok: boolean) { if (!ok) failures.push(label); }
function read(path: string) { return existsSync(path) ? readFileSync(path, 'utf8') : ''; }
function walk(root: string): string[] {
  if (!existsSync(root)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(root)) {
    const path = join(root, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) out.push(...walk(path));
    if (stat.isFile()) out.push(path);
  }
  return out;
}

for (const doc of docs) check(`doc exists: ${doc}`, existsSync(doc));
for (const file of files) check(`required file exists: ${file}`, existsSync(file));
for (const shot of screenshots) check(`screenshot exists: ${shot}`, existsSync(join('docs/design-targets/generated/unity-u26/screenshots', shot)));
const runtimeText = walk('unity/VampPonUnity/Assets/_Project/Scripts/U26').map(read).join('\n');
const text = docs.map(read).join('\n') + '\n' + runtimeText;
for (const value of [
  'U25',
  'productionApproved=0',
  'first 30 seconds',
  'wave',
  'XP',
  'drop',
  'pickup',
  'weapon',
  'passive',
  'Kokuyou',
  'evolution',
  'clear',
  'defeat',
  'result',
]) check(`contains ${value}`, text.includes(value));
check('U26 references U25 loop', runtimeText.includes('U25Stage1LoopState'));
check('Stage clear is 480 seconds', runtimeText.includes('StageClearSeconds = 480'));
check('First LevelUp target is 30 seconds', runtimeText.includes('FirstLevelUpTargetSeconds = 30'));
check('Kokuyou ready target exists', /KokuyouReadySeconds = (360|330)/.test(runtimeText));
check('No generated final image runtime paste', !/top-final|kokuyou-cutin-final|generated\/.*\.png/.test(runtimeText));
check('No productionApproved=1', !/productionApproved\s*=\s*1|ProductionApproved\s*=\s*true/.test(text));
check('No Addressables', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('No forbidden term string', !text.includes('黒曜化'));
if (failures.length > 0) {
  console.error('unity U26 stage1 first playable balance check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`unity U26 stage1 first playable balance check passed: files=${files.length}, screenshots=${screenshots.length}, productionApproved=0`);
