import { pairwiseBondTrioBattleSummary, trioBattleRelationshipRules } from './pairwiseBondTrioBattleSource.ts';

export const trioBattleInteractionPolicy = {
  status: 'CONTENT_POLICY_RUNTIME_GATED',
  relationshipStorage: 'PAIRWISE_ONLY',
  partyMemberCount: 3,
  pairEdgesPerParty: 3,
  directedAffinityEdgesPerParty: 6,

  formationUi: {
    showTeamAffectionPercent: false,
    showPairEdges: true,
    pairEdgeCount: 3,
    rule: '編成画面は三角形の3辺としてAB/AC/BCを見せられる。Team好感度1本へ平均しない。',
  },

  battleBanterPriority: [
    'EVENT_PARTICIPANTS_FIRST',
    'CRISIS_OR_RESCUE_CONTEXT',
    'AUTHORED_FEATURED_PAIR_BEAT',
    'PAIR_WITH_LEAST_RECENT_SPOTLIGHT',
    'CONTEXTUAL_FRICTION_OR_COMFORT',
    'STABLE_TIE_BREAK_ONLY',
  ] as const,
  banterRules: {
    highestBondAlwaysWins: false,
    featuredPairAlwaysWins: false,
    thirdMemberMustSpeakEveryExchange: false,
    thirdMemberMayReact: true,
    globalBanterCooldownRequired: true,
    recentSpotlightLedgerRequired: true,
    explanation: '高Bondの同じ2人だけが喋り続けない。event当事者と最近喋っていないpairを優先し、3人目を空気化しない。',
  },

  pairAssistArbitration: {
    triggerOwnedByPair: true,
    sharedPartyWindowBudgetRequired: true,
    simultaneousDoubleAssistGuaranteed: false,
    priority: [
      'DIRECT_RESCUE_RELEVANCE',
      'GAMEPLAY_ROLE_FIT',
      'LESS_RECENTLY_TRIGGERED_PAIR',
      'DETERMINISTIC_STABLE_ORDER',
    ] as const,
    highestBondAutoWins: false,
    lowBondDisablesAssist: false,
    rule: '同じ瞬間に2pairがAssist条件を満たしてもBond最大pairを自動採用しない。救援対象/role/直近未使用を先に見る。',
  },

  threeMemberMoment: {
    authoredThreeWayScenesAllowed: true,
    storedTrioBondCreated: false,
    scoreCreditRule: '3人連携は必要に応じAB/AC/BCのpair eventへ分解する。group scoreは生成しない。',
    dialogueRule: '三人会話は三角関係の差分を見せる演出であり、三人を一つの人格/一つの好感度へ平均しない。',
  },

  derivedPresentationShapes: [
    {
      id: 'TWO_PLUS_ONE',
      meaning: '一つのpairが濃く、残り2辺が薄い。3人目の疎外を即悪意にせず、入り方/距離感のsceneを作る。',
      persistedState: false,
    },
    {
      id: 'CHAIN',
      meaning: 'ABとBCは濃いがACは薄い。Bが接着剤にも板挟みにもなれる。',
      persistedState: false,
    },
    {
      id: 'BALANCED',
      meaning: '3辺とも十分育っているが、全員同じ関係ではない。Pairごとの呼び方は残す。',
      persistedState: false,
    },
    {
      id: 'FRICTION_TRIANGLE',
      meaning: '少なくとも一辺に強い摩擦。弱体化罰ではなく、battle bark/役割分担/別Assistへ返す。',
      persistedState: false,
    },
    {
      id: 'ASYMMETRIC_TRIANGLE',
      meaning: '方向別Affinityの差が大きい。片想い/尊敬/過保護/警戒などを三人の場で可視化する。',
      persistedState: false,
    },
  ] as const,

  antiAbuse: {
    dialogueReadingAddsPower: false,
    samePairSpamShouldDominate: false,
    partyRotationRequiredForProgression: false,
    lowBondStatPenaltyAllowed: false,
    favoriteCharacterLockoutAllowed: false,
  },

  runtimeAutoPromotionAllowed: false,
} as const;

export const trioBattleInteractionPolicySummary = {
  pairEdgesPerParty: trioBattleInteractionPolicy.pairEdgesPerParty,
  directedAffinityEdgesPerParty: trioBattleInteractionPolicy.directedAffinityEdgesPerParty,
  possibleTrioCombinationCount: pairwiseBondTrioBattleSummary.possibleTrioCombinationCount,
  storedTrioBondExists: trioBattleRelationshipRules.storedTrioBondExists,
  derivedPresentationShapeCount: trioBattleInteractionPolicy.derivedPresentationShapes.length,
  highestBondAlwaysWinsBanter: trioBattleInteractionPolicy.banterRules.highestBondAlwaysWins,
  highestBondAutoWinsAssist: trioBattleInteractionPolicy.pairAssistArbitration.highestBondAutoWins,
  runtimeAutoPromotionAllowed: false,
} as const;
