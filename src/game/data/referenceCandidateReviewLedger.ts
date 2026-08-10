import {
  referenceFirstBulkGenerationQueue,
  type ReferenceFirstQueueEntry,
} from './referenceFirstBulkGenerationQueue.ts';

export type ReferenceCandidateReviewState =
  | 'NOT_GENERATED'
  | 'CANDIDATES_STAGED'
  | 'HUMAN_REVIEW_REQUIRED'
  | 'REGENERATE_REQUIRED'
  | 'APPROVED_REFERENCE';

export type ReferenceCandidateArtifact = {
  candidateId: string;
  filePath: string;
  sha256: string;
  generatorName: string;
  generatorVersion: string;
  promptHash: string;
  referenceHashes: readonly string[];
  sourceCommit: string;
};

export type ReferenceCandidateReviewRecord = {
  queueId: string;
  handoffId: string;
  sourceCategory: ReferenceFirstQueueEntry['sourceCategory'];
  sourceId: string;
  displayName: string;
  expectedCandidateCount: 4;
  reviewState: ReferenceCandidateReviewState;
  candidates: readonly ReferenceCandidateArtifact[];
  selectedCandidateId: string | null;
  evidence: {
    comparisonSheetPath: string | null;
    humanReviewer: string | null;
    identityOrMotifQaPassed: boolean;
    cropAndAlphaQaPassed: boolean;
    mobileReadabilityQaPassed: boolean;
    spoilerBoundaryQaPassed: boolean;
    sourceLineageQaPassed: boolean;
  };
  approval: {
    approvedReference: boolean;
    approvedWeb: false;
    approvedUnity: false;
    runtimeApproved: false;
    separateSurfaceApprovalRequired: true;
  };
  gate: {
    oneShotFinalForbidden: true;
    exactFourCandidatesRequired: true;
    selectedCandidateMustExist: true;
    humanComparisonRequired: true;
    runtimeDerivativeRequiresApprovedReference: true;
  };
};

export const REFERENCE_CANDIDATE_ALLOWED_TRANSITIONS: Readonly<
  Record<ReferenceCandidateReviewState, readonly ReferenceCandidateReviewState[]>
> = {
  NOT_GENERATED: ['CANDIDATES_STAGED'],
  CANDIDATES_STAGED: ['HUMAN_REVIEW_REQUIRED', 'REGENERATE_REQUIRED'],
  HUMAN_REVIEW_REQUIRED: ['APPROVED_REFERENCE', 'REGENERATE_REQUIRED'],
  REGENERATE_REQUIRED: ['CANDIDATES_STAGED'],
  APPROVED_REFERENCE: [],
} as const;

function defaultReviewRecord(queueEntry: ReferenceFirstQueueEntry): ReferenceCandidateReviewRecord {
  return {
    queueId: queueEntry.queueId,
    handoffId: queueEntry.handoffId,
    sourceCategory: queueEntry.sourceCategory,
    sourceId: queueEntry.sourceId,
    displayName: queueEntry.displayName,
    expectedCandidateCount: 4,
    reviewState: 'NOT_GENERATED',
    candidates: [],
    selectedCandidateId: null,
    evidence: {
      comparisonSheetPath: null,
      humanReviewer: null,
      identityOrMotifQaPassed: false,
      cropAndAlphaQaPassed: false,
      mobileReadabilityQaPassed: false,
      spoilerBoundaryQaPassed: false,
      sourceLineageQaPassed: false,
    },
    approval: {
      approvedReference: false,
      approvedWeb: false,
      approvedUnity: false,
      runtimeApproved: false,
      separateSurfaceApprovalRequired: true,
    },
    gate: {
      oneShotFinalForbidden: true,
      exactFourCandidatesRequired: true,
      selectedCandidateMustExist: true,
      humanComparisonRequired: true,
      runtimeDerivativeRequiresApprovedReference: true,
    },
  };
}

export const referenceCandidateReviewLedger: readonly ReferenceCandidateReviewRecord[] =
  referenceFirstBulkGenerationQueue.map(defaultReviewRecord);

export const referenceCandidateReviewByQueueId = new Map(
  referenceCandidateReviewLedger.map((record) => [record.queueId, record]),
);

export function canTransitionReferenceCandidateReview(
  from: ReferenceCandidateReviewState,
  to: ReferenceCandidateReviewState,
): boolean {
  return REFERENCE_CANDIDATE_ALLOWED_TRANSITIONS[from].includes(to);
}

export function evaluateReferenceCandidateReview(record: ReferenceCandidateReviewRecord) {
  const candidateIds = new Set(record.candidates.map((candidate) => candidate.candidateId));
  const candidateFiles = new Set(record.candidates.map((candidate) => candidate.filePath));
  const hashes = new Set(record.candidates.map((candidate) => candidate.sha256));
  const exactCandidateSet =
    record.candidates.length === record.expectedCandidateCount &&
    candidateIds.size === record.expectedCandidateCount &&
    candidateFiles.size === record.expectedCandidateCount &&
    hashes.size === record.expectedCandidateCount;
  const candidateMetadataComplete = record.candidates.every(
    (candidate) =>
      candidate.candidateId.length > 0 &&
      candidate.filePath.length > 0 &&
      candidate.sha256.length > 0 &&
      candidate.generatorName.length > 0 &&
      candidate.generatorVersion.length > 0 &&
      candidate.promptHash.length > 0 &&
      candidate.referenceHashes.length > 0 &&
      candidate.sourceCommit.length > 0,
  );
  const selectedCandidateExists =
    record.selectedCandidateId !== null && candidateIds.has(record.selectedCandidateId);
  const reviewEvidenceComplete =
    record.evidence.comparisonSheetPath !== null &&
    record.evidence.humanReviewer !== null &&
    record.evidence.identityOrMotifQaPassed &&
    record.evidence.cropAndAlphaQaPassed &&
    record.evidence.mobileReadabilityQaPassed &&
    record.evidence.spoilerBoundaryQaPassed &&
    record.evidence.sourceLineageQaPassed;
  const eligibleForReferenceApproval =
    record.reviewState === 'HUMAN_REVIEW_REQUIRED' &&
    exactCandidateSet &&
    candidateMetadataComplete &&
    selectedCandidateExists &&
    reviewEvidenceComplete;
  const approvedReferenceValid =
    record.reviewState === 'APPROVED_REFERENCE' &&
    record.approval.approvedReference &&
    exactCandidateSet &&
    candidateMetadataComplete &&
    selectedCandidateExists &&
    reviewEvidenceComplete;

  return {
    exactCandidateSet,
    candidateMetadataComplete,
    selectedCandidateExists,
    reviewEvidenceComplete,
    eligibleForReferenceApproval,
    approvedReferenceValid,
    runtimeDerivativeQueueAllowed: approvedReferenceValid,
    approvedWebInferred: false,
    approvedUnityInferred: false,
    runtimeApprovedInferred: false,
  } as const;
}

export const referenceCandidateReviewLedgerSummary = {
  totalRecords: referenceCandidateReviewLedger.length,
  notGeneratedCount: referenceCandidateReviewLedger.filter((record) => record.reviewState === 'NOT_GENERATED').length,
  candidatesStagedCount: referenceCandidateReviewLedger.filter((record) => record.reviewState === 'CANDIDATES_STAGED').length,
  humanReviewRequiredCount: referenceCandidateReviewLedger.filter((record) => record.reviewState === 'HUMAN_REVIEW_REQUIRED').length,
  regenerateRequiredCount: referenceCandidateReviewLedger.filter((record) => record.reviewState === 'REGENERATE_REQUIRED').length,
  approvedReferenceCount: referenceCandidateReviewLedger.filter((record) => record.reviewState === 'APPROVED_REFERENCE').length,
  totalCandidateArtifacts: referenceCandidateReviewLedger.reduce((count, record) => count + record.candidates.length, 0),
  runtimeDerivativeQueueAllowedCount: referenceCandidateReviewLedger.filter(
    (record) => evaluateReferenceCandidateReview(record).runtimeDerivativeQueueAllowed,
  ).length,
  generatedDoesNotMeanApproved: true,
  separateSurfaceApprovalsRequired: true,
} as const;
