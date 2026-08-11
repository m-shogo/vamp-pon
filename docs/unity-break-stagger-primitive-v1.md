# Unity Break / Stagger Primitive v1

Status: `IMPLEMENTED_SHARED_PRIMITIVE / NOT_LIVE / NOT_CANON_TUNING`

## Purpose

Selected16のmechanical identityで必要になる `BREAK_STAGGER_APPLICATION` を、HP damage・Status・knockbackとは独立した再利用可能なUnity gameplay primitiveとして実装する。

このprimitiveは特定Weaponのbalanceや名前を所有しない。

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## Runtime source

- `unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyBreakStaggerRuntime.cs`
- `unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyKnockbackRuntime.cs`

Main pieces:

- `U2EnemyBreakStaggerState`
- `U2EnemyBreakStaggerDriver`
- `U2EnemyBreakStaggerRuntime`
- `U2EnemyBreakStaggerApplyResult`
- `U2EnemyBreakStaggerSnapshot`

## Semantics

### HPとは独立したmeter

`AccumulatedBreak` はenemy HPと別state。

Callerが毎回明示する:

- `breakAmount`
- `breakThreshold`
- `staggerDurationSeconds`

共有primitiveにはCanon default値を置かない。

### Threshold / residual

breakがthreshold未満なら蓄積だけ行う。

thresholdへ到達したapplicationは1回のstagger eventを発生させ、threshold超過分を **residual** gaugeとして残す。

1回の巨大なbreak入力から複数回のstaggerやstacked stunを自動生成しない。

### Stagger duration

trigger時にcaller supplied durationを使用する。

すでにstagger中なら、短い新durationで現在のstaggerを短縮せず、longer durationのみ延長できる。

### Movement suppression

`U2EnemyBreakStaggerDriver` はbreak/staggerが初めて必要になったenemyへlazy attachされる。

U2の通常追跡は既存 `U2EnemyActor.Tick` が行うため、driverは `LateUpdate` でstagger開始位置へ戻し、stagger中の**自発的な追跡移動だけ**を抑止する。

U2BattleControllerへWeapon固有fieldやbreak tuningを埋め込まない。

### knockbackとの共存

stagger中に `KNOCKBACK_VECTOR` が適用された場合、その外力移動まで巻き戻してはいけない。

そのため `U2EnemyKnockbackRuntime` はgenericなpost-displacement event `EnemyDisplaced` を発火する。

Break/Stagger側だけがそのsignalを購読し、現在のfreeze anchorを新しい位置へ更新する。

Knockback primitiveはBreak/Stagger実装へ直接依存しない。

### pool / death reset

- enemyがuntargetable / dyingになったらstate clear
- component disable時にもstate clear
- pooled enemyが次spawnへbreak gaugeやstagger timerを持ち越さない

### Fail closed

拒否する:

- null enemy
- untargetable enemy
- non-finite / non-positive break amount
- non-finite / non-positive threshold
- non-finite / non-positive stagger duration
- negative / non-finite Tick delta

## Explicit non-ownership

このprimitiveは以下を持たない:

- Weapon固有名
- EARTH / EXPOSEDなどContent identity
- damage
- Canon break amount
- Canon threshold
- Canon stagger duration
- passive break recovery / decay
- boss / elite resistance
- hard-control Status変換
- VFX / SFX / haptic / camera shake
- telemetry policy
- LevelUp / registry admission

必要になったboss/elite resistanceや自然回復は別policy layerとして追加し、Weapon値を共有primitiveへ埋め込まない。

## Pavement Hammer boundary

`pavement_hammer` が必要とするshared capabilities:

- `SLAM_WAVE_QUERY`
- `KNOCKBACK_VECTOR`
- `BREAK_STAGGER_APPLICATION`
- `STATUS_APPLICATION`

はすべてIMPLEMENTEDになった。

ただしWeapon固有 `PavementHammerPrototypeRuntime` caller proofはまだ無い。

したがって現在のAdmissionは:

`BLOCKED_MISSING_UNITY_CALLER_PROOF`

であり、implementation-review / live registryへは自動昇格しない。

## Executable contract

- `scripts/quality/check-unity-break-stagger-primitive.ts`
- `scripts/quality/unity-break-stagger/UnityBreakStagger.Contract.csproj`
- `scripts/quality/unity-break-stagger/Program.cs`

.NET contractで確認する:

1. sub-threshold accumulation
2. threshold trigger
3. residual gauge
4. exact caller duration
5. invalid input fail closed
6. stagger duration Tick
7. active staggerの非短縮
8. oversized inputのsingle-event semantics
9. Clear / pool reset
10. runtime lazy driver attach
11. normal pursuit suppression
12. stagger中knockback保持
13. z preservation
14. untargetable/death clear

## Live Stage1 boundary

この共有primitiveは **Live Stage1へ自動接続しない**。

`Stage1GameplayRuntimeCoordinator` に:

- `U2EnemyBreakStaggerRuntime`
- `pavement_hammer`

を追加しない。

shared primitive完成だけで `WeaponEffectType`、Web catalog、LevelUp、save、balance、production runtimeを昇格させない。

`runtimeAutoPromotionAllowed = false`

## Next

次のgameplay gateは `PavementHammerPrototypeRuntime`。

そこで初めてWeapon固有callerとして:

- slam-wave target selection
- damage
- EXPOSED application
- knockback
- break/stagger
- explicit application order
- caller-owned prototype tuning
- telemetry

を接続する。

その値は最後まで `PROTOTYPE_TUNING_NOT_CANON` として原本/Canonとは分離する。
