import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '../..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');
const json = (path: string) => JSON.parse(read(path));
const check = (value: unknown, label: string) => { if (!value) throw new Error(`U48 Replacement interaction check failed: ${label}`); };

const modelPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/ReplacementInteractionModel.cs';
const overlayPath = 'unity/VampPonUnity/Assets/_Project/Scripts/U4/U4LevelUpOverlay.cs';
const controllerPath = 'unity/VampPonUnity/Assets/_Project/Scripts/U4/U4LevelUpDemoController.cs';
const bridgePath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Diagnostics/U47AiSimulatorSmokeBridge.cs';
for (const path of [modelPath, overlayPath, controllerPath, bridgePath, 'docs/design-targets/generated/unity-u48/batch-c/replacement-runtime-baseline-audit.json', 'docs/design-targets/generated/unity-u48/batch-c/replacement-runtime-verification.json']) check(existsSync(resolve(root, path)), `missing ${path}`);

const baseline = json('docs/design-targets/generated/unity-u48/batch-c/replacement-runtime-baseline-audit.json');
check(baseline.auditedSourceHead === 'af40b4c9d0bc96a38a7d4a74a3cdf04a1fa36fdd', 'baseline source head');
check(baseline.currentInteraction.ownedSlotClickImmediatelyReplaces === true && baseline.currentInteraction.selectedSlotStateExists === false && baseline.currentInteraction.confirmActionExists === false, 'baseline records one-step interaction');

const evidence = json('docs/design-targets/generated/unity-u48/batch-c/replacement-runtime-verification.json');
check(evidence.passed === true && evidence.assertionCount >= 30 && evidence.failureCount === 0, 'Editor verification result');
for (const key of ['weapon', 'passive']) {
  const value = evidence[key];
  check(value.initialSelection === null && value.confirmInitiallyDisabled === true && value.inventoryChangedBeforeConfirm === false, `${key} pre-confirm state`);
  check(value.selectedSlotIndex === 1 && value.confirmClicked === true && value.replacementCommitCount === 1, `${key} two-step commit`);
}
check(JSON.stringify(evidence.weapon.inventoryAfter) === JSON.stringify(['night_pencil', 'streetlamp_ring']), 'weapon after');
check(JSON.stringify(evidence.passive.inventoryAfter) === JSON.stringify(['old_ticket', 'travel_badge', 'white_margin']), 'passive after');
check(evidence.cancel.beforeSelection === 'inventory-unchanged' && evidence.cancel.afterSelection === 'inventory-unchanged', 'cancel routes');
check(Object.values(evidence.guards).every(Boolean), 'stale/invalid/duplicate guards');
check(evidence.cleanup.selectionCleared === true && evidence.cleanup.reopenSelectionNull === true && evidence.cleanup.listenerCount === 0, 'cleanup');

const model = read(modelPath);
for (const token of ['ChoosingSlot', 'SlotSelected', 'Committing', 'Completed', 'Cancelled', 'StaleOffer', 'StaleInventory', 'InvalidSlot', 'UnknownOwnedId', 'UnknownIncomingId', 'DuplicateCommit', 'inventorySignature', 'SelectedSlotIndex', 'ConfirmEnabled']) check(model.includes(token), `model token ${token}`);
check(model.includes('Func<int, bool> commit') && model.includes('CommitCount++'), 'single commit boundary');
check(!model.includes('Reflection') && !model.includes('BindingFlags'), 'no reflection injection');

const overlay = read(overlayPath);
check(overlay.includes('ReplacementSlotButton_') && overlay.includes('ReplacementConfirmButton') && overlay.includes('ReplacementCancelButton'), 'actual replacement buttons');
check(overlay.includes('SetInteractable(model.ConfirmEnabled)') && overlay.includes('選択中'), 'disabled confirm and selected row');
const controller = read(controllerPath);
check(controller.includes('ReplacementInteractionModel.TryCreate') && controller.includes('SelectReplacementSlot') && controller.includes('ConfirmReplacement') && controller.includes('CancelReplacement'), 'controller owns interaction commands');
check(controller.includes('gameplay.ReplaceInventorySlot(replacementOffer, slot)') && controller.includes('replacement?.ClearForClose()'), 'existing gameplay commit and close cleanup');

const bridge = read(bridgePath);
check(bridge.includes('ReplacementConfirmButton') && bridge.includes('confirmInitiallyDisabled') && bridge.includes('inventoryUnchangedBeforeConfirm') && bridge.includes('selectedRowVisible'), 'U47 two-step route');
check(!bridge.includes('Add(new WeaponRuntimeState') && !bridge.includes('unknown_') && !bridge.includes('duplicate_'), 'no direct invalid injection');

for (const protectedPath of [
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/State/RunGameplayState.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Definitions/Stage1GameplayDataRegistry.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/RuntimeVisualAssetProvider.cs',
  'docs/design-targets/generated/unity-u48/batch-a',
  'docs/design-targets/generated/unity-u48/batch-b',
]) {
  try { execFileSync('git', ['diff', '--quiet', 'af40b4c9', '--', protectedPath], { cwd: root }); }
  catch { throw new Error(`U48 Replacement interaction check failed: protected path changed ${protectedPath}`); }
}

console.log(`U48 Replacement interaction check passed: ${evidence.assertionCount} Editor assertions, guarded two-step Weapon/Passive commit, cancel and cleanup.`);
