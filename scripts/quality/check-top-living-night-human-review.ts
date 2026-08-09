import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type HumanReviewStatus = {
  schemaVersion: number;
  executed: boolean;
  result: string;
  candidateGenerated: boolean;
  candidatePath: string;
  candidateSha256: string;
  captureSourceCommit: string;
  topCompositeKind: string;
  topCompositePath: string;
  topCompositeSha256: string;
  expectedFrameCount: number;
  reviewedFrameCount: number;
  loadingFramesReviewed: number;
  topFramesReviewed: number;
  noBlackOrBlankFrames: boolean;
  noDevelopmentText: boolean;
  topCore5Readable: boolean;
  cropSafeAcrossAllTargets: boolean;
  loadingToTopContinuityPassed: boolean;
  reviewerRole: string;
  reviewedAtUtc: string;
  notes: string;
  humanVisualReviewComplete: boolean;
  finalApprovalBlocked: boolean;
};

type FinalArtStatus = {
  candidateGenerated: boolean;
  candidatePath: string;
  candidateSha256: string;
  humanVisualReviewComplete: boolean;
  approvedAsFinal: boolean;
  finalApprovalBlocked: boolean;
};

type CaptureManifest = {
  executed: boolean;
  result: string;
  sourceCommit: string;
  topCompositeKind: string;
  topCompositePath: string;
  topCompositeSha256: string;
  expectedCaptureCount: number;
  captureCount: number;
  captures: unknown[];
};

type LoadingManifest = {
  approval: {
    humanVisualReviewComplete: boolean;
  };
};

const root = process.cwd();
const review = JSON.parse(
  readFileSync(join(root, 'docs/design-targets/generated/top-living-night-v3/human-visual-review-status.json'), 'utf8'),
) as HumanReviewStatus;
const finalArt = JSON.parse(
  readFileSync(join(root, 'docs/design-targets/generated/top-living-night-v3/final-art-status.json'), 'utf8'),
) as FinalArtStatus;
const capture = JSON.parse(
  readFileSync(join(root, 'docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json'), 'utf8'),
) as CaptureManifest;
const loadingManifest = JSON.parse(
  readFileSync(join(root, 'docs/design-targets/generated/loading-seasonal-v1/manifest.json'), 'utf8'),
) as LoadingManifest;

const canonicalFinalPath =
  'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';
const sha256 = /^[0-9a-f]{64}$/;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(review.schemaVersion === 1, 'TOP human visual review schema mismatch');
invariant(review.candidatePath === canonicalFinalPath, 'TOP human review candidate path must remain canonical');
invariant(finalArt.candidatePath === canonicalFinalPath, 'TOP final-art candidate path must remain canonical');
invariant(review.expectedFrameCount === 15, 'TOP human review must require the full 15-frame matrix');
invariant(review.candidateGenerated === finalArt.candidateGenerated, 'TOP human review candidateGenerated must match final-art authority');
invariant(
  review.humanVisualReviewComplete === finalArt.humanVisualReviewComplete,
  'final-art humanVisualReviewComplete must exactly match structured human review evidence',
);
invariant(
  review.humanVisualReviewComplete === loadingManifest.approval.humanVisualReviewComplete,
  'Loading/TOP manifest humanVisualReviewComplete must exactly match structured human review evidence',
);

if (!review.executed) {
  invariant(review.result === 'NOT_RUN', 'unexecuted TOP human review must be NOT_RUN');
  invariant(review.candidateSha256 === '', 'unexecuted TOP human review must not retain candidate SHA-256');
  invariant(review.captureSourceCommit === '', 'unexecuted TOP human review must not retain capture commit');
  invariant(review.topCompositeKind === '', 'unexecuted TOP human review must not retain composite kind');
  invariant(review.topCompositePath === '', 'unexecuted TOP human review must not retain composite path');
  invariant(review.topCompositeSha256 === '', 'unexecuted TOP human review must not retain composite SHA-256');
  invariant(review.reviewedFrameCount === 0, 'unexecuted TOP human review frame count must be zero');
  invariant(review.loadingFramesReviewed === 0, 'unexecuted TOP human review loading count must be zero');
  invariant(review.topFramesReviewed === 0, 'unexecuted TOP human review TOP count must be zero');
  invariant(!review.noBlackOrBlankFrames, 'unexecuted TOP human review cannot assert pixel quality');
  invariant(!review.noDevelopmentText, 'unexecuted TOP human review cannot assert development-text absence');
  invariant(!review.topCore5Readable, 'unexecuted TOP human review cannot assert Core5 readability');
  invariant(!review.cropSafeAcrossAllTargets, 'unexecuted TOP human review cannot assert crop safety');
  invariant(!review.loadingToTopContinuityPassed, 'unexecuted TOP human review cannot assert transition continuity');
  invariant(review.reviewerRole === '', 'unexecuted TOP human review must not retain reviewer role');
  invariant(review.reviewedAtUtc === '', 'unexecuted TOP human review must not retain timestamp');
  invariant(review.notes === '', 'unexecuted TOP human review must not retain notes');
  invariant(!review.humanVisualReviewComplete, 'unexecuted TOP human review cannot be complete');
  invariant(review.finalApprovalBlocked, 'unexecuted TOP human review must keep final approval blocked');
  console.log('TOP Living Night human visual review: honest NOT_RUN boundary');
  process.exit(0);
}

invariant(finalArt.candidateGenerated, 'executed TOP human review requires generated final Core5 candidate');
invariant(sha256.test(finalArt.candidateSha256), 'executed TOP human review requires valid final-art SHA-256');
invariant(review.candidateSha256 === finalArt.candidateSha256, 'TOP human review must target exact current final candidate bytes');
invariant(capture.executed && capture.result === 'PASSED', 'executed TOP human review requires PASSED runtime capture');
invariant(capture.expectedCaptureCount === 15, 'executed TOP human review requires 15 expected capture frames');
invariant(capture.captureCount === 15 && capture.captures.length === 15, 'executed TOP human review requires complete 15-frame capture pack');
invariant(/^[0-9a-f]{40}$/.test(capture.sourceCommit), 'executed TOP human review requires capture source commit');
invariant(capture.topCompositeKind === 'final-core5', 'executed TOP human review cannot use bridge capture evidence');
invariant(capture.topCompositePath === canonicalFinalPath, 'executed TOP human review requires canonical final TOP capture');
invariant(capture.topCompositeSha256 === finalArt.candidateSha256, 'executed TOP human review requires capture of exact current final TOP bytes');
invariant(review.captureSourceCommit === capture.sourceCommit, 'TOP human review must bind to exact capture source commit');
invariant(review.topCompositeKind === capture.topCompositeKind, 'TOP human review composite kind must match capture evidence');
invariant(review.topCompositePath === capture.topCompositePath, 'TOP human review composite path must match capture evidence');
invariant(review.topCompositeSha256 === capture.topCompositeSha256, 'TOP human review composite bytes must match capture evidence');
invariant(['PASSED', 'FAILED'].includes(review.result), 'executed TOP human review requires PASSED or FAILED');
invariant(review.reviewedFrameCount === 15, 'executed TOP human review must inspect all 15 frames');
invariant(review.loadingFramesReviewed === 12, 'executed TOP human review must inspect all 12 Loading frames');
invariant(review.topFramesReviewed === 3, 'executed TOP human review must inspect all 3 TOP frames');
invariant(review.reviewerRole.length > 0, 'executed TOP human review requires reviewer role');
invariant(review.reviewedAtUtc.length > 0, 'executed TOP human review requires timestamp');

if (review.result === 'PASSED') {
  invariant(review.noBlackOrBlankFrames, 'passed TOP human review requires no black/blank frames');
  invariant(review.noDevelopmentText, 'passed TOP human review requires no development text');
  invariant(review.topCore5Readable, 'passed TOP human review requires readable Core5 identities');
  invariant(review.cropSafeAcrossAllTargets, 'passed TOP human review requires crop safety at all three target sizes');
  invariant(review.loadingToTopContinuityPassed, 'passed TOP human review requires Loading to TOP continuity');
  invariant(review.humanVisualReviewComplete, 'passed TOP human review must set humanVisualReviewComplete');
  invariant(!review.finalApprovalBlocked, 'completed TOP human review cannot retain its internal block');
} else {
  invariant(!review.humanVisualReviewComplete, 'failed TOP human review cannot be complete');
  invariant(review.finalApprovalBlocked, 'failed TOP human review must keep final approval blocked');
}

if (finalArt.approvedAsFinal) {
  invariant(review.result === 'PASSED' && review.humanVisualReviewComplete, 'final TOP approval requires PASSED structured human visual review');
  invariant(review.candidateSha256 === finalArt.candidateSha256, 'final TOP approval cannot use stale human review evidence');
  invariant(!finalArt.finalApprovalBlocked, 'final TOP approval cannot remain blocked');
}

console.log('TOP Living Night human visual review contract: PASS');
console.log(`result=${review.result} frames=${review.reviewedFrameCount}/15 source=${review.topCompositeKind}`);
