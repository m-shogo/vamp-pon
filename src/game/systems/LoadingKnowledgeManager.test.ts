import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CharacterKnowledgeReply, KnowledgeLine } from '../types/knowledge';
import { LoadingKnowledgeManager } from './LoadingKnowledgeManager';

const baseLine = {
  sourceLabel: 'Test source',
  languageLabel: 'Japanese',
  meaningJa: 'テスト用の意味。',
  researchHooks: [],
  tags: ['test'],
  commercialStatus: 'safe-candidate',
  presentationPattern: 'page-turn',
  minVisibleMs: 4600,
  launchTier: 'launch-core',
} satisfies Partial<KnowledgeLine>;

function line(overrides: Partial<KnowledgeLine> & Pick<KnowledgeLine, 'id' | 'category' | 'originalText'>): KnowledgeLine {
  return {
    ...baseLine,
    ...overrides,
  } as KnowledgeLine;
}

function reply(overrides: Partial<CharacterKnowledgeReply> & Pick<CharacterKnowledgeReply, 'id' | 'knowledgeLineId' | 'characterId' | 'replyJa'>): CharacterKnowledgeReply {
  return {
    replyEn: undefined,
    tone: 'gentle',
    tags: ['test'],
    rank: 'S',
    ...overrides,
  };
}

function clearStorageIfAvailable(): void {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return;
  window.localStorage.removeItem('vampPon.seenKnowledgeEntries.v1');
  window.localStorage.removeItem('vampPon.recentKnowledgeHistory.v1');
}

afterEach(() => {
  vi.restoreAllMocks();
  clearStorageIfAvailable();
});

describe('LoadingKnowledgeManager', () => {
  it('launch-core のKnowledgeLineと返信を選ぶ', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const manager = new LoadingKnowledgeManager(
      [line({ id: 'line-a', category: 'everyday_phrase', originalText: 'A' })],
      [reply({ id: 'reply-a', knowledgeLineId: 'line-a', characterId: 'yui', replyJa: 'A reply' })],
    );

    const selected = manager.select();

    expect(selected?.line.id).toBe('line-a');
    expect(selected?.reply?.id).toBe('reply-a');
  });

  it('do-not-display と hold は通常候補から除外する', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const manager = new LoadingKnowledgeManager(
      [
        line({ id: 'hidden', category: 'quote', originalText: 'Hidden', commercialStatus: 'do-not-display' }),
        line({ id: 'hold', category: 'quote', originalText: 'Hold', launchTier: 'hold' }),
        line({ id: 'visible', category: 'quote', originalText: 'Visible' }),
      ],
      [],
    );

    expect(manager.select()?.line.id).toBe('visible');
  });

  it('selectedCharacterId に一致する返信を優先する', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const manager = new LoadingKnowledgeManager(
      [line({ id: 'line-a', category: 'quote', originalText: 'A' })],
      [
        reply({ id: 'reply-yui', knowledgeLineId: 'line-a', characterId: 'yui', replyJa: 'Yui reply' }),
        reply({ id: 'reply-nagi', knowledgeLineId: 'line-a', characterId: 'nagi', replyJa: 'Nagi reply' }),
      ],
    );

    expect(manager.select({ selectedCharacterId: 'nagi' })?.reply?.id).toBe('reply-nagi');
  });

  it('直近表示したKnowledgeLineを再選定しない', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const manager = new LoadingKnowledgeManager(
      [
        line({ id: 'line-a', category: 'quote', originalText: 'A' }),
        line({ id: 'line-b', category: 'quote', originalText: 'B' }),
      ],
      [],
    );

    const first = manager.select();
    expect(first?.line.id).toBe('line-a');
    if (!first) throw new Error('expected first selection');
    manager.markShown(first);

    expect(manager.select()?.line.id).toBe('line-b');
  });

  it('rare_word を2連続で選ばない', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const manager = new LoadingKnowledgeManager(
      [
        line({ id: 'rare-a', category: 'rare_word', originalText: 'Rare A' }),
        line({ id: 'rare-b', category: 'rare_word', originalText: 'Rare B' }),
        line({ id: 'quote-a', category: 'quote', originalText: 'Quote A' }),
      ],
      [],
    );

    const first = manager.select();
    expect(first?.line.id).toBe('rare-a');
    if (!first) throw new Error('expected first selection');
    manager.markShown(first);

    expect(manager.select()?.line.category).toBe('quote');
  });

  it('context-gated は gateTags とcontextが一致した場合だけ候補に入る', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const gated = line({
      id: 'gated',
      category: 'quote',
      originalText: 'Gated',
      launchTier: 'context-gated',
      gateTags: ['retry'],
    });
    const fallback = line({ id: 'fallback', category: 'quote', originalText: 'Fallback' });

    const manager = new LoadingKnowledgeManager([gated, fallback], []);
    expect(manager.select()?.line.id).toBe('fallback');

    manager.markShown({ line: fallback });
    expect(manager.select({ isAfterDefeat: true })?.line.id).toBe('gated');
  });
});
