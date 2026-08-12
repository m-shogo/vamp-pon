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
15. `DELAYED_TRIGGER`

現在 **15 implemented** / **7 missing**。

Remaining missing:

- `SWEEP_QUERY`
- `REFLECT_WINDOW`
- `VEIL_TRACKING_FRICTION`
- `LINE_PIERCE_RESIDUE`
- `ORBIT_LINK`
- `SPIRAL_FIELD`
- `LANE_BOUNDARY_TRIGGER`

## Admission decisions

- `BLOCKED_MISSING_UNITY_PRIMITIVES`
- `BLOCKED_MISSING_UNITY_CALLER_PROOF`
- `ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

implementation-reviewはlive/productionを意味しない。全entryの `runtimeStatus` は `NOT_IMPLEMENTED`。

## Current result

**admitted=9**

**blocked=7**

implementation-review admitted:

- `ember_matchcase`
- `rain_thread`
- `bellows_fan`
- `copper_tuning_fork`
- `pavement_hammer`
- `pressed_flower_cards`
- `dream_alarm`
- `star_map_pin`
- `return_compass_needle`

primitive-complete but caller-proof missing: none。

## `dream_alarm` — caller + capability verified / not live

Selected16 `DELAYED_PULSE`。

Required:

1. `DELAYED_TRIGGER`
2. `STATUS_APPLICATION`

Selected16 caller:

`DreamAlarmPrototypeState`

Application order:

`PLACE_WAIT_READY_EXPLICIT_CONSUME_AREA_DROWSY`

Verified:

- physical placement + caller-supplied delay
- Waiting -> Ready transition
- Tick does not auto-fire
- explicit one-shot consume
- caller-owned XY radius query
- targetable in-range candidates receive typed DROWSY
- empty area still consumes the physical pulse
- DROWSY cooldown blocks only Status and does not refund pulse
- Waiting / Ready cancellation
- invalid inputs fail closed without consuming valid Ready
- telemetry/reset
- no damage/default delay/default radius

Atomic Admission:

- `DELAYED_TRIGGER = IMPLEMENTED`
- `dream_alarm` caller proof registered
- `ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

Still `runtimeStatus = NOT_IMPLEMENTED`。

## `pressed_flower_cards`

`TRAP_PERSISTENCE + STATUS_APPLICATION`。Caller `PressedFlowerCardsPrototypeState`。

`PLACE_ARM_WAIT_TARGET_ENTER_CONSUME_TRIGGER_THEN_TYPED_ROOTED`

Trap lifecycle / unique target / physical trigger budget / typed ROOTEDを実証済み。Boss conversionは未実装のlive gate。

`ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW` / not live。

## `copper_tuning_fork`

`TARGET_CHAIN_SELECTION + STATUS_APPLICATION`。Caller `CopperTuningForkPrototypeRuntime`。

CONDUCTIVE snapshot priority + local chain + damage->SHOCK->CONDUCTIVEを実証済み。not live。

## `rain_thread`

Tether + knockback + Status。Pair SOAK + caller-owned symmetric pull。not live。

## `return_compass_needle`

Returning + homing priority + Status。MARKED-priority bent return + separate leg ledgers。not live。

## Existing admitted callers

`EmberMatchcasePrototypeRuntime`, `BellowsFanPrototypeRuntime`, `PavementHammerPrototypeRuntime`, `StarMapPinPrototypeRuntime`。

全caller tuningは `CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`。

## Hold boundaries

- `name_reel`: `HOLD_TARGET_LINK_READABILITY`
- `repair_spanner`: `HOLD_RETURN_FAMILY_OVERLAP`

runtime進捗を理由にSelected16へ昇格しない。

## Shared primitive evidence

### `DELAYED_TRIGGER`

`U2DelayedTriggerState` + `DreamAlarmPrototypeState` executable proof。

Shared delayはWeapon / DROWSY / radius / target query / effect / VFX / Canon値を持たない。

### `TRAP_PERSISTENCE`

`U2PersistentTrapState` + Pressed Flower executable proof。Shared trapはROOTED / boss conversionを持たない。

### `TARGET_CHAIN_SELECTION`

`U2EnemyTargetChainSelectionRuntime` + Copper executable proof。Generic selectorはCONDUCTIVE/SHOCKを持たない。

### `RETURNING_PROJECTILE`

Returning motion/waypoint + Return Compass proof。Shared movementはMARKED/hit/damageを持たない。

## Boss conversion boundary

Pressed Flower Content noteの **Boss conversion** はまだlive/runtime evidence未完了。Exact slow/action-delay/immunity値はCanon化しない。

## Live boundary

禁止:

- Web `weapons.ts` 自動追加
- LevelUp pool自動追加
- `Stage1GameplayRuntimeCoordinator` 自動接続
- U47 executorの名前だけ追加
- save migration先行作成
- unsupported weaponをProjectile/GroundAreaへ偽装
- prototype proofだけでruntime auto-promotion

## CONTENT_MASTER boundary

Runtime進捗を理由にSelected16/HoldやWeapon name / Attribute / Status / affinity / transformation graphを変更しない。

原本/Canonは別Authority。

## Next gates

1. `SWEEP_QUERY` consumer
2. `REFLECT_WINDOW` consumer
3. `VEIL_TRACKING_FRICTION` consumer
4. `LINE_PIERCE_RESIDUE` consumer
5. `ORBIT_LINK` consumer
6. `SPIRAL_FIELD` consumer
7. `LANE_BOUNDARY_TRIGGER` consumer
8. runtime evidence / Boss conversion / mobile readability / human live-admission review

数値balanceは最後まで `PROTOTYPE_TUNING_NOT_CANON`。
