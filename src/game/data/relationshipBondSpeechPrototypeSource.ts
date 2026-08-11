import {
  currentRelationshipInventoryById,
  type CurrentRelationCharacterId,
} from './currentRelationshipInventory.ts';
import {
  RELATIONSHIP_SPEECH_MOMENTS,
  currentRelationshipSpeechProgressionEntries,
  type RelationshipSpeechMoment,
} from './relationshipSpeechProgressionSource.ts';

export const RELATIONSHIP_BOND_TUNING_STATUS = 'PROTOTYPE_TUNING_NOT_FINAL' as const;

export const PROTOTYPE_BOND_THRESHOLDS = {
  FIRST_READ: 0,
  ALLY: 15,
  TRUST: 35,
  DEEP_TRUST: 65,
  DAWN: 90,
} as const;

export type PrototypeBondProgressMoment = keyof typeof PROTOTYPE_BOND_THRESHOLDS;
export type PrototypeRelationshipStoryGateState = 'NONE' | 'CHOSEN_TRUST' | 'DAWN_PROOF';

export const PROTOTYPE_BOND_EVENT_WEIGHTS = [
  {
    id: 'FIRST_SHARED_DAWN',
    scoreDelta: 10,
    perRunCap: 10,
    lifetimeMode: 'ONCE_PER_RELATION',
    meaning: '初めて同じ夜を生還する。単なるmenu選択ではなく、一緒に夜明けした経験を最初の大きな接続にする。',
  },
  {
    id: 'NEW_STAGE_SHARED_DAWN',
    scoreDelta: 6,
    perRunCap: 6,
    lifetimeMode: 'ONCE_PER_RELATION_STAGE',
    meaning: 'まだ二人で越えていないStageを一緒に夜明けする。低Stage反復だけで最終Bondへ行くのを防ぐ。',
  },
  {
    id: 'ASSIST_SUCCESS',
    scoreDelta: 1,
    perRunCap: 3,
    lifetimeMode: 'REPEATABLE_CAPPED',
    meaning: 'Support Assistが実際に役立った。回数farmではなくrun内capを置く。',
  },
  {
    id: 'CRISIS_RESCUE',
    scoreDelta: 3,
    perRunCap: 3,
    lifetimeMode: 'REPEATABLE_CAPPED',
    meaning: '危機救援が成立した。危機をわざと作るfarmにならないようrun内一回相当へ抑える。',
  },
  {
    id: 'PAIR_OBJECTIVE',
    scoreDelta: 8,
    perRunCap: 8,
    lifetimeMode: 'ONCE_PER_OBJECTIVE',
    meaning: 'その関係だから意味があるPair条件を達成する。関係Arcのgameplay payoffへ使う。',
  },
  {
    id: 'REPEATED_SAME_STAGE_DAWN',
    scoreDelta: 1,
    perRunCap: 1,
    lifetimeMode: 'REPEATABLE_CAPPED',
    meaning: '同じStageを繰り返しても完全な無意味にはしないが、これだけで高Bondへ到達しにくくする。',
  },
  {
    id: 'READ_DIALOGUE',
    scoreDelta: 0,
    perRunCap: 0,
    lifetimeMode: 'NO_POWER_VALUE',
    meaning: '会話を読むこと自体はBond powerの支払い条件にしない。読む/読まないでcombat power差を作らない。',
  },
] as const;

export type PrototypeBondEventId = (typeof PROTOTYPE_BOND_EVENT_WEIGHTS)[number]['id'];

const nonCrisisMoments: readonly PrototypeBondProgressMoment[] = [
  'FIRST_READ', 'ALLY', 'TRUST', 'DEEP_TRUST', 'DAWN',
] as const;
const momentOrder = new Map<RelationshipSpeechMoment, number>(RELATIONSHIP_SPEECH_MOMENTS.map((moment, index) => [moment, index]));
const speechByRelationId = new Map(currentRelationshipSpeechProgressionEntries.map((entry) => [entry.relationId, entry]));

function clampPrototypeBondScore(score: number): number {
  if (!Number.isFinite(score)) throw new Error('prototype Bond score must be finite');
  return Math.min(100, Math.max(0, score));
}

export function resolvePrototypeBondScoreMoment(score: number): PrototypeBondProgressMoment {
  const normalized = clampPrototypeBondScore(score);
  let result: PrototypeBondProgressMoment = 'FIRST_READ';
  for (const moment of nonCrisisMoments) {
    if (normalized >= PROTOTYPE_BOND_THRESHOLDS[moment]) result = moment;
  }
  return result;
}

function minMoment(a: PrototypeBondProgressMoment, b: PrototypeBondProgressMoment): PrototypeBondProgressMoment {
  return (momentOrder.get(a) ?? 0) <= (momentOrder.get(b) ?? 0) ? a : b;
}

export type ResolvePrototypeRelationshipSpeechInput = {
  relationId: string;
  speakerId: CurrentRelationCharacterId;
  bondScore: number;
  storyGateState: PrototypeRelationshipStoryGateState;
  crisisActive: boolean;
};

export type ResolvedPrototypeRelationshipSpeech = {
  relationId: string;
  speakerId: CurrentRelationCharacterId;
  targetId: CurrentRelationCharacterId;
  rawBondScore: number;
  normalizedBondScore: number;
  scoreEligibleMoment: PrototypeBondProgressMoment;
  effectiveMoment: RelationshipSpeechMoment;
  storyGateState: PrototypeRelationshipStoryGateState;
  detailedArcStoryGateRequired: boolean;
  address: string;
  speechDelta: string;
  intimacySignal: string;
  invariant: string;
  romanceBoundary: (typeof currentRelationshipSpeechProgressionEntries)[number]['romanceBoundary'];
  tuningStatus: typeof RELATIONSHIP_BOND_TUNING_STATUS;
  runtimeAutoPromotionAllowed: false;
};

export function resolvePrototypeRelationshipSpeech(
  input: ResolvePrototypeRelationshipSpeechInput,
): ResolvedPrototypeRelationshipSpeech {
  const relation = currentRelationshipInventoryById.get(input.relationId);
  const speech = speechByRelationId.get(input.relationId);
  if (!relation || !speech) throw new Error(`unknown Current relationship: ${input.relationId}`);

  const track = speech.tracks.find((entry) => entry.speakerId === input.speakerId);
  if (!track) throw new Error(`speaker ${input.speakerId} is not in relationship ${input.relationId}`);

  const normalizedBondScore = clampPrototypeBondScore(input.bondScore);
  const scoreEligibleMoment = resolvePrototypeBondScoreMoment(normalizedBondScore);

  let gatedMoment = scoreEligibleMoment;
  if (relation.detailedMachineArcAvailable && input.storyGateState === 'NONE') {
    gatedMoment = minMoment(gatedMoment, 'TRUST');
  }
  if (gatedMoment === 'DAWN' && input.storyGateState !== 'DAWN_PROOF') {
    gatedMoment = 'DEEP_TRUST';
  }
  if (input.storyGateState === 'CHOSEN_TRUST' && gatedMoment === 'DAWN') {
    gatedMoment = 'DEEP_TRUST';
  }

  const effectiveMoment: RelationshipSpeechMoment = input.crisisActive && normalizedBondScore >= PROTOTYPE_BOND_THRESHOLDS.ALLY
    ? 'CRISIS'
    : gatedMoment;

  const momentIndex = RELATIONSHIP_SPEECH_MOMENTS.indexOf(effectiveMoment);
  if (momentIndex < 0) throw new Error(`unknown relationship speech moment: ${effectiveMoment}`);

  return {
    relationId: input.relationId,
    speakerId: track.speakerId,
    targetId: track.targetId,
    rawBondScore: input.bondScore,
    normalizedBondScore,
    scoreEligibleMoment,
    effectiveMoment,
    storyGateState: input.storyGateState,
    detailedArcStoryGateRequired: relation.detailedMachineArcAvailable,
    address: track.addressPath[momentIndex],
    speechDelta: track.speechDeltaPath[momentIndex],
    intimacySignal: track.intimacySignalPath[momentIndex],
    invariant: track.invariant,
    romanceBoundary: speech.romanceBoundary,
    tuningStatus: RELATIONSHIP_BOND_TUNING_STATUS,
    runtimeAutoPromotionAllowed: false,
  };
}

export const relationshipBondSpeechPrototypeSummary = {
  relationshipCount: currentRelationshipSpeechProgressionEntries.length,
  directedSpeechTrackCount: currentRelationshipSpeechProgressionEntries.reduce((sum, entry) => sum + entry.tracks.length, 0),
  prototypeScoreMin: 0,
  prototypeScoreMax: 100,
  thresholdCount: Object.keys(PROTOTYPE_BOND_THRESHOLDS).length,
  crisisIsSeparateFromMonotonicBond: true,
  detailedArcDeepTrustRequiresStoryGate: true,
  dawnRequiresDawnProof: true,
  readingDialogueAddsBondScore: false,
  tuningStatus: RELATIONSHIP_BOND_TUNING_STATUS,
  numericValuesFinal: false,
  romanceAutoPromotionAllowed: false,
  runtimeAutoPromotionAllowed: false,
} as const;
