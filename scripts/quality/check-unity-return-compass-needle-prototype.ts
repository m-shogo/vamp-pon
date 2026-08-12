import { existsSync, readFileSync } from 'node:fs';

import { baseWeaponSelectionEntries, selectedTitle1BaseWeaponCandidates } from '../../src/game/data/baseWeaponSelectionSource.ts';
import {
  currentUnityWeaponRuntimeCapabilities,
  title1BaseWeaponRuntimeAdmissionEntries,
  unityPrototypeCallerImplementedWeaponIds,
} from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const callerPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/ReturnCompassNeedlePrototypeRuntime.cs';
const metaPath = `${callerPath}.meta`;
const waypointPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2ReturningWaypointMotionRuntime.cs';
const selectorPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyHomingPrioritySelectionRuntime.cs';
const statusPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusRuntimeState.cs';
const requestPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusApplicationRequest.cs';
const coordinatorPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs';
const contractPath = 'scripts/quality/unity-return-compass-needle/Program.cs';
const projectPath = 'scripts/quality/unity-return-compass-needle/UnityReturnCompassNeedle.Contract.csproj';
const docPath = 'docs/unity-return-compass-needle-prototype-v1.md';
for (const path of [callerPath,metaPath,waypointPath,selectorPath,statusPath,requestPath,coordinatorPath,contractPath,projectPath,docPath]) {
  assert(existsSync(path), `Return Compass Needle caller file missing: ${path}`);
}

const caller = readFileSync(callerPath, 'utf8');
const waypoint = readFileSync(waypointPath, 'utf8');
const selector = readFileSync(selectorPath, 'utf8');
const coordinator = readFileSync(coordinatorPath, 'utf8');
const contract = readFileSync(contractPath, 'utf8');
const project = readFileSync(projectPath, 'utf8');
const doc = readFileSync(docPath, 'utf8');

for (const token of [
  'public sealed class ReturnCompassNeedlePrototypeTelemetry',
  'public sealed class ReturnCompassNeedlePrototypeState',
  'public const string WeaponId = "return_compass_needle";',
  'public const string ContentStatusId = "MARKED";',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  'PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE',
  'OUTBOUND_LINE_THEN_MARKED_PRIORITY_RETURN_WAYPOINT_THEN_OWNER',
  'ONE_HIT_PER_TARGET_PER_LEG_OUTBOUND_AND_RETURN_SEPARATE',
  'U2EnemyHomingPrioritySelectionRuntime.TrySelect(',
  'candidate.Statuses.Has(EnemyStatusRuntimeKind.Marked)',
  'score += markedPriorityBonus;',
  'ReferenceEquals(candidate, outboundTarget)',
  'U2ReturningWaypointMotionState',
  'motion.SkipReturnWaypoint()',
  'ProcessStepSegments(',
  'target.TakeDamage(damage, damageFlashSeconds)',
  'if (!defeated) markedRequest.ApplyTo(target.Statuses);',
  'DistanceSquaredPointToSegment2D',
  '!IsFiniteNonNegative(minReturnRange)',
  '!IsFinitePositive(maxReturnRange)',
  'minReturnRange > maxReturnRange',
  '!Enum.IsDefined(typeof(U2EnemyPriorityDistanceTieBreak), tieBreak)',
]) {
  assert(caller.includes(token), `Return Compass Needle caller missing contract: ${token}`);
}

for (const forbidden of [
  'const float MarkedPriorityBonus', 'const float Damage', 'DefaultPriority', 'DefaultMarked', 'DefaultRange',
  'ParticleSystem', 'AudioSource', 'Camera.', 'Stage1GameplayRuntimeCoordinator', 'WeaponEffectType', 'LevelUp',
]) {
  assert(!caller.includes(forbidden), `Return Compass Needle caller must not own live/default behavior: ${forbidden}`);
}

assert(waypoint.includes('public sealed class U2ReturningWaypointMotionState'), 'caller requires real returning waypoint motion');
assert(!waypoint.includes('return_compass_needle') && !waypoint.includes('MARKED'), 'generic waypoint motion must stay content-neutral');
assert(selector.includes('public static class U2EnemyHomingPrioritySelectionRuntime'), 'caller requires real homing priority selector');
assert(!selector.includes('return_compass_needle') && !selector.includes('MARKED'), 'generic priority selector must stay content-neutral');

const selectedNeedle = selectedTitle1BaseWeaponCandidates.find((entry) => entry.weaponId === 'return_compass_needle');
assert(selectedNeedle, 'return_compass_needle must remain Selected16');
const selectionRow = baseWeaponSelectionEntries.find((entry) => entry.weaponId === 'return_compass_needle');
assert(selectionRow?.decision === 'TITLE1_SELECTED' && selectionRow.selectedForTitle1, 'Return Compass Needle selection authority drift');
const repairSpanner = baseWeaponSelectionEntries.find((entry) => entry.weaponId === 'repair_spanner');
assert(repairSpanner?.decision === 'HOLD_RETURN_FAMILY_OVERLAP' && !repairSpanner.selectedForTitle1, 'Return Compass caller work must preserve Repair Spanner Hold decision');

const admission = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'return_compass_needle');
assert(admission, 'Return Compass Needle admission row missing');
assert(currentUnityWeaponRuntimeCapabilities.RETURNING_PROJECTILE === 'IMPLEMENTED', 'verified Return Compass caller must back RETURNING_PROJECTILE capability');
assert(admission.implementedUnityCapabilities.join(',') === 'RETURNING_PROJECTILE,HOMING_PRIORITY_SELECTION,STATUS_APPLICATION', `Return Compass implemented capabilities drift: ${admission.implementedUnityCapabilities.join(',')}`);
assert(admission.missingUnityCapabilities.length === 0, `Return Compass must have no primitive blockers after admission: ${admission.missingUnityCapabilities.join(',')}`);
assert(unityPrototypeCallerImplementedWeaponIds.includes('return_compass_needle'), 'verified Return Compass caller must be registered');
assert(admission.prototypeCallerImplemented, 'Return Compass caller proof must be explicit');
assert(admission.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW', 'Return Compass must enter implementation-review admission');
assert(admission.mayEnterUnityRuntimeRegistry, 'Return Compass must pass implementation-review gate');
assert(admission.runtimeStatus === 'NOT_IMPLEMENTED', 'implementation-review admission must not claim live runtime');

for (const token of [
  'caller-supplied MARKED bonus should prefer marked return waypoint over higher unmarked base score',
  'outbound target must be excluded from return waypoint even with dominant base score',
  'single step should cross outbound target and marked waypoint without completing early',
  'post-waypoint return segment should use bent-path hit detection',
  'defeated outbound target must not receive MARKED after damage',
  'same enemy should take one outbound and one return hit through separate leg ledgers',
  'return MARKED cooldown may block Status but must not block second-leg damage',
  'no eligible alternate target must produce direct return rather than fabricated waypoint',
  'untargetable return waypoint should be skipped exactly once',
  'invalid return range must fail closed rather than silently falling back to direct return',
  'invalid tie-break must fail closed rather than silently falling back to direct return',
  'reset must clear return waypoint and both hit ledgers',
]) {
  assert(contract.includes(token), `Return Compass executable contract missing scenario: ${token}`);
}
for (const linkedSource of [
  'ReturnCompassNeedlePrototypeRuntime.cs', 'U2ReturningWaypointMotionRuntime.cs',
  'U2EnemyHomingPrioritySelectionRuntime.cs', 'EnemyStatusRuntimeState.cs', 'EnemyStatusApplicationRequest.cs',
]) {
  assert(project.includes(linkedSource), `Return Compass contract project must compile real source: ${linkedSource}`);
}

for (const token of [
  'TITLE1_SELECTED', 'HOLD_RETURN_FAMILY_OVERLAP', 'RETURNING_PROJECTILE = IMPLEMENTED',
  'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW', 'OUTBOUND_LINE_THEN_MARKED_PRIORITY_RETURN_WAYPOINT_THEN_OWNER',
  'ONE_HIT_PER_TARGET_PER_LEG_OUTBOUND_AND_RETURN_SEPARATE', 'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  'runtimeStatus = NOT_IMPLEMENTED', 'runtimeAutoPromotionAllowed = false',
]) {
  assert(doc.includes(token), `Return Compass doc missing token: ${token}`);
}

for (const token of ['ReturnCompassNeedlePrototypeState','return_compass_needle','U2ReturningWaypointMotionState']) {
  assert(!coordinator.includes(token), `Return Compass prototype leaked into live Stage1 coordinator: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  caller: 'ReturnCompassNeedlePrototypeState',
  selectionDecision: selectionRow.decision,
  repairSpannerDecision: repairSpanner.decision,
  returningCapability: currentUnityWeaponRuntimeCapabilities.RETURNING_PROJECTILE,
  admission: admission.unityDecision,
  callerRegistryPromoted: admission.prototypeCallerImplemented,
  liveRuntimeStatus: admission.runtimeStatus,
  liveStage1Changed: false,
  canonTuningChanged: false,
}, null, 2));
