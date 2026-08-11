export const CORE5_ERA_ASSIGNMENTS = [
  {
    characterId: 'tomori',
    name: 'トモリ',
    realityEra: '1940S_JAPAN',
    eraLabel: '1940年代系 日本',
    narrativeRole: 'ERA_LEAD',
    species: 'HUMAN',
    exactYearFrozen: false,
    coreBridge: 'REPAIR_REUSE_HANDWORK_TO_INHERITED_LIGHT',
    forbiddenAutoCanon: ['MILITARY_SERVICE', 'AIR_RAID_SURVIVOR', 'WAR_ORPHAN', 'FAMILY_DEATH'] as const,
  },
  {
    characterId: 'michiru',
    name: 'ミチル',
    realityEra: '1980S_JAPAN',
    eraLabel: '1980年代系 日本',
    narrativeRole: 'ERA_LEAD',
    species: 'HUMAN',
    exactYearFrozen: false,
    coreBridge: 'PAPER_MAP_REDEVELOPMENT_ROUTE_PLURALITY',
    forbiddenAutoCanon: ['BUBBLE_STEREOTYPE_ONLY', 'EXACT_CITY', 'EXACT_INCIDENT'] as const,
  },
  {
    characterId: 'nagi',
    name: 'ナギ',
    realityEra: '2000S_JAPAN',
    eraLabel: '2000年代系 日本',
    narrativeRole: 'ERA_LEAD',
    species: 'HUMAN',
    exactYearFrozen: false,
    coreBridge: 'EARLY_NETWORK_PRIVACY_ACCESS_AND_CONSENT',
    forbiddenAutoCanon: ['CYBERCRIME_VICTIM', 'STALKING_VICTIM', 'ABUSE_BACKSTORY', 'EXACT_SERVICE_BRAND'] as const,
  },
  {
    characterId: 'yui',
    name: 'ユイ',
    realityEra: 'PRESENT_DAY_JAPAN',
    eraLabel: '現代日本',
    narrativeRole: 'OVERALL_VIEWPOINT_AND_PRESENT_ERA_LEAD',
    species: 'HUMAN',
    exactYearFrozen: false,
    coreBridge: 'OVERDOCUMENTED_PRESENT_MEMORY_AND_CHOICE',
    forbiddenAutoCanon: ['EXACT_YEAR_DISPLAY_REQUIRED', 'DREAM_PHOTO_AS_REALITY_PROOF'] as const,
  },
  {
    characterId: 'asa',
    name: 'アサ',
    realityEra: 'FUTURE_ANDROID_ROBOT_SOCIETY',
    eraLabel: '未来 Android / Robot共存社会',
    narrativeRole: 'PROTAGONIST_GRADE_BUDDY_AND_FUTURE_ERA_LEAD',
    species: 'HUMAN',
    exactYearFrozen: false,
    coreBridge: 'NAME_CHOSEN_NAME_DESIGNATION_AND_PERSONHOOD',
    forbiddenAutoCanon: ['ANDROID_SPECIES', 'FIXED_POLITICAL_SIDE', 'ANDROID_INCIDENT_BEREAVEMENT', 'EXACT_FUTURE_LAW'] as const,
  },
] as const;

export const CORE5_ERA_CANON = {
  authority: 'CURRENT_CORE5_ERA_ASSIGNMENT',
  source: 'docs/core5-era-character-master-v1.md',
  allFiveDistinctRealityErasRequired: true,
  exactYearsFrozen: false,
  eraAssignmentFrozenAtLaneLevel: true,
  yuiOverallViewpoint: true,
  asaRomanceWithYui: false,
  newEraMeansTechnologyUpgrade: false,
  eraAutomaticallyCreatesTrauma: false,
  runtimeAutoPromotionAllowed: false,
} as const;

const ids = CORE5_ERA_ASSIGNMENTS.map((entry) => entry.characterId);
const eras = CORE5_ERA_ASSIGNMENTS.map((entry) => entry.realityEra);

export const core5EraCanonSummary = {
  characterCount: ids.length,
  uniqueCharacterCount: new Set(ids).size,
  uniqueEraCount: new Set(eras).size,
  futureHumanCount: CORE5_ERA_ASSIGNMENTS.filter(
    (entry) => entry.realityEra === 'FUTURE_ANDROID_ROBOT_SOCIETY' && entry.species === 'HUMAN',
  ).length,
  allExactYearsOpen: CORE5_ERA_ASSIGNMENTS.every((entry) => !entry.exactYearFrozen),
  runtimeAutoPromotionAllowed: false,
} as const;
