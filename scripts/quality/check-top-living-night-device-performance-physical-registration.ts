import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const registrarRelative = 'scripts/unity/register-top-living-night-device-performance.ts';
const canonicalFinalPath =
  'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';
const artifactRelative =
  'docs/design-targets/generated/top-living-night-v3/device-performance-evidence/physical-fixture.json';
const deviceEvidenceRelative =
  'docs/design-targets/generated/top-living-night-v3/runtime-device-evidence.json';
const finalArtRelative =
  'docs/design-targets/generated/top-living-night-v3/final-art-status.json';
const v3EvidenceRelative =
  'docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json';
const captureRelative =
  'docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json';

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function writeJson(base: string, relativePath: string, value: unknown): void {
  const path = join(base, relativePath);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function readJson(base: string, relativePath: string): any {
  return JSON.parse(readFileSync(join(base, relativePath), 'utf8'));
}

function blankTarget() {
  return {
    executed: false,
    result: 'NOT_RUN',
    deviceModel: '',
    osVersion: '',
    unityVersion: '',
    sourceCommit: '',
    topCompositeKind: '',
    topCompositePath: '',
    topCompositeSha256: '',
    measurementMethod: '',
    memoryMetric: '',
    metricsArtifactPath: '',
    metricsArtifactSha256: '',
    durationSeconds: 0,
    averageFps: 0,
    minimumFps: 0,
    peakMemoryMb: 0,
    framePacingIssueObserved: false,
    memoryRegressionObserved: false,
    backgroundForegroundRecoveryPassed: false,
    recordedAtUtc: '',
    notes: '',
  };
}

function makeSamples(thermalAt: (index: number) => string) {
  return Array.from({ length: 61 }, (_, index) => ({
    elapsedSeconds: index * 5,
    fps: 60,
    memoryMb: 128 + index * 0.05,
    thermalState: thermalAt(index),
  }));
}

function runRegistrar(fixtureRoot: string): ReturnType<typeof spawnSync> {
  return spawnSync(
    process.execPath,
    [
      '--experimental-strip-types',
      registrarRelative,
      '--target=physical-iphone',
      `--artifact=${artifactRelative}`,
      '--device-model=iPhone17,2',
      '--os-version=26.5',
      '--unity-version=6000.5.1f1',
    ],
    { cwd: fixtureRoot, encoding: 'utf8' },
  );
}

const fixtureRoot = mkdtempSync(join(tmpdir(), 'vamp-top-physical-perf-registration-'));
try {
  const registrarDestination = join(fixtureRoot, registrarRelative);
  mkdirSync(dirname(registrarDestination), { recursive: true });
  copyFileSync(join(root, registrarRelative), registrarDestination);

  const sourceCommit = '2'.repeat(40);
  const candidateSha256 = 'b'.repeat(64);

  writeJson(fixtureRoot, deviceEvidenceRelative, {
    schemaVersion: 1,
    performancePolicy: {
      targetFps: 60,
      passObservationSeconds: 300,
      memoryBudgetMode: 'regression-observation',
    },
    simulator: blankTarget(),
    physicalIphone: { ...blankTarget(), thermalState: '' },
    runtimeApproved: false,
    finalApprovalBlocked: true,
  });
  writeJson(fixtureRoot, finalArtRelative, {
    schemaVersion: 1,
    candidateGenerated: true,
    candidatePath: canonicalFinalPath,
    candidateSha256,
    approvedAsFinal: false,
    runtimeApproved: false,
    finalApprovalBlocked: true,
  });
  writeJson(fixtureRoot, v3EvidenceRelative, {
    executed: true,
    result: 'PASSED',
    verifiedCommit: sourceCommit,
    sourceCompositeKind: 'final-core5',
    sourceCompositePath: canonicalFinalPath,
    sourceCompositeSha256: candidateSha256,
  });
  writeJson(fixtureRoot, captureRelative, {
    executed: true,
    result: 'PASSED',
    sourceCommit,
    topCompositeKind: 'final-core5',
    topCompositePath: canonicalFinalPath,
    topCompositeSha256: candidateSha256,
    captureCount: 15,
  });

  const passArtifact = {
    schemaVersion: 1,
    target: 'physical-iphone',
    sourceCommit,
    topCompositeKind: 'final-core5',
    topCompositePath: canonicalFinalPath,
    topCompositeSha256: candidateSha256,
    measurementMethod: 'unity-runtime-sampler',
    sampleIntervalSeconds: 5,
    durationSeconds: 300,
    framePacingIssueObserved: false,
    memoryRegressionObserved: false,
    backgroundForegroundRecoveryPassed: true,
    samples: makeSamples(index => index >= 30 && index <= 40 ? 'fair' : 'nominal'),
  };
  writeJson(fixtureRoot, artifactRelative, passArtifact);

  const passRun = runRegistrar(fixtureRoot);
  invariant(passRun.status === 0, `physical performance PASS fixture failed:\n${passRun.stderr || passRun.stdout}`);
  const passEvidence = readJson(fixtureRoot, deviceEvidenceRelative);
  const passFinal = readJson(fixtureRoot, finalArtRelative);
  const passArtifactBytes = readFileSync(join(fixtureRoot, artifactRelative));
  const passArtifactSha = createHash('sha256').update(passArtifactBytes).digest('hex');
  invariant(passEvidence.physicalIphone.executed, 'physical PASS fixture must record executed evidence');
  invariant(passEvidence.physicalIphone.result === 'PASSED', 'nominal/fair physical fixture must PASS');
  invariant(passEvidence.physicalIphone.thermalState === 'fair', 'physical fixture must record worst thermal state');
  invariant(passEvidence.physicalIphone.memoryMetric === 'unity-total-allocated-memory', 'physical Unity sampler memory metric normalization failed');
  invariant(passEvidence.physicalIphone.metricsArtifactSha256 === passArtifactSha, 'physical raw artifact SHA mismatch');
  invariant(passEvidence.runtimeApproved === false, 'recording physical evidence must never auto-promote runtime approval');
  invariant(passFinal.runtimeApproved === false && passFinal.approvedAsFinal === false, 'physical registrar must never auto-promote final-art approval');

  const seriousArtifact = {
    ...passArtifact,
    samples: makeSamples(index => index === 45 ? 'serious' : 'nominal'),
  };
  writeJson(fixtureRoot, artifactRelative, seriousArtifact);
  const seriousRun = runRegistrar(fixtureRoot);
  invariant(seriousRun.status === 0, `physical serious-thermal fixture crashed:\n${seriousRun.stderr || seriousRun.stdout}`);
  const seriousEvidence = readJson(fixtureRoot, deviceEvidenceRelative);
  invariant(seriousEvidence.physicalIphone.result === 'FAILED', 'serious thermal state must force FAILED result');
  invariant(seriousEvidence.physicalIphone.thermalState === 'serious', 'serious thermal state must be preserved as worst thermal evidence');

  const missingThermalArtifact = {
    ...passArtifact,
    samples: passArtifact.samples.map((sample, index) =>
      index === 10
        ? { elapsedSeconds: sample.elapsedSeconds, fps: sample.fps, memoryMb: sample.memoryMb }
        : sample),
  };
  writeJson(fixtureRoot, artifactRelative, missingThermalArtifact);
  const missingThermalRun = runRegistrar(fixtureRoot);
  invariant(missingThermalRun.status !== 0, 'physical registrar must reject a sample with missing thermal state');
  const afterRejected = readJson(fixtureRoot, deviceEvidenceRelative);
  invariant(
    afterRejected.physicalIphone.result === 'FAILED' && afterRejected.physicalIphone.thermalState === 'serious',
    'rejected missing-thermal artifact must not overwrite the previous valid physical record',
  );

  console.log('TOP physical-iPhone device-performance registration fixtures: PASS');
  console.log('covered: Unity runtime sampler PASS / worst thermal recomputation / serious thermal FAIL / missing thermal rejection / no auto-promotion');
} finally {
  rmSync(fixtureRoot, { recursive: true, force: true });
}
