# Unity Trap Persistence Primitive v1

Status: `IMPLEMENTED_SHARED_STATE_FOUNDATION / CAPABILITY_IMPLEMENTED / NOT_LIVE / NOT_CANON_TUNING`

## Purpose

`TRAP_FIELD` / movement breadcrumb系callerへ、arming・armed lifetime・trigger budget・expiryを共通stateとして提供する。

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## Source

`U2PersistentTrapState`

Phases: `Inactive / Arming / Armed / Exhausted / Expired`。

Caller supplies placement position / arming delay / active duration / trigger budget。

## Time semantics

One caller delta budgetを使用する。

Large tickがarming完了を跨ぐ場合:

1. remaining arming time消費
2. `Armed`
3. leftover deltaをactive lifetimeへ適用

低FPSでtrap lifetimeを延長しない。十分大きな1tickは `ArmedThisTick=true` と `ExpiredThisTick=true` を同時に返せる。

## Trigger budget

`TryConsumeTrigger` はArmed中のみ成功。成功ごとにbudgetを1減らし、0で `Exhausted`。Time expiryは `Expired` で、triggerを捏造しない。

## Non-ownership

Shared stateは以下を持たない:

- Weapon ID
- enemy query / overlap shape
- ROOTED / SOAK / damage / Status
- boss conversion
- placement cadence / breadcrumb generation
- VFX / SFX / pooling
- Canon timing/budget values

## Executable foundation proof

- `scripts/quality/unity-trap-persistence/UnityTrapPersistence.Contract.csproj`
- `scripts/quality/unity-trap-persistence/Program.cs`

Delayed arming、lifetime carryover、trigger exhaustion、time expiry、position/Z、reset/reuse、fail-closedを実証済み。All fixtures NOT_CANON。

## Selected16 consumer proof

`pressed_flower_cards` / 押花札 が executable Selected16 callerとしてgreen。

Caller:

`PressedFlowerCardsPrototypeState`

Application order:

`PLACE_ARM_WAIT_TARGET_ENTER_CONSUME_TRIGGER_THEN_TYPED_ROOTED`

Consumer proves:

- one placed card composes one shared trap state
- caller-owned trigger radius
- out-of-range / untargetable / duplicate target does not consume budget
- same targetは同placementを1回だけtrigger
- eligible physical trigger consumes shared budget before typed ROOTED attempt
- ROOTED cooldownはStatusだけblockしtriggerをrefundしない
- exhausted / expired reject further triggers
- caller telemetry/reset
- all tuning caller supplied

Generic trapは`pressed_flower_cards` / ROOTEDを知らない。

## Admission boundary

Shared foundation + Pressed Flower executable caller proofがgreenのため:

`TRAP_PERSISTENCE = IMPLEMENTED`

`pressed_flower_cards`:

`ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

Still:

`runtimeStatus = NOT_IMPLEMENTED`

## Boss boundary

Content noteのboss root conversionはこのAdmissionで捏造しない。

- normal typed ROOTED + trap lifecycleはimplementation-review proof済み
- boss conversionはshared boss-Status policy / runtime evidenceが整った後の別gate
- exact slow/action-delay/immunity値はCanon化しない

この未完了はlive admission blockerであり、shared trap capability自体をfake generic behaviorへ落とす理由にはしない。

## Live / Original / Canon boundary

No automatic Web catalog / LevelUp / Stage1GameplayRuntimeCoordinator / U47 executor / save migration / final VFX / production balance。

No Story / Character / Content selection / Canon numeric values are modified.

`runtimeAutoPromotionAllowed = false`
