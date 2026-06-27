import type { CharacterAssetPromptKind } from './assetFactoryCharacterPrompts';
import { characterAssetPrompts, characterAssetPromptPacks } from './assetFactoryCharacterPrompts';
import type { EnemyAssetPromptKind } from './enemyProductionDatabase';
import { enemyAssetPrompts, enemyProductionSummary } from './enemyProductionDatabase';
import type { ItemAssetPromptKind } from './itemAssetProductionDatabase';
import { itemAssetProductionSummary, itemAssetPrompts } from './itemAssetProductionDatabase';
import type { StageAssetPromptKind } from './stageProductionDatabase';
import { stageAssetPrompts, stageProductionSummary } from './stageProductionDatabase';

export type AssetFactoryContentType = 'character' | 'enemy' | 'item' | 'stage';

export type AssetFactoryPromptKindByType = {
  character: CharacterAssetPromptKind;
  enemy: EnemyAssetPromptKind;
  item: ItemAssetPromptKind;
  stage: StageAssetPromptKind;
};

export type AssetFactoryPromptRecord = {
  key: string;
  contentType: AssetFactoryContentType;
  sourceId: string;
  displayName: string;
  kind: string;
  title: string;
  outputPathHint: string;
  sizeSpec: string;
  prompt: string;
  negativePrompt: string;
  reviewChecklist: string[];
};

function key(contentType: AssetFactoryContentType, sourceId: string, kind: string): string {
  return `${contentType}:${sourceId}:${kind}`;
}

function normalizeCharacterPrompts(): AssetFactoryPromptRecord[] {
  return characterAssetPrompts.map((prompt) => ({
    key: key('character', prompt.characterId, prompt.kind),
    contentType: 'character',
    sourceId: prompt.characterId,
    displayName: prompt.characterName,
    kind: prompt.kind,
    title: prompt.title,
    outputPathHint: prompt.outputPathHint,
    sizeSpec: prompt.sizeSpec,
    prompt: prompt.prompt,
    negativePrompt: prompt.negativePrompt,
    reviewChecklist: prompt.reviewChecklist,
  }));
}

function normalizeEnemyPrompts(): AssetFactoryPromptRecord[] {
  return enemyAssetPrompts.map((prompt) => ({
    key: key('enemy', prompt.enemyId, prompt.kind),
    contentType: 'enemy',
    sourceId: prompt.enemyId,
    displayName: prompt.enemyName,
    kind: prompt.kind,
    title: prompt.title,
    outputPathHint: prompt.outputPathHint,
    sizeSpec: prompt.sizeSpec,
    prompt: prompt.prompt,
    negativePrompt: prompt.negativePrompt,
    reviewChecklist: prompt.reviewChecklist,
  }));
}

function normalizeItemPrompts(): AssetFactoryPromptRecord[] {
  return itemAssetPrompts.map((prompt) => ({
    key: key('item', prompt.itemId, prompt.kind),
    contentType: 'item',
    sourceId: prompt.itemId,
    displayName: prompt.itemName,
    kind: prompt.kind,
    title: prompt.title,
    outputPathHint: prompt.outputPathHint,
    sizeSpec: prompt.sizeSpec,
    prompt: prompt.prompt,
    negativePrompt: prompt.negativePrompt,
    reviewChecklist: prompt.reviewChecklist,
  }));
}

function normalizeStagePrompts(): AssetFactoryPromptRecord[] {
  return stageAssetPrompts.map((prompt) => ({
    key: key('stage', prompt.stageId, prompt.kind),
    contentType: 'stage',
    sourceId: prompt.stageId,
    displayName: prompt.stageName,
    kind: prompt.kind,
    title: prompt.title,
    outputPathHint: prompt.outputPathHint,
    sizeSpec: prompt.sizeSpec,
    prompt: prompt.prompt,
    negativePrompt: prompt.negativePrompt,
    reviewChecklist: prompt.reviewChecklist,
  }));
}

export const assetFactoryPromptCatalog: AssetFactoryPromptRecord[] = [
  ...normalizeCharacterPrompts(),
  ...normalizeEnemyPrompts(),
  ...normalizeItemPrompts(),
  ...normalizeStagePrompts(),
];

export const assetFactoryPromptByKey = new Map(assetFactoryPromptCatalog.map((record) => [record.key, record]));

export const assetFactoryPromptCatalogByType: Record<AssetFactoryContentType, AssetFactoryPromptRecord[]> = {
  character: assetFactoryPromptCatalog.filter((record) => record.contentType === 'character'),
  enemy: assetFactoryPromptCatalog.filter((record) => record.contentType === 'enemy'),
  item: assetFactoryPromptCatalog.filter((record) => record.contentType === 'item'),
  stage: assetFactoryPromptCatalog.filter((record) => record.contentType === 'stage'),
};

export function getAssetFactoryPrompt<T extends AssetFactoryContentType>(
  contentType: T,
  sourceId: string,
  kind: AssetFactoryPromptKindByType[T],
): AssetFactoryPromptRecord | undefined {
  return assetFactoryPromptByKey.get(key(contentType, sourceId, kind));
}

export const assetFactoryCatalogSummary = {
  totalPromptCount: assetFactoryPromptCatalog.length,
  character: {
    sourceCount: characterAssetPromptPacks.length,
    promptCount: assetFactoryPromptCatalogByType.character.length,
  },
  enemy: {
    sourceCount: enemyProductionSummary.total,
    promptCount: assetFactoryPromptCatalogByType.enemy.length,
  },
  item: {
    sourceCount: itemAssetProductionSummary.total,
    promptCount: assetFactoryPromptCatalogByType.item.length,
  },
  stage: {
    sourceCount: stageProductionSummary.total,
    promptCount: assetFactoryPromptCatalogByType.stage.length,
  },
} as const;
