import type { CurrentRelationCharacterId } from './currentRelationshipInventory.ts';
import {
  buildYatsukagePartyEncounterPlan,
  current21YatsukageRelationshipEntries,
  type Current21YatsukageRelationEntry,
} from './current21YatsukageRelationshipSource.ts';
import { yatsukageCallNames } from './yatsukageIdentitySource.ts';

export const YATSUKAGE_ENCOUNTER_MEMORY_STATUS = 'CONTENT_LEDGER_CONTRACT_RUNTIME_NOT_IMPLEMENTED' as const;

export const YATSUKAGE_RELATION_MEMORY_PHASES = [
  'FIRST_ENCOUNTER',
  'CALL_NAME_RECOGNIZED',
  'PAST_CONTEXT_KNOWN',
  'REINTERPRETED',
] as const;

export type YatsukageRelationMemoryPhase = (typeof YATSUKAGE_RELATION_MEMORY_PHASES)[number];

export type YatsukageEncounterMemoryEventKind =
  | 'FIRST_ENCOUNTER_SEEN'
  | 'CALL_NAME_OBSERVED'
  | 'PAST_FRAGMENT_OBSERVED'
  | 'REINTERPRETATION_BEAT_SEEN'
  | 'COMBAT_CLEAR';

export type YatsukageEncounterMemoryEvent = {
  eventId: string;
  enemyId: string;
  characterId: CurrentRelationCharacterId;
  kind: YatsukageEncounterMemoryEventKind;
};

export type YatsukageRelationMemoryState = {
  relationId: string;
  enemyId: string;
  characterId: CurrentRelationCharacterId;
  phase: YatsukageRelationMemoryPhase;
  firstEncounterSeen: boolean;
  callNameObserved: boolean;
  pastFragmentObserved: boolean;
  reinterpretationBeatSeen: boolean;
  combatClearCountObserved: number;
  combatClearAdvancesRelationshipPhase: false;
  powerRewardGrantedByReading: false;
  friendshipOrRecruitmentProgressCreated: false;
};

export type YatsukageRelationPresentation = {
  relationId: string;
  enemyId: string;
  characterId: CurrentRelationCharacterId;
  phase: YatsukageRelationMemoryPhase;
  enemyDisplayName: string;
  emotionalLane: Current21YatsukageRelationEntry['primaryLane'];
  presentationText: string;
  nextQuestion: string;
  powerRewardAttached: false;
  runtimeAutoPromotionAllowed: false;
};

const phaseOrder = new Map<YatsukageRelationMemoryPhase, number>(
  YATSUKAGE_RELATION_MEMORY_PHASES.map((phase, index) => [phase, index]),
);
const relationByKey = new Map(
  current21YatsukageRelationshipEntries.map((entry) => [`${entry.enemyId}:${entry.characterId}`, entry]),
);
const callNameByEnemyId = new Map(yatsukageCallNames.map((entry) => [entry.enemyId, entry]));

function relationFor(enemyId: string, characterId: CurrentRelationCharacterId): Current21YatsukageRelationEntry {
  const relation = relationByKey.get(`${enemyId}:${characterId}`);
  if (!relation) throw new Error(`unknown 八影 relation: ${enemyId}/${characterId}`);
  return relation;
}

export function createEmptyYatsukageRelationMemoryState(
  enemyId: string,
  characterId: CurrentRelationCharacterId,
): YatsukageRelationMemoryState {
  const relation = relationFor(enemyId, characterId);
  return {
    relationId: relation.relationId,
    enemyId,
    characterId,
    phase: 'FIRST_ENCOUNTER',
    firstEncounterSeen: false,
    callNameObserved: false,
    pastFragmentObserved: false,
    reinterpretationBeatSeen: false,
    combatClearCountObserved: 0,
    combatClearAdvancesRelationshipPhase: false,
    powerRewardGrantedByReading: false,
    friendshipOrRecruitmentProgressCreated: false,
  };
}

function derivePhase(state: Omit<YatsukageRelationMemoryState, 'phase'>): YatsukageRelationMemoryPhase {
  if (state.reinterpretationBeatSeen && state.pastFragmentObserved && state.callNameObserved && state.firstEncounterSeen) {
    return 'REINTERPRETED';
  }
  if (state.pastFragmentObserved && state.callNameObserved && state.firstEncounterSeen) return 'PAST_CONTEXT_KNOWN';
  if (state.callNameObserved && state.firstEncounterSeen) return 'CALL_NAME_RECOGNIZED';
  return 'FIRST_ENCOUNTER';
}

export function applyYatsukageEncounterMemoryEvent(
  current: YatsukageRelationMemoryState,
  event: YatsukageEncounterMemoryEvent,
): YatsukageRelationMemoryState {
  if (current.enemyId !== event.enemyId || current.characterId !== event.characterId) {
    throw new Error(`八影 encounter event relation mismatch: ${event.eventId}`);
  }

  const nextBase = {
    ...current,
    combatClearCountObserved: current.combatClearCountObserved,
  };

  switch (event.kind) {
    case 'FIRST_ENCOUNTER_SEEN':
      nextBase.firstEncounterSeen = true;
      break;
    case 'CALL_NAME_OBSERVED':
      nextBase.callNameObserved = true;
      break;
    case 'PAST_FRAGMENT_OBSERVED':
      nextBase.pastFragmentObserved = true;
      break;
    case 'REINTERPRETATION_BEAT_SEEN':
      nextBase.reinterpretationBeatSeen = true;
      break;
    case 'COMBAT_CLEAR':
      nextBase.combatClearCountObserved += 1;
      break;
    default: {
      const neverKind: never = event.kind;
      throw new Error(`unknown 八影 encounter event: ${neverKind}`);
    }
  }

  const { phase: _ignored, ...withoutPhase } = nextBase;
  return {
    ...withoutPhase,
    phase: derivePhase(withoutPhase),
  };
}

export function replayYatsukageEncounterMemory(
  enemyId: string,
  characterId: CurrentRelationCharacterId,
  events: readonly YatsukageEncounterMemoryEvent[],
): YatsukageRelationMemoryState {
  const seenEventIds = new Set<string>();
  let state = createEmptyYatsukageRelationMemoryState(enemyId, characterId);
  for (const event of events) {
    if (seenEventIds.has(event.eventId)) continue;
    seenEventIds.add(event.eventId);
    state = applyYatsukageEncounterMemoryEvent(state, event);
  }
  return state;
}

export function buildYatsukageRelationPresentation(
  state: YatsukageRelationMemoryState,
): YatsukageRelationPresentation {
  const relation = relationFor(state.enemyId, state.characterId);
  const identity = callNameByEnemyId.get(state.enemyId);
  if (!identity) throw new Error(`missing 八影 display identity: ${state.enemyId}`);

  const enemyDisplayName = state.phase === 'FIRST_ENCOUNTER'
    ? identity.currentEnemyName
    : state.phase === 'CALL_NAME_RECOGNIZED'
      ? `${identity.callName} / ${identity.currentEnemyName}`
      : `八影・${identity.callName}`;

  const presentationByPhase: Record<YatsukageRelationMemoryPhase, { text: string; question: string }> = {
    FIRST_ENCOUNTER: {
      text: relation.firstReaction,
      question: relation.personalQuestion,
    },
    CALL_NAME_RECOGNIZED: {
      text: `${relation.enemyCallName}の癖を覚えた。${relation.battleDynamic}`,
      question: relation.personalQuestion,
    },
    PAST_CONTEXT_KNOWN: {
      text: `${relation.enemyCallName}の過去を知っても、${relation.lateShift}`,
      question: '理解したことと、許すことを分けたまま何を選ぶか。',
    },
    REINTERPRETED: {
      text: relation.postBattleAction,
      question: '次に同じ敵へ会った時、自分の行動は最初と何が変わるか。',
    },
  };

  const presentation = presentationByPhase[state.phase];
  return {
    relationId: relation.relationId,
    enemyId: relation.enemyId,
    characterId: relation.characterId,
    phase: state.phase,
    enemyDisplayName,
    emotionalLane: relation.primaryLane,
    presentationText: presentation.text,
    nextQuestion: presentation.question,
    powerRewardAttached: false,
    runtimeAutoPromotionAllowed: false,
  };
}

export type YatsukageTrioEncounterPresentationPlan = {
  enemyId: string;
  party: readonly [CurrentRelationCharacterId, CurrentRelationCharacterId, CurrentRelationCharacterId];
  personalPresentations: readonly YatsukageRelationPresentation[];
  openingCandidates: readonly CurrentRelationCharacterId[];
  tacticalReplyCandidates: readonly CurrentRelationCharacterId[];
  afterimageCandidates: readonly CurrentRelationCharacterId[];
  featuredArcCharactersPresent: readonly CurrentRelationCharacterId[];
  sameSpeakerMayNotTakeAllThreeSlots: true;
  combatClearFarmAdvancesRelationship: false;
  runtimeSpeakerHistoryRequiredForFinalArbitration: true;
};

export function buildYatsukageTrioEncounterPresentationPlan(
  enemyId: string,
  party: readonly [CurrentRelationCharacterId, CurrentRelationCharacterId, CurrentRelationCharacterId],
  states: readonly YatsukageRelationMemoryState[],
): YatsukageTrioEncounterPresentationPlan {
  const partyPlan = buildYatsukagePartyEncounterPlan(enemyId, party);
  if (states.length !== 3) throw new Error('八影 trio presentation requires exactly three relation memory states');

  const stateByCharacter = new Map(states.map((state) => [state.characterId, state]));
  const personalPresentations = party.map((characterId) => {
    const state = stateByCharacter.get(characterId);
    if (!state || state.enemyId !== enemyId) throw new Error(`missing 八影 memory state for party member: ${characterId}`);
    return buildYatsukageRelationPresentation(state);
  });

  const featuredSet = new Set(partyPlan.featuredArcCharacterIds);
  const byNarrativePriority = [...party].sort((a, b) => {
    const aFeatured = featuredSet.has(a) ? 1 : 0;
    const bFeatured = featuredSet.has(b) ? 1 : 0;
    if (aFeatured !== bFeatured) return bFeatured - aFeatured;
    const aPhase = phaseOrder.get(stateByCharacter.get(a)?.phase ?? 'FIRST_ENCOUNTER') ?? 0;
    const bPhase = phaseOrder.get(stateByCharacter.get(b)?.phase ?? 'FIRST_ENCOUNTER') ?? 0;
    if (aPhase !== bPhase) return aPhase - bPhase;
    return party.indexOf(a) - party.indexOf(b);
  });

  return {
    enemyId,
    party,
    personalPresentations,
    openingCandidates: byNarrativePriority,
    tacticalReplyCandidates: [byNarrativePriority[1], byNarrativePriority[2], byNarrativePriority[0]],
    afterimageCandidates: [byNarrativePriority[2], byNarrativePriority[0], byNarrativePriority[1]],
    featuredArcCharactersPresent: partyPlan.featuredArcCharacterIds,
    sameSpeakerMayNotTakeAllThreeSlots: true,
    combatClearFarmAdvancesRelationship: false,
    runtimeSpeakerHistoryRequiredForFinalArbitration: true,
  };
}

export const yatsukageEncounterMemorySummary = {
  relationCount: current21YatsukageRelationshipEntries.length,
  phaseCount: YATSUKAGE_RELATION_MEMORY_PHASES.length,
  semanticProgressEventCount: 4,
  combatClearProgressValue: 0,
  duplicateEventIdempotent: true,
  readingGrantsPower: false,
  friendshipOrRecruitmentProgressCreated: false,
  runtimeImplemented: false,
  runtimeAutoPromotionAllowed: false,
  status: YATSUKAGE_ENCOUNTER_MEMORY_STATUS,
} as const;
