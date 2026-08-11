# Unity Pavement Hammer Prototype v1

Status: `PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE`

## Purpose

Selected16 `pavement_hammer` のUnity caller proofを、既存live Projectile/GroundAreaへ偽装せず実装する。

原本/Canonの数値はこのruntime作業では固定しない。

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## Source

`unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/PavementHammerPrototypeRuntime.cs`

Caller composes existing shared runtime:

- `U2EnemySlamWaveQueryRuntime`
- `EnemyStatusApplicationRequest`
- `U2EnemyKnockbackRuntime`
- `U2EnemyBreakStaggerRuntime`
- `U2EnemyActor.TakeDamage`

Shared primitive側へPavement固有値を逆流させない。

## Explicit application order

`QUERY_DAMAGE_SURVIVING_STATUS_KNOCKBACK_BREAK_STAGGER`

### 1. Query

`U2EnemySlamWaveQueryRuntime.SelectTargets`

caller supplied:

- candidates
- scratch
- origin
- forward
- inner radius
- outer radius
- half angle
- max targets

### 2. Damage

選択targetへcaller supplied damageを適用する。

Damageで倒れたtargetはそこで終了。

### 3. Surviving EXPOSED

生存targetだけtyped:

`EnemyStatusRuntimeKind.Exposed`

を `EnemyStatusApplicationRequest` 経由で適用する。

Status internal cooldownでblockされても他mechanicを止めない。

### 4. Knockback

`U2EnemyKnockbackRuntime.TryApplyFromPoint`

でoriginから外向きにcaller supplied distanceだけ動かす。

### 5. Break / stagger

knockback後に:

`U2EnemyBreakStaggerRuntime.TryApply`

を呼ぶ。

これによりthreshold到達時のstagger freeze anchorはpost-knockback位置になる。

## Caller supplied tuning

Runtime sourceは以下のdefault値を持たない:

- damage
- damage flash duration
- inner / outer radius
- half angle
- max targets
- knockback distance
- break amount
- break threshold
- stagger duration
- EXPOSED duration / stacks / magnitude / cooldown policy

TEST_ONLY contract値はCanonではない。

## Telemetry

`PavementHammerPrototypeTelemetry`

records:

- invocation count
- requested target capacity
- selected target count
- damage attempts
- defeated target count
- Status attempts / applied / internal-cooldown blocked
- knockback attempts / applied / rejected
- break-stagger attempts / applied / rejected
- stagger trigger count

Telemetryはobserverでありmechanic結果を変更しない。

## Executable contract

- `scripts/quality/check-unity-pavement-hammer-prototype.ts`
- `scripts/quality/unity-pavement-hammer/UnityPavementHammer.Contract.csproj`
- `scripts/quality/unity-pavement-hammer/Program.cs`

Real caller + real Status + real slam/knockback/break sourcesを.NET 8でcompileして確認する。

Contract scenarios:

1. directional sector-band nearest-first selection
2. low-HP target is defeated in damage phase
3. defeated target receives no EXPOSED
4. defeated target receives no knockback
5. defeated target receives no break/stagger driver
6. surviving targets receive EXPOSED
7. first TEST_ONLY break application remains sub-threshold
8. second EXPOSED application can be blocked by internal cooldown
9. Status cooldown does not block damage / knockback / break
10. second break application crosses TEST_ONLY threshold
11. residual break is preserved
12. caller stagger duration is preserved
13. knockback happens before stagger anchor
14. telemetry matches observed outcomes
15. invalid caller tuning fails closed and clears scratch

All fixture tuning is `TEST_ONLY / NOT_CANON`.

## Admission

All required shared primitives are IMPLEMENTED and executable caller proof now exists.

Current decision:

`ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

Selected16 summary becomes:

- admitted: 3
- blocked: 13
- admitted callers: `ember_matchcase`, `bellows_fan`, `pavement_hammer`

This does **not** mean live implementation.

`runtimeStatus = NOT_IMPLEMENTED`

## Live boundary

Do not automatically:

- add to Web `weapons.ts`
- add to LevelUp pool
- connect `PavementHammerPrototypeRuntime` from `Stage1GameplayRuntimeCoordinator`
- expand U47 `WeaponEffectType`
- create save migration
- invent Canon balance values
- treat implementation-review Admission as production approval

`runtimeAutoPromotionAllowed = false`

## Original / Canon boundary

このruntime sliceは原本を変更しない。

Weapon name / Attribute / Status / character affinity / transformation graph / story meaningは別Authority。

## Next

次はruntime evidence:

1. actual Unity invocation harness
2. same-run telemetry serialization
3. rendered pavement crack / impact cue
4. break/stagger readability capture
5. mobile target density / edge-of-sector capture
6. evidence-bound human live-admission review

まずcaller proofを本物にし、visual/balanceは後段で別gateにする。
