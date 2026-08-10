import { readFileSync } from 'node:fs';

import {
  COMBAT_ATTRIBUTES,
  attributeReactions,
  buffDefinitions,
  characterCombatProfiles,
  combatAffinitySummary,
  enemyCombatProfiles,
  existingWeaponCombatProfiles,
  stageCombatProfiles,
  statusDefinitions,
} from '../../src/game/data/combatAffinitySource.ts';
import {
  attributeEffectivenessRules,
  EFFECTIVENESS_MULTIPLIERS,
  multiAttributeRules,
} from '../../src/game/data/combatAttributeEffectivenessSource.ts';
import {
  currentCharacterStarBeastCombatEntries,
  characterStarBeastCombatSummary,
  yuiProtagonistCombatRules,
} from '../../src/game/data/characterStarBeastCombatSource.ts';
import { enemyAttributeIdentities, enemyAttributeIdentitySummary } from '../../src/game/data/enemyAttributeIdentitySource.ts';
import { enemyStatusTraitProfiles, enemyStatusTraitSummary } from '../../src/game/data/enemyStatusTraitSource.ts';
import { baseWeaponCandidates, weaponExpansionSummary } from '../../src/game/data/weaponExpansionSource.ts';
import {
  weaponAwakeningCandidates,
  weaponFusionCandidates,
  weaponSynthesisCandidates,
  weaponTransformationSummary,
} from '../../src/game/data/weaponTransformationSource.ts';
import { combatItemEffectCandidates, combatItemEffectSummary } from '../../src/game/data/combatItemEffectSource.ts';
import {
  combatAttributeVfxProfiles,
  combatVfxSummary,
  reactionVfxProfiles,
  statusUiVfxRules,
} from '../../src/game/data/combatVfxLanguageSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function uniqueCount(values: readonly string[]): number { return new Set(values).size; }

const nonNeutralAttributes = COMBAT_ATTRIBUTES.filter((attribute) => attribute !== 'NEUTRAL');

assert(nonNeutralAttributes.length === 14, `expected 14 non-neutral attributes, got ${nonNeutralAttributes.length}`);
assert(attributeEffectivenessRules.length === 14, 'every non-neutral attribute must have an effectiveness rule');
assert(uniqueCount(attributeEffectivenessRules.map((rule) => rule.attack)) === 14, 'attribute effectiveness attack rules must be unique');
assert(EFFECTIVENESS_MULTIPLIERS.STRONGLY_RESISTED > 0, 'hard damage immunity is forbidden');
assert(multiAttributeRules.allowedAttributeCounts.join(',') === '1,2,3', 'only 1/2/3 attribute identities are allowed');
assert(multiAttributeRules.fourOrMoreAttributesForbidden, 'four-plus attribute identity must stay forbidden');
assert(!multiAttributeRules.hardImmunityAllowed, 'hard immunity must remain disabled');

assert(Object.keys(statusDefinitions).length >= 16, 'status/debuff vocabulary regressed');
assert(Object.keys(buffDefinitions).length >= 10, 'buff vocabulary regressed');
assert(attributeReactions.length >= 12, 'attribute reaction vocabulary regressed');

assert(characterCombatProfiles.length === 36, `expected 36 Current+Future combat profiles, got ${characterCombatProfiles.length}`);
assert(currentCharacterStarBeastCombatEntries.length === 21, `expected Current21 star-beast combat entries, got ${currentCharacterStarBeastCombatEntries.length}`);
assert(currentCharacterStarBeastCombatEntries.every((entry) => entry.starBeast.length > 0 && entry.starBeastReason.length > 0 && entry.characterReason.length > 0), 'every Current21 entry needs star-beast and character rationale');
assert(characterStarBeastCombatSummary.singleAttributeCharacters.length >= 3, 'single-attribute characters must remain present');
assert(characterStarBeastCombatSummary.dualAttributeCharacters.length >= 10, 'dual-attribute characters should remain the standard form');
assert(characterStarBeastCombatSummary.tripleAttributeBaseCharacters.length === 0, 'base Current21 should not casually become triple-attribute characters');
assert(characterStarBeastCombatSummary.yuiIsExplicitHeroAnchor, 'Yui hero anchor flag missing');
assert(yuiProtagonistCombatRules.primaryMasteryMultiplier > 1.12, 'Yui must remain explicitly stronger than the standard primary mastery baseline');
assert(yuiProtagonistCombatRules.secondaryMasteryMultiplier > 1.06, 'Yui secondary mastery must remain stronger than the standard secondary baseline');
assert(yuiProtagonistCombatRules.pickupMasteryMultiplier > 1, 'Yui must retain cross-build protagonist flexibility');

assert(enemyCombatProfiles.length === 48, `expected 48 enemy combat profiles, got ${enemyCombatProfiles.length}`);
assert(enemyAttributeIdentities.length === 48, `expected 48 enemy attribute identities, got ${enemyAttributeIdentities.length}`);
assert(enemyStatusTraitProfiles.length === 48, `expected 48 enemy status profiles, got ${enemyStatusTraitProfiles.length}`);
assert(enemyAttributeIdentitySummary.allEnemiesTyped, 'all enemies must have 1-3 defensive attributes');
assert(enemyAttributeIdentitySummary.singleTypeCount > 0, 'enemy roster needs single-attribute examples');
assert(enemyAttributeIdentitySummary.dualTypeCount > 0, 'enemy roster needs dual-attribute examples');
assert(enemyAttributeIdentitySummary.tripleTypeCount > 0, 'enemy roster needs at least one justified triple-attribute example');
assert(enemyAttributeIdentitySummary.fourPlusTypeCount === 0, 'enemy four-plus attributes are forbidden');
assert(enemyStatusTraitSummary.enemiesWithStatusPressure === 48, 'every enemy needs a status-pressure identity');
assert(enemyStatusTraitSummary.hardImmunityCount === 0, 'hard status immunity is forbidden');

assert(stageCombatProfiles.length === 20, `expected 20 stage combat profiles, got ${stageCombatProfiles.length}`);
assert(stageCombatProfiles.every((stage) => stage.favored.length > 0 && stage.buildQuestion.length > 0), 'every stage needs favored attributes and a build question');

assert(existingWeaponCombatProfiles.length >= 15, 'existing runtime weapon combat profiles regressed');
assert(weaponExpansionSummary.currentBaseWeaponCount === 8, `expected 8 current base weapons before candidate promotion, got ${weaponExpansionSummary.currentBaseWeaponCount}`);
assert(baseWeaponCandidates.length === 20, `expected 20 base weapon candidates, got ${baseWeaponCandidates.length}`);
assert(weaponExpansionSummary.targetBaseWeaponCount === 28, `expected 28-base-family candidate target, got ${weaponExpansionSummary.targetBaseWeaponCount}`);
assert(baseWeaponCandidates.every((weapon) => weapon.runtimeStatus === 'CONTENT_SOURCE_ONLY'), 'base weapon candidates must not auto-promote to runtime');
assert(uniqueCount(baseWeaponCandidates.map((weapon) => weapon.archetype)) === baseWeaponCandidates.length, 'candidate base attack archetypes must remain distinct');

assert(weaponFusionCandidates.length === 18, `expected 18 fusion candidates, got ${weaponFusionCandidates.length}`);
assert(weaponSynthesisCandidates.length === 12, `expected 12 synthesis candidates, got ${weaponSynthesisCandidates.length}`);
assert(weaponAwakeningCandidates.length === 8, `expected 8 awakening candidates, got ${weaponAwakeningCandidates.length}`);
assert(weaponTransformationSummary.totalCandidateTransformations === 38, 'expected 38 transformation candidates');
assert(!weaponTransformationSummary.autoPromoteToRuntime, 'transformations must require later runtime promotion');

assert(combatItemEffectCandidates.length === 18, `expected 18 combat item effect candidates, got ${combatItemEffectCandidates.length}`);
assert(!combatItemEffectSummary.autoPromoteToRuntime, 'combat item effects must require later runtime promotion');

assert(combatAttributeVfxProfiles.length === 14, 'every non-neutral attribute needs a VFX language');
assert(reactionVfxProfiles.length === attributeReactions.length, 'every reaction needs a VFX rule');
assert(Object.keys(statusUiVfxRules).length === Object.keys(statusDefinitions).length, 'every status needs readable UI/VFX feedback');
assert(combatVfxSummary.recolorOnlyForbidden, 'recolor-only attribute VFX must remain forbidden');
assert(combatVfxSummary.photosensitiveSafetyRequired, 'photosensitive safety must remain required');

assert(combatAffinitySummary.favoriteCharacterViabilityProtected, 'favorite-character viability protection missing');

const masterDoc = readFileSync(new URL('../../docs/yoruno-shirube-content-master-source-v1.md', import.meta.url), 'utf8');
for (const required of [
  '1作目', '2作目', '3作目への伏線', 'Attribute master', 'Enemy master', 'Status / Debuff master',
  'Buff master', 'Attribute Reaction master', 'Fusion / Synthesis / Awakening', 'Stage combat identity',
]) {
  assert(masterDoc.includes(required), `content master is missing required section/token: ${required}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  attributes: nonNeutralAttributes.length,
  statuses: Object.keys(statusDefinitions).length,
  buffs: Object.keys(buffDefinitions).length,
  reactions: attributeReactions.length,
  characters: characterCombatProfiles.length,
  currentStarBeastCharacters: currentCharacterStarBeastCombatEntries.length,
  enemies: enemyAttributeIdentities.length,
  enemyTypes: {
    single: enemyAttributeIdentitySummary.singleTypeCount,
    dual: enemyAttributeIdentitySummary.dualTypeCount,
    triple: enemyAttributeIdentitySummary.tripleTypeCount,
  },
  stages: stageCombatProfiles.length,
  baseWeapons: { current: weaponExpansionSummary.currentBaseWeaponCount, candidates: baseWeaponCandidates.length, target: weaponExpansionSummary.targetBaseWeaponCount },
  transformations: weaponTransformationSummary.totalCandidateTransformations,
  items: combatItemEffectCandidates.length,
  vfxAttributes: combatAttributeVfxProfiles.length,
  yuiHeroAnchor: true,
}, null, 2));
