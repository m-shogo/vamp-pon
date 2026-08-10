import { existsSync, readFileSync } from 'node:fs';

import {
  NIGHT_RECORD_BOOK_SECTION_IDS,
  NIGHT_RECORD_DAWN_NORMALIZED_ENTRY_COUNT,
  NIGHT_RECORD_RELATION_COVERAGE_COUNT,
  NIGHT_RECORD_RELATION_DETAILED_MACHINE_COUNT,
  NIGHT_RECORD_RELATION_HUMAN_CURRENT_COUNT,
  nightRecordBookSectionById,
  nightRecordBookSections,
  nightRecordBookSharedSourceSummary,
} from '../../src/game/data/nightRecordBookSharedSource.ts';
import { currentRelationshipInventorySummary } from '../../src/game/data/currentRelationshipInventory.ts';

function fail(message: string): never {
  throw new Error(`[Night Record Book Shared Source] ${message}`);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

const expectedSections = ['PEOPLE', 'STAR_BEAST', 'OBJECT', 'ROUTE', 'RELATION', 'DAWN'];
assert(JSON.stringify(NIGHT_RECORD_BOOK_SECTION_IDS) === JSON.stringify(expectedSections), 'six-section authority drift');
assert(nightRecordBookSections.length === expectedSections.length, 'section count drift');
assert(JSON.stringify(nightRecordBookSections.map((section) => section.id)) === JSON.stringify(expectedSections), 'section order drift');
assert(new Set(nightRecordBookSections.map((section) => section.id)).size === expectedSections.length, 'duplicate section ID');

for (const section of nightRecordBookSections) {
  assert(section.sourcePaths.length > 0, `${section.id}: source paths missing`);
  for (const path of section.sourcePaths) assert(existsSync(path), `${section.id}: source path missing: ${path}`);
  assert(section.meaning.length > 30, `${section.id}: meaning too weak`);
  assert(section.publicPresentationRule.length > 40, `${section.id}: public presentation rule too weak`);
  assert(section.spoilerRule.length > 40, `${section.id}: spoiler rule too weak`);
  assert(section.emptyStateRule.length > 40, `${section.id}: empty-state rule too weak`);
  assert(section.nextGate.length > 30, `${section.id}: next gate too weak`);
  assert(section.candidateGenerationAllowed === false, `${section.id}: read-only adapter must not authorize candidate generation`);
  assert(section.physicalPurchaseRequired === false, `${section.id}: physical purchase cannot be completion requirement`);
  assert(section.trueEndRequired === false, `${section.id}: collection cannot become True End requirement`);
}

const commercialSource = readFileSync('src/game/data/commercialProductionProfile.ts', 'utf8');
assert(/expectedCount: 21/.test(commercialSource), 'Current21 commercial count authority drift');
assert(/current20Count: 20/.test(commercialSource), 'Current20 launch count authority drift');
assert(/reserveIds: \['ren'\]/.test(commercialSource), 'Ren Reserve authority drift');

assert(nightRecordBookSharedSourceSummary.people.total === 21, `PEOPLE total drift: ${nightRecordBookSharedSourceSummary.people.total}`);
assert(nightRecordBookSharedSourceSummary.people.launchEligible === 20, 'PEOPLE launch count drift');
assert(nightRecordBookSharedSourceSummary.people.reserve === 1, 'PEOPLE Reserve count drift');
assert(JSON.stringify(nightRecordBookSharedSourceSummary.people.reserveIds) === JSON.stringify(['ren']), 'PEOPLE Reserve ID drift');

assert(nightRecordBookSharedSourceSummary.starBeasts.total === 21, 'STAR BEAST total drift');
assert(nightRecordBookSharedSourceSummary.starBeasts.launchEligible === 20, 'STAR BEAST launch count drift');
assert(nightRecordBookSharedSourceSummary.starBeasts.reserve === 1, 'STAR BEAST Reserve count drift');
assert(JSON.stringify(nightRecordBookSharedSourceSummary.starBeasts.reserveIds) === JSON.stringify(['ren']), 'STAR BEAST Reserve ID drift');

const object = nightRecordBookSectionById.get('OBJECT');
assert(object?.coverage === 'PARTIAL_MACHINE', 'OBJECT must remain partial until three-view geometry approval');
assert(nightRecordBookSharedSourceSummary.objects.visualGeometryApproved === false, 'Named Object geometry approval inferred');
assert(object.emptyStateRule.includes('rather than inventing'), 'OBJECT invention guard missing');

const route = nightRecordBookSectionById.get('ROUTE');
assert(route?.coverage === 'SCHEMA_ONLY', 'ROUTE must remain schema-only');
assert(route.machineEntryCount === 0, 'ROUTE must not invent instances');
assert(nightRecordBookSharedSourceSummary.route.routeInstances === 0, 'route instance count must remain zero');
assert(nightRecordBookSharedSourceSummary.route.stationInstances === 0, 'station instance count must remain zero');
assert(nightRecordBookSharedSourceSummary.route.ticketInstances === 0, 'ticket instance count must remain zero');
assert(nightRecordBookSharedSourceSummary.route.finalVectorApproved === false, 'route vector approval inferred');
assert(/fake station codes|real railway/.test(route.emptyStateRule), 'ROUTE fake-station/railway guard missing');

const relationMap = JSON.parse(readFileSync('docs/design-targets/generated/character-relationship-arc-map-v1.json', 'utf8')) as {
  currentArcs?: unknown[];
};
assert(Array.isArray(relationMap.currentArcs), 'relationship currentArcs missing');
assert(relationMap.currentArcs.length === NIGHT_RECORD_RELATION_DETAILED_MACHINE_COUNT, `detailed machine relation count drift: ${relationMap.currentArcs.length}/${NIGHT_RECORD_RELATION_DETAILED_MACHINE_COUNT}`);
assert(currentRelationshipInventorySummary.total === NIGHT_RECORD_RELATION_COVERAGE_COUNT, 'Current relationship inventory coverage drift');
assert(currentRelationshipInventorySummary.detailedMachineArcs === NIGHT_RECORD_RELATION_DETAILED_MACHINE_COUNT, 'Current relationship detailed count drift');
assert(NIGHT_RECORD_RELATION_COVERAGE_COUNT === NIGHT_RECORD_RELATION_HUMAN_CURRENT_COUNT, 'RELATION inventory must cover all 24 Current arcs');
assert(NIGHT_RECORD_RELATION_DETAILED_MACHINE_COUNT === 12, 'RELATION detailed machine arc count should remain 12 until explicitly expanded');

const relationshipDoc = readFileSync('docs/RELATIONSHIPS.md', 'utf8');
const inventoryStart = relationshipDoc.indexOf('# 3. Current strong arc inventory');
const inventoryEnd = relationshipDoc.indexOf('# 4. Coverage pass detailed arcs');
assert(inventoryStart >= 0 && inventoryEnd > inventoryStart, 'Current relationship inventory section missing');
const inventorySection = relationshipDoc.slice(inventoryStart, inventoryEnd);
const humanArcCount = (inventorySection.match(/^\d+\.\s/gm) ?? []).length;
assert(humanArcCount === NIGHT_RECORD_RELATION_HUMAN_CURRENT_COUNT, `human Current relation inventory drift: ${humanArcCount}/${NIGHT_RECORD_RELATION_HUMAN_CURRENT_COUNT}`);

const relation = nightRecordBookSectionById.get('RELATION');
assert(relation?.coverage === 'CURRENT_MACHINE', 'RELATION inventory coverage should be machine-complete');
assert(relation.machineEntryCount === NIGHT_RECORD_RELATION_COVERAGE_COUNT, 'RELATION coverage count drift');
assert(nightRecordBookSharedSourceSummary.relation.machineCoverageComplete === true, 'RELATION coverage completion flag drift');
assert(nightRecordBookSharedSourceSummary.relation.detailedCoverageComplete === false, 'RELATION detailed completion must remain false');
assert(/Only 12 have detailed machine arc payloads/.test(relation.publicPresentationRule), 'RELATION detail-coverage disclosure missing');
assert(/popularity/i.test(relation.spoilerRule), 'RELATION popularity-retcon guard missing');
assert(/COVERAGE-ONLY SOURCE/.test(relation.emptyStateRule), 'RELATION coverage-only empty-state disclosure missing');

const dawn = nightRecordBookSectionById.get('DAWN');
assert(dawn?.coverage === 'LOCKED_DRAFT', 'DAWN must remain locked draft');
assert(dawn.machineEntryCount === NIGHT_RECORD_DAWN_NORMALIZED_ENTRY_COUNT, 'DAWN normalized count drift');
assert(NIGHT_RECORD_DAWN_NORMALIZED_ENTRY_COUNT === 0, 'DAWN entries must not be inferred from Stage1 board cells');
assert(nightRecordBookSharedSourceSummary.dawn.stage1BoardSourceCellCount === 25, 'Stage1 board source cell count drift');
const allLightsSource = readFileSync('src/game/data/allLightsCompletion.ts', 'utf8');
assert(/runtimeFrozen: false/.test(allLightsSource), 'All Lights runtimeFrozen=false boundary drift');
assert(nightRecordBookSharedSourceSummary.dawn.allLightsRuntimeFrozen === false, 'DAWN summary inferred All Lights runtime freeze');
assert(/not True End/.test(dawn.spoilerRule), 'DAWN not-True-End boundary missing');

const ipSource = readFileSync('docs/design/ip-symbol-merch-system-v1.md', 'utf8');
const nightRecordStart = ipSource.indexOf('# 9. 「夜の記録帳」— Collection Hub');
const nextSection = ipSource.indexOf('# 10. Display / Carry Goods');
assert(nightRecordStart >= 0 && nextSection > nightRecordStart, 'Night Record Book authority section missing');
const nightRecordAuthority = ipSource.slice(nightRecordStart, nextSection);
for (const label of ['PEOPLE', 'STAR BEAST', 'OBJECT', 'ROUTE', 'RELATION', 'DAWN']) {
  assert(nightRecordAuthority.includes(label), `IP authority missing section ${label}`);
}
assert(/全部集める=真End/.test(nightRecordAuthority), 'collection-not-True-End authority missing');

assert(nightRecordBookSharedSourceSummary.sectionCount === 6, 'summary section count drift');
assert(nightRecordBookSharedSourceSummary.collectionHubName === '夜の記録帳', 'collection hub name drift');
assert(nightRecordBookSharedSourceSummary.canBulkGeneratePagesNow === false, 'Night Record pages must not bulk-generate yet');
assert(nightRecordBookSharedSourceSummary.physicalPurchaseRequired === false, 'physical purchase requirement inferred');
assert(nightRecordBookSharedSourceSummary.trueEndRequired === false, 'True End requirement inferred');
assert(nightRecordBookSharedSourceSummary.sectionExpansionApproved === false, 'six-section expansion inferred');

for (const extra of ['ENEMY', 'WEAPON', 'STAGE', 'ACHIEVEMENT', 'REWARD']) {
  assert(!nightRecordBookSectionById.has(extra as never), `unapproved seventh+ section added: ${extra}`);
}

console.log(
  `Night Record Book Shared Source: PASS (` +
    `sections=${nightRecordBookSections.length}, people=${nightRecordBookSharedSourceSummary.people.total}, ` +
    `starBeasts=${nightRecordBookSharedSourceSummary.starBeasts.total}, objects=${nightRecordBookSharedSourceSummary.objects.total}, ` +
    `route=${nightRecordBookSharedSourceSummary.route.routeInstances}, ` +
    `relationCoverage=${nightRecordBookSharedSourceSummary.relation.machineCoverageArcs}/${nightRecordBookSharedSourceSummary.relation.humanCurrentStrongInventory}, ` +
    `relationDetailed=${nightRecordBookSharedSourceSummary.relation.detailedMachineArcs}/${nightRecordBookSharedSourceSummary.relation.humanCurrentStrongInventory}, ` +
    `dawn=${nightRecordBookSharedSourceSummary.dawn.normalizedEntries}, bulkPages=false)`,
);
