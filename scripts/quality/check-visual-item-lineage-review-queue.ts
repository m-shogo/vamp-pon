import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { characterProductionPlans } from '../../src/game/data/characterProductionPlans.ts';

const QUEUE_PATH = 'data/character-assets/manifests/visual-item-lineage-review-queue.v1.json';
const queue = JSON.parse(readFileSync(resolve(process.cwd(), QUEUE_PATH), 'utf8'));

function fail(message: string): never {
  throw new Error(`[visual-item-lineage-review] ${message}`);
}

const roles = ['starterGear', 'passiveItem', 'rareItem', 'lampTsugi', 'akatsukiBiraki'] as const;
type Role = (typeof roles)[number];

if (characterProductionPlans.length !== 20) fail(`expected 20 character production plans, got ${characterProductionPlans.length}`);
if (queue.schemaVersion !== 1) fail(`queue schemaVersion must remain backward-compatible v1, got ${queue.schemaVersion}`);
if (queue.status !== 'REVIEW_REQUIRED_NO_AUTOMATIC_COLLAPSE') fail(`invalid queue status: ${queue.status}`);
if (queue.automaticSamePhysicalObjectDecisionAllowed !== false || queue.automaticEvolutionDecisionAllowed !== false) fail('automatic physical/evolution collapse must remain forbidden');
if (queue.sameLabelProvesSamePhysicalObject !== false || queue.sameOwnerProvesSamePhysicalObject !== false || queue.sameMotifProvesSamePhysicalObject !== false) fail('same label/owner/motif may not prove physical sameness');
if (queue.currentReviewConclusion?.imageGenerationAuthorizedFromThisQueue !== false) fail('lineage queue may not authorize generation');
if (queue.currentReviewConclusion?.rowsAuthorizedToCollapse !== 0) fail('no exact-label row collapse is currently authorized');

const occurrences = characterProductionPlans.flatMap((plan) => roles.map((role) => ({
  characterId: plan.characterId,
  role,
  label: plan[role],
})));
if (occurrences.length !== 100) fail(`expected 100 character-linked phase rows, got ${occurrences.length}`);

const byCharacterAndLabel = new Map<string, Array<{ characterId: string; role: Role; label: string }>>();
for (const occurrence of occurrences) {
  const key = `${occurrence.characterId}\u0000${occurrence.label}`;
  const current = byCharacterAndLabel.get(key) ?? [];
  current.push(occurrence);
  byCharacterAndLabel.set(key, current);
}
const collisionGroups = [...byCharacterAndLabel.values()]
  .filter((group) => group.length > 1)
  .map((group) => ({
    characterId: group[0].characterId,
    label: group[0].label,
    occurrences: group.map((entry) => entry.role).sort(),
  }))
  .sort((a, b) => `${a.characterId}:${a.label}`.localeCompare(`${b.characterId}:${b.label}`, 'ja'));

if (collisionGroups.length !== 11) fail(`expected 11 exact-label collision groups, got ${collisionGroups.length}`);
const exactDistinctLabels = new Set(occurrences.map((entry) => `${entry.characterId}\u0000${entry.label}`)).size;
if (exactDistinctLabels !== 89) fail(`expected 89 distinct character+label identities, got ${exactDistinctLabels}`);

const queueItems = Array.isArray(queue.items) ? queue.items : [];
if (queueItems.length !== collisionGroups.length) fail(`queue must contain exactly ${collisionGroups.length} groups, got ${queueItems.length}`);
const queueByKey = new Map(queueItems.map((item: any) => [`${item.characterId}\u0000${item.label}`, item]));

for (const expected of collisionGroups) {
  const key = `${expected.characterId}\u0000${expected.label}`;
  const item = queueByKey.get(key);
  if (!item) fail(`queue missing collision ${expected.characterId}/${expected.label}`);
  const actualOccurrences = [...(item.occurrences ?? [])].sort();
  if (JSON.stringify(actualOccurrences) !== JSON.stringify(expected.occurrences)) fail(`${expected.characterId}/${expected.label}: occurrence roles drift: expected ${expected.occurrences.join(', ')}, got ${actualOccurrences.join(', ')}`);
  if (item.decision !== 'UNRESOLVED') fail(`${expected.characterId}/${expected.label}: decision must remain UNRESOLVED until explicit authority resolves physical continuity`);
  if (item.masterCountBeforeDecision !== expected.occurrences.length || item.masterCountAfterDecision !== null) fail(`${expected.characterId}/${expected.label}: unresolved master counts are invalid`);
  if (item.physicalConstructionContinuity !== 'NOT_ESTABLISHED_BY_CURRENT_SOURCE') fail(`${expected.characterId}/${expected.label}: physical construction continuity was invented`);
  if (item.materialContinuity !== 'NOT_ESTABLISHED_BY_CURRENT_SOURCE') fail(`${expected.characterId}/${expected.label}: material continuity was invented`);
  if (item.ownerContinuity !== 'SAME_CHARACTER_ONLY_NOT_PHYSICAL_PROOF') fail(`${expected.characterId}/${expected.label}: same owner must not become physical proof`);
  if (!Array.isArray(item.authoritySources) || !item.authoritySources.includes('src/game/data/characterProductionPlans.ts') || !item.authoritySources.includes('src/game/data/itemAssetProductionDatabase.ts')) fail(`${expected.characterId}/${expected.label}: required authority sources missing`);
  if (typeof item.stateChangeDescription !== 'string' || !item.stateChangeDescription.trim()) fail(`${expected.characterId}/${expected.label}: stateChangeDescription required`);
  if (typeof item.notes !== 'string' || !item.notes.trim()) fail(`${expected.characterId}/${expected.label}: notes required`);
}

for (const item of queueItems) {
  const key = `${item.characterId}\u0000${item.label}`;
  if (!collisionGroups.some((entry) => `${entry.characterId}\u0000${entry.label}` === key)) fail(`queue contains stale/non-source collision: ${item.characterId}/${item.label}`);
}

const passiveLampGroups = collisionGroups.filter((group) => JSON.stringify(group.occurrences) === JSON.stringify(['lampTsugi', 'passiveItem']));
const rareAkatsukiGroups = collisionGroups.filter((group) => JSON.stringify(group.occurrences) === JSON.stringify(['akatsukiBiraki', 'rareItem']));
if (passiveLampGroups.length !== 10) fail(`expected 10 passiveItem/lampTsugi collisions, got ${passiveLampGroups.length}`);
if (rareAkatsukiGroups.length !== 1 || rareAkatsukiGroups[0].characterId !== 'tobari') fail('expected only Tobari rareItem/akatsukiBiraki collision');

if (queue.nonCollisionRows?.count !== 78) fail(`expected 78 non-collision occurrence rows, got ${queue.nonCollisionRows?.count}`);
if (queue.fieldDrops?.count !== 5) fail('field drop count must remain 5');
if (queue.namedObjectBoundary?.automaticallyMergedWithCharacterItemRows !== false) fail('Named Objects must remain separate from character item rows');

console.log(JSON.stringify({
  status: 'PASS',
  schemaVersion: queue.schemaVersion,
  characterPlans: characterProductionPlans.length,
  sourcePhaseRows: occurrences.length,
  exactDistinctCharacterLabels: exactDistinctLabels,
  exactCollisionGroups: collisionGroups.length,
  passiveItemLampTsugiCollisions: passiveLampGroups.length,
  rareItemAkatsukiBirakiCollisions: rareAkatsukiGroups.length,
  resolvedGroups: 0,
  rowsAuthorizedToCollapse: 0,
  finalPhysicalObjectMasterCount: 'TBD_AFTER_AUTHORITY_REVIEW',
  imageGenerationAuthorized: false,
}, null, 2));
