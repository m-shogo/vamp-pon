import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];

function read(path: string) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function check(label: string, ok: boolean) {
  if (!ok) failures.push(label);
}

function hasJsonBool(text: string, key: string, value: boolean) {
  return new RegExp(`"${key}"\\s*:\\s*${value}`).test(text);
}

const required = [
  'docs/unity-u45-stage-battle-levelup-app-quality-plan-2026-07-06.md',
  'docs/unity-u45-stage-battle-levelup-app-quality-2026-07-06.md',
  'docs/unity-u45-generated-asset-qa-2026-07-06.md',
  'docs/design-targets/generated/unity-u45/u45-app-quality-scope.json',
  'docs/design-targets/generated/unity-u45/u45-app-quality-readiness.json',
  'docs/design-targets/generated/unity-u45/generated-asset-qa.json',
  'docs/design-targets/generated/unity-u45/u45-runtime-connection-map.json',
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/AppQualityStyleTokens.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/AppQualityAssetProvider.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/AppQualityUiFactory.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/AppQualityTapTargets.cs',
];

for (const path of required) check(`exists: ${path}`, existsSync(path));

const plan = read(required[0]);
const report = read(required[1]);
const qaDoc = read(required[2]);
const scope = read(required[3]);
const readiness = read(required[4]);
const qa = read(required[5]);
const map = read(required[6]);
const packageJson = read('package.json');
const u1 = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U1Stage1SceneBootstrap.cs');
const player = read('unity/VampPonUnity/Assets/_Project/Scripts/Player/PlayerController.cs');
const predevice = read('docs/design-targets/generated/unity-u43/predevice-automated-smoke-readiness.json');
const ios = read('docs/design-targets/generated/unity-u43/ios-build-generation-preflight.json');
const allText = `${plan}\n${report}\n${qaDoc}\n${scope}\n${readiness}\n${qa}\n${map}\n${u1}\n${player}\n${predevice}\n${ios}`;

check('package script exists', packageJson.includes('unity:u45-stage-battle-levelup-app-quality:check'));
check('target screens recorded', scope.includes('StageSelect') && scope.includes('BattleHUD') && scope.includes('LevelUp'));
check('candidate assets not final', hasJsonBool(readiness, 'candidateAssetsApprovedAsFinal', false) && !/"candidateAssetsApprovedAsFinal": true/.test(allText));
check('actual device result not provided', hasJsonBool(readiness, 'actualDeviceSmokeResultProvided', false) && /"actualDeviceSmokeResult": "NOT_PROVIDED"/.test(readiness));
check('device screenshot not provided', /"deviceScreenshot": "DEVICE_SCREENSHOT_NOT_PROVIDED"/.test(readiness));
for (const key of ['devicePlayableReady', 'mobileMetricsReady', 'audioMixerReady', 'audioLatencyMeasured', 'hapticMeasured', 'rcReady', 'productionApproved']) {
  check(`${key} false`, hasJsonBool(readiness, key, false) && !new RegExp(`"${key}"\\s*:\\s*true`).test(allText));
}
check('generated images candidate only', allText.includes('candidate-only') && allText.includes('not final'));
check('StageSelect pause gate remains', u1.includes('SetOverlayBattlePaused(true)') && u1.includes('U43StageSelectRuntimeOverlay'));
check('Result pause gate remains', u1.includes('OpenResultOverlay') && u1.includes('U43ResultRuntimeOverlay'));
check('UI movement guard remains', player.includes('EventSystem.current.IsPointerOverGameObject') && player.includes('IsMovementArea') &&
  player.includes('Screen.width * 0.52f') && player.includes('activeTouchId') && player.includes('touch.press.wasPressedThisFrame'));
check('U43 predevice remains valid', predevice.includes('"evidenceKind": "Editor automated pre-device smoke"') && predevice.includes('"actualDeviceSmokeResult": "NOT_PROVIDED"'));
check('U43 iOS preflight remains valid', ios.includes('"evidenceKind": "iOS build generation preflight"') && ios.includes('"iosBuildGenerationReady": true') && ios.includes('"deviceRunConfirmed": false'));
check('AppQualityStyleTokens preserved', read(required[7]).includes('ReferenceWidth = 390f') && read(required[7]).includes('Generated screen images are references only'));
check('tap target rules documented', allText.includes('tap target') || allText.includes('tap targets') || allText.includes('AppQualityTapTargets'));
check('safe area/readability/paper/ink/lantern preserved', allText.includes('Safe Area') && allText.includes('readable') && allText.includes('paper') && allText.includes('black ink') && allText.includes('lantern'));
check('Unity settings listed as not mixed', plan.includes('DefaultVolumeProfile.asset') && plan.includes('ProjectSettings.asset'));

const screenshotDir = 'docs/design-targets/generated/unity-u45/screenshots';
check('screenshots folder exists', existsSync(screenshotDir));
for (const shot of [
  '01-stage-select-app-quality.png',
  '02-battle-hud-app-quality.png',
  '03-levelup-common-card.png',
  '04-levelup-rare-card.png',
  '05-levelup-evolution-card.png',
  '06-mobile-tap-targets.png',
]) {
  check(`screenshot exists: ${shot}`, existsSync(join(screenshotDir, shot)));
}

for (const asset of [
  'u45-stage-select-map-panel',
  'u45-stage-card-frame',
  'u45-battle-hud-top-frame',
  'u45-battle-inventory-slot-frame',
  'u45-virtual-stick-ring',
  'u45-virtual-stick-knob',
  'u45-levelup-card-common',
  'u45-levelup-card-rare',
  'u45-levelup-card-evolution',
  'u45-small-lantern-accent',
  'u45-black-ink-divider',
  'u45-paper-button-frame',
]) {
  check(`docs asset exists: ${asset}`, existsSync(`docs/design-targets/generated/unity-u45/assets/${asset}.png`));
  check(`unity candidate asset exists: ${asset}`, existsSync(`unity/VampPonUnity/Assets/_Project/Resources/U45Candidates/UI/${asset}.png`));
  check(`unity candidate meta exists: ${asset}`, existsSync(`unity/VampPonUnity/Assets/_Project/Resources/U45Candidates/UI/${asset}.png.meta`));
}

if (failures.length > 0) {
  console.error('unity U45 StageSelect/BattleHUD/LevelUp app quality check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('unity U45 StageSelect/BattleHUD/LevelUp app quality check passed: candidates only, device smoke remains NOT_PROVIDED');
