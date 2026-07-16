import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');
const check = (value: unknown, message: string) => {
  if (!value) throw new Error(`U48 Batch C capture readiness check failed: ${message}`);
};

const audit = JSON.parse(read('docs/design-targets/generated/unity-u48/batch-c/capture-readiness-audit.json'));
const stageSelect = read('unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/StageSelectView.cs');
const save = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Save/GameSaveSnapshot.cs');
const flow = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/AppFlow/AppFlowCoordinator.cs');
const preview = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Diagnostics/U48AssetPreviewVerificationBridge.cs');
const u45 = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Diagnostics/U45AiSimulatorSmokeBridge.cs');
const u46 = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Diagnostics/U46AiSimulatorSmokeBridge.cs');
const u47 = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Diagnostics/U47AiSimulatorSmokeBridge.cs');

check(audit.schemaVersion === 1 && audit.batch === 'C', 'audit identity');
check(audit.status === 'BLOCKED' && audit.reviewReady === false, 'blocked status is explicit');
check(audit.productionRuntimeChanged === false && audit.unlockRulesChanged === false && audit.directStateInjectionUsed === false, 'production and state-injection isolation');
check(audit.blockedRequiredStates.join(',') === 'locked,selected,disabled,long-title,maximum-metadata', 'complete StageSelect blocked-state list');
check(audit.reproducibleRequiredStates.join(',') === 'initial-open,unlocked,button-default,pressed', 'actual reproducible StageSelect state list');

check((stageSelect.match(/Stage1Card/g) ?? []).length === 1, 'production StageSelect exposes one stage card only');
check(stageSelect.includes('StartStageButton') && stageSelect.includes('StartStage("stage_01")'), 'actual Stage 1 start interaction exists');
check(!stageSelect.includes('Stage2Card') && !stageSelect.includes('interactable = false'), 'locked/disabled runtime control is absent');
check(save.includes('unlockedStageIds = new List<string> { "stage_01" }'), 'default save unlock set remains Stage 1 only');
check(!flow.includes('unlockedStageIds.Contains(command.TargetId)'), 'start command has no unlock-gated disabled route');

for (const [name, source] of [['generic-preview', preview], ['U45', u45], ['U46', u46], ['U47', u47]]) {
  check(source.includes('VAMPPON_U48_BATCH_C_CAPTURE'), `${name} bridge yields to the isolated Batch C capture route`);
}

console.log('Unity U48 Batch C capture readiness check passed: verification bridges are isolated and the missing production StageSelect locked/selected/disabled route is recorded as a hard review-ready blocker without state injection.');
