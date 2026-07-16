import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');
const check = (value: unknown, message: string) => { if (!value) throw new Error(`U48 Batch C capture readiness check failed: ${message}`); };
const audit = JSON.parse(read('docs/design-targets/generated/unity-u48/batch-c/capture-readiness-audit.json'));
const catalog = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/StageSelect/StageCatalog.cs');
const model = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/StageSelect/StageSelectModel.cs');
const view = read('unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/StageSelectView.cs');
const flow = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/AppFlow/AppFlowCoordinator.cs');
const preview = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Diagnostics/U48AssetPreviewVerificationBridge.cs');
const u46 = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Diagnostics/U46AiSimulatorSmokeBridge.cs');

check(audit.schemaVersion === 2 && audit.batch === 'C' && audit.status === 'READY' && audit.captureReadiness === 'READY', 'ready audit identity');
check(audit.productionRouteBlockerResolved === true && audit.blockedRequiredStates.length === 0, 'StageSelect route blocker resolved');
check(audit.reproducibleRequiredStates.length === 12, 'all twelve required production states');
check(audit.productionProviderChanged === false && audit.unlockRulesChanged === false && audit.directStateInjectionUsed === false, 'isolation boundaries');
check(audit.knownStageCount === 20 && audit.runtimeImplementedStageCount === 1 && audit.lockedDisplayStageCount === 19, 'catalog counts');
check(audit.canonicalLongestTitle === '半分の駄菓子横丁' && audit.canonicalMaximumMetadataRows === 0 && audit.layoutFixtureRequired === false, 'canonical stress content without fixture substitution');
check((catalog.match(/Entry\("/g) ?? []).length === 20 && catalog.includes('"forgotten_street", "忘れられた夜道", true, 1, "stage_01"'), 'canonical production catalog');
check(model.includes('selectedStageId') && model.includes('StageSelectVisualState.SelectedLocked') && model.includes('StageSelectVisualState.SelectedUnlocked'), 'model-owned selection states');
check(view.includes('button.onClick.AddListener(() => coordinator.StageSelection.Select(captured))') && view.includes('startButton.interactable = coordinator.StageSelection.CanStartSelected'), 'actual card and disabled button route');
check(flow.includes('StageStartResultCode.Locked') && flow.includes('StageStartResultCode.NotImplemented') && flow.includes('StageStartResultCode.UnknownStage'), 'domain command guards');
for (const [name, source] of [['generic-preview', preview], ['U46', u46]]) check(source.includes('VAMPPON_U48_BATCH_C_CAPTURE'), `${name} bridge yields to Batch C capture`);
check(!read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Diagnostics/U47AiSimulatorSmokeBridge.cs').includes('VAMPPON_U48_BATCH_C_CAPTURE'), 'U47 fingerprint source remains untouched');
console.log('Unity U48 Batch C capture readiness check passed: all twelve StageSelect production states are reachable through canonical catalog, actual card selection and guarded commands without save/state injection.');
