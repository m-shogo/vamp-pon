# ヨルノシルベ1 Base Weapon Runtime Admission v1

## Purpose

Content Masterで選定した **Selected16** を既存runtimeへ形だけ押し込まないためのAdmission Gate。

- Content選定とRuntime実装を分離
- Web live catalogは別Authority
- shared primitive実装とSelected16固有caller proofを分離
- live registry / LevelUp / balance / VFX / production承認はさらに別gate
- `fake projectile` fallbackは禁止
- `contentSelectionMayBeDowngradedToFitRuntime = false`
- `runtimeAutoPromotionAllowed = false`

## Cross-runtime reality

Web runtimeは5 effect types。Unity live executorはU47の `Projectile / GroundArea` 2系統のまま。

shared primitiveやprototype callerが増えてもlive `WeaponEffectType` を名前だけ増やさない。

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

現在 **13 implemented** / **9 missing**。

### Foundation implemented but capability still MISSING

shared foundationとexecutable contractがmainにあるが、Selected16 consumer proof/admissionが未完了:

- `TRAP_PERSISTENCE` — `U2PersistentTrapState`
- `DELAYED_TRIGGER` — `U2DelayedTriggerState`

Foundation存在だけでconsumer semanticsを捏造しない。

## Admission decisions

- `BLOCKED_MISSING_UNITY_PRIMITIVES`: required primitive不足
- `BLOCKED_MISSING_UNITY_CALLER_PROOF`: primitive完成、Selected16固有caller不足
- `ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`: primitive + executable caller proof完成

implementation-reviewはlive/productionを意味しない。全entryの `runtimeStatus` は `NOT_IMPLEMENTED`。

## Current result

**admitted=7**

**blocked=9**

implementation-review admitted:

- `ember_matchcase`
- `rain_thread`
- `bellows_fan`
- `copper_tuning_fork`
- `pavement_hammer`
- `star_map_pin`
- `return_compass_needle`

primitive-complete but caller-proof missing: none。

## `copper_tuning_fork` — caller + capability verified / not live

Selected16 `PULSE_CHAIN` consumer。

Required:

1. `TARGET_CHAIN_SELECTION`
2. `STATUS_APPLICATION`

2つともIMPLEMENTED。

Selected16 caller:

`CopperTuningForkPrototypeRuntime`

Application order:

`PRIORITY_SNAPSHOT_CHAIN_DAMAGE_SURVIVING_SHOCK_THEN_CONDUCTIVE`

Verified behavior:

- current CONDUCTIVE状態をselection前にsnapshot
- caller-supplied bonusをeffective priorityへ変換
- bonusは絶対overrideではなくbase scoreとの差で決まる
- shared selectorのlocal re-anchor / hop range / no duplicateを利用
- chain全体を選択後にeffect適用するため新規CONDUCTIVEは同pulseをretroactiveに変えない
- damage first
- surviving target only -> SHOCK -> CONDUCTIVE
- defeated targetへpost-death Statusなし
- SHOCK cooldownとdamage / CONDUCTIVEを分離
- caller telemetry

Atomic Admission:

- `TARGET_CHAIN_SELECTION = IMPLEMENTED`
- `copper_tuning_fork` caller proof registered
- `ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

Still:

- `runtimeStatus = NOT_IMPLEMENTED`
- Web live catalog未接続
- LevelUp未接続
- `Stage1GameplayRuntimeCoordinator`未接続
- U47 executor未拡張
- final VFX / mobile readability未承認

## `rain_thread` — caller implemented / not live

Required: `TWO_TARGET_TETHER`, `KNOCKBACK_VECTOR`, `STATUS_APPLICATION`。

`RainThreadPrototypeState` / `SELECT_PAIR_SOAK_BOTH_THEN_CALLER_OWNED_PULL_TICKS`。

Pair selection、両endpoint SOAK、caller-owned lifetime、対称pull、distance/endpoint/expiry、telemetryを実証済み。

`ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW` / `runtimeStatus = NOT_IMPLEMENTED`。

## `return_compass_needle` — caller + capability verified / not live

Required: `RETURNING_PROJECTILE`, `HOMING_PRIORITY_SELECTION`, `STATUS_APPLICATION`。

`ReturnCompassNeedlePrototypeState`

`OUTBOUND_LINE_THEN_MARKED_PRIORITY_RETURN_WAYPOINT_THEN_OWNER`

`ONE_HIT_PER_TARGET_PER_LEG_OUTBOUND_AND_RETURN_SEPARATE`

MARKED caller bonus、bent return route、separate hit ledgers、damage-first surviving MARKED、waypoint loss fallbackを実証済み。

`ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW` / `runtimeStatus = NOT_IMPLEMENTED`。

## Existing admitted callers

- `EmberMatchcasePrototypeRuntime`: multi-target projectile + typed BURN + telemetry
- `BellowsFanPrototypeRuntime`: cone query + DISORIENTED + knockback + telemetry
- `PavementHammerPrototypeRuntime`: `QUERY_DAMAGE_SURVIVING_STATUS_KNOCKBACK_BREAK_STAGGER`
- `StarMapPinPrototypeRuntime`: `PRIORITY_SELECT_TARGETED_PROJECTILE_MARKED_ON_HIT`

全callerの数値は `CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`。

## Hold boundaries

### `name_reel`

Authoring Authority: `HOLD_TARGET_LINK_READABILITY`。Selected16ではない。

### `repair_spanner`

Authoring Authority: `HOLD_RETURN_FAMILY_OVERLAP`。

non-selected return-family proofはhit semantics検証に使うがSelected16 caller proofとして数えない。`RETURNING_PROJECTILE` 実装後もHoldを維持する。

## Shared primitive evidence

### `TARGET_CHAIN_SELECTION`

`U2EnemyTargetChainSelectionRuntime`

- caller-owned candidates / parallel scores
- first origin / range
- per-hop local anchor
- max hop distance / max target count
- highest finite caller priority
- score tie -> nearer
- exact tie -> stable input order
- no duplicate
- no LINQ/sort/internal List allocation

Generic selectorは`copper_tuning_fork` / CONDUCTIVE / SHOCK / damage / Status / Canon tuningを持たない。

### `TWO_TARGET_TETHER`

`U2EnemyTetherPairSelectionRuntime`。Generic primitiveはRain Thread / SOAK / damage / lifetime / position-control / Canon値を持たない。

### `RETURNING_PROJECTILE`

`U2ReturningProjectileMotionState` + `U2ReturningWaypointMotionState` + `ReturnCompassNeedlePrototypeState` executable proof。

Shared movementはWeapon/MARKED/hit/damage/Status semanticsを持たない。

### Other boundaries

- `STATUS_APPLICATION`: Status state / stack / magnitude / cooldown / typed transport
- `KNOCKBACK_VECTOR`: caller direction/distance、targetable-only、Z preserve
- `CONE_QUERY`: caller range/angle/cap
- `SLAM_WAVE_QUERY`: directional sector-band
- `BREAK_STAGGER_APPLICATION`: HP独立break / residual / stagger / reset
- `HOMING_PRIORITY_SELECTION`: caller score/range/tie-break

## Live boundary

禁止:

- Web `weapons.ts` 自動追加
- LevelUp pool自動追加
- U47 executor enumの名前だけ追加
- save migration先行作成
- unsupported weaponをProjectile/GroundAreaへ偽装
- primitive完成だけでcaller proofを捏造
- prototype proofだけでruntime auto-promotion

## CONTENT_MASTER boundary

Runtime進捗を理由にSelected16/Holdを変更しない。

- `copper_tuning_fork` はSelected16のまま
- `rain_thread` はSelected16のまま
- `name_reel` はHoldのまま
- `return_compass_needle` はSelected16のまま
- `repair_spanner` はHoldのまま
- Weapon name / Attribute / Status / affinity / transformation graphを変更しない

原本/Canonは別作業のAuthority。

## Next gates

1. `pressed_flower_cards` Selected16 caller proof -> `TRAP_PERSISTENCE`
2. `dream_alarm` Selected16 caller proof -> `DELAYED_TRIGGER`
3. remaining shared primitives: `SWEEP_QUERY`, `REFLECT_WINDOW`, `VEIL_TRACKING_FRICTION`, `LINE_PIERCE_RESIDUE`, `ORBIT_LINK`, `SPIRAL_FIELD`, `LANE_BOUNDARY_TRIGGER`
4. runtime evidence / mobile readability / human live-admission review

数値balanceは最後まで `PROTOTYPE_TUNING_NOT_CANON` として原本/Canonから分離する。
