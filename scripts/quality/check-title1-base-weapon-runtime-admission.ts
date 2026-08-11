import { readFileSync } from 'node:fs';

import { selectedTitle1BaseWeaponCandidates } from '../../src/game/data/baseWeaponSelectionSource.ts';
import {
  selectedBaseWeaponRuntimeAdmissionEntries,
  selectedBaseWeaponRuntimeAdmissionSummary,
} from '../../src/game/data/selectedBaseWeaponRuntimeAdmissionSource.ts';
import {
  currentUnityWeaponRuntimeCapabilities,
  title1BaseWeaponRuntimeAdmissionEntries,
  title1BaseWeaponRuntimeAdmissionSummary,
} from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';
import { CURRENT_RUNTIME_WEAPON_EFFECT_TYPES } from '../../src/game/domain/weaponRuntimeCapabilities.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(selectedTitle1BaseWeaponCandidates.length === 16, 'Title1 selected Base candidates must remain 16');
assert(selectedBaseWeaponRuntimeAdmissionEntries.length === 16, 'upstream Selected16 Web admission matrix must remain exact');
assert(selectedBaseWeaponRuntimeAdmissionSummary.candidateCount === 16, 'upstream Selected16 admission summary must remain exact');
assert(selectedBaseWeaponRuntimeAdmissionSummary.liveCatalogCount === 0, 'Selected16 must remain outside current Web live catalog before admission');
assert(selectedBaseWeaponRuntimeAdmissionSummary.runtimeHookImplementedCount === 0, 'Selected16 Web hooks remain separate from Unity prototype admission');
assert(selectedBaseWeaponRuntimeAdmissionSummary.readyForAdmissionReviewCount === 0, 'Web admission must remain fail-closed');

assert(title1BaseWeaponRuntimeAdmissionEntries.length === 16, `Unity evidence overlay must cover Selected16, got ${title1BaseWeaponRuntimeAdmissionEntries.length}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.selectedContentWeaponCount === 16, 'Unity admission summary must bind upstream Selected16');
assert(title1BaseWeaponRuntimeAdmissionSummary.webLiveCatalogCount === 0, 'Unity overlay must preserve Web live-catalog state');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount === 1, `exactly Ember Matchcase should be admitted for Unity implementation review, got ${title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount === 15, 'remaining Selected15 must stay Unity-blocked');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds.length === 1 && title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds[0] === 'ember_matchcase', `unexpected Unity admitted IDs: ${title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds.join(',')}`);

assert(CURRENT_RUNTIME_WEAPON_EFFECT_TYPES.length === 5, `Web runtime effect authority must remain explicit; got ${CURRENT_RUNTIME_WEAPON_EFFECT_TYPES.length}`);
assert(CURRENT_RUNTIME_WEAPON_EFFECT_TYPES.join(',') === 'projectile,radial_random_projectile,bouncing_projectile,ground_area,orbit', `unexpected Web runtime effect surface: ${CURRENT_RUNTIME_WEAPON_EFFECT_TYPES.join(',')}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.currentWebRuntimeEffectTypeCount === 5, 'Unity overlay must derive Web effect count from existing authority');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentWebRuntimeEffectTypes === CURRENT_RUNTIME_WEAPON_EFFECT_TYPES, 'Unity overlay must reuse Web runtime capability authority');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentUnityWeaponExecutorTypeCount === 2, 'Unity U47 importer/executor surface remains Projectile/GroundArea');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentUnityWeaponExecutorTypes.join(',') === 'Projectile,GroundArea', 'unexpected Unity executor surface');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount === 5, 'Unity evidence should expose five implemented primitives after real Status caller proof');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount === 16, `expected 16 missing advanced Unity primitives, got ${title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.statusApplicationBlockedWeaponCount === 0, 'STATUS_APPLICATION is now a proven shared primitive and must not remain a blocker');
assert(!title1BaseWeaponRuntimeAdmissionSummary.selected16WebAdmissionAuthorityDuplicated, 'Unity overlay must not become a second Web admission authority');
assert(!title1BaseWeaponRuntimeAdmissionSummary.webRuntimeSupportEqualsUnityRuntimeSupport, 'Web support must never be treated as Unity implementation evidence');
assert(!title1BaseWeaponRuntimeAdmissionSummary.fakeProjectileFallbackAllowed, 'unsupported archetypes must never be faked as generic projectile');
assert(!title1BaseWeaponRuntimeAdmissionSummary.contentSelectionMayBeDowngradedToFitRuntime, 'Content selection may not be weakened to fit old runtime');
assert(!title1BaseWeaponRuntimeAdmissionSummary.runtimeAutoPromotionAllowed, 'Unity overlay must never auto-promote runtime');

const upstreamById = new Map(selectedBaseWeaponRuntimeAdmissionEntries.map((entry) => [entry.weaponId, entry]));
const selectedIds = new Set(selectedTitle1BaseWeaponCandidates.map((entry) => entry.weaponId));
const seenIds = new Set<string>();
for (const entry of title1BaseWeaponRuntimeAdmissionEntries) {
  assert(selectedIds.has(entry.weaponId), `Unity admission references non-Selected16 weapon: ${entry.weaponId}`);
  assert(!seenIds.has(entry.weaponId), `duplicate Unity admission entry: ${entry.weaponId}`);
  seenIds.add(entry.weaponId);
  const upstream = upstreamById.get(entry.weaponId);
  assert(upstream, `${entry.weaponId} missing upstream Selected16 admission row`);
  assert(entry.webAdmissionState === upstream.admissionState, `${entry.weaponId} Web admission state must be inherited`);
  assert(entry.webBlockers.length === upstream.blockers.length && entry.webBlockers.every((blocker) => upstream.blockers.includes(blocker as never)), `${entry.weaponId} Web blockers must be inherited`);
  assert(entry.requiredUnityCapabilities.length >= 1, `${entry.weaponId} needs explicit Unity capability requirements`);
  assert(entry.contentSelectionPreserved, `${entry.weaponId} Content Master selection must remain preserved`);
  assert(entry.runtimeStatus === 'NOT_IMPLEMENTED', `${entry.weaponId} admission review is not a live runtime registry claim`);

  if (entry.weaponId === 'ember_matchcase') {
    assert(entry.archetype === 'SCATTER_PROJECTILE', 'Ember Matchcase archetype drift');
    assert(entry.requiredUnityCapabilities.join(',') === 'MULTI_TARGET_PROJECTILE_SELECTION,STATUS_APPLICATION', `unexpected Ember requirements: ${entry.requiredUnityCapabilities.join(',')}`);
    assert(entry.missingUnityCapabilities.length === 0, `Ember Matchcase should have no primitive blocker, got ${entry.missingUnityCapabilities.join(',')}`);
    assert(entry.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW', 'Ember Matchcase should be admitted for Unity implementation review');
    assert(entry.mayEnterUnityRuntimeRegistry, 'Ember Matchcase should pass primitive admission only');
  } else {
    assert(entry.missingUnityCapabilities.length >= 1, `${entry.weaponId} must retain at least one archetype-specific blocker`);
    assert(entry.unityDecision === 'BLOCKED_MISSING_UNITY_PRIMITIVES', `${entry.weaponId} must remain blocked`);
    assert(!entry.mayEnterUnityRuntimeRegistry, `${entry.weaponId} must not pass Unity primitive admission yet`);
  }
}
assert(seenIds.size === 16, 'Unity admission IDs must cover Selected16 exactly once');

for (const [capability, expected] of Object.entries({
  NEAREST_TARGET_PROJECTILE: 'IMPLEMENTED',
  MULTI_PROJECTILE_LOOP: 'IMPLEMENTED',
  CIRCULAR_GROUND_AREA: 'IMPLEMENTED',
  MULTI_TARGET_PROJECTILE_SELECTION: 'IMPLEMENTED',
  STATUS_APPLICATION: 'IMPLEMENTED',
  CONE_QUERY: 'MISSING',
  KNOCKBACK_VECTOR: 'MISSING',
  RETURNING_PROJECTILE: 'MISSING',
  REFLECT_WINDOW: 'MISSING',
  ORBIT_LINK: 'MISSING',
} as const)) {
  assert(currentUnityWeaponRuntimeCapabilities[capability as keyof typeof currentUnityWeaponRuntimeCapabilities] === expected, `Unity capability evidence drift: ${capability}`);
}

const definitionSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Definitions/U47GameplayDefinitions.cs', import.meta.url), 'utf8');
const coordinatorSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', import.meta.url), 'utf8');
const battleSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs', import.meta.url), 'utf8');
const importerSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Editor/U47Stage1GameplayDataImporter.cs', import.meta.url), 'utf8');
const emberSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/EmberMatchcasePrototypeRuntime.cs', import.meta.url), 'utf8');

assert(definitionSource.includes('public enum WeaponEffectType { Projectile, GroundArea }'), 'live Unity importer executor enum remains Projectile/GroundArea only');
assert(importerSource.includes('source.levels[0].effect.type == "projectile" ? WeaponEffectType.Projectile : WeaponEffectType.GroundArea'), 'U47 importer mapping changed; update evidence');
assert(importerSource.includes('is not ("projectile" or "ground_area")'), 'U47 importer should fail closed on unsupported effect types');
assert(coordinatorSource.includes('definition.EffectType == WeaponEffectType.Projectile'), 'U47 live coordinator projectile executor missing');
assert(battleSource.includes('public int FireGameplayProjectilesAtNearestTargets('), 'multi-target primitive missing');
assert(battleSource.includes('EnemyStatusApplicationRequest? statusApplicationRequest'), 'typed Status transport missing');
assert(!coordinatorSource.includes('EmberMatchcasePrototypeRuntime'), 'prototype admission must not silently enter the live Stage1 loop');

assert(emberSource.includes('public const string WeaponId = "ember_matchcase";'), 'Ember prototype must bind exact Selected16 ID');
assert(emberSource.includes('public const string ContentStatusId = "BURN";'), 'Ember prototype must bind exact content Status');
assert(emberSource.includes('CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON'), 'Ember tuning boundary missing');
assert(emberSource.includes('PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE'), 'Ember live boundary missing');
assert(emberSource.includes('EnemyStatusRuntimeKind.Burn'), 'Ember caller must construct typed BURN request');
assert(emberSource.includes('battle.FireGameplayProjectilesAtNearestTargets('), 'Ember caller must use deterministic multi-target primitive');
assert(!/durationSeconds\s*:\s*[0-9]/.test(emberSource), 'Ember prototype must not hard-code BURN duration');
assert(!/maxTargets\s*=\s*[0-9]/.test(emberSource), 'Ember prototype must not hard-code target count');

const archetypes = new Set(title1BaseWeaponRuntimeAdmissionEntries.map((entry) => entry.archetype));
assert(archetypes.size === 16, `Selected16 should remain 16 distinct attack archetypes, got ${archetypes.size}`);
assert(!title1BaseWeaponRuntimeAdmissionSummary.missingCapabilityFrequency.some((entry) => entry.capability === 'STATUS_APPLICATION'), 'STATUS_APPLICATION must disappear from missing capability frequency');

const doc = readFileSync(new URL('../../docs/title1-base-weapon-runtime-admission-v1.md', import.meta.url), 'utf8');
for (const token of [
  'Selected16',
  'Web runtime = 5',
  'Unity runtime = 2',
  'Projectile / GroundArea',
  'admitted=1',
  'blocked=15',
  'ember_matchcase',
  'STATUS_APPLICATION',
  'MULTI_TARGET_PROJECTILE_SELECTION',
  'PROTOTYPE_TUNING_NOT_CANON',
  'fake projectile',
  'CONTENT_MASTER',
  'runtime',
]) {
  assert(doc.includes(token), `Base Weapon runtime admission doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  selected16: title1BaseWeaponRuntimeAdmissionSummary.selectedContentWeaponCount,
  unityAdmission: {
    admitted: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount,
    admittedIds: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds,
    blocked: title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount,
    implementedPrimitives: title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount,
    missingPrimitives: title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount,
  },
  emberMatchcase: {
    status: 'BURN',
    tuning: 'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
    liveRegistry: false,
  },
  fakeProjectileFallbackAllowed: false,
}, null, 2));
