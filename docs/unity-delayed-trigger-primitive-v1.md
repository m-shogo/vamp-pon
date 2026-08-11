# Unity Delayed Trigger Primitive v1

Status: `IMPLEMENTED_SHARED_DELAY_FOUNDATION / CAPABILITY_NOT_YET_PROMOTED / NOT_LIVE / NOT_CANON_TUNING`

## Purpose

設置後に一定時間待ち、effectを一度だけ発火可能にするための reusable one-shot delay gate。

Source:

`unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2DelayedTriggerRuntime.cs`

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## State machine

- `Inactive`
- `Waiting`
- `Ready`
- `Fired`
- `Cancelled`

`TryBegin(delaySeconds)`:

- finite / non-negative delayのみ受理
- delay > 0 -> `Waiting`
- delay == 0 -> `Ready`
- active stateのreplacement beginは禁止

`TryTick(deltaSeconds, out result)`:

- positive finite deltaのみ
- Waiting中はremaining delayを減算
- overshootでもremainingを0へclampし、`BecameReadyThisTick=true` は遷移tickで一度だけ
- Readyは明示consumeまでReadyを維持

`TryConsume()`:

- Readyのみ成功
- `Ready -> Fired`
- effect実行そのものはcaller責任

`TryCancel()`:

- Waiting / Readyのみ成功
- `Cancelled` terminalへ

`Reset()`で再利用可能。

## Why explicit consume

Ready到達とdamage / area query / Status / VFXの発火をshared stateが一体化すると、武器固有のeffect orderingがgeneric layerへ漏れる。

そのため shared layer は **ready signalまで** を所有し、callerが必要なeffect処理を行う直前に1回だけ `TryConsume()` する。

これにより:

- target query -> damage -> surviving Status
- area pulse -> telemetry
- visual cue -> effect

などcaller固有の順序を別gateで証明できる。

## Non-ownership

このprimitiveは持たない:

- Weapon ID
- damage
- Status
- target / overlap query
- radius
- placement position
- trap persistence
- repeating cadence
- VFX / SFX
- pooling
- Canon delay value

## Executable proof

- `scripts/quality/unity-delayed-trigger/UnityDelayedTrigger.Contract.csproj`
- `scripts/quality/unity-delayed-trigger/Program.cs`

TEST_ONLY:

- partial waiting tick
- delay overshoot -> one Ready transition
- Ready tick does not re-emit transition
- explicit single consume
- Fired terminal behavior
- zero-delay immediate Ready but still explicit consume
- cancellation from Waiting and Ready
- reset/reuse
- negative / non-finite delay fail closed
- zero / non-finite delta fail closed
- active replacement begin rejection
- invalid operations do not mutate valid state

All fixture values are `NOT_CANON`.

## Admission boundary

Foundation完成だけでは:

`DELAYED_TRIGGER = MISSING`

を維持する。

Selected16 consumerが別途、少なくとも:

- authored delayed-pulse identity
- placement / trigger point
- effect query
- damage / Status ordering
- one-shot cleanup
- telemetry
- executable caller proof

を示した後にだけ capability admissionを検討する。

`runtimeAutoPromotionAllowed = false`

## Live boundary

このfoundationから自動で行わない:

- Web live catalog追加
- LevelUp追加
- Stage1GameplayRuntimeCoordinator接続
- U47 executor追加
- save migration
- Content selection変更
- Canon tuning
- final VFX/readability承認
