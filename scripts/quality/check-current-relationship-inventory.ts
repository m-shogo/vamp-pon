import { readFileSync } from 'node:fs';

import {
  CURRENT_RELATIONSHIP_CHARACTER_IDS,
  currentRelationshipCoverageByCharacter,
  currentRelationshipInventory,
  currentRelationshipInventoryById,
  currentRelationshipInventorySummary,
  type CurrentRelationCharacterId,
} from '../../src/game/data/currentRelationshipInventory.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[Current Relationship Inventory] ${message}`);
}

assert(currentRelationshipInventory.length === 24, 'inventory must cover 24 Current arcs');
assert(new Set(currentRelationshipInventory.map((entry) => entry.id)).size === 24, 'duplicate relationship ID');
assert(currentRelationshipInventorySummary.detailedMachineArcs === 12, 'existing detailed machine coverage must stay 12');
assert(currentRelationshipInventorySummary.currentHubCoverageArcs === 12, 'coverage-only arc count must be 12');
assert(currentRelationshipInventorySummary.characterCount === 21, 'Current21 character coverage drift');
assert(currentRelationshipInventorySummary.minimumDistinctiveLanes >= 2, 'every Current21 character needs >=2 relation lanes');
assert(JSON.stringify(currentRelationshipInventorySummary.reserveInvolvedArcs) === JSON.stringify(['madoka-ren', 'ren-toki']), 'Reserve arc boundary drift');

const relationDoc = readFileSync('docs/RELATIONSHIPS.md', 'utf8');
const start = relationDoc.indexOf('# 3. Current strong arc inventory');
const end = relationDoc.indexOf('# 4. Coverage pass detailed arcs');
assert(start >= 0 && end > start, 'human Current inventory section missing');
const lines = relationDoc.slice(start, end).match(/^\d+\.\s.+$/gm) ?? [];
assert(lines.length === 24, `human Current inventory count drift: ${lines.length}`);
for (const entry of currentRelationshipInventory) {
  const line = lines.find((candidate) => candidate.startsWith(`${entry.order}. `));
  assert(line?.includes(entry.displayLabel), `${entry.id}: human label/order drift`);
  assert(entry.currentCoverage === true, `${entry.id}: Current coverage flag missing`);
  assert(entry.exactIncidentFrozen === false, `${entry.id}: exact incident must stay unfrozen`);
  assert(entry.romanceFrozenByInventory === false, `${entry.id}: inventory must not create romance Canon`);
  assert(entry.bloodRelationFrozenByInventory === false, `${entry.id}: inventory must not create family-history Canon`);
  assert(entry.mainMysteryFrozenByInventory === false, `${entry.id}: inventory must not create Main Mystery Canon`);
}

const machine = JSON.parse(readFileSync('docs/design-targets/generated/character-relationship-arc-map-v1.json', 'utf8')) as {
  currentArcs?: Array<{ id: string; participants: string[] }>;
};
assert(Array.isArray(machine.currentArcs) && machine.currentArcs.length === 12, 'existing machine currentArcs drift');
for (const arc of machine.currentArcs) {
  const inventory = currentRelationshipInventoryById.get(arc.id);
  assert(inventory?.detailedMachineArcAvailable === true, `${arc.id}: detailed relation link missing`);
  assert(inventory.authority === 'DETAILED_MACHINE_ARC', `${arc.id}: detailed authority drift`);
  assert(JSON.stringify(inventory.participants) === JSON.stringify(arc.participants), `${arc.id}: participant drift`);
}
for (const entry of currentRelationshipInventory.slice(12)) {
  assert(entry.authority === 'CURRENT_HUB_COVERAGE_ARC', `${entry.id}: coverage authority drift`);
  assert(entry.detailedMachineArcAvailable === false, `${entry.id}: old machine detail inferred`);
}

const expected: Record<CurrentRelationCharacterId, number> = {
  yui: 3, asa: 2, nagi: 2, michiru: 2, tomori: 2, sen: 2, ritsu: 2, koyori: 2,
  gen: 2, hana: 2, yubi: 3, madoka: 2, shiro: 3, tobari: 2, nemu: 2, kuroori: 2,
  kage1: 2, kage2: 2, kage3: 4, kage4: 3, ren: 2,
};
assert(CURRENT_RELATIONSHIP_CHARACTER_IDS.length === 21, 'Current21 ID list drift');
for (const coverage of currentRelationshipCoverageByCharacter) {
  assert(coverage.relationCount === expected[coverage.characterId], `${coverage.characterId}: relation coverage drift`);
}

assert(relationDoc.includes('ユイ×アサは主人公級バディ、恋愛なし'), 'Yui/Asa non-romance guard missing');
assert(relationDoc.includes('リツ×コヨリは兄妹、恋愛なし'), 'Ritsu/Koyori sibling guard missing');
assert(relationDoc.includes('Main Mysteryをrelationship sceneだけで勝手に確定しない'), 'Main Mystery guard missing');

const futureIds = new Set(['hiyori','serika','chloe','renji','touma','kuu','yomo','noa','rum','maki','suzu','io','kai','nao','amane']);
for (const entry of currentRelationshipInventory) {
  assert(entry.participants.every((id) => !futureIds.has(id)), `${entry.id}: Future15 leaked into Current inventory`);
}

console.log(`Current Relationship Inventory: PASS (arcs=24, detailed=12, coverageOnly=12, characters=21, minLanes=${currentRelationshipInventorySummary.minimumDistinctiveLanes})`);
