import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { isAbsolute, join, normalize, relative } from 'node:path';

const root = process.cwd();
const dryRun = process.argv.includes('--dry-run');
const artifactRoot =
  'docs/design-targets/generated/top-living-night-v3/device-performance-evidence/';
const deviceEvidencePath =
  'docs/design-targets/generated/top-living-night-v3/runtime-device-evidence.json';
const finalArtPath =
  'docs/design-targets/generated/top-living-night-v3/final-art-status.json';
const v3EvidencePath =
  'docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json';
const captureEvidencePath =
  'docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json';

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
const memoryRegressionAbsoluteMb = 32;
const memoryRegressionFraction = .20;

type TargetName = 'simulator' | 'physical-iphone';
type Sample = {
  elapsedSeconds: number;
  fps: number;
  memoryMb: number;
  thermalState?: string;
};
type PerformanceArtifact = {
  schemaVersion: number;
  target: TargetName;
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
  samples: Sample[];
};

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function arg(name: string): string {
  const prefix = `--${name}=`;
  const value = process.argv.find(item => item.startsWith(prefix));
  return value ? value.slice(prefix.length) : '';
}

function readJson(path: string): any {
  return JSON.parse(readFileSync(join(root, path), 'utf8'));
}

function writeJson(path: string, value: unknown): void {
  writeFileSync(join(root, path), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function canonicalRepoPath(input: string): string {
  const absolute = isAbsolute(input) ? normalize(input) : join(root, normalize(input));
  const repoRelative = relative(root, absolute).replaceAll('\\', '/');
  invariant(!repoRelative.startsWith('../') && repoRelative !== '..', 'metrics artifact must stay inside the repository');
  invariant(
    repoRelative.startsWith(artifactRoot) && repoRelative.endsWith('.json'),
    `metrics artifact must be a JSON file under ${artifactRoot}`,
  );
  return repoRelative;
}

function memoryMetricForMethod(method: string): string {
  if (method === 'xcode-instruments') return 'physical-footprint';
  if (method === 'unity-profiler-recorder' || method === 'unity-runtime-sampler')
    return 'unity-total-allocated-memory';
  throw new Error(`unsupported performance measurement method: ${method}`);
}

function computeMemoryRegression(samples: Sample[]): boolean {
  invariant(samples.length >= 12, 'memory-regression recomputation requires at least 12 samples');
  const window = Math.max(3, Math.floor(samples.length / 10));
  let earlySum = 0;
  let lateSum = 0;
  for (let index = 0; index < window; index += 1) {
    earlySum += samples[index].memoryMb;
    lateSum += samples[samples.length - 1 - index].memoryMb;
  }
  const earlyAverage = earlySum / window;
  const lateAverage = lateSum / window;
  const threshold = Math.max(memoryRegressionAbsoluteMb, earlyAverage * memoryRegressionFraction);
  return lateAverage - earlyAverage > threshold;
}

function summarize(target: TargetName, artifact: PerformanceArtifact) {
  invariant(artifact.schemaVersion === 1, 'performance artifact schema mismatch');
  invariant(artifact.target === target, 'performance artifact target mismatch');
  invariant(/^[0-9a-f]{40}$/.test(artifact.sourceCommit), 'performance artifact source commit is invalid');
  invariant(['bridge', 'final-core5'].includes(artifact.topCompositeKind), 'performance artifact composite kind is invalid');
  invariant(artifact.topCompositePath.length > 0, 'performance artifact composite path is missing');
  invariant(/^[0-9a-f]{64}$/.test(artifact.topCompositeSha256), 'performance artifact composite SHA-256 is invalid');
  invariant(allowedMethods.has(artifact.measurementMethod), 'performance artifact measurement method is not approved');
  invariant(
    artifact.sampleIntervalSeconds > 0 && artifact.sampleIntervalSeconds <= 5,
    'performance artifact sample interval must be >0 and <=5 seconds',
  );
  invariant(artifact.durationSeconds >= 60, 'performance artifact must cover at least 60 seconds');
  invariant(Array.isArray(artifact.samples) && artifact.samples.length > 0, 'performance artifact requires raw samples');

  const minimumSampleCount = Math.floor(artifact.durationSeconds / 5) + 1;
  invariant(artifact.samples.length >= minimumSampleCount, 'performance artifact has too few samples');

  let previousElapsed = -1;
  let fpsSum = 0;
  let minimumFps = Number.POSITIVE_INFINITY;
  let peakMemoryMb = 0;
  let worstThermal = '';

  for (const [index, sample] of artifact.samples.entries()) {
    invariant(Number.isFinite(sample.elapsedSeconds) && sample.elapsedSeconds >= 0, `sample ${index}: invalid elapsedSeconds`);
    invariant(sample.elapsedSeconds > previousElapsed, `sample ${index}: timestamps must increase strictly`);
    invariant(Number.isFinite(sample.fps) && sample.fps > 0 && sample.fps <= 240, `sample ${index}: invalid FPS`);
    invariant(Number.isFinite(sample.memoryMb) && sample.memoryMb > 0, `sample ${index}: invalid memory`);

    if (target === 'physical-iphone') {
      invariant(typeof sample.thermalState === 'string' && thermalRank.has(sample.thermalState), `sample ${index}: physical iPhone requires thermal state`);
      if (worstThermal === '' || (thermalRank.get(sample.thermalState!) ?? 0) > (thermalRank.get(worstThermal) ?? 0)) {
        worstThermal = sample.thermalState!;
      }
    } else {
      invariant(sample.thermalState === undefined || sample.thermalState === '', `sample ${index}: Simulator must not assert thermal state`);
    }

    previousElapsed = sample.elapsedSeconds;
    fpsSum += sample.fps;
    minimumFps = Math.min(minimumFps, sample.fps);
    peakMemoryMb = Math.max(peakMemoryMb, sample.memoryMb);
  }

  invariant(
    previousElapsed >= artifact.durationSeconds - artifact.sampleIntervalSeconds * 1.5,
    'performance artifact last sample does not cover declared duration',
  );

  const memoryRegressionObserved = computeMemoryRegression(artifact.samples);
  invariant(
    artifact.memoryRegressionObserved === memoryRegressionObserved,
    'performance artifact memory-regression flag disagrees with its raw memory samples',
  );

  return {
    averageFps: fpsSum / artifact.samples.length,
    minimumFps,
    peakMemoryMb,
    thermalState: worstThermal,
    memoryRegressionObserved,
  };
}

function main(): void {
  for (const path of [deviceEvidencePath, finalArtPath, v3EvidencePath, captureEvidencePath]) {
    invariant(existsSync(join(root, path)), `required authority/evidence file is missing: ${path}`);
  }

  const evidence = readJson(deviceEvidencePath);
  const finalArt = readJson(finalArtPath);
  const v3 = readJson(v3EvidencePath);
  const capture = readJson(captureEvidencePath);

  invariant(evidence.schemaVersion === 1, 'runtime-device evidence schema mismatch');
  invariant(evidence.performancePolicy?.targetFps === 60, 'runtime-device target FPS policy mismatch');
  invariant(evidence.performancePolicy?.passObservationSeconds >= 300, 'runtime-device observation policy mismatch');

  if (dryRun) {
    console.log('TOP device-performance registration: DRY_RUN_READY');
    console.log(`artifact root: ${artifactRoot}`);
    console.log('targets: simulator | physical-iphone');
    console.log('memory metrics: Unity=unity-total-allocated-memory / Instruments=physical-footprint');
    console.log('memory regression: recomputed from raw early/late sample windows');
    console.log('registration never promotes final/runtime approval by itself');
    return;
  }

  const target = arg('target') as TargetName;
  invariant(target === 'simulator' || target === 'physical-iphone', '--target must be simulator or physical-iphone');
  const artifactInput = arg('artifact');
  invariant(artifactInput.length > 0, '--artifact is required');
  const artifactPath = canonicalRepoPath(artifactInput);
  const absoluteArtifactPath = join(root, artifactPath);
  invariant(existsSync(absoluteArtifactPath), `metrics artifact is missing: ${artifactPath}`);

  const deviceModel = arg('device-model');
  const osVersion = arg('os-version');
  const unityVersion = arg('unity-version');
  invariant(deviceModel.length > 0, '--device-model is required');
  invariant(osVersion.length > 0, '--os-version is required');
  invariant(unityVersion.length > 0, '--unity-version is required');

  const artifactBytes = readFileSync(absoluteArtifactPath);
  const artifactSha256 = createHash('sha256').update(artifactBytes).digest('hex');
  const artifact = JSON.parse(artifactBytes.toString('utf8')) as PerformanceArtifact;
  const summary = summarize(target, artifact);
  const memoryMetric = memoryMetricForMethod(artifact.measurementMethod);

  invariant(v3.executed && v3.result === 'PASSED', 'device-performance registration requires PASSED current V3 Unity evidence');
  invariant(capture.executed && capture.result === 'PASSED', 'device-performance registration requires PASSED current capture evidence');
  invariant(artifact.sourceCommit === v3.verifiedCommit, 'performance artifact source commit must match V3 Unity evidence');
  invariant(artifact.sourceCommit === capture.sourceCommit, 'performance artifact source commit must match capture evidence');
  invariant(artifact.topCompositeKind === v3.sourceCompositeKind, 'performance artifact composite kind must match V3 evidence');
  invariant(artifact.topCompositePath === v3.sourceCompositePath, 'performance artifact composite path must match V3 evidence');
  invariant(artifact.topCompositeSha256 === v3.sourceCompositeSha256, 'performance artifact composite SHA must match V3 evidence');
  invariant(artifact.topCompositeKind === capture.topCompositeKind, 'performance artifact composite kind must match capture evidence');
  invariant(artifact.topCompositePath === capture.topCompositePath, 'performance artifact composite path must match capture evidence');
  invariant(artifact.topCompositeSha256 === capture.topCompositeSha256, 'performance artifact composite SHA must match capture evidence');

  if (finalArt.candidateGenerated) {
    invariant(artifact.topCompositeKind === 'final-core5', 'final candidate device evidence cannot use bridge metrics');
    invariant(artifact.topCompositePath === finalArt.candidatePath, 'final candidate device evidence must use canonical final path');
    invariant(artifact.topCompositeSha256 === finalArt.candidateSha256, 'final candidate device evidence must use current final bytes');
  }

  const targetFps = evidence.performancePolicy.targetFps as number;
  const passObservationSeconds = evidence.performancePolicy.passObservationSeconds as number;
  const thermalPassed = target === 'simulator' || ['nominal', 'fair'].includes(summary.thermalState);
  const passed =
    artifact.durationSeconds >= passObservationSeconds &&
    summary.averageFps >= targetFps * 0.9 &&
    summary.minimumFps >= targetFps * 0.5 &&
    !artifact.framePacingIssueObserved &&
    !summary.memoryRegressionObserved &&
    artifact.backgroundForegroundRecoveryPassed &&
    thermalPassed;

  const key = target === 'simulator' ? 'simulator' : 'physicalIphone';
  const record = evidence[key];
  Object.assign(record, {
    executed: true,
    result: passed ? 'PASSED' : 'FAILED',
    deviceModel,
    osVersion,
    unityVersion,
    sourceCommit: artifact.sourceCommit,
    topCompositeKind: artifact.topCompositeKind,
    topCompositePath: artifact.topCompositePath,
    topCompositeSha256: artifact.topCompositeSha256,
    measurementMethod: artifact.measurementMethod,
    memoryMetric,
    metricsArtifactPath: artifactPath,
    metricsArtifactSha256: artifactSha256,
    durationSeconds: artifact.durationSeconds,
    averageFps: Number(summary.averageFps.toFixed(4)),
    minimumFps: Number(summary.minimumFps.toFixed(4)),
    peakMemoryMb: Number(summary.peakMemoryMb.toFixed(4)),
    framePacingIssueObserved: artifact.framePacingIssueObserved,
    memoryRegressionObserved: summary.memoryRegressionObserved,
    backgroundForegroundRecoveryPassed: artifact.backgroundForegroundRecoveryPassed,
    recordedAtUtc: new Date().toISOString(),
    notes: passed
      ? 'Summary registered from hashed raw performance artifact with an explicit memory metric and recomputed memory trend; this target passed the current performance policy.'
      : 'Summary registered from hashed raw performance artifact with an explicit memory metric and recomputed memory trend; this target did not satisfy every current performance gate.',
  });
  if (key === 'physicalIphone') record.thermalState = summary.thermalState;

  // Recording one or both target measurements never promotes final/runtime approval.
  // Promotion remains a separate gate requiring Core5/crop/motion/human/V3/capture/device coherence.
  evidence.runtimeApproved = false;
  evidence.finalApprovalBlocked = true;
  finalArt.runtimeApproved = false;
  finalArt.approvedAsFinal = false;
  finalArt.finalApprovalBlocked = true;

  writeJson(deviceEvidencePath, evidence);
  writeJson(finalArtPath, finalArt);

  console.log('TOP device-performance registration: RECORDED');
  console.log(`target=${target} result=${record.result}`);
  console.log(`artifact=${artifactPath}`);
  console.log(`artifactSha256=${artifactSha256}`);
  console.log(`memoryMetric=${memoryMetric}`);
  console.log(`averageFps=${record.averageFps} minimumFps=${record.minimumFps} peakMemoryMb=${record.peakMemoryMb}`);
  console.log(`memoryRegressionObserved=${record.memoryRegressionObserved}`);
  if (target === 'physical-iphone') console.log(`worstThermal=${record.thermalState}`);
  console.log('runtimeApproved=false (recording evidence alone never promotes approval)');
}

main();
