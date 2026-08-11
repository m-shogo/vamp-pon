# Unity Multi-target Projectile Primitive v1

## Purpose

Selected16 `SCATTER_PROJECTILE` / priority projectile系の共通土台として、複数のtargetable enemyへ既存Projectileを発射できるprimitiveを追加する。

最初のreal候補は `ember_matchcase` だが、このPRではまだCandidateをlive登録しない。

現在:

- target指定Projectile spawn = 実装済み
- typed Status request transport = 実装済み
- **multi-target nearest selection = このPR**
- real Selected16 caller = まだ0

## reusable scratch

hot pathで毎回`new List`しない。

controller-owned:

`nearestEnemyTargetScratch`

を再利用する。

enemy pool callbackも一度作った後は:

`collectTargetableEnemyAction`

として再利用する。

## Target filtering

poolから候補へ入れる条件:

- enemy != null
- `enemy.IsTargetable`

のみ。

poolの各entryを一度だけ追加するので同じenemyを重複targetにしない。

**distinct** targetを前提にする。

## deterministic nearest prefix

全targetをfull sortしない。

callerの`maxTargets`分だけselectionするpartial nearest pass。

比較は:

1. playerからの**squared distance**
2. 距離が同値ならUnity **instance ID**

の順。

これで同じframe/stateなら順序を**deterministic**にする。

`maxTargets`よりenemyが少なければ存在する分だけ。

`maxTargets <= 0`なら0発。

## Projectile spawn reuse

選ばれたenemyごとに:

`FireGameplayProjectileAtTarget(...)`

を呼ぶ。

つまりmulti-target専用の別Projectile pool/classを作らない。

引き継ぐ:

- damage
- pierce
- speed
- lifetime
- optional `EnemyStatusApplicationRequest`

## Performance boundary

shot hot pathで使わない:

- LINQ
- `OrderBy`
- `ToList`
- 毎回`new List`
- full `.Sort()`

small `maxTargets`向けのpartial selectionを採用する。

現時点ではenemy pool全体を一度走査する。実機profileで敵数増加時に必要ならspatial queryへ置換するが、API boundaryは維持できる。

## live caller = 0

current `Stage1GameplayRuntimeCoordinator`は引き続き:

`battle.FireGameplayProjectile(damage, effect.pierce)`

だけを使用。

このPRでは:

`FireGameplayProjectilesAtNearestTargets`

をlive callしない。

したがってSelected16 admissionはまだ0/16。

## U47 evidence

multi-target primitiveは今はunreachable。

historical **U47 evidence** normalizerは追加したscratch/method blockだけをexactに除外する。

live coordinator call-siteは除外しない。

将来:

`battle.FireGameplayProjectilesAtNearestTargets(...)`

を実Weaponが呼び始めたらfingerprintが変わり、新capture/evidenceが必要。

## What this still does not implement

- scatterの発射本数の実balance値
- projectile angle/spread art direction
- real BURN duration/stack/magnitude/cooldown
- `ember_matchcase` runtime definition
- visual cue
- audio/haptic
- mobile capture

## ember_matchcase next step

`ember_matchcase` は:

- archetype: SCATTER_PROJECTILE
- Status: BURN

なので、ここまでのprimitiveで:

1. distinct multi-target selection
2. canonical target projectile spawn
3. typed Status request
4. enemy Status state

まで揃った。

次はCandidate専用のprototype runtime definitionを作り、BURN policy数値を**prototype tuning**として明示したうえでlive vertical sliceへ接続する。

live callerを作るPRではhistorical U47 normalizationを使い続けず、新しいruntime evidenceへ更新する。
