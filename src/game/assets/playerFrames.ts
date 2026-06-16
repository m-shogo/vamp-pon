export type PlayerFacing = 'front' | 'left' | 'right' | 'back';

const ROOT = 'assets/prototypes/sprite-sheets/core5-original-frames/yui';

export const YUI_FRAME_IDS = {
  idle: {
    front: 'yui_core5_idle_front',
    left: 'yui_core5_idle_left',
    right: 'yui_core5_idle_right',
    back: 'yui_core5_idle_back',
  },
  walk: {
    front: ['yui_core5_walk_front_a', 'yui_core5_walk_front_b'],
    left: ['yui_core5_walk_left_a', 'yui_core5_walk_left_b'],
    right: ['yui_core5_walk_right_a', 'yui_core5_walk_right_b'],
    back: ['yui_core5_walk_back_a', 'yui_core5_walk_back_b'],
  },
  hurt: {
    front: 'yui_core5_hurt_front',
    left: 'yui_core5_hurt_left',
    right: 'yui_core5_hurt_right',
    back: 'yui_core5_hurt_back',
  },
  ultimate: 'yui_core5_special_normal',
} as const;

export const YUI_HUD_FRAME_IDS = {
  portraitNeutral: 'yui_core5_portrait_neutral',
  portraitAlt: 'yui_core5_portrait_alt',
  crestNormal: 'yui_core5_crest_normal',
  crestBlack: 'yui_core5_crest_black',
} as const;

export const YUI_GAMEPLAY_FRAME_ASSETS = [
  { id: YUI_FRAME_IDS.idle.front, path: `${ROOT}/00_r01_c01_idle_front.png`, width: 180, height: 180, kind: 'player', description: 'ユイ Core5 front idle（ゲームプレイ候補）', required: false, fallback: true },
  { id: YUI_FRAME_IDS.idle.left, path: `${ROOT}/02_r01_c03_idle_left.png`, width: 180, height: 180, kind: 'player', description: 'ユイ Core5 left idle（ゲームプレイ候補）', required: false, fallback: true },
  { id: YUI_FRAME_IDS.idle.right, path: `${ROOT}/03_r01_c04_idle_right.png`, width: 180, height: 180, kind: 'player', description: 'ユイ Core5 right idle（ゲームプレイ候補）', required: false, fallback: true },
  { id: YUI_FRAME_IDS.idle.back, path: `${ROOT}/04_r01_c05_idle_back.png`, width: 180, height: 180, kind: 'player', description: 'ユイ Core5 back idle（ゲームプレイ候補）', required: false, fallback: true },
  { id: YUI_FRAME_IDS.walk.front[0], path: `${ROOT}/08_r02_c01_walk_front_a.png`, width: 180, height: 180, kind: 'player', description: 'ユイ Core5 front walk A（ゲームプレイ候補）', required: false, fallback: true },
  { id: YUI_FRAME_IDS.walk.front[1], path: `${ROOT}/09_r02_c02_walk_front_b.png`, width: 180, height: 180, kind: 'player', description: 'ユイ Core5 front walk B（ゲームプレイ候補）', required: false, fallback: true },
  // 元シートでは左右向きの見た目がセル名と逆だったため、ゲーム入力に合わせて割り当てを反転する。
  { id: YUI_FRAME_IDS.walk.left[0], path: `${ROOT}/12_r02_c05_walk_right_a.png`, width: 180, height: 180, kind: 'player', description: 'ユイ Core5 left walk A（元シート右ラベルを使用）', required: false, fallback: true },
  { id: YUI_FRAME_IDS.walk.left[1], path: `${ROOT}/13_r02_c06_walk_right_b.png`, width: 180, height: 180, kind: 'player', description: 'ユイ Core5 left walk B（元シート右ラベルを使用）', required: false, fallback: true },
  { id: YUI_FRAME_IDS.walk.right[0], path: `${ROOT}/10_r02_c03_walk_left_a.png`, width: 180, height: 180, kind: 'player', description: 'ユイ Core5 right walk A（元シート左ラベルを使用）', required: false, fallback: true },
  { id: YUI_FRAME_IDS.walk.right[1], path: `${ROOT}/11_r02_c04_walk_left_b.png`, width: 180, height: 180, kind: 'player', description: 'ユイ Core5 right walk B（元シート左ラベルを使用）', required: false, fallback: true },
  { id: YUI_FRAME_IDS.walk.back[0], path: `${ROOT}/14_r02_c07_walk_back_a.png`, width: 180, height: 180, kind: 'player', description: 'ユイ Core5 back walk A（ゲームプレイ候補）', required: false, fallback: true },
  { id: YUI_FRAME_IDS.walk.back[1], path: `${ROOT}/15_r02_c08_walk_back_b.png`, width: 180, height: 180, kind: 'player', description: 'ユイ Core5 back walk B（ゲームプレイ候補）', required: false, fallback: true },
  { id: YUI_FRAME_IDS.hurt.front, path: `${ROOT}/24_r04_c01_hurt_front.png`, width: 180, height: 180, kind: 'player', description: 'ユイ Core5 front hurt（ゲームプレイ候補）', required: false, fallback: true },
  { id: YUI_FRAME_IDS.hurt.left, path: `${ROOT}/25_r04_c02_hurt_left.png`, width: 180, height: 180, kind: 'player', description: 'ユイ Core5 left hurt（ゲームプレイ候補）', required: false, fallback: true },
  { id: YUI_FRAME_IDS.hurt.right, path: `${ROOT}/26_r04_c03_hurt_right.png`, width: 180, height: 180, kind: 'player', description: 'ユイ Core5 right hurt（ゲームプレイ候補）', required: false, fallback: true },
  { id: YUI_FRAME_IDS.hurt.back, path: `${ROOT}/27_r04_c04_hurt_back.png`, width: 180, height: 180, kind: 'player', description: 'ユイ Core5 back hurt（ゲームプレイ候補）', required: false, fallback: true },
  { id: YUI_FRAME_IDS.ultimate, path: `${ROOT}/32_r05_c01_special_normal.png`, width: 180, height: 180, kind: 'player', description: 'ユイ Core5 special normal（ゲームプレイ候補）', required: false, fallback: true },
] as const;

export const YUI_HUD_FRAME_ASSETS = [
  { id: YUI_HUD_FRAME_IDS.portraitNeutral, path: `${ROOT}/40_r06_c01_portrait_neutral.png`, width: 180, height: 180, kind: 'player', description: 'ユイ Core5 HUD portrait neutral', required: false, fallback: true },
  { id: YUI_HUD_FRAME_IDS.portraitAlt, path: `${ROOT}/41_r06_c02_portrait_alt.png`, width: 180, height: 180, kind: 'player', description: 'ユイ Core5 HUD portrait alt', required: false, fallback: true },
  { id: YUI_HUD_FRAME_IDS.crestNormal, path: `${ROOT}/44_r06_c05_crest_normal.png`, width: 180, height: 180, kind: 'player', description: 'ユイ Core5 normal crest HUD icon', required: false, fallback: true },
  { id: YUI_HUD_FRAME_IDS.crestBlack, path: `${ROOT}/45_r06_c06_crest_black.png`, width: 180, height: 180, kind: 'player', description: 'ユイ Core5 berserk crest HUD icon', required: false, fallback: true },
] as const;

export const YUI_GAMEPLAY_FRAME_IDS = YUI_GAMEPLAY_FRAME_ASSETS.map((asset) => asset.id);
