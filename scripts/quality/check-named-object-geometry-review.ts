import {
  NAMED_OBJECT_GEOMETRY_REQUIRED_GATES,
  evaluateNamedObjectGeometryReview,
  namedObjectGeometryReviewLedger,
  namedObjectGeometryReviewSummary,
  type NamedObjectGeometryReviewRecord,
} from '../../src/game/data/namedObjectGeometryReview.ts';
import { namedObjectVisualSharedSourceEntries } from '../../src/game/data/namedObjectVisualSharedSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[Named Object Geometry Review] ${message}`);
}

assert(namedObjectVisualSharedSourceEntries.length === 21, `candidate geometry source count drift: ${namedObjectVisualSharedSourceEntries.length}`);
assert(namedObjectGeometryReviewLedger.length === namedObjectVisualSharedSourceEntries.length, 'review ledger coverage drift');
assert(new Set(namedObjectGeometryReviewLedger.map((record) => record.objectId)).size === namedObjectGeometryReviewLedger.length, 'duplicate review object ID');
assert(namedObjectGeometryReviewSummary.reviewRequiredCount === 21, 'all 21 candidate geometries must start REVIEW_REQUIRED');
assert(namedObjectGeometryReviewSummary.rejectedCount === 0, 'no candidate should start rejected without review');
assert(namedObjectGeometryReviewSummary.referenceProposalEligibleCount === 0, 'reference proposal eligibility inferred');
assert(namedObjectGeometryReviewSummary.currentGeometryApprovedCount === 0, 'Current geometry approval inferred');
assert(namedObjectGeometryReviewSummary.referenceGenerationReadyCount === 0, 'reference generation readiness inferred');
assert(namedObjectGeometryReviewSummary.functionalReplicaAllowedCount === 0, 'functional replica approval inferred');
assert(namedObjectGeometryReviewSummary.premiumReplicaAllowedCount === 0, 'premium replica approval inferred');
assert(namedObjectGeometryReviewSummary.eligibilityIsDerivedOnly === true, 'review eligibility must be derived only');
assert(namedObjectGeometryReviewSummary.directCurrentMutationAllowed === false, 'review ledger cannot mutate Current directly');

const expectedGates = [
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
];
assert(JSON.stringify(NAMED_OBJECT_GEOMETRY_REQUIRED_GATES) === JSON.stringify(expectedGates), 'required geometry-review gate set/order drift');

for (const [index, source] of namedObjectVisualSharedSourceEntries.entries()) {
  const review = namedObjectGeometryReviewLedger[index];
  assert(review.objectId === source.id, `${source.id}: review object relation drift`);
  assert(review.ownerId === source.ownerId, `${source.id}: owner relation drift`);
  assert(review.displayName === source.displayName, `${source.id}: display name drift`);
  assert(review.geometryAuthority === 'CANDIDATE_OBJECT_GEOMETRY', `${source.id}: geometry authority drift`);
  assert(review.status === 'REVIEW_REQUIRED', `${source.id}: candidate geometry auto-promoted`);
  assert(review.passedGates.length === 0, `${source.id}: review gates auto-passed`);
  assert(review.evidence.humanReviewerRecorded === false, `${source.id}: human review inferred`);
  assert(review.promotion.currentGeometryApproved === false, `${source.id}: Current geometry inferred`);
  assert(review.promotion.referenceGenerationReady === false, `${source.id}: reference generation inferred`);
  assert(review.promotion.functionalReplicaAllowed === false, `${source.id}: functional replica inferred`);
  assert(review.promotion.premiumReplicaAllowed === false, `${source.id}: premium replica inferred`);
  assert(review.promotion.separatePromotionCommitRequired === true, `${source.id}: separate promotion commit requirement missing`);
  assert(review.promotion.sourceGeometryMayBeMutatedByLedger === false, `${source.id}: ledger mutation boundary missing`);
  assert(source.referenceGenerationReady === false, `${source.id}: source reference generation unexpectedly ready`);
  assert(source.functionalReplicaAllowed === false, `${source.id}: source functional replica unexpectedly allowed`);
  assert(source.premiumReplicaAllowed === false, `${source.id}: source premium replica unexpectedly allowed`);
  assert(source.artworkReady === false && source.runtimeReady === false, `${source.id}: source artwork/runtime readiness inferred`);
  assert(source.frontSilhouette.length > 20 && source.backSilhouette.length > 20 && source.sideSilhouette.length > 20, `${source.id}: three-view candidate seed incomplete`);
  assert(source.wearMarks.length > 10 && source.repairMarks.length > 10, `${source.id}: wear/repair candidate seed incomplete`);
  assert(source.handlingGesture.length > 10 && source.storageMethod.length > 10, `${source.id}: handling/storage candidate seed incomplete`);
}

const base = namedObjectGeometryReviewLedger[0];
assert(base, 'fixture source missing');
const reviewedFixture: NamedObjectGeometryReviewRecord = {
  ...base,
  status: 'APPROVED_FOR_REFERENCE_PROPOSAL',
  passedGates: NAMED_OBJECT_GEOMETRY_REQUIRED_GATES,
  evidence: {
    humanReviewerRecorded: true,
    threeViewComparisonRecorded: true,
    scaleReferenceRecorded: true,
    wearRepairReviewRecorded: true,
    handlingStorageReviewRecorded: true,
    spoilerReviewRecorded: true,
    replicaSafetyReviewRecorded: true,
  },
};

const reviewed = evaluateNamedObjectGeometryReview(reviewedFixture);
assert(reviewed.allRequiredGatesPassed === true, 'fully reviewed fixture should pass gates');
assert(reviewed.evidenceComplete === true, 'fully reviewed fixture should pass evidence');
assert(reviewed.eligibleForReferenceProposal === true, 'fully reviewed fixture should become reference-proposal eligible');
assert(reviewed.mayMutateCurrentGeometry === false, 'reviewed candidate cannot mutate Current geometry directly');
assert(reviewed.mayEnableReferenceGenerationDirectly === false, 'reviewed candidate cannot directly enable generation');
assert(reviewed.mayEnableFunctionalReplicaDirectly === false, 'reviewed candidate cannot directly enable functional replica');
assert(reviewed.mayEnablePremiumReplicaDirectly === false, 'reviewed candidate cannot directly enable premium replica');

const missingHuman = evaluateNamedObjectGeometryReview({
  ...reviewedFixture,
  evidence: { ...reviewedFixture.evidence, humanReviewerRecorded: false },
});
assert(missingHuman.eligibleForReferenceProposal === false, 'human review cannot be optional');

const missingThreeView = evaluateNamedObjectGeometryReview({
  ...reviewedFixture,
  passedGates: NAMED_OBJECT_GEOMETRY_REQUIRED_GATES.filter((gate) => gate !== 'THREE_VIEW_COHERENCE'),
});
assert(missingThreeView.eligibleForReferenceProposal === false, 'three-view gate cannot be optional');

const missingSpoiler = evaluateNamedObjectGeometryReview({
  ...reviewedFixture,
  evidence: { ...reviewedFixture.evidence, spoilerReviewRecorded: false },
});
assert(missingSpoiler.eligibleForReferenceProposal === false, 'spoiler review cannot be optional');

console.log('Named Object Geometry Review: PASS (candidate=21, reviewRequired=21, approved=0, referenceReady=0, replicas=0)');
