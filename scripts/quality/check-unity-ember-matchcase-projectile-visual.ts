import { readFileSync } from 'node:fs';

import { weapons } from '../../src/game/data/weapons.ts';
import { title1BaseWeaponRuntimeAdmissionSummary } from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const visualSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/EmberMatchcaseProjectileVisualRuntime.cs', import.meta.url), 'utf8');
const resetSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/EmberMatchcaseProjectileVisualResetter.cs', import.meta.url), 'utf8');
const battleSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs', import.meta.url), 'utf8');
const emberSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/EmberMatchcasePrototypeRuntime.cs', import.meta.url), 'utf8');
const coordinatorSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', import.meta.url), 'utf8');
const evidenceSource = readFileSync(new URL('../unity/u47-simulator-evidence-sources.ts', import.meta.url), 'utf8');

for (const token of [
  'public const string VisualAuthority = "PROTOTYPE_VISUAL_NOT_FINAL";',
  'public const float PrototypeScaleMultiplier = 0.78f;',
  'public static readonly Color PrototypeTint = new(1f, 0.58f, 0.24f, 1f);',
  'public sealed class EmberMatchcaseProjectileVisualContext',
  'internal List<U2ProjectileActor> ProjectileScratch { get; } = new(16);',
  'internal HashSet<U2ProjectileActor> ActiveStatusBeforeFire { get; } = new();',
  'CaptureActiveStatusProjectiles(battle, visualContext);',
  'EmberMatchcasePrototypeRuntime.Fire(',
  'ApplyCueToNewStatusProjectiles(battle, visualContext);',
  'projectile.IsActive && projectile.HasStatusApplication',
  'context.ActiveStatusBeforeFire.Contains(projectile)',
  'battle.GetComponentsInChildren(true, scratch);',
  'projectile.GetComponent<SpriteRenderer>()',
  'projectile.GetComponent<EmberMatchcaseProjectileVisualResetter>()',
  'projectile.gameObject.AddComponent<EmberMatchcaseProjectileVisualResetter>()',
  'resetter.Apply(renderer, PrototypeTint, PrototypeScaleMultiplier);',
]) {
  assert(visualSource.includes(token), `Ember projectile visual source missing token: ${token}`);
}

const fireStart = visualSource.indexOf('public static int FireWithPrototypeVisual(');
const captureStart = visualSource.indexOf('private static void CaptureActiveStatusProjectiles', fireStart);
assert(fireStart >= 0 && captureStart > fireStart, 'cannot isolate Ember visual fire method');
const fireBlock = visualSource.slice(fireStart, captureStart);
for (const forbidden of ['new List<', 'new HashSet<', 'new GameObject(', 'Instantiate(', 'ParticleSystem', 'Camera.', 'Screen.', 'Shader.', 'Material(']) {
  assert(!fireBlock.includes(forbidden), `Ember visual fire hot path must avoid ${forbidden}`);
}

const applyStart = visualSource.indexOf('private static int ApplyCueToNewStatusProjectiles(');
const fillStart = visualSource.indexOf('private static void FillProjectileScratch', applyStart);
assert(applyStart >= 0 && fillStart > applyStart, 'cannot isolate Ember visual apply method');
const applyBlock = visualSource.slice(applyStart, fillStart);
for (const forbidden of ['new List<', 'new HashSet<', 'new GameObject(', 'Instantiate(', 'ParticleSystem', 'Camera.', 'Screen.', 'Shader.', 'Material(']) {
  assert(!applyBlock.includes(forbidden), `Ember visual apply hot path must avoid ${forbidden}`);
}
assert(applyBlock.includes('if (resetter == null)'), 'visual reset component may only be added when missing');
assert(applyBlock.match(/AddComponent<EmberMatchcaseProjectileVisualResetter>/g)?.length === 1, 'visual reset component must have exactly one lazy AddComponent site');

for (const token of [
  'public sealed class EmberMatchcaseProjectileVisualResetter : MonoBehaviour',
  'baseScale = transform.localScale;',
  'spriteRenderer.color = tint;',
  'transform.localScale = baseScale * scaleMultiplier;',
  'spriteRenderer.color = Color.white;',
  'transform.localScale = baseScale;',
  'private void OnDisable()',
  'ResetVisual();',
]) {
  assert(resetSource.includes(token), `Ember projectile visual resetter missing token: ${token}`);
}
assert(!resetSource.includes('ParticleSystem'), 'visual resetter must not create or own ParticleSystem');
assert(!resetSource.includes('Camera'), 'visual resetter must not touch camera/screen effects');

assert(!battleSource.includes('EmberMatchcaseProjectileVisualRuntime'), 'U2BattleController must not gain Ember-specific visual branching');
assert(!battleSource.includes('PrototypeTint'), 'U2BattleController must not own Ember prototype visual tuning');
assert(evidenceSource.includes('PR169_PROJECTILE_RECOVERY_NORMALIZER'), 'historical U47 evidence contract must remain present');
assert(!evidenceSource.includes('EmberMatchcaseProjectileVisual'), 'historical U47 normalizer should not need Ember visual exceptions when U2 source is unchanged');

assert(emberSource.includes('CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON'), 'visual wrapper must sit on top of the existing balance-neutral Ember caller');
assert(coordinatorSource.includes('battle.FireGameplayProjectile(effect.damage * damageMultiplier, effect.pierce)'), 'live Stage1 loop must remain the existing current-weapon path');
assert(!coordinatorSource.includes('FireWithPrototypeVisual'), 'prototype visual wrapper must not silently enter live Stage1 loop');
assert(!coordinatorSource.includes('EmberMatchcaseProjectileVisual'), 'live Stage1 coordinator must not know Ember visual helper yet');

assert(!weapons.some((weapon) => weapon.id === 'ember_matchcase'), 'visual cue must not promote Ember into Web live catalog');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount >= 1, 'visual cue proof requires Ember implementation-review admission to remain');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds.includes('ember_matchcase'), 'visual cue must preserve Ember admission even when other Selected16 callers land');
assert(!title1BaseWeaponRuntimeAdmissionSummary.runtimeAutoPromotionAllowed, 'visual cue must not auto-promote runtime');

const doc = readFileSync(new URL('../../docs/unity-ember-matchcase-projectile-visual-v1.md', import.meta.url), 'utf8');
for (const token of [
  'PROTOTYPE_VISUAL_NOT_FINAL',
  'projectile-local',
  'OnDisable',
  'caller-owned',
  'no screen flash',
  'no ParticleSystem',
  '0.78',
  '1 / 16',
  'live Stage1',
]) {
  assert(doc.includes(token), `Ember projectile visual doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  visualAuthority: 'PROTOTYPE_VISUAL_NOT_FINAL',
  cue: { tint: [1, 0.58, 0.24, 1], scaleMultiplier: 0.78 },
  selector: 'new active Status projectiles from this synchronous Ember fire',
  allocation: { perFireList: false, perFireHashSet: false, lazyResetComponentOncePerProjectile: true },
  poolReset: 'OnDisable -> Color.white + baseScale',
  screenFlash: false,
  particleSystem: false,
  admission: {
    admitted: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount,
    admittedIds: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds,
    blocked: title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount,
  },
  liveStage1Changed: false,
}, null, 2));
