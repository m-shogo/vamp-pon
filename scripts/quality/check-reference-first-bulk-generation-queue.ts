import { enemyProductionEntries } from '../../src/game/data/enemyProductionDatabase.ts';
import {
  referenceFirstBulkGenerationQueue,
  referenceFirstBulkGenerationQueueSummary,
} from '../../src/game/data/referenceFirstBulkGenerationQueue.ts';
import {
  assetFactorySharedSourceHandoffs,
  weaponGenerationHandoffs,
} from '../../src/game/data/sharedSourceGenerationHandoff.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[Reference First Bulk Generation Queue] ${message}`);
}

const enemyReferenceHandoffs = assetFactorySharedSourceHandoffs.filter((handoff) => handoff.kind === 'enemy-reference-handoff');
const itemReferenceHandoffs = assetFactorySharedSourceHandoffs.filter((handoff) => handoff.kind === 'item-reference-handoff');
const bossIds = new Set(enemyProductionEntries.filter((entry) => entry.rank === 'boss').map((entry) => entry.id));
const expectedBossReferences = enemyReferenceHandoffs.filter((handoff) => bossIds.has(handoff.sourceId)).length;
const expectedEnemyReferences = enemyReferenceHandoffs.length - expectedBossReferences;
const expectedTotal = expectedEnemyReferences + expectedBossReferences + weaponGenerationHandoffs.length + itemReferenceHandoffs.length;

assert(referenceFirstBulkGenerationQueue.length === expectedTotal, `queue coverage drift: ${referenceFirstBulkGenerationQueue.length}/${expectedTotal}`);
assert(new Set(referenceFirstBulkGenerationQueue.map((entry) => entry.queueId)).size === referenceFirstBulkGenerationQueue.length, 'duplicate queue ID');
assert(new Set(referenceFirstBulkGenerationQueue.map((entry) => entry.handoffId)).size === referenceFirstBulkGenerationQueue.length, 'duplicate handoff in queue');
assert(referenceFirstBulkGenerationQueueSummary.enemyReferences === expectedEnemyReferences, 'non-boss Enemy reference count drift');
assert(referenceFirstBulkGenerationQueueSummary.bossReferences === expectedBossReferences, 'Boss reference count drift');
assert(referenceFirstBulkGenerationQueueSummary.weaponReferences === weaponGenerationHandoffs.length, 'Weapon reference count drift');
assert(referenceFirstBulkGenerationQueueSummary.itemReferences === itemReferenceHandoffs.length, 'Item reference count drift');
assert(referenceFirstBulkGenerationQueueSummary.totalQueuedReferences === expectedTotal, 'queue summary total drift');
assert(referenceFirstBulkGenerationQueueSummary.generatedCandidateCountDefault === 0, 'candidate generation inferred');
assert(referenceFirstBulkGenerationQueueSummary.approvedReferenceCountDefault === 0, 'reference approval inferred');
assert(referenceFirstBulkGenerationQueueSummary.runtimeDerivativeQueuedCountDefault === 0, 'runtime derivative queue inferred');
assert(referenceFirstBulkGenerationQueueSummary.candidateCountPerReference === 4, 'candidate count per reference drift');
assert(referenceFirstBulkGenerationQueueSummary.referenceFirstGateEnabled === true, 'reference-first gate disabled');
assert(referenceFirstBulkGenerationQueueSummary.oneShotFinalForbidden === true, 'one-shot final gate disabled');

const phaseOrder = ['ENEMY_REFERENCE', 'BOSS_REFERENCE', 'WEAPON_REFERENCE', 'ITEM_REFERENCE'];
let previousPhaseIndex = -1;
for (const [index, entry] of referenceFirstBulkGenerationQueue.entries()) {
  assert(entry.sequence === index + 1, `${entry.queueId}: sequence drift`);
  const phaseIndex = phaseOrder.indexOf(entry.phase);
  assert(phaseIndex >= previousPhaseIndex, `${entry.queueId}: phase ordering drift`);
  previousPhaseIndex = phaseIndex;
  assert(entry.candidateCount === 4, `${entry.queueId}: candidate count drift`);
  assert(entry.executionState === 'QUEUED_NOT_GENERATED', `${entry.queueId}: generation state inferred`);
  assert(entry.sourceReadiness === 'READY_FOR_CANDIDATE', `${entry.queueId}: blocked source leaked into queue`);
  assert(entry.approval.approvedReferenceDefault === false, `${entry.queueId}: reference approval inferred`);
  assert(entry.approval.approvedWebDefault === false, `${entry.queueId}: Web approval inferred`);
  assert(entry.approval.approvedUnityDefault === false, `${entry.queueId}: Unity approval inferred`);
  assert(entry.approval.runtimeApprovedDefault === false, `${entry.queueId}: runtime approval inferred`);
  assert(entry.gate.humanComparisonRequired === true, `${entry.queueId}: human comparison gate missing`);
  assert(entry.gate.referenceApprovalRequiredBeforeRuntimeDerivatives === true, `${entry.queueId}: reference-first runtime gate missing`);
  assert(entry.gate.runtimeDerivativeQueueAllowedNow === false, `${entry.queueId}: runtime derivative queued before reference approval`);
  assert(entry.gate.oneShotFinalForbidden === true, `${entry.queueId}: one-shot final gate missing`);
  assert(!entry.handoffId.includes('character'), `${entry.queueId}: Character handoff leaked into queue`);
  assert(!entry.handoffId.includes('star-beast'), `${entry.queueId}: Star Beast handoff leaked into queue`);
  assert(!entry.handoffId.includes('named-object'), `${entry.queueId}: Named Object handoff leaked into queue`);
  assert(!entry.handoffId.includes('toumon'), `${entry.queueId}: Toumon handoff leaked into queue`);
  assert(!entry.handoffId.includes('stage:'), `${entry.queueId}: Stage handoff leaked into queue`);
  assert(!entry.handoffId.includes('reward:'), `${entry.queueId}: Reward handoff leaked into queue`);
  if (entry.phase === 'ENEMY_REFERENCE') {
    assert(entry.sourceCategory === 'enemies', `${entry.queueId}: Enemy category drift`);
    assert(!bossIds.has(entry.sourceId), `${entry.queueId}: Boss leaked into regular Enemy phase`);
    assert(entry.existingAssetFactoryContractId !== null, `${entry.queueId}: Enemy Asset Factory contract missing`);
  }
  if (entry.phase === 'BOSS_REFERENCE') {
    assert(entry.sourceCategory === 'bosses', `${entry.queueId}: Boss category drift`);
    assert(bossIds.has(entry.sourceId), `${entry.queueId}: non-Boss leaked into Boss phase`);
    assert(entry.existingAssetFactoryContractId !== null, `${entry.queueId}: Boss Asset Factory contract missing`);
  }
  if (entry.phase === 'WEAPON_REFERENCE') {
    assert(entry.sourceCategory === 'weapons', `${entry.queueId}: Weapon category drift`);
    assert(entry.existingAssetFactoryContractId === null, `${entry.queueId}: direct Weapon handoff should not pretend to be Asset Factory contract`);
  }
  if (entry.phase === 'ITEM_REFERENCE') {
    assert(entry.sourceCategory === 'items', `${entry.queueId}: Item category drift`);
    assert(entry.existingAssetFactoryContractId !== null, `${entry.queueId}: Item Asset Factory contract missing`);
  }
}

const runtimeHandoffs = assetFactorySharedSourceHandoffs.filter((handoff) => handoff.kind === 'unity-runtime-asset-handoff');
const queuedHandoffIds = new Set(referenceFirstBulkGenerationQueue.map((entry) => entry.handoffId));
assert(runtimeHandoffs.every((handoff) => !queuedHandoffIds.has(handoff.handoffId)), 'runtime Asset Factory handoff leaked into reference-first queue');

console.log(`Reference First Bulk Generation Queue: PASS (total=${expectedTotal}, enemy=${expectedEnemyReferences}, boss=${expectedBossReferences}, weapon=${weaponGenerationHandoffs.length}, item=${itemReferenceHandoffs.length}, runtimeQueued=0)`);
