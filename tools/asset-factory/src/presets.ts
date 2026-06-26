import type { AssetManifest, EnemyManifest, WeaponManifest, ItemManifest } from './types';

export type PresetEntry = {
  id: string;
  label: string;
  manifest: Partial<AssetManifest>;
};

export const ENEMY_PRESETS: PresetEntry[] = [
  {
    id: 'ombu-small', label: 'オンブー（小型基本）',
    manifest: {
      type: 'enemy', enemyId: 'ombu-small', baseFamily: 'ombu', motif: 'forgotten small object',
      behavior: 'wander', stage: 'stage-1', sizeTier: 'small', palette: 'dark-warm',
      hpTier: 'low', speedTier: 'slow', expTier: 'low', displayName: 'オンブー（小型）',
    } as Partial<EnemyManifest>,
  },
  {
    id: 'ombu-shoe-zigzag', label: 'オンブー靴（ジグザグ）',
    manifest: {
      type: 'enemy', enemyId: 'ombu-shoe-zigzag', baseFamily: 'ombu', motif: 'forgotten shoe',
      behavior: 'zigzag', stage: 'stage-1', sizeTier: 'small', palette: 'dark-warm',
      hpTier: 'low', speedTier: 'medium', expTier: 'low', displayName: 'オンブー靴',
    } as Partial<EnemyManifest>,
  },
  {
    id: 'ombu-umbrella-shield', label: 'オンブー傘（シールド）',
    manifest: {
      type: 'enemy', enemyId: 'ombu-umbrella-shield', baseFamily: 'ombu', motif: 'forgotten umbrella',
      behavior: 'shield', stage: 'stage-1', sizeTier: 'medium', palette: 'dark-warm',
      hpTier: 'medium', speedTier: 'slow', expTier: 'medium', displayName: 'オンブー傘',
    } as Partial<EnemyManifest>,
  },
  {
    id: 'ombu-key-dasher', label: 'オンブー鍵（ダッシャー）',
    manifest: {
      type: 'enemy', enemyId: 'ombu-key-dasher', baseFamily: 'ombu', motif: 'forgotten key',
      behavior: 'dash', stage: 'stage-1', sizeTier: 'small', palette: 'dark-warm',
      hpTier: 'low', speedTier: 'fast', expTier: 'medium', displayName: 'オンブー鍵',
    } as Partial<EnemyManifest>,
  },
  {
    id: 'ombu-letter-shooter', label: 'オンブー手紙（シューター）',
    manifest: {
      type: 'enemy', enemyId: 'ombu-letter-shooter', baseFamily: 'ombu', motif: 'forgotten letter',
      behavior: 'shoot', stage: 'stage-1', sizeTier: 'medium', palette: 'dark-warm',
      hpTier: 'medium', speedTier: 'slow', expTier: 'medium', displayName: 'オンブー手紙',
    } as Partial<EnemyManifest>,
  },
  {
    id: 'omburo-lamppost-aura', label: 'オンブロー街灯（オーラ）',
    manifest: {
      type: 'enemy', enemyId: 'omburo-lamppost-aura', baseFamily: 'omburo', motif: 'lamppost',
      behavior: 'aura', stage: 'stage-1', sizeTier: 'large', palette: 'dark-warm',
      hpTier: 'high', speedTier: 'slow', expTier: 'high', displayName: 'オンブロー街灯',
    } as Partial<EnemyManifest>,
  },
  {
    id: 'forgotten-umbrella-keeper', label: '忘れ傘の番人（ボス）',
    manifest: {
      type: 'enemy', enemyId: 'forgotten-umbrella-keeper', baseFamily: 'keeper', motif: 'forgotten umbrella keeper',
      behavior: 'boss', stage: 'stage-1', sizeTier: 'boss', palette: 'dark-warm',
      hpTier: 'boss', speedTier: 'medium', expTier: 'boss', displayName: '忘れ傘の番人',
    } as Partial<EnemyManifest>,
  },
];

export const WEAPON_PRESETS: PresetEntry[] = [
  {
    id: 'north-star-lantern', label: '北極星ランタン',
    manifest: {
      type: 'weapon', weaponId: 'north-star-lantern', motif: 'lantern with north star light',
      trajectory: 'radial', maxLevel: 8, displayName: '北極星ランタン',
    } as Partial<WeaponManifest>,
  },
  {
    id: 'night-pencil', label: '夜鉛筆',
    manifest: {
      type: 'weapon', weaponId: 'night-pencil', motif: 'pencil that draws in the dark',
      trajectory: 'directional', maxLevel: 8, displayName: '夜鉛筆',
    } as Partial<WeaponManifest>,
  },
  {
    id: 'paper-plane', label: '紙飛行機',
    manifest: {
      type: 'weapon', weaponId: 'paper-plane', motif: 'paper airplane',
      trajectory: 'projectile', maxLevel: 8, displayName: '紙飛行機',
    } as Partial<WeaponManifest>,
  },
  {
    id: 'black-ink-bottle', label: '黒インク瓶',
    manifest: {
      type: 'weapon', weaponId: 'black-ink-bottle', motif: 'ink bottle splash',
      trajectory: 'area', maxLevel: 8, displayName: '黒インク瓶',
    } as Partial<WeaponManifest>,
  },
  {
    id: 'lamp-post-ring', label: '街灯リング',
    manifest: {
      type: 'weapon', weaponId: 'lamp-post-ring', motif: 'ring of lamppost light',
      trajectory: 'orbit', maxLevel: 8, displayName: '街灯リング',
    } as Partial<WeaponManifest>,
  },
  {
    id: 'ink-lamp-ring', label: 'インクランプリング',
    manifest: {
      type: 'weapon', weaponId: 'ink-lamp-ring', motif: 'evolved ink and lamp fusion ring',
      trajectory: 'orbit', maxLevel: 8, displayName: 'インクランプリング',
    } as Partial<WeaponManifest>,
  },
];

export const ITEM_PRESETS: PresetEntry[] = [
  {
    id: 'warm-shoes', label: 'あったか靴',
    manifest: {
      type: 'item', itemId: 'warm-shoes', category: 'passive', effectType: 'speed-up',
      rarity: 'common', displayName: 'あったか靴',
    } as Partial<ItemManifest>,
  },
  {
    id: 'bigger-lantern-core', label: '大きなランタン芯',
    manifest: {
      type: 'item', itemId: 'bigger-lantern-core', category: 'passive', effectType: 'area-up',
      rarity: 'common', displayName: '大きなランタン芯',
    } as Partial<ItemManifest>,
  },
  {
    id: 'paper-armor', label: '紙の鎧',
    manifest: {
      type: 'item', itemId: 'paper-armor', category: 'passive', effectType: 'defense-up',
      rarity: 'common', displayName: '紙の鎧',
    } as Partial<ItemManifest>,
  },
  {
    id: 'quiet-clock', label: '静かな時計',
    manifest: {
      type: 'item', itemId: 'quiet-clock', category: 'passive', effectType: 'cooldown-reduce',
      rarity: 'uncommon', displayName: '静かな時計',
    } as Partial<ItemManifest>,
  },
  {
    id: 'dawn-ticket', label: '夜明けチケット',
    manifest: {
      type: 'item', itemId: 'dawn-ticket', category: 'consumable', effectType: 'revive',
      rarity: 'rare', displayName: '夜明けチケット',
    } as Partial<ItemManifest>,
  },
  {
    id: 'cracked-map', label: 'ひび割れた地図',
    manifest: {
      type: 'item', itemId: 'cracked-map', category: 'passive', effectType: 'exp-up',
      rarity: 'uncommon', displayName: 'ひび割れた地図',
    } as Partial<ItemManifest>,
  },
  {
    id: 'keeper-bell', label: '番人の鈴',
    manifest: {
      type: 'item', itemId: 'keeper-bell', category: 'passive', effectType: 'magnet',
      rarity: 'rare', displayName: '番人の鈴',
    } as Partial<ItemManifest>,
  },
];

export function getPresetsForType(type: string): PresetEntry[] {
  switch (type) {
    case 'enemy': return ENEMY_PRESETS;
    case 'weapon': return WEAPON_PRESETS;
    case 'item': return ITEM_PRESETS;
    default: return [];
  }
}
