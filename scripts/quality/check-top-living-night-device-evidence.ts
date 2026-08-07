import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type TargetEvidence = {
  executed: boolean;
  result: string;
  deviceModel: string;
  osVersion: string;
  unityVersion: string;
  sourceCommit: string;
  topCompositeKind: string;
  topCompositePath: string;
  topCompositeSha256: string;
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
  candidateGenerated: boolean;
  candidatePath: string;
  candidateSha256: string;
  runtimeApproved: boolean;
  approvedAsFinal: boolean;
  finalApprovalBlocked: boolean;
};

type V3Evidence = {
  executed: boolean;
  result: string;
  verifiedCommit: string;
  sourceCompositeKind: string;
  sourceCompositePath: string;
  sourceCompositeSha256: string;
};

type CaptureEvidence = {
  executed: boolean;
  result: string;
  sourceCommit: string;
  topCompositeKind: string;
  topCompositePath: string;
  topCompositeSha256: string;
  captureCount: number;
};

const root = process.cwd();
const evidence = JSON.parse(
  readFileSync(join(root, 'docs/design-targets/generated/top-living-night-v3/runtime-device-evidence.json'), 'utf8'),
) as DeviceEvidence;
const finalArt = JSON.parse(
  readFileSync(join(root, 'docs/design-targets/generated/top-living-night-v3/final-art-status.json'), 'utf8'),
) as FinalArtStatus;
const v3 = JSON.parse(
  readFileSync(join(root, 'docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json'), 'utf8'),
) as V3Evidence;
const capture = JSON.parse(
  readFileSync(join(root, 'docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json'), 'utf8'),
) as CaptureEvidence;

const canonicalFinalPath =
  'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';
const canonicalBridgePath =
  'docs/design-targets/generated/top-living-night-v2/previews/top-living-night-layered-candidate-430x932.png';
const canonicalBridgeSha256 =
  'aac090f3f2ec7c5d7438459d5cb22bc917e43ffe36546eaf94c1389c67538b6d';
const sha256 = /^[0-9a-f]{64}$/;

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
    invariant(target.topCompositeKind === '', `${name}: NOT_RUN evidence must not retain TOP composite kind`);
    invariant(target.topCompositePath === '', `${name}: NOT_RUN evidence must not retain TOP composite path`);
    invariant(target.topCompositeSha256 === '', `${name}: NOT_RUN evidence must not retain TOP composite SHA-256`);
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
  invariant(['bridge', 'final-core5'].includes(target.topCompositeKind), `${name}: executed evidence requires known TOP composite kind`);
  invariant(target.topCompositePath.length > 0, `${name}: executed evidence requires TOP composite path`);
  invariant(sha256.test(target.topCompositeSha256), `${name}: executed evidence requires TOP composite SHA-256`);
  invariant(target.durationSeconds >= 60, `${name}: runtime observation must cover at least 60 seconds`);
  invariant(target.averageFps > 0, `${name}: executed evidence requires average FPS`);
  invariant(target.minimumFps > 0, `${name}: executed evidence requires minimum FPS`);
  invariant(target.minimumFps <= target.averageFps, `${name}: minimum FPS cannot exceed average FPS`);
  invariant(target.peakMemoryMb > 0, `${name}: executed evidence requires peak memory`);
  invariant(target.recordedAtUtc.length > 0, `${name}: executed evidence requires timestamp`);

  if (target.topCompositeKind === 'bridge') {
    invariant(target.topCompositePath === canonicalBridgePath, `${name}: bridge evidence must target canonical bridge path`);
    invariant(target.topCompositeSha256 === canonicalBridgeSha256, `${name}: bridge evidence SHA-256 mismatch`);
  } else {
    invariant(target.topCompositePath === canonicalFinalPath, `${name}: final-core5 evidence must target canonical final path`);
    invariant(finalArt.candidateGenerated, `${name}: final-core5 evidence requires generated final candidate`);
    invariant(sha256.test(finalArt.candidateSha256), `${name}: final-core5 evidence requires valid current final candidate SHA-256`);
    invariant(target.topCompositeSha256 === finalArt.candidateSha256, `${name}: final-core5 evidence must target exact current final candidate bytes`);
  }

  if (target.result === 'PASSED') {
    invariant(target.backgroundForegroundRecoveryPassed, `${name}: PASS requires background/foreground recovery`);
  }
}

invariant(evidence.schemaVersion === 1, 'TOP runtime-device evidence schema mismatch');
invariant(finalArt.candidatePath === canonicalFinalPath, 'TOP final-art candidate path must remain canonical');
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
  invariant(finalArt.candidateGenerated, 'runtime approval requires generated final Core5 TOP candidate');
  invariant(sha256.test(finalArt.candidateSha256), 'runtime approval requires valid final Core5 candidate SHA-256');
  invariant(evidence.simulator.executed && evidence.simulator.result === 'PASSED', 'runtime approval requires Simulator PASS');
  invariant(evidence.physicalIphone.executed && evidence.physicalIphone.result === 'PASSED', 'runtime approval requires physical iPhone PASS');
  invariant(evidence.simulator.topCompositeKind === 'final-core5', 'runtime approval rejects bridge-only Simulator evidence');
  invariant(evidence.physicalIphone.topCompositeKind === 'final-core5', 'runtime approval rejects bridge-only physical-iPhone evidence');
  invariant(evidence.simulator.topCompositePath === canonicalFinalPath, 'runtime approval requires canonical final TOP on Simulator');
  invariant(evidence.physicalIphone.topCompositePath === canonicalFinalPath, 'runtime approval requires canonical final TOP on physical iPhone');
  invariant(evidence.simulator.topCompositeSha256 === finalArt.candidateSha256, 'runtime approval requires Simulator evidence for current final TOP bytes');
  invariant(evidence.physicalIphone.topCompositeSha256 === finalArt.candidateSha256, 'runtime approval requires iPhone evidence for current final TOP bytes');
  invariant(
    evidence.simulator.sourceCommit === evidence.physicalIphone.sourceCommit,
    'runtime approval requires Simulator and iPhone evidence from the same source commit',
  );
  invariant(
    ['nominal', 'fair'].includes(evidence.physicalIphone.thermalState),
    'runtime approval rejects serious/critical physical-device thermal state',
  );
  invariant(v3.executed && v3.result === 'PASSED', 'runtime approval requires PASSED current V3 Unity evidence');
  invariant(v3.sourceCompositeKind === 'final-core5', 'runtime approval requires final-core5 V3 Unity evidence');
  invariant(v3.sourceCompositePath === canonicalFinalPath, 'runtime approval requires canonical final TOP V3 Unity evidence');
  invariant(v3.sourceCompositeSha256 === finalArt.candidateSha256, 'runtime approval requires V3 Unity evidence for current final TOP bytes');
  invariant(capture.executed && capture.result === 'PASSED' && capture.captureCount === 15, 'runtime approval requires PASSED current 15-frame capture evidence');
  invariant(capture.topCompositeKind === 'final-core5', 'runtime approval requires final-core5 capture evidence');
  invariant(capture.topCompositePath === canonicalFinalPath, 'runtime approval requires canonical final TOP capture evidence');
  invariant(capture.topCompositeSha256 === finalArt.candidateSha256, 'runtime approval requires capture evidence for current final TOP bytes');
  invariant(
    evidence.simulator.sourceCommit === v3.verifiedCommit &&
      evidence.physicalIphone.sourceCommit === v3.verifiedCommit &&
      capture.sourceCommit === v3.verifiedCommit,
    'runtime approval requires Simulator, iPhone, V3 Unity, and capture evidence from one source commit',
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
console.log(`simulator=${evidence.simulator.result}/${evidence.simulator.topCompositeKind || 'NOT_RUN'} iphone=${evidence.physicalIphone.result}/${evidence.physicalIphone.topCompositeKind || 'NOT_RUN'} runtimeApproved=${evidence.runtimeApproved}`);
