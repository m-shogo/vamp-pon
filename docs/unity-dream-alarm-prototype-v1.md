# Unity Dream Alarm Prototype v1

Status: `SELECTED16 / CALLER_PROOF_VERIFIED / CAPABILITY_IMPLEMENTED / IMPLEMENTATION_REVIEW_ADMITTED / NOT_LIVE`

## Purpose

Selected16 `dream_alarm` / 夢の目覚ましの `DELAYED_PULSE` を、shared delayed trigger + caller-owned area query + typed DROWSYとして実装する。

Authoring Authority: `TITLE1_SELECTED`。

Mechanical identity:

- physical placement
- telegraphed delay
- one explicit delayed pulse
- surrounding action tempo shifts through DROWSY
- no repeating/shrill automatic loop

## Composition

`DreamAlarmPrototypeState` uses `U2DelayedTriggerState` + typed DROWSY + caller-owned XY radius query。

Application order:

`PLACE_WAIT_READY_EXPLICIT_CONSUME_AREA_DROWSY`

## Ready is not fire

`TryTick()` only advances the delay gate。Ready到達時もeffectは自動発火しない。Callerが明示 `TryFire(...)` した時だけReadyを1回consumeし、targetable in-range candidatesへtyped DROWSYを適用する。

- empty areaでもphysical pulseは1回consume
- DROWSY cooldownはStatusだけblockしpulseをrefundしない
- outside / untargetableは無視
- radius boundary inclusive
- Waiting / Cancelled / Firedはfire不可
- Waiting / Readyはcaller cancel可能

Damageは現在のtempo-shaping identityにないため捏造しない。

## Caller-supplied tuning

固定しない: placement / delay / radius / DROWSY policy / simultaneous clocks / placement cadence。

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## Executable proof

- `scripts/quality/unity-dream-alarm/UnityDreamAlarm.Contract.csproj`
- `scripts/quality/unity-dream-alarm/Program.cs`

Verified:

- positive delay -> Waiting
- early fire rejection
- overshoot -> Ready exactly once
- Ready tick no auto-fire
- area boundary / targetability
- typed DROWSY
- single fire only
- zero-delay Ready but explicit fire required
- empty pulse consumes once
- DROWSY cooldown independence
- Waiting / Ready cancellation
- invalid placement/radius/candidates fail closed without consuming valid Ready
- reset/telemetry reset

All fixtures NOT_CANON。

## Admission state

Shared delay foundation + executable Selected16 caller proof are green:

`DELAYED_TRIGGER = IMPLEMENTED`

Caller proof is registered and current decision is:

`ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

Still:

`runtimeStatus = NOT_IMPLEMENTED`

## Live boundary

No automatic Web catalog / LevelUp / `Stage1GameplayRuntimeCoordinator` / U47 executor / save migration / final VFX/SFX / production balance。

`runtimeAutoPromotionAllowed = false`
