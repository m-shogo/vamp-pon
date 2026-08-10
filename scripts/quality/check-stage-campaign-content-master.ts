import { readFileSync } from 'node:fs';

import { stageProductionEntries } from '../../src/game/data/stageProductionDatabase.ts';
import { enemyProductionEntries } from '../../src/game/data/enemyProductionDatabase.ts';
import {
  attributeReactions,
  stageCombatProfiles,
} from '../../src/game/data/combatAffinitySource.ts';
import {
  currentCharacterStarBeastCombatEntries,
} from '../../src/game/data/characterStarBeastCombatSource.ts';
import {
  baseWeaponCandidates,
  currentBaseWeaponIds,
} from '../../src/game/data/weaponExpansionSource.ts';
import {
  weaponFusionCandidates,
} from '../../src/game/data/weaponTransformationSource.ts';
import {
  combatItemEffectCandidates,
} from '../../src/game/data/combatItemEffectSource.ts';
import {
  series1StageCampaignContentEntries,
  series1StageCampaignContentSummary,
} from '../../src/game/data/series1StageCampaignContentSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function uniqueCount(values: readonly string[]): number {
  return new Set(values).size;
}

function sameOrder(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

const stageIds = stageProductionEntries.map((stage) => stage.id);
const combatStageIds = stageCombatProfiles.map((stage) => stage.stageId);
const campaignStageIds = series1StageCampaignContentEntries.map((stage) => stage.stageId);
const currentCharacterIds = new Set(currentCharacterStarBeastCombatEntries.map((entry) => entry.characterId));
const enemyIds = new Set(enemyProductionEntries.map((enemy) => enemy.id));
const baseWeaponIds = new Set([
  ...currentBaseWeaponIds,
  ...baseWeaponCandidates.map((weapon) => weapon.id),
]);
const fusionIds = new Set(weaponFusionCandidates.map((fusion) => fusion.id));
const reactionIds = new Set(attributeReactions.map((reaction) => reaction.id));
const itemIds = new Set(combatItemEffectCandidates.map((item) => item.id));

assert(stageProductionEntries.length === 20, `expected Current Stage20, got ${stageProductionEntries.length}`);
assert(series1StageCampaignContentEntries.length === 20, `expected 20 campaign entries, got ${series1StageCampaignContentEntries.length}`);
assert(uniqueCount(campaignStageIds) === 20, 'campaign stage ids must be unique');
assert(sameOrder(campaignStageIds, stageIds), 'campaign entries must preserve Stage1-20 production order');
assert(sameOrder(combatStageIds, stageIds), 'combat stage profiles must preserve Stage1-20 production order');
assert(enemyProductionEntries.length === 48, `Current Enemy48 must remain unchanged, got ${enemyProductionEntries.length}`);

for (const [index, stage] of series1StageCampaignContentEntries.entries()) {
  const production = stageProductionEntries[index];
  assert(stage.stageNo === index + 1, `stage number mismatch for ${stage.stageId}`);
  assert(stage.stageName === production.name, `stage name mismatch for ${stage.stageId}`);
  assert(sameOrder(stage.centerCharacterIds, production.leadCharacterIds), `center character source drift for ${stage.stageId}`);
  assert(stage.stageIdentity.length >= 20, `${stage.stageId} needs concrete stage identity`);
  assert(stage.storyBeat.length >= 30, `${stage.stageId} needs concrete story beat`);
  assert(stage.starBeastMeaning.length >= 25, `${stage.stageId} needs star-beast meaning`);
  assert(stage.combat.waveRule.length >= 25, `${stage.stageId} needs wave rule`);
  assert(stage.combat.pairingPressure.length >= 15, `${stage.stageId} needs enemy pairing pressure`);
  assert(stage.combat.enemyIds.length >= 2, `${stage.stageId} needs a concrete enemy composition`);
  assert(stage.combat.enemyIds.every((id) => enemyIds.has(id)), `${stage.stageId} references an enemy outside Current48`);
  assert(production.enemyAffinity.every((id) => stage.combat.enemyIds.includes(id)), `${stage.stageId} must preserve production enemy affinity`);
  assert(stage.combat.recommendedCharacterIds.length >= 2, `${stage.stageId} needs multiple recommended characters`);
  assert(stage.combat.recommendedCharacterIds.every((id) => currentCharacterIds.has(id)), `${stage.stageId} may recommend Current21 only`);
  assert(stage.combat.favoriteCharacterAlternative.length >= 30, `${stage.stageId} needs a favorite-character alternative plan`);
  assert(stage.combat.recommendedBaseWeaponIds.length > 0, `${stage.stageId} needs base weapon recommendations`);
  assert(stage.combat.recommendedBaseWeaponIds.every((id) => baseWeaponIds.has(id)), `${stage.stageId} references an unknown base weapon`);
  assert(stage.combat.fusionOpportunityIds.length > 0, `${stage.stageId} needs a fusion opportunity`);
  assert(stage.combat.fusionOpportunityIds.every((id) => fusionIds.has(id)), `${stage.stageId} references an unknown fusion`);
  assert(stage.combat.reactionOpportunityIds.length > 0, `${stage.stageId} needs a reaction opportunity`);
  assert(stage.combat.reactionOpportunityIds.every((id) => reactionIds.has(id)), `${stage.stageId} references an unknown reaction`);
  assert(stage.combat.itemCounterIds.length > 0, `${stage.stageId} needs an item counter`);
  assert(stage.combat.itemCounterIds.every((id) => itemIds.has(id)), `${stage.stageId} references an unknown item counter`);
  assert(stage.combat.stageGimmick.length >= 25, `${stage.stageId} needs an actual gameplay gimmick`);
  assert(stage.combat.encounterPlan.length >= 25, `${stage.stageId} needs a Boss/Elite or explicit finale plan`);
  assert(stage.vfxEnvironment.length >= 20, `${stage.stageId} needs environmental VFX language`);
  assert(stage.progression.clearGetter.length > 0, `${stage.stageId} needs a Clear Getter`);
  assert(stage.progression.nightRecordEntry.length >= 20, `${stage.stageId} needs a Night Record entry`);
  assert(stage.progression.unlock.label.length > 0, `${stage.stageId} needs an unlock`);
  assert(stage.progression.transition.length >= 20, `${stage.stageId} needs a next-stage transition`);
  assert(stage.progression.seriesForeshadowing.length >= 20, `${stage.stageId} needs sequel foreshadowing without locking the answer`);
  assert(stage.authority === 'CONTENT_SOURCE_ONLY', `${stage.stageId} must stay content-source-only`);
  assert(!stage.runtimeAutoPromotionAllowed, `${stage.stageId} must not auto-promote runtime content`);

  if (stage.progression.unlock.kind === 'BASE_WEAPON_CANDIDATE') {
    const candidate = baseWeaponCandidates.find((weapon) => weapon.id === stage.progression.unlock.targetId);
    assert(candidate?.runtimeStatus === 'CONTENT_SOURCE_ONLY', `${stage.stageId} candidate weapon unlock must remain content-only`);
  }
  if (stage.progression.unlock.kind === 'FUSION_RECIPE_CANDIDATE') {
    const fusion = weaponFusionCandidates.find((entry) => entry.id === stage.progression.unlock.targetId);
    assert(fusion?.runtimeStatus === 'CONTENT_SOURCE_ONLY', `${stage.stageId} fusion unlock must remain content-only`);
  }
}

const finalStage = series1StageCampaignContentEntries.at(-1);
assert(finalStage?.stageId === 'dawn_return_square', 'Stage20 must remain dawn_return_square');
for (const coreId of ['yui', 'asa', 'nagi', 'michiru', 'tomori']) {
  assert(finalStage?.combat.recommendedCharacterIds.includes(coreId), `Stage20 must include Core5 recommendation: ${coreId}`);
}
assert(finalStage?.progression.unlock.kind === 'NIGHT_RECORD_SECTION', 'Stage20 should close by unlocking the Night Record DAWN section, not a sequel gate');

const stage16 = series1StageCampaignContentEntries.find((stage) => stage.stageId === 'black_origami_roof');
assert(stage16?.combat.recommendedCharacterIds.includes('kuroori'), 'Stage16 must preserve Kuroori as a viable narrative-friction pick');
assert(stage16?.combat.favoriteCharacterAlternative.includes('クロオリ'), 'Stage16 must explain how the center Shadow character remains viable despite affinity friction');

assert(series1StageCampaignContentSummary.stagesWithCharacterAlternative === 20, 'every stage needs favorite-character alternative routing');
assert(series1StageCampaignContentSummary.stagesWithFusionOpportunity === 20, 'every stage needs a fusion opportunity');
assert(series1StageCampaignContentSummary.stagesWithItemCounter === 20, 'every stage needs item counterplay');
assert(series1StageCampaignContentSummary.stagesWithNightRecordReward === 20, 'every stage needs a Night Record reward');
assert(series1StageCampaignContentSummary.stagesWithForeshadowing === 20, 'every stage needs bounded sequel foreshadowing');
assert(!series1StageCampaignContentSummary.runtimeAutoPromotionAllowed, 'stage campaign source must not auto-promote runtime');
assert(!series1StageCampaignContentSummary.futureCastPromotionAllowed, 'Stage1 source must not promote Future15');

const masterDoc = readFileSync(new URL('../../docs/series1-stage-campaign-content-source-v1.md', import.meta.url), 'utf8');
for (const required of [
  'Stage 1-20',
  '好きなCharacter用代替攻略',
  'Enemy48',
  'Fusion / Reaction / Item',
  'Night Record',
  'CONTENT_SOURCE_ONLY',
  'Title1 Happy End',
]) {
  assert(masterDoc.includes(required), `stage campaign doc missing token: ${required}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  stages: series1StageCampaignContentEntries.length,
  currentEnemies: enemyProductionEntries.length,
  currentCharactersOnly: true,
  stagesWithAlternatives: series1StageCampaignContentSummary.stagesWithCharacterAlternative,
  stagesWithFusion: series1StageCampaignContentSummary.stagesWithFusionOpportunity,
  stagesWithItems: series1StageCampaignContentSummary.stagesWithItemCounter,
  nightRecordRewards: series1StageCampaignContentSummary.stagesWithNightRecordReward,
  foreshadowedStages: series1StageCampaignContentSummary.stagesWithForeshadowing,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
