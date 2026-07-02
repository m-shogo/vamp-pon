import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docs = [
  'docs/unity-u25-stage1-production-battle-loop-plan-2026-07-02.md',
  'docs/unity-u25-stage1-production-battle-loop-review-2026-07-02.md',
];
const files = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U25/Stage1Loop/U25Stage1LoopState.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U25/Stage1Loop/U25Stage1RuntimeFlowController.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U25/Stage1Loop/U25Stage1BattleRuntimeAdapter.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U25/Stage1Loop/U25Stage1TransitionPresenter.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U25/Stage1Loop/U25RunResultModel.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U25/Stage1Loop/U25RewardDraftModel.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U25/Stage1Loop/U25StageProgressDraftModel.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U25/Stage1Loop/U25StageProgressProofRepository.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U25/Stage1Loop/U25Stage1FeedbackHooks.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U25Stage1ProductionBattleLoopVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U25Stage1ProductionBattleLoopScreenshotCapture.cs',
];
const screenshots = [
  'stage1-battle-runtime-loop.png',
  'stage1-levelup-runtime.png',
  'stage1-kokuyou-ready-runtime.png',
  'stage1-kokuyou-active-runtime.png',
  'stage1-evolution-runtime.png',
  'stage1-result-runtime.png',
  'stage1-stageselect-progress-runtime.png',
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
for (const shot of screenshots) check(`screenshot exists: ${shot}`, existsSync(join('docs/design-targets/generated/unity-u25/screenshots', shot)));
const runtimeText = walk('unity/VampPonUnity/Assets/_Project/Scripts/U25').map(read).join('\n');
const text = [...docs].map(read).join('\n') + '\n' + runtimeText;
for (const value of ['U22', 'U23', 'U24', 'production-adjacent', 'productionApproved=0']) check(`contains ${value}`, text.includes(value));
check('U25 references U22 proof', text.includes('U22BattleVisualPolishState'));
check('U25 references U23 proof', text.includes('U23LevelUpCardPolishState') && text.includes('U23ResultLedgerPolishState'));
check('U25 references U24 proof', text.includes('U24KokuyouClimaxState') && text.includes('U24ClimaxFeedbackHook'));
check('No generated final image runtime paste', !/top-final|kokuyou-cutin-final|generated\/.*\.png/.test(runtimeText));
check('No productionApproved=1', !/productionApproved\s*=\s*1|ProductionApproved\s*=\s*true/.test(text));
check('save/reward/unlock not final', text.includes('IsPersistenceFinal') && text.includes('IsSaveFinal'));
check('No Addressables', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('ZenMaruGothic SDF asset exists', existsSync('unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset'));
check('No forbidden term string', !text.includes('黒曜化'));
if (failures.length > 0) {
  console.error('unity U25 stage1 production battle loop check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`unity U25 stage1 production battle loop check passed: files=${files.length}, screenshots=${screenshots.length}, productionApproved=0`);
