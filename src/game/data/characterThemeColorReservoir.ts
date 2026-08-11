export const CHARACTER_THEME_COLOR_RULES = {
  authority: 'docs/character-theme-color-reservoir-v1.md',
  status: 'AUTHOR_RESERVOIR_NON_CANON',
  characterCoverageRequired: 36,
  primaryHexMustBeUniqueAcrossWorking36: true,
  exactFinalPaletteFrozenHere: false,
  themeColorChangesSkinHairEyes: false,
  themeColorDeterminesCostumePalette: false,
  themeColorDeterminesMoralityOrFaction: false,
  themeColorAloneMayEncodeRelationship: false,
  themeColorAloneMayEncodeBloodline: false,
  constellationInfluenceFrozenHere: false,
  starBeastInfluenceFrozenHere: false,
  colorOnlyAccessibilityAllowed: false,
  runtimeAutoPromotionAllowed: false,
} as const;

export type ThemeColorEntry = Readonly<{
  id: string;
  name: string;
  primaryHex: `#${string}`;
  accentHex: `#${string}`;
  nightGlowHex: `#${string}`;
  familyHueCandidate: string | null;
  rationale: string;
  constellationInfluenceStatus: 'OPEN_REVIEW_LATER';
  finalApproved: false;
}>;

export const CHARACTER_THEME_COLOR_CANDIDATES: readonly ThemeColorEntry[] = [
  { id: 'yui', name: 'ユイ', primaryHex: '#E85D4A', accentHex: '#F3A091', nightGlowHex: '#FF7A63', familyHueCandidate: null, rationale: 'PRESENT_HUMAN_WARMTH_SMALL_SOS_AND_ARAKAWA_STREET_LIGHT_WITHOUT_RETRO_COSTUME', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'asa', name: 'アサ', primaryHex: '#6676E8', accentHex: '#A3AFF5', nightGlowHex: '#8998FF', familyHueCandidate: null, rationale: 'FUTURE_PERSONHOOD_CLEARNESS_AND_CHOSEN_IDENTITY_WITHOUT_MACHINE_BLUE_STEREOTYPE', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'nagi', name: 'ナギ', primaryHex: '#416A86', accentHex: '#7FA1B5', nightGlowHex: '#5D8CAA', familyHueCandidate: null, rationale: 'PRIVACY_CLOSURE_EARLY_MOBILE_NIGHT_AND_REOPENING_WITHOUT_PARENT_LINEAGE_PROOF', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'michiru', name: 'ミチル', primaryHex: '#D9902F', accentHex: '#F0BD70', nightGlowHex: '#F5A64A', familyHueCandidate: null, rationale: 'ROUTE_SIGN_WARMTH_DEVELOPMENT_ENERGY_AND_DETOUR_CURIOSITY', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'tomori', name: 'トモリ', primaryHex: '#8A6345', accentHex: '#B79473', nightGlowHex: '#A77A55', familyHueCandidate: null, rationale: 'WORKBENCH_WOOD_BRASS_REPAIR_AND_REUSE_WITHOUT_POVERTY_BROWN_DEFAULT', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'sen', name: 'セン', primaryHex: '#3366B0', accentHex: '#78A1D4', nightGlowHex: '#4D84D8', familyHueCandidate: null, rationale: 'INK_DIAGRAM_CLARITY_AND_TEACHING_SPACE_WITHOUT_SCHOOL_UNIFORM_DEPENDENCE', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'ritsu', name: 'リツ', primaryHex: '#B9475A', accentHex: '#DD8090', nightGlowHex: '#D95F73', familyHueCandidate: 'RITSU_KOYORI_ROSE_FAMILY', rationale: 'HOUSEHOLD_CARE_STRENGTH_AND_SHARED_SIBLING_WARMTH_WITH_DEEPER_VALUE_THAN_KOYORI', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'koyori', name: 'コヨリ', primaryHex: '#ED8FA1', accentHex: '#F5BBC5', nightGlowHex: '#FF9CAF', familyHueCandidate: 'RITSU_KOYORI_ROSE_FAMILY', rationale: 'CHILD_CHOICE_STICKERS_AND_SIBLING_HUE_ECHO_WITH_DISTINCT_LIGHTNESS', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'gen', name: 'ゲン', primaryHex: '#6F7A42', accentHex: '#A4AB70', nightGlowHex: '#8DA455', familyHueCandidate: null, rationale: 'OLD_ROUTE_MOSS_OLIVE_AND_PRACTICAL_CONTINUITY_WITHOUT_OLD_EQUALS_DULL', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'hana', name: 'ハナ', primaryHex: '#9A5D78', accentHex: '#C58CA4', nightGlowHex: '#B97896', familyHueCandidate: null, rationale: 'PRESERVED_FLOWER_CLOTH_AND_ADULT_WARMTH_WITHOUT_FEMININE_OLDER_STEREOTYPE', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'yubi', name: 'ユウビ', primaryHex: '#2C8D8A', accentHex: '#71BBB8', nightGlowHex: '#43B5B0', familyHueCandidate: null, rationale: 'DELIVERY_HANDOFF_ROUTE_AND_RETURN_SIGNAL_WITHOUT_POSTAL_BRAND_REFERENCE', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'madoka', name: 'マドカ', primaryHex: '#8A73B9', accentHex: '#B8A6DA', nightGlowHex: '#A18CD8', familyHueCandidate: null, rationale: 'WINDOW_TWILIGHT_OBSERVATION_AND_SOFT_SIDE_VIEW_WITHOUT_MYSTIC_SEER_CODE', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'shiro', name: 'シロ', primaryHex: '#7C93A8', accentHex: '#ADC0D1', nightGlowHex: '#9CB4C9', familyHueCandidate: null, rationale: 'PAPER_ARCHIVE_UNKNOWN_FIELD_AND_COOL_NEUTRALITY_WITHOUT_WHITE_ONLY_IDENTITY', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'tobari', name: 'トバリ', primaryHex: '#283E67', accentHex: '#60749B', nightGlowHex: '#3D5A8E', familyHueCandidate: null, rationale: 'SHINJUKU_NIGHT_TRANSIT_GATE_AND_RETURN_DEPTH_WITHOUT_ALL_BLACK_DESIGN', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'nemu', name: 'ネム', primaryHex: '#A578A6', accentHex: '#CBA8CC', nightGlowHex: '#BE8BC0', familyHueCandidate: null, rationale: 'REST_DREAM_SOFTNESS_AND_RECOVERY_WITHOUT_SLEEPY_PASTEL_ONLY_CHARACTERIZATION', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'kuroori', name: 'クロオリ', primaryHex: '#51485F', accentHex: '#81758E', nightGlowHex: '#6D607C', familyHueCandidate: null, rationale: 'FOLD_PRIVACY_REVERSIBLE_CLOSURE_AND_SHADOW_WITHOUT_MORAL_DARKNESS', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'kage1', name: 'カナメ', primaryHex: '#8A3F4C', accentHex: '#BA7380', nightGlowHex: '#A95768', familyHueCandidate: null, rationale: 'PROTECTIVE_WARMTH_BROAD_PHYSICAL_PRESENCE_AND_BOUNDARY_WITHOUT_AGGRESSION_RED', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'kage2', name: 'カスミ', primaryHex: '#6F927C', accentHex: '#A0B8A8', nightGlowHex: '#89AA95', familyHueCandidate: null, rationale: 'ERASABLE_MARK_MIST_QUIET_REGISTER_AND_REVISION_WITHOUT_ORIGIN_CODING', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'kage3', name: 'トキ', primaryHex: '#3B8FA6', accentHex: '#7BB8C7', nightGlowHex: '#57AAC0', familyHueCandidate: null, rationale: 'MEASUREMENT_TIME_REFERENCE_AND_EXPLICIT_UNKNOWN_WITHOUT_COLD_TECHNICIAN_BLUE', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'kage4', name: 'ツムギ', primaryHex: '#B57470', accentHex: '#D6A6A3', nightGlowHex: '#C98C88', familyHueCandidate: null, rationale: 'THREAD_MEND_UNFINISHED_WARMTH_AND_VISIBLE_TRACE_WITHOUT_PINK_CRAFT_GENDER_CODE', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'ren', name: 'レン', primaryHex: '#719A3B', accentHex: '#A4BE73', nightGlowHex: '#8DB64B', familyHueCandidate: null, rationale: 'DIFFERENCE_DETECTION_FRESH_CONTRAST_AND_TWO_SIMILAR_THINGS_WITHOUT_DETECTIVE_GREEN_CODE', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'hiyori', name: 'ヒヨリ', primaryHex: '#D7A62B', accentHex: '#EDCB75', nightGlowHex: '#F2BD45', familyHueCandidate: null, rationale: 'BRIGHT_SOCIAL_WARMTH_AND_ORDINARY_JOY_WITHOUT_SKIN_TONE_TROPICAL_PALETTE_LINK', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'serika', name: 'セリカ', primaryHex: '#3D8D71', accentHex: '#7DB8A3', nightGlowHex: '#55AA8B', familyHueCandidate: null, rationale: 'RESPONSIBILITY_POISE_AND_DELEGATION_GROWTH_WITHOUT_STATUS_JEWEL_TONE_ASSUMPTION', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'chloe', name: 'クロエ', primaryHex: '#7B405A', accentHex: '#A97389', nightGlowHex: '#96526F', familyHueCandidate: null, rationale: 'LONG_LIFE_RECENT_AND_OLD_LOVE_COEXISTENCE_WITHOUT_TIMELESS_GOTHIC_BLACK', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'renji', name: 'レンジ', primaryHex: '#A76734', accentHex: '#D19A6A', nightGlowHex: '#C47C43', familyHueCandidate: null, rationale: 'CRAFT_HEAT_TOOL_WOOD_AND_OWN_CHOICE_BEYOND_MASTER_WITHOUT_TOMORI_LINEAGE_CODE', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'touma', name: 'トウマ', primaryHex: '#397A73', accentHex: '#77AAA5', nightGlowHex: '#509990', familyHueCandidate: null, rationale: 'CRAFT_AUTHORSHIP_COOL_PATINA_AND_RELATIONSHIP_LIFE_WITHOUT_SKIN_OR_BLOOD_PROOF', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'kuu', name: 'クウ', primaryHex: '#B9804B', accentHex: '#D9AD82', nightGlowHex: '#C89560', familyHueCandidate: null, rationale: 'DOG_WARMTH_EARTH_AND_HOUSEHOLD_COMFORT_WITHOUT_BREED_OR_TRUTH_DETECTOR_SYMBOL', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'yomo', name: 'ヨモ', primaryHex: '#829469', accentHex: '#ADBA9B', nightGlowHex: '#99AC7C', familyHueCandidate: null, rationale: 'CAT_MULTIPLE_HOMES_SAFE_SPOTS_AND_ORDINARY_GREEN_WITHOUT_TOURISM_MASCOT_CODE', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'noa', name: 'ノア', primaryHex: '#5D69B8', accentHex: '#98A1D9', nightGlowHex: '#7885D5', familyHueCandidate: null, rationale: 'SAME_MEMORY_BRANCHING_PERSONHOOD_AND_PARALLEL_DIFFERENCE_WITHOUT_MACHINE_MONOCHROME', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'rum', name: 'ルム', primaryHex: '#5BA88D', accentHex: '#8FCEB8', nightGlowHex: '#72C1A5', familyHueCandidate: null, rationale: 'MAINTENANCE_SERVICE_SHARED_MEMORY_AND_INSTANCE_WARMTH_WITHOUT_HUMANIZATION_PINK', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'maki', name: 'マキ', primaryHex: '#C65C3D', accentHex: '#E4947E', nightGlowHex: '#E87455', familyHueCandidate: null, rationale: 'DECISION_ENERGY_WORK_AND_OPEN_OPTION_WITHOUT_BISEXUALITY_COLOR_METAPHOR', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'suzu', name: 'スズ', primaryHex: '#C65B9A', accentHex: '#E49BC3', nightGlowHex: '#DE73AD', familyHueCandidate: null, rationale: 'CHOSEN_PRESENTATION_PLAYFUL_VISIBILITY_AND_STYLE_WITHOUT_SEXUALITY_OR_GENDER_PROOF', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'io', name: 'イオ', primaryHex: '#7085A3', accentHex: '#A3B2C8', nightGlowHex: '#8EA2BD', familyHueCandidate: null, rationale: 'PROVISIONAL_CATEGORY_LISTENING_AND_SOUND_SPACE_WITHOUT_ANDROGYNOUS_MYSTERY_SILVER', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'kai', name: 'カイ', primaryHex: '#4B86C2', accentHex: '#88B4DF', nightGlowHex: '#65A3DC', familyHueCandidate: 'KAI_NAO_COOL_SKY_TWIN_FAMILY', rationale: 'TWIN_SHARED_ROOT_COOL_SKY_FAMILY_WITH_KAI_DEEPER_BLUE_NOT_FORCED_OPPOSITE', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'nao', name: 'ナオ', primaryHex: '#7387D4', accentHex: '#A9B5EA', nightGlowHex: '#8E9FE8', familyHueCandidate: 'KAI_NAO_COOL_SKY_TWIN_FAMILY', rationale: 'TWIN_SHARED_ROOT_COOL_SKY_FAMILY_WITH_NAO_PERIWINKLE_VARIANT_NOT_COPY_PROOF', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
  { id: 'amane', name: 'アマネ', primaryHex: '#379A8C', accentHex: '#78C1B7', nightGlowHex: '#50B9AA', familyHueCandidate: null, rationale: 'MOBILITY_ROUTE_CHOICE_AND_CITY_ACCESS_WITHOUT_MEDICAL_TEAL_OR_WHEELCHAIR_SYMBOLISM', constellationInfluenceStatus: 'OPEN_REVIEW_LATER', finalApproved: false },
] as const;

export const characterThemeColorSummary = {
  characterCount: CHARACTER_THEME_COLOR_CANDIDATES.length,
  uniqueIds: new Set(CHARACTER_THEME_COLOR_CANDIDATES.map((entry) => entry.id)).size,
  uniquePrimaryHexCount: new Set(CHARACTER_THEME_COLOR_CANDIDATES.map((entry) => entry.primaryHex.toUpperCase())).size,
  uniqueAccentHexCount: new Set(CHARACTER_THEME_COLOR_CANDIDATES.map((entry) => entry.accentHex.toUpperCase())).size,
  uniqueNightGlowHexCount: new Set(CHARACTER_THEME_COLOR_CANDIDATES.map((entry) => entry.nightGlowHex.toUpperCase())).size,
  siblingHueFamilyMembers: CHARACTER_THEME_COLOR_CANDIDATES.filter((entry) => entry.familyHueCandidate === 'RITSU_KOYORI_ROSE_FAMILY').length,
  twinHueFamilyMembers: CHARACTER_THEME_COLOR_CANDIDATES.filter((entry) => entry.familyHueCandidate === 'KAI_NAO_COOL_SKY_TWIN_FAMILY').length,
  allConstellationInfluenceOpen: CHARACTER_THEME_COLOR_CANDIDATES.every((entry) => entry.constellationInfluenceStatus === 'OPEN_REVIEW_LATER'),
  allFinalUnapproved: CHARACTER_THEME_COLOR_CANDIDATES.every((entry) => !entry.finalApproved),
  runtimeAutoPromotionAllowed: false,
} as const;
