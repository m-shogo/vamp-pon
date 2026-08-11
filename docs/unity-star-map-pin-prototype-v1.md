# Unity Star Map Pin Prototype v1

Status: `PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE`

## Purpose

Selected16 `star_map_pin` のUnity caller proofを、nearest-target固定や新しいlive executorへ偽装せず実装する。

原本 / Canonのpriority・range・damage・MARKED policyはこのruntime sliceでは固定しない。

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## Source

`unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/StarMapPinPrototypeRuntime.cs`

Caller composes:

- `U2EnemyHomingPrioritySelectionRuntime`
- existing `U2BattleController.FireGameplayProjectileAtTarget`
- `EnemyStatusApplicationRequest`
- `EnemyStatusRuntimeKind.Marked`

新しいprojectile executorは追加しない。

## Application order

`PRIORITY_SELECT_TARGETED_PROJECTILE_MARKED_ON_HIT`

1. caller-owned candidate/priority score listからshared selectorでtargetを選ぶ
2. caller supplied damage / pierceをexisting explicit-target projectileへ渡す
3. typed MARKED requestをprojectileへtransportする
4. MARKEDはprojectile hit時にStatus runtimeへ適用される
5. Status result observerでcaller-owned telemetryを更新する

発射拒否時はMARKED hit resultを捏造しない。

## Caller supplied inputs

- candidates
- priority scores
- selection origin
- min range
- max range
- `StableInputOrder / PreferNearer / PreferFarther`
- projectile damage
- projectile pierce
- MARKED duration / stacks / magnitude / cooldown policy

Generic selectorにもStar Map Pin callerにもCanon default値を置かない。

## Telemetry

`StarMapPinPrototypeTelemetry`

records:

- invocation count
- candidate count total
- selection success / failure
- last selected original candidate index
- last selected priority score
- last selected 2D distance squared
- projectile fire attempts / fired / rejected
- MARKED apply attempts / applied / internal-cooldown blocked

Status telemetryは`EnemyStatusApplicationRequest` observerからhit時に入るため、projectile spawnとStatus outcomeを混同しない。

## Executable contract

- `scripts/quality/check-unity-star-map-pin-prototype.ts`
- `scripts/quality/unity-star-map-pin/UnityStarMapPin.Contract.csproj`
- `scripts/quality/unity-star-map-pin/Program.cs`

Real caller + real homing priority selector + real Status runtime/requestを.NET 8でcompileする。

TEST_ONLY cases:

1. highest priority beats farther equal-score target
2. caller damage / pierce transport
3. typed MARKED request transport
4. simulated projectile hit applies MARKED
5. same target immediate second hit is Status-cooldown blocked while projectile still fires
6. equal priority + `PreferFarther` selects far target
7. explicit projectile rejection propagates false
8. rejected projectile fabricates no MARKED hit
9. no eligible selection produces no projectile attempt
10. selection/projectile/Status telemetry exactness
11. telemetry reset
12. null battle fails loudly

TEST_ONLY values are `NOT_CANON`.

## Admission

Shared requirements:

- `HOMING_PRIORITY_SELECTION`: IMPLEMENTED
- `STATUS_APPLICATION`: IMPLEMENTED

Caller proof:

- `StarMapPinPrototypeRuntime`: IMPLEMENTED

Current decision:

`ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

Selected16 implementation-review summary becomes:

- admitted: 4
- blocked: 12
- admitted callers: `ember_matchcase`, `bellows_fan`, `pavement_hammer`, `star_map_pin`

This is not a live-runtime claim.

`runtimeStatus = NOT_IMPLEMENTED`

## Original / Canon boundary

This runtime work does not modify:

- weapon name / identity authority
- Attribute / Status selection
- character affinity
- transformation graph
- story meaning
- Canon priority formula
- Canon target range
- Canon damage / pierce / MARKED values

Original authority continues elsewhere.

## Live boundary

Do not automatically:

- add `star_map_pin` to Web `weapons.ts`
- connect `StarMapPinPrototypeRuntime` from `Stage1GameplayRuntimeCoordinator`
- add to LevelUp
- expand U47 `WeaponEffectType`
- create save migration
- auto-promote `runtimeStatus`

`runtimeAutoPromotionAllowed = false`

## Next

After caller proof:

1. real Unity runtime evidence harness
2. same-run target-selection/projectile/MARKED telemetry evidence
3. visible pin / precision-shot cue
4. priority-target readability capture
5. mobile/dense-wave performance capture
6. human live-admission review

Until then: `PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE`.
