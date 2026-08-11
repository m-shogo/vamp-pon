# Unity Slam-Wave Query Primitive v1

## Purpose

Selected16 `pavement_hammer`（石畳の小槌）の `SLAM_WAVE` を既存Projectileへ偽装せず実装するため、方向性のあるground-wave target queryだけをshared primitiveとして切り出す。

このsliceでIMPLEMENTEDになったのは `SLAM_WAVE_QUERY` のみ。

`pavement_hammer` 固有caller、EXPOSED、damage、break/stagger、knockback、wave timing、VFXはこのprimitiveへ入れない。

## Shape: directional sector-band

`U2EnemySlamWaveQueryRuntime.SelectTargets(...)`

caller supplied:

- candidates
- result scratch
- origin
- forward
- `innerRadius`
- `outerRadius`
- half-angle degrees
- max target count

query shapeは **sector-band**。

- `innerRadius = 0` ならoriginからouterRadiusまでの一回のdirectional slamとして使える
- caller側でinner/outerを前進させれば、propagating ground-wave bandにも使える

primitive自身は時間を持たないため、one-shot / propagatingのどちらを採用するかを先に固定しない。

## Deterministic contract

- targetable enemy only
- 2D distance / angle query
- inner/outer boundary inclusive
- nearest-first
- equal-distanceはcandidate input orderを保持するstable tie-break
- target cap
- caller-owned result scratch
- candidate/result alias reject

fail closed:

- candidates = null
- maxTargets <= 0
- innerRadius < 0
- outerRadius <= 0
- innerRadius > outerRadius
- half-angle outside 0..180
- zero forward

`innerRadius = 0` かつenemyがoriginと2D同位置の場合は距離条件だけで含め、任意の角度を捏造しない。

## Balance boundary

Authority:

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

このprimitiveは以下を持たない:

- Weapon ID
- EARTH attribute
- EXPOSED Status
- damage
- break value
- stagger value
- knockback distance
- Status policy
- cooldown
- cast/windup duration
- wave propagation speed / lifetime
- default range / angle / cap
- VFX / ParticleSystem

`U2EnemyKnockbackRuntime` や `EnemyStatusRuntimeState` にも依存しない。

queryは「sector-band内のtargetは誰か」だけを返す。

## Pavement Hammer consumer context

Content Authority:

- ID: `pavement_hammer`
- Name: 石畳の小槌
- Attribute: EARTH
- Status: EXPOSED
- Archetype: `SLAM_WAVE`
- fantasy: 足元を叩き、短い亀裂を扇状に走らせる
- identity: slow close slam + **high break/stagger**; directional rather than full-circle

このContent identityはconsumer contextであり、generic helperには埋め込まない。

## Deeper audit: break/stagger is a real missing primitive

`SLAM_WAVE_QUERY` 実装直後は、既存Admission要件だけを見ると `pavement_hammer` がprimitive-completeに見えた。

その後 `U2EnemyActor` とruntime全体を再監査したところ:

- HP damage APIはある
- Status stateはある
- knockback primitiveはある
- **break gauge / stagger gauge / poise / break-stagger application APIは存在しない**

ことを確認した。

石畳の小槌のmechanical identityには `high break/stagger` が明記されているため、この欠落を無視してcallerだけ作ると「見た目だけSLAM_WAVE」の偽物になり得る。

そこでAdmission capabilityを追加した:

`BREAK_STAGGER_APPLICATION = MISSING`

現在の `pavement_hammer` required capabilities:

- `SLAM_WAVE_QUERY`: IMPLEMENTED
- `KNOCKBACK_VECTOR`: IMPLEMENTED
- `BREAK_STAGGER_APPLICATION`: **MISSING**
- `STATUS_APPLICATION`: IMPLEMENTED

したがって現在のdecisionは:

`BLOCKED_MISSING_UNITY_PRIMITIVES`

であり、caller-proof gateへ進む前にbreak/staggerのshared runtime semanticsが必要。

この訂正は #194 のsector-band query自体を否定しない。**queryは正しいが、Weapon Admission要件が1つ不足していた**という監査修正。

## Executable contract

`scripts/quality/unity-slam-wave-query/UnitySlamWaveQuery.Contract.csproj`

real `U2EnemySlamWaveQueryRuntime.cs` を.NET 8で直接compileし、最小Unity/U2 stubs上で実行する。

TEST_ONLY fixtureで確認するもの:

1. inner=2 / outer=6 / half-angle=30° sector-band
2. non-unit forward normalize
3. inner / outer boundary behavior
4. too-near / too-far / cone外 / behind / untargetable exclusion
5. nearest-first target cap
6. equal-distance stable input-order tie
7. inner=0 coincident target
8. zero forward fail closed + scratch clear
9. inner > outer fail closed + scratch clear
10. candidate/result alias reject

fixture数値は **TEST_ONLY / NOT_CANON**。

## Live Stage1 boundary

このsliceでは:

- `Stage1GameplayRuntimeCoordinator` から呼ばない
- `pavement_hammer` をWeb `weapons.ts` へ追加しない
- U47 `WeaponEffectType` を増やさない
- LevelUp poolへ追加しない
- save migrationを作らない
- EXPOSEDを適用しない
- knockbackを適用しない
- break/staggerを捏造しない

つまりshared query evidenceだけを増やす。

## Next gate

次は `PavementHammerPrototypeRuntime` を先に作るのではなく、まず **BREAK_STAGGER_APPLICATIONのruntime semantics** を設計・実装する。

最低限決める必要があるのは:

1. break/staggerがHPとは別meterなのか
2. threshold到達時の結果
3. boss / elite resistance
4. repeated-hit蓄積と回復
5. hard-control Statusとの境界
6. damage / EXPOSED / knockbackとの適用順序
7. pool reset / telemetry

これらをCanon balance値と分離したshared primitiveとして証明してから、`pavement_hammer` caller proofへ進む。
