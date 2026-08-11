export type SeasonFocus = 'PRIMARY' | 'STRONG' | 'SUPPORT' | 'CAMEO';

export const SERIES_SEASON_RULES = {
  seasonEqualsEra: false,
  eraDefinesRealityOrigin: true,
  seasonDefinesMacroProblem: true,
  core5RecurringAcrossSeasons: true,
  seasonBoundaryAutomaticallyWakesEveryone: false,
  seasonBoundaryAutomaticallyResetsMemory: false,
  characterGrowthResetsBetweenSeasons: false,
  mainSpineContinuesAcrossSeasons: true,
  everySeasonMustFullySolveMacroProblem: false,
  everySeasonMustEndHappy: false,
  seriesCanonicalEnding: 'HAPPY_END',
  finalSeasonCountFrozen: false,
  allowedFinalSeasonCounts: [2, 3] as const,
  season1EndingDirection: 'UNEASY_PARTIAL_VICTORY',
  season2EndingDirection: 'HAPPY_END_IF_FINAL_OTHERWISE_DEEPER_PARTIAL_RESOLUTION',
  optionalSeason3Purpose: 'FINAL_CONVERGENCE_WITHOUT_JUST_A_BIGGER_ENEMY',
  future15SeasonAssignmentPromotesToCurrentRoster: false,
  sakuyazaReplacedEachSeason: false,
  gunjoZankyorokuEqualsSeasonBossRoster: false,
  runtimeAutoPromotionAllowed: false,
} as const;

export const SEASON_PROBLEM_LANES = [
  {
    seasonId: 'S1',
    workingCode: 'S1_RECOGNITION_RECORD_AND_BELONGING',
    titleFrozen: false,
    macroProblem: 'WHO_IS_RECOGNIZED_BY_WHICH_NAME_RECORD_OR_INFORMATION',
    endingResolution: {
      tactical: 'RESOLVED_ENOUGH_FOR_PLAYER_ACHIEVEMENT',
      character: 'REAL_STEP_FORWARD',
      social: 'PARTIAL_LOCAL_CHANGE_ONLY',
      seriesMystery: 'INTENTIONALLY_UNRESOLVED',
      aftertaste: 'UNEASY_BUT_NOT_HOPELESS',
    },
    problemFamilies: [
      'NAME_LABEL',
      'OFFICIAL_RECORD',
      'IDENTITY',
      'PRIVACY',
      'CLASSIFICATION',
      'RUMOR_WITNESS',
      'MISINFORMATION_VERIFICATION',
      'MEMORY_RECORD',
      'BELONGING_EXCLUSION',
      'HUMAN_ANDROID_DESIGNATION',
    ] as const,
  },
  {
    seasonId: 'S2',
    workingCode: 'S2_PROGRESS_CARE_RESOURCE_AND_SACRIFICE',
    titleFrozen: false,
    macroProblem: 'WHO_OR_WHAT_GETS_SACRIFICED_WHEN_PROTECTING_REPAIRING_OR_DEVELOPING',
    endingResolution: {
      tactical: 'RESOLVED_ENOUGH_FOR_PLAYER_ACHIEVEMENT',
      character: 'SEASON1_GROWTH_IS_TESTED_NOT_RESET',
      social: 'PARTIAL_OR_SERIES_LEVEL_DEPENDING_ON_FINAL_SEASON_DECISION',
      seriesMystery: 'MAY_RESOLVE_IF_TWO_SEASONS_OTHERWISE_ADVANCE_TO_FINAL_CONTRADICTION',
      aftertaste: 'HAPPY_IF_FINAL_OTHERWISE_DEEPER_UNEASY_RESOLUTION',
    },
    problemFamilies: [
      'RECONSTRUCTION',
      'DEVELOPMENT',
      'POLLUTION_ENVIRONMENT',
      'ENERGY',
      'DISTRIBUTION_ALLOCATION',
      'LABOR',
      'CARE',
      'ACCESSIBILITY',
      'ROUTE_OPTIMIZATION',
      'REPAIR_VS_REPLACEMENT',
      'EFFICIENCY_VS_DIGNITY',
      'PROTECTION_BECOMING_CONTROL',
    ] as const,
  },
] as const;

export const OPTIONAL_SEASON3 = {
  enabledAsCandidateArchitecture: true,
  mandatory: false,
  titleFrozen: false,
  workingCode: 'S3_FINAL_CONVERGENCE_INHERITANCE_MEMORY_AND_CHOICE',
  purpose: 'RECONCILE_RECOGNITION_PROTECTION_PROGRESS_AND_REALITY_RETURN_WITHOUT_RESETTING_PRIOR_GROWTH',
  mustNotBeJustBiggerEnemy: true,
  candidateProblemFamilies: [
    'INHERITANCE',
    'COLLECTIVE_MEMORY',
    'FAMILY_SUCCESSION',
    'WHO_GETS_TO_TELL_HISTORY',
    'PREDICTION_VS_FREEDOM',
    'COPIED_OR_INHERITED_IDENTITY',
    'HAPPY_END_WITH_IRREVERSIBLE_PAST',
  ] as const,
} as const;

export const CURRENT21_SEASON_ASSIGNMENTS: ReadonlyArray<{
  id: string;
  name: string;
  s1: SeasonFocus;
  s2: SeasonFocus;
  continuity: string;
}> = [
  { id: 'yui', name: 'ユイ', s1: 'PRIMARY', s2: 'PRIMARY', continuity: 'SERIES_VIEWPOINT_MEMORY_CHOICE' },
  { id: 'asa', name: 'アサ', s1: 'PRIMARY', s2: 'PRIMARY', continuity: 'NAME_PERSONHOOD_FUTURE_BUDDY' },
  { id: 'nagi', name: 'ナギ', s1: 'PRIMARY', s2: 'STRONG', continuity: 'PRIVACY_TO_ACCESS_AND_LABOR_BOUNDARY' },
  { id: 'michiru', name: 'ミチル', s1: 'STRONG', s2: 'PRIMARY', continuity: 'MAP_DISCREPANCY_TO_DEVELOPMENT_ROUTE' },
  { id: 'tomori', name: 'トモリ', s1: 'STRONG', s2: 'PRIMARY', continuity: 'REPAIR_EVIDENCE_TO_RECONSTRUCTION_ALLOCATION' },
  { id: 'sen', name: 'セン', s1: 'STRONG', s2: 'SUPPORT', continuity: 'EDUCATION_WORDS_INSTITUTION' },
  { id: 'ritsu', name: 'リツ', s1: 'SUPPORT', s2: 'STRONG', continuity: 'FAMILY_DUTY_DISTRIBUTION_CARE' },
  { id: 'koyori', name: 'コヨリ', s1: 'SUPPORT', s2: 'STRONG', continuity: 'CHILD_LENS_NAMING_ADULT_CONTRADICTION' },
  { id: 'gen', name: 'ゲン', s1: 'CAMEO', s2: 'PRIMARY', continuity: 'OLD_ROUTE_MEMORY_MATERIAL_SOCIAL_LIFE' },
  { id: 'hana', name: 'ハナ', s1: 'SUPPORT', s2: 'STRONG', continuity: 'PRESERVATION_HOUSEHOLD_OLDER_ADULT_LENS' },
  { id: 'yuubi', name: 'ユウビ', s1: 'PRIMARY', s2: 'SUPPORT', continuity: 'MAIL_DELIVERY_MISSING_RECORD_ROUTE_EVIDENCE' },
  { id: 'madoka', name: 'マドカ', s1: 'STRONG', s2: 'SUPPORT', continuity: 'WITNESS_RUMOR_OBSERVATION' },
  { id: 'shiro', name: 'シロ', s1: 'PRIMARY', s2: 'STRONG', continuity: 'ARCHIVE_CLASSIFICATION_UNKNOWN_HANDLING' },
  { id: 'tobari', name: 'トバリ', s1: 'STRONG', s2: 'STRONG', continuity: 'ACCESS_GATE_PUBLIC_BOUNDARY_INFRASTRUCTURE' },
  { id: 'nemu', name: 'ネム', s1: 'SUPPORT', s2: 'PRIMARY', continuity: 'REST_CARE_ESCAPE_VS_RECOVERY' },
  { id: 'kuroori', name: 'クロオリ', s1: 'PRIMARY', s2: 'SUPPORT', continuity: 'PRIVACY_CONCEALMENT_PRESERVED_MEANING' },
  { id: 'kaname', name: 'カナメ', s1: 'SUPPORT', s2: 'PRIMARY', continuity: 'PROTECTION_CARE_CARRYING_TOO_MUCH' },
  { id: 'kasumi', name: 'カスミ', s1: 'PRIMARY', s2: 'SUPPORT', continuity: 'NAME_OBSCURITY_REPUTATION' },
  { id: 'toki', name: 'トキ', s1: 'STRONG', s2: 'PRIMARY', continuity: 'MEASUREMENT_TIMING_OPTIMIZATION_SCHEDULE' },
  { id: 'tsumugi', name: 'ツムギ', s1: 'SUPPORT', s2: 'PRIMARY', continuity: 'UNFINISHED_REPAIR_ROOM_TO_CHOOSE' },
  { id: 'ren', name: 'レン', s1: 'STRONG', s2: 'STRONG', continuity: 'DIFFERENCE_DETECTION_CROSS_SEASON_INVESTIGATION' },
] as const;

export const FUTURE15_SEASON_ASSIGNMENTS: ReadonlyArray<{
  id: string;
  name: string;
  s1: SeasonFocus;
  s2: SeasonFocus;
  workingUse: string;
  rosterPromotion: false;
}> = [
  { id: 'hiyori', name: 'ヒヨリ', s1: 'SUPPORT', s2: 'STRONG', workingUse: 'ORDINARY_LIFE_HOUSEHOLD_LENS_CANDIDATE', rosterPromotion: false },
  { id: 'serika', name: 'セリカ', s1: 'STRONG', s2: 'SUPPORT', workingUse: 'INSTITUTION_REPUTATION_CLASSIFICATION_CANDIDATE', rosterPromotion: false },
  { id: 'chloe', name: 'クロエ', s1: 'STRONG', s2: 'STRONG', workingUse: 'LONG_LIVED_ERA_EVIDENCE', rosterPromotion: false },
  { id: 'renji', name: 'レンジ', s1: 'SUPPORT', s2: 'STRONG', workingUse: 'MENTOR_STUDENT_AGE_REVERSAL_ACCUMULATED_SKILL', rosterPromotion: false },
  { id: 'touma', name: 'トウマ', s1: 'CAMEO', s2: 'PRIMARY', workingUse: 'CRAFT_REPAIR_LABOR_REPLACEMENT', rosterPromotion: false },
  { id: 'kuu', name: 'クウ', s1: 'STRONG', s2: 'STRONG', workingUse: 'DOG_RECOGNITION_WITHOUT_TIME_TAGS', rosterPromotion: false },
  { id: 'yomo', name: 'ヨモ', s1: 'PRIMARY', s2: 'SUPPORT', workingUse: 'MULTIPLE_NAMES_MULTIPLE_HOMES_IDENTITY', rosterPromotion: false },
  { id: 'noa', name: 'ノア', s1: 'PRIMARY', s2: 'STRONG', workingUse: 'SAME_MEMORY_COPY_PERSONHOOD', rosterPromotion: false },
  { id: 'rum', name: 'ルム', s1: 'STRONG', s2: 'STRONG', workingUse: 'COLLECTIVE_MEMORY_TO_INDIVIDUAL_EXPERIENCE', rosterPromotion: false },
  { id: 'maki', name: 'マキ', s1: 'SUPPORT', s2: 'STRONG', workingUse: 'ADULT_WORK_HOUSEHOLD_CARE_CANDIDATE', rosterPromotion: false },
  { id: 'suzu', name: 'スズ', s1: 'STRONG', s2: 'SUPPORT', workingUse: 'PRESENTATION_CATEGORY_SOCIAL_LABEL', rosterPromotion: false },
  { id: 'io', name: 'イオ', s1: 'STRONG', s2: 'SUPPORT', workingUse: 'NON_DISCLOSED_GENDER_CLASSIFICATION_PRESSURE', rosterPromotion: false },
  { id: 'kai', name: 'カイ', s1: 'PRIMARY', s2: 'STRONG', workingUse: 'TWIN_SIMILARITY_ONE_UNIT_TREATMENT', rosterPromotion: false },
  { id: 'nao', name: 'ナオ', s1: 'PRIMARY', s2: 'STRONG', workingUse: 'TWIN_SIMILARITY_INDIVIDUAL_DIVERGENCE', rosterPromotion: false },
  { id: 'amane', name: 'アマネ', s1: 'SUPPORT', s2: 'PRIMARY', workingUse: 'ACCESSIBILITY_CITY_DESIGN_CARE_WITHOUT_BURDEN', rosterPromotion: false },
] as const;

export const SAKUYAZA_SEASON_FOCUS = {
  recurringAllSeasons: true,
  s1Heavier: ['ナシロ', 'ハクマ', 'ペタ', 'オリネ'] as const,
  s2Heavier: ['アサトジ', 'ミチグレ', 'ツグリ', 'ユラネ'] as const,
  permanentSeasonTeams: false,
  pairMissionRemainsDynamic: true,
} as const;

export const seasonArchitectureSummary = {
  seasonCountDefined: SEASON_PROBLEM_LANES.length,
  finalSeasonCountFrozen: SERIES_SEASON_RULES.finalSeasonCountFrozen,
  optionalSeason3Candidate: OPTIONAL_SEASON3.enabledAsCandidateArchitecture,
  current21AssignmentCount: CURRENT21_SEASON_ASSIGNMENTS.length,
  future15AssignmentCount: FUTURE15_SEASON_ASSIGNMENTS.length,
  totalCharacterAssignmentCount: CURRENT21_SEASON_ASSIGNMENTS.length + FUTURE15_SEASON_ASSIGNMENTS.length,
  current21UniqueCount: new Set(CURRENT21_SEASON_ASSIGNMENTS.map((entry) => entry.id)).size,
  future15UniqueCount: new Set(FUTURE15_SEASON_ASSIGNMENTS.map((entry) => entry.id)).size,
  core5RecurringCount: CURRENT21_SEASON_ASSIGNMENTS.filter(
    (entry) => ['yui', 'asa', 'nagi', 'michiru', 'tomori'].includes(entry.id) && entry.s1 !== 'CAMEO' && entry.s2 !== 'CAMEO',
  ).length,
  future15AutoPromotionCount: FUTURE15_SEASON_ASSIGNMENTS.filter((entry) => entry.rosterPromotion).length,
  seriesCanonicalHappyEnd: SERIES_SEASON_RULES.seriesCanonicalEnding === 'HAPPY_END',
  runtimeAutoPromotionAllowed: false,
} as const;
