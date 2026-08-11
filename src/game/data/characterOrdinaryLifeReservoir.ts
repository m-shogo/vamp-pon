export const CHARACTER_ORDINARY_LIFE_RESERVOIR_RULES = {
  authority: 'docs/character-ordinary-life-reservoir-v1.md',
  status: 'AUTHOR_RESERVOIR_NON_CANON',
  current21CoverageRequired: 21,
  future15CoverageRequired: 15,
  totalCoverageRequired: 36,
  reservoirInclusionEqualsCanon: false,
  reservoirInclusionEqualsRuntimePlayable: false,
  future15ReservoirInclusionPromotesRoster: false,
  exactDialectVocabularyFrozenHere: false,
  exactRealityOriginFrozenHere: false,
  exactFamilyRelationFrozenHere: false,
  exactRomanceRelationFrozenHere: false,
  animalBehaviorEqualsTruthDetector: false,
  angerRevealEqualsTrueSelf: false,
  apologyEqualsForgiveness: false,
  partyAttendanceEqualsAbsolution: false,
  runtimeAutoPromotionAllowed: false,
} as const;

export type OrdinaryLifeRoster = 'CURRENT21' | 'FUTURE15';

export const CHARACTER_ORDINARY_LIFE_RESERVOIR_INDEX = [
  { id: 'yui', name: 'ユイ', roster: 'CURRENT21', focus: ['PRESENT_INFORMATION', 'ARAKAWA_DAILY_LIFE', 'SHARED_FOOD'] },
  { id: 'asa', name: 'アサ', roster: 'CURRENT21', focus: ['FUTURE_HUMAN', 'PERSONHOOD_AFTERCARE', 'NAME_CHOICE'] },
  { id: 'nagi', name: 'ナギ', roster: 'CURRENT21', focus: ['PRIVACY', 'EARLY_MOBILE_INTERNET', 'REOPENING'] },
  { id: 'michiru', name: 'ミチル', roster: 'CURRENT21', focus: ['ROUTES', 'DEVELOPMENT', 'GETTING_LOST_TOGETHER'] },
  { id: 'tomori', name: 'トモリ', roster: 'CURRENT21', focus: ['REPAIR', 'REUSE', 'SCARCITY_MEMORY'] },
  { id: 'sen', name: 'セン', roster: 'CURRENT21', focus: ['TEACHING', 'EXPLANATION', 'LANGUAGE'] },
  { id: 'ritsu', name: 'リツ', roster: 'CURRENT21', focus: ['SHARING', 'SIBLING', 'FAIRNESS'] },
  { id: 'koyori', name: 'コヨリ', roster: 'CURRENT21', focus: ['CHILD_LENS', 'NAMING', 'HOUSEHOLD'] },
  { id: 'gen', name: 'ゲン', roster: 'CURRENT21', focus: ['OLD_ROUTE_MEMORY', 'OLDER_ADULT', 'TOOLS'] },
  { id: 'hana', name: 'ハナ', roster: 'CURRENT21', focus: ['PRESERVATION', 'HOUSEHOLD', 'SEASONAL_OBJECTS'] },
  { id: 'yubi', name: 'ユウビ', roster: 'CURRENT21', focus: ['DELIVERY', 'ADDRESS', 'RETURN_MESSAGE'] },
  { id: 'madoka', name: 'マドカ', roster: 'CURRENT21', focus: ['OBSERVATION', 'WITNESS', 'ACTION_DELAY'] },
  { id: 'shiro', name: 'シロ', roster: 'CURRENT21', focus: ['ARCHIVE', 'UNKNOWN', 'CLASSIFICATION'] },
  { id: 'tobari', name: 'トバリ', roster: 'CURRENT21', focus: ['GATE', 'SHINJUKU_TRANSIT', 'RETURN_ACCESS'] },
  { id: 'nemu', name: 'ネム', roster: 'CURRENT21', focus: ['REST', 'RECOVERY', 'DREAM'] },
  { id: 'kuroori', name: 'クロオリ', roster: 'CURRENT21', focus: ['PRIVACY', 'FOLDING', 'CONCEALMENT'] },
  { id: 'kage1', name: 'カナメ', roster: 'CURRENT21', focus: ['PROTECTION', 'PHYSICAL_CARE', 'BOUNDARY'] },
  { id: 'kage2', name: 'カスミ', roster: 'CURRENT21', focus: ['OBSCURITY', 'CORRECTION_SPACE', 'DIALECT_HIDING'] },
  { id: 'kage3', name: 'トキ', roster: 'CURRENT21', focus: ['MEASUREMENT', 'TIME', 'UNKNOWN_METRIC'] },
  { id: 'kage4', name: 'ツムギ', roster: 'CURRENT21', focus: ['UNFINISHED', 'REPAIR', 'ROOM_TO_CHOOSE'] },
  { id: 'ren', name: 'レン', roster: 'CURRENT21', focus: ['DIFFERENCE_DETECTION', 'FOCUS', 'INTERPRETATION_GUARD'] },
  { id: 'hiyori', name: 'ヒヨリ', roster: 'FUTURE15', focus: ['HOUSEHOLD', 'REGIONAL_ROOT', 'APPEARANCE_ORIGIN_GUARD'] },
  { id: 'serika', name: 'セリカ', roster: 'FUTURE15', focus: ['INSTITUTION', 'REPUTATION', 'PERSON_VS_TITLE'] },
  { id: 'chloe', name: 'クロエ', roster: 'FUTURE15', focus: ['LONG_LIVED', 'MULTI_ERA', 'HISTORY_WITHOUT_OMNISCIENCE'] },
  { id: 'renji', name: 'レンジ', roster: 'FUTURE15', focus: ['MENTOR_STUDENT', 'CRAFT', 'LEARNING'] },
  { id: 'touma', name: 'トウマ', roster: 'FUTURE15', focus: ['CRAFT', 'REPAIR', 'LINEAGE_NOT_DESTINY'] },
  { id: 'kuu', name: 'クウ', roster: 'FUTURE15', focus: ['DOG', 'HOUSEHOLD_MIGRATION', 'SENSORY_NOT_TRUTH'] },
  { id: 'yomo', name: 'ヨモ', roster: 'FUTURE15', focus: ['ANIMAL', 'MULTIPLE_HOMES', 'MULTIPLE_NAMES'] },
  { id: 'noa', name: 'ノア', roster: 'FUTURE15', focus: ['COPY', 'PERSONHOOD', 'ACTIVATION_VS_HOME'] },
  { id: 'rum', name: 'ルム', roster: 'FUTURE15', focus: ['COLLECTIVE_MEMORY', 'INDIVIDUAL_QUIRK', 'SHARED_VS_OWN'] },
  { id: 'maki', name: 'マキ', roster: 'FUTURE15', focus: ['ADULT_WORK', 'DECISION', 'CARE'] },
  { id: 'suzu', name: 'スズ', roster: 'FUTURE15', focus: ['PRESENTATION', 'CATEGORY', 'CHOICE'] },
  { id: 'io', name: 'イオ', roster: 'FUTURE15', focus: ['GENDER_UNDISCLOSED', 'CLASSIFICATION_PRESSURE', 'CHOICE_NOT_TO_ANSWER'] },
  { id: 'kai', name: 'カイ', roster: 'FUTURE15', focus: ['TWIN', 'SIMILARITY', 'INDIVIDUAL_CHOICE'] },
  { id: 'nao', name: 'ナオ', roster: 'FUTURE15', focus: ['TWIN', 'DIVERGENCE', 'COMPARISON_PRESSURE'] },
  { id: 'amane', name: 'アマネ', roster: 'FUTURE15', focus: ['ACCESSIBILITY', 'MOBILITY', 'CITY_DESIGN'] },
] as const satisfies ReadonlyArray<{
  id: string;
  name: string;
  roster: OrdinaryLifeRoster;
  focus: readonly [string, string, string];
}>;

export const characterOrdinaryLifeReservoirSummary = {
  total: CHARACTER_ORDINARY_LIFE_RESERVOIR_INDEX.length,
  current21: CHARACTER_ORDINARY_LIFE_RESERVOIR_INDEX.filter((entry) => entry.roster === 'CURRENT21').length,
  future15: CHARACTER_ORDINARY_LIFE_RESERVOIR_INDEX.filter((entry) => entry.roster === 'FUTURE15').length,
  uniqueIds: new Set(CHARACTER_ORDINARY_LIFE_RESERVOIR_INDEX.map((entry) => entry.id)).size,
  uniqueNames: new Set(CHARACTER_ORDINARY_LIFE_RESERVOIR_INDEX.map((entry) => entry.name)).size,
  future15Promoted: false,
  runtimeAutoPromotionAllowed: false,
} as const;
