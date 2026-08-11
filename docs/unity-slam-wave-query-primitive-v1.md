# Unity Slam-Wave Query Primitive v1

## Purpose

Selected16 `pavement_hammer`（石畳の小槌）の `SLAM_WAVE` を既存Projectileへ偽装せず実装するため、方向性のあるground-wave target queryだけをshared primitiveとして切り出す。

このprimitiveが所有するのは `SLAM_WAVE_QUERY` のみ。

`pavement_hammer` 固有caller、EXPOSED、damage、break/stagger application、knockback、wave timing、VFXはこのquery primitiveへ入れない。

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

`U2EnemyKnockbackRuntime`、`U2EnemyBreakStaggerRuntime`、`EnemyStatusRuntimeState` に依存しない。

queryは「sector-band内のtargetは誰か」だけを返す。

## Pavement Hammer consumer context

Content Authorityはこのruntime資料では変更しない。

既存consumer requirements:

- `SLAM_WAVE_QUERY`
- `KNOCKBACK_VECTOR`
- `BREAK_STAGGER_APPLICATION`
- `STATUS_APPLICATION`

現在は4つともshared runtime evidenceが **IMPLEMENTED**。

`BREAK_STAGGER_APPLICATION` の実体は:

- `U2EnemyBreakStaggerState`
- `U2EnemyBreakStaggerDriver`
- `U2EnemyBreakStaggerRuntime`

に分離され、HPとは独立した蓄積、caller threshold、residual gauge、caller stagger duration、pursuit suppression、pool reset、knockback displacement preservationを持つ。

詳細:

`docs/unity-break-stagger-primitive-v1.md`

## Admission after break/stagger foundation

`pavement_hammer` はshared primitiveとしてはcompleteになった。

ただし `PavementHammerPrototypeRuntime` caller proofはまだ無い。

現在のdecision:

`BLOCKED_MISSING_UNITY_CALLER_PROOF`

つまり:

- query実装済み
- knockback実装済み
- break/stagger実装済み
- Status実装済み
- Weapon固有callerは未実装
- implementation-review Admissionは未昇格
- Live Stage1は未接続

primitive completenessだけでWeaponをruntimeへ押し込まない。

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

Break/Staggerは別contractで直接検証する:

`scripts/quality/unity-break-stagger/UnityBreakStagger.Contract.csproj`

## Live Stage1 boundary

このshared primitive群は:

- `Stage1GameplayRuntimeCoordinator` から自動で呼ばない
- `pavement_hammer` をWeb `weapons.ts` へ追加しない
- U47 `WeaponEffectType` を増やさない
- LevelUp poolへ追加しない
- save migrationを作らない
- EXPOSED / knockback / break-staggerのWeapon tuningをgeneric queryへ埋め込まない

`Live Stage1` はcaller proofと別review gateの後。

## Next gate

次は `PavementHammerPrototypeRuntime` caller proof。

そこでWeapon固有に:

1. sector-band target selection
2. damage
3. EXPOSED application
4. knockback
5. break/stagger
6. explicit application order
7. caller-owned telemetry

を接続する。

数値は **PROTOTYPE_TUNING_NOT_CANON** として原本/Canonから分離し、caller proof完成後もlive registryへは自動昇格しない。
