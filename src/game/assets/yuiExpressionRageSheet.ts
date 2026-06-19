import type Phaser from 'phaser';
import { YUI_EXPRESSION_FRAME_ASSETS, YUI_RAGE_FRAME_ASSETS } from './playerFrames';

export const YUI_EXPRESSION_RAGE_SHEET = {
  id: 'yui_expression_rage_sheet',
  path: 'assets/prototypes/sprite-sheets/yui-expression-rage-original/yui-expression-rage-48-v1.png',
  frameWidth: 180,
  frameHeight: 180,
  endFrame: 47,
} as const;

export const YUI_RAGE_SHEET_FRAME = {
  charge25: 16,
  charge50: 17,
  charge75: 18,
  thresholdShiver: 19,
  triggerCrouch: 20,
  transformPeak: 21,
  idleFront: [22, 23],
  walk: {
    front: [24, 25],
    left: [28, 29],
    right: [26, 27],
    back: [30, 31],
  },
  cast: { front: 32, left: 33, right: 34, back: 35 },
  attack: { front: 36, left: 37, right: 38, back: 39 },
  hurt: 40,
  recoil: 41,
  ultimateStart: 42,
  ultimatePeak: 43,
  ultimateRelease: 44,
  meterEmpty: 45,
  collapse: 46,
  recoverySlow: 47,
} as const;

const deferredIds = new Set<string>([
  ...YUI_EXPRESSION_FRAME_ASSETS.map((asset) => asset.id),
  ...YUI_RAGE_FRAME_ASSETS.map((asset) => asset.id),
]);
const requestedScenes = new WeakSet<Phaser.Scene>();

export function isYuiExpressionRageDeferredAsset(id: string): boolean {
  return deferredIds.has(id);
}

export function requestYuiExpressionRageSheet(scene: Phaser.Scene): void {
  if (scene.textures.exists(YUI_EXPRESSION_RAGE_SHEET.id) || requestedScenes.has(scene)) return;
  requestedScenes.add(scene);
  scene.load.spritesheet(YUI_EXPRESSION_RAGE_SHEET.id, YUI_EXPRESSION_RAGE_SHEET.path, {
    frameWidth: YUI_EXPRESSION_RAGE_SHEET.frameWidth,
    frameHeight: YUI_EXPRESSION_RAGE_SHEET.frameHeight,
    endFrame: YUI_EXPRESSION_RAGE_SHEET.endFrame,
  });
  if (!scene.load.isLoading()) scene.load.start();
}
