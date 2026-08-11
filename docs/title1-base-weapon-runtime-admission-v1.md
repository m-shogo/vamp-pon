# ヨルノシルベ1 Base Weapon Runtime Admission v1

## Purpose

Content Masterで選定した **Selected16** を、既存runtimeへ形だけ押し込まないためのAdmission Gate。

Content側では16本ともTitle1採用のまま。Runtime側では、必要なshared primitiveに加えて **Selected16固有callerの実経路** が証明されるまでfail closedする。

## Cross-runtime reality

### Web runtime = 5 effect types

既存Authorityは `src/game/domain/weaponRuntimeCapabilities.ts`。

1. `projectile`
2. `radial_random_projectile`
3. `bouncing_projectile`
4. `ground_area`
5. `orbit`

Webの5typeをUnity production-readyの証拠には使わない。

`webRuntimeSupportEqualsUnityRuntimeSupport = false`

### Unity runtime = 2 executor types

U47 live importer/executor分類は引き続き **Projectile / GroundArea** の2系統。

一方、再利用可能primitiveは先に増やしている。

現在Admission SourceがIMPLEMENTEDと認めるprimitive:

1. `NEAREST_TARGET_PROJECTILE`
2. `MULTI_PROJECTILE_LOOP`
3. `CIRCULAR_GROUND_AREA`
4. `MULTI_TARGET_PROJECTILE_SELECTION`
5. `STATUS_APPLICATION`
6. `KNOCKBACK_VECTOR`
7. `CONE_QUERY`
8. `SLAM_WAVE_QUERY`

`MULTI_TARGET_PROJECTILE_SELECTION` は reusable scratch / targetable-only / deterministic nearest prefix / caller target cap / canonical target spawnまで実コードとCIで確認済み。

`STATUS_APPLICATION` はgeneric plumbingだけでなく、Selected16固有callerがtyped Status requestを実際にshared enemy Status stateへ接続している。

`KNOCKBACK_VECTOR` は `U2EnemyKnockbackRuntime` がtargetable enemyへcaller supplied方向・距離の2D displacementを適用するshared primitive。velocity / stun / duration / default distance / weapon identityは持たず、次のenemy Tickから通常追跡へ戻る。

`CONE_QUERY` は `U2EnemyConeQueryRuntime` がcaller supplied origin / facing / range / half-angle / target capでtargetable enemyを抽出し、nearest-firstかつ入力順tie-breakでcaller-owned scratchへ返す。weapon identity、damage、Status、knockback tuningは持たない。

`SLAM_WAVE_QUERY` は `U2EnemySlamWaveQueryRuntime` がcaller supplied `innerRadius / outerRadius` と方向sectorで対象を抽出するshared primitive。`innerRadius=0` の一撃slamにも、caller側でbandを前進させるpropagating ground waveにも使えるが、timing / damage / break / stagger / Status / knockbackは持たない。

## Caller-proof gate

shared primitiveが揃っただけでSelected16を自動Admissionしない。

Admissionには次の両方が必要:

1. `missingUnityCapabilities.length === 0`
2. `prototypeCallerImplemented === true`

primitiveが揃ってもcaller proofが無い場合は:

`BLOCKED_MISSING_UNITY_CALLER_PROOF`

とする。

これにより、将来shared primitiveを追加しただけで別Weaponが勝手にimplementation-reviewへ上がることを防ぐ。

現在caller proofを持つID:

- `ember_matchcase`
- `bellows_fan`

現在、このgateを実際に証明する最初の例が `pavement_hammer`。`SLAM_WAVE_QUERY / KNOCKBACK_VECTOR / STATUS_APPLICATION` はすべて揃ったが、Selected16固有callerが無いため **primitive-completeのまま `BLOCKED_MISSING_UNITY_CALLER_PROOF`** で停止する。

## Current admission result

**admitted=2**

**blocked=14**

現在のadmitted ID:

- `ember_matchcase`
- `bellows_fan`

ここでいうadmittedは **ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW**。

意味しないもの:

- live weapon registryへ追加済み
- Stage1 LevelUp poolへ追加済み
- production balance確定
- art/VFX最終承認
- save migration完了

両方とも `runtimeStatus = NOT_IMPLEMENTED` のまま。

## First vertical slice — ember_matchcase

Content Authority:

- ID: `ember_matchcase`
- Name: 火種のマッチ箱
- Archetype: `SCATTER_PROJECTILE`
- Attribute: FIRE
- Status: BURN

Unity prototype caller:

`EmberMatchcasePrototypeRuntime`

役割:

- `EnemyStatusRuntimeKind.Burn` のtyped requestを作る
- `FireGameplayProjectilesAtNearestTargets(...)` を使う
- damage / pierce / target数をcallerから受け取る
- BURN duration / stack / magnitude / internal cooldownを含む `EnemyStatusApplicationPolicy` もcallerから受け取る

固定しない:

- BURN何秒
- BURN damage値
- maxTargets
- cooldown
- projectile damage
- pierce

Authority label:

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

つまり **PROTOTYPE_TUNING_NOT_CANON** を守り、検証用数値がContent Canonへ逆流しない。

## Second vertical slice — bellows_fan

Content Authority:

- ID: `bellows_fan`
- Name: 送り風の扇
- Archetype: `CONE_PUSH`
- Attribute: WIND
- Status: DISORIENTED

Unity prototype caller:

`BellowsFanPrototypeRuntime`

実経路:

1. caller supplied facing/range/half-angle/maxTargetsを `U2EnemyConeQueryRuntime.SelectTargets(...)` へ渡す
2. targetableかつcone内の対象をnearest-firstで決定する
3. typed `EnemyStatusRuntimeKind.Disoriented` requestを対象のshared `Statuses` へ適用する
4. 同じ対象へ `U2EnemyKnockbackRuntime.TryApply(...)` でoriginから外向きのpushを適用する

固定しない:

- cone range
- cone angle
- target cap
- knockback distance
- DISORIENTED duration
- DISORIENTED magnitude / stack / cooldown
- damage
- VFX

Authority:

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

Runtime boundary:

`PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE`

つまりcone + knockback + DISORIENTEDの実経路は証明したが、Stage1 live loopにはまだ接続していない。

`BellowsFanPrototypeTelemetry` もcaller-ownedで実装済み。invocation / requested capacity / selected target / DISORIENTED apply result / knockback resultを観測し、balance defaultやglobal lifetimeは持たない。

## STATUS_APPLICATION boundary

Status共通基盤:

- Status16 runtime state
- duration / stack / magnitude / refresh policy
- independent internal cooldown ledger
- Boss hard-control disposition
- `U2EnemyActor` ownership / pool reset / Tick
- typed `EnemyStatusApplicationRequest`
- Projectile optional Status transport
- damage → surviving target Status → projectile consume順序
- pooled Projectile request reset
- `ember_matchcase` BURN caller
- `bellows_fan` DISORIENTED caller

まで接続済み。

そのため共通primitiveとして `STATUS_APPLICATION = IMPLEMENTED`。

Status16すべてのWeapon実装が完了した意味ではない。

## KNOCKBACK_VECTOR boundary

Shared helper:

`U2EnemyKnockbackRuntime`

役割:

- targetable enemyだけを受け付ける
- caller方向を2D normalizeする
- caller距離だけpositionへ瞬間的に加算する
- zは維持する
- zero vector / non-positive distance / null / untargetableはfail closed

固定しない:

- knockback distance
- duration / deceleration
- stun
- boss resistance
- cone angle
- slam shape
- weapon identity

`bellows_fan` はSelected16 callerでこのshared primitiveを実際に利用する。

`pavement_hammer` も `KNOCKBACK_VECTOR` を利用可能で、さらに `SLAM_WAVE_QUERY` と `STATUS_APPLICATION` も揃った。ただし固有caller proofが無いため、まだimplementation-review Admissionへは進まない。

## CONE_QUERY boundary

Shared helper:

`U2EnemyConeQueryRuntime`

役割:

- caller-owned candidate source / result scratch
- targetable-only
- caller supplied origin / forward / range / half-angle / cap
- 2D query
- nearest-first
- equal-distanceはcandidate input orderを維持するstable tie-break
- invalid range / angle / forward / capはfail closed

固定しない:

- Weapon ID
- WIND属性
- DISORIENTED
- damage
- knockback
- VFX
- default range / angle / cap

`black_folding_fan` もshared `CONE_QUERY` を利用できる証拠は得たが、固有primitive `VEIL_TRACKING_FRICTION` がmissingなのでblockedのまま。

shared cone実装だけでは他Weaponを自動Admissionしない。

## SLAM_WAVE_QUERY boundary

Shared helper:

`U2EnemySlamWaveQueryRuntime`

役割:

- caller-owned candidate source / result scratch
- targetable-only
- caller supplied origin / forward
- caller supplied `innerRadius / outerRadius`
- caller supplied half-angle / cap
- directional 2D sector-band query
- inner/outer boundary inclusive
- nearest-first
- equal-distanceはcandidate input orderを維持するstable tie-break
- candidate/result aliasはreject
- invalid radius / angle / forward / capはfail closed

`innerRadius=0` ならone-shot directional slamとして使える。callerが時間ごとにinner/outerを前進させればpropagating waveのqueryにも使える。

固定しない:

- `pavement_hammer` identity
- EARTH
- EXPOSED
- damage
- break / stagger
- knockback distance
- Status policy
- cast timing / wave speed / lifetime
- VFX

`pavement_hammer` はこのprimitive追加でrequired primitiveがすべてIMPLEMENTEDになったが、caller proofを持たないため:

`BLOCKED_MISSING_UNITY_CALLER_PROOF`

のまま。これがshared primitiveとSelected16固有実装を分離するAdmission gateの実証になる。

## Never use fake projectile fallback

禁止:

- `bellows_fan` をただのProjectileにする
- `pavement_hammer` を色違いGroundArea/Projectileとして済ませる
- `rain_thread` を色違い弾にする
- `pocket_mirror` をdamage弾にする
- `repair_thread_spool` をWebの`orbit`があるという理由だけでUnity実装済みにする
- `sleep_ribbon` を円形GroundAreaとして実装済み扱いする

`fake projectile` fallbackは許可しない。

`contentSelectionMayBeDowngradedToFitRuntime = false`

## Implementation waves

Waveは優先順であり時間見積もりではない。

### Wave A — shared combat primitives

現在:

- enemy Status container + expiry: **implemented**
- typed Projectile Status transport: **implemented**
- `STATUS_APPLICATION`: **implemented**
- multi-target query: **implemented**
- `KNOCKBACK_VECTOR`: **implemented**
- `CONE_QUERY`: **implemented**
- `SLAM_WAVE_QUERY`: **implemented**
- Selected16 caller `ember_matchcase`: **prototype caller implemented**
- Selected16 caller `bellows_fan`: **prototype caller implemented**
- `pavement_hammer`: **primitive complete / caller proof missing**
- Ember invocation/BURN telemetry: **implemented**
- Bellows invocation/selection/DISORIENTED/knockback telemetry: **implemented**
- Ember mobile-safe projectile visual cue: **implemented, prototype visual only**
- delayed trigger/timer primitive: missing
- persistent placement primitive: missing

### Wave B — target selection / path executors

- `TARGET_CHAIN_SELECTION`: missing
- `HOMING_PRIORITY_SELECTION`: missing
- `LINE_PIERCE_RESIDUE`: missing
- `RETURNING_PROJECTILE`: missing
- `CONE_QUERY`: **implemented**
- `SLAM_WAVE_QUERY`: **implemented**

`bellows_fan` はtelemetryまで実装済み。次はcone edge / maxTargets / dense-waveのruntime captureと、mobileで「扇状に押す」と読めるairflow / push visual cueを追加する。

`pavement_hammer` はshared primitiveが揃ったため、次は `PavementHammerPrototypeRuntime` の固有caller proof。EXPOSED / knockback / damage / break-stagger / wave timingをcaller-ownedに分離したまま実経路を証明する。

### Wave C — advanced interaction executors

- `TWO_TARGET_TETHER`
- `REFLECT_WINDOW`
- `VEIL_TRACKING_FRICTION`
- `ORBIT_LINK`
- `SPIRAL_FIELD`
- `LANE_BOUNDARY_TRIGGER`
- `SWEEP_QUERY`

## Why WeaponEffectType remains two

`WeaponEffectType` enumへ名前だけ増やしてもexecutorが動かなければ意味がない。

今回のSelected16 prototype/shared primitiveはlive U47 importerへ追加せず、shared primitive + selected-specific callerとして実証する。

Admissionは:

- Content Authorityがある
- required primitiveが実装済み
- Selected16固有caller proofがある
- checker / executable contractでchainを証明する

までをimplementation review admissionとする。

Live registryは別gate。

## Existing code evidence

Current source evidence:

- Web Authority = 5 current effect types
- Unity `WeaponEffectType { Projectile, GroundArea }`
- U47 importer accepts only `projectile` / `ground_area`
- Stage1 live coordinatorは既存Projectile / GroundAreaのみ
- Unity deterministic multi-target target-selection primitive
- Unity typed optional Projectile Status request transport
- Unity Enemy Status16 state / lifecycle ownership
- Unity caller-supplied `KNOCKBACK_VECTOR`
- Unity caller-supplied deterministic `CONE_QUERY`
- Unity caller-supplied deterministic sector-band `SLAM_WAVE_QUERY`
- `EmberMatchcasePrototypeRuntime` selected-specific caller
- `BellowsFanPrototypeRuntime` selected-specific caller
- `pavement_hammer` caller proof = 0
- BURN / DISORIENTED policyはcaller supplied
- Ember caller-owned telemetry + projectile-local prototype visual cue
- Bellows caller-owned invocation/selection/Status/knockback telemetry
- `ember_matchcase` live registry entry = 0
- `bellows_fan` live registry entry = 0
- `pavement_hammer` live registry entry = 0

これらが変わったらAdmission checkerを更新しない限りCIを落とす。

## CONTENT_MASTER boundary

Selected16のRuntime進捗が違ってもContent Masterを勝手に変えない。

- Hold4へ降格しない
- 名前を消さない
- Character affinityを変えない
- Stage用途を消さない
- Transformation graphを勝手に変えない

Runtime不足をContent不足として処理しない。

## Next implementation gate

`ember_matchcase`:

1. runtime capture / simulator evidenceでtelemetry + visual cue + rendered evidenceを同一runへ束ねる
2. target数・spread feelをprototype tuningとして調整する
3. mobile readabilityとpool resetを目視確認する
4. live registry / LevelUp poolへ入れるか人間承認する

`bellows_fan`:

1. caller-owned invocation / selected-target / DISORIENTED / knockback telemetry: **implemented**
2. cone edge / maxTargets / dense-wave runtime capture
3. mobile-safe airflow / push visual cue
4. telemetry + rendered evidenceを同一runへ束ねる
5. live registry / LevelUp poolへ入れるか人間承認する

`pavement_hammer`:

1. `SLAM_WAVE_QUERY`: **implemented**
2. `KNOCKBACK_VECTOR`: **implemented**
3. `STATUS_APPLICATION`: **implemented**
4. Selected16固有 `PavementHammerPrototypeRuntime` caller proof
5. EXPOSED / knockback / damage / break-stagger / wave timingのauthority分離
6. executable contract + telemetry
7. runtime capture / mobile crack-wave visual
8. implementation-review Admission再判定

数値balanceは最後までprototype tuningとして分離する。
