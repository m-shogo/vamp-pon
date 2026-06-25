import { inventoryIconAssetEntries } from './inventoryIcons.ts';
import {
  YUI_EXPRESSION_FRAME_ASSETS,
  YUI_GAMEPLAY_FRAME_ASSETS,
  YUI_HUD_FRAME_ASSETS,
  YUI_RAGE_FRAME_ASSETS,
} from './playerFrames.ts';

export type AssetKind = 'player' | 'enemy' | 'pickup' | 'rare' | 'weapon' | 'evolved' | 'ui' | 'tile';
export type AssetId = string;

export type AssetManifestEntry = {
  id: AssetId;
  /** public/ からの相対パス。fallback-only entry は path を持たない。 */
  path?: string;
  width: number;
  height: number;
  kind: AssetKind;
  description: string;
  required: boolean;
  fallback: boolean;
};

function fallbackOnly(
  id: AssetId,
  kind: AssetKind,
  description: string,
  width = 1,
  height = 1,
): AssetManifestEntry {
  return {
    id,
    width,
    height,
    kind,
    description,
    required: false,
    fallback: true,
  };
}

/**
 * 実画像の正本は prototypes 配下。
 * 旧 public/assets/sprites は削除済みで、対応するIDはGraphics fallback用にだけ残す。
 */
export const assetManifest: AssetManifestEntry[] = [
  ...YUI_GAMEPLAY_FRAME_ASSETS,
  ...YUI_HUD_FRAME_ASSETS,
  ...YUI_EXPRESSION_FRAME_ASSETS,
  ...YUI_RAGE_FRAME_ASSETS,

  {
    id: 'yui_cutin_ultimate',
    path: '/assets/prototypes/cutins/yui/yui-cutin-ultimate-normal-1440x360-rgba.png',
    width: 1440,
    height: 360,
    kind: 'ui',
    description: 'ユイ通常必殺の横長カットイン。1440x360 RGBA。',
    required: false,
    fallback: false,
  },
  {
    id: 'yui_cutin_berserk',
    path: '/assets/prototypes/cutins/yui/yui-cutin-ultimate-black-v2-1440x360-rgba.png',
    width: 1440,
    height: 360,
    kind: 'ui',
    description: 'ユイ黒曜化の横長カットイン。1440x360 RGBA。',
    required: false,
    fallback: false,
  },

  fallbackOnly('yui_idle', 'player', '旧ユイidle互換キー。実画像はCore5 original framesを使用。', 42, 42),
  fallbackOnly('yui_move', 'player', '旧ユイmove互換キー。実画像はCore5 original framesを使用。', 42, 42),
  fallbackOnly('yui_hurt', 'player', '旧ユイhurt互換キー。実画像はCore5 original framesを使用。', 42, 42),
  fallbackOnly('yui_ultimate', 'player', '旧ユイultimate互換キー。実画像はCore5 original framesを使用。', 42, 42),

  fallbackOnly('enemy_ink_blob', 'enemy', '敵原本シートまたはGraphics fallback。', 24, 24),
  fallbackOnly('enemy_paper_scrap', 'enemy', '敵原本シートまたはGraphics fallback。', 24, 24),
  fallbackOnly('enemy_signpost', 'enemy', '敵原本シートまたはGraphics fallback。', 24, 24),
  fallbackOnly('enemy_capsule', 'enemy', '敵原本シートまたはGraphics fallback。', 24, 24),
  fallbackOnly('enemy_haze', 'enemy', '敵原本シートまたはGraphics fallback。', 24, 24),
  fallbackOnly('enemy_elite_label', 'enemy', '敵原本シートまたはGraphics fallback。', 32, 32),

  fallbackOnly('bg_stage1_paper_night', 'tile', 'Stage背景manifestを使用。', 128, 128),
  fallbackOnly('pickup_memory_fragment', 'pickup', '記憶の欠片 fallback。', 12, 12),
  fallbackOnly('pickup_heal_paper', 'pickup', '回復紙 fallback。', 14, 14),
  fallbackOnly('pickup_capsule', 'pickup', '記憶カプセル fallback。', 16, 16),
  fallbackOnly('rare_name_tag', 'rare', '名前札 fallback。', 16, 16),
  fallbackOnly('rare_cracked_lens', 'rare', 'ひび割れたレンズ fallback。', 16, 16),
  fallbackOnly('rare_sealed_letter', 'rare', '封のされた手紙 fallback。', 16, 16),
  fallbackOnly('rare_wind_mark', 'rare', '風のしるし fallback。', 16, 16),
  fallbackOnly('weapon_night_pencil', 'weapon', '夜の鉛筆 fallback。', 16, 8),
  fallbackOnly('weapon_marble', 'weapon', 'ビー玉 fallback。', 12, 12),
  fallbackOnly('weapon_bookmark_orbit', 'weapon', '月のしおり fallback。', 12, 16),
  fallbackOnly('weapon_ink_area', 'weapon', '黒インク範囲 fallback。', 64, 64),
  fallbackOnly('weapon_stardust', 'weapon', '星くず弾 fallback。', 12, 12),
  fallbackOnly('weapon_postcard_blade', 'weapon', '絵はがきカッター fallback。', 16, 10),
  fallbackOnly('weapon_paper_airplane', 'weapon', '紙ひこうき fallback。', 16, 12),
  fallbackOnly('weapon_streetlamp_area', 'weapon', '街灯の輪 fallback。', 128, 128),
  fallbackOnly('evolved_unfinished_line', 'evolved', '未完成の一行 fallback。', 24, 10),
  fallbackOnly('evolved_north_star_lantern', 'evolved', '北極星のランタン fallback。', 16, 16),
  fallbackOnly('evolved_dawn_ink_lamp', 'evolved', '夜明けのインク灯 fallback。', 128, 128),
  fallbackOnly('awakened_unforgotten_name', 'evolved', '消えない名前 fallback。', 24, 12),
  fallbackOnly('awakened_memory_marble', 'evolved', '追憶のビー玉 fallback。', 16, 16),
  fallbackOnly('awakened_addressless_blade', 'evolved', '宛先のない刃 fallback。', 18, 12),
  fallbackOnly('awakened_tailwind_plane', 'evolved', '追い風の紙ひこうき fallback。', 20, 16),
  fallbackOnly('ui_card_paper_normal', 'ui', 'カード背景 fallback。', 320, 144),
  fallbackOnly('ui_card_paper_good', 'ui', 'カード背景 fallback。', 320, 144),
  fallbackOnly('ui_card_paper_rare', 'ui', 'カード背景 fallback。', 320, 144),

  ...inventoryIconAssetEntries,
];

export const assetById = new Map(assetManifest.map((asset) => [asset.id, asset]));

export const ENEMY_ASSET: Record<string, AssetId> = {
  ink_blob: 'enemy_ink_blob',
  paper_scrap: 'enemy_paper_scrap',
  signpost: 'enemy_signpost',
  capsule: 'enemy_capsule',
  haze: 'enemy_haze',
  label_elite: 'enemy_elite_label',
};

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

export const RARE_ASSET: Record<string, AssetId> = {
  name_tag: 'rare_name_tag',
  cracked_lens: 'rare_cracked_lens',
  sealed_letter: 'rare_sealed_letter',
  wind_mark: 'rare_wind_mark',
};
