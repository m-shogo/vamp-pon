import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (relativePath: string) =>
  JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));

const reviewPath = 'data/character-assets/reviews/core5-era-setting-board-professional-pre-review.v1.json';
const queuePath = 'data/character-assets/manifests/core5-era-setting-board-execution-queue.v1.json';
const humanPacketPath = 'data/character-assets/reviews/core5-era-setting-board-human-review-packet.v1.json';

const review = readJson(reviewPath);
const queue = readJson(queuePath);
const humanPacket = readJson(humanPacketPath);

const fail = (message: string): never => {
  throw new Error(`[Core5 professional pre-review] ${message}`);
};

if (review.reviewKind !== 'AI_PROFESSIONAL_PRE_HUMAN_REVIEW') {
  fail('reviewKind must remain AI_PROFESSIONAL_PRE_HUMAN_REVIEW.');
}

if (review.status !== 'ALL_TEN_STRUCTURALLY_READY_FOR_HUMAN_REVIEW_NO_HUMAN_DECISION_RECORDED') {
  fail('status must explicitly preserve the no-Human-decision boundary.');
}

if (review.summary?.total !== 10 || review.summary?.environment !== 5 || review.summary?.populationHousehold !== 5) {
  fail('summary must remain 10 total = 5 environment + 5 population/household.');
}

if (review.summary?.structurallyReadyForHumanReview !== 10 || review.summary?.blockingRevisionsFound !== 0) {
  fail('all ten specs must remain structurally ready with zero blocking pre-review findings.');
}

for (const key of ['humanPass', 'humanRevise', 'humanHold']) {
  if (review.summary?.[key] !== 0) fail(`${key} must remain 0 in the AI pre-review layer.`);
}

if (review.summary?.imageGenerationAuthorized !== false) {
  fail('pre-review may not authorize image generation.');
}

const queueIds = new Set((queue.entries ?? []).map((entry: any) => entry.assetId));
const reviewEntries = review.entries ?? [];
if (reviewEntries.length !== 10) fail('exactly ten pre-review entries are required.');

const reviewIds = new Set<string>();
for (const entry of reviewEntries) {
  if (!queueIds.has(entry.assetId)) fail(`unknown assetId: ${entry.assetId}`);
  if (reviewIds.has(entry.assetId)) fail(`duplicate assetId: ${entry.assetId}`);
  reviewIds.add(entry.assetId);
  if (entry.preReviewState !== 'READY_FOR_HUMAN_REVIEW') {
    fail(`${entry.assetId} must remain READY_FOR_HUMAN_REVIEW, not Human PASS/REVISE/HOLD.`);
  }
  if (!Array.isArray(entry.blockingFindings) || entry.blockingFindings.length !== 0) {
    fail(`${entry.assetId} has blocking findings but summary claims none.`);
  }
  if (!Array.isArray(entry.strengths) || entry.strengths.length < 2) {
    fail(`${entry.assetId} must record at least two review strengths.`);
  }
  if (!Array.isArray(entry.humanAttention) || entry.humanAttention.length < 1) {
    fail(`${entry.assetId} must preserve at least one explicit Human-attention item.`);
  }
}

for (const queueId of queueIds) {
  if (!reviewIds.has(queueId as string)) fail(`missing pre-review entry for ${queueId}`);
}

const humanEntries = humanPacket.entries ?? [];
if (humanEntries.length !== 10) fail('Human review packet must still contain ten entries.');
for (const entry of humanEntries) {
  if (entry.reviewState !== 'PENDING_HUMAN_REVIEW') {
    fail(`${entry.assetId} is no longer PENDING_HUMAN_REVIEW; AI pre-review must not mutate Human decisions.`);
  }
}

const boundary = review.promotionBoundary ?? {};
for (const key of [
  'preReviewCreatesHumanApproval',
  'preReviewCreatesMasterApproval',
  'preReviewCreatesRasterAuthority',
  'preReviewAuthorizesImageGeneration'
]) {
  if (boundary[key] !== false) fail(`${key} must remain false.`);
}
if (boundary.humanReviewStillRequired !== true) fail('Human review must remain required.');
if (boundary.nextGate !== 'EXPLICIT_HUMAN_PASS_REVISE_HOLD_PER_BOARD') {
  fail('nextGate must remain explicit Human PASS/REVISE/HOLD per board.');
}

console.log('Core5 professional pre-Human setting-board review: PASS (10/10 structurally ready, Human decisions still pending).');
