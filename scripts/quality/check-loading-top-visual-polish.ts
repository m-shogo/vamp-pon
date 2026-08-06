import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const coordinator = readFileSync(
  join(
    root,
    'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/LoadingTopVisualPolishCoordinator.cs',
  ),
  'utf8',
);
const loading = readFileSync(
  join(
    root,
    'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/LoadingSeasonalView.cs',
  ),
  'utf8',
);
const top = readFileSync(
  join(
    root,
    'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/TopLivingNightView.cs',
  ),
  'utf8',
);
const manifest = JSON.parse(
  readFileSync(
    join(
      root,
      'docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json',
    ),
    'utf8',
  ),
) as {
  executed: boolean;
  result: string;
  expectedCaptureCount: number;
  captureCount: number;
};

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

for (const token of [
  'LoadingSeasonalProgressTrack',
  'LoadingSeasonalProgressFill',
  '夜の記憶をひらいています…',
  'new Vector2(.15f, .0272f)',
  'new Vector2(.85f, .0294f)',
  'new Color(.80f, .84f, .84f, .76f)',
  'Mathf.Sin(Time.unscaledTime * 2.25f)',
]) {
  invariant(coordinator.includes(token), `loading polish contract missing: ${token}`);
}

for (const token of [
  'ExpectedTopLayerNames',
  'TopLivingNightArt',
  'TopLivingNightSafeArea',
  'topArtGroup.alpha = 0f',
  'topUiGroup.alpha = 0f',
  'hiddenUntilTextureReady',
  'image.texture == null',
  'hidden.a = 0f',
  'AreBaseLayersReady()',
  'StartTopReveal(false)',
  'TopReadyTimeout',
  'IsCurrentTopReady = true',
]) {
  invariant(coordinator.includes(token), `TOP blank-screen guard missing: ${token}`);
}

for (const token of [
  'PreloadEditorBaseLayers',
  'top-living-night-v2',
  'TextureFormat.RGBA32',
  'texture.LoadImage(File.ReadAllBytes(path), true)',
  '00-environment-starless.png',
  '10-fire-flipbook-atlas.png',
  '14-foreground-accents.png',
]) {
  invariant(coordinator.includes(token), `TOP editor preload contract missing: ${token}`);
}

invariant(
  loading.includes('"夜の記憶をひらいています…"'),
  'production loading copy must remain canonical',
);
invariant(
  top.includes('new Color(.014f, .018f, .055f, 1f)'),
  'TOP dark fallback blocker must remain present',
);
invariant(
  top.includes('image.color = new Color(1f, 1f, 1f, alpha)'),
  'checker expects coordinator to guard the existing RawImage white default',
);

invariant(manifest.expectedCaptureCount === 15, 'capture matrix must remain 15 frames');
if (manifest.executed) {
  invariant(manifest.result === 'PASSED', 'executed capture pack must be PASSED');
  invariant(manifest.captureCount === 15, 'executed capture pack must contain 15 frames');
} else {
  invariant(manifest.result === 'NOT_RUN', 'pending visual recapture must be honest NOT_RUN');
  invariant(manifest.captureCount === 0, 'pending visual recapture count must be zero');
}

console.log('Loading/TOP visual polish: PASS');
console.log('loading: thin pale progress line + canonical copy + subtle pulse');
console.log('TOP: dark fallback + null-texture suppression + readiness fade');
console.log('Editor: synchronous final-layer preload before visual capture');
