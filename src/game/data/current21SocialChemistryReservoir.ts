import type { CurrentRelationCharacterId } from './currentRelationshipInventory.ts';

export const CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR_RULES = {
  authority: 'docs/current21-social-chemistry-reservoir-v1.md',
  status: 'AUTHOR_RESERVOIR_NON_CANON',
  current21CoverageRequired: 21,
  exactAddressTermsFrozenHere: false,
  exactNicknameProgressionFrozenHere: false,
  exactPartySeatFrozenHere: false,
  exactRomanceRelationFrozenHere: false,
  exactBloodRelationFrozenHere: false,
  exactConflictOutcomeFrozenHere: false,
  existingDirectedSpeechAuthorityOverridden: false,
  existingCurrentRelationshipInventoryOverridden: false,
  friendshipRequiresCallNameChange: false,
  politenessMeansLowTrust: false,
  conflictResetsGrowth: false,
  partySeatEqualsRelationshipRank: false,
  runtimeAutoPromotionAllowed: false,
} as const;

export type Current21SocialChemistryReservoirEntry = Readonly<{
  id: CurrentRelationCharacterId;
  name: string;
  partySeatInstinct: string;
  firstNotice: string;
  checksOn: readonly [CurrentRelationCharacterId, CurrentRelationCharacterId];
  easyFrictionWith: readonly [CurrentRelationCharacterId, CurrentRelationCharacterId];
  laughTriggerWith: readonly [CurrentRelationCharacterId, CurrentRelationCharacterId];
  silenceMode: string;
  conflictRepairAction: string;
  receivesCareBadlyFrom: CurrentRelationCharacterId;
  sharedChoreLane: string;
  exactSeatFrozen: false;
  exactAddressFrozen: false;
  exactRelationshipOutcomeFrozen: false;
}>;

export const CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR: readonly Current21SocialChemistryReservoirEntry[] = [
  { id: 'yui', name: 'ユイ', partySeatInstinct: 'BETWEEN_QUIET_AND_TALKATIVE_PEOPLE', firstNotice: 'WHO_HAS_NOT_JOINED_THE_CONVERSATION', checksOn: ['asa', 'nagi'], easyFrictionWith: ['kage3', 'shiro'], laughTriggerWith: ['koyori', 'gen'], silenceMode: 'LOOKS_AT_PERSON_NOT_PHONE', conflictRepairAction: 'ASKS_WHAT_SHOULD_HAVE_BEEN_ASKED_FIRST', receivesCareBadlyFrom: 'kage1', sharedChoreLane: 'TABLE_RESET_AND_LOST_ITEMS', exactSeatFrozen: false, exactAddressFrozen: false, exactRelationshipOutcomeFrozen: false },
  { id: 'asa', name: 'アサ', partySeatInstinct: 'SEAT_WITH_VISIBLE_NAME_AND_OWN_SPACE', firstNotice: 'HOW_PEOPLE_ADDRESS_EACH_OTHER', checksOn: ['yui', 'kage2'], easyFrictionWith: ['ritsu', 'kage3'], laughTriggerWith: ['yui', 'koyori'], silenceMode: 'WAITS_HALF_STEP_BEFORE_MOVING', conflictRepairAction: 'REASKS_PREFERRED_NAME_OR_CHOICE', receivesCareBadlyFrom: 'kage1', sharedChoreLane: 'CUPS_LABELS_WITH_OPTION_TO_LEAVE_BLANK', exactSeatFrozen: false, exactAddressFrozen: false, exactRelationshipOutcomeFrozen: false },
  { id: 'nagi', name: 'ナギ', partySeatInstinct: 'EDGE_WITH_CLEAR_EXIT_BUT_NOT_ISOLATED', firstNotice: 'OPEN_BAGS_DOORS_AND_PRIVATE_OBJECTS', checksOn: ['kage1', 'tobari'], easyFrictionWith: ['yubi', 'michiru'], laughTriggerWith: ['nemu', 'koyori'], silenceMode: 'CLOSES_OBJECT_BEFORE_CLOSING_CONVERSATION', conflictRepairAction: 'OFFERS_A_REOPENING_TIME_OR_CONDITION', receivesCareBadlyFrom: 'ritsu', sharedChoreLane: 'SAFE_STORAGE_AND_RETURN', exactSeatFrozen: false, exactAddressFrozen: false, exactRelationshipOutcomeFrozen: false },
  { id: 'michiru', name: 'ミチル', partySeatInstinct: 'WHERE_PEOPLE_CAN_COME_AND_GO', firstNotice: 'HOW_TO_GET_BACK_FROM_HERE', checksOn: ['gen', 'tobari'], easyFrictionWith: ['kage3', 'nagi'], laughTriggerWith: ['gen', 'madoka'], silenceMode: 'DRAWS_ROUTE_INSTEAD_OF_EXPLAINING', conflictRepairAction: 'WALKS_THE_OTHER_PERSONS_ROUTE', receivesCareBadlyFrom: 'kage3', sharedChoreLane: 'ERRAND_ROUTE_AND_LATE_ARRIVAL_GUIDE', exactSeatFrozen: false, exactAddressFrozen: false, exactRelationshipOutcomeFrozen: false },
  { id: 'tomori', name: 'トモリ', partySeatInstinct: 'NEAR_BROKEN_CHAIR_OR_TOOL_PILE', firstNotice: 'WHAT_IS_LOOSE_BROKEN_OR_REUSABLE', checksOn: ['kage4', 'hana'], easyFrictionWith: ['shiro', 'kage4'], laughTriggerWith: ['gen', 'yui'], silenceMode: 'FIXES_SOMETHING_WITHOUT_LOOKING_UP', conflictRepairAction: 'ASKS_BEFORE_TOUCHING_THE_OBJECT_AGAIN', receivesCareBadlyFrom: 'hana', sharedChoreLane: 'REPAIR_AND_POST_PARTY_PACKING', exactSeatFrozen: false, exactAddressFrozen: false, exactRelationshipOutcomeFrozen: false },
  { id: 'sen', name: 'セン', partySeatInstinct: 'POSITION_WHERE_ALL_CAN_SEE_SHARED_NOTE', firstNotice: 'WHO_LOOKS_LOST_DURING_EXPLANATION', checksOn: ['koyori', 'shiro'], easyFrictionWith: ['shiro', 'kage3'], laughTriggerWith: ['koyori', 'gen'], silenceMode: 'STOPS_DRAWING_EXPLANATION_LINES', conflictRepairAction: 'TRIES_A_DIFFERENT_EXPLANATION_THEN_LISTENS', receivesCareBadlyFrom: 'koyori', sharedChoreLane: 'GAME_RULES_AND_SHARED_NOTICE_BOARD', exactSeatFrozen: false, exactAddressFrozen: false, exactRelationshipOutcomeFrozen: false },
  { id: 'ritsu', name: 'リツ', partySeatInstinct: 'NEXT_TO_KOYORI_UNTIL_REMinded_NOT_REQUIRED', firstNotice: 'HEADCOUNT_AND_WHO_HAS_NOT_EATEN', checksOn: ['koyori', 'kage1'], easyFrictionWith: ['kage1', 'asa'], laughTriggerWith: ['koyori', 'yubi'], silenceMode: 'TAKES_ON_EXTRA_TASK_WITHOUT_ANNOUNCING', conflictRepairAction: 'GIVES_BACK_A_CHOICE_HE_HAD_TAKEN_OVER', receivesCareBadlyFrom: 'kage1', sharedChoreLane: 'PORTIONING_AND_CARRYING', exactSeatFrozen: false, exactAddressFrozen: false, exactRelationshipOutcomeFrozen: false },
  { id: 'koyori', name: 'コヨリ', partySeatInstinct: 'WHERE_SHE_CAN_SEE_MULTIPLE_PEOPLES_HANDS_AND_PROPS', firstNotice: 'WHO_SKIPPED_HER_IN_COUNTING_OR_EXPLAINING', checksOn: ['ritsu', 'sen'], easyFrictionWith: ['ritsu', 'shiro'], laughTriggerWith: ['yui', 'sen'], silenceMode: 'FIDDLES_WITH_STICKER_OR_SYRUP_DRAWING', conflictRepairAction: 'SAYS_WHAT_SHE_DID_NOT_UNDERSTAND', receivesCareBadlyFrom: 'ritsu', sharedChoreLane: 'SMALL_LABELS_AND_LIGHT_CARRYING', exactSeatFrozen: false, exactAddressFrozen: false, exactRelationshipOutcomeFrozen: false },
  { id: 'gen', name: 'ゲン', partySeatInstinct: 'SEAT_WITH_VIEW_OF_EXIT_AND_PEOPLE_ARRIVING', firstNotice: 'WHO_WILL_NEED_TO_SIT_SOON', checksOn: ['michiru', 'hana'], easyFrictionWith: ['kage3', 'michiru'], laughTriggerWith: ['yui', 'sen'], silenceMode: 'LOOKS_AT_OLD_MARK_OR_ROAD_OUTSIDE', conflictRepairAction: 'ADMITS_WHEN_OLD_ROUTE_NO_LONGER_WORKS', receivesCareBadlyFrom: 'kage1', sharedChoreLane: 'WAYFINDING_AND_HEAVY_OLD_OBJECTS', exactSeatFrozen: false, exactAddressFrozen: false, exactRelationshipOutcomeFrozen: false },
  { id: 'hana', name: 'ハナ', partySeatInstinct: 'NEAR_SMALL_ITEMS_THAT_NEED_PRESERVING', firstNotice: 'WHAT_WILL_BE_THROWN_AWAY_AFTERWARD', checksOn: ['tomori', 'kage4'], easyFrictionWith: ['tomori', 'shiro'], laughTriggerWith: ['koyori', 'gen'], silenceMode: 'WRAPS_OR_SORTS_A_SMALL_OBJECT', conflictRepairAction: 'ASKS_WHETHER_IT_SHOULD_BE_KEPT_AT_ALL', receivesCareBadlyFrom: 'tomori', sharedChoreLane: 'LEFTOVER_STORAGE_AND_SMALL_KEEPSAKES', exactSeatFrozen: false, exactAddressFrozen: false, exactRelationshipOutcomeFrozen: false },
  { id: 'yubi', name: 'ユウビ', partySeatInstinct: 'NEAR_DOOR_OR_HANDOFF_POINT', firstNotice: 'WHAT_STILL_HAS_NOT_REACHED_ITS_PERSON', checksOn: ['tobari', 'kage2'], easyFrictionWith: ['nagi', 'kage2'], laughTriggerWith: ['ritsu', 'madoka'], silenceMode: 'CHECKS_RECIPIENT_OR_ROUTE_NOTE', conflictRepairAction: 'RETURNS_TO_THE_PERSON_AFTER_DELIVERY', receivesCareBadlyFrom: 'tobari', sharedChoreLane: 'HANDOFFS_AND_LATE_DELIVERIES', exactSeatFrozen: false, exactAddressFrozen: false, exactRelationshipOutcomeFrozen: false },
  { id: 'madoka', name: 'マドカ', partySeatInstinct: 'WINDOW_OR_SIDE_WITH_GOOD_VIEW_OF_ROOM', firstNotice: 'SMALL_CHANGE_BEFORE_ANYONE_NAMES_IT', checksOn: ['nemu', 'ren'], easyFrictionWith: ['ren', 'kage3'], laughTriggerWith: ['michiru', 'yubi'], silenceMode: 'WATCHES_TOO_LONG_BEFORE_SPEAKING', conflictRepairAction: 'SAYS_WHAT_WAS_SEEN_AND_WHAT_WAS_ONLY_ASSUMED', receivesCareBadlyFrom: 'ren', sharedChoreLane: 'WINDOW_CHECK_AND_MISSING_DETAIL_NOTE', exactSeatFrozen: false, exactAddressFrozen: false, exactRelationshipOutcomeFrozen: false },
  { id: 'shiro', name: 'シロ', partySeatInstinct: 'NEAR_NOTEBOOK_BUT_AWAY_FROM_CRUMBS', firstNotice: 'WHAT_HAS_NO_CATEGORY_YET', checksOn: ['kage4', 'sen'], easyFrictionWith: ['sen', 'tomori'], laughTriggerWith: ['koyori', 'nemu'], silenceMode: 'CREATES_TEMPORARY_UNKNOWN_PILE', conflictRepairAction: 'CHANGES_LABEL_TO_UNKNOWN_OR_PENDING', receivesCareBadlyFrom: 'sen', sharedChoreLane: 'SORTING_WITH_UNCLASSIFIED_BOX', exactSeatFrozen: false, exactAddressFrozen: false, exactRelationshipOutcomeFrozen: false },
  { id: 'tobari', name: 'トバリ', partySeatInstinct: 'NEAR_EXIT_WITHOUT_BLOCKING_IT', firstNotice: 'WHO_HAS_NO_RETURN_PLAN', checksOn: ['nagi', 'yubi'], easyFrictionWith: ['nagi', 'michiru'], laughTriggerWith: ['yubi', 'gen'], silenceMode: 'CHECKS_GATE_OR_RETURN_MARK', conflictRepairAction: 'PROVIDES_AN_ALTERNATIVE_BEFORE_CLOSING', receivesCareBadlyFrom: 'michiru', sharedChoreLane: 'ARRIVAL_DEPARTURE_AND_LAST_RETURN', exactSeatFrozen: false, exactAddressFrozen: false, exactRelationshipOutcomeFrozen: false },
  { id: 'nemu', name: 'ネム', partySeatInstinct: 'SOFT_EDGE_SEAT_WHERE_DOZING_WONT_BLOCK_OTHERS', firstNotice: 'WHO_IS_PRETENDING_NOT_TO_BE_TIRED', checksOn: ['madoka', 'kage3'], easyFrictionWith: ['kage3', 'sen'], laughTriggerWith: ['nagi', 'shiro'], silenceMode: 'DRAWS_OR_DOZES_BEFORE_EXPLAINING', conflictRepairAction: 'SEPARATES_REST_FROM_AVOIDING_THE_PROBLEM', receivesCareBadlyFrom: 'kage1', sharedChoreLane: 'BLANKETS_AND_QUIET_AFTERCARE', exactSeatFrozen: false, exactAddressFrozen: false, exactRelationshipOutcomeFrozen: false },
  { id: 'kuroori', name: 'クロオリ', partySeatInstinct: 'ONE_STEP_OUTSIDE_CENTER_BUT_NOT_HIDDEN', firstNotice: 'WHAT_OTHERS_ARE_OPENING_WITHOUT_PERMISSION', checksOn: ['yui', 'kage2'], easyFrictionWith: ['yui', 'yubi'], laughTriggerWith: ['kage2', 'kage4'], silenceMode: 'FOLDS_PAPER_INSTEAD_OF_LEAVING', conflictRepairAction: 'SHOWS_WHERE_AND_HOW_THE_OTHER_PERSON_CAN_OPEN_IT', receivesCareBadlyFrom: 'yui', sharedChoreLane: 'PRIVATE_STORAGE_AND_FOLDED_PACKING', exactSeatFrozen: false, exactAddressFrozen: false, exactRelationshipOutcomeFrozen: false },
  { id: 'kage1', name: 'カナメ', partySeatInstinct: 'OUTER_EDGE_OR_WINDWARD_SIDE', firstNotice: 'WHO_IS_PHYSICALLY_EXPOSED_OR_OVERLOADED', checksOn: ['nagi', 'ritsu'], easyFrictionWith: ['ritsu', 'nagi'], laughTriggerWith: ['koyori', 'kage4'], silenceMode: 'MOVES_OBJECT_OR_BODY_POSITION_BEFORE_SPEAKING', conflictRepairAction: 'STEPS_ASIDE_AND_ASKS_WHERE_HELP_IS_WANTED', receivesCareBadlyFrom: 'ritsu', sharedChoreLane: 'HEAVY_CARRYING_AND_SHELTER_POSITION', exactSeatFrozen: false, exactAddressFrozen: false, exactRelationshipOutcomeFrozen: false },
  { id: 'kage2', name: 'カスミ', partySeatInstinct: 'SIDE_SEAT_WITH_OPTION_TO_LISTEN', firstNotice: 'WHO_IS_BEING_FORCED_TO_EXPLAIN_THEMSELF', checksOn: ['asa', 'kuroori'], easyFrictionWith: ['yubi', 'asa'], laughTriggerWith: ['kuroori', 'madoka'], silenceMode: 'LETS_MISTAKE_OR_SENTENCE_SIT_UNCORRECTED', conflictRepairAction: 'ASKS_WHETHER_CORRECTION_OR_PRIVACY_IS_WANTED', receivesCareBadlyFrom: 'yubi', sharedChoreLane: 'ERASABLE_NOTES_AND_PRIVATE_HANDOFF', exactSeatFrozen: false, exactAddressFrozen: false, exactRelationshipOutcomeFrozen: false },
  { id: 'kage3', name: 'トキ', partySeatInstinct: 'PLACE_WITH_CLEAR_CLOCK_OR_REFERENCE_POINT', firstNotice: 'WHAT_CLAIM_HAS_NO_MEASUREMENT_OR_TIME', checksOn: ['nemu', 'michiru'], easyFrictionWith: ['michiru', 'gen'], laughTriggerWith: ['nemu', 'ren'], silenceMode: 'MEASURES_INSTEAD_OF_ANSWERING', conflictRepairAction: 'LEAVES_AN_UNMEASURED_FIELD_EXPLICITLY_OPEN', receivesCareBadlyFrom: 'nemu', sharedChoreLane: 'TIMING_AND_COUNTING_WITH_UNKNOWN_FIELD', exactSeatFrozen: false, exactAddressFrozen: false, exactRelationshipOutcomeFrozen: false },
  { id: 'kage4', name: 'ツムギ', partySeatInstinct: 'NEAR_REPAIRABLE_CLOTH_PAPER_OR_UNFINISHED_THING', firstNotice: 'WHAT_SOMEONE_IS_RUSHING_TO_FINISH', checksOn: ['tomori', 'shiro'], easyFrictionWith: ['tomori', 'shiro'], laughTriggerWith: ['kuroori', 'kage1'], silenceMode: 'STITCHES_OR_LEAVES_LAST_PAGE_BLANK', conflictRepairAction: 'ASKS_WHAT_SHOULD_END_AND_WHAT_SHOULD_REMAIN_OPEN', receivesCareBadlyFrom: 'tomori', sharedChoreLane: 'MENDING_AND_UNFINISHED_PACKING', exactSeatFrozen: false, exactAddressFrozen: false, exactRelationshipOutcomeFrozen: false },
  { id: 'ren', name: 'レン', partySeatInstinct: 'ANGLE_WITH_VIEW_OF_MULTIPLE_VERSIONS_OR_PEOPLE', firstNotice: 'THE_SMALLEST_DIFFERENCE_BETWEEN_TWO_ACCOUNTS', checksOn: ['madoka', 'kage3'], easyFrictionWith: ['madoka', 'kage3'], laughTriggerWith: ['kage3', 'michiru'], silenceMode: 'TILTS_HEAD_AND_RECHECKS_BEFORE_CLAIMING_MEANING', conflictRepairAction: 'SEPARATES_DIFFERENCE_FROM_INTERPRETATION', receivesCareBadlyFrom: 'madoka', sharedChoreLane: 'COMPARE_VERSIONS_AND_FIND_MISSING_DETAIL', exactSeatFrozen: false, exactAddressFrozen: false, exactRelationshipOutcomeFrozen: false },
] as const;

export const current21SocialChemistryReservoirSummary = {
  characterCount: CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR.length,
  uniqueCharacterCount: new Set(CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR.map((entry) => entry.id)).size,
  uniqueSeatInstinctCount: new Set(CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR.map((entry) => entry.partySeatInstinct)).size,
  uniqueFirstNoticeCount: new Set(CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR.map((entry) => entry.firstNotice)).size,
  allHaveTwoCheckOnSeeds: CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR.every((entry) => entry.checksOn.length === 2),
  allHaveTwoFrictionSeeds: CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR.every((entry) => entry.easyFrictionWith.length === 2),
  allHaveTwoLaughSeeds: CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR.every((entry) => entry.laughTriggerWith.length === 2),
  exactAddressTermsFrozenHere: false,
  runtimeAutoPromotionAllowed: false,
} as const;
