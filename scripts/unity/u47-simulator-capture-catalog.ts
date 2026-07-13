import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type U47CaptureDefinition = {
  captureId: string;
  baseRouteId: string;
  captureKind: 'state' | 'viewport-variant';
  expectedStateId: string;
  viewport: { sizeKey: 'compact' | 'standard' | 'large'; width: number; height: number };
  requiredAssertions: string[];
};

const standard = { sizeKey: 'standard', width: 390, height: 844 } as const;
const capture = (
  captureId: string,
  baseRouteId: string,
  requiredAssertions: string[],
  expectedStateId = captureId,
): U47CaptureDefinition => ({ captureId, baseRouteId, captureKind: 'state', expectedStateId, viewport: standard, requiredAssertions });

// Exact ordered stems from the canonical U47 23-screenshot evidence list.
export const u47SimulatorCaptures: readonly U47CaptureDefinition[] = [
  capture('01-stage-select', 'stage-select', ['stageSelectVisible', 'verificationControlAbsent']),
  capture('02-initial-night-pencil', 'stage1-gameplay', ['stage1Playing', 'initialWeaponNightPencil', 'productionCapacity']),
  capture('03-levelup-actual-choices', 'levelup', ['registryDrivenChoices', 'threeDistinctChoices', 'levelUpModalVisible']),
  capture('04-inventory-weapon-passive', 'inventory', ['weaponVisible', 'passiveVisible', 'inventoryHudMatchesState']),
  capture('05-inventory-full', 'inventory', ['weaponInventoryFull', 'distinctRegisteredIds', 'capacityUnchanged']),
  capture('06-levelup-decline', 'levelup', ['replacementOfferVisible', 'declineCommandApplied', 'inventoryUnchanged']),
  capture('07-levelup-replacement', 'levelup', ['replacementUiVisible', 'registryDisplayNames', 'actualUiButtonClick']),
  capture('08-black-ink-area', 'ground-area', ['blackInkDotExecutor', 'actorVisible', 'damageTicksApplied', 'inventoryUnchanged']),
  capture('09-streetlamp-area', 'ground-area', ['streetlampDotExecutor', 'actorVisible', 'damageTicksApplied', 'inventoryUnchanged']),
  capture('10-fusion-ready', 'evolution', ['fusionRequirementsMet', 'invalidFusionPreviouslyBlocked']),
  capture('11-dawn-ink-lamp', 'ground-area', ['validFusionApplied', 'dawnInkDotExecutor', 'actorVisible', 'damageTicksApplied']),
  capture('12-name-tag-owned', 'rare-item', ['nameTagAcquired', 'rareInventoryVisible', 'rareHasNoLevel']),
  capture('13-unforgotten-name', 'evolution', ['validAwakeningApplied', 'nameTagConsumed', 'unforgottenNameRuntime']),
  capture('14-dawn-ticket-owned', 'rare-item', ['dawnTicketAcquired', 'rareInventoryVisible', 'rareHasNoLevel']),
  capture('15-revival-30-percent', 'dawn-ticket-revival', ['revivalTriggered', 'gameOverSuppressed', 'hpThirtyPercent', 'ticketConsumed', 'secondRevivalPrevented']),
  capture('16-kokuyou-charging', 'kokuyou', ['damageChargesGauge', 'kokuyouCharging', 'inventoryHudPreserved']),
  capture('17-kokuyou-ready', 'kokuyou', ['kokuyouReady', 'manualActivationRequired', 'inventoryHudPreserved']),
  capture('18-kokuyou-active', 'kokuyou', ['manualActivationApplied', 'activeDamageMultiplier', 'inventoryHudPreserved']),
  capture('19-kokuyou-recovery', 'kokuyou', ['recoverySlowApplied', 'inventoryHudPreserved']),
  capture('20-result-u47-summary', 'result', ['resultSnapshotBuilt', 'resultViewModelBuilt', 'registryDisplayNames', 'finalInventoryMatches']),
  capture('21-retry-reset', 'retry', ['retryBoundaryExecuted', 'runStateReset', 'productionCapacityRestored']),
  { captureId: '22-compact-gameplay', baseRouteId: 'stage1-gameplay', captureKind: 'viewport-variant', expectedStateId: 'stage1-playing', viewport: { sizeKey: 'compact', width: 360, height: 800 }, requiredAssertions: ['gameplayVisible', 'safeAreaValid', 'candidateCrystalWithinBounds'] },
  { captureId: '23-large-gameplay', baseRouteId: 'stage1-gameplay', captureKind: 'viewport-variant', expectedStateId: 'stage1-playing', viewport: { sizeKey: 'large', width: 430, height: 932 }, requiredAssertions: ['gameplayVisible', 'safeAreaValid', 'candidateCrystalWithinBounds'] },
] as const;

export const u47SimulatorCaptureCatalogHash = createHash('sha256')
  .update(JSON.stringify(u47SimulatorCaptures))
  .digest('hex');

export function writeU47SimulatorCaptureCatalog(root: string): void {
  const value = `${JSON.stringify({ schemaVersion: 2, expectedCaptureCount: 23, semanticRouteCount: new Set(u47SimulatorCaptures.map(value => value.baseRouteId)).size, catalogHash: u47SimulatorCaptureCatalogHash, captures: u47SimulatorCaptures }, null, 2)}\n`;
  for (const output of [
    resolve(root, 'data/unity/u47-simulator-route-catalog.json'),
    resolve(root, 'unity/VampPonUnity/Assets/_Project/Resources/GameplayData/U47SimulatorRouteCatalog.json'),
  ]) {
    mkdirSync(resolve(output, '..'), { recursive: true });
    writeFileSync(output, value);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  const root = resolve(import.meta.dirname, '../..');
  writeU47SimulatorCaptureCatalog(root);
  console.log(`U47 Simulator capture catalog written: 23 captures, ${u47SimulatorCaptureCatalogHash}`);
}
