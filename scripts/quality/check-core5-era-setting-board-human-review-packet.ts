import { readFileSync } from 'node:fs';

const REVIEW = 'data/character-assets/reviews/core5-era-setting-board-human-review-packet.v1.json';
const QUEUE = 'data/character-assets/manifests/core5-era-setting-board-execution-queue.v1.json';
const review = JSON.parse(readFileSync(REVIEW, 'utf8'));
const queue = JSON.parse(readFileSync(QUEUE, 'utf8'));

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(review.schemaVersion === 1, 'Core5 review packet schema drift');
assert(review.status === 'READY_FOR_HUMAN_REVIEW_NO_VISUAL_APPROVAL_YET', 'Core5 review packet status drift');
assert(review.scope?.environmentBoards === 5 && review.scope?.populationHouseholdBoards === 5 && review.scope?.totalBoards === 10, 'Core5 review scope count drift');
assert(Array.isArray(review.globalReviewDimensions) && review.globalReviewDimensions.length >= 6, 'Core5 review dimensions missing');
assert(Array.isArray(review.hardVetoes) && review.hardVetoes.length >= 8, 'Core5 hard-veto coverage missing');
assert(Array.isArray(review.entries) && review.entries.length === 10, 'Core5 review packet must contain 10 entries');
assert(new Set(review.entries.map((entry: any) => entry.assetId)).size === 10, 'Core5 review asset IDs must be unique');

const queueIds = new Set((queue.entries ?? []).map((entry: any) => entry.assetId));
for (const entry of review.entries) {
  assert(queueIds.has(entry.assetId), `${entry.assetId}: review entry missing from execution queue`);
  assert(entry.reviewState === 'PENDING_HUMAN_REVIEW', `${entry.assetId}: review must remain pending until explicit Human decision`);
}
for (const key of [
  'reviewPacketCreatesApproval',
  'imageGenerationAuthorized',
  'visualReferenceEvidenceAuthoringAllowedBeforeHumanPass',
  'masterApprovalAllowedBeforeHumanPass',
  'runtimeApprovalAllowedBeforeHumanPass',
]) {
  assert(review.promotionBoundary?.[key] === false, `Core5 review promotion boundary must be false: ${key}`);
}
assert(review.promotionBoundary?.allEntriesPending === true, 'Core5 review packet must record all entries pending');
assert(queue.counts?.humanApproved === 0 && queue.counts?.rasterAuthority === 0, 'Core5 queue may not be approved/raster-authoritative before review');

console.log(JSON.stringify({
  status: 'PASS',
  reviewedBoardSlots: review.entries.length,
  pendingHumanReview: review.entries.length,
  humanApproved: queue.counts.humanApproved,
  rasterAuthority: queue.counts.rasterAuthority,
  imageGenerationAuthorized: false,
}, null, 2));
