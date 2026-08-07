import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

type PerformancePolicy = {
  targetFps: number;
  passObservationSeconds: number;
  memoryBudgetMode: string;
};

type TargetEvidence = {
  executed: boolean;
  result: string;
  measurementMethod: string;
  metricsArtifactPath: string;
  metricsArtifactSha256: string;
  durationSeconds: number;
  averageFps: number;
  minimumFps: number;
  peakMemoryMb: number;
  framePacingIssueObserved: boolean;
  memoryRegressionObserved: boolean;
};

type DeviceEvidence = {
  schemaVersion: number;
  performancePolicy: PerformancePolicy;
  simulator: TargetEvidence;
  physicalIphone: TargetEvidence;
  runtimeApproved: boolean;
  finalApprovalBlocked: boolean;
};

const root = process.cwd();
const artifactRoot =
  'docs/design-targets/generated/top-living-night-v3/device-performance-evidence/';
const evidence = JSON.parse(
  readFileSync(
    join(root, 'docs/design-targets/generated/top-living-night-v3/runtime-device-evidence.json'),
    'utf8',
  ),
) as DeviceEvidence;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(evidence.schemaVersion === 1, 'TOP device performance schema mismatch');
invariant(evidence.performancePolicy.targetFps === 60, 'TOP device target FPS must remain 60');
invariant(
  evidence.performancePolicy.passObservationSeconds >= 300,
  'TOP device PASS observation must cover at least five minutes',
);
invariant(
  evidence.performancePolicy.memoryBudgetMode === 'regression-observation',
  'TOP device memory policy must use regression observation until a device-class budget is established',
);

function verifyMetricsArtifact(name: string, target: TargetEvidence): void {
  invariant(target.measurementMethod.length > 0, `${name}: executed evidence requires a measurement method`);
  invariant(
    target.metricsArtifactPath.startsWith(artifactRoot) && target.metricsArtifactPath.endsWith('.json'),
    `${name}: metrics artifact must be a JSON file under ${artifactRoot}`,
  );
  invariant(/^[0-9a-f]{64}$/.test(target.metricsArtifactSha256), `${name}: metrics artifact SHA-256 is invalid`);
  const absolutePath = join(root, target.metricsArtifactPath);
  invariant(existsSync(absolutePath), `${name}: metrics artifact is missing`);
  const actualSha = createHash('sha256').update(readFileSync(absolutePath)).digest('hex');
  invariant(actualSha === target.metricsArtifactSha256, `${name}: metrics artifact SHA-256 mismatch`);
}

function verifyTarget(name: string, target: TargetEvidence): void {
  if (!target.executed) {
    invariant(target.result === 'NOT_RUN', `${name}: unexecuted device evidence must be NOT_RUN`);
    invariant(target.measurementMethod === '', `${name}: NOT_RUN must not retain a measurement method`);
    invariant(target.metricsArtifactPath === '', `${name}: NOT_RUN must not retain a metrics artifact path`);
    invariant(target.metricsArtifactSha256 === '', `${name}: NOT_RUN must not retain a metrics artifact SHA-256`);
    invariant(target.durationSeconds === 0, `${name}: NOT_RUN duration must be zero`);
    invariant(target.averageFps === 0, `${name}: NOT_RUN average FPS must be zero`);
    invariant(target.minimumFps === 0, `${name}: NOT_RUN minimum FPS must be zero`);
    invariant(target.peakMemoryMb === 0, `${name}: NOT_RUN peak memory must be zero`);
    invariant(!target.framePacingIssueObserved, `${name}: NOT_RUN cannot assert frame pacing observations`);
    invariant(!target.memoryRegressionObserved, `${name}: NOT_RUN cannot assert memory observations`);
    return;
  }

  invariant(['PASSED', 'FAILED'].includes(target.result), `${name}: executed evidence requires PASSED or FAILED`);
  verifyMetricsArtifact(name, target);
  invariant(target.durationSeconds >= 60, `${name}: executed device observation must cover at least 60 seconds`);
  invariant(target.averageFps > 0, `${name}: executed evidence requires average FPS`);
  invariant(target.minimumFps > 0, `${name}: executed evidence requires minimum FPS`);
  invariant(target.minimumFps <= target.averageFps, `${name}: minimum FPS cannot exceed average FPS`);
  invariant(target.peakMemoryMb > 0, `${name}: executed evidence requires peak memory`);

  if (target.result === 'PASSED') {
    const targetFps = evidence.performancePolicy.targetFps;
    invariant(
      target.durationSeconds >= evidence.performancePolicy.passObservationSeconds,
      `${name}: PASS requires the full five-minute performance observation`,
    );
    invariant(
      target.averageFps >= targetFps * 0.9,
      `${name}: PASS requires average FPS >= 90% of the 60 FPS target`,
    );
    invariant(
      target.minimumFps >= targetFps * 0.5,
      `${name}: PASS requires minimum FPS >= 50% of the 60 FPS target`,
    );
    invariant(!target.framePacingIssueObserved, `${name}: PASS rejects observed frame-pacing issues`);
    invariant(!target.memoryRegressionObserved, `${name}: PASS rejects observed memory regression`);
  }
}

verifyTarget('Simulator', evidence.simulator);
verifyTarget('physical iPhone', evidence.physicalIphone);

if (evidence.runtimeApproved) {
  invariant(
    evidence.simulator.executed && evidence.simulator.result === 'PASSED',
    'runtime approval requires Simulator performance PASS',
  );
  invariant(
    evidence.physicalIphone.executed && evidence.physicalIphone.result === 'PASSED',
    'runtime approval requires physical-iPhone performance PASS',
  );
  invariant(!evidence.finalApprovalBlocked, 'runtime-approved performance evidence cannot remain blocked');
} else {
  invariant(evidence.finalApprovalBlocked, 'incomplete performance evidence must keep final approval blocked');
}

console.log('TOP Living Night device performance policy: PASS');
console.log(
  `target=${evidence.performancePolicy.targetFps}fps observation>=${evidence.performancePolicy.passObservationSeconds}s ` +
    `sim=${evidence.simulator.result} iphone=${evidence.physicalIphone.result}`,
);
