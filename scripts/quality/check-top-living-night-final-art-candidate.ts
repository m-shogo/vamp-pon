import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

type FinalArtStatus = {
  schemaVersion: number;
  candidateGenerated: boolean;
  candidatePath: string;
  expectedWidth: number;
  expectedHeight: number;
  core5ReferenceCount: number;
  core5IdentityReviewed: boolean;
  cropReviewComplete: boolean;
  motionSeparationReviewed: boolean;
  humanVisualReviewComplete: boolean;
  approvedAsFinal: boolean;
  runtimeCaptureComplete: boolean;
  runtimeApproved: boolean;
  finalApprovalBlocked: boolean;
  candidateSha256: string;
  reviewedAtUtc: string;
  notes: string;
};

const root = process.cwd();
const statusPath = join(
  root,
  'docs/design-targets/generated/top-living-night-v3/final-art-status.json',
);

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(existsSync(statusPath), 'TOP final-art status manifest is missing');
const status = JSON.parse(readFileSync(statusPath, 'utf8')) as FinalArtStatus;

invariant(status.schemaVersion === 1, 'TOP final-art status schema mismatch');
invariant(
  status.candidatePath ===
    'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png',
  'TOP final-art candidate path is not canonical',
);
invariant(status.expectedWidth === 430, 'TOP final-art expected width must be 430');
invariant(status.expectedHeight === 932, 'TOP final-art expected height must be 932');
invariant(status.core5ReferenceCount === 5, 'TOP final-art must require exactly five Core5 references');

const candidatePath = join(root, status.candidatePath);
if (!status.candidateGenerated) {
  invariant(!existsSync(candidatePath), 'TOP final-art PNG exists while candidateGenerated=false');
  invariant(status.candidateSha256 === '', 'uncreated TOP candidate must not have a SHA-256');
  invariant(!status.core5IdentityReviewed, 'uncreated TOP candidate cannot have identity review');
  invariant(!status.cropReviewComplete, 'uncreated TOP candidate cannot have crop review');
  invariant(!status.motionSeparationReviewed, 'uncreated TOP candidate cannot have motion review');
  invariant(!status.humanVisualReviewComplete, 'uncreated TOP candidate cannot have human visual review');
  invariant(!status.approvedAsFinal, 'uncreated TOP candidate cannot be final-approved');
  invariant(!status.runtimeCaptureComplete, 'uncreated TOP candidate cannot have runtime capture approval');
  invariant(!status.runtimeApproved, 'uncreated TOP candidate cannot be runtime-approved');
  invariant(status.finalApprovalBlocked, 'uncreated TOP candidate must keep final approval blocked');
  invariant(status.reviewedAtUtc === '', 'uncreated TOP candidate must not have a review timestamp');
  console.log('TOP Living Night final-art candidate: honest NOT_RUN boundary');
  console.log('expected: Core5-locked 430x932 final candidate at canonical path');
  process.exit(0);
}

invariant(existsSync(candidatePath), 'TOP final-art candidateGenerated=true but PNG is missing');
const png = readFileSync(candidatePath);
const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
invariant(png.subarray(0, 8).equals(signature), 'TOP final-art PNG signature mismatch');
invariant(png.subarray(12, 16).toString('ascii') === 'IHDR', 'TOP final-art IHDR missing');
invariant(png.readUInt32BE(16) === status.expectedWidth, 'TOP final-art PNG width mismatch');
invariant(png.readUInt32BE(20) === status.expectedHeight, 'TOP final-art PNG height mismatch');

const sha = createHash('sha256').update(png).digest('hex');
invariant(/^[0-9a-f]{64}$/.test(status.candidateSha256), 'TOP final-art SHA-256 is missing/invalid');
invariant(sha === status.candidateSha256, 'TOP final-art SHA-256 mismatch');

if (status.approvedAsFinal) {
  invariant(status.core5IdentityReviewed, 'final-approved TOP requires Core5 identity review');
  invariant(status.cropReviewComplete, 'final-approved TOP requires 3-crop review');
  invariant(status.motionSeparationReviewed, 'final-approved TOP requires motion-separation review');
  invariant(status.humanVisualReviewComplete, 'final-approved TOP requires human visual review');
  invariant(status.runtimeCaptureComplete, 'final-approved TOP requires runtime capture');
  invariant(status.runtimeApproved, 'final-approved TOP requires runtime approval');
  invariant(!status.finalApprovalBlocked, 'final-approved TOP cannot remain blocked');
  invariant(status.reviewedAtUtc.length > 0, 'final-approved TOP requires review timestamp');
} else {
  invariant(status.finalApprovalBlocked, 'non-final TOP candidate must keep final approval blocked');
  invariant(!status.runtimeApproved, 'non-final TOP candidate cannot be runtime-approved');
}

console.log('TOP Living Night final-art candidate contract: PASS');
console.log(`candidate: ${status.candidatePath}`);
console.log(`sha256: ${sha}`);
console.log(`approvedAsFinal: ${status.approvedAsFinal}`);
