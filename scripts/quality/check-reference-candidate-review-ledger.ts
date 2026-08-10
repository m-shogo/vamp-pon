import {
  REFERENCE_CANDIDATE_ALLOWED_TRANSITIONS,
  canTransitionReferenceCandidateReview,
  evaluateReferenceCandidateReview,
  referenceCandidateReviewLedger,
  referenceCandidateReviewLedgerSummary,
  type ReferenceCandidateArtifact,
  type ReferenceCandidateReviewRecord,
} from '../../src/game/data/referenceCandidateReviewLedger.ts';
import { referenceFirstBulkGenerationQueue } from '../../src/game/data/referenceFirstBulkGenerationQueue.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[Reference Candidate Review Ledger] ${message}`);
}

assert(referenceCandidateReviewLedger.length === referenceFirstBulkGenerationQueue.length, 'review ledger queue coverage drift');
assert(referenceCandidateReviewLedger.length === 168, `review ledger expected 168 reference entries, got ${referenceCandidateReviewLedger.length}`);
assert(new Set(referenceCandidateReviewLedger.map((record) => record.queueId)).size === referenceCandidateReviewLedger.length, 'duplicate review queue ID');
assert(referenceCandidateReviewLedgerSummary.totalRecords === 168, 'summary total drift');
assert(referenceCandidateReviewLedgerSummary.notGeneratedCount === 168, 'all entries must start NOT_GENERATED');
assert(referenceCandidateReviewLedgerSummary.candidatesStagedCount === 0, 'staged candidate state inferred');
assert(referenceCandidateReviewLedgerSummary.humanReviewRequiredCount === 0, 'human review state inferred');
assert(referenceCandidateReviewLedgerSummary.regenerateRequiredCount === 0, 'regenerate state inferred');
assert(referenceCandidateReviewLedgerSummary.approvedReferenceCount === 0, 'reference approval inferred');
assert(referenceCandidateReviewLedgerSummary.totalCandidateArtifacts === 0, 'candidate artifacts inferred');
assert(referenceCandidateReviewLedgerSummary.runtimeDerivativeQueueAllowedCount === 0, 'runtime derivative eligibility inferred');
assert(referenceCandidateReviewLedgerSummary.generatedDoesNotMeanApproved === true, 'generated/approved separation guard missing');
assert(referenceCandidateReviewLedgerSummary.separateSurfaceApprovalsRequired === true, 'surface approval separation guard missing');

for (const [index, record] of referenceCandidateReviewLedger.entries()) {
  const queueEntry = referenceFirstBulkGenerationQueue[index];
  assert(record.queueId === queueEntry.queueId, `${record.queueId}: queue relation drift`);
  assert(record.handoffId === queueEntry.handoffId, `${record.queueId}: handoff relation drift`);
  assert(record.sourceCategory === queueEntry.sourceCategory, `${record.queueId}: category relation drift`);
  assert(record.sourceId === queueEntry.sourceId, `${record.queueId}: source ID drift`);
  assert(record.expectedCandidateCount === 4, `${record.queueId}: expected candidate count drift`);
  assert(record.reviewState === 'NOT_GENERATED', `${record.queueId}: default state drift`);
  assert(record.candidates.length === 0, `${record.queueId}: candidates inferred`);
  assert(record.selectedCandidateId === null, `${record.queueId}: selected candidate inferred`);
  assert(record.evidence.comparisonSheetPath === null, `${record.queueId}: comparison evidence inferred`);
  assert(record.evidence.humanReviewer === null, `${record.queueId}: human reviewer inferred`);
  assert(record.approval.approvedReference === false, `${record.queueId}: reference approval inferred`);
  assert(record.approval.approvedWeb === false, `${record.queueId}: Web approval inferred`);
  assert(record.approval.approvedUnity === false, `${record.queueId}: Unity approval inferred`);
  assert(record.approval.runtimeApproved === false, `${record.queueId}: runtime approval inferred`);
  assert(record.approval.separateSurfaceApprovalRequired === true, `${record.queueId}: surface approval separation missing`);
  assert(record.gate.oneShotFinalForbidden === true, `${record.queueId}: one-shot final gate missing`);
  assert(record.gate.exactFourCandidatesRequired === true, `${record.queueId}: exact-four gate missing`);
  assert(record.gate.selectedCandidateMustExist === true, `${record.queueId}: selected candidate gate missing`);
  assert(record.gate.humanComparisonRequired === true, `${record.queueId}: human comparison gate missing`);
  assert(record.gate.runtimeDerivativeRequiresApprovedReference === true, `${record.queueId}: runtime derivative approval gate missing`);
}

assert(JSON.stringify(REFERENCE_CANDIDATE_ALLOWED_TRANSITIONS.NOT_GENERATED) === JSON.stringify(['CANDIDATES_STAGED']), 'NOT_GENERATED transition drift');
assert(JSON.stringify(REFERENCE_CANDIDATE_ALLOWED_TRANSITIONS.CANDIDATES_STAGED) === JSON.stringify(['HUMAN_REVIEW_REQUIRED', 'REGENERATE_REQUIRED']), 'CANDIDATES_STAGED transition drift');
assert(JSON.stringify(REFERENCE_CANDIDATE_ALLOWED_TRANSITIONS.HUMAN_REVIEW_REQUIRED) === JSON.stringify(['APPROVED_REFERENCE', 'REGENERATE_REQUIRED']), 'HUMAN_REVIEW_REQUIRED transition drift');
assert(JSON.stringify(REFERENCE_CANDIDATE_ALLOWED_TRANSITIONS.REGENERATE_REQUIRED) === JSON.stringify(['CANDIDATES_STAGED']), 'REGENERATE_REQUIRED transition drift');
assert(REFERENCE_CANDIDATE_ALLOWED_TRANSITIONS.APPROVED_REFERENCE.length === 0, 'APPROVED_REFERENCE must be terminal');
assert(canTransitionReferenceCandidateReview('NOT_GENERATED', 'APPROVED_REFERENCE') === false, 'cannot skip directly from NOT_GENERATED to APPROVED_REFERENCE');
assert(canTransitionReferenceCandidateReview('CANDIDATES_STAGED', 'APPROVED_REFERENCE') === false, 'cannot skip human review');
assert(canTransitionReferenceCandidateReview('HUMAN_REVIEW_REQUIRED', 'APPROVED_REFERENCE') === true, 'reviewed candidate should allow approval transition');

const base = referenceCandidateReviewLedger[0];
assert(base, 'review fixture base missing');
const artifacts: ReferenceCandidateArtifact[] = Array.from({ length: 4 }, (_, index) => ({
  candidateId: `fixture-candidate-${index + 1}`,
  filePath: `/tmp/fixture-candidate-${index + 1}.png`,
  sha256: `sha256-fixture-${index + 1}`,
  generatorName: 'fixture-generator',
  generatorVersion: '1.0',
  promptHash: 'fixture-prompt-hash',
  referenceHashes: [`fixture-reference-hash-${index + 1}`],
  sourceCommit: 'fixture-source-commit',
}));

const reviewReady: ReferenceCandidateReviewRecord = {
  ...base,
  reviewState: 'HUMAN_REVIEW_REQUIRED',
  candidates: artifacts,
  selectedCandidateId: artifacts[1].candidateId,
  evidence: {
    comparisonSheetPath: '/tmp/fixture-comparison.png',
    humanReviewer: 'fixture-reviewer',
    identityOrMotifQaPassed: true,
    cropAndAlphaQaPassed: true,
    mobileReadabilityQaPassed: true,
    spoilerBoundaryQaPassed: true,
    sourceLineageQaPassed: true,
  },
};

const readyEvaluation = evaluateReferenceCandidateReview(reviewReady);
assert(readyEvaluation.exactCandidateSet === true, 'four unique candidates should satisfy exact set');
assert(readyEvaluation.candidateMetadataComplete === true, 'candidate metadata should be complete');
assert(readyEvaluation.selectedCandidateExists === true, 'selected candidate must exist');
assert(readyEvaluation.reviewEvidenceComplete === true, 'review evidence should be complete');
assert(readyEvaluation.eligibleForReferenceApproval === true, 'fully reviewed candidate set should become reference-approval eligible');
assert(readyEvaluation.runtimeDerivativeQueueAllowed === false, 'review eligibility alone must not queue runtime derivatives');

const approved: ReferenceCandidateReviewRecord = {
  ...reviewReady,
  reviewState: 'APPROVED_REFERENCE',
  approval: { ...reviewReady.approval, approvedReference: true },
};
const approvedEvaluation = evaluateReferenceCandidateReview(approved);
assert(approvedEvaluation.approvedReferenceValid === true, 'approved reference fixture should validate');
assert(approvedEvaluation.runtimeDerivativeQueueAllowed === true, 'runtime derivative may queue only after valid reference approval');
assert(approvedEvaluation.approvedWebInferred === false, 'reference approval must not infer Web approval');
assert(approvedEvaluation.approvedUnityInferred === false, 'reference approval must not infer Unity approval');
assert(approvedEvaluation.runtimeApprovedInferred === false, 'reference approval must not infer runtime approval');

const threeCandidates = evaluateReferenceCandidateReview({ ...reviewReady, candidates: artifacts.slice(0, 3) });
assert(threeCandidates.eligibleForReferenceApproval === false, 'three candidates must not pass exact-four gate');
const duplicateHashArtifacts = artifacts.map((artifact, index) => index === 3 ? { ...artifact, sha256: artifacts[0].sha256 } : artifact);
assert(evaluateReferenceCandidateReview({ ...reviewReady, candidates: duplicateHashArtifacts }).eligibleForReferenceApproval === false, 'duplicate candidate hash must block approval');
const missingHuman = evaluateReferenceCandidateReview({ ...reviewReady, evidence: { ...reviewReady.evidence, humanReviewer: null } });
assert(missingHuman.eligibleForReferenceApproval === false, 'human reviewer cannot be omitted');
const missingSelected = evaluateReferenceCandidateReview({ ...reviewReady, selectedCandidateId: 'not-in-candidate-set' });
assert(missingSelected.eligibleForReferenceApproval === false, 'selected candidate must exist in staged set');
const approvedWithoutFlag = evaluateReferenceCandidateReview({ ...approved, approval: { ...approved.approval, approvedReference: false } });
assert(approvedWithoutFlag.approvedReferenceValid === false, 'APPROVED_REFERENCE state without explicit approval flag must be invalid');

console.log('Reference Candidate Review Ledger: PASS (records=168, notGenerated=168, staged=0, approved=0, runtimeQueued=0)');
