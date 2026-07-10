import { characterProductionPlans } from './characterProductionPlans.ts';
import { FIELD_DROP_CANON } from './itemProductionCanon.ts';

export type ItemProductionKind = 'starter_gear' | 'passive_item' | 'rare_item' | 'lamp_tsugi' | 'akatsuki_biraki' | 'field_drop';
export type ItemAssetPromptKind = 'icon_64' | 'card_512' | 'pickup_32' | 'evolution_burst' | 'ui_slot';

export type ItemAssetProductionEntry = {
  id: string;
  characterId?: string;
  kind: ItemProductionKind;
  name: string;
  role: string;
  gameplayUse: string;
  loreHook: string;
  visualAnchor: string;
  motifLaneIds: string[];
  paletteHint: string[];
  assetKeywords: string[];
};

export type ItemAssetPrompt = {
  itemId: string;
  itemName: string;
  kind: ItemAssetPromptKind;
  title: string;
  outputPathHint: string;
  sizeSpec: string;
  prompt: string;
  negativePrompt: string;
  reviewChecklist: string[];
};

export const ITEM_ASSET_PROMPT_KINDS: ItemAssetPromptKind[] = ['icon_64', 'card_512', 'pickup_32', 'evolution_burst', 'ui_slot'];

function slug(value: string): string {
  return value
    .replace(/[\s/]+/g, '_')
    .replace(/[・、。]/g, '_')
    .replace(/[^぀-ヿ㐀-鿿\w-]/g, '')
    .toLowerCase();
}

function paletteForKind(kind: ItemProductionKind): string[] {
  if (kind === 'starter_gear') return ['warm amber', 'deep navy', 'paper cream'];
  if (kind === 'passive_item') return ['paper cream', 'soft gold', 'muted ink'];
  if (kind === 'rare_item') return ['memory gold', 'ink black', 'soft dawn'];
  if (kind === 'lamp_tsugi') return ['linked amber', 'paper white', 'night navy'];
  if (kind === 'akatsuki_biraki') return ['dawn gold', 'warm white', 'fading ink'];
  return ['pickup glow', 'paper cream', 'clear aqua'];
}

function entry(
  plan: (typeof characterProductionPlans)[number],
  kind: Exclude<ItemProductionKind, 'field_drop'>,
  name: string,
  role: string,
  gameplayUse: string,
  visualAnchor: string,
): ItemAssetProductionEntry {
  return {
    id: `${kind}_${plan.characterId}_${slug(name)}`,
    characterId: plan.characterId,
    kind,
    name,
    role,
    gameplayUse,
    loreHook: `${plan.productionNote} / ${name} は ${plan.characterId} の量産セットから来る。`,
    visualAnchor,
    motifLaneIds: plan.motifLaneIds,
    paletteHint: paletteForKind(kind),
    assetKeywords: [...plan.assetKeywords, name, visualAnchor],
  };
}

export const characterItemAssetEntries: ItemAssetProductionEntry[] = characterProductionPlans.flatMap((plan) => [
  entry(plan, 'starter_gear', plan.starterGear, 'キャラ初期灯具', '戦闘開始時に最初から持つ主力アクション。', `${plan.starterGear}を小さくても読める形にする`),
  entry(plan, 'passive_item', plan.passiveItem, 'キャラ相性の良い持ち物', 'レベルアップカードや所持欄で使う。', `${plan.passiveItem}を旅の小物として読ませる`),
  entry(plan, 'rare_item', plan.rareItem, '暁開きの鍵になる忘れ物', '特殊進化・灯録・キャラ物語の鍵。', `${plan.rareItem}を誰かの生活から落ちたものに見せる`),
  entry(plan, 'lamp_tsugi', plan.lampTsugi, '灯継ぎ後の進化名', '武器進化のカード・演出・図鑑名に使う。', `${plan.lampTsugi}は進化後の形や軌跡として表現する`),
  entry(plan, 'akatsuki_biraki', plan.akatsukiBiraki, '暁開き後の到達名', 'キャラ性が開いた最終演出・カットイン・灯録で使う。', `${plan.akatsukiBiraki}は朝へ近づく光として表現する`),
]);

export const fieldDropAssetEntries: ItemAssetProductionEntry[] = FIELD_DROP_CANON.map((drop) => ({
  id: `field_drop_${drop.id}`,
  kind: 'field_drop',
  name: drop.label,
  role: '戦闘中の落とし物',
  gameplayUse: drop.role,
  loreHook: `${drop.label} は戦闘中に拾う短期的な意味片。`,
  visualAnchor: `${drop.label}を32pxでも拾いたくなる小物にする`,
  motifLaneIds: ['memory'],
  paletteHint: paletteForKind('field_drop'),
  assetKeywords: [drop.label, drop.role, 'small pickup icon', 'memory drop'],
}));

export const itemAssetProductionEntries: ItemAssetProductionEntry[] = [...characterItemAssetEntries, ...fieldDropAssetEntries];

const ITEM_NEGATIVE_PROMPT = 'no text, no letters, no numbers, no logo, no watermark, no checkerboard, no white background, no white fringe, no photorealistic object, no generic RPG crystal, no gem currency';

function buildItemPrompt(item: ItemAssetProductionEntry, kind: ItemAssetPromptKind): ItemAssetPrompt {
  const sizeSpecByKind: Record<ItemAssetPromptKind, string> = {
    icon_64: '64x64 PNG RGBA source, centered item icon, transparent background, readable at 32px.',
    card_512: '512x512 PNG RGBA source, item card art without text, transparent background.',
    pickup_32: '32x32 PNG RGBA source, high readability pickup silhouette, transparent background.',
    evolution_burst: '768x768 PNG RGBA source, textless evolution burst around the item, transparent background.',
    ui_slot: '128x128 PNG RGBA source, item slot icon, transparent background, no frame text.',
  };
  return {
    itemId: item.id,
    itemName: item.name,
    kind,
    title: `${item.name} ${kind}`,
    outputPathHint: `public/assets/prototypes/items/${item.kind}/${item.id}/${item.id}-${kind}-v1.png`,
    sizeSpec: sizeSpecByKind[kind],
    prompt: [
      'Vamp Pon item asset, paper storybook pixel-art flavor, small meaningful object, memory and night mood, mobile game readable icon.',
      `Item: ${item.name} (${item.id}).`,
      `Kind: ${item.kind}. Role: ${item.role}.`,
      `Gameplay use: ${item.gameplayUse}.`,
      `Lore hook: ${item.loreHook}.`,
      `Visual anchor: ${item.visualAnchor}.`,
      `Motif lanes: ${item.motifLaneIds.join(', ')}. Palette: ${item.paletteHint.join(', ')}.`,
      `Keywords: ${item.assetKeywords.join(', ')}.`,
      `Output spec: ${sizeSpecByKind[kind]}`,
    ].join('\n'),
    negativePrompt: ITEM_NEGATIVE_PROMPT,
    reviewChecklist: [
      '32pxまたは64pxでも何の小物か読める',
      '魔石・クリスタル・汎用RPG素材に見えない',
      'キャラ専用アイテムはキャラの器や動詞とつながっている',
      '文字・数字・ロゴを焼いていない',
      '白フリンジ・市松模様・余計な背景がない',
    ],
  };
}

export const itemAssetPrompts: ItemAssetPrompt[] = itemAssetProductionEntries.flatMap((item) => ITEM_ASSET_PROMPT_KINDS.map((kind) => buildItemPrompt(item, kind)));
export const itemAssetEntryById = new Map(itemAssetProductionEntries.map((item) => [item.id, item]));
export const itemAssetPromptByKey = new Map(itemAssetPrompts.map((prompt) => [`${prompt.itemId}:${prompt.kind}`, prompt]));

export function getItemAssetPrompt(itemId: string, kind: ItemAssetPromptKind): ItemAssetPrompt | undefined {
  return itemAssetPromptByKey.get(`${itemId}:${kind}`);
}

export const itemAssetProductionSummary = {
  total: itemAssetProductionEntries.length,
  characterLinked: characterItemAssetEntries.length,
  fieldDrops: fieldDropAssetEntries.length,
  promptCount: itemAssetPrompts.length,
} as const;
