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

### Web runtime = 5

- `projectile`
- `radial_random_projectile`
- `bouncing_projectile`
- `ground_area`
- `orbit`

### Unity live executor = 2

U47 live importer/executorは引き続き `Projectile / GroundArea` の2系統。

shared primitiveやprototype callerが増えても、live `WeaponEffectType` を名前だけ増やさない。

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

### `BLOCKED_MISSING_UNITY_PRIMITIVES`

required shared runtime capabilityが1つ以上MISSING。

### `BLOCKED_MISSING_UNITY_CALLER_PROOF`

shared primitiveはすべて揃ったが、Selected16固有caller proofが無い。

### `ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

required primitiveがすべてIMPLEMENTEDで、Selected16固有callerも実コード + executable contractで証明済み。

これはlive/productionを意味しない。全entryの `runtimeStatus` は `NOT_IMPLEMENTED`。

## Current result

**admitted=4**

**blocked=12**

implementation-review admitted:

- `ember_matchcase`
- `bellows_fan`
- `pavement_hammer`
- `star_map_pin`

primitive-complete but caller-proof missing:

- `rain_thread`

## `rain_thread` — primitives complete / caller missing

Selected16 TETHER consumer。

required:

1. `TWO_TARGET_TETHER`
2. `STATUS_APPLICATION`

両方IMPLEMENTED。

ただしSelected16固有callerはまだ無いので:

`BLOCKED_MISSING_UNITY_CALLER_PROOF`

を維持する。

- `prototypeCallerImplemented = false`
- `mayEnterUnityRuntimeRegistry = false`
- `runtimeStatus = NOT_IMPLEMENTED`

SOAK共有、tether lifetime、position-control、damage semantics、line renderingはgeneric selectorへ埋め込まずcaller側の次gateで実装する。

## Hold boundary: `name_reel`

`name_reel` はAuthoring Authorityで:

`HOLD_TARGET_LINK_READABILITY`

Selected16ではない。

`TWO_TARGET_TETHER` 実装を理由にTitle1 Admission rowを作らない。Content selectionをruntime進捗から変更しない。

## Existing admitted callers

### `ember_matchcase`

`EmberMatchcasePrototypeRuntime`

- multi-target projectile
- typed BURN
- caller telemetry
- `PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE`

### `bellows_fan`

`BellowsFanPrototypeRuntime`

- cone query
- DISORIENTED
- knockback
- caller telemetry

### `pavement_hammer`

`PavementHammerPrototypeRuntime`

`QUERY_DAMAGE_SURVIVING_STATUS_KNOCKBACK_BREAK_STAGGER`

- directional slam
- damage-death short circuit
- EXPOSED
- knockback
- break/stagger
- caller telemetry

### `star_map_pin`

`StarMapPinPrototypeRuntime`

`PRIORITY_SELECT_TARGETED_PROJECTILE_MARKED_ON_HIT`

- priority selector
- explicit-target projectile
- typed MARKED on hit
- caller telemetry

全callerの数値は `CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`。

## `return_compass_needle`

Selected16 `RETURN_HOMING`。

現在:

- `HOMING_PRIORITY_SELECTION`: IMPLEMENTED
- `RETURNING_PROJECTILE`: MISSING

したがって:

`BLOCKED_MISSING_UNITY_PRIMITIVES`

を維持する。

返投motion foundationだけでreturn capabilityを偽装しない。

## Hold boundary: `repair_spanner`

`repair_spanner` はSelected16ではなく:

`HOLD_RETURN_FAMILY_OVERLAP`

現在のreturn-family prototype proofはhit semantics検証に再利用できるが、Selected16 caller proofとして数えない。Selected return familyは `return_compass_needle` を優先するAuthoring Authorityを維持する。

## `TWO_TARGET_TETHER` implementation evidence

`U2EnemyTetherPairSelectionRuntime`

- caller-owned candidate list
- caller-owned parallel priority scores
- caller origin range band
- caller pair-distance band
- highest combined finite priority wins
- equal score -> shorter pair
- exact tie -> stable input order
- targetable only
- XY distance only
- O(n^2), no LINQ/sort/internal List allocation

Generic primitiveが持たないもの:

- `rain_thread`
- SOAK
- damage
- link duration
- position-control policy
- LineRenderer / VFX
- Canon priority/range values

Executable proof:

- `scripts/quality/unity-two-target-tether/UnityTwoTargetTether.Contract.csproj`
- `scripts/quality/unity-two-target-tether/Program.cs`

## Other shared primitive boundaries

### `STATUS_APPLICATION`

Status16 state / duration / stack / magnitude / cooldown / typed request transport。Weapon固有tuningはcaller supplied。

### `KNOCKBACK_VECTOR`

caller direction/distance、targetable-only、Z preserve。Weapon identityやstun defaultなし。

### `CONE_QUERY`

caller range/angle/cap、nearest-first、stable tie。Weapon/Status/damageなし。

### `SLAM_WAVE_QUERY`

directional sector-band、caller radius/angle/cap。Weapon/damage/break/Statusなし。

### `BREAK_STAGGER_APPLICATION`

HPと独立したbreak accumulation / residual / stagger / knockback displacement preservation / reset。Canon threshold/durationなし。

### `HOMING_PRIORITY_SELECTION`

caller score/range、stable/near/far tie-break、XY target selection。Weapon/MARKED/boss semanticsなし。

## Live boundary

Selected16 prototype/shared workはlive `Stage1GameplayRuntimeCoordinator` に自動接続しない。

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

1. `rain_thread` Selected16 caller proof
2. two-target SOAK / position-control semantics
3. `return_compass_needle` Selected16 returning caller proof
4. `RETURNING_PROJECTILE` capability admission
5. runtime evidence / mobile readability / human live-admission review

数値balanceは最後まで `PROTOTYPE_TUNING_NOT_CANON` として原本/Canonから分離する。
