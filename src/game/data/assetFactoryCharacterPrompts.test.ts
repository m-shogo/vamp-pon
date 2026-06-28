import { describe, expect, it } from 'vitest';
import { characterDefinitions } from './characterDatabase';
import {
  CHARACTER_ASSET_PROMPT_KINDS,
  characterAssetPromptPackById,
  characterAssetPromptPacks,
  characterAssetPrompts,
  getCharacterAssetPrompt,
  getCharacterAssetPromptPack,
} from './assetFactoryCharacterPrompts';

describe('assetFactoryCharacterPrompts', () => {
  it('creates a full prompt pack for every character definition', () => {
    expect(characterAssetPromptPacks).toHaveLength(characterDefinitions.length);
    expect(characterAssetPrompts).toHaveLength(characterDefinitions.length * CHARACTER_ASSET_PROMPT_KINDS.length);

    for (const definition of characterDefinitions) {
      const pack = characterAssetPromptPackById.get(definition.id);
      expect(pack).toBeTruthy();
      expect(pack?.prompts.map((prompt) => prompt.kind)).toEqual(CHARACTER_ASSET_PROMPT_KINDS);
      expect(pack?.azCode).toBe(definition.emblem.azCode);
      expect(pack?.promptSeed).toContain(definition.id);
    }
  });

  it('keeps every prompt tied to the character identity and output path', () => {
    const requiredNegativeTerms = ['no text', 'no letters', 'no logo', 'no watermark', 'no white fringe'];

    for (const pack of characterAssetPromptPacks) {
      for (const prompt of pack.prompts) {
        expect(prompt.characterId).toBe(pack.characterId);
        expect(prompt.characterName).toBe(pack.characterName);
        expect(prompt.outputPathHint).toContain(`/characters/${pack.characterId}/`);
        expect(prompt.prompt).toContain(pack.characterName);
        expect(prompt.prompt).toContain(pack.characterId);
        for (const term of requiredNegativeTerms) {
          expect(prompt.negativePrompt).toContain(term);
        }
        expect(prompt.reviewChecklist.length).toBeGreaterThanOrEqual(6);
      }
    }
  });

  it('separates output specs for sprite sheets, cutins, references, and emblems', () => {
    const yuiSprite = getCharacterAssetPrompt('yui', 'sprite_sheet_180');
    const yuiReference = getCharacterAssetPrompt('yui', 'character_reference');
    const yuiCutin = getCharacterAssetPrompt('yui', 'normal_cutin');
    const yuiEmblem = getCharacterAssetPrompt('yui', 'emblem_normal');

    expect(yuiSprite?.sizeSpec).toContain('1440x1080');
    expect(yuiSprite?.sizeSpec).toContain('48 cells');
    expect(yuiReference?.sizeSpec).toContain('1024x1024');
    expect(yuiCutin?.sizeSpec).toContain('1440x360');
    expect(yuiEmblem?.sizeSpec).toContain('512x512');
    expect(yuiEmblem?.sizeSpec).toContain('#00FF00');
  });

  it('keeps kind-specific output specs explicit', () => {
    for (const pack of characterAssetPromptPacks) {
      for (const prompt of pack.prompts) {
        if (prompt.kind === 'sprite_sheet_180') {
          expect(prompt.sizeSpec).toContain('1440x1080');
          expect(prompt.sizeSpec).toContain('8 columns x 6 rows');
          expect(prompt.sizeSpec).toContain('48 cells');
          expect(prompt.sizeSpec).toContain('180x180');
          expect(prompt.sizeSpec).toContain('transparent background');
        } else if (prompt.kind === 'character_reference') {
          expect(prompt.sizeSpec).toContain('1024x1024');
          expect(prompt.sizeSpec).toContain('transparent background');
        } else if (prompt.kind.endsWith('_cutin')) {
          expect(prompt.sizeSpec).toContain('1440x360');
          expect(prompt.sizeSpec).toContain('transparent background');
          expect(prompt.sizeSpec).toContain('horizontal wide');
        } else if (prompt.kind.startsWith('emblem_')) {
          expect(prompt.sizeSpec).toContain('512x512');
          expect(prompt.sizeSpec).toContain('#00FF00 chroma key background');
          expect(prompt.prompt).toContain('UI processing');
        }
      }
    }
  });

  it('exposes lookup helpers', () => {
    for (const definition of characterDefinitions) {
      expect(getCharacterAssetPromptPack(definition.id)?.characterId).toBe(definition.id);
      for (const kind of CHARACTER_ASSET_PROMPT_KINDS) {
        expect(getCharacterAssetPrompt(definition.id, kind)?.kind).toBe(kind);
      }
    }

    expect(getCharacterAssetPromptPack('missing')).toBeUndefined();
    expect(getCharacterAssetPrompt('missing', 'sprite_sheet_180')).toBeUndefined();
  });
});
