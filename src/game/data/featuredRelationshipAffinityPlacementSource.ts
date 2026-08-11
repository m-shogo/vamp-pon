import type { CurrentRelationCharacterId } from './currentRelationshipInventory.ts';
import {
  featuredRelationshipAffinityArcs,
  featuredRelationshipAffinityBeats,
  type FeaturedAffinityBeatKind,
  type FeaturedRelationshipAffinityBeat,
} from './featuredRelationshipAffinityBeatSource.ts';
import { currentPairKey, type TrioBattleSelection } from './pairwiseBondTrioBattleSource.ts';
import { series1StageCampaignContentEntries } from './series1StageCampaignContentSource.ts';

export const FEATURED_AFFINITY_PLACEMENT_STATUS = 'CONTENT_PLACEMENT_POLICY_RUNTIME_NOT_IMPLEMENTED' as const;

export type FeaturedAffinityPresentationSurface =
  | 'RESULT_PAIR_CONDITIONAL'
  | 'HUB_FALLBACK'
  | 'RELATIONSHIP_BOOK_REPLAY';

export type FeaturedAffinityPlacementWindow = {
  beatKind: FeaturedAffinityBeatKind;
  unlockAfterStageOrdinal: number;
  preferredResultWindow: readonly [number, number];
  hubFallbackAfterStageOrdinal: number;
  latestEditorialWindowStageOrdinal: number;
  mainStoryRequired: false;
  exactStageFrozen: false;
};

export const FEATURED_AFFINITY_PLACEMENT_WINDOWS: readonly FeaturedAffinityPlacementWindow[] = [
  {
    beatKind: 'FRICTION',
    unlockAfterStageOrdinal: 3,
    preferredResultWindow: [3, 7],
    hubFallbackAfterStageOrdinal: 7,
    latestEditorialWindowStageOrdinal: 9,
    mainStoryRequired: false,
    exactStageFrozen: false,
  },
  {
    beatKind: 'RECOGNITION',
    unlockAfterStageOrdinal: 8,
    preferredResultWindow: [8, 14],
    hubFallbackAfterStageOrdinal: 14,
    latestEditorialWindowStageOrdinal: 16,
    mainStoryRequired: false,
    exactStageFrozen: false,
  },
  {
    beatKind: 'CHOSEN_TRUST',
    unlockAfterStageOrdinal: 15,
    preferredResultWindow: [15, 19],
    hubFallbackAfterStageOrdinal: 19,
    latestEditorialWindowStageOrdinal: 19,
    mainStoryRequired: false,
    exactStageFrozen: false,
  },
] as const;

const windowByKind = new Map(FEATURED_AFFINITY_PLACEMENT_WINDOWS.map((entry) => [entry.beatKind, entry]));
const stageOrdinalById = new Map(series1StageCampaignContentEntries.map((entry, index) => [entry.stageId, index + 1]));

export type FeaturedAffinityBeatPlacement = {
  beatId: string;
  relationId: string;
  kind: FeaturedAffinityBeatKind;
  participants: readonly [CurrentRelationCharacterId, CurrentRelationCharacterId];
  pairKey: string;
  unlockAfterStageOrdinal: number;
  preferredResultWindow: readonly [number, number];
  hubFallbackAfterStageOrdinal: number;
  latestEditorialWindowStageOrdinal: number;
  resultSurface: 'RESULT_PAIR_CONDITIONAL';
  fallbackSurface: 'HUB_FALLBACK';
  replaySurface: 'RELATIONSHIP_BOOK_REPLAY';
  requiresBothParticipantsInSelectedPartyForResult: true;
  requiresBothParticipantsAvailableForHub: true;
  resultPresentationCapPerRun: 1;
  unseenBeatsRemainAvailable: true;
  mainStoryRequired: false;
  stage20ClearRequired: false;
  stage20ClearBlockedIfUnseen: false;
  readingGrantsPower: false;
  exactStageFrozen: false;
  runtimeAutoPromotionAllowed: false;
};

export const featuredRelationshipAffinityBeatPlacements: readonly FeaturedAffinityBeatPlacement[] = featuredRelationshipAffinityArcs.flatMap((arc) =>
  arc.beats.map((beat) => {
    const window = windowByKind.get(beat.kind);
    if (!window) throw new Error(`missing Featured Affinity placement window: ${beat.kind}`);
    return {
      beatId: beat.beatId,
      relationId: beat.relationId,
      kind: beat.kind,
      participants: arc.participants,
      pairKey: currentPairKey(arc.participants[0], arc.participants[1]),
      unlockAfterStageOrdinal: window.unlockAfterStageOrdinal,
      preferredResultWindow: window.preferredResultWindow,
      hubFallbackAfterStageOrdinal: window.hubFallbackAfterStageOrdinal,
      latestEditorialWindowStageOrdinal: window.latestEditorialWindowStageOrdinal,
      resultSurface: 'RESULT_PAIR_CONDITIONAL' as const,
      fallbackSurface: 'HUB_FALLBACK' as const,
      replaySurface: 'RELATIONSHIP_BOOK_REPLAY' as const,
      requiresBothParticipantsInSelectedPartyForResult: true as const,
      requiresBothParticipantsAvailableForHub: true as const,
      resultPresentationCapPerRun: 1 as const,
      unseenBeatsRemainAvailable: true as const,
      mainStoryRequired: false as const,
      stage20ClearRequired: false as const,
      stage20ClearBlockedIfUnseen: false as const,
      readingGrantsPower: false as const,
      exactStageFrozen: false as const,
      runtimeAutoPromotionAllowed: false as const,
    };
  }),
);

const placementByBeatId = new Map(featuredRelationshipAffinityBeatPlacements.map((entry) => [entry.beatId, entry]));
const beatById = new Map(featuredRelationshipAffinityBeats.map((entry) => [entry.beatId, entry]));

export type ResolveFeaturedAffinityPlacementInput = {
  currentStageId: string;
  clearedStageOrdinal: number;
  selectedParty: TrioBattleSelection;
  availableCharacterIds: readonly CurrentRelationCharacterId[];
  seenBeatIds: readonly string[];
};

export type FeaturedAffinityPresentationCandidate = {
  beatId: string;
  relationId: string;
  kind: FeaturedAffinityBeatKind;
  participants: readonly [CurrentRelationCharacterId, CurrentRelationCharacterId];
  surface: FeaturedAffinityPresentationSurface;
  priorityReason: string;
  overdueForPreferredWindow: boolean;
  beat: FeaturedRelationshipAffinityBeat;
};

export type ResolvedFeaturedAffinityPlacement = {
  currentStageId: string;
  currentStageOrdinal: number;
  resultCandidate: FeaturedAffinityPresentationCandidate | null;
  hubCandidates: readonly FeaturedAffinityPresentationCandidate[];
  replayCandidates: readonly FeaturedAffinityPresentationCandidate[];
  resultPresentationCap: 1;
  groupAffinityCreated: false;
  unseenRequiredForStage20Clear: false;
  runtimeAutoPromotionAllowed: false;
};

function bothIncluded(
  participants: readonly [CurrentRelationCharacterId, CurrentRelationCharacterId],
  ids: ReadonlySet<CurrentRelationCharacterId>,
): boolean {
  return ids.has(participants[0]) && ids.has(participants[1]);
}

function kindOrder(kind: FeaturedAffinityBeatKind): number {
  if (kind === 'FRICTION') return 0;
  if (kind === 'RECOGNITION') return 1;
  return 2;
}

export function resolveFeaturedAffinityBeatPlacement(
  input: ResolveFeaturedAffinityPlacementInput,
): ResolvedFeaturedAffinityPlacement {
  const currentStageOrdinal = stageOrdinalById.get(input.currentStageId);
  if (!currentStageOrdinal) throw new Error(`unknown Title1 Stage: ${input.currentStageId}`);
  if (input.clearedStageOrdinal < 0 || input.clearedStageOrdinal > 20) throw new Error('clearedStageOrdinal must be within 0..20');
  if (new Set(input.selectedParty).size !== 3) throw new Error('Featured Affinity placement requires three distinct selected Characters');

  const partySet = new Set<CurrentRelationCharacterId>(input.selectedParty);
  const availableSet = new Set<CurrentRelationCharacterId>(input.availableCharacterIds);
  const seenSet = new Set(input.seenBeatIds);

  const unseen = featuredRelationshipAffinityBeatPlacements.filter((placement) =>
    !seenSet.has(placement.beatId) && input.clearedStageOrdinal >= placement.unlockAfterStageOrdinal,
  );

  const resultEligible = unseen
    .filter((placement) => {
      const [start, end] = placement.preferredResultWindow;
      return currentStageOrdinal >= start && currentStageOrdinal <= end && bothIncluded(placement.participants, partySet);
    })
    .sort((a, b) => {
      const aOverdue = input.clearedStageOrdinal > a.latestEditorialWindowStageOrdinal ? 1 : 0;
      const bOverdue = input.clearedStageOrdinal > b.latestEditorialWindowStageOrdinal ? 1 : 0;
      if (aOverdue !== bOverdue) return bOverdue - aOverdue;
      if (kindOrder(a.kind) !== kindOrder(b.kind)) return kindOrder(a.kind) - kindOrder(b.kind);
      return a.relationId.localeCompare(b.relationId);
    });

  const chosenResult = resultEligible[0] ?? null;
  const resultCandidate = chosenResult
    ? {
        beatId: chosenResult.beatId,
        relationId: chosenResult.relationId,
        kind: chosenResult.kind,
        participants: chosenResult.participants,
        surface: 'RESULT_PAIR_CONDITIONAL' as const,
        priorityReason: 'selected party contains both participants; only one relationship beat may claim this Result',
        overdueForPreferredWindow: input.clearedStageOrdinal > chosenResult.latestEditorialWindowStageOrdinal,
        beat: beatById.get(chosenResult.beatId)!,
      }
    : null;

  const hubCandidates = unseen
    .filter((placement) =>
      placement.beatId !== chosenResult?.beatId
      && input.clearedStageOrdinal >= placement.hubFallbackAfterStageOrdinal
      && bothIncluded(placement.participants, availableSet),
    )
    .sort((a, b) => {
      if (kindOrder(a.kind) !== kindOrder(b.kind)) return kindOrder(a.kind) - kindOrder(b.kind);
      if (a.hubFallbackAfterStageOrdinal !== b.hubFallbackAfterStageOrdinal) return a.hubFallbackAfterStageOrdinal - b.hubFallbackAfterStageOrdinal;
      return a.relationId.localeCompare(b.relationId);
    })
    .map((placement) => ({
      beatId: placement.beatId,
      relationId: placement.relationId,
      kind: placement.kind,
      participants: placement.participants,
      surface: 'HUB_FALLBACK' as const,
      priorityReason: 'preferred party Result window was missed or another pair used the Result slot; Hub preserves optional access',
      overdueForPreferredWindow: input.clearedStageOrdinal > placement.latestEditorialWindowStageOrdinal,
      beat: beatById.get(placement.beatId)!,
    }));

  const replayCandidates = featuredRelationshipAffinityBeatPlacements
    .filter((placement) => seenSet.has(placement.beatId) && bothIncluded(placement.participants, availableSet))
    .map((placement) => ({
      beatId: placement.beatId,
      relationId: placement.relationId,
      kind: placement.kind,
      participants: placement.participants,
      surface: 'RELATIONSHIP_BOOK_REPLAY' as const,
      priorityReason: 'seen relationship beat remains replayable without granting relationship power',
      overdueForPreferredWindow: false,
      beat: beatById.get(placement.beatId)!,
    }));

  return {
    currentStageId: input.currentStageId,
    currentStageOrdinal,
    resultCandidate,
    hubCandidates,
    replayCandidates,
    resultPresentationCap: 1,
    groupAffinityCreated: false,
    unseenRequiredForStage20Clear: false,
    runtimeAutoPromotionAllowed: false,
  };
}

export const featuredRelationshipAffinityPlacementSummary = {
  stageCount: series1StageCampaignContentEntries.length,
  relationCount: featuredRelationshipAffinityArcs.length,
  beatPlacementCount: featuredRelationshipAffinityBeatPlacements.length,
  frictionPlacementCount: featuredRelationshipAffinityBeatPlacements.filter((entry) => entry.kind === 'FRICTION').length,
  recognitionPlacementCount: featuredRelationshipAffinityBeatPlacements.filter((entry) => entry.kind === 'RECOGNITION').length,
  chosenTrustPlacementCount: featuredRelationshipAffinityBeatPlacements.filter((entry) => entry.kind === 'CHOSEN_TRUST').length,
  resultPresentationCapPerRun: 1,
  allBeatsHaveHubFallback: featuredRelationshipAffinityBeatPlacements.every((entry) => entry.fallbackSurface === 'HUB_FALLBACK'),
  allBeatsReplayable: featuredRelationshipAffinityBeatPlacements.every((entry) => entry.replaySurface === 'RELATIONSHIP_BOOK_REPLAY'),
  anyBeatRequiredForMainStory: featuredRelationshipAffinityBeatPlacements.some((entry) => entry.mainStoryRequired),
  anyBeatBlocksStage20Clear: featuredRelationshipAffinityBeatPlacements.some((entry) => entry.stage20ClearBlockedIfUnseen),
  readingGrantsPower: featuredRelationshipAffinityBeatPlacements.some((entry) => entry.readingGrantsPower),
  exactStageFrozen: featuredRelationshipAffinityBeatPlacements.some((entry) => entry.exactStageFrozen),
  runtimeAutoPromotionAllowed: false,
  status: FEATURED_AFFINITY_PLACEMENT_STATUS,
} as const;
