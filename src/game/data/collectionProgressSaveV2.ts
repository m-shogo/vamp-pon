import { forgottenStreetNightBoardCompatibility } from './collectionProgressCompatibility.ts';
import { allLightsCompletionGroupReadModels } from './namedObjectReadModels.ts';

export type HundredPercentState = 'LOCKED' | 'ELIGIBLE' | 'CLAIMED';

export type CompletionGroupSaveState = {
  completedIds: string[];
  claimed: boolean;
};

export type CollectionProgressSaveV2 = {
  schemaVersion: 2;
  seenEnemyIds: string[];
  defeatedEnemyCounts: Record<string, number>;
  calmedBossIds: string[];
  discoveredLostItemIds: string[];
  unlockedMemoryTextIds: string[];
  nightBoard: {
    completedCellIds: string[];
    claimedCellIds: string[];
    revealedCellIds: string[];
    hintedCellIds: string[];
    boardVersion: string;
    nodeDefinitionVersion: string;
    connectedObjectIds: string[];
    unknownLegacyCellIds: string[];
  };
  completion: {
    definitionVersion: string;
    groupStates: Record<string, CompletionGroupSaveState>;
    unknownLegacyGroupIds: string[];
    hundredPercentState: HundredPercentState;
    completionRewardClaimed: boolean;
  };
  migration: {
    sourceSchemaVersion: 1 | 2 | 'unknown';
    runtimeConnectionState: 'DRAFT_NOT_CONNECTED';
  };
};

type UnknownRecord = Record<string, unknown>;

const KNOWN_STAGE1_CELL_IDS = new Set(
  forgottenStreetNightBoardCompatibility.cells.map((cell) => cell.id),
);
const KNOWN_COMPLETION_GROUP_IDS = new Set(
  allLightsCompletionGroupReadModels.map((group) => group.id),
);

function asRecord(value: unknown): UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};
}

function uniqueStrings(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const result: string[] = [];
  const seen = new Set<string>();
  for (const candidate of value) {
    if (typeof candidate !== 'string') {
      continue;
    }
    const normalized = candidate.trim();
    if (normalized === '' || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    result.push(normalized);
  }
  return result;
}

function nonNegativeCountRecord(value: unknown): Record<string, number> {
  const result: Record<string, number> = {};
  for (const [key, candidate] of Object.entries(asRecord(value))) {
    if (key.trim() === '' || typeof candidate !== 'number' || !Number.isFinite(candidate)) {
      continue;
    }
    result[key] = Math.max(0, Math.floor(candidate));
  }
  return result;
}

function nonEmptyString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : fallback;
}

function readHundredPercentState(value: unknown): HundredPercentState {
  return value === 'ELIGIBLE' || value === 'CLAIMED' ? value : 'LOCKED';
}

function readCompletionGroupState(value: unknown): CompletionGroupSaveState {
  const record = asRecord(value);
  return {
    completedIds: uniqueStrings(record.completedIds),
    claimed: record.claimed === true,
  };
}

function readGroupStates(value: unknown): {
  groupStates: Record<string, CompletionGroupSaveState>;
  derivedUnknownLegacyGroupIds: string[];
} {
  const source = asRecord(value);
  const groupStates: Record<string, CompletionGroupSaveState> = {};

  for (const group of allLightsCompletionGroupReadModels) {
    groupStates[group.id] = readCompletionGroupState(source[group.id]);
  }

  const derivedUnknownLegacyGroupIds: string[] = [];
  for (const [groupId, state] of Object.entries(source)) {
    if (KNOWN_COMPLETION_GROUP_IDS.has(groupId)) {
      continue;
    }
    groupStates[groupId] = readCompletionGroupState(state);
    derivedUnknownLegacyGroupIds.push(groupId);
  }

  return { groupStates, derivedUnknownLegacyGroupIds };
}

function sourceSchemaVersion(root: UnknownRecord): 1 | 2 | 'unknown' {
  if (root.schemaVersion === 2) {
    return 2;
  }
  if (root.schemaVersion === 1 || root.schemaVersion === undefined) {
    return 1;
  }
  return 'unknown';
}

export function migrateCollectionProgressSaveToV2(input: unknown): CollectionProgressSaveV2 {
  const root = asRecord(input);
  const nightBoard = asRecord(root.nightBoard);
  const completion = asRecord(root.completion);
  const sourceVersion = sourceSchemaVersion(root);

  const completedCellIds = uniqueStrings(nightBoard.completedCellIds);
  const claimedCellIds = uniqueStrings(nightBoard.claimedCellIds);
  const revealedCellIds = uniqueStrings(nightBoard.revealedCellIds);
  const hintedCellIds = uniqueStrings(nightBoard.hintedCellIds);
  const connectedObjectIds = uniqueStrings(nightBoard.connectedObjectIds);

  const unknownLegacyCellIds = uniqueStrings([
    ...uniqueStrings(nightBoard.unknownLegacyCellIds),
    ...completedCellIds.filter((id) => !KNOWN_STAGE1_CELL_IDS.has(id)),
    ...claimedCellIds.filter((id) => !KNOWN_STAGE1_CELL_IDS.has(id)),
    ...revealedCellIds.filter((id) => !KNOWN_STAGE1_CELL_IDS.has(id)),
    ...hintedCellIds.filter((id) => !KNOWN_STAGE1_CELL_IDS.has(id)),
  ]);

  const { groupStates, derivedUnknownLegacyGroupIds } = readGroupStates(completion.groupStates);
  const unknownLegacyGroupIds = uniqueStrings([
    ...uniqueStrings(completion.unknownLegacyGroupIds),
    ...derivedUnknownLegacyGroupIds,
  ]);
  const existingV2 = sourceVersion === 2;
  const hundredPercentState = existingV2
    ? readHundredPercentState(completion.hundredPercentState)
    : 'LOCKED';
  const completionRewardClaimed = existingV2 && completion.completionRewardClaimed === true;

  return {
    schemaVersion: 2,
    seenEnemyIds: uniqueStrings(root.seenEnemyIds),
    defeatedEnemyCounts: nonNegativeCountRecord(root.defeatedEnemyCounts),
    calmedBossIds: uniqueStrings(root.calmedBossIds),
    discoveredLostItemIds: uniqueStrings(root.discoveredLostItemIds),
    unlockedMemoryTextIds: uniqueStrings(root.unlockedMemoryTextIds),
    nightBoard: {
      completedCellIds,
      claimedCellIds,
      revealedCellIds,
      hintedCellIds,
      boardVersion: nonEmptyString(nightBoard.boardVersion, 'forgotten-street-v1'),
      nodeDefinitionVersion: nonEmptyString(
        nightBoard.nodeDefinitionVersion,
        forgottenStreetNightBoardCompatibility.definitionVersion,
      ),
      connectedObjectIds,
      unknownLegacyCellIds,
    },
    completion: {
      definitionVersion: nonEmptyString(completion.definitionVersion, 'design-v1'),
      groupStates,
      unknownLegacyGroupIds,
      hundredPercentState,
      completionRewardClaimed,
    },
    migration: {
      sourceSchemaVersion: sourceVersion,
      runtimeConnectionState: 'DRAFT_NOT_CONNECTED',
    },
  };
}
