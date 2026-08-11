import { existsSync, readFileSync } from 'node:fs';

import {
  currentUnityWeaponRuntimeCapabilities,
  title1BaseWeaponRuntimeAdmissionEntries,
  title1BaseWeaponRuntimeAdmissionSummary,
} from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const runtimePath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyBreakStaggerRuntime.cs';
const metaPath = `${runtimePath}.meta`;
const knockbackPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyKnockbackRuntime.cs';
const coordinatorPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs';
const contractPath = 'scripts/quality/unity-break-stagger/Program.cs';
const projectPath = 'scripts/quality/unity-break-stagger/UnityBreakStagger.Contract.csproj';
const docPath = 'docs/unity-break-stagger-primitive-v1.md';

for (const path of [runtimePath, metaPath, knockbackPath, coordinatorPath, contractPath, projectPath, docPath]) {
  assert(existsSync(path), `break/stagger contract file missing: ${path}`);
}

const source = readFileSync(runtimePath, 'utf8');
const knockback = readFileSync(knockbackPath, 'utf8');
const coordinator = readFileSync(coordinatorPath, 'utf8');
const contract = readFileSync(contractPath, 'utf8');
const project = readFileSync(projectPath, 'utf8');
const doc = readFileSync(docPath, 'utf8');

for (const token of [
  'public readonly struct U2EnemyBreakStaggerApplyResult',
  'public readonly struct U2EnemyBreakStaggerSnapshot',
  'public sealed class U2EnemyBreakStaggerState',
  'internal sealed class U2EnemyBreakStaggerDriver : MonoBehaviour',
  'public static class U2EnemyBreakStaggerRuntime',
  'public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";',
  'public float AccumulatedBreak { get; private set; }',
  'public float StaggerSecondsRemaining { get; private set; }',
  'public bool IsStaggered => StaggerSecondsRemaining > 0f;',
  'float breakAmount',
  'float breakThreshold',
  'float staggerDurationSeconds',
  'var staggerTriggered = nextBreak >= breakThreshold;',
  'var completedThresholds = Math.Floor(nextBreak / breakThreshold);',
  'StaggerSecondsRemaining = Math.Max(StaggerSecondsRemaining, staggerDurationSeconds);',
  'public bool Tick(float deltaSeconds)',
  'public void Clear()',
  'private void LateUpdate()',
  'transform.position = frozenPosition;',
  'state.Tick(Time.deltaTime);',
  'private void OnDisable()',
  'U2EnemyKnockbackRuntime.EnemyDisplaced += NotifyExternalDisplacement;',
  'enemy.gameObject.AddComponent<U2EnemyBreakStaggerDriver>()',
  'public static bool TryGetSnapshot(',
]) {
  assert(source.includes(token), `break/stagger primitive missing token: ${token}`);
}

for (const forbidden of [
  'pavement_hammer',
  '石畳の小槌',
  'EXPOSED',
  'EARTH',
  'ParticleSystem',
  'Camera.',
  'AudioSource',
  'defaultBreak',
  'defaultThreshold',
  'defaultStagger',
  'BossStatusDisposition',
  'LevelUp',
  'WeaponEffectType',
]) {
  assert(!source.includes(forbidden), `generic break/stagger primitive must not own ${forbidden}`);
}

assert(knockback.includes('public static event Action<U2EnemyActor> EnemyDisplaced;'), 'knockback must expose a generic post-displacement signal');
assert(knockback.includes('EnemyDisplaced?.Invoke(enemy);'), 'knockback must emit post-displacement signal only after a valid displacement');
assert(!knockback.includes('U2EnemyBreakStaggerRuntime'), 'knockback must not depend directly on break/stagger implementation');

assert(currentUnityWeaponRuntimeCapabilities.BREAK_STAGGER_APPLICATION === 'IMPLEMENTED', 'BREAK_STAGGER_APPLICATION must remain backed by reusable runtime source');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount === 9, `expected 9 implemented Unity primitives, got ${title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount === 13, `expected 13 missing Unity primitives, got ${title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount}`);
assert(!title1BaseWeaponRuntimeAdmissionSummary.missingCapabilityFrequency.some((entry) => entry.capability === 'BREAK_STAGGER_APPLICATION'), 'implemented break/stagger must disappear from missing frequency');
assert(title1BaseWeaponRuntimeAdmissionSummary.primitiveCompleteButMissingCallerProofCount === 1, 'exactly one Selected16 weapon should be primitive-complete but caller-proof blocked');

const hammer = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'pavement_hammer');
assert(hammer, 'pavement_hammer admission row missing');
assert(hammer.missingUnityCapabilities.length === 0, `pavement_hammer shared primitive gap remains: ${hammer.missingUnityCapabilities.join(',')}`);
assert(hammer.implementedUnityCapabilities.includes('BREAK_STAGGER_APPLICATION'), 'pavement_hammer must inherit shared break/stagger evidence');
assert(!hammer.prototypeCallerImplemented, 'shared primitive must not fabricate Pavement Hammer caller proof');
assert(hammer.unityDecision === 'BLOCKED_MISSING_UNITY_CALLER_PROOF', 'Pavement Hammer should now stop at caller-proof gate');
assert(!hammer.mayEnterUnityRuntimeRegistry, 'Pavement Hammer must remain outside implementation-review admission until caller exists');
assert(!title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds.includes('pavement_hammer'), 'shared break/stagger must not auto-admit Pavement Hammer');

for (const forbiddenLiveToken of [
  'U2EnemyBreakStaggerRuntime',
  'U2EnemyBreakStaggerDriver',
  'pavement_hammer',
]) {
  assert(!coordinator.includes(forbiddenLiveToken), `shared/prototype break-stagger leaked into live Stage1 coordinator: ${forbiddenLiveToken}`);
}

for (const token of [
  'state.TryApply(40f, 100f, .5f',
  'state.TryApply(70f, 100f, .5f',
  'Near(second.AccumulatedBreak, 10f)',
  'state.Tick(.2f)',
  'state.TryApply(250f, 100f, .8f',
  'U2EnemyKnockbackRuntime.TryApply(enemy',
  'InvokeNonPublic(driver, "LateUpdate")',
  'untargetable enemy must reject new break/stagger',
]) {
  assert(contract.includes(token), `break/stagger executable contract missing scenario: ${token}`);
}
assert(project.includes('U2EnemyBreakStaggerRuntime.cs'), 'contract project must compile the real break/stagger runtime source');
assert(project.includes('U2EnemyKnockbackRuntime.cs'), 'contract project must compile the real knockback integration source');

for (const token of [
  'BREAK_STAGGER_APPLICATION',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  'HPとは独立',
  'residual',
  'knockback',
  'pool',
  'BLOCKED_MISSING_UNITY_CALLER_PROOF',
  'Live Stage1',
  'NOT_CANON',
]) {
  assert(doc.includes(token), `break/stagger primitive doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  primitive: 'BREAK_STAGGER_APPLICATION',
  tuningAuthority: 'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  implementedPrimitives: title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount,
  missingPrimitives: title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount,
  pavementHammer: {
    decision: hammer.unityDecision,
    callerProof: hammer.prototypeCallerImplemented,
    mayEnterUnityRuntimeRegistry: hammer.mayEnterUnityRuntimeRegistry,
  },
  liveStage1Changed: false,
}, null, 2));
