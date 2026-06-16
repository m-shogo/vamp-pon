import { YUI_GAMEPLAY_FRAME_ASSETS, YUI_HUD_FRAME_ASSETS } from './playerFrames';

/**
 * アセット定義の正本。
 * 「どの素材が必要か / どこに置くか / サイズ / 用途 / fallbackの有無」をコードで管理する。
 *
 * 重要:
 * - 画像が無い間は Phaser Graphics の fallback で動く（壊れない）。
 * - id は Phaser のテクスチャキー。命名規約は path のファイル名と対応させる。
 * - 制作優先順位・作り方は docs/art-pipeline.md / docs/sprite-size-guide.md。
 */

export type AssetKind = 'player' | 'enemy' | 'pickup' | 'rare' | 'weapon' | 'evolved' | 'ui' | 'tile';

export type AssetId = string;

export type AssetManifestEntry = {
  id: AssetId;
  /** Vite公開ルート(public/)からの相対パス。Phaser は this.load.image(id, path) で読む。 */
  path: string;
  width: number;
  height: number;
  kind: AssetKind;
  description: string;
  /** 本素材として必須か（false は任意/アニメ差分など）。 */
  required: boolean;
  /** 画像が無い時に Graphics fallback があるか。 */
  fallback: boolean;
};

const SPRITES = 'assets/sprites';

export const assetManifest: AssetManifestEntry[] = [
  // --- 背景タイル ---
  { id: 'bg_stage1_paper_night', path: `${SPRITES}/tiles/bg_stage1_paper_night_tile.png`, width: 128, height: 128, kind: 'tile', description: 'Stage1 夜の街の床（紙質・藍紫・繰り返し）', required: true, fallback: true },

  // --- プレイヤー ---
  { id: 'yui_idle', path: `${SPRITES}/player/yui_idle_42.png`, width: 42, height: 42, kind: 'player', description: 'ユイ 立ち（42pxネイティブ / hand-final candidate）', required: true, fallback: true },
  { id: 'yui_move', path: `${SPRITES}/player/yui_move_42.png`, width: 42, height: 42, kind: 'player', description: 'ユイ 移動（42pxネイティブ / idle差分 / hand-final candidate）', required: false, fallback: true },
  { id: 'yui_hurt', path: `${SPRITES}/player/yui_hurt_42.png`, width: 42, height: 42, kind: 'player', description: 'ユイ 被弾（42pxネイティブ / 一瞬のリアクション差分 / hand-final candidate）', required: false, fallback: true },
  { id: 'yui_ultimate', path: `${SPRITES}/player/yui_ultimate_42.png`, width: 42, height: 42, kind: 'player', description: 'ユイ 奥義（42pxネイティブ / hand-final candidate）', required: false, fallback: true },
  ...YUI_GAMEPLAY_FRAME_ASSETS,
  ...YUI_HUD_FRAME_ASSETS,

  // --- 敵（enemy visualKind に対応） ---
  { id: 'enemy_ink_blob', path: `${SPRITES}/enemies/enemy_ink_blob_24.png`, width: 24, height: 24, kind: 'enemy', description: 'インクの影（基本）', required: true, fallback: true },
  { id: 'enemy_paper_scrap', path: `${SPRITES}/enemies/enemy_paper_scrap_24.png`, width: 24, height: 24, kind: 'enemy', description: '紙くずの影', required: true, fallback: true },
  { id: 'enemy_signpost', path: `${SPRITES}/enemies/enemy_signpost_24.png`, width: 24, height: 24, kind: 'enemy', description: '迷子の方角（標識の影）', required: true, fallback: true },
  { id: 'enemy_capsule', path: `${SPRITES}/enemies/enemy_capsule_24.png`, width: 24, height: 24, kind: 'enemy', description: '黒いカプセル（硬い影）', required: true, fallback: true },
  { id: 'enemy_haze', path: `${SPRITES}/enemies/enemy_haze_24.png`, width: 24, height: 24, kind: 'enemy', description: '夜のもや（霧の影）', required: true, fallback: true },
  { id: 'enemy_elite_label', path: `${SPRITES}/enemies/enemy_elite_label_32.png`, width: 32, height: 32, kind: 'enemy', description: '黒ラベルの影（エリート）', required: true, fallback: true },

  // --- 拾得物 ---
  { id: 'pickup_memory_fragment', path: `${SPRITES}/pickups/pickup_memory_fragment_12.png`, width: 12, height: 12, kind: 'pickup', description: '記憶の欠片（金の星・柔光）', required: true, fallback: true },
  { id: 'pickup_heal_paper', path: `${SPRITES}/pickups/pickup_heal_paper_14.png`, width: 14, height: 14, kind: 'pickup', description: '回復（朝色の包帯紙）', required: true, fallback: true },
  { id: 'pickup_capsule', path: `${SPRITES}/pickups/pickup_capsule_16.png`, width: 16, height: 16, kind: 'pickup', description: '記憶カプセル（コルク瓶＋星）', required: true, fallback: true },

  // --- レアアイテム ---
  { id: 'rare_name_tag', path: `${SPRITES}/pickups/rare_name_tag_16.png`, width: 16, height: 16, kind: 'rare', description: '誰かの名前札', required: true, fallback: true },
  { id: 'rare_cracked_lens', path: `${SPRITES}/pickups/rare_cracked_lens_16.png`, width: 16, height: 16, kind: 'rare', description: 'ひび割れたレンズ', required: true, fallback: true },
  { id: 'rare_sealed_letter', path: `${SPRITES}/pickups/rare_sealed_letter_16.png`, width: 16, height: 16, kind: 'rare', description: '封のされた手紙', required: true, fallback: true },
  { id: 'rare_wind_mark', path: `${SPRITES}/pickups/rare_wind_mark_16.png`, width: 16, height: 16, kind: 'rare', description: '風のしるし', required: true, fallback: true },

  // --- 通常武器（弾/範囲） ---
  { id: 'weapon_night_pencil', path: `${SPRITES}/weapons/weapon_night_pencil_projectile.png`, width: 16, height: 8, kind: 'weapon', description: '夜の鉛筆の弾（紙の濃い線）', required: true, fallback: true },
  { id: 'weapon_marble', path: `${SPRITES}/weapons/weapon_marble_projectile.png`, width: 12, height: 12, kind: 'weapon', description: 'ビー玉（ガラス玉）', required: true, fallback: true },
  { id: 'weapon_bookmark_orbit', path: `${SPRITES}/weapons/weapon_bookmark_orbit.png`, width: 12, height: 16, kind: 'weapon', description: '月のしおり（オービター）', required: true, fallback: true },
  { id: 'weapon_ink_area', path: `${SPRITES}/weapons/weapon_ink_area_tile.png`, width: 64, height: 64, kind: 'weapon', description: '黒インクの小瓶の範囲（インク染み）', required: true, fallback: true },
  { id: 'weapon_stardust', path: `${SPRITES}/weapons/weapon_stardust_projectile.png`, width: 12, height: 12, kind: 'weapon', description: '星くず弾（小さな金の星）', required: true, fallback: true },
  { id: 'weapon_postcard_blade', path: `${SPRITES}/weapons/weapon_postcard_blade_projectile.png`, width: 16, height: 10, kind: 'weapon', description: '絵はがきカッター（紙刃）', required: true, fallback: true },
  { id: 'weapon_paper_airplane', path: `${SPRITES}/weapons/weapon_paper_airplane_projectile.png`, width: 16, height: 12, kind: 'weapon', description: '紙ひこうき', required: true, fallback: true },
  { id: 'weapon_streetlamp_area', path: `${SPRITES}/weapons/weapon_streetlamp_area_tile.png`, width: 128, height: 128, kind: 'weapon', description: '街灯の輪の範囲（暖かい丸光）', required: true, fallback: true },

  // --- 強化進化 / 合体 / 覚醒（弾/範囲） ---
  { id: 'evolved_unfinished_line', path: `${SPRITES}/evolved/evolved_unfinished_line_projectile.png`, width: 24, height: 10, kind: 'evolved', description: '未完成の一行（長い鉛筆の一行）強化進化', required: true, fallback: true },
  { id: 'evolved_north_star_lantern', path: `${SPRITES}/evolved/evolved_north_star_lantern_projectile.png`, width: 16, height: 16, kind: 'evolved', description: '北極星のランタン（紙の灯り）強化進化', required: true, fallback: true },
  { id: 'evolved_dawn_ink_lamp', path: `${SPRITES}/evolved/evolved_dawn_ink_lamp_area.png`, width: 128, height: 128, kind: 'evolved', description: '夜明けのインク灯（インク＋街灯＋朝色）合体', required: true, fallback: true },
  { id: 'awakened_unforgotten_name', path: `${SPRITES}/evolved/awakened_unforgotten_name_projectile.png`, width: 24, height: 12, kind: 'evolved', description: '消えない名前（鉛筆線＋名前札）覚醒', required: true, fallback: true },
  { id: 'awakened_memory_marble', path: `${SPRITES}/evolved/awakened_memory_marble_projectile.png`, width: 16, height: 16, kind: 'evolved', description: '追憶のビー玉（ひび割れガラス）覚醒', required: true, fallback: true },
  { id: 'awakened_addressless_blade', path: `${SPRITES}/evolved/awakened_addressless_blade_projectile.png`, width: 18, height: 12, kind: 'evolved', description: '宛先のない刃（封筒の切れ目）覚醒', required: true, fallback: true },
  { id: 'awakened_tailwind_plane', path: `${SPRITES}/evolved/awakened_tailwind_plane_projectile.png`, width: 20, height: 16, kind: 'evolved', description: '追い風の紙ひこうき覚醒', required: true, fallback: true },

  // --- UIカード ---
  { id: 'ui_card_paper_normal', path: `${SPRITES}/ui/ui_card_paper_normal.png`, width: 320, height: 144, kind: 'ui', description: 'レベルアップカード 紙（ふつう）', required: true, fallback: true },
  { id: 'ui_card_paper_good', path: `${SPRITES}/ui/ui_card_paper_good.png`, width: 320, height: 144, kind: 'ui', description: 'レベルアップカード 紙（良い）', required: true, fallback: true },
  { id: 'ui_card_paper_rare', path: `${SPRITES}/ui/ui_card_paper_rare.png`, width: 320, height: 144, kind: 'ui', description: 'レベルアップカード 紙（大当たり）', required: true, fallback: true },
];

export const assetById = new Map(assetManifest.map((a) => [a.id, a]));

/** 敵 visualKind → アセットid（factory / gallery が参照）。 */
export const ENEMY_ASSET: Record<string, AssetId> = {
  ink_blob: 'enemy_ink_blob',
  paper_scrap: 'enemy_paper_scrap',
  signpost: 'enemy_signpost',
  capsule: 'enemy_capsule',
  haze: 'enemy_haze',
  label_elite: 'enemy_elite_label',
};

/** 武器id → アセットid（弾/範囲）。 */
export const WEAPON_ASSET: Record<string, AssetId> = {
  night_pencil: 'weapon_night_pencil',
  marble: 'weapon_marble',
  moon_bookmark: 'weapon_bookmark_orbit',
  black_ink_bottle: 'weapon_ink_area',
  stardust_shot: 'weapon_stardust',
  postcard_blade: 'weapon_postcard_blade',
  paper_airplane: 'weapon_paper_airplane',
  streetlamp_ring: 'weapon_streetlamp_area',
  unfinished_line: 'evolved_unfinished_line',
  north_star_lantern: 'evolved_north_star_lantern',
  dawn_ink_lamp: 'evolved_dawn_ink_lamp',
  unforgotten_name: 'awakened_unforgotten_name',
  memory_marble: 'awakened_memory_marble',
  addressless_blade: 'awakened_addressless_blade',
  tailwind_plane: 'awakened_tailwind_plane',
};

/** レアアイテムid → アセットid。 */
export const RARE_ASSET: Record<string, AssetId> = {
  name_tag: 'rare_name_tag',
  cracked_lens: 'rare_cracked_lens',
  sealed_letter: 'rare_sealed_letter',
  wind_mark: 'rare_wind_mark',
};
