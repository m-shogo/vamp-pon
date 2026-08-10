import { existsSync } from 'node:fs';

import {
  sharedSourceReadinessByCategory,
  sharedSourceReadinessMatrix,
  sharedSourceReadinessSummary,
  type SharedSourceReadinessCategory,
} from '../../src/game/data/sharedSourceReadinessMatrix.ts';
import { sharedSourceGenerationHandoffSummary } from '../../src/game/data/sharedSourceGenerationHandoff.ts';

function fail(message: string): never {
  throw new Error(`[Shared Source Readiness Matrix] ${message}`);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

const expectedCategories: readonly SharedSourceReadinessCategory[] = [
  'Characters',
  'Star Beasts',
  'Named Objects',
  'Toumon',
  'Enemies',
  'Bosses',
  'Weapons',
  'Items',
  'Stages',
  'Clear Getter',
  'Achievements',
  'Rewards',
  'Unlockables',
  'Collectibles',
  'Routes',
  'Stations',
  'Tickets',
  'Stamps',
  'UI Symbols',
  'World Effects',
  'Collection',
  'Night Record Book',
] as const;

assert(sharedSourceReadinessMatrix.length === expectedCategories.length, `category coverage drift: ${sharedSourceReadinessMatrix.length}/${expectedCategories.length}`);
assert(new Set(sharedSourceReadinessMatrix.map((entry) => entry.category)).size === expectedCategories.length, 'duplicate readiness category');
assert(
  JSON.stringify(sharedSourceReadinessMatrix.map((entry) => entry.category)) === JSON.stringify(expectedCategories),
  'readiness category/order drift',
);

for (const entry of sharedSourceReadinessMatrix) {
  assert(entry.currentMachineSources.length > 0, `${entry.category}: machine source list missing`);
  for (const source of entry.currentMachineSources) {
    assert(existsSync(source), `${entry.category}: source path missing: ${source}`);
  }
  assert(entry.generationScope.length > 30, `${entry.category}: generation scope too weak`);
  assert(entry.nextGate.length > 20, `${entry.category}: next gate too weak`);
  assert(entry.guard.length > 20, `${entry.category}: guard too weak`);
  assert(entry.artworkReadiness !== (undefined as never), `${entry.category}: artwork readiness missing`);
  if (entry.referenceCandidateReadiness === 'BLOCKED') {
    assert(entry.canBulkGenerateNow === false, `${entry.category}: blocked category cannot bulk generate`);
    assert(entry.blockedScope.length > 0, `${entry.category}: blocked category lacks reason`);
  }
  if (entry.canBulkGenerateNow) {
    assert(entry.referenceCandidateReadiness === 'READY', `${entry.category}: bulk generation requires READY category status`);
  }
}

const expectedBulk = ['Enemies', 'Bosses', 'Weapons', 'Items'];
assert(JSON.stringify(sharedSourceReadinessSummary.bulkGenerationCategories) === JSON.stringify(expectedBulk), `bulk-generation category drift: ${sharedSourceReadinessSummary.bulkGenerationCategories.join(', ')}`);

for (const category of expectedBulk) {
  assert(sharedSourceReadinessByCategory.get(category as SharedSourceReadinessCategory)?.referenceCandidateReadiness === 'READY', `${category}: expected READY`);
}

const hardBlocked: readonly SharedSourceReadinessCategory[] = [
  'Named Objects',
  'Toumon',
  'Clear Getter',
  'Achievements',
  'Rewards',
  'Unlockables',
  'Collectibles',
  'Routes',
  'Stations',
  'Tickets',
  'Stamps',
  'UI Symbols',
];
for (const category of hardBlocked) {
  const entry = sharedSourceReadinessByCategory.get(category);
  assert(entry?.referenceCandidateReadiness === 'BLOCKED', `${category}: expected fail-closed BLOCKED status`);
  assert(entry.canBulkGenerateNow === false, `${category}: hard-blocked category cannot bulk generate`);
}

const characters = sharedSourceReadinessByCategory.get('Characters');
assert(characters?.referenceCandidateReadiness === 'PARTIAL', 'Characters must remain PARTIAL because Reserve is separated');
assert(characters.blockedScope.some((rule) => /Ren|OFFICIAL_RESERVE/.test(rule)), 'Character Reserve blocker missing');

const starBeasts = sharedSourceReadinessByCategory.get('Star Beasts');
assert(starBeasts?.referenceCandidateReadiness === 'PARTIAL', 'Star Beasts must remain PARTIAL because Ren Reserve is blocked');
assert(starBeasts.blockedScope.some((rule) => /Ren|OFFICIAL_RESERVE/.test(rule)), 'Star Beast Reserve blocker missing');

const namedObjects = sharedSourceReadinessByCategory.get('Named Objects');
assert(namedObjects?.artworkReadiness === 'CANDIDATE_HOLD', 'Named Object candidate-geometry hold missing');
assert(namedObjects.blockedScope.some((rule) => /CANDIDATE_OBJECT_GEOMETRY/.test(rule)), 'Named Object candidate geometry reason missing');

const toumon = sharedSourceReadinessByCategory.get('Toumon');
assert(toumon?.artworkReadiness === 'VECTOR_HOLD', 'Toumon final-vector hold missing');
assert(/Do not generate final Toumon geometry/.test(toumon.generationScope), 'Toumon generation stop missing');

const stages = sharedSourceReadinessByCategory.get('Stages');
assert(stages?.referenceCandidateReadiness === 'PARTIAL', 'Stages must remain PARTIAL while route/station instances are unresolved');
assert(stages.blockedScope.some((rule) => /Route\/station\/stamp/.test(rule)), 'Stage route/station/stamp blocker missing');

const rewards = sharedSourceReadinessByCategory.get('Rewards');
assert(rewards?.blockedScope.some((rule) => /runtimeFrozen=false/.test(rule)), 'All Lights runtimeFrozen=false boundary missing');
assert(/not True End/.test(rewards?.guard ?? ''), 'All Lights not-True-End guard missing');

const worldEffects = sharedSourceReadinessByCategory.get('World Effects');
assert(worldEffects?.referenceCandidateReadiness === 'PARTIAL', 'World Effects should remain PARTIAL until dedicated effect handoff/device QA');
assert(worldEffects.canBulkGenerateNow === false, 'World Effects cannot bulk generate before effect handoff/device QA');
assert(worldEffects.blockedScope.some((rule) => /Device creative approval/.test(rule)), 'World Effects device approval blocker missing');

const collection = sharedSourceReadinessByCategory.get('Collection');
const nightRecord = sharedSourceReadinessByCategory.get('Night Record Book');
assert(collection?.canBulkGenerateNow === false, 'Collection visual bulk generation must remain held');
assert(nightRecord?.canBulkGenerateNow === false, 'Night Record Book bulk generation must remain held');
assert(/six-section/.test(nightRecord?.guard ?? ''), 'Night Record existing six-section preservation guard missing');

assert(sharedSourceReadinessSummary.categoryCount === expectedCategories.length, 'readiness summary category count drift');
assert(sharedSourceReadinessSummary.handoffTotal === sharedSourceGenerationHandoffSummary.total, 'handoff total sync drift');
assert(sharedSourceReadinessSummary.handoffReadyForCandidate === sharedSourceGenerationHandoffSummary.readyForCandidate, 'handoff ready count sync drift');
assert(sharedSourceReadinessSummary.handoffBlocked === sharedSourceGenerationHandoffSummary.blocked, 'handoff blocked count sync drift');
assert(sharedSourceReadinessSummary.approvalDefaultsRemainFalse === true, 'approval-default safety flag drift');

console.log(
  `Shared Source Readiness Matrix: PASS (` +
    `categories=${sharedSourceReadinessMatrix.length}, ready=${sharedSourceReadinessSummary.readyCategories.length}, ` +
    `partial=${sharedSourceReadinessSummary.partialCategories.length}, blocked=${sharedSourceReadinessSummary.blockedCategories.length}, ` +
    `bulkCandidate=${sharedSourceReadinessSummary.bulkGenerationCategories.join('/')}, ` +
    `handoffs=${sharedSourceReadinessSummary.handoffTotal})`,
);
