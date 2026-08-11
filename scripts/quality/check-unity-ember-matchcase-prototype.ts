import { readFileSync } from 'node:fs';

import { baseWeaponSelectionEntries } from '../../src/game/data/baseWeaponSelectionSource.ts';
import { selectedBaseWeaponGameplayProfileById } from '../../src/game/data/baseWeaponSelectionGameplaySource.ts';
import { weapons } from '../../src/game/data/weapons.ts';
import {
  currentUnityWeaponRuntimeCapabilities,
  title1BaseWeaponRuntimeAdmissionEntries,
  title1BaseWeaponRuntimeAdmissionSummary,
} from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const weaponId = 'ember_matchcase';
const selection = baseWeaponSelectionEntries.find((entry) => entry.weaponId === weaponId);
const gameplay = selectedBaseWeaponGameplayProfileById.get(weaponId);
const admission = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === weaponId);

assert(selection?.selectedForTitle1 === true, 'ember_matchcase must remain Selected16');
assert(selection?.decision === 'TITLE1_SELECTED', 'ember_matchcase selection decision drift');
assert(selection.attributes.includes('FIRE'), 'ember_matchcase must remain FIRE');
assert(selection.appliesStatuses.includes('BURN'), 'ember_matchcase must remain BURN-applying content');
assert(gameplay?.archetype === 'SCATTER_PROJECTILE', 'ember_matchcase gameplay archetype must remain SCATTER_PROJECTILE');
assert(gameplay?.requiredRuntimeHook.includes('scatter projectile'), 'ember_matchcase runtime hook must preserve scatter identity');
assert(gameplay?.statuses.includes('BURN'), 'gameplay profile must preserve BURN');

assert(!weapons.some((weapon) => weapon.id === weaponId), 'prototype admission must not silently add ember_matchcase to Web live weapons.ts');
assert(currentUnityWeaponRuntimeCapabilities.MULTI_TARGET_PROJECTILE_SELECTION === 'IMPLEMENTED', 'Ember requires proven multi-target selection');
assert(currentUnityWeaponRuntimeCapabilities.STATUS_APPLICATION === 'IMPLEMENTED', 'Ember caller must prove shared Status application');
assert(admission?.mayEnterUnityRuntimeRegistry === true, 'Ember should pass Unity primitive admission');
assert(admission?.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW', 'Ember should be admitted for implementation review only');
assert(admission?.runtimeStatus === 'NOT_IMPLEMENTED', 'Ember must not claim live runtime implementation');
assert(admission?.missingUnityCapabilities.length === 0, 'Ember should have no missing shared primitive after vertical slice');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount === 1, 'exactly one Selected16 weapon should be admitted');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds.join(',') === weaponId, 'only ember_matchcase may be admitted');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount === 15, 'remaining Selected15 must stay blocked');

const emberSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/EmberMatchcasePrototypeRuntime.cs', import.meta.url), 'utf8');
const battleSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs', import.meta.url), 'utf8');
const coordinatorSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', import.meta.url), 'utf8');
const statusSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusRuntimeState.cs', import.meta.url), 'utf8');
const requestSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusApplicationRequest.cs', import.meta.url), 'utf8');

for (const token of [
  'public const string WeaponId = "ember_matchcase";',
  'public const string ContentStatusId = "BURN";',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  'PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE',
  'EnemyStatusRuntimeKind.Burn',
  'EnemyStatusApplicationPolicy burnPolicy',
  'battle.FireGameplayProjectilesAtNearestTargets(',
  'EmberMatchcasePrototypeTelemetry',
  'telemetry?.RecordStatusResult',
  'telemetry?.RecordInvocation(maxTargets, fired)',
]) {
  assert(emberSource.includes(token), `Ember prototype source missing token: ${token}`);
}

assert(emberSource.includes('=> CreateBurnRequest(burnPolicy, null);'), 'observer-free CreateBurnRequest overload must remain source-compatible');
assert(emberSource.includes('=> Fire(battle, damage, pierce, maxTargets, burnPolicy, null);'), 'observer-free Fire overload must remain source-compatible');
assert(requestSource.includes(': this(kind, policy, null)'), 'typed request two-argument constructor must remain observer-free');
assert(requestSource.includes('resultObserver?.Invoke(result);'), 'typed request must support optional result telemetry');

assert(!emberSource.includes('new EnemyStatusApplicationPolicy('), 'Ember prototype must not hide numerical Status defaults');
assert(!emberSource.includes('durationSeconds:'), 'Ember prototype must not hard-code BURN duration');
assert(!emberSource.includes('internalCooldownSeconds:'), 'Ember prototype must not hard-code BURN internal cooldown');
assert(!emberSource.includes('maxTargets ='), 'Ember prototype must not hard-code scatter target count');
assert(!emberSource.includes('damage ='), 'Ember prototype must not hard-code projectile damage');
assert(!emberSource.includes('static EmberMatchcasePrototypeTelemetry'), 'telemetry lifetime must stay caller-owned, not static/global');

assert(battleSource.includes('public int FireGameplayProjectilesAtNearestTargets('), 'real multi-target executor missing');
assert(battleSource.includes('EnemyStatusApplicationRequest? statusApplicationRequest = null'), 'real typed Status transport missing');
assert(battleSource.includes('if (!defeated) projectile.ApplyStatusOnHit(hitTarget);'), 'real hit path must apply Status to surviving enemy');
assert(statusSource.includes('case "BURN": kind = EnemyStatusRuntimeKind.Burn; return true;'), 'Unity Status16 authority must bind BURN');
assert(coordinatorSource.includes('battle.FireGameplayProjectile(effect.damage * damageMultiplier, effect.pierce)'), 'live Stage1 loop must remain legacy current-weapon path');
assert(!coordinatorSource.includes('EmberMatchcasePrototypeRuntime'), 'prototype admission must not become live Stage1 weapon automatically');
assert(!coordinatorSource.includes('ember_matchcase'), 'prototype weapon ID must stay outside live Stage1 coordinator');

const otherAdmissions = title1BaseWeaponRuntimeAdmissionEntries.filter((entry) => entry.weaponId !== weaponId);
assert(otherAdmissions.length === 15, 'remaining Selected15 count drift');
assert(otherAdmissions.every((entry) => !entry.mayEnterUnityRuntimeRegistry && entry.missingUnityCapabilities.length >= 1), 'remaining Selected15 must retain archetype-specific blockers');

const doc = readFileSync(new URL('../../docs/title1-base-weapon-runtime-admission-v1.md', import.meta.url), 'utf8');
for (const token of ['admitted=1', 'blocked=15', 'ember_matchcase', 'PROTOTYPE_TUNING_NOT_CANON', 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW']) {
  assert(doc.includes(token), `runtime admission doc missing Ember vertical-slice token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  weaponId,
  content: { attribute: 'FIRE', status: 'BURN', archetype: 'SCATTER_PROJECTILE' },
  unityAdmission: {
    admitted: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount,
    blocked: title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount,
    admittedIds: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds,
  },
  telemetry: { callerOwned: true, optionalResultObserver: true },
  tuningAuthority: 'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  webLiveCatalog: false,
  liveStage1Loop: false,
}, null, 2));
