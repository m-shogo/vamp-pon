import requirementsJson from '../../../data/ui-assets/inventory-icon-requirements.json';
import {
  inventoryOriginalAssetEntries,
  resolveInventoryOriginalTexture,
} from './inventoryOriginalIcons';

export type InventoryIconCategory = 'weapon' | 'passive' | 'rare';
export type InventoryIconStatus = 'planned' | 'draft' | 'ready';
export type InventoryIconPriority = 'P0' | 'P1';

export type InventoryIconRequirement = {
  category: InventoryIconCategory;
  itemId: string;
  name: string;
  assetId: string;
  path: string;
  status: InventoryIconStatus;
  priority: InventoryIconPriority;
  fallbackGlyph: string;
  interimAssetId?: string;
  visualBrief: string;
};

const requirements = requirementsJson.icons as InventoryIconRequirement[];

export const INVENTORY_ICON_REQUIREMENTS = requirements;

export const inventoryIconByKey = new Map(
  requirements.map((entry) => [`${entry.category}:${entry.itemId}`, entry]),
);

/** 現在のゲームでは高品質な180px原本を共通アイコンとしてロードする。 */
export const inventoryIconAssetEntries = inventoryOriginalAssetEntries;

export function getInventoryIconRequirement(
  category: InventoryIconCategory,
  itemId: string,
): InventoryIconRequirement | undefined {
  return inventoryIconByKey.get(`${category}:${itemId}`);
}

export function resolveInventoryIconTexture(
  textures: { exists: (key: string) => boolean },
  category: InventoryIconCategory,
  itemId: string,
): string | null {
  const original = resolveInventoryOriginalTexture(textures, category, itemId);
  if (original) return original;

  const requirement = getInventoryIconRequirement(category, itemId);
  if (!requirement) return null;
  if (textures.exists(requirement.assetId)) return requirement.assetId;
  if (requirement.interimAssetId && textures.exists(requirement.interimAssetId)) {
    return requirement.interimAssetId;
  }
  return null;
}
