export const CORE5_DISTINCT_ERA_CHARACTER_IDS = [
  'yui',
  'asa',
  'nagi',
  'michiru',
  'tomori',
] as const;

export const DREAM_SOCIAL_WORLD_RULES = {
  authority: 'CURRENT_STORY_WORLD_MASTER_DERIVED',
  core5DistinctRealityEraRequired: true,
  core5DistinctEraCount: 5,
  exactCore5EraAssignmentLocked: false,
  fiveErasDoNotImplyFiveEqualProtagonists: true,

  dreamHasPhysicalMorning: false,
  returnMode: 'WAKING_TO_OWN_REALITY_ERA',

  provisioningMode: 'STORAGE_MEDIATED_DISCOVERY',
  directHandOrAirFoodMaterializationAllowed: false,
  provisioningSurfaces: [
    'pantry',
    'refrigerator',
    'cupboard',
    'kitchen',
    'cool-storage',
    'drink-shelf',
    'liquor-shelf',
  ],
  provisioningCanSolveConsent: false,
  provisioningCanRevealMemoryTruth: false,
  provisioningCanCreateUniqueEvidence: false,

  partyAfterNamedBossOrMajorConfrontation: true,
  partyToneMustVary: true,
  partyScenarioReservoirCount: 28,

  alcoholExists: true,
  alcoholIntoxicates: true,
  alcoholFinalSceneAdultConfirmationRequired: true,
  intoxicationOverridesConsent: false,
  intoxicationIsTruthSerum: false,

  minimumMajorSmokerCount: 3,
  minimumPipeSmokerCount: 1,
  smokerFinalAssignmentLocked: false,
  initialSmokerAssignmentCandidates: [
    { character: 'ゲン', form: 'pipe' },
    { character: 'トバリ', form: 'cigarette' },
    { character: 'セン', form: 'cigarette' },
  ],

  preferGenericCommercialProductNames: true,
  exampleGenericDrinkLabels: [
    '黒い炭酸',
    '柑橘のシュワシュワ',
    'ぶどうソーダ',
    '麦の泡酒',
    '米の酒',
    '果実酒',
    '炭酸割り',
  ],

  runtimeAutoPromotionAllowed: false,
} as const;

export const DREAM_SOCIAL_WORLD_SUMMARY = {
  core5CharacterCount: CORE5_DISTINCT_ERA_CHARACTER_IDS.length,
  uniqueCore5CharacterCount: new Set(CORE5_DISTINCT_ERA_CHARACTER_IDS).size,
  candidateSmokerCount: DREAM_SOCIAL_WORLD_RULES.initialSmokerAssignmentCandidates.length,
  candidatePipeSmokerCount: DREAM_SOCIAL_WORLD_RULES.initialSmokerAssignmentCandidates.filter(
    (entry) => entry.form === 'pipe',
  ).length,
  genericDrinkLabelCount: DREAM_SOCIAL_WORLD_RULES.exampleGenericDrinkLabels.length,
} as const;
