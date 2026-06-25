const GALLERY_SCENES = [
  'visual-gallery',
  'yui-gallery',
  'combat-mock',
  'evolution-showcase',
  'asset-status',
  'yui-redesign32',
  'yui-redesign42',
  'background-preview',
];

function sceneParam(search = window.location.search): string {
  const params = new URLSearchParams(search);
  return params.get('scene') ?? params.get('debug') ?? '';
}

export function isSpriteInspectorUrl(): boolean {
  return sceneParam() === 'spriteinspector';
}

export function isCore5SpriteSheetPreviewUrl(): boolean {
  return sceneParam() === 'core5sprites';
}

export function isYui96QaUrl(): boolean {
  return sceneParam() === 'yui96-qa';
}

export function isYuiRageCycleQaUrl(): boolean {
  return sceneParam() === 'yui-rage-cycle';
}

export function isCharacterCutinQaUrl(): boolean {
  return sceneParam() === 'cutin-qa';
}

export function isEliteDefeatBeatQaUrl(): boolean {
  return sceneParam() === 'elite-beat-qa';
}

export function isWeaponFeedbackQaUrl(): boolean {
  return sceneParam() === 'weapon-fx-qa';
}

export function isGalleryUrl(): boolean {
  return GALLERY_SCENES.includes(sceneParam());
}

export function isBackgroundPreviewUrl(): boolean {
  return sceneParam() === 'background-preview';
}

export type DevSceneRoute = { guard: () => boolean; sceneName: string; needsPrototypeAssets?: boolean };

export const DEV_SCENE_ROUTES: DevSceneRoute[] = [
  { guard: isSpriteInspectorUrl, sceneName: 'SpriteInspectorScene' },
  { guard: isCore5SpriteSheetPreviewUrl, sceneName: 'Core5SpriteSheetPreviewScene', needsPrototypeAssets: true },
  { guard: isYui96QaUrl, sceneName: 'Yui96QaScene' },
  { guard: isYuiRageCycleQaUrl, sceneName: 'YuiRageCycleQaScene' },
  { guard: isCharacterCutinQaUrl, sceneName: 'CharacterCutinQaScene' },
  { guard: isEliteDefeatBeatQaUrl, sceneName: 'EliteDefeatBeatQaScene' },
  { guard: isWeaponFeedbackQaUrl, sceneName: 'WeaponFeedbackQaScene' },
  { guard: isGalleryUrl, sceneName: 'VisualGalleryScene', needsPrototypeAssets: true },
];
