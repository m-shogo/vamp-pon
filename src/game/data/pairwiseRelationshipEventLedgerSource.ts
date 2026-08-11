import type { CurrentRelationCharacterId } from './currentRelationshipInventory.ts';
import {
  canonicalCurrentPair,
  currentPairKey,
  type TrioBattleSelection,
} from './pairwiseBondTrioBattleSource.ts';
import { PROTOTYPE_BOND_EVENT_WEIGHTS } from './relationshipBondSpeechPrototypeSource.ts';

export const PAIRWISE_RELATIONSHIP_EVENT_LEDGER_STATUS = 'CONTENT_EVENT_CONTRACT_RUNTIME_NOT_IMPLEMENTED' as const;

export type PairBondCreditMode =
  | 'NONE'
  | 'ONCE_PER_PAIR'
  | 'ONCE_PER_PAIR_STAGE'
  | 'REPEATABLE_CAPPED'
  | 'ONCE_PER_OBJECTIVE'
  | 'ONCE_PER_STORY_KEY';

export type DirectedAffinityCreditMode =
  | 'NONE'
  | 'EXPLICIT_DIRECTION_ONLY'
  | 'EXPLICIT_EACH_DIRECTION';

export type PairwiseRelationshipEventKind =
  | 'PARTY_SELECTED'
  | 'FIRST_SHARED_DAWN'
  | 'NEW_STAGE_SHARED_DAWN'
  | 'REPEATED_SAME_STAGE_DAWN'
  | 'ASSIST_SUCCESS'
  | 'CRISIS_RESCUE'
  | 'PAIR_OBJECTIVE'
  | 'AUTHORED_AFFINITY_SHIFT'
  | 'AUTHORED_MUTUAL_CHOICE'
  | 'READ_DIALOGUE'
  | 'COMBAT_DEFEAT'
  | 'CRISIS_PRESENTATION';

export type PairwiseRelationshipEventRule = {
  kind: PairwiseRelationshipEventKind;
  sharedBondCredit: PairBondCreditMode;
  directedAffinityCredit: DirectedAffinityCreditMode;
  genericCombatMayChangeAffinity: false;
  combatFailureMayDecreaseBond: false;
  combatFailureMayDecreaseAffinity: false;
  readingMayChangePower: false;
  meaning: string;
};

export const PAIRWISE_RELATIONSHIP_EVENT_RULES: readonly PairwiseRelationshipEventRule[] = [
  {
    kind: 'PARTY_SELECTED', sharedBondCredit: 'NONE', directedAffinityCredit: 'NONE',
    genericCombatMayChangeAffinity: false, combatFailureMayDecreaseBond: false, combatFailureMayDecreaseAffinity: false, readingMayChangePower: false,
    meaning: '同じPartyへ入れただけでは関係値を増やさない。編成screenの往復farmを無価値にする。',
  },
  {
    kind: 'FIRST_SHARED_DAWN', sharedBondCredit: 'ONCE_PER_PAIR', directedAffinityCredit: 'NONE',
    genericCombatMayChangeAffinity: false, combatFailureMayDecreaseBond: false, combatFailureMayDecreaseAffinity: false, readingMayChangePower: false,
    meaning: '二人が初めて同じ夜を越えた共有履歴。Bondへだけ記録し、好意の向きまでは決めない。',
  },
  {
    kind: 'NEW_STAGE_SHARED_DAWN', sharedBondCredit: 'ONCE_PER_PAIR_STAGE', directedAffinityCredit: 'NONE',
    genericCombatMayChangeAffinity: false, combatFailureMayDecreaseBond: false, combatFailureMayDecreaseAffinity: false, readingMayChangePower: false,
    meaning: 'まだ二人で越えていないStageを夜明けした履歴。低Stage反復だけでBond上限へ行くのを防ぐ。',
  },
  {
    kind: 'REPEATED_SAME_STAGE_DAWN', sharedBondCredit: 'REPEATABLE_CAPPED', directedAffinityCredit: 'NONE',
    genericCombatMayChangeAffinity: false, combatFailureMayDecreaseBond: false, combatFailureMayDecreaseAffinity: false, readingMayChangePower: false,
    meaning: '同じStage周回にも小さな共有履歴は残すが、強くdiminishする。',
  },
  {
    kind: 'ASSIST_SUCCESS', sharedBondCredit: 'REPEATABLE_CAPPED', directedAffinityCredit: 'NONE',
    genericCombatMayChangeAffinity: false, combatFailureMayDecreaseBond: false, combatFailureMayDecreaseAffinity: false, readingMayChangePower: false,
    meaning: '実際に成立したAssistは「一緒に戦った歴史」へなる。ただし自動攻撃/AI Assistから恋愛や好意を推定しない。',
  },
  {
    kind: 'CRISIS_RESCUE', sharedBondCredit: 'REPEATABLE_CAPPED', directedAffinityCredit: 'NONE',
    genericCombatMayChangeAffinity: false, combatFailureMayDecreaseBond: false, combatFailureMayDecreaseAffinity: false, readingMayChangePower: false,
    meaning: '危機救援は強い共有経験だが、救われた=好きになったを自動化しない。',
  },
  {
    kind: 'PAIR_OBJECTIVE', sharedBondCredit: 'ONCE_PER_OBJECTIVE', directedAffinityCredit: 'EXPLICIT_DIRECTION_ONLY',
    genericCombatMayChangeAffinity: false, combatFailureMayDecreaseBond: false, combatFailureMayDecreaseAffinity: false, readingMayChangePower: false,
    meaning: 'その二人だから意味があるObjective。Bondは記録し、Affinityを動かす場合はContent側が方向を明示する。',
  },
  {
    kind: 'AUTHORED_AFFINITY_SHIFT', sharedBondCredit: 'NONE', directedAffinityCredit: 'EXPLICIT_DIRECTION_ONLY',
    genericCombatMayChangeAffinity: false, combatFailureMayDecreaseBond: false, combatFailureMayDecreaseAffinity: false, readingMayChangePower: false,
    meaning: 'A→Bの感情が変わる物語event専用。UP/DOWNを明示できるが、combat回数から自動生成しない。',
  },
  {
    kind: 'AUTHORED_MUTUAL_CHOICE', sharedBondCredit: 'ONCE_PER_STORY_KEY', directedAffinityCredit: 'EXPLICIT_EACH_DIRECTION',
    genericCombatMayChangeAffinity: false, combatFailureMayDecreaseBond: false, combatFailureMayDecreaseAffinity: false, readingMayChangePower: false,
    meaning: '二人が「変わった相手ともう一度関係を選ぶ」ようなStory beat。双方のAffinity変化は別々に明示する。',
  },
  {
    kind: 'READ_DIALOGUE', sharedBondCredit: 'NONE', directedAffinityCredit: 'NONE',
    genericCombatMayChangeAffinity: false, combatFailureMayDecreaseBond: false, combatFailureMayDecreaseAffinity: false, readingMayChangePower: false,
    meaning: '会話を読む操作は関係powerの支払い条件にしない。',
  },
  {
    kind: 'COMBAT_DEFEAT', sharedBondCredit: 'NONE', directedAffinityCredit: 'NONE',
    genericCombatMayChangeAffinity: false, combatFailureMayDecreaseBond: false, combatFailureMayDecreaseAffinity: false, readingMayChangePower: false,
    meaning: '負けた/倒れたことだけでBondやAffinityを罰として下げない。失敗の意味はStory event側で扱う。',
  },
  {
    kind: 'CRISIS_PRESENTATION', sharedBondCredit: 'NONE', directedAffinityCredit: 'NONE',
    genericCombatMayChangeAffinity: false, combatFailureMayDecreaseBond: false, combatFailureMayDecreaseAffinity: false, readingMayChangePower: false,
    meaning: 'CRISISは話し方だけ一時後退させる。stored関係値を破壊しない。',
  },
] as const;

export type AuthoredAffinityDirection = {
  from: CurrentRelationCharacterId;
  to: CurrentRelationCharacterId;
  direction: 'UP' | 'DOWN' | 'UNCHANGED';
  reasonKey: string;
};

export type PairwiseRelationshipLedgerEvent = {
  eventId: string;
  kind: PairwiseRelationshipEventKind;
  participants: readonly [CurrentRelationCharacterId, CurrentRelationCharacterId];
  stageId?: string;
  objectiveId?: string;
  storyKey?: string;
  actorId?: CurrentRelationCharacterId;
  targetId?: CurrentRelationCharacterId;
  authoredAffinityDirections?: readonly AuthoredAffinityDirection[];
};

export type PairwiseRelationshipLedgerAdmission = {
  eventId: string;
  pairKey: string;
  canonicalParticipants: readonly [CurrentRelationCharacterId, CurrentRelationCharacterId];
  kind: PairwiseRelationshipEventKind;
  sharedBondCredit: PairBondCreditMode;
  directedAffinityCredit: DirectedAffinityCreditMode;
  authoredAffinityDirections: readonly AuthoredAffinityDirection[];
  groupBondCreated: false;
  transitiveAffinityCreated: false;
  numericDeltaFrozen: false;
  runtimeAutoPromotionAllowed: false;
};

const ruleByKind = new Map(PAIRWISE_RELATIONSHIP_EVENT_RULES.map((entry) => [entry.kind, entry]));

function validateDirectionWithinPair(
  direction: AuthoredAffinityDirection,
  participants: readonly [CurrentRelationCharacterId, CurrentRelationCharacterId],
): void {
  const pairSet = new Set(participants);
  if (direction.from === direction.to) throw new Error(`Affinity direction may not self-target: ${direction.reasonKey}`);
  if (!pairSet.has(direction.from) || !pairSet.has(direction.to)) {
    throw new Error(`Affinity direction escaped pair: ${direction.reasonKey}`);
  }
  if (direction.reasonKey.trim().length < 3) throw new Error('authored Affinity direction needs reasonKey');
}

export function admitPairwiseRelationshipLedgerEvent(
  event: PairwiseRelationshipLedgerEvent,
): PairwiseRelationshipLedgerAdmission {
  if (!event.eventId.trim()) throw new Error('relationship ledger eventId is required');
  const [left, right] = canonicalCurrentPair(event.participants[0], event.participants[1]);
  const rule = ruleByKind.get(event.kind);
  if (!rule) throw new Error(`unknown pairwise relationship event kind: ${event.kind}`);
  const authored = event.authoredAffinityDirections ?? [];

  for (const direction of authored) validateDirectionWithinPair(direction, [left, right]);

  if (rule.directedAffinityCredit === 'NONE' && authored.length > 0) {
    throw new Error(`${event.kind} may not smuggle authored Affinity changes`);
  }
  if (rule.directedAffinityCredit === 'EXPLICIT_DIRECTION_ONLY' && authored.length > 1) {
    throw new Error(`${event.kind} accepts at most one explicit Affinity direction`);
  }
  if (rule.directedAffinityCredit === 'EXPLICIT_EACH_DIRECTION') {
    if (authored.length !== 2) throw new Error(`${event.kind} requires two explicit Affinity directions`);
    const keys = new Set(authored.map((entry) => `${entry.from}->${entry.to}`));
    if (keys.size !== 2 || !keys.has(`${left}->${right}`) || !keys.has(`${right}->${left}`)) {
      throw new Error(`${event.kind} requires both directed Affinity lanes`);
    }
  }

  if (event.kind === 'NEW_STAGE_SHARED_DAWN' && !event.stageId) throw new Error('NEW_STAGE_SHARED_DAWN requires stageId');
  if (event.kind === 'PAIR_OBJECTIVE' && !event.objectiveId) throw new Error('PAIR_OBJECTIVE requires objectiveId');
  if (event.kind === 'AUTHORED_AFFINITY_SHIFT' && authored.length !== 1) throw new Error('AUTHORED_AFFINITY_SHIFT requires exactly one direction');
  if (event.kind === 'AUTHORED_MUTUAL_CHOICE' && !event.storyKey) throw new Error('AUTHORED_MUTUAL_CHOICE requires storyKey');
  if ((event.kind === 'ASSIST_SUCCESS' || event.kind === 'CRISIS_RESCUE') && (!event.actorId || !event.targetId)) {
    throw new Error(`${event.kind} requires actorId and targetId`);
  }
  if (event.actorId && ![left, right].includes(event.actorId)) throw new Error('event actor escaped pair');
  if (event.targetId && ![left, right].includes(event.targetId)) throw new Error('event target escaped pair');
  if (event.actorId && event.targetId && event.actorId === event.targetId) throw new Error('event actor/target must differ');

  return {
    eventId: event.eventId,
    pairKey: currentPairKey(left, right),
    canonicalParticipants: [left, right],
    kind: event.kind,
    sharedBondCredit: rule.sharedBondCredit,
    directedAffinityCredit: rule.directedAffinityCredit,
    authoredAffinityDirections: authored,
    groupBondCreated: false,
    transitiveAffinityCreated: false,
    numericDeltaFrozen: false,
    runtimeAutoPromotionAllowed: false,
  };
}

export function decomposeTrioSharedDawnEvents(
  party: TrioBattleSelection,
  stageId: string,
  eventRootId: string,
): readonly PairwiseRelationshipLedgerEvent[] {
  if (new Set(party).size !== 3) throw new Error('trio shared dawn requires three distinct Current21 characters');
  const pairs = [
    [party[0], party[1]],
    [party[0], party[2]],
    [party[1], party[2]],
  ] as const;
  return pairs.map(([a, b]) => ({
    eventId: `${eventRootId}:${currentPairKey(a, b)}`,
    kind: 'NEW_STAGE_SHARED_DAWN' as const,
    participants: [a, b] as const,
    stageId,
  }));
}

export function buildTrioAssistRelationshipEvent(
  party: TrioBattleSelection,
  actorId: CurrentRelationCharacterId,
  targetId: CurrentRelationCharacterId,
  eventId: string,
): PairwiseRelationshipLedgerEvent {
  const partySet = new Set(party);
  if (!partySet.has(actorId) || !partySet.has(targetId) || actorId === targetId) {
    throw new Error('trio Assist relationship event requires two distinct party members');
  }
  return {
    eventId,
    kind: 'ASSIST_SUCCESS',
    participants: canonicalCurrentPair(actorId, targetId),
    actorId,
    targetId,
  };
}

const legacyPrototypeBondIds = new Set(PROTOTYPE_BOND_EVENT_WEIGHTS.map((entry) => entry.id));
const ledgerKinds = new Set(PAIRWISE_RELATIONSHIP_EVENT_RULES.map((entry) => entry.kind));

export const pairwiseRelationshipEventLedgerSummary = {
  eventKindCount: PAIRWISE_RELATIONSHIP_EVENT_RULES.length,
  legacyPrototypeBondEventKindsCovered: [...legacyPrototypeBondIds].filter((id) => ledgerKinds.has(id as PairwiseRelationshipEventKind)).length,
  legacyPrototypeBondEventKindCount: legacyPrototypeBondIds.size,
  bondIsSharedHistory: true,
  bondCombatGrowthAllowed: true,
  genericCombatAffinityGrowthAllowed: false,
  affinityChangesRequireAuthoredDirection: true,
  authoredAffinityMayDecrease: true,
  combatDefeatDecreasesRelationship: false,
  dialogueReadChangesRelationship: false,
  trioEventsDecomposeToPairs: true,
  groupBondCreated: false,
  transitiveAffinityCreated: false,
  numericDeltaFrozen: false,
  runtimeImplemented: false,
  runtimeAutoPromotionAllowed: false,
  status: PAIRWISE_RELATIONSHIP_EVENT_LEDGER_STATUS,
} as const;
