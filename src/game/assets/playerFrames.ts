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

const EXPR_ROOT = 'assets/prototypes/sprite-sheets/yui-expression-rage-original-frames/yui';

export const YUI_EXPRESSION_FRAME_IDS = {
  portraitDetermined: 'yui_expr_portrait_determined',
  portraitWorried: 'yui_expr_portrait_worried',
  portraitSad: 'yui_expr_portrait_sad',
  portraitPained: 'yui_expr_portrait_pained',
  portraitAfraid: 'yui_expr_portrait_afraid',
  portraitSurprised: 'yui_expr_portrait_surprised',
  portraitRelieved: 'yui_expr_portrait_relieved',
  portraitExhausted: 'yui_expr_portrait_exhausted',
  portraitTearfulSmile: 'yui_expr_portrait_tearful_smile',
  portraitMemoryAwakened: 'yui_expr_portrait_memory_awakened',
  portraitLanternFocus: 'yui_expr_portrait_lantern_focus',
  portraitProtective: 'yui_expr_portrait_protective',
  cutinUltimateNormal: 'yui_expr_cutin_ultimate_normal',
  portraitInkInvasion: 'yui_expr_portrait_ink_invasion',
  portraitRageThreshold: 'yui_expr_portrait_rage_threshold',
  cutinUltimateBlack: 'yui_expr_cutin_ultimate_black',
} as const;

export const YUI_RAGE_FRAME_IDS = {
  charge25: 'yui_rage_charge_25',
  charge50: 'yui_rage_charge_50',
  charge75: 'yui_rage_charge_75',
  thresholdShiver: 'yui_rage_threshold_shiver',
  triggerCrouch: 'yui_rage_trigger_crouch',
  transformPeak: 'yui_rage_transform_peak',
  idle: {
    front: ['yui_rage_idle_front_a', 'yui_rage_idle_front_b'],
  },
  walk: {
    front: ['yui_rage_walk_front_a', 'yui_rage_walk_front_b'],
    left: ['yui_rage_walk_left_a', 'yui_rage_walk_left_b'],
    right: ['yui_rage_walk_right_a', 'yui_rage_walk_right_b'],
    back: ['yui_rage_walk_back_a', 'yui_rage_walk_back_b'],
  },
  cast: {
    front: 'yui_rage_cast_front',
    left: 'yui_rage_cast_left',
    right: 'yui_rage_cast_right',
    back: 'yui_rage_cast_back',
  },
  attack: {
    front: 'yui_rage_attack_front',
    left: 'yui_rage_attack_left',
    right: 'yui_rage_attack_right',
    back: 'yui_rage_attack_back',
  },
  hurt: 'yui_rage_hurt',
  recoil: 'yui_rage_recoil',
  ultimateStart: 'yui_rage_ultimate_start',
  ultimatePeak: 'yui_rage_ultimate_peak',
  ultimateRelease: 'yui_rage_ultimate_release',
  meterEmpty: 'yui_rage_meter_empty',
  collapse: 'yui_rage_collapse',
  recoverySlow: 'yui_rage_recovery_slow',
} as const;

export const YUI_EXPRESSION_FRAME_ASSETS = [
  { id: YUI_EXPRESSION_FRAME_IDS.portraitDetermined, path: `${EXPR_ROOT}/00_r01_c01_portrait_determined.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 表情 決意', required: false, fallback: false },
  { id: YUI_EXPRESSION_FRAME_IDS.portraitWorried, path: `${EXPR_ROOT}/01_r01_c02_portrait_worried.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 表情 心配', required: false, fallback: false },
  { id: YUI_EXPRESSION_FRAME_IDS.portraitSad, path: `${EXPR_ROOT}/02_r01_c03_portrait_sad.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 表情 悲しみ', required: false, fallback: false },
  { id: YUI_EXPRESSION_FRAME_IDS.portraitPained, path: `${EXPR_ROOT}/03_r01_c04_portrait_pained.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 表情 苦痛', required: false, fallback: false },
  { id: YUI_EXPRESSION_FRAME_IDS.portraitAfraid, path: `${EXPR_ROOT}/04_r01_c05_portrait_afraid.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 表情 恐怖', required: false, fallback: false },
  { id: YUI_EXPRESSION_FRAME_IDS.portraitSurprised, path: `${EXPR_ROOT}/05_r01_c06_portrait_surprised.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 表情 驚き', required: false, fallback: false },
  { id: YUI_EXPRESSION_FRAME_IDS.portraitRelieved, path: `${EXPR_ROOT}/06_r01_c07_portrait_relieved.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 表情 安堵', required: false, fallback: false },
  { id: YUI_EXPRESSION_FRAME_IDS.portraitExhausted, path: `${EXPR_ROOT}/07_r01_c08_portrait_exhausted.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 表情 疲弊', required: false, fallback: false },
  { id: YUI_EXPRESSION_FRAME_IDS.portraitTearfulSmile, path: `${EXPR_ROOT}/08_r02_c01_portrait_tearful_smile.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 表情 涙の微笑み', required: false, fallback: false },
  { id: YUI_EXPRESSION_FRAME_IDS.portraitMemoryAwakened, path: `${EXPR_ROOT}/09_r02_c02_portrait_memory_awakened.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 表情 記憶覚醒', required: false, fallback: false },
  { id: YUI_EXPRESSION_FRAME_IDS.portraitLanternFocus, path: `${EXPR_ROOT}/10_r02_c03_portrait_lantern_focus.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 表情 ランタン集中', required: false, fallback: false },
  { id: YUI_EXPRESSION_FRAME_IDS.portraitProtective, path: `${EXPR_ROOT}/11_r02_c04_portrait_protective.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 表情 庇護', required: false, fallback: false },
  { id: YUI_EXPRESSION_FRAME_IDS.cutinUltimateNormal, path: `${EXPR_ROOT}/12_r02_c05_cutin_ultimate_normal.png`, width: 180, height: 180, kind: 'player', description: 'ユイ カットイン 必殺技通常', required: false, fallback: false },
  { id: YUI_EXPRESSION_FRAME_IDS.portraitInkInvasion, path: `${EXPR_ROOT}/13_r02_c06_portrait_ink_invasion.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 表情 墨侵食', required: false, fallback: false },
  { id: YUI_EXPRESSION_FRAME_IDS.portraitRageThreshold, path: `${EXPR_ROOT}/14_r02_c07_portrait_rage_threshold.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 表情 暴走閾値', required: false, fallback: false },
  { id: YUI_EXPRESSION_FRAME_IDS.cutinUltimateBlack, path: `${EXPR_ROOT}/15_r02_c08_cutin_ultimate_black.png`, width: 180, height: 180, kind: 'player', description: 'ユイ カットイン 必殺技暴走', required: false, fallback: false },
] as const;

export const YUI_RAGE_FRAME_ASSETS = [
  { id: YUI_RAGE_FRAME_IDS.charge25, path: `${EXPR_ROOT}/16_r03_c01_rage_charge_25.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走ゲージ25%', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.charge50, path: `${EXPR_ROOT}/17_r03_c02_rage_charge_50.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走ゲージ50%', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.charge75, path: `${EXPR_ROOT}/18_r03_c03_rage_charge_75.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走ゲージ75%', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.thresholdShiver, path: `${EXPR_ROOT}/19_r03_c04_rage_threshold_shiver.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走閾値震え', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.triggerCrouch, path: `${EXPR_ROOT}/20_r03_c05_rage_trigger_crouch.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走発動うずくまり', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.transformPeak, path: `${EXPR_ROOT}/21_r03_c06_rage_transform_peak.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走変身ピーク', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.idle.front[0], path: `${EXPR_ROOT}/22_r03_c07_rage_idle_front_a.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走待機正面A', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.idle.front[1], path: `${EXPR_ROOT}/23_r03_c08_rage_idle_front_b.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走待機正面B', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.walk.front[0], path: `${EXPR_ROOT}/24_r04_c01_rage_walk_front_a.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走歩行正面A', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.walk.front[1], path: `${EXPR_ROOT}/25_r04_c02_rage_walk_front_b.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走歩行正面B', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.walk.left[0], path: `${EXPR_ROOT}/26_r04_c03_rage_walk_left_a.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走歩行左A', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.walk.left[1], path: `${EXPR_ROOT}/27_r04_c04_rage_walk_left_b.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走歩行左B', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.walk.right[0], path: `${EXPR_ROOT}/28_r04_c05_rage_walk_right_a.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走歩行右A', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.walk.right[1], path: `${EXPR_ROOT}/29_r04_c06_rage_walk_right_b.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走歩行右B', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.walk.back[0], path: `${EXPR_ROOT}/30_r04_c07_rage_walk_back_a.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走歩行背面A', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.walk.back[1], path: `${EXPR_ROOT}/31_r04_c08_rage_walk_back_b.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走歩行背面B', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.cast.front, path: `${EXPR_ROOT}/32_r05_c01_rage_cast_front.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走詠唱正面', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.cast.left, path: `${EXPR_ROOT}/33_r05_c02_rage_cast_left.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走詠唱左', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.cast.right, path: `${EXPR_ROOT}/34_r05_c03_rage_cast_right.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走詠唱右', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.cast.back, path: `${EXPR_ROOT}/35_r05_c04_rage_cast_back.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走詠唱背面', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.attack.front, path: `${EXPR_ROOT}/36_r05_c05_rage_attack_front.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走攻撃正面', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.attack.left, path: `${EXPR_ROOT}/37_r05_c06_rage_attack_left.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走攻撃左', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.attack.right, path: `${EXPR_ROOT}/38_r05_c07_rage_attack_right.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走攻撃右', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.attack.back, path: `${EXPR_ROOT}/39_r05_c08_rage_attack_back.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走攻撃背面', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.hurt, path: `${EXPR_ROOT}/40_r06_c01_rage_hurt.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走被弾', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.recoil, path: `${EXPR_ROOT}/41_r06_c02_rage_recoil.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走のけぞり', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.ultimateStart, path: `${EXPR_ROOT}/42_r06_c03_rage_ultimate_start.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走必殺技開始', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.ultimatePeak, path: `${EXPR_ROOT}/43_r06_c04_rage_ultimate_peak.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走必殺技ピーク', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.ultimateRelease, path: `${EXPR_ROOT}/44_r06_c05_rage_ultimate_release.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走必殺技解放', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.meterEmpty, path: `${EXPR_ROOT}/45_r06_c06_rage_meter_empty.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走ゲージ空', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.collapse, path: `${EXPR_ROOT}/46_r06_c07_rage_collapse.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走崩落', required: false, fallback: false },
  { id: YUI_RAGE_FRAME_IDS.recoverySlow, path: `${EXPR_ROOT}/47_r06_c08_rage_recovery_slow.png`, width: 180, height: 180, kind: 'player', description: 'ユイ 暴走回復（遅）', required: false, fallback: false },
] as const;
