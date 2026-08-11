export const ERA_INCIDENT_SUPPORT_RULES = {
  authority: 'docs/era-incident-evidence-supporting-cast-matrix-v1.md',
  namedRealityDirectCastFrozenCount: 5,
  namedRealityDirectCastMustBeCore5LeadsOnlyAtCurrentCertainty: true,
  supportingCastAssignmentFreezesRealityEra: false,
  supportingCastAssignmentFreezesVictimhood: false,
  supportingCastAssignmentFreezesOccupation: false,
  relationshipHookFreezesExactIncident: false,
  future15AssignmentPromotesRoster: false,
  everyIncidentRequiresOfficialEvidence: true,
  everyIncidentRequiresWitnessEvidence: true,
  everyIncidentRequiresPhysicalOrDigitalEvidence: true,
  everyIncidentRequiresLaterInterpretation: true,
  oneEvidenceItemMayConfirmBloodline: false,
  onePhotoOrSurnameMayConfirmBloodline: false,
  gunjoAdmissionFrozenByEvidenceMatrix: false,
  sakuyazaExactIncidentPositionsFrozen: false,
  evidenceRoleEqualsCombatBoss: false,
  wholeCastMayShareOneRealityIncidentSite: false,
  runtimeAutoPromotionAllowed: false,
} as const;

export type EraIncidentSupportRole =
  | 'REALITY_ERA_LEAD'
  | 'DREAM_RESPONDER'
  | 'DREAM_CHILD_LENS'
  | 'DREAM_ARGUMENT_COUNTERPOINT'
  | 'DREAM_EVIDENCE_INTERPRETER'
  | 'DREAM_CROSS_ERA_INTERPRETER'
  | 'OBJECT_OR_PLACE_LEGACY'
  | 'FUTURE_SERIES_CANDIDATE';

export const ERA_INCIDENT_EVIDENCE_CAST = [
  {
    incidentId: 'ERA-INC-TOMORI-01',
    core5LeadId: 'tomori',
    realityLead: { characterId: 'tomori', role: 'REALITY_ERA_LEAD' as EraIncidentSupportRole, exactRealityRoleFrozen: false },
    current21Support: [
      { characterId: 'ritsu', role: 'DREAM_ARGUMENT_COUNTERPOINT' as EraIncidentSupportRole, function: 'FAIR_DISTRIBUTION_AND_HOUSEHOLD_DUTY', relationshipHooks: ['ritsu-koyori', 'kaname-ritsu'] },
      { characterId: 'koyori', role: 'DREAM_CHILD_LENS' as EraIncidentSupportRole, function: 'CHILD_QUESTIONS_HOUSEHOLD_COUNT_VS_LIVED_HOME', relationshipHooks: ['ritsu-koyori', 'sen-koyori'] },
      { characterId: 'hana', role: 'DREAM_EVIDENCE_INTERPRETER' as EraIncidentSupportRole, function: 'HOUSEHOLD_MEMORY_FOOD_AND_PRESERVATION', relationshipHooks: ['hana-tsumugi', 'hana-shiro'] },
      { characterId: 'kaname', role: 'DREAM_ARGUMENT_COUNTERPOINT' as EraIncidentSupportRole, function: 'CARE_DELEGATION_AND_URGENT_PROVISION', relationshipHooks: ['nagi-kaname', 'kaname-ritsu'] },
      { characterId: 'tsumugi', role: 'DREAM_EVIDENCE_INTERPRETER' as EraIncidentSupportRole, function: 'REPAIR_TRACE_WITHOUT_BLOOD_PROOF', relationshipHooks: ['tomori-tsumugi', 'shiro-tsumugi', 'hana-tsumugi'] },
      { characterId: 'shiro', role: 'DREAM_EVIDENCE_INTERPRETER' as EraIncidentSupportRole, function: 'PRESERVE_BLANK_AND_CORRECTED_RECORD', relationshipHooks: ['sen-shiro', 'shiro-tsumugi', 'hana-shiro'] },
      { characterId: 'yui', role: 'DREAM_CROSS_ERA_INTERPRETER' as EraIncidentSupportRole, function: 'UNRECORDED_NOT_NONEXISTENT_TO_UNVERIFIED_NOT_FALSE', relationshipHooks: ['yui-tomori'] },
    ] as const,
    future15Support: [
      { characterId: 'renji', role: 'FUTURE_SERIES_CANDIDATE' as EraIncidentSupportRole, function: 'CRAFT_AND_MENTOR_LEGACY' },
      { characterId: 'touma', role: 'FUTURE_SERIES_CANDIDATE' as EraIncidentSupportRole, function: 'CRAFT_INHERITANCE_WITHOUT_GENETIC_DESTINY' },
      { characterId: 'hiyori', role: 'FUTURE_SERIES_CANDIDATE' as EraIncidentSupportRole, function: 'HOUSEHOLD_SOCIAL_RECOGNITION' },
    ] as const,
    evidence: {
      official: ['E-TOMORI-O1_DISTRIBUTION_LEDGER_REVISION', 'E-TOMORI-O2_PROVISIONAL_OR_DENIED_SLIP', 'E-TOMORI-O3_EXCEPTION_INSTRUCTION'] as const,
      witness: ['E-TOMORI-W1_CHILD_SCHOOL_MEAL_HOUSEHOLD_MISMATCH', 'E-TOMORI-W2_CLERK_EXCEPTION_MEMO', 'E-TOMORI-W3_HOUSEHOLD_NEIGHBOR_STATEMENT'] as const,
      physicalOrDigital: ['E-TOMORI-P1_CORRECTED_HOUSEHOLD_PAGE', 'E-TOMORI-P2_TEMPORARY_RESIDENCE_NOTE', 'E-TOMORI-P3_REPAIR_TAG_OR_REUSED_OBJECT'] as const,
      laterInterpretation: ['E-TOMORI-L1_SHIRO_BLANK_ENTRY', 'E-TOMORI-L2_YUI_RECORD_VISIBILITY_ECHO', 'E-TOMORI-L3_LANTERN_HISTORY_SEPARATE_NON_BLOOD_CHAIN'] as const,
    },
  },
  {
    incidentId: 'ERA-INC-MICHIRU-01',
    core5LeadId: 'michiru',
    realityLead: { characterId: 'michiru', role: 'REALITY_ERA_LEAD' as EraIncidentSupportRole, exactRealityRoleFrozen: false },
    current21Support: [
      { characterId: 'gen', role: 'OBJECT_OR_PLACE_LEGACY' as EraIncidentSupportRole, function: 'OLD_ROUTE_MEMORY_WITHOUT_OLD_EQUALS_BETTER', relationshipHooks: ['gen-michiru', 'gen-toki'] },
      { characterId: 'toki', role: 'DREAM_ARGUMENT_COUNTERPOINT' as EraIncidentSupportRole, function: 'MEASUREMENT_FLOW_AND_MISSING_METRICS', relationshipHooks: ['michiru-toki', 'gen-toki', 'ren-toki'] },
      { characterId: 'nemu', role: 'DREAM_RESPONDER' as EraIncidentSupportRole, function: 'CARE_RECOVERY_HEALTH_AND_NOISE', relationshipHooks: ['nemu-toki', 'madoka-nemu'] },
      { characterId: 'madoka', role: 'DREAM_EVIDENCE_INTERPRETER' as EraIncidentSupportRole, function: 'SIDE_ROUTE_AND_WINDOW_OBSERVATION_TO_WITNESS', relationshipHooks: ['madoka-ren', 'madoka-nemu'] },
      { characterId: 'ren', role: 'DREAM_EVIDENCE_INTERPRETER' as EraIncidentSupportRole, function: 'OLD_NEW_MAP_DIFFERENCE_WITHOUT_VALUE_JUDGMENT', relationshipHooks: ['madoka-ren', 'ren-toki'] },
      { characterId: 'tobari', role: 'DREAM_RESPONDER' as EraIncidentSupportRole, function: 'GATE_TRANSIT_AND_RETURN_ACCESS', relationshipHooks: ['yubi-tobari', 'nagi-tobari'] },
    ] as const,
    future15Support: [
      { characterId: 'amane', role: 'FUTURE_SERIES_CANDIDATE' as EraIncidentSupportRole, function: 'ACCESSIBILITY_AS_ROUTE_DESIGN_NOT_TRAGEDY' },
      { characterId: 'maki', role: 'FUTURE_SERIES_CANDIDATE' as EraIncidentSupportRole, function: 'FAST_DECISION_AND_WHAT_COUNTS_AS_INPUT' },
    ] as const,
    evidence: {
      official: ['E-MICHIRU-O1_MASTER_PLAN_MAP', 'E-MICHIRU-O2_TRAFFIC_TRAVEL_TIME_COUNT', 'E-MICHIRU-O3_TEMPORARY_ENERGY_CLOSURE_MEMO'] as const,
      witness: ['E-MICHIRU-W1_SCHOOL_ROUTE_PARENT_NOTE', 'E-MICHIRU-W2_DRIVER_OR_NURSE_ACCESS_RECORD', 'E-MICHIRU-W3_SHOP_OR_RESIDENT_ROUTE_TESTIMONY'] as const,
      physicalOrDigital: ['E-MICHIRU-P1_BEFORE_AFTER_MAPS', 'E-MICHIRU-P2_REMOVED_STOP_NOTICE', 'E-MICHIRU-P3_MEASUREMENT_SHEET_WITH_BLANK_LOCAL_FIELDS'] as const,
      laterInterpretation: ['E-MICHIRU-L1_GEN_OLD_ROUTE_MEMORY', 'E-MICHIRU-L2_TOKI_MEASUREMENT_COUNTERPOINT', 'E-MICHIRU-L3_MULTI_ERA_MAP_REVISION_CHAIN'] as const,
    },
  },
  {
    incidentId: 'ERA-INC-NAGI-01',
    core5LeadId: 'nagi',
    realityLead: { characterId: 'nagi', role: 'REALITY_ERA_LEAD' as EraIncidentSupportRole, exactRealityRoleFrozen: false },
    current21Support: [
      { characterId: 'kuroori', role: 'DREAM_ARGUMENT_COUNTERPOINT' as EraIncidentSupportRole, function: 'PRIVACY_CONCEALMENT_CAN_PROTECT_BUT_CAN_ISOLATE', relationshipHooks: ['yui-kuroori', 'kuroori-yubi'] },
      { characterId: 'kasumi', role: 'DREAM_ARGUMENT_COUNTERPOINT' as EraIncidentSupportRole, function: 'REPUTATION_OBSCURITY_AND_WAITING', relationshipHooks: ['asa-kasumi', 'yubi-kasumi'] },
      { characterId: 'shiro', role: 'DREAM_EVIDENCE_INTERPRETER' as EraIncidentSupportRole, function: 'VERSION_PROVENANCE_AND_CORRECTION', relationshipHooks: ['sen-shiro'] },
      { characterId: 'tobari', role: 'DREAM_RESPONDER' as EraIncidentSupportRole, function: 'PROTECTIVE_CLOSURE_NEEDS_EXPIRY_AND_REOPENING', relationshipHooks: ['nagi-tobari'] },
      { characterId: 'sen', role: 'DREAM_RESPONDER' as EraIncidentSupportRole, function: 'INFORMATION_LITERACY_WITHOUT_BLAMING_USER', relationshipHooks: ['sen-koyori', 'sen-shiro'] },
      { characterId: 'yuubi', role: 'DREAM_ARGUMENT_COUNTERPOINT' as EraIncidentSupportRole, function: 'FORWARDING_AND_DELIVERY_RESPONSIBILITY', relationshipHooks: ['yubi-kasumi', 'kuroori-yubi', 'yubi-tobari'] },
      { characterId: 'yui', role: 'DREAM_CROSS_ERA_INTERPRETER' as EraIncidentSupportRole, function: 'PRESENT_RECORD_ABUNDANCE_AND_FAMILY_CLUE_ONLY', relationshipHooks: ['yui-kuroori'] },
    ] as const,
    future15Support: [
      { characterId: 'serika', role: 'FUTURE_SERIES_CANDIDATE' as EraIncidentSupportRole, function: 'INSTITUTION_REPUTATION_AND_PERSONAL_TRUST' },
      { characterId: 'yomo', role: 'FUTURE_SERIES_CANDIDATE' as EraIncidentSupportRole, function: 'MULTIPLE_NAMES_WITHOUT_IDENTITY_PROOF_DEVICE' },
      { characterId: 'suzu', role: 'FUTURE_SERIES_CANDIDATE' as EraIncidentSupportRole, function: 'PRESENTATION_LABEL_AND_ASSUMPTION' },
    ] as const,
    evidence: {
      official: ['E-NAGI-O1_WARNING_LIST_SNAPSHOT', 'E-NAGI-O2_SOURCE_POLICY_MEMO', 'E-NAGI-O3_CORRECTION_NOTICE'] as const,
      witness: ['E-NAGI-W1_FORWARDED_MAIL_CHAIN', 'E-NAGI-W2_SCHOOL_OR_HR_DECISION_MEMO', 'E-NAGI-W3_PERSON_CHALLENGE_STATEMENT'] as const,
      physicalOrDigital: ['E-NAGI-P1_PRINTED_LIST_HAND_CORRECTION', 'E-NAGI-P2_FAX_WITHOUT_CORRECTION_PAGE', 'E-NAGI-P3_MOBILE_MAIL_TIMESTAMP'] as const,
      laterInterpretation: ['E-NAGI-L1_SHIRO_VERSION_COMPARE', 'E-NAGI-L2_YUI_FAMILY_PHRASE_CLUE_ONLY', 'E-NAGI-L3_NO_FACE_OR_SURNAME_ONLY_BLOOD_CONFIRMATION'] as const,
    },
  },
  {
    incidentId: 'ERA-INC-YUI-01',
    core5LeadId: 'yui',
    realityLead: { characterId: 'yui', role: 'REALITY_ERA_LEAD' as EraIncidentSupportRole, exactRealityRoleFrozen: false },
    current21Support: [
      { characterId: 'asa', role: 'DREAM_ARGUMENT_COUNTERPOINT' as EraIncidentSupportRole, function: 'VERIFICATION_PROVENANCE_NOT_PERSON_EXISTENCE', relationshipHooks: ['yui-asa'] },
      { characterId: 'madoka', role: 'DREAM_EVIDENCE_INTERPRETER' as EraIncidentSupportRole, function: 'WEAK_SIGNAL_OBSERVATION_TO_CORROBORATION', relationshipHooks: ['madoka-ren', 'madoka-nemu'] },
      { characterId: 'yuubi', role: 'DREAM_RESPONDER' as EraIncidentSupportRole, function: 'ADDRESS_DELIVERY_AND_LOCAL_ROUTE_KNOWLEDGE', relationshipHooks: ['yubi-tobari'] },
      { characterId: 'tobari', role: 'DREAM_RESPONDER' as EraIncidentSupportRole, function: 'TRANSIT_CLOSURE_AND_ALTERNATIVE_EXIT', relationshipHooks: ['yubi-tobari', 'nagi-tobari'] },
      { characterId: 'kaname', role: 'DREAM_RESPONDER' as EraIncidentSupportRole, function: 'PHYSICAL_RESCUE_AND_DELEGATION', relationshipHooks: ['nagi-kaname', 'kaname-ritsu'] },
      { characterId: 'toki', role: 'DREAM_ARGUMENT_COUNTERPOINT' as EraIncidentSupportRole, function: 'RESPONSE_PRIORITY_MEASUREMENT_AND_UNKNOWN_QUEUE', relationshipHooks: ['michiru-toki', 'gen-toki', 'ren-toki'] },
      { characterId: 'sen', role: 'DREAM_RESPONDER' as EraIncidentSupportRole, function: 'FACT_CHECK_EXPLANATION_WITHOUT_LECTURE', relationshipHooks: ['sen-koyori', 'sen-shiro'] },
      { characterId: 'nemu', role: 'DREAM_RESPONDER' as EraIncidentSupportRole, function: 'RESCUED_DOES_NOT_EQUAL_RECOVERED', relationshipHooks: ['nemu-toki', 'madoka-nemu'] },
      { characterId: 'ritsu', role: 'DREAM_ARGUMENT_COUNTERPOINT' as EraIncidentSupportRole, function: 'HOUSEHOLD_RESPONSE_PRIORITY_ADULT_SIDE', relationshipHooks: ['ritsu-koyori', 'kaname-ritsu'] },
      { characterId: 'koyori', role: 'DREAM_CHILD_LENS' as EraIncidentSupportRole, function: 'HOUSEHOLD_RESPONSE_PRIORITY_CHILD_SIDE', relationshipHooks: ['ritsu-koyori', 'sen-koyori'] },
    ] as const,
    future15Support: [
      { characterId: 'hiyori', role: 'FUTURE_SERIES_CANDIDATE' as EraIncidentSupportRole, function: 'LOCAL_SOCIAL_CONNECTION_WITHOUT_NETWORK_SUPERPOWER' },
      { characterId: 'kuu', role: 'FUTURE_SERIES_CANDIDATE' as EraIncidentSupportRole, function: 'ANIMAL_SENSORY_ROUTE_NOT_TRUTH_DETECTOR' },
      { characterId: 'maki', role: 'FUTURE_SERIES_CANDIDATE' as EraIncidentSupportRole, function: 'FAST_DECISION_UNDER_UNCERTAINTY' },
      { characterId: 'suzu', role: 'FUTURE_SERIES_CANDIDATE' as EraIncidentSupportRole, function: 'OFFICIAL_LOOKING_PRESENTATION_NOT_EQUAL_TRUTH' },
    ] as const,
    evidence: {
      official: ['E-YUI-O1_FEED_RANKING_VERIFICATION_POLICY', 'E-YUI-O2_DISPATCH_LOG', 'E-YUI-O3_DEPRIORITIZED_REQUEST_AUDIT'] as const,
      witness: ['E-YUI-W1_PHONE_OR_VOICE_HELP_REQUEST', 'E-YUI-W2_LOCAL_HANDWRITTEN_BOARD', 'E-YUI-W3_RESPONDER_MANUAL_ELEVATION_NOTE'] as const,
      physicalOrDigital: ['E-YUI-P1_CACHED_UNVERIFIED_MESSAGE', 'E-YUI-P2_PHOTO_METADATA_OR_PLACE_MISMATCH', 'E-YUI-P3_PAPER_MAP_OLD_LOCAL_NAME_CORRESPONDENCE'] as const,
      laterInterpretation: ['E-YUI-L1_NAGI_WARNING_CORRECTION_ECHO', 'E-YUI-L2_ASA_PROVENANCE_VS_EXISTENCE', 'E-YUI-L3_S1_LEGIBILITY_PATTERN_WITHOUT_MAIN_MYSTERY_ANSWER'] as const,
    },
  },
  {
    incidentId: 'ERA-INC-ASA-01',
    core5LeadId: 'asa',
    realityLead: { characterId: 'asa', role: 'REALITY_ERA_LEAD' as EraIncidentSupportRole, exactRealityRoleFrozen: false },
    current21Support: [
      { characterId: 'kasumi', role: 'DREAM_ARGUMENT_COUNTERPOINT' as EraIncidentSupportRole, function: 'NAME_PRIVACY_AND_REQUIRED_IDENTITY_DETAIL', relationshipHooks: ['asa-kasumi', 'yubi-kasumi'] },
      { characterId: 'kuroori', role: 'DREAM_ARGUMENT_COUNTERPOINT' as EraIncidentSupportRole, function: 'CONCEALMENT_PROTECTS_BUT_RIGHTS_CLAIMS_NEED_EVIDENCE', relationshipHooks: ['yui-kuroori', 'kuroori-yubi'] },
      { characterId: 'shiro', role: 'DREAM_EVIDENCE_INTERPRETER' as EraIncidentSupportRole, function: 'MULTIPLE_VALID_RECORDS_WITHOUT_EARLY_COLLAPSE', relationshipHooks: ['sen-shiro', 'shiro-tsumugi'] },
      { characterId: 'ren', role: 'DREAM_EVIDENCE_INTERPRETER' as EraIncidentSupportRole, function: 'SAME_PAST_DIFFERENT_PRESENT_DIFFERENCE', relationshipHooks: ['madoka-ren', 'ren-toki'] },
      { characterId: 'nagi', role: 'DREAM_CROSS_ERA_INTERPRETER' as EraIncidentSupportRole, function: 'PRIVACY_PROTECTION_TO_PERSONHOOD_CONTROL_ECHO', relationshipHooks: ['nagi-tobari'] },
    ] as const,
    future15Support: [
      { characterId: 'chloe', role: 'FUTURE_SERIES_CANDIDATE' as EraIncidentSupportRole, function: 'LONG_LIVED_HUMAN_CONTINUITY_WITHOUT_ROBOT_EQUIVALENCE' },
      { characterId: 'noa', role: 'FUTURE_SERIES_CANDIDATE' as EraIncidentSupportRole, function: 'SAME_SNAPSHOT_DIFFERENT_PRESENT_PERSONHOOD' },
      { characterId: 'rum', role: 'FUTURE_SERIES_CANDIDATE' as EraIncidentSupportRole, function: 'COLLECTIVE_IDENTITY_MAY_NOT_WANT_ONE_PERSON_MODEL' },
      { characterId: 'io', role: 'FUTURE_SERIES_CANDIDATE' as EraIncidentSupportRole, function: 'CLASSIFICATION_PRESSURE_AND_MINIMUM_RIGHTS_INFORMATION' },
      { characterId: 'kai', role: 'FUTURE_SERIES_CANDIDATE' as EraIncidentSupportRole, function: 'HUMAN_TWIN_SAME_CONTEXT_STILL_TWO_PERSONS' },
      { characterId: 'nao', role: 'FUTURE_SERIES_CANDIDATE' as EraIncidentSupportRole, function: 'TWIN_DIVERGENCE_WITHOUT_FORCED_DIFFERENCE' },
      { characterId: 'amane', role: 'FUTURE_SERIES_CANDIDATE' as EraIncidentSupportRole, function: 'CREDENTIAL_ACCESS_TO_MOBILITY_AND_SERVICE' },
    ] as const,
    evidence: {
      official: ['E-ASA-O1_CONTINUITY_CREDENTIAL_HISTORY', 'E-ASA-O2_DISPUTE_APPEAL_RULE', 'E-ASA-O3_CARE_CONTRACT_AUTHORIZATION'] as const,
      witness: ['E-ASA-W1_TWO_BRANCH_PERSON_TESTIMONIES', 'E-ASA-W2_FAMILY_CHOSEN_FAMILY_ATTESTATION', 'E-ASA-W3_DOCTOR_EMPLOYER_COUNTERPARTY_RESPONSIBILITY'] as const,
      physicalOrDigital: ['E-ASA-P1_BODY_MIGRATION_PROVENANCE', 'E-ASA-P2_MEMORY_STATE_DIVERGENCE_LOG', 'E-ASA-P3_ASA_HANDWRITTEN_CHOSEN_NAME_LABEL'] as const,
      laterInterpretation: ['E-ASA-L1_NOA_SAME_PAST_DIFFERENT_PRESENT', 'E-ASA-L2_RUM_COLLECTIVE_SELF_QUESTION', 'E-ASA-L3_OLDER_ERA_SYSTEM_READABLE_EQUALS_REAL_ECHO'] as const,
    },
  },
] as const;

export const CURRENT21_INCIDENT_SUPPORT_IDS = [
  'yui', 'asa', 'nagi', 'michiru', 'tomori', 'sen', 'ritsu', 'koyori', 'gen', 'hana', 'yuubi', 'madoka', 'shiro', 'tobari', 'nemu', 'kuroori', 'kaname', 'kasumi', 'toki', 'tsumugi', 'ren',
] as const;

export const FUTURE15_INCIDENT_SUPPORT_IDS = [
  'hiyori', 'serika', 'chloe', 'renji', 'touma', 'kuu', 'yomo', 'noa', 'rum', 'maki', 'suzu', 'io', 'kai', 'nao', 'amane',
] as const;

const castIds = ERA_INCIDENT_EVIDENCE_CAST.flatMap((incident) => [
  incident.realityLead.characterId,
  ...incident.current21Support.map((entry) => entry.characterId),
]);
const futureIds = ERA_INCIDENT_EVIDENCE_CAST.flatMap((incident) => incident.future15Support.map((entry) => entry.characterId));
const evidenceIds = ERA_INCIDENT_EVIDENCE_CAST.flatMap((incident) => [
  ...incident.evidence.official,
  ...incident.evidence.witness,
  ...incident.evidence.physicalOrDigital,
  ...incident.evidence.laterInterpretation,
]);

export const eraIncidentEvidenceSupportingCastSummary = {
  incidentCount: ERA_INCIDENT_EVIDENCE_CAST.length,
  namedRealityLeadCount: ERA_INCIDENT_EVIDENCE_CAST.length,
  uniqueRealityLeadCount: new Set(ERA_INCIDENT_EVIDENCE_CAST.map((incident) => incident.realityLead.characterId)).size,
  current21CoveredCount: new Set(castIds).size,
  future15CoveredCount: new Set(futureIds).size,
  evidenceIdCount: evidenceIds.length,
  uniqueEvidenceIdCount: new Set(evidenceIds).size,
  allIncidentsHaveFourEvidenceLayers: ERA_INCIDENT_EVIDENCE_CAST.every((incident) =>
    incident.evidence.official.length > 0 &&
    incident.evidence.witness.length > 0 &&
    incident.evidence.physicalOrDigital.length > 0 &&
    incident.evidence.laterInterpretation.length > 0
  ),
  allSupportingRealityRolesUnfrozen: ERA_INCIDENT_EVIDENCE_CAST.every((incident) => incident.realityLead.exactRealityRoleFrozen === false),
  runtimeAutoPromotionAllowed: false,
} as const;
