# Unity Return Compass Needle Prototype v1

Status: `SELECTED16 / CALLER_PROOF_VERIFIED / CAPABILITY_IMPLEMENTED / IMPLEMENTATION_REVIEW_ADMITTED / NOT_LIVE`

## Purpose

Selected16 `return_compass_needle` / 帰針の `RETURN_HOMING` を、往路line hit + 帰路のMARKED優先waypoint + owner returnとして実装する。

Authoring Authority:

`TITLE1_SELECTED`

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
- invalid min/max return range or invalid tie-break fails closed before selection; invalid input is never reinterpreted as no eligible waypoint

Thus **帰路はMARKED対象を優先** をCanon score固定なしで実装する。

## Dynamic return homing

Selected waypointのcurrent positionをshared waypoint motionへ毎tick渡す。

Waypointが到達前にuntargetableになった場合:

- caller calls `SkipReturnWaypoint()`
- waypointをclear
- dynamic final owner anchorへreturn継続
- telemetry records waypoint loss

## Bent-path hit semantics

Outbound / returnは独立HashSet hit ledger。

同じtargetは:

- outboundで1回
- returnで1回

までhit可能。同一leg内の多重hitは禁止。

XY point-to-segment distanceでtunnelingを抑え、同一stepでphaseを跨ぐ場合もactual route cornerでsegmentを分割する。

## Damage / MARKED order

各hit:

1. per-leg duplicate check
2. damage
3. telemetry
4. surviving target only -> typed MARKED request

Defeated targetへdeath後MARKEDを付けない。MARKED internal cooldownがreturn Statusをblockしてもreturn damageは独立して通る。

## Caller-supplied tuning

固定しない:

- base return priority score
- MARKED bonus
- min/max return range
- tie-break policy
- speed / delta / arrival distance
- hit radius
- damage / damage flash
- MARKED duration/stacks/magnitude/cooldown
- final owner anchor

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## Executable proof

- `scripts/quality/unity-return-compass-needle/UnityReturnCompassNeedle.Contract.csproj`
- `scripts/quality/unity-return-compass-needle/Program.cs`

Verified scenarios:

- MARKED bonus beats higher unmarked base score
- outbound target excluded from return waypoint
- outbound -> waypoint -> final-anchor direction in one frame
- bent-path outbound/return hit detection
- defeated target short-circuits MARKED
- direct return when no alternate waypoint exists
- same target receives max one outbound + one return hit
- return MARKED cooldown independent from damage
- lost waypoint falls back to owner anchor
- dynamic final owner anchor
- invalid return range / tie-break fail closed
- reset / telemetry reset

All fixture values are NOT_CANON.

## Admission state

Shared motion foundation + Selected16 executable caller proof are both green, therefore the Title1 Admission overlay now atomically records:

`RETURNING_PROJECTILE = IMPLEMENTED`

and registers `return_compass_needle` caller proof.

Current decision:

`ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

Still:

`runtimeStatus = NOT_IMPLEMENTED`

This is **not live runtime admission**.

## Live boundary

No automatic connection to:

- Web live catalog
- LevelUp
- `Stage1GameplayRuntimeCoordinator`
- U47 executor
- save migration
- final VFX/SFX
- final mobile readability
- production balance

`runtimeAutoPromotionAllowed = false`

## Original / Canon boundary

No Story / Character / Original / Content selection is modified.

- `return_compass_needle` stays Selected via `TITLE1_SELECTED`
- `repair_spanner` stays Hold via `HOLD_RETURN_FAMILY_OVERLAP`
- MARKED identity stays authored
- numeric tuning remains prototype-only
