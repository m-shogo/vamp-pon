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

現在 **8 implemented**。

MISSINGには、各未実装archetype primitiveに加えて:

- `BREAK_STAGGER_APPLICATION`

を明示する。

現在 **14 missing**。

## Admission decisions

### `BLOCKED_MISSING_UNITY_PRIMITIVES`

required shared runtime capabilityが1つ以上MISSING。

### `BLOCKED_MISSING_UNITY_CALLER_PROOF`

shared primitiveはすべて揃っているが、Selected16固有caller proofが無い。

このdecisionは将来のanti-auto-promotion gateとして残す。

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

## `pavement_hammer` — audit-corrected blocker

Content Authority:

- Name: 石畳の小槌
- EARTH
- EXPOSED
- `SLAM_WAVE`
- slow close slam
- directional short pavement cracks
- **high break/stagger**

shared runtime evidence:

- `SLAM_WAVE_QUERY`: IMPLEMENTED
- `KNOCKBACK_VECTOR`: IMPLEMENTED
- `STATUS_APPLICATION`: IMPLEMENTED

しかしU2 runtimeを再監査したところ:

- HP damage APIはある
- Status stateはある
- knockbackはある
- **break gauge / stagger gauge / poise / break-stagger application APIは存在しない**

ことを確認した。

そのため新しいrequired capability:

`BREAK_STAGGER_APPLICATION = MISSING`

を追加する。

現在のrequired capabilities:

1. `SLAM_WAVE_QUERY`
2. `KNOCKBACK_VECTOR`
3. `BREAK_STAGGER_APPLICATION`
4. `STATUS_APPLICATION`

現在のdecision:

`BLOCKED_MISSING_UNITY_PRIMITIVES`

missing:

- `BREAK_STAGGER_APPLICATION`

caller proofもまだ無い。

### Why this correction matters

#194で `SLAM_WAVE_QUERY` を実装した直後は、当時のAdmissionモデル上 `pavement_hammer` がprimitive-completeに見えた。

しかしmechanical identityの **high break/stagger** をruntimeが表現できないままcallerだけ作ると、見た目だけ似た偽物になる。

したがって「queryは正しいがWeapon要件が1つ不足していた」と修正する。

この種の監査修正を優先し、早すぎるAdmissionをしない。

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

**MISSING**。

runtime semanticsをまだ決めていないため、名前だけIMPLEMENTEDにしない。

今後最低限検討する:

1. HPとは別meterか
2. threshold結果
3. accumulation / recovery
4. boss / elite resistance
5. hard-control Statusとの境界
6. damage / Status / knockbackとの適用順序
7. pool reset
8. telemetry

Canon balance値はshared primitiveから分離する。

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

1. `BREAK_STAGGER_APPLICATION` semantics設計
2. shared runtime + executable contract
3. `PavementHammerPrototypeRuntime` caller proof
4. EXPOSED / knockback / damage / break-stagger / wave timing authority分離
5. caller-owned telemetry
6. runtime capture
7. mobile pavement-crack visual
8. implementation-review Admission再判定

数値balanceは最後まで **PROTOTYPE_TUNING_NOT_CANON** として分離する。
