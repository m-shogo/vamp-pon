export const S2_ANTAGONIST_SCENE_CHEMISTRY_RULES = {
  authority: 'docs/s2-antagonist-scene-chemistry-candidate-v1.md',
  status: 'CANDIDATE_NOT_CANON',
  finalFirstAppearanceOrderFrozen: false,
  exactAllianceOutcomesFrozen: false,
  exactFamilyRelationsFrozen: false,
  exactRomanceRelationsFrozen: false,
  exactRealityOriginsFrozen: false,
  exactCountriesFrozen: false,
  exactLanguagesFrozen: false,
  exactOccupationsFrozen: false,
  everyMemberNeedsCore5Chemistry: true,
  everyMemberNeedsFirstEncounterCandidate: true,
  everyMemberNeedsPartyBeat: true,
  everyMemberNeedsTrustFracture: true,
  everyMemberNeedsVulnerableTell: true,
  everyMemberNeedsFormerS1Echo: true,
  s1JapanIncidentRequiresJapaneseOrigin: false,
  overseasOrMultiCountryRootsAllowedInS2: true,
  originMustComeFromLifeHistoryNotAppearance: true,
  runtimeAutoPromotionAllowed: false,
} as const;

export type S2Core5Chemistry = Readonly<{
  core5Id: 'yui' | 'asa' | 'nagi' | 'michiru' | 'tomori';
  lane: string;
}>;

export type S2FirstEncounterCandidate = Readonly<{
  core5Id: 'yui' | 'asa' | 'nagi' | 'michiru' | 'tomori';
  setting: string;
  visibleHelp: string;
  hiddenContradiction: string;
}>;

export type S2OriginExpansionCandidate = Readonly<{
  overseasOrMultiCountryEligible: true;
  structuralLifeShapeCandidate: string;
  exactCountryFrozen: false;
  exactNationalityFrozen: false;
  exactLanguageFrozen: false;
}>;

export type S2AntagonistSceneChemistryCandidate = Readonly<{
  id: string;
  callName: string;
  core5Chemistry: readonly [S2Core5Chemistry, S2Core5Chemistry];
  firstEncounter: S2FirstEncounterCandidate;
  partyBeat: string;
  trustFracture: string;
  vulnerableTell: string;
  recurringHumanHook: string;
  formerS1EchoMember: string;
  originExpansion: S2OriginExpansionCandidate;
  exactAllianceOutcomeFrozen: false;
  exactFamilyRelationFrozen: false;
  exactRomanceRelationFrozen: false;
}>;

export const S2_ANTAGONIST_SCENE_CHEMISTRY_CANDIDATES: readonly S2AntagonistSceneChemistryCandidate[] = [
  {
    id: 's2_isana',
    callName: 'イサナ',
    core5Chemistry: [
      { core5Id: 'michiru', lane: 'BIG_PLAN_CONFIDENCE_VS_LEARNING_TO_GET_LOST_TOGETHER' },
      { core5Id: 'yui', lane: 'SYSTEM_VISIBILITY_VS_SMALL_UNVERIFIED_HUMAN_SIGNAL' },
    ] as const,
    firstEncounter: {
      core5Id: 'michiru',
      setting: 'BROKEN_MULTI_ROUTE_MAP_ROOM',
      visibleHelp: 'RECONNECTS_THREE_SEPARATE_ROUTES_WITH_ONE_CLEAR_PLAN',
      hiddenContradiction: 'THE_PLAN_WORKS_BUT_REMOVES_THE_ONLY_SLOW_ROUTE_USED_BY_ONE_SMALL_GROUP',
    },
    partyBeat: 'MOVES_SHARED_DISHES_TO_FIX_TRAFFIC_FLOW_UNTIL_YUI_ASKS_WHO_WANTED_THE_TABLE_REARRANGED',
    trustFracture: 'MICHIRU_REALIZES_ISANA_REMEMBERED_THE_SMALL_ROUTE_AND_STILL_CLASSIFIED_IT_AS_ACCEPTABLE_LOSS',
    vulnerableTell: 'WHEN_A_PLAN_FAILS_ISANA_STOPS_DRAWING_LINES_AND_FOLDS_THE_MAP_SMALLER_THAN_NECESSARY',
    recurringHumanHook: 'CANNOT_LOOK_AT_A_QUEUE_WITHOUT_QUIETLY_ESTIMATING_WHERE_IT_WILL_JAM',
    formerS1EchoMember: 'ナシロ',
    originExpansion: {
      overseasOrMultiCountryEligible: true,
      structuralLifeShapeCandidate: 'LIVED_BETWEEN_A_LARGE_CITY_AND_PERIPHERAL_TOWN_ACROSS_MORE_THAN_ONE_COUNTRY',
      exactCountryFrozen: false,
      exactNationalityFrozen: false,
      exactLanguageFrozen: false,
    },
    exactAllianceOutcomeFrozen: false,
    exactFamilyRelationFrozen: false,
    exactRomanceRelationFrozen: false,
  },
  {
    id: 's2_kanna',
    callName: 'カンナ',
    core5Chemistry: [
      { core5Id: 'tomori', lane: 'REPAIR_AND_INHERIT_VS_DECIDING_WHAT_NOT_TO_REPAIR' },
      { core5Id: 'asa', lane: 'BODY_MAINTENANCE_RESOURCE_LIMIT_VS_PERSONHOOD_ALREADY_RECOGNIZED' },
    ] as const,
    firstEncounter: {
      core5Id: 'tomori',
      setting: 'COLLAPSED_STOREHOUSE_WITH_LIMITED_TOOLS',
      visibleHelp: 'SAVES_THE_LOAD_BEARING_PART_AND_GETS_EVERYONE_OUT',
      hiddenContradiction: 'MARKS_THREE_PERSONAL_OBJECTS_AS_NOT_WORTH_RECOVERING_WITHOUT_ASKING_THEIR_OWNERS',
    },
    partyBeat: 'SALVAGES_A_BURNT_EDGE_OF_FOOD_THAT_DREAM_PROVISIONING_COULD_REPLACE_AND_TOMORI_NOTICES_SHE_CANNOT_THROW_IT_AWAY',
    trustFracture: 'TOMORI_HEARS_KANNA_USE_THE_SAME_BEYOND_REPAIR_PHRASE_FOR_A_HOUSEHOLD_THAT_KANNA_USES_FOR_OBJECTS',
    vulnerableTell: 'KEEPS_A_SMALL_BOX_OF_REJECTED_OBJECTS_THAT_SHE_HAD_PERSONALLY_MARKED_DISPOSABLE',
    recurringHumanHook: 'TAPS_A_TOOL_TWICE_BEFORE_HANDING_IT_TO_SOMEONE_ELSE',
    formerS1EchoMember: 'ツグリ',
    originExpansion: {
      overseasOrMultiCountryEligible: true,
      structuralLifeShapeCandidate: 'PORT_OR_MANUFACTURING_TOWN_CHILDHOOD_WITH_A_LATER_LONG_TERM_JAPAN_COMMUNITY',
      exactCountryFrozen: false,
      exactNationalityFrozen: false,
      exactLanguageFrozen: false,
    },
    exactAllianceOutcomeFrozen: false,
    exactFamilyRelationFrozen: false,
    exactRomanceRelationFrozen: false,
  },
  {
    id: 's2_nanase',
    callName: 'ナナセ',
    core5Chemistry: [
      { core5Id: 'michiru', lane: 'ONE_USABLE_ROUTE_VS_LEAVING_ROOM_TO_GET_LOST_AND_RETURN' },
      { core5Id: 'nagi', lane: 'ACCESS_GATE_OPENING_VS_PROTECTIVE_CLOSURE_WITH_EXPIRY' },
    ] as const,
    firstEncounter: {
      core5Id: 'nagi',
      setting: 'STATION_LIKE_CROSSING_WITH_MULTIPLE_CLOSED_EXITS',
      visibleHelp: 'FINDS_ONE_SAFE_RETURN_ROUTE_AND_GUIDES_STRANGERS_THROUGH_IT',
      hiddenContradiction: 'LOCKS_TWO_UNCERTAIN_EXITS_BEFORE_THE_PEOPLE_WHO_USE_THEM_CAN_ARGUE_FOR_REOPENING',
    },
    partyBeat: 'KEEPS_A_WALKING_LANE_CLEAR_AROUND_THE_TABLE_AND_LAUGHS_ONLY_AFTER_EVERYONE_HAS_A_VISIBLE_WAY_OUT',
    trustFracture: 'NAGI_DISCOVERS_NANASE_CALLS_AN_ACCESS_ROUTE_AVAILABLE_EVEN_WHEN_ONE_PERSON_CANNOT_ACTUALLY_USE_IT',
    vulnerableTell: 'AFTER_A_RETURN_ROUTE_IS_CONFIRMED_NANASE_SITS_WITH_BACK_TO_THE_EXIT_FOR_THE_FIRST_TIME',
    recurringHumanHook: 'MENTALLY_REHEARSES_THE_WAY_HOME_WHILE_OTHER_PEOPLE_ARE_STILL_ARRIVING',
    formerS1EchoMember: 'ミチグレ',
    originExpansion: {
      overseasOrMultiCountryEligible: true,
      structuralLifeShapeCandidate: 'GREW_UP_DEPENDING_ON_RAIL_BUS_OR_FERRY_NETWORKS_IN_MORE_THAN_ONE_COUNTRY_OR_REGION',
      exactCountryFrozen: false,
      exactNationalityFrozen: false,
      exactLanguageFrozen: false,
    },
    exactAllianceOutcomeFrozen: false,
    exactFamilyRelationFrozen: false,
    exactRomanceRelationFrozen: false,
  },
  {
    id: 's2_yoshino',
    callName: 'ヨシノ',
    core5Chemistry: [
      { core5Id: 'tomori', lane: 'SAVE_FOR_LATER_VS_USE_NOW_TO_KEEP_PEOPLE_LIVING' },
      { core5Id: 'yui', lane: 'FUTURE_RESERVE_VS_PRESENT_SMALL_NEED_THAT_DOES_NOT_SCORE_HIGH' },
    ] as const,
    firstEncounter: {
      core5Id: 'yui',
      setting: 'GARDEN_STORAGE_AREA_WITH_A_LIMITED_WATER_MARKER',
      visibleHelp: 'STOPS_WASTE_AND_PRESERVES_ENOUGH_FOR_MULTIPLE_GROUPS',
      hiddenContradiction: 'REFUSES_ONE_EXTRA_USE_FOR_A_PERSON_WHO_CANNOT_WAIT_UNTIL_THE_NEXT_CYCLE',
    },
    partyBeat: 'SETS_ASIDE_TOMORROWS_PORTION_IN_A_DREAM_WHERE_FOOD_CAN_REFILL_AND_THEN_LOOKS_EMBARRASSED_WHEN_YUI_POINTS_IT_OUT',
    trustFracture: 'YUI_REALIZES_YOSHINO_KNOWS_A_CURRENT_HARDSHIP_IS_SEVERE_BUT_STILL_DEFENDS_THE_RESERVE_RULE_AS_MORE_IMPORTANT',
    vulnerableTell: 'APOLOGIZES_TO_PLANTS_OR_OBJECTS_MORE_EASILY_THAN_TO_PEOPLE_AFTER_MAKING_A_HARD_DECISION',
    recurringHumanHook: 'ALWAYS_LEAVES_ONE_SMALL_PORTION_UNTOUCHED_UNTIL_EVERYONE_ELSE_HAS_FINISHED',
    formerS1EchoMember: 'アサトジ',
    originExpansion: {
      overseasOrMultiCountryEligible: true,
      structuralLifeShapeCandidate: 'RIVER_BASIN_OR_AGRICULTURAL_REGION_FAMILY_HISTORY_WITH_A_LATER_JAPAN_LIFE_PERIOD',
      exactCountryFrozen: false,
      exactNationalityFrozen: false,
      exactLanguageFrozen: false,
    },
    exactAllianceOutcomeFrozen: false,
    exactFamilyRelationFrozen: false,
    exactRomanceRelationFrozen: false,
  },
  {
    id: 's2_kei',
    callName: 'ケイ',
    core5Chemistry: [
      { core5Id: 'asa', lane: 'CARE_PRIORITY_AFTER_PERSONHOOD_VS_EQUAL_PERSON_STATUS' },
      { core5Id: 'yui', lane: 'PROBABILITY_OF_BENEFIT_VS_WEAK_SOS_THAT_MAY_BE_REAL' },
    ] as const,
    firstEncounter: {
      core5Id: 'asa',
      setting: 'CROWDED_REST_AREA_WITH_TOO_FEW_HELPERS',
      visibleHelp: 'CREATES_ORDER_FAST_ENOUGH_THAT_MULTIPLE_PEOPLE_ACTUALLY_RECEIVE_HELP',
      hiddenContradiction: 'ONE_LOW_PROBABILITY_PERSON_IS_MOVED_OUT_OF_THE_ACTIVE_QUEUE_WITHOUT_A_REAL_PATH_BACK_IN',
    },
    partyBeat: 'ASKS_EVERYONE_WHAT_THEY_NEED_THEN_CATCHES_THEMSELF_STARTING_TO_DECIDE_PORTIONS_BEFORE_HEARING_WHAT_THEY_WANT',
    trustFracture: 'ASA_HEARS_KEI_DESCRIBE_EQUAL_PERSONS_AS_DIFFERENT_RETURN_ON_TIME_WHEN_RESOURCES_TIGHTEN',
    vulnerableTell: 'AFTER_FAILED_HELP_KEI_REPEATS_OTHER_PEOPLES_LAST_REQUESTS_WORD_FOR_WORD_WHILE_CLEANING',
    recurringHumanHook: 'ENDS_SERIOUS_CONVERSATIONS_WITH_ONE_QUIET_OTHER_THING_YOU_COULD_NOT_SAY_QUESTION',
    formerS1EchoMember: 'ペタ',
    originExpansion: {
      overseasOrMultiCountryEligible: true,
      structuralLifeShapeCandidate: 'MOVED_BETWEEN_TWO_SOCIAL_SYSTEMS_WHERE_ACCESS_RULES_AND_FAMILY_EXPECTATIONS_DIFFERED',
      exactCountryFrozen: false,
      exactNationalityFrozen: false,
      exactLanguageFrozen: false,
    },
    exactAllianceOutcomeFrozen: false,
    exactFamilyRelationFrozen: false,
    exactRomanceRelationFrozen: false,
  },
  {
    id: 's2_sae',
    callName: 'サエ',
    core5Chemistry: [
      { core5Id: 'asa', lane: 'CARE_NETWORK_VS_CHOSEN_FAMILY_AND_PERSONAL_CONSENT' },
      { core5Id: 'tomori', lane: 'MUTUAL_AID_VS_ASSIGNING_DUTY_BEFORE_ASKING' },
    ] as const,
    firstEncounter: {
      core5Id: 'tomori',
      setting: 'TEMPORARY_COMMUNAL_KITCHEN_AFTER_A_FIGHT',
      visibleHelp: 'GETS_EXHAUSTED_PEOPLE_FED_AND_SPLITS_THE_WORK_BEFORE_ONE_PERSON_COLLAPSES',
      hiddenContradiction: 'THE_ROLES_KEEP_RUNNING_AFTER_SOMEONE_QUIETLY_SAYS_THEY_DO_NOT_WANT_THEIR_ASSIGNED_TASK',
    },
    partyBeat: 'STARTS_CLEANUP_WITHOUT_ASKING_THEN_ASSIGNES_SMALL_JOBS_SO_NATURALLY_THAT_THE_GROUP_ONLY_NOTICES_WHEN_ASA_SAYS_NO',
    trustFracture: 'TOMORI_SEES_MUTUAL_AID_TURN_INTO_A_DUTY_LEDGER_WHERE_REFUSAL_REQUIRES_JUSTIFICATION',
    vulnerableTell: 'CAN_DELEGATE_EVERYONE_ELSES_WORK_BUT_SAYS_IM_FINE_WHEN_ANYONE_TRIES_TO_TAKE_HER_OWN_TASK',
    recurringHumanHook: 'REMEMBERS_WHO_WASHED_WHAT_LAST_TIME_EVEN_WHEN_NO_ONE_IS_KEEPING_SCORE',
    formerS1EchoMember: 'ユラネ',
    originExpansion: {
      overseasOrMultiCountryEligible: true,
      structuralLifeShapeCandidate: 'MULTILINGUAL_OR_MULTI_COUNTRY_NONFAMILY_HOUSEHOLD_NETWORK_WITH_LONG_TERM_JAPAN_CONNECTION',
      exactCountryFrozen: false,
      exactNationalityFrozen: false,
      exactLanguageFrozen: false,
    },
    exactAllianceOutcomeFrozen: false,
    exactFamilyRelationFrozen: false,
    exactRomanceRelationFrozen: false,
  },
  {
    id: 's2_haruma',
    callName: 'ハルマ',
    core5Chemistry: [
      { core5Id: 'nagi', lane: 'UNSTABLE_WORK_AND_PROTECTIVE_BOUNDARIES_VS_SYSTEM_OWNED_SCHEDULE' },
      { core5Id: 'michiru', lane: 'GROWTH_AND_MAINTENANCE_CONTINUITY_VS_WHO_GETS_TO_STOP' },
    ] as const,
    firstEncounter: {
      core5Id: 'michiru',
      setting: 'MAINTENANCE_PLATFORM_DURING_A_CASCADE_OF_SMALL_FAILURES',
      visibleHelp: 'ROTATES_PEOPLE_OUT_BEFORE_EXHAUSTION_CAUSES_A_LARGER_BREAKDOWN',
      hiddenContradiction: 'THE_ROTATION_IS_SAFE_BUT_NO_ONE_GETS_TO_CHOOSE_WHEN_THEIR_OWN_BREAK_BEGINS_OR_ENDS',
    },
    partyBeat: 'PUSHES_CHAIRS_TOWARD_TIRED_PEOPLE_WITH_JOKES_THEN_IS_THE_ONLY_PERSON_STILL_STANDING_AFTER_EVERYONE_SITS',
    trustFracture: 'NAGI_REALIZES_HARUMA_COUNTS_REST_AS_A_SYSTEM_RESOURCE_RATHER_THAN_TIME_A_PERSON_OWNS',
    vulnerableTell: 'MAKES_THE_FUNNIEST_JOKES_WHEN_HIS_OWN_SCHEDULE_HAS_ALREADY_EXCEEDED_THE_LIMIT_HE_GIVES_OTHERS',
    recurringHumanHook: 'CAN_TELL_WHO_IS_TIRED_BY_THE_SOUND_OF_HOW_THEY_SET_DOWN_A_TOOL_OR_CUP',
    formerS1EchoMember: 'ハクマ',
    originExpansion: {
      overseasOrMultiCountryEligible: true,
      structuralLifeShapeCandidate: 'FAMILY_OR_COMMUNITY_MOVED_BETWEEN_PORT_INDUSTRIAL_OR_LOGISTICS_CITIES_IN_MULTIPLE_COUNTRIES',
      exactCountryFrozen: false,
      exactNationalityFrozen: false,
      exactLanguageFrozen: false,
    },
    exactAllianceOutcomeFrozen: false,
    exactFamilyRelationFrozen: false,
    exactRomanceRelationFrozen: false,
  },
  {
    id: 's2_minori',
    callName: 'ミノリ',
    core5Chemistry: [
      { core5Id: 'tomori', lane: 'DISTRIBUTION_MEMORY_VS_EFFICIENCY_THAT_PERPETUALLY_DELAYS_SMALL_HOUSEHOLDS' },
      { core5Id: 'yui', lane: 'DELIVERY_OPTIMIZATION_VS_ONE_LOW_VISIBILITY_HOUSEHOLD_SOS' },
    ] as const,
    firstEncounter: {
      core5Id: 'yui',
      setting: 'FOOD_AND_MATERIAL_DEPOT_WITH_MISMATCHED_COUNTS',
      visibleHelp: 'FINDS_SUBSTITUTES_AND_GETS_SUPPLIES_MOVING_AGAIN_FASTER_THAN_ANYONE_EXPECTS',
      hiddenContradiction: 'THE_SMALLEST_AND_HARDEST_TO_REACH_DESTINATION_IS_AUTOMATICALLY_MOVED_TO_THE_NEXT_RUN',
    },
    partyBeat: 'PORTIONS_FOOD_FOR_EIGHT_PEOPLE_WITHOUT_THINKING_AND_LOOKS_GENUINELY_CONFUSED_WHEN_TOMORI_SAYS_DREAM_REFILL_MEANS_SHE_CAN_SERVE_HERSELF_FIRST_TOO',
    trustFracture: 'YUI_FINDS_THE_SAME_SMALL_DESTINATION_MARKED_NEXT_RUN_ON_THREE_CONSECUTIVE_DELIVERY_BOARDS',
    vulnerableTell: 'WHEN_COUNTS_ARE_SHORT_MINORI_STOPS_EATING_WHILE_CONTINUING_TO_TELL_EVERYONE_ELSE_THERE_IS_ENOUGH',
    recurringHumanHook: 'CAN_IMPROVISE_A_GROUP_MEAL_FROM_SUBSTITUTES_BUT_FORGETS_TO_NAME_WHAT_SHE_WANTED',
    formerS1EchoMember: 'オリネ',
    originExpansion: {
      overseasOrMultiCountryEligible: true,
      structuralLifeShapeCandidate: 'ISLAND_OR_COASTAL_SUPPLY_NETWORK_CHILDHOOD_WITH_A_LATER_JAPAN_RESIDENCE_OR_FAMILY_LINK',
      exactCountryFrozen: false,
      exactNationalityFrozen: false,
      exactLanguageFrozen: false,
    },
    exactAllianceOutcomeFrozen: false,
    exactFamilyRelationFrozen: false,
    exactRomanceRelationFrozen: false,
  },
] as const;

export const S2_ANTAGONIST_INTERNAL_RELATIONSHIP_ARCS = [
  {
    id: 'S2-REL-ISANA-KANNA',
    members: ['s2_isana', 's2_kanna'] as const,
    attraction: 'EACH_RESPECTS_THE_OTHER_FOR_SOLVING_PROBLEMS_THEIR_OWN_SCALE_MISSES',
    fracture: 'ISANA_CALLS_LOCAL_REPAIR_A_DELAY_WHILE_KANNA_CALLS_SYSTEM_PLANNING_A_WAY_TO_AVOID_TOUCHING_DAMAGE',
    resolutionFrozen: false,
  },
  {
    id: 'S2-REL-NANASE-KEI',
    members: ['s2_nanase', 's2_kei'] as const,
    attraction: 'BOTH_CREATE_ORDER_WHEN_EVERYONE_ELSE_IS_OVERWHELMED',
    fracture: 'NANASE_WANTS_A_ROUTE_OPEN_WHILE_KEI_WANTS_TO_LIMIT_ENTRY_TO_PRESERVE_CAPACITY',
    resolutionFrozen: false,
  },
  {
    id: 'S2-REL-YOSHINO-HARUMA',
    members: ['s2_yoshino', 's2_haruma'] as const,
    attraction: 'BOTH_HATE_WATCHING_PEOPLE_OR_RESOURCES_BURN_OUT',
    fracture: 'YOSHINO_SAVES_CAPACITY_FOR_LATER_WHILE_HARUMA_SPENDS_CAPACITY_TO_KEEP_TODAY_RUNNING',
    resolutionFrozen: false,
  },
  {
    id: 'S2-REL-KEI-SAE',
    members: ['s2_kei', 's2_sae'] as const,
    attraction: 'EACH_SEES_THE_CARE_LOAD_THE_OTHER_MISSES',
    fracture: 'KEI_PRIORITIZES_THE_PERSON_IN_FRONT_WHILE_SAE_PRIORITIZES_THE_NETWORK_THAT_MUST_KEEP_CARING_TOMORROW',
    resolutionFrozen: false,
  },
  {
    id: 'S2-REL-KANNA-MINORI',
    members: ['s2_kanna', 's2_minori'] as const,
    attraction: 'SUBSTITUTION_AND_SALVAGE_TURN_INTO_EASY_FRIENDLY_COMPETITION',
    fracture: 'MINORI_MOVES_ON_FAST_WHILE_KANNA_STOPS_TO_SAVE_ONE_LOW_YIELD_OBJECT_OR_PLACE',
    resolutionFrozen: false,
  },
  {
    id: 'S2-REL-SAE-HARUMA',
    members: ['s2_sae', 's2_haruma'] as const,
    attraction: 'THEY_CAN_KEEP_A_GROUP_FUNCTIONING_WITH_ALMOST_NO_EXPLICIT_COORDINATION',
    fracture: 'THEIR_COMBINED_CARE_AND_SHIFT_PLANS_CAN_ACCIDENTALLY_LEAVE_NO_UNSCHEDULED_TIME_AT_ALL',
    resolutionFrozen: false,
  },
] as const;

export const s2AntagonistSceneChemistrySummary = {
  candidateCount: S2_ANTAGONIST_SCENE_CHEMISTRY_CANDIDATES.length,
  uniqueIdCount: new Set(S2_ANTAGONIST_SCENE_CHEMISTRY_CANDIDATES.map((entry) => entry.id)).size,
  uniqueFirstEncounterSettingCount: new Set(S2_ANTAGONIST_SCENE_CHEMISTRY_CANDIDATES.map((entry) => entry.firstEncounter.setting)).size,
  coveredCore5Ids: new Set(S2_ANTAGONIST_SCENE_CHEMISTRY_CANDIDATES.flatMap((entry) => entry.core5Chemistry.map((item) => item.core5Id))).size,
  uniqueFormerS1EchoCount: new Set(S2_ANTAGONIST_SCENE_CHEMISTRY_CANDIDATES.map((entry) => entry.formerS1EchoMember)).size,
  internalRelationshipArcCount: S2_ANTAGONIST_INTERNAL_RELATIONSHIP_ARCS.length,
  everyMemberKeepsOutcomeOpen: S2_ANTAGONIST_SCENE_CHEMISTRY_CANDIDATES.every(
    (entry) => !entry.exactAllianceOutcomeFrozen && !entry.exactFamilyRelationFrozen && !entry.exactRomanceRelationFrozen,
  ),
  everyOriginExpansionOpen: S2_ANTAGONIST_SCENE_CHEMISTRY_CANDIDATES.every(
    (entry) => !entry.originExpansion.exactCountryFrozen && !entry.originExpansion.exactNationalityFrozen && !entry.originExpansion.exactLanguageFrozen,
  ),
  runtimeAutoPromotionAllowed: false,
} as const;
