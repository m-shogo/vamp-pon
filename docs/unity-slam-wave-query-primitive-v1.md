# Unity Slam-Wave Query Primitive v1

## Purpose

Selected16 `pavement_hammer`（石畳の小槌）の `SLAM_WAVE` を既存Projectileへ偽装せず実装するため、まず方向性のあるground-wave target queryだけをshared primitiveとして切り出す。

このsliceでは `SLAM_WAVE_QUERY` のみをIMPLEMENTEDへ進める。

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

- `innerRadius = 0` なら、originからouterRadiusまでの一回のdirectional slamとして使える
- `innerRadius / outerRadius` をcaller側で時間とともに前進させれば、伝播する短いground-wave bandとしても使える

primitive自身は時間を持たないため、one-shotとpropagating waveのどちらを採用するかを先に固定しない。

## Deterministic contract

- targetable enemy only
- 2D distance / angle query
- inner/outer radiusは境界を含む
- nearest-first
- equal-distanceはcandidate input orderを保持するstable tie-break
- target capを超えた遠い候補は落とす
- result scratchはcaller-ownedで再利用する
- candidate sourceとresult scratchのaliasは明示的にrejectする

fail closed:

- candidates = null
- maxTargets <= 0
- innerRadius < 0
- outerRadius <= 0
- innerRadius > outerRadius
- half-angle outside 0..180
- zero forward

`innerRadius = 0` かつenemyがoriginと2D同位置の場合は距離条件だけで含める。任意の角度や方向を捏造しない。

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
- wave propagation speed
- wave lifetime
- default range / angle / cap
- VFX / ParticleSystem

`U2EnemyKnockbackRuntime` や `EnemyStatusRuntimeState` にも依存しない。

queryは「誰がsector-band内にいるか」だけを返す。

## Pavement Hammer consumer context

Content Authority:

- ID: `pavement_hammer`
- Name: 石畳の小槌
- Attribute: EARTH
- Status: EXPOSED
- Archetype: `SLAM_WAVE`
- fantasy: 足元を叩き、短い亀裂を扇状に走らせる
- identity: slow close slam + high break/stagger; directional rather than full-circle

このContent identityはconsumer contextであり、generic helperには埋め込まない。

## Caller-proof gate result

このprimitive追加後、`pavement_hammer` のrequired Unity capabilities:

- `SLAM_WAVE_QUERY`: IMPLEMENTED
- `KNOCKBACK_VECTOR`: IMPLEMENTED
- `STATUS_APPLICATION`: IMPLEMENTED

したがってprimitiveとしてはcompleteになる。

しかしSelected16固有callerはまだ実装していないため:

`BLOCKED_MISSING_UNITY_CALLER_PROOF`

で停止する。

これはcaller-proof Admission gateの意図した挙動。

shared primitiveを追加しただけで:

- `ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`
- live registry
- LevelUp pool

へ自動昇格しない。

`runtimeStatus = NOT_IMPLEMENTED` のまま。

## Executable contract

`scripts/quality/unity-slam-wave-query/UnitySlamWaveQuery.Contract.csproj`

real `U2EnemySlamWaveQueryRuntime.cs` を.NET 8で直接compileし、最小Unity/U2 stubs上で実行する。

TEST_ONLY fixtureで確認するもの:

1. inner=2 / outer=6 / half-angle=30° のsector-band
2. non-unit forwardのnormalize
3. inner boundary inclusion
4. outer boundary inclusion eligibility
5. innerより近いtargetを除外
6. outerより遠いtargetを除外
7. cone外 / behind / untargetableを除外
8. nearest-first target cap
9. equal-distance stable input-order tie
10. inner=0で2D coincident targetを扱える
11. zero forward fail closed + scratch clear
12. inner > outer fail closed + scratch clear
13. candidate/result alias reject

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
- break/staggerを実装しない

つまりshared query evidenceだけを増やす。

## Next Selected16 caller proof

次に `PavementHammerPrototypeRuntime` を作る場合も、次をcaller supplied / explicit authorityとして分離する。

1. sector-band queryのinner/outer/angle/cap
2. EXPOSED `EnemyStatusApplicationPolicy`
3. `U2EnemyKnockbackRuntime` のdistance
4. damage
5. break/stagger semanticsと値
6. one-shotかpropagating waveかのtiming ownership

そのcallerを実コード + executable contractで証明して初めて、`pavement_hammer` のimplementation-review Admissionを再判定する。

その後にtelemetry、runtime capture、石畳亀裂のmobile visual readabilityへ進む。
