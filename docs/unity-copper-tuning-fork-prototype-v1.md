# Unity Copper Tuning Fork Prototype v1

Status: `SELECTED16 / CALLER_PROOF_VERIFIED / CAPABILITY_IMPLEMENTED / IMPLEMENTATION_REVIEW_ADMITTED / NOT_LIVE`

## Purpose

Selected16 `copper_tuning_fork` / 銅の音叉の `PULSE_CHAIN` を、shared target-chain selection + caller-owned CONDUCTIVE preference + typed SHOCK/CONDUCTIVEとして実装する。

Authoring Authority:

`TITLE1_SELECTED`

Mechanical identity:

- small radial/short chain
- currently CONDUCTIVE targets preferred through caller-supplied score bonus
- no long stun

## Composition

`CopperTuningForkPrototypeRuntime`

uses:

- `U2EnemyTargetChainSelectionRuntime`
- `EnemyStatusRuntimeKind.Shock`
- `EnemyStatusRuntimeKind.Conductive`
- typed `EnemyStatusApplicationRequest`

Application order:

`PRIORITY_SNAPSHOT_CHAIN_DAMAGE_SURVIVING_SHOCK_THEN_CONDUCTIVE`

## Conductive preference snapshot

Selection前にcallerが全candidateのCONDUCTIVE状態をsnapshotし、effective priorityを作る。

`effectiveScore = basePriorityScore + (currently CONDUCTIVE ? conductivePriorityBonus : 0)`

`conductivePriorityBonus` は caller supplied / NOT_CANON。

- chain全体を選択してからdamage/Statusを適用
- 同pulse中に新規付与されたCONDUCTIVEはそのpulseの後続hop選択をretroactiveに変えない
- generic chain selectorはCONDUCTIVE/SHOCK/Weapon IDを知らない
- bonusは絶対優先ではなくbase scoreとの差で決まる

## Per-hop effect order

1. damage
2. telemetry
3. defeatedなら終了
4. surviving target -> typed SHOCK
5. surviving target -> typed CONDUCTIVE

SHOCK internal cooldownがSHOCK適用をblockしてもdamageとCONDUCTIVE試行は独立。

## Shared chain behavior

`U2EnemyTargetChainSelectionRuntime` owns only caller candidates/scores, first origin/range, hop distance, max target count, local re-anchor, priority/tie rules and duplicate exclusion。

It owns no Weapon / Status / damage / cadence / VFX meaning.

## Caller-supplied tuning

固定しない:

- base priority scores / CONDUCTIVE bonus
- first range / hop distance / max targets
- damage / damage flash
- SHOCK / CONDUCTIVE duration, stacks, magnitude, cooldown

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## Executable proof

- `scripts/quality/unity-copper-tuning-fork/UnityCopperTuningFork.Contract.csproj`
- `scripts/quality/unity-copper-tuning-fork/Program.cs`

Verified:

- sufficient CONDUCTIVE bonus beats higher unmarked base score
- insufficient bonus is not absolute override
- local hop re-anchor / distance limit
- surviving target receives SHOCK then CONDUCTIVE
- defeated target receives neither Status
- SHOCK cooldown does not block damage or CONDUCTIVE
- new CONDUCTIVE does not alter same-pulse chain selection
- invalid range / score mismatch / maxTargets / damage fail closed
- telemetry reset

All fixture values are NOT_CANON.

## Admission state

Shared chain foundation + this executable Selected16 caller proof are green, therefore:

`TARGET_CHAIN_SELECTION = IMPLEMENTED`

and `copper_tuning_fork` caller proof is registered.

Current decision:

`ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

Still:

`runtimeStatus = NOT_IMPLEMENTED`

## Live boundary

No automatic Web live catalog / LevelUp / `Stage1GameplayRuntimeCoordinator` / U47 executor / save migration / final chain VFX/SFX / production balance。

`runtimeAutoPromotionAllowed = false`
