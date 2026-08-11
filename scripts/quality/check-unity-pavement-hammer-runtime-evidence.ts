import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const paths = {
  evidence: 'docs/design-targets/generated/unity-selected-base-weapons/pavement-hammer/runtime-evidence.json',
  harness: 'unity/VampPonUnity/Assets/_Project/Scripts/Editor/PavementHammerPrototypeRuntimeEvidence.cs',
  harnessMeta: 'unity/VampPonUnity/Assets/_Project/Scripts/Editor/PavementHammerPrototypeRuntimeEvidence.cs.meta',
  runner: 'scripts/unity/run-pavement-hammer-runtime-evidence.sh',
  caller: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/PavementHammerPrototypeRuntime.cs',
  slamWave: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemySlamWaveQueryRuntime.cs',
  knockback: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyKnockbackRuntime.cs',
  breakStagger: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyBreakStaggerRuntime.cs',
  statusState: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusRuntimeState.cs',
  statusRequest: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusApplicationRequest.cs',
  coordinator: 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs',
  doc: 'docs/unity-pavement-hammer-runtime-evidence-v1.md',
} as const;

for (const path of Object.values(paths)) {
  assert(existsSync(path), `Pavement Hammer runtime evidence file missing: ${path}`);
}

const evidence = JSON.parse(readFileSync(paths.evidence, 'utf8')) as any;
const harness = readFileSync(paths.harness, 'utf8');
const runner = readFileSync(paths.runner, 'utf8');
const coordinator = readFileSync(paths.coordinator, 'utf8');
const doc = readFileSync(paths.doc, 'utf8');

assert(evidence.schemaVersion === 1, 'Pavement Hammer runtime evidence schema mismatch');
assert(evidence.weaponId === 'pavement_hammer', 'Pavement Hammer runtime evidence weapon ID drift');
assert(evidence.runtimeBoundary === 'PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE', 'runtime evidence boundary drift');
assert(evidence.tuningAuthority === 'TEST_ONLY_PROTOTYPE_TUNING_NOT_CANON', 'runtime evidence tuning authority drift');
assert(evidence.applicationOrder === 'QUERY_DAMAGE_SURVIVING_STATUS_KNOCKBACK_BREAK_STAGGER', 'runtime evidence application order drift');
assert(evidence.telemetry && typeof evidence.telemetry === 'object', 'runtime evidence telemetry object missing');
assert(evidence.sourceSha256 && typeof evidence.sourceSha256 === 'object', 'runtime evidence source hash object missing');

for (const token of [
  'public static class PavementHammerPrototypeRuntimeEvidence',
  'VAMPPON_PAVEMENT_HAMMER_EVIDENCE_SOURCE_COMMIT',
  'U2EnemyActor.Create(',
  'enemy.Activate(position, hp);',
  'PavementHammerPrototypeRuntime.Fire(',
  'EnemyStatusRuntimeKind.Exposed',
  'U2EnemyBreakStaggerRuntime.TryGetSnapshot(',
  'InvokeStaggerLateUpdate(first);',
  'U2EnemyBreakStaggerDriver',
  'GetMethod("LateUpdate", BindingFlags.Instance | BindingFlags.NonPublic)',
  'telemetry.StatusBlockedByInternalCooldownCount == 2',
  'telemetry.StaggerTriggeredCount == 2',
  'evidence.result = "PASSED";',
  'evidence.result = "FAILED";',
  'TEST_ONLY_PROTOTYPE_TUNING_NOT_CANON',
]) {
  assert(harness.includes(token), `Pavement Hammer Unity evidence harness missing contract: ${token}`);
}

for (const forbidden of [
  'Stage1GameplayRuntimeCoordinator',
  'WeaponEffectType',
  'approvedAsFinal',
  'runtimeApproved',
  'productionApproved',
  'PlayerPrefs',
  'AssetDatabase.CreateAsset',
]) {
  assert(!harness.includes(forbidden), `Pavement Hammer evidence harness must not own/promote ${forbidden}`);
}

for (const token of [
  'UNITY_BIN="${UNITY_BIN:-/Applications/Unity/Hub/Editor/6000.5.1f1/Unity.app/Contents/MacOS/Unity}"',
  'git rev-parse HEAD',
  'git diff --quiet HEAD -- "${SOURCE_INPUTS[@]}"',
  'VAMPPON_PAVEMENT_HAMMER_EVIDENCE_SOURCE_COMMIT="$SOURCE_COMMIT"',
  '-executeMethod VampPon.UnitySpike.Editor.PavementHammerPrototypeRuntimeEvidence.RunBatchmode',
  'evidence.sourceSha256.evidenceHarness = sha256(harnessPath);',
  'check-unity-pavement-hammer-runtime-evidence.ts',
  'TEST_ONLY prototype evidence only',
]) {
  assert(runner.includes(token), `Pavement Hammer evidence runner missing contract: ${token}`);
}
for (const forbidden of [
  'git reset --hard',
  'git clean -fd',
  'git push',
  'runtimeStatus = "IMPLEMENTED"',
  'approvedAsFinal',
]) {
  assert(!runner.includes(forbidden), `Pavement Hammer evidence runner contains unsafe behavior: ${forbidden}`);
}

const shell = spawnSync('bash', ['-n', paths.runner], { encoding: 'utf8' });
assert(!shell.error, `Pavement Hammer evidence runner bash -n failed to start: ${shell.error?.message ?? 'unknown'}`);
assert(shell.status === 0, `Pavement Hammer evidence runner shell syntax failed:\n${shell.stderr}`);

for (const liveToken of [
  'PavementHammerPrototypeRuntime',
  'pavement_hammer',
  'U2EnemyBreakStaggerRuntime',
  'U2EnemySlamWaveQueryRuntime',
]) {
  assert(!coordinator.includes(liveToken), `Pavement Hammer runtime evidence leaked into live Stage1 coordinator: ${liveToken}`);
}

const sha256 = (path: string) => crypto.createHash('sha256').update(readFileSync(path)).digest('hex');
const zeroTelemetry = {
  invocationCount: 0,
  selectedTargetCount: 0,
  damageAttemptCount: 0,
  defeatedTargetCount: 0,
  statusApplyAttemptCount: 0,
  statusAppliedCount: 0,
  statusBlockedByInternalCooldownCount: 0,
  knockbackAttemptCount: 0,
  knockbackAppliedCount: 0,
  breakStaggerAttemptCount: 0,
  breakStaggerAppliedCount: 0,
  staggerTriggeredCount: 0,
};

if (!evidence.executed) {
  assert(evidence.result === 'NOT_RUN', 'unexecuted Pavement Hammer evidence must remain NOT_RUN');
  assert(evidence.sourceCommit === '' && evidence.generatedAtUtc === '', 'unexecuted evidence must not claim provenance/time');
  for (const field of [
    'firstInvocationSelected',
    'secondInvocationSelected',
    'firstInvocationBreakAccumulated',
    'secondInvocationResidualBreak',
    'secondInvocationStaggerSeconds',
  ]) assert(evidence[field] === 0, `unexecuted evidence must keep ${field}=0`);
  for (const field of [
    'defeatedTargetPostDamageEffectsSkipped',
    'survivorsExposedAfterFirstInvocation',
    'statusCooldownIndependentOnSecondInvocation',
    'knockbackBeforeStaggerAnchor',
  ]) assert(evidence[field] === false, `unexecuted evidence must keep ${field}=false`);
  assert(JSON.stringify(evidence.telemetry) === JSON.stringify(zeroTelemetry), 'unexecuted telemetry must remain zeroed');
  for (const key of ['caller', 'slamWave', 'knockback', 'breakStagger', 'statusState', 'statusRequest', 'evidenceHarness']) {
    assert(evidence.sourceSha256[key] === '', `unexecuted evidence source hash must remain empty: ${key}`);
  }
  assert(evidence.error === '', 'unexecuted evidence must not retain an error');
  console.log('Pavement Hammer Unity runtime evidence: PASS (honest NOT_RUN boundary)');
} else {
  assert(evidence.result === 'PASSED', `executed Pavement Hammer evidence must be PASSED, got ${evidence.result}`);
  assert(/^[0-9a-f]{40}$/.test(evidence.sourceCommit), 'executed Pavement Hammer evidence source commit invalid');
  assert(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(evidence.generatedAtUtc) && Number.isFinite(Date.parse(evidence.generatedAtUtc)), 'executed Pavement Hammer evidence timestamp invalid');
  const ancestor = spawnSync('git', ['merge-base', '--is-ancestor', evidence.sourceCommit, 'HEAD'], { encoding: 'utf8' });
  assert(ancestor.status === 0, `evidence source commit must be an ancestor of HEAD: ${evidence.sourceCommit}`);

  const expectedHashes: Record<string, string> = {
    caller: sha256(paths.caller),
    slamWave: sha256(paths.slamWave),
    knockback: sha256(paths.knockback),
    breakStagger: sha256(paths.breakStagger),
    statusState: sha256(paths.statusState),
    statusRequest: sha256(paths.statusRequest),
    evidenceHarness: sha256(paths.harness),
  };
  for (const [key, expected] of Object.entries(expectedHashes)) {
    assert(evidence.sourceSha256[key] === expected, `Pavement Hammer evidence source SHA drift: ${key}`);
  }

  assert(evidence.firstInvocationSelected === 3, 'first Unity evidence invocation selection mismatch');
  assert(evidence.secondInvocationSelected === 2, 'second Unity evidence invocation selection mismatch');
  assert(evidence.defeatedTargetPostDamageEffectsSkipped === true, 'damage-death short circuit not evidenced');
  assert(evidence.survivorsExposedAfterFirstInvocation === true, 'surviving EXPOSED application not evidenced');
  assert(evidence.statusCooldownIndependentOnSecondInvocation === true, 'Status cooldown independence not evidenced');
  assert(Math.abs(evidence.firstInvocationBreakAccumulated - 60) < .0001, 'first break accumulation evidence mismatch');
  assert(Math.abs(evidence.secondInvocationResidualBreak - 20) < .0001, 'residual break evidence mismatch');
  assert(Math.abs(evidence.secondInvocationStaggerSeconds - .6) < .0001, 'stagger duration evidence mismatch');
  assert(evidence.knockbackBeforeStaggerAnchor === true, 'post-knockback stagger anchor not evidenced');

  const expectedTelemetry = {
    invocationCount: 2,
    selectedTargetCount: 5,
    damageAttemptCount: 5,
    defeatedTargetCount: 1,
    statusApplyAttemptCount: 4,
    statusAppliedCount: 2,
    statusBlockedByInternalCooldownCount: 2,
    knockbackAttemptCount: 4,
    knockbackAppliedCount: 4,
    breakStaggerAttemptCount: 4,
    breakStaggerAppliedCount: 4,
    staggerTriggeredCount: 2,
  };
  assert(JSON.stringify(evidence.telemetry) === JSON.stringify(expectedTelemetry), 'Pavement Hammer Unity evidence telemetry mismatch');
  assert(evidence.error === '', 'PASSED evidence must have empty error');
  console.log(`Pavement Hammer Unity runtime evidence: PASS (${evidence.sourceCommit.slice(0, 12)})`);
}

for (const token of [
  'NOT_RUN',
  'Unity Editor batchmode',
  'source SHA',
  'TEST_ONLY_PROTOTYPE_TUNING_NOT_CANON',
  'PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE',
  'runtimeStatus',
  'not live Stage1',
]) {
  assert(doc.includes(token), `Pavement Hammer runtime evidence doc missing token: ${token}`);
}
