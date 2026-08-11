# Unity U2EnemyActor Status Ownership v1

## Purpose

Wave Aの第二歩として、既存pool enemy `U2EnemyActor` が共通 `EnemyStatusRuntimeState` を一つ所有する。

このPRは**ownership-only**。

- Weapon hit → Apply はまだつながない
- slow / DoT / chain / damage amplificationもまだ適用しない
- Selected16のUnity admissionはまだ **admitted=0**
- `STATUS_APPLICATION` blockerもまだ残す

狙いは、次のhit wiringを安全に入れるためにenemy lifecycleへStatus stateを先に接続すること。

## U2EnemyActor lifecycle

### Activate

poolから再利用される時に:

1. `statusState.Clear()`
2. HP / visual / death state reset
3. active化

の順にする。

前のenemy instanceのStatusが次のspawnへ漏れない。

### Tick

`U2EnemyActor.Tick(...)` の先頭で:

`statusState.Tick(deltaTime)`

を呼ぶ。

これによりStatus duration / reapply cooldownがenemy自身のlifecycleと同じ時間で進む。

死亡animation中もStatus lifecycleは停止させず、最終的にDeactivateでClearする。

### Deactivate

`U2EnemyActor` が `U2PooledActor.Deactivate()` をoverrideし:

1. `statusState.Clear()`
2. `base.Deactivate()`

を実行する。

通常death completionとrun resetの両方が同じclear pathを通る。

## Existing pool paths

既存spawn:

`enemy.Activate(position, config.enemyHp)`

既存run reset:

`enemies.ForEach(actor => actor.Deactivate())`

既存death completion:

`if (spriteAnimator.DeathComplete) Deactivate()`

を維持するため、別のStatus cleanup systemを増やさず既存pool lifecycleへ乗せる。

## Public surface

U2EnemyActorは:

- `Statuses`
- `ActiveStatusCount`

を公開する。

`Statuses` は次PRのgeneric application requestから利用する。

`ActiveStatusCount` はverification / telemetry用の低コストread surface。

## U47 evidence boundary

通常CIのU47 simulator manifestは `U2BattleController.cs` をsource fingerprintへ含むため、ownership-onlyの12行追加でもstale判定になった。

ここでmanifestのfingerprintだけを書き換えたり、古いcaptureを新runtimeの証拠として再登録することはしない。

今回の変更は:

- Status Applyなし
- movement modifierなし
- damage modifierなし
- projectile hit変更なし
- GroundArea hit変更なし

であり、既存U47 captureが検証しているbattle behaviorを変えない。

そのため `u47-simulator-evidence-sources.ts` の既存normalization方式を使い、**このownership-only差分だけ**をexact anchorで正規化してhistorical **U47 evidence** のfingerprintを維持する。

normalizerが除外してよいのは:

- Status namespace import
- state field / read surface
- Activate時Clear
- Tick時lifecycle Tick
- Deactivate時Clear

だけ。

将来の:

- `Statuses.Apply(...)`
- projectile hit変更
- damage path変更
- movement/Status semantics

はnormalizerで隠してはいけない。そこへ進んだ時点では**再capture**または新しいevidence更新が必要になる。

## What this does not do

まだ実装しない:

- `Statuses.Apply(...)` をWeapon projectileから呼ぶ
- GroundAreaからStatus付与
- BURN damage tick
- CHILL speed modifier
- FREEZE pause
- ROOTED movement stop/slow
- SHOCK chain
- CONDUCTIVE interaction
- EXPOSED damage modifier
- DROWSY / SLEEP action cadence
- MARKED targeting
- ECLIPSED / ERASED / SEALED / DISORIENTED effect semantics
- VFX

つまりstateは「存在して時間が進む」だけ。

## Admission boundary

ownershipだけでは `STATUS_APPLICATION` をIMPLEMENTEDにしない。

必要なのは次の段階:

1. typed Status application request
2. projectile / area hitからrequestを渡す
3. U2EnemyActor.Statuses.Applyへ接続
4. at least one real Selected16 Weaponのhit evidence
5. simulator / regression evidence

そのため現時点は:

- Selected16 Unity admitted = 0
- Selected16 Unity blocked = 16
- STATUS_APPLICATION blocked = 16

が正しい。

## Next

次は **hit → Apply request**。

最初から16Weaponを個別実装せず:

- content Status ID
- duration
- stackDelta
- maxStacks
- reapplyCooldown

を持つ共通requestを作り、Projectile / GroundArea executorからenemyへ渡せるようにする。

数値は最初のvertical slice weaponだけに閉じ、全Status tuningを一度にfreezeしない。
