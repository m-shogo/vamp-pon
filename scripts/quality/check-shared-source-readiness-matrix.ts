import { existsSync } from 'node:fs';

import { currentRelationshipInventorySummary } from '../../src/game/data/currentRelationshipInventory.ts';
import { dawnProofSharedSourceSummary } from '../../src/game/data/dawnProofSharedSource.ts';
import { nightRecordBookSharedSourceSummary } from '../../src/game/data/nightRecordBookSharedSource.ts';
import {
  sharedSourceReadinessByCategory,
  sharedSourceReadinessMatrix,
  sharedSourceReadinessSummary,
  type SharedSourceReadinessCategory,
} from '../../src/game/data/sharedSourceReadinessMatrix.ts';
import { sharedSourceGenerationHandoffSummary } from '../../src/game/data/sharedSourceGenerationHandoff.ts';
import { worldEffectGenerationHandoffSummary } from '../../src/game/data/worldEffectGenerationHandoff.ts';

function fail(message: string): never {
  throw new Error(`[Shared Source Readiness Matrix] ${message}`);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

const expectedCategories: readonly SharedSourceReadinessCategory[] = [
  'Characters', 'Star Beasts', 'Named Objects', 'Toumon', 'Enemies', 'Bosses', 'Weapons', 'Items', 'Stages',
  'Clear Getter', 'Achievements', 'Rewards', 'Unlockables', 'Collectibles', 'Routes', 'Stations', 'Tickets', 'Stamps',
  'UI Symbols', 'World Effects', 'Collection', 'Night Record Book',
] as const;

assert(sharedSourceReadinessMatrix.length === expectedCategories.length, `category coverage drift: ${sharedSourceReadinessMatrix.length}/${expectedCategories.length}`);
assert(new Set(sharedSourceReadinessMatrix.map((entry) => entry.category)).size === expectedCategories.length, 'duplicate readiness category');
assert(JSON.stringify(sharedSourceReadinessMatrix.map((entry) => entry.category)) === JSON.stringify(expectedCategories), 'readiness category/order drift');

for (const readiness of sharedSourceReadinessMatrix) {
  assert(readiness.currentMachineSources.length > 0, `${readiness.category}: machine source list missing`);
  for (const source of readiness.currentMachineSources) assert(existsSync(source), `${readiness.category}: source path missing: ${source}`);
  assert(readiness.generationScope.length > 30, `${readiness.category}: generation scope too weak`);
  assert(readiness.nextGate.length > 20, `${readiness.category}: next gate too weak`);
  assert(readiness.guard.length > 20, `${readiness.category}: guard too weak`);
  if (readiness.referenceCandidateReadiness === 'BLOCKED') {
    assert(readiness.canBulkGenerateNow === false, `${readiness.category}: blocked category cannot bulk generate`);
    assert(readiness.blockedScope.length > 0, `${readiness.category}: blocked category lacks reason`);
  }
  if (readiness.canBulkGenerateNow) assert(readiness.referenceCandidateReadiness === 'READY', `${readiness.category}: bulk generation requires READY`);
}

const expectedBulk = ['Enemies', 'Bosses', 'Weapons', 'Items'];
assert(JSON.stringify(sharedSourceReadinessSummary.bulkGenerationCategories) === JSON.stringify(expectedBulk), `bulk-generation category drift: ${sharedSourceReadinessSummary.bulkGenerationCategories.join(', ')}`);
for (const category of expectedBulk) assert(sharedSourceReadinessByCategory.get(category as SharedSourceReadinessCategory)?.referenceCandidateReadiness === 'READY', `${category}: expected READY`);

const hardBlocked: readonly SharedSourceReadinessCategory[] = [
  'Named Objects', 'Toumon', 'Clear Getter', 'Achievements', 'Rewards', 'Unlockables', 'Collectibles', 'Routes', 'Stations', 'Tickets', 'Stamps', 'UI Symbols',
];
for (const category of hardBlocked) {
  const readiness = sharedSourceReadinessByCategory.get(category);
  assert(readiness?.referenceCandidateReadiness === 'BLOCKED', `${category}: expected fail-closed BLOCKED`);
  assert(readiness.canBulkGenerateNow === false, `${category}: hard-blocked category cannot bulk generate`);
}

const characters = sharedSourceReadinessByCategory.get('Characters');
assert(characters?.referenceCandidateReadiness === 'PARTIAL', 'Characters must remain PARTIAL because Reserve is separated');
assert(characters.blockedScope.some((rule) => /Ren|OFFICIAL_RESERVE/.test(rule)), 'Character Reserve blocker missing');
const starBeasts = sharedSourceReadinessByCategory.get('Star Beasts');
assert(starBeasts?.referenceCandidateReadiness === 'PARTIAL', 'Star Beasts must remain PARTIAL because Reserve is separated');
assert(starBeasts.blockedScope.some((rule) => /Ren|OFFICIAL_RESERVE/.test(rule)), 'Star Beast Reserve blocker missing');
const namedObjects = sharedSourceReadinessByCategory.get('Named Objects');
assert(namedObjects?.artworkReadiness === 'CANDIDATE_HOLD', 'Named Object candidate-geometry hold missing');
assert(namedObjects.blockedScope.some((rule) => /CANDIDATE_OBJECT_GEOMETRY/.test(rule)), 'Named Object candidate geometry reason missing');
const toumon = sharedSourceReadinessByCategory.get('Toumon');
assert(toumon?.artworkReadiness === 'VECTOR_HOLD', 'Toumon vector hold missing');
assert(/Do not generate final Toumon geometry/.test(toumon.generationScope), 'Toumon generation stop missing');
const stages = sharedSourceReadinessByCategory.get('Stages');
assert(stages?.referenceCandidateReadiness === 'PARTIAL', 'Stages must remain PARTIAL while route/station instances are unresolved');
assert(stages.blockedScope.some((rule) => /Route\/station\/stamp/.test(rule)), 'Stage route/station/stamp blocker missing');
const rewards = sharedSourceReadinessByCategory.get('Rewards');
assert(rewards?.blockedScope.some((rule) => /runtimeFrozen=false/.test(rule)), 'All Lights runtimeFrozen=false boundary missing');
assert(/not True End/.test(rewards?.guard ?? ''), 'All Lights not-True-End guard missing');

const worldEffects = sharedSourceReadinessByCategory.get('World Effects');
assert(worldEffects?.referenceCandidateReadiness === 'PARTIAL', 'World Effects remain PARTIAL until candidate/device approval');
assert(worldEffects.canBulkGenerateNow === false, 'World Effects must not become bulk-image READY');
assert(worldEffects.currentMachineSources.includes('src/game/data/worldEffectGenerationHandoff.ts'), 'P14 World Effect handoff source missing from readiness');
assert(/P14 handoff/.test(worldEffects.generationScope), 'World Effects readiness still describes the P14 handoff as missing');
assert(worldEffects.blockedScope.some((rule) => /Device creative approval/.test(rule)), 'World Effects device approval blocker missing');
assert(JSON.stringify(worldEffectGenerationHandoffSummary.generatedTextureCandidateEvents) === JSON.stringify(['WEAPON_EVOLUTION', 'KOKUYOU', 'BOSS_DEATH']), 'P14 generated texture event set drift');
assert(JSON.stringify(worldEffectGenerationHandoffSummary.blockedEvents) === JSON.stringify(['TOUMON']), 'P14 Toumon block drift');
assert(worldEffectGenerationHandoffSummary.deviceCreativeApprovalReady === false, 'World Effect device creative approval inferred');

const collection = sharedSourceReadinessByCategory.get('Collection');
assert(collection?.referenceCandidateReadiness === 'PARTIAL', 'Collection should remain PARTIAL');
assert(collection.canBulkGenerateNow === false, 'Collection visual bulk generation must remain held');
assert(collection.currentMachineSources.includes('src/game/data/nightRecordBookSharedSource.ts'), 'Collection readiness must use the six-section adapter');
assert(collection.currentMachineSources.includes('src/game/data/dawnProofSharedSource.ts'), 'Collection readiness must include the DAWN proof source');
assert(/seven direct Dawn gameplay-proof records/.test(collection.generationScope), 'Collection readiness did not advance to DAWN proof source');

const nightRecord = sharedSourceReadinessByCategory.get('Night Record Book');
assert(nightRecord?.referenceCandidateReadiness === 'PARTIAL', 'Night Record must remain PARTIAL while Route/page art/all-stage coverage are incomplete');
assert(nightRecord.canBulkGenerateNow === false, 'Night Record page bulk generation must remain held');
assert(nightRecord.currentMachineSources.includes('src/game/data/nightRecordBookSharedSource.ts'), 'Night Record adapter source missing from readiness');
assert(nightRecord.currentMachineSources.includes('src/game/data/dawnProofSharedSource.ts'), 'Night Record DAWN proof source missing from readiness');
assert(nightRecord.currentMachineSources.includes('src/game/data/currentRelationshipInventory.ts'), 'Night Record Current24 relation source missing');
assert(/24\/24/.test(nightRecord.generationScope) && /12\/24/.test(nightRecord.generationScope), 'Night Record relation coverage/detail split missing');
assert(/seven direct Stage1 gameplay-proof records/.test(nightRecord.generationScope), 'Night Record DAWN seven-proof progress missing');
assert(/six-section/.test(nightRecord.guard), 'Night Record six-section preservation guard missing');
assert(nightRecordBookSharedSourceSummary.sectionCount === 6, 'Night Record six-section source drift');
assert(nightRecordBookSharedSourceSummary.relation.machineCoverageArcs === 24, 'Night Record relation machine coverage drift');
assert(nightRecordBookSharedSourceSummary.relation.detailedMachineArcs === 12, 'Night Record relation detailed coverage drift');
assert(nightRecordBookSharedSourceSummary.relation.machineCoverageComplete === true, 'Night Record relation coverage should be complete');
assert(nightRecordBookSharedSourceSummary.relation.detailedCoverageComplete === false, 'Night Record detailed relation coverage must remain incomplete');
assert(currentRelationshipInventorySummary.total === 24 && currentRelationshipInventorySummary.detailedMachineArcs === 12, 'Current relationship summary drift');
assert(nightRecordBookSharedSourceSummary.route.routeInstances === 0, 'Night Record route instances must remain zero');
assert(nightRecordBookSharedSourceSummary.dawn.normalizedEntries === 7, 'Night Record DAWN direct proof count drift');
assert(dawnProofSharedSourceSummary.directDawnProofCount === 7, 'DAWN proof source count drift');
assert(dawnProofSharedSourceSummary.sourceBoardCellCount === 25, 'DAWN source board count drift');
assert(dawnProofSharedSourceSummary.allRecordsNarrativeSceneInferred === false, 'DAWN proof source inferred narrative scenes');
assert(dawnProofSharedSourceSummary.canGeneratePageArtNow === false, 'DAWN proof source inferred page-art readiness');
assert(nightRecordBookSharedSourceSummary.trueEndRequired === false && nightRecordBookSharedSourceSummary.physicalPurchaseRequired === false, 'Night Record completion boundary drift');

assert(sharedSourceReadinessSummary.categoryCount === expectedCategories.length, 'readiness summary category count drift');
assert(sharedSourceReadinessSummary.handoffTotal === sharedSourceGenerationHandoffSummary.total, 'handoff total sync drift');
assert(sharedSourceReadinessSummary.handoffReadyForCandidate === sharedSourceGenerationHandoffSummary.readyForCandidate, 'handoff ready count sync drift');
assert(sharedSourceReadinessSummary.handoffBlocked === sharedSourceGenerationHandoffSummary.blocked, 'handoff blocked count sync drift');
assert(sharedSourceReadinessSummary.approvalDefaultsRemainFalse === true, 'approval-default safety flag drift');

console.log(
  `Shared Source Readiness Matrix: PASS (` +
    `categories=${sharedSourceReadinessMatrix.length}, bulk=${sharedSourceReadinessSummary.bulkGenerationCategories.join('/')}, ` +
    `worldEffectGenerated=${worldEffectGenerationHandoffSummary.generatedTextureCandidateEvents.join('/')}, ` +
    `nightRecordRelation=${nightRecordBookSharedSourceSummary.relation.machineCoverageArcs}/${nightRecordBookSharedSourceSummary.relation.detailedMachineArcs}, ` +
    `dawnProof=${dawnProofSharedSourceSummary.directDawnProofCount}/${dawnProofSharedSourceSummary.sourceBoardCellCount})`,
);
