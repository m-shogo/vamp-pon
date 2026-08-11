# Unity Returning Projectile Primitive v1

Status: `IMPLEMENTED_SHARED_MOTION_PRIMITIVE / NOT_LIVE / NOT_CANON_TUNING`

## Purpose

Selected16のRETURNING_THROW / RETURN_HOMING系を通常Projectileへ偽装せず、outboundからreturnへ切り替わるmotion stateをshared runtimeとして提供する。

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## Source

`unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2ReturningProjectileMotionRuntime.cs`

Main pieces:

- `U2ReturningProjectilePhase`
- `U2ReturningProjectileStepResult`
- `U2ReturningProjectileMotionState`

## Motion contract

Phase:

1. `Inactive`
2. `Outbound`
3. `Returning`
4. `Complete`

`TryBegin(outboundTarget)` で開始する。

`TryStep(...)` のcaller inputs:

- current projectile position
- current return anchor
- speed
- delta seconds
- arrival distance

return anchorは毎step渡すため、player/ownerが移動しても最新位置へ戻れる。

## Important behavior

### Travel budget conservation

1 frameでoutbound targetを通過した場合、target到達までに使わなかった移動量をreturn legへ引き継ぐ。

turnaround frameで速度が消えたり二重移動したりしない。

### Dynamic return anchor

Begin時のoriginを固定保存しない。

Returning中は毎stepのcaller supplied return anchorへ向かう。

### 2D gameplay / z preserve

movement distanceはXY平面。

projectileのzは現在値を保持する。

### Completion

return anchorへarrival distance内で到達すると`Complete`。

Complete後はReset/Beginまでstepを拒否する。

## Shared primitive non-ownership

持たないもの:

- weapon ID
- damage
- Status
- target selection
- projectile spawn/pool
- hit count
- pierce
- outbound/return VFX
- owner/player lookup
- Canon speed/range/lifetime

callerが既存pool/projectileと合成する。

## Executable contract

- `scripts/quality/unity-returning-projectile/UnityReturningProjectile.Contract.csproj`
- `scripts/quality/unity-returning-projectile/Program.cs`

TEST_ONLY cases:

- outbound movement
- turnaround
- same-frame remaining travel budget on return
- moving return anchor
- XY motion / z preservation
- completion
- reset/reuse
- arrival tolerance
- invalid target/speed/delta/anchor/tolerance fail closed

TEST_ONLY values are `NOT_CANON`.

## Runtime admission boundary

このPRではshared motion implementationを先に証明する。

Title1 admission overlayの`RETURNING_PROJECTILE`登録とSelected16 caller proofは別gateで行う。

候補consumer例:

- `return_compass_needle`
- RETURNING_THROW archetype entries

ただしshared motionが存在するだけでcaller/liveへ自動昇格しない。

## Live boundary

禁止:

- live `U2ProjectileActor`へ武器固有分岐を埋め込む
- Web catalog追加
- LevelUp追加
- U47 executor enumの名前だけ追加
- save migration
- Canon speed/range/lifetime作成
- production VFX claim

`runtimeAutoPromotionAllowed = false`

## Next

1. Title1 runtime capability overlayへ`RETURNING_PROJECTILE=IMPLEMENTED`を登録
2. returning consumerのcaller proof
3. existing projectile poolとreturn motionのruntime evidence
4. return-path readability / mobile capture
5. human live-admission review
