# Unity Delayed Trigger Primitive v1

Status: `IMPLEMENTED_SHARED_DELAY_FOUNDATION / CAPABILITY_IMPLEMENTED / NOT_LIVE / NOT_CANON_TUNING`

## Purpose

設置後に一定時間待ち、effectを一度だけ発火可能にするreusable one-shot delay gate。

Source: `U2DelayedTriggerState`。

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## State machine

`Inactive / Waiting / Ready / Fired / Cancelled`。

- `TryBegin(delay)` — finite non-negative only; zero delay -> Ready
- `TryTick(delta)` — Waitingを進め、overshootでもReady transitionを一度だけ通知
- Readyは明示consumeまで維持
- `TryConsume()` — Ready only -> Fired
- `TryCancel()` — Waiting/Ready -> Cancelled
- `Reset()` — reusable

## Why explicit consume

Ready到達とdamage/query/Status/VFX発火をshared stateが一体化すると武器固有orderingがgeneric layerへ漏れる。Shared layerはready signalまで、effectはcaller責任。

## Non-ownership

Shared delayはWeapon ID / damage / Status / target query / radius / placement / trap persistence / cadence / VFX / pooling / Canon delayを持たない。

## Executable foundation proof

- `scripts/quality/unity-delayed-trigger/UnityDelayedTrigger.Contract.csproj`
- `scripts/quality/unity-delayed-trigger/Program.cs`

Waiting / overshoot / Ready once / explicit consume / zero-delay / cancellation / reset / fail-closedを実証済み。All fixtures NOT_CANON。

## Selected16 consumer proof

`dream_alarm` / 夢の目覚まし が executable Selected16 callerとしてgreen。

Caller:

`DreamAlarmPrototypeState`

Application order:

`PLACE_WAIT_READY_EXPLICIT_CONSUME_AREA_DROWSY`

Consumer proves:

- caller placement + delay
- Tick does not auto-fire
- explicit Ready consume
- caller-owned XY radius query
- typed DROWSY to targetable in-range candidates
- empty area still consumes physical one-shot pulse
- DROWSY cooldown does not refund pulse
- Waiting/Ready cancellation
- invalid fire input does not consume valid Ready
- telemetry/reset
- all tuning caller supplied

Generic delayは`dream_alarm` / DROWSYを知らない。

## Admission boundary

Shared foundation + Dream Alarm executable caller proofがgreenのため:

`DELAYED_TRIGGER = IMPLEMENTED`

`dream_alarm`:

`ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

Still:

`runtimeStatus = NOT_IMPLEMENTED`

## Live / Original / Canon boundary

No automatic Web catalog / LevelUp / Stage1GameplayRuntimeCoordinator / U47 executor / save migration / final VFX / production balance。

No Story / Character / Content selection / Canon numeric values are modified.

`runtimeAutoPromotionAllowed = false`
