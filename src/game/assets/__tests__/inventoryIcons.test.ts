import { describe, expect, it } from 'vitest';
import { weapons } from '../../data/weapons';
import { passives } from '../../data/passives';
import { rareItems } from '../../data/rareItems';
import {
  INVENTORY_ICON_REQUIREMENTS,
  getInventoryIconRequirement,
  inventoryIconAssetEntries,
} from '../inventoryIcons';

describe('inventory icon stock', () => {
  it('武器・忘れ物・レアの全データを台帳が網羅する', () => {
    for (const weapon of weapons) {
      expect(getInventoryIconRequirement('weapon', weapon.id), `weapon:${weapon.id}`).toBeTruthy();
    }
    for (const passive of passives) {
      expect(getInventoryIconRequirement('passive', passive.id), `passive:${passive.id}`).toBeTruthy();
    }
    for (const rare of rareItems) {
      expect(getInventoryIconRequirement('rare', rare.id), `rare:${rare.id}`).toBeTruthy();
    }
  });

  it('現在の必要数は武器15・忘れ物8・レア4の合計27件', () => {
    expect(INVENTORY_ICON_REQUIREMENTS.filter((item) => item.category === 'weapon')).toHaveLength(15);
    expect(INVENTORY_ICON_REQUIREMENTS.filter((item) => item.category === 'passive')).toHaveLength(8);
    expect(INVENTORY_ICON_REQUIREMENTS.filter((item) => item.category === 'rare')).toHaveLength(4);
    expect(INVENTORY_ICON_REQUIREMENTS).toHaveLength(27);
  });

  it('assetId・path・category:itemIdが重複しない', () => {
    const assetIds = INVENTORY_ICON_REQUIREMENTS.map((item) => item.assetId);
    const paths = INVENTORY_ICON_REQUIREMENTS.map((item) => item.path);
    const keys = INVENTORY_ICON_REQUIREMENTS.map((item) => `${item.category}:${item.itemId}`);
    expect(new Set(assetIds).size).toBe(assetIds.length);
    expect(new Set(paths).size).toBe(paths.length);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('専用アイコンは32px・任意素材・fallbackありでassetManifestへ渡す', () => {
    expect(inventoryIconAssetEntries).toHaveLength(27);
    for (const asset of inventoryIconAssetEntries) {
      expect(asset.width).toBe(32);
      expect(asset.height).toBe(32);
      expect(asset.kind).toBe('ui');
      expect(asset.required).toBe(false);
      expect(asset.fallback).toBe(true);
    }
  });
});
