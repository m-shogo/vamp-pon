import { existsSync, readFileSync } from 'node:fs';

const failures: string[] = [];
const expectedCommit = 'eb0aa1b427f426a9a0f06616881c553c2891dfff';
const expectedIdentifier = 'com.mshogo.vamppon.u1';
const expectedOutput = '/Users/m-shogo/Developer/personal/vamp-pon-builds/ios-u45-settings-review';
const paths = {
  reviewDoc: 'docs/unity-u45-settings-post-commit-review-2026-07-10.md',
  repairDoc: 'docs/unity-u45-settings-repair-2026-07-10.md',
  reviewEvidence: 'docs/design-targets/generated/unity-u45/settings-post-commit-review.json',
  repairEvidence: 'docs/design-targets/generated/unity-u45/settings-repair-readiness.json',
  repairScript: 'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U45UnitySettingsRepair.cs',
};

function read(path: string) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function check(label: string, ok: boolean) {
  if (!ok) failures.push(label);
}

for (const path of Object.values(paths)) check(`exists: ${path}`, existsSync(path));

let review: Record<string, unknown> = {};
let repair: Record<string, unknown> = {};
try { review = JSON.parse(read(paths.reviewEvidence)); } catch { failures.push('review evidence JSON parses'); }
try { repair = JSON.parse(read(paths.repairEvidence)); } catch { failures.push('repair evidence JSON parses'); }

const reviewDoc = read(paths.reviewDoc);
const repairDoc = read(paths.repairDoc);
const repairScript = read(paths.repairScript);
const projectSettings = read('unity/VampPonUnity/ProjectSettings/ProjectSettings.asset');
const urpAsset = read('unity/VampPonUnity/Assets/_Project/Settings/U1UniversalRenderPipelineAsset.asset');
const u1Runtime = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U1Stage1SceneBootstrap.cs');
const player = read('unity/VampPonUnity/Assets/_Project/Scripts/Player/PlayerController.cs');
const u45Readiness = read('docs/design-targets/generated/unity-u45/u45-app-quality-readiness.json');
const packageJson = read('package.json');
const combined = `${reviewDoc}\n${repairDoc}\n${JSON.stringify(review)}\n${JSON.stringify(repair)}\n${u45Readiness}`;

check('package script exists', packageJson.includes('unity:u45-settings-repair:check'));
check('review based on settings commit', review.basedOnSettingsCommit === expectedCommit);
check('repair based on settings commit', repair.basedOnSettingsCommit === expectedCommit);
check('repair evidence kind', repair.evidenceKind === 'Unity settings post-commit repair');
check('bundle identifier reviewed', repair.bundleIdentifierReviewed === true);
check('iOS bundle identifier ready', repair.iosBundleIdentifierReady === true);
for (const key of [
  'iosBundleIdentifier',
  'androidBundleIdentifier',
  'standaloneBundleIdentifier',
  'xcodeBundleIdentifier',
  'iosApplicationIdentifier',
  'androidApplicationIdentifier',
  'standaloneApplicationIdentifier',
  'xcodeProductBundleIdentifier',
]) {
  check(`${key} exact`, repair[key] === expectedIdentifier);
}
check('application identifiers serialized', ['Android', 'Standalone', 'iPhone'].every(target => projectSettings.includes(`${target}: ${expectedIdentifier}`)));
check('Apple team ID empty in project', /appleDeveloperTeamID:\s*\n/.test(projectSettings));
check('provisioning profile empty in project', /iOSManualSigningProvisioningProfileID:\s*\n/.test(projectSettings));
check('Apple team not committed', repair.appleDeveloperTeamIdCommitted === false);
check('provisioning profile not committed', repair.provisioningProfileCommitted === false);

for (const key of [
  'defaultVolumeProfileReviewed',
  'defaultProfileNeutral',
  'defaultVolumeProfileUsesUrpBuildPreprocessNormalization',
  'dangerousPostProcessesEffectivelyInactive',
  'urpAssetReviewed',
  'urpGlobalSettingsReviewed',
  'shaderGraphSettingsReviewed',
  'unityBatchmodeCompileReady',
  'unitySettingsVerifyReady',
  'unitySettingsVerificationReady',
  'iosBuildGenerationReady',
]) {
  check(`${key} true`, repair[key] === true);
}
check('iOS build succeeded', repair.iosBuildResult === 'Succeeded' && repair.iosBuildTotalErrors === 0);
check('iOS build output exact', repair.iosBuildOutputPath === expectedOutput);
check('generated build payload recorded', repair.xcodeProjectPresent === true && repair.infoPlistPresent === true && repair.bootAndStage1PayloadPresent === true && repair.candidateAssetsBuildPayloadPresent === true);
check('risky effects neutral in evidence',
  repair.depthOfFieldEffectivelyActive === false &&
  repair.motionBlurEffectivelyActive === false &&
  repair.depthOfFieldActive === false &&
  repair.motionBlurActive === false &&
  repair.bloomIntensity === 0 &&
  repair.vignetteIntensity === 0 &&
  repair.screenSpaceLensFlareIntensity === 0 &&
  repair.chromaticAberrationIntensity === 0 &&
  repair.filmGrainIntensity === 0 &&
  repair.paniniProjectionEffectivelyActive === false &&
  repair.lensDistortionIntensity === 0 &&
  repair.colorLookupContribution === 0);
check('repair script verifies runtime effect state', repairScript.includes('IsEffectInactive<DepthOfField>') && repairScript.includes('IsEffectInactive<MotionBlur>') && repairScript.includes('DepthOfFieldMode.Off'));
check('lens flare support disabled', urpAsset.includes('m_SupportDataDrivenLensFlare: 0') && urpAsset.includes('m_SupportScreenSpaceLensFlare: 0'));
check('Unity required default profile behavior documented', reviewDoc.includes('build preprocessor') && reviewDoc.includes('component `active` flags are not used as the safety criterion'));
check('Default profile not final approved', repairDoc.includes('not final visual approval'));

for (const key of ['deviceInstallAttempted', 'deviceRunConfirmed', 'actualDeviceSmokeResultProvided', 'candidateAssetsApprovedAsFinal', 'devicePlayableReady', 'mobileMetricsReady', 'audioMixerReady', 'audioLatencyMeasured', 'hapticMeasured', 'rcReady', 'productionApproved']) {
  check(`${key} false`, repair[key] === false);
}
check('actual device smoke not provided', repair.actualDeviceSmokeResult === 'NOT_PROVIDED');
check('no guarded readiness true', !/"(actualDeviceSmokeResultProvided|candidateAssetsApprovedAsFinal|devicePlayableReady|mobileMetricsReady|audioMixerReady|audioLatencyMeasured|hapticMeasured|rcReady|productionApproved)"\s*:\s*true/.test(combined));
check('no embedded Apple team value in docs/evidence', !/appleDeveloperTeam(Id|ID)["`:]\s*["`]?[A-Z0-9]{6,}/.test(combined));
check('no embedded provisioning value in docs/evidence', !/provisioning(Profile)?(Id|ID)["`:]\s*["`]?[A-Z0-9-]{8,}/.test(combined));

check('StageSelect pause guard preserved', u1Runtime.includes('SetOverlayBattlePaused(true)') && u1Runtime.includes('SetOverlayBattlePaused(false)'));
check('Result pause guard preserved', u1Runtime.includes('OpenResultOverlay') && u1Runtime.includes('U43ResultRuntimeOverlay'));
check('input/tap guard preserved', player.includes('EventSystem.current.IsPointerOverGameObject') && player.includes('IsMovementArea') &&
  player.includes('Screen.width * 0.52f') && player.includes('activeTouchId') && player.includes('touch.press.wasPressedThisFrame'));
check('U45 candidates remain not final', u45Readiness.includes('"candidateAssetsApprovedAsFinal": false') && u45Readiness.includes('"actualDeviceSmokeResult": "NOT_PROVIDED"'));

if (failures.length > 0) {
  console.error('unity U45 settings repair check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('unity U45 settings repair check passed: settings verified, device smoke remains NOT_PROVIDED');
