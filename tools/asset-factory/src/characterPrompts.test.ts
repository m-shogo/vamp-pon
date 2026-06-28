import { describe, expect, it } from 'vitest';
import {
  buildCharacterPromptBatchMarkdown,
  buildCharacterPromptMarkdown,
  CHARACTER_ASSET_PROMPT_KINDS,
  getCharacterPromptOptions,
} from './characterPrompts';

describe('asset factory character prompt helpers', () => {
  it('builds markdown with prompt, negative prompt, checklist, and output path', () => {
    const markdown = buildCharacterPromptMarkdown('yui', 'sprite_sheet_180');

    expect(markdown).toContain('# Character Asset Prompt');
    expect(markdown).toContain('Character: ユイ / yui');
    expect(markdown).toContain('Kind: sprite_sheet_180');
    expect(markdown).toContain('Output: public/assets/prototypes/characters/yui/');
    expect(markdown).toContain('## Prompt');
    expect(markdown).toContain('## Negative Prompt');
    expect(markdown).toContain('no text');
    expect(markdown).toContain('## Review Checklist');
    expect(markdown).toContain('Generated image must pass Asset Factory QA');
  });

  it('adds source-only chroma-key notes for emblem prompts', () => {
    const markdown = buildCharacterPromptMarkdown('yui', 'emblem_normal');

    expect(markdown).toContain('#00FF00 green background is source-only');
    expect(markdown).toContain('Chroma-key removal and RGBA QA are required');
    expect(markdown).toContain('Check green fringe after processing');
  });

  it('returns a safe markdown message for unknown character ids', () => {
    expect(() => buildCharacterPromptMarkdown('missing', 'sprite_sheet_180')).not.toThrow();
    expect(buildCharacterPromptMarkdown('missing', 'sprite_sheet_180')).toContain('Prompt not found');
  });

  it('filters character options between Core5 and all characters', () => {
    const core5 = getCharacterPromptOptions('core5');
    const all = getCharacterPromptOptions('all');

    expect(core5.map((option) => option.id)).toEqual(['yui', 'asa', 'nagi', 'michiru', 'tomori']);
    expect(core5.every((option) => option.statusLabel === 'Core5 / playable seed')).toBe(true);
    expect(all.length).toBeGreaterThan(core5.length);
    expect(all.some((option) => option.statusLabel === 'Seed only')).toBe(true);
    expect(all.some((option) => option.statusLabel === 'Shadow data only')).toBe(true);
  });

  it('can build batch markdown for Core5 and all prompt kinds', () => {
    const markdown = buildCharacterPromptBatchMarkdown('core5');

    expect(markdown).toContain('Character: ユイ / yui');
    expect(markdown).toContain('Character: トモリ / tomori');
    expect(markdown).toContain(`Kind: ${CHARACTER_ASSET_PROMPT_KINDS[0]}`);
    expect(markdown).toContain(`Kind: ${CHARACTER_ASSET_PROMPT_KINDS[CHARACTER_ASSET_PROMPT_KINDS.length - 1]}`);
  });
});
