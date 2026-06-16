import requirementsJson from '../../../data/ui-assets/inventory-icon-requirements.json';

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

export const inventoryIconAssetEntries = requirements.map((entry) => ({
  id: entry.assetId,
  path: entry.path,
  width: requirementsJson.target.canvasPx,
  height: requirementsJson.target.canvasPx,
  kind: 'ui' as const,
  description: `${entry.name} HUD inventory icon (${entry.status})`,
  required: false,
  fallback: true,
}));

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
  const requirement = getInventoryIconRequirement(category, itemId);
  if (!requirement) return null;
  if (textures.exists(requirement.assetId)) return requirement.assetId;
  if (requirement.interimAssetId && textures.exists(requirement.interimAssetId)) {
    return requirement.interimAssetId;
  }
  return null;
}
