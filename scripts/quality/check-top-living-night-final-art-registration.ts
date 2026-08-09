import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const registrarRelative = 'scripts/unity/register-top-living-night-final-art.ts';
const canonicalCandidatePath =
  'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';
const real430x932Fixture =
  'docs/design-targets/generated/top-living-night-v2/previews/top-living-night-layered-candidate-430x932.png';
const paths = {
  core5Reference: 'docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json',
  finalArt: 'docs/design-targets/generated/top-living-night-v3/final-art-status.json',
  identity: 'docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json',
  crop: 'docs/design-targets/generated/top-living-night-v3/crop-review-status.json',
  motion: 'docs/design-targets/generated/top-living-night-v3/motion-review-status.json',
  humanReview: 'docs/design-targets/generated/top-living-night-v3/human-visual-review-status.json',
  unity: 'docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json',
  device: 'docs/design-targets/generated/top-living-night-v3/runtime-device-evidence.json',
  capture: 'docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json',
  loadingManifest: 'docs/design-targets/generated/loading-seasonal-v1/manifest.json',
} as const;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function copy(relativePath: string, fixture: string): void {
  const target = join(fixture, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  cpSync(join(root, relativePath), target);
}

function readJson(fixture: string, relativePath: string): any {
  return JSON.parse(readFileSync(join(fixture, relativePath), 'utf8'));
}

function writeJson(fixture: string, relativePath: string, value: unknown): void {
  const target = join(fixture, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function referenceSetDigest(references: Array<{ id: string; path: string; gitBlobSha1: string }>): string {
  const payload = references
    .map(reference => `${reference.id}\0${reference.path}\0${reference.gitBlobSha1}\n`)
    .join('');
  return createHash('sha256').update(payload, 'utf8').digest('hex');
}

function runRegistrar(fixture: string): ReturnType<typeof spawnSync> {
  return spawnSync(process.execPath, ['--experimental-strip-types', registrarRelative], {
    cwd: fixture,
    encoding: 'utf8',
  });
}

const fixture = mkdtempSync(join(tmpdir(), 'vamp-top-final-registration-'));
try {
  copy(registrarRelative, fixture);
  for (const relativePath of Object.values(paths)) copy(relativePath, fixture);
  const candidateTarget = join(fixture, canonicalCandidatePath);
  mkdirSync(dirname(candidateTarget), { recursive: true });
  cpSync(join(root, real430x932Fixture), candidateTarget);
  const candidateSha = createHash('sha256').update(readFileSync(candidateTarget)).digest('hex');

  const finalArt = readJson(fixture, paths.finalArt);
  finalArt.candidateGenerated = false;
  finalArt.candidateSha256 = '';
  finalArt.candidateCore5ReferenceSetSha256 = '';
  finalArt.core5IdentityReviewed = true;
  finalArt.cropReviewComplete = true;
  finalArt.motionSeparationReviewed = true;
  finalArt.humanVisualReviewComplete = true;
  finalArt.runtimeCaptureComplete = true;
  finalArt.runtimeApproved = true;
  finalArt.approvedAsFinal = true;
  finalArt.finalApprovalBlocked = false;
  finalArt.reviewedAtUtc = '2026-01-01T00:00:00Z';
  writeJson(fixture, paths.finalArt, finalArt);

  const identity = readJson(fixture, paths.identity);
  identity.allIdentitiesApproved = true;
  identity.finalApprovalBlocked = false;
  identity.reviewedAtUtc = '2026-01-01T00:00:00Z';
  writeJson(fixture, paths.identity, identity);

  const crop = readJson(fixture, paths.crop);
  crop.allCropsApproved = true;
  crop.finalApprovalBlocked = false;
  crop.reviewedAtUtc = '2026-01-01T00:00:00Z';
  writeJson(fixture, paths.crop, crop);

  const motion = readJson(fixture, paths.motion);
  motion.candidateSha256 = 'a'.repeat(64);
  motion.normalMotion.executed = true;
  motion.normalMotion.result = 'PASSED';
  motion.normalMotion.reviewDurationSeconds = 300;
  motion.reducedMotion.executed = true;
  motion.reducedMotion.result = 'PASSED';
  motion.reducedMotion.reviewDurationSeconds = 60;
  motion.reducedMotion.cloudMovementStopped = true;
  motion.reducedMotion.particlesSuppressed = true;
  motion.reducedMotion.rareRobotEyeSuppressed = true;
  motion.reducedMotion.fireRemainsRestrained = true;
  motion.reducedMotion.uiFunctional = true;
  motion.reducedMotion.liveToggleToReducedSettled = true;
  motion.reducedMotion.liveToggleBackToNormalSettled = true;
  motion.reducedMotion.noToggleVisualPopOrDuplication = true;
  motion.motionApproved = true;
  motion.runtimeApproved = true;
  motion.finalApprovalBlocked = false;
  motion.reviewedAtUtc = '2026-01-01T00:00:00Z';
  writeJson(fixture, paths.motion, motion);

  const unity = readJson(fixture, paths.unity);
  Object.assign(unity, {
    executed: true,
    result: 'PASSED',
    verifiedCommit: 'f'.repeat(40),
    unityVersion: '6000.5.1f1',
    controllerResolved: true,
    ambientMotionDirectorResolved: true,
    fireCadenceDirectorResolved: true,
    shaderResolved: true,
    buildHookResolved: true,
    buildImportPolicyPassed: true,
    sourceCompositeKind: 'bridge',
    sourceCompositePath: real430x932Fixture,
    sourceCompositeSha256: 'b'.repeat(64),
    generatedAtUtc: '2026-01-01T00:00:00Z',
  });
  writeJson(fixture, paths.unity, unity);

  const capture = readJson(fixture, paths.capture);
  Object.assign(capture, {
    executed: true,
    result: 'PASSED',
    sourceCommit: 'f'.repeat(40),
    topCompositeKind: 'bridge',
    topCompositePath: real430x932Fixture,
    topCompositeSha256: 'b'.repeat(64),
    expectedCaptureCount: 15,
    captureCount: 15,
    generatedAtUtc: '2026-01-01T00:00:00Z',
    captures: Array.from({ length: 15 }, (_, index) => ({ id: `stale-${index}` })),
  });
  writeJson(fixture, paths.capture, capture);

  const device = readJson(fixture, paths.device);
  for (const target of [device.simulator, device.physicalIphone]) {
    target.executed = true;
    target.result = 'PASSED';
    target.measurementMethod = 'stale-method';
    target.memoryMetric = 'stale-memory';
    target.metricsArtifactPath = 'stale.json';
    target.metricsArtifactSha256 = 'c'.repeat(64);
    target.durationSeconds = 300;
    target.averageFps = 60;
    target.minimumFps = 55;
    target.peakMemoryMb = 180;
    target.backgroundForegroundRecoveryPassed = true;
  }
  if ('thermalState' in device.physicalIphone) device.physicalIphone.thermalState = 'nominal';
  device.runtimeApproved = true;
  device.finalApprovalBlocked = false;
  writeJson(fixture, paths.device, device);

  const loading = readJson(fixture, paths.loadingManifest);
  loading.approval.runtimeCaptureComplete = true;
  loading.approval.humanVisualReviewComplete = true;
  loading.approval.runtimeApproved = true;
  loading.approval.approvedAsFinal = true;
  loading.approval.finalApprovalBlocked = false;
  writeJson(fixture, paths.loadingManifest, loading);

  const firstRun = runRegistrar(fixture);
  invariant(firstRun.status === 0, `final-art registration fixture failed:\n${firstRun.stdout}\n${firstRun.stderr}`);
  invariant(firstRun.stdout.includes('TOP final-art registration: REGISTERED'), 'first registration did not report REGISTERED');

  const finalAfter = readJson(fixture, paths.finalArt);
  const identityAfter = readJson(fixture, paths.identity);
  const cropAfter = readJson(fixture, paths.crop);
  const motionAfter = readJson(fixture, paths.motion);
  const unityAfter = readJson(fixture, paths.unity);
  const captureAfter = readJson(fixture, paths.capture);
  const deviceAfter = readJson(fixture, paths.device);
  const loadingAfter = readJson(fixture, paths.loadingManifest);

  invariant(finalAfter.candidateGenerated && finalAfter.candidateSha256 === candidateSha, 'registered candidate SHA mismatch');
  invariant(/^[0-9a-f]{64}$/.test(finalAfter.candidateCore5ReferenceSetSha256), 'candidate must bind Core5 reference set');
  invariant(!finalAfter.runtimeApproved && !finalAfter.approvedAsFinal && finalAfter.finalApprovalBlocked, 'registration must block final/runtime approval');
  invariant(identityAfter.sourceSha256 === candidateSha && !identityAfter.allIdentitiesApproved, 'identity evidence was not reset/rebound');
  invariant(cropAfter.sourceSha256 === candidateSha && !cropAfter.allCropsApproved, 'crop evidence was not reset/rebound');
  invariant(!motionAfter.motionApproved && motionAfter.candidateSha256 === '', 'motion evidence was not reset');
  invariant(
    !motionAfter.reducedMotion.liveToggleToReducedSettled &&
      !motionAfter.reducedMotion.liveToggleBackToNormalSettled &&
      !motionAfter.reducedMotion.noToggleVisualPopOrDuplication,
    'live Reduced Motion toggle evidence survived candidate registration',
  );
  invariant(!unityAfter.executed && unityAfter.result === 'NOT_RUN', 'Unity evidence was not reset');
  invariant(!unityAfter.ambientMotionDirectorResolved && !unityAfter.fireCadenceDirectorResolved, 'Unity motion-director evidence survived reset');
  invariant(!captureAfter.executed && captureAfter.captureCount === 0, 'capture evidence was not reset');
  invariant(!deviceAfter.simulator.executed && deviceAfter.simulator.memoryMetric === '', 'Simulator evidence was not reset');
  invariant(!deviceAfter.physicalIphone.executed && deviceAfter.physicalIphone.thermalState === '', 'physical-iPhone evidence was not reset');
  invariant(!deviceAfter.runtimeApproved && deviceAfter.finalApprovalBlocked, 'device approval was not reset');
  invariant(!loadingAfter.approval.runtimeApproved && loadingAfter.approval.finalApprovalBlocked, 'Loading approval mirror was not reset');

  identityAfter.notes = 'NOOP_SENTINEL';
  writeJson(fixture, paths.identity, identityAfter);
  const noOpRun = runRegistrar(fixture);
  invariant(noOpRun.status === 0 && noOpRun.stdout.includes('already registered; no evidence reset performed'), 'same candidate registration must be idempotent');
  invariant(readJson(fixture, paths.identity).notes === 'NOOP_SENTINEL', 'idempotent registration mutated evidence');

  const core5 = readJson(fixture, paths.core5Reference);
  core5.references[0].gitBlobSha1 = '9'.repeat(40);
  core5.referenceSetSha256 = referenceSetDigest(core5.references);
  writeJson(fixture, paths.core5Reference, core5);
  const staleIdentity = readJson(fixture, paths.identity);
  staleIdentity.allIdentitiesApproved = true;
  staleIdentity.reviewedAtUtc = '2026-01-02T00:00:00Z';
  staleIdentity.notes = 'STALE_APPROVAL';
  writeJson(fixture, paths.identity, staleIdentity);

  const rebindRun = runRegistrar(fixture);
  invariant(rebindRun.status === 0 && rebindRun.stdout.includes('TOP final-art registration: REGISTERED'), 'Core5 reference-set change did not force re-registration');
  const finalRebound = readJson(fixture, paths.finalArt);
  const identityRebound = readJson(fixture, paths.identity);
  invariant(finalRebound.candidateSha256 === candidateSha, 'Core5 rebind must retain exact candidate bytes');
  invariant(finalRebound.candidateCore5ReferenceSetSha256 === core5.referenceSetSha256, 'Core5 rebind fingerprint mismatch');
  invariant(identityRebound.referenceSetSha256 === core5.referenceSetSha256, 'identity evidence did not rebind Core5 fingerprint');
  invariant(!identityRebound.allIdentitiesApproved && identityRebound.reviewedAtUtc === '', 'Core5 change did not invalidate stale identity approval');

  console.log('TOP final-art registration mutation fixtures: PASS');
  console.log('real 430x932 PNG: registration / stale evidence reset / live-toggle+motion-director reset / idempotence / Core5 reference-set invalidation');
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
