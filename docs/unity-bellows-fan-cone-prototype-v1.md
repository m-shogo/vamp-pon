# Unity Bellows Fan Cone Push Prototype v1

## Purpose

Selected16 `bellows_fan`（送り風の扇）の `CONE_PUSH` を、既存Projectileへ偽装せずにUnityで実証する。

このsliceでは:

- reusable `CONE_QUERY`
- existing reusable `KNOCKBACK_VECTOR`
- existing reusable `STATUS_APPLICATION`
- Selected16-specific `bellows_fan` caller

を接続する。

production live化はしない。

## Content identity

- Weapon ID: `bellows_fan`
- Name: 送り風の扇
- Archetype: `CONE_PUSH`
- Attribute: WIND
- Status: `DISORIENTED`

Content selectionは変更しない。

## Reusable cone primitive

`U2EnemyConeQueryRuntime.SelectTargets(...)`

caller supplied:

- candidates
- result scratch
- origin
- forward
- range
- half-angle degrees
- max target count

primitive behavior:

- targetable-only
- 2D distance/angle query
- nearest-first
- equal-distanceはcandidate input orderを保持するstable tie-break
- target capを超えた遠い対象は落とす
- null candidates / invalid range / invalid angle / non-positive cap / zero forwardはfail closed
- caller-owned result scratchを毎回clearして再利用する

primitiveが持たないもの:

- `bellows_fan` identity
- WIND
- DISORIENTED
- damage
- knockback distance
- VFX
- default range/angle/cap

Authority:

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## Selected16 caller

`BellowsFanPrototypeRuntime`

Runtime chain:

1. `U2EnemyConeQueryRuntime.SelectTargets(...)`
2. `EnemyStatusRuntimeKind.Disoriented`
3. `EnemyStatusApplicationRequest.ApplyTo(target.Statuses)`
4. outward vector from origin to target
5. `U2EnemyKnockbackRuntime.TryApply(...)`

caller supplied tuning:

- range
- half-angle
- maxTargets
- knockbackDistance
- full `EnemyStatusApplicationPolicy`

No canonical values are frozen in the runtime helper.

Runtime boundary:

`PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE`

## Executable contract

`scripts/quality/unity-bellows-fan-cone/BellowsFanCone.Contract.csproj` compiles the real runtime sources outside Unity against minimal Unity/U2 stubs.

Behavior proof:

- non-unit facing `(2, 0)` is normalized by the cone query
- 45° cone excludes an out-of-angle target
- behind target is excluded
- out-of-range target is excluded
- untargetable target is excluded
- nearest-first selection wins even when candidate input order is different
- maxTargets cap keeps the nearest target
- selected targets receive DISORIENTED
- selected targets receive normalized outward knockback
- z is preserved
- zero forward fails closed with no Status and no movement

The contract uses explicit test-only numbers. Those numbers are evidence fixtures, **not Canon balance**.

## Admission hardening

Before this slice, shared primitives alone determined whether a weapon could enter implementation review. That can create accidental promotion when a new generic primitive completes another weapon's requirements.

The admission model now also requires:

`prototypeCallerImplemented === true`

A primitive-complete weapon without a Selected16 caller proof becomes:

`BLOCKED_MISSING_UNITY_CALLER_PROOF`

rather than auto-admitted.

Current caller proofs:

- `ember_matchcase`
- `bellows_fan`

Current implementation-review Admission after this slice:

- admitted: 2 / 16
- `ember_matchcase`
- `bellows_fan`
- blocked: 14 / 16

All admitted entries remain:

`runtimeStatus = NOT_IMPLEMENTED`

## Shared-effect safety

`CONE_QUERY` also helps `black_folding_fan`, but that weapon still requires `VEIL_TRACKING_FRICTION` and has no caller proof, so it remains blocked.

`KNOCKBACK_VECTOR` also helps `pavement_hammer`, but that weapon still requires `SLAM_WAVE_QUERY` and has no caller proof, so it remains blocked.

This is the intended effect of separating:

1. shared primitive evidence
2. Selected16 caller proof
3. production/live admission

## Live boundary

This slice does **not**:

- modify `Stage1GameplayRuntimeCoordinator` to call Bellows
- add `bellows_fan` to Web `weapons.ts`
- add Bellows to LevelUp pool
- expand U47 `WeaponEffectType`
- add save migration
- freeze balance values
- add final VFX

No fake Projectile fallback is introduced.

## Next

Bellows production-readiness evidence should next add:

- invocation count
- selected target count
- DISORIENTED apply result counts
- knockback success count
- cone-edge / dense-wave runtime capture
- mobile-safe airflow/push cue

The next shared primitive candidate is `SLAM_WAVE_QUERY`, because `pavement_hammer` can already reuse `KNOCKBACK_VECTOR`. It must still receive its own Selected16 caller proof before implementation-review Admission.
