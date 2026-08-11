# Unity Knockback Vector Primitive v1

## Purpose

Selected16の `bellows_fan`（送り風の扇）と `pavement_hammer`（石畳の小槌）が共有する `KNOCKBACK_VECTOR` を、武器固有実装や数値balanceから切り離した再利用primitiveとして先に実装する。

このprimitiveだけではどちらの武器もUnity implementation-review Admissionへ昇格しない。

- `bellows_fan` は引き続き `CONE_QUERY` がmissing
- `pavement_hammer` は引き続き `SLAM_WAVE_QUERY` がmissing
- admittedは `ember_matchcase` のみ **1 / 16**

## Runtime helper

`U2EnemyKnockbackRuntime`

API:

- `TryApply(U2EnemyActor enemy, Vector2 direction, float distance)`
- `TryApplyFromPoint(U2EnemyActor enemy, Vector3 sourcePosition, float distance)`

契約:

1. targetable enemyだけを対象にする
2. caller supplied方向を2Dでnormalizeする
3. caller supplied distanceだけ瞬間的にpositionへ加算する
4. zは変更しない
5. zero vector / distance<=0 / null / untargetableはfail closed
6. 次の通常enemy Tickから通常追跡へ戻る

## Why displacement, not persistent velocity

最初のshared primitiveでは、以下を勝手に決めない。

- knockback duration
- stun duration
- deceleration curve
- rigidbody mass
- force mode
- resistance係数
- boss倍率
- weapon別距離

永続velocityやstunを持つと、`CONE_PUSH` と `SLAM_WAVE` の個性・balanceをprimitive側で先に凍結してしまう。

そこでv1は **instant displacement only** とする。weapon callerが後からquery結果・weight/boss disposition・prototype distanceを渡せる余地を残す。

Authority:

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## No weapon identity

helperは以下を知らない。

- `bellows_fan`
- `pavement_hammer`
- WIND / EARTH
- DISORIENTED / EXPOSED
- cone angle / slam shape
- damage / break / stagger

そのため同じprimitiveを別の将来weapon/enemy interactionでも再利用できる。

## Live boundary

この変更では:

- `Stage1GameplayRuntimeCoordinator` からhelperを呼ばない
- Web `weapons.ts` へSelected16を追加しない
- Unity U47 importerの `Projectile / GroundArea` executor surfaceを増やさない
- LevelUp poolへ追加しない
- save migrationを作らない
- runtimeStatusを `NOT_IMPLEMENTED` から変えない

つまり `KNOCKBACK_VECTOR = IMPLEMENTED` は **shared primitive evidence** であり、production weapon implementationではない。

## Executable contract

`scripts/quality/unity-knockback-vector/UnityKnockbackVector.Contract.csproj` でruntime helper本体を直接compileし、最小Unity/U2 stub上で実行する。

確認項目:

- `(3,4)` direction + distance 10 => `(6,8)` displacement
- z preservation
- zero vector fail closed
- non-positive distance fail closed
- untargetable enemy fail closed
- null enemy fail closed
- source-point helperは2D outward directionを作る
- sourceとenemyが2D同位置なら任意方向を捏造せずfail closed

## Admission result

primitive count:

- IMPLEMENTED: **6**
- MISSING: **15**

Selected16:

- admitted: **1** (`ember_matchcase`)
- blocked: **15**

Shared knockback実装により、次の最小候補は `CONE_QUERY`。

`CONE_QUERY` を実装しても、すぐ `bellows_fan` をlive化せず、Selected16固有callerで:

- cone filtering
- facing source
- target ordering/cap
- knockback invocation
- DISORIENTED request
- mobile visual readability

を証明してからimplementation-review Admissionを判断する。
