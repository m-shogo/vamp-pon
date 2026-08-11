export type Future15Id = 'hiyori' | 'serika' | 'chloe' | 'renji' | 'touma' | 'kuu' | 'yomo' | 'noa' | 'rum' | 'maki' | 'suzu' | 'io' | 'kai' | 'nao' | 'amane';
export type CurrentBridgeId = 'yui' | 'asa' | 'nagi' | 'michiru' | 'tomori' | 'sen' | 'ritsu' | 'koyori' | 'gen' | 'hana' | 'yubi' | 'madoka' | 'shiro' | 'tobari' | 'nemu' | 'kuroori' | 'kage1' | 'kage2' | 'kage3' | 'kage4' | 'ren';

export const FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR_RULES = {
  authority: 'docs/future15-social-chemistry-reservoir-v1.md',
  status: 'FUTURE15_AUTHOR_RESERVOIR_NOT_CURRENT21',
  future15CoverageRequired: 15,
  reservoirPromotesToCurrent21: false,
  reservoirLocksSequelRoster: false,
  exactRomanceFrozenHere: false,
  exactSexualityFrozenHere: false,
  exactCountryNationalityFrozenHere: false,
  exactFamilyFrozenHere: false,
  exactCallNameFrozenHere: false,
  exactPartySeatFrozenHere: false,
  animalBehaviorEqualsTruthDetector: false,
  wheelChairUseIsCureArc: false,
  twinSimilarityEqualsSamePerson: false,
  robotOrCopyEqualsLessPerson: false,
  runtimeAutoPromotionAllowed: false,
} as const;

export const FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR = [
  { id: 'hiyori', name: 'ヒヨリ', partyInstinct: 'BRIGHT_EDGE_NOT_CENTER_BY_FORCE', currentBridges: ['nemu', 'kage2'], futurePeers: ['suzu', 'maki'], friction: ['serika', 'maki'], laugh: ['suzu', 'amane'], repair: 'ASKS_WHETHER_ENCOURAGEMENT_OR_QUIET_COMPANY_IS_WANTED' },
  { id: 'serika', name: 'セリカ', partyInstinct: 'SETS_SEATS_THEN_FORGETS_OWN', currentBridges: ['hana', 'kage1'], futurePeers: ['maki', 'hiyori'], friction: ['maki', 'hiyori'], laugh: ['hiyori', 'renji'], repair: 'DELEGATES_ONE_REAL_TASK_INSTEAD_OF_APOLOGIZING_WITH_MORE_WORK' },
  { id: 'chloe', name: 'クロエ', partyInstinct: 'SITS_WHERE_ARRIVALS_AND_DEPARTURES_ARE_VISIBLE', currentBridges: ['tomori', 'gen'], futurePeers: ['renji', 'touma'], friction: ['renji', 'noa'], laugh: ['renji', 'yomo'], repair: 'LETS_THE_OTHER_PERSON_LEAVE_WITHOUT_TURNING_DEPARTURE_INTO_REJECTION' },
  { id: 'renji', name: 'レンジ', partyInstinct: 'NEAR_WORKBENCH_BUT_NOT_MASTERS_SEAT', currentBridges: ['sen', 'tomori'], futurePeers: ['chloe', 'touma'], friction: ['chloe', 'touma'], laugh: ['chloe', 'maki'], repair: 'SEPARATES_WHAT_WAS_TAUGHT_FROM_WHAT_HE_CHOOSES_NOW' },
  { id: 'touma', name: 'トウマ', partyInstinct: 'NEAR_OBJECTS_WITH_VISIBLE_MAKER_TRACES', currentBridges: ['tomori', 'asa'], futurePeers: ['renji', 'suzu'], friction: ['renji', 'serika'], laugh: ['renji', 'suzu'], repair: 'LEAVES_A_SMALL_PERSONAL_MARK_ONLY_AFTER_ASKING_WHETHER_IT_IS_WANTED' },
  { id: 'kuu', name: 'クウ', partyInstinct: 'CHOOSES_BY_SMELL_SOUND_AND_COMFORT_NOT_SOCIAL_RANK', currentBridges: ['asa', 'yui'], futurePeers: ['yomo', 'amane'], friction: ['yomo', 'noa'], laugh: ['yomo', 'hiyori'], repair: 'RETURNS_TO_SHARED_SPACE_AT_OWN_PACE_AFTER_WITHDRAWING' },
  { id: 'yomo', name: 'ヨモ', partyInstinct: 'USES_MULTIPLE_FAMILIAR_SPOTS_WITHOUT_DECLARING_ONE_TRUE_HOME', currentBridges: ['asa', 'kage2'], futurePeers: ['kuu', 'noa'], friction: ['kuu', 'serika'], laugh: ['kuu', 'chloe'], repair: 'ACCEPTS_A_NEW_CALL_WITHOUT_ERASING_OLDER_CALLS' },
  { id: 'noa', name: 'ノア', partyInstinct: 'TWO_BODIES_DO_NOT_REQUIRE_MIRRORED_SEATS', currentBridges: ['asa', 'ren'], futurePeers: ['rum', 'kai'], friction: ['rum', 'chloe'], laugh: ['kai', 'nao'], repair: 'ALLOWS_TWO_DIFFERENT_ANSWERS_TO_STAND_WITHOUT_FORCING_MERGE' },
  { id: 'rum', name: 'ルム', partyInstinct: 'SHARED_POSITIONING_CAN_SPLIT_INTO_INDIVIDUAL_PREFERENCE', currentBridges: ['tomori', 'shiro'], futurePeers: ['noa', 'io'], friction: ['noa', 'io'], laugh: ['noa', 'kai'], repair: 'SAYS_WHICH_MEMORY_IS_SHARED_AND_WHICH_CHOICE_IS_THIS_INSTANCE' },
  { id: 'maki', name: 'マキ', partyInstinct: 'TAKES_DECISION_SEAT_THEN_LEARNS_TO_LEAVE_IT_EMPTY', currentBridges: ['michiru', 'ritsu'], futurePeers: ['serika', 'hiyori'], friction: ['serika', 'hiyori'], laugh: ['renji', 'suzu'], repair: 'DECLARES_WHAT_WAS_DECIDED_AND_WHAT_CAN_STILL_CHANGE' },
  { id: 'suzu', name: 'スズ', partyInstinct: 'VISIBLE_SEAT_CHOSEN_FOR_MOOD_NOT_ASSIGNED_ROLE', currentBridges: ['kage2', 'yui'], futurePeers: ['hiyori', 'io'], friction: ['io', 'serika'], laugh: ['hiyori', 'touma'], repair: 'ASKS_WHETHER_THE_OTHER_PERSON_WANTS_HELP_PRESENTING_OR_WANTS_TO_BE_LEFT_UNSTYLED' },
  { id: 'io', name: 'イオ', partyInstinct: 'LISTENS_BEFORE_CHOOSING_CENTER_OR_EDGE', currentBridges: ['sen', 'kage3'], futurePeers: ['suzu', 'rum'], friction: ['suzu', 'rum'], laugh: ['suzu', 'nao'], repair: 'OFFERS_A_PROVISIONAL_OPINION_WITHOUT_TURNING_IT_INTO_PERMANENT_CATEGORY' },
  { id: 'kai', name: 'カイ', partyInstinct: 'MAY_SIT_WITH_OR_APART_FROM_NAO_WITHOUT_SYMBOLIC_MEANING_EVERY_TIME', currentBridges: ['ren', 'ritsu'], futurePeers: ['nao', 'noa'], friction: ['nao', 'noa'], laugh: ['nao', 'noa'], repair: 'STATES_OWN_PLAN_WITHOUT_REQUIRING_DIFFERENCE_FROM_NAO' },
  { id: 'nao', name: 'ナオ', partyInstinct: 'CAN_CHOOSE_SAME_SEAT_TYPE_AS_KAI_WITHOUT_LOSING_INDIVIDUALITY', currentBridges: ['ren', 'koyori'], futurePeers: ['kai', 'noa'], friction: ['kai', 'renji'], laugh: ['kai', 'io'], repair: 'CHOOSES_THE_SAME_THING_OPENLY_WHEN_THAT_IS_ACTUALLY_WANTED' },
  { id: 'amane', name: 'アマネ', partyInstinct: 'CHOSES_ROUTE_AND_TABLE_POSITION_WITHOUT_BEING_PARKED_BY_OTHERS', currentBridges: ['michiru', 'yubi'], futurePeers: ['hiyori', 'kuu'], friction: ['maki', 'serika'], laugh: ['hiyori', 'kuu'], repair: 'NAMES_EXACT_HELP_RANGE_INSTEAD_OF_ACCEPTING_OR_REFUSING_ALL_HELP' },
] as const satisfies ReadonlyArray<{
  id: Future15Id;
  name: string;
  partyInstinct: string;
  currentBridges: readonly [CurrentBridgeId, CurrentBridgeId];
  futurePeers: readonly [Future15Id, Future15Id];
  friction: readonly [Future15Id, Future15Id];
  laugh: readonly [Future15Id, Future15Id];
  repair: string;
}>;

export const future15SocialChemistryReservoirSummary = {
  count: FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR.length,
  uniqueIds: new Set(FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR.map((entry) => entry.id)).size,
  uniquePartyInstincts: new Set(FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR.map((entry) => entry.partyInstinct)).size,
  currentBridgeCharacterCount: new Set(FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR.flatMap((entry) => entry.currentBridges)).size,
  futurePeerReferenceCount: new Set(FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR.flatMap((entry) => entry.futurePeers)).size,
  promotedToCurrent21: false,
  sequelRosterLocked: false,
  runtimeAutoPromotionAllowed: false,
} as const;
