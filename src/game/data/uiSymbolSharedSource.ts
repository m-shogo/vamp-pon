import type { ArtworkApprovalState } from './sharedSourceContracts.ts';

export const UI_ICON_MASTER_SIZES = [16, 24, 32, 48, 64, 96] as const;
export type UiIconMasterSize = (typeof UI_ICON_MASTER_SIZES)[number];

export type UiSymbolId =
  | 'CHARACTER'
  | 'WEAPON'
  | 'ITEM'
  | 'ENEMY'
  | 'BOSS'
  | 'STAGE'
  | 'ACHIEVEMENT'
  | 'REWARD'
  | 'COLLECTION'
  | 'ROUTE_STAMP'
  | 'TICKET_PUNCH'
  | 'TOUMON'
  | 'WARNING'
  | 'LOCKED'
  | 'UNLOCKED'
  | 'NEW'
  | 'RARE'
  | 'CLEAR'
  | 'DAWN'
  | 'BLACK_INK';

export type UiSymbolAuthority =
  | 'SOURCE_CATEGORY_ADAPTER'
  | 'CANDIDATE_SEMANTIC_GRAMMAR'
  | 'FINAL_VECTOR_PENDING'
  | 'WORLD_AUTHORITY_PENDING';

export type UiSymbolSharedSourceEntry = {
  id: UiSymbolId;
  displayName: string;
  authority: UiSymbolAuthority;
  sourceRelation: string;
  shapeRule: string;
  oneColorRule: string;
  colorRule: string;
  smallScaleRule: string;
  nativeTextRule: string;
  accessibilityRule: string;
  avoid: readonly string[];
  referenceGenerationReady: false;
  runtimeReady: false;
  artworkReady: false;
  artworkState: ArtworkApprovalState;
};

export type UiIconSizeRule = {
  size: UiIconMasterSize;
  semanticBudget: string;
  detailRule: string;
  labelRule: string;
};

export const UI_ICON_SIZE_RULES: readonly UiIconSizeRule[] = [
  { size: 16, semanticBudget: 'primary silhouette + at most one binary notch/gap', detailRule: 'drop material texture and all decorative secondary detail; negative-space gap must remain open', labelRule: 'never bake text; accessible/native label remains outside the icon' },
  { size: 24, semanticBudget: 'primary silhouette + one secondary identity hook', detailRule: 'one internal division/edge may appear if it does not collapse at mobile density', labelRule: 'native label/tooltip remains separate' },
  { size: 32, semanticBudget: 'full small-scale semantic icon', detailRule: 'preserve category/identity plus one material/history cue; no micro ornament', labelRule: 'native label remains separate' },
  { size: 48, semanticBudget: 'small icon plus restrained material cue', detailRule: 'wear/paper/ink edge may appear without changing silhouette', labelRule: 'native label remains separate' },
  { size: 64, semanticBudget: 'medium presentation icon', detailRule: 'one or two material/history details allowed; still matches 16–32px silhouette', labelRule: 'native label remains separate' },
  { size: 96, semanticBudget: 'large UI/collection presentation', detailRule: 'more material fidelity is allowed but no new semantic geometry may appear only at this size', labelRule: 'native label remains separate' },
] as const;

const COMMON_AVOID = [
  'baked readable text, letters, numbers or watermark',
  'neon cyan/purple AI palette',
  'glassmorphism or glossy app-icon tile',
  'uniform circular badge frame around every symbol',
  'color as the only way to distinguish state',
  'micro detail required for meaning below 32px',
  'crown, wings, zodiac glyph or heraldic shield as generic rarity/importance shorthand',
] as const;

function sourceCategory(
  id: UiSymbolId,
  displayName: string,
  sourceRelation: string,
  shapeRule: string,
  smallScaleRule: string,
): UiSymbolSharedSourceEntry {
  return {
    id,
    displayName,
    authority: 'SOURCE_CATEGORY_ADAPTER',
    sourceRelation,
    shapeRule,
    oneColorRule: 'primary source silhouette must remain meaningful in one ink; UI frame cannot be required to identify the category',
    colorRule: 'source theme/accent may assist at 32px+, but 16–24px meaning cannot depend on hue alone',
    smallScaleRule,
    nativeTextRule: 'display name/count/status stays native text/data outside generated art',
    accessibilityRule: 'pair icon with accessible name/state; never communicate gameplay-critical state by color, audio or haptic alone',
    avoid: COMMON_AVOID,
    referenceGenerationReady: false,
    runtimeReady: false,
    artworkReady: false,
    artworkState: 'NOT_GENERATED',
  };
}

function candidateState(
  id: UiSymbolId,
  displayName: string,
  sourceRelation: string,
  shapeRule: string,
  extraAvoid: readonly string[] = [],
): UiSymbolSharedSourceEntry {
  return {
    id,
    displayName,
    authority: 'CANDIDATE_SEMANTIC_GRAMMAR',
    sourceRelation,
    shapeRule,
    oneColorRule: 'state must remain distinct in one ink without glow, gradient or rarity frame',
    colorRule: 'color is secondary reinforcement only; state has a stable shape/gap/edge difference',
    smallScaleRule: '16px uses only the primary state geometry; 24–32px may add one secondary paper/ink cue',
    nativeTextRule: 'state text/count remains native UI; generated icon contains no readable text',
    accessibilityRule: 'pair with native state label/aria/accessibility text where relevant; do not make color the sole distinction',
    avoid: [...COMMON_AVOID, ...extraAvoid],
    referenceGenerationReady: false,
    runtimeReady: false,
    artworkReady: false,
    artworkState: 'NOT_GENERATED',
  };
}

export const uiSymbolSharedSourceEntries: readonly UiSymbolSharedSourceEntry[] = [
  sourceCategory('CHARACTER', 'Character icon', 'commercial Character silhouette / approved portrait source', 'Character head/upper-body silhouette plus one identity hook; body/age/shape locks remain visible and no generic face badge normalization', '16–24px keeps hair/head/shoulder silhouette and one defining shape; never slim or young-normalize Hana/Kaname or others for icon fit'),
  sourceCategory('WEAPON', 'Weapon icon', 'weaponVisualSharedSource.ts', 'whole everyday-object weapon silhouette at a readable angle; evolution preserves base-object lineage', '16–24px keeps object class + one lineage notch/edge; no rarity frame'),
  sourceCategory('ITEM', 'Item icon', 'itemVisualSharedSource.ts', 'single practical/personal object silhouette with one history/material cue where source-supported', '16–24px keeps one object contour; reject potion/gem/orb shorthand'),
  sourceCategory('ENEMY', 'Enemy icon', 'enemyVisualSharedSource.ts', 'Enemy body/family silhouette + exactly one motif hook; no monster portrait frame', '24–32px keeps family discriminator and motif hook; 16px may use family silhouette only'),
  sourceCategory('BOSS', 'Boss icon', 'enemyVisualSharedSource.ts boss rank', 'dominant Great Shadow landmark/object silhouette; scale implied by shape rather than crown/frame', '24–32px keeps one dominant boss motif; no crown/giant aura'),
  sourceCategory('STAGE', 'Stage icon', 'stageVisualSharedSource.ts STAGE_CARD', 'one Stage landmark/motif only; no tiny background scene squeezed into an icon', '24–32px keeps landmark silhouette; 16px may reduce to the single local motif'),
  sourceCategory('ACHIEVEMENT', 'Achievement icon', 'progressionRewardSharedSource.ts candidate achievement visual grammar', 'condition category mark remains distinct from reward icon; final mark geometry remains unapproved', '16–24px uses condition-category silhouette only; no medal/trophy default'),
  sourceCategory('REWARD', 'Reward icon', 'progressionRewardSharedSource.ts reward source', 'reward-native object/resource silhouette; never reuse the achievement/Clear Getter condition mark as the reward itself', '16–24px keeps reward type distinction without gold frame'),
  sourceCategory('COLLECTION', 'Collection icon', 'collectionProgress / Night Record Book source', 'paper/archive/page relation first; section identity must come from approved source category, not generic folder/app icon', '16–24px keeps page/archive silhouette and one section cue'),
  {
    ...candidateState('ROUTE_STAMP', 'Route stamp', 'worldRouteSymbolSharedSource.ts stationStampRule', 'PENDING exact geometry: 1–2-color local place/route/object mark; not universally circular and never Character Toumon', ['real railway station-stamp imitation']),
    authority: 'WORLD_AUTHORITY_PENDING',
  },
  {
    ...candidateState('TICKET_PUNCH', 'Ticket punch', 'worldRouteSymbolSharedSource.ts ticket punch schema', 'PENDING exact geometry: one small state punch derived from future ticket/route authority; never copy a real railway punch shape', ['real railway ticket-punch imitation']),
    authority: 'WORLD_AUTHORITY_PENDING',
  },
  {
    ...candidateState('TOUMON', 'Toumon', 'toumonSimpleSigilCanon.ts semantic/simple-sigil authority', 'FINAL VECTOR PENDING: use only the separately approved Character Toumon vector; this Shared Source cannot invent or approximate final geometry', ['literal animal', 'Named Object pictogram', 'AI-generated final Toumon geometry']),
    authority: 'FINAL_VECTOR_PENDING',
  },
  {
    ...candidateState('WARNING', 'Warning', 'worldRouteSymbolSharedSource.ts warningMark', 'PENDING_WORLD_WARNING_AUTHORITY: use native accessible warning UI temporarily; do not canonize a generated warning mark'),
    authority: 'WORLD_AUTHORITY_PENDING',
  },
  candidateState('LOCKED', 'Locked', 'UI state candidate', 'closed paper tab/bracket state with one blocked gap; avoid generic padlock becoming world Canon', ['generic padlock as final world symbol']),
  candidateState('UNLOCKED', 'Unlocked', 'UI state candidate paired with LOCKED', 'same paper-tab family opened at one edge; shape pair must remain recognizable without green color', ['generic glowing open padlock']),
  candidateState('NEW', 'New', 'UI state candidate', 'small offset paper corner/tab plus one dot; native NEW text may accompany but is never baked into icon', ['burst/star sticker']),
  candidateState('RARE', 'Rare', 'UI state candidate', 'one doubled paper edge or restrained seal layer; rarity comes from a second structural layer, not crown/star/gold glow', ['crown', 'five-point rarity star', 'gold loot-frame shorthand']),
  candidateState('CLEAR', 'Clear', 'result/progression candidate distinct from DAWN', 'open page/route edge with one completed exit notch; keep it distinct from the DAWN world mark and from a generic checkmark badge', ['generic green checkmark badge', 'copying DAWN geometry exactly']),
  {
    ...candidateState('DAWN', 'Dawn', 'worldRouteSymbolSharedSource.ts DAWN abstract authority', 'shallow open arc + one short line exiting below; exact final vector remains NOT_YET_DRAWN', ['literal sunrise', 'sun rays']),
    authority: 'FINAL_VECTOR_PENDING',
  },
  candidateState('BLACK_INK', 'Black Ink', 'enemy/Kokuyou material state', 'one matte irregular ink blot/edge with a dry paper-fiber break; material state, not skull/demon badge', ['skull', 'demon eye', 'wet slime icon']),
] as const;

export const uiSymbolSharedSourceById = new Map(uiSymbolSharedSourceEntries.map((entry) => [entry.id, entry]));

export const uiSymbolSharedSourceSummary = {
  symbolCount: uiSymbolSharedSourceEntries.length,
  sizeCount: UI_ICON_MASTER_SIZES.length,
  masterSizes: UI_ICON_MASTER_SIZES,
  finalGeometryReadyCount: 0,
  referenceGenerationReady: false,
  runtimeReady: false,
  artworkReady: false,
} as const;
