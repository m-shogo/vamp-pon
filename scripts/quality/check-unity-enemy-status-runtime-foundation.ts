import { readFileSync } from 'node:fs';

import { statusDefinitions } from '../../src/game/data/combatAffinitySource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const statusIds = Object.keys(statusDefinitions);
assert(statusIds.length === 16, `Content Status authority must remain 16, got ${statusIds.length}`);

const runtimeSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusRuntimeState.cs', import.meta.url), 'utf8');
const contractSource = readFileSync(new URL('./unity-enemy-status-runtime-foundation/Program.cs', import.meta.url), 'utf8');

for (const statusId of statusIds) {
  const parseToken = `case "${statusId}":`;
  const returnToken = `=> "${statusId}"`;
  const contractToken = `"${statusId}"`;
  assert(runtimeSource.includes(parseToken), `Unity Status parser missing content ID: ${statusId}`);
  assert(runtimeSource.includes(returnToken), `Unity Status serializer missing content ID: ${statusId}`);
  assert(contractSource.includes(contractToken), `Executable Status contract missing content ID: ${statusId}`);
}

const parserCaseCount = [...runtimeSource.matchAll(/case "[A-Z_]+": kind = EnemyStatusRuntimeKind\./g)].length;
const serializerCaseCount = [...runtimeSource.matchAll(/EnemyStatusRuntimeKind\.[A-Za-z]+ => "[A-Z_]+"/g)].length;
assert(parserCaseCount === 16, `Unity parser must have exactly 16 Status cases, got ${parserCaseCount}`);
assert(serializerCaseCount === 16, `Unity serializer must have exactly 16 Status cases, got ${serializerCaseCount}`);
assert(runtimeSource.includes('default:\n                    kind = default;\n                    return false;'), 'unknown content Status IDs must fail closed');
assert(runtimeSource.includes('RejectedInvalidArguments'), 'Status Apply must reject invalid lifecycle arguments');
assert(runtimeSource.includes('BlockedByReapplyCooldown'), 'Status Apply must expose reapply cooldown blocker');
assert(runtimeSource.includes('Math.Min(maxStacks, status.Stacks + stackDelta)'), 'Status stacks must remain bounded by caller-supplied maxStacks');
assert(runtimeSource.includes('Math.Max(status.RemainingSeconds, durationSeconds)'), 'Status reapply must never shorten remaining duration');
assert(runtimeSource.includes('public void Tick(float deltaSeconds)'), 'Status runtime needs deterministic Tick lifecycle');
assert(runtimeSource.includes('public bool Remove(EnemyStatusRuntimeKind kind, float reapplyCooldownSeconds = 0f)'), 'Status runtime needs explicit removal + reapply cooldown hook');
assert(runtimeSource.includes('public EnemyStatusRuntimeSnapshot[] Snapshot()'), 'Status runtime needs deterministic inspection snapshot');

for (const [status, disposition] of [
  ['Freeze', 'ConvertToSlow'],
  ['Rooted', 'ConvertToSlow'],
  ['Sleep', 'ConvertToActionDelay'],
  ['Chill', 'ReduceMagnitude'],
  ['Drowsy', 'ReduceMagnitude'],
] as const) {
  assert(runtimeSource.includes(`EnemyStatusRuntimeKind.${status} => BossStatusDisposition.${disposition}`), `Boss hard-control disposition drift: ${status}`);
}

assert(runtimeSource.includes('_ => BossStatusDisposition.Preserve'), 'Boss statuses must default to preserved rather than hard immunity');
assert(!runtimeSource.includes('BossStatusDisposition.Immune'), 'Boss Status runtime must not introduce blanket hard immunity');
assert(!runtimeSource.includes('UnityEngine'), 'Status lifecycle foundation should remain pure C# and executable outside Unity for contract tests');
assert(runtimeSource.includes('It does not freeze damage, slow percentages, Boss durations, VFX, or weapon-specific rules.'), 'Status foundation must explicitly avoid premature numerical tuning freeze');

for (const token of [
  'UNKNOWN_STATUS',
  'bounded stacks',
  'Reapply cooldown',
  'Boss FREEZE',
  'Boss ROOTED',
  'Boss SLEEP',
  'Snapshot ordering',
  'Clear must remove all active Status entries',
]) {
  assert(contractSource.includes(token), `Executable C# Status contract missing coverage token: ${token}`);
}

const doc = readFileSync(new URL('../../docs/unity-enemy-status-runtime-foundation-v1.md', import.meta.url), 'utf8');
for (const token of [
  'Status16',
  'bounded stack',
  'duration refresh',
  'reapply cooldown',
  'Boss',
  '数値',
  'Wave A',
  'not wired',
  'STATUS_APPLICATION',
]) {
  assert(doc.includes(token), `Unity Status runtime foundation doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  contentStatusCount: statusIds.length,
  parserCases: parserCaseCount,
  serializerCases: serializerCaseCount,
  bossHardControlConvertedNotImmune: true,
  runtimeNumericalTuningFrozen: false,
  executableContractRequired: true,
}, null, 2));
