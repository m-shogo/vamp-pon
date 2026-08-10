import { enemyProductionEntries } from './enemyProductionDatabase.ts';
import {
  assetFactorySharedSourceHandoffs,
  weaponGenerationHandoffs,
  type SharedSourceGenerationHandoff,
} from './sharedSourceGenerationHandoff.ts';

export type ReferenceFirstQueuePhase =
  | 'ENEMY_REFERENCE'
  | 'BOSS_REFERENCE'
  | 'WEAPON_REFERENCE'
  | 'ITEM_REFERENCE';

export type ReferenceFirstQueueEntry = {
  queueId: string;
  sequence: number;
  phase: ReferenceFirstQueuePhase;
  handoffId: string;
  sourceCategory: 'enemies' | 'bosses' | 'weapons' | 'items';
  sourceId: string;
  displayName: string;
  candidateCount: 4;
  executionState: 'QUEUED_NOT_GENERATED';
  sourceReadiness: 'READY_FOR_CANDIDATE';
  approval: {
    approvedReferenceDefault: false;
    approvedWebDefault: false;
    approvedUnityDefault: false;
    runtimeApprovedDefault: false;
  };
  gate: {
    humanComparisonRequired: true;
    referenceApprovalRequiredBeforeRuntimeDerivatives: true;
    runtimeDerivativeQueueAllowedNow: false;
    oneShotFinalForbidden: true;
  };
  existingAssetFactoryContractId: string | null;
  outputPathHint: string | null;
};

const enemyById = new Map(enemyProductionEntries.map((entry) => [entry.id, entry]));
const enemyReferenceHandoffs = assetFactorySharedSourceHandoffs.filter((handoff) => handoff.kind === 'enemy-reference-handoff');
const itemReferenceHandoffs = assetFactorySharedSourceHandoffs.filter((handoff) => handoff.kind === 'item-reference-handoff');
const nonBossEnemyReferences = enemyReferenceHandoffs.filter((handoff) => enemyById.get(handoff.sourceId)?.rank !== 'boss');
const bossReferences = enemyReferenceHandoffs.filter((handoff) => enemyById.get(handoff.sourceId)?.rank === 'boss');

function createQueueEntry(
  handoff: SharedSourceGenerationHandoff,
  phase: ReferenceFirstQueuePhase,
  sourceCategory: ReferenceFirstQueueEntry['sourceCategory'],
  sequence: number,
): ReferenceFirstQueueEntry {
  if (handoff.approval.sourceReadiness !== 'READY_FOR_CANDIDATE') throw new Error(`Reference-first queue received blocked handoff: ${handoff.handoffId}`);
  return {
    queueId: `reference-first:${sequence.toString().padStart(4, '0')}:${handoff.handoffId}`,
    sequence,
    phase,
    handoffId: handoff.handoffId,
    sourceCategory,
    sourceId: handoff.sourceId,
    displayName: handoff.displayName,
    candidateCount: 4,
    executionState: 'QUEUED_NOT_GENERATED',
    sourceReadiness: 'READY_FOR_CANDIDATE',
    approval: { approvedReferenceDefault: false, approvedWebDefault: false, approvedUnityDefault: false, runtimeApprovedDefault: false },
    gate: { humanComparisonRequired: true, referenceApprovalRequiredBeforeRuntimeDerivatives: true, runtimeDerivativeQueueAllowedNow: false, oneShotFinalForbidden: true },
    existingAssetFactoryContractId: handoff.existingAssetFactory?.contractId ?? null,
    outputPathHint: handoff.existingAssetFactory?.outputPathHint ?? null,
  };
}

const orderedGroups: ReadonlyArray<{
  phase: ReferenceFirstQueuePhase;
  sourceCategory: ReferenceFirstQueueEntry['sourceCategory'];
  handoffs: readonly SharedSourceGenerationHandoff[];
}> = [
  { phase: 'ENEMY_REFERENCE', sourceCategory: 'enemies', handoffs: nonBossEnemyReferences },
  { phase: 'BOSS_REFERENCE', sourceCategory: 'bosses', handoffs: bossReferences },
  { phase: 'WEAPON_REFERENCE', sourceCategory: 'weapons', handoffs: weaponGenerationHandoffs },
  { phase: 'ITEM_REFERENCE', sourceCategory: 'items', handoffs: itemReferenceHandoffs },
] as const;

let sequence = 1;
const entries: ReferenceFirstQueueEntry[] = [];
for (const group of orderedGroups) {
  for (const handoff of group.handoffs) {
    entries.push(createQueueEntry(handoff, group.phase, group.sourceCategory, sequence));
    sequence += 1;
  }
}

/**
 * Generation queue for the later image-production session.
 * Only reference handoffs are queued. Runtime sprites/icons/attack sheets/effects
 * remain excluded until the corresponding reference is human-approved.
 */
export const referenceFirstBulkGenerationQueue: readonly ReferenceFirstQueueEntry[] = entries;
export const referenceFirstBulkGenerationQueueById = new Map(referenceFirstBulkGenerationQueue.map((entry) => [entry.queueId, entry]));

export const referenceFirstBulkGenerationQueueSummary = {
  totalQueuedReferences: referenceFirstBulkGenerationQueue.length,
  enemyReferences: referenceFirstBulkGenerationQueue.filter((entry) => entry.phase === 'ENEMY_REFERENCE').length,
  bossReferences: referenceFirstBulkGenerationQueue.filter((entry) => entry.phase === 'BOSS_REFERENCE').length,
  weaponReferences: referenceFirstBulkGenerationQueue.filter((entry) => entry.phase === 'WEAPON_REFERENCE').length,
  itemReferences: referenceFirstBulkGenerationQueue.filter((entry) => entry.phase === 'ITEM_REFERENCE').length,
  generatedCandidateCountDefault: 0,
  approvedReferenceCountDefault: 0,
  runtimeDerivativeQueuedCountDefault: 0,
  candidateCountPerReference: 4,
  referenceFirstGateEnabled: true,
  oneShotFinalForbidden: true,
} as const;
