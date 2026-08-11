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
assert(selectedBaseWeaponRuntimeAdmissionSummary.runtimeHookImplementedCount === 0, 'Selected16 Web hooks must remain unimplemented before real runtime work');
assert(selectedBaseWeaponRuntimeAdmissionSummary.readyForAdmissionReviewCount === 0, 'Selected16 Web admission must remain fail-closed');

assert(title1BaseWeaponRuntimeAdmissionEntries.length === 16, `Unity evidence overlay must cover Selected16, got ${title1BaseWeaponRuntimeAdmissionEntries.length}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.selectedContentWeaponCount === 16, 'Unity admission summary must bind to upstream Selected16 matrix');
assert(title1BaseWeaponRuntimeAdmissionSummary.webLiveCatalogCount === 0, 'Unity overlay must preserve upstream Web live-catalog state');
assert(title1BaseWeaponRuntimeAdmissionSummary.webRuntimeHookImplementedCount === 0, 'Unity overlay must preserve upstream Web hook state');
assert(title1BaseWeaponRuntimeAdmissionSummary.webReadyForAdmissionReviewCount === 0, 'Unity overlay must preserve upstream Web admission state');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount === 0, `no Selected16 weapon may enter Unity runtime yet, got admitted=${title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount === 16, 'all Selected16 must remain Unity-blocked until their required primitives exist');

assert(CURRENT_RUNTIME_WEAPON_EFFECT_TYPES.length === 5, `Web runtime effect authority must remain explicit; got ${CURRENT_RUNTIME_WEAPON_EFFECT_TYPES.length}`);
assert(CURRENT_RUNTIME_WEAPON_EFFECT_TYPES.join(',') === 'projectile,radial_random_projectile,bouncing_projectile,ground_area,orbit', `unexpected Web runtime effect surface: ${CURRENT_RUNTIME_WEAPON_EFFECT_TYPES.join(',')}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.currentWebRuntimeEffectTypeCount === 5, 'Unity overlay must derive Web effect count from existing authority');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentWebRuntimeEffectTypes === CURRENT_RUNTIME_WEAPON_EFFECT_TYPES, 'Unity overlay must reuse, not copy, the Web runtime capability authority');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentUnityWeaponExecutorTypeCount === 2, 'Unity U47 importer/executor surface should remain Projectile/GroundArea only');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentUnityWeaponExecutorTypes.join(',') === 'Projectile,GroundArea', 'unexpected Unity executor surface');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount === 3, 'Unity baseline should expose exactly three primitive capabilities in this evidence model');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount >= 15, 'advanced Title1 weapon runtime still needs multiple Unity primitive executors');
assert(!title1BaseWeaponRuntimeAdmissionSummary.selected16WebAdmissionAuthorityDuplicated, 'Unity overlay must not become a second Selected16 Web admission authority');
assert(!title1BaseWeaponRuntimeAdmissionSummary.webRuntimeSupportEqualsUnityRuntimeSupport, 'Web effect support must never be treated as Unity implementation evidence');
assert(!title1BaseWeaponRuntimeAdmissionSummary.fakeProjectileFallbackAllowed, 'unsupported archetypes must never be faked as generic projectile');
assert(!title1BaseWeaponRuntimeAdmissionSummary.contentSelectionMayBeDowngradedToFitRuntime, 'Content selection may not be weakened just to fit old runtime');
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
  assert(entry.webAdmissionState === upstream.admissionState, `${entry.weaponId} Web admission state must be inherited, not recomputed`);
  assert(entry.webBlockers.length === upstream.blockers.length && entry.webBlockers.every((blocker) => upstream.blockers.includes(blocker as never)), `${entry.weaponId} Web blockers must be inherited from upstream matrix`);
  assert(entry.requiredUnityCapabilities.length >= 1, `${entry.weaponId} needs explicit Unity capability requirements`);
  assert(entry.missingUnityCapabilities.length >= 1, `${entry.weaponId} should remain blocked while Unity U47 supports only Projectile/GroundArea executors`);
  assert(entry.unityDecision === 'BLOCKED_MISSING_UNITY_PRIMITIVES', `${entry.weaponId} must fail closed before Unity implementation`);
  assert(!entry.mayEnterUnityRuntimeRegistry, `${entry.weaponId} must not enter live Unity registry before required primitives exist`);
  assert(entry.contentSelectionPreserved, `${entry.weaponId} Content Master selection must remain preserved`);
  assert(entry.runtimeStatus === 'NOT_IMPLEMENTED', `${entry.weaponId} must not claim Unity runtime implementation`);
}
assert(seenIds.size === 16, 'Unity admission IDs must cover Selected16 exactly once');

for (const [capability, expected] of Object.entries({
  NEAREST_TARGET_PROJECTILE: 'IMPLEMENTED',
  MULTI_PROJECTILE_LOOP: 'IMPLEMENTED',
  CIRCULAR_GROUND_AREA: 'IMPLEMENTED',
  STATUS_APPLICATION: 'MISSING',
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

assert(definitionSource.includes('public enum WeaponEffectType { Projectile, GroundArea }'), 'Unity admission evidence must be revisited when WeaponEffectType expands beyond Projectile/GroundArea');
assert(importerSource.includes('source.levels[0].effect.type == "projectile" ? WeaponEffectType.Projectile : WeaponEffectType.GroundArea'), 'U47 importer executor mapping changed; update Unity capability evidence');
assert(importerSource.includes('is not ("projectile" or "ground_area")'), 'U47 importer should still fail closed on unsupported Unity effect types');
assert(coordinatorSource.includes('definition.EffectType == WeaponEffectType.Projectile'), 'U47 coordinator projectile executor evidence missing');
assert(coordinatorSource.includes('CountAreas(owned.Id)'), 'U47 coordinator circular GroundArea executor evidence missing');
assert(battleSource.includes('public bool FireGameplayProjectile(float damage, int pierce)'), 'nearest-target projectile API evidence missing');
assert(battleSource.includes('var target = FindNearestEnemy();'), 'current Unity projectile executor must still use nearest-target selection');
assert(!coordinatorSource.includes('WeaponEffectType.Cone'), 'Cone executor unexpectedly exists; Unity admission model needs update');
assert(!coordinatorSource.includes('WeaponEffectType.Tether'), 'Tether executor unexpectedly exists; Unity admission model needs update');

const archetypes = new Set(title1BaseWeaponRuntimeAdmissionEntries.map((entry) => entry.archetype));
assert(archetypes.size === 16, `Selected16 should remain 16 distinct attack archetypes, got ${archetypes.size}`);

const statusBlock = title1BaseWeaponRuntimeAdmissionSummary.missingCapabilityFrequency.find((entry) => entry.capability === 'STATUS_APPLICATION');
assert(statusBlock && statusBlock.blockedWeaponCount === 16, `all Selected16 currently require shared STATUS_APPLICATION, got ${statusBlock?.blockedWeaponCount ?? 0}`);

const doc = readFileSync(new URL('../../docs/title1-base-weapon-runtime-admission-v1.md', import.meta.url), 'utf8');
for (const token of [
  'Selected16',
  'Web runtime = 5',
  'Unity runtime = 2',
  'Projectile / GroundArea',
  'admitted=0',
  'blocked=16',
  'STATUS_APPLICATION',
  'fake projectile',
  'Wave A',
  'Wave B',
  'Wave C',
  'CONTENT_MASTER',
  'runtime',
]) {
  assert(doc.includes(token), `Base Weapon runtime admission doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  selected16: title1BaseWeaponRuntimeAdmissionSummary.selectedContentWeaponCount,
  webAdmission: {
    liveCatalog: title1BaseWeaponRuntimeAdmissionSummary.webLiveCatalogCount,
    hooksImplemented: title1BaseWeaponRuntimeAdmissionSummary.webRuntimeHookImplementedCount,
    readyForReview: title1BaseWeaponRuntimeAdmissionSummary.webReadyForAdmissionReviewCount,
    effectTypes: title1BaseWeaponRuntimeAdmissionSummary.currentWebRuntimeEffectTypes,
  },
  unityAdmission: {
    admitted: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount,
    blocked: title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount,
    executorTypes: title1BaseWeaponRuntimeAdmissionSummary.currentUnityWeaponExecutorTypes,
    implementedPrimitives: title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount,
    missingPrimitives: title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount,
  },
  highestLeverageMissing: title1BaseWeaponRuntimeAdmissionSummary.missingCapabilityFrequency.slice(0, 6),
  fakeProjectileFallbackAllowed: false,
}, null, 2));
