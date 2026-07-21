import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '../..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');
const json = (path: string) => JSON.parse(read(path));
const check = (value: unknown, message: string) => {
  if (!value) throw new Error(`U49 actual-device audio/haptic check failed: ${message}`);
};
const sha256 = (path: string) => createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');
const evidenceRoot = 'docs/design-targets/generated/unity-u49';
const documentFiles = [
  'docs/unity-u49-actual-device-audio-haptic-plan-2026-07-21.md',
  'docs/unity-u49-actual-device-audio-haptic-review-2026-07-21.md',
  'docs/unity-u49-actual-device-audio-haptic-completion-2026-07-21.md',
];
const evidenceFiles = [
  'preflight-audit.json',
  'audio-event-inventory.json',
  'bgm-inventory.json',
  'haptic-event-inventory.json',
  'audio-analysis-report.json',
  'audio-import-report.json',
  'production-audio-manifest.json',
  'audio-mixer-routing-map.json',
  'audio-event-coverage.json',
  'haptic-event-coverage.json',
  'device-build-result.json',
  'device-install-launch-result.json',
  'device-session.json',
  'audio-latency-measurements.json',
  'audio-mix-observation.json',
  'haptic-device-observation.json',
  'background-foreground-result.json',
  'human-device-decision.json',
  'readiness.json',
  'completion-summary.json',
];

for (const file of evidenceFiles) {
  check(existsSync(resolve(root, evidenceRoot, file)), `missing evidence ${file}`);
  const evidence = json(`${evidenceRoot}/${file}`);
  const source = evidence.sourceHead ?? evidence.sourceCommit;
  if (source) {
    check(/^[0-9a-f]{40}$/.test(source), `invalid source commit in ${file}`);
    try { execFileSync('git', ['merge-base', '--is-ancestor', source, 'HEAD'], { cwd: root, stdio: 'ignore' }); }
    catch { check(false, `source commit is not an ancestor in ${file}`); }
  }
}
for (const file of documentFiles) check(existsSync(resolve(root, file)), `missing document ${file}`);

const manifest = json(`${evidenceRoot}/production-audio-manifest.json`);
const analysis = json(`${evidenceRoot}/audio-analysis-report.json`);
const imports = json(`${evidenceRoot}/audio-import-report.json`);
const mixerMap = json(`${evidenceRoot}/audio-mixer-routing-map.json`);
const audioCoverage = json(`${evidenceRoot}/audio-event-coverage.json`);
const hapticCoverage = json(`${evidenceRoot}/haptic-event-coverage.json`);
const build = json(`${evidenceRoot}/device-build-result.json`);
const install = json(`${evidenceRoot}/device-install-launch-result.json`);
const session = json(`${evidenceRoot}/device-session.json`);
const latency = json(`${evidenceRoot}/audio-latency-measurements.json`);
const mix = json(`${evidenceRoot}/audio-mix-observation.json`);
const haptic = json(`${evidenceRoot}/haptic-device-observation.json`);
const lifecycle = json(`${evidenceRoot}/background-foreground-result.json`);
const human = json(`${evidenceRoot}/human-device-decision.json`);
const readiness = json(`${evidenceRoot}/readiness.json`);
const completion = json(`${evidenceRoot}/completion-summary.json`);
const u48 = json('docs/design-targets/generated/unity-u48/readiness.json');

check(u48.u48Completed === true && u48.status === 'U48_COMPLETED_PRODUCTION_VISUAL_RUNTIME_READY', 'U48 completion preserved');
check(u48.runtimeApprovedAssetCount === 46 && u48.productionVerificationCaptureCount === 138, 'U48 46 assets / 138 captures preserved');

check(manifest.seAssetCount === 22 && manifest.uniqueEventCount === 22 && manifest.uniqueClipShaCount === 22, '22 unique production SE registrations');
check(manifest.duplicatePcmHashCount === 0 && manifest.duplicateGuidCount === 0, 'no duplicate PCM or GUID');
check(manifest.u28DraftProductionReferenceCount === 0 && manifest.sourceAndDestinationShaMismatchCount === 0, 'no U28 draft reference or SHA mismatch');
check(Array.isArray(manifest.assets) && manifest.assets.length === 22, 'manifest has 22 assets');
check(new Set(manifest.assets.map((asset: { eventId: string }) => asset.eventId)).size === 22, 'manifest event IDs are unique');
check(new Set(manifest.assets.map((asset: { guid: string }) => asset.guid)).size === 22, 'manifest clip GUIDs are unique');
for (const asset of manifest.assets as Array<{ productionPath: string; sourceSha256: string; destinationSha256: string; guid: string }>) {
  check(existsSync(resolve(root, asset.productionPath)), `missing production clip ${asset.productionPath}`);
  check(sha256(asset.productionPath) === asset.destinationSha256 && asset.sourceSha256 === asset.destinationSha256, `stale clip SHA ${asset.productionPath}`);
  const meta = read(`${asset.productionPath}.meta`);
  check(meta.includes(`guid: ${asset.guid}`), `stale clip GUID ${asset.productionPath}`);
}
check(analysis.assetCount === 22 && analysis.duplicatePcmHashCount === 0 && analysis.clippingSampleCount === 0, 'audio analysis is clean');
check(imports.assetCount === 22 && imports.invalidImportCount === 0, 'audio imports satisfy policy');

const expectedGroups = ['Master', 'BGM', 'SE', 'UI', 'Battle', 'Pickup', 'Climax', 'Result', 'StageSelect'];
const expectedParameters = ['MasterVolumeDb', 'BgmVolumeDb', 'SeVolumeDb', 'UiVolumeDb'];
check(expectedGroups.every(group => mixerMap.requiredGroups.includes(group)), 'all 9 mixer groups declared');
check(expectedParameters.every(parameter => mixerMap.exposedParameters.includes(parameter)), 'all 4 mixer parameters exposed');
check(mixerMap.missingGroupCount === 0 && mixerMap.missingExposedParameterCount === 0 && mixerMap.missingRouteCount === 0, 'mixer map complete');
check(mixerMap.routedProductionEventCount === 22 && mixerMap.masterDirectEventCount === 0 && mixerMap.nullGroupFallbackAllowed === false, 'all events use child groups');
check(sha256(manifest.mixerPath) === manifest.mixerSha256 && sha256(manifest.profilePath) === manifest.profileSha256, 'mixer/profile hashes current');
const mixerAsset = read(manifest.mixerPath);
check(expectedGroups.every(group => mixerAsset.includes(`m_Name: ${group}`)), 'actual mixer contains all required groups');
check(expectedParameters.every(parameter => mixerAsset.includes(`name: ${parameter}`)), 'actual mixer exposes all required parameters');

check(audioCoverage.requiredEventCount === 22 && audioCoverage.coveredEventCount === 22 && audioCoverage.missingCriticalEventCount === 0 && audioCoverage.duplicateEventCount === 0, '22 audio events covered');
check(hapticCoverage.requiredEventCount === 10 && hapticCoverage.coveredEventCount === 10 && hapticCoverage.missingCriticalEventCount === 0, '10 haptic events covered');

const owner = read('unity/VampPonUnity/Assets/_Project/Scripts/U49/AudioHaptic/U49AudioHapticRuntimeOwner.cs');
const bridge = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U43RuntimeFeedbackBridge.cs');
const iosAdapter = read('unity/VampPonUnity/Assets/_Project/Scripts/U49/AudioHaptic/U49IosHapticAdapter.cs');
const nativeHaptics = read('unity/VampPonUnity/Assets/Plugins/iOS/VampPonHaptics.mm');
const postprocess = read('unity/VampPonUnity/Assets/_Project/Scripts/Editor/U49IosPostprocessBuild.cs');
const harness = read('unity/VampPonUnity/Assets/_Project/Scripts/U49/AudioHaptic/U49DeviceVerificationHarness.cs');
check(owner.includes('private const int VoicePoolSize = 8') && owner.includes('source.outputAudioMixerGroup = profile.SeGroup') && owner.includes('voice.Source.outputAudioMixerGroup = group'), '8 routed 2D production voices');
check(!owner.includes('U28MobileHapticPlaceholderAdapter') && !bridge.includes('U28MobileHapticPlaceholderAdapter'), 'placeholder haptic adapter is outside product route');
check(!owner.includes('Handheld.Vibrate') && !bridge.includes('Handheld.Vibrate'), 'no direct legacy vibration');
check(!owner.includes('AudioClip.Create') && !bridge.includes('AudioClip.Create') && !bridge.includes('Mathf.Sin'), 'no generated-tone product fallback');
check(iosAdapter.includes('IU28HapticPlatformAdapter') && iosAdapter.includes("DllImport(\"__Internal\")"), 'iOS adapter uses existing interface and native plugin');
check(nativeHaptics.includes('TARGET_OS_SIMULATOR') && nativeHaptics.includes('CHHapticEngine') && nativeHaptics.includes('resetHandler') && nativeHaptics.includes('stoppedHandler'), 'Core Haptics simulator/lifecycle guards');
check(postprocess.includes('CoreHaptics.framework') && postprocess.includes('UnityFramework'), 'Core Haptics framework postprocess');
check(harness.trimStart().startsWith('#if VAMPPON_U49_DEVICE_VERIFICATION && DEVELOPMENT_BUILD'), 'harness is dev-only and double-guarded');
check((harness.match(/U28AudioEventId\.[A-Za-z]+/g) ?? []).length >= 22 && (harness.match(/U28HapticEventId\.[A-Za-z]+/g) ?? []).length >= 10, 'harness exposes 22 audio and 10 haptic events');

check(build.platform === 'iOS' && build.sdk === 'DeviceSDK' && build.unityDeviceExportPassed === true && build.xcodeReleaseBuildPassed === true && build.signingPassed === true, 'signed iOS Device Release build evidence');
check(build.coreHapticsNativeCompilePassed === true && build.coreHapticsFrameworkLinked === true && build.buildProductsTracked === false, 'native Core Haptics build is linked and products untracked');
check(install.physicalDevice === true && install.deviceFamily === 'iPhone' && install.installPassed === true && install.localCodeSignatureVerified === true, 'physical iPhone install evidence');
check(install.deviceIdentifierTracked === false && install.profileIdentifierTracked === false, 'device/profile identifiers are not tracked');

const complete = readiness.status === 'U49_COMPLETED_ACTUAL_DEVICE_AUDIO_HAPTIC_READY';
if (complete) {
  check(install.launchPassed === true && session.launchPassed === true && session.verificationHarnessReached === true, 'completed state has launched physical-device harness');
  check(session.automaticSequenceStarted === true && session.automaticSequenceCompleted === true, 'completed state has completed sequence');
  check(session.audioEventRequestCount >= 22 && session.hapticEventRequestCount >= 10, 'completed session requested all events');
  check(latency.audioLatencyMeasured === true && mix.mixReviewPassed === true && haptic.hapticMeasured === true && lifecycle.passed === true, 'completed measurements all pass');
  check(human.provided === true && human.humanAudioApprovalProvided === true && human.humanHapticApprovalProvided === true && human.overallAccepted === true, 'completed state has explicit human approval');
  check(readiness.audioMixerReady === true && readiness.audioLatencyMeasured === true && readiness.hapticMeasured === true, 'completed measured readiness flags');
  check(readiness.audioReady === true && readiness.hapticReady === true && readiness.physicalDeviceReady === true && readiness.devicePlayableReady === true, 'completed device readiness');
  check(completion.completed === true && completion.status === 'COMPLETED' && completion.u50Blocked === false, 'completion summary matches ready state');
} else {
  check(readiness.status === 'U49_BLOCKED_BY_PHYSICAL_DEVICE_EVIDENCE', 'incomplete state remains explicitly blocked');
  check(readiness.audioMixerReady === false && readiness.audioLatencyMeasured === false && readiness.hapticMeasured === false, 'blocked state does not promote measured flags');
  check(readiness.audioReady === false && readiness.hapticReady === false && readiness.physicalDeviceReady === false && readiness.devicePlayableReady === false, 'blocked state does not promote device readiness');
  check(human.provided === false && human.humanAudioApprovalProvided === false && human.humanHapticApprovalProvided === false, 'blocked state has no fabricated human approval');
  check(completion.completed === false && completion.status === 'BLOCKED' && completion.u50Blocked === true, 'completion summary remains blocked');
}
check(readiness.performanceReady === false && readiness.mobileMetricsReady === false && readiness.rcReady === false && readiness.productionApproved === false, 'later readiness remains false');

const trackedU49 = execFileSync('git', ['ls-files', 'docs/*u49*', `${evidenceRoot}/*`], { cwd: root, encoding: 'utf8' })
  .trim().split('\n').filter(Boolean);
for (const path of new Set([...trackedU49, ...documentFiles, ...evidenceFiles.map(file => `${evidenceRoot}/${file}`)])) {
  const content = read(path);
  check(!content.includes('/Users/') && !content.includes('DerivedData'), `local absolute build path leaked in ${path}`);
  check(!/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i.test(content), `UUID/UDID leaked in ${path}`);
  check(!content.includes('黒曜化'), `forbidden term typo in ${path}`);
}

console.log(`Unity U49 actual-device audio/haptic check passed: 22 SE, 10 haptics, 9 mixer groups; readiness=${readiness.status}.`);
