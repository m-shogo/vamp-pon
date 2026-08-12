# Unity Dream Alarm Prototype v1

Status: `SELECTED16 / STAGED_CALLER_PROOF / DELAYED_TRIGGER_CAPABILITY_NOT_YET_PROMOTED / NOT_LIVE`

## Purpose

Selected16 `dream_alarm` / 夢の目覚ましの `DELAYED_PULSE` を、shared delayed trigger + caller-owned area query + typed DROWSYとして実装する。

Authoring Authority:

`TITLE1_SELECTED`

Mechanical identity:

- physical placement
- telegraphed delay
- one explicit delayed pulse
- surrounding action tempo shifts through DROWSY
- no shrill loop / repeating automatic alarm

## Composition

`DreamAlarmPrototypeState`

uses:

- `U2DelayedTriggerState`
- typed `EnemyStatusApplicationRequest`
- `EnemyStatusRuntimeKind.Drowsy`
- caller-owned XY radius query over supplied candidates

Application order:

`PLACE_WAIT_READY_EXPLICIT_CONSUME_AREA_DROWSY`

## Ready is not fire

`TryTick()` only advances the shared delay gate.

When delay reaches zero:

- phase becomes `Ready`
- telemetry records the transition once
- no Status/effect is applied automatically

Caller must explicitly invoke `TryFire(...)`.

`TryFire(...)` validates candidates/radius, consumes Ready exactly once, then scans targetable enemies inside the caller-supplied XY radius and applies typed DROWSY.

This preserves effect ordering outside the shared delay primitive.

## One-shot pulse semantics

- Empty area is still a real pulse and consumes the one-shot alarm.
- DROWSY internal cooldown may block Status on a target, but does not refund the physical pulse.
- Outside/untargetable candidates are ignored.
- Radius boundary is inclusive.
- Waiting/Cancelled/Fired alarm cannot fire.
- caller may cancel Waiting or Ready before explicit consume.

No damage is invented here because current mechanical identity is tempo-shaping delayed pulse, not damage-first burst.

## Caller-supplied tuning

固定しない:

- placement position
- delay
- pulse radius
- DROWSY duration/stacks/magnitude/cooldown
- total simultaneous clocks
- placement cadence

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## Executable proof

- `scripts/quality/unity-dream-alarm/UnityDreamAlarm.Contract.csproj`
- `scripts/quality/unity-dream-alarm/Program.cs`

TEST_ONLY scenarios:

- positive delay -> Waiting
- early fire rejected without consuming delay
- delay overshoot -> Ready exactly once
- Ready tick does not auto-fire
- explicit fire includes targetable boundary and excludes outside/untargetable targets
- in-range targets receive typed DROWSY
- Fired cannot fire twice
- zero-delay begins Ready but still requires explicit fire
- empty area still consumes one-shot pulse
- DROWSY cooldown blocks only Status, not pulse consumption
- Waiting / Ready cancellation
- invalid placement / radius / candidate list fail closed
- invalid fire does not consume a valid Ready state
- reset / telemetry reset

All fixture values are NOT_CANON.

## Staged Admission boundary

This caller-only step keeps:

`DELAYED_TRIGGER = MISSING`

`dream_alarm` remains:

`BLOCKED_MISSING_UNITY_PRIMITIVES`

Caller registry is not updated yet.

After shared delayed-trigger foundation + this executable Selected16 caller proof are green, a separate atomic Admission overlay may:

- `DELAYED_TRIGGER = IMPLEMENTED`
- register `dream_alarm`
- move it to `ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

Even then:

`runtimeStatus = NOT_IMPLEMENTED`

## Live boundary

No automatic connection to:

- Web live catalog
- LevelUp
- `Stage1GameplayRuntimeCoordinator`
- U47 executor
- save migration
- final VFX/SFX
- production balance

`runtimeAutoPromotionAllowed = false`
