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
9. `SLAM_WAVE_QUERY`
10. `BREAK_STAGGER_APPLICATION`
11. `HOMING_PRIORITY_SELECTION`
12. `RETURNING_PROJECTILE`

現在 **12 implemented** / **10 missing**。

### Foundation implemented but capability still MISSING

以下はshared foundationとexecutable contractがmainにあるが、Selected16 consumer proofが未完了なのでAdmission capabilityはまだMISSING:

- `TARGET_CHAIN_SELECTION` — `U2EnemyTargetChainSelectionRuntime`
- `TRAP_PERSISTENCE` — `U2PersistentTrapState`
- `DELAYED_TRIGGER` — `U2DelayedTriggerState`

Foundation存在だけでconsumer semanticsを捏造しない。

## Admission decisions

- `BLOCKED_MISSING_UNITY_PRIMITIVES`: required primitive不足
- `BLOCKED_MISSING_UNITY_CALLER_PROOF`: primitive完成、Selected16固有caller不足
- `ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`: primitive + executable caller proof完成

implementation-reviewはlive/productionを意味しない。全entryの `runtimeStatus` は `NOT_IMPLEMENTED`。

## Current result

**admitted=6**

**blocked=10**

implementation-review admitted:

- `ember_matchcase`
- `rain_thread`
- `bellows_fan`
- `pavement_hammer`
- `star_map_pin`
- `return_compass_needle`

primitive-complete but caller-proof missing:

- none

## `rain_thread` — caller implemented / not live

Selected16 TETHER consumer。

Required:

1. `TWO_TARGET_TETHER`
2. `KNOCKBACK_VECTOR`
3. `STATUS_APPLICATION`

Selected16 caller:

`RainThreadPrototypeState`

Application order:

`SELECT_PAIR_SOAK_BOTH_THEN_CALLER_OWNED_PULL_TICKS`

Caller proof:

- deterministic pair selection
- typed SOAKを両endpointへ適用
- caller-owned link duration
- tension thresholdを超えた時だけposition control
- `KNOCKBACK_VECTOR` を互いへ向けた対称pull
- max-link-distance / endpoint-loss / duration expiry
- SOAK cooldownとlink activationを独立
- caller-owned telemetry

現在 `ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`。ただし `runtimeStatus = NOT_IMPLEMENTED`。

## `return_compass_needle` — caller + capability verified / not live

Selected16 `RETURN_HOMING`。

Required:

1. `RETURNING_PROJECTILE`
2. `HOMING_PRIORITY_SELECTION`
3. `STATUS_APPLICATION`

3つともIMPLEMENTED。

Selected16 caller:

`ReturnCompassNeedlePrototypeState`

Application order:

`OUTBOUND_LINE_THEN_MARKED_PRIORITY_RETURN_WAYPOINT_THEN_OWNER`

Hit policy:

`ONE_HIT_PER_TARGET_PER_LEG_OUTBOUND_AND_RETURN_SEPARATE`

Verified behavior:

- outbound straight-line phase
- caller-supplied MARKED bonusでreturn waypoint priorityを作る
- outbound targetをreturn waypointから除外
- invalid range / tie-breakはdirect-return fallbackへ変換せずfail closed
- lost waypointはdynamic final owner anchorへskip
- outbound / returnのhit ledgerを分離
- bent routeをactual cornerで分割してsegment hit判定
- damage first、surviving target only typed MARKED
- MARKED cooldownはreturn damageをblockしない
- caller telemetry

Shared waypoint motion / homing selectorはMARKEDやWeapon identityを知らない。

Atomic Admission:

- `RETURNING_PROJECTILE = IMPLEMENTED`
- `return_compass_needle` caller proof registered
- `ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

Still:

- `runtimeStatus = NOT_IMPLEMENTED`
- Web live catalog未接続
- LevelUp未接続
- `Stage1GameplayRuntimeCoordinator`未接続
- U47 executor未拡張
- final VFX / mobile readability未承認

## Existing admitted callers

### `ember_matchcase`

`EmberMatchcasePrototypeRuntime`: multi-target projectile + typed BURN + telemetry。

### `bellows_fan`

`BellowsFanPrototypeRuntime`: cone query + DISORIENTED + knockback + telemetry。

### `pavement_hammer`

`PavementHammerPrototypeRuntime`: `QUERY_DAMAGE_SURVIVING_STATUS_KNOCKBACK_BREAK_STAGGER`。

### `star_map_pin`

`StarMapPinPrototypeRuntime`: `PRIORITY_SELECT_TARGETED_PROJECTILE_MARKED_ON_HIT`。

全callerの数値は `CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`。

## Hold boundaries

### `name_reel`

Authoring Authority: `HOLD_TARGET_LINK_READABILITY`。

Selected16ではない。Tether実装を理由にAdmission rowを作らない。

### `repair_spanner`

Authoring Authority: `HOLD_RETURN_FAMILY_OVERLAP`。

non-selected return-family proofはhit semantics検証に使うがSelected16 caller proofとして数えない。`RETURNING_PROJECTILE` 昇格後もHoldを維持する。

## Shared primitive evidence

### `TWO_TARGET_TETHER`

`U2EnemyTetherPairSelectionRuntime`

- caller-owned candidates / priority scores
- origin range / pair-distance band
- highest combined finite priority
- equal score -> shorter pair
- exact tie -> stable input order
- targetable only / XY only
- O(n^2), no LINQ/sort/internal List allocation

Generic primitiveはRain Thread / SOAK / damage / lifetime / position-control / LineRenderer / Canon値を持たない。

### `RETURNING_PROJECTILE`

Evidence is composed from:

- `U2ReturningProjectileMotionState`
- `U2ReturningWaypointMotionState`
- `ReturnCompassNeedlePrototypeState`
- executable caller contract

Shared movement owns phase/travel-budget/dynamic waypoint/anchor only。Weapon/MARKED/hit/damage/Status semanticsはcaller側。

### Other boundaries

- `STATUS_APPLICATION`: Status state / stack / magnitude / cooldown / typed transport。Weapon tuningなし。
- `KNOCKBACK_VECTOR`: caller direction/distance、targetable-only、Z preserve。Weapon identityなし。
- `CONE_QUERY`: caller range/angle/cap。Weapon/Status/damageなし。
- `SLAM_WAVE_QUERY`: directional sector-band。Weapon/damage/break/Statusなし。
- `BREAK_STAGGER_APPLICATION`: HP独立break / residual / stagger / reset。Canon thresholdなし。
- `HOMING_PRIORITY_SELECTION`: caller score/range/tie-break。Weapon/MARKED/boss semanticsなし。

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

- `rain_thread` はSelected16のまま
- `name_reel` はHoldのまま
- `return_compass_needle` はSelected16のまま
- `repair_spanner` はHoldのまま
- Weapon name / Attribute / Status / affinity / transformation graphを変更しない

原本/Canonは別作業のAuthority。

## Next gates

1. `copper_tuning_fork` Selected16 caller proof -> `TARGET_CHAIN_SELECTION`
2. `pressed_flower_cards` Selected16 caller proof -> `TRAP_PERSISTENCE`
3. `dream_alarm` Selected16 caller proof -> `DELAYED_TRIGGER`
4. runtime evidence / mobile readability / human live-admission review

数値balanceは最後まで `PROTOTYPE_TUNING_NOT_CANON` として原本/Canonから分離する。
