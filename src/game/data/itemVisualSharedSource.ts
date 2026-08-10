import {
  itemAssetProductionEntries,
  type ItemAssetProductionEntry,
  type ItemProductionKind,
} from './itemAssetProductionDatabase.ts';
import { namedObjectRegistry } from './namedObjectRegistry.ts';
import type { ArtworkApprovalState } from './sharedSourceContracts.ts';

export type ItemRarityTier = 'STARTER' | 'STANDARD' | 'RARE' | 'EVOLVED' | 'DAWN' | 'FIELD_PICKUP';
export type ItemDropSource = 'CHARACTER_LINEAGE' | 'FIELD_DROP';
export type ItemStackRule = 'VISUAL_SINGLE_OBJECT' | 'RUNTIME_DEFINED';

export type ItemKindVisualRule = {
  rarityTier: ItemRarityTier;
  shapeLanguage: string;
  material: string;
  themeHex: `#${string}`;
  accentHex: `#${string}`;
  iconRule: string;
  stackRule: ItemStackRule;
  smallScaleReadability: string;
  pickupVfx: string;
  pickupMotion: string;
  goodsPotential: readonly string[];
  avoid: readonly string[];
};

export type ItemVisualSharedSourceEntry = {
  id: string;
  displayName: string;
  itemClass: ItemProductionKind;
  rarityTier: ItemRarityTier;
  effectRole: string;
  shapeLanguage: string;
  silhouette: string;
  material: string;
  themeHex: `#${string}`;
  accentHex: `#${string}`;
  stageAffinity: readonly string[];
  dropSource: ItemDropSource;
  namedObjectRelationIds: readonly string[];
  characterRelationIds: readonly string[];
  iconRule: string;
  stackRule: ItemStackRule;
  smallScaleReadability: string;
  pickupVfx: string;
  pickupMotion: string;
  goodsPotential: readonly string[];
  avoid: readonly string[];
  negativePromptHints: readonly string[];
  generationBriefSeed: string;
  authoritySource: 'src/game/data/itemAssetProductionDatabase.ts';
  runtimeReady: false;
  artworkReady: false;
  artworkState: ArtworkApprovalState;
};

const COMMON_AVOID = [
  'generic potion bottle unless the source object is explicitly a bottle',
  'generic RPG crystal, gem currency, orb, treasure chest',
  'neon cyan/purple AI glow',
  'glossy 3D collectible rendering',
  'baked rarity border, card frame, text, number, logo, watermark',
  'adding fantasy ornament that hides the everyday-object identity',
] as const;

export const ITEM_KIND_VISUAL_RULES: Record<ItemProductionKind, ItemKindVisualRule> = {
  starter_gear: {
    rarityTier: 'STARTER',
    shapeLanguage: 'one practical everyday tool/object with the strongest functional silhouette; wear is allowed, fantasy ornament is not required',
    material: 'honest object material first: paper, wood, glass, cloth, small metal or mixed everyday materials with matte wear',
    themeHex: '#2A2747', accentHex: '#FFCE7A',
    iconRule: 'show the whole primary tool/object at a readable angle; no rarity frame and no Character portrait',
    stackRule: 'VISUAL_SINGLE_OBJECT',
    smallScaleReadability: 'primary functional shape must still identify the object at 24-32px',
    pickupVfx: 'one restrained warm outline pulse with paper-grain edge; no burst halo',
    pickupMotion: 'short 4-8px lift and settle, preserving object orientation',
    goodsPotential: ['miniature prop charm', 'stationery/functional replica when material-safe'],
    avoid: [...COMMON_AVOID, 'hero weapon grandeur that contradicts an ordinary starter tool'],
  },
  passive_item: {
    rarityTier: 'STANDARD',
    shapeLanguage: 'small carried personal object; use storage/wear/handling clues rather than magical aura to show meaning',
    material: 'paper/cloth/glass/metal appropriate to the named object, with restrained age and touch marks',
    themeHex: '#F3E9CF', accentHex: '#B8A06A',
    iconRule: 'one personal object, centered with enough negative space to read its contour at 32px',
    stackRule: 'VISUAL_SINGLE_OBJECT',
    smallScaleReadability: 'one contour hook + one material/value contrast survive at 24px',
    pickupVfx: 'small paper/lantern glint under glow limits',
    pickupMotion: 'gentle float-in then one small turn, no endless bobbing',
    goodsPotential: ['prop charm', 'paper goods', 'small pouch/tag motif'],
    avoid: [...COMMON_AVOID, 'generic passive-stat badge icon'],
  },
  rare_item: {
    rarityTier: 'RARE',
    shapeLanguage: 'a specific forgotten personal object whose history is visible through wear, repair, seal, crack, fold or missing part',
    material: 'real worn material with one memory-gold/dawn accent only at the story-bearing detail',
    themeHex: '#D49348', accentHex: '#E6C48C',
    iconRule: 'object history mark must remain visible without a gold rarity frame; rarity comes from specificity, not decoration',
    stackRule: 'VISUAL_SINGLE_OBJECT',
    smallScaleReadability: 'primary object plus its one history mark must survive at 32px',
    pickupVfx: 'one slow warm record-line or dust glint; no loot-beam column',
    pickupMotion: 'brief pause before pickup pull, allowing the history mark to read',
    goodsPotential: ['collector prop', 'replica candidate only after Named Object approval'],
    avoid: [...COMMON_AVOID, 'legendary gold frame', 'generic relic jewel'],
  },
  lamp_tsugi: {
    rarityTier: 'EVOLVED',
    shapeLanguage: 'evolved visual descended from the starter/passive/object lineage; combine verbs and traces instead of replacing the object with a new fantasy artifact',
    material: 'base-object material remains visible beneath one linked warm-light/paper layer',
    themeHex: '#FFCE7A', accentHex: '#F3E9CF',
    iconRule: 'base-object contour must remain recognizable; add at most one evolved trace/connection hook',
    stackRule: 'VISUAL_SINGLE_OBJECT',
    smallScaleReadability: 'base contour remains primary at 32px; evolution hook is secondary',
    pickupVfx: 'two related traces connect once, then settle; no permanent aura',
    pickupMotion: 'base object and new trace align/lock in one short motion',
    goodsPotential: ['paired before/after print', 'evolution charm'],
    avoid: [...COMMON_AVOID, 'unrelated upgraded weapon form', 'more ornament = stronger shorthand'],
  },
  akatsuki_biraki: {
    rarityTier: 'DAWN',
    shapeLanguage: 'final dawn meaning expressed by restored gap, opened route, repaired edge or warm material shift; do not turn the object into a crown/winged relic',
    material: 'same lineage material with restrained morning light and repaired/accepted history marks left visible',
    themeHex: '#E6C48C', accentHex: '#FFF0B0',
    iconRule: 'preserve lineage contour and show one dawn-state change; no crown, wings or giant sun badge',
    stackRule: 'VISUAL_SINGLE_OBJECT',
    smallScaleReadability: 'lineage contour + one dawn change must read at 32px',
    pickupVfx: 'night value gently lifts toward dawn over a short controlled duration; no white flash',
    pickupMotion: 'small open/repair/align gesture specific to the object; no trophy spin',
    goodsPotential: ['collector before/after set', 'premium replica only with explicit approval'],
    avoid: [...COMMON_AVOID, 'crown', 'angel wings', 'full-screen dawn explosion', 'erasing wear marks to imply healing'],
  },
  field_drop: {
    rarityTier: 'FIELD_PICKUP',
    shapeLanguage: 'tiny instantly readable field pickup tied to memory/night gameplay; one object or trace only',
    material: 'simple paper/glass/dew/light material cue with very low detail',
    themeHex: '#F3E9CF', accentHex: '#CFE6F0',
    iconRule: 'single high-contrast pickup silhouette; never use a generic crystal/gem currency shape',
    stackRule: 'RUNTIME_DEFINED',
    smallScaleReadability: 'must remain distinguishable at the 32px source and gameplay display size',
    pickupVfx: 'single compact glint or ripple contained close to the pickup',
    pickupMotion: 'short magnetic pull toward player only when runtime collects it',
    goodsPotential: ['sticker/icon motif only; not automatically a lore replica'],
    avoid: [...COMMON_AVOID, 'oversized loot beam', 'currency gem shorthand'],
  },
};

function namedObjectRelations(entry: ItemAssetProductionEntry) {
  if (!entry.characterId) return [];
  return namedObjectRegistry.filter(
    (object) => object.characterId === entry.characterId && object.displayName === entry.name,
  );
}

function stageAffinityFromNamedObjects(objects: ReturnType<typeof namedObjectRelations>): string[] {
  return [...new Set(objects.flatMap((object) => object.connections)
    .filter((connection) => connection.type === 'stage')
    .map((connection) => connection.targetId))];
}

export const itemVisualSharedSourceEntries: readonly ItemVisualSharedSourceEntry[] = itemAssetProductionEntries.map((entry) => {
  const rule = ITEM_KIND_VISUAL_RULES[entry.kind];
  const namedObjects = namedObjectRelations(entry);
  const dropSource: ItemDropSource = entry.kind === 'field_drop' ? 'FIELD_DROP' : 'CHARACTER_LINEAGE';

  return {
    id: entry.id,
    displayName: entry.name,
    itemClass: entry.kind,
    rarityTier: rule.rarityTier,
    effectRole: `${entry.role} / ${entry.gameplayUse}`,
    shapeLanguage: `${rule.shapeLanguage} Source visual anchor: ${entry.visualAnchor}.`,
    silhouette: entry.visualAnchor,
    material: rule.material,
    themeHex: rule.themeHex,
    accentHex: rule.accentHex,
    stageAffinity: stageAffinityFromNamedObjects(namedObjects),
    dropSource,
    namedObjectRelationIds: namedObjects.map((object) => object.id),
    characterRelationIds: entry.characterId ? [entry.characterId] : [],
    iconRule: rule.iconRule,
    stackRule: rule.stackRule,
    smallScaleReadability: rule.smallScaleReadability,
    pickupVfx: rule.pickupVfx,
    pickupMotion: rule.pickupMotion,
    goodsPotential: rule.goodsPotential,
    avoid: rule.avoid,
    negativePromptHints: [
      'no text, letters, numbers, logo, watermark',
      'no generic potion/crystal/gem/orb unless explicitly required by source object',
      'no neon cyan/purple AI palette',
      'no glossy 3D collectible',
      'no baked rarity/card/UI frame',
    ],
    generationBriefSeed: [
      `${entry.name} (${entry.id}) — ${entry.kind}/${rule.rarityTier}.`,
      `Role/use: ${entry.role} / ${entry.gameplayUse}`,
      `Lore: ${entry.loreHook}`,
      `Visual anchor: ${entry.visualAnchor}`,
      `Shape/material: ${rule.shapeLanguage} / ${rule.material}`,
      `Motif lanes: ${entry.motifLaneIds.join(', ')}`,
      `Source palette hints: ${entry.paletteHint.join(', ')}`,
      `Shared Source palette anchors: ${rule.themeHex} + ${rule.accentHex}`,
      `Icon/pickup: ${rule.iconRule} / ${rule.pickupVfx}`,
      `Keep one meaningful everyday object and reject generic RPG loot shorthand.`,
    ].join('\n'),
    authoritySource: 'src/game/data/itemAssetProductionDatabase.ts',
    runtimeReady: false,
    artworkReady: false,
    artworkState: 'NOT_GENERATED',
  };
});

export const itemVisualSharedSourceById = new Map(itemVisualSharedSourceEntries.map((entry) => [entry.id, entry]));

export const itemVisualSharedSourceSummary = {
  total: itemVisualSharedSourceEntries.length,
  characterLinked: itemVisualSharedSourceEntries.filter((entry) => entry.characterRelationIds.length > 0).length,
  fieldDrops: itemVisualSharedSourceEntries.filter((entry) => entry.dropSource === 'FIELD_DROP').length,
  namedObjectLinked: itemVisualSharedSourceEntries.filter((entry) => entry.namedObjectRelationIds.length > 0).length,
  runtimeReady: false,
  artworkReady: false,
} as const;
