export type KnowledgeCategory =
  | 'quote'
  | 'regional_quote'
  | 'everyday_phrase'
  | 'rare_word'
  | 'vamp_original'
  | 'parody_prompt';

export type KnowledgeRegion = 'india' | 'europe' | 'east_asia' | 'japan' | 'america_caribbean';

export type CommercialStatus =
  | 'safe-candidate'
  | 'common-expression-candidate'
  | 'public-domain-candidate'
  | 'final-check-required'
  | 'original'
  | 'do-not-display';

export type PresentationPattern =
  | 'ink-bloom'
  | 'lantern-reveal'
  | 'page-turn'
  | 'bell-ripple'
  | 'postcard-stamp'
  | 'star-pin'
  | 'water-memory'
  | 'thread-stitch'
  | 'black-glitch'
  | 'curtain-whisper';

export type LaunchTier = 'launch-core' | 'context-gated' | 'hold';

export type KnowledgeLine = {
  id: string;
  category: KnowledgeCategory;
  originalText: string;
  sourceLabel: string;
  languageLabel: string;
  meaningJa: string;
  researchHooks: string[];
  region?: KnowledgeRegion;
  tags: string[];
  commercialStatus: CommercialStatus;
  presentationPattern: PresentationPattern;
  minVisibleMs: number;
  launchTier: LaunchTier;
  gateTags?: string[];
};

export type CharacterKnowledgeReply = {
  id: string;
  knowledgeLineId: string;
  characterId: string;
  replyJa: string;
  replyEn?: string;
  tone: 'serious' | 'small-joke' | 'sad-funny' | 'dry' | 'gentle' | 'quiet' | 'soft-parody';
  tags: string[];
  rank: 'S' | 'A' | 'B' | 'C';
};

export type SeenKnowledgeEntry = {
  id: string;
  firstSeenAt: number;
  lastSeenAt: number;
  seenCount: number;
  completedReadCount: number;
  stagesSeenIn: string[];
  replyIdsSeen: string[];
};

export type LoadingKnowledgeContext = {
  selectedCharacterId?: string;
  stageId?: string;
  tags?: string[];
  isFirstBoot?: boolean;
  isAfterDefeat?: boolean;
  isBlackGaugeHigh?: boolean;
};

export type SelectedKnowledgeLine = {
  line: KnowledgeLine;
  reply?: CharacterKnowledgeReply;
};

export type LoadingKnowledgeState = {
  seenKnowledgeEntries: SeenKnowledgeEntry[];
  recentKnowledgeLineIds: string[];
  recentReplyIds: string[];
  recentCategories: KnowledgeCategory[];
  recentRegions: KnowledgeRegion[];
};
