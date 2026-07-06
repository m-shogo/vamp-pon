import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docs = [
  'docs/unity-u43-device-p0-playable-runtime-repair-plan-2026-07-05.md',
  'docs/unity-u43-build-scene-audit-2026-07-05.md',
  'docs/unity-u43-character-runtime-asset-repair-2026-07-05.md',
  'docs/unity-u43-mobile-touch-movement-repair-2026-07-05.md',
  'docs/unity-u43-ui-tap-repair-2026-07-05.md',
  'docs/unity-u43-runtime-visual-design-connection-repair-2026-07-05.md',
  'docs/unity-u43-audio-runtime-repair-2026-07-05.md',
  'docs/unity-u43-haptic-runtime-repair-2026-07-05.md',
  'docs/unity-u43-device-failure-addendum-2026-07-05.md',
  'docs/unity-u43-device-p0-playable-runtime-repair-verdict-2026-07-05.md',
  'docs/unity-u43-device-p0-playable-runtime-repair-review-2026-07-05.md',
  'docs/unity-u43-device-playable-smoke-test-checklist-2026-07-06.md',
  'docs/unity-u43-runtime-pause-gate-evidence-2026-07-06.md',
];
const artifacts = [
  'build-scene-audit.json',
  'character-runtime-asset-repair.json',
  'mobile-touch-movement-repair.json',
  'ui-tap-repair.json',
  'runtime-visual-design-connection-repair.json',
  'audio-runtime-repair.json',
  'haptic-runtime-repair.json',
  'device-failure-addendum.json',
  'u43-readiness-verdict.json',
  'runtime-pause-gate-smoke-readiness.json',
];
const screenshots = [
  '01-runtime-stageselect.png',
  '02-runtime-battle-player-dot.png',
  '03-runtime-touch-movement.png',
  '04-runtime-levelup-tap.png',
  '05-runtime-result-tap.png',
  '06-runtime-audio-haptic-hooks.png',
];

function check(label: string, ok: boolean) {
  if (!ok) failures.push(label);
}
function read(path: string) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}
function walk(root: string): string[] {
  if (!existsSync(root)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(root)) {
    const path = join(root, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) out.push(...walk(path));
    if (stat.isFile()) out.push(path);
  }
  return out;
}
function pngSize(path: string) {
  const data = readFileSync(path);
  return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
}

for (const doc of docs) check(`doc exists: ${doc}`, existsSync(doc));
for (const artifact of artifacts) check(`artifact exists: ${artifact}`, existsSync(join('docs/design-targets/generated/unity-u43', artifact)));
for (const shot of screenshots) {
  const path = join('docs/design-targets/generated/unity-u43/screenshots', shot);
  check(`screenshot exists: ${shot}`, existsSync(path));
  if (existsSync(path)) {
    const size = pngSize(path);
    check(`screenshot is 390x844: ${shot}`, size.width === 390 && size.height === 844);
  }
}

const docsText = docs.map(read).join('\n');
const artifactText = artifacts.map((artifact) => read(join('docs/design-targets/generated/unity-u43', artifact))).join('\n');
const runtimeFiles = walk('unity/VampPonUnity/Assets/_Project/Scripts').filter((path) => !path.includes('/Editor/'));
const runtime = runtimeFiles.map(read).join('\n');
const stage1Bootstrap = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U1Stage1SceneBootstrap.cs');
const packageJson = read('package.json');
const buildSettings = read('unity/VampPonUnity/ProjectSettings/EditorBuildSettings.asset');
const yuiMeta = read('unity/VampPonUnity/Assets/_Project/Resources/U5Candidates/Battle/u5-yui-battle-candidate.png.meta');
const ombuMeta = read('unity/VampPonUnity/Assets/_Project/Resources/U5Candidates/Battle/u5-ombu-battle-candidate.png.meta');
const allText = `${docsText}\n${artifactText}\n${runtime}`;

check('package script exists', packageJson.includes('unity:u43-device-p0-playable-runtime-repair:check'));
check('build scene boot included', /Assets\/_Project\/Scenes\/Boot\/Boot\.unity/.test(buildSettings));
check('build scene stage1 included', /Assets\/_Project\/Scenes\/Stage1\/Stage1\.unity/.test(buildSettings));
check('proof scene not in build settings', !/Assets\/_Project\/Scenes\/Proof\//.test(buildSettings));
check('touch input implemented', runtime.includes('DevicePointerMoveInputSource') && runtime.includes('Touchscreen.current') && runtime.includes('CompositeMoveInputSource'));
check('EventSystem implemented', runtime.includes('InputSystemUIInputModule') && runtime.includes('EnsureEventSystem'));
check('StageSelect runtime overlay implemented', runtime.includes('U43StageSelectRuntimeOverlay') && runtime.includes('Stage1へ'));
check('Result retry runtime overlay implemented', runtime.includes('U43ResultRuntimeOverlay') && runtime.includes('Retry') && runtime.includes('StageSelect'));
check('StageSelect battle paused before start', /CreateStageSelectOverlay\(\);\s*SetOverlayBattlePaused\(true\);/s.test(runtime) && /stageSelectOverlay\.SetActive\(false\);\s*SetOverlayBattlePaused\(false\);/s.test(runtime));
check('Result battle paused while open', /OpenResultOverlay\(bool clear\)[\s\S]*SetOverlayBattlePaused\(true\);\s*resultOverlay\.SetActive\(true\);/.test(runtime));
check('StageSelect return keeps battle paused', /resultOverlay\.SetActive\(false\);\s*stageSelectOverlay\.SetActive\(true\);\s*SetOverlayBattlePaused\(true\);/.test(runtime));
check('Battle update pause gate exists', /private bool runtimePaused = true;/.test(runtime) && /public bool IsRuntimePaused => runtimePaused;/.test(runtime) && /if \(runtimePaused\)[\s\S]*return;[\s\S]*elapsedSeconds \+= Time\.deltaTime;/.test(runtime));
check('Overlay movement input blocked', /SetRuntimeInputBlocked\(paused\)/.test(runtime) && /public void SetRuntimeInputBlocked\(bool blocked\)/.test(runtime) && /if \(runtimeInputBlocked\)[\s\S]*return;/.test(runtime));
check('UI tap movement collision guard exists', runtime.includes('EventSystem.current.IsPointerOverGameObject') && runtime.includes('IsPointerOverUi') && runtime.includes('dragging = false'));
check('Virtual stick lower-left only', runtime.includes('Screen.width * 0.42f') && runtime.includes('Screen.height * 0.34f'));
check('Audio listener/source implemented', runtime.includes('AudioListener') && runtime.includes('AudioSource') && runtime.includes('PlayOneShot'));
check('Haptic runtime hook implemented', runtime.includes('Handheld.Vibrate') && runtime.includes('HapticRuntimeHookReady'));
check('Feedback bridge boundary explicit', runtime.includes('UsesRuntimeHookToneOnly') && runtime.includes('AudioMixerReady => false') && runtime.includes('AudioLatencyMeasured => false') && runtime.includes('HapticMeasured => false') && runtime.includes('not final SE') && runtime.includes('final haptic design stays separate'));
check('Battle feedback hooks implemented', runtime.includes('SetRuntimeFeedbackBridge') && runtime.includes('PlayPickup') && runtime.includes('PlayEnemyHit'));
check('LevelUp tap hooks implemented', runtime.includes('PlayLevelUp') && runtime.includes('PaperCard') && runtime.includes('PlayButtonTapIfAvailable'));
check('Runtime player dot object named', runtime.includes('YuiRuntimeDotCharacter'));
check('Point filter runtime implemented', runtime.includes('FilterMode.Point'));
check('Yui import point filter', /filterMode: 0/.test(yuiMeta));
check('Ombu import point filter', /filterMode: 0/.test(ombuMeta));

for (const value of [
  'buildSceneCorrect',
  'characterRuntimeAssetReady',
  'mobileTouchMovementReady',
  'uiTapReady',
  'runtimeVisualConnectionReady',
  'audioRuntimeHookReady',
  'hapticRuntimeHookReady',
  'devicePlayableReady',
  'stageSelectBattlePaused',
  'resultBattlePaused',
  'uiPointerMovementCollisionGuard',
  'virtualStickLowerLeftOnly',
  'DEVICE_SCREENSHOT_NOT_PROVIDED',
]) {
  check(`contains ${value}`, allText.includes(value));
}

check('verdict build true', /"buildSceneCorrect": true/.test(artifactText));
check('verdict character true', /"characterRuntimeAssetReady": true/.test(artifactText));
check('verdict touch true', /"mobileTouchMovementReady": true/.test(artifactText));
check('verdict tap true', /"uiTapReady": true/.test(artifactText));
check('verdict visual true', /"runtimeVisualConnectionReady": true/.test(artifactText));
check('verdict audio hook true', /"audioRuntimeHookReady": true/.test(artifactText));
check('verdict haptic hook true', /"hapticRuntimeHookReady": true/.test(artifactText));
check('stage select paused true', /"stageSelectBattlePaused": true/.test(artifactText));
check('result paused true', /"resultBattlePaused": true/.test(artifactText));
check('overlay movement blocked true', /"overlayMovementBlocked": true/.test(artifactText));
check('ui movement collision guard true', /"uiPointerMovementCollisionGuard": true/.test(artifactText));
check('virtual stick lower-left true', /"virtualStickLowerLeftOnly": true/.test(artifactText));
check('runtime tone not final SE', /"runtimeToneFinalSe": false/.test(artifactText));
check('device vibrate not final haptic', /"deviceVibrateFinalHaptic": false/.test(artifactText));
check('verdict device playable false', /"devicePlayableReady": false/.test(artifactText));
check('mobile metrics false', /"mobileMetricsReady": false/.test(artifactText));
check('audio mixer false', /"audioMixerReady": false/.test(artifactText));
check('audio latency false', /"audioLatencyMeasured": false/.test(artifactText));
check('haptic measured false', /"hapticMeasured": false/.test(artifactText));
check('rc false', /"rcReady": false/.test(artifactText));
check('production false', /"productionApproved": false/.test(artifactText));

check('No productionApproved true', !/"productionApproved": true|productionApproved=1|productionApproved\s*=\s*1|ProductionApproved\s*=\s*true/.test(allText));
check('No rcReady true', !/"rcReady": true|rcReady=true|RcReady\s*=\s*true/.test(allText));
check('No mobileMetricsReady true', !/"mobileMetricsReady": true|mobileMetricsReady=true|MobileMetricsReady\s*=\s*true/.test(allText));
check('No audio mixer ready true', !/"audioMixerReady": true|audioMixerReady=true|AudioMixerReady\s*=\s*true/.test(allText));
check('No audio latency measured true', !/"audioLatencyMeasured": true|audioLatencyMeasured=true/.test(allText));
check('No haptic measured true', !/"hapticMeasured": true|hapticMeasured=true|HapticMeasured\s*=\s*true/.test(allText));
check('No device playable true', !/"devicePlayableReady": true|devicePlayableReady=true|DevicePlayableReady\s*=\s*true/.test(allText));
check('No code-name UI title string in Stage1 runtime', !stage1Bootstrap.includes('Vamp Pon') && stage1Bootstrap.includes('ヨルノシルベ'));
check('No runtime docs generated refs', !/docs\/design-targets\/generated/.test(runtime));
check('No generated final image runtime paste', !/top-final|kokuyou-cutin-final|generated\/.*\.png|completed screen image/i.test(runtime));
check('No Addressables folder', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('Cloud Save API not introduced', !/CloudSaveService|Unity\.Services\.CloudSave|CloudSave\.Models/i.test(runtime));
check('No forbidden term string', !allText.includes('黒曜化'));

if (failures.length > 0) {
  console.error('unity U43 device P0 playable runtime repair check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U43 device P0 playable runtime repair check passed: docs=${docs.length}, artifacts=${artifacts.length}, screenshots=${screenshots.length}, devicePlayableReady=false`);
