import { createHash } from 'node:crypto';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const sourceRoot = process.cwd();
const tempRoot = mkdtempSync(join(tmpdir(), 'vamp-pon-final-registration-'));
const canonicalCandidatePath =
  'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';

const fixturePaths = [
  'scripts/unity/register-top-living-night-final-art.ts',
  'docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json',
  'docs/design-targets/generated/top-living-night-v3/final-art-status.json',
  'docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json',
  'docs/design-targets/generated/top-living-night-v3/crop-review-status.json',
  'docs/design-targets/generated/top-living-night-v3/motion-review-status.json',
  'docs/design-targets/generated/top-living-night-v3/human-visual-review-status.json',
  'docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json',
  'docs/design-targets/generated/top-living-night-v3/runtime-device-evidence.json',
  'docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json',
  'docs/design-targets/generated/loading-seasonal-v1/manifest.json',
] as const;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function readJson(relativePath: string): any {
  return JSON.parse(readFileSync(join(tempRoot, relativePath), 'utf8'));
}

function writeJson(relativePath: string, value: unknown): void {
  writeFileSync(join(tempRoot, relativePath), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function copyFixture(relativePath: string): void {
  const source = join(sourceRoot, relativePath);
  invariant(existsSync(source), `registration fixture source is missing: ${relativePath}`);
  const destination = join(tempRoot, relativePath);
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(source, destination);
}

function createSynthetic430x932Png(relativePath: string): Buffer {
  const bytes = Buffer.alloc(24, 0);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(bytes, 0);
  bytes.writeUInt32BE(13, 8);
  bytes.write('IHDR', 12, 4, 'ascii');
  bytes.writeUInt32BE(430, 16);
  bytes.writeUInt32BE(932, 20);
  const destination = join(tempRoot, relativePath);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, bytes);
  return bytes;
}

function runRegistration(): string {
  const result = spawnSync(
    process.execPath,
    [
      '--experimental-strip-types',
      'scripts/unity/register-top-living-night-final-art.ts',
    ],
    {
      cwd: tempRoot,
      encoding: 'utf8',
      env: process.env,
    },
  );
  invariant(
    result.status === 0,
    `final-art registration fixture failed:\nstdout=${result.stdout}\nstderr=${result.stderr}`,
  );
  return result.stdout;
}

function recomputeReferenceSetFingerprint(manifest: any): string {
  const payload = manifest.references
    .map((reference: any) => `${reference.id}\0${reference.path}\0${reference.gitBlobSha1}\n`)
    .join('');
  return createHash('sha256').update(payload, 'utf8').digest('hex');
}

try {
  for (const path of fixturePaths) copyFixture(path);
  const candidateBytes = createSynthetic430x932Png(canonicalCandidatePath);
  const candidateSha = createHash('sha256').update(candidateBytes).digest('hex');

  const firstOutput = runRegistration();
  invariant(firstOutput.includes('TOP final-art registration: REGISTERED'), 'first registration must mutate fixture state');

  const finalArt = readJson('docs/design-targets/generated/top-living-night-v3/final-art-status.json');
  const referenceManifest = readJson('docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json');
  const identity = readJson('docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json');
  const crop = readJson('docs/design-targets/generated/top-living-night-v3/crop-review-status.json');
  const motion = readJson('docs/design-targets/generated/top-living-night-v3/motion-review-status.json');
  const human = readJson('docs/design-targets/generated/top-living-night-v3/human-visual-review-status.json');
  const unity = readJson('docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json');
  const device = readJson('docs/design-targets/generated/top-living-night-v3/runtime-device-evidence.json');
  const capture = readJson('docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json');
  const loading = readJson('docs/design-targets/generated/loading-seasonal-v1/manifest.json');

  invariant(finalArt.candidateGenerated, 'registration must mark final candidate generated');
  invariant(finalArt.candidatePath === canonicalCandidatePath, 'registration must preserve canonical final path');
  invariant(finalArt.candidateSha256 === candidateSha, 'registration must bind exact candidate SHA-256');
  invariant(
    finalArt.candidateCore5ReferenceSetSha256 === referenceManifest.referenceSetSha256,
    'registration must bind current Core5 reference-set fingerprint',
  );
  invariant(!finalArt.core5IdentityReviewed, 'registration must reset final Core5 review flag');
  invariant(!finalArt.cropReviewComplete, 'registration must reset crop review flag');
  invariant(!finalArt.motionSeparationReviewed, 'registration must reset motion review flag');
  invariant(!finalArt.humanVisualReviewComplete, 'registration must reset human review flag');
  invariant(!finalArt.runtimeCaptureComplete, 'registration must reset runtime capture flag');
  invariant(!finalArt.runtimeApproved && !finalArt.approvedAsFinal, 'registration must not auto-approve runtime/final art');
  invariant(finalArt.finalApprovalBlocked, 'registration must keep final approval blocked');

  invariant(identity.candidateGenerated, 'registration must mark Core5 review candidate available');
  invariant(identity.sourceSha256 === candidateSha, 'Core5 review must bind candidate SHA after registration');
  invariant(identity.referenceSetSha256 === referenceManifest.referenceSetSha256, 'Core5 review must bind locked reference set');
  invariant(!identity.allIdentitiesApproved, 'registration must reset Core5 approval');
  invariant(identity.reviews.every((review: any) => !review.executed && review.result === 'NOT_RUN'), 'registration must reset all five identity reviews');

  invariant(crop.candidateGenerated && crop.sourceSha256 === candidateSha, 'registration must bind crop review to candidate SHA');
  invariant(!crop.allCropsApproved, 'registration must reset crop approval');
  invariant(crop.reviews.every((review: any) => !review.executed && review.result === 'NOT_RUN'), 'registration must reset all crop reviews');

  invariant(motion.candidateSha256 === '', 'registration must invalidate stale motion candidate SHA');
  invariant(!motion.normalMotion.executed && motion.normalMotion.result === 'NOT_RUN', 'registration must reset normal motion evidence');
  invariant(!motion.reducedMotion.executed && motion.reducedMotion.result === 'NOT_RUN', 'registration must reset Reduced Motion evidence');
  invariant(!motion.motionApproved && !motion.runtimeApproved, 'registration must reset motion approval');

  invariant(human.candidateGenerated, 'registration must expose final candidate to human review boundary');
  invariant(!human.executed && human.result === 'NOT_RUN', 'registration must reset structured human review');
  invariant(human.candidateSha256 === '', 'unexecuted human review must not retain stale candidate SHA');
  invariant(human.reviewedFrameCount === 0, 'registration must clear reviewed frame count');

  invariant(!unity.executed && unity.result === 'NOT_RUN', 'registration must invalidate V3 Unity evidence');
  invariant(unity.sourceCompositeKind === '' && unity.sourceCompositeSha256 === '', 'registration must clear V3 source provenance');
  invariant(!capture.executed && capture.result === 'NOT_RUN' && capture.captureCount === 0, 'registration must invalidate capture evidence');
  invariant(capture.topCompositeKind === '' && capture.topCompositeSha256 === '', 'registration must clear capture provenance');

  for (const [label, target] of [
    ['simulator', device.simulator],
    ['physical iPhone', device.physicalIphone],
  ] as const) {
    invariant(!target.executed && target.result === 'NOT_RUN', `${label}: registration must reset execution state`);
    invariant(target.topCompositeKind === '' && target.topCompositeSha256 === '', `${label}: registration must clear TOP provenance`);
    invariant(target.measurementMethod === '', `${label}: registration must clear measurement method`);
    invariant(target.metricsArtifactPath === '', `${label}: registration must clear metrics artifact path`);
    invariant(target.metricsArtifactSha256 === '', `${label}: registration must clear metrics artifact SHA`);
    invariant(target.averageFps === 0 && target.minimumFps === 0 && target.peakMemoryMb === 0, `${label}: registration must clear performance summary`);
    invariant(!target.framePacingIssueObserved && !target.memoryRegressionObserved, `${label}: registration must clear performance observations`);
  }
  invariant(!device.runtimeApproved && device.finalApprovalBlocked, 'registration must reset device runtime approval');
  invariant(!loading.approval.runtimeCaptureComplete, 'registration must reset Loading runtime capture approval');
  invariant(!loading.approval.humanVisualReviewComplete, 'registration must reset Loading human review approval');
  invariant(!loading.approval.runtimeApproved && !loading.approval.approvedAsFinal, 'registration must reset Loading runtime/final approval');

  // Verify true idempotence: same candidate + same reference set must not erase
  // review progress created after registration.
  identity.exactlyFiveForegroundHumans = true;
  identity.reviews[0].executed = true;
  identity.reviews[0].result = 'FAILED';
  writeJson('docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json', identity);
  const secondOutput = runRegistration();
  invariant(secondOutput.includes('already registered; no evidence reset performed'), 'same candidate/reference set must be a no-op');
  const identityAfterNoop = readJson('docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json');
  invariant(identityAfterNoop.exactlyFiveForegroundHumans, 'idempotent rerun must preserve downstream review progress');
  invariant(identityAfterNoop.reviews[0].executed && identityAfterNoop.reviews[0].result === 'FAILED', 'idempotent rerun must not erase review evidence');

  // Same image under a changed locked Core5 reference set is not the same
  // generation authority. Registration must invalidate downstream evidence.
  referenceManifest.references[0].gitBlobSha1 = '1111111111111111111111111111111111111111';
  referenceManifest.referenceSetSha256 = recomputeReferenceSetFingerprint(referenceManifest);
  writeJson('docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json', referenceManifest);
  const thirdOutput = runRegistration();
  invariant(thirdOutput.includes('TOP final-art registration: REGISTERED'), 'changed Core5 reference set must force re-registration');
  const finalAfterReferenceChange = readJson('docs/design-targets/generated/top-living-night-v3/final-art-status.json');
  const identityAfterReferenceChange = readJson('docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json');
  invariant(finalAfterReferenceChange.candidateSha256 === candidateSha, 'reference-set change must not alter candidate bytes');
  invariant(
    finalAfterReferenceChange.candidateCore5ReferenceSetSha256 === referenceManifest.referenceSetSha256,
    'reference-set change must bind the new generation authority fingerprint',
  );
  invariant(!identityAfterReferenceChange.exactlyFiveForegroundHumans, 'reference-set change must invalidate prior identity review progress');
  invariant(identityAfterReferenceChange.reviews.every((review: any) => !review.executed && review.result === 'NOT_RUN'), 'reference-set change must reset all identity reviews');

  console.log('TOP Living Night final-art registration behavior: PASS');
  console.log('new candidate: registers SHA + locked Core5 reference-set fingerprint and resets stale evidence');
  console.log('same candidate/reference-set: idempotent no-op preserves downstream review progress');
  console.log('same pixels/new reference-set: re-registers and invalidates stale identity/review authority');
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
