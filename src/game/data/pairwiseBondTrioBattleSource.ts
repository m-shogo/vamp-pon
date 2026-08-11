import {
  CURRENT_RELATIONSHIP_CHARACTER_IDS,
  currentRelationshipInventory,
  type CurrentRelationCharacterId,
} from './currentRelationshipInventory.ts';

export const TRIO_BATTLE_RELATIONSHIP_STATUS = 'CONTENT_ARCHITECTURE_RUNTIME_GATED' as const;

const characterDisplayNames: Readonly<Record<CurrentRelationCharacterId, string>> = {
  yui: 'ユイ', asa: 'アサ', nagi: 'ナギ', michiru: 'ミチル', tomori: 'トモリ',
  sen: 'セン', ritsu: 'リツ', koyori: 'コヨリ', gen: 'ゲン', hana: 'ハナ',
  yubi: 'ユウビ', madoka: 'マドカ', shiro: 'シロ', tobari: 'トバリ', nemu: 'ネム',
  kuroori: 'クロオリ', kage1: 'カナメ', kage2: 'カスミ', kage3: 'トキ', kage4: 'ツムギ', ren: 'レン',
};

const rosterOrder = new Map<CurrentRelationCharacterId, number>(
  CURRENT_RELATIONSHIP_CHARACTER_IDS.map((id, index) => [id, index]),
);

export function canonicalCurrentPair(
  a: CurrentRelationCharacterId,
  b: CurrentRelationCharacterId,
): readonly [CurrentRelationCharacterId, CurrentRelationCharacterId] {
  if (a === b) throw new Error(`pair requires two distinct Characters: ${a}`);
  return (rosterOrder.get(a) ?? 999) < (rosterOrder.get(b) ?? 999) ? [a, b] : [b, a];
}

export function currentPairKey(a: CurrentRelationCharacterId, b: CurrentRelationCharacterId): string {
  const [left, right] = canonicalCurrentPair(a, b);
  return `${left}__${right}`;
}

const featuredRelationByPairKey = new Map(
  currentRelationshipInventory.map((entry) => [currentPairKey(entry.participants[0], entry.participants[1]), entry]),
);

export type PairwiseBondLane = {
  pairKey: string;
  participants: readonly [CurrentRelationCharacterId, CurrentRelationCharacterId];
  participantNames: readonly [string, string];
  relationshipDetailTier: 'FEATURED_CURRENT24' | 'BASELINE_CURRENT_PAIR';
  featuredRelationId: string | null;
  sharedBondStoredPerPair: true;
  directedAffinityStoredPerDirection: true;
  directedAffinityKeys: readonly [string, string];
  speechPolicy: 'AUTHORED_DIRECTIONAL_OVERRIDE' | 'SAFE_GENERIC_PROGRESSIVE_REGISTER';
  romanceInferredFromScores: false;
  relationTypeInferredFromScores: false;
  thirdCharacterMayTransferAffinity: false;
  runtimeAutoPromotionAllowed: false;
};

const pairwiseLanes: PairwiseBondLane[] = [];
for (let i = 0; i < CURRENT_RELATIONSHIP_CHARACTER_IDS.length; i += 1) {
  for (let j = i + 1; j < CURRENT_RELATIONSHIP_CHARACTER_IDS.length; j += 1) {
    const a = CURRENT_RELATIONSHIP_CHARACTER_IDS[i];
    const b = CURRENT_RELATIONSHIP_CHARACTER_IDS[j];
    const pairKey = currentPairKey(a, b);
    const featured = featuredRelationByPairKey.get(pairKey) ?? null;
    pairwiseLanes.push({
      pairKey,
      participants: [a, b],
      participantNames: [characterDisplayNames[a], characterDisplayNames[b]],
      relationshipDetailTier: featured ? 'FEATURED_CURRENT24' : 'BASELINE_CURRENT_PAIR',
      featuredRelationId: featured?.id ?? null,
      sharedBondStoredPerPair: true,
      directedAffinityStoredPerDirection: true,
      directedAffinityKeys: [`${a}->${b}`, `${b}->${a}`],
      speechPolicy: featured ? 'AUTHORED_DIRECTIONAL_OVERRIDE' : 'SAFE_GENERIC_PROGRESSIVE_REGISTER',
      romanceInferredFromScores: false,
      relationTypeInferredFromScores: false,
      thirdCharacterMayTransferAffinity: false,
      runtimeAutoPromotionAllowed: false,
    });
  }
}

export const currentPairwiseBondLanes = pairwiseLanes as readonly PairwiseBondLane[];
export const currentPairwiseBondLaneByKey = new Map(currentPairwiseBondLanes.map((entry) => [entry.pairKey, entry]));

export const GENERIC_PAIR_SPEECH_REGISTER = {
  purpose: 'Featured24外の186pairでもBond/Affinity変化を無言にしないための安全fallback。固有呼称を捏造せず、話し方の距離だけ変える。',
  FIRST_READ: '相手の名前は必要時だけ呼ぶ。断定より確認。個人的な弱音や冗談はまだ出さない。',
  ALLY: '戦闘連携の短い呼びかけが増える。助けを受けた時に反応する。',
  TRUST: '命令形を減らし、依頼・相談・「任せる」を増やす。名前を呼ぶ頻度が少し上がる。',
  DEEP_TRUST: '相手の癖を前提に省略できる。弱音・小さな冗談・無言の受け渡しが許可される。',
  CRISIS: 'stored Bond/Affinityは下げず、本人の防衛的な話し方だけ一時的に戻る。',
  DAWN: '親密さを呼び捨てで統一しない。初期にはできなかった自然な依頼・沈黙・名前の呼び方で差分を出す。',
  addressRule: 'Featured24に専用呼称が無いpairは、勝手にさん/ちゃん/呼び捨てを新Canon化しない。固有track追加までCurrentの通常呼称を維持する。',
  romanceAutoPromotionAllowed: false,
} as const;

export type TrioBattleSelection = readonly [
  CurrentRelationCharacterId,
  CurrentRelationCharacterId,
  CurrentRelationCharacterId,
];

export type TrioRelationshipView = {
  members: TrioBattleSelection;
  memberNames: readonly [string, string, string];
  pairKeys: readonly [string, string, string];
  pairLanes: readonly [PairwiseBondLane, PairwiseBondLane, PairwiseBondLane];
  storedTrioBondExists: false;
  trioAffinityExists: false;
  partyMayReadPairStateOnly: true;
  battleCreditRule: string;
  runtimeAutoPromotionAllowed: false;
};

export function resolveTrioRelationshipView(members: TrioBattleSelection): TrioRelationshipView {
  const unique = new Set(members);
  if (unique.size !== 3) throw new Error(`3人編成は異なる3Characterが必要: ${members.join(',')}`);
  for (const member of members) {
    if (!rosterOrder.has(member)) throw new Error(`Current21外のCharacter: ${member}`);
  }

  const keys = [
    currentPairKey(members[0], members[1]),
    currentPairKey(members[0], members[2]),
    currentPairKey(members[1], members[2]),
  ] as const;
  const lanes = keys.map((key) => currentPairwiseBondLaneByKey.get(key));
  if (lanes.some((lane) => !lane)) throw new Error(`trio pair lane missing: ${keys.join(',')}`);

  return {
    members,
    memberNames: members.map((id) => characterDisplayNames[id]) as [string, string, string],
    pairKeys: keys,
    pairLanes: lanes as [PairwiseBondLane, PairwiseBondLane, PairwiseBondLane],
    storedTrioBondExists: false,
    trioAffinityExists: false,
    partyMayReadPairStateOnly: true,
    battleCreditRule: '戦闘eventは関係したpairへ個別creditする。3人同時eventもAB/AC/BCの最大3pair eventへ分解し、group好感度へ変換しない。',
    runtimeAutoPromotionAllowed: false,
  };
}

export const trioBattleRelationshipRules = {
  selectedCharacterCount: 3,
  exactDistinctCharactersRequired: true,
  storedTrioBondExists: false,
  pairBondCountPerParty: 3,
  pairAffinityDirectionsPerParty: 6,
  friendshipTransitive: false,
  example: 'AがBを好き、BがCを好きでも、A→C affinityは自動上昇しない。',
  assistCredit: 'assist/heal/rescue/coverは実際に関与したspeaker/target pairだけへcreditする。',
  sharedClearCredit: '3人全員で初めて夜明けした場合も、AB/AC/BCへpairwise first/shared-clear eventとして記録する。',
  swapRule: '編成から外してもBond/Affinityは消えない。Partyは関係の保存先ではなく、その夜に関係が表面化する場所。',
  favoriteCharacterRule: '低Bond pairを編成禁止にしない。摩擦関係もplayableで、低Bondは弱体化罰ではなく台詞/Assist timing/専用課題の違いへ使う。',
  runtimeAutoPromotionAllowed: false,
} as const;

let trioCombinationCount = 0;
for (let i = 0; i < CURRENT_RELATIONSHIP_CHARACTER_IDS.length; i += 1) {
  for (let j = i + 1; j < CURRENT_RELATIONSHIP_CHARACTER_IDS.length; j += 1) {
    for (let k = j + 1; k < CURRENT_RELATIONSHIP_CHARACTER_IDS.length; k += 1) trioCombinationCount += 1;
  }
}

export const pairwiseBondTrioBattleSummary = {
  currentCharacterCount: CURRENT_RELATIONSHIP_CHARACTER_IDS.length,
  allPairCount: currentPairwiseBondLanes.length,
  featuredPairCount: currentPairwiseBondLanes.filter((entry) => entry.relationshipDetailTier === 'FEATURED_CURRENT24').length,
  baselinePairCount: currentPairwiseBondLanes.filter((entry) => entry.relationshipDetailTier === 'BASELINE_CURRENT_PAIR').length,
  directedAffinityLaneCount: currentPairwiseBondLanes.length * 2,
  possibleTrioCombinationCount: trioCombinationCount,
  pairCountPerTrio: 3,
  directedAffinityCountPerTrio: 6,
  storedTrioBondExists: false,
  runtimeAutoPromotionAllowed: false,
  status: TRIO_BATTLE_RELATIONSHIP_STATUS,
} as const;
