# Unity Rain Thread Prototype v1

Status: `PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE / SELECTED16 / NOT_CANON_TUNING`

## Purpose

Selected16 `rain_thread` / 雨縫い糸のTETHER mechanical identityを、shared pair selection + typed SOAK + caller-owned position controlとして実装する。

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## Composition

`RainThreadPrototypeState`

uses:

- `U2EnemyTetherPairSelectionRuntime`
- `U2EnemyKnockbackRuntime`
- typed `EnemyStatusApplicationRequest`
- `EnemyStatusRuntimeKind.Soak`

Application order:

`SELECT_PAIR_SOAK_BOTH_THEN_CALLER_OWNED_PULL_TICKS`

## Begin

Caller supplies:

- candidates
- parallel priority scores
- origin range band
- pair-distance band
- link duration
- SOAK policy

Shared selector chooses exactly two endpoints.

Begin then applies typed SOAK to **both endpoints**. SOAK policy remains caller supplied; no duration/stack/magnitude/cooldown default is frozen here.

An already-active link rejects replacement begin instead of silently mutating endpoints.

## Position control

Rain Thread mechanical identity includes position control, so the Title1 TETHER capability requirement also includes existing `KNOCKBACK_VECTOR`.

The caller does not add a new movement primitive. Each tick:

1. snapshot both endpoint positions
2. compute pair distance
3. break if beyond caller `maxLinkDistance`
4. if above caller `tensionStartDistance`, compute a capped pull distance
5. move both endpoints toward the pre-move center through `U2EnemyKnockbackRuntime.TryApply`
6. never pull farther than half the excess over the tension threshold, avoiding endpoint crossing

Both directions are computed from the same pre-move pair vector, so sequential displacement does not bias the second endpoint.

Shared knockback preserves Z.

## Link end rules

Caller-owned:

- duration expiry -> `Expired`
- endpoint no longer targetable -> `EndpointLost`
- pair beyond max distance -> `BrokeByDistance`

Ending clears endpoint references and remaining lifetime.

Invalid tuning fails closed without destroying an active valid link.

## Telemetry

Caller-owned telemetry records:

- begin attempts / successes
- selected combined priority and pair distance
- SOAK apply / cooldown-block outcomes
- ticks / pull ticks
- expiry
- endpoint loss
- distance break

No global/static telemetry lifetime.

## Executable proof

- `scripts/quality/unity-rain-thread/UnityRainThread.Contract.csproj`
- `scripts/quality/unity-rain-thread/Program.cs`

TEST_ONLY contract verifies:

- highest combined-priority pair selection
- SOAK applied to both endpoints
- symmetric pull toward the pre-move center
- no pull at tension threshold
- Z preservation
- duration expiry
- re-begin SOAK cooldown independent from link activation
- endpoint-loss break
- max-distance break before pull
- active replacement begin rejection
- invalid tick fail-closed without destroying valid state
- reset/reuse
- telemetry reset

All numeric fixtures are `NOT_CANON`.

## Admission

Required capabilities:

- `TWO_TARGET_TETHER`
- `KNOCKBACK_VECTOR`
- `STATUS_APPLICATION`

All are IMPLEMENTED.

With this executable caller proof, Rain Thread may move to:

`ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

This still means:

`runtimeStatus = NOT_IMPLEMENTED`

No live promotion is implied.

## Hold boundary

`name_reel` remains:

`HOLD_TARGET_LINK_READABILITY`

and is not fabricated into Selected16 because a shared tether primitive exists.

## Live boundary

Not connected to:

- Web live catalog
- LevelUp
- `Stage1GameplayRuntimeCoordinator`
- U47 executor
- save migration
- final LineRenderer/VFX/SFX
- production balance

`runtimeAutoPromotionAllowed = false`

## Original / Canon boundary

This gameplay implementation does not modify Weapon name, Attribute, SOAK identity, affinity, transformation graph, story/character authority, or Canon numeric values.
