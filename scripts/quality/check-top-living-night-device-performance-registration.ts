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
  'docs/design-targets/generated/top-living-night-v3/device-performance-evidence/simulator-fixture.json';
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

function makeSamples(fps: number, memoryAt: (index: number) => number) {
  return Array.from({ length: 61 }, (_, index) => ({
    elapsedSeconds: index * 5,
    fps,
    memoryMb: memoryAt(index),
  }));
}

function runRegistrar(fixtureRoot: string): ReturnType<typeof spawnSync> {
  return spawnSync(
    process.execPath,
    [
      '--experimental-strip-types',
      registrarRelative,
      '--target=simulator',
      `--artifact=${artifactRelative}`,
      '--device-model=Fixture iPhone Simulator',
      '--os-version=18.7',
      '--unity-version=6000.5.1f1',
    ],
    { cwd: fixtureRoot, encoding: 'utf8' },
  );
}

const fixtureRoot = mkdtempSync(join(tmpdir(), 'vamp-top-perf-registration-'));
try {
  const registrarDestination = join(fixtureRoot, registrarRelative);
  mkdirSync(dirname(registrarDestination), { recursive: true });
  copyFileSync(join(root, registrarRelative), registrarDestination);

  const sourceCommit = '1'.repeat(40);
  const candidateSha256 = 'a'.repeat(64);

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
    target: 'simulator',
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
    samples: makeSamples(60, index => 100 + index * 0.1),
  };
  writeJson(fixtureRoot, artifactRelative, passArtifact);

  const passRun = runRegistrar(fixtureRoot);
  invariant(passRun.status === 0, `performance registrar PASS fixture failed:\n${passRun.stderr || passRun.stdout}`);
  const passEvidence = readJson(fixtureRoot, deviceEvidenceRelative);
  const passFinal = readJson(fixtureRoot, finalArtRelative);
  const passArtifactBytes = readFileSync(join(fixtureRoot, artifactRelative));
  const passArtifactSha = createHash('sha256').update(passArtifactBytes).digest('hex');
  invariant(passEvidence.simulator.executed, 'PASS fixture must record Simulator evidence');
  invariant(passEvidence.simulator.result === 'PASSED', 'PASS fixture must produce PASSED result');
  invariant(passEvidence.simulator.averageFps === 60, 'PASS fixture average FPS must be recomputed from samples');
  invariant(passEvidence.simulator.minimumFps === 60, 'PASS fixture minimum FPS must be recomputed from samples');
  invariant(passEvidence.simulator.peakMemoryMb === 106, 'PASS fixture peak memory must be recomputed from samples');
  invariant(passEvidence.simulator.memoryRegressionObserved === false, 'PASS fixture must recompute no memory regression');
  invariant(passEvidence.simulator.memoryMetric === 'unity-total-allocated-memory', 'PASS fixture memory metric normalization failed');
  invariant(passEvidence.simulator.metricsArtifactSha256 === passArtifactSha, 'PASS fixture raw artifact SHA mismatch');
  invariant(passEvidence.runtimeApproved === false, 'recording Simulator evidence must never auto-promote runtime approval');
  invariant(passFinal.runtimeApproved === false && passFinal.approvedAsFinal === false, 'registrar must never auto-promote final-art approval');

  const failArtifact = {
    ...passArtifact,
    memoryRegressionObserved: true,
    samples: makeSamples(60, index => 100 + index),
  };
  writeJson(fixtureRoot, artifactRelative, failArtifact);
  const failRun = runRegistrar(fixtureRoot);
  invariant(failRun.status === 0, `performance registrar FAILED-result fixture crashed:\n${failRun.stderr || failRun.stdout}`);
  const failEvidence = readJson(fixtureRoot, deviceEvidenceRelative);
  invariant(failEvidence.simulator.executed, 'FAILED fixture must still record executed evidence');
  invariant(failEvidence.simulator.result === 'FAILED', 'raw memory regression must force FAILED result');
  invariant(failEvidence.simulator.memoryRegressionObserved === true, 'FAILED fixture must record recomputed memory regression');
  invariant(failEvidence.runtimeApproved === false, 'FAILED evidence must remain runtime-unapproved');

  const dishonestArtifact = {
    ...failArtifact,
    memoryRegressionObserved: false,
  };
  writeJson(fixtureRoot, artifactRelative, dishonestArtifact);
  const dishonestRun = runRegistrar(fixtureRoot);
  invariant(dishonestRun.status !== 0, 'registrar must reject raw memory trend / boolean disagreement');
  const afterDishonestEvidence = readJson(fixtureRoot, deviceEvidenceRelative);
  invariant(
    afterDishonestEvidence.simulator.result === 'FAILED' &&
      afterDishonestEvidence.simulator.memoryRegressionObserved === true,
    'rejected dishonest artifact must not overwrite the previous valid evidence record',
  );

  console.log('TOP device-performance registration mutation fixtures: PASS');
  console.log('covered: raw PASS registration / memory-regression FAILED registration / dishonest flag rejection / no auto-promotion');
} finally {
  rmSync(fixtureRoot, { recursive: true, force: true });
}
