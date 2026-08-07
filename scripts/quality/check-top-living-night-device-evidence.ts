import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type TargetEvidence = {
  executed: boolean;
  result: string;
  deviceModel: string;
  osVersion: string;
  unityVersion: string;
  sourceCommit: string;
  durationSeconds: number;
  averageFps: number;
  minimumFps: number;
  peakMemoryMb: number;
  backgroundForegroundRecoveryPassed: boolean;
  recordedAtUtc: string;
  notes: string;
};

type DeviceEvidence = {
  schemaVersion: number;
  simulator: TargetEvidence;
  physicalIphone: TargetEvidence & { thermalState: string };
  runtimeApproved: boolean;
  finalApprovalBlocked: boolean;
};

type FinalArtStatus = {
  runtimeApproved: boolean;
  approvedAsFinal: boolean;
  finalApprovalBlocked: boolean;
};

const root = process.cwd();
const evidence = JSON.parse(
  readFileSync(join(root, 'docs/design-targets/generated/top-living-night-v3/runtime-device-evidence.json'), 'utf8'),
) as DeviceEvidence;
const finalArt = JSON.parse(
  readFileSync(join(root, 'docs/design-targets/generated/top-living-night-v3/final-art-status.json'), 'utf8'),
) as FinalArtStatus;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function verifyTarget(name: string, target: TargetEvidence): void {
  if (!target.executed) {
    invariant(target.result === 'NOT_RUN', `${name}: unexecuted evidence must be NOT_RUN`);
    invariant(target.deviceModel === '', `${name}: NOT_RUN evidence must not retain a device model`);
    invariant(target.osVersion === '', `${name}: NOT_RUN evidence must not retain an OS version`);
    invariant(target.unityVersion === '', `${name}: NOT_RUN evidence must not retain a Unity version`);
    invariant(target.sourceCommit === '', `${name}: NOT_RUN evidence must not retain a source commit`);
    invariant(target.durationSeconds === 0, `${name}: NOT_RUN duration must be zero`);
    invariant(target.averageFps === 0, `${name}: NOT_RUN average FPS must be zero`);
    invariant(target.minimumFps === 0, `${name}: NOT_RUN minimum FPS must be zero`);
    invariant(target.peakMemoryMb === 0, `${name}: NOT_RUN peak memory must be zero`);
    invariant(!target.backgroundForegroundRecoveryPassed, `${name}: NOT_RUN cannot assert recovery PASS`);
    invariant(target.recordedAtUtc === '', `${name}: NOT_RUN evidence must not retain a timestamp`);
    invariant(target.notes === '', `${name}: NOT_RUN evidence must not retain runtime notes`);
    return;
  }

  invariant(['PASSED', 'FAILED'].includes(target.result), `${name}: executed evidence requires PASSED or FAILED`);
  invariant(target.deviceModel.length > 0, `${name}: executed evidence requires device model`);
  invariant(target.osVersion.length > 0, `${name}: executed evidence requires OS version`);
  invariant(target.unityVersion.length > 0, `${name}: executed evidence requires Unity version`);
  invariant(/^[0-9a-f]{40}$/.test(target.sourceCommit), `${name}: executed evidence requires a 40-char source commit`);
  invariant(target.durationSeconds >= 60, `${name}: runtime observation must cover at least 60 seconds`);
  invariant(target.averageFps > 0, `${name}: executed evidence requires average FPS`);
  invariant(target.minimumFps > 0, `${name}: executed evidence requires minimum FPS`);
  invariant(target.minimumFps <= target.averageFps, `${name}: minimum FPS cannot exceed average FPS`);
  invariant(target.peakMemoryMb > 0, `${name}: executed evidence requires peak memory`);
  invariant(target.recordedAtUtc.length > 0, `${name}: executed evidence requires timestamp`);

  if (target.result === 'PASSED') {
    invariant(target.backgroundForegroundRecoveryPassed, `${name}: PASS requires background/foreground recovery`);
  }
}

invariant(evidence.schemaVersion === 1, 'TOP runtime-device evidence schema mismatch');
verifyTarget('Simulator', evidence.simulator);
verifyTarget('physical iPhone', evidence.physicalIphone);

if (!evidence.physicalIphone.executed) {
  invariant(evidence.physicalIphone.thermalState === '', 'physical iPhone: NOT_RUN must not retain thermal state');
} else {
  invariant(
    ['nominal', 'fair', 'serious', 'critical'].includes(evidence.physicalIphone.thermalState),
    'physical iPhone: executed evidence requires a known thermal state',
  );
}

if (evidence.runtimeApproved) {
  invariant(evidence.simulator.executed && evidence.simulator.result === 'PASSED', 'runtime approval requires Simulator PASS');
  invariant(evidence.physicalIphone.executed && evidence.physicalIphone.result === 'PASSED', 'runtime approval requires physical iPhone PASS');
  invariant(
    evidence.simulator.sourceCommit === evidence.physicalIphone.sourceCommit,
    'runtime approval requires Simulator and iPhone evidence from the same source commit',
  );
  invariant(
    ['nominal', 'fair'].includes(evidence.physicalIphone.thermalState),
    'runtime approval rejects serious/critical physical-device thermal state',
  );
  invariant(!evidence.finalApprovalBlocked, 'runtime-approved device evidence cannot remain internally blocked');
} else {
  invariant(evidence.finalApprovalBlocked, 'incomplete device evidence must keep final approval blocked');
}

invariant(
  finalArt.runtimeApproved === evidence.runtimeApproved,
  'final-art runtimeApproved must exactly match Simulator/physical-device evidence approval',
);

if (finalArt.approvedAsFinal) {
  invariant(evidence.runtimeApproved, 'final TOP approval requires Simulator and physical iPhone evidence');
  invariant(!finalArt.finalApprovalBlocked, 'final TOP approval cannot remain blocked');
}

console.log('TOP Living Night runtime-device evidence contract: PASS');
console.log(`simulator=${evidence.simulator.result} iphone=${evidence.physicalIphone.result} runtimeApproved=${evidence.runtimeApproved}`);
