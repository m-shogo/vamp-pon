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
  'device-review-contract.json',
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
const bgm = json(`${evidenceRoot}/bgm-inventory.json`);
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
const reviewContract = json(`${evidenceRoot}/device-review-contract.json`);
const readiness = json(`${evidenceRoot}/readiness.json`);
const completion = json(`${evidenceRoot}/completion-summary.json`);
const u48 = json('docs/design-targets/generated/unity-u48/readiness.json');

check(u48.u48Completed === true && u48.status === 'U48_COMPLETED_PRODUCTION_VISUAL_RUNTIME_READY', 'U48 completion preserved');
check(u48.runtimeApprovedAssetCount === 46 && u48.productionVerificationCaptureCount === 138, 'U48 46 assets / 138 captures preserved');

check(bgm.bgmPolicy === 'INTENTIONALLY_DISABLED', 'BGM policy is explicitly intentionally disabled');
check(bgm.bgmProductionClipCount === 0 && bgm.bgmAssetCount === 0 && bgm.bgmExpectedAudible === false, 'BGM policy declares zero production clips and no expected playback');
check(bgm.bgmRuntimeOwnerExists === false && bgm.loopPointDefined === false, 'disabled BGM has no runtime owner or synthetic loop point');
check(bgm.missingClipErrorAllowed === false && bgm.unexpectedPlaybackAllowed === false, 'disabled BGM forbids missing-clip errors and unexpected playback');
check(typeof bgm.reason === 'string' && bgm.reason.length > 0, 'disabled BGM policy has a reason');

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
const requiredHumanAnswers = reviewContract.answers.map((answer: { id: string }) => answer.id);
check(reviewContract.requiredAnswerCount === 18 && requiredHumanAnswers.length === 18 && new Set(requiredHumanAnswers).size === 18, 'device review contract has 18 unique answers');

const owner = read('unity/VampPonUnity/Assets/_Project/Scripts/U49/AudioHaptic/U49AudioHapticRuntimeOwner.cs');
const profile = read('unity/VampPonUnity/Assets/_Project/Scripts/U49/AudioHaptic/U49ProductionAudioProfile.cs');
const bridge = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U43RuntimeFeedbackBridge.cs');
const iosAdapter = read('unity/VampPonUnity/Assets/_Project/Scripts/U49/AudioHaptic/U49IosHapticAdapter.cs');
const nativeHaptics = read('unity/VampPonUnity/Assets/Plugins/iOS/VampPonHaptics.mm');
const postprocess = read('unity/VampPonUnity/Assets/_Project/Scripts/Editor/U49IosPostprocessBuild.cs');
const harness = read('unity/VampPonUnity/Assets/_Project/Scripts/U49/AudioHaptic/U49DeviceVerificationHarness.cs');
check(owner.includes('private const int VoicePoolSize = 8') && owner.includes('source.outputAudioMixerGroup = profile.SeGroup') && owner.includes('voice.Source.outputAudioMixerGroup = group'), '8 routed 2D production voices');
check(profile.includes('RequiredPrimaryEvents.All(boundEvents.Contains)') && profile.includes('boundClips.Count == RequiredPrimaryEventCount'), 'runtime profile rejects missing, duplicate, or null production bindings');
check(iosAdapter.includes('capabilityChecked') && iosAdapter.includes('!capabilityChecked ? U49HapticCapability.Unknown'), 'haptic capability distinguishes unchecked from unsupported devices');
check(owner.includes('Diagnostics.hapticInitialized = false') && owner.includes('Diagnostics.hapticInitialized = InitializeHaptics()'), 'haptic diagnostics follow suspend/resume lifecycle');
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
check(readiness.audioMixerImplemented === true && readiness.actualAudioMixerAssetExists === true, 'static AudioMixer implementation is recorded separately');
if (complete) {
  const buildSource = build.sourceHead ?? build.sourceCommit;
  for (const [label, evidence] of Object.entries({ install, session, latency, mix, haptic, lifecycle, human })) {
    check((evidence.sourceHead ?? evidence.sourceCommit) === buildSource, `completed ${label} evidence uses the built source commit`);
  }
  const runtimeChangesAfterBuild = execFileSync(
    'git',
    ['diff', '--name-only', `${buildSource}..HEAD`, '--',
      'unity/VampPonUnity/Assets',
      'unity/VampPonUnity/Packages',
      'unity/VampPonUnity/ProjectSettings'],
    { cwd: root, encoding: 'utf8' },
  ).trim();
  check(runtimeChangesAfterBuild.length === 0, 'completed device evidence is not stale after Unity runtime changes');
  check(install.launchPassed === true && session.launchPassed === true && session.verificationHarnessReached === true, 'completed state has launched physical-device harness');
  check(session.automaticSequenceStarted === true && session.automaticSequenceCompleted === true, 'completed state has completed sequence');
  const expectedAudioEvents = manifest.assets.map((asset: { u28EventId: string }) => asset.u28EventId);
  const expectedHapticEvents = json(`${evidenceRoot}/haptic-event-inventory.json`).events.map((event: { id: string }) => event.id);
  check(Array.isArray(session.requestedAudioEvents) && new Set(session.requestedAudioEvents).size === 22 &&
    expectedAudioEvents.every((id: string) => session.requestedAudioEvents.includes(id)), 'completed session contains every required audio event ID');
  check(Array.isArray(session.requestedHapticEvents) && new Set(session.requestedHapticEvents).size === 10 &&
    expectedHapticEvents.every((id: string) => session.requestedHapticEvents.includes(id)), 'completed session contains every required haptic event ID');
  check(session.audioEventRequestCount >= 22 && session.hapticEventRequestCount >= 10, 'completed session request counts cover all events');
  check(session.supportsHaptics === true && session.hapticCapability === 'Supported', 'completed session used a Core Haptics-capable physical device');
  check(latency.audioLatencyMeasured === true && latency.sampleCount >= 22 &&
    expectedAudioEvents.every((id: string) => latency.eventSampleCounts?.[id] >= 1) &&
    [latency.p50Milliseconds, latency.p95Milliseconds, latency.maxMilliseconds, latency.backgroundRecoveryFirstEventMilliseconds]
      .every((value: unknown) => typeof value === 'number' && Number.isFinite(value) && value >= 0) &&
    latency.humanPerceivedDelayPassed === true, 'completed latency evidence has finite measurements for every audio event');
  check(mix.humanObservationProvided === true && Array.isArray(mix.speakerVolumesReviewed) &&
    mix.speakerVolumesReviewed.length >= 3 && mix.mixReviewPassed === true, 'completed mix evidence covers human speaker review');
  check(haptic.supportsHaptics === true && haptic.nativeAdapterExecuted === true &&
    haptic.eventObservationCount >= 10 && haptic.settingOffPassed === true &&
    haptic.settingOnPassed === true && haptic.cooldownPassed === true &&
    haptic.spamGuardPassed === true && haptic.backgroundForegroundPassed === true &&
    haptic.humanObservationProvided === true && haptic.hapticMeasured === true, 'completed haptic evidence covers execution, settings, guards, lifecycle, and human review');
  check(lifecycle.backgroundObserved === true && lifecycle.foregroundObserved === true &&
    lifecycle.sameProcessConfirmed === true && lifecycle.audioRecovered === true &&
    lifecycle.hapticRecovered === true && lifecycle.passed === true, 'completed lifecycle evidence proves same-process audio/haptic recovery');
  check(requiredHumanAnswers.every((id: string) => human.answers?.[id] === true) &&
    Object.keys(human.answers ?? {}).length === requiredHumanAnswers.length, 'completed human decision answers the exact 18-item review contract');
  check(human.provided === true && human.humanAudioApprovalProvided === true && human.humanHapticApprovalProvided === true && human.overallAccepted === true, 'completed state has explicit human approval');
  check(readiness.audioMixerDeviceVerified === true && readiness.audioMixerReady === true && readiness.audioLatencyMeasured === true && readiness.hapticMeasured === true, 'completed measured readiness flags');
  check(readiness.audioReady === true && readiness.hapticReady === true && readiness.physicalDeviceReady === true && readiness.devicePlayableReady === true, 'completed device readiness');
  check(completion.completed === true && completion.status === 'COMPLETED' && completion.u50Blocked === false, 'completion summary matches ready state');
} else {
  check(readiness.status === 'U49_BLOCKED_BY_PHYSICAL_DEVICE_EVIDENCE', 'incomplete state remains explicitly blocked');
  check(readiness.audioMixerDeviceVerified === false && readiness.audioMixerReady === false && readiness.audioLatencyMeasured === false && readiness.hapticMeasured === false, 'blocked state does not promote measured flags');
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
