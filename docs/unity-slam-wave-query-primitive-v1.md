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

## Pavement Hammer consumer

Content Authorityはこのruntime資料では変更しない。

既存consumer requirements:

- `SLAM_WAVE_QUERY`
- `KNOCKBACK_VECTOR`
- `BREAK_STAGGER_APPLICATION`
- `STATUS_APPLICATION`

4つともshared runtime evidenceはIMPLEMENTED。

さらにSelected16固有caller:

`PavementHammerPrototypeRuntime`

が実装され、queryをgenericのままconsumer側で合成する。

Caller application order:

`QUERY_DAMAGE_SURVIVING_STATUS_KNOCKBACK_BREAK_STAGGER`

1. `U2EnemySlamWaveQueryRuntime.SelectTargets`
2. caller supplied damage
3. surviving target only: typed EXPOSED
4. `U2EnemyKnockbackRuntime.TryApplyFromPoint`
5. `U2EnemyBreakStaggerRuntime.TryApply`
6. caller-owned telemetry

Generic queryへWeapon identityや数値を逆流させない。

## Admission after caller proof

`pavement_hammer` は:

- all required shared primitives complete
- executable Selected16 caller proof complete

になったため現在のdecisionは:

`ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

ただしこれはlive admissionではない。

- `runtimeStatus = NOT_IMPLEMENTED`
- Web live catalog未接続
- Stage1GameplayRuntimeCoordinator未接続
- LevelUp未接続
- U47 executor未拡張

caller proof完成後もlive registryへは自動昇格しない。

## Executable contracts

Shared query:

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

Pavement caller integration:

`scripts/quality/unity-pavement-hammer/UnityPavementHammer.Contract.csproj`

- query order
- damage-death short circuit
- EXPOSED
- independent internal cooldown
- knockback
- break accumulation
- stagger threshold
- residual gauge
- telemetry
- invalid caller tuning

をreal caller/shared sourceで検証する。

fixture数値は **TEST_ONLY / NOT_CANON**。

## Live Stage1 boundary

このshared primitive / prototype callerは:

- `Stage1GameplayRuntimeCoordinator` から自動で呼ばない
- `pavement_hammer` をWeb `weapons.ts` へ追加しない
- U47 `WeaponEffectType` を増やさない
- LevelUp poolへ追加しない
- save migrationを作らない
- EXPOSED / knockback / break-staggerのWeapon tuningをgeneric queryへ埋め込まない

`Live Stage1` はruntime evidenceとhuman live-admission reviewの後。

## Next gate

Caller proof後の次はruntime evidence。

1. rendered slam-wave capture
2. break/stagger readability
3. EXPOSED / knockback / stagger telemetryとrendered evidenceの同一run binding
4. mobile pavement-crack visual cue
5. human live-admission review

数値は **PROTOTYPE_TUNING_NOT_CANON** として原本/Canonから分離する。
