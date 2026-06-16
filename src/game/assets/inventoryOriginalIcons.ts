import { passives } from '../data/passives';
import { rareItems } from '../data/rareItems';
import { weapons } from '../data/weapons';
import type { InventoryIconCategory } from './inventoryIcons';

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
