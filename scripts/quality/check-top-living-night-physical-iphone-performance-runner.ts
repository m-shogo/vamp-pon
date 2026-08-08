import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const samplerPath = join(
  root,
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/TopLivingNightPhysicalIphonePerformanceSampler.cs',
);
const samplerMetaPath = `${samplerPath}.meta`;
const nativePath = join(root, 'unity/VampPonUnity/Assets/Plugins/iOS/TopLivingNightThermalState.mm');
const nativeMetaPath = `${nativePath}.meta`;
const runnerRelativePath = 'scripts/unity/run-top-living-night-physical-iphone-performance-evidence.sh';
const runnerPath = join(root, runnerRelativePath);

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

for (const path of [samplerPath, samplerMetaPath, nativePath, nativeMetaPath, runnerPath]) {
  invariant(existsSync(path), `physical-iPhone performance asset is missing: ${path}`);
}

const sampler = readFileSync(samplerPath, 'utf8');
const native = readFileSync(nativePath, 'utf8');
const nativeMeta = readFileSync(nativeMetaPath, 'utf8');
const runner = readFileSync(runnerPath, 'utf8');

for (const token of [
  'private const string EnableFlag = "--vamp-pon-top-physical-perf";',
  'private const string TargetName = "physical-iphone";',
  'private const float SampleIntervalSeconds = 5f;',
  'private const float ObservationSeconds = 300f;',
  'private const float ReadyTimeoutSeconds = 120f;',
  'private const float RecoveryTimeoutSeconds = 15f;',
  '[DllImport("__Internal")]',
  'private static extern int VampPonGetThermalState();',
  'Profiler.GetTotalAllocatedMemoryLong()',
  'TopLivingNightCompositeV3Controller.IsCompositeReady',
  'LoadingTopVisualPolishCoordinator.IsCurrentTopReady',
  'private void OnApplicationPause(bool paused)',
  'pausedDurationToApply += Math.Max(0d, now - pauseStartedAt);',
  'observationStartedAt += pausedDurationToApply;',
  'ignoreNextFrameDelta = true;',
  'measurementMethod = "unity-runtime-sampler"',
  'thermalState = thermalState',
  'case 0:',
  'state = "nominal";',
  'case 1:',
  'state = "fair";',
  'case 2:',
  'state = "serious";',
  'case 3:',
  'state = "critical";',
  'refusing partial evidence',
]) {
  invariant(sampler.includes(token), `physical-iPhone sampler contract missing: ${token}`);
}

invariant(
  sampler.indexOf('if (!HasArgument(EnableFlag) || instance != null)') < sampler.indexOf('new GameObject('),
  'physical-iPhone sampler must remain opt-in before creating runtime objects',
);
invariant(
  !sampler.includes('private const string EnableFlag = "--vamp-pon-top-perf";'),
  'physical-iPhone sampler must not collide with the Simulator enable flag',
);

for (const token of [
  '#import <Foundation/Foundation.h>',
  'extern "C" int VampPonGetThermalState(void)',
  '[NSProcessInfo processInfo].thermalState',
  '@available(iOS 11.0, *)',
  'return -1;',
]) {
  invariant(native.includes(token), `native iOS thermal bridge contract missing: ${token}`);
}

invariant(nativeMeta.includes('PluginImporter:'), 'thermal bridge meta must use PluginImporter');
invariant(nativeMeta.includes('iPhone: iOS'), 'thermal bridge must be enabled for iPhone/iOS');
invariant(nativeMeta.includes('enabled: 1'), 'thermal bridge iOS importer must be enabled');

for (const token of [
  'VAMPPON_PHYSICAL_IPHONE_DEVICE',
  'xcrun devicectl device info details',
  'xcrun devicectl device copy to',
  'xcrun devicectl device process launch',
  '--vamp-pon-top-physical-perf',
  'com.apple.Preferences',
  'xcrun devicectl device copy from',
  '"pending":true',
  "artifact.target === 'physical-iphone'",
  'artifact.durationSeconds >= 300',
  'artifact.samples.length >= 61',
  "['nominal','fair','serious','critical'].includes(sample.thermalState)",
  '--target=physical-iphone',
  'register-top-living-night-device-performance.ts',
  'check-top-living-night-device-performance-artifact.ts',
  'check-top-living-night-device-performance-policy.ts',
  'check-top-living-night-device-evidence.ts',
  'evidence recording never promotes runtimeApproved/final approval by itself',
]) {
  invariant(runner.includes(token), `physical-iPhone performance runner contract missing: ${token}`);
}

invariant(
  runner.includes("if [[ -z \"$DEVICE_ID\" ]]") && runner.includes('exit 1'),
  'physical-iPhone runner must fail closed when no device is selected',
);
invariant(
  runner.includes('v3.verifiedCommit !== capture.sourceCommit') &&
    runner.includes('V3/capture source commit mismatch'),
  'physical-iPhone runner must bind V3 and capture to one source commit',
);
invariant(
  runner.includes('v3.sourceCompositeSha256 !== capture.topCompositeSha256'),
  'physical-iPhone runner must bind V3 and capture to one composite SHA',
);

const bashSyntax = spawnSync('bash', ['-n', runnerRelativePath], {
  cwd: root,
  encoding: 'utf8',
});
invariant(
  bashSyntax.status === 0,
  `physical-iPhone performance runner bash syntax failed:\n${bashSyntax.stdout}\n${bashSyntax.stderr}`,
);

console.log('TOP Living Night physical-iPhone performance runner contract: PASS');
console.log('physical sampler: opt-in / 300 active s / 5 s FPS+memory+native thermal / recovery evidence');
console.log('runner: devicectl launch + sentinel stale-file guard + artifact pull + guarded registration');
