import { readFileSync } from 'node:fs';

import { statusDefinitions } from '../../src/game/data/combatAffinitySource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const statusIds = Object.keys(statusDefinitions);
assert(statusIds.length === 16, `Content Status authority must remain 16, got ${statusIds.length}`);

const runtimeSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusRuntimeState.cs', import.meta.url), 'utf8');
const domainSource = readFileSync(new URL('../../src/game/domain/statusRuntime.ts', import.meta.url), 'utf8');
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
assert(!runtimeSource.includes('UnityEngine'), 'Status application foundation should remain pure C# and executable outside Unity for contract tests');

// The TypeScript domain kernel is the cross-runtime semantic authority for application policy shape.
for (const token of [
  "export type StatusStackMode = 'REPLACE' | 'REFRESH' | 'ADD_CAPPED';",
  "export type StatusMagnitudeMode = 'REPLACE' | 'MAX' | 'ADD_CAPPED';",
  'durationSec: number;',
  'stacksPerApplication: number;',
  'maxStacks: number;',
  'magnitude: number;',
  'maxMagnitude: number;',
  'internalCooldownSec: number;',
  'respectInternalCooldown: boolean;',
]) {
  assert(domainSource.includes(token), `Domain Status policy authority missing token: ${token}`);
}

for (const token of [
  'public enum EnemyStatusStackMode',
  'Replace,\n        Refresh,\n        AddCapped,',
  'public enum EnemyStatusMagnitudeMode',
  'public readonly struct EnemyStatusApplicationPolicy',
  'public float DurationSeconds { get; }',
  'public int StacksPerApplication { get; }',
  'public int MaxStacks { get; }',
  'public float Magnitude { get; }',
  'public float MaxMagnitude { get; }',
  'public float InternalCooldownSeconds { get; }',
  'public bool RespectInternalCooldown { get; }',
]) {
  assert(runtimeSource.includes(token), `Unity Status policy parity missing token: ${token}`);
}

// Duration semantics: successful application restarts exactly from caller policy on both runtimes.
assert(domainSource.includes('remainingSec: policy.durationSec,'), 'Domain kernel must keep exact caller duration semantics');
assert(runtimeSource.includes('current.RemainingSeconds = policy.DurationSeconds;'), 'Unity kernel must restart duration from caller policy');
assert(!runtimeSource.includes('Math.Max(status.RemainingSeconds, durationSeconds)'), 'Unity must not keep the old max-duration reapply semantic');

// Stack semantics: replace / refresh / capped-add.
assert(domainSource.includes("if (!current || policy.stackMode === 'REPLACE')"), 'Domain REPLACE stack semantic missing');
assert(domainSource.includes("if (policy.stackMode === 'REFRESH')"), 'Domain REFRESH stack semantic missing');
assert(domainSource.includes('Math.min(policy.maxStacks, current.stacks + policy.stacksPerApplication)'), 'Domain ADD_CAPPED stack semantic missing');
assert(runtimeSource.includes('policy.StackMode == EnemyStatusStackMode.Replace'), 'Unity REPLACE stack semantic missing');
assert(runtimeSource.includes('policy.StackMode == EnemyStatusStackMode.Refresh'), 'Unity REFRESH stack semantic missing');
assert(runtimeSource.includes('Math.Min(policy.MaxStacks, current.Stacks + policy.StacksPerApplication)'), 'Unity ADD_CAPPED stack semantic missing');

// Magnitude semantics: replace / max / capped-add.
assert(domainSource.includes("if (!current || policy.magnitudeMode === 'REPLACE')"), 'Domain REPLACE magnitude semantic missing');
assert(domainSource.includes("if (policy.magnitudeMode === 'MAX')"), 'Domain MAX magnitude semantic missing');
assert(domainSource.includes('Math.min(policy.maxMagnitude, current.magnitude + policy.magnitude)'), 'Domain ADD_CAPPED magnitude semantic missing');
assert(runtimeSource.includes('policy.MagnitudeMode == EnemyStatusMagnitudeMode.Replace'), 'Unity REPLACE magnitude semantic missing');
assert(runtimeSource.includes('policy.MagnitudeMode == EnemyStatusMagnitudeMode.Max'), 'Unity MAX magnitude semantic missing');
assert(runtimeSource.includes('Math.Min(policy.MaxMagnitude, current.Magnitude + policy.Magnitude)'), 'Unity ADD_CAPPED magnitude semantic missing');
assert(runtimeSource.includes('public float GetMagnitude(EnemyStatusRuntimeKind kind)'), 'Unity runtime needs magnitude read surface for later effect layers');
assert(runtimeSource.includes('public float Magnitude { get; }'), 'Unity snapshots must expose magnitude');

// Internal cooldown is independent from active Status lifetime and may block reapply when requested.
assert(domainSource.includes('policy.respectInternalCooldown && cooldown > 0'), 'Domain internal cooldown guard missing');
assert(runtimeSource.includes('policy.RespectInternalCooldown && GetInternalCooldownSeconds(kind) > 0f'), 'Unity internal cooldown guard missing');
assert(domainSource.includes('[kind]: policy.internalCooldownSec'), 'Domain successful application must write caller cooldown');
assert(runtimeSource.includes('internalCooldowns[kind] = policy.InternalCooldownSeconds;'), 'Unity successful application must write caller cooldown');
assert(runtimeSource.includes('BlockedByInternalCooldown'), 'Unity application result must expose internal cooldown block');

// Active clear preserves cooldown in both kernels. Entity Clear is a separate pool-reset operation in Unity.
assert(domainSource.includes('return { active, cooldowns: { ...state.cooldowns } };'), 'Domain clear must preserve cooldown ledger');
assert(runtimeSource.includes('public bool ClearStatus(EnemyStatusRuntimeKind kind)'), 'Unity needs active-only clear matching domain semantics');
assert(runtimeSource.includes('return activeStatuses.Remove(kind);'), 'Unity ClearStatus must only remove active state');
assert(runtimeSource.includes('internalCooldowns.Clear();'), 'Unity entity Clear must explicitly reset cooldowns for pooled-enemy lifecycle');

// Invalid numeric policies must fail closed without invented tuning fallbacks.
assert(domainSource.includes('assertRuntimeStatusApplicationPolicy(policy);'), 'Domain policy validation must remain mandatory');
for (const token of [
  'DurationSeconds must be finite and positive.',
  'StacksPerApplication must not exceed MaxStacks.',
  'Magnitude must not exceed MaxMagnitude.',
  'must be finite and non-negative.',
]) {
  assert(runtimeSource.includes(token), `Unity fail-closed policy validation missing token: ${token}`);
}
assert(runtimeSource.includes('ValidateFiniteNonNegative(deltaSeconds, nameof(deltaSeconds));'), 'Unity Tick must reject invalid negative/non-finite deltas');

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

for (const token of [
  'UNKNOWN_STATUS',
  'ADD_CAPPED must enforce maxStacks',
  'REFRESH must preserve current stacks',
  'REPLACE must reset stacks',
  'magnitude cap mismatch',
  'internal cooldown should persist after active expiry',
  'ClearStatus must preserve internal cooldown ledger',
  'Zero duration must throw',
  'negative Tick delta must throw',
  'Boss FREEZE',
  'Boss ROOTED',
  'Boss SLEEP',
  'Snapshot ordering',
  'Entity Clear must remove all active Status entries',
]) {
  assert(contractSource.includes(token), `Executable C# Status contract missing parity token: ${token}`);
}

const doc = readFileSync(new URL('../../docs/unity-enemy-status-runtime-foundation-v1.md', import.meta.url), 'utf8');
for (const token of [
  'Status16',
  'REPLACE / REFRESH / ADD_CAPPED',
  'magnitude',
  'internal cooldown',
  'cross-runtime',
  'RuntimeStatusApplicationPolicy',
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
  stackModesAligned: ['REPLACE', 'REFRESH', 'ADD_CAPPED'],
  magnitudeModesAligned: ['REPLACE', 'MAX', 'ADD_CAPPED'],
  internalCooldownSemanticsAligned: true,
  activeClearPreservesCooldown: true,
  entityClearResetsPooledState: true,
  bossHardControlConvertedNotImmune: true,
  runtimeNumericalTuningFrozen: false,
  executableContractRequired: true,
}, null, 2));
