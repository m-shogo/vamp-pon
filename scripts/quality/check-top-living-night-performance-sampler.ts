import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const samplerPath = join(
  root,
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/TopLivingNightPerformanceSampler.cs',
);
const metaPath = `${samplerPath}.meta`;
const projectSettingsPath = join(root, 'unity/VampPonUnity/ProjectSettings/ProjectSettings.asset');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(existsSync(samplerPath), 'TOP performance sampler source is missing');
invariant(existsSync(metaPath), 'TOP performance sampler meta is missing');
invariant(existsSync(projectSettingsPath), 'Unity ProjectSettings are missing');

const sampler = readFileSync(samplerPath, 'utf8');
const projectSettings = readFileSync(projectSettingsPath, 'utf8');

for (const token of [
  'private const string EnableFlag = "--vamp-pon-top-perf";',
  'private const string SupportedTarget = "simulator";',
  'private const float SampleIntervalSeconds = 5f;',
  'private const float ObservationSeconds = 300f;',
  'private const float ReadyTimeoutSeconds = 120f;',
  'Profiler.GetTotalAllocatedMemoryLong()',
  'TopLivingNightCompositeV3Controller.IsCompositeReady',
  'LoadingTopVisualPolishCoordinator.IsCurrentTopReady',
  'private void OnApplicationPause(bool paused)',
  'backgroundForegroundRecoveryPassed = recoveryPassed',
  'measurementMethod = "unity-runtime-sampler"',
  'Application.persistentDataPath',
  'TOP_PERF_ARTIFACT=',
  'MemoryRegressionAbsoluteMb = 32f',
  'MemoryRegressionFraction = .20f',
  'FramePacingHitchSeconds = .10f',
  'private bool applicationPaused;',
  'private bool ignoreNextFrameDelta;',
  'private double pausedDurationToApply;',
  'observationStartedAt += pausedDurationToApply;',
  'intervalStartedAt += pausedDurationToApply;',
  'nextSampleAt += pausedDurationToApply;',
  'ignoreNextFrameDelta = true;',
]) {
  invariant(sampler.includes(token), `TOP performance sampler contract missing: ${token}`);
}

invariant(
  sampler.indexOf('if (!HasArgument(EnableFlag) || instance != null)') <
    sampler.indexOf('new GameObject('),
  'TOP performance sampler must remain opt-in before creating runtime objects',
);
invariant(
  sampler.includes('unity-runtime-sampler currently supports simulator only'),
  'TOP runtime sampler must not pretend to provide physical-iPhone thermal evidence',
);
invariant(
  sampler.includes('Use xcode-instruments for physical-iPhone thermal evidence.'),
  'TOP runtime sampler must preserve the physical-iPhone Instruments boundary',
);
invariant(
  sampler.includes('App suspension is not active render time.'),
  'TOP performance sampler must explicitly exclude app suspension from active render timing',
);
invariant(
  sampler.includes('That is suspension time, not render-frame pacing.'),
  'TOP performance sampler must ignore the first post-resume delta for frame-pacing evidence',
);
invariant(
  sampler.includes('final-core5') && sampler.includes('bridge'),
  'TOP performance sampler must record composite provenance kind',
);
invariant(
  sampler.includes('--vamp-pon-top-perf-source-commit=') &&
    sampler.includes('--vamp-pon-top-perf-composite-path=') &&
    sampler.includes('--vamp-pon-top-perf-composite-sha256='),
  'TOP performance sampler must require source/composite launch provenance',
);

for (const token of [
  'iPhone: com.mshogo.vamppon.u1',
  'adjustIOSFPSUsingThermalState: 1',
  'thermalStateSeriousIOSFPS: 30',
  'thermalStateCriticalIOSFPS: 15',
]) {
  invariant(projectSettings.includes(token), `Unity iOS performance setting missing: ${token}`);
}

console.log('TOP Living Night opt-in performance sampler contract: PASS');
console.log('sampler: Simulator only / 300 active s / 5 s raw samples / FPS + allocated memory / recovery evidence');
console.log('pause handling: suspension excluded from FPS denominator; first resume delta excluded from hitch evidence');
console.log('physical iPhone: thermal evidence remains xcode-instruments/native responsibility');
