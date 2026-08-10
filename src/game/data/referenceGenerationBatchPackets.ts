import { enemyProductionEntries } from './enemyProductionDatabase.ts';
import { itemAssetProductionEntries } from './itemAssetProductionDatabase.ts';
import {
  referenceFirstBulkGenerationQueue,
  type ReferenceFirstQueueEntry,
} from './referenceFirstBulkGenerationQueue.ts';
import { weaponVisualSharedSourceEntries } from './weaponVisualSharedSource.ts';

export type ReferenceGenerationBatchGrouping =
  | 'ENEMY_FAMILY'
  | 'BOSS_SET'
  | 'WEAPON_FORM'
  | 'ITEM_KIND';

export type ReferenceGenerationBatchPacket = {
  packetId: string;
  sequence: number;
  grouping: ReferenceGenerationBatchGrouping;
  groupKey: string;
  sourceCategory: ReferenceFirstQueueEntry['sourceCategory'];
  queueIds: readonly string[];
  referenceCount: number;
  candidateCountPerReference: 4;
  candidateCapacity: number;
  executionState: 'PLANNED_NOT_STARTED';
  automaticExecutionAllowed: false;
  gate: {
    maxReferencesPerPacket: 12;
    maxCandidateArtifactsPerPacket: 48;
    groupContextMustRemainHomogeneous: true;
    exactFourCandidatesPerReference: true;
    comparisonRequiredBeforeApproval: true;
    oneShotFinalForbidden: true;
    runtimeDerivativesExcluded: true;
  };
};

const MAX_REFERENCES_PER_PACKET = 12 as const;
const enemyById = new Map(enemyProductionEntries.map((entry) => [entry.id, entry]));
const itemById = new Map(itemAssetProductionEntries.map((entry) => [entry.id, entry]));
const weaponById = new Map(weaponVisualSharedSourceEntries.map((entry) => [entry.id, entry]));

function groupDescriptor(entry: ReferenceFirstQueueEntry): {
  grouping: ReferenceGenerationBatchGrouping;
  groupKey: string;
} {
  if (entry.phase === 'ENEMY_REFERENCE') {
    const enemy = enemyById.get(entry.sourceId);
    if (!enemy) throw new Error(`Enemy source missing for batch packet: ${entry.sourceId}`);
    return { grouping: 'ENEMY_FAMILY', groupKey: enemy.family };
  }
  if (entry.phase === 'BOSS_REFERENCE') return { grouping: 'BOSS_SET', groupKey: 'boss' };
  if (entry.phase === 'WEAPON_REFERENCE') {
    const weapon = weaponById.get(entry.sourceId);
    if (!weapon) throw new Error(`Weapon source missing for batch packet: ${entry.sourceId}`);
    return { grouping: 'WEAPON_FORM', groupKey: weapon.formKind };
  }
  const item = itemById.get(entry.sourceId);
  if (!item) throw new Error(`Item source missing for batch packet: ${entry.sourceId}`);
  return { grouping: 'ITEM_KIND', groupKey: item.kind };
}

const groupOrder: string[] = [];
const grouped = new Map<string, {
  grouping: ReferenceGenerationBatchGrouping;
  groupKey: string;
  sourceCategory: ReferenceFirstQueueEntry['sourceCategory'];
  entries: ReferenceFirstQueueEntry[];
}>();

for (const entry of referenceFirstBulkGenerationQueue) {
  const descriptor = groupDescriptor(entry);
  const compositeKey = `${entry.sourceCategory}:${descriptor.grouping}:${descriptor.groupKey}`;
  let bucket = grouped.get(compositeKey);
  if (!bucket) {
    bucket = {
      grouping: descriptor.grouping,
      groupKey: descriptor.groupKey,
      sourceCategory: entry.sourceCategory,
      entries: [],
    };
    grouped.set(compositeKey, bucket);
    groupOrder.push(compositeKey);
  }
  bucket.entries.push(entry);
}

const packets: ReferenceGenerationBatchPacket[] = [];
let packetSequence = 1;
for (const compositeKey of groupOrder) {
  const bucket = grouped.get(compositeKey);
  if (!bucket) continue;
  for (let offset = 0; offset < bucket.entries.length; offset += MAX_REFERENCES_PER_PACKET) {
    const chunk = bucket.entries.slice(offset, offset + MAX_REFERENCES_PER_PACKET);
    const chunkIndex = Math.floor(offset / MAX_REFERENCES_PER_PACKET) + 1;
    const referenceCount = chunk.length;
    packets.push({
      packetId: `reference-batch:${packetSequence.toString().padStart(3, '0')}:${bucket.sourceCategory}:${bucket.grouping.toLowerCase()}:${bucket.groupKey}:${chunkIndex}`,
      sequence: packetSequence,
      grouping: bucket.grouping,
      groupKey: bucket.groupKey,
      sourceCategory: bucket.sourceCategory,
      queueIds: chunk.map((entry) => entry.queueId),
      referenceCount,
      candidateCountPerReference: 4,
      candidateCapacity: referenceCount * 4,
      executionState: 'PLANNED_NOT_STARTED',
      automaticExecutionAllowed: false,
      gate: {
        maxReferencesPerPacket: 12,
        maxCandidateArtifactsPerPacket: 48,
        groupContextMustRemainHomogeneous: true,
        exactFourCandidatesPerReference: true,
        comparisonRequiredBeforeApproval: true,
        oneShotFinalForbidden: true,
        runtimeDerivativesExcluded: true,
      },
    });
    packetSequence += 1;
  }
}

export const referenceGenerationBatchPackets: readonly ReferenceGenerationBatchPacket[] = packets;
export const referenceGenerationBatchPacketById = new Map(
  referenceGenerationBatchPackets.map((packet) => [packet.packetId, packet]),
);

export const referenceGenerationBatchPacketSummary = {
  packetCount: referenceGenerationBatchPackets.length,
  totalReferences: referenceGenerationBatchPackets.reduce((sum, packet) => sum + packet.referenceCount, 0),
  totalCandidateCapacity: referenceGenerationBatchPackets.reduce((sum, packet) => sum + packet.candidateCapacity, 0),
  largestPacketReferenceCount: Math.max(...referenceGenerationBatchPackets.map((packet) => packet.referenceCount)),
  largestPacketCandidateCapacity: Math.max(...referenceGenerationBatchPackets.map((packet) => packet.candidateCapacity)),
  enemyFamilyPacketCount: referenceGenerationBatchPackets.filter((packet) => packet.grouping === 'ENEMY_FAMILY').length,
  bossPacketCount: referenceGenerationBatchPackets.filter((packet) => packet.grouping === 'BOSS_SET').length,
  weaponFormPacketCount: referenceGenerationBatchPackets.filter((packet) => packet.grouping === 'WEAPON_FORM').length,
  itemKindPacketCount: referenceGenerationBatchPackets.filter((packet) => packet.grouping === 'ITEM_KIND').length,
  executionStartedCount: referenceGenerationBatchPackets.filter((packet) => packet.executionState !== 'PLANNED_NOT_STARTED').length,
  maxReferencesPerPacket: MAX_REFERENCES_PER_PACKET,
  automaticExecutionAllowed: false,
} as const;
