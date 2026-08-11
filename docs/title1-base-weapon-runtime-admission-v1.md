# ヨルノシルベ1 Base Weapon Runtime Admission v1

## Purpose

Content Masterで選定した **Selected16** を、既存runtimeへ形だけ押し込まないためのAdmission Gate。

Content側では16本ともTitle1採用のまま。Runtime側では必要primitiveが実装され、Selected16固有callerで実経路が証明されるまでfail closedする。

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

`MULTI_TARGET_PROJECTILE_SELECTION` は reusable scratch / targetable-only / deterministic nearest prefix / caller target cap / canonical target spawnまで実コードとCIで確認済み。

`STATUS_APPLICATION` はgeneric plumbingだけでなく、最初のSelected16固有caller `ember_matchcase` がtyped BURN requestを生成してmulti-target Projectileへ渡す経路まで実装したためIMPLEMENTEDへ昇格する。

## Current admission result

**admitted=1**

**blocked=15**

現在のadmitted ID:

- `ember_matchcase`

ここでいうadmittedは **ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW**。

意味しないもの:

- live weapon registryへ追加済み
- Stage1 LevelUp poolへ追加済み
- production balance確定
- art/VFX最終承認
- save migration完了

`runtimeStatus = NOT_IMPLEMENTED` のままなので、primitive admissionとproduction implementationを混同しない。

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
- Selected16固有BURN caller

まで接続済み。

そのため共通primitiveとして `STATUS_APPLICATION = IMPLEMENTED`。

ただしStatus16すべてのWeapon実装が完了した意味ではない。残り15本は各archetype固有primitiveが不足しているためblockedのまま。

## Never use fake projectile fallback

禁止:

- `bellows_fan` をただのProjectileにする
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
- Selected16 caller `ember_matchcase`: **prototype caller implemented**
- `KNOCKBACK_VECTOR`: missing
- delayed trigger/timer primitive: missing
- persistent placement primitive: missing

次は `ember_matchcase` のproduction readinessを上げるより先に、prototype実行telemetry / mobile visual cue / runtime captureを追加し、実機で「数本だけ散らす」読みやすさを確認する。

### Wave B — target selection / path executors

- `TARGET_CHAIN_SELECTION`: missing
- `HOMING_PRIORITY_SELECTION`: missing
- `LINE_PIERCE_RESIDUE`: missing
- `RETURNING_PROJECTILE`: missing
- `CONE_QUERY`: missing

対象例:

- 銅の音叉
- 星図のピン
- 灯芯針
- 帰針
- 送り風の扇

### Wave C — advanced interaction executors

- `TWO_TARGET_TETHER`
- `REFLECT_WINDOW`
- `VEIL_TRACKING_FRICTION`
- `ORBIT_LINK`
- `SPIRAL_FIELD`
- `LANE_BOUNDARY_TRIGGER`
- `SWEEP_QUERY`

対象例:

- 雨縫い糸
- ひび鏡
- 黒折り扇
- 修理糸車
- 眠り紐
- 境界チョーク
- 白い消しゴム

## Why WeaponEffectType remains two

`WeaponEffectType` enumへ名前だけ増やしてもexecutorが動かなければ意味がない。

今回 `ember_matchcase` はlive U47 importerへ追加せず、Selected16 prototype callerとして再利用primitiveを実証する。

Admissionは:

- Content Authorityがある
- required primitiveが実装済み
- typed Status pathがある
- Selected16固有callerがある
- checkerでchainを証明する

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
- `EmberMatchcasePrototypeRuntime` selected-specific caller
- BURN request uses caller-supplied policy
- `ember_matchcase` live registry entry = 0

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

`ember_matchcase` の次工程:

1. prototype invocation telemetry
2. BURN apply telemetry
3. mobile-safe small ember visual cue
4. runtime capture / simulator evidence
5. target数・spread feelのprototype tuning
6. live registry / LevelUp poolへ入れるか人間承認

この順序で進め、数値balanceは最後までprototype tuningとして分離する。
