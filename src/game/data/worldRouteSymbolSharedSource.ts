import type { ArtworkApprovalState } from './sharedSourceContracts.ts';

export type NightRouteSymbolId = 'ROUTE' | 'RETURN' | 'HOLD' | 'HANDOFF' | 'DAWN';
export type WorldSymbolGeometryAuthority = 'CURRENT_ABSTRACT_GEOMETRY';
export type FinalVectorStatus = 'NOT_YET_DRAWN';

export type NightRouteSymbolSharedSourceEntry = {
  id: NightRouteSymbolId;
  displayName: string;
  geometryAuthority: WorldSymbolGeometryAuthority;
  abstractGeometry: string;
  semanticMeaning: string;
  allowedUses: readonly string[];
  oneColorRule: string;
  smallScaleReadability: string;
  toumonSeparationRule: string;
  avoid: readonly string[];
  generationBriefSeed: string;
  authoritySource: 'docs/design/ip-symbol-merch-system-v1.md';
  finalVectorStatus: FinalVectorStatus;
  referenceGenerationReady: false;
  runtimeReady: false;
  artworkReady: false;
  artworkState: ArtworkApprovalState;
};

const COMMON_WORLD_SYMBOL_AVOID = [
  'Character Toumon or a near-copy of any Character Toumon',
  'real railway company logo or station mark imitation',
  'real transport IC card logo or ticket mark imitation',
  'zodiac glyph, crown, wings, heraldic shield',
  'readable letters/numbers baked into the symbol',
  'neon cyan/purple AI glow or glossy app-icon treatment',
  'circular badge normalization when the source shape is not circular',
] as const;

export const nightRouteSymbolSharedSourceEntries: readonly NightRouteSymbolSharedSourceEntry[] = [
  {
    id: 'ROUTE',
    displayName: '道の印',
    geometryAuthority: 'CURRENT_ABSTRACT_GEOMETRY',
    abstractGeometry: 'one line + one intermediate node + one open end that continues outward',
    semanticMeaning: 'a route continues; connection remains open rather than complete/closed',
    allowedUses: ['route map', 'map divider', 'loading divider', 'page divider', 'world pattern', 'route-node context'],
    oneColorRule: 'single ink line/node only; line weight stays restrained and no glow is required for meaning',
    smallScaleReadability: 'line + node + open end must remain distinguishable at 16px without adding labels',
    toumonSeparationRule: 'world-neutral route geometry; never reuse Yui or another Character Toumon as the route mark',
    avoid: COMMON_WORLD_SYMBOL_AVOID,
    generationBriefSeed: 'ROUTE world mark. Preserve only the abstract grammar: one line, one node, one open end. No text, railway logo, Toumon, zodiac glyph, or exact vector invention. Final vector remains unapproved.',
    authoritySource: 'docs/design/ip-symbol-merch-system-v1.md',
    finalVectorStatus: 'NOT_YET_DRAWN',
    referenceGenerationReady: false,
    runtimeReady: false,
    artworkReady: false,
    artworkState: 'NOT_GENERATED',
  },
  {
    id: 'RETURN',
    displayName: '帰りの印',
    geometryAuthority: 'CURRENT_ABSTRACT_GEOMETRY',
    abstractGeometry: 'one route line whose far end bends into a small return hook but intentionally does not reconnect to the original line',
    semanticMeaning: 'return / exit / come-back route without implying a closed loop or forced destination',
    allowedUses: ['exit', 'return route', 'save/return UI', 'ticket reverse', 'packaging seal'],
    oneColorRule: 'one line and one small open hook; do not fill the interior or turn it into an arrow badge',
    smallScaleReadability: 'open hook and non-reconnection gap must remain visible at 16px',
    toumonSeparationRule: 'must be more neutral than Yui Toumon and cannot share final Toumon geometry by convenience',
    avoid: [...COMMON_WORLD_SYMBOL_AVOID, 'closed loop', 'generic undo-arrow icon normalization'],
    generationBriefSeed: 'RETURN world mark. Line ends in a small open return hook and never fully reconnects. No generic undo arrow, text, real railway mark, Toumon, or final vector invention.',
    authoritySource: 'docs/design/ip-symbol-merch-system-v1.md',
    finalVectorStatus: 'NOT_YET_DRAWN',
    referenceGenerationReady: false,
    runtimeReady: false,
    artworkReady: false,
    artworkState: 'NOT_GENERATED',
  },
  {
    id: 'HOLD',
    displayName: '預かりの印',
    geometryAuthority: 'CURRENT_ABSTRACT_GEOMETRY',
    abstractGeometry: 'one open bracket enclosing a single separated point on the inner side',
    semanticMeaning: 'held / pending / unopened / kept without ownership transfer',
    allowedUses: ['unopened state', 'collection pending', 'archive hold', 'Kuroori-adjacent world UI without Character ownership'],
    oneColorRule: 'one bracket + one point only; negative space is part of the meaning',
    smallScaleReadability: 'bracket opening and inner point remain separate at 16px',
    toumonSeparationRule: 'world HOLD may appear near Kuroori content but never becomes Kuroori Toumon or ownership mark',
    avoid: [...COMMON_WORLD_SYMBOL_AVOID, 'padlock icon normalization', 'filled enclosure that removes the open bracket'],
    generationBriefSeed: 'HOLD world mark. Open bracket with one separated inner point. No padlock shortcut, Character ownership, Toumon reuse, text or exact final vector generation.',
    authoritySource: 'docs/design/ip-symbol-merch-system-v1.md',
    finalVectorStatus: 'NOT_YET_DRAWN',
    referenceGenerationReady: false,
    runtimeReady: false,
    artworkReady: false,
    artworkState: 'NOT_GENERATED',
  },
  {
    id: 'HANDOFF',
    displayName: '渡す印',
    geometryAuthority: 'CURRENT_ABSTRACT_GEOMETRY',
    abstractGeometry: 'two short opposing lines with an intentional center gap; neither line crosses or consumes the other',
    semanticMeaning: 'handoff / transfer / relation between two sides while preserving both identities',
    allowedUses: ['transfer', 'relationship handoff', 'Named Object history card', 'shared-object transition'],
    oneColorRule: 'two short lines and one intentional central gap; no arrowheads required',
    smallScaleReadability: 'two line groups and central gap must remain visible at 16px',
    toumonSeparationRule: 'relationship/world mark only; never combine two Character Toumon into this symbol',
    avoid: [...COMMON_WORLD_SYMBOL_AVOID, 'two arrows', 'handshake pictogram', 'lines fully touching or merging'],
    generationBriefSeed: 'HANDOFF world mark. Two opposing short lines, intentional center gap, no arrows or handshake icon. Keep both sides separate. No Toumon merge or final vector invention.',
    authoritySource: 'docs/design/ip-symbol-merch-system-v1.md',
    finalVectorStatus: 'NOT_YET_DRAWN',
    referenceGenerationReady: false,
    runtimeReady: false,
    artworkReady: false,
    artworkState: 'NOT_GENERATED',
  },
  {
    id: 'DAWN',
    displayName: '朝の印',
    geometryAuthority: 'CURRENT_ABSTRACT_GEOMETRY',
    abstractGeometry: 'one shallow open arc with one short line passing outward from below the arc',
    semanticMeaning: 'clear / morning-side transition / leaving the night without erasing the night history',
    allowedUses: ['clear', 'ending-side UI', 'dawn edition', 'seasonal package', 'morning exit context'],
    oneColorRule: 'open arc + short escaping line; never depend on gradient sunrise color to carry the meaning',
    smallScaleReadability: 'open arc and lower escaping line remain distinct at 16px',
    toumonSeparationRule: 'world DAWN is not a Character Toumon and not a universal Happy End badge applied to Characters',
    avoid: [...COMMON_WORLD_SYMBOL_AVOID, 'literal sunrise illustration', 'sun rays', 'giant glowing horizon'],
    generationBriefSeed: 'DAWN world mark. Shallow open arc with one short line exiting below. It is not a sunrise illustration. No rays, text, Toumon, railway mark, or final vector invention.',
    authoritySource: 'docs/design/ip-symbol-merch-system-v1.md',
    finalVectorStatus: 'NOT_YET_DRAWN',
    referenceGenerationReady: false,
    runtimeReady: false,
    artworkReady: false,
    artworkState: 'NOT_GENERATED',
  },
] as const;

export type StationIdentitySchema = {
  authorityStatus: 'SCHEMA_ONLY_NO_STATION_INSTANCES';
  stationNameRule: string;
  stationCodeRule: string;
  stationStampRule: string;
  routeNodeRule: string;
  localMotifRule: string;
  dawnSideVariantRule: string;
  nightEntrySign: string;
  morningExitSign: string;
  warningMark: 'PENDING_VISUAL_AUTHORITY';
  avoid: readonly string[];
};

export const stationIdentitySchema: StationIdentitySchema = {
  authorityStatus: 'SCHEMA_ONLY_NO_STATION_INSTANCES',
  stationNameRule: 'station/place name must come from a separately approved Stage/route authority; keep the name as native text/data and never bake generated readable text into art',
  stationCodeRule: 'short code is required only after a route/station ID authority exists; do not derive codes from current Stage numbers or imitate real railway coding schemes',
  stationStampRule: '1-2 colors, not universally circular, local place/route/object motif first, Character Toumon never used as central logo, no real railway-company/station-stamp imitation',
  routeNodeRule: 'node shape must use world-neutral route vocabulary and remain distinct from Character Toumon; exact node geometry waits for vector approval',
  localMotifRule: 'one source-approved local Stage/place motif only; do not add famous real-world landmark shorthand without authority',
  dawnSideVariantRule: 'may shift one material/value relation toward dawn while preserving the same station identity; do not replace identity with a sun badge',
  nightEntrySign: 'schema only: native station/place text + world ROUTE/HOLD context may be composed after instance authority; no generated sign text',
  morningExitSign: 'schema only: native station/place text + world RETURN/DAWN context may be composed after instance authority; no generated sign text',
  warningMark: 'PENDING_VISUAL_AUTHORITY',
  avoid: [
    'invented station names or codes presented as Current',
    'deriving station code from legacy runtime Stage number',
    'JR/private railway/metro logo or ticket identity imitation',
    'Character Toumon as station logo',
    'baked generated readable station text',
    'all station stamps forced into the same circle',
  ],
};

export type TicketFaceField =
  | 'stationOrPlace'
  | 'route'
  | 'nightPhase'
  | 'punchedMark'
  | 'returnStatus'
  | 'smallScenePhrase';

export type TicketSharedSchema = {
  authorityStatus: 'SCHEMA_ONLY_NO_TICKET_INSTANCES';
  frontFields: readonly TicketFaceField[];
  backFields: readonly ['nightRouteMapFragment'];
  textPolicy: string;
  punchRule: string;
  secretTicketRule: string;
  characterEditionRule: string;
  collectionRule: string;
  avoid: readonly string[];
};

export const ticketSharedSchema: TicketSharedSchema = {
  authorityStatus: 'SCHEMA_ONLY_NO_TICKET_INSTANCES',
  frontFields: ['stationOrPlace', 'route', 'nightPhase', 'punchedMark', 'returnStatus', 'smallScenePhrase'],
  backFields: ['nightRouteMapFragment'],
  textPolicy: 'all names/codes/phrases remain native text/data layers; generated illustration must not bake readable ticket text',
  punchRule: 'one punched mark may represent state; exact punch geometry remains unapproved and must not imitate a real railway punch/stamp',
  secretTicketRule: 'secret tickets must not print direct spoiler truth; use safe route/state abstraction until reveal authority permits detail',
  characterEditionRule: 'Character edition is a variant of the ordinary world ticket, not the base ticket; Character Toumon remains optional/separate and never defines the world ticket identity',
  collectionRule: 'one ticket represents one place/scene; physical purchase is never required for game completion or True End',
  avoid: [
    'real railway ticket layout copied closely enough to imply operator identity',
    'real operator logo/IC mark/station-code imitation',
    'generated readable ticket text',
    'spoiler text printed on secret ticket',
    'Character-only ticket replacing the neutral world ticket',
  ],
};

export const routeNodeSharedSchema = {
  authorityStatus: 'SCHEMA_ONLY_NO_ROUTE_INSTANCES',
  nodeRule: 'one route node belongs to a world route and may carry a place/station relation only after explicit route authority; node geometry cannot be inferred from Character Toumon',
  connectionRule: 'open ends and intentional gaps carry meaning; do not connect every node into a closed completion graph',
  labelsAreNativeText: true,
  exactGeometryApproved: false,
} as const;

export const worldRouteSymbolSharedSourceSummary = {
  symbolCount: nightRouteSymbolSharedSourceEntries.length,
  expectedSymbolIds: ['ROUTE', 'RETURN', 'HOLD', 'HANDOFF', 'DAWN'] as const,
  finalVectorApproved: false,
  stationInstanceCount: 0,
  ticketInstanceCount: 0,
  routeInstanceCount: 0,
  referenceGenerationReady: false,
  artworkReady: false,
} as const;
