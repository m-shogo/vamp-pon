import { enemyProductionEntries } from '../../src/game/data/enemyProductionDatabase.ts';
import { itemAssetProductionEntries } from '../../src/game/data/itemAssetProductionDatabase.ts';
import { referenceCandidateReviewLedgerSummary } from '../../src/game/data/referenceCandidateReviewLedger.ts';
import {
  referenceFirstBulkGenerationQueue,
  referenceFirstBulkGenerationQueueById,
  type ReferenceFirstQueueEntry,
} from '../../src/game/data/referenceFirstBulkGenerationQueue.ts';
import {
  referenceGenerationBatchPackets,
  referenceGenerationBatchPacketSummary,
} from '../../src/game/data/referenceGenerationBatchPackets.ts';
import { weaponVisualSharedSourceEntries } from '../../src/game/data/weaponVisualSharedSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[Reference Generation Batch Packets] ${message}`);
}

const enemyById = new Map(enemyProductionEntries.map((entry) => [entry.id, entry]));
const itemById = new Map(itemAssetProductionEntries.map((entry) => [entry.id, entry]));
const weaponById = new Map(weaponVisualSharedSourceEntries.map((entry) => [entry.id, entry]));

function expectedDescriptor(entry: ReferenceFirstQueueEntry) {
  if (entry.phase === 'ENEMY_REFERENCE') {
    const enemy = enemyById.get(entry.sourceId);
    if (!enemy) throw new Error(`missing Enemy source ${entry.sourceId}`);
    return { grouping: 'ENEMY_FAMILY', groupKey: enemy.family } as const;
  }
  if (entry.phase === 'BOSS_REFERENCE') return { grouping: 'BOSS_SET', groupKey: 'boss' } as const;
  if (entry.phase === 'WEAPON_REFERENCE') {
    const weapon = weaponById.get(entry.sourceId);
    if (!weapon) throw new Error(`missing Weapon source ${entry.sourceId}`);
    return { grouping: 'WEAPON_FORM', groupKey: weapon.formKind } as const;
  }
  const item = itemById.get(entry.sourceId);
  if (!item) throw new Error(`missing Item source ${entry.sourceId}`);
  return { grouping: 'ITEM_KIND', groupKey: item.kind } as const;
}

assert(referenceFirstBulkGenerationQueue.length === 168, 'reference queue total drift');
assert(referenceCandidateReviewLedgerSummary.notGeneratedCount === 168, 'batch execution must start before any reference generation');
assert(referenceGenerationBatchPacketSummary.totalReferences === 168, 'packet reference coverage drift');
assert(referenceGenerationBatchPacketSummary.totalCandidateCapacity === 672, 'packet candidate capacity drift');
assert(referenceGenerationBatchPacketSummary.maxReferencesPerPacket === 12, 'max-reference policy drift');
assert(referenceGenerationBatchPacketSummary.largestPacketReferenceCount <= 12, 'packet exceeds 12 references');
assert(referenceGenerationBatchPacketSummary.largestPacketCandidateCapacity <= 48, 'packet exceeds 48 candidate artifacts');
assert(referenceGenerationBatchPacketSummary.executionStartedCount === 0, 'packet execution inferred');
assert(referenceGenerationBatchPacketSummary.automaticExecutionAllowed === false, 'automatic packet execution inferred');
assert(referenceGenerationBatchPackets.length > 0, 'no batch packets generated');
assert(new Set(referenceGenerationBatchPackets.map((packet) => packet.packetId)).size === referenceGenerationBatchPackets.length, 'duplicate packet ID');

const allQueueIds = referenceGenerationBatchPackets.flatMap((packet) => packet.queueIds);
assert(allQueueIds.length === 168, 'flattened packet queue coverage drift');
assert(new Set(allQueueIds).size === 168, 'queue entry appears in multiple packets');
assert(JSON.stringify(allQueueIds) === JSON.stringify(referenceFirstBulkGenerationQueue.map((entry) => entry.queueId)), 'packet flattening must preserve original reference queue order');

for (const [index, packet] of referenceGenerationBatchPackets.entries()) {
  assert(packet.sequence === index + 1, `${packet.packetId}: packet sequence drift`);
  assert(packet.referenceCount === packet.queueIds.length, `${packet.packetId}: reference count drift`);
  assert(packet.referenceCount >= 1 && packet.referenceCount <= 12, `${packet.packetId}: invalid reference count`);
  assert(packet.candidateCountPerReference === 4, `${packet.packetId}: candidate count per reference drift`);
  assert(packet.candidateCapacity === packet.referenceCount * 4, `${packet.packetId}: candidate capacity drift`);
  assert(packet.candidateCapacity <= 48, `${packet.packetId}: candidate capacity too large`);
  assert(packet.executionState === 'PLANNED_NOT_STARTED', `${packet.packetId}: execution state inferred`);
  assert(packet.automaticExecutionAllowed === false, `${packet.packetId}: automatic execution inferred`);
  assert(packet.gate.maxReferencesPerPacket === 12, `${packet.packetId}: max-reference gate drift`);
  assert(packet.gate.maxCandidateArtifactsPerPacket === 48, `${packet.packetId}: max-candidate gate drift`);
  assert(packet.gate.groupContextMustRemainHomogeneous === true, `${packet.packetId}: homogeneous-context gate missing`);
  assert(packet.gate.exactFourCandidatesPerReference === true, `${packet.packetId}: exact-four gate missing`);
  assert(packet.gate.comparisonRequiredBeforeApproval === true, `${packet.packetId}: comparison gate missing`);
  assert(packet.gate.oneShotFinalForbidden === true, `${packet.packetId}: one-shot final guard missing`);
  assert(packet.gate.runtimeDerivativesExcluded === true, `${packet.packetId}: runtime derivative exclusion missing`);

  for (const queueId of packet.queueIds) {
    const entry = referenceFirstBulkGenerationQueueById.get(queueId);
    assert(entry, `${packet.packetId}: unknown queue entry ${queueId}`);
    const descriptor = expectedDescriptor(entry);
    assert(packet.grouping === descriptor.grouping, `${packet.packetId}: grouping drift for ${queueId}`);
    assert(packet.groupKey === descriptor.groupKey, `${packet.packetId}: group key drift for ${queueId}`);
    assert(packet.sourceCategory === entry.sourceCategory, `${packet.packetId}: source category drift for ${queueId}`);
    assert(entry.gate.runtimeDerivativeQueueAllowedNow === false, `${packet.packetId}: runtime-ready reference leaked into initial batch`);
    assert(entry.executionState === 'QUEUED_NOT_GENERATED', `${packet.packetId}: generated queue entry leaked into initial packet`);
  }
}

const enemyPackets = referenceGenerationBatchPackets.filter((packet) => packet.grouping === 'ENEMY_FAMILY');
const bossPackets = referenceGenerationBatchPackets.filter((packet) => packet.grouping === 'BOSS_SET');
const weaponPackets = referenceGenerationBatchPackets.filter((packet) => packet.grouping === 'WEAPON_FORM');
const itemPackets = referenceGenerationBatchPackets.filter((packet) => packet.grouping === 'ITEM_KIND');
assert(enemyPackets.length === referenceGenerationBatchPacketSummary.enemyFamilyPacketCount, 'Enemy packet summary drift');
assert(bossPackets.length === referenceGenerationBatchPacketSummary.bossPacketCount, 'Boss packet summary drift');
assert(weaponPackets.length === referenceGenerationBatchPacketSummary.weaponFormPacketCount, 'Weapon packet summary drift');
assert(itemPackets.length === referenceGenerationBatchPacketSummary.itemKindPacketCount, 'Item packet summary drift');
assert(bossPackets.length === 1 && bossPackets[0].referenceCount === 3, 'Boss references should remain one 3-reference comparison packet');

console.log(
  `Reference Generation Batch Packets: PASS (` +
    `packets=${referenceGenerationBatchPacketSummary.packetCount}, references=168, candidates=672, ` +
    `enemyPackets=${enemyPackets.length}, bossPackets=${bossPackets.length}, weaponPackets=${weaponPackets.length}, itemPackets=${itemPackets.length}, ` +
    `largest=${referenceGenerationBatchPacketSummary.largestPacketReferenceCount}/12 refs)`,
);
