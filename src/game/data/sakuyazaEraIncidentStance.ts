import { sakumeiCandidateMembers } from './sakumeiCandidateSource.ts';

export const SAKUYAZA_ERA_INCIDENT_RULES = {
  authority: 'docs/sakuyaza-era-incident-stance-matrix-v1.md',
  seasonScope: 'S1',
  stanceImpliesRealityPresence: false,
  stanceImpliesCombatBoss: false,
  stanceImpliesOfficialMission: false,
  pairCandidateImpliesPermanentPair: false,
  pairCandidateImpliesRomance: false,
  oneMemberMayActPersonallyWithoutOfficialMission: true,
  allMembersMustShareOneIncidentPosition: false,
  fixedAbsoluteLeaderRequired: false,
  gunjoMembershipFrozenByStance: false,
  exactRealityPresenceFrozen: false,
  officialMissionCountFrozen: false,
  permanentPairCountFrozen: true,
  permanentPairCount: 0,
  season2UsesSamePrimaryTeam: false,
  season2UsesSamePrimaryRoster: false,
  season2TeamNameFrozen: false,
  season2RosterFrozen: false,
  previousSeasonIndividualsMayReturn: true,
  runtimeAutoPromotionAllowed: false,
} as const;

export const SAKUYAZA_MEMBER_IDS = sakumeiCandidateMembers.map((entry) => entry.callName) as readonly string[];

export const SAKUYAZA_S1_INCIDENT_STANCES = [
  {
    incidentId: 'ERA-INC-NAGI-01',
    memberStances: [
      { member: 'ナシロ', resonance: 'PRIMARY_RESONANCE', direction: 'STRICT_IDENTITY_CAN_PROTECT_THEN_OPPOSE_STALE_WRONG_NAME', presenceRequired: false },
      { member: 'アサトジ', resonance: 'SECONDARY_RESONANCE', direction: 'CLOSE_ACCESS_FOR_SAFETY_WITHOUT_REOPENING_CONDITION', presenceRequired: false },
      { member: 'ミチグレ', resonance: 'LOW_PRIORITY', direction: 'REMOVE_UNSAFE_ACCESS_ROUTE_WITHOUT_STEALING_ROUTE_THEME', presenceRequired: false },
      { member: 'オリネ', resonance: 'PRIMARY_RESONANCE', direction: 'HIDE_DANGEROUS_CONTEXT_AND_ACCIDENTALLY_HIDE_CORRECTION', presenceRequired: false },
      { member: 'ハクマ', resonance: 'PRIMARY_RESONANCE', direction: 'BLANK_AMBIGUOUS_WARNING_AND_REBUTTAL_TOGETHER', presenceRequired: false },
      { member: 'ツグリ', resonance: 'SECONDARY_RESONANCE', direction: 'REPAIR_CORRUPTED_LIST_INTO_ONE_CLEAN_VERSION', presenceRequired: false },
      { member: 'ユラネ', resonance: 'COUNTER_RESONANCE', direction: 'RELIEVE_REPUTATION_PRESSURE_BUT_RISK_WEAKENING_APPEAL', presenceRequired: false },
      { member: 'ペタ', resonance: 'PRIMARY_RESONANCE', direction: 'STACK_WARNING_CORRECTED_SAFE_AND_EXCLUDED_LABELS', presenceRequired: false },
    ] as const,
    primaryPairCandidate: { members: ['オリネ', 'ペタ'] as const, id: 'PAIR-NAGI-HIDE-AND-RELABEL', officialMissionFrozen: false, permanentPair: false },
    counterOrMitigationMembers: ['ナシロ', 'ユラネ'] as const,
  },
  {
    incidentId: 'ERA-INC-YUI-01',
    memberStances: [
      { member: 'ナシロ', resonance: 'PRIMARY_RESONANCE', direction: 'SUPPORT_ANTI_IMPERSONATION_VERIFICATION_THEN_RESIST_NAME_OVERRIDING_PERSON', presenceRequired: false },
      { member: 'アサトジ', resonance: 'SECONDARY_RESONANCE', direction: 'CLOSE_UNSAFE_ROUTE_OR_CHANNEL_WITH_REOPENING_RISK', presenceRequired: false },
      { member: 'ミチグレ', resonance: 'SECONDARY_RESONANCE', direction: 'REMOVE_FALSE_ROUTE_BUT_RISK_REMOVING_ALTERNATIVE_RESCUE_ROUTE', presenceRequired: false },
      { member: 'オリネ', resonance: 'SECONDARY_RESONANCE', direction: 'HIDE_HARMFUL_IMAGE_OR_IDENTITY_DATA_WITH_ACCOUNTABILITY_RISK', presenceRequired: false },
      { member: 'ハクマ', resonance: 'PRIMARY_RESONANCE', direction: 'BLANK_UNCERTAIN_REPORTS_AND_TRUE_UNVERIFIED_SOS_TOGETHER', presenceRequired: false },
      { member: 'ツグリ', resonance: 'SECONDARY_RESONANCE', direction: 'REPAIR_FEED_INTO_TOO_CLEAN_NORMAL_STATE', presenceRequired: false },
      { member: 'ユラネ', resonance: 'COUNTER_RESONANCE', direction: 'CARE_AND_REST_CAN_HELP_BUT_CAN_INVITE_LOOKING_AWAY_FROM_UNRESOLVED_REQUESTS', presenceRequired: false },
      { member: 'ペタ', resonance: 'PRIMARY_RESONANCE', direction: 'VERIFIED_OFFICIAL_RESOLVED_DUPLICATE_BADGES_REPLACE_READING_CONTENT', presenceRequired: false },
    ] as const,
    primaryPairCandidate: { members: ['ハクマ', 'ペタ'] as const, id: 'PAIR-YUI-BLANK-AND-BADGE', officialMissionFrozen: false, permanentPair: false },
    counterOrMitigationMembers: ['ユラネ', 'ナシロ'] as const,
  },
  {
    incidentId: 'ERA-INC-ASA-01',
    seasonFacet: 'S1_IDENTITY_AND_BELONGING_ONLY',
    memberStances: [
      { member: 'ナシロ', resonance: 'PRIMARY_RESONANCE', direction: 'ONE_CORRECT_IDENTITY_COLLIDES_WITH_TWO_LEGITIMATE_PERSONS', presenceRequired: false },
      { member: 'アサトジ', resonance: 'PRIMARY_RESONANCE', direction: 'FREEZE_DISPUTED_CREDENTIAL_TO_PROTECT_BUT_REMOVE_DAILY_RIGHTS', presenceRequired: false },
      { member: 'ミチグレ', resonance: 'SECONDARY_RESONANCE', direction: 'REMOVE_ALL_BUT_ONE_CONTINUITY_ROUTE_WITHOUT_TIME_TRAVEL_EXPLANATION', presenceRequired: false },
      { member: 'オリネ', resonance: 'SECONDARY_RESONANCE', direction: 'HIDE_SENSITIVE_PROVENANCE_AND_RISK_HIDING_RIGHTS_EVIDENCE', presenceRequired: false },
      { member: 'ハクマ', resonance: 'SECONDARY_RESONANCE', direction: 'BLANK_CONTRADICTORY_HISTORIES', presenceRequired: false },
      { member: 'ツグリ', resonance: 'PRIMARY_RESONANCE', direction: 'REPAIR_BRANCHING_IDENTITY_BY_MERGE_RESTORE_OR_NORMALIZE', presenceRequired: false },
      { member: 'ユラネ', resonance: 'AMBIVALENT', direction: 'PROTECT_FROM_IDENTITY_DISPUTE_BY_ESCAPE_BUT_WEAKEN_RIGHTS_FIGHT', presenceRequired: false },
      { member: 'ペタ', resonance: 'SECONDARY_RESONANCE', direction: 'ORIGINAL_COPY_VALID_REVOKED_LABELS_FIX_SOCIAL_TREATMENT', presenceRequired: false },
    ] as const,
    primaryPairCandidate: { members: ['ナシロ', 'ツグリ'] as const, id: 'PAIR-ASA-ONE-NAME-ONE-REPAIRED-PERSON', officialMissionFrozen: false, permanentPair: false },
    alternatePairCandidate: { members: ['ナシロ', 'アサトジ'] as const, id: 'PAIR-ASA-NAME-AND-FREEZE', officialMissionFrozen: false, permanentPair: false, primaryAtSameTime: false },
    counterOrMitigationMembers: ['ユラネ'] as const,
  },
] as const;

/** Backward-compatible alias: current Sakuyaza incident stances are S1-only. */
export const SAKUYAZA_ERA_INCIDENT_STANCES = SAKUYAZA_S1_INCIDENT_STANCES;

export const SAKUYAZA_INCIDENT_PAIR_CANDIDATES = SAKUYAZA_S1_INCIDENT_STANCES.map((entry) => entry.primaryPairCandidate);

const stanceMembers = SAKUYAZA_S1_INCIDENT_STANCES.flatMap((entry) => entry.memberStances.map((stance) => stance.member));

export const sakuyazaEraIncidentStanceSummary = {
  seasonScope: 'S1',
  incidentCount: SAKUYAZA_S1_INCIDENT_STANCES.length,
  memberCount: SAKUYAZA_MEMBER_IDS.length,
  uniqueMemberCount: new Set(SAKUYAZA_MEMBER_IDS).size,
  totalStanceCount: stanceMembers.length,
  uniqueStanceMemberCount: new Set(stanceMembers).size,
  incidentsWithAllEightStances: SAKUYAZA_S1_INCIDENT_STANCES.filter((entry) => entry.memberStances.length === 8).length,
  primaryIncidentPairCandidateCount: SAKUYAZA_INCIDENT_PAIR_CANDIDATES.length,
  permanentPairCount: SAKUYAZA_ERA_INCIDENT_RULES.permanentPairCount,
  exactOfficialMissionCountFrozen: SAKUYAZA_ERA_INCIDENT_RULES.officialMissionCountFrozen,
  exactRealityPresenceFrozen: SAKUYAZA_ERA_INCIDENT_RULES.exactRealityPresenceFrozen,
  allPresenceUnrequired: SAKUYAZA_S1_INCIDENT_STANCES.every((entry) => entry.memberStances.every((stance) => stance.presenceRequired === false)),
  allS1IncidentsHaveCounterOrMitigation: SAKUYAZA_S1_INCIDENT_STANCES.every((entry) => entry.counterOrMitigationMembers.length > 0),
  season2UsesSamePrimaryTeam: false,
  season2UsesSamePrimaryRoster: false,
  runtimeAutoPromotionAllowed: false,
} as const;
