export const SEASON_ANTAGONIST_RETURN_RULES = {
  authority: 'docs/season-antagonist-return-policy-v1.md',
  previousSeasonIndividualsMayReturn: true,
  enemySideReturnAllowed: true,
  allySideReturnAllowed: true,
  temporaryAllianceAllowed: true,
  rivalReturnAllowed: true,
  neutralHelperReturnAllowed: true,
  civilianReturnAllowed: true,
  partyGuestReturnAllowed: true,
  refusesToHelpAllowed: true,
  absentButFeltAllowed: true,
  alignmentPermanentlyFrozenAfterOneSeason: false,
  allyReturnErasesPastHarm: false,
  bossDefeatMeansImmediateRedemption: false,
  protagonistSideMembershipRequiredForGrowth: false,
  previousFullTeamMayBecomeNextSeasonPrimaryTeam: false,
  newSeasonPrimaryCastMustRemainPrimary: true,
  relationshipHistoryCarriesForward: true,
  characterGrowthResetsBetweenSeasons: false,
  defeatEqualsDeath: false,
  permanentDeathDefaultAntagonistClosure: false,
  exactReturnAssignmentsFrozen: false,
  exactReturnCountFrozen: false,
  runtimeAutoPromotionAllowed: false,
} as const;

export const SEASON_ANTAGONIST_RETURN_ROLES = [
  'ENEMY_RETURN',
  'ALLY_RETURN',
  'TEMPORARY_ALLY',
  'RIVAL_RETURN',
  'NEUTRAL_HELPER',
  'CIVILIAN_RETURN',
  'PARTY_GUEST',
  'REFUSES_TO_HELP',
  'ABSENT_BUT_FELT',
] as const;

export const SAKUYAZA_LATER_RETURN_CANDIDATES = [
  {
    member: 'ナシロ',
    enemySide: 'IDENTITY_SYSTEM_ONE_CORRECT_PERSON_AGAIN',
    allySide: 'EXPOSE_FALSE_AUTHENTICATION_OR_IMPERSONATION',
  },
  {
    member: 'アサトジ',
    enemySide: 'PROTECTIVE_CLOSURE_BECOMES_OVER_CONTROL',
    allySide: 'RELIABLE_TEMPORARY_SEAL_OR_EVACUATION_PROTECTION',
  },
  {
    member: 'ミチグレ',
    enemySide: 'DELETE_NON_OPTIMAL_ROUTE_AGAIN',
    allySide: 'CREATE_ONE_RETURN_ROUTE_WHEN_NONE_EXISTS',
  },
  {
    member: 'オリネ',
    enemySide: 'HIDE_TOO_MUCH_AND_REMOVE_AGENCY',
    allySide: 'PROTECT_VICTIM_PRIVACY_WITH_LIMITED_CONCEALMENT',
  },
  {
    member: 'ハクマ',
    enemySide: 'BLANK_AMBIGUITY_AND_ERASE_NEEDED_INFORMATION',
    allySide: 'REMOVE_CONFIRMED_FALSE_DATA_IN_A_LIMITED_CONTEXT',
  },
  {
    member: 'ツグリ',
    enemySide: 'REPAIR_WITHOUT_CONSENT',
    allySide: 'REPAIR_SKILL_USED_WITH_PERMISSION_FOR_URGENT_DAMAGE',
  },
  {
    member: 'ユラネ',
    enemySide: 'REST_BECOMES_PERMANENT_ESCAPE',
    allySide: 'HELP_EXHAUSTED_PEOPLE_RECOVER_ENOUGH_TO_CHOOSE_AGAIN',
  },
  {
    member: 'ペタ',
    enemySide: 'LABEL_FIXES_SOCIAL_TREATMENT_AGAIN',
    allySide: 'USE_TEMPORARY_LABELS_AND_REMOVE_THEM_WHEN_CONTEXT_CHANGES',
  },
] as const;

export const S1_S2_REUNION_CANDIDATES = [
  { s1Member: 'ツグリ', s2Candidate: 'カンナ', contrast: 'REPAIR_EVERYTHING_VS_CHOOSE_WHAT_NOT_TO_REPAIR' },
  { s1Member: 'ミチグレ', s2Candidate: 'ナナセ', contrast: 'DELETE_WRONG_ROUTE_VS_SELECT_ROUTES_UNDER_LIMIT' },
  { s1Member: 'ユラネ', s2Candidate: 'サエ', contrast: 'LET_THEM_REST_VS_DISTRIBUTE_CARE_BURDEN' },
  { s1Member: 'ペタ', s2Candidate: 'ケイ', contrast: 'VISIBLE_LABEL_VS_INVISIBLE_PRIORITY_SCORE' },
  { s1Member: 'ナシロ', s2Candidate: 'イサナ', contrast: 'ONE_CORRECT_IDENTITY_VS_ONE_COHERENT_CITY_PLAN' },
  { s1Member: 'アサトジ', s2Candidate: 'ヨシノ', contrast: 'TEMPORARY_PROTECTION_VS_FUTURE_RESERVE_CURRENT_SACRIFICE' },
  { s1Member: 'オリネ', s2Candidate: 'ミノリ', contrast: 'HIDDEN_CONTEXT_VS_LOGISTICS_VISIBILITY' },
  { s1Member: 'ハクマ', s2Candidate: 'ハルマ', contrast: 'BLANK_AMBIGUITY_VS_SCHEDULE_EVERY_GAP' },
] as const;

export const seasonAntagonistReturnSummary = {
  returnRoleCount: SEASON_ANTAGONIST_RETURN_ROLES.length,
  sakuyazaCandidateCount: SAKUYAZA_LATER_RETURN_CANDIDATES.length,
  reunionCandidateCount: S1_S2_REUNION_CANDIDATES.length,
  everySakuyazaMemberHasEnemyAndAllyLane: SAKUYAZA_LATER_RETURN_CANDIDATES.every(
    (entry) => entry.enemySide.length > 0 && entry.allySide.length > 0,
  ),
  exactReturnAssignmentsFrozen: SEASON_ANTAGONIST_RETURN_RULES.exactReturnAssignmentsFrozen,
  runtimeAutoPromotionAllowed: false,
} as const;
