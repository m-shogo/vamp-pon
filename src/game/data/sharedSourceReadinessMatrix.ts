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

/**
 * Current implementation-state overlay.
 *
 * This does not replace the original Shared Source audit/history. It answers the
 * narrower operational question: "what may be sent to candidate generation now?"
 * A READY/PARTIAL value never means APPROVED_REFERENCE / APPROVED_WEB /
 * APPROVED_UNITY / PRODUCTION_READY.
 */
export const sharedSourceReadinessMatrix: readonly SharedSourceReadinessEntry[] = [
  {
    category: 'Characters',
    referenceCandidateReadiness: 'PARTIAL',
    runtimeAlignment: 'RUNTIME_BACKED',
    artworkReadiness: 'MIXED',
    generationScope: 'Existing Asset Factory Character contracts may generate candidates for launch-eligible Current20 identities.',
    blockedScope: ['Ren / OFFICIAL_RESERVE remains non-launch and must not be promoted by generation.', 'Generated candidates still require reference/Web/Unity approval separately.'],
    currentMachineSources: ['src/game/data/commercialProductionProfile.ts', 'src/game/data/assetFactoryCatalog.ts', 'src/game/data/sharedSourceGenerationHandoff.ts'],
    nextGate: 'Human candidate comparison and per-surface approval; Reserve remains blocked.',
    canBulkGenerateNow: false,
    guard: 'Current20 and Official Reserve must never be flattened into one launch set.',
  },
  {
    category: 'Star Beasts',
    referenceCandidateReadiness: 'PARTIAL',
    runtimeAlignment: 'NOT_RUNTIME_SOURCE',
    artworkReadiness: 'NOT_GENERATED',
    generationScope: 'Current20 Star Beast reference candidates may be generated from beast-first source; Ren remains blocked.',
    blockedScope: ['Ren / OFFICIAL_RESERVE', 'Final Toumon geometry on body/tag is not available.', 'Runtime sprite/plush SKU approval is separate.'],
    currentMachineSources: ['src/game/data/starBeastVisualSharedSource.ts', 'src/game/data/sharedSourceGenerationHandoff.ts'],
    nextGate: 'Generate multiple reference candidates for Current20, compare species/body recognition, then approve reference only.',
    canBulkGenerateNow: false,
    guard: 'Same constellation does not mean same individual; Leo and Canes Venatici duplicate rules are mandatory.',
  },
  {
    category: 'Named Objects',
    referenceCandidateReadiness: 'BLOCKED',
    runtimeAlignment: 'NOT_RUNTIME_SOURCE',
    artworkReadiness: 'CANDIDATE_HOLD',
    generationScope: 'No bulk reference generation yet.',
    blockedScope: ['21 three-view geometries are CANDIDATE_OBJECT_GEOMETRY, not Current visual Canon.', 'Functional/premium replica approval is fail-closed.'],
    currentMachineSources: ['src/game/data/namedObjectRegistry.ts', 'src/game/data/namedObjectVisualSharedSource.ts', 'src/game/data/sharedSourceGenerationHandoff.ts'],
    nextGate: 'Human review/approval of three-view candidate geometry before reference generation.',
    canBulkGenerateNow: false,
    guard: 'Wear/repair marks and story authority cannot be invented or cleaned away for premium-looking art.',
  },
  {
    category: 'Toumon',
    referenceCandidateReadiness: 'BLOCKED',
    runtimeAlignment: 'NOT_RUNTIME_SOURCE',
    artworkReadiness: 'VECTOR_HOLD',
    generationScope: 'Do not generate final Toumon geometry.',
    blockedScope: ['Final vector master is not drawn/approved.', 'AI approximation must not become final geometry.'],
    currentMachineSources: ['src/game/data/toumonSimpleSigilCanon.ts', 'src/game/data/sharedSourceGenerationHandoff.ts'],
    nextGate: 'Create/review CANDIDATE_VECTOR_DRAFT separately; approve final one-color vector and 16px proof.',
    canBulkGenerateNow: false,
    guard: 'No literal animal, Named Object pictogram, zodiac glyph, crown, wings or heraldic shield.',
  },
  {
    category: 'Enemies',
    referenceCandidateReadiness: 'READY',
    runtimeAlignment: 'RUNTIME_BACKED',
    artworkReadiness: 'NOT_GENERATED',
    generationScope: 'Current48 enemy reference/runtime-source candidates may be generated through existing Asset Factory contracts.',
    blockedScope: ['Artwork approval and Unity runtime approval remain separate.', 'BLACK_INK/DAWN variants cannot be auto-applied outside explicit source rules.'],
    currentMachineSources: ['src/game/data/enemyProductionDatabase.ts', 'src/game/data/enemyVisualSharedSource.ts', 'src/game/data/sharedSourceGenerationHandoff.ts'],
    nextGate: 'Candidate comparison by family/silhouette and gameplay-size QA.',
    canBulkGenerateNow: true,
    guard: 'Do not normalize all enemies into the same generic AI monster silhouette.',
  },
  {
    category: 'Bosses',
    referenceCandidateReadiness: 'READY',
    runtimeAlignment: 'RUNTIME_BACKED',
    artworkReadiness: 'NOT_GENERATED',
    generationScope: 'Current boss-rank Enemy source may generate reference/runtime-source candidates under Enemy contracts.',
    blockedScope: ['No universal boss-red/crown/kaiju transformation.', 'Final runtime size/readability approval is separate.'],
    currentMachineSources: ['src/game/data/enemyProductionDatabase.ts', 'src/game/data/enemyVisualSharedSource.ts', 'src/game/data/sharedSourceGenerationHandoff.ts'],
    nextGate: 'Candidate comparison against Stage motif and Great Shadow identity, then runtime-scale QA.',
    canBulkGenerateNow: true,
    guard: 'Boss scale must come from source silhouette/stage relation, not generic demon/kaiju grandeur.',
  },
  {
    category: 'Weapons',
    referenceCandidateReadiness: 'READY',
    runtimeAlignment: 'RUNTIME_BACKED',
    artworkReadiness: 'NOT_GENERATED',
    generationScope: 'All current runtime Weapon reference candidates may be generated from Weapon Shared Source.',
    blockedScope: ['Unity sprite/icon/VFX approval remains separate from reference approval.', 'No evolution outside evolutions.ts.'],
    currentMachineSources: ['src/game/data/weapons.ts', 'src/game/data/evolutions.ts', 'src/game/data/weaponVisualSharedSource.ts', 'src/game/data/sharedSourceGenerationHandoff.ts'],
    nextGate: 'Generate transparent reference candidates, compare base/evolution lineage, then create dedicated runtime derivatives.',
    canBulkGenerateNow: true,
    guard: 'Every evolution must remain visibly descended from the everyday-object base form.',
  },
  {
    category: 'Items',
    referenceCandidateReadiness: 'READY',
    runtimeAlignment: 'PARTIAL',
    artworkReadiness: 'NOT_GENERATED',
    generationScope: 'Current Item production entries may generate candidates through existing Asset Factory contracts.',
    blockedScope: ['Production DB does not imply every item is already runtime-connected.', 'Final icon/pickup art requires per-surface QA.'],
    currentMachineSources: ['src/game/data/itemAssetProductionDatabase.ts', 'src/game/data/itemVisualSharedSource.ts', 'src/game/data/sharedSourceGenerationHandoff.ts'],
    nextGate: 'Candidate comparison, small-scale icon proof, then explicit runtime mapping where missing.',
    canBulkGenerateNow: true,
    guard: 'No generic potion/crystal/gem/orb shorthand unless the source object explicitly requires it.',
  },
  {
    category: 'Stages',
    referenceCandidateReadiness: 'PARTIAL',
    runtimeAlignment: 'PARTIAL',
    artworkReadiness: 'NOT_GENERATED',
    generationScope: 'Stage key art and existing Asset Factory background/parallax candidates may be generated.',
    blockedScope: ['Route/station/stamp instances remain unresolved.', 'ROUTE_MAP finalization remains blocked.', 'Web/Loading/Unity outputs require separate crops/approval.'],
    currentMachineSources: ['src/game/data/stageProductionDatabase.ts', 'src/game/data/stageVisualSharedSource.ts', 'src/game/data/sharedSourceGenerationHandoff.ts'],
    nextGate: 'Candidate key-art/background review; separately define route/station instances before route-map generation.',
    canBulkGenerateNow: false,
    guard: 'Do not invent station names/codes or bake readable signage into generated art.',
  },
  {
    category: 'Clear Getter',
    referenceCandidateReadiness: 'BLOCKED',
    runtimeAlignment: 'RUNTIME_BACKED',
    artworkReadiness: 'CANDIDATE_HOLD',
    generationScope: 'Stage1 25-cell runtime source is normalized; final mark/icon generation remains blocked.',
    blockedScope: ['natural/targeted/mastery/secret mark grammar is candidate only.', 'Stable production Stage/Character/Weapon relation IDs are not inferred from condition text.'],
    currentMachineSources: ['src/game/data/collectionProgress.ts', 'src/game/data/progressionRewardSharedSource.ts'],
    nextGate: 'Approve one-color condition-mark grammar distinct from Toumon and railway stamps.',
    canBulkGenerateNow: false,
    guard: 'Toumon and real railway stamp/punch identities must remain separate.',
  },
  {
    category: 'Achievements',
    referenceCandidateReadiness: 'BLOCKED',
    runtimeAlignment: 'RUNTIME_BACKED',
    artworkReadiness: 'CANDIDATE_HOLD',
    generationScope: '14 runtime achievements are normalized; exact achievement icon grammar is not approved.',
    blockedScope: ['Legacy runtime Stage numbers are not mapped to production Stage IDs.', 'Achievement condition mark must remain distinct from reward icon.'],
    currentMachineSources: ['src/game/data/achievements.ts', 'src/game/data/progressionRewardSharedSource.ts'],
    nextGate: 'Approve shared achievement/condition visual grammar and stable relation mapping.',
    canBulkGenerateNow: false,
    guard: 'Do not default to medal/trophy/gold-frame shorthand.',
  },
  {
    category: 'Rewards',
    referenceCandidateReadiness: 'BLOCKED',
    runtimeAlignment: 'PARTIAL',
    artworkReadiness: 'CANDIDATE_HOLD',
    generationScope: '40 normalized reward entries exist, but reward icon visual authority is intentionally blocked.',
    blockedScope: ['Reward icon grammar is not approved.', 'All Lights / 全灯の朝 remains runtimeFrozen=false and final-art HOLD.'],
    currentMachineSources: ['src/game/data/progressionRewardSharedSource.ts', 'src/game/data/sharedSourceGenerationHandoff.ts'],
    nextGate: 'Approve reward-type icon/presentation grammar without inventing duplicate currencies.',
    canBulkGenerateNow: false,
    guard: 'All Lights is not True End and physical goods purchase is never a completion condition.',
  },
  {
    category: 'Unlockables',
    referenceCandidateReadiness: 'BLOCKED',
    runtimeAlignment: 'UNRESOLVED',
    artworkReadiness: 'CANDIDATE_HOLD',
    generationScope: 'Legacy runtime Stage2–5 unlock slots are normalized, but canonical production Stage art cannot be generated from those slots.',
    blockedScope: ['Legacy runtime Stage slot to production Stage ID relation is unresolved.'],
    currentMachineSources: ['src/game/data/waves.ts', 'src/game/persistence/profile.ts', 'src/game/data/progressionRewardSharedSource.ts'],
    nextGate: 'Explicitly reconcile legacy runtime Stage recipes with production Stage authority before canonical unlock art.',
    canBulkGenerateNow: false,
    guard: 'Do not derive canonical Stage ID/name/art from a legacy numeric runtime slot.',
  },
  {
    category: 'Collectibles',
    referenceCandidateReadiness: 'BLOCKED',
    runtimeAlignment: 'PARTIAL',
    artworkReadiness: 'CANDIDATE_HOLD',
    generationScope: 'Item/Named Object/record sources exist, but one unified collectible-generation source is not yet authoritative.',
    blockedScope: ['Unified collectible taxonomy/presentation is incomplete.', 'Collection completion must stay separate from True End.'],
    currentMachineSources: ['src/game/data/collectionProgress.ts', 'src/game/data/itemVisualSharedSource.ts', 'src/game/data/namedObjectRegistry.ts'],
    nextGate: 'Normalize collectible taxonomy and Night Record section relations without changing the existing six-section world structure prematurely.',
    canBulkGenerateNow: false,
    guard: 'Do not make collection completion or physical purchase a True End requirement.',
  },
  {
    category: 'Routes',
    referenceCandidateReadiness: 'BLOCKED',
    runtimeAlignment: 'NOT_RUNTIME_SOURCE',
    artworkReadiness: 'VECTOR_HOLD',
    generationScope: 'World ROUTE abstract grammar exists; route instances/exact vector geometry do not.',
    blockedScope: ['No route instance authority.', 'Exact world-symbol/vector geometry remains unapproved.'],
    currentMachineSources: ['src/game/data/worldRouteSymbolSharedSource.ts'],
    nextGate: 'Define route instances/stable IDs using original world grammar, then approve exact vector/node geometry.',
    canBulkGenerateNow: false,
    guard: 'No real railway route/logo imitation and no Character Toumon as route identity.',
  },
  {
    category: 'Stations',
    referenceCandidateReadiness: 'BLOCKED',
    runtimeAlignment: 'NOT_RUNTIME_SOURCE',
    artworkReadiness: 'VECTOR_HOLD',
    generationScope: 'Station schema exists; station instances are intentionally zero.',
    blockedScope: ['No approved station names/codes/instances.', 'Warning mark exact authority pending.'],
    currentMachineSources: ['src/game/data/worldRouteSymbolSharedSource.ts'],
    nextGate: 'Create stable station/place instances from approved Stage/route authority, then native-text signage schema.',
    canBulkGenerateNow: false,
    guard: 'Do not infer station codes from Stage numbers or imitate real railway operator identity.',
  },
  {
    category: 'Tickets',
    referenceCandidateReadiness: 'BLOCKED',
    runtimeAlignment: 'NOT_RUNTIME_SOURCE',
    artworkReadiness: 'VECTOR_HOLD',
    generationScope: 'Ticket front/back field schema exists; ticket instances are intentionally zero.',
    blockedScope: ['No approved route/station instances.', 'Punch geometry is pending.', 'Secret-ticket spoiler rules require reveal authority.'],
    currentMachineSources: ['src/game/data/worldRouteSymbolSharedSource.ts'],
    nextGate: 'Define route/station instance authority and exact original punch/state vocabulary.',
    canBulkGenerateNow: false,
    guard: 'All ticket names/codes/phrases stay native text/data; no real railway ticket imitation.',
  },
  {
    category: 'Stamps',
    referenceCandidateReadiness: 'BLOCKED',
    runtimeAlignment: 'NOT_RUNTIME_SOURCE',
    artworkReadiness: 'VECTOR_HOLD',
    generationScope: 'Station-stamp schema is defined, but no final stamp instances/geometries are approved.',
    blockedScope: ['Local motif/route instance authority missing.', 'Exact stamp vectors pending.'],
    currentMachineSources: ['src/game/data/worldRouteSymbolSharedSource.ts', 'src/game/data/uiSymbolSharedSource.ts'],
    nextGate: 'Approve original local stamp grammar and instance data; prove 16–32px/1–2 color output.',
    canBulkGenerateNow: false,
    guard: 'Not universally circular; never use Character Toumon as central station logo.',
  },
  {
    category: 'UI Symbols',
    referenceCandidateReadiness: 'BLOCKED',
    runtimeAlignment: 'PARTIAL',
    artworkReadiness: 'CANDIDATE_HOLD',
    generationScope: '20 semantic contracts and 16/24/32/48/64/96px rules exist; exact final geometry is not broadly approved.',
    blockedScope: ['Toumon/Route Stamp/Ticket Punch/Warning/Dawn exact vectors remain pending.', 'Locked/New/Rare/Clear state grammar is candidate.'],
    currentMachineSources: ['src/game/data/uiSymbolSharedSource.ts'],
    nextGate: 'Approve icon geometry family, then produce one-color/small-scale proofs before surface-specific art.',
    canBulkGenerateNow: false,
    guard: 'Color cannot be the only state distinction; do not force every icon into one circular/glass badge.',
  },
  {
    category: 'World Effects',
    referenceCandidateReadiness: 'PARTIAL',
    runtimeAlignment: 'PARTIAL',
    artworkReadiness: 'NOT_GENERATED',
    generationScope: '13 semantic VFX/audio/haptic contracts are machine-readable, but P13 does not export a dedicated effect-asset generation lane yet.',
    blockedScope: ['Final effect asset briefs/output dimensions are not exported.', 'Device creative approval for haptic/shake remains separate.', 'Photosensitive/reduced-motion QA required.'],
    currentMachineSources: ['src/game/data/worldEffectSharedSource.ts', 'src/game/ui/visualDesign.ts', 'docs/AUDIO-HAPTIC-DIRECTION.md'],
    nextGate: 'Add effect-specific generation/runtime handoff and device QA mapping without overriding existing glow/audio/haptic tokens.',
    canBulkGenerateNow: false,
    guard: 'No whiteout/strobe/continuous shake; audio or haptic alone cannot carry critical information.',
  },
  {
    category: 'Collection',
    referenceCandidateReadiness: 'PARTIAL',
    runtimeAlignment: 'PARTIAL',
    artworkReadiness: 'CANDIDATE_HOLD',
    generationScope: 'Stage1 board/progression and source registries exist; full cross-category Collection visual/presentation authority is incomplete.',
    blockedScope: ['No single approved cross-category collection presentation source.', 'Some sections remain source-specific.'],
    currentMachineSources: ['src/game/data/collectionProgress.ts', 'src/game/data/progressionRewardSharedSource.ts', 'src/game/data/namedObjectRegistry.ts'],
    nextGate: 'Normalize Collection section adapters while preserving existing story/spoiler boundaries.',
    canBulkGenerateNow: false,
    guard: 'Collection completion remains optional to True End and cannot depend on physical goods purchase.',
  },
  {
    category: 'Night Record Book',
    referenceCandidateReadiness: 'PARTIAL',
    runtimeAlignment: 'PARTIAL',
    artworkReadiness: 'CANDIDATE_HOLD',
    generationScope: 'People/Star Beast/Object/Route/Relation/Dawn concepts and related sources exist, but one complete presentation/export contract is not yet finalized.',
    blockedScope: ['Enemy/Weapon/Stage/Achievement section expansion is still a design decision, not automatic Current structure.', 'Exact book/page visual output contract is incomplete.'],
    currentMachineSources: ['src/game/data/collectionProgress.ts', 'src/game/data/progressionRewardSharedSource.ts', 'src/game/data/starBeastVisualSharedSource.ts', 'src/game/data/namedObjectRegistry.ts'],
    nextGate: 'Create a read-only section adapter/export view from existing authorities before deciding whether to extend the six-section structure.',
    canBulkGenerateNow: false,
    guard: 'Do not change the existing six-section world structure merely to fit generated assets.',
  },
] as const;

export const sharedSourceReadinessByCategory = new Map(
  sharedSourceReadinessMatrix.map((entry) => [entry.category, entry]),
);

export const sharedSourceReadinessSummary = {
  categoryCount: sharedSourceReadinessMatrix.length,
  readyCategories: sharedSourceReadinessMatrix.filter((entry) => entry.referenceCandidateReadiness === 'READY').map((entry) => entry.category),
  partialCategories: sharedSourceReadinessMatrix.filter((entry) => entry.referenceCandidateReadiness === 'PARTIAL').map((entry) => entry.category),
  blockedCategories: sharedSourceReadinessMatrix.filter((entry) => entry.referenceCandidateReadiness === 'BLOCKED').map((entry) => entry.category),
  bulkGenerationCategories: sharedSourceReadinessMatrix.filter((entry) => entry.canBulkGenerateNow).map((entry) => entry.category),
  handoffTotal: sharedSourceGenerationHandoffSummary.total,
  handoffReadyForCandidate: sharedSourceGenerationHandoffSummary.readyForCandidate,
  handoffBlocked: sharedSourceGenerationHandoffSummary.blocked,
  approvalDefaultsRemainFalse: true,
} as const;
