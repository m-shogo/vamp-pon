import { namedObjectMigrationLedger } from './namedObjectMigrationLedger.ts';
import {
  allLightsCompletionDesign,
  characterObjectLineages,
  type NamedObjectNamingStatus,
} from './namedObjectRegistry.ts';

export type NamedObjectRuntimeConnectionState = 'NOT_CONNECTED';

export type CharacterObjectReadModel = {
  keeperId: string;
  characterId: string;
  characterDisplayName: string;
  namingStatus: NamedObjectNamingStatus;
  runtimeConnectionState: NamedObjectRuntimeConnectionState;
  requiredForLaunchCompletion: boolean;
  luminousPossession: string;
  stages: string[];
  gameplayVerbs: string[];
  relationshipCharacterIds: string[];
  archiveKeys: string[];
  legacyReferences: string[];
  lineage: {
    starterGear: string;
    passiveItem: string;
    rareItem: string;
    lampTsugi: string;
    akatsukiBiraki: string;
  };
};

export const characterObjectReadModels: CharacterObjectReadModel[] = characterObjectLineages.map(
  (lineage) => ({
    keeperId: `keeper-${lineage.characterId}`,
    characterId: lineage.characterId,
    characterDisplayName: lineage.characterDisplayName,
    namingStatus: lineage.namingStatus,
    runtimeConnectionState: 'NOT_CONNECTED',
    requiredForLaunchCompletion: lineage.requiredForLaunchCompletion,
    luminousPossession: lineage.luminousPossession,
    stages: lineage.stageIds.map((stageId) => `stage:${stageId}`),
    gameplayVerbs: [...lineage.gameplayVerbs],
    relationshipCharacterIds: [...lineage.relationshipCharacterIds],
    archiveKeys: [...lineage.archiveKeys],
    legacyReferences: [...lineage.legacyReferences],
    lineage: {
      starterGear: lineage.starterGear,
      passiveItem: lineage.passiveItem,
      rareItem: lineage.rareItem,
      lampTsugi: lineage.lampTsugi,
      akatsukiBiraki: lineage.akatsukiBiraki,
    },
  }),
);

export const characterObjectReadModelByCharacterId = new Map(
  characterObjectReadModels.map((model) => [model.characterId, model]),
);
export const characterObjectReadModelByKeeperId = new Map(
  characterObjectReadModels.map((model) => [model.keeperId, model]),
);

export type LostItemConnectionCompatibilityReadModel = {
  lostItemId: string;
  legacyKeeperId: string;
  currentCharacterId: string;
  currentStableObjectId: string;
  migrationState: 'CURRENT_REBIND_DIRECTION_NOT_APPLIED';
  preserveLegacy: true;
};

const LOST_ITEM_MIGRATION_IDS = new Map([
  ['lost-folded-map-corner-owner-v0', 'lost-folded-map-corner'],
  ['lost-rusted-room-key-owner-v0', 'lost-rusted-room-key'],
]);

export const lostItemConnectionCompatibilityReadModels: LostItemConnectionCompatibilityReadModel[] =
  namedObjectMigrationLedger.flatMap((entry) => {
    const lostItemId = LOST_ITEM_MIGRATION_IDS.get(entry.id);
    if (
      !lostItemId ||
      entry.action !== 'REBIND_CURRENT_CONNECTION' ||
      !entry.currentStableId ||
      !entry.legacyDisplayName
    ) {
      return [];
    }

    const legacyKeeperMatch = entry.legacyDisplayName.match(/keeper-[a-z0-9-]+/u);
    const currentCharacterMatch = entry.currentStableId.match(/^named-object:([^:]+):/u);
    if (!legacyKeeperMatch || !currentCharacterMatch) {
      return [];
    }

    return [
      {
        lostItemId,
        legacyKeeperId: legacyKeeperMatch[0],
        currentCharacterId: currentCharacterMatch[1],
        currentStableObjectId: entry.currentStableId,
        migrationState: 'CURRENT_REBIND_DIRECTION_NOT_APPLIED' as const,
        preserveLegacy: true as const,
      },
    ];
  });

export type CompletionGroupReadModel = {
  id: string;
  displayName: string;
  designTargetCount: number;
  runtimeDenominatorState: 'NOT_FROZEN';
};

export const allLightsCompletionGroupReadModels: CompletionGroupReadModel[] =
  allLightsCompletionDesign.groups.map((group) => ({
    id: group.id,
    displayName: group.displayName,
    designTargetCount: group.designTargetCount,
    runtimeDenominatorState: 'NOT_FROZEN',
  }));

export const allLightsRewardReadModel = {
  id: allLightsCompletionDesign.rewardId,
  displayName: allLightsCompletionDesign.rewardDisplayName,
  runtimeConnectionState: 'NOT_CONNECTED' as const,
  replayable: true,
  rewardParts: [
    'playable-celebration',
    'ensemble-animated-page',
    'completion-medley',
    'all-character-cosmetic',
    'constellation-remix-mode',
    'completion-title-seal-frame',
    'small-future-anomaly',
  ],
} as const;

export function normalizeLegacyDisplayTerm(value: string): string {
  return value.replaceAll('黒曜化', '黒耀化');
}
