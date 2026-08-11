# ヨルノシルベ1 Base Weapon Runtime Admission v1

## Purpose

Content Masterで選定した **Selected16** を、既存runtimeへ形だけ押し込まないためのAdmission Gate。

Content選定とRuntime実装を分離する。

- Content側のSelected16は固定
- Web live catalogは別Authority
- Unity shared primitiveは再利用可能な実装証拠
- Selected16固有caller proofは別gate
- live registry / LevelUp / balance / VFX承認はさらに別gate

不足を隠すための `fake projectile` fallbackは禁止。

`contentSelectionMayBeDowngradedToFitRuntime = false`

## Cross-runtime reality

### Web runtime = 5 effect types

既存Web Authority:

1. `projectile`
2. `radial_random_projectile`
3. `bouncing_projectile`
4. `ground_area`
5. `orbit`

Web supportをUnity implementation evidenceとして扱わない。

### Unity runtime = 2 live executor types

U47 live importer/executorは引き続き **Projectile / GroundArea** の2系統。

shared primitiveやprototype callerが増えても、live `WeaponEffectType` を名前だけ増やさない。

## Shared Unity primitive state

IMPLEMENTED:

1. `NEAREST_TARGET_PROJECTILE`
2. `MULTI_PROJECTILE_LOOP`
3. `CIRCULAR_GROUND_AREA`
4. `MULTI_TARGET_PROJECTILE_SELECTION`
5. `STATUS_APPLICATION`
6. `KNOCKBACK_VECTOR`
7. `CONE_QUERY`
8. `SLAM_WAVE_QUERY`
9. `BREAK_STAGGER_APPLICATION`

現在 **9 implemented**。

現在 **13 missing**。

## Admission decisions

### `BLOCKED_MISSING_UNITY_PRIMITIVES`

required shared runtime capabilityが1つ以上MISSING。

### `BLOCKED_MISSING_UNITY_CALLER_PROOF`

shared primitiveはすべて揃っているが、Selected16固有caller proofが無い。

primitive完成だけで武器を自動昇格させないanti-auto-promotion gateとして残す。

### `ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

required primitiveがすべてIMPLEMENTEDで、Selected16固有callerも実コード + executable contractで証明済み。

ここでいうadmittedはproduction/liveを意味しない。全entryの `runtimeStatus` はまだ `NOT_IMPLEMENTED`。

## Current result

**admitted=3**

**blocked=13**

implementation-review admitted:

- `ember_matchcase`
- `bellows_fan`
- `pavement_hammer`

caller proof registryもこの3本。

primitive-complete but caller-proof missing:

- none

## `ember_matchcase`

Existing caller:

`EmberMatchcasePrototypeRuntime`

- deterministic multi-target projectile path
- typed BURN request
- caller-owned telemetry
- prototype visual cue

Boundary:

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

`PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE`

## `bellows_fan`

Existing caller:

`BellowsFanPrototypeRuntime`

1. deterministic cone query
2. typed DISORIENTED
3. outward knockback
4. caller-owned telemetry

Boundary:

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

`PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE`

## `pavement_hammer` — caller implemented / not live

既存Content Authorityはこのruntime作業では変更しない。

required capabilities:

1. `SLAM_WAVE_QUERY`
2. `KNOCKBACK_VECTOR`
3. `BREAK_STAGGER_APPLICATION`
4. `STATUS_APPLICATION`

shared runtime evidenceは4つともIMPLEMENTED。

Selected16 caller proof:

`PavementHammerPrototypeRuntime`

Callerが明示的に接続する順序:

`QUERY_DAMAGE_SURVIVING_STATUS_KNOCKBACK_BREAK_STAGGER`

1. deterministic sector-band query
2. caller supplied damage
3. damage後も生存したtargetだけtyped EXPOSED application
4. outward knockback
5. break accumulation / threshold / stagger
6. caller-owned telemetry

倒れたtargetにはdamage後のStatus / knockback / break-staggerを適用しない。

EXPOSEDのinternal cooldownでStatusがblockされても、独立mechanicであるdamage / knockback / break-staggerは継続できる。

全数値はcaller supplied:

- inner / outer radius
- half-angle
- max target count
- damage
- damage flash duration
- knockback distance
- break amount
- break threshold
- stagger duration
- EXPOSED application policy

Boundary:

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

`PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE`

現在のdecision:

`ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

ただし:

- `runtimeStatus = NOT_IMPLEMENTED`
- Web live catalog未接続
- LevelUp未接続
- Stage1GameplayRuntimeCoordinator未接続
- U47 live executor未拡張

なのでproduction/liveを意味しない。

## Shared primitive boundaries

### `STATUS_APPLICATION`

- Status16 runtime state
- duration / stack / magnitude / cooldown policy
- pooled enemy ownership/reset/Tick
- typed request transport

Weapon固有のStatus tuningはcaller supplied。

### `KNOCKBACK_VECTOR`

`U2EnemyKnockbackRuntime`

- targetable-only
- caller direction normalize
- caller distance displacement
- z preserve
- zero/null/untargetable fail closed
- generic post-displacement signal

velocity / stun / duration / default distanceを持たない。

### `CONE_QUERY`

`U2EnemyConeQueryRuntime`

- caller candidates/results
- caller origin/facing/range/angle/cap
- targetable-only
- nearest-first
- stable input-order tie

Weapon identity / Status / knockback / damageを持たない。

### `SLAM_WAVE_QUERY`

`U2EnemySlamWaveQueryRuntime`

- directional 2D sector-band
- caller `innerRadius / outerRadius`
- caller angle/cap
- nearest-first
- stable input-order tie
- invalid shape fail closed

`innerRadius=0` ならone-shot slam、callerがbandを進めればpropagating waveにも使える。

Weapon identity / Status / damage / break / stagger / knockback / timing / VFXを持たない。

### `BREAK_STAGGER_APPLICATION`

`U2EnemyBreakStaggerRuntime` + `U2EnemyBreakStaggerState` + pooled `U2EnemyBreakStaggerDriver`。

Semantics:

1. HPとは独立したbreak accumulation
2. caller supplied `breakAmount`
3. caller supplied `breakThreshold`
4. threshold到達時だけstagger trigger
5. threshold超過分はresidual gaugeとして保持
6. caller supplied `staggerDurationSeconds`
7. active staggerは通常追跡移動を抑止
8. `KNOCKBACK_VECTOR` の外力移動はstagger中も保持
9. dying / pooled disableでstate clear
10. invalid / null / untargetable inputはfail closed

Shared primitiveが持たないもの:

- Weapon固有Content identity
- damage
- Canon break amount / threshold / duration
- passive recovery / decay
- boss / elite resistance
- VFX / SFX / camera shake
- caller telemetry policy
- live registry admission

Boss/elite resistanceや自然回復が必要になった場合は、武器値をここへ埋めず別policy layerとして追加する。

## Pavement Hammer executable proof

- `unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/PavementHammerPrototypeRuntime.cs`
- `scripts/quality/unity-pavement-hammer/UnityPavementHammer.Contract.csproj`
- `scripts/quality/unity-pavement-hammer/Program.cs`

Executable contractはTEST_ONLY値で:

- sector-band selection
- nearest-first order
- damage-death short circuit
- surviving EXPOSED application
- independent Status internal cooldown
- outward knockback
- two-hit break threshold crossing
- residual break gauge
- stagger duration
- caller telemetry
- invalid tuning fail closed

を検証する。

TEST_ONLY数値は **NOT_CANON**。

## Live boundary

現在のSelected16 prototype/shared workは、live `Stage1GameplayRuntimeCoordinator` に自動接続しない。

禁止:

- Web `weapons.ts` への自動追加
- LevelUp poolへの自動追加
- U47 executor enumの名前だけ追加
- save migrationの先行作成
- unsupported weaponをProjectile/GroundAreaへ偽装
- prototype caller実装だけでruntime auto-promotion

`runtimeAutoPromotionAllowed = false`

## CONTENT_MASTER boundary

Runtime進捗を理由にSelected16を勝手に変更しない。

- Holdへ降格しない
- Weapon nameを変えない
- Attribute / Statusを落とさない
- Character affinityを変えない
- Transformation graphを変えない

原本/Canonは別作業のAuthorityとし、このruntime作業から書き換えない。

## Next gates

### Ember

- telemetry + visual + rendered runtime evidenceを同一runへ束ねる
- mobile readability / pool reset確認
- human live-admission review

### Bellows

- cone edge / dense-wave runtime capture
- mobile-safe airflow / push visual cue
- telemetry + rendered evidence同一run
- human live-admission review

### Pavement Hammer

1. runtime evidence capture
2. caller telemetryとrendered evidenceを同一runへ束ねる
3. mobile pavement-crack visual cue
4. break/stagger readability
5. human live-admission review

数値balanceは最後まで **PROTOTYPE_TUNING_NOT_CANON** として原本/Canonから分離する。
