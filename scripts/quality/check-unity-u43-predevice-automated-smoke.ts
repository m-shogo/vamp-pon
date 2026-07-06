import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docPath = 'docs/unity-u43-predevice-automated-smoke-2026-07-06.md';
const evidencePath = 'docs/design-targets/generated/unity-u43/predevice-automated-smoke-readiness.json';
const deviceChecklistPath = 'docs/unity-u43-device-playable-smoke-test-checklist-2026-07-06.md';
const runtimePausePath = 'docs/design-targets/generated/unity-u43/runtime-pause-gate-smoke-readiness.json';
const verdictPath = 'docs/design-targets/generated/unity-u43/u43-readiness-verdict.json';
const iosBuildEvidencePath = 'docs/design-targets/generated/unity-u43/ios-build-generation-preflight.json';
const runtimeFiles = [
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U1Stage1SceneBootstrap.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U43RuntimeFeedbackBridge.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Player/PlayerController.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U43PredeviceAutomatedSmokeVerification.cs',
];

function check(label: string, ok: boolean) {
  if (!ok) failures.push(label);
}

function read(path: string) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function hasJsonBool(text: string, key: string, value: boolean) {
  return new RegExp(`"${key}"\\s*:\\s*${value}`).test(text);
}

const doc = read(docPath);
const evidence = read(evidencePath);
const deviceChecklist = read(deviceChecklistPath);
const runtimePause = read(runtimePausePath);
const verdict = read(verdictPath);
const iosBuildEvidence = read(iosBuildEvidencePath);
const runtime = runtimeFiles.map(read).join('\n');
const allText = `${doc}\n${evidence}\n${deviceChecklist}\n${runtimePause}\n${verdict}\n${iosBuildEvidence}\n${runtime}`;

check(`doc exists: ${docPath}`, existsSync(docPath));
check(`evidence exists: ${evidencePath}`, existsSync(evidencePath));
check('package script exists', read('package.json').includes('unity:u43-predevice-automated-smoke:check'));
check('evidenceKind correct', /"evidenceKind": "Editor automated pre-device smoke"/.test(evidence));
check('actual device result not provided', hasJsonBool(evidence, 'actualDeviceSmokeResultProvided', false));
check('actual device result string not provided', /"actualDeviceSmokeResult": "NOT_PROVIDED"/.test(evidence));
check('human check needed', hasJsonBool(evidence, 'humanCheckNeeded', true));
check('device screenshot not provided', /"deviceScreenshot": "DEVICE_SCREENSHOT_NOT_PROVIDED"/.test(evidence));
check('devicePlayableReady false', hasJsonBool(evidence, 'devicePlayableReady', false));
check('mobileMetricsReady false', hasJsonBool(evidence, 'mobileMetricsReady', false));
check('audioMixerReady false', hasJsonBool(evidence, 'audioMixerReady', false));
check('audioLatencyMeasured false', hasJsonBool(evidence, 'audioLatencyMeasured', false));
check('hapticMeasured false', hasJsonBool(evidence, 'hapticMeasured', false));
check('rcReady false', hasJsonBool(evidence, 'rcReady', false));
check('productionApproved false', hasJsonBool(evidence, 'productionApproved', false));

check('StageSelect pause gate exists', runtime.includes('SetOverlayBattlePaused(true)') && runtime.includes('stageSelectPauseGateReady'));
check('Result pause gate exists', runtime.includes('OpenResultOverlay') && runtime.includes('resultPauseGateReady'));
check('StageSelect return pause exists', runtime.includes('stageSelectOverlay.SetActive(true)') && runtime.includes('stageSelectReturnPauseReady'));
check('UI movement collision guard exists', runtime.includes('EventSystem.current.IsPointerOverGameObject') && runtime.includes('IsPointerOverUi'));
check('virtual stick lower-left only exists', runtime.includes('Screen.width * 0.42f') && runtime.includes('Screen.height * 0.34f'));
check('runtime input blocked visible to harness', runtime.includes('RuntimeInputBlocked') && runtime.includes('CurrentVelocity'));
check('AudioClip.Create tone not final SE', runtime.includes('AudioClip.Create') && runtime.includes('not final SE') && /"audioMixerReady": false/.test(evidence));
check('Handheld.Vibrate not final haptic', runtime.includes('Handheld.Vibrate') && runtime.includes('final haptic design stays separate') && /"hapticMeasured": false/.test(evidence));
check('predevice vs actual device separated in docs', doc.includes('pre-device evidence only') && deviceChecklist.includes('actual device smoke result remains NOT_PROVIDED'));
check('actual device evidence not confused with predevice', /"actualDeviceSmokeResultProvided": false/.test(evidence) && /"devicePauseGateConfirmed": false/.test(runtimePause));
check('readiness verdict still device false', /"devicePlayableReady": false/.test(verdict) && /"actualDeviceSmokeResultProvided": false/.test(verdict));
check('no ready or approved true from predevice', !/"devicePlayableReady": true|"mobileMetricsReady": true|"audioMixerReady": true|"audioLatencyMeasured": true|"hapticMeasured": true|"rcReady": true|"productionApproved": true/.test(allText));
check('no actual device smoke result true', !/"actualDeviceSmokeResultProvided": true/.test(allText));
check('no actual pass claim', !/actual device smoke[^.\n]*(pass|passed|approved|ready)/i.test(allText));
check('iOS build evidence exists', existsSync(iosBuildEvidencePath));
check('iOS build not treated as device ready', /"iosBuildGenerationReady": true/.test(evidence) && /"iosBuildGenerationIsDeviceEvidence": false/.test(verdict) && /"deviceRunConfirmed": false/.test(iosBuildEvidence));

for (const name of [
  'unityBatchmodeCompileReady',
  'bootSceneOpenReady',
  'stage1SceneOpenReady',
  'buildSceneReady',
  'proofSceneExcluded',
  'stage1RuntimeBootstrapReady',
  'stageSelectPauseGateReady',
  'battleStartResumeReady',
  'resultPauseGateReady',
  'stageSelectReturnPauseReady',
  'retryRouteReady',
  'uiMovementCollisionGuardReady',
  'virtualStickLowerLeftOnly',
  'audioHookEditorReady',
  'hapticHookEditorReady',
  'editorScreenshotsReady',
  'iosBuildGenerationReady',
]) {
  check(`evidence contains ${name}`, new RegExp(`"${name}"\\s*:`).test(evidence));
}

const shotDir = 'docs/design-targets/generated/unity-u43/predevice-smoke';
for (const shot of [
  '01-stage-select-paused.png',
  '02-battle-started.png',
  '03-result-paused.png',
  '04-stage-select-return.png',
  '05-levelup-overlay-if-possible.png',
]) {
  if (hasJsonBool(evidence, 'editorScreenshotsReady', true)) {
    check(`predevice screenshot exists: ${shot}`, existsSync(join(shotDir, shot)));
  }
}

if (failures.length > 0) {
  console.error('unity U43 predevice automated smoke check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('unity U43 predevice automated smoke check passed: actualDeviceSmokeResult=NOT_PROVIDED, devicePlayableReady=false');
