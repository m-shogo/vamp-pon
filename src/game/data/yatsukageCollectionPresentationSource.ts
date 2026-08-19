import { SAKUYAZA_CURRENT_IDENTITY } from './sakumeiCandidateSource.ts';
import { yatsukageCallNames, YATSUKAGE_GROUP_IDENTITY } from './yatsukageIdentitySource.ts';

/** Legacy type name retained for compatibility with existing imports. */
export type YatsukagePresentationPhase = 'FIRST_ENCOUNTER' | 'OBSERVED_CALL_NAME' | 'PAST_FRAGMENT_FOUND' | 'REINTERPRETED';

export type YatsukageCollectionPresentationEntry = {
  enemyId: string;
  callName: string;
  currentEnemyName: string;
  phases: Readonly<Record<YatsukagePresentationPhase, {
    primaryLabel: string;
    secondaryLabel: string | null;
    groupBadgeVisible: boolean;
    groupLabelAuthority: 'NONE' | 'LEGACY_EARLY_OBSERVER' | 'CURRENT_S1_FORMAL';
    trueNameClaimed: false;
  }>>;
  storyCompleteRequired: false;
  readingRequiredForPower: false;
  runtimeAutoPromotionAllowed: false;
};

/**
 * Presentation migration rule:
 * - first encounter: descriptive Enemy identity only
 * - observed call name: individual call name only
 * - past fragment: the legacy 八影 observer label may appear when the scene is
 *   explicitly presenting that historical/observer terminology
 * - reinterpreted: Current formal S1 team label is 朔夜座
 *
 * This does not make the legacy label a Current naming authority and does not
 * claim the eight call names are true names.
 */
export const yatsukageCollectionPresentationEntries: readonly YatsukageCollectionPresentationEntry[] = yatsukageCallNames.map((entry) => ({
  enemyId: entry.enemyId,
  callName: entry.callName,
  currentEnemyName: entry.currentEnemyName,
  phases: {
    FIRST_ENCOUNTER: {
      primaryLabel: entry.currentEnemyName,
      secondaryLabel: null,
      groupBadgeVisible: false,
      groupLabelAuthority: 'NONE',
      trueNameClaimed: false,
    },
    OBSERVED_CALL_NAME: {
      primaryLabel: entry.callName,
      secondaryLabel: entry.currentEnemyName,
      groupBadgeVisible: false,
      groupLabelAuthority: 'NONE',
      trueNameClaimed: false,
    },
    PAST_FRAGMENT_FOUND: {
      primaryLabel: entry.callName,
      secondaryLabel: `${YATSUKAGE_GROUP_IDENTITY.shortName}（旧観測呼称） / ${entry.currentEnemyName}`,
      groupBadgeVisible: true,
      groupLabelAuthority: 'LEGACY_EARLY_OBSERVER',
      trueNameClaimed: false,
    },
    REINTERPRETED: {
      primaryLabel: entry.callName,
      secondaryLabel: `${SAKUYAZA_CURRENT_IDENTITY.formalName} — ${entry.currentEnemyName}`,
      groupBadgeVisible: true,
      groupLabelAuthority: 'CURRENT_S1_FORMAL',
      trueNameClaimed: false,
    },
  },
  storyCompleteRequired: false,
  readingRequiredForPower: false,
  runtimeAutoPromotionAllowed: false,
}));

export const yatsukageCollectionPresentationSummary = {
  legacySourceNameRetainedForCompatibility: true,
  currentFormalGroupName: SAKUYAZA_CURRENT_IDENTITY.formalName,
  legacyObserverLabel: YATSUKAGE_GROUP_IDENTITY.shortName,
  memberCount: yatsukageCollectionPresentationEntries.length,
  presentationPhaseCount: 4,
  firstEncounterUsesDescriptiveEnemyIdentity: yatsukageCollectionPresentationEntries.every((entry) => entry.phases.FIRST_ENCOUNTER.primaryLabel === entry.currentEnemyName),
  callNameVisibleAfterObservation: yatsukageCollectionPresentationEntries.every((entry) => entry.phases.OBSERVED_CALL_NAME.primaryLabel === entry.callName),
  observedPhaseHasNoFormalGroupBadge: yatsukageCollectionPresentationEntries.every((entry) => !entry.phases.OBSERVED_CALL_NAME.groupBadgeVisible),
  pastFragmentLegacyLabelExplicitlyMarked: yatsukageCollectionPresentationEntries.every((entry) => entry.phases.PAST_FRAGMENT_FOUND.groupLabelAuthority === 'LEGACY_EARLY_OBSERVER'),
  reinterpretedUsesCurrentS1FormalName: yatsukageCollectionPresentationEntries.every((entry) => entry.phases.REINTERPRETED.secondaryLabel?.startsWith(SAKUYAZA_CURRENT_IDENTITY.formalName)),
  trueNameClaimedCount: yatsukageCollectionPresentationEntries.reduce((sum, entry) => sum + Object.values(entry.phases).filter((phase) => phase.trueNameClaimed).length, 0),
  storyCompleteRequired: false,
  readingRequiredForPower: false,
  runtimeAutoPromotionAllowed: false,
} as const;
