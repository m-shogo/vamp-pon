import type {
  AssetType, AssetManifest, CharacterManifest, EnemyManifest,
  WeaponManifest, ItemManifest, BackgroundManifest, CutinManifest,
} from './types';

export function createDefaultManifest(type: AssetType, fileName: string): AssetManifest {
  const base = {
    id: '', displayName: '', type, sourceFileName: fileName, tags: [], notes: '',
  };

  switch (type) {
    case 'character':
      return {
        ...base, type: 'character',
        characterId: '', bodyType: 'standard', fixedRules: [],
        cellWidth: 180, cellHeight: 180, columns: 8, rows: 6,
        anchors: {},
      } as CharacterManifest;
    case 'enemy':
      return {
        ...base, type: 'enemy',
        enemyId: '', baseFamily: '', motif: '', behavior: '', stage: '',
        sizeTier: '', palette: '', hpTier: '', speedTier: '', expTier: '',
        unityPrefabHint: '',
      } as EnemyManifest;
    case 'weapon':
      return {
        ...base, type: 'weapon',
        weaponId: '', motif: '', trajectory: '', maxLevel: 8,
        evolutionPairIds: [], evolvedWeaponId: '', unityPrefabHint: '',
      } as WeaponManifest;
    case 'item':
      return {
        ...base, type: 'item',
        itemId: '', category: '', effectType: '', rarity: '', unityPrefabHint: '',
      } as ItemManifest;
    case 'background':
      return {
        ...base, type: 'background',
        stageId: '', targetSize: '1080x1920', visibilityNotes: '',
      } as BackgroundManifest;
    case 'cutin':
      return {
        ...base, type: 'cutin',
        characterId: '', mode: '', targetSize: '1080x1920', transparentBackground: true,
      } as CutinManifest;
  }
}

export function applyPreset(manifest: AssetManifest, preset: Partial<AssetManifest>): AssetManifest {
  const merged = { ...manifest };
  for (const [key, value] of Object.entries(preset)) {
    if (value !== undefined && value !== '' && key !== 'type') {
      (merged as Record<string, unknown>)[key] = value;
    }
  }
  if (preset.displayName && !merged.id) {
    merged.id = (preset as Record<string, unknown>)[(manifest.type + 'Id') as string] as string || '';
  }
  return merged;
}
