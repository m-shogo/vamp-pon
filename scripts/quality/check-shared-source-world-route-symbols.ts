import { stageVisualSharedSourceEntries } from '../../src/game/data/stageVisualSharedSource.ts';
import {
  nightRouteSymbolSharedSourceEntries,
  routeNodeSharedSchema,
  stationIdentitySchema,
  ticketSharedSchema,
  worldRouteSymbolSharedSourceSummary,
} from '../../src/game/data/worldRouteSymbolSharedSource.ts';

function fail(message: string): never {
  throw new Error(`[Shared Source World Route Symbols] ${message}`);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

const expectedIds = ['ROUTE', 'RETURN', 'HOLD', 'HANDOFF', 'DAWN'];
assert(nightRouteSymbolSharedSourceEntries.length === 5, `world symbol count drift: ${nightRouteSymbolSharedSourceEntries.length}`);
assert(
  JSON.stringify(nightRouteSymbolSharedSourceEntries.map((entry) => entry.id)) === JSON.stringify(expectedIds),
  'world symbol ID/order drift',
);
assert(new Set(nightRouteSymbolSharedSourceEntries.map((entry) => entry.id)).size === 5, 'duplicate world symbol id');
assert(new Set(nightRouteSymbolSharedSourceEntries.map((entry) => entry.abstractGeometry)).size === 5, 'world symbols collapsed to duplicate geometry');

for (const entry of nightRouteSymbolSharedSourceEntries) {
  assert(entry.geometryAuthority === 'CURRENT_ABSTRACT_GEOMETRY', `${entry.id}: abstract source authority drift`);
  assert(entry.finalVectorStatus === 'NOT_YET_DRAWN', `${entry.id}: final vector inferred`);
  assert(entry.referenceGenerationReady === false, `${entry.id}: exact geometry generation promoted before vector approval`);
  assert(entry.runtimeReady === false, `${entry.id}: runtime implementation inferred`);
  assert(entry.artworkReady === false && entry.artworkState === 'NOT_GENERATED', `${entry.id}: artwork approval inferred`);
  assert(entry.abstractGeometry.length > 35, `${entry.id}: abstract geometry too weak`);
  assert(/16px/.test(entry.smallScaleReadability), `${entry.id}: 16px readability missing`);
  assert(/Toumon/i.test(entry.toumonSeparationRule), `${entry.id}: Toumon separation rule missing`);
  assert(entry.avoid.some((rule) => /Toumon/i.test(rule)), `${entry.id}: Toumon avoid missing`);
  assert(entry.avoid.some((rule) => /railway/i.test(rule)), `${entry.id}: real railway imitation guard missing`);
  assert(entry.generationBriefSeed.length > 100, `${entry.id}: generation brief seed too weak`);
}

const byId = new Map(nightRouteSymbolSharedSourceEntries.map((entry) => [entry.id, entry]));
const route = byId.get('ROUTE');
const returnMark = byId.get('RETURN');
const hold = byId.get('HOLD');
const handoff = byId.get('HANDOFF');
const dawn = byId.get('DAWN');
assert(route && /node/i.test(route.abstractGeometry) && /open end/i.test(route.abstractGeometry), 'ROUTE line/node/open-end grammar missing');
assert(returnMark && /does not reconnect/i.test(returnMark.abstractGeometry), 'RETURN non-reconnection gap missing');
assert(hold && /open bracket/i.test(hold.abstractGeometry) && /point/i.test(hold.abstractGeometry), 'HOLD bracket/point grammar missing');
assert(handoff && /two short opposing lines/i.test(handoff.abstractGeometry) && /gap/i.test(handoff.abstractGeometry), 'HANDOFF opposing-line gap missing');
assert(dawn && /open arc/i.test(dawn.abstractGeometry) && /below/i.test(dawn.abstractGeometry), 'DAWN open-arc/escaping-line grammar missing');
assert(dawn.avoid.some((rule) => /literal sunrise/i.test(rule)), 'DAWN literal-sunrise guard missing');

assert(stationIdentitySchema.authorityStatus === 'SCHEMA_ONLY_NO_STATION_INSTANCES', 'station schema promoted to instance authority');
assert(/separately approved/i.test(stationIdentitySchema.stationNameRule), 'station-name separate authority rule missing');
assert(/do not derive codes from current Stage numbers/i.test(stationIdentitySchema.stationCodeRule), 'Stage-number-derived station code guard missing');
assert(/1-2 colors/i.test(stationIdentitySchema.stationStampRule), 'station stamp color rule missing');
assert(/not universally circular/i.test(stationIdentitySchema.stationStampRule), 'station stamp circular-normalization guard missing');
assert(/Toumon/i.test(stationIdentitySchema.stationStampRule), 'station stamp Toumon separation missing');
assert(stationIdentitySchema.warningMark === 'PENDING_VISUAL_AUTHORITY', 'warning mark invented before authority');
assert(stationIdentitySchema.avoid.some((rule) => /railway/i.test(rule)), 'station real-railway imitation guard missing');

assert(ticketSharedSchema.authorityStatus === 'SCHEMA_ONLY_NO_TICKET_INSTANCES', 'ticket schema promoted to instance authority');
assert(
  JSON.stringify(ticketSharedSchema.frontFields) === JSON.stringify(['stationOrPlace', 'route', 'nightPhase', 'punchedMark', 'returnStatus', 'smallScenePhrase']),
  'ticket front field schema drift',
);
assert(JSON.stringify(ticketSharedSchema.backFields) === JSON.stringify(['nightRouteMapFragment']), 'ticket back field schema drift');
assert(/native text\/data/i.test(ticketSharedSchema.textPolicy), 'ticket native-text policy missing');
assert(/must not imitate a real railway/i.test(ticketSharedSchema.punchRule), 'ticket punch real-railway guard missing');
assert(/must not print direct spoiler truth/i.test(ticketSharedSchema.secretTicketRule), 'secret ticket spoiler guard missing');
assert(/physical purchase is never required/i.test(ticketSharedSchema.collectionRule), 'physical purchase/completion separation missing');

assert(routeNodeSharedSchema.authorityStatus === 'SCHEMA_ONLY_NO_ROUTE_INSTANCES', 'route-node schema promoted to route instance authority');
assert(routeNodeSharedSchema.labelsAreNativeText === true, 'route labels must remain native text');
assert(routeNodeSharedSchema.exactGeometryApproved === false, 'route-node exact geometry inferred');

// P10 now provides the common schema, but it deliberately does not invent Stage→Station instances.
for (const stage of stageVisualSharedSourceEntries) {
  assert(stage.routeRelation === 'PENDING_P10_ROUTE_AUTHORITY', `${stage.id}: Stage route relation was silently invented from schema-only P10`);
  assert(stage.stationRelation === 'PENDING_P10_STATION_AUTHORITY', `${stage.id}: Stage station relation was silently invented from schema-only P10`);
  assert(stage.routeStamp === 'PENDING_P10_ORIGINAL_ROUTE_STAMP', `${stage.id}: Stage stamp was silently finalized from schema-only P10`);
}

assert(worldRouteSymbolSharedSourceSummary.symbolCount === 5, 'summary symbol count drift');
assert(worldRouteSymbolSharedSourceSummary.finalVectorApproved === false, 'summary final-vector approval inferred');
assert(worldRouteSymbolSharedSourceSummary.stationInstanceCount === 0, 'station instances invented');
assert(worldRouteSymbolSharedSourceSummary.ticketInstanceCount === 0, 'ticket instances invented');
assert(worldRouteSymbolSharedSourceSummary.routeInstanceCount === 0, 'route instances invented');
assert(worldRouteSymbolSharedSourceSummary.referenceGenerationReady === false, 'world symbol exact generation promoted before vector approval');

console.log(
  `Shared Source World Route Symbols: PASS (` +
    `symbols=${nightRouteSymbolSharedSourceEntries.length}, stages-schema-only=${stageVisualSharedSourceEntries.length}, ` +
    `stationInstances=0, ticketInstances=0, routeInstances=0, finalVector=hold)`,
);
