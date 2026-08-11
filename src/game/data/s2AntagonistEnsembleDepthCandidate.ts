export const S2_ANTAGONIST_ENSEMBLE_DEPTH_RULES = {
  authority: 'docs/s2-antagonist-ensemble-depth-candidate-v1.md',
  status: 'CANDIDATE_NOT_CANON',
  exactAgeFrozen: false,
  exactBirthDateFrozen: false,
  exactGenderIdentityFrozen: false,
  exactRealityEraFrozen: false,
  exactBirthplaceFrozen: false,
  exactHometownFrozen: false,
  exactOccupationFrozen: false,
  exactDialectLexiconFrozen: false,
  exactFamilyRelationsFrozen: false,
  exactRomanceRelationsFrozen: false,
  exactLeaderFrozen: false,
  finalVisualMasterApproved: false,
  rootCandidateExplainsPersonalityByStereotype: false,
  bodyTypeEncodesMorality: false,
  roleAutomaticallyDeterminesOccupation: false,
  dialectRequiresRootAndEraResearchBeforeLexiconLock: true,
  everyMemberNeedsOrdinaryFoodOrPartyHook: true,
  everyMemberNeedsAtLeastTwoInternalRelationshipSeeds: true,
  everyMemberNeedsFormerS1ContrastCandidate: true,
  runtimeAutoPromotionAllowed: false,
} as const;

export type S2EnsembleRelationshipSeed = Readonly<{
  withId: string;
  lane: string;
}>;

export type S2AntagonistEnsembleDepthCandidate = Readonly<{
  id: string;
  callName: string;
  apparentAgeBandCandidate: string;
  silhouetteCandidate: string;
  publicFirstImpression: string;
  regionalRootCandidates: readonly [string, string];
  dialectLeakTriggers: readonly [string, string, string];
  exactDialectLexiconFrozen: false;
  foodPartyHook: string;
  internalRelationshipSeeds: readonly [S2EnsembleRelationshipSeed, S2EnsembleRelationshipSeed];
  formerS1ContrastMember: string;
  exactAgeFrozen: false;
  exactGenderIdentityFrozen: false;
  exactRealityEraFrozen: false;
  exactHometownFrozen: false;
}>;

export const S2_ANTAGONIST_ENSEMBLE_DEPTH_CANDIDATES: readonly S2AntagonistEnsembleDepthCandidate[] = [
  {
    id: 's2_isana',
    callName: 'イサナ',
    apparentAgeBandCandidate: 'MATURE_ADULT_30S_TO_40S_LOOK',
    silhouetteCandidate: 'TALL_LONG_LIMBED_OPEN_STANCE',
    publicFirstImpression: 'SEES_THE_WHOLE_MAP_BEFORE_OTHERS_FINISH_EXPLAINING',
    regionalRootCandidates: ['KANSAI_URBAN_FRINGE_NEW_OLD_HOUSING_LIFE', 'TOHOKU_REGIONAL_CORE_CITY_AND_OUTER_LIFE'] as const,
    dialectLeakTriggers: ['CIRCULAR_DISCUSSION', 'EXPLAINING_TO_OLD_FRIEND_OR_FAMILY', 'AFTER_ADMITTING_OWN_PLAN_ERROR'] as const,
    exactDialectLexiconFrozen: false,
    foodPartyHook: 'REARRANGES_SHARED_DISHES_TO_REDUCE_REACH_COLLISIONS_BEFORE_ASKING_WHAT_PEOPLE_WANT',
    internalRelationshipSeeds: [
      { withId: 's2_kanna', lane: 'WHOLE_PLAN_VS_FIELD_REPAIR_FRICTION' },
      { withId: 's2_nanase', lane: 'NETWORK_ALLY_VS_MINOR_ROUTE_CONFLICT' },
    ] as const,
    formerS1ContrastMember: 'ナシロ',
    exactAgeFrozen: false,
    exactGenderIdentityFrozen: false,
    exactRealityEraFrozen: false,
    exactHometownFrozen: false,
  },
  {
    id: 's2_kanna',
    callName: 'カンナ',
    apparentAgeBandCandidate: 'YOUNG_TO_MID_ADULT_20S_TO_30S_LOOK',
    silhouetteCandidate: 'COMPACT_STOCKY_LOW_CENTER',
    publicFirstImpression: 'LOOKS_LIKE_HANDING_OVER_A_TOOL_WILL_SOLVE_SOMETHING',
    regionalRootCandidates: ['CHUKYO_AICHI_GIFU_BORDER_LIFE', 'SETOUCHI_PORT_AND_SLOPED_CITY_LIFE'] as const,
    dialectLeakTriggers: ['WORKING_WITH_HANDS', 'LIGHT_TEASING', 'PICKING_UP_SOMETHING_PREVIOUSLY_MARKED_DISPOSABLE'] as const,
    exactDialectLexiconFrozen: false,
    foodPartyHook: 'CHECKS_WHAT_CAN_BE_SAVED_FROM_BROKEN_OR_BURNT_FOOD_EVEN_WHEN_DREAM_REPLACEMENT_IS_AVAILABLE',
    internalRelationshipSeeds: [
      { withId: 's2_minori', lane: 'SALVAGE_SUBSTITUTION_FRIENDLY_RIVALRY' },
      { withId: 's2_isana', lane: 'FIELD_REALITY_CHANGES_PLAN_PRIORITY' },
    ] as const,
    formerS1ContrastMember: 'ツグリ',
    exactAgeFrozen: false,
    exactGenderIdentityFrozen: false,
    exactRealityEraFrozen: false,
    exactHometownFrozen: false,
  },
  {
    id: 's2_nanase',
    callName: 'ナナセ',
    apparentAgeBandCandidate: 'YOUNG_ADULT_20S_LOOK',
    silhouetteCandidate: 'SLIM_QUICK_SHORT_STEP',
    publicFirstImpression: 'FINDS_EXIT_AND_RETURN_ROUTE_BEFORE_SETTLING_IN',
    regionalRootCandidates: ['HOKURIKU_SNOW_CITY_LIFE', 'HOKKAIDO_REGIONAL_CITY_TRANSIT_LIFE'] as const,
    dialectLeakTriggers: ['URGENT_GUIDANCE', 'RETURN_ROUTE_BECOMES_SECURE', 'HOME_OR_CHILDHOOD_FRIEND_TOPIC'] as const,
    exactDialectLexiconFrozen: false,
    foodPartyHook: 'SELECTS_SEATING_AND_SERVING_PATHS_THAT_KEEP_A_RETURN_ROUTE_OPEN',
    internalRelationshipSeeds: [
      { withId: 's2_kei', lane: 'ACCESS_ROUTE_VS_ADMISSION_PRIORITY' },
      { withId: 's2_isana', lane: 'NETWORK_DESIGN_ALLIANCE_VS_MINOR_ROUTE_SURVIVAL' },
    ] as const,
    formerS1ContrastMember: 'ミチグレ',
    exactAgeFrozen: false,
    exactGenderIdentityFrozen: false,
    exactRealityEraFrozen: false,
    exactHometownFrozen: false,
  },
  {
    id: 's2_yoshino',
    callName: 'ヨシノ',
    apparentAgeBandCandidate: 'OLDER_ADULT_50S_TO_60S_LOOK',
    silhouetteCandidate: 'BROAD_RELAXED_GROUNDED',
    publicFirstImpression: 'KNOWS_HOW_TO_LEAVE_SOMETHING_FOR_LATER_WITHOUT_RUSH',
    regionalRootCandidates: ['SHIKOKU_RIVER_AND_MOUNTAIN_NEAR_TOWN_LIFE', 'SOUTH_KYUSHU_BASIN_FARMLAND_CITY_EDGE_LIFE'] as const,
    dialectLeakTriggers: ['CALMING_SOMEONE_YOUNGER', 'DISAPPOINTMENT_MORE_THAN_ANGER', 'FOOD_WASTE'] as const,
    exactDialectLexiconFrozen: false,
    foodPartyHook: 'SEPARATES_TOMORROWS_PORTION_FROM_WHAT_SHOULD_BE_FINISHED_TODAY_EVEN_IN_DREAM_ABUNDANCE',
    internalRelationshipSeeds: [
      { withId: 's2_haruma', lane: 'RESOURCE_REST_VS_SYSTEM_CONTINUITY' },
      { withId: 's2_minori', lane: 'WASTE_REDUCTION_ALLIANCE_VS_REMOTE_DELIVERY_COST' },
    ] as const,
    formerS1ContrastMember: 'アサトジ',
    exactAgeFrozen: false,
    exactGenderIdentityFrozen: false,
    exactRealityEraFrozen: false,
    exactHometownFrozen: false,
  },
  {
    id: 's2_kei',
    callName: 'ケイ',
    apparentAgeBandCandidate: 'ADULT_30S_LOOK',
    silhouetteCandidate: 'LEAN_UPRIGHT_ECONOMICAL_MOTION',
    publicFirstImpression: 'VOICE_GETS_QUIETER_AS_THE_ROOM_GETS_MORE_CHAOTIC',
    regionalRootCandidates: ['NORTH_KANTO_SUBURBAN_CITY_LIFE', 'CHUGOKU_REGIONAL_CAPITAL_OUTER_LIFE'] as const,
    dialectLeakTriggers: ['MULTIPLE_PEOPLE_SPEAK_AT_ONCE', 'AFTER_FAILED_HELP', 'WHEN_PRIORITY_IS_MISTAKEN_FOR_PERSONAL_AFFECTION'] as const,
    exactDialectLexiconFrozen: false,
    foodPartyHook: 'ASKS_NEEDS_FIRST_BUT_LATER_STARTS_DECIDING_PORTION_SIZE_BEFORE_ASKING_DESIRE',
    internalRelationshipSeeds: [
      { withId: 's2_sae', lane: 'INDIVIDUAL_PRIORITY_VS_NETWORK_CARE_LOAD' },
      { withId: 's2_nanase', lane: 'OPEN_ACCESS_VS_WHO_GOES_FIRST' },
    ] as const,
    formerS1ContrastMember: 'ペタ',
    exactAgeFrozen: false,
    exactGenderIdentityFrozen: false,
    exactRealityEraFrozen: false,
    exactHometownFrozen: false,
  },
  {
    id: 's2_sae',
    callName: 'サエ',
    apparentAgeBandCandidate: 'MID_ADULT_40S_LOOK',
    silhouetteCandidate: 'SOLID_LAYERED_WELCOMING',
    publicFirstImpression: 'THE_ROOM_STARTS_RUNNING_BEFORE_ANYONE_NOTICES_WHO_ORGANIZED_IT',
    regionalRootCandidates: ['NAGANO_BASIN_CITY_AND_OUTLYING_SETTLEMENT_LIFE', 'SANIN_SMALL_CITY_AND_NONFAMILY_NETWORK_LIFE'] as const,
    dialectLeakTriggers: ['STARTING_CLEANUP', 'ASSIGNING_A_SMALL_TASK_TO_SOMEONE_YOUNGER', 'REFUSING_HELP_FOR_SELF'] as const,
    exactDialectLexiconFrozen: false,
    foodPartyHook: 'STARTS_CLEANUP_ALONE_THEN_NATURALLY_ASSIGNS_DISH_CLOTH_AND_STORAGE_ROLES',
    internalRelationshipSeeds: [
      { withId: 's2_haruma', lane: 'CARE_SCHEDULE_AND_LABOR_SCHEDULE_ALLIANCE_RISK' },
      { withId: 's2_kei', lane: 'WHO_CAN_KEEP_CARING_VS_WHO_GETS_HELP_FIRST' },
    ] as const,
    formerS1ContrastMember: 'ユラネ',
    exactAgeFrozen: false,
    exactGenderIdentityFrozen: false,
    exactRealityEraFrozen: false,
    exactHometownFrozen: false,
  },
  {
    id: 's2_haruma',
    callName: 'ハルマ',
    apparentAgeBandCandidate: 'MATURE_ADULT_30S_TO_40S_LOOK',
    silhouetteCandidate: 'LARGE_STURDY_LOOSE_POSTURE',
    publicFirstImpression: 'MOVES_HEAVY_THINGS_WHILE_JOKING_ABOUT_BREAKS',
    regionalRootCandidates: ['KITAKYUSHU_BAY_SLOPE_INDUSTRIAL_MIXED_LIFE', 'OSAKA_BAY_HOUSING_LOGISTICS_INDUSTRIAL_MIXED_LIFE'] as const,
    dialectLeakTriggers: ['PUSHING_A_BREAK_ON_SOMEONE', 'HIDING_OWN_FATIGUE', 'WHEN_A_BROKEN_SCHEDULE_BECOMES_FUNNY'] as const,
    exactDialectLexiconFrozen: false,
    foodPartyHook: 'LEAVES_LIGHT_FOOD_FOR_PEOPLE_WHO_MIGHT_MISS_THE_MAIN_MEAL_AND_CAN_OVER_SCHEDULE_EATING',
    internalRelationshipSeeds: [
      { withId: 's2_sae', lane: 'KEEP_PEOPLE_FROM_COLLAPSING_SCHEDULE_ALLIANCE' },
      { withId: 's2_yoshino', lane: 'RUN_NOW_RESOURCE_VS_SAVE_RESOURCE' },
    ] as const,
    formerS1ContrastMember: 'ハクマ',
    exactAgeFrozen: false,
    exactGenderIdentityFrozen: false,
    exactRealityEraFrozen: false,
    exactHometownFrozen: false,
  },
  {
    id: 's2_minori',
    callName: 'ミノリ',
    apparentAgeBandCandidate: 'YOUNG_ADULT_20S_LOOK',
    silhouetteCandidate: 'SMALL_AGILE_BUSY_HANDS',
    publicFirstImpression: 'NEEDED_OBJECTS_ARRIVE_BEFORE_OTHERS_NOTICE_THEY_ARE_MISSING',
    regionalRootCandidates: ['SETOUCHI_ISLAND_AND_COASTAL_LIFE', 'TOHOKU_COASTAL_DISTRIBUTED_SETTLEMENT_LIFE'] as const,
    dialectLeakTriggers: ['EXCITED_AROUND_FOOD', 'NOTICING_COUNTS_ARE_SHORT', 'ASKING_FAMILY_IF_THEY_ATE'] as const,
    exactDialectLexiconFrozen: false,
    foodPartyHook: 'AUTOMATICALLY_PORTIONS_GROUP_FOOD_EVEN_WHEN_DREAM_PROVISIONING_CAN_REFILL_IT',
    internalRelationshipSeeds: [
      { withId: 's2_kanna', lane: 'SUBSTITUTE_AND_SALVAGE_FRIENDLY_RIVALRY' },
      { withId: 's2_yoshino', lane: 'WASTE_REDUCTION_ALLIANCE_VS_SMALL_REMOTE_DELIVERY' },
    ] as const,
    formerS1ContrastMember: 'オリネ',
    exactAgeFrozen: false,
    exactGenderIdentityFrozen: false,
    exactRealityEraFrozen: false,
    exactHometownFrozen: false,
  },
] as const;

export const s2AntagonistEnsembleDepthSummary = {
  candidateCount: S2_ANTAGONIST_ENSEMBLE_DEPTH_CANDIDATES.length,
  uniqueIdCount: new Set(S2_ANTAGONIST_ENSEMBLE_DEPTH_CANDIDATES.map((entry) => entry.id)).size,
  uniqueCallNameCount: new Set(S2_ANTAGONIST_ENSEMBLE_DEPTH_CANDIDATES.map((entry) => entry.callName)).size,
  uniqueSilhouetteCount: new Set(S2_ANTAGONIST_ENSEMBLE_DEPTH_CANDIDATES.map((entry) => entry.silhouetteCandidate)).size,
  uniqueFormerS1ContrastCount: new Set(S2_ANTAGONIST_ENSEMBLE_DEPTH_CANDIDATES.map((entry) => entry.formerS1ContrastMember)).size,
  regionalRootCandidateCount: new Set(S2_ANTAGONIST_ENSEMBLE_DEPTH_CANDIDATES.flatMap((entry) => entry.regionalRootCandidates)).size,
  everyMemberHasTwoRelationshipSeeds: S2_ANTAGONIST_ENSEMBLE_DEPTH_CANDIDATES.every((entry) => entry.internalRelationshipSeeds.length === 2),
  everyMemberHasFoodPartyHook: S2_ANTAGONIST_ENSEMBLE_DEPTH_CANDIDATES.every((entry) => entry.foodPartyHook.length > 20),
  everyDialectLexiconOpen: S2_ANTAGONIST_ENSEMBLE_DEPTH_CANDIDATES.every((entry) => !entry.exactDialectLexiconFrozen),
  everyExactIdentityOpen: S2_ANTAGONIST_ENSEMBLE_DEPTH_CANDIDATES.every(
    (entry) => !entry.exactAgeFrozen && !entry.exactGenderIdentityFrozen && !entry.exactRealityEraFrozen && !entry.exactHometownFrozen,
  ),
  runtimeAutoPromotionAllowed: false,
} as const;
