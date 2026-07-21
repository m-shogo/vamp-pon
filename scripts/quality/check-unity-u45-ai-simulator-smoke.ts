import { existsSync, readFileSync } from 'node:fs';

const failures: string[] = [];
const expectedIdentifier = 'com.mshogo.vamppon.u1';
const root = 'docs/design-targets/generated/unity-u45';
const smokeRoot = `${root}/ai-simulator-smoke`;
const paths = {
  smokeDoc: 'docs/unity-u45-ai-ios-simulator-smoke-2026-07-10.md',
  visualDoc: 'docs/unity-u45-ai-simulator-visual-review-2026-07-10.md',
  readiness: `${root}/ai-simulator-smoke-readiness.json`,
  visual: `${root}/ai-simulator-visual-review.json`,
  playerResult: `${smokeRoot}/u45-ai-simulator-smoke-result.json`,
  playerLog: `${smokeRoot}/u45-ai-simulator-smoke.log`,
  systemLog: `${smokeRoot}/simulator-system-log.txt`,
  xcodeSummary: `${smokeRoot}/xcodebuild-summary.txt`,
  buildScript: 'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U45IosSimulatorBuild.cs',
  bridge: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Diagnostics/U45AiSimulatorSmokeBridge.cs',
  runtimeVisualReadiness: 'docs/design-targets/generated/unity-runtime-visual-readiness/readiness.json',
  u451Readiness: 'docs/design-targets/generated/unity-u45-1/runtime-dot-readiness.json',
};

const screenshots = [
  '01-stage-select.png',
  '02-battle-hud.png',
  '03-levelup-common.png',
  '04-levelup-rare.png',
  '05-levelup-evolution.png',
  '06-result.png',
  '07-stage-select-return.png',
];

function read(path: string) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function check(label: string, ok: boolean) {
  if (!ok) failures.push(label);
}

for (const path of Object.values(paths)) check(`exists: ${path}`, existsSync(path));
for (const screenshot of screenshots) check(`screenshot exists: ${screenshot}`, existsSync(`${smokeRoot}/${screenshot}`));

let readiness: Record<string, unknown> = {};
let visual: Record<string, unknown> = {};
let player: Record<string, unknown> = {};
let runtimeVisual: Record<string, unknown> = {};
let u451: Record<string, unknown> = {};
try { readiness = JSON.parse(read(paths.readiness)); } catch { failures.push('readiness JSON parses'); }
try { visual = JSON.parse(read(paths.visual)); } catch { failures.push('visual JSON parses'); }
try { player = JSON.parse(read(paths.playerResult)); } catch { failures.push('player result JSON parses'); }
try { runtimeVisual = JSON.parse(read(paths.runtimeVisualReadiness)); } catch { failures.push('runtime visual readiness JSON parses'); }
try { u451 = JSON.parse(read(paths.u451Readiness)); } catch { failures.push('U45.1 readiness JSON parses'); }

const bridge = read(paths.bridge);
const buildScript = read(paths.buildScript);
const smokeDoc = read(paths.smokeDoc);
const packageJson = read('package.json');
const u1Runtime = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U1Stage1SceneBootstrap.cs');
const playerController = read('unity/VampPonUnity/Assets/_Project/Scripts/Player/PlayerController.cs');
const graphics = read('unity/VampPonUnity/ProjectSettings/GraphicsSettings.asset');
const settingsRepair = read(`${root}/settings-repair-readiness.json`);
const candidateReadiness = read(`${root}/u45-app-quality-readiness.json`);

check('package script exists', packageJson.includes('unity:u45-ai-simulator-smoke:check'));
check('bundle identifier exact', readiness.bundleIdentifier === expectedIdentifier && player.bundleIdentifier === expectedIdentifier);
for (const key of [
  'aiSimulatorRuntimeAvailable',
  'aiSimulatorBuildReady',
  'aiSimulatorInstallReady',
  'aiSimulatorLaunchReady',
  'aiSimulatorAutomatedRouteReady',
  'aiSimulatorVisualReviewReady',
  'aiSimulatorCrashFreeDuringSmoke',
  'simulatorPlayableCandidateReady',
  'screenshotsReady',
]) check(`${key} true`, readiness[key] === true);

for (const key of [
  'bootReady', 'stageSelectVisible', 'stageSelectPauseReady', 'stageStartRouteReady', 'battleResumeReady',
  'movementRouteReady', 'movementStopsOnRelease', 'nonStickAreaIgnored', 'uiMovementCollisionGuardReady',
  'enemyHitReady', 'pickupReady', 'levelUpCommonReady', 'levelUpRareReady', 'levelUpEvolutionReady',
  'levelUpTapReady', 'resultPauseReady', 'retryReady', 'stageSelectReturnReady', 'audioHookRequestReady',
  'hapticHookRequestReady', 'screenshotsReady', 'simulatorPlayableCandidateReady',
]) check(`player ${key} true`, player[key] === true);
check('player crash and exception clear', player.unhandledExceptionCount === 0 && player.crashDetected === false);
check('player duplicate objects clear', player.duplicateEventSystemDetected === false && player.duplicateAudioListenerDetected === false);
check('build result recorded', readiness.xcodeBuildResult === 'Succeeded' && readiness.xcodeBuildErrors === 0);
check('visual verdict recorded', visual.overallVerdict === 'PASS_WITH_ISSUES' && Array.isArray(visual.screens) && visual.screens.length === 7);

for (const key of [
  'deviceInstallAttempted', 'deviceRunConfirmed', 'actualDeviceSmokeResultProvided', 'candidateAssetsApprovedAsFinal',
  'devicePlayableReady', 'mobileMetricsReady', 'audioMixerReady', 'audioLatencyMeasured', 'hapticMeasured',
  'rcReady', 'productionApproved',
]) check(`${key} false`, readiness[key] === false);
check('actual device smoke remains NOT_PROVIDED', readiness.actualDeviceSmokeResult === 'NOT_PROVIDED');

check('Simulator route evidence remains valid', runtimeVisual.simulatorRouteEvidenceStillValid === true);
check('U45.1 candidate animation review passed', runtimeVisual.simulatorCandidateAnimationVisualReviewPassed === true);
check('current final art approval is supplied by later U48 evidence', runtimeVisual.simulatorFinalArtApprovalProvided === true);
for (const key of [
  'characterDotRuntimeReady',
  'characterAnimationReady',
  'enemyDotRuntimeReady',
  'enemyAnimationReady',
]) check(`U45.1 independently promotes ${key}`, runtimeVisual[key] === true && u451[key] === true);
check('U45.1 candidate readiness remains historical after U48 supersession', runtimeVisual.runtimeVisualCandidateReady === false && u451.runtimeVisualCandidateReady === true);
check('U45.1 did not promote production runtime visual; U48 now does', runtimeVisual.runtimeVisualReady === true && u451.runtimeVisualReady === false);
for (const key of ['productionCharacterAssetReady', 'productionEnemyAssetReady']) {
  check(`U45.1 cannot promote ${key}; U48 now does`, runtimeVisual[key] === true && u451[key] === false);
}

check('bridge compile guarded', bridge.startsWith('#if VAMPPON_AI_SIMULATOR_SMOKE') && bridge.trimEnd().endsWith('#endif'));
check('launch argument retained', bridge.includes('--u45-ai-simulator-smoke'));
check('normal launch gated', bridge.includes('if (!argumentEnabled && !environmentEnabled) return;'));
check('simulator define is build-local', buildScript.includes('extraScriptingDefines') && buildScript.includes('VAMPPON_AI_SIMULATOR_SMOKE'));
check('settings restore is guaranteed', buildScript.includes('finally') && buildScript.includes('settingsRestored'));
check('device/sdk value not documented as persistent', smokeDoc.includes('Simulator専用値はProjectSettingsへ永続化していない'));
check('runtime UI shader preserved', graphics.includes('{fileID: 10770, guid: 0000000000000000f000000000000000, type: 0}'));

check('StageSelect pause guard preserved', u1Runtime.includes('SetOverlayBattlePaused(true)') && u1Runtime.includes('SetOverlayBattlePaused(false)'));
check('Result pause guard preserved', u1Runtime.includes('OpenResultOverlay') && u1Runtime.includes('U43ResultRuntimeOverlay'));
check('input/tap guard preserved', playerController.includes('EventSystem.current.IsPointerOverGameObject') && playerController.includes('IsMovementArea'));
check('settings repair boundary preserved', settingsRepair.includes('"actualDeviceSmokeResult": "NOT_PROVIDED"') && settingsRepair.includes('"productionApproved": false'));
check('candidate-only boundary preserved', candidateReadiness.includes('"candidateAssetsApprovedAsFinal": false') && candidateReadiness.includes('"devicePlayableReady": false'));

if (failures.length > 0) {
  console.error('unity U45 AI Simulator smoke check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('unity U45 AI Simulator smoke check passed: U45 route and U45.1 candidate evidence remain historical; U48 production readiness is independently verified.');
