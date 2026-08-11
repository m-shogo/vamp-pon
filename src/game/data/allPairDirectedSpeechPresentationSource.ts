import { currentCharacterCombatKitEntries } from './currentCharacterCombatKitSource.ts';
import type { CurrentRelationCharacterId } from './currentRelationshipInventory.ts';
import {
  GENERIC_PAIR_SPEECH_REGISTER,
  currentPairKey,
  currentPairwiseBondLaneByKey,
  currentPairwiseBondLanes,
} from './pairwiseBondTrioBattleSource.ts';
import {
  PROTOTYPE_BOND_THRESHOLDS,
  resolvePrototypeBondScoreMoment,
  resolvePrototypeRelationshipSpeech,
  type PrototypeRelationshipStoryGateState,
} from './relationshipBondSpeechPrototypeSource.ts';
import {
  currentRelationshipSpeechProgressionEntries,
  type RelationshipSpeechMoment,
} from './relationshipSpeechProgressionSource.ts';

export const ALL_PAIR_DIRECTED_SPEECH_STATUS = 'PROTOTYPE_420_DIRECTIONAL_PRESENTATION_NOT_FINAL' as const;
export const BASELINE_ADDRESS_STATUS = 'PROTOTYPE_DEFAULT_ADDRESS_NOT_CANON' as const;
export const DIRECTED_SPEECH_SCORE_COMBINATION = 'MIN_SHARED_BOND_AND_DIRECTED_AFFINITY' as const;

export type BaselineSpeakerRegister = 'POLITE_NAME_SAN' | 'DIRECT_NAME' | 'YOUNGER_POLITE';

export type BaselineSpeakerRegisterProfile = {
  speakerId: CurrentRelationCharacterId;
  register: BaselineSpeakerRegister;
  defaultAddressRule: string;
  stableVoiceRule: string;
  crisisRegressionRule: string;
};

const speakerRegisterProfiles: readonly BaselineSpeakerRegisterProfile[] = [
  { speakerId: 'yui', register: 'POLITE_NAME_SAN', defaultAddressRule: '相手名＋さんを暫定default。専用関係では既存trackを優先。', stableVoiceRule: '確認と相手への返却を残す。', crisisRegressionRule: '抱え込みと確認過多へ戻りやすい。' },
  { speakerId: 'asa', register: 'DIRECT_NAME', defaultAddressRule: '相手名を短く呼ぶ暫定default。', stableVoiceRule: '短く速いが、信頼後は命令より共同主語が増える。', crisisRegressionRule: '急ぎと断定へ戻る。' },
  { speakerId: 'nagi', register: 'POLITE_NAME_SAN', defaultAddressRule: '相手名＋さんを暫定default。', stableVoiceRule: '言葉数は増やさず、任せる語を増やす。', crisisRegressionRule: '閉じる/止める判断が強くなる。' },
  { speakerId: 'michiru', register: 'POLITE_NAME_SAN', defaultAddressRule: '相手名＋さんを暫定default。', stableVoiceRule: '軽快さを残しつつ相談と分岐提案が増える。', crisisRegressionRule: '一本のrouteへ急ぎやすい。' },
  { speakerId: 'tomori', register: 'POLITE_NAME_SAN', defaultAddressRule: '相手名＋さんを暫定default。', stableVoiceRule: '作業語中心。信頼は「触っていい？」と工具の受け渡しで出す。', crisisRegressionRule: '元通りへ急ぐ。' },
  { speakerId: 'sen', register: 'DIRECT_NAME', defaultAddressRule: '相手名を暫定default。先生役の敬称は専用trackだけで固定。', stableVoiceRule: '説明から質問へ移る。', crisisRegressionRule: '説明が長く正解を固定しやすい。' },
  { speakerId: 'ritsu', register: 'DIRECT_NAME', defaultAddressRule: '相手名を暫定default。', stableVoiceRule: '保護命令から役割分担へ移る。', crisisRegressionRule: '全部自分で受けようとする。' },
  { speakerId: 'koyori', register: 'YOUNGER_POLITE', defaultAddressRule: '相手名＋さんを暫定default。家族/先生など専用呼称は既存trackを絶対優先。', stableVoiceRule: '遠慮が減り、訂正やお願いを自分から言える。', crisisRegressionRule: '強がって弱音を隠す。' },
  { speakerId: 'gen', register: 'DIRECT_NAME', defaultAddressRule: '相手名を暫定default。', stableVoiceRule: '古い経験を答えではなく比較として渡す。', crisisRegressionRule: '昔のやり方へ寄りやすい。' },
  { speakerId: 'hana', register: 'DIRECT_NAME', defaultAddressRule: '相手名を暫定default。', stableVoiceRule: '世話を焼く言葉から、相手の手を待つ言葉へ移る。', crisisRegressionRule: '自分で全部残そうとする。' },
  { speakerId: 'yubi', register: 'POLITE_NAME_SAN', defaultAddressRule: '相手名＋さんを暫定default。', stableVoiceRule: '届ける確認に「今でいい？」が増える。', crisisRegressionRule: '即時配達へ急ぐ。' },
  { speakerId: 'madoka', register: 'POLITE_NAME_SAN', defaultAddressRule: '相手名＋さんを暫定default。', stableVoiceRule: '観測報告から個人的な気づきを伝えるようになる。', crisisRegressionRule: '見ているだけへ戻りやすい。' },
  { speakerId: 'shiro', register: 'POLITE_NAME_SAN', defaultAddressRule: '相手名＋さんを暫定default。', stableVoiceRule: '分類語を減らし、未分類のまま相談できる。', crisisRegressionRule: '記録語だけへ閉じる。' },
  { speakerId: 'tobari', register: 'DIRECT_NAME', defaultAddressRule: '相手名を暫定default。', stableVoiceRule: '境界条件を伝え、相手へ開閉判断を返す。', crisisRegressionRule: '閉じる判断が先行する。' },
  { speakerId: 'nemu', register: 'POLITE_NAME_SAN', defaultAddressRule: '相手名＋さんを暫定default。', stableVoiceRule: '夢の比喩を共有しつつ、現実確認を頼める。', crisisRegressionRule: '夢へ逃げて説明を曖昧にする。' },
  { speakerId: 'kuroori', register: 'DIRECT_NAME', defaultAddressRule: '相手名を暫定default。', stableVoiceRule: '饒舌にはならず、理由と解除条件を一語だけ増やす。', crisisRegressionRule: '一方的に閉じる。' },
  { speakerId: 'kage1', register: 'DIRECT_NAME', defaultAddressRule: '相手名を暫定default。', stableVoiceRule: '「任せた」を言えることを親密さにする。', crisisRegressionRule: '全部引き受ける。' },
  { speakerId: 'kage2', register: 'DIRECT_NAME', defaultAddressRule: '相手名を暫定default。', stableVoiceRule: '隠す理由を少しだけ本人へ返す。', crisisRegressionRule: '説明せず痕跡ごと消す。' },
  { speakerId: 'kage3', register: 'POLITE_NAME_SAN', defaultAddressRule: '相手名＋さんを暫定default。専用trackで敬語維持が明記された場合はそれを優先。', stableVoiceRule: '敬語は親密さと無関係に維持できる。', crisisRegressionRule: '測定可能なものだけへ狭まる。' },
  { speakerId: 'kage4', register: 'POLITE_NAME_SAN', defaultAddressRule: '相手名＋さんを暫定default。', stableVoiceRule: '未完を相手へ預ける語が増える。', crisisRegressionRule: '何も触らせなくなる。' },
  { speakerId: 'ren', register: 'POLITE_NAME_SAN', defaultAddressRule: '相手名＋さんを暫定default。', stableVoiceRule: '差分報告から「今どうしたい？」へ移る。', crisisRegressionRule: '過去との差分だけを追う。' },
] as const;

const profileBySpeaker = new Map(speakerRegisterProfiles.map((entry) => [entry.speakerId, entry]));
const characterNameById = new Map(currentCharacterCombatKitEntries.map((entry) => [entry.characterId, entry.characterName]));
const featuredSpeechByRelationId = new Map(currentRelationshipSpeechProgressionEntries.map((entry) => [entry.relationId, entry]));

function clampPrototypeScore(score: number): number {
  if (!Number.isFinite(score)) throw new Error('relationship speech score must be finite');
  return Math.min(100, Math.max(0, score));
}

function baselineDraftAddress(speakerId: CurrentRelationCharacterId, targetId: CurrentRelationCharacterId): string {
  const profile = profileBySpeaker.get(speakerId);
  const targetName = characterNameById.get(targetId);
  if (!profile || !targetName) throw new Error(`missing baseline address dependency: ${speakerId}->${targetId}`);
  if (profile.register === 'DIRECT_NAME') return targetName;
  return `${targetName}さん`;
}

function genericSpeechDelta(moment: RelationshipSpeechMoment): string {
  return GENERIC_PAIR_SPEECH_REGISTER[moment];
}

function genericNameFrequency(moment: RelationshipSpeechMoment): string {
  const byMoment: Record<RelationshipSpeechMoment, string> = {
    FIRST_READ: '必要時だけ。名前を親密さの記号として連呼しない。',
    ALLY: '危険通知・Assist時に名前が増える。',
    TRUST: '依頼・相談時に自然な呼名が増える。',
    DEEP_TRUST: '名前を呼ばない短い合図や沈黙も成立する。',
    CRISIS: '呼名が鋭くなる/役割語へ戻ることがあるが、stored関係値は下げない。',
    DAWN: '呼称変更を必須にせず、そのpairに自然な呼び方と沈黙を使う。',
  };
  return byMoment[moment];
}

export type AllPairDirectedSpeechLane = {
  directionKey: string;
  pairKey: string;
  speakerId: CurrentRelationCharacterId;
  targetId: CurrentRelationCharacterId;
  speakerName: string;
  targetName: string;
  source: 'FEATURED_AUTHORED_OVERRIDE' | 'BASELINE_GENERIC_REGISTER';
  featuredRelationId: string | null;
  baselineRegister: BaselineSpeakerRegister;
  prototypeDefaultAddress: string;
  baselineAddressStatus: typeof BASELINE_ADDRESS_STATUS;
  sharedBondStored: true;
  directedAffinityStored: true;
  affinityAsymmetryPreserved: true;
  thirdPartyTransferAllowed: false;
  romanceInferred: false;
  runtimeAutoPromotionAllowed: false;
};

const directedLanes: AllPairDirectedSpeechLane[] = [];
for (const pair of currentPairwiseBondLanes) {
  const [a, b] = pair.participants;
  for (const [speakerId, targetId] of [[a, b], [b, a]] as const) {
    const profile = profileBySpeaker.get(speakerId);
    const speakerName = characterNameById.get(speakerId);
    const targetName = characterNameById.get(targetId);
    if (!profile || !speakerName || !targetName) throw new Error(`missing all-pair speech dependency: ${speakerId}->${targetId}`);
    directedLanes.push({
      directionKey: `${speakerId}->${targetId}`,
      pairKey: pair.pairKey,
      speakerId,
      targetId,
      speakerName,
      targetName,
      source: pair.featuredRelationId ? 'FEATURED_AUTHORED_OVERRIDE' : 'BASELINE_GENERIC_REGISTER',
      featuredRelationId: pair.featuredRelationId,
      baselineRegister: profile.register,
      prototypeDefaultAddress: baselineDraftAddress(speakerId, targetId),
      baselineAddressStatus: BASELINE_ADDRESS_STATUS,
      sharedBondStored: true,
      directedAffinityStored: true,
      affinityAsymmetryPreserved: true,
      thirdPartyTransferAllowed: false,
      romanceInferred: false,
      runtimeAutoPromotionAllowed: false,
    });
  }
}

export const allPairDirectedSpeechLanes = directedLanes as readonly AllPairDirectedSpeechLane[];
export const allPairDirectedSpeechLaneByKey = new Map(allPairDirectedSpeechLanes.map((entry) => [entry.directionKey, entry]));

export type ResolveAllPairDirectedSpeechInput = {
  speakerId: CurrentRelationCharacterId;
  targetId: CurrentRelationCharacterId;
  sharedBondScore: number;
  directedAffinityScore: number;
  storyGateState: PrototypeRelationshipStoryGateState;
  crisisActive: boolean;
};

export type ResolvedAllPairDirectedSpeechPresentation = {
  directionKey: string;
  pairKey: string;
  speakerId: CurrentRelationCharacterId;
  targetId: CurrentRelationCharacterId;
  source: AllPairDirectedSpeechLane['source'];
  featuredRelationId: string | null;
  normalizedSharedBondScore: number;
  normalizedDirectedAffinityScore: number;
  combinedSpeechScore: number;
  scoreCombination: typeof DIRECTED_SPEECH_SCORE_COMBINATION;
  effectiveMoment: RelationshipSpeechMoment;
  address: string;
  addressStatus: 'AUTHORED_CURRENT' | typeof BASELINE_ADDRESS_STATUS;
  speechDelta: string;
  intimacySignal: string;
  invariant: string;
  affinityAsymmetryPreserved: true;
  romanceAutoPromotionAllowed: false;
  runtimeAutoPromotionAllowed: false;
};

export function resolveAllPairDirectedSpeechPresentation(
  input: ResolveAllPairDirectedSpeechInput,
): ResolvedAllPairDirectedSpeechPresentation {
  if (input.speakerId === input.targetId) throw new Error('relationship speech requires two distinct Characters');
  const pairKey = currentPairKey(input.speakerId, input.targetId);
  const pair = currentPairwiseBondLaneByKey.get(pairKey);
  const lane = allPairDirectedSpeechLaneByKey.get(`${input.speakerId}->${input.targetId}`);
  if (!pair || !lane) throw new Error(`unknown Current21 pair speech lane: ${input.speakerId}->${input.targetId}`);

  const normalizedSharedBondScore = clampPrototypeScore(input.sharedBondScore);
  const normalizedDirectedAffinityScore = clampPrototypeScore(input.directedAffinityScore);
  const combinedSpeechScore = Math.min(normalizedSharedBondScore, normalizedDirectedAffinityScore);

  if (pair.featuredRelationId && featuredSpeechByRelationId.has(pair.featuredRelationId)) {
    const featured = resolvePrototypeRelationshipSpeech({
      relationId: pair.featuredRelationId,
      speakerId: input.speakerId,
      bondScore: combinedSpeechScore,
      storyGateState: input.storyGateState,
      crisisActive: input.crisisActive,
    });
    return {
      directionKey: lane.directionKey,
      pairKey,
      speakerId: input.speakerId,
      targetId: input.targetId,
      source: 'FEATURED_AUTHORED_OVERRIDE',
      featuredRelationId: pair.featuredRelationId,
      normalizedSharedBondScore,
      normalizedDirectedAffinityScore,
      combinedSpeechScore,
      scoreCombination: DIRECTED_SPEECH_SCORE_COMBINATION,
      effectiveMoment: featured.effectiveMoment,
      address: featured.address,
      addressStatus: 'AUTHORED_CURRENT',
      speechDelta: featured.speechDelta,
      intimacySignal: featured.intimacySignal,
      invariant: featured.invariant,
      affinityAsymmetryPreserved: true,
      romanceAutoPromotionAllowed: false,
      runtimeAutoPromotionAllowed: false,
    };
  }

  let effectiveMoment: RelationshipSpeechMoment = resolvePrototypeBondScoreMoment(combinedSpeechScore);
  if (effectiveMoment === 'DAWN' && input.storyGateState !== 'DAWN_PROOF') effectiveMoment = 'DEEP_TRUST';
  if (input.crisisActive && combinedSpeechScore >= PROTOTYPE_BOND_THRESHOLDS.ALLY) effectiveMoment = 'CRISIS';

  const profile = profileBySpeaker.get(input.speakerId);
  if (!profile) throw new Error(`missing speaker profile: ${input.speakerId}`);
  return {
    directionKey: lane.directionKey,
    pairKey,
    speakerId: input.speakerId,
    targetId: input.targetId,
    source: 'BASELINE_GENERIC_REGISTER',
    featuredRelationId: null,
    normalizedSharedBondScore,
    normalizedDirectedAffinityScore,
    combinedSpeechScore,
    scoreCombination: DIRECTED_SPEECH_SCORE_COMBINATION,
    effectiveMoment,
    address: lane.prototypeDefaultAddress,
    addressStatus: BASELINE_ADDRESS_STATUS,
    speechDelta: genericSpeechDelta(effectiveMoment),
    intimacySignal: genericNameFrequency(effectiveMoment),
    invariant: `${profile.stableVoiceRule} ${GENERIC_PAIR_SPEECH_REGISTER.addressRule}`,
    affinityAsymmetryPreserved: true,
    romanceAutoPromotionAllowed: false,
    runtimeAutoPromotionAllowed: false,
  };
}

export const allPairDirectedSpeechPresentationSummary = {
  pairCount: currentPairwiseBondLanes.length,
  directedLaneCount: allPairDirectedSpeechLanes.length,
  featuredDirectedLaneCount: allPairDirectedSpeechLanes.filter((entry) => entry.source === 'FEATURED_AUTHORED_OVERRIDE').length,
  baselineDirectedLaneCount: allPairDirectedSpeechLanes.filter((entry) => entry.source === 'BASELINE_GENERIC_REGISTER').length,
  speakerProfileCount: speakerRegisterProfiles.length,
  addressPrototypeNotCanonCount: allPairDirectedSpeechLanes.filter((entry) => entry.source === 'BASELINE_GENERIC_REGISTER').length,
  scoreCombination: DIRECTED_SPEECH_SCORE_COMBINATION,
  affinityAsymmetryPreserved: true,
  universalNicknameProgressionRequired: false,
  romanceAutoPromotionAllowed: false,
  runtimeAutoPromotionAllowed: false,
  status: ALL_PAIR_DIRECTED_SPEECH_STATUS,
} as const;
