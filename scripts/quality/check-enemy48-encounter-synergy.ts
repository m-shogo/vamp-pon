import { readFileSync } from 'node:fs';

import { enemyProductionEntries } from '../../src/game/data/enemyProductionDatabase.ts';
import { enemyStatusTraitProfiles } from '../../src/game/data/enemyStatusTraitSource.ts';
import { enemyAttributeIdentities } from '../../src/game/data/enemyAttributeIdentitySource.ts';
import { series1StageCampaignContentEntries } from '../../src/game/data/series1StageCampaignContentSource.ts';
import {
  enemyEncounterSynergyEntries,
  enemyEncounterSynergyByStage,
  enemyEncounterSynergySummary,
} from '../../src/game/data/enemyEncounterSynergySource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

const productionById = new Map(enemyProductionEntries.map((entry) => [entry.id, entry]));
const statusById = new Map(enemyStatusTraitProfiles.map((entry) => [entry.enemyId, entry]));
const attributeById = new Map(enemyAttributeIdentities.map((entry) => [entry.enemyId, entry]));
const stageById = new Map(series1StageCampaignContentEntries.map((entry) => [entry.stageId, entry]));

assert(enemyProductionEntries.length === 48, `Current Enemy48 must remain exact, got ${enemyProductionEntries.length}`);
assert(enemyStatusTraitProfiles.length === 48, 'Enemy48 status source must stay complete');
assert(enemyAttributeIdentities.length === 48, 'Enemy48 attribute source must stay complete');
assert(series1StageCampaignContentEntries.length === 20, 'Series1 Stage20 source must remain complete');
assert(enemyEncounterSynergySummary.enemyRosterCount === 48, 'encounter summary must read Enemy48 roster');
assert(enemyEncounterSynergySummary.coveredEnemyCount === 48, `all Enemy48 must appear in at least one meaningful pairing; uncovered=${enemyEncounterSynergySummary.uncoveredEnemyIds.join(',')}`);
assert(enemyEncounterSynergySummary.uncoveredEnemyIds.length === 0, `Enemy pairing coverage has gaps: ${enemyEncounterSynergySummary.uncoveredEnemyIds.join(',')}`);
assert(enemyEncounterSynergySummary.stagesWithPairings === 20, `all Stage20 need encounter pairings, got ${enemyEncounterSynergySummary.stagesWithPairings}`);
assert(enemyEncounterSynergySummary.pairingCount >= 24, `expected broad Enemy48 pairing coverage, got ${enemyEncounterSynergySummary.pairingCount}`);
assert(enemyEncounterSynergySummary.statusDrivenPairingCount >= 12, 'pairing source should use status/movement synergy, not only generic adjacency');
assert(enemyEncounterSynergySummary.bossPairingCount >= 3, 'all three Current bosses need pair-pressure plans');
assert(enemyEncounterSynergySummary.hardStatusImmunityAdded === 0, 'encounter synergy must not add hard status immunity');
assert(!enemyEncounterSynergySummary.runtimeAutoPromotionAllowed, 'encounter source must not auto-promote runtime');
assert(new Set(enemyEncounterSynergyEntries.map((entry) => entry.id)).size === enemyEncounterSynergyEntries.length, 'encounter pairing ids must be unique');

for (const stage of series1StageCampaignContentEntries) {
  const pairings = enemyEncounterSynergyByStage.get(stage.stageId) ?? [];
  assert(pairings.length > 0, `${stage.stageId} needs at least one encounter pairing`);
  const coveredInStage = new Set(pairings.flatMap((entry) => entry.enemyIds));
  for (const enemyId of stage.combat.enemyIds) {
    assert(coveredInStage.has(enemyId), `${stage.stageId} enemy ${enemyId} is never used in a pairing`);
  }
}

for (const entry of enemyEncounterSynergyEntries) {
  const stage = stageById.get(entry.stageId);
  assert(stage, `unknown stage in pairing ${entry.id}`);
  assert(entry.enemyIds[0] !== entry.enemyIds[1], `pair cannot repeat same enemy: ${entry.id}`);
  assert(stage.combat.enemyIds.includes(entry.enemyIds[0]), `pair enemy outside stage composition: ${entry.id}`);
  assert(stage.combat.enemyIds.includes(entry.enemyIds[1]), `pair enemy outside stage composition: ${entry.id}`);

  for (let index = 0; index < 2; index += 1) {
    const enemyId = entry.enemyIds[index];
    const production = productionById.get(enemyId);
    const status = statusById.get(enemyId);
    const attribute = attributeById.get(enemyId);
    assert(production && status && attribute, `pair references enemy outside Enemy48 authority: ${entry.id}`);
    assert(entry.enemyNames[index] === production.name, `enemy display name drift in ${entry.id}`);
    assert(entry.ranks[index] === production.rank, `enemy rank drift in ${entry.id}`);
    assert(sameStrings(entry.inflictedStatuses[index], status.inflictedStatuses), `status pressure drift in ${entry.id}`);
    assert(sameStrings(entry.defensiveAttributes[index], attribute.defensiveAttributes), `defensive attribute drift in ${entry.id}`);
    assert(status.noHardStatusImmunity, `upstream status source lost no-hard-immunity rule: ${enemyId}`);
  }

  assert(entry.synergyScore >= 3, `pairing must have positive meaningful score: ${entry.id}`);
  assert(entry.readableThreat.length >= 25, `pairing needs readable threat: ${entry.id}`);
  assert(entry.whyTogetherIsDangerous.length >= 25, `pairing needs why-together reason: ${entry.id}`);
  assert(entry.playerAnswer.length >= 25, `pairing needs player counterplay: ${entry.id}`);
  assert(entry.antiFrustrationRule.length >= 25, `pairing needs anti-frustration rule: ${entry.id}`);
  assert(entry.waveUse.length >= 25, `pairing needs wave staging: ${entry.id}`);
  assert(entry.authority === 'CONTENT_SOURCE_ONLY', `pairing must remain content-only: ${entry.id}`);
  assert(!entry.runtimeAutoPromotionAllowed, `pairing must not auto-promote runtime: ${entry.id}`);

  if (entry.ranks.includes('boss')) {
    assert(entry.antiFrustrationRule.includes('完全status immuneにしない'), `Boss pairing must explicitly retain status viability: ${entry.id}`);
    assert(entry.antiFrustrationRule.includes('slow/delay'), `Boss hard control must convert rather than vanish: ${entry.id}`);
  }
}

for (const enemy of enemyProductionEntries) {
  const appearances = enemyEncounterSynergyEntries.filter((entry) => entry.enemyIds.includes(enemy.id));
  assert(appearances.length > 0, `Enemy48 member has no encounter role: ${enemy.id}`);
}

for (const bossId of ['boss_name_without_owner', 'boss_closed_morning_box', 'boss_night_without_route']) {
  const bossPairs = enemyEncounterSynergyEntries.filter((entry) => entry.enemyIds.includes(bossId));
  assert(bossPairs.length > 0, `Current boss lacks pair-pressure plan: ${bossId}`);
}

const kinds = new Set(enemyEncounterSynergyEntries.map((entry) => entry.kind));
assert(kinds.size >= 5, `Enemy48 pairings need multiple pressure grammars, got ${[...kinds].join(', ')}`);
assert(kinds.has('LANE_CROSS') || kinds.has('ANCHOR_AND_FLANK'), 'movement geometry must matter in at least one pairing');
assert(kinds.has('TEMPO_COLLAPSE') || kinds.has('PIN_AND_CHARGE') || kinds.has('SEAL_AND_ANCHOR'), 'status tempo must matter in at least one pairing');

const doc = readFileSync(new URL('../../docs/enemy48-encounter-synergy-source-v1.md', import.meta.url), 'utf8');
for (const token of [
  'Enemy48',
  '単体では弱い',
  'Stage20',
  'ROOTED + charger',
  'ECLIPSED',
  'Boss',
  '完全status immune',
  'player answer',
  'CONTENT_SOURCE_ONLY',
]) {
  assert(doc.includes(token), `Enemy48 encounter doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  enemyRoster: enemyEncounterSynergySummary.enemyRosterCount,
  coveredEnemies: enemyEncounterSynergySummary.coveredEnemyCount,
  pairings: enemyEncounterSynergySummary.pairingCount,
  stages: enemyEncounterSynergySummary.stagesWithPairings,
  statusDrivenPairings: enemyEncounterSynergySummary.statusDrivenPairingCount,
  bossPairings: enemyEncounterSynergySummary.bossPairingCount,
  pressureKinds: [...kinds],
  runtimeAutoPromotionAllowed: false,
}, null, 2));
