import { yatsukageCallNames, YATSUKAGE_GROUP_IDENTITY } from './yatsukageIdentitySource.ts';

export type YatsukagePresentationPhase = 'FIRST_ENCOUNTER' | 'OBSERVED_CALL_NAME' | 'PAST_FRAGMENT_FOUND' | 'REINTERPRETED';

export type YatsukageCollectionPresentationEntry = {
  enemyId: string;
  callName: string;
  currentEnemyName: string;
  phases: Readonly<Record<YatsukagePresentationPhase, {
    primaryLabel: string;
    secondaryLabel: string | null;
    groupBadgeVisible: boolean;
    trueNameClaimed: false;
  }>>;
  storyCompleteRequired: false;
  readingRequiredForPower: false;
  runtimeAutoPromotionAllowed: false;
};

export const yatsukageCollectionPresentationEntries: readonly YatsukageCollectionPresentationEntry[] = yatsukageCallNames.map((entry) => ({
  enemyId: entry.enemyId,
  callName: entry.callName,
  currentEnemyName: entry.currentEnemyName,
  phases: {
    FIRST_ENCOUNTER: {
      primaryLabel: entry.currentEnemyName,
      secondaryLabel: null,
      groupBadgeVisible: false,
      trueNameClaimed: false,
    },
    OBSERVED_CALL_NAME: {
      primaryLabel: entry.callName,
      secondaryLabel: entry.currentEnemyName,
      groupBadgeVisible: true,
      trueNameClaimed: false,
    },
    PAST_FRAGMENT_FOUND: {
      primaryLabel: entry.callName,
      secondaryLabel: `${YATSUKAGE_GROUP_IDENTITY.shortName} / ${entry.currentEnemyName}`,
      groupBadgeVisible: true,
      trueNameClaimed: false,
    },
    REINTERPRETED: {
      primaryLabel: entry.callName,
      secondaryLabel: `${YATSUKAGE_GROUP_IDENTITY.formalName} — ${entry.currentEnemyName}`,
      groupBadgeVisible: true,
      trueNameClaimed: false,
    },
  },
  storyCompleteRequired: false,
  readingRequiredForPower: false,
  runtimeAutoPromotionAllowed: false,
}));

export const yatsukageCollectionPresentationSummary = {
  memberCount: yatsukageCollectionPresentationEntries.length,
  presentationPhaseCount: 4,
  firstEncounterUsesDescriptiveEnemyIdentity: yatsukageCollectionPresentationEntries.every((entry) => entry.phases.FIRST_ENCOUNTER.primaryLabel === entry.currentEnemyName),
  callNameVisibleAfterObservation: yatsukageCollectionPresentationEntries.every((entry) => entry.phases.OBSERVED_CALL_NAME.primaryLabel === entry.callName),
  trueNameClaimedCount: yatsukageCollectionPresentationEntries.reduce((sum, entry) => sum + Object.values(entry.phases).filter((phase) => phase.trueNameClaimed).length, 0),
  storyCompleteRequired: false,
  readingRequiredForPower: false,
  runtimeAutoPromotionAllowed: false,
} as const;
