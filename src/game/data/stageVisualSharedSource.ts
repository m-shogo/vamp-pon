import { enemyById } from './enemyProductionDatabase.ts';
import { namedObjectRegistry } from './namedObjectRegistry.ts';
import {
  stageProductionEntries,
  type StageProductionEntry,
  type StageProductionPhase,
} from './stageProductionDatabase.ts';
import type { ArtworkApprovalState } from './sharedSourceContracts.ts';

export type StageSpoilerTier = 'PUBLIC_SAFE' | 'GUIDE_SPOILER' | 'DEEP_SPOILER';
export type StageDerivedTargetKind =
  | 'STAGE_KEY_ART'
  | 'UNITY_BACKGROUND_SOURCE'
  | 'PARALLAX_LAYER_PACK'
  | 'LOADING_ART'
  | 'ROUTE_MAP'
  | 'WEB_HEADER'
  | 'STAGE_CARD'
  | 'OGP';

export type StageDerivedTargetRule = {
  kind: StageDerivedTargetKind;
  sizeSpec: string;
  alphaPolicy: 'OPAQUE' | 'LAYER_DEPENDENT';
  safeAreaRule: string;
  approvalBoundary: string;
};

export type StageVisualSharedSourceEntry = {
  id: string;
  displayName: string;
  stageTheme: string;
  eraFeel: string;
  routeRelation: 'PENDING_P10_ROUTE_AUTHORITY';
  stationRelation: 'PENDING_P10_STATION_AUTHORITY';
  entryFantasy: string;
  skyPhase: string;
  weatherRule: string;
  lightLanguage: string;
  colorScript: readonly string[];
  terrainLanguage: string;
  architectureLanguage: string;
  landmark1: string;
  landmark2: string;
  landmark3: string;
  environmentProps: readonly string[];
  namedObjectTraceIds: readonly string[];
  enemyFamilies: readonly string[];
  bossRelationIds: readonly string[];
  ambientMotif: string;
  collectibleMotif: string;
  routeStamp: 'PENDING_P10_ORIGINAL_ROUTE_STAMP';
  musicFantasy: string;
  ambientSfxFantasy: string;
  spoilerTier: StageSpoilerTier;
  goodsPotential: readonly string[];
  avoid: readonly string[];
  negativePromptHints: readonly string[];
  generationBriefSeed: string;
  derivedTargets: readonly StageDerivedTargetRule[];
  authoritySource: 'src/game/data/stageProductionDatabase.ts';
  runtimeReady: false;
  artworkReady: false;
  artworkState: ArtworkApprovalState;
};

export const STAGE_DERIVED_TARGET_RULES: readonly StageDerivedTargetRule[] = [
  {
    kind: 'STAGE_KEY_ART',
    sizeSpec: '2048x2048 or 2560x1440 reference master; composition approval required before derived crop',
    alphaPolicy: 'OPAQUE',
    safeAreaRule: 'keep dominant landmark away from all four crop edges; preserve one quiet gameplay-independent focal area',
    approvalBoundary: 'reference/key-art approval only; never implies Unity runtime approval',
  },
  {
    kind: 'UNITY_BACKGROUND_SOURCE',
    sizeSpec: '390x844 gameplay-composition authority; higher-resolution source may be generated only if the same mobile safe zones are preserved',
    alphaPolicy: 'OPAQUE',
    safeAreaRule: 'center combat field stays low-detail/medium-value; player/enemy/projectile silhouettes win over background detail',
    approvalBoundary: 'must pass Unity gameplay-size, memory, crop and performance QA separately',
  },
  {
    kind: 'PARALLAX_LAYER_PACK',
    sizeSpec: '390x844 composition split into background/midground/foreground source layers',
    alphaPolicy: 'LAYER_DEPENDENT',
    safeAreaRule: 'foreground cannot cover critical lower/center combat read; each layer must survive independent motion',
    approvalBoundary: 'layer separation and seam QA required before Unity use',
  },
  {
    kind: 'LOADING_ART',
    sizeSpec: '1440x2560 mobile portrait source',
    alphaPolicy: 'OPAQUE',
    safeAreaRule: 'top/bottom text-safe breathing room; central visual survives 390x844 crop without cutting the primary landmark',
    approvalBoundary: 'loading approval does not approve gameplay background',
  },
  {
    kind: 'ROUTE_MAP',
    sizeSpec: '2048x2048 reference map source; final route labels remain native text/data',
    alphaPolicy: 'OPAQUE',
    safeAreaRule: 'reserve label-safe negative space; do not bake station names/numbers into generated art',
    approvalBoundary: 'blocked from finalization until P10 route/station symbol authority exists',
  },
  {
    kind: 'WEB_HEADER',
    sizeSpec: '2560x1440 desktop source + 1440x2560 mobile-safe derivative',
    alphaPolicy: 'OPAQUE',
    safeAreaRule: 'keep focal motif in shared center-safe region; reserve native-title space rather than baking text',
    approvalBoundary: 'APPROVED_WEB required; not a Unity runtime source',
  },
  {
    kind: 'STAGE_CARD',
    sizeSpec: '1024x1024 master, readable after reduction to mobile card/icon sizes',
    alphaPolicy: 'OPAQUE',
    safeAreaRule: 'one landmark/motif only; no micro-detail dependency',
    approvalBoundary: 'card approval only',
  },
  {
    kind: 'OGP',
    sizeSpec: '1200x630 derivative with native/web text overlay handled separately',
    alphaPolicy: 'OPAQUE',
    safeAreaRule: 'important motif stays inside central 80%; no generated readable text',
    approvalBoundary: 'web/promo approval only',
  },
] as const;

const COMMON_AVOID = [
  'generic fantasy dungeon/castle normalization',
  'cyberpunk neon cyan/purple city',
  'glassmorphism or SaaS gradient language',
  'giant blurred glow replacing real light sources',
  'meaningless particles/fog that reduce combat readability',
  'baked text, readable signage, station logo, route number, watermark',
  'real railway logo or exact real-world transit identity imitation',
  'foreground decoration covering the mobile combat field',
] as const;

function spoilerTierFor(phase: StageProductionPhase): StageSpoilerTier {
  if (phase === 'core5') return 'PUBLIC_SAFE';
  if (phase === 'shadow_seed') return 'DEEP_SPOILER';
  return 'GUIDE_SPOILER';
}

function skyPhaseFor(stage: StageProductionEntry): string {
  if (stage.phase === 'core5') return 'deep night with a restrained route toward pre-dawn; do not force sunrise into every frame';
  if (stage.phase === 'shadow_seed') return 'dense night with minimal warm navigation light; darkness must remain readable, not crushed black';
  if (stage.phase === 'future_seed') return 'night variation reserved for later authority; keep sky subordinate to the stage motifs';
  return 'seasonal night variation; preserve the global night-to-dawn progression without making every scene identical';
}

function weatherRuleFor(stage: StageProductionEntry): string {
  const source = [...stage.backgroundMotifs, ...stage.assetKeywords, stage.storySeed].join(' ').toLowerCase();
  if (/rain|雨/.test(source)) return 'rain is source-supported; use thin readable streaks and wet-material cues without screen-filling fog';
  if (/snow|雪/.test(source)) return 'snow is source-supported; sparse flakes only, maintaining combat silhouette contrast';
  if (/water|水|波/.test(source)) return 'water/moisture motif is source-supported; use reflections/ripples, not automatic rain';
  if (/wind|風/.test(source)) return 'wind motif is source-supported through paper/cloth motion; no forced precipitation';
  return 'NO_FORCED_WEATHER: do not invent rain/snow/fog when the production source does not require it';
}

function terrainLanguageFor(stage: StageProductionEntry): string {
  const motif = stage.backgroundMotifs.join(' / ');
  return `ground/playfield derived from ${motif}; keep a broad quiet traversal surface with restrained paper/asphalt/wood/water texture and no hard gameplay-obscuring grid`;
}

function architectureLanguageFor(stage: StageProductionEntry): string {
  return `ordinary lived-in Japanese/editorial memory space suggested by “${stage.name}” and [${stage.backgroundMotifs.join(', ')}]; architecture supports the landmark, never turns into generic fantasy spectacle`;
}

function namedObjectTraces(stage: StageProductionEntry) {
  const seedSet = new Set(stage.itemSeeds);
  return namedObjectRegistry.filter((object) => seedSet.has(object.displayName));
}

function enemyFamiliesFor(stage: StageProductionEntry): string[] {
  return [...new Set(stage.enemyAffinity.map((id) => enemyById.get(id)?.family).filter((value): value is string => Boolean(value)))];
}

function bossRelations(stage: StageProductionEntry): string[] {
  return stage.enemyAffinity.filter((id) => enemyById.get(id)?.rank === 'boss');
}

export const stageVisualSharedSourceEntries: readonly StageVisualSharedSourceEntry[] = stageProductionEntries.map((stage) => {
  const landmarks = [...stage.backgroundMotifs, ...stage.itemSeeds];
  const namedObjects = namedObjectTraces(stage);
  const enemyFamilies = enemyFamiliesFor(stage);
  const bossIds = bossRelations(stage);

  return {
    id: stage.id,
    displayName: stage.name,
    stageTheme: `${stage.coreQuestion} / ${stage.stageMechanicSeed}`,
    eraFeel: 'contemporary-to-timeless everyday Japan filtered through memory; do not invent a specific historical year unless a source later locks it',
    routeRelation: 'PENDING_P10_ROUTE_AUTHORITY',
    stationRelation: 'PENDING_P10_STATION_AUTHORITY',
    entryFantasy: stage.storySeed,
    skyPhase: skyPhaseFor(stage),
    weatherRule: weatherRuleFor(stage),
    lightLanguage: `small practical light sources and reflected memory light using ${stage.colorScript.join(' → ')}; preserve the global glow limit and night readability`,
    colorScript: stage.colorScript,
    terrainLanguage: terrainLanguageFor(stage),
    architectureLanguage: architectureLanguageFor(stage),
    landmark1: landmarks[0] ?? stage.name,
    landmark2: landmarks[1] ?? stage.storySeed,
    landmark3: landmarks[2] ?? stage.stageMechanicSeed,
    environmentProps: [...new Set([...stage.backgroundMotifs.slice(3), ...stage.itemSeeds])],
    namedObjectTraceIds: namedObjects.map((object) => object.id),
    enemyFamilies,
    bossRelationIds: bossIds,
    ambientMotif: `subtle repeated motion from ${stage.backgroundMotifs.slice(0, 3).join(' / ')}; keep normal screen quiet and reserve stronger motion for gameplay events`,
    collectibleMotif: stage.itemSeeds.join(' / '),
    routeStamp: 'PENDING_P10_ORIGINAL_ROUTE_STAMP',
    musicFantasy: `music should support “${stage.coreQuestion}” and the mechanic cue “${stage.stageMechanicSeed}”; use the stage motif as rhythmic/timbral inspiration without assigning a canonical genre here`,
    ambientSfxFantasy: `low-density environmental layer derived from ${stage.backgroundMotifs.join(' / ')} plus one local practical-light/room/street sound; combat SFX must remain foreground`,
    spoilerTier: spoilerTierFor(stage.phase),
    goodsPotential: ['stage art card', 'route-map page', 'paper diorama', 'background print after spoiler review'],
    avoid: COMMON_AVOID,
    negativePromptHints: [
      'no readable text, letters, numbers, logos, station branding, watermark',
      'no cyberpunk neon city',
      'no generic fantasy dungeon',
      'no glassmorphism/SaaS gradient',
      'no giant blurred glow',
      'no foreground obstruction across the combat center',
    ],
    generationBriefSeed: [
      `${stage.name} (${stage.id}) — ${stage.phase}.`,
      `Core question: ${stage.coreQuestion}`,
      `Story/entry: ${stage.storySeed}`,
      `Motifs: ${stage.backgroundMotifs.join(', ')}`,
      `Landmarks: ${(landmarks.slice(0, 3)).join(' / ')}`,
      `Mechanic: ${stage.stageMechanicSeed}`,
      `Enemy families: ${enemyFamilies.join(', ') || 'unresolved from current affinity'}`,
      `Boss relations: ${bossIds.join(', ') || 'none in current affinity'}`,
      `Item/collectible motifs: ${stage.itemSeeds.join(', ')}`,
      `Color script: ${stage.colorScript.join(' → ')}`,
      `Weather: ${weatherRuleFor(stage)}`,
      `Mobile rule: 390x844 combat readability first; no baked UI/text; quiet center, distinctive landmark, real-material night atmosphere.`,
    ].join('\n'),
    derivedTargets: STAGE_DERIVED_TARGET_RULES,
    authoritySource: 'src/game/data/stageProductionDatabase.ts',
    runtimeReady: false,
    artworkReady: false,
    artworkState: 'NOT_GENERATED',
  };
});

export const stageVisualSharedSourceById = new Map(stageVisualSharedSourceEntries.map((entry) => [entry.id, entry]));

export const stageVisualSharedSourceSummary = {
  total: stageVisualSharedSourceEntries.length,
  core5: stageVisualSharedSourceEntries.filter((entry) => entry.spoilerTier === 'PUBLIC_SAFE').length,
  deepSpoiler: stageVisualSharedSourceEntries.filter((entry) => entry.spoilerTier === 'DEEP_SPOILER').length,
  derivedTargetCount: STAGE_DERIVED_TARGET_RULES.length,
  routeAuthorityReady: false,
  runtimeReady: false,
  artworkReady: false,
} as const;
