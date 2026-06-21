import { launchCoreCharacterKnowledgeReplies } from '../data/characterKnowledgeReplies';
import { launchCoreKnowledgeLines } from '../data/knowledgeLines';
import type {
  CharacterKnowledgeReply,
  KnowledgeCategory,
  KnowledgeLine,
  KnowledgeRegion,
  LoadingKnowledgeContext,
  LoadingKnowledgeState,
  SeenKnowledgeEntry,
  SelectedKnowledgeLine,
} from '../types/knowledge';

const SEEN_STORAGE_KEY = 'vampPon.seenKnowledgeEntries.v1';
const HISTORY_STORAGE_KEY = 'vampPon.recentKnowledgeHistory.v1';
const RECENT_LINE_LIMIT = 3;
const RECENT_REPLY_LIMIT = 5;
const RECENT_CATEGORY_LIMIT = 3;
const RECENT_REGION_LIMIT = 3;

const DEFAULT_STATE: LoadingKnowledgeState = {
  seenKnowledgeEntries: [],
  recentKnowledgeLineIds: [],
  recentReplyIds: [],
  recentCategories: [],
  recentRegions: [],
};

type StoredHistory = Pick<
  LoadingKnowledgeState,
  'recentKnowledgeLineIds' | 'recentReplyIds' | 'recentCategories' | 'recentRegions'
>;

function isBrowserStorageAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function uniqueLast<T>(values: T[], limit: number): T[] {
  return values.slice(-limit);
}

function intersects(a: string[] | undefined, b: string[] | undefined): boolean {
  if (!a?.length || !b?.length) return false;
  const bSet = new Set(b);
  return a.some((value) => bSet.has(value));
}

function pickOne<T>(items: T[]): T | null {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
}

function isSameCategoryRepeated(categories: KnowledgeCategory[], next: KnowledgeCategory): boolean {
  if (categories.length < RECENT_CATEGORY_LIMIT - 1) return false;
  const recent = categories.slice(-(RECENT_CATEGORY_LIMIT - 1));
  return recent.every((category) => category === next);
}

function isRareWordRepeated(categories: KnowledgeCategory[], next: KnowledgeCategory): boolean {
  if (next !== 'rare_word') return false;
  return categories.at(-1) === 'rare_word';
}

function isSameRegionRepeated(regions: KnowledgeRegion[], next?: KnowledgeRegion): boolean {
  if (!next || regions.length < RECENT_REGION_LIMIT - 1) return false;
  const recent = regions.slice(-(RECENT_REGION_LIMIT - 1));
  return recent.every((region) => region === next);
}

export class LoadingKnowledgeManager {
  private state: LoadingKnowledgeState;

  constructor(
    private readonly lines: KnowledgeLine[] = launchCoreKnowledgeLines,
    private readonly replies: CharacterKnowledgeReply[] = launchCoreCharacterKnowledgeReplies,
  ) {
    this.state = this.loadState();
  }

  select(context: LoadingKnowledgeContext = {}): SelectedKnowledgeLine | null {
    const candidates = this.lines.filter((line) => this.isLineSelectable(line, context));
    const unseen = candidates.filter((line) => !this.state.seenKnowledgeEntries.some((entry) => entry.id === line.id));
    const selectedLine = pickOne(unseen.length > 0 ? unseen : candidates);
    if (!selectedLine) return null;

    const reply = this.selectReply(selectedLine, context);
    return { line: selectedLine, reply };
  }

  markShown(selection: SelectedKnowledgeLine, options: { completedRead?: boolean; stageId?: string } = {}): void {
    const now = Date.now();
    const entry = this.upsertSeenEntry(selection.line.id, now, options.completedRead === true, options.stageId);

    if (selection.reply && !entry.replyIdsSeen.includes(selection.reply.id)) {
      entry.replyIdsSeen.push(selection.reply.id);
    }

    this.state.recentKnowledgeLineIds = uniqueLast(
      [...this.state.recentKnowledgeLineIds, selection.line.id],
      RECENT_LINE_LIMIT,
    );
    if (selection.reply) {
      this.state.recentReplyIds = uniqueLast([...this.state.recentReplyIds, selection.reply.id], RECENT_REPLY_LIMIT);
    }
    this.state.recentCategories = uniqueLast([...this.state.recentCategories, selection.line.category], RECENT_CATEGORY_LIMIT);
    if (selection.line.region) {
      this.state.recentRegions = uniqueLast([...this.state.recentRegions, selection.line.region], RECENT_REGION_LIMIT);
    }

    this.saveState();
  }

  markCompletedRead(lineId: string): void {
    const now = Date.now();
    this.upsertSeenEntry(lineId, now, true);
    this.saveState();
  }

  getState(): LoadingKnowledgeState {
    return {
      seenKnowledgeEntries: [...this.state.seenKnowledgeEntries],
      recentKnowledgeLineIds: [...this.state.recentKnowledgeLineIds],
      recentReplyIds: [...this.state.recentReplyIds],
      recentCategories: [...this.state.recentCategories],
      recentRegions: [...this.state.recentRegions],
    };
  }

  resetForDebug(): void {
    this.state = { ...DEFAULT_STATE };
    this.saveState();
  }

  private isLineSelectable(line: KnowledgeLine, context: LoadingKnowledgeContext): boolean {
    if (line.commercialStatus === 'do-not-display') return false;
    if (this.state.recentKnowledgeLineIds.includes(line.id)) return false;
    if (isSameCategoryRepeated(this.state.recentCategories, line.category)) return false;
    if (isRareWordRepeated(this.state.recentCategories, line.category)) return false;
    if (isSameRegionRepeated(this.state.recentRegions, line.region)) return false;

    if (line.launchTier === 'launch-core') return true;
    if (line.launchTier === 'context-gated') return intersects(line.gateTags, this.resolveContextTags(context));
    return false;
  }

  private selectReply(line: KnowledgeLine, context: LoadingKnowledgeContext): CharacterKnowledgeReply | undefined {
    const candidates = this.replies.filter(
      (reply) => reply.knowledgeLineId === line.id && !this.state.recentReplyIds.includes(reply.id) && reply.rank !== 'C',
    );
    if (candidates.length === 0) return undefined;

    if (context.selectedCharacterId) {
      const characterReply = candidates.find((reply) => reply.characterId === context.selectedCharacterId);
      if (characterReply) return characterReply;
    }

    const sRank = candidates.filter((reply) => reply.rank === 'S');
    return pickOne(sRank.length > 0 ? sRank : candidates) ?? undefined;
  }

  private resolveContextTags(context: LoadingKnowledgeContext): string[] {
    const tags = [...(context.tags ?? [])];
    if (context.isAfterDefeat) tags.push('defeat', 'retry');
    if (context.isBlackGaugeHigh) tags.push('black', 'burden', 'attachment');
    if (context.isFirstBoot) tags.push('first-boot');
    if (context.stageId) tags.push(context.stageId);
    return tags;
  }

  private upsertSeenEntry(lineId: string, now: number, completedRead: boolean, stageId?: string): SeenKnowledgeEntry {
    let entry = this.state.seenKnowledgeEntries.find((item) => item.id === lineId);
    if (!entry) {
      entry = {
        id: lineId,
        firstSeenAt: now,
        lastSeenAt: now,
        seenCount: 0,
        completedReadCount: 0,
        stagesSeenIn: [],
        replyIdsSeen: [],
      };
      this.state.seenKnowledgeEntries.push(entry);
    }

    entry.lastSeenAt = now;
    entry.seenCount += 1;
    if (completedRead) entry.completedReadCount += 1;
    if (stageId && !entry.stagesSeenIn.includes(stageId)) entry.stagesSeenIn.push(stageId);
    return entry;
  }

  private loadState(): LoadingKnowledgeState {
    if (!isBrowserStorageAvailable()) return { ...DEFAULT_STATE };

    const seenKnowledgeEntries = safeParse<SeenKnowledgeEntry[]>(
      window.localStorage.getItem(SEEN_STORAGE_KEY),
      [],
    );
    const history = safeParse<StoredHistory>(window.localStorage.getItem(HISTORY_STORAGE_KEY), {
      recentKnowledgeLineIds: [],
      recentReplyIds: [],
      recentCategories: [],
      recentRegions: [],
    });

    return {
      seenKnowledgeEntries: Array.isArray(seenKnowledgeEntries) ? seenKnowledgeEntries : [],
      recentKnowledgeLineIds: Array.isArray(history.recentKnowledgeLineIds) ? history.recentKnowledgeLineIds : [],
      recentReplyIds: Array.isArray(history.recentReplyIds) ? history.recentReplyIds : [],
      recentCategories: Array.isArray(history.recentCategories) ? history.recentCategories : [],
      recentRegions: Array.isArray(history.recentRegions) ? history.recentRegions : [],
    };
  }

  private saveState(): void {
    if (!isBrowserStorageAvailable()) return;
    try {
      window.localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(this.state.seenKnowledgeEntries));
      window.localStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify({
          recentKnowledgeLineIds: this.state.recentKnowledgeLineIds,
          recentReplyIds: this.state.recentReplyIds,
          recentCategories: this.state.recentCategories,
          recentRegions: this.state.recentRegions,
        } satisfies StoredHistory),
      );
    } catch {
      // Storage quota/private mode failures must never block gameplay.
    }
  }
}

export const loadingKnowledgeManager = new LoadingKnowledgeManager();
