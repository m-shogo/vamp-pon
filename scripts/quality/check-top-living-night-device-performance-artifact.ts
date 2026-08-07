import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

type TargetSummary = {
  executed: boolean;
  result: string;
  sourceCommit: string;
  topCompositeKind: string;
  topCompositePath: string;
  topCompositeSha256: string;
  measurementMethod: string;
  metricsArtifactPath: string;
  metricsArtifactSha256: string;
  durationSeconds: number;
  averageFps: number;
  minimumFps: number;
  peakMemoryMb: number;
  framePacingIssueObserved: boolean;
  memoryRegressionObserved: boolean;
  backgroundForegroundRecoveryPassed: boolean;
  thermalState?: string;
};

type DeviceEvidence = {
  schemaVersion: number;
  simulator: TargetSummary;
  physicalIphone: TargetSummary;
};

type PerformanceSample = {
  elapsedSeconds: number;
  fps: number;
  memoryMb: number;
  thermalState?: string;
};

type PerformanceArtifact = {
  schemaVersion: number;
  target: string;
  sourceCommit: string;
  topCompositeKind: string;
  topCompositePath: string;
  topCompositeSha256: string;
  measurementMethod: string;
  sampleIntervalSeconds: number;
  durationSeconds: number;
  framePacingIssueObserved: boolean;
  memoryRegressionObserved: boolean;
  backgroundForegroundRecoveryPassed: boolean;
  samples: PerformanceSample[];
};

const root = process.cwd();
const evidence = JSON.parse(
  readFileSync(
    join(root, 'docs/design-targets/generated/top-living-night-v3/runtime-device-evidence.json'),
    'utf8',
  ),
) as DeviceEvidence;

const artifactRoot =
  'docs/design-targets/generated/top-living-night-v3/device-performance-evidence/';
const sha256Pattern = /^[0-9a-f]{64}$/;
const allowedMethods = new Set([
  'unity-profiler-recorder',
  'unity-runtime-sampler',
  'xcode-instruments',
]);
const thermalRank = new Map([
  ['nominal', 0],
  ['fair', 1],
  ['serious', 2],
  ['critical', 3],
]);

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function nearlyEqual(actual: number, expected: number, tolerance: number): boolean {
  return Math.abs(actual - expected) <= tolerance;
}

function verifyTarget(
  label: string,
  artifactTarget: 'simulator' | 'physical-iphone',
  target: TargetSummary,
): void {
  if (!target.executed) {
    invariant(target.measurementMethod === '', `${label}: NOT_RUN must not retain measurement method`);
    invariant(target.metricsArtifactPath === '', `${label}: NOT_RUN must not retain metrics artifact path`);
    invariant(target.metricsArtifactSha256 === '', `${label}: NOT_RUN must not retain metrics artifact SHA-256`);
    return;
  }

  invariant(
    allowedMethods.has(target.measurementMethod),
    `${label}: executed evidence requires an approved measurement method`,
  );
  invariant(
    target.metricsArtifactPath.startsWith(artifactRoot) && target.metricsArtifactPath.endsWith('.json'),
    `${label}: metrics artifact must be a JSON file under ${artifactRoot}`,
  );
  invariant(
    sha256Pattern.test(target.metricsArtifactSha256),
    `${label}: executed evidence requires metrics artifact SHA-256`,
  );

  const absoluteArtifactPath = join(root, target.metricsArtifactPath);
  invariant(existsSync(absoluteArtifactPath), `${label}: metrics artifact is missing`);
  const artifactBytes = readFileSync(absoluteArtifactPath);
  const actualArtifactSha = createHash('sha256').update(artifactBytes).digest('hex');
  invariant(
    actualArtifactSha === target.metricsArtifactSha256,
    `${label}: metrics artifact SHA-256 mismatch`,
  );

  const artifact = JSON.parse(artifactBytes.toString('utf8')) as PerformanceArtifact;
  invariant(artifact.schemaVersion === 1, `${label}: metrics artifact schema mismatch`);
  invariant(artifact.target === artifactTarget, `${label}: metrics artifact target mismatch`);
  invariant(artifact.sourceCommit === target.sourceCommit, `${label}: metrics artifact source commit mismatch`);
  invariant(artifact.topCompositeKind === target.topCompositeKind, `${label}: metrics artifact composite kind mismatch`);
  invariant(artifact.topCompositePath === target.topCompositePath, `${label}: metrics artifact composite path mismatch`);
  invariant(artifact.topCompositeSha256 === target.topCompositeSha256, `${label}: metrics artifact composite SHA mismatch`);
  invariant(artifact.measurementMethod === target.measurementMethod, `${label}: metrics artifact measurement method mismatch`);
  invariant(
    artifact.sampleIntervalSeconds > 0 && artifact.sampleIntervalSeconds <= 5,
    `${label}: performance samples must be recorded at least every five seconds`,
  );
  invariant(artifact.durationSeconds >= 60, `${label}: metrics artifact must cover at least 60 seconds`);
  invariant(
    nearlyEqual(artifact.durationSeconds, target.durationSeconds, 0.01),
    `${label}: summary duration does not match raw metrics artifact`,
  );
  invariant(
    artifact.framePacingIssueObserved === target.framePacingIssueObserved,
    `${label}: frame-pacing observation diverged from metrics artifact`,
  );
  invariant(
    artifact.memoryRegressionObserved === target.memoryRegressionObserved,
    `${label}: memory-regression observation diverged from metrics artifact`,
  );
  invariant(
    artifact.backgroundForegroundRecoveryPassed === target.backgroundForegroundRecoveryPassed,
    `${label}: background/foreground observation diverged from metrics artifact`,
  );

  const minimumSampleCount = Math.floor(artifact.durationSeconds / 5) + 1;
  invariant(
    artifact.samples.length >= minimumSampleCount,
    `${label}: metrics artifact has too few raw samples for its duration`,
  );

  let previousElapsed = -1;
  let fpsSum = 0;
  let minimumFps = Number.POSITIVE_INFINITY;
  let peakMemoryMb = 0;
  let worstThermal = 'nominal';

  for (const [index, sample] of artifact.samples.entries()) {
    invariant(Number.isFinite(sample.elapsedSeconds), `${label}: sample ${index} elapsedSeconds is invalid`);
    invariant(sample.elapsedSeconds >= 0, `${label}: sample ${index} elapsedSeconds must be non-negative`);
    invariant(sample.elapsedSeconds > previousElapsed, `${label}: sample timestamps must be strictly increasing`);
    invariant(Number.isFinite(sample.fps) && sample.fps > 0 && sample.fps <= 240, `${label}: sample ${index} FPS is invalid`);
    invariant(Number.isFinite(sample.memoryMb) && sample.memoryMb > 0, `${label}: sample ${index} memory is invalid`);

    if (artifactTarget === 'physical-iphone') {
      invariant(
        typeof sample.thermalState === 'string' && thermalRank.has(sample.thermalState),
        `${label}: sample ${index} requires a known thermal state`,
      );
      if ((thermalRank.get(sample.thermalState!) ?? 0) > (thermalRank.get(worstThermal) ?? 0)) {
        worstThermal = sample.thermalState!;
      }
    } else {
      invariant(
        sample.thermalState === undefined || sample.thermalState === '',
        `${label}: Simulator samples must not assert physical thermal state`,
      );
    }

    previousElapsed = sample.elapsedSeconds;
    fpsSum += sample.fps;
    minimumFps = Math.min(minimumFps, sample.fps);
    peakMemoryMb = Math.max(peakMemoryMb, sample.memoryMb);
  }

  invariant(
    previousElapsed >= artifact.durationSeconds - artifact.sampleIntervalSeconds * 1.5,
    `${label}: last sample does not cover the declared observation duration`,
  );

  const averageFps = fpsSum / artifact.samples.length;
  invariant(
    nearlyEqual(target.averageFps, averageFps, 0.05),
    `${label}: summary average FPS must be recomputed from raw samples`,
  );
  invariant(
    nearlyEqual(target.minimumFps, minimumFps, 0.05),
    `${label}: summary minimum FPS must match raw samples`,
  );
  invariant(
    nearlyEqual(target.peakMemoryMb, peakMemoryMb, 0.05),
    `${label}: summary peak memory must match raw samples`,
  );

  if (artifactTarget === 'physical-iphone') {
    invariant(
      target.thermalState === worstThermal,
      `${label}: summary thermal state must equal the worst raw-sample thermal state`,
    );
  }
}

invariant(evidence.schemaVersion === 1, 'TOP device evidence schema mismatch');
verifyTarget('Simulator', 'simulator', evidence.simulator);
verifyTarget('physical iPhone', 'physical-iphone', evidence.physicalIphone);

console.log('TOP Living Night raw device-performance artifact contract: PASS');
console.log(
  `sim=${evidence.simulator.executed ? evidence.simulator.metricsArtifactPath : 'NOT_RUN'} ` +
    `iphone=${evidence.physicalIphone.executed ? evidence.physicalIphone.metricsArtifactPath : 'NOT_RUN'}`,
);
