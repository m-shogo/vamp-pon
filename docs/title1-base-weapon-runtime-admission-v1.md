# ヨルノシルベ1 Base Weapon Runtime Admission v1

## Purpose

Content Masterで選定した **Selected16** を既存runtimeへ形だけ押し込まないためのAdmission Gate。

- Content選定とRuntime実装を分離
- Web live catalogは別Authority
- shared primitiveとSelected16固有caller proofを分離
- live registry / LevelUp / balance / VFX / production承認はさらに別gate
- `fake projectile` fallbackは禁止
- `contentSelectionMayBeDowngradedToFitRuntime = false`
- `runtimeAutoPromotionAllowed = false`

## Cross-runtime reality

Web runtimeは5 effect types。Unity live executorはU47の `Projectile / GroundArea` 2系統のまま。

## Shared Unity primitive state

IMPLEMENTED:

1. `NEAREST_TARGET_PROJECTILE`
2. `MULTI_PROJECTILE_LOOP`
3. `CIRCULAR_GROUND_AREA`
4. `STATUS_APPLICATION`
5. `MULTI_TARGET_PROJECTILE_SELECTION`
6. `TWO_TARGET_TETHER`
7. `CONE_QUERY`
8. `KNOCKBACK_VECTOR`
9. `TARGET_CHAIN_SELECTION`
10. `SLAM_WAVE_QUERY`
11. `BREAK_STAGGER_APPLICATION`
12. `HOMING_PRIORITY_SELECTION`
13. `RETURNING_PROJECTILE`
14. `TRAP_PERSISTENCE`

現在 **14 implemented** / **8 missing**。

### Foundation implemented but capability still MISSING

- `DELAYED_TRIGGER` — `U2DelayedTriggerState`

Dream Alarm callerは別PRでstaged proof中。Foundation存在だけでAdmissionを先行しない。

## Admission decisions

- `BLOCKED_MISSING_UNITY_PRIMITIVES`
- `BLOCKED_MISSING_UNITY_CALLER_PROOF`
- `ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

implementation-reviewはlive/productionを意味しない。全entryの `runtimeStatus` は `NOT_IMPLEMENTED`。

## Current result

**admitted=8**

**blocked=8**

implementation-review admitted:

- `ember_matchcase`
- `rain_thread`
- `bellows_fan`
- `copper_tuning_fork`
- `pavement_hammer`
- `pressed_flower_cards`
- `star_map_pin`
- `return_compass_needle`

primitive-complete but caller-proof missing: none。

## `pressed_flower_cards` — caller + capability verified / not live

Selected16 `TRAP_FIELD`。

Required:

1. `TRAP_PERSISTENCE`
2. `STATUS_APPLICATION`

Selected16 caller:

`PressedFlowerCardsPrototypeState`

Application order:

`PLACE_ARM_WAIT_TARGET_ENTER_CONSUME_TRIGGER_THEN_TYPED_ROOTED`

Verified:

- one placed card = one shared trap state
- caller-owned radius
- pre-arm/out-of-range/untargetable/duplicate reject without budget loss
- eligible physical trigger consumes budget before typed ROOTED
- same target max once per placed card
- ROOTED cooldown may block Status but does not refund trigger
- arming carryover / exhaustion / expiry
- telemetry/reset
- all tuning NOT_CANON

Atomic Admission:

- `TRAP_PERSISTENCE = IMPLEMENTED`
- `pressed_flower_cards` caller proof registered
- `ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

Still `runtimeStatus = NOT_IMPLEMENTED`。

### Boss conversion boundary

Content runtime noteのBoss conversionは未実装。

- normal typed ROOTED + trap lifecycleはimplementation-review proof済み
- Boss conversionはshared boss-Status policy / runtime evidenceの別gate
- exact slow/action-delay/immunityはここでCanon化しない

**Boss conversion** 未完了をlive admission blockerとして正直に保持する。

## `copper_tuning_fork`

`TARGET_CHAIN_SELECTION + STATUS_APPLICATION`。Caller `CopperTuningForkPrototypeRuntime`。

`PRIORITY_SNAPSHOT_CHAIN_DAMAGE_SURVIVING_SHOCK_THEN_CONDUCTIVE`

CONDUCTIVE snapshot priority、local re-anchor、damage-first SHOCK/CONDUCTIVEを実証済み。`ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW` / `runtimeStatus = NOT_IMPLEMENTED`。

## `rain_thread`

`TWO_TARGET_TETHER + KNOCKBACK_VECTOR + STATUS_APPLICATION`。Caller `RainThreadPrototypeState`。

Pair selection、両endpoint SOAK、対称pull、distance/endpoint/expiryを実証済み。not live。

## `return_compass_needle`

`RETURNING_PROJECTILE + HOMING_PRIORITY_SELECTION + STATUS_APPLICATION`。Caller `ReturnCompassNeedlePrototypeState`。

MARKED-priority bent return、separate leg ledgers、damage-first surviving MARKEDを実証済み。not live。

## Existing admitted callers

- `EmberMatchcasePrototypeRuntime`
- `BellowsFanPrototypeRuntime`
- `PavementHammerPrototypeRuntime`
- `StarMapPinPrototypeRuntime`

全caller tuningは `CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`。

## Hold boundaries

- `name_reel`: `HOLD_TARGET_LINK_READABILITY`
- `repair_spanner`: `HOLD_RETURN_FAMILY_OVERLAP`

runtime進捗を理由にSelected16へ昇格しない。

## Shared primitive evidence

### `TRAP_PERSISTENCE`

`U2PersistentTrapState` + `PressedFlowerCardsPrototypeState` executable proof。

Shared stateはWeapon / ROOTED / query / boss conversion / damage / cadence / Canon値を持たない。

### `TARGET_CHAIN_SELECTION`

`U2EnemyTargetChainSelectionRuntime` + Copper executable proof。Generic selectorはCONDUCTIVE/SHOCKを持たない。

### `RETURNING_PROJECTILE`

Returning motion + waypoint + Return Compass executable proof。Shared movementはMARKED/hit/damageを持たない。

### Other boundaries

`STATUS_APPLICATION`, `KNOCKBACK_VECTOR`, `CONE_QUERY`, `SLAM_WAVE_QUERY`, `BREAK_STAGGER_APPLICATION`, `HOMING_PRIORITY_SELECTION`, `TWO_TARGET_TETHER` はcaller tuning/identityを持たない。

## Live boundary

禁止:

- Web `weapons.ts` 自動追加
- LevelUp pool自動追加
- `Stage1GameplayRuntimeCoordinator` 自動接続
- U47 executorの名前だけ追加
- save migration先行作成
- unsupported weaponをProjectile/GroundAreaへ偽装
- primitive proofだけでruntime auto-promotion

## CONTENT_MASTER boundary

Runtime進捗を理由にSelected16/HoldやWeapon name / Attribute / Status / affinity / transformation graphを変更しない。

原本/Canonは別Authority。

## Next gates

1. `dream_alarm` Selected16 caller proof -> `DELAYED_TRIGGER`
2. remaining shared primitives: `SWEEP_QUERY`, `REFLECT_WINDOW`, `VEIL_TRACKING_FRICTION`, `LINE_PIERCE_RESIDUE`, `ORBIT_LINK`, `SPIRAL_FIELD`, `LANE_BOUNDARY_TRIGGER`
3. runtime evidence / Boss conversion / mobile readability / human live-admission review

数値balanceは最後まで `PROTOTYPE_TUNING_NOT_CANON`。
