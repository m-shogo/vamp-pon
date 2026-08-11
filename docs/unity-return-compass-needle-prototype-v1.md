# Unity Return Compass Needle Prototype v1

Status: `SELECTED16 / STAGED_CALLER_PROOF / RETURNING_CAPABILITY_NOT_YET_PROMOTED / NOT_LIVE`

## Purpose

Selected16 `return_compass_needle` / 帰針の `RETURN_HOMING` を、往路line hit + 帰路のMARKED優先waypoint + owner returnとして実装する。

Authoring Authority:

`SELECTED_RETURN_FAMILY_SPECIALIST`

`repair_spanner` は引き続き `HOLD_RETURN_FAMILY_OVERLAP`。

Runtime進捗からContent選定を逆転させない。

## Composition

`ReturnCompassNeedlePrototypeState`

uses:

- `U2ReturningWaypointMotionState`
- `U2EnemyHomingPrioritySelectionRuntime`
- typed `EnemyStatusApplicationRequest`
- `EnemyStatusRuntimeKind.Marked`

Application order:

`OUTBOUND_LINE_THEN_MARKED_PRIORITY_RETURN_WAYPOINT_THEN_OWNER`

Hit policy:

`ONE_HIT_PER_TARGET_PER_LEG_OUTBOUND_AND_RETURN_SEPARATE`

## Return waypoint selection

Caller receives:

- return candidates
- parallel base priority scores
- min/max return range
- distance tie-break
- `markedPriorityBonus`

For each eligible candidate:

`effectiveScore = baseScore + (currently MARKED ? markedPriorityBonus : 0)`

Rules:

- `markedPriorityBonus` is caller supplied / NOT_CANON
- outbound primary target is excluded from the return waypoint
- generic homing selector receives only candidates + effective scores
- selector does not learn what MARKED means
- if no alternate eligible target exists, return route goes directly to owner

Thus the mechanical identity **帰路はMARKED対象を優先** is implemented without hard-coding a Canon score.

## Dynamic return homing

The selected waypoint is stored as an enemy reference, but its **current position** is supplied to shared waypoint motion each tick.

If the waypoint becomes untargetable before arrival:

- caller calls `SkipReturnWaypoint()`
- waypoint is cleared
- return continues to the dynamic final owner anchor
- telemetry records waypoint loss

## Bent-path hit semantics

Outbound and return have independent HashSet hit ledgers.

A target may be hit:

- once outbound
- once return

but not repeatedly within one leg.

Hit detection uses XY point-to-segment distance to reduce tunneling.

When one motion step crosses multiple phases, caller splits hit segments at actual route corners:

- previous -> outbound target
- outbound target -> return waypoint
- return waypoint -> final step position

All return subsegments share the same return ledger.

This avoids treating a bent return route as one incorrect straight line.

## Damage / MARKED order

For each hit:

1. per-leg duplicate check
2. damage
3. telemetry
4. surviving target only -> typed MARKED request

Defeated target never receives MARKED after death.

MARKED internal cooldown may block the Status application on the return leg while return damage still succeeds.

## Caller-supplied tuning

No defaults are frozen for:

- base return priority score
- MARKED bonus
- min/max return range
- tie-break policy
- speed
- delta
- arrival distance
- hit radius
- damage
- damage flash duration
- MARKED duration/stacks/magnitude/cooldown
- final owner anchor

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## Executable proof

- `scripts/quality/unity-return-compass-needle/UnityReturnCompassNeedle.Contract.csproj`
- `scripts/quality/unity-return-compass-needle/Program.cs`

TEST_ONLY contract covers:

- MARKED bonus beats higher unmarked base score
- outbound target excluded from return waypoint
- outbound -> waypoint -> final-anchor direction in one frame
- bent-path outbound/return hit detection
- defeated target short-circuits MARKED
- direct return when no alternate waypoint exists
- same target can receive one outbound + one return hit
- return MARKED cooldown independent from damage
- lost waypoint falls back to owner anchor
- dynamic final owner anchor
- reset / telemetry reset

All fixture values are NOT_CANON.

## Staged admission boundary

Before this caller proof is green:

- `RETURNING_PROJECTILE = MISSING`
- Return Compass stays `BLOCKED_MISSING_UNITY_PRIMITIVES`
- caller registry does not include `return_compass_needle`

After shared waypoint foundation + caller executable proof are both green, a separate admission gate may atomically:

- promote `RETURNING_PROJECTILE = IMPLEMENTED`
- register `return_compass_needle` caller proof
- move it to `ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

Even then:

`runtimeStatus = NOT_IMPLEMENTED`

## Live boundary

No automatic connection to:

- Web live catalog
- LevelUp
- Stage1GameplayRuntimeCoordinator
- U47 executor
- save migration
- final VFX/SFX
- final mobile readability
- production balance

`runtimeAutoPromotionAllowed = false`

## Original / Canon boundary

No Story / Character / Original / Content selection is modified.

- `return_compass_needle` stays Selected
- `repair_spanner` stays Hold
- MARKED identity stays authored
- numeric tuning remains prototype-only
