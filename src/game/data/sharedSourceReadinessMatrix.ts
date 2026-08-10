import { sharedSourceGenerationHandoffSummary } from './sharedSourceGenerationHandoff.ts';

export type SharedSourceReadinessCategory =
  | 'Characters'
  | 'Star Beasts'
  | 'Named Objects'
  | 'Toumon'
  | 'Enemies'
  | 'Bosses'
  | 'Weapons'
  | 'Items'
  | 'Stages'
  | 'Clear Getter'
  | 'Achievements'
  | 'Rewards'
  | 'Unlockables'
  | 'Collectibles'
  | 'Routes'
  | 'Stations'
  | 'Tickets'
  | 'Stamps'
  | 'UI Symbols'
  | 'World Effects'
  | 'Collection'
  | 'Night Record Book';

export type ReferenceCandidateReadiness = 'READY' | 'PARTIAL' | 'BLOCKED';
export type RuntimeAlignment = 'RUNTIME_BACKED' | 'PARTIAL' | 'NOT_RUNTIME_SOURCE' | 'UNRESOLVED';
export type ArtworkReadiness = 'NOT_GENERATED' | 'CANDIDATE_HOLD' | 'VECTOR_HOLD' | 'MIXED';

export type SharedSourceReadinessEntry = {
  category: SharedSourceReadinessCategory;
  referenceCandidateReadiness: ReferenceCandidateReadiness;
  runtimeAlignment: RuntimeAlignment;
  artworkReadiness: ArtworkReadiness;
  generationScope: string;
  blockedScope: readonly string[];
  currentMachineSources: readonly string[];
  nextGate: string;
  canBulkGenerateNow: boolean;
  guard: string;
};

function entry(value: SharedSourceReadinessEntry): SharedSourceReadinessEntry {
  return value;
}

/**
 * Current implementation-state overlay.
 *
 * This does not replace audit/history. It answers the operational question:
 * "what may be sent to candidate generation now?"
 * READY/PARTIAL never means APPROVED_REFERENCE, APPROVED_WEB,
 * APPROVED_UNITY, PRODUCTION_READY, or runtime-approved.
 */
export const sharedSourceReadinessMatrix: readonly SharedSourceReadinessEntry[] = [
  entry({
    category: 'Characters', referenceCandidateReadiness: 'PARTIAL', runtimeAlignment: 'RUNTIME_BACKED', artworkReadiness: 'MIXED',
    generationScope: 'Existing Asset Factory Character contracts may generate candidates for launch-eligible Current20 identities only.',
    blockedScope: ['Ren / OFFICIAL_RESERVE remains non-launch and must not be promoted by generation.', 'Generated candidates still require reference/Web/Unity approval separately.'],
    currentMachineSources: ['src/game/data/commercialProductionProfile.ts', 'src/game/data/assetFactoryCatalog.ts', 'src/game/data/sharedSourceGenerationHandoff.ts'],
    nextGate: 'Human candidate comparison and per-surface approval while keeping Official Reserve fail-closed.',
    canBulkGenerateNow: false,
    guard: 'Current20 and Official Reserve must never be flattened into one launch set.',
  }),
  entry({
    category: 'Star Beasts', referenceCandidateReadiness: 'PARTIAL', runtimeAlignment: 'NOT_RUNTIME_SOURCE', artworkReadiness: 'NOT_GENERATED',
    generationScope: 'Current20 Star Beast reference candidates may be generated from beast-first Shared Source; Ren remains Reserve-blocked.',
    blockedScope: ['Ren / OFFICIAL_RESERVE remains blocked.', 'Final Toumon geometry on body/tag is unavailable.', 'Runtime sprite and plush approvals are separate.'],
    currentMachineSources: ['src/game/data/starBeastVisualSharedSource.ts', 'src/game/data/sharedSourceGenerationHandoff.ts'],
    nextGate: 'Compare multiple Current20 species/body references and approve reference identity before runtime or goods derivatives.',
    canBulkGenerateNow: false,
    guard: 'Same constellation does not mean the same individual; duplicate-constellation difference rules remain mandatory.',
  }),
  entry({
    category: 'Named Objects', referenceCandidateReadiness: 'BLOCKED', runtimeAlignment: 'NOT_RUNTIME_SOURCE', artworkReadiness: 'CANDIDATE_HOLD',
    generationScope: 'Named Object stable IDs and visual candidate geometry exist, but bulk reference generation remains intentionally blocked.',
    blockedScope: ['21 three-view geometries remain CANDIDATE_OBJECT_GEOMETRY rather than Current visual Canon.', 'Functional and premium-replica approval remains fail-closed.'],
    currentMachineSources: ['src/game/data/namedObjectRegistry.ts', 'src/game/data/namedObjectVisualSharedSource.ts', 'src/game/data/sharedSourceGenerationHandoff.ts'],
    nextGate: 'Human-approve three-view object geometry before reference generation, replica work, or rich Collection pages.',
    canBulkGenerateNow: false,
    guard: 'Wear, repair marks, provenance, and handling history cannot be invented or cleaned away for premium-looking art.',
  }),
  entry({
    category: 'Toumon', referenceCandidateReadiness: 'BLOCKED', runtimeAlignment: 'NOT_RUNTIME_SOURCE', artworkReadiness: 'VECTOR_HOLD',
    generationScope: 'Do not generate final Toumon geometry; current authority stops at abstract/simple-sigil rules until a vector master is approved.',
    blockedScope: ['Final vector master is not drawn or approved.', 'AI approximation must never become canonical Toumon geometry.'],
    currentMachineSources: ['src/game/data/toumonSimpleSigilCanon.ts', 'src/game/data/sharedSourceGenerationHandoff.ts'],
    nextGate: 'Create and review vector drafts separately, then approve a one-color master plus 16px and embroidery proofs.',
    canBulkGenerateNow: false,
    guard: 'No literal animal, Named Object pictogram, zodiac glyph, crown, wings, or heraldic shield may replace Toumon.',
  }),
  entry({
    category: 'Enemies', referenceCandidateReadiness: 'READY', runtimeAlignment: 'RUNTIME_BACKED', artworkReadiness: 'NOT_GENERATED',
    generationScope: 'Current48 Enemy reference/runtime-source candidates may be generated through existing Asset Factory contracts.',
    blockedScope: ['Artwork approval and Unity runtime approval remain separate.', 'Black-Ink or Dawn variants require explicit source rules rather than automatic recoloring.'],
    currentMachineSources: ['src/game/data/enemyProductionDatabase.ts', 'src/game/data/enemyVisualSharedSource.ts', 'src/game/data/sharedSourceGenerationHandoff.ts'],
    nextGate: 'Generate family-aware candidates, compare silhouette identity, then perform gameplay-size and runtime QA.',
    canBulkGenerateNow: true,
    guard: 'Do not normalize the 48 enemies into one generic AI-monster silhouette or one universal boss language.',
  }),
  entry({
    category: 'Bosses', referenceCandidateReadiness: 'READY', runtimeAlignment: 'RUNTIME_BACKED', artworkReadiness: 'NOT_GENERATED',
    generationScope: 'Boss-rank entries in the Current Enemy authority may generate candidates under the same family-aware production contracts.',
    blockedScope: ['No universal boss-red, crown, demon, or kaiju transformation.', 'Final runtime size and readability approval remain separate.'],
    currentMachineSources: ['src/game/data/enemyProductionDatabase.ts', 'src/game/data/enemyVisualSharedSource.ts', 'src/game/data/sharedSourceGenerationHandoff.ts'],
    nextGate: 'Compare boss candidates against Stage motifs and Great Shadow identity before runtime-scale approval.',
    canBulkGenerateNow: true,
    guard: 'Boss scale and threat language come from source silhouette and stage relation, not generic grandeur shorthand.',
  }),
  entry({
    category: 'Weapons', referenceCandidateReadiness: 'READY', runtimeAlignment: 'RUNTIME_BACKED', artworkReadiness: 'NOT_GENERATED',
    generationScope: 'All Current runtime Weapon reference candidates may be generated from Weapon Shared Source and existing evolution lineage.',
    blockedScope: ['Unity sprite, icon, and VFX approval remain separate from reference approval.', 'No evolution may be invented outside evolutions.ts.'],
    currentMachineSources: ['src/game/data/weapons.ts', 'src/game/data/evolutions.ts', 'src/game/data/weaponVisualSharedSource.ts', 'src/game/data/sharedSourceGenerationHandoff.ts'],
    nextGate: 'Compare transparent object references for base/evolution lineage, then build dedicated small-scale runtime derivatives.',
    canBulkGenerateNow: true,
    guard: 'Every evolution must remain visibly descended from its everyday-object base form.',
  }),
  entry({
    category: 'Items', referenceCandidateReadiness: 'READY', runtimeAlignment: 'PARTIAL', artworkReadiness: 'NOT_GENERATED',
    generationScope: 'Current Item production entries may generate candidates through existing Asset Factory contracts and normalized Item Shared Source.',
    blockedScope: ['Production DB presence does not imply every item is runtime-connected.', 'Final icon and pickup art still require per-surface small-scale QA.'],
    currentMachineSources: ['src/game/data/itemAssetProductionDatabase.ts', 'src/game/data/itemVisualSharedSource.ts', 'src/game/data/sharedSourceGenerationHandoff.ts'],
    nextGate: 'Compare item candidates, prove icon-scale readability, then add explicit runtime mappings where they are absent.',
    canBulkGenerateNow: true,
    guard: 'Do not use generic potion, crystal, gem, orb, or rarity-glow shorthand unless source identity explicitly requires it.',
  }),
  entry({
    category: 'Stages', referenceCandidateReadiness: 'PARTIAL', runtimeAlignment: 'PARTIAL', artworkReadiness: 'NOT_GENERATED',
    generationScope: 'Stage key art plus existing background/parallax candidates may be generated, while route-map identity remains separately blocked.',
    blockedScope: ['Route/station/stamp instances remain unresolved.', 'ROUTE_MAP finalization remains blocked.', 'Web, Loading, and Unity require separate crops and approval.'],
    currentMachineSources: ['src/game/data/stageProductionDatabase.ts', 'src/game/data/stageVisualSharedSource.ts', 'src/game/data/sharedSourceGenerationHandoff.ts'],
    nextGate: 'Review Stage key-art/background candidates while separately defining original route/station instances before route-map production.',
    canBulkGenerateNow: false,
    guard: 'Do not invent station names or codes, derive them from Stage numbers, or bake readable signage into generated art.',
  }),
  entry({
    category: 'Clear Getter', referenceCandidateReadiness: 'BLOCKED', runtimeAlignment: 'RUNTIME_BACKED', artworkReadiness: 'CANDIDATE_HOLD',
    generationScope: 'Stage1 25-cell runtime source is normalized, but final condition-mark or stamp artwork generation remains blocked.',
    blockedScope: ['Natural, targeted, mastery, and secret mark grammar is candidate-only.', 'Stable production relation IDs are not inferred from prose conditions.'],
    currentMachineSources: ['src/game/data/collectionProgress.ts', 'src/game/data/progressionRewardSharedSource.ts'],
    nextGate: 'Approve one-color condition-mark grammar that remains distinct from Toumon and railway/station stamp identities.',
    canBulkGenerateNow: false,
    guard: 'Toumon, Clear Getter marks, ticket punches, and real railway stamp identities must remain separate.',
  }),
  entry({
    category: 'Achievements', referenceCandidateReadiness: 'BLOCKED', runtimeAlignment: 'RUNTIME_BACKED', artworkReadiness: 'CANDIDATE_HOLD',
    generationScope: 'Fourteen runtime achievements are normalized, while exact achievement icon and condition-mark geometry remains unapproved.',
    blockedScope: ['Legacy runtime Stage numbers are not canonical production Stage IDs.', 'Achievement condition marks remain separate from Reward icons.'],
    currentMachineSources: ['src/game/data/achievements.ts', 'src/game/data/progressionRewardSharedSource.ts'],
    nextGate: 'Approve achievement visual grammar and stable source relations without mapping legacy slots by guesswork.',
    canBulkGenerateNow: false,
    guard: 'Do not default every achievement to medal, trophy, gold frame, laurel, or generic platform badge shorthand.',
  }),
  entry({
    category: 'Rewards', referenceCandidateReadiness: 'BLOCKED', runtimeAlignment: 'PARTIAL', artworkReadiness: 'CANDIDATE_HOLD',
    generationScope: 'Forty normalized Reward entries exist, but final Reward icon and completion-presentation artwork remains intentionally blocked.',
    blockedScope: ['Reward icon grammar is not approved.', 'All Lights / 全灯の朝 remains runtimeFrozen=false and final-art HOLD.'],
    currentMachineSources: ['src/game/data/progressionRewardSharedSource.ts', 'src/game/data/sharedSourceGenerationHandoff.ts', 'src/game/data/allLightsCompletion.ts'],
    nextGate: 'Approve reward-type icon and presentation grammar without inventing duplicate currencies or an ending hierarchy.',
    canBulkGenerateNow: false,
    guard: 'All Lights is not True End, and collection or physical-goods purchase is never a completion requirement.',
  }),
  entry({
    category: 'Unlockables', referenceCandidateReadiness: 'BLOCKED', runtimeAlignment: 'UNRESOLVED', artworkReadiness: 'CANDIDATE_HOLD',
    generationScope: 'Legacy runtime Stage2–5 unlock slots are normalized, but canonical production Stage art cannot be generated from those numeric slots.',
    blockedScope: ['Legacy runtime Stage slot to production Stage ID relation remains unresolved.'],
    currentMachineSources: ['src/game/data/waves.ts', 'src/game/persistence/profile.ts', 'src/game/data/progressionRewardSharedSource.ts'],
    nextGate: 'Explicitly reconcile legacy runtime recipes with production Stage authority before canonical unlock presentation.',
    canBulkGenerateNow: false,
    guard: 'Do not derive canonical Stage ID, name, story, or artwork from a legacy numeric runtime slot.',
  }),
  entry({
    category: 'Collectibles', referenceCandidateReadiness: 'BLOCKED', runtimeAlignment: 'PARTIAL', artworkReadiness: 'CANDIDATE_HOLD',
    generationScope: 'Item, Named Object, progression, and Night Record sources exist, but no new unified collectible-art lane is approved.',
    blockedScope: ['Cross-category collectible visual taxonomy remains incomplete.', 'Collection completion must remain separate from True End.'],
    currentMachineSources: ['src/game/data/collectionProgress.ts', 'src/game/data/itemVisualSharedSource.ts', 'src/game/data/namedObjectRegistry.ts', 'src/game/data/nightRecordBookSharedSource.ts'],
    nextGate: 'Use the six-section Night Record adapter for read-only organization before deciding whether any separate collectible presentation is actually needed.',
    canBulkGenerateNow: false,
    guard: 'Do not create a seventh collection taxonomy merely to fit generated assets, monetization, or physical-goods inventory.',
  }),
  entry({
    category: 'Routes', referenceCandidateReadiness: 'BLOCKED', runtimeAlignment: 'NOT_RUNTIME_SOURCE', artworkReadiness: 'VECTOR_HOLD',
    generationScope: 'World ROUTE abstract grammar exists, while route instances and exact vector geometry intentionally remain absent.',
    blockedScope: ['No route instance authority exists.', 'Exact world-symbol and node geometry remains unapproved.'],
    currentMachineSources: ['src/game/data/worldRouteSymbolSharedSource.ts'],
    nextGate: 'Define original route instances and stable IDs, then separately approve exact line, node, return, and gap geometry.',
    canBulkGenerateNow: false,
    guard: 'No real railway route or logo imitation, no Stage-number-derived route code, and no Character Toumon as route identity.',
  }),
  entry({
    category: 'Stations', referenceCandidateReadiness: 'BLOCKED', runtimeAlignment: 'NOT_RUNTIME_SOURCE', artworkReadiness: 'VECTOR_HOLD',
    generationScope: 'Station field schema exists, but approved station instances, names, codes, and exact signage geometry remain intentionally zero.',
    blockedScope: ['No approved station names, codes, or instances.', 'Warning-mark exact authority remains pending.'],
    currentMachineSources: ['src/game/data/worldRouteSymbolSharedSource.ts'],
    nextGate: 'Create original stable station/place instances from approved world authority, then define native-text signage separately.',
    canBulkGenerateNow: false,
    guard: 'Do not infer station codes from Stage numbers or imitate real railway operator, station, logo, color, or signage identity.',
  }),
  entry({
    category: 'Tickets', referenceCandidateReadiness: 'BLOCKED', runtimeAlignment: 'NOT_RUNTIME_SOURCE', artworkReadiness: 'VECTOR_HOLD',
    generationScope: 'Ticket front/back field schema exists, while route-linked ticket instances and exact punch vocabulary remain intentionally zero.',
    blockedScope: ['No approved route or station instances exist.', 'Punch geometry remains pending.', 'Secret-ticket content needs explicit reveal authority.'],
    currentMachineSources: ['src/game/data/worldRouteSymbolSharedSource.ts'],
    nextGate: 'Define original route/station instances and exact punch/state vocabulary before any ticket production or page generation.',
    canBulkGenerateNow: false,
    guard: 'Ticket names, codes, and phrases stay native data/text; do not imitate real railway tickets or print unrevealed story truth.',
  }),
  entry({
    category: 'Stamps', referenceCandidateReadiness: 'BLOCKED', runtimeAlignment: 'NOT_RUNTIME_SOURCE', artworkReadiness: 'VECTOR_HOLD',
    generationScope: 'Station-stamp schema exists, but local motif instances and exact stamp geometries remain unapproved.',
    blockedScope: ['Local motif and route instance authority is missing.', 'Exact stamp vectors and small-scale proofs remain pending.'],
    currentMachineSources: ['src/game/data/worldRouteSymbolSharedSource.ts', 'src/game/data/uiSymbolSharedSource.ts'],
    nextGate: 'Approve original local stamp grammar and instance data, then prove one- or two-color output at 16–32px equivalents.',
    canBulkGenerateNow: false,
    guard: 'Stamps are not universally circular and must never use Character Toumon as the central station logo.',
  }),
  entry({
    category: 'UI Symbols', referenceCandidateReadiness: 'BLOCKED', runtimeAlignment: 'PARTIAL', artworkReadiness: 'CANDIDATE_HOLD',
    generationScope: 'Twenty semantic icon contracts and a 16/24/32/48/64/96px matrix exist, but exact final geometry is not broadly approved.',
    blockedScope: ['Toumon, Route Stamp, Ticket Punch, Warning, and Dawn exact vectors remain pending.', 'Locked, New, Rare, and Clear grammar remains candidate-level.'],
    currentMachineSources: ['src/game/data/uiSymbolSharedSource.ts'],
    nextGate: 'Approve an icon geometry family, then prove one-color and small-scale recognition before surface-specific final artwork.',
    canBulkGenerateNow: false,
    guard: 'Color cannot be the only state distinction, and icons must not collapse into one circular glass/neon badge system.',
  }),
  entry({
    category: 'World Effects', referenceCandidateReadiness: 'PARTIAL', runtimeAlignment: 'PARTIAL', artworkReadiness: 'NOT_GENERATED',
    generationScope: 'All 13 semantic events now have an effect-specific P14 handoff: three isolated texture-reference lanes, six procedural-first events, three native-UI-first events, and Toumon blocked.',
    blockedScope: ['Device creative approval for timing, haptic, shake, and final runtime composition remains separate.', 'Generated texture references still need human comparison and runtime rebuild/packing.', 'Photosensitive, reduced-motion, reduced-flash, and performance QA remain mandatory.'],
    currentMachineSources: ['src/game/data/worldEffectSharedSource.ts', 'src/game/data/worldEffectGenerationHandoff.ts', 'src/game/ui/visualDesign.ts', 'docs/AUDIO-HAPTIC-DIRECTION.md'],
    nextGate: 'Generate/compare only the three approved texture-reference event lanes, then rebuild runtime derivatives and complete device creative QA.',
    canBulkGenerateNow: false,
    guard: 'No whiteout, strobe, continuous shake, generic cyan-purple AI glow, or audio/haptic-only critical information; Toumon geometry remains blocked.',
  }),
  entry({
    category: 'Collection', referenceCandidateReadiness: 'PARTIAL', runtimeAlignment: 'PARTIAL', artworkReadiness: 'CANDIDATE_HOLD',
    generationScope: 'Cross-category read-only organization now exists through the fixed six-section Night Record adapter, but final collection-page visual composition is not approved.',
    blockedScope: ['Named Object geometry, route/station instances, and normalized Dawn proof records remain incomplete.', 'A final page/export visual contract has not been approved.'],
    currentMachineSources: ['src/game/data/nightRecordBookSharedSource.ts', 'src/game/data/collectionProgress.ts', 'src/game/data/progressionRewardSharedSource.ts', 'src/game/data/currentRelationshipInventory.ts'],
    nextGate: 'Define page-level native data/layout rules only after section sources are stable; keep incomplete sections visibly fail-closed.',
    canBulkGenerateNow: false,
    guard: 'Collection completion remains optional to True End, cannot require physical goods, and cannot create extra sections merely for generated assets.',
  }),
  entry({
    category: 'Night Record Book', referenceCandidateReadiness: 'PARTIAL', runtimeAlignment: 'PARTIAL', artworkReadiness: 'CANDIDATE_HOLD',
    generationScope: 'The six-section read-only adapter is implemented: PEOPLE, STAR BEAST, OBJECT, ROUTE, RELATION, DAWN; RELATION coverage is machine-readable 24/24 with detailed payload 12/24.',
    blockedScope: ['ROUTE instances remain zero.', 'DAWN normalized proof records remain zero.', 'Named Object visual geometry remains unapproved.', 'Final book/page visual output contract is not approved.'],
    currentMachineSources: ['src/game/data/nightRecordBookSharedSource.ts', 'src/game/data/currentRelationshipInventory.ts', 'src/game/data/worldRouteSymbolSharedSource.ts', 'src/game/data/allLightsCompletion.ts'],
    nextGate: 'Keep the six-section structure fixed while safely detailing remaining relation payloads and defining Dawn/Route records before page-level art production.',
    canBulkGenerateNow: false,
    guard: 'Do not change the existing six-section world structure, invent missing route/Dawn facts, or make collection or physical goods a True End requirement.',
  }),
] as const;

export const sharedSourceReadinessByCategory = new Map(
  sharedSourceReadinessMatrix.map((item) => [item.category, item]),
);

export const sharedSourceReadinessSummary = {
  categoryCount: sharedSourceReadinessMatrix.length,
  readyCategories: sharedSourceReadinessMatrix.filter((item) => item.referenceCandidateReadiness === 'READY').map((item) => item.category),
  partialCategories: sharedSourceReadinessMatrix.filter((item) => item.referenceCandidateReadiness === 'PARTIAL').map((item) => item.category),
  blockedCategories: sharedSourceReadinessMatrix.filter((item) => item.referenceCandidateReadiness === 'BLOCKED').map((item) => item.category),
  bulkGenerationCategories: sharedSourceReadinessMatrix.filter((item) => item.canBulkGenerateNow).map((item) => item.category),
  handoffTotal: sharedSourceGenerationHandoffSummary.total,
  handoffReadyForCandidate: sharedSourceGenerationHandoffSummary.readyForCandidate,
  handoffBlocked: sharedSourceGenerationHandoffSummary.blocked,
  approvalDefaultsRemainFalse: true,
} as const;
