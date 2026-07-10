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
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/YorunoShirubeUiTheme.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/UiThemeRuntime.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/UiVisualState.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/ResponsiveLayoutProfile.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U46UiDesignSystemBootstrap.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U46UiComponentCatalogWindow.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/UiSpriteImportPolicyValidator.cs',
];

for (const path of requiredFiles) {
  check(`exists: ${path}`, existsSync(path));
}

const theme = read(requiredFiles[1]);
const themeRuntime = read(requiredFiles[2]);
const visualState = read(requiredFiles[3]);
const responsive = read(requiredFiles[4]);
const bootstrap = read(requiredFiles[5]);
const catalog = read(requiredFiles[6]);
const importValidator = read(requiredFiles[7]);
const factory = read('unity/VampPonUnity/Assets/_Project/Scripts/UI/AppQualityUiFactory.cs');
const tokens = read('unity/VampPonUnity/Assets/_Project/Scripts/UI/AppQualityStyleTokens.cs');
const docs = read('docs/unity-ui-design-system-v1.md');
const packageJson = read('package.json');
const readme = read('README.md');
const canon = read('docs/181-current-production-canon.md');
const roadmap = read('docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md');

check('package script exists', packageJson.includes('unity:ui-design-system:check'));
check('theme is ScriptableObject', theme.includes('CreateAssetMenu') && theme.includes('YorunoShirubeUiTheme'));
check('theme runtime uses Resources boundary', themeRuntime.includes('Resources.Load<YorunoShirubeUiTheme>') && themeRuntime.includes('HideAndDontSave'));
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
check('canon links design system', canon.includes('docs/unity-ui-design-system-v1.md'));
check('roadmap includes design system gate', roadmap.includes('UI Design System'));

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

console.log('Unity UI design system check passed: theme, responsive tiers, visual states, catalog, prefab policy, and sliced sprite imports are guarded.');
