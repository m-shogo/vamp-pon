import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');
const json = (path: string) => JSON.parse(read(path));
const hash = (path: string) => createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');
const check = (value: unknown, message: string) => { if (!value) throw new Error(`U48 Batch C capture readiness check failed: ${message}`); };

const audit = json('docs/design-targets/generated/unity-u48/batch-c/capture-readiness-audit.json');
const matrix = json('docs/design-targets/generated/unity-u48/batch-c/capture-matrix.json');
const contracts = json('docs/design-targets/generated/unity-u48/batch-c/generation-contracts.json').contracts;
const pilot = json('docs/design-targets/generated/unity-u48/batch-c/pilot-verification.json');
const screenNames = ['hud', 'levelUp', 'replacement', 'result', 'stageSelect'];
const expectedStateCounts = new Map([['hud', 10], ['levelUp', 9], ['replacement', 15], ['result', 10], ['stageSelect', 12]]);

check(audit.schemaVersion === 3 && audit.batch === 'C' && audit.status === 'READY' && audit.captureReadiness === 'READY' && audit.reviewReady === false, 'schema v3 READY identity');
check(audit.blockedRequiredStates.length === 0, 'no blocked required states');
check(audit.directStateInjectionUsed === false && audit.saveMutationUsed === false && audit.playerPrefsMutationUsed === false, 'no direct state/save/PlayerPrefs mutation');
check(audit.productionProviderChanged === false && audit.unlockRulesChanged === false, 'production and unlock boundaries');
check(audit.knownStageCount === 20 && audit.runtimeImplementedStageCount === 1 && audit.lockedDisplayStageCount === 19, 'StageSelect canonical counts');
check(hash(audit.captureMatrixPath) === audit.captureMatrixSha256, 'capture matrix fingerprint');

for (const screen of screenNames) {
  const readiness = audit.screenReadiness[screen];
  check(readiness.status === 'READY' && readiness.captureReadiness === 'READY', `${screen} READY`);
  check(readiness.requiredStateCount === expectedStateCounts.get(screen) && readiness.states.length === expectedStateCounts.get(screen), `${screen} required state count`);
  for (const state of readiness.states) {
    check(state.reachable === true && state.productionRoute === true && state.directInjection === false && state.layoutFixture === false && state.blockReason === null, `${screen}/${state.state} production reachability`);
    check(typeof state.routeOwner === 'string' && state.routeOwner.length > 0 && typeof state.trigger === 'string' && state.trigger.length > 0, `${screen}/${state.state} ownership`);
  }
}

check(matrix.schemaVersion === 1 && matrix.batch === 'C' && matrix.assetGroupCount === 30 && matrix.candidateCount === 120 && matrix.candidatePerGroup === 4, 'matrix counts');
check(matrix.minimumViewportCaptureCount === 360 && matrix.expectedCaptureCount > matrix.minimumViewportCaptureCount, 'matrix dynamic capture totals');
check(matrix.groups.length === 30 && matrix.groups.every((group: any) => group.candidateIds.length === 4 && group.requiredViewports.join(',') === 'compact,standard,large'), 'matrix group/viewports');
check(new Set(matrix.groups.flatMap((group: any) => group.candidateIds)).size === 120, 'matrix unique candidates');
check(matrix.groups.every((group: any) => group.screenRequiredStates.length === expectedStateCounts.get(group.screen)), 'matrix all-screen required states');
check(matrix.groups.every((group: any) => group.expectedCaptureCountPerCandidate === group.requiredStandardStates.length + 2), 'matrix calculated per-candidate capture counts');
check(matrix.groups.every((group: any) => Array.isArray(group.componentContractStates) && group.componentContractStates.length > 0 && group.requiredStandardStates.join(',') === group.componentContractStates.join(',')), 'component comparison states drive Standard captures');
check(contracts.length === 120 && matrix.groups.every((group: any) => group.candidateIds.every((id: string) => contracts.some((contract: any) => contract.assetGroup === group.assetGroup && contract.candidateId === id))), 'matrix derives candidates from contracts');
check(pilot.schemaVersion === 1 && pilot.status === 'PASS' && pilot.pilotCount === 5 && pilot.results.length === 5, 'five-screen pilot PASS');
check(new Set(pilot.results.map((result: any) => result.screen)).size === 5 && pilot.results.every((result: any) => result.passed && result.cleanupCompleted && result.runtimeContractUnchanged), 'pilot screen/cleanup/runtime contract');
check(pilot.unhandledExceptionCount === 0 && pilot.assertionFailureCount === 0, 'pilot runtime logs clean');

const catalog = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/StageSelect/StageCatalog.cs');
const model = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/StageSelect/StageSelectModel.cs');
const view = read('unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/StageSelectView.cs');
const flow = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/AppFlow/AppFlowCoordinator.cs');
const bridge = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Diagnostics/U48BatchCPreviewCaptureBridge.cs');
check((catalog.match(/Entry\("/g) ?? []).length === 20 && catalog.includes('"forgotten_street", "忘れられた夜道", true, 1, "stage_01"'), 'canonical production catalog');
check(model.includes('StageSelectVisualState.SelectedLocked') && model.includes('StageSelectVisualState.SelectedUnlocked'), 'StageSelect model-owned selection');
check(view.includes('button.onClick.AddListener(() => coordinator.StageSelection.Select(captured))') && view.includes('startButton.interactable = coordinator.StageSelection.CanStartSelected'), 'actual StageSelect buttons');
check(flow.includes('StageStartResultCode.Locked') && flow.includes('StageStartResultCode.NotImplemented') && flow.includes('StageStartResultCode.UnknownStage'), 'StageSelect command guards');
check(bridge.startsWith('#if VAMPPON_U48_ASSET_PREVIEW && VAMPPON_AI_SIMULATOR_SMOKE') && bridge.includes('VAMPPON_U48_BATCH_C_CAPTURE'), 'capture bridge preview isolation');
check(!bridge.includes('BindingFlags') && !bridge.includes('PlayerPrefs.Set') && !bridge.includes('SaveService.Save'), 'capture bridge avoids private/save injection');
for (const path of ['unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Diagnostics/U48AssetPreviewVerificationBridge.cs', 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Diagnostics/U46AiSimulatorSmokeBridge.cs']) check(read(path).includes('VAMPPON_U48_BATCH_C_CAPTURE'), `${path} yields to Batch C capture`);
check(!read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Diagnostics/U47AiSimulatorSmokeBridge.cs').includes('VAMPPON_U48_BATCH_C_CAPTURE'), 'U47 fingerprint source untouched');

console.log(`Unity U48 Batch C capture readiness check passed: schema v3, five screens READY, ${matrix.candidateCount} candidates, ${matrix.minimumViewportCaptureCount} minimum viewport captures, ${matrix.expectedCaptureCount} total expected live captures.`);
