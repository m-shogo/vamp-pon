import { passives } from '../data/passives.ts';
import { rareItems } from '../data/rareItems.ts';
import { weapons } from '../data/weapons.ts';
import type { InventoryIconCategory } from './inventoryIcons.ts';

export const INVENTORY_ORIGINAL_SOURCE_SIZE = 180;

export type InventoryOriginalIcon = {
  category: InventoryIconCategory;
  itemId: string;
  name: string;
  textureId: string;
  path: string;
};

const ROOT = 'assets/prototypes/sprite-sheets';

const weaponIcons: InventoryOriginalIcon[] = weapons.map((item) => ({
  category: 'weapon',
  itemId: item.id,
  name: item.name,
  textureId: 'inventory_original_weapon_' + item.id,
  path: ROOT + '/weapon/' + item.id + '.png',
}));

const passiveIcons: InventoryOriginalIcon[] = passives.map((item) => ({
  category: 'passive',
  itemId: item.id,
  name: item.name,
  textureId: 'inventory_original_passive_' + item.id,
  path: ROOT + '/passive/' + item.id + '.png',
}));

const rareIcons: InventoryOriginalIcon[] = rareItems.map((item) => ({
  category: 'rare',
  itemId: item.id,
  name: item.name,
  textureId: 'inventory_original_rare_' + item.id,
  path: ROOT + '/rare/' + item.id + '.png',
}));

export const INVENTORY_ORIGINAL_ICONS: InventoryOriginalIcon[] = [
  ...weaponIcons,
  ...passiveIcons,
  ...rareIcons,
];

export const inventoryOriginalByKey = new Map(
  INVENTORY_ORIGINAL_ICONS.map((entry) => [entry.category + ':' + entry.itemId, entry]),
);

export const inventoryOriginalAssetEntries = INVENTORY_ORIGINAL_ICONS.map((entry) => ({
  id: entry.textureId,
  path: entry.path,
  width: INVENTORY_ORIGINAL_SOURCE_SIZE,
  height: INVENTORY_ORIGINAL_SOURCE_SIZE,
  kind: 'ui' as const,
  description: entry.name + ' 180px inventory original',
  required: true,
  fallback: false,
}));

export function getInventoryOriginalIcon(
  category: InventoryIconCategory,
  itemId: string,
): InventoryOriginalIcon | undefined {
  return inventoryOriginalByKey.get(category + ':' + itemId);
}

export function resolveInventoryOriginalTexture(
  textureManager: { exists: (key: string) => boolean },
  category: InventoryIconCategory,
  itemId: string,
): string | null {
  const entry = getInventoryOriginalIcon(category, itemId);
  if (!entry) return null;
  return textureManager.exists(entry.textureId) ? entry.textureId : null;
}
