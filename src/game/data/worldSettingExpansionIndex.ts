export type WorldSettingPriority = 'P0' | 'P1' | 'P2';

export type WorldSettingExpansionEntry = {
  id: string;
  priority: WorldSettingPriority;
  label: string;
  primarySource: string;
  authority: 'WORLD_SETTING_EXPANSION_SOURCE';
  runtimeAutoPromotionAllowed: false;
  humanReviewRequiredForFinalCanon: boolean;
};

export const worldSettingExpansionEntries: readonly WorldSettingExpansionEntry[] = [
  { id: 'institution-map', priority: 'P0', label: 'Institution Map', primarySource: 'docs/world-institution-faction-map-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'faction-map', priority: 'P0', label: 'Faction Map', primarySource: 'docs/world-institution-faction-map-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'geography-travel-atlas', priority: 'P0', label: 'Geography / Travel Atlas', primarySource: 'docs/world-geography-travel-atlas-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'knowledge-secret-matrix', priority: 'P0', label: 'Knowledge / Secret Matrix', primarySource: 'docs/world-knowledge-secret-matrix-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'historical-incident-ledger', priority: 'P0', label: 'Historical Incident Ledger', primarySource: 'docs/world-historical-incident-ledger-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'life-death-injury-rulebook', priority: 'P0', label: 'Life / Death / Injury Rulebook', primarySource: 'docs/world-life-death-injury-rulebook-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'sakumei-operational-bible', priority: 'P0', label: 'Sakumei Operational Bible', primarySource: 'docs/sakumei-operational-bible-candidate-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'mystery-foreshadow-payoff-ledger', priority: 'P0', label: 'Mystery / Foreshadow / Payoff Ledger', primarySource: 'docs/world-mystery-foreshadow-payoff-ledger-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'height-age-era-lineup', priority: 'P0', label: 'Height / Age / Era Lineup', primarySource: 'docs/character-height-age-era-lineup-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },

  { id: 'family-household-atlas', priority: 'P1', label: 'Family / Household Atlas', primarySource: 'docs/character-family-household-atlas-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'civilian-life-bible', priority: 'P1', label: 'Civilian Life Bible', primarySource: 'docs/world-civilian-society-bible-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'world-economy', priority: 'P1', label: 'World Economy', primarySource: 'docs/world-civilian-society-bible-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'local-food-culture', priority: 'P1', label: 'Local Food / Culture', primarySource: 'docs/world-civilian-society-bible-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'calendar-festival-ritual', priority: 'P1', label: 'Calendar / Festival / Ritual', primarySource: 'docs/world-civilian-society-bible-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'religion-belief-funeral', priority: 'P1', label: 'Religion / Belief / Funeral', primarySource: 'docs/world-civilian-society-bible-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'rumor-media-reputation', priority: 'P1', label: 'Rumor / Media / Reputation', primarySource: 'docs/world-civilian-society-bible-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'language-slang', priority: 'P1', label: 'Language / Slang', primarySource: 'docs/world-civilian-society-bible-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'medicine-care-recovery', priority: 'P1', label: 'Medicine / Care / Recovery', primarySource: 'docs/world-civilian-society-bible-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'desire-need-lie-shame-matrix', priority: 'P1', label: 'Desire / Need / Lie / Shame Matrix', primarySource: 'docs/character-interior-social-dynamics-bible-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'character-secret-inventory', priority: 'P1', label: 'Character Secret Inventory', primarySource: 'docs/character-interior-social-dynamics-bible-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'recurring-gag-bible', priority: 'P1', label: 'Recurring Gag Bible', primarySource: 'docs/character-interior-social-dynamics-bible-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: false },
  { id: 'iconic-quote-callback-bank', priority: 'P1', label: 'Iconic Quote / Callback Bank', primarySource: 'docs/character-interior-social-dynamics-bible-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'mentor-rival-successor-map', priority: 'P1', label: 'Mentor / Rival / Successor Map', primarySource: 'docs/character-interior-social-dynamics-bible-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'episode-chapter-engine', priority: 'P1', label: 'Episode / Chapter Engine', primarySource: 'docs/story-episode-emotional-engine-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: false },
  { id: 'cliffhanger-library', priority: 'P1', label: 'Cliffhanger Library', primarySource: 'docs/story-episode-emotional-engine-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: false },
  { id: 'quiet-breather-episode-plan', priority: 'P1', label: 'Quiet / Breather Episode Plan', primarySource: 'docs/story-episode-emotional-engine-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'emotional-temperature-map', priority: 'P1', label: 'Emotional Temperature Map', primarySource: 'docs/story-episode-emotional-engine-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: false },

  { id: 'environment-visual-bible', priority: 'P2', label: 'Environment Visual Bible', primarySource: 'docs/world-production-expression-bible-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'prop-master-book', priority: 'P2', label: 'Prop Master Book', primarySource: 'docs/world-production-expression-bible-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'audio-leitmotif-bible', priority: 'P2', label: 'Audio / Leitmotif Bible', primarySource: 'docs/world-production-expression-bible-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'localization-guide', priority: 'P2', label: 'Localization Guide', primarySource: 'docs/world-production-expression-bible-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
  { id: 'merch-scene-matrix', priority: 'P2', label: 'Merch Scene Matrix', primarySource: 'docs/world-production-expression-bible-v1.md', authority: 'WORLD_SETTING_EXPANSION_SOURCE', runtimeAutoPromotionAllowed: false, humanReviewRequiredForFinalCanon: true },
] as const;

export const worldSettingExpansionSummary = {
  total: worldSettingExpansionEntries.length,
  p0: worldSettingExpansionEntries.filter((entry) => entry.priority === 'P0').length,
  p1: worldSettingExpansionEntries.filter((entry) => entry.priority === 'P1').length,
  p2: worldSettingExpansionEntries.filter((entry) => entry.priority === 'P2').length,
  uniqueSourceCount: new Set(worldSettingExpansionEntries.map((entry) => entry.primarySource)).size,
  runtimeAutoPromotionAllowed: false,
} as const;
