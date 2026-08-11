export const CROSS_ERA_LINEAGE_MEMORY_RULES = {
  authority: 'docs/cross-era-lineage-memory-bible-v1.md',
  physicalMorningUsedForRecovery: false,
  normalWakingLosesExplicitDreamMemory: true,
  normalWakingMayKeepImplicitSkillEmotionChoice: true,
  resolutionWakingMayRestoreExplicitDreamMemory: true,
  relationRevealRequiresRealityEvidence: true,
  bloodRelationIsOnlyInheritanceType: false,
  majorityOfMainCastMayBecomeOneFamily: false,
  descendantInheritsAncestorGuilt: false,
  dreamProvidesExactFutureDataToPastReality: false,
  dementiaExplainsDreamMemoryLoss: false,
  cognitiveImpairmentUsedAsDreamJoke: false,
  closedTimeLoopDefault: false,
  runtimeAutoPromotionAllowed: false,
} as const;

export const CROSS_ERA_RELATION_CLASSES = [
  'PARENT_CHILD_ACROSS_ERAS',
  'ANCESTOR_DESCENDANT',
  'ADOPTIVE_OR_CHOSEN_FAMILY_LEGACY',
  'FRIEND_DESCENDANT',
  'TEACHER_STUDENT_LEGACY',
  'OBJECT_INHERITANCE',
  'PLACE_INHERITANCE',
  'PROFESSION_OR_CRAFT_LINEAGE',
  'INSTITUTIONAL_LEGACY',
  'ANIMAL_RECOGNITION_BRIDGE',
  'RIVAL_OR_INCIDENT_LEGACY',
  'ANONYMOUS_BENEFICIARY',
] as const;

export const CROSS_ERA_RECOGNITION_STAGES = [
  'DREAM_MEETING',
  'STRANGE_FAMILIARITY',
  'NORMAL_WAKING_MEMORY_LOSS',
  'REALITY_RESIDUE_OR_EVIDENCE',
  'ERA_INCIDENT_RESOLUTION',
  'RESOLUTION_WAKING_RECONTEXTUALIZATION',
] as const;

export const CROSS_ERA_REQUIRED_SERIES_SLOTS = {
  trueParentChildRevealMinimum: 1,
  trueAncestorDescendantRevealMinimum: 1,
  nonBloodInheritanceMustRemainPlural: true,
  exactParentChildPairFrozen: false,
  exactAncestorDescendantPairFrozen: false,
  finalRevealCountFrozen: false,
} as const;

export const CROSS_ERA_HIGH_VALUE_RESERVOIR = [
  {
    id: 'legacy_lantern_tomori_yui',
    relationClass: 'OBJECT_INHERITANCE',
    characters: ['tomori', 'yui'],
    status: 'HIGH_VALUE_CANDIDATE',
    bloodRelationRequired: false,
  },
  {
    id: 'legacy_route_michiru_gen',
    relationClass: 'PLACE_INHERITANCE',
    characters: ['michiru', 'gen'],
    status: 'HIGH_VALUE_CANDIDATE',
    bloodRelationRequired: false,
  },
  {
    id: 'legacy_note_sen_shiro',
    relationClass: 'TEACHER_STUDENT_LEGACY',
    characters: ['sen', 'shiro'],
    status: 'HIGH_VALUE_CANDIDATE',
    bloodRelationRequired: false,
  },
  {
    id: 'legacy_mail_gate_yuubi_tobari',
    relationClass: 'INSTITUTIONAL_LEGACY',
    characters: ['yuubi', 'tobari'],
    status: 'CANDIDATE',
    bloodRelationRequired: false,
  },
  {
    id: 'future_long_lived_chloe_renji',
    relationClass: 'TEACHER_STUDENT_LEGACY',
    characters: ['chloe', 'renji'],
    status: 'EXISTING_FUTURE_CANDIDATE',
    bloodRelationRequired: false,
  },
  {
    id: 'animal_multigeneration_kuu_yomo',
    relationClass: 'ANIMAL_RECOGNITION_BRIDGE',
    characters: ['kuu', 'yomo'],
    status: 'CANDIDATE',
    bloodRelationRequired: false,
  },
] as const;

export const crossEraLineageMemorySummary = {
  relationClassCount: CROSS_ERA_RELATION_CLASSES.length,
  recognitionStageCount: CROSS_ERA_RECOGNITION_STAGES.length,
  highValueReservoirCount: CROSS_ERA_HIGH_VALUE_RESERVOIR.length,
  parentChildMinimum: CROSS_ERA_REQUIRED_SERIES_SLOTS.trueParentChildRevealMinimum,
  ancestorDescendantMinimum: CROSS_ERA_REQUIRED_SERIES_SLOTS.trueAncestorDescendantRevealMinimum,
  exactBloodPairsFrozen: false,
  runtimeAutoPromotionAllowed: false,
} as const;