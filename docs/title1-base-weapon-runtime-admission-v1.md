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

現在 **11 implemented** / **11 missing**。

`U2ReturningProjectileMotionRuntime` はshared motion foundationとしてmain済みだが、Selected16 return caller / hit semanticsのAdmissionが未完了なので `RETURNING_PROJECTILE` はまだMISSING。

## Admission decisions

- `BLOCKED_MISSING_UNITY_PRIMITIVES`: required primitive不足
- `BLOCKED_MISSING_UNITY_CALLER_PROOF`: primitive完成、Selected16固有caller不足
- `ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`: primitive + executable caller proof完成

implementation-reviewはlive/productionを意味しない。全entryの `runtimeStatus` は `NOT_IMPLEMENTED`。

## Current result

**admitted=5**

**blocked=11**

implementation-review admitted:

- `ember_matchcase`
- `rain_thread`
- `bellows_fan`
- `pavement_hammer`
- `star_map_pin`

primitive-complete but caller-proof missing:

- none

## `rain_thread` — caller implemented / not live

Selected16 TETHER consumer。

Required:

1. `TWO_TARGET_TETHER`
2. `KNOCKBACK_VECTOR`
3. `STATUS_APPLICATION`

3つともIMPLEMENTED。

Selected16 caller:

`RainThreadPrototypeState`

Application order:

`SELECT_PAIR_SOAK_BOTH_THEN_CALLER_OWNED_PULL_TICKS`

Caller proof:

1. deterministic pair selection
2. typed SOAKを両endpointへ適用
3. caller-owned link duration
4. tension thresholdを超えた時だけposition control
5. `KNOCKBACK_VECTOR` を互いへ向けて対称pull
6. max-link-distance超過でbreak
7. endpoint untargetableでbreak
8. duration expiry
9. SOAK cooldownとlink activationを独立維持
10. caller-owned telemetry

現在:

`ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

ただし:

- `runtimeStatus = NOT_IMPLEMENTED`
- Web live catalog未接続
- LevelUp未接続
- `Stage1GameplayRuntimeCoordinator`未接続
- U47 live executor未拡張
- final tether line / VFX / readability未承認

すべてのrange / duration / pull / SOAK値は `CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`。

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

Authoring Authority:

`HOLD_TARGET_LINK_READABILITY`

Selected16ではない。Tether実装を理由にAdmission rowを作らない。

### `repair_spanner`

Authoring Authority:

`HOLD_RETURN_FAMILY_OVERLAP`

non-selected return-family proofはhit semantics検証に使うがSelected16 caller proofとして数えない。

## `return_compass_needle`

Selected16 `RETURN_HOMING`。

現在:

- `HOMING_PRIORITY_SELECTION`: IMPLEMENTED
- `RETURNING_PROJECTILE`: MISSING

したがって `BLOCKED_MISSING_UNITY_PRIMITIVES` を維持する。

返投motion foundationだけでreturn capabilityを偽装しない。

## `TWO_TARGET_TETHER` implementation evidence

`U2EnemyTetherPairSelectionRuntime`

- caller-owned candidates / priority scores
- origin range / pair-distance band
- highest combined finite priority
- equal score -> shorter pair
- exact tie -> stable input order
- targetable only / XY only
- O(n^2), no LINQ/sort/internal List allocation

Generic primitiveはRain Thread / SOAK / damage / lifetime / position-control / LineRenderer / Canon値を持たない。

Executable proof:

- `scripts/quality/unity-two-target-tether/UnityTwoTargetTether.Contract.csproj`
- `scripts/quality/unity-two-target-tether/Program.cs`

Rain Thread caller proof:

- `scripts/quality/unity-rain-thread/UnityRainThread.Contract.csproj`
- `scripts/quality/unity-rain-thread/Program.cs`

## Shared primitive boundaries

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

1. Rain Thread Unity runtime evidence harness
2. rendered tether line / mobile readability
3. `return_compass_needle` Selected16 returning caller proof
4. `RETURNING_PROJECTILE` capability admission
5. runtime evidence / human live-admission review

数値balanceは最後まで `PROTOTYPE_TUNING_NOT_CANON` として原本/Canonから分離する。
