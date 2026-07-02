import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docs = [
  'docs/unity-u27-save-reward-unlock-integration-plan-2026-07-02.md',
  'docs/unity-u27-save-reward-unlock-integration-review-2026-07-02.md',
];
const files = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U27/SaveRewardUnlock/U27SaveVersion.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U27/SaveRewardUnlock/U27SaveDataModel.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U27/SaveRewardUnlock/U27StageProgressModel.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U27/SaveRewardUnlock/U27StageResultRecord.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U27/SaveRewardUnlock/IU27StageProgressRepository.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U27/SaveRewardUnlock/U27StageProgressRepositoryBase.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U27/SaveRewardUnlock/U27PlayerPrefsStageProgressRepository.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U27/SaveRewardUnlock/U27InMemorySaveRepositoryForEditor.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U27/SaveRewardUnlock/U27RewardCalculator.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U27/SaveRewardUnlock/U27RewardDraft.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U27/SaveRewardUnlock/U27UnlockDraftResolver.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U27/SaveRewardUnlock/U27UnlockDraftModel.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U27/SaveRewardUnlock/U27SaveRewardUnlockIntegrator.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U27/SaveRewardUnlock/U27ResultIntegrationModel.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U27/SaveRewardUnlock/U27StageSelectIntegrationModel.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U27/SaveRewardUnlock/U27RetryFlowModel.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U27SaveRewardUnlockIntegrationVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U27SaveRewardUnlockIntegrationScreenshotCapture.cs',
];
const screenshots = [
  'result-clear-reward-unlock.png',
  'result-defeat-participation-reward.png',
  'result-best-updated-stamp.png',
  'stageselect-stage1-cleared-progress.png',
  'stageselect-stage2-placeholder-unlock.png',
  'retry-flow-after-result.png',
  'save-reset-debug-proof.png',
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
for (const shot of screenshots) check(`screenshot exists: ${shot}`, existsSync(join('docs/design-targets/generated/unity-u27/screenshots', shot)));
const u27Files = walk('unity/VampPonUnity/Assets/_Project/Scripts/U27');
const runtimeText = u27Files.map(read).join('\n');
const text = docs.map(read).join('\n') + '\n' + runtimeText;
for (const value of [
  'version',
  'Version',
  'repository',
  'UpdateAfterRun',
  'MarkStageCleared',
  'GetStageProgress',
  'GetLastResult',
  'GetUnlockedRewards',
  'corrupted data fallback',
  'RewardDraft',
  'UnlockDraft',
  'Result',
  'StageSelect',
  'Retry',
  'ResetProofDebug',
  'Cloud Save',
  'economy',
  'productionApproved=0',
]) check(`contains ${value}`, text.includes(value));
check('save model has version', read('unity/VampPonUnity/Assets/_Project/Scripts/U27/SaveRewardUnlock/U27SaveDataModel.cs').includes('Version'));
check('stage progress has required fields', /StageId[\s\S]*IsUnlocked[\s\S]*IsCleared[\s\S]*BestClearTime[\s\S]*BestLevel[\s\S]*BestKillCount[\s\S]*BestCollectedCount[\s\S]*BestRank[\s\S]*LastResult[\s\S]*TotalAttempts[\s\S]*TotalClears[\s\S]*FirstClearAtIso[\s\S]*LastPlayedAtIso[\s\S]*UnlockedRewardIds[\s\S]*UnlockedKnowledgeIds[\s\S]*Version/.test(read('unity/VampPonUnity/Assets/_Project/Scripts/U27/SaveRewardUnlock/U27StageProgressModel.cs')));
const playerPrefsFiles = u27Files.filter((file) => read(file).includes('PlayerPrefs'));
check('PlayerPrefs calls are repository-contained', playerPrefsFiles.length === 1 && playerPrefsFiles[0].endsWith('U27PlayerPrefsStageProgressRepository.cs'));
check('No generated final image runtime paste', !/top-final|kokuyou-cutin-final|generated\/.*\.png/.test(runtimeText));
check('No productionApproved=1 in U27', !/productionApproved\s*=\s*1|ProductionApproved\s*=\s*true/.test(text));
check('No Addressables', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('Cloud Save not completed', !/Cloud Save.*complete|CloudSave.*Complete|encrypted save.*complete/i.test(text));
check('Economy not final', !/IsEconomyFinal\s*=\s*true|正式経済バランス確定/.test(runtimeText));
check('No forbidden term string', !text.includes('黒曜化'));
if (failures.length > 0) {
  console.error('unity U27 save reward unlock integration check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`unity U27 save reward unlock integration check passed: files=${files.length}, screenshots=${screenshots.length}, productionApproved=0`);
