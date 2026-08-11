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

shared primitiveが増えても、live `WeaponEffectType` を名前だけ増やさない。

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

primitive完成だけで武器を自動昇格させないanti-auto-promotion gate。

### `ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

required primitiveがすべてIMPLEMENTEDで、Selected16固有callerも実コードで証明済み。

ここでいうadmittedはproduction/liveを意味しない。全entryの `runtimeStatus` はまだ `NOT_IMPLEMENTED`。

## Current result

**admitted=2**

**blocked=14**

implementation-review admitted:

- `ember_matchcase`
- `bellows_fan`

caller proof registryもこの2本だけ。

primitive-complete but caller-proof missing:

- `pavement_hammer`

## `ember_matchcase`

Content:

- FIRE
- BURN
- `SCATTER_PROJECTILE`

required:

- `MULTI_TARGET_PROJECTILE_SELECTION`
- `STATUS_APPLICATION`

`EmberMatchcasePrototypeRuntime` がtyped BURN requestとdeterministic multi-target projectile pathを接続済み。

caller-owned telemetryとprojectile-local prototype visual cueも実装済み。

Boundary:

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

`PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE`

## `bellows_fan`

Content:

- WIND
- DISORIENTED
- `CONE_PUSH`

required:

- `CONE_QUERY`
- `KNOCKBACK_VECTOR`
- `STATUS_APPLICATION`

`BellowsFanPrototypeRuntime` が:

1. deterministic cone query
2. typed DISORIENTED
3. outward knockback

を接続済み。

caller-owned telemetryは invocation / selection / Status outcome / knockback outcomeを記録する。

Boundary:

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

`PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE`

## `pavement_hammer` — primitive complete / caller pending

Content Authority:

- Name: 石畳の小槌
- EARTH
- EXPOSED
- `SLAM_WAVE`
- slow close slam
- directional short pavement cracks
- **high break/stagger**

required capabilities:

1. `SLAM_WAVE_QUERY`
2. `KNOCKBACK_VECTOR`
3. `BREAK_STAGGER_APPLICATION`
4. `STATUS_APPLICATION`

shared runtime evidence:

- `SLAM_WAVE_QUERY`: IMPLEMENTED
- `KNOCKBACK_VECTOR`: IMPLEMENTED
- `BREAK_STAGGER_APPLICATION`: IMPLEMENTED
- `STATUS_APPLICATION`: IMPLEMENTED

現在のdecision:

`BLOCKED_MISSING_UNITY_CALLER_PROOF`

missing shared primitive:

- none

caller proof:

- **MISSING**

つまりshared mechanicsは揃ったが、まだ `PavementHammerPrototypeRuntime` は存在せず、implementation-review Admissionへは上げない。

### Why this boundary matters

#194で `SLAM_WAVE_QUERY` を実装した時点ではbreak/staggerが実体化しておらず、mechanical identityの **high break/stagger** をruntimeが表現できなかった。

今回 `BREAK_STAGGER_APPLICATION` を本物の共有mechanicとして追加したことでprimitive blockerは解消した。ただしquery + knockback + break/stagger + Statusが揃っただけでは武器固有の適用順序・caller tuning・telemetryを証明できない。

そのため次のblockerをcaller proofへ正しく移す。

## Shared primitive boundaries

### `STATUS_APPLICATION`

- Status16 runtime state
- duration / stack / magnitude / cooldown policy
- pooled enemy ownership/reset/Tick
- typed request transport

をshared foundationとして持つ。

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

WIND / DISORIENTED / knockback / damageを持たない。

### `SLAM_WAVE_QUERY`

`U2EnemySlamWaveQueryRuntime`

- directional 2D sector-band
- caller `innerRadius / outerRadius`
- caller angle/cap
- nearest-first
- stable input-order tie
- invalid shape fail closed

`innerRadius=0` ならone-shot slam、callerがbandを進めればpropagating waveにも使える。

EARTH / EXPOSED / damage / break / stagger / knockback / timing / VFXを持たない。

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

- Pavement Hammer名 / EARTH / EXPOSED
- damage
- Canon break amount / threshold / duration
- passive recovery / decay
- boss / elite resistance
- VFX / SFX / camera shake
- telemetry policy
- live registry admission

Boss/elite resistanceや自然回復が必要になった場合は、武器値をここへ埋めず別policy layerとして追加する。

## Live boundary

現在のSelected16 prototype/shared workは、live `Stage1GameplayRuntimeCoordinator` に自動接続しない。

禁止:

- Web `weapons.ts` への自動追加
- LevelUp poolへの自動追加
- U47 executor enumの名前だけ追加
- save migrationの先行作成
- unsupported weaponをProjectile/GroundAreaへ偽装
- primitive実装だけでruntime auto-promotion

`runtimeAutoPromotionAllowed = false`

## CONTENT_MASTER boundary

Runtime進捗を理由にSelected16を勝手に変更しない。

- Holdへ降格しない
- Weapon nameを変えない
- Attribute / Statusを落とさない
- Character affinityを変えない
- Transformation graphを変えない

Runtime不足はRuntime不足として記録する。

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

1. `PavementHammerPrototypeRuntime` caller proof
2. EXPOSED / knockback / damage / break-stagger / wave timing authority分離
3. caller-owned telemetry
4. runtime capture
5. mobile pavement-crack visual
6. implementation-review Admission再判定

数値balanceは最後まで **PROTOTYPE_TUNING_NOT_CANON** として分離する。
