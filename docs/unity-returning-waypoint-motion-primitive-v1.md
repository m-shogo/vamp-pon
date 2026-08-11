# Unity Returning Waypoint Motion Primitive v1

Status: `IMPLEMENTED_SHARED_MOTION_FOUNDATION / NOT_LIVE / NOT_CANON_TUNING`

## Purpose

`RETURN_HOMING` のような「往路の後、帰路で一度だけ別targetへ寄り、その後ownerへ戻る」挙動を、Weapon固有の移動コードなしで表現するshared motion foundation。

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## Source

`U2ReturningWaypointMotionState`

Phases:

1. `Inactive`
2. `Outbound`
3. `ReturningViaWaypoint`
4. `ReturningToAnchor`
5. `Complete`

## Motion contract

Caller supplies every step:

- current position
- optional return waypoint position
- final return anchor position
- speed
- delta seconds
- arrival distance

Begin supplies:

- outbound target position
- whether a return waypoint should be used

The primitive preserves current projectile Z and performs gameplay travel in XY.

## Same-frame travel budget

One step owns one budget:

`speed * deltaSeconds`

If enough budget exists, one frame may transition through:

`Outbound target -> Return waypoint -> Final return anchor direction`

without discarding leftover distance at phase boundaries.

A no-waypoint path may complete:

`Outbound -> ReturningToAnchor -> Complete`

within one frame.

## Dynamic targets

`returnWaypoint` and `finalReturnAnchor` are supplied every step.

Therefore caller may:

- follow a moving waypoint target
- follow a moving player/owner anchor
- skip a waypoint when its target becomes invalid

without the primitive knowing why the target moved or disappeared.

## `SkipReturnWaypoint`

Caller may cancel the optional waypoint:

- before outbound turnaround
- while already `ReturningViaWaypoint`

In the latter case the state transitions directly to `ReturningToAnchor`.

## Non-ownership

This primitive does not own:

- Weapon ID
- enemy target selection
- MARKED or any Status
- damage
- hit tables
- projectile pool/spawn
- visuals/audio
- Canon speed/range/timing
- live registry admission

## Executable proof

- `scripts/quality/unity-returning-waypoint/UnityReturningWaypoint.Contract.csproj`
- `scripts/quality/unity-returning-waypoint/Program.cs`

TEST_ONLY contract verifies:

- outbound -> waypoint -> final-anchor direction in one frame
- remaining travel budget across both transitions
- expected bent-path position
- waypoint consumed once
- dynamic final anchor
- direct no-waypoint same-frame completion
- skip before turnaround
- skip while returning via waypoint
- Z preservation
- active replacement-begin rejection
- invalid speed/delta/arrival/waypoint fail closed
- invalid step does not mutate active phase
- reset/reuse

All fixture values are `NOT_CANON`.

## Admission boundary

This foundation does **not** by itself promote `RETURNING_PROJECTILE`.

Selected16 `return_compass_needle` still requires:

- real return-homing caller composition
- return hit semantics
- MARKED-priority waypoint selection
- executable caller proof

Only after those are green should capability/caller admission be updated.

## Original / Canon boundary

No Original / Story / Character / Content selection is modified by this primitive.

`repair_spanner` remains Hold and `return_compass_needle` remains the selected return-family specialist.

`runtimeAutoPromotionAllowed = false`
