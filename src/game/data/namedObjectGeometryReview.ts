import { namedObjectVisualSharedSourceEntries } from './namedObjectVisualSharedSource.ts';

export type NamedObjectGeometryReviewStatus =
  | 'REVIEW_REQUIRED'
  | 'REJECTED'
  | 'APPROVED_FOR_REFERENCE_PROPOSAL';

export type NamedObjectGeometryReviewGateId =
  | 'THREE_VIEW_COHERENCE'
  | 'SCALE_PLAUSIBILITY'
  | 'MATERIAL_IDENTITY'
  | 'WEAR_HISTORY'
  | 'REPAIR_HISTORY'
  | 'HANDLING_GESTURE'
  | 'STORAGE_METHOD'
  | 'SPOILER_BOUNDARY'
  | 'REPLICA_SAFETY'
  | 'OWNER_IDENTITY'
  | 'HUMAN_APPROVAL';

export type NamedObjectGeometryReviewRecord = {
  objectId: string;
  ownerId: string;
  displayName: string;
  geometryAuthority: 'CANDIDATE_OBJECT_GEOMETRY';
  status: NamedObjectGeometryReviewStatus;
  requiredGates: readonly NamedObjectGeometryReviewGateId[];
  passedGates: readonly NamedObjectGeometryReviewGateId[];
  evidence: {
    humanReviewerRecorded: boolean;
    threeViewComparisonRecorded: boolean;
    scaleReferenceRecorded: boolean;
    wearRepairReviewRecorded: boolean;
    handlingStorageReviewRecorded: boolean;
    spoilerReviewRecorded: boolean;
    replicaSafetyReviewRecorded: boolean;
  };
  promotion: {
    currentGeometryApproved: false;
    referenceGenerationReady: false;
    functionalReplicaAllowed: false;
    premiumReplicaAllowed: false;
    separatePromotionCommitRequired: true;
    sourceGeometryMayBeMutatedByLedger: false;
  };
};

export const NAMED_OBJECT_GEOMETRY_REQUIRED_GATES: readonly NamedObjectGeometryReviewGateId[] = [
  'THREE_VIEW_COHERENCE',
  'SCALE_PLAUSIBILITY',
  'MATERIAL_IDENTITY',
  'WEAR_HISTORY',
  'REPAIR_HISTORY',
  'HANDLING_GESTURE',
  'STORAGE_METHOD',
  'SPOILER_BOUNDARY',
  'REPLICA_SAFETY',
  'OWNER_IDENTITY',
  'HUMAN_APPROVAL',
] as const;

function defaultReviewRecord(source: (typeof namedObjectVisualSharedSourceEntries)[number]): NamedObjectGeometryReviewRecord {
  return {
    objectId: source.id,
    ownerId: source.ownerId,
    displayName: source.displayName,
    geometryAuthority: source.geometryAuthority,
    status: 'REVIEW_REQUIRED',
    requiredGates: NAMED_OBJECT_GEOMETRY_REQUIRED_GATES,
    passedGates: [],
    evidence: {
      humanReviewerRecorded: false,
      threeViewComparisonRecorded: false,
      scaleReferenceRecorded: false,
      wearRepairReviewRecorded: false,
      handlingStorageReviewRecorded: false,
      spoilerReviewRecorded: false,
      replicaSafetyReviewRecorded: false,
    },
    promotion: {
      currentGeometryApproved: false,
      referenceGenerationReady: false,
      functionalReplicaAllowed: false,
      premiumReplicaAllowed: false,
      separatePromotionCommitRequired: true,
      sourceGeometryMayBeMutatedByLedger: false,
    },
  };
}

/**
 * All candidate geometries enter review explicitly.
 * No object is auto-approved because a geometry seed exists.
 */
export const namedObjectGeometryReviewLedger: readonly NamedObjectGeometryReviewRecord[] =
  namedObjectVisualSharedSourceEntries.map(defaultReviewRecord);

export const namedObjectGeometryReviewById = new Map(
  namedObjectGeometryReviewLedger.map((record) => [record.objectId, record]),
);

export function evaluateNamedObjectGeometryReview(record: NamedObjectGeometryReviewRecord) {
  const passed = new Set(record.passedGates);
  const allRequiredGatesPassed = NAMED_OBJECT_GEOMETRY_REQUIRED_GATES.every((gate) => passed.has(gate));
  const evidenceComplete =
    record.evidence.humanReviewerRecorded &&
    record.evidence.threeViewComparisonRecorded &&
    record.evidence.scaleReferenceRecorded &&
    record.evidence.wearRepairReviewRecorded &&
    record.evidence.handlingStorageReviewRecorded &&
    record.evidence.spoilerReviewRecorded &&
    record.evidence.replicaSafetyReviewRecorded;

  return {
    allRequiredGatesPassed,
    evidenceComplete,
    eligibleForReferenceProposal:
      record.status === 'APPROVED_FOR_REFERENCE_PROPOSAL' &&
      allRequiredGatesPassed &&
      evidenceComplete,
    mayMutateCurrentGeometry: false,
    mayEnableReferenceGenerationDirectly: false,
    mayEnableFunctionalReplicaDirectly: false,
    mayEnablePremiumReplicaDirectly: false,
  } as const;
}

export const namedObjectGeometryReviewSummary = {
  candidateGeometryCount: namedObjectGeometryReviewLedger.length,
  reviewRequiredCount: namedObjectGeometryReviewLedger.filter((record) => record.status === 'REVIEW_REQUIRED').length,
  rejectedCount: namedObjectGeometryReviewLedger.filter((record) => record.status === 'REJECTED').length,
  referenceProposalEligibleCount: namedObjectGeometryReviewLedger.filter(
    (record) => evaluateNamedObjectGeometryReview(record).eligibleForReferenceProposal,
  ).length,
  currentGeometryApprovedCount: namedObjectGeometryReviewLedger.filter((record) => record.promotion.currentGeometryApproved).length,
  referenceGenerationReadyCount: namedObjectGeometryReviewLedger.filter((record) => record.promotion.referenceGenerationReady).length,
  functionalReplicaAllowedCount: namedObjectGeometryReviewLedger.filter((record) => record.promotion.functionalReplicaAllowed).length,
  premiumReplicaAllowedCount: namedObjectGeometryReviewLedger.filter((record) => record.promotion.premiumReplicaAllowed).length,
  eligibilityIsDerivedOnly: true,
  directCurrentMutationAllowed: false,
} as const;
