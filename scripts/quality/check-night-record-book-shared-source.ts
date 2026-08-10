import { existsSync, readFileSync } from 'node:fs';

import { currentRelationshipInventorySummary } from '../../src/game/data/currentRelationshipInventory.ts';
import {
  NIGHT_RECORD_BOOK_SECTION_IDS,
  NIGHT_RECORD_DAWN_NORMALIZED_ENTRY_COUNT,
  NIGHT_RECORD_RELATION_DETAILED_COUNT,
  NIGHT_RECORD_RELATION_HUMAN_CURRENT_COUNT,
  NIGHT_RECORD_RELATION_MACHINE_COUNT,
  nightRecordBookSectionById,
  nightRecordBookSections,
  nightRecordBookSharedSourceSummary,
} from '../../src/game/data/nightRecordBookSharedSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[Night Record Book Shared Source] ${message}`);
}

const expectedSections = ['PEOPLE', 'STAR_BEAST', 'OBJECT', 'ROUTE', 'RELATION', 'DAWN'];
const authorityLabels = ['PEOPLE', 'STAR BEAST', 'OBJECT', 'ROUTE', 'RELATION', 'DAWN'];
assert(JSON.stringify(NIGHT_RECORD_BOOK_SECTION_IDS) === JSON.stringify(expectedSections), 'six-section authority drift');
assert(JSON.stringify(nightRecordBookSections.map((section) => section.id)) === JSON.stringify(expectedSections), 'section order drift');
assert(new Set(nightRecordBookSections.map((section) => section.id)).size === 6, 'duplicate section ID');

for (const section of nightRecordBookSections) {
  assert(section.sourcePaths.length > 0, `${section.id}: source paths missing`);
  for (const path of section.sourcePaths) assert(existsSync(path), `${section.id}: source path missing: ${path}`);
  assert(section.candidateGenerationAllowed === false, `${section.id}: read-only adapter must not authorize generation`);
  assert(section.physicalPurchaseRequired === false, `${section.id}: physical purchase cannot be completion requirement`);
  assert(section.trueEndRequired === false, `${section.id}: collection cannot become True End requirement`);
  assert(section.emptyStateRule.length > 40 && section.nextGate.length > 30, `${section.id}: fail-closed rule too weak`);
}

assert(nightRecordBookSharedSourceSummary.people.total === 21, 'PEOPLE total drift');
assert(nightRecordBookSharedSourceSummary.people.launchEligible === 20, 'PEOPLE Current20 launch drift');
assert(JSON.stringify(nightRecordBookSharedSourceSummary.people.reserveIds) === JSON.stringify(['ren']), 'PEOPLE Reserve drift');
assert(nightRecordBookSharedSourceSummary.starBeasts.total === 21, 'STAR BEAST total drift');
assert(nightRecordBookSharedSourceSummary.starBeasts.launchEligible === 20, 'STAR BEAST Current20 launch drift');
assert(JSON.stringify(nightRecordBookSharedSourceSummary.starBeasts.reserveIds) === JSON.stringify(['ren']), 'STAR BEAST Reserve drift');

const object = nightRecordBookSectionById.get('OBJECT');
assert(object?.coverage === 'PARTIAL_MACHINE', 'OBJECT must remain partial before geometry approval');
assert(nightRecordBookSharedSourceSummary.objects.visualGeometryApproved === false, 'Named Object geometry approval inferred');

const route = nightRecordBookSectionById.get('ROUTE');
assert(route?.coverage === 'SCHEMA_ONLY', 'ROUTE must remain schema-only');
assert(route.machineEntryCount === 0, 'ROUTE must not invent instances');
assert(nightRecordBookSharedSourceSummary.route.routeInstances === 0, 'route instances must remain zero');
assert(nightRecordBookSharedSourceSummary.route.stationInstances === 0, 'station instances must remain zero');
assert(nightRecordBookSharedSourceSummary.route.ticketInstances === 0, 'ticket instances must remain zero');
assert(nightRecordBookSharedSourceSummary.route.finalVectorApproved === false, 'route vector approval inferred');

const relationDoc = readFileSync('docs/RELATIONSHIPS.md', 'utf8');
const start = relationDoc.indexOf('# 3. Current strong arc inventory');
const end = relationDoc.indexOf('# 4. Coverage pass detailed arcs');
assert(start >= 0 && end > start, 'Current relationship inventory missing');
const humanCount = (relationDoc.slice(start, end).match(/^\d+\.\s/gm) ?? []).length;
assert(humanCount === NIGHT_RECORD_RELATION_HUMAN_CURRENT_COUNT, `human relation count drift: ${humanCount}`);
assert(NIGHT_RECORD_RELATION_HUMAN_CURRENT_COUNT === 24, 'Current human relation authority should remain 24');
assert(NIGHT_RECORD_RELATION_MACHINE_COUNT === currentRelationshipInventorySummary.total, 'Night Record relation inventory sync drift');
assert(NIGHT_RECORD_RELATION_MACHINE_COUNT === 24, 'Night Record must expose 24 lightweight relation inventory entries');
assert(NIGHT_RECORD_RELATION_DETAILED_COUNT === 12, 'detailed relationship payload must remain 12 until separately machine-detailed');

const oldMachineMap = JSON.parse(readFileSync('docs/design-targets/generated/character-relationship-arc-map-v1.json', 'utf8')) as { currentArcs?: unknown[] };
assert(Array.isArray(oldMachineMap.currentArcs) && oldMachineMap.currentArcs.length === 12, 'existing detailed machine map drift');
const relation = nightRecordBookSectionById.get('RELATION');
assert(relation?.coverage === 'PARTIAL_MACHINE', 'RELATION remains partial while detail coverage is 12/24');
assert(relation.machineEntryCount === 24, 'RELATION lightweight inventory count drift');
assert(relation.sourcePaths.includes('src/game/data/currentRelationshipInventory.ts'), 'RELATION Current24 inventory source missing');
assert(relation.publicPresentationRule.includes('All 24 Current coverage arcs'), 'RELATION 24-entry presentation rule missing');
assert(relation.publicPresentationRule.includes('12 detailed machine arcs'), 'RELATION detail boundary missing');
assert(relation.emptyStateRule.includes('COVERAGE-ONLY'), 'RELATION coverage-only empty/detail state missing');
assert(nightRecordBookSharedSourceSummary.relation.inventoryEntries === 24, 'RELATION summary inventory drift');
assert(nightRecordBookSharedSourceSummary.relation.detailedMachineArcs === 12, 'RELATION detailed summary drift');
assert(nightRecordBookSharedSourceSummary.relation.coverageOnlyArcs === 12, 'RELATION coverage-only summary drift');
assert(nightRecordBookSharedSourceSummary.relation.inventoryCoverageComplete === true, 'RELATION inventory coverage should be complete');
assert(nightRecordBookSharedSourceSummary.relation.detailedCoverageComplete === false, 'RELATION detail coverage must remain incomplete');

const dawn = nightRecordBookSectionById.get('DAWN');
assert(dawn?.coverage === 'LOCKED_DRAFT', 'DAWN must remain locked draft');
assert(dawn.machineEntryCount === NIGHT_RECORD_DAWN_NORMALIZED_ENTRY_COUNT && NIGHT_RECORD_DAWN_NORMALIZED_ENTRY_COUNT === 0, 'DAWN normalized count drift');
assert(nightRecordBookSharedSourceSummary.dawn.stage1BoardSourceCellCount === 25, 'Stage1 board source count drift');
assert(/runtimeFrozen: false/.test(readFileSync('src/game/data/allLightsCompletion.ts', 'utf8')), 'All Lights runtimeFrozen=false drift');
assert(nightRecordBookSharedSourceSummary.dawn.allLightsRuntimeFrozen === false, 'All Lights runtime freeze inferred');
assert(dawn.spoilerRule.includes('not True End'), 'DAWN not-True-End guard missing');

const ipSource = readFileSync('docs/design/ip-symbol-merch-system-v1.md', 'utf8');
const nightStart = ipSource.indexOf('# 9. 「夜の記録帳」— Collection Hub');
const next = ipSource.indexOf('# 10. Display / Carry Goods');
assert(nightStart >= 0 && next > nightStart, 'Night Record authority section missing');
const authority = ipSource.slice(nightStart, next);
for (const label of authorityLabels) assert(authority.includes(label), `IP authority missing ${label}`);
assert(authority.includes('全部集める=真End'), 'collection-not-True-End authority missing');

assert(nightRecordBookSharedSourceSummary.sectionCount === 6, 'summary section count drift');
assert(nightRecordBookSharedSourceSummary.collectionHubName === '夜の記録帳', 'collection hub name drift');
assert(nightRecordBookSharedSourceSummary.canBulkGeneratePagesNow === false, 'bulk page generation inferred');
assert(nightRecordBookSharedSourceSummary.physicalPurchaseRequired === false, 'physical purchase requirement inferred');
assert(nightRecordBookSharedSourceSummary.trueEndRequired === false, 'True End requirement inferred');
assert(nightRecordBookSharedSourceSummary.sectionExpansionApproved === false, 'seventh+ section inferred');

console.log(`Night Record Book Shared Source: PASS (sections=6, relation=24 inventory / 12 detailed, route=0, dawn=0, bulkPages=false)`);
