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
10. `HOMING_PRIORITY_SELECTION`

現在 **10 implemented**。

現在 **12 missing**。

`U2ReturningProjectileMotionRuntime` はshared motion foundationとして実装済みだが、hit/pool/caller統合まで終わる前に `RETURNING_PROJECTILE` capabilityを自動昇格しない。

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

**admitted=4**

**blocked=12**

implementation-review admitted:

- `ember_matchcase`
- `bellows_fan`
- `pavement_hammer`
- `star_map_pin`

caller proof registryもこの4本。

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

Boundary:

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

`PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE`

現在のdecision:

`ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

ただし `runtimeStatus = NOT_IMPLEMENTED` で、Web / LevelUp / live Stage1 / U47 executorへは未接続。

## `star_map_pin` — caller implemented / not live

required:

1. `HOMING_PRIORITY_SELECTION`
2. `STATUS_APPLICATION`

shared runtime evidenceは両方IMPLEMENTED。

Selected16 caller proof:

`StarMapPinPrototypeRuntime`

Application order:

`PRIORITY_SELECT_TARGETED_PROJECTILE_MARKED_ON_HIT`

1. caller-owned candidate list / priority scoreからshared selectorでtarget決定
2. caller supplied range / tie-breakを使用
3. 既存 `FireGameplayProjectileAtTarget(...)` へ選択targetを渡す
4. typed `MARKED` requestをprojectileへtransport
5. MARKEDはprojectile hit時に適用
6. selection / projectile fire / Status resultをcaller-owned telemetryへ記録

Priority score、range、tie-break、damage、pierce、MARKED policyはすべてcaller supplied。

Boundary:

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

`PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE`

現在のdecision:

`ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

ただし:

- `runtimeStatus = NOT_IMPLEMENTED`
- Web live catalog未接続
- LevelUp未接続
- `Stage1GameplayRuntimeCoordinator`未接続
- U47 live executor未拡張
- final VFX / readability未承認

## `return_compass_needle` — homing side only advanced

`RETURN_HOMING` が必要とするうち:

- `HOMING_PRIORITY_SELECTION`: IMPLEMENTED
- `RETURNING_PROJECTILE`: MISSING

返投用の純粋motion foundation `U2ReturningProjectileMotionRuntime` は存在するが、hit / pool / Selected16 caller統合前なのでcapabilityはまだMISSINGのまま維持する。

したがって引き続き:

`BLOCKED_MISSING_UNITY_PRIMITIVES`

priority selectorやmotion foundationだけでreturn projectileを偽装しない。

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

### `BREAK_STAGGER_APPLICATION`

`U2EnemyBreakStaggerRuntime` + `U2EnemyBreakStaggerState` + pooled `U2EnemyBreakStaggerDriver`。

- HPとは独立したbreak accumulation
- caller supplied amount / threshold / stagger duration
- residual gauge
- normal pursuit suppression
- knockback displacement preservation
- death/pool reset

### `HOMING_PRIORITY_SELECTION`

`U2EnemyHomingPrioritySelectionRuntime`

- caller-owned candidate list
- caller-owned parallel priority scores
- caller min/max range
- highest finite priority wins
- equal priority時は `StableInputOrder / PreferNearer / PreferFarther`
- XY distance only
- inclusive range boundaries
- targetable-only
- O(n), internal list/sortなし

Generic selectorが持たないもの:

- `star_map_pin` / `return_compass_needle`
- MARKED
- boss / elite定義
- HP priority
- damage / crit
- projectile spawn
- homing curve
- Canon priority score / range

priorityの意味はcaller/別runtime authorityがscoreへ変換する。

## Pavement Hammer executable proof

- `unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/PavementHammerPrototypeRuntime.cs`
- `scripts/quality/unity-pavement-hammer/UnityPavementHammer.Contract.csproj`
- `scripts/quality/unity-pavement-hammer/Program.cs`

TEST_ONLY contractでdamage-death short circuit / EXPOSED / knockback / break threshold / residual / stagger / telemetryを検証する。

## Homing priority executable proof

- `unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyHomingPrioritySelectionRuntime.cs`
- `scripts/quality/unity-homing-priority-selection/UnityHomingPrioritySelection.Contract.csproj`
- `scripts/quality/unity-homing-priority-selection/Program.cs`

TEST_ONLY contractでpriority / range / targetability / 2D distance / far-near-stable tie / invalid inputを検証する。

## Star Map Pin executable proof

- `unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/StarMapPinPrototypeRuntime.cs`
- `scripts/quality/unity-star-map-pin/UnityStarMapPin.Contract.csproj`
- `scripts/quality/unity-star-map-pin/Program.cs`

TEST_ONLY contractでpriority target selection / explicit target projectile / MARKED transport / hit result observer / cooldown独立 / projectile rejection / telemetryを検証する。

数値は **NOT_CANON**。

## Live boundary

現在のSelected16 prototype/shared workは、live `Stage1GameplayRuntimeCoordinator` に自動接続しない。

禁止:

- Web `weapons.ts` への自動追加
- LevelUp poolへの自動追加
- U47 executor enumの名前だけ追加
- save migrationの先行作成
- unsupported weaponをProjectile/GroundAreaへ偽装
- prototype/shared primitiveだけでruntime auto-promotion

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

- local Unity runtime evidence実行
- rendered pavement impact / stagger readability
- telemetry + rendered evidence同一run
- human live-admission review

### Star Map Pin

- Unity runtime evidence harness
- priority selection / targeted projectile / MARKED telemetryを同一runへ束ねる
- mobile-safe pin / target-point visual cue
- human live-admission review

### Returning projectile

- `U2ReturningProjectileMotionRuntime` foundationをpooled hit semanticsへ接続
- outbound / return hit tableをcaller-ownedに維持
- `repair_spanner` を最初のSelected16 caller候補として実装
- その後に `RETURNING_PROJECTILE` capability昇格を検討

数値balanceは最後まで **PROTOTYPE_TUNING_NOT_CANON** として原本/Canonから分離する。
