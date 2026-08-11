export const REALITY_ORIGIN_MOBILITY_RULES = {
  authority: 'CURRENT_REALITY_ORIGIN_MOBILITY_DIRECTION',
  authorBackstageHeavy: true,
  typicalMainStoryDisclosurePercentMax: 20,
  birthplaceMustEqualIncidentLocation: false,
  relocationReasonRequiredWhenDifferent: true,
  validMobilityReasons: [
    'EDUCATION',
    'WORK',
    'TRANSFER',
    'MARRIAGE_OR_PARTNERSHIP',
    'FAMILY_CARE',
    'APPRENTICESHIP',
    'RELOCATION_OR_EVACUATION',
    'HEALTH_OR_RECOVERY',
    'PERSONAL_CHOICE',
    'TRAVEL_OR_INVESTIGATION',
  ] as const,
  yui: {
    originPrefecture: 'TOKYO',
    originMunicipality: 'ARAKAWA_KU',
    currentModernHomeBase: 'ARAKAWA_KU',
    exactNeighborhoodFrozen: false,
    shinjukuAssignment: false,
    status: 'USER_DECIDED',
  },
  shinjukuModernCharacterSlot: {
    requiredEventually: true,
    assignedCharacterFrozen: false,
    yuiForbidden: true,
  },
  dialect: {
    constantDialectRequired: false,
    dialectMayBeHidden: true,
    leakTriggers: [
      'FAMILY',
      'OLD_FRIEND',
      'ANGER',
      'FEAR',
      'JOY',
      'RELIEF',
      'EXHAUSTION',
      'INTIMACY',
      'INTOXICATION_ADULT_ONLY',
    ] as const,
    dialectEqualsTruthSerum: false,
    dialectMayBeMockedByNarrative: false,
  },
  brownSkin: {
    equalsForeignOrigin: false,
    equalsPersonality: false,
    equalsOccupation: false,
    currentFutureCandidates: ['hiyori', 'touma'] as const,
  },
  sacredPlace: {
    createdByOrdinarySceneMemory: true,
    tourismChecklistForbidden: true,
    negativeFictionalIncidentDirectlyMappedToRealStoreForbidden: true,
  },
  runtimeAutoPromotionAllowed: false,
} as const;

export const CURRENT21_REALITY_BACKSTAGE_IDS = [
  'yui', 'asa', 'nagi', 'michiru', 'tomori', 'sen', 'ritsu', 'koyori', 'gen', 'hana',
  'yuubi', 'madoka', 'shiro', 'tobari', 'nemu', 'kuroori', 'kaname', 'kasumi', 'toki', 'tsumugi', 'ren',
] as const;

export const FUTURE15_REALITY_BACKSTAGE_IDS = [
  'hiyori', 'serika', 'chloe', 'renji', 'touma', 'kuu', 'yomo', 'noa', 'rum', 'maki', 'suzu', 'io', 'kai', 'nao', 'amane',
] as const;

export const CROSS_ERA_LINEAGE_MEMORY_RULES = {
  authority: 'CURRENT_CROSS_ERA_LINEAGE_MEMORY_DIRECTION',
  physicalMorningRequiredForMemoryReturn: false,
  relationCanCrossRealityEras: true,
  normalWakingExplicitDreamMemoryLost: true,
  parentChildAutomaticallyRecognizeEachOtherInRealityAfterNormalWaking: false,
  descendantAutomaticallyRemembersAncestorDreamMeeting: false,
  implicitChangesMayRemain: true,
  residualForms: [
    'BODY_SENSE',
    'HABIT',
    'PHRASE_FRAGMENT',
    'FOOD_OR_TOOL_PREFERENCE',
    'EMOTIONAL_CHANGE',
    'CHOICE_CAPACITY',
  ] as const,
  resolutionWakingCanRecoverImportantMemory: true,
  highValueRelationTypes: [
    'PARENT_CHILD',
    'GRANDPARENT_DESCENDANT',
    'ANCESTOR_DESCENDANT',
    'FRIEND_DESCENDANT',
    'MENTOR_DESCENDANT',
    'OBJECT_CHAIN',
    'PLACE_CHAIN',
    'ANIMAL_MEMORY',
    'CHOSEN_FAMILY_CHAIN',
  ] as const,
  bloodlineMustExplainMainMystery: false,
  majorityMainCastSecretlyRelatedForbidden: true,
  directBloodlineCrossEraPairsShouldRemainLimited: true,
  unrelatedDreamFriendshipsMustRemainAbundant: true,
  medicalCognitiveDeclineMayNotBeAutoInferredFromDreamResidue: true,
  revealRequiresRealityEvidenceCandidate: true,
  runtimeAutoPromotionAllowed: false,
} as const;

export const realityOriginLineageSummary = {
  current21Count: CURRENT21_REALITY_BACKSTAGE_IDS.length,
  future15Count: FUTURE15_REALITY_BACKSTAGE_IDS.length,
  totalBackstageCharacterCount: CURRENT21_REALITY_BACKSTAGE_IDS.length + FUTURE15_REALITY_BACKSTAGE_IDS.length,
  dialectLeakTriggerCount: REALITY_ORIGIN_MOBILITY_RULES.dialect.leakTriggers.length,
  lineageRelationTypeCount: CROSS_ERA_LINEAGE_MEMORY_RULES.highValueRelationTypes.length,
  yuiArakawaLocked: REALITY_ORIGIN_MOBILITY_RULES.yui.status === 'USER_DECIDED',
  runtimeAutoPromotionAllowed: false,
} as const;
