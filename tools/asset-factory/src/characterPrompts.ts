import type { CharacterAssetPrompt, CharacterAssetPromptKind } from '../../../src/game/data/assetFactoryCharacterPrompts';
import {
  CHARACTER_ASSET_PROMPT_KINDS,
  characterAssetPromptPacks,
  getCharacterAssetPrompt,
} from '../../../src/game/data/assetFactoryCharacterPrompts';
import { characterDefinitionById, core5CharacterDefinitions } from '../../../src/game/data/characterDatabase';

export type CharacterPromptScope = 'core5' | 'all';

export type CharacterPromptOption = {
  id: string;
  name: string;
  group: string;
  statusLabel: string;
};

export const CHARACTER_PROMPT_KIND_LABELS: Record<CharacterAssetPromptKind, string> = {
  sprite_sheet_180: '180px Sprite Sheet',
  character_reference: 'Character Reference',
  normal_cutin: 'Normal Cutin',
  dawn_cutin: 'Dawn Cutin',
  kokuyou_cutin: 'Kokuyou Cutin',
  emblem_blank: 'Emblem Blank',
  emblem_normal: 'Emblem Normal',
  emblem_dawn: 'Emblem Dawn',
  emblem_kokuyou: 'Emblem Kokuyou',
};

const CORE5_IDS = new Set(core5CharacterDefinitions.map((definition) => definition.id));

function statusLabel(characterId: string): string {
  const definition = characterDefinitionById.get(characterId);
  if (!definition) return 'Unknown';
  if (definition.group === 'core5') return 'Core5 / playable seed';
  if (definition.group === 'shadow5') return 'Shadow data only';
  return 'Seed only';
}

export function getCharacterPromptOptions(scope: CharacterPromptScope): CharacterPromptOption[] {
  return characterAssetPromptPacks
    .filter((pack) => scope === 'all' || CORE5_IDS.has(pack.characterId))
    .map((pack) => {
      const definition = characterDefinitionById.get(pack.characterId);
      return {
        id: pack.characterId,
        name: pack.characterName,
        group: definition?.group ?? 'unknown',
        statusLabel: statusLabel(pack.characterId),
      };
    });
}

export function isEmblemPromptKind(kind: CharacterAssetPromptKind): boolean {
  return kind.startsWith('emblem_');
}

export function resolveCharacterPrompt(
  characterId: string,
  kind: CharacterAssetPromptKind,
): CharacterAssetPrompt | undefined {
  return getCharacterAssetPrompt(characterId, kind);
}

function checklistMarkdown(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

function assetFactoryNotes(kind: CharacterAssetPromptKind): string {
  const common = [
    'PREVIEW ONLY: this UI prompt is not generation-ready by itself.',
    'Before image generation, export the resolved prompt with tools/asset-factory/scripts/export-character-asset-prompt.ts so the per-character Living Visual Profile is embedded.',
    'Do not copy this preview directly into an image model; doing so can bypass exposure / piercing / tattoo / clothing / absoluteNever / positivePreference constraints.',
    'Generated image must pass Asset Factory QA before candidate/approved.',
    'Do not move prototype image into runtime assets until approved.',
    'Character Database is production canon, not runtime playable list.',
  ];
  if (isEmblemPromptKind(kind)) {
    common.push(
      '#00FF00 green background is source-only.',
      'It is not a final runtime asset.',
      'Chroma-key removal and RGBA QA are required before candidate/approved.',
      'Check green fringe after processing.',
      'Transparent PNG direct generation may be reviewed in a later task.',
    );
  }
  return checklistMarkdown(common);
}

export function buildCharacterPromptMarkdownFromPrompt(prompt: CharacterAssetPrompt): string {
  return [
    '# Character Asset Prompt — PREVIEW ONLY',
    '',
    '> NOT GENERATION-READY. Export a Living-Visual-resolved prompt before generation.',
    '> Required exporter: `tools/asset-factory/scripts/export-character-asset-prompt.ts`.',
    '',
    `Character: ${prompt.characterName} / ${prompt.characterId}`,
    `Kind: ${prompt.kind}`,
    `Output: ${prompt.outputPathHint}`,
    `Size: ${prompt.sizeSpec}`,
    '',
    '## Prompt Preview',
    '',
    prompt.prompt,
    '',
    '## Negative Prompt Preview',
    '',
    prompt.negativePrompt,
    '',
    '## Review Checklist',
    '',
    checklistMarkdown(prompt.reviewChecklist),
    '',
    '## Asset Factory Notes',
    '',
    assetFactoryNotes(prompt.kind),
    '',
  ].join('\n');
}

export function buildCharacterPromptMarkdown(
  characterId: string,
  kind: CharacterAssetPromptKind,
): string {
  const prompt = getCharacterAssetPrompt(characterId, kind);
  if (!prompt) {
    return [
      '# Character Asset Prompt',
      '',
      `Character: ${characterId || '(missing)'}`,
      `Kind: ${kind}`,
      '',
      'Prompt not found.',
      '',
    ].join('\n');
  }
  return buildCharacterPromptMarkdownFromPrompt(prompt);
}

export function buildCharacterPromptBatchMarkdown(
  scope: CharacterPromptScope,
  kind?: CharacterAssetPromptKind,
): string {
  const kinds = kind ? [kind] : CHARACTER_ASSET_PROMPT_KINDS;
  const sections = getCharacterPromptOptions(scope).flatMap((option) =>
    kinds.map((promptKind) => buildCharacterPromptMarkdown(option.id, promptKind)),
  );
  return sections.join('\n---\n\n');
}

export { CHARACTER_ASSET_PROMPT_KINDS };
