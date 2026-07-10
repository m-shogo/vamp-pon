import { existsSync, readFileSync } from 'node:fs';

const failures: string[] = [];

function read(path: string) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function check(label: string, ok: boolean) {
  if (!ok) failures.push(label);
}

const requiredFiles = [
  'docs/unity-ui-design-system-v1.md',
  'docs/design-targets/generated/unity-u46/ui-design-system-readiness.json',
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/YorunoShirubeUiTheme.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/UiThemeRuntime.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/UiVisualState.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/ResponsiveLayoutProfile.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U46UiDesignSystemBootstrap.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U46UiComponentCatalogWindow.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/UiSpriteImportPolicyValidator.cs',
  'unity/VampPonUnity/Assets/_Project/Resources/UI/YorunoShirubeUiTheme.asset',
  'unity/VampPonUnity/Assets/_Project/Resources/UI/YorunoShirubeResponsiveLayout.asset',
];

for (const path of requiredFiles) {
  check(`exists: ${path}`, existsSync(path));
}

const docs = read(requiredFiles[0]);
const readinessText = read(requiredFiles[1]);
const theme = read(requiredFiles[2]);
const themeRuntime = read(requiredFiles[3]);
const visualState = read(requiredFiles[4]);
const responsive = read(requiredFiles[5]);
const bootstrap = read(requiredFiles[6]);
const catalog = read(requiredFiles[7]);
const importValidator = read(requiredFiles[8]);
const themeAsset = read(requiredFiles[9]);
const responsiveAsset = read(requiredFiles[10]);
const factory = read('unity/VampPonUnity/Assets/_Project/Scripts/UI/AppQualityUiFactory.cs');
const tokens = read('unity/VampPonUnity/Assets/_Project/Scripts/UI/AppQualityStyleTokens.cs');
const packageJson = read('package.json');
const readme = read('README.md');
const roadmap = read('docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md');

let readiness: Record<string, unknown> = {};
try {
  readiness = JSON.parse(readinessText);
} catch {
  failures.push('UI design system readiness JSON parses');
}

check('package script exists', packageJson.includes('unity:ui-design-system:check'));
check('theme is ScriptableObject', theme.includes('CreateAssetMenu') && theme.includes('YorunoShirubeUiTheme'));
check('theme runtime uses Resources boundary', themeRuntime.includes('Resources.Load<YorunoShirubeUiTheme>') && themeRuntime.includes('HideAndDontSave'));
check('theme asset references theme script', themeAsset.includes('guid: f463f564582a4f9a80db46cd30327d62'));
check('responsive asset references profile script', responsiveAsset.includes('guid: 2b39a9c766ff4e4a8ec6908bdb445dc9'));
check('visual states include required states', ['Disabled', 'Locked', 'New', 'Rare', 'Completed', 'Kokuyou'].every(state => visualState.includes(state)));
check('responsive tiers exist', ['Compact', 'Standard', 'Large'].every(tier => responsive.includes(tier)));
check('component catalog is editor-only', catalog.includes('EditorWindow') && catalog.includes('Open Component Catalog'));
check('bootstrap creates theme and responsive assets', bootstrap.includes('YorunoShirubeUiTheme.asset') && bootstrap.includes('YorunoShirubeResponsiveLayout.asset'));
check('prefab hierarchy stays shallow', docs.includes('Base → Variant') && docs.includes('2階層'));
check('import validator checks sliced borders', importValidator.includes('Stretchable UI sprite requires a 9-slice border'));
check('factory guards sliced sprites', factory.includes('SupportsSlicing') && factory.includes('ResolveImageType'));
check('legacy tokens bridge to new system', tokens.includes('UiThemeRuntime.Current') && tokens.includes('UiResponsiveRuntime.ResolveCurrentScreen'));
check('docs preserve uGUI runtime', docs.includes('runtime UIはuGUIを維持') && docs.includes('UI ToolkitはEditor専用'));
check('docs cover theme, state, responsive, catalog, import, prefab, atlas', ['ScriptableObject Theme', 'Visual State', 'Responsive Layout', 'Component Catalog', 'Import', 'Prefab Variant', 'Sprite Atlas'].every(term => docs.includes(term)));
check('README links design system', readme.includes('docs/unity-ui-design-system-v1.md'));
check('README reflects Unity product runtime', readme.includes('Unity 6000.5.1f1') && readme.includes('simulatorPlayableCandidateReady=true'));
check('roadmap includes design system gate', roadmap.includes('UI Design System'));

for (const key of [
  'themeFoundationReady',
  'themeAssetReady',
  'responsiveLayoutFoundationReady',
  'responsiveLayoutAssetReady',
  'visualStateFoundationReady',
  'componentCatalogFoundationReady',
  'spriteImportPolicyReady',
  'nineSliceGuardReady',
  'prefabVariantPolicyReady',
  'staticCheckerReady',
]) {
  check(`${key} true`, readiness[key] === true);
}

check('runtime remains uGUI', readiness.runtimeUiSystem === 'uGUI');
check('runtime UI Toolkit migration false', readiness.uiToolkitRuntimeMigrationPlanned === false);
check('prefab variants not falsely generated', readiness.prefabVariantAssetsGenerated === false);
check('simulator candidate preserved', readiness.simulatorPlayableCandidateReady === true);
check('actual device remains not provided', readiness.actualDeviceSmokeResultProvided === false && readiness.actualDeviceSmokeResult === 'NOT_PROVIDED');
for (const key of [
  'candidateAssetsApprovedAsFinal',
  'devicePlayableReady',
  'mobileMetricsReady',
  'audioMixerReady',
  'audioLatencyMeasured',
  'hapticMeasured',
  'rcReady',
  'productionApproved',
]) {
  check(`${key} false`, readiness[key] === false);
}

const slicedAssets = [
  'u45-stage-select-map-panel',
  'u45-stage-card-frame',
  'u45-battle-hud-top-frame',
  'u45-battle-inventory-slot-frame',
  'u45-levelup-card-common',
  'u45-levelup-card-rare',
  'u45-levelup-card-evolution',
  'u45-paper-button-frame',
];

for (const name of slicedAssets) {
  const path = `unity/VampPonUnity/Assets/_Project/Resources/U45Candidates/UI/${name}.png.meta`;
  const meta = read(path);
  check(`meta exists: ${name}`, existsSync(path));
  check(`sprite import: ${name}`, /textureType:\s*8/.test(meta));
  check(`mipmaps disabled: ${name}`, /enableMipMap:\s*0/.test(meta));
  check(`alpha transparency: ${name}`, /alphaIsTransparency:\s*1/.test(meta));
  check(`wrap clamp: ${name}`, /wrapU:\s*1/.test(meta) && /wrapV:\s*1/.test(meta));
  check(`bilinear UI filter: ${name}`, /filterMode:\s*1/.test(meta));
  check(`non-zero 9-slice border: ${name}`, /spriteBorder:\s*\{x:\s*(?!0(?:\.0+)?[,}])[^,]+,\s*y:\s*(?!0(?:\.0+)?[,}])[^,]+,\s*z:\s*(?!0(?:\.0+)?[,}])[^,]+,\s*w:\s*(?!0(?:\.0+)?[,}])[^}]+\}/.test(meta));
}

if (failures.length > 0) {
  console.error('Unity UI design system check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Unity UI design system check passed: theme assets, responsive tiers, visual states, catalog, prefab policy, readiness boundaries, and sliced sprite imports are guarded.');
